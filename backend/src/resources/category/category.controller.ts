import { Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

import { createCategory, getAllCategories, getCategoryById, updateCategory, deleteCategory } from './category.service';
import { CreateCategoryData, UpdateCategoryData } from './category.types';

const index = async (req: Request, res: Response) => {
    const { uid: userId } = req.session;
    const categories = await getAllCategories(req.session?.uid ?? '');
    res.status(StatusCodes.OK).json(categories);
};

const searchId = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { uid: userId } = req.session;

    try {
        const category = await getCategoryById(id, userId ?? '');
        res.status(StatusCodes.OK).json(category);
    } catch (error) {
        const err = error as { statusCode?: number; message: string };
        res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message });
    }
};

const create = async (req: Request, res: Response) => {
    const { uid: userId } = req.session;
    const data = req.body as CreateCategoryData;

    try {
        const category = await createCategory({ ...data, userId: userId ?? '' });
        res.status(StatusCodes.CREATED).json(category);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: ReasonPhrases.INTERNAL_SERVER_ERROR });
    }
};

const update = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { uid: userId } = req.session;
    const data = req.body as UpdateCategoryData;

    try {
        const category = await updateCategory(id, userId ?? '', data);
        res.status(StatusCodes.OK).json(category);
    } catch (error) {
        console.error(error)
        const err = error as { statusCode?: number; message: string };
        res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message });
    }
};

const remove = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { uid: userId } = req.session;

    try {
        await deleteCategory(id, userId ?? '');
        res.status(StatusCodes.NO_CONTENT).send();
    } catch (error) {
        const err = error as { statusCode?: number; message: string };
        res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message });
    }
};

export default { index, searchId, create, update, remove };