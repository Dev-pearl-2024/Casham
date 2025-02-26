module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo", "@babel/preset-flow"], // Add Flow preset
    plugins: [
      "react-native-reanimated/plugin" // Keep reanimated plugin
    ],
    env: {
      production: {
        plugins: ["react-native-paper/babel", "react-native-reanimated/plugin"]
      }
    }
  };
};
