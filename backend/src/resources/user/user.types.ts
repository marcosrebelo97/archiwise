import { User } from "@prisma/client";

export type createUserDto = Pick<User, "name" | "email" | "password" >;

export type UserDto = Omit<User, "password">;

export type UpdateUserDto = Pick<User, "name" | "email" | "password" >;