import { IUserDocument } from "./user.js";

declare global {
  namespace Express {
    interface Request {
      user: IUserDocument;
    }
    interface ResponseLocals {
      buffers?: Buffer[];
      minBuffers?: Buffer[];
    }
  }
}
