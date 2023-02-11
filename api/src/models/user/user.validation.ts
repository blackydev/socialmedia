import Joi, { ValidationResult } from "joi";

const validate = (user: {
  email: string;
  password?: string;
  name: string;
}): ValidationResult =>
  Joi.object({
    email: Joi.string().email().min(3).max(320).required(),
    name: Joi.string().min(3).max(64).required(),
    password: Joi.string(),
  }).validate(user);

export default validate;
