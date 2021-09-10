module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: "app2",
      filename: "remoteEntry.js",
      exposes: {
        "/App": "./src/App.vue",
      },
      shared: {
        vue: {
          singleton: true,
          requiredVersion: "^2.6.0",
        },
      },
    }),
  ],
};
