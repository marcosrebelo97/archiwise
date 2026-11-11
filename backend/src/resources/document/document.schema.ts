import Joi from "joi";

export const createDocumentSchema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    viewCount: Joi.number(),
    categoryId: Joi.string().optional(),
});
