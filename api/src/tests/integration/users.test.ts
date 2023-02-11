import request from "supertest";
import config from "config";
import jwt from "jsonwebtoken";
import server from "../../app.js";
import { User } from "../../models/user.js";

const endpoint = "/api/users/";

describe("users' route", () => {
  afterAll(async () => {
    server.close();
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  describe("POST /", () => {
    let user: { email: string; name: string; password: string };
    beforeEach(() => {
      user = {
        email: "user@example.com",
        name: "user",
        password: "Password123",
      };
    });
    const exec = () => request(server).post(endpoint).send(user);

    describe("correct request", () => {
      it("Should return 200 status", async () => {
        const { status } = await exec();
        expect(status).toBe(200);
      });

      it("Should return valid token", async () => {
        const { text } = await exec();
        const decoded = jwt.verify(text, config.get("jwtPrivateKey"));
        expect(decoded).toHaveProperty("_id");
        expect(decoded).toHaveProperty("email", "user@example.com");
      });

      it("User should be saved in database", async () => {
        await exec();
        const saved = await User.findOne({ email: user.email });
        expect(saved).toBeTruthy();
      });
    });

    it("Should return 400 status if required fields are missing", async () => {
      user.email = "";
      const { status } = await exec();
      expect(status).toBe(400);
    });

    it("Should return 400 status and error message if email is invalid", async () => {
      user.email = "invalidemail";
      const { status, text } = await exec();
      expect(status).toBe(400);
      expect(text).toBe('"email" must be a valid email');
    });

    it("Should return 400 status and error message if user already exists", async () => {
      await exec();
      const { status, text } = await exec();
      expect(status).toBe(400);
      expect(text).toBe("User with the specified email address already exists");
    });
  });

  describe("PATCH /", () => {
    let token: string, user: { email: string; name: string };

    beforeEach(async () => {
      const savedUser = new User({
        email: "user@example.com",
        name: "user",
      });
      savedUser.setPassword("Password123");
      await savedUser.save();
      token = savedUser.generateAuthToken();

      user = {
        email: "other@example.com",
        name: "new user",
      };
    });

    const exec = async () =>
      request(server).patch(endpoint).set("x-auth-token", token).send(user);

    describe("correct request", () => {
      it("Should return 200 status and valid token", async () => {
        const res = await exec();
        expect(res.status).toBe(200);
        const decoded = jwt.verify(res.text, config.get("jwtPrivateKey"));
        expect(decoded).toHaveProperty("_id");
        expect(decoded).toHaveProperty("email", user.email);
      });

      it("User should be updated in database", async () => {
        await exec();
        const updated = await User.findOne({ email: user.email });
        expect(updated).toBeTruthy();
      });
    });

    it("should return 400 if invalid email is provided", async () => {
      user.email = "invalidEmail";
      const { status } = await exec();

      expect(status).toBe(400);
    });

    it("should return 400 if user with given email already exists", async () => {
      const newUser = new User({
        email: user.email,
        name: "user 2",
      });
      await newUser.save();

      const { status } = await exec();
      expect(status).toBe(400);
    });

    it("should return 400 if user no longer exists", async () => {
      await User.deleteMany({});
      const { status } = await exec();
      expect(status).toBe(400);
    });

    it("should return 401 if not token is provided", async () => {
      token = "";
      const { status } = await exec();
      expect(status).toBe(401);
    });
  });

  describe("PATCH /password", () => {
    let token: string;
    let newPassword: string;

    beforeEach(async () => {
      const user = new User({
        email: "user@example.com",
        name: "user",
        password: "Password123",
      });
      await user.save();
      token = user.generateAuthToken();
      newPassword = "newPassword123";
    });

    const exec = () =>
      request(server)
        .patch(endpoint + "password/")
        .set("x-auth-token", token)
        .send({ password: newPassword });

    it("should return 204 and change password", async () => {
      const { status } = await exec();
      expect(status).toBe(204);
      const user: any = await User.findOne({ email: "user@example.com" });
      expect(user.password).not.toBe("Password123");
    });

    it("Should return 400 if user no longer exists", async () => {
      await User.deleteMany({});
      const { status } = await exec();
      expect(status).toBe(400);
    });

    it("Should return 400 if no password is provided", async () => {
      newPassword = "";
      const { status } = await exec();
      expect(status).toBe(400);
    });

    it("should return 400 if new password is invalid", async () => {
      newPassword = "pass";
      const { status } = await exec();
      expect(status).toBe(400);
    });

    it("should return 401 if token is no provided", async () => {
      token = "";
      const { status } = await exec();
      expect(status).toBe(401);
    });
  });
});
