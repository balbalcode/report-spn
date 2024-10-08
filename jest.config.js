process.env.TZ = 'GMT';
const configs = {
  moduleFileExtensions: ["js", "json", "vue"],
  moduleNameMapper: {
    ".+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$":
      "identity-obj-proxy",
  },
  watchman: false,
  moduleNameMapper: {
    "^~/(.*)$": "<rootDir>/$1",
    "^~~/(.*)$": "<rootDir>/$1",
    "^@/(.*)$": "<rootDir>/$1",
    "^@utilities/(.*)$": "<rootDir>/utility/components/$1",
  },
  transform: {
    "^.+\\.js$": "<rootDir>/node_modules/babel-jest",
    ".*\\.(vue)$": "<rootDir>/node_modules/vue-jest",
    ".+\\.(css|scss|png|jpg|svg)$": "jest-transform-stub",
  },
  collectCoverageFrom: [
    "<rootDir>/plugins/utilities.js",
    "<rootDir>/components/**/*.vue",
  ],
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  testMatch: ["<rootDir>/tests/**/*.test.js"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
};

if (process.env.MODE === "LOCAL") {
  delete configs.collectCoverage;
  delete configs.collectCoverageFrom;
}

module.exports = {
  ...configs,
};
