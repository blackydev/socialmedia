import { Request, Response, NextFunction } from "express";
import sharp from "sharp";

export const convertAvatar = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.file) return res.status(400).send("File is required.");

  req.file.buffer = await sharp(req.file.buffer)
    .resize({ width: 128, height: 128 })
    .webp()
    .toBuffer();

  return next();
};

export const convertPostImgs = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const files = req.files;
  if (!files) return next();

  if (Array.isArray(files)) {
    res.locals.buffers = [] as Buffer[];
    for (const file of files) /** FULL SIZE IMAGE */ {
      const buffer = await sharp(file.buffer)
        .resize(1280, 720, { withoutEnlargement: true, fit: "inside" })
        .webp()
        .toBuffer();

      res.locals.buffers.push(buffer);
    }

    res.locals.minBuffers = [] as Buffer[];
    for (const buffer of res.locals.buffers) /** MINIFY SIZE IMAGE */ {
      const minBuff = await sharp(buffer)
        .resize(580, 326, { withoutEnlargement: true, fit: "inside" })
        .toBuffer();

      res.locals.minBuffers.push(minBuff);
    }
  }

  return next();
};
