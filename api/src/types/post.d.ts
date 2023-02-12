import mongoose from "mongoose";
import User from "./user.js";
export interface Post {
  author: User | mongoose.ObjectId;
  content: string;
  likes: [User | mongoose.ObjectId];
  likesCount: Number;
  createdAt: Date;
  media?: [Buffer];
  parent: Post | mongoose.ObjectId;
  answers: [Post | mongoose.ObjectId];
}

export default Post;
