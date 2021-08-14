特点：
abstract component，内置的抽象组件；
自身不会渲染成DOM，也不会出现在父组件链中（就像template）；
包裹的动态组件会保留组件状态，避免重新渲染；
多2个生命周期钩子函数：activated，deactivated；

注意点：
只能用在其一个直属的子组件被开关的场景；
要求同时有且只有一个子元素被渲染；

使用场景：
与特殊的 is attribute 配合使用；
v-if 条件语句；
transition 包裹；
包裹 router，列表跳详情页，返回时保持主页状态；

```javascript
<keep-alive>
  <component :is="view"></component>
</keep-alive>
 
 <keep-alive>
  <comp-a v-if="a > 1"></comp-a>
  <comp-b v-else></comp-b>
</keep-alive>
 
 <transition>
  <keep-alive>
    <component :is="view"></component>
  </keep-alive>
</transition>
 
<keep-alive :include="whiteList" :exclude="blackList" :max="max">
  <router-view><router-view/>
</keep-alive>
```

### 设计原理
初始化2个数组 cache, keys 分别缓存 VNode 和 VNode对应的键名集合；
mounted里监听 include 和 exclude，动态更新缓存；
有2个核心方法，pruneCache 和 pruneCacheEntry；
render函数是核心
获取keep-alive包裹的第一个子组件VNode和组件名name
判断name与include和exclude的关系，如果 not included 或 excluded，直接返回该 vnode
根据Ctor（Component）的id和tag，生成key
如果没有缓存，则用2个变量 vondeToCache, keyToCache 保存当前 vnode 和 对应的键名
如果有缓存，vnode.componentInstance 组件实例直接从缓存里通过key获取
vnode.data.keepAlive = true，组件实例的keepAlive 属性值为true，与钩子函数有关
最终都会触发 updated 钩子函数，收集缓存
updated钩子函数，再更新缓存
destroyed钩子函数，清空缓存，并对每一个vnode对应的实例，调用 $destroy()

### 相关扩展：
为什么keep-alive不会生成DOM？
在初始化阶段，initLifecycle 时，会逆向上递归，找到第一个 non-abstract parent
然后 parent.$children 中收集vm实例，自然跳过了 keep-alive组件

### 包裹的组件具体是如何使用缓存的？
createComponent 创建组件函数
通过 componentInstance 和 data.keepAlive 属性，判断是否走 insert() 直接把缓存的DOM实例插入到父元素中

被包裹的组件，为什么生命周期只会触发一次？而activated 和 deactivated 可重复触发？
patch阶段，componentVNodeHooks 对象，定义的4个方法，init, prepatch, insert, destroy 都通过 vnode.data.keepAlive 判断；

### 源码分析
```javascript
// 获取组件名
function getComponentName (opts) {
  return opts && (opts.Ctor.options.name || opts.tag)
}
// 解析 include/exclude 可以用逗号分隔字符串、正则表达式或一个数组来
function matches (pattern, name) {
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
// watch update 时，动态移除 !filter(name) 的缓存组件
function pruneCache (keepAliveInstance, filter) {
  var cache = keepAliveInstance.cache;
  var keys = keepAliveInstance.keys;
  var _vnode = keepAliveInstance._vnode;
  for (var key in cache) {
    var entry = cache[key];
    if (entry) {
      var name = entry.name;
      if (name && !filter(name)) {
        pruneCacheEntry(cache, key, keys, _vnode);
      }
    }
  }
}
// 销毁 include 中缓存的实例
function pruneCacheEntry (
  cache,
  key,
  keys,
  current
) {
  var entry = cache[key];
  if (entry && (!current || entry.tag !== current.tag)) {
    // 调用 组件实例的 $destroy()
    entry.componentInstance.$destroy();
  }
  cache[key] = null;
  remove(keys, key);
}
var patternTypes = [String, RegExp, Array];
var KeepAlive = {
  name: 'keep-alive',
  abstract: true,
  props: {
    include: patternTypes,
    exclude: patternTypes,
    max: [String, Number]
  },
  methods: {
    cacheVNode: function cacheVNode() {
      var ref = this;
      var cache = ref.cache;
      var keys = ref.keys;
      // 与最新的dev v2.6 代码结构有一点差异
      var vnodeToCache = ref.vnodeToCache;
      var keyToCache = ref.keyToCache;
      if (vnodeToCache) {
        var tag = vnodeToCache.tag;
        var componentInstance = vnodeToCache.componentInstance;
        var componentOptions = vnodeToCache.componentOptions;
        // update完成后，缓存 key
        cache[keyToCache] = {
          name: getComponentName(componentOptions),
          tag: tag,
          componentInstance: componentInstance,
        };
        keys.push(keyToCache);
        // prune oldest entry 
        // 如果超过max，采用 LRU 页面置换算法
        if (this.max && keys.length > parseInt(this.max)) {
          // 只会超过一个，把第一个 destory
          pruneCacheEntry(cache, keys[0], keys, this._vnode);
        }
        this.vnodeToCache = null;
      }
    }
  },
  created: function created () {
    this.cache = Object.create(null); // cache vnode
    this.keys = []; // the map of cached vnode key
  },
  destroyed: function destroyed () {
    for (var key in this.cache) {
      // 清除缓存的vnode，同时执行组件实例的$destroy钩子函数
      pruneCacheEntry(this.cache, key, this.keys);
    }
  },
  mounted: function mounted () {
    var this$1 = this;
    this.cacheVNode();
    // 监听props，动态更新 cache, keys(新增，删除等)
    this.$watch('include', function (val) {
      pruneCache(this$1, function (name) { return matches(val, name); });
    });
    this.$watch('exclude', function (val) {
      pruneCache(this$1, function (name) { return !matches(val, name); });
    });
  },
  updated: function updated () {
    // 组件 updated 之后，再把当前需要缓存的  vnode 和 key 添加进去
    this.cacheVNode();
  },
  render: function render () {
    var slot = this.$slots.default;
    // 找到第一个子组件(只能有一个子组件)
    var vnode = getFirstComponentChild(slot);
    var componentOptions = vnode && vnode.componentOptions;
    if (componentOptions) {
      // check pattern
      var name = getComponentName(componentOptions);
      var ref = this;
      var include = ref.include;
      var exclude = ref.exclude;
      // 不存在缓存
      if (
        // not included
        (include && (!name || !matches(include, name))) ||
        // excluded
        (exclude && name && matches(exclude, name))
      ) {
        return vnode
      }
      // 需要缓存
      var ref$1 = this;
      var cache = ref$1.cache;
      var keys = ref$1.keys;
      // e.g. '97::Posts'
      var key = vnode.key == null
        // same constructor may get registered as different local components
        // so cid alone is not enough (#3269)
        ? componentOptions.Ctor.cid + (componentOptions.tag ? ("::" + (componentOptions.tag)) : '')
        : vnode.key;
      // 组件已经渲染过，已存在缓存
      if (cache[key]) {
        vnode.componentInstance = cache[key].componentInstance; // 直接取缓存的实例 componentInstance
        // make current key freshest，最新渲染过的放到数组的最后，方便 LRU(Least Recently Used) 一种页面置换算法
        remove(keys, key);
        keys.push(key); // 调整key排序
      } else {
        // delay setting the cache until update 调用钩子函数 updated，收集缓存
        this.vnodeToCache = vnode;
        this.keyToCache = key;
      }
      vnode.data.keepAlive = true; // 渲染和执行被包裹组件的钩子函数需要用到
    }
    return vnode || (slot && slot[0])
  }
};
var builtInComponents = {
  // 暴露出去，mergeOptions时，注册为内置组件
  KeepAlive: KeepAlive
};

export function initLifecycle(vm: Component) {
  const options = vm.$options;
  // locate first non-abstract parent
  let parent = options.parent;
  // ??? abstract属性的含义 - keep-alive 组件
  if (parent && !options.abstract) {
    while (parent.$options.abstract && parent.$parent) {
      // 向上查找，直到第一个 non-abstract parent
      parent = parent.$parent; // !!! 学习-逆向上递归
    }
    parent.$children.push(vm); // wtf ??? -> 把当前vm存储到父实例的 $children 中
  }
  // ...
}

// 创建组件
  function createComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
    console.log('createComponent: ', vnode)
    let i = vnode.data
    if (isDef(i)) {
      const isReactivated = isDef(vnode.componentInstance) && i.keepAlive
      if (isDef(i = i.hook) && isDef(i = i.init)) {
        i(vnode, false /* hydrating */)
      }
      // after calling the init hook, if the vnode is a child component
      // it should've created a child instance and mounted it. the child
      // component also has set the placeholder vnode's elm.
      // in that case we can just return the element and be done.
      if (isDef(vnode.componentInstance)) {
        initComponent(vnode, insertedVnodeQueue) // step 1
        insert(parentElm, vnode.elm, refElm) // step 2 插入到父节点dom中
        if (isTrue(isReactivated)) {
          reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm)
        }
        return true
      }
    }
  }

// 组件 VNodes patch阶段时调用内部hooks
const componentVNodeHooks = {
  // 组件初始化入口
  init (vnode: VNodeWithData, hydrating: boolean): ?boolean {
    if (
      vnode.componentInstance &&
      !vnode.componentInstance._isDestroyed &&
      vnode.data.keepAlive
    ) {
      // kept-alive components, treat as a patch
      const mountedNode: any = vnode // work around flow
      componentVNodeHooks.prepatch(mountedNode, mountedNode)
    } else {
      // js是单线程，全局的activeInstance，整个初始化是一个深度遍历的过程。
      const child = vnode.componentInstance = createComponentInstanceForVnode(
        vnode,
        activeInstance
      )
      child.$mount(hydrating ? vnode.elm : undefined, hydrating) // mountComponent -> updateComponent => vm._update(vm._render(), hydrating)
    } 
  },
  prepatch (oldVnode: MountedComponentVNode, vnode: MountedComponentVNode) {
    const options = vnode.componentOptions
    const child = vnode.componentInstance = oldVnode.componentInstance
    updateChildComponent(
      child,
      options.propsData, // updated props
      options.listeners, // updated listeners
      vnode, // new parent vnode
      options.children // new children
    )
  },
  // 每个子组件在这个函数中执行 mounted 钩子函数
  insert (vnode: MountedComponentVNode) {
    const { context, componentInstance } = vnode
    if (!componentInstance._isMounted) {
      componentInstance._isMounted = true
      callHook(componentInstance, 'mounted')
    }
    if (vnode.data.keepAlive) {
      if (context._isMounted) {
        // vue-router#1212
        // During updates, a kept-alive component's child components may
        // change, so directly walking the tree here may call activated hooks
        // on incorrect children. Instead we push them into a queue which will
        // be processed after the whole patch process ended.
        queueActivatedComponent(componentInstance)
      } else {
        activateChildComponent(componentInstance, true /* direct */)
      }
    }
  },
  destroy (vnode: MountedComponentVNode) {
    const { componentInstance } = vnode
    if (!componentInstance._isDestroyed) { // ? 用户骚操作-你不知道会不会一直不停的调destroy, 做了很多这样的优化逻辑判断 ?
      if (!vnode.data.keepAlive) {
        componentInstance.$destroy()
      } else {
        deactivateChildComponent(componentInstance, true /* direct */)
      }
    }
  }
}
```javascript
