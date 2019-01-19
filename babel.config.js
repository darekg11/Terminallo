function config() {
  const presets = ['@babel/preset-env', '@babel/preset-react', '@babel/preset-stage-0'];
  const plugins = ['@babel/plugin-transform-async-to-generator'];

  return {
    presets,
    plugins,
  };
}

module.exports = config;
