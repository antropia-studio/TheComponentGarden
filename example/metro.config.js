// biome-ignore-all lint: This file is not worth linting
const path = require("path");
const { getDefaultConfig } = require("@expo/metro-config");

const root = path.resolve(__dirname, "..");

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const defaultConfig = getDefaultConfig(__dirname);

const config = {
  ...defaultConfig,
  resolver: {
    ...defaultConfig.resolver,
    extraNodeModules: {
      "@antropia/the-component-garden-card-carousel": path.resolve(
        root,
        "packages/card-carousel/src",
      ),
    },
    unstable_enablePackageExports: true,
  },
  watchFolders: [root],
};

module.exports = config;
