import { Request, Response } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

import { LoginDto, SignUpDto } from "./auth.types";
import { createUser, findUserByEmail } from "../user/user.service";
import { checkAuth } from "./auth.services";
import prisma from "../../client";
import {compare, genSalt, hash} from "bcryptjs";


const signup = async (req: Request, res: Response) => {
    const user = req.body as SignUpDto;

    try {
        if (await findUserByEmail(user.email)) {
            res.status(StatusCodes.CONFLICT).json({ message: ReasonPhrases.CONFLICT });
        }

        const newUsuario = await createUser({ ...user });
        req.session.uid = newUsuario.id;

        res.status(StatusCodes.CREATED).json(newUsuario);
    } catch (e) {
        console.error(e);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: ReasonPhrases.INTERNAL_SERVER_ERROR });
    }
};



const login = async (req: Request, res: Response) => {
    const credentials = req.body as LoginDto;

    try {
        const loginUser = await checkAuth(credentials);

        if (!loginUser) {
            res.status(StatusCodes.UNAUTHORIZED).json(ReasonPhrases.UNAUTHORIZED);
        } else {
            req.session.uid = loginUser.id;
            res.status(StatusCodes.OK).json(loginUser);
        }

    } catch (e) {
        console.error(e);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(e);
    }
};


const logout = (req: Request, res: Response) => {
    if (!req.session.uid) {
        res.status(StatusCodes.UNAUTHORIZED).json(ReasonPhrases.UNAUTHORIZED);
        return;
    }

    req.session.destroy((err) => {
        if (err) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
        }
        res.status(StatusCodes.OK).json(ReasonPhrases.OK);
    });
};

const update = async (req: Request, res: Response) => {
    if (!req.session.uid) {
        res.status(StatusCodes.UNAUTHORIZED).json(ReasonPhrases.UNAUTHORIZED);
        return;
    }
    const id = req.session.uid;
    const user = await prisma.user.update({
        where: { id },
        data: req.body,
    });
    res.status(StatusCodes.OK).json(user);
}

const updatePassword = async (req: Request, res: Response) => {
    if (!req.session.uid) {
        res.status(StatusCodes.UNAUTHORIZED).json(ReasonPhrases.UNAUTHORIZED);
        return;
    }
    const { password, newPassword } = req.body;
    const id = req.session.uid;
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
        res.status(StatusCodes.NOT_FOUND).json(ReasonPhrases.NOT_FOUND);
        return;
    }
    const correctPassword = await compare(password, user.password);
    if (!correctPassword) {
        res.status(StatusCodes.CONFLICT).json(ReasonPhrases.CONFLICT);
        return;
    }

    const salt = await genSalt();
    const passwordHash = await hash(newPassword, salt);

   const userUpdate =  await prisma.user.update({
        where: { id: user.id },
        data: { password: passwordHash },
    });

    res.status(StatusCodes.OK).json(userUpdate);
}

export default { signup, login, logout, update, updatePassword }