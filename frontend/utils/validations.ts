import Joi from "joi";

export const signUpSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),

  username: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required(),

  password: Joi.string()
    .min(6)
    .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
    .required(),
});