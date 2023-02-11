import Joi, { ValidationResult } from "joi";

const validateAuth = (user: {
  email: string;
  password: string;
}): ValidationResult =>
  Joi.object({
    email: Joi.string().email().min(3).max(320).required(),
    password: Joi.string().required(),
  }).validate(user);

export default validateAuth;
