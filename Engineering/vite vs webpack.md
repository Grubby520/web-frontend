### Vite
定义：
1.面向现代浏览器的一个更轻、更快的Web应用开发工具，基于ECMAScript 标准原生模块系统（ES Modules）实现。

关键词：
1.轻量
2.按需打包
3.HMR

优点：
1.在浏览器端使用export import的方式导入和导出模块，在 script 标签里设置type="module"，然后使用模块内容。
2.构建速度差不多，但是开发热更新速度快的飞起。

webpack劣势：
1.Dev Server 冷启动时间较长
2.HMR 热更新反应速度较慢

具体说明：
webpack启动：
vue-cli-service serve -> build -> bundle(占用内存) -> run web server
1.所有模块都会提前编译，打包到bundle里，不管模块是否会被执行。随着项目越来越大，bundle越来越大，打包速度自然越来越慢。
2.浏览器并不支持模块化
2.只有通过http请求，大量零散文件请求可能在浏览器端会出现并发问题

vite启动：
vite serve -> run web server -> 编译所有请求的文件 -> 相应  浏览器web工程
                             <- 请求
1.基于ES6的新特性 ESModule import export 实现的。老浏览器兼容问题，采用 Polyfill;
2. esbuild (https://esbuild.github.io/) ,通过go语言对 ts jsx 等的支持，编译上百个ts文件甚至比 tsc 要快几十倍。

