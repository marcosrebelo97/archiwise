import prisma from '../../client';

import { CreateCategoryData, UpdateCategoryData } from './category.types';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

export const createCategory = async (data: CreateCategoryData) => {
    return prisma.category.create({
        data,
    });
};

export const getAllCategories = async (userId: string) => {
    return prisma.category.findMany({
        where: {
            userId,
        },
        orderBy: {
            documents: {
                _count: "desc",
            }
        }
    });
};

export const getCategoryById = async (id: string, userId: string) => {
    const category = await prisma.category.findUnique({
        where: { id, userId },
    });

    if (!category) {
        throw {
            statusCode: StatusCodes.NOT_FOUND,
            message: ReasonPhrases.NOT_FOUND,
        };
    }

    return category;
};

export const updateCategory = async (id: string, userId: string, data: UpdateCategoryData) => {
    const category = await prisma.category.findUnique({
        where: { id, userId },
    });

    if (!category) {
        throw {
            statusCode: StatusCodes.NOT_FOUND,
            message: ReasonPhrases.NOT_FOUND,
        };
    }

    return prisma.category.update({
        where: { id },
        data,
    });
};

export const deleteCategory = async (id: string, userId: string) => {
    const category = await prisma.category.findUnique({
        where: { id, userId },
        include:{
            documents: true
        }
    });

    
    if (!category) {
        throw {
            statusCode: StatusCodes.NOT_FOUND,
            message: ReasonPhrases.NOT_FOUND,
        };
    }

    const documents = category.documents.filter((doc) => !doc.isDeleted)
    
    if(documents.length > 0){
        throw {
            statusCode: StatusCodes.CONFLICT,
            message: ReasonPhrases.CONFLICT
        }
    }
    
    return prisma.category.delete({
        where: { id },
    });
};