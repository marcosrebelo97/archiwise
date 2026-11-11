import { Category } from '@prisma/client';

export type CreateCategoryData = Pick<Category, 'name' | 'description' | 'userId' | 'color'>;

export type UpdateCategoryData = Partial<Pick<Category, 'name' | 'description'>>;