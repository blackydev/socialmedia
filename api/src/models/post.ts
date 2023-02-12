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

  parent: {
    type: Schema.Types.ObjectId,
    ref: "post",
  },

  answers: [
    {
      type: Schema.Types.ObjectId,
      ref: "post",
    },
  ],

  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  ],

  likesCount: {
    type: Number,
    min: 0,
    default: 0,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Post = mongoose.model<Post>("post", PostSchema);
