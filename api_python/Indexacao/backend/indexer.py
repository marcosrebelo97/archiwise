from flask import Flask, request, jsonify
import os
from whoosh.fields import Schema, TEXT, ID
from whoosh.index import create_in, open_dir, EmptyIndexError
from whoosh.analysis import StandardAnalyzer
from whoosh.qparser import MultifieldParser
import search 
from docx import Document
import PyPDF2

app = Flask(__name__)

# Define o esquema do índice Whoosh
schema = Schema(
    id=ID(stored=True, unique=True), 
    title=TEXT(stored=True, analyzer=StandardAnalyzer()),
    content=TEXT(stored=True, analyzer=StandardAnalyzer())
)

# Função para criar ou abrir o índice Whoosh
def get_index(index_dir="indexdir"):
    if not os.path.exists(index_dir):
        os.mkdir(index_dir)
        return create_in(index_dir, schema)

    try:
        # Tenta abrir o índice
        return open_dir(index_dir)
    except EmptyIndexError:
        # Se não existir um índice válido, cria novamente
        return create_in(index_dir, schema)


def read_file_with_encoding(file_path):
    encodings = ['utf-8', 'latin-1']
    for encoding in encodings:
        try:
            with open(file_path, 'r', encoding=encoding) as f:
                return f.read()
        except UnicodeDecodeError:
            continue
    raise ValueError(f"Não foi possível ler o arquivo {file_path} com as codificações suportadas.")

def read_docx(file_path):
    try:
        doc = Document(file_path)
        return "\n".join([p.text for p in doc.paragraphs])
    except Exception as e:
        raise ValueError(f"Erro ao ler o arquivo DOCX {file_path}: {str(e)}")

def read_pdf(file_path):
    try:
        with open(file_path, 'rb') as pdf_file:
            pdf_reader = PyPDF2.PdfReader(pdf_file)
            return "\n".join([page.extract_text() or "" for page in pdf_reader.pages])
    except Exception as e:
        raise ValueError(f"Erro ao ler o arquivo PDF {file_path}: {str(e)}")

@app.route("/index", methods=["POST"])
def index_document():
    form_fields = ["document_id", "user_id", "title"]
    if "file" not in request.files or not all(field in request.form for field in form_fields):
        return jsonify({"error": "Tese"}), 400
    print(request)
    file = request.files["file"]
    id_file = request.form["document_id"]
    user_id = request.form["user_id"]

    title = request.form["title"]
    path_indexer = os.path.join("uploads", user_id, "indexer")

    ix = get_index(path_indexer)
    filename = file.filename

#     if not os.path.exists("uploads"):
#         os.makedirs("uploads")
    
    file_path = os.path.join("uploads", user_id, filename)
#     file.save(file_path)
    
    try:
        content = None
        if filename.lower().endswith(".txt"):
            content = read_file_with_encoding(file_path)
        elif filename.lower().endswith(".docx"):
            content = read_docx(file_path)
        elif filename.lower().endswith(".pdf"):
            content = read_pdf(file_path)
        
        if content:
            writer = ix.writer()
            writer.add_document(id=str(id_file), title=str(title), content=content)
            writer.commit()
            return jsonify({"message": f"Documento '{filename}' indexado com sucesso.", "id": id_file}), 200
        else:
            return jsonify({"error": "Formato de arquivo não suportado"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/search", methods=["GET"])
def search_documents():
    user_id = request.args.get("user_id")
    query_text = request.args.get("q")

    if not user_id or not query_text:
        return jsonify({"error": "Parâmetros 'user_id' e 'q' são obrigatórios."}), 400

    # Caminho do índice do usuário
    index_path = os.path.join("uploads", user_id, "indexer")

    if not os.path.exists(index_path):
        return jsonify({"error": f"Índice para o usuário {user_id} não encontrado."}), 404

    try:
        ix = open_dir(index_path)
    except Exception as e:
        return jsonify({"error": f"Erro ao abrir índice: {str(e)}"}), 500

    # MultiFieldParser para buscar em "title" e "content"
    parser = MultifieldParser(["title", "content"], ix.schema)
    search.search_documents_vector(query_text)
    # Montamos a query
    query = parser.parse(query_text)
    results_data = []
    with ix.searcher() as searcher:
        results = searcher.search(query, limit=10)  # Ajuste o limit conforme necessário
        for hit in results:
            result_item = {
                "document_id": hit.get("id"),
                "title": hit.get("title"),
                # Se você quiser exibir parte do conteúdo, pode usar:
                "excerpt": (hit.get("content") or "")[:200]  # primeiros 200 chars
            }
            results_data.append(result_item)

    return jsonify({"results": results_data}), 200

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
