// biome-ignore-all lint: This file is not worth linting
const path = require("path");
const { getConfig } = require("react-native-builder-bob/babel-config");
const pkg = require("../package.json");

const root = path.resolve(__dirname, "..");

module.exports = (api) => {
  api.cache(true);

  return getConfig(
    {
      presets: ["babel-preset-expo"],
    },
    { root, pkg },
  );
};
