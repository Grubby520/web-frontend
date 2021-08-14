/**
 * nextTick 作用 和 实现原理？
 * 作用：
 * vue 是异步渲染；
 * data 改变之后，DOM并不会立即渲染；
 * $nextTick 会在DOM渲染完毕之后才会调用它的回调函数，主要用于获取更新后的DOM对象；
 * 场景：
 * 一次click事件，整个过程 arr.push(...), 多次改变data只会渲染一次，
 * 目的：
 * 性能优化手段，所有变更放到微任务队列里，一次渲染，必定是异步渲染的方案；
 * 
 * 原理：
 * 
 */
// env 相关
const inBrowser = typeof window !== 'undefined'
const inWeex = typeof WXEnvironment !== 'undefined' && !!WXEnvironment.platform
const weexPlatform = inWeex && WXEnvironment.platform.toLowerCase()
const UA = inBrowser && window.navigator.userAgent.toLowerCase()
const isIE = UA && /msie|trident/.test(UA)
// const isIE9 = UA && UA.indexOf('msie 9.0') > 0
// const isEdge = UA && UA.indexOf('edge/') > 0
// const isAndroid = (UA && UA.indexOf('android') > 0) || (weexPlatform === 'android')
const isIOS = (UA && /iphone|ipad|ipod|ios/.test(UA)) || (weexPlatform === 'ios')
// const isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge
// const isPhantomJS = UA && /phantomjs/.test(UA)
// const isFF = UA && UA.match(/firefox\/(\d+)/)

// 是否使用的微任务
let isUsingMicroTask = false
// 异步任务队列
let callbacks = []
// pending 的作用：保证在同一时刻，浏览器的任务队列中只有一个 flushCallbacks 函数
// pending 为 false，表示现在浏览器的任务队列中没有 flushCallbacks 函数
// pending 为 true，则表示浏览器的任务队列中已经被放入了 flushCallbacks 函数
let pending = false

// flush 刷新任务队列
function flushCallbacks() {
  pending = false // 表示下一个 flushCallbacks 函数可以进入浏览器的任务队列了
  // 技巧教学
  const copies = callbacks.slice(0)
  callbacks.length = 0
  for (let i = 0; i < copies.length; i++) {
    copies[i]();
  }
}

/**
 * 浏览器的任务队列有一个高优先级顺序
 * 1 Promise 微任务队列
 * 2 MutationObserver 它提供了监视对DOM树所做更改的能力
 * 3 setImmediate(非标准)该方法用来把一些需要长时间运行的操作放在一个回调函数里，在浏览器完成后面的其他语句后，就立刻执行这个回调函数
 * 4 setTimeout 宏任务
 */
let timerFunc
// Promise（反向思考：Promise.then 又是怎么实现微任务?）
if (typeof Promise === 'function' && isNative(Promise)) {
  const p = Promise.resolve()
  timerFunc = () => {
    p.then(flushCallbacks) // flushCallbacks 放入微任务队列
    /** ios UIWebViews 要做特殊处理
     * 在有问题的UIWebViews中，Promise.then不会完全中断，但是它可能会陷入怪异的状态，
     * 在这种状态下，回调被推入微任务队列，但队列没有被刷新，直到浏览器需要执行其他工作，例如处理一个计时器。
     * 因此，我们可以通过添加空计时器来“强制”刷新微任务队列。
     */
    if (isIOS) setTimeout(noop);
  }
  isUsingMicroTask = true
} else if (!isIE && typeof MutationObserver === 'function' && isNative(MutationObserver)) {
  // MutationObserver
  let counter = 1;
  const observer = new MutationObserver(flushCallbacks);
  const textNode = document.createTextNode(String(counter)); // 创建 DOM 文本节点
  // .observe() 观察者 监听DOM的变化
  observer.observe(textNode, {
    // 设为 true 以监视指定目标节点或子节点树中节点所包含的字符数据的变化
    characterData: true,
  });
  timerFunc = () => {
    counter = (counter + 1) % 2;
    textNode.data = String(counter);
  };
  isUsingMicroTask = true;
} else if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  // setImmediate MDN - 非标准特性(google 里, undefined)
  timerFunc = () => {
    setImmediate(flushCallbacks)
  }
} else {
  // setTimeout (macro task)
  setTimeout(flushCallbacks, 0)
}

// 对外暴露 nextTick
export function nextTick(cb, ctx) {
  let _resolve
  callbacks.push(() => {
    if (cb) {
      cb.call(ctx)
    } else if (_resolve) {
      _resolve(ctx)
    }
  })
  if (!pending) {
    pending = true
    timerFunc()
  }
  // this.$nextTick().then(() => {}) 不传 cb,返回Promise，等到 _resolve() 执行后，Promise settled，then回调才会执行；
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(resolve => {
      _resolve = resolve
    })
  }
}

// 辅助函数
function isNative(Ctor) {
  return typeof Ctor === 'function' && Ctor.toString().includes('[native code]')
}

// 调用的场景
// 1. $nextTick
Vue.prototype.$nextTick = function(fn) {
  // 用户手动加入浏览器异步任务队列（插队）
  return nextTick(fn, this)
}