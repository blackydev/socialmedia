import { Document } from "mongoose";
import Post from "./post.js";

interface User extends Document {
  email: string;
  password: string;
  name: string;
  avatar: Buffer;
  posts: [Post];

  toJSON(): any;
  setPassword(password: string): Promise<Error | undefined>;
  comparePassword(password: string): Promise<boolean & void>;
  generateAuthToken: () => string;
}

export default User;
