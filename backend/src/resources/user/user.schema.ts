import Joi from "joi"

const userSchema = Joi.object().keys({
    name: Joi.string().min(3).max(40),
    email: Joi.string().email(),
    password: Joi.string().min(3).max(40)
});

export default userSchema;