import prisma from "../../client";
import { ReasonPhrases, StatusCodes } from "http-status-codes";


export const getAllUserSearches = async (userId: string) => {
    try{
        const user = await prisma.user.findUnique({
            where: {id: userId}
        })
    
        if(!user){
            throw {
                statusCode: StatusCodes.NOT_FOUND,
                message: ReasonPhrases.NOT_FOUND
            } 
        }
        return prisma.search.findMany({
            where: {
                userId
            },
            select: {
                termSearched: true,
                id: true,
                userId: false,
                createdAt: true
            }
        })
    }catch(error){
        throw {
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            message: ReasonPhrases.INTERNAL_SERVER_ERROR
        }
    }
}

export const createSearch = async (userId: string, termSearched: string) => {
    try{
        const user = await prisma.user.findUnique({
            where: {id: userId}
        })
    
        if(!user){
            throw {
                statusCode: StatusCodes.NOT_FOUND,
                message: ReasonPhrases.NOT_FOUND
            } 
        }
    
        return prisma.search.create({
            data: {
                termSearched,
                userId
            }
        })
    }catch(error){
        throw {
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            message: ReasonPhrases.INTERNAL_SERVER_ERROR
        }
    }
}