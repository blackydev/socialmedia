import { Types, Document, Model } from "mongoose";
import Permissions from "../utils/permisions.ts";
export interface IUserDocument extends Document {
  email: string;
  password: string;
  name: string;
  avatar: Buffer;
  permissions: Permissions;
  followed: Types.ObjectId[];
  followers: Types.ObjectId[];

  followedCount: number;
  followersCount: number;

  toJSON(): any;
  comparePassword(password: string): Promise<boolean & void>;
  generateAuthToken: () => string;

  addFollower(followerId: Types.ObjectId): boolean;
  deleteFollower(followerId: Types.ObjectId): boolean;

  follow(userId: Types.ObjectId): boolean;
  unfollow(userId: Types.ObjectId): boolean;
}
export interface IUserModel extends Model<IUserDocument> {
  setPassword(
    userId: string | Types.ObjectId,
    password: string,
  ): Promise<IUserDocument | Error>;
}
