import config from "config";
import jwt from "jsonwebtoken";
import { User, validate } from "../../models/user.js";
import IUser from "../../types/user.js";

describe("user's model", () => {
  describe("validate()", () => {
    let email: string, name: string, password: string;

    beforeEach(() => {
      email = "user@example.com";
      name = "user";
      password = "Password123";
    });

    const exec = () => validate({ email, name, password });
    it("should not return error", async () => {
      const result = exec();
      expect(result).toHaveProperty("value");
      expect(result).not.toHaveProperty("error");
    });

    describe("email property", () => {
      it("should return error if email is empty", async () => {
        email = "";
        const result = exec();
        expect(result).toHaveProperty("error");
      });

      it("should return error if email is less than 3 characters", async () => {
        email = "a@a";
        const result = exec();
        expect(result).toHaveProperty("error");
      });

      it("should return error if email is more than 320 characters", async () => {
        email = "a@".padEnd(321, "a");
        const result = exec();
        expect(result).toHaveProperty("error");
      });

      it("should return error if email is not valid", async () => {
        email = "incorrectemail";
        const result = exec();
        expect(result).toHaveProperty("error");
      });
    });

    describe("name property", () => {
      it("should return error if name is empty", async () => {
        name = "";
        const result = exec();
        expect(result).toHaveProperty("error");
      });

      it("should return error if name is too short", async () => {
        name = "a";
        const result = exec();
        expect(result).toHaveProperty("error");
      });

      it("should return error if name is too long", async () => {
        name = "a".repeat(65);
        const result = exec();
        expect(result).toHaveProperty("error");
      });
    });

    describe("password property", () => {
      it("should return error if password is empty", async () => {
        password = "";
        const result = exec();
        expect(result).toHaveProperty("error");
      });
    });
  });

  describe("setPassword method", () => {
    let user: IUser;

    beforeEach(() => {
      user = new User({
        email: "user@example.com",
        name: "User",
      });
    });

    it("should set the password for a valid password", async () => {
      const password = "ValidPassword123";
      await user.setPassword(password);
      expect(user.password).not.toBeNull();
    });

    it("should throw an error for a password that is too short", async () => {
      const password = "Short1";
      const error = await user.setPassword(password);
      expect(error).toBeTruthy();
    });

    it("should throw an error for a password that is too long", async () => {
      const password =
        "ThisIsAReallyReallyReallyReallyReallyReallyReallyReallyLongPassword123";
      const error = await user.setPassword(password);
      expect(error).toBeTruthy();
    });

    it("should throw an error for a password without an uppercase letter", async () => {
      const password = "passwordwithoutupper123";
      const error = await user.setPassword(password);
      expect(error).toBeTruthy();
    });

    it("should throw an error for a password without a lowercase letter", async () => {
      const password = "PASSWORDWITHOUTLOWER123";
      const error = await user.setPassword(password);
      expect(error).toBeTruthy();
    });

    it("should throw an error for a password without a digit", async () => {
      const password = "Passwordwithoutdigit";
      const error = await user.setPassword(password);
      expect(error).toBeTruthy();
    });

    it("should throw an error for a password with spaces", async () => {
      const password = "Password with spaces 123";
      const error = await user.setPassword(password);
      expect(error).toBeTruthy();
    });
  });

  describe("comparePassword method", () => {
    let user: IUser;

    beforeEach(async () => {
      user = new User({
        email: "user@example.com",
        name: "User",
      });
      await user.setPassword("Password12345");
    });

    it("should return true if password is correct", async () => {
      const result = await user.comparePassword("Password12345");
      expect(result).toBe(true);
    });

    it("should return false if password is incorrect", async () => {
      const result = await user.comparePassword("password");
      expect(result).toBe(false);
    });
  });

  describe("toJSON", () => {
    let user = new User({
      email: "user@example.com",
      name: "User",
      password: "Password123",
    });

    it("should delete password", () => {
      const result = JSON.stringify(user);
      expect(result.search("password") < 0).toBeTruthy();
      expect(result.search("email") >= 0).toBeTruthy();
    });

    it("should user object has password field", () => {
      expect(user).toHaveProperty("password");
    });
  });

  describe("generateAuthToken", () => {
    let user = new User({
      email: "user@example.com",
      name: "User",
      password: "Password123",
    });

    it("should generate auth token", () => {
      const token = user.generateAuthToken();
      expect(token).toBeTruthy();
    });

    it("should token be valid", () => {
      const token = user.generateAuthToken();
      const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
      expect(decoded).toHaveProperty("_id");
      expect(decoded).toHaveProperty("email");
      expect(decoded).toHaveProperty("name");
    });
  });
});
