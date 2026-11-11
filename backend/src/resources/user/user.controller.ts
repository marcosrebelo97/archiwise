import { Request, Response } from "express"
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import crypto from "crypto";

import { createUser, findUserByEmail, findUserById, updateUser, deleteUser, getAllUsers } from "./user.service"
import { createUserDto } from "./user.types";
import prisma from "../../client";
import redisClient from "../../redisClient";
import {sendPasswordResetEmail} from "../email/email.service";
import {genSalt, hash} from "bcryptjs";

const index = async (req: Request, res: Response) => {
    try {
        const users = await getAllUsers()
        res.send(users);
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send(ReasonPhrases.INTERNAL_SERVER_ERROR);
    }
}

const create = async (req: Request, res: Response) => {
    const user = req.body as createUserDto

    try {
        if (!(await findUserByEmail(user.email))) {
            const newUser = await createUser(user);
            res.json(newUser)
        } else {
            res.status(StatusCodes.CONFLICT).json(ReasonPhrases.CONFLICT);
        }
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send(ReasonPhrases.INTERNAL_SERVER_ERROR);
    }
};

const read = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const user = await findUserById(id);
        if (user) {
            res.json(user);
        } else {
            res.status(StatusCodes.NOT_FOUND).send(ReasonPhrases.NOT_FOUND);
        }
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send(ReasonPhrases.INTERNAL_SERVER_ERROR);
    }
}

const update = async (req: Request, res: Response) => {
    const { id } = req.params;
    const userData = req.body;

    try {
        const user = await findUserById(id);
        if (user) {
            const updatedUser = await updateUser(id, userData);
            res.json(updatedUser);
        } else {
            res.status(StatusCodes.NOT_FOUND).send(ReasonPhrases.NOT_FOUND);
        }
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send(ReasonPhrases.INTERNAL_SERVER_ERROR);
    }
};

const remove = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const user = await findUserById(id);
        if (user) {
            await deleteUser(id);
            res.status(StatusCodes.NO_CONTENT).send();
        } else {
            res.status(StatusCodes.NOT_FOUND).send(ReasonPhrases.NOT_FOUND);
        }
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send(ReasonPhrases.INTERNAL_SERVER_ERROR);
    }
}

export const requestPasswordReset = async (req: Request, res: Response) => {
    const { email } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        res.status(404).json({ message: "Usuário não encontrado." });
        return
    }

    const baseUrl = req.headers.origin;
    if (!baseUrl) {
        res.status(400).json({ message: "URL base não fornecida." });
        return
    }

    const token = crypto.randomBytes(32).toString("hex");

    // Armazena no Redis com expiração de 1 hora (3600 segundos)
    await redisClient.set(`password-reset:${token}`, user.id.toString(), {
        EX: 3600,
    });


    await sendPasswordResetEmail(email, token, baseUrl);
    res.json({ message: "E-mail de recuperação enviado!" });
};

export const verifyPasswordResetToken = async (req: Request, res: Response) => {
    const { token } = req.params;

    const userId = await redisClient.get(`password-reset:${token}`);

    if (!userId) {
        res.status(400).json({ message: "Token inválido ou expirado." });
        return
    }

    res.json({ userId });
}

export const resetPassword = async (req: Request, res: Response) => {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
         res.status(400).json({ message: "Token e nova senha são obrigatórios." });
         return
    }

    // Buscar o userId associado ao token no Redis
    const userId = await redisClient.get(`password-reset:${token}`);

    if (!userId) {
        res.status(400).json({ message: "Token inválido ou expirado." });
        return
    }

    const salt = await genSalt();
    const password = await hash(newPassword, salt);

    await prisma.user.update({
        where: { id: userId },
        data: { password },
    });

    // Remover o token do Redis após o uso
    await redisClient.del(`password-reset:${token}`);

    res.json({ message: "Senha redefinida com sucesso!" });
};

export default { index, create, read, update, remove, requestPasswordReset, verifyPasswordResetToken, resetPassword };
