# vue-loader 加载并编译 Vue组件
Single-File-Components(SFCs)

允许为 Vue 组件的每个部分使用其它的 webpack loader，例如在 <style> 的部分使用 Sass 和在 <template> 的部分使用 Pug；
允许在一个 .vue 文件中使用自定义块，并对其运用自定义的 loader 链；
使用 webpack loader 将 <style> 和 <template> 中引用的资源当作模块依赖来处理；
为每个组件模拟出 scoped CSS；
在开发过程中使用热重载来保持状态。

# 思考一下，没有 Vue-Cli，需要哪些配置
1. npm i -D vue-loader vue-template-compiler

PS: vue 和 vue-template-complier 包的版本基本上保持同步。即为 升级 vue，同步必须升级 vue-template-complier;

2. webpack 配置

const { VueLoaderPlugin } = require('vue-loader')
{
  module: {
    rules: [
      // ... 其它规则
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      }
    ]
  },
  plugins: [
    // 请确保引入这个插件！
    // 将你定义的其他规则复制并应用到.vue文件里对应的语言的块
    new VueLoaderPlugin()
  ]
}

VueLoaderPlugin 作用到vue中的 script(js)，style(css);

3. template 模板里

  （1）Assets 资源路径
  图片：<img src="../image.png"> 当成模块处理
  css： import "@/common.scss" 使用 sass-loader css-loader 等等;

  （2）URL 转换规则
  /xx
  ./xx
  ~xx 
  @/xx
  vue-cli 内置了相关配置 file-loader, url-loader ...
  file-loader: 版本哈希命名以获取更好的缓存；打包输出重写路径为正确的url；
  url-loader: 像图片转 base64 url,减少 HTTP 请求；


4. style 预处理器
  npm i -D sass-loader node-sass

  {
    test: /\.scss$/,
    use: [
      'vue-style-loader',
      'css-loader',
      'sass-loader' // parser 顺序：后向前
    ]
  }

  * 【Scoped CSS】
  了解一下 <Shadow DOM>
  1. 使用 scoped 后，父组件的样式将不会渗透到子组件中。不过一个子组件的根节点会同时受其父组件的 scoped CSS 和子组件的 scoped CSS 的影响；
  2. 样式穿透 使用 >>> , Sass 使用 /deep/ 或 ::v-deep 操作符；
  3. v-html 动态生成的内容，只能 深度作用选择器

  DOM 被添加 id属性 <div data-v-fae5bece class="a">
  CSS .a[data-v-fae5bece] {}

  * [ CSS Modules ]
  1. 配置：
  {
    test: /\.css$/,
    use: [
      'vue-style-loader',
      {
        loader: 'css-loader',
        options: {
          // 开启 CSS Modules
          modules: true,
          // 自定义生成的类名
          localIdentName: '[local]_[hash:base64:8]'
        }
      }
    ]
  }

  2. oneOf 规则 + resourceQuery 字符串检查
  作用：部分 Vue 组件中使用 CSS Modules
  {
    test: /\.css$/,
    oneOf: [
      // `<style module> <style module="a">`
      {
        resourceQuery: /module/,
        use: [...]
      },
      // `<style>` 或 `<style scoped>`
      {
        use: [...]
      }
    ]
  }

  3. css module + sass + vue-style-loader
  PS: 最符合实际开发应用场景
  {
    test: /\.scss$/,
    use: [
      'vue-style-loader',
      {
        loader: 'css-loader',
        options: {
          modules: true,
          localIdentName: '[local]_[hash:base64:8]'
        }
      },
      'sass-loader'
    ]
  }

* 【 hot reload 热重载 】

  1. 状态保留规则
  template: 会保留当前所有的私有状态。是因为模板被编译成了新的无副作用的渲染函数；
  script: 该组件实例会被销毁并重建。是因为它可能包含带有副作用的生命周期钩子，所以重新加载并不是重新渲染，以确保组件行为的一致性；
  style: 通过 vue-style-loader 自行热重载，不影响应用的状态；

  开启：webpack-dev-server --hot

? [ 自定义块 ]

* 【 CSS 提取 】
  根据 webpack 版本使用对应的插件
  webpack 4: mini-css-extract-plugin
  webpack 3: extract-text-webpack-plugin

* 【 Linting 】
  1. eslintrc.js 中使用相关插件
    vue官方：eslint-plugin-vue (check the <template> and <script> of .vue files with ESLint, Vue code in .js files);

    配置：
    区分 Vue 2.x 和 Vue 3.x
    https://eslint.vuejs.org/user-guide/#usage
    "plugin:vue/base";
    "plugin:vue/essential", "plugin:vue/recommended";
    "plugin:vue/vue3-essential", "plugin:vue/vue3-recommended";

    再深入：
    ESTree docs;
    vue-eslint-parser AST docs;

  2. vue代码实时校验,需要 loader 的支持
    依赖：npm i -D eslint eslint-loader
    {
      rules: [
        {
          enforce: 'pre', // 作为 pre-loader 使用
          test: /\.(js|vue)$/, // 针对 js 和 vue 文件
          loader: 'eslint-loader',
          exclude: /node_modules/
        }
      ]
    }

  3. 如何查看 vue 项目的 webpack 配置?
  vue inspect --help
  输入文件：vue inspect --mode development >> webpack.config.dev.js
  输入文件：vue inspect --mode production >> webpack.config.dev.js
  
