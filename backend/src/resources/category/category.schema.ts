import Joi from 'joi';

export const createCategorySchema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    description: Joi.string().max(500).optional(),
    color: Joi.string().max(9).optional(),
});

export const updateCategorySchema = Joi.object({
    name: Joi.string().min(3).max(100).optional(),
    description: Joi.string().max(500).optional(),
    color: Joi.string().max(9).optional(),
});