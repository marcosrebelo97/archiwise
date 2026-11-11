import os
import re
from fastapi import FastAPI
from pydantic import BaseModel
from whoosh.index import open_dir
from whoosh.qparser import MultifieldParser
from sklearn.feature_extraction.text import TfidfVectorizer
import numpy as np

app = FastAPI()

class SearchQuery(BaseModel):
    query: str

def get_index(index_dir="indexdir"):
    if not os.path.exists(index_dir):
        raise Exception(f"O diretório do índice '{index_dir}' não existe.")
    return open_dir(index_dir)

def extract_relevant_phrases(content, query, top_n=5):
    sentences = re.split(r'(?<=[.!?]) +', content)
    query_words = query.lower().split()
    
    full_phrase_matches = [
        sentence.strip() for sentence in sentences 
        if all(word.lower() in sentence.lower() for word in query_words)
    ]
    
    if not full_phrase_matches:
        full_phrase_matches = [
            sentence.strip() for sentence in sentences 
            if any(word.lower() in sentence.lower() for word in query_words)
        ]
    
    return full_phrase_matches[:top_n]

def search_documents_vector(query):
    ix = get_index()
    
    with ix.searcher() as searcher:
        results = searcher.search(MultifieldParser(["content"], ix.schema).parse(query), limit=None)
        
        if len(results) == 0:
            return [{"message": "Nenhum resultado encontrado."}]
        
        # titles = [result["title"] for result in results]
        contents = [result["content"] for result in results]
        
        vectorizer = TfidfVectorizer()
        tfidf_matrix = vectorizer.fit_transform(contents)
        query_vector = vectorizer.transform([query])
        tfidf_similarities = np.dot(tfidf_matrix, query_vector.T).toarray().flatten()
        
        sorted_indices = np.argsort(tfidf_similarities)[::-1]
        
        response = []
        for index in sorted_indices:
            if tfidf_similarities[index] > 0:
                relevant_phrases = extract_relevant_phrases(contents[index], query)
                
                response.append({
                    "title": titles[index],
                    "relevance_score": round(tfidf_similarities[index], 4),
                    "snippets": relevant_phrases
                })
        
        return response

@app.post("/search")
def search_documents(search_query: SearchQuery):
    results = search_documents_vector(search_query.query)
    return {"results": results}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
