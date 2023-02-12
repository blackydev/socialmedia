import { Request, Response, NextFunction } from "express";
import sharp from "sharp";
import path from "path";

const convertAvatar = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.file) return res.status(400).send("Avatar was not uploaded.");

  req.file.buffer = await sharp(req.file.buffer)
    .resize({ width: 350, height: 350 })
    .webp()
    .toBuffer();

  return next();
};

const convert = {
  avatar: convertAvatar,
};

export default convert;
