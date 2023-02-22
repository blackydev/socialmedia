import { ObjectId } from "./objectId";
import { MinifiedUser } from "./users";

export type Post = {
  _id: ObjectId;
  author: MinifiedUser;
  parent: string;
  content: string;
  noComments?: boolean;
  mediaCount: number;
  liked: boolean;
  likesCount: number;
  createdAt: string;
};
