let source = { a: 1, b: 2 };
let target = null;
// a: 1
// b: 2
// __proto__:
// constructor: ƒ Object()
// hasOwnProperty: ƒ hasOwnProperty()
// isPrototypeOf: ƒ isPrototypeOf()
// propertyIsEnumerable: ƒ propertyIsEnumerable()
// toLocaleString: ƒ toLocaleString()
// toString: ƒ toString()
// valueOf: ƒ valueOf()
// __defineGetter__: ƒ __defineGetter__()
// __defineSetter__: ƒ __defineSetter__()
// __lookupGetter__: ƒ __lookupGetter__()
// __lookupSetter__: ƒ __lookupSetter__()
// get __proto__: ƒ __proto__()
// set __proto__: ƒ __proto__()

// 创建对象 ---------- //
// 字面量
source = { a: 1, b: 2 };
// 对象初始化器
source = Object({ a: 1, b: 2 });
// 构造函数
source = new Object({ a: 1, b: 2 });
// 传入 null / undefined / 不传，生成一个空对象
source = new Object(null);
source = new Object(undefined);
source = new Object();
// 传入 1 '1' true，生成基于基础类型的包装类型的对象

source = new Object(1);
num = new Number(1);

// 构造函数 本身 ---------- //
// （1）属性
Object.length === 1;
Object.prototype === source.__proto__; // 实例的 __proto__ 属性，继承的是 Object.prototype 原型

// （2）静态方法
/**
 * Object.create(proto，[propertiesObject])
 * proto 新建创建对象的原型对象
 * propertiesObject 与 Object.defineProperties()的第二个参数一样
 * @returns { Object } 带有指定的原型对象和属性的新对象
 */

source = { a: 1, b: 2 };
source.__proto__ === Object.prototype;
source.__proto__.constructor === Object;

// 第一个参数
target = Object.create(source);
// {}
// __proto__:
// a: 1
// b: 2
// __proto__:
target.__proto__ === source;
target.__proto__.__proto__ === Object.prototype;
target.__proto__.__proto__.constructor === Object;

// 第二个参数
target = Object.create(Object.prototype, {
  // foo会成为所创建对象的数据属性
  foo: {
    writable: true,
    configurable: true,
    value: "hello",
  },
  // bar会成为所创建对象的访问器属性
  bar: {
    configurable: false,
    get: function () {
      return 10;
    },
    set: function (value) {
      console.log("Setting `o.bar` to", value);
    },
  },
});
// {foo: "hello"}
// bar: 10
// foo: "hello"
// get bar: ƒ ()
// set bar: ƒ (value)
// __proto__: Object

/**
 * Object.assign(target, ...sources)
 * 将所有可枚举属性的值，从一个或多个源对象，分配到目标对象，返回目标对象
 * 若不同对象间的属性存在相同的键，则后面的属性会覆盖前面的属性
 */
// 浅拷贝一个对象
target = Object.assign({}, source);
// 后者属性覆盖前者
target = Object.assign({}, source, { b: 10 });
// 直接修改源对象
Object.assign(source, { c: 3 });

/**
 * Object.defineProperty(obj, prop, descriptor)
 * 直接在对象上定义一个新属性，或修改现有属性
 * @returns { Object } 对象本身
 */
// 新增属性 prop1
Object.defineProperty(source, "prop1", {
  value: 32,
  writable: true,
});

/*
 第三个参数 descriptor 属性描述符
 数据描述符 (data descriptors) vs 存取描述符 (accessor descriptors)
 共享参数（默认 false）：
 configurable 值为 true 时，才能被修改为false，才能 删除 该属性；默认 false 
 enumerable 值为 true 时，才可枚举，才会在对象的枚举属性中；默认 false
 ---- ---- ---- ---- ---- ----
 数据描述符具有：
 value 属性对应的值 默认为 undefined
 writable 值为 true 时，才能修改 value 值，默认 false；
 ---- ---- ---- ---- ----
 存取描述符具有：
 get 属性的getter函数，默认 undefined，当访问该属性时，会调用该函数；
 set 属性的setter函数，默认 undefined，当属性值被修改时，会调用该函数，函数接受一个参数；
 */

// 查看默认值
source = { a: 1 };
result = Object.getOwnPropertyDescriptor(source, "a");
// {value: 1, writable: true, enumerable: true, configurable: true}
Object.defineProperty(source, "b", {});
result = Object.getOwnPropertyDescriptor(source, "b");
// {value: undefined, writable: false, enumerable: false, configurable: false}

// vue中，重写数组原型上的方法
const arrProto = Array.prototype;
const arrMethods = Object.create(arrProto); // 新的 Array实例

const methodsToPatch = [
  "push",
  "pop",
  "unshift",
  "shift",
  "splice",
  "sort",
  "reverse",
];
// 定义 define a property
function def(obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true,
  });
}
// 拦截变异方法
methodsToPatch.forEach((method) => {
  const original = arrProto[method]; // 源方法
  def(arrMethods, method, function mutator(...args) {
    const result = original.apply(this, args); // 执行原生方法
    const ob = this.__ob__;
    let inserted;
    switch (method) {
      case "splice":
        inserted = args.slice(2); // 新增的元素（第三个参数开始）
        break;
    }
    if (inserted) {
      ob.observeArray(inserted); // 新的元素进行响应式
    }
    ob.dep.notify(); // 派发更香
    return result;
  });
});

/**
 * Object.defineProperties(obj, props)
 * 直接在一个对象上新增属性，或修改原有属性
 * 批量操作 与 defineProperty本质上一样
 */
Object.defineProperties(source, {
  prop1: {
    value: true,
    writable: true,
  },
  prop2: {
    value: "prop2",
  },
});
// 删除不了
delete source.prop2;
// 修改不了
source.prop2 = "new value";

/**
 * Object.freeze(obj)
 * 冻结一个对象，所有元素不能进行任何操作：不能添加新属性，不能删除老属性，
 * 不能修改已有属性的 configurable，enumerable，writable，value
 * @returns { Object } 被冻结的对象 本身也改变了
 */
source = { a: 1 };
result = Object.freeze(source); // 在vue中，就不会对它做响应式处理
Object.getOwnPropertyDescriptor(result, "a");
// {value: 1, writable: false, enumerable: true, configurable: false}
// 失效
delete source.a;
source.a = 11;
source.b = 2;
// TypeError
Object.defineProperty(result, "a", {
  enumerable: false,
});
Object.getOwnPropertyDescriptor(result, "a");

/**
 * Object.isFrozen(obj)
 * 判断一个对象是否已冻结
 * @returns { Boolean }
 */
result = Object.isFrozen(source);

/**
 * Object.seal(obj)
 * 密封一个对象
 * 不能添加新属性，现有属性标记为不可配置，writable原来可写的话，就可以改变
 */
source = { a: 1 };
Object.seal(source);
source.a = 2; // 修改成功
Object.getOwnPropertyDescriptor(source, "a");
// {value: 2, writable: true, enumerable: true, configurable: false}
// TypeError
Object.defineProperty(source, "a", {
  enumerable: false,
});

/**
 * Object.isSealed(obj)
 * 判断一个对象是否被密封
 * @returns { Boolean }
 */
result = Object.isSealed(source);

/**
 * Object.getOwnPropertyDescriptor(obj, prop)
 * 返回对象指定的自有属性对应的配置（属性描述符）
 */

/**
 * Object.getOwnPropertyNames(obj)
 * 返回对象的所有自有属性的属性名（包括不可枚举的属性，不包括Symbol值作为名称的属性）
 * @returns { String[] } 字符串组成的数组
 */
source = { a: 1, b: 2 };
Object.defineProperty(source, "c", {
  value: "3",
});
Object.defineProperty(source, Symbol("d"), {
  value: 4,
});
source; // {a: 1, b: 2, c: "3", Symbol(d): 4}
result = Object.getOwnPropertyNames(source); // ["a", "b", "c"] 'c'还在，Symbol(d)不在；

/**
 * Object.getOwnPropertySymbols(obj)
 * 返回对象自有属性的Symbol值作为名称的属性
 * @returns { String[] } 字符串组成的数组
 */
result = Object.getOwnPropertySymbols(source); // [Symbol(d)]

/**
 * Object.getPrototypeOf(source)
 * 返回对象的原型（内部[[Prototype]]）属性的值
 * @returns { Object }
 */
result = Object.getPrototypeOf(source); // {constructor: ƒ, __defineGetter__: ƒ, ...}
Object.getPrototypeOf(source) === Object.prototype; // true

/**
 * Object.setPrototypeOf(source, prototype)
 * 修改对象的原型（内部[[Prototype]]），指向新的 prototype
 * @returns { Object }
 */
const proto = {
  proto: "new",
};
result = Object.setPrototypeOf(source, proto);
Object.getPrototypeOf(source); // {proto: "new"}
Object.getPrototypeOf(source) === proto; // true
Object.getPrototypeOf(source.__proto__) === Object.prototype; // true
Object.getPrototypeOf(source.__proto__.constructor) === Object; // false 不是原型对象了

/**
 * Object.is(value1, value2)
 * 判断2个值是否是同一个值
 * .is vs == ：不同进行强制转换
 * .is vs === ：不会把 -0 和 +0 视为相等，Number.NaN 和 NaN 视为不相等
 * 相等的条件：
 * 都是undefined
 * 都是null
 * 都是true / false
 * 相同长度的字符串 + 相同字符按相同顺序排列
 * 相同对象，他们是同一个引用（而不是字面量的相等）
 * 都是数字且
 *  都是 +0
 *  都是 -0
 *  都是 NaN
 */
result = Object.is(1, 1);
result = Object.is(true, true);
arr = [1, 2];
result = Object.is(arr, arr.slice());

/**
* Object.is(value1, value2)
* 判断2个值是否是同一个值
1.与==运算不同，不会强制转行
2.与===运算不同，不会讲数字-0和+0视为相等，讲Number.NaN与NaN视为不相等
* @return {Boolean} 
*/
const obj1 = { a: 1 }
const obj2 = obj1
const ob3 = { a: 1 }
Object.is(obj1, obj2) // true 同一个引用地址
Object.is(obj1, obj3) // false 不同引用地址
Object.is(undefined, undefined) // true
Object.is(null, null) // true
Object.is(undefined, null) // false
Object.is(true, true) // true
Object.is(true, false) // false
Object.is('foo', 'foo') // false
Object.is(+0, 0) // true
Object.is(NaN, NaN) // true

/**
 * Object.isExtensible(obj)
 * 判断一个对象是否是可扩展的，即可以添加新的属性
 * 不可扩展的方法：seal, freeze, preventExtensions
 * @returns { Boolean } 是否可扩展
 */
result = Object.isExtensible(source); // true

/**
 * Object.preventExtensions(obj)
 * 使其对象不可扩展，即不可添加新的属性
 * @returns { Object } 不可扩展的对象
 */
Object.preventExtensions(source);
result = Object.isExtensible(source); // false

/**
 * Object.entries(obj)
 * 返回对象自身可枚举属性（enumerable: true）的键值对 组成的数组集合
 * vs for.in : 它不会去遍历原型链中的属性，for.in会
 */
source; // {a: 1, b: 2, c: "3", Symbol(d): 4}
Object.entries(source); // [["a", 1], ["b", 2]] 'c' 和 'Symbol(d)' 不存在
// 【骚搞一盘】
Array.from(new Map(Object.entries(source))).flat(); // ["a", 1, "b", 2]
// vs for.in
for (let key in source) {
  console.log(key); // 'a', 'b', 'proto'（包含原型链上可枚举属性）
}

/**
 * Object.keys(obj)
 * 自身可枚举属性的键 组成的数组集合
 * @returns { String[] }
 */
result = Object.keys(source); // ["a", "b"]

/**
 * Object.values(obj)
 * 自身可枚举属性的值 组成的数组集合
 * @returns { any[] }
 */
result = Object.values(source); // [1, 2]

// （3）原型上（实例）的方法 ------------------------------ //
// 重置一下 source
source = { a: 1, b: 2 };
const newProto = { prop: "原型链上的属性" };
Object.setPrototypeOf(source, newProto);
Object.defineProperty(source, "c", {}); // ’c‘ 属性 不可枚举

/**
 * source.hasOwnProperty(prop)
 * 判断自身是否存在某个属性
 * @returns { Boolean }
 */
result = source.hasOwnProperty("a");
symbol = Symbol("e");
Object.defineProperty(source, symbol, {});
result = source.hasOwnProperty(symbol); // true
for (let key in source) {
  console.log(key); // 有 'prop'
}
result = source.hasOwnProperty("prop"); // false 不会查找原型链

/**
 * prototypeObj.isPrototypeOf(obj)
 * obj的原型链上查找，是否存在prototypeObj
 * vs instanceof : object instanceof AFunction, object 的原型链是针对 AFunction.prototype 进行检查的，而不是针对 AFunction 本身
 * @returns { Boolean }
 */
newProto.isPrototypeOf(source); // true
Object.prototype.isPrototypeOf(source); // true 原型链上一直向下查找，直到根节点
function Bar() { }
function Baz() { }
Baz.prototype = Object.create(Bar.prototype)
const obj = new Baz()
Bar.prototype.isPrototypeOf(obj) // true
Baz.prototype.isPrototypeOf(obj) // true

// vs instanceof
source instanceof Object; // true; source的原型链上查找，是否存在 Object.prototype

/**
 * source.propertyIsEnumerable(prop)
 * 判断属性是否是可枚举的
 * @returns { Number }
 */
source.propertyIsEnumerable("a"); // true
source.propertyIsEnumerable("c"); // false
source.propertyIsEnumerable("prop"); // false

/**
 * source.toString()
 */
source.toString(); // [object Object]
// 改写原型链上的方法
source.__proto__.toString = function () {
  return "change";
};
source.toString(); // 'change'

/**
 * source.toLocaleString()
 */
/**
 * source.valueOf()
 * 都返回本身原始值：
 * Array
 * Boolean
 * Function
 * Number
 * Object
 * String
 * 特殊的：
 * Date 返回毫秒数 UTC
 * new Date().valueOf() // 1624344406308
 */
[1, 2, { a: 1 }].valueOf();

/**
 * 非标准的特性，不学习
 * source.__defineGetter__()
 * source.__defineSetter__()
 * source.__lookupGetter__()
 * source.__lookupSetter__()
 */
