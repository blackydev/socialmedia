import mongoose, { Schema, Types, isValidObjectId } from "mongoose";
import _ from "lodash";
import Joi, { ValidationResult } from "joi";
import { IPostDocument, IPostModel } from "../types/post.js";
import { sortedInsert, sortedDelete } from "../utils/sortedArray.js";

const PostSchema = new Schema<IPostDocument>({
  author: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
    index: true,
  },

  content: {
    type: String,
    required: true,
    maxlength: 1000,
    trim: true,
  },

  media: [
    {
      type: Buffer,
    },
  ],

  minMedia: [
    {
      type: Buffer,
    },
  ],

  parent: {
    type: Schema.Types.ObjectId,
    ref: "post",
    index: true,
    sparse: true,
  },

  rootParent: {
    type: Schema.Types.ObjectId,
    ref: "post",
    index: true,
    sparse: true,
  },

  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  ],

  noComments: {
    type: Boolean,
  },

  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

PostSchema.virtual("mediaCount").get(function () {
  if (this.media) return this.media.length;
  else return 0;
});

PostSchema.virtual("likesCount").get(function () {
  return this.likes.length;
});

PostSchema.statics = {
  addLike: async function (
    postId: Types.ObjectId,
    userId: Types.ObjectId,
  ): Promise<IPostDocument | null> {
    const post = (await this.findById(postId)) as IPostDocument;
    if (!post) return null;

    const result = sortedInsert(post.likes as Types.ObjectId[], userId);
    if (!result) return null;

    await post.save();
    return post;
  },

  deleteLike: async function (
    postId: Types.ObjectId,
    userId: Types.ObjectId,
  ): Promise<IPostDocument | null> {
    const post = (await this.findById(postId)) as IPostDocument;
    if (!post) return null;

    const result = sortedDelete(post.likes as Types.ObjectId[], userId);
    if (!result) return null;

    await post.save();
    return post;
  },
};

PostSchema.methods = {
  doesUserLike: function (userId: Types.ObjectId | string) {
    const doLike = _.sortedIndexOf(
      this.likes.map((like: Types.ObjectId) => like.toString()),
      userId.toString(),
    );

    return doLike !== -1;
  },
};

export const Post = mongoose.model<IPostDocument, IPostModel>(
  "post",
  PostSchema,
);

export const validate = (data: {
  content: string;
  parent?: string;
}): ValidationResult =>
  Joi.object({
    content: Joi.string().min(2).max(1000).required(),
    parent: Joi.string().custom((value, helpers) => {
      const isValid = isValidObjectId(value);
      if (isValid) return value;
      else throw new Error("Parent is invalid");
    }),
  }).validate(data);
