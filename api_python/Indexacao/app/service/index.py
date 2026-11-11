import os
from whoosh.index import create_in, exists_in, open_dir
from whoosh.fields import Schema, TEXT, ID
from whoosh.analysis import StemmingAnalyzer
from whoosh.qparser import QueryParser
import PyPDF2
from docx import Document

class DocumentIndexer:
    def __init__(self, index_dir="indexdir"):
        """Inicializa o indexador e configura o esquema de indexação."""
        
        self.index_dir = index_dir
        self.schema = Schema(
            id=ID(stored=True, unique=True),
            title=TEXT(stored=True, analyzer=StemmingAnalyzer()),
            content=TEXT(stored=True, analyzer=StemmingAnalyzer())
        )
        self.ix = self.get_index(index_dir)

    def get_indexer(self, user_id):
        """Retorna um índice para um usuário específico."""
        return DocumentIndexer(os.path.join("uploads", user_id, "indexdir"))
    

    def get_index(self, index_dir):
        """Retorna um índice existente ou cria um novo."""
        if not os.path.exists(index_dir):
            os.makedirs(self.index_dir, exist_ok=True)

        if exists_in(index_dir):
            return open_dir(index_dir)
        else:
            return create_in(index_dir, self.schema)

    def read_file_with_encoding(self, file_path):
        encodings = ["utf-8", "latin1"]
        for encoding in encodings:
            try:
                with open(file_path, "r", encoding=encoding) as f:
                    return f.read()
            except UnicodeDecodeError:
                continue

    def read_txt(self, file_path):
        """Lê arquivos de texto."""
        with open(file_path, "r", encoding="utf-8") as f:
            return f.read()

    def read_docx(self, file_path):
        """Lê arquivos DOCX."""
        doc = Document(file_path)
        return "\n".join([paragraph.text for paragraph in doc.paragraphs])

    def read_file(self, file_path):
        """Lê o conteúdo de um arquivo (TXT, DOCX, PDF)."""
        if file_path.lower().endswith(".txt"):
            return self.read_txt(file_path)
        elif file_path.lower().endswith(".docx"):
            return self.read_docx(file_path)
        elif file_path.lower().endswith(".pdf"):
            return self.read_pdf(file_path)
        else:
            raise ValueError("Formato de arquivo não suportado.")

    def read_pdf(self, file_path):
        """Lê arquivos PDF."""
        with open(file_path, "rb") as f:
            reader = PyPDF2.PdfReader(f)
            content = ""
            for page in reader.pages:
                extracted_text = page.extract_text()
                if extracted_text:
                    content += extracted_text + "\n"
            return content.strip() if content else "Erro ao extrair texto do PDF."

    def index_document(self, file_path, document_id, title):
        """Lê um documento e indexa seu conteúdo no Whoosh."""
        
        content = self.read_file(file_path)

        if not content:
            raise ValueError("O arquivo está vazio ou não pôde ser lido.")

        writer = self.ix.writer()
        writer.add_document(id=document_id, title=title, content=content)
        writer.commit()
        return f"Documento '{title}' indexado com sucesso!"

    def search(self, query_str, field="content"):
        """Realiza uma busca no índice."""
        
        with self.ix.searcher() as searcher:
            parser = QueryParser(field, self.ix.schema)
            query = parser.parse(query_str)
            results = searcher.search(query, limit=10)
            
            return [{"id": hit["id"], "title": hit["title"], "snippet": hit["content"][:200]} for hit in results]
