import {Router} from "express"

import documentController from "./document.controller";
import {isAuthenticated} from "../../middlewares/isAuthenticated";
import {uploadSingle} from "../../middlewares/uploadSingle";
import {createDocumentSchema} from "./document.schema";
import {validate} from "../../middlewares/validate";

const router = Router();


router.get('/', isAuthenticated,
    /*
      #swagger.description = "Retorna todos os documentos do usuário autenticado. Possui filtros opcionais: categoryId, startDate e endDate. Caso startDate e endDate sejam informados, filtra por um período; se apenas startDate for informado, filtra pelo dia exato."

      #swagger.parameters['categoryId'] = {
        in: 'query',
        description: 'ID da categoria para filtrar os documentos',
        required: false,
        type: 'string'
      }

      #swagger.parameters['startDate'] = {
        in: 'query',
        description: 'Data de início para filtro (Formato: YYYY-MM-DD). Se endDate for informada, define o início do período; caso contrário, filtra o dia exato.',
        required: false,
        type: 'string',
        format: 'date'
      }

      #swagger.parameters['endDate'] = {
        in: 'query',
        description: 'Data de fim para filtro de período (Formato: YYYY-MM-DD). Opcional, caso seja informada junto com startDate define o intervalo.',
        required: false,
        type: 'string',
        format: 'date'
      }
      #swagger.parameters['isDeleted'] = {
        in: 'query',
        description: 'Flag que indica se o Documento está ou não na lixeira.',
        required: false,
        type: 'boolean',
      }

      #swagger.responses[200] = {
        description: "Lista de documentos do usuário.",
        schema: {
            $ref: "#/definitions/Documents"
        }
      }

      #swagger.responses[401] = {
        description: "Não autorizado. Usuário não autenticado.",
        schema: {
          $ref: "#/definitions/Error401"
        }
      }
    */
    documentController.index);

router.get('/search', isAuthenticated,
    /*
      #swagger.description = "Realiza uma busca avançada de documentos com base nos filtros fornecidos."
      #swagger.parameters['categoryId'] = {
        in: 'query',
        description: 'ID da categoria para filtrar os documentos',
        required: false,
        type: 'string'
      }
      #swagger.parameters['startDate'] = {
        in: 'query',
        description: 'Data de início para filtro (Formato: YYYY-MM-DD).',
        required: false,
        type: 'string',
        format: 'date'
      }
      #swagger.parameters['endDate'] = {
        in: 'query',
        description: 'Data de fim para filtro (Formato: YYYY-MM-DD).',
        required: false,
        type: 'string',
        format: 'date'
      }
      #swagger.parameters['term'] = {
        in: 'query',
        description: 'Termo de pesquisa nos documentos.',
        required: false,
        type: 'string'
      }
      #swagger.responses[200] = {
        description: "Lista de documentos encontrados.",
        schema: {
            $ref: "#/definitions/Documents"
        }
      }
      #swagger.responses[401] = {
        description: "Não autorizado. Usuário não autenticado.",
        schema: {
          $ref: "#/definitions/Error401"
        }
      }
    */
    documentController.search);


router.get(
    "/:fileId",
    /*
      #swagger.description = "Retorna documento com base no seu Id."
      #swagger.parameters['fileId'] = {
          in: 'path',
          description: "ID do documento.",
          required: true,
          type: 'string'
      }
      #swagger.responses[200] = {
        description: "Lista de documentos encontrados.",
        schema: {
            $ref: "#/definitions/Documents"
        }
      }
      #swagger.responses[401] = {
        description: "Não autorizado. Usuário não autenticado.",
        schema: {
            $ref: "#/definitions/Error401"
        }
       }

    */
    isAuthenticated,
    documentController.searchId
)

router.put(
    "/restore/:fileId",
    isAuthenticated,
    /*
      #swagger.description = "Restaura um documento previamente deletado."
      #swagger.parameters['fileId'] = {
        in: 'path',
        description: "ID do documento a ser restaurado.",
        required: true,
        type: 'string'
      }
      #swagger.responses[200] = {
        description: "Documento restaurado com sucesso.",
        schema: {
          $ref: "#/definitions/Document"
        }
      }
      #swagger.responses[401] = {
        description: "Não autorizado. Usuário não autenticado.",
        schema: {
          $ref: "#/definitions/Error401"
        }
      }
      #swagger.responses[404] = {
        description: "Documento não encontrado.",
        schema: {
          $ref: "#/definitions/Error404"
        }
      }
    */
    documentController.restoreFile
);

router.post(
    '/',
    isAuthenticated,
    uploadSingle.single('file'),
    validate(createDocumentSchema),
    /*
      #swagger.description = "Cria um novo documento para o usuário autenticado."

      #swagger.consumes = ['multipart/form-data']

      #swagger.parameters['file'] = {
        in: 'formData',
        description: "Arquivo do documento que será enviado",
        required: true,
        type: "file",
      }

      #swagger.parameters['body'] = {
        in: 'body',
        description: "Campos necessários para criar o documento",
        required: true,
        schema: {
          $ref: "#/definitions/CreateDocumentSchema"
        }
      }

      #swagger.responses[201] = {
        description: "Documento criado com sucesso.",
        schema: {
          $ref: "#/definitions/Document"
        }
      }

      #swagger.responses[401] = {
        description: "Não autorizado. Usuário não autenticado.",
        schema: {
          $ref: "#/definitions/Error401"
        }
      }

      #swagger.responses[422] = {
        description: "Erro de validação de schema ou arquivo não encontrado.",
        schema: {
          $ref: "#/definitions/Error422"
        }
      }
    */
    documentController.create
);

router.put(
  "/:id",
  isAuthenticated,
  /*
  #swagger.description = "Atualiza o nome, o viewCount, isDeleted e a categoria de um documento."
  #swagger.parameters['id'] = {description: 'UUId do Documento.'}
  #swagger.parameters['body'] = {
    in: 'body',
    description: "Campos necessários para atualizar um documento.",
    required: true,
    schema: {
      $ref: "#/definitions/UpdateDoc"
    }
  }
  #swagger.responses[200] = {
        description: "Documento criado com sucesso.",
        schema: {
          $ref: "#/definitions/Document"
        }
  }
  #swagger.responses[422] = {
        description: "Erro de validação de schema ou arquivo não encontrado.",
        schema: {
          $ref: "#/definitions/Error422"
        }
  }
  */
  documentController.update
)

router.delete(
    '/:fileId',
    isAuthenticated,
    /*
      #swagger.description = "Deleta um documento pelo ID. O documento será movido para a lixeira."

      #swagger.parameters['fileId'] = {
        in: 'path',
        description: "ID do documento a ser deletado.",
        required: true,
        type: 'string'
      }

      #swagger.responses[204] = {
        description: "Documento deletado com sucesso. Sem conteúdo na resposta."
      }

      #swagger.responses[401] = {
        description: "Não autorizado. Usuário não autenticado.",
        schema: {
          $ref: "#/definitions/Error401"
        }
      }

      #swagger.responses[404] = {
        description: "Documento não encontrado.",
        schema: {
          $ref: "#/definitions/Error404"
        }
      }
    */
    documentController.deleteFile
);

export default router;