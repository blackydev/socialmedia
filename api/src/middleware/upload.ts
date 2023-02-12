import { Request } from "express";
import multer from "multer";

const fileMaxSize = 1024 * 1024 * 20;

const storage = multer.memoryStorage();

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  let size;
  const contentLength = req.headers["content-length"];
  if (typeof contentLength === "string") size = parseInt(contentLength);
  else size = 0;

  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/webp"
  )
    if (fileMaxSize >= size) return cb(null, true);

  return cb(null, false);
};

const upload = multer({
  storage,
  fileFilter,
});

export default upload;
