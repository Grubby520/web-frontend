/**
 * computed 和 watch 的区别
 * 他们的每一个属性都会新建一个Watcher实例:
 * computed - 只有 new Watcher()
 * watch - 通过调用 Vue.prototype.$watch, 内部还是 new Watcher(), 返回unwatchFn；
 * 
 * computed:
 * 1.默认 lazy:true, 懒加载，初始值为 undefined；若在template中有使用，render watcher渲染阶段，触发 getter，会调get方法，求值，并调用depend，收集依赖；
 * 2.有缓存，依赖不变，取值时会直接返回上次的结果，使用 dirty 属性来标记是否有依赖的watcher更新；
 * 3.属性是响应式的，依赖更新，同时也会触发 view 更新；
 * 
 * watch:
 * 1.对某个数据进行（深度）监听 deep watching；官方有强调，开销较大的操作，如异步操作或复杂逻辑，放在watch的回调函数；
 * 2.监听引用类型的话，拿不到oldVal；
 * 3.不会产生新的属性；
 */

const vue = {
  computed: {
    show() {
      return this.arr.length
    }
  },
  data() {
    return {
      arr: [1, 2]
    }
  },
  watch: {
    arr(val) {
      console.log(val)
    }
  }
}

function Vue(options) {
  vm._watchers = [] // 收集 watcher
  options.computed && initComputed(this, options.computed)
  options.watch ** initWatch(this, options.watch)
}
// 分析 computed 实现逻辑
const computedWatcherOptions = {
  lazy: true
}

function initComputed(vm, computed) {
  const watchers = (vm._computedWatchers = Object.create(null)) // pure object
  for (const key in computed) {
    const userDef = computed[key]
    // 定义方式：function | get/set
    const getter = typeof userDef === 'function' ? userDef : userDef.get
    // 每一个属性创建一个Watcher实例
    watchers[key] = new Watcher(
      vm,
      getter,
      noop,
      computedWatcherOptions
    )
    // computed属性不要与其他属性冲突
    if (!(key in vm)) {
      // 代理computed的属性到vm实例上，可以通过vm.computedKey访问计算属性，对各个引用属性做缓存管理
      defineComputed(vm, key, userDef)
    }
  }
}

// watcher.js 基本轮廓
class Watcher {
  vm;
  deep;
  user;
  lazy;
  sync;
  cb;
  active;
  dirty;
  value;

  getter; // computed or watch handler

  constructor(vm, expOrFn, cb, options, isRenderWatcher) {
    this.vm = vm // vue 实例
    if (isRenderWatcher) {
      // type 1: render watcher(渲染watcher),专门用来监听 vm 上数据变化然后重新渲染的
      vm._watcher = this // 一个组件一定有一个 renderWatcher
    }
    vm._watchers.push(this) // 至少有一个 vm._update(vm._render(), hydrating)
    // 额外的配置参数
    if (options) {
      this.deep = !!options.deep // user watcher, 存在性能开销
      // type 3: user watcher（用户自定义的 watch 生成的 watcher）
      this.user = !!options.user
      // type 2: lazyWatcher(computedWatcher 计算属性watcher),不会立即求值
      this.lazy = !!options.lazy
      // type 4: sync watcher(只有当我们需要 watch 的值的变化到执行 watcher 的回调函数是一个同步过程的时候才会去设置该属性为 true)
      // directives, 指令的 .sync 同步更新
      this.sync = !!options.sync
    } else {
      // 默认设置
      this.deep = this.user = this.lazy = this.sync = false
    }
    this.cb = cb
    this.active = true
    this.dirty = this.lazy

    if (typeof expOrFn === 'function') {
      this.getter = expOrFn // computed
    } else {
      this.getter = parsePath(expOrFn)
    }
    // computed 不会立即求值，默认为 undefined
    this.value = this.lazy ? undefined : this.get()
  }

  get() {
    let value
    const vm = this.vm
    try {
      value = this.getter.call(vm, vm) // watch 在初始化就会调用，并重新收集依赖
    } catch {

    } finally {
      if (this.deep) {
        traverse(value)
      }
    }
  }

  teardown() { }
}

// watch 的初始化过程 --------------
function initWatch(vm, watch) {
  for (const key in watch) {
    const handler = watch[key]
    // 类型可选 string-去vm实例上找，一般定义在methods里 | Function-最常见 | Object-定义handler属性 | Array-啥情况都有，for循环逐一调用
    // 假如他就是一个函数
    createWatcher(vm, key, handler)
  }
}

function createWatcher(vm, key, handler, options = {}) {
  // watch 初始化调用 Vue.prototype.$watch
  return vm.$watch(key, handler, options)
}

Vue.prototype.$watch = function (key, cb, options = {}) {
  // *** {user: true} 用户自定义的 user watcher;
  options.user = true
  const watcher = new Watcher(this, key, cb, options)
  if (options.immediate) {
    // immediate 是否立即执行
  }
  // 返回取消watchFn
  return function unwatchFn() {
    watcher.teardown() // remove self from vm's watcher list
  }
}


// 辅助函数
function noop(a, b, c) { }

// watch 'a.b': function() {} 特殊处理
function parsePath(path) {
  const segments = path.split(".");
  return function (obj) {
    // 闭包，函数返回一个函数，保持了对父级作用域中segments的引用
    for (let i = 0; i < segments.length; i++) {
      if (!obj) return;
      obj = obj[segments[i]];
    }
    return obj;
  };
}

// traverse.js {deep: true} 深度监听属性，存在性能开销
// study: 使用 Set 数据类型；实现数据缓存，调用 has, add, clear 方法，操作更方便
const seenObjects = new Set()
function traverse(value) {
  // 实际上就是对一个对象做深层递归遍历，因为遍历过程中就是对一个子对象的访问，
  // 会触发它们的 getter 过程，这样就可以收集到依赖，也就是订阅它们变化的 watcher
  // ...
}