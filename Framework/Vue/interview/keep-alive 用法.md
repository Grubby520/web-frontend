作用：保留组件状态 或 避免重新渲染；

### 基本用法

1. 只能用在其一个直属的子组件被开关的场景。且<keep-alive> 要求同时只有一个子元素被渲染。

（1）与特殊的 is attribute 配合使用
<keep-alive>
  <component :is="view"></component>
</keep-alive>

（2）v-if 条件语句（满足条件：同时只有一个被渲染）
<keep-alive>
  <comp-a v-if="a > 1"></comp-a>
  <comp-b v-else></comp-b>
</keep-alive>

（3）做动画，配合 transition 内置组件一起使用
<transition>
  <keep-alive>
    <component :is="view"></component>
  </keep-alive>
</transition>
（4）结合 router 主菜单和详情菜单跳转
<keep-alive>
  <router-view><router-view/>
</keep-alive>

2. 可选参数：
include, exclude, max
类型：属性值可以是 String，Array，RegExp；
匹配规律：name属性，注册时定义在parent的components选项的键值；

3. 多2个生命周期钩子函数
activated, deactivated

### 源码分析

1. 获取组件名
function getComponentName (opts: ?VNodeComponentOptions): ?string {
  return opts && (opts.Ctor.options.name || opts.tag)
}

2. 缓存时匹配 include 和 exclude 的逻辑
function matches (pattern: string | RegExp | Array<string>, name: string): boolean {
  if (Array.isArray(pattern)) {
    return pattern.indexOf(name) > -1
  } else if (typeof pattern === 'string') {
    return pattern.split(',').indexOf(name) > -1
  } else if (isRegExp(pattern)) {
    return pattern.test(name)
  }
  /* istanbul ignore next */
  return false
}

3. this.cache 增删操作
// 需要缓存的
function pruneCache(keepAliveInstance, filter) {}
// 清除缓存的
function pruneCacheEntry(cache, key, keys, current) {}
// max 更新策略
一旦这个数字达到了，在新实例被创建之前，已缓存组件中最久没有被访问的实例会被销毁掉。
remove(keys, key) // prune oldest key
keys.push(key) // 调整key排序
// prune oldest entry
if (this.max && keys.length > parseInt(this.max)) { 
  // 超过缓存数限制，将第一个删除
  pruneCacheEntry(cache, keys[0], keys, this._vnode)
}

4. 定义 keep-alive 组件 对象
{
  abstract: true 独一无二的属性，只有keep-alive 组件才有；
  props：{
    include,
    exclude,
    max
  }
  data: {
    cache: [], // 缓存 vnode
    keys: [] // 缓存 vnode对应的键名
  },
  created () {
    this.cache = Object.create(null)
    this.keys = []
  },
  render() {
    // 根据 include, exclude, max, 更新 cache 和 keys
    // ...
    // cache item 的数据结构
    cache[key]: {
      name,
      tag,
      componentInstance
    }
  },
  mounted() {
    // props 是可变的，需要自定义2个监听函数
    this.$watch('include', val => {
      pruneCache(this, name => matches(val, name))
    })
    this.$watch('exclude', val => {
      pruneCache(this, name => !matches(val, name))
    })
  },
  updated() {
    // 每次切的时候，直接渲染对应的 instance
  },
  destroyed () {
    for (const key in this.cache) {
      // 组件销毁时，清除所有
      pruneCacheEntry(this.cache, key, this.keys)
    }
  }
}

// Vue.prototype.$destroy = function () {
  const vm: Component = this;
  if (vm._isBeingDestroyed) {
    // N多状态，优化手段之一，用boolean来判断（难道是异步任务? -> 可能多次调用）
    return;
  }
  callHook(vm, "beforeDestroy"); // 调用钩子回调函数
  vm._isBeingDestroyed = true; // 正在销毁
  // remove self from parent
  const parent = vm.$parent;
  // !vm.$options.abstract 不会对 keep-alive 缓存的子组件进行清理
  if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
    remove(parent.$children, vm); // 清理与父实例的连接
  }
}

// 抽象组件 不会保持任何状态
export function createComponent () {
  // ...
  if (isTrue(Ctor.options.abstract)) {
    // abstract components do not keep anything
    // other than props & listeners & slot

    // work around flow
    const slot = data.slot
    data = {}
    if (slot) {
      data.slot = slot
    }
  }
  // ...
}

// 动画时
function getRealChild (vnode: ?VNode): ?VNode {
  const compOptions: ?VNodeComponentOptions = vnode && vnode.componentOptions
  if (compOptions && compOptions.Ctor.options.abstract) {
    return getRealChild(getFirstComponentChild(compOptions.children)) // 有且只能有一个子元素
  } else {
    return vnode
  }
}




