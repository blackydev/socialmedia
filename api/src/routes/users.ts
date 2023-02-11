import express, { Request, Response } from "express";
import { validate, User } from "../models/user.js";
import auth, { AuthReponse } from "../middleware/auth.js";
const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  const body = req.body as { email: string; password: string; name: string };

  const { error } = validate(body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: body.email });
  if (user)
    return res
      .status(400)
      .send("User with the specified email address already exists");

  user = new User({ ...body, password: undefined });
  user.setPassword(body.password);
  await user.save();
  const token = user.generateAuthToken();
  res.send(token);
});

router.patch("/", auth, async (req: Request, res: Response & AuthReponse) => {
  const body = req.body as { email: string; name: string };
  const { error } = validate(body);
  if (error) return res.status(400).send(error.details[0].message);
  if (res.locals.user.email !== body.email) {
    const user = await User.findOne({ email: body.email });
    if (user)
      return res
        .status(400)
        .send("User with the specified email address already exists");
  }
  const user = await User.findByIdAndUpdate(
    res.locals.user._id,
    {
      email: body.email,
      name: body.name,
    },
    { new: true }
  );
  if (!user)
    return res
      .status(400)
      .send("User with the specified email address no longer exists.");

  const token = user.generateAuthToken();
  res.send(token);
});

router.patch(
  "/password",
  auth,
  async (req: Request, res: Response & AuthReponse) => {
    const { password } = req.body as { password: string };

    const user = await User.findById(res.locals.user._id);
    if (!user)
      return res
        .status(400)
        .send("User with the specified email address no longer exists.");

    const error = await user.setPassword(password);
    if (error) return res.status(400).send(error.message);

    await user.save();

    res.status(204).send();
  }
);

export default router;
