import swaggerAutogen from 'swagger-autogen';
import dotenv from 'dotenv';

dotenv.config();

const document = {
  id: 'uuid',
  name: 'Exemplo de Documento',
  createdAt: '2023-01-01T00:00:00.000Z',
  uploadedAt: '2023-01-01T00:00:00.000Z',
  size: 1024,
  type: 'application/pdf',
  filePath: '/uploads/documento-exemplo.pdf',
  filePathPreview: '/uploads/documento-exemplo-preview.pdf',
  viewCount: 10,
  userId: 'uuid-do-usuario',
  categoryId: 'uuid-da-categoria',
  user: {
    id: 'uuid-do-usuario',
    email: 'usuario@example.com',
    name: 'Nome do Usuário',
  },
  category: {
    id: 'uuid-da-categoria',
    name: 'Nome da Categoria',
  },
  isDeleted: false
}

const updateDoc = {
  name: "Exemplo de nome",
  viewCount: 10,
  categoryId: 'uuid-da-categoria',
  isDeleted: false
}

const search = {
  id: "uuid-da-pesquisa",
  termSearched: "Termo pesquisado",
  userId: "uuid-do-usuario"
}

const doc = {
  info: {
    title: 'API Archiwise',
    description: 'Documentação da API Archiwise',
  },
  host: `${process.env.HOST}:${process.env.PORT}`,
  definitions: {
    CreateDocumentSchema: {
      name: 'Exemplo de Documento',
      categoryId: 'uuid-da-categoria',
    },
    Documents: [
      document
    ],
    Document: document,
    UpdateDoc: updateDoc,
    User: {
      id: 'uuid-do-usuario',
      email: 'usuario@example.com',
      name: 'Nome do Usuário',
    },
    Category: {
      id: 'uuid-da-categoria',
      name: 'Nome da Categoria',
      description: 'Descrição da Categoria',
      createdAt: '2023-01-01T00:00:00.000Z',
      userId: 'uuid-do-usuario',
      color: 'Código Hex de cor'
    },
    Search: search,
    Searches: [search],
    MostSearchedTerm: {
      mostSearchedTerm: "termo mais pesquisado."
    },
    CreateSearchSchema: {
      termSearched: "termo pesquisado",
      userId: "uuid-do-usuário"
    },
    CreateCategorySchema: {
      name: 'Nome da Categoria',
      description: 'Descrição da Categoria',
    },
    UpdateCategorySchema: {
      name: 'Nome da Categoria Atualizada',
      description: 'Descrição da Categoria Atualizada',
    },
    Error401: {
      message: 'Usuário não autenticado',
      status: "error"
    },
    Error422: {
      message: 'Erro de validação de schema',
      status: "error"
    },
    DownloadError: {
      message: 'Error ao baixar arquivo',
      status: "error"
    },
    FileNotFoundError: {
      message: 'File not found',
      status: "error"
    }
  },
};

const outputFile = './swagger-output.json';

const routes = ['./src/router/index.ts'];

swaggerAutogen()(outputFile, routes, doc);
