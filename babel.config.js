function config(api) {
  const presets = ["@babel/preset-env", "@babel/preset-react"];
  const plugins = [
    "@babel/plugin-proposal-class-properties",
    "@babel/plugin-transform-async-to-generator",
    "@babel/plugin-proposal-function-bind"
  ];

  api.cache(true);
  return {
    presets,
    plugins
  };
}

module.exports = config;
