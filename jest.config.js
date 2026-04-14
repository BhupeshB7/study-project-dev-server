export default {
  transform: {},
  testEnvironment: "node",
  moduleNameMapper: {
    "^(\\.\\.?\\/.*)\\.js$": "$1",
  },
  setupFilesAfterEnv: ["./tests/setup.js"],
};
