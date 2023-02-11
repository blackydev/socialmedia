import User from "./user.js";

export interface Post {
  author: User;
  content: string;
  createdAt: Date;
  media?: [Buffer];
}

export default Post;
