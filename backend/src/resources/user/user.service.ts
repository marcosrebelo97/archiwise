import { PrismaClient, User } from "@prisma/client";
import { genSalt, hash } from "bcryptjs";

import { createUserDto, UpdateUserDto, UserDto } from "./user.types";

const prisma = new PrismaClient();

export const getAllUsers = async (): Promise<UserDto[]> => {
    const users = await prisma.user.findMany();
    return users.map((u) => {
        const { password, ...userWithouPassword } = u;
        return userWithouPassword;
    })
}

export const createUser = async (user: createUserDto): Promise<User> => {
    const salt = await genSalt();
    const password = await hash(user.password, salt);
    return prisma.user.create({ data: { ...user, password } })
}

export const findUserByEmail = (email: string): Promise<User | null> => {
    return prisma.user.findUnique({ where: { email } });
}

export const findUserById = (id: string): Promise<User | null> => {
    return prisma.user.findUnique({ where: { id } });
}

export const updateUser = async (id: string, userData: UpdateUserDto): Promise<User | null> => {
    const updatedData = { ...userData };

    if (userData.password) {
        const salt = await genSalt();
        updatedData.password = await hash(userData.password, salt);
    }

    return prisma.user.update({
        where: { id },
        data: updatedData,
    });
};

export const deleteUser = async (id: string): Promise<void> => {
    await prisma.user.delete({
        where: { id }
    });
}
