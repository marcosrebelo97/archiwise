import os
import re
import numpy as np
from whoosh.index import open_dir
from whoosh.qparser import MultifieldParser
from whoosh.scoring import BM25F, TF_IDF
from whoosh.highlight import ContextFragmenter

# from sklearn.feature_extraction.text import TfidfVectorizer
from pydantic import BaseModel
from service.index import DocumentIndexer
class SearchQuery(BaseModel):
    query: str

class DocumentSearcher:
    def __init__(self, index_dir="indexdir"):
        """Inicializa o buscador de documentos."""
        self.index_dir = index_dir

    def get_index(self): return open_dir(self.index_dir)

    def get_indexer_search(self, user_id):
        """Retorna um índice para um usuário específico."""
        user_id_index = os.path.join("uploads", user_id, "indexdir")
        return DocumentSearcher(index_dir=user_id_index)

    def extract_relevant_phrases(self, content, query, top_n=5):
        """
        Extrai trechos relevantes do conteúdo que contenham os termos da busca.
        """
        sentences = re.split(r'(?<=[.!?]) +', content)
        query_words = query.lower().split()

        # Filtra frases que contenham todas as palavras da busca
        full_phrase_matches = [
            sentence.strip() for sentence in sentences
            if all(word.lower() in sentence.lower() for word in query_words)
        ]

        # Se não houver frases com todas as palavras, filtra frases com pelo menos uma palavra
        if not full_phrase_matches:
            full_phrase_matches = [
                sentence.strip() for sentence in sentences
                if any(word.lower() in sentence.lower() for word in query_words)
            ]

        return full_phrase_matches[:top_n]

    def search_documents_bm25(self, query):
        """
        Realiza a busca usando BM25 no índice Whoosh.
        """
        ix = self.get_index()

        with ix.searcher(weighting=BM25F()) as searcher:
            parser = MultifieldParser(["title", "content"], schema=ix.schema)
            parsed_query = parser.parse(query)

            results = searcher.search(parsed_query, limit=5)
            whoosh_results = []

            for hit in results:
                whoosh_results.append({
                    "id": hit["id"],
                    "title": hit["title"],
                    "content": hit["content"],
                    "bm25_score": hit.score
                })

        return whoosh_results

    def search_documents_tfidf(self, query, whoosh_results):
        """Reordena os documentos usando o modelo vetorial TF-IDF do Whoosh."""
        if not whoosh_results:
            return [{"message": "Nenhum resultado encontrado."}]

        ix = self.get_index()
        with ix.searcher(weighting=TF_IDF()) as searcher:
            parser = MultifieldParser(["title", "content"], schema=ix.schema)
            parsed_query = parser.parse(query)

            results = searcher.search(parsed_query, limit=5)
            tfidf_results = []
            results.fragmenter = ContextFragmenter(maxchars=200, surround=30)  # 200 caracteres por trecho

            for hit in results:
#                 relevant_phrases = self.extract_relevant_phrases(hit["content"], query)
                highlighted_snippets = hit.highlights("content", top=4)  # Máximo de 4 trechos

                tfidf_results.append({
                    "id": hit["id"],
                    "title": hit["title"],
                    "relevance_score": round(hit.score, 4),
                    "snippets": highlighted_snippets  # Retorna trechos já destacados
                })

        return tfidf_results