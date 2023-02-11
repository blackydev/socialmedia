import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "config";
import validateUser from "./user/user.validation.js";
import validatePassword from "./user/password.validation.js";
import User from "../types/user.js";

const UserSchema = new Schema<User>({
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    trim: true,
    minlength: 3,
    maxlength: 320,
  },

  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 64,
    trim: true,
  },

  password: {
    type: String,
    maxlength: 64,
  },

  avatar: {
    type: Buffer,
  },

  posts: [
    {
      type: Schema.Types.ObjectId,
      ref: "post",
      required: true,
    },
  ],
});

UserSchema.methods = {
  toJSON: function () {
    const obj = this.toObject();
    delete obj.password;
    return obj;
  },

  setPassword: async function (password: string): Promise<Error | undefined> {
    const errors = validatePassword(password);
    if (Array.isArray(errors) && errors.length > 0)
      return new Error(errors[0].message);

    const salt = await bcrypt.genSalt();
    const hashed = await bcrypt.hash(password, salt);
    this.password = hashed;
  },

  comparePassword: async function (password: string) {
    return await bcrypt.compare(password, this.password as string);
  },

  generateAuthToken: function (): string {
    return jwt.sign(
      {
        _id: this._id,
        email: this.email,
        name: this.name,
      },
      config.get("jwtPrivateKey")
    );
  },
};

export const User = mongoose.model<User>("user", UserSchema);

export const validate = validateUser;
