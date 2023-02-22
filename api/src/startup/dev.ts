import { User } from "../models/user.js";
import { Post } from "../models/post.js";
import migratePosts from "../db/migratePosts.js";
import migrateUsers from "../db/migrateUsers.js";

export default async () => {
  if (process.env.NODE_ENV === "dev") {
    await User.deleteMany();
    await Post.deleteMany();
    const users = await migrateUsers();
    await migratePosts(users);
  }
};
