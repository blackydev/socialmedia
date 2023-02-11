import passValidator from "password-validator";

const passwordSchema = new passValidator()
  .is()
  .min(8, "Password must have at least 8 characters")
  .is()
  .max(56, "Password cannot exceed 64 characters")
  .has()
  .uppercase(1, "Password must have at least one uppercase letter")
  .has()
  .lowercase(1, "Password must have at least one lowercase letter")
  .has()
  .digits(1, "Password must have at least one digit")
  .has()
  .not()
  .spaces(1, "Password cannot have spaces");

const validatePassword = (password: string) =>
  passwordSchema.validate(password, { details: true });

export default validatePassword;
