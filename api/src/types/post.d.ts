import { Document, Types, Model, ObjectId } from "mongoose";
import { IUserDocument } from "./user.js";

export interface IPostDocument extends Document {
  author: IUserDocument | Types.ObjectId;
  content: string;
  likes:
    | IUserDocument[]
    | Types.ObjectId[] /* sorted array to increase searching performance by binary search */;
  likesCount: number;
  createdAt: Date;
  media?: Buffer[];
  minMedia?: Buffer[] /**minified media */;

  parent: IPostDocument | Types.ObjectId;
  rootParent: IPostDocument | Types.ObjectId;

  noComments?: Boolean;
  mediaCount?: Number;

  doesUserLike(userId: Types.ObjectId): Boolean;
}

export interface IPostModel extends Model<IPostDocument> {
  addLike(
    postId: Types.ObjectId,
    userId: Types.ObjectId,
  ): Promise<IPostDocument>;
  deleteLike(
    postId: Types.ObjectId,
    userId: Types.ObjectId,
  ): Promise<IPostDocument>;
}
