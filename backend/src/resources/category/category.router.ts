import { Router } from 'express';

import categoryController from './category.controller';
import { isAuthenticated } from '../../middlewares/isAuthenticated';

const router = Router();

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Retorna todas as categorias do usuário autenticado.
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de categorias do usuário.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 *       401:
 *         description: Não autorizado. Usuário não autenticado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error401'
 */
router.get('/', isAuthenticated, categoryController.index);

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: Retorna uma categoria específica pelo ID.
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da categoria.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Categoria encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       401:
 *         description: Não autorizado. Usuário não autenticado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error401'
 *       404:
 *         description: Categoria não encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error404'
 */
router.get('/:id', isAuthenticated, categoryController.searchId);

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Cria uma nova categoria.
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCategorySchema'
 *     responses:
 *       201:
 *         description: Categoria criada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       401:
 *         description: Não autorizado. Usuário não autenticado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error401'
 *       422:
 *         description: Erro de validação dos dados.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error422'
 */
router.post('/', isAuthenticated, categoryController.create);

/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     summary: Atualiza uma categoria existente.
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da categoria.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCategorySchema'
 *     responses:
 *       200:
 *         description: Categoria atualizada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       401:
 *         description: Não autorizado. Usuário não autenticado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error401'
 *       404:
 *         description: Categoria não encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error404'
 *       422:
 *         description: Erro de validação dos dados.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error422'
 */
router.put('/:id', isAuthenticated, categoryController.update);

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Exclui uma categoria existente.
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da categoria.
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Categoria excluída com sucesso.
 *       401:
 *         description: Não autorizado. Usuário não autenticado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error401'
 *       404:
 *         description: Categoria não encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error404'
 */
router.delete('/:id', isAuthenticated, categoryController.remove);

export default router;