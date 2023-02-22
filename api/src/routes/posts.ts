import express, { Request, Response } from "express";
import _ from "lodash";
import { Types } from "mongoose";
import { Post, validate } from "../models/post.js";
import auth from "../middleware/auth.js";
import upload from "../middleware/upload.js";
import validateObjectId from "../middleware/validateObjectId.js";
import perms from "../middleware/perms.js";
import { User } from "../models/user.js";
const router = express.Router();

router.get("/", auth, async (req: Request, res: Response) => {
  let page = 0;
  if (typeof req.query.page === "string") {
    page = parseInt(req.query.page);
    if (isNaN(page)) page = 0;
  }

  const posts = await Post.find({ parent: { $exists: false } })
    .select("_id createdAt")
    .sort("-createdAt")
    .limit(1000)
    .skip(1000 * page);

  const data = posts.map((post) => post._id);
  res.send(data);
});

router.get("/followed", auth, async (req: Request, res: Response) => {
  const user = await User.findById(req.user._id).select("followed");
  if (!user) return res.status(400).send("Invalid token.");

  let page = 0;
  if (typeof req.query.page === "string") {
    page = parseInt(req.query.page);
    if (isNaN(page)) page = 0;
  }

  const posts = await Post.find({
    parent: { $exists: false },
    author: { $in: user.followed },
  })
    .select("_id createdAt")
    .sort("-createdAt")
    .limit(1000)
    .skip(1000 * page);

  const data = posts.map((post) => post._id);
  res.send(data);
});

router.get(
  "/:id",
  [validateObjectId, auth],
  async (req: Request, res: Response) => {
    const post = await Post.findById(req.params.id)
      .select(
        "author content likesCount parent createdAt media likes noComments",
      )
      .populate("author", "name");

    if (!post)
      return res.status(404).send("Post with the given ID does not exist.");

    const doesUserLike = post.doesUserLike(req.user._id);
    res.send({
      ..._.pick(post, [
        "_id",
        "author",
        "content",
        "parent",
        "likesCount",
        "createdAt",
        "noComments",
        "mediaCount",
      ]),
      liked: doesUserLike,
    });
  },
);

router.get(
  "/:id/media/:index",
  [validateObjectId],
  async (req: Request, res: Response) => {
    const index = parseInt(req.params.index);
    if (isNaN(index) || index < 0 || index >= 4)
      return res
        .status(400)
        .send("Index should be greater or equal than 0 and less than 4");

    const post = await Post.findById(req.params.id).select("media");

    if (!post)
      return res.status(404).send("Post with the given ID does not exist.");

    if (!post.media?.[index])
      return res.status(400).send("Invalid media's index");

    res.send(post.media[index]);
  },
);

router.get(
  "/:id/minMedia/:index",
  [validateObjectId],
  async (req: Request, res: Response) => {
    const index = parseInt(req.params.index);
    if (isNaN(index) || index < 0 || index >= 4)
      return res
        .status(400)
        .send("Index should be greater or equal than 0 and less than 4");

    const post = await Post.findById(req.params.id).select("minMedia");

    if (!post)
      return res.status(404).send("Post with the given ID does not exist.");

    if (!post.minMedia?.[index])
      return res.status(400).send("Invalid media's index");

    res.send(post.minMedia[index]);
  },
);

router.get(
  "/:id/comments",
  [validateObjectId, auth],
  async (req: Request, res: Response) => {
    const posts = await Post.find({
      parent: req.params.id,
    })
      .select("_id likesCount")
      .sort("-likesCount");

    res.send(posts.map((post) => post._id));
  },
);

router.post(
  "/",
  [auth, ...upload.post],
  async (req: Request, res: Response) => {
    const body = req.body as { content: string; parent?: string };

    const { error } = validate(body);
    if (error) return res.status(400).send(error.details[0].message);

    let rootParent;

    if (body.parent) {
      const post = await Post.findByIdAndUpdate(
        body.parent,
        {
          $unset: { noComments: 1 },
        },
        { new: true },
      );
      if (!post)
        return res
          .status(400)
          .send("You can not answer to post which does not exist.");

      if (post.rootParent) rootParent = post.rootParent;
      else if (post.parent) rootParent = post.parent;
    }

    const post = new Post({
      author: req.user._id,
      content: body.content,
      parent: body.parent,
      rootParent: rootParent,
      media: res.locals.buffers,
      minMedia: res.locals.minBuffers,
      noComments: true,
    });

    await post.save();
    res.send(post._id);
  },
);

router.patch(
  "/:id/like",
  [validateObjectId, auth],
  async (req: Request, res: Response) => {
    const post = await Post.addLike(
      new Types.ObjectId(req.params.id),
      req.user._id,
    );

    if (!post)
      return res.status(400).send("Post with given ID does not exist.");

    res.status(204).send();
  },
);

router.patch(
  "/:id/unlike",
  [validateObjectId, auth],
  async (req: Request, res: Response) => {
    const post = await Post.deleteLike(
      new Types.ObjectId(req.params.id),
      req.user._id,
    );

    if (!post)
      return res.status(400).send("Post with given ID does not exist.");

    res.status(204).send();
  },
);

router.delete(
  "/:id",
  [validateObjectId, auth, perms.posts],
  async (req: Request, res: Response) => {
    await Post.findByIdAndDelete(req.params.id);
    const childs = await Post.find({
      $or: [{ rootParent: req.params.id }, { parent: req.params.id }],
    });
    for (const child of childs) await child.delete();

    res.status(204).send();
  },
);

export default router;
