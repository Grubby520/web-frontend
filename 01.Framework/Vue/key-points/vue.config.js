const path = require("path");

module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        "@src": path.resolve(__dirname, "src"),
        "@components": path.resolve(__dirname, "src/components"),
        "@share": path.resolve(__dirname, "src/share"),
        // vue: 'vue/dist/vue.esm.js'
      },
    },
  },
};
