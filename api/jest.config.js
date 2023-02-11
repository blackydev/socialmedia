/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: "ts-jest",
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  testMatch: ["**/*.test.ts"],
  collectCoverage: true,
  testTimeout: 2000,
  verbose: true,
  //  maxWorkers: 1,
  detectOpenHandles: true,
};
