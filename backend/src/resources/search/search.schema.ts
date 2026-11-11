import Joi from "joi";

export const createSearchSchema = Joi.object({
    termSearched: Joi.string().required(),
})