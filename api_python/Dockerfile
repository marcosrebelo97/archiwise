# Usamos uma imagem base do Python
FROM python:3.9-slim

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copia o código fonte para dentro do contêiner
COPY . /app

# Instala as dependências do Python antes de copiar o código (melhora cache)
RUN pip install --no-cache-dir -r requirements.txt
# Expondo a porta 5000 para rodar o Flask
EXPOSE 5000

# Comando para iniciar a aplicação
CMD ["python", "Indexacao/app/main.py"]