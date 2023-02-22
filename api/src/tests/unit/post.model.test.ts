import mongoose, { Types } from "mongoose";
import { Post, validate } from "../../models/post.js";
import server from "../../app.js";
import { User } from "../../models/user.js";
import { IPostDocument } from "../../types/post.js";

describe("post's model", () => {
  afterAll(() => server.close());
  describe("validate()", () => {
    let content: string, parent: string;

    const exec = () => validate({ content });
    it("should not return error", async () => {
      content = "aa";
      let result = exec();
      expect(result).toHaveProperty("value");
      expect(result).not.toHaveProperty("error");

      content = "".padEnd(1000, "a");
      result = exec();
      expect(result).toHaveProperty("value");
      expect(result).not.toHaveProperty("error");
    });

    it("should not return error if parent is defined", async () => {
      content = "aa";
      parent = new mongoose.Types.ObjectId().toString();
      const result = validate({ content, parent });
      expect(result).toHaveProperty("value");
      expect(result).not.toHaveProperty("error");
    });

    it("should return error if parent is invalid", async () => {
      content = "aa";
      parent = "123";
      const result = validate({ content, parent });
      expect(result).toHaveProperty("error");
    });

    it("should return error if content is less than 2 letters", async () => {
      content = "a";
      const result = exec();
      expect(result).toHaveProperty("error");
    });

    it("should return error if content is more than 1000 letters", async () => {
      content = "".padEnd(1001, "a");

      const result = exec();
      expect(result).toHaveProperty("error");
    });

    it("should return error if content is empty string", async () => {
      content = "";

      const result = exec();
      expect(result).toHaveProperty("error");
    });
  });

  afterEach(async () => {
    await User.deleteMany({});
    await Post.deleteMany({});
  });

  /*describe("parentRoot getter", () => {
    const exec = async (
      parent?: Types.ObjectId,
      parentRoot?: Types.ObjectId,
    ) => {
      const post = new Post({
        author: new Types.ObjectId(),
        content: "Hello World!",
        parent,
        parentRoot,
      });
      await post.save();
      return post;
    };

    it("should return undefined if post doesn't have any parent", async () => {
      const { _id: postId } = await exec();
      const post = await Post.findById(postId);
      expect(post).not.toHaveProperty("parent");
      expect(post).not.toHaveProperty("parentRoot");
    });

    it("should return undefined if post doesn't have any parent", async () => {
      const parentId = new Types.ObjectId();
      const { _id: postId } = await exec(parentId);
      const post = await Post.findById(postId);
      expect(post).toHaveProperty("parent", parentId);
      expect(post).toHaveProperty("parentRoot", parentId);
    });
  });*/

  describe("doesUserLike", () => {
    it("should return true", () => {
      const id = new Types.ObjectId();
      const post = new Post({
        likes: [
          new Types.ObjectId(),
          new Types.ObjectId(),
          new Types.ObjectId(),
          id,
          new Types.ObjectId(),
          new Types.ObjectId(),
          new Types.ObjectId(),
          new Types.ObjectId(),
          new Types.ObjectId(),
        ],
      });
      post.likes.sort();
      const result = post.doesUserLike(id);
      expect(result).toBe(true);
    });

    it("should return false", () => {
      const post = new Post({
        likes: [
          new Types.ObjectId(),
          new Types.ObjectId(),
          new Types.ObjectId(),
          new Types.ObjectId(),
          new Types.ObjectId(),
          new Types.ObjectId(),
          new Types.ObjectId(),
          new Types.ObjectId(),
        ],
      });
      post.likes.sort();
      const result = post.doesUserLike(new Types.ObjectId());
      expect(result).toBe(false);
    });
  });

  describe("static methods", () => {
    let postId: Types.ObjectId, userId: Types.ObjectId;

    describe("addLike()", () => {
      beforeEach(async () => {
        const post = new Post({
          author: new mongoose.Types.ObjectId(),
          content: "Hello world!",
          likes: [
            new Types.ObjectId(),
            new Types.ObjectId(),
            new Types.ObjectId(),
            new Types.ObjectId(),
            new Types.ObjectId(),
          ],
          likesCount: 5,
        });
        post.likes.sort();
        await post.save();
        postId = post._id;

        const user = new User({
          email: "user@example.com",
          name: "user",
        });
        await user.save();

        userId = user._id;
      });

      const exec = async () => await Post.addLike(postId, userId);

      it("should add like", async () => {
        let post = await exec();
        expect(post.likes.length).toBe(6);
        expect(post.likesCount).toBe(6);

        for (let like of post.likes)
          if ((like as Types.ObjectId).equals(userId) === true)
            expect(true).toBeTruthy();
      });

      it("should don't change anything if answer is already in array", async () => {
        await exec();
        let post = await exec();
        expect(post).toBe(null);
        post = (await Post.findById(postId)) as IPostDocument;
        expect(post.likes.length).toBe(6);
        expect(post.likesCount).toBe(6);
      });
    });

    describe("deleteLike()", () => {
      beforeEach(async () => {
        const user = new User({
          email: "user@example.com",
          name: "user",
        });
        await user.save();

        userId = user._id;

        const post = new Post({
          author: new mongoose.Types.ObjectId(),
          content: "Hello world!",
          likes: [
            userId,
            new Types.ObjectId(),
            new Types.ObjectId(),
            new Types.ObjectId(),
            new Types.ObjectId(),
            new Types.ObjectId(),
          ],
          likesCount: 6,
        });
        post.likes.sort();
        await post.save();
        postId = post._id;
      });
      const exec = async () => await Post.deleteLike(postId, userId);

      it("should remove answer", async () => {
        const res = await exec();
        expect(res.likes.length).toBe(5);
        expect(res.likesCount).toBe(5);

        const post = await Post.findById(postId);
        expect(post?.likes.length).toBe(5);
        expect(post?.likesCount).toBe(5);

        if (!post?.likes) return;
        for (let like of post.likes)
          if ((like as Types.ObjectId).equals(userId) === true)
            expect(true).toBeFalsy();
      });

      it("should don't change anything if id is invalid", async () => {
        userId = new mongoose.Types.ObjectId();
        let post = await exec();
        expect(post).toBe(null);
        post = (await Post.findById(postId)) as IPostDocument;
        expect(post.likes.length).toBe(6);
        expect(post.likesCount).toBe(6);
      });
    });
  });
});
