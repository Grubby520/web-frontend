const path = require('path')

function resolve (dirName) {
  return path.resolve(__dirname, dirName)
}
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

let config = {
  chainWebpack: config => {
    config.resolve.alias
      .set('@components', resolve('src/components'))

    // config.module
    //   .rule('office')
    //   .test(/\.(xls|docx|xlsx|doc)(\?.*)?$/)
    //   .use('url-loader')
    //   .loader('url-loader')
    //   .tap(options => {
    //     options = {
    //       query: {
    //         limit: 10000,
    //         name: path.posix.join('static', 'fonts/[name].[hash:7].[ext]')
    //       }
    //     }
    //   })
    //   .end()

    // if (process.env.config_report) {
    //   config.plugin('webpack-bundle-analyzer').use(BundleAnalyzerPlugin)
    // }
  },
  configureWebpack: {
    plugins: []
  },
  // lintOnSave: false,
  // transpileDependencies: ['vue-echarts', 'resize-detector'], // vue-cli创建的项目,使用vue-echarts时需要加如此配置
  // devServer: {
  //   port: 8088,
  //   proxy: {
  //     '/api': {
  //       target: process.env.VUE_APP_API_URL + '/',
  //       ws: true,
  //       secure: false,
  //       changeOrigin: true,
  //       pathRewrite: {
  //         '^/api': ''
  //       }
  //     }
  //   }
  // }
}

module.exports = config
