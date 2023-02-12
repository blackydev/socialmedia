import express, { Express, Request, Response } from "express";
import request from "supertest";
import upload from "../../middleware/upload.js";

const app: Express = express();

app.post("/", upload.single("image"), (req: Request, res: Response) => {
  if (req.file) return res.send(req.file.buffer);
  res.status(400).send();
});
const server = app.listen();

describe("upload middleware", () => {
  let filename: string;

  afterAll(() => {
    server.close();
  });

  const exec = () =>
    request(server)
      .post("/")
      .attach("image", "./src/tests/files/" + filename);

  it("should return buffer if image is webp", async () => {
    filename = "img.webp";
    const res = await exec();
    expect(res.status).toBe(200);
    expect(Buffer.isBuffer(res.body)).toBeTruthy();
  });

  it("should return buffer if image is png", async () => {
    filename = "img.png";
    const res = await exec();
    expect(res.status).toBe(200);
    expect(Buffer.isBuffer(res.body)).toBeTruthy();
  });

  it("should return buffer if image is jpg", async () => {
    filename = "img.jpg";
    const res = await exec();
    expect(res.status).toBe(200);
    expect(Buffer.isBuffer(res.body)).toBeTruthy();
  });

  it("should return 400 if image is too big", async () => {
    filename = "21mb.png";
    const { status } = await exec();
    expect(status).toBe(400);
  });

  it("should return 400 if file is not image", async () => {
    filename = "file.txt";
    const { status } = await exec();
    expect(status).toBe(400);
  });

  it("should return 400 if image is not passed", async () => {
    const res = await request(server).post("/");
    expect(res.status).toBe(400);
  });
});
