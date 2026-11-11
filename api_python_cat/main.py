import google.generativeai as genai
from flask import Flask, request, jsonify
from database import MySQLDatabase
from flask_cors import CORS
from PyPDF2 import PdfReader
from docx import Document
import pandas as pd
import openpyxl
from pptx import Presentation
from io import BytesIO
from dotenv import load_dotenv
from os import getenv, path, makedirs, remove
import time
import mimetypes
import logging
import tempfile
import textract

# Configuração de logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Carregar variáveis de ambiente
load_dotenv()
api_key_gemini = getenv('API_KEY_GEMINI')
genai.configure(api_key=api_key_gemini)

# Configuração padrão para o máximo de caracteres a extrair
DEFAULT_MAX_CHARS = 10000

# Criar diretório temporário para processamento de arquivos
TEMP_DIR = path.join(tempfile.gettempdir(), 'doc_processor')
if not path.exists(TEMP_DIR):
    makedirs(TEMP_DIR)

# Mapeamento de MIME types para as extensões de arquivo
MIME_TYPES = {
    # PDF
    'application/pdf': '.pdf',
    # Word
    'application/msword': '.doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
    'application/vnd.oasis.opendocument.text': '.odt',
    # Excel
    'application/vnd.ms-excel': '.xls',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
    'application/vnd.oasis.opendocument.spreadsheet': '.ods',
    # PowerPoint
    'application/vnd.ms-powerpoint': '.ppt',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': '.pptx',
    'application/vnd.oasis.opendocument.presentation': '.odp'
}

def obter_categorias(usuario_id):
    """Consulta as categorias do banco de dados com base no ID do usuário."""
    db = MySQLDatabase()
    db.connect()
    query = "SELECT name FROM Category WHERE user_id = %s;"
    categorias_db = db.execute_query(query, (usuario_id,))
    db.close_connection()
    return [row[0] for row in categorias_db] if categorias_db else []

def extrair_texto_pdf(file_stream, max_chars=DEFAULT_MAX_CHARS):
    """Extrai texto de arquivos PDF com limite de caracteres."""
    texto_total = ""
    leitor = PdfReader(file_stream)

    for pagina in leitor.pages:
        texto_pagina = pagina.extract_text() or ''
        texto_total += texto_pagina + '\n'

        # Verifica se já atingiu o limite de caracteres
        if len(texto_total) >= max_chars:
            return texto_total[:max_chars]

    return texto_total

def extrair_texto_word_docx(file_stream, max_chars=DEFAULT_MAX_CHARS):
    """Extrai texto de arquivos Word DOCX com limite de caracteres."""
    texto_total = ""
    doc = Document(file_stream)

    for paragrafo in doc.paragraphs:
        texto_total += paragrafo.text + '\n'

        # Verifica se já atingiu o limite de caracteres
        if len(texto_total) >= max_chars:
            return texto_total[:max_chars]

    return texto_total

def extrair_texto_word_doc(file_path, max_chars=DEFAULT_MAX_CHARS):
    """Extrai texto de arquivos Word DOC usando textract com limite de caracteres."""
    try:
        texto = textract.process(file_path).decode('utf-8')
        return texto[:max_chars]
    except Exception as e:
        logger.error(f"Erro ao extrair texto do arquivo DOC: {str(e)}")
        raise ValueError(f"Não foi possível extrair texto do arquivo DOC: {str(e)}")

def extrair_texto_excel(file_stream, extensao, max_chars=DEFAULT_MAX_CHARS):
    """Extrai texto de arquivos Excel com limite de caracteres."""
    texto_total = ""

    if extensao in ['.xlsx', '.xls']:
        # Para formatos Excel
        wb = openpyxl.load_workbook(file_stream, data_only=True)
        for sheet in wb.sheetnames:
            ws = wb[sheet]
            for row in ws.iter_rows(values_only=True):
                # Filtrar valores None e converter todos para string
                row_text = ' '.join([str(cell) for cell in row if cell is not None])
                if row_text.strip():
                    texto_total += row_text + '\n'

                    # Verifica se já atingiu o limite de caracteres
                    if len(texto_total) >= max_chars:
                        return texto_total[:max_chars]
    elif extensao == '.ods':
        # Para formato OpenDocument Spreadsheet
        df = pd.read_excel(file_stream, engine='odf')
        for _, row in df.iterrows():
            linha_texto = ' '.join([str(val) for val in row if not pd.isna(val)])
            texto_total += linha_texto + '\n'

            # Verifica se já atingiu o limite de caracteres
            if len(texto_total) >= max_chars:
                return texto_total[:max_chars]

    return texto_total

def extrair_texto_powerpoint(file_stream, max_chars=DEFAULT_MAX_CHARS):
    """Extrai texto de arquivos PowerPoint com limite de caracteres."""
    texto_total = ""
    prs = Presentation(file_stream)

    for slide in prs.slides:
        for shape in slide.shapes:
            if hasattr(shape, "text") and shape.text:
                texto_total += shape.text + '\n'

                # Verifica se já atingiu o limite de caracteres
                if len(texto_total) >= max_chars:
                    return texto_total[:max_chars]

    return texto_total

def identificar_tipo_arquivo(mime_type, filename):
    """Identifica o tipo de arquivo com base no MIME type e nome do arquivo."""
    extensao = None

    # Primeiro tenta identificar pelo MIME type
    if mime_type in MIME_TYPES:
        extensao = MIME_TYPES[mime_type]
    # Se não conseguir, tenta pelo nome do arquivo
    else:
        extensao = '.' + filename.split('.')[-1].lower() if '.' in filename else None

    return extensao

def salvar_arquivo_temporario(file_stream, extensao):
    """Salva um arquivo em memória para um arquivo temporário no disco."""
    temp_file = path.join(TEMP_DIR, f"temp_{int(time.time())}_{id(file_stream)}{extensao}")
    with open(temp_file, 'wb') as f:
        f.write(file_stream.read())
    return temp_file

def extrair_texto(file_stream, mime_type, filename, max_chars=DEFAULT_MAX_CHARS):
    """ Extrai texto de diferentes tipos de arquivos baseado no MIME type com limite de caracteres."""
    try:
        extensao = identificar_tipo_arquivo(mime_type, filename)

        if not extensao:
            raise ValueError(f"Formato de arquivo não identificado: {mime_type}, {filename}")

        # Cria uma cópia do arquivo em memória
        file_copy = BytesIO(file_stream.read())
        file_stream.seek(0)  # Reinicia o ponteiro do arquivo original para uso posterior

        if extensao == '.pdf':
            return extrair_texto_pdf(file_copy, max_chars)
        elif extensao == '.docx' or extensao == '.odt':
            return extrair_texto_word_docx(file_copy, max_chars)
        elif extensao == '.doc':
            # Para arquivos .doc, precisamos salvar temporariamente no disco
            temp_file = salvar_arquivo_temporario(file_stream, extensao)
            try:
                texto = extrair_texto_word_doc(temp_file, max_chars)
                return texto
            finally:
                # Remover o arquivo temporário após extrair o texto
                if path.exists(temp_file):
                    remove(temp_file)
        elif extensao in ['.xls', '.xlsx', '.ods']:
            return extrair_texto_excel(file_copy, extensao, max_chars)
        elif extensao in ['.ppt', '.pptx', '.odp']:
            return extrair_texto_powerpoint(file_copy, max_chars)
        else:
            raise ValueError(f"Formato de arquivo não suportado: {extensao}")
    except Exception as e:
        logger.error(f"Erro ao extrair texto: {str(e)}")
        raise ValueError(f"Erro ao processar o arquivo: {str(e)}")

def classificar_documento(texto, categorias):
    """ Classifica o documento em uma categoria usando a API Gemini. """
    if not categorias:
        return "outros"

    # Usamos o texto já limitado anteriormente
    prompt = f"""
    Classifique este documento em UMA destas categorias: {', '.join(categorias)}.
    Siga estas regras:
    1. Analise o conteúdo do documento para determinar a categoria mais adequada.
    2. Se não se encaixar claramente em nenhuma categoria, responda 'outros'.
    3. Responda apenas com o nome da categoria, sem nenhum texto adicional.
    Documento: {texto[:DEFAULT_MAX_CHARS]}
    """
    try:
        model = genai.GenerativeModel('gemini-2.0-flash')
        response = model.generate_content(prompt)
        categoria = response.text.strip().lower()

        # Verificar se a categoria está na lista ou é "outros"
        categorias_lower = [c.lower() for c in categorias]
        if categoria in categorias_lower:
            return categorias[categorias_lower.index(categoria)]
        return "outros"
    except Exception as e:
        logger.error(f"Erro ao classificar documento: {str(e)}")
        raise Exception(f"Erro ao classificar documento: {str(e)}")

@app.route('/classificar', methods=['POST'])
def classificar():
    """ Recebe um arquivo, extrai o texto e classifica com base no usuário ou categorias fornecidas."""
    if 'file' not in request.files or 'userId' not in request.form:
        return jsonify({"error": "Arquivo ou ID do usuário não encontrado"}), 400

    documento = request.files['file']
    file_name = documento.filename
    user_id = request.form['userId']
    categorias = request.form.getlist('categorias')

    # Obter o limite de caracteres dos parâmetros ou usar o padrão
    max_chars = int(request.form.get('max_chars', DEFAULT_MAX_CHARS))

    try:
        # Obter o MIME type do arquivo
        mime_type = documento.content_type
        logger.info(f"Processando arquivo: {file_name}, MIME type: {mime_type}, Limite de caracteres: {max_chars}")

        # Se não houver categorias no form, buscar do banco de dados
        if not categorias:
            categorias = obter_categorias(user_id)
        if not categorias:
            return jsonify({"file": file_name, "categorias": "Nenhuma categoria disponível"}), 200

        # Extrair o texto do documento com limite de caracteres
        texto = extrair_texto(documento, mime_type, file_name, max_chars)

        if not texto or texto.strip() == "":
            return jsonify({"file": file_name, "categorias": "Não foi possível ler o documento"}), 200

        # Verificar se o texto foi truncado
        texto_truncado = len(texto) >= max_chars

        # Classificar o documento
        categoria = classificar_documento(texto, categorias)

        # Prepare trecho relevante (truncado se for muito longo)
        trecho_relevante = texto[:200] if len(texto) > 200 else texto

        return jsonify({
            "file": file_name,
            "mime_type": mime_type,
            "categoria": categoria,
            "trecho_relevante": trecho_relevante,
            "caracteres_extraidos": len(texto),
            "texto_truncado": texto_truncado,
            "max_chars": max_chars,
            "categorias_disponiveis": categorias
        })
    except ValueError as ve:
        logger.warning(f"Erro de validação: {str(ve)}")
        print(str(ve))
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        logger.error(f"Erro interno: {str(e)}", exc_info=True)
        print(str(e))
        return jsonify({"error": str(e)}), 500

@app.route('/status', methods=['GET'])
def status():
    """Endpoint para verificar o status da API"""
    return jsonify({
        "status": "online",
        "version": "1.2.0",
        "supported_formats": list(MIME_TYPES.values()),
        "default_max_chars": DEFAULT_MAX_CHARS
    })

if __name__ == "__main__":
    port = int(getenv("PORT", 8080))
    logger.info(f"Iniciando API de classificação de documentos na porta {port}")
    app.run(host="0.0.0.0", port=port, debug=True)