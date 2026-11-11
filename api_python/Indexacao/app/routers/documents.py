import os
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Query
from fastapi.responses import JSONResponse
from service.index import DocumentIndexer  
from whoosh.index import create_in, open_dir, EmptyIndexError
from whoosh.qparser import MultifieldParser
from whoosh.fields import Schema, TEXT, ID
from service.search import DocumentSearcher


router = APIRouter()

index_dir = DocumentIndexer()
index_search = DocumentSearcher()
@router.post("/index")
async def index_document(
    file: UploadFile = File(...),
    title: str = Form(...),
    document_id: str = Form(...),
    user_id: str = Form(...)
):
    """Endpoint para indexar um documento."""
    try:

        indexer = index_dir.get_indexer(user_id)

        # Cria o diretório de uploads do usuário, se não existir
        user_upload_dir = os.path.join("uploads", user_id)
        os.makedirs(user_upload_dir, exist_ok=True)

        file_path = os.path.join(user_upload_dir, file.filename)
        with open(file_path, "wb") as f:
            f.write(await file.read())

       
        content = None
        if file.filename.lower().endswith(".txt"):
            content = indexer.read_file_with_encoding(file_path)
        elif file.filename.lower().endswith(".docx"):
            content = indexer.read_docx(file_path)
        elif file.filename.lower().endswith(".pdf"):
            content = indexer.read_pdf(file_path)
        else:
            return {"error": "Formato de arquivo não suportado."}

        # Indexa o documento
        indexer.index_document(file_path, document_id, title)
        return {"message": f"Documento '{title}' indexado com sucesso!"}

    except Exception as e:
        return {"error": str(e)}
    finally:
        # Remove o arquivo temporário
        if os.path.exists(file_path):
            os.remove(file_path)

@router.get("/search")
async def search_documents(
    user_id: str = Query(..., description="ID do usuário dono dos documentos"),
    query: str = Query(..., description="Termo de busca"),
    field: str = Query("content", description="Campo para busca ('content' ou 'title')"),
):
    """Endpoint para buscar documentos indexados pelo usuário."""

    try:
        
        user_index_dir = os.path.join("uploads", user_id, "indexdir")

        if not os.path.exists(user_index_dir) or not os.path.isdir(user_index_dir) or not os.listdir(user_index_dir): return {"error": "Nenhum índice encontrado para este usuário."}

        searcher = index_search.get_indexer_search(user_id)

        results = searcher.search_documents_bm25(query)

        tfidf_results = searcher.search_documents_tfidf(query, results)

        return {
            "bm25_results": results,
            "tfidf_results": tfidf_results,
            "total_documents": len(results)  
            }
    
    except Exception as e:
        return {"error": str(e)}


