微前端的本质是分治的处理前端应用及应用间的关系。

落地微前端架构，涉及三个核心要素：
子应用加载
应用间执行时隔离（css,js）与通信
路由劫持

single-spa 核心，实现了路由劫持，qiankun是对single-spa的一层封装；

子应用加载：
真正去加载解析子应用的逻辑是在 <import-html-entry> 这个包中实现的。

(1) html
前置：配置子应用的entry
处理流程：
通过fetch获取子应用的html字符串（子应用资源必须允许跨域的原因），调用<processTpl>分别获取到内部的js，css，入口脚步entry等。

export default function processTpl(tpl, baseURI) {
  // 省略详细代码，这里是对各种css、js等资源各种写法的预处理，用于规范后面对资源的统一处理
  return {
    template, // html 模板
    scripts, // js 脚本（内联、外联）
    styles, // css 样式表（内联、外联）
    entry: entry || scripts[scripts.length - 1], // 子应用入口 js 脚本文件，如果没有默认以解析后的最后一个 js 脚本代替；
  };
}

(2) css
在拿到子应用的依赖的各种资源关系后，会去通过 fetch 获取 css，并将 css 全部以内联形式嵌入 html 模板中。

function getEmbedHTML(template, styles, opts = {}) {
  const { fetch = defaultFetch } = opts;
  let embedHTML = template;

  // 获取css资源
  // getExternalStyleSheets 同时处理了内联和外联css资源
  // 其中内联资源会获取css code，外联会先fetch 到css code然后处理
  return getExternalStyleSheets(styles, fetch).then((styleSheets) => {
    embedHTML = styles.reduce((html, styleSrc, i) => {
      // 内联处理全部的css资源
      html = html.replace(
        genLinkReplaceSymbol(styleSrc),
        `<style>/* ${styleSrc} */${styleSheets[i]}</style>`
      );
      return html;
    }, embedHTML);
    return embedHTML;
  });
}

处理，所有外联link资源，都内联到style标签里。


(3) js
