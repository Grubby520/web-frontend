/**
 * 组件中的data为什么是一个函数?
 * 必须定义成function，返回Object / each instance can maintain an independent copy of the returned data object
 * 每个实例都是返回的数据对象的独立的副本
 * 1. 每次组件实例的data属性，函数返回的是新的完全独立的副本对象，数据隔离；
 * 2. 当组件复用时，若为同一个对象，A修改，B也会被同步修改，就会造成相互影响；
 */

function stateMixin(Vue) {
  // Vue.prototype.$data 
  const dataDef = {};
  // 只有getter, 没有setter
  dataDef.get = function () {
    return this._data; // _data ?
  };
  Object.defineProperty(Vue.prototype, "$data", dataDef);
}

function initData(vm) {
  let data = vm.$options.data
  // 函数返回独立的 data object;
  data = vm._data = typeof data === 'function' ? data.call(vm, vm) : data || {}
  // proxy data on instance
  const keys = Object.keys(data)
  let i = keys.length
  while (i--) {
    const key = keys[i]
    proxy(vm, '_data', key) // data的每一个属性 代理 到 _data 上
  }
}

function proxy() { }
