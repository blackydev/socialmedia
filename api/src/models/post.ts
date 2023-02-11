import mongoose, { Schema } from "mongoose";
import Post from "../types/post.js";

const PostSchema = new Schema<Post>({
  author: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  media: [
    {
      type: Buffer,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Post = mongoose.model<Post>("post", PostSchema);
