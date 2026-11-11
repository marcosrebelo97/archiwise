# ArchiWise

Sistema de gestão de documentos que **cataloga, classifica e indexa arquivos
automaticamente**, para agilizar a busca e o acesso às informações.

Projeto desenvolvido em equipe no programa **Web Academy (UFAM)**, entre
dezembro de 2024 e março de 2025.

> Esta é uma cópia pública do repositório original da equipe, que é privado.
> Ela traz o código da versão apresentada, sem o histórico de commits e sem
> credenciais: chaves, senhas e endereços de produção foram trocados por
> variáveis de ambiente.

## Funcionalidades

- **Upload** de PDF, Word, Excel e PowerPoint, com conversão para PDF e
  pré-visualização ([Gotenberg](https://gotenberg.dev/))
- **Classificação automática** em categorias com IA (Google Gemini), a partir
  do texto extraído do documento
- **Busca** no conteúdo dos arquivos, com indexação em
  [Whoosh](https://whoosh.readthedocs.io/)
- Categorias com cores, favoritos, lixeira e dashboard de uso
- Autenticação com sessão (Redis), cadastro e recuperação de senha por e-mail
- Documentação da API com Swagger em `/docs`

## Arquitetura

| Serviço | Stack | Porta |
| --- | --- | --- |
| `frontend` | Next.js 14, React 18, MUI, Tailwind | 3000 |
| `backend` | Node.js, Express, TypeScript, Prisma | 4000 |
| `cat_api` (classificação) | Python, Flask, Google Gemini | 5000 |
| `indexer_api` (busca) | Python, Whoosh | 5001 |
| `gotenberg` | conversão de documentos | 4001 |
| `mysql` / `redis` | banco de dados e sessões | 3328 / 6379 |

Os arquivos ficam no Google Cloud Storage.

## Rodando localmente

Requer Docker e Docker Compose.

1. Crie os arquivos de ambiente a partir dos exemplos e preencha os valores. A senha do MySQL precisa ser
   a mesma em todos eles:

   ```bash
   cp .env.example .env
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   cp api_python_cat/.env.example api_python_cat/.env
   ```

   Para o upload, coloque o JSON de uma conta de serviço do Google Cloud em
   `backend/service-account.json` (ele está no `.gitignore`). Para a
   classificação, informe `API_KEY_GEMINI`.

2. Suba os serviços:

   ```bash
   docker compose up
   ```

3. Rode as migrations e o seed:

   ```bash
   docker exec -it backend_archiwise bash
   npm run prisma
   exit
   ```

4. Acesse o frontend em http://localhost:3000 e a API em
   http://localhost:4000/docs.

O seed cria um usuário de desenvolvimento: `admin@archiwise.local` com a senha
`senha123`. Use esse usuário só no ambiente local.

## Equipe

Desenvolvido pela equipe T4-02 da Web Academy (UFAM). O layout do frontend
parte do template [Materio](https://github.com/themeselection/materio-mui-nextjs-admin-template-free).
