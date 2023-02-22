import { ObjectId } from "./objectId";

export type MinifiedUser = {
  _id: ObjectId;
  name: string;
};

export type User = {
  _id: ObjectId;
  name: string;
  followedCount?: number;
  followersCount?: number;
};

export type FullUser = {
  _id: ObjectId;
  name: string;
  followedCount: number;
  followersCount: number;
};

export type Token = string;
export type EncodedToken = {
  _id: ObjectId;
  email: string;
  name: string;
  permissions?: number;
};
