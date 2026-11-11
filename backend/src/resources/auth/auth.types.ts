import { User } from "@prisma/client";

export type SignUpDto = Pick<User, "name" | "email" | "password">;

export type LoginDto = Pick<User, "email" | "password">;