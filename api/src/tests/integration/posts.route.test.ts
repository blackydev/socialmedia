import request from "supertest";
import { ObjectId, Types } from "mongoose";
import _ from "lodash";
import path from "path";
import server from "../../app.js";
import { User } from "../../models/user.js";
import { Post } from "../../models/post.js";
import Permissions from "../../utils/permisions.js";
import { IUserDocument } from "../../types/user.js";

const endpoint = "/api/posts/";

describe("posts' route", () => {
  let user: IUserDocument, token: string;
  const dirPath = "./src/tests/files/";

  beforeEach(async () => {
    user = new User({
      email: "user1@example.com",
      name: "user",
    });
    await user.save();
    await User.setPassword(user._id, "Password123");
    token = user.generateAuthToken();
  });

  afterEach(async () => {
    await User.deleteMany({});
    await Post.deleteMany({});
  });

  afterAll(async () => server.close());

  describe("GET /:id", () => {
    let postId: ObjectId | string;

    beforeEach(async () => {
      const posts = [];
      for (let i = 0; i < 1001; i++)
        posts.push(
          new Post({
            author: new Types.ObjectId(),
            content: "Hi!",
          }),
        );
      await Post.insertMany(posts);
    });

    const exec = () => request(server).get(endpoint).set("x-auth-token", token);

    it("should return 200 and posts", async () => {
      const { body } = await exec().expect(200);
      expect(body).toBeTruthy();
      expect(body.length).toBe(1000);
    });

    it("should return 200 and posts from second page", async () => {
      const { body } = await exec().query({ page: 1 }).expect(200);
      expect(body).toBeTruthy();
      expect(body.length).toBe(1);
    });

    it("should return 200 and posts if page is wrong", async () => {
      const { body } = await exec().query({ page: "a" }).expect(200);
      expect(body).toBeTruthy();
      expect(body.length).toBe(1000);
    });
  });

  describe("GET /:id", () => {
    let postId: ObjectId | string;

    beforeEach(async () => {
      const data = "Hello, World!"; // string or array of bytes to create buffer from
      const buffer = Buffer.from(data); // create buffer from data
      const post = new Post({
        author: new Types.ObjectId(),
        content: "Hi!",
        media: [buffer, buffer],
        likes: [
          user._id,
          new Types.ObjectId(),
          new Types.ObjectId(),
          new Types.ObjectId(),
          new Types.ObjectId(),
        ],
        likesCount: 5,
        parent: new Types.ObjectId(),
      });
      post.likes.sort();
      postId = post._id;
      await post.save();
    });

    const exec = () =>
      request(server)
        .get(path.join(endpoint, postId.toString()))
        .set("x-auth-token", token);

    it("should return 200 and post", async () => {
      const { body } = await exec().expect(200);
      expect(body).toHaveProperty("_id");
      expect(body).toHaveProperty("content", "Hi!");
      expect(body).toHaveProperty("author");
      expect(body).toHaveProperty("createdAt");
      expect(body).toHaveProperty("parent");
      expect(body).not.toHaveProperty("media");
      expect(body).toHaveProperty("mediaCount", 2);
      expect(body).toHaveProperty("liked", true);
      expect(body).toHaveProperty("likesCount", 5);
      expect(body).not.toHaveProperty("likes");
    });

    it("should return 404 if post does not exist", async () => {
      await Post.deleteMany({});
      await exec().expect(404);
    });
  });

  describe("GET /:id/media/:index", () => {
    let postId: ObjectId | string, index: number | string;

    beforeEach(async () => {
      const data = "Hello, World!"; // string or array of bytes to create buffer from
      const buffer = Buffer.from(data); // create buffer from data
      const post = new Post({
        author: new Types.ObjectId(),
        content: "Hi!",
        media: [buffer, buffer],
        likes: [
          user._id,
          new Types.ObjectId(),
          new Types.ObjectId(),
          new Types.ObjectId(),
          new Types.ObjectId(),
        ],
        likesCount: 5,
        parent: new Types.ObjectId(),
      });
      post.likes.sort();
      postId = post._id;
      await post.save();
      index = 0;
    });

    const exec = () =>
      request(server)
        .get(path.join(endpoint, postId.toString(), "/media", index.toString()))
        .set("x-auth-token", token);

    it("should return 200 and media", async () => {
      const { body } = await exec().expect(200);
      expect(body).toBeTruthy();
    });

    it("should return 400 if index is not a number", async () => {
      index = "a";
      await exec().expect(400);
    });

    it("should return 400 if index is less than 0", async () => {
      index = -1;
      await exec().expect(400);
    });

    it("should return 400 if index is greater than 3", async () => {
      index = 4;
      await exec().expect(400);
    });

    it("should return 400 if index is out of bound", async () => {
      index = 3;
      await exec().expect(400);
    });

    it("should return 400 if post does not have media", async () => {
      await Post.findByIdAndUpdate(postId, { $unset: { media: true } });
      await exec().expect(400);
    });

    it("should return 404 if post does not exist", async () => {
      await Post.deleteMany({});
      await exec().expect(404);
    });
  });

  describe("GET /:id/minMedia/:index", () => {
    let postId: ObjectId | string, index: number | string;

    beforeEach(async () => {
      const data = "Hello, World!"; // string or array of bytes to create buffer from
      const buffer = Buffer.from(data); // create buffer from data
      const post = new Post({
        author: new Types.ObjectId(),
        content: "Hi!",
        minMedia: [buffer, buffer],
        likes: [
          user._id,
          new Types.ObjectId(),
          new Types.ObjectId(),
          new Types.ObjectId(),
          new Types.ObjectId(),
        ],
        likesCount: 5,
        parent: new Types.ObjectId(),
      });
      post.likes.sort();
      postId = post._id;
      await post.save();
      index = 1;
    });

    const exec = () =>
      request(server)
        .get(
          path.join(endpoint, postId.toString(), "/minMedia", index.toString()),
        )
        .set("x-auth-token", token);

    it("should return 200 and media", async () => {
      const { body } = await exec().expect(200);
      expect(body).toBeTruthy();
    });

    it("should return 400 if index is not a number", async () => {
      index = "a";
      await exec().expect(400);
    });

    it("should return 400 if index is less than 0", async () => {
      index = -1;
      await exec().expect(400);
    });

    it("should return 400 if index is greater than 3", async () => {
      index = 4;
      await exec().expect(400);
    });

    it("should return 400 if index is out of bound", async () => {
      index = 3;
      await exec().expect(400);
    });

    it("should return 400 if post does not have media", async () => {
      await Post.findByIdAndUpdate(postId, { $unset: { minMedia: true } });
      await exec().expect(400);
    });

    it("should return 404 if post does not exist", async () => {
      await Post.deleteMany({});
      await exec().expect(404);
    });
  });

  describe("GET /:id/comments", () => {
    let parentId: ObjectId | string;

    beforeEach(async () => {
      const parent = new Post({
        author: new Types.ObjectId(),
        content: "I'm parent",
        likesCount: 5,
      });
      await parent.save();
      parentId = parent._id;

      for (let i = 0; i < 5; i++) {
        const post = new Post({
          author: new Types.ObjectId(),
          content: "I'm child",
          likesCount: i,
          parent: parent._id,
        });
        await post.save();
      }
    });

    const exec = () =>
      request(server)
        .get(path.join(endpoint, parentId.toString(), "/comments"))
        .set("x-auth-token", token);

    it("should return 200 and post", async () => {
      const { body } = await exec().expect(200);
      expect(Array.isArray(body)).toBe(true);
      expect(body.length).toBe(5);
    });
  });

  describe("POST /", () => {
    let content: string;
    beforeEach(() => (content = "Hello world!"));

    const exec = () =>
      request(server)
        .post(endpoint)
        .set("x-auth-token", token)
        .field("content", content);

    describe("correct requests", () => {
      it("Should return 200 and saved post", async () => {
        const { body } = await exec().expect(200);
        let post = await Post.findById(body);
        expect(post?.author.toString()).toBe(user._id.toString());
        expect(post).toHaveProperty("content", content);
        expect(post).toHaveProperty("noComments", true);
        expect(post?.media?.length).toBe(0);
      });

      it("Should return 200 and saved post with uploaded images", async () => {
        const { body } = await exec()
          .attach("images", dirPath + "img.webp")
          .attach("images", dirPath + "img.jpg")
          .expect(200);

        let post = await Post.findById(body);
        expect(post).toHaveProperty("_id");
        expect(post?.author.toString()).toBe(user._id.toString());
        expect(post).toHaveProperty("content", content);
        expect(post).toHaveProperty("media");
        expect(_.isArray(post?.media)).toBeTruthy();
        expect(post?.media?.length).toBe(2);
        expect(_.isArray(post?.minMedia)).toBeTruthy();
        expect(post?.minMedia?.length).toBe(2);
      });

      it("Should return 200 and saved post if parent is defined", async () => {
        const parent = new Post({
          content: "xyz",
          author: new Types.ObjectId(),
        });
        await parent.save();
        const parentId = parent._id.toString();
        const { body } = await exec().field("parent", parentId);

        const post = await Post.findById(body);
        expect(post).toHaveProperty("_id");
        expect(post?.author.toString()).toBe(user._id.toString());
        expect(post).toHaveProperty("content", content);
        expect(post).toHaveProperty("media");
        expect(post?.parent.toString()).toBe(parentId);
        expect(post).not.toHaveProperty("grandParent");
        expect(_.isArray(post?.media)).toBeTruthy();
        expect(post?.media?.length).toBe(0);

        const parentPost = await Post.findById(parentId);
        expect(parentPost).toHaveProperty("noComments", undefined);
      });

      it("Should inherit root parent if is defined", async () => {
        const rootId = new Types.ObjectId();
        const parent = new Post({
          content: "xyz",
          author: new Types.ObjectId(),
          rootParent: rootId,
        });
        await parent.save();

        const { body } = await exec().field("parent", parent._id.toString());
        const post = await Post.findById(body);
        expect(post?.rootParent.toString()).toBe(rootId.toString());
      });

      it("Should return 200 and saved post if parent which is parent of other post is defined", async () => {
        let res = await exec();
        const rootParentId = res.body;

        res = await exec().field("parent", rootParentId);
        const parentId = res.body;

        const { body } = await exec().field("parent", parentId);

        const post = await Post.findById(body);
        expect(post).toHaveProperty("_id");
        expect(post?.author.toString()).toBe(user._id.toString());
        expect(post).toHaveProperty("content", content);
        expect(post).toHaveProperty("media");
        expect(post?.parent.toString()).toBe(parentId.toString());
        expect(post?.rootParent.toString()).toBe(rootParentId.toString());
        expect(post?.rootParent.toString()).toBe(rootParentId.toString());
        expect(_.isArray(post?.media)).toBeTruthy();
        expect(post?.media?.length).toBe(0);
      });
    });

    describe("incorrect requests", () => {
      it("Should return 401 if no token is provided", async () => {
        token = "";
        await exec().expect(401);
      });

      it("Should return 400 if content is too short", async () => {
        content = "A";
        await exec().expect(400);
      });

      it("Should return 400 if content is not provided", async () => {
        await request(server)
          .post(endpoint)
          .set("x-auth-token", token)
          .expect(400);
      });

      it("Should return 400 if parent ID is invalid", async () => {
        const parentId = new Types.ObjectId().toString();
        await exec().field("parent", parentId).expect(400);
      });
    });
  });

  describe("PATH /:id/like", () => {
    let postId: string;

    const setPost = async (likes: IUserDocument[]) => {
      const post = new Post({
        author: new Types.ObjectId(),
        content: "Hi!",
        likes: likes,
        likesCount: likes.length,
      });
      post.likes.sort();
      await post.save();
      postId = post._id.toString();
    };

    const exec = () =>
      request(server)
        .patch(path.join(endpoint, postId, "/like"))
        .set("x-auth-token", token)
        .send();

    it("should return 204 and update post", async () => {
      await setPost([]);
      await exec().expect(204);
      const post = await Post.findById(postId);
      expect(post?.likes.length).toBe(1);
      expect(post?.likesCount).toBe(1);
    });

    it("should return 400 and not update post if user liked a post before", async () => {
      await setPost([user._id]);
      await exec().expect(400);
      const post = await Post.findById(postId);
      expect(post?.likes.length).toBe(1);
      expect(post?.likesCount).toBe(1);
    });

    it("should return 401 if token is not provided", async () => {
      token = "";
      await setPost([]);
      await exec().expect(401);
    });
  });

  describe("PATH /:id/unlike", () => {
    let postId: string;

    const setPost = async (likes: IUserDocument[]) => {
      const post = new Post({
        author: new Types.ObjectId(),
        content: "Hi!",
        likes: likes,
        likesCount: likes.length,
      });
      post.likes.sort();
      await post.save();
      postId = post._id.toString();
    };

    const exec = () =>
      request(server)
        .patch(path.join(endpoint, postId, "/unlike"))
        .set("x-auth-token", token)
        .send();

    it("should return 204 and update post", async () => {
      await setPost([user._id]);
      await exec().expect(204);
      const post = await Post.findById(postId);
      expect(post?.likes.length).toBe(0);
      expect(post?.likesCount).toBe(0);
    });

    it("should return 400 and not update post if user unlike the post which had not like before", async () => {
      await setPost([]);
      await exec().expect(400);
      const post = await Post.findById(postId);
      expect(post?.likes.length).toBe(0);
      expect(post?.likesCount).toBe(0);
    });

    it("should return 401 if token is not provided", async () => {
      token = "";
      await setPost([]);
      await exec().expect(401);
    });
  });

  describe("DELETE /:id", () => {
    let postId: string;
    beforeEach(async () => {
      const post = new Post({ author: user._id, content: "Hi!" });
      await post.save();
      postId = post._id.toString();

      const posts = [];
      for (let i = 0; i < 10; i++) {
        posts.push(
          new Post({
            author: new Types.ObjectId(),
            content: "Hi!",
            rootParent: postId,
          }),
        );
      }
      Post.insertMany(posts);
    });

    const exec = () =>
      request(server)
        .delete(path.join(endpoint, postId))
        .set("x-auth-token", token)
        .send();

    it("should return 204 and delete post", async () => {
      await exec().expect(204);
      const posts = await Post.find({});
      expect(posts.length).toBe(0);
    });

    it("should return 204 and delete post if user has admin permission", async () => {
      const user = new User({ permissions: Permissions.posts });
      token = user.generateAuthToken();
      await exec().expect(204);
      const posts = await Post.find({});
      expect(posts.length).toBe(0);
    });

    it("should return 404 if post with given ID does not exist", async () => {
      await Post.deleteMany({});
      await exec().expect(404);
    });

    it("should return 401 if user does not have permissions", async () => {
      const user = new User({});
      token = user.generateAuthToken();
      await exec().expect(401);
      const post = await Post.findById(postId);
      expect(post).toBeTruthy();
    });
  });
});
