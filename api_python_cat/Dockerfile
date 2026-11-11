# Usamos uma imagem base do Python minimalista para reduzir o tamanho
FROM python:3.9-slim

# Define variáveis de ambiente para melhorar o comportamento do Python
ENV PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Instala dependências do sistema necessárias
RUN apt-get update && apt-get install -y --no-install-recommends \
    default-libmysqlclient-dev \
    pkg-config \
    gcc \
    python3-dev \
    antiword \
    && rm -rf /var/lib/apt/lists/*

# Copia os arquivos do projeto (evita copiar arquivos desnecessários)
COPY requirements.txt .

# Instala as dependências do Python antes de copiar o código (melhora cache)
RUN pip install --no-cache-dir -r requirements.txt

# Copia o restante do código fonte
COPY . .

# Define um usuário não root para maior segurança
RUN useradd --create-home appuser
USER appuser

# Expõe a porta da aplicação (ajuste conforme necessário)
EXPOSE 8080

# Comando para iniciar a aplicação
CMD ["python", "main.py"]
