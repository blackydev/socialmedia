import { Types } from "mongoose";
import { sortedDelete, sortedInsert } from "../../utils/sortedArray.js";

describe("sortedArray", () => {
  let array: Types.ObjectId[];
  beforeEach(() => {
    array = [
      new Types.ObjectId("507f191e810c19729de86001"),
      new Types.ObjectId("507f191e810c19729de86002"),
      new Types.ObjectId("507f191e810c19729de86003"),
      new Types.ObjectId("507f191e810c19729de86021"),
      new Types.ObjectId("507f191e810c19729de86022"),
      new Types.ObjectId("507f191e810c19729de86023"),
      new Types.ObjectId("507f191e810c19729de86024"),
      new Types.ObjectId("507f191e810c19729de86025"),
      new Types.ObjectId("507f191e810c19729de86026"),
    ];
  });

  describe("sortedInsert", () => {
    it("Should return array", () => {
      const bool = sortedInsert(
        array,
        new Types.ObjectId("507f191e810c19729de86004"),
      );
      expect(bool).toBeTruthy();
      expect(array[3].toString()).toBe("507f191e810c19729de86004");
    });

    it("Should return false if value is already in array", () => {
      const bool = sortedInsert(array, array[2]);
      expect(bool).toBe(false);
    });
  });

  describe("sortedDelete", () => {
    it("Should return array", () => {
      const bool = sortedDelete(array, array[2]);
      expect(bool).toBe(true);
      expect(array[2].toString()).toBe("507f191e810c19729de86021");
    });

    it("Should return -1 if value is already in array", () => {
      const bool = sortedDelete(array, new Types.ObjectId());
      expect(bool).toBe(false);
    });
  });
});
