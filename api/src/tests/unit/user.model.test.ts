import config from "config";
import jwt from "jsonwebtoken";
import mongoose, { Types } from "mongoose";
import { User, validate } from "../../models/user.js";
import { IUserDocument } from "../../types/user.js";
import server from "../../app.js";

describe("user's model", () => {
  afterEach(async () => {
    await User.deleteMany({});
  });
  afterAll(() => server.close());
  it("new user should return correct object", async () => {
    const email = "user@example.com";
    const name = "user";
    const user = new User({ email, name });
    expect(user).toHaveProperty("_id");
    expect(user).toHaveProperty("email", email);
    expect(user).toHaveProperty("name", name);
    expect(user).toHaveProperty("followed");
    expect(Array.isArray(user.followed)).toBeTruthy();
    expect(user).toHaveProperty("followersCount", 0);
    expect(user).toHaveProperty("followersCount", 0);
  });

  describe("User Model Methods", () => {
    afterEach(async () => {
      await User.deleteMany({});
    });
    describe("comparePassword", () => {
      let user: IUserDocument;

      beforeEach(async () => {
        const tmp = new User({
          email: "user@example.com",
          name: "User",
        });
        await tmp.save();
        user = (await User.setPassword(
          tmp._id,
          "Password12345",
        )) as IUserDocument;
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

    describe("follower utils", () => {
      let user: IUserDocument;
      beforeEach(async () => {
        user = new User({
          email: "user@example.com",
          name: "User",
          followers: [
            new Types.ObjectId("507f1f77bcf86cd799439010"),
            new Types.ObjectId("507f1f77bcf86cd799439020"),
            new Types.ObjectId("507f1f77bcf86cd799439030"),
            new Types.ObjectId("507f1f77bcf86cd799439040"),
            new Types.ObjectId("507f1f77bcf86cd799439050"),
          ],
          followersCount: 5,
        });
        user.followed = user.followers;
        user.followedCount = user.followersCount;
        await user.save();
      });

      describe("addFollower", () => {
        it("should add follower and change followerCount", () => {
          const mockedObjectId = new Types.ObjectId("507f1f77bcf86cd799439025");
          const bool = user.addFollower(mockedObjectId);
          expect(bool).toBe(true);
          expect(user.followers[2]).toBe(mockedObjectId);
          expect(user.followers.length).toBe(6);
          expect(user.followersCount).toBe(6);
        });

        it("should return false", () => {
          const mockedObjectId = new Types.ObjectId("507f1f77bcf86cd799439020");
          const bool = user.addFollower(mockedObjectId);
          expect(bool).toBe(false);
          expect(user.followers.length).toBe(5);
          expect(user.followersCount).toBe(5);
        });
      });

      describe("deleteFollower", () => {
        it("should delete follower and change followerCount", () => {
          const mockedObjectId = new Types.ObjectId("507f1f77bcf86cd799439020");
          const bool = user.deleteFollower(mockedObjectId);
          expect(bool).toBe(true);
          expect(user.followers[1]).not.toBe(mockedObjectId);
          expect(user.followers.length).toBe(4);
          expect(user.followersCount).toBe(4);
        });

        it("should return false", () => {
          const mockedObjectId = new Types.ObjectId("507f1f77bcf86cd799439025");
          const bool = user.deleteFollower(mockedObjectId);
          expect(bool).toBe(false);
          expect(user.followers.length).toBe(5);
          expect(user.followersCount).toBe(5);
        });
      });

      describe("follow", () => {
        it("should add follower and change followerCount", () => {
          const mockedObjectId = new Types.ObjectId("507f1f77bcf86cd799439025");
          const bool = user.follow(mockedObjectId);
          expect(bool).toBe(true);
          expect(user.followed[2]).toBe(mockedObjectId);
          expect(user.followed.length).toBe(6);
          expect(user.followedCount).toBe(6);
        });

        it("should return false", () => {
          const mockedObjectId = new Types.ObjectId("507f1f77bcf86cd799439020");
          const bool = user.follow(mockedObjectId);
          expect(bool).toBe(false);
          expect(user.followed.length).toBe(5);
          expect(user.followedCount).toBe(5);
        });

        it("should return false if you follow too many users", async () => {
          user.followedCount = 1000;
          await user.save();

          const bool = user.follow(new Types.ObjectId());
          expect(bool).toBe(false);
        });
      });

      describe("unfollow", () => {
        it("should delete follower and change followerCount", () => {
          const mockedObjectId = new Types.ObjectId("507f1f77bcf86cd799439020");
          const bool = user.unfollow(mockedObjectId);
          expect(bool).toBe(true);
          expect(user.followed[1]).not.toBe(mockedObjectId);
          expect(user.followed.length).toBe(4);
          expect(user.followedCount).toBe(4);
        });

        it("should return false", () => {
          const mockedObjectId = new Types.ObjectId("507f1f77bcf86cd799439025");
          const bool = user.unfollow(mockedObjectId);
          expect(bool).toBe(false);
          expect(user.followed.length).toBe(5);
          expect(user.followedCount).toBe(5);
        });
      });
    });
  });

  describe("followed property validation", () => {
    it("Should return exception if followed array has 1001 followers", async () => {
      const email = "user@example.com";
      const name = "user";
      const followed = [];
      for (let i = 1; i < 1001; i++)
        followed.push(mongoose.Types.ObjectId.generate());
      const user = new User({ email, name, followed });
      try {
        await user.save();
      } catch (ex) {
        expect(true).toBeFalsy();
      }
      await User.deleteMany({});
    });
    it("Should return exception if followed array has more than 1001 followers", async () => {
      const email = "user@example.com";
      const name = "user";
      const followed = [];
      for (let i = 0; i < 1001; i++)
        followed.push(mongoose.Types.ObjectId.generate());
      const user = new User({ email, name, followed });
      try {
        await user.save();
        expect(true).toBeFalsy();
      } catch (ex) {}
      await User.deleteMany({});
    });
  });

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

  describe("static methods", () => {
    describe("SetPassword", () => {
      let userId: string;

      beforeEach(async () => {
        const user = new User({
          email: "user@example.com",
          name: "User",
        });
        await user.save();
        userId = user._id;
      });

      it("should set the password for a valid password", async () => {
        const password = "ValidPassword123";
        const user = await User.setPassword(userId, password);
        expect(user).toHaveProperty("password");
      });

      it("should throw an error for a password that is too short", async () => {
        const password = "Short1";
        const error = await User.setPassword(userId, password);
        expect(error).toBeTruthy();
      });

      it("should throw an error for a password that is too long", async () => {
        const password =
          "ThisIsAReallyReallyReallyReallyReallyReallyReallyReallyLongPassword123";
        const error = await User.setPassword(userId, password);
        expect(error).toBeTruthy();
      });

      it("should throw an error for a password without an uppercase letter", async () => {
        const password = "passwordwithoutupper123";
        const error = await User.setPassword(userId, password);
        expect(error).toBeTruthy();
      });

      it("should throw an error for a password without a lowercase letter", async () => {
        const password = "PASSWORDWITHOUTLOWER123";
        const error = await User.setPassword(userId, password);
        expect(error).toBeTruthy();
      });

      it("should throw an error for a password without a digit", async () => {
        const password = "Passwordwithoutdigit";
        const error = await User.setPassword(userId, password);
        expect(error).toBeTruthy();
      });

      it("should throw an error for a password with spaces", async () => {
        const password = "Password with spaces 123";
        const error = await User.setPassword(userId, password);
        expect(error).toBeTruthy();
      });
    });
  });
});
