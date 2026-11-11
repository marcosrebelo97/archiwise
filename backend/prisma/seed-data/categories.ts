import { Prisma } from '@prisma/client';

export const categories: Prisma.CategoryCreateManyInput[] = [
    {
        id: '1',
        userId: '1',
        name: 'teste',
    }
];
