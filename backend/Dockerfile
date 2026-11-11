# Etapa de Build
FROM node:22-alpine AS builder

WORKDIR /app

# Instala dependências do sistema
RUN apk add --no-cache ghostscript graphicsmagick

# Copia arquivos necessários para instalação de dependências
COPY package.json package-lock.json* ./

# Instala dependências de produção e desenvolvimento (necessárias para o build)
RUN npm ci

# Copia todo o código-fonte
COPY . .

# Gera o Prisma Client dentro do container
RUN npx prisma generate

# Compila o TypeScript
RUN npm run build
RUN ls -l /app/build


# Etapa Final
FROM node:22-alpine

WORKDIR /app

# Instala dependências do sistema
RUN apk add --no-cache ghostscript graphicsmagick

# Copia apenas o necessário da etapa de build
COPY --from=builder /app/. ./
# Define a variável de ambiente para produção


# Comando de inicialização
CMD ["node", "build/index.js"]