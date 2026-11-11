import re
import faiss
import numpy as np
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Optional
from sentence_transformers import SentenceTransformer
import json
from pathlib import Path
import logging
from functools import lru_cache
import os
from whoosh.fields import Schema, TEXT, ID
from whoosh.index import create_in, open_dir
from whoosh.analysis import StandardAnalyzer
from whoosh.qparser import QueryParser
from docx import Document 
import PyPDF2 

# Configuração de logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class SearchQuery(BaseModel):
    query: str
    category: Optional[str] = None
    top_k: Optional[int] = 3

class SearchResult(BaseModel):
    title: str
    relevance_score: float
    snippets: List[str]
    category: Optional[str]

class SemanticSearch:
    def __init__(self, model_path: str = 'custom_model', index_dir: str = "indexdir"):
        """
        Inicializa o serviço de busca com o modelo treinado e índice Whoosh.
        
        Args:
            model_path: Caminho para o modelo treinado
            index_dir: Diretório do índice Whoosh
        """
        try:
            self.model = SentenceTransformer(model_path)
            logger.info(f"Modelo carregado com sucesso de: {model_path}")
            
            # Configuração do Whoosh
            self.index_dir = index_dir
            self.schema = Schema(
                title=ID(stored=True),
                content=TEXT(stored=True, analyzer=StandardAnalyzer())
            )
            
            # Inicializa ou abre o índice Whoosh
            if not os.path.exists(index_dir):
                os.mkdir(index_dir)
                self.index = create_in(index_dir, self.schema)
            else:
                self.index = open_dir(index_dir)
            
            # Carrega dados de treinamento para referência de categorias
            training_data_path = Path(model_path) / "training_data.json"
            if training_data_path.exists():
                with open(training_data_path, "r", encoding="utf-8") as f:
                    self.training_data = json.load(f)
                  #  self.categories = self._extract_categories()
                #logger.info(f"Dados de treinamento carregados com {len(self.categories)} categorias")
            else:
                self.training_data = []
              #  self.categories = set()
                logger.warning("Arquivo de dados de treinamento não encontrado")
            
            # Inicializa o cache de embeddings
            self._document_embeddings_cache = {}
            
        except Exception as e:
            logger.error(f"Erro ao inicializar o serviço de busca: {str(e)}")
            raise

    def _get_sample_documents(self, category: Optional[str] = None) -> List[Dict]:
        """
        Obtém documentos do índice Whoosh.
        
        Args:
            category: Categoria opcional para filtrar resultados
            
        Returns:
            Lista de documentos encontrados
        """
        try:
            with self.index.searcher() as searcher:
                query_parser = QueryParser("content", schema=self.schema)
                
                # Se houver categoria, usamos ela na busca
                if category:
                    query = query_parser.parse(f"category:{category}")
                else:
                    # Busca todos os documentos
                    query = query_parser.parse("*")
                
                results = searcher.search(query, limit=None)
                
                documents = []
                for result in results:
                    doc = {
                        "title": result["title"],
                        "content": result["content"],
                    }
                    documents.append(doc)
                
                return documents
                
        except Exception as e:
            logger.error(f"Erro ao buscar documentos no Whoosh: {str(e)}")
            return []

    # @staticmethod
    def read_file_with_encoding(self, file_path):
        """Tenta ler o arquivo em UTF-8 e, caso falhe, em Latin-1."""
        encodings = ['utf-8', 'latin-1']
        for encoding in encodings:
            try:
                with open(file_path, 'r', encoding=encoding) as f:
                    return f.read()
            except UnicodeDecodeError:
                continue
        raise ValueError(f"Não foi possível ler o arquivo {file_path} com as codificações suportadas.")
    
    def read_docx(self, file_path):
        """Lê o conteúdo de um arquivo DOCX."""
        try:
            doc = Document(file_path)
            return ' '.join([paragraph.text for paragraph in doc.paragraphs])
        except Exception as e:
            raise ValueError(f"Erro ao ler arquivo DOCX {file_path}: {str(e)}")
    
    def read_pdf(self, file_path):
        """Lê um arquivo PDF e retorna o seu conteúdo."""
        try:
            with open(file_path, 'rb') as pdf_file:
                pdf_reader = PyPDF2.PdfFileReader(pdf_file)
                return "\n".join([pdf_reader.getPage(page_num).extractText() for page_num in range(pdf_reader.numPages)])
        except Exception as e:
            raise ValueError(f"Erro ao ler o arquivo PDF {file_path}: {str(e)}")


    def index_document(self, file_path):
        """
        Indexa um único documento no Whoosh.
        
        Args:
            file_path: Caminho do arquivo a ser indexado
        """
        try:
            content = None
            if file_path.endswith(".txt"):
                content = self.read_file_with_encoding(file_path)
            elif file_path.endswith(".docx"):
                content = self.read_docx(file_path)
            elif file_path.endswith(".pdf"):
                content = self.read_pdf(file_path)


            """Se o content não estiver vazio ele indexar os documentos"""
            if content is not None:
                # Adiciona o documento ao índice Whoosh
                writer.add_document(title=os.path.basename(file_path), content=content)
                print(f"Documento '{file_path}' indexado com sucesso.")
                writer.commit()
        except:
            write.cancel()
            print(f"Erro ao indexar o documento '{file_path}'.")
    def _encode_query(self, query: str) -> np.ndarray:
        """
        Codifica a consulta em embedding com cache.
        """
        return self.model.encode([f"consulta: {query}"]).astype('float32')

    def _get_document_embeddings(self, documents: List[str]) -> np.ndarray:
        """
        Obtém embeddings para documentos com cache.
        """
        embeddings = []
        for doc in documents:
            if doc not in self._document_embeddings_cache:
                self._document_embeddings_cache[doc] = self.model.encode([doc]).astype('float32')
            embeddings.append(self._document_embeddings_cache[doc])
        return np.vstack(embeddings)

    def search_documents(self, query: SearchQuery) -> List[SearchResult]:
        """
        Realiza busca semântica usando o modelo treinado.
        """
        try:
            # Valida categoria se especificada
            if query.category and query.category not in self.categories:
                raise HTTPException(
                    status_code=400,
                    detail=f"Categoria '{query.category}' não encontrada. Categorias disponíveis: {list(self.categories)}"
                )

            # Carrega os documentos indexados com o Whoosh
            documents = self._get_sample_documents(query.category)
            
            if not documents:
                return []

            # Gera embedding da consulta
            query_embedding = self._encode_query(query.query)
            
            # Gera embeddings dos documentos
            document_embeddings = self._get_document_embeddings([doc["content"] for doc in documents])

            # Cria índice FAISS
            dimension = document_embeddings.shape[1]
            index = faiss.IndexFlatL2(dimension)
            index.add(document_embeddings)

            # Realiza a busca
            k = min(query.top_k, len(documents))
            D, I = index.search(query_embedding, k)

            # Prepara resultados
            results = []
            for rank, (idx, distance) in enumerate(zip(I[0], D[0])):
                doc = documents[idx]
                relevant_phrases = self._extract_relevant_phrases(doc["content"], query.query)
                # relevant_phrases = SemanticSearch._extract_relevant_phrases(doc["content"], query.query)
                
                result = SearchResult(
                    title=doc["title"],
                    relevance_score=round(float(1 / (distance + 1)), 4),
                    snippets=relevant_phrases,
                    category=doc.get("category")
                )
                results.append(result)

            return results

        except Exception as e:
            logger.error(f"Erro durante a busca: {str(e)}")
            raise HTTPException(status_code=500, detail=str(e))

    
    def _extract_relevant_phrases(self, content: str, query: str, top_n: int = 3) -> List[str]:
        """
        Extrai frases relevantes do conteúdo com base na consulta.
        """
        sentences = re.split(r'(?<=[.!?]) +', content)
        query_words = query.lower().split()
        
        scored_sentences = []
        for sentence in sentences:
            score = sum(1 for word in query_words if word.lower() in sentence.lower())
            if score > 0:
                scored_sentences.append((sentence.strip(), score))
        
        scored_sentences.sort(key=lambda x: x[1], reverse=True)
        return [sentence for sentence, score in scored_sentences[:top_n]]
# API de busca
app = FastAPI(title="Serviço de Busca Semântica")

# Instancia o serviço de busca

semantic_search = SemanticSearch()
@app.post("/search", response_model=List[SearchResult])
async def search_documents(query: SearchQuery):
    """
    Realiza busca semântica nos documentos.
    
    - **query**: Texto da consulta
    - **category**: Categoria opcional para filtrar resultados
    - **top_k**: Número máximo de resultados (padrão: 3)
    """
    return semantic_search.search_documents(query)

@app.post("/index")
async def index_document(file_path: str):
    """
    Indexa um novo documento.
    
    - **file_path**: Caminho do arquivo a ser indexado
    """
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail=f"Arquivo {file_path} não encontrado")
    
    try:
        semantic_search.index_document(file_path)
        return {"message": f"Documento {file_path} indexado com sucesso"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/categories")
async def get_categories():
    """
    Retorna as categorias disponíveis para busca.
    """
   # return {"categories": list(semantic_search.categories)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.2", port=8002)