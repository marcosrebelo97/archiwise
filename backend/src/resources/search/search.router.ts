import {Router} from "express";

import searchController from "./search.controller";

import { isAuthenticated } from "../../middlewares/isAuthenticated";
import { validate } from "../../middlewares/validate";
import { createSearchSchema } from "./search.schema";

const router = Router();

router.get('/', isAuthenticated,
    /*
        #swagger.description = "Retorna todos os termos pesquisados por um usuário."

        #swagger.responses[200] = {
            description: "Lista de items pesquisados.",
            schema: {
                $ref: "#/definitions/Searches"
            }
        }

        #swagger.responses[401] = {
            description: "Não autorizado. Usuário não autenticado.",
            schema: {
                $ref: "#/definitions/Error401"
            }
        }
    */
   searchController.index
)

router.post('/', isAuthenticated,
    /*
        #swagger.description = "Registrar uma nova pesquisa de um usuário."

        #swagger.parameters['body'] = {
            in: 'body',
            description: "Campos necessários para registrar uma pesquisa de um usuário.",
            schema: {
                $ref: '#/definitions/CreateSearchSchema'
            }
        }

        #swagger.responses[200] = {
            description: "Pesquisa registrada com sucesso.",
            schema: {
                $ref: '#/definitions/Search'
            }
        }

        #swagger.responses[401] = {
            description: "Não autorizado. Usuário não autenticado.",
            schema: {
                $ref: "#/definitions/Error401"
            }
        }
    */
   validate(createSearchSchema),
   searchController.create

)

export default router;