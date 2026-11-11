import { PrismaClient, User } from "@prisma/client";
import { compare } from "bcryptjs";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

import { LoginDto } from "./auth.types";

const prisma = new PrismaClient();

export const checkAuth = async ({ email, password }: LoginDto): Promise<User | null> => {
    try {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            throw {
                statusCode: StatusCodes.NOT_FOUND,
                message: ReasonPhrases.NOT_FOUND
            };
        }

        const isPasswordCorrect = await compare(password, user.password);
        if (!isPasswordCorrect) {
            throw {
                statusCode: StatusCodes.UNAUTHORIZED,
                message: ReasonPhrases.UNAUTHORIZED
            };
        }

        return user;
    } catch (error) {
        throw {
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            message: ReasonPhrases.INTERNAL_SERVER_ERROR
        };
    }
};
