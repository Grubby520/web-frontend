Symbol.prototype;
/**
 Symbol {Symbol(Symbol.toStringTag): "Symbol", constructor: ƒ, toString: ƒ, valueOf: ƒ, …}
  constructor: ƒ Symbol()
  description: (...)
  toString: ƒ toString()
  valueOf: ƒ valueOf()
  Symbol(Symbol.toPrimitive): ƒ [Symbol.toPrimitive]()
  Symbol(Symbol.toStringTag): "Symbol"
  get description: ƒ description()
  __proto__: Object
 */

/**
 * Symbol 基本数据类型
 * 作用：个类型的值可以用来创建匿名的对象属性。通常被用作一个对象属性的键值-私有属性。
 * 1. symbol类型的键存在于各种 [native code] 内置的 JavaScript 对象中。
 * 2. 自定义类创建私有成员
 * 特点：
 * 1. 一个symbol实例可被赋值到一个左值变量
 * 2. 通过标识符检查类型
 * 用法：
 * 用变量存储symbol的值，用存储的值创建对象属性
 */
let sym = Symbol();

/* 
  第七种数据类型，前6种：undefined, null, Boolean, String, Number, Object
  提供有一种机制，保证每个属性的名字都是独一无二的，这样就从根本上防止属性名的冲突，Symbol出现了
*/
typeof sym === "symbol";

// 可选的传一个参数，方便区分，相当于加了一个描述
// 参数：字符串
sym = Symbol("foo");

sym.toString(); // "Symbol(foo)"

// 参数：对象,调用 toString，转换
let obj = {
  // 覆盖原型链上的方法
  toString() {
    return "wtf";
  },
};

Symbol(obj); // Symbol(wtf)

let arr = [1];
Symbol(arr); // Symbol(1)

arr = [{ a: 1 }];
Symbol(arr); // Symbol([object Object])

// 相同参数，symbol的值也是唯一的
Symbol("f00") === Symbol("foo"); // false

// 不能与其他类型进行运算
Symbol("foo") + "symbol"; // Uncaught TypeError

// String, Boolean 可以转换
String(sym); // "Symbol(foo)"
sym.toString();
Boolean(sym); // true
Number(sym); // Uncaught TypeError

// Symbol.prototype 属性和方法 ---------- ---------- //
// ES2019 提出的
Symbol.prototype.description;
sym.description; // "foo"

// 用法：作为属性名 (3种写法)
obj = {};
obj[sym] = "js";
obj = {
  [sym]: "js",
};
Object.defineProperty(obj, sym, { value: "js" });

// 定义常量，如枚举
const ODM = Symbol(0);
const OEM = Symbol(1);

function submit(type) {
  switch (type) {
    case ODM:
      break;
    case OEM:
      break;
    default:
      break;
  }
}

// 消除魔术字符串，魔术数字（多次出现，与代码形成’强耦合‘）
const operationTypes = {
  odm: Symbol("odm"),
  oem: Symbol("oem"),
};

if (operationTypes.odm) {
}

if ("odm") {
}

// 使用 getOwnPropertySymbols 获取 symbol类型的属性名
obj = {
  a: 1,
  [sym]: "js",
};

Object.getOwnPropertySymbols(obj); // [Symbol(foo)]
Object.getOwnPropertySymbols(obj)[0] === sym; // true

// 自定义的类 设置私有属性，外部访问不了
let size = Symbol("size");

class Collection {
  constructor() {
    this[size] = 0;
  }

  add(item) {
    this[this[size]] = item;
    this[size]++;
  }

  static sizeOf(instance) {
    return instance[size];
  }
}

let x = new Collection();
Collection.sizeOf(x);
x.add("foo");
Collection.sizeOf(x);
x; // Collection {0: "foo", Symbol(size): 1}
// 正常情况下，size属性都无法被获取，所以造成了一种非私有的内部方法的效果
Object.keys(x);
Object.getOwnPropertyNames(x);
Object.getOwnPropertySymbols(x);

// Symbol 构造器本身的方法 ---------- ---------- //

// 会被登记在全局环境中。如果已经存在相等的描述 description，返回同一个Symbol值，否则返回不同的Symbol值
Symbol.for;
// 返回 类型值的 key
Symbol.keyFor;

sym === Symbol.for("foo"); // false
Symbol.for("foo") === Symbol.for("foo"); // true
Symbol.keyFor(sym) === undefined;
Symbol.keyFor(Symbol.for("foo")) === "foo";

// 模块的 Singleton 模式

// 内置[native code]的 11个 值(就像 Number)
Symbol.hasInstance;
Symbol.isConcatSpreadable;
Symbol.species;
Symbol.match;
Symbol.replace;
Symbol.search;
Symbol.split;
Symbol.iterator;
Symbol.toPrimitive;
Symbol.toStringTag;
/**
  JSON[Symbol.toStringTag]：'JSON'
  Math[Symbol.toStringTag]：'Math'
  Module 对象M[Symbol.toStringTag]：'Module'
  ArrayBuffer.prototype[Symbol.toStringTag]：'ArrayBuffer'
  DataView.prototype[Symbol.toStringTag]：'DataView'
  Map.prototype[Symbol.toStringTag]：'Map'
  Promise.prototype[Symbol.toStringTag]：'Promise'
  Set.prototype[Symbol.toStringTag]：'Set'
  %TypedArray%.prototype[Symbol.toStringTag]：'Uint8Array'等
  WeakMap.prototype[Symbol.toStringTag]：'WeakMap'
  WeakSet.prototype[Symbol.toStringTag]：'WeakSet'
  %MapIteratorPrototype%[Symbol.toStringTag]：'Map Iterator'
  %SetIteratorPrototype%[Symbol.toStringTag]：'Set Iterator'
  %StringIteratorPrototype%[Symbol.toStringTag]：'String Iterator'
  Symbol.prototype[Symbol.toStringTag]：'Symbol'
  Generator.prototype[Symbol.toStringTag]：'Generator'
  GeneratorFunction.prototype[Symbol.toStringTag]：'GeneratorFunction'
 */
Symbol.unscopables;
Array.prototype[Symbol.unscopables];
/**
  copyWithin: true
  entries: true
  fill: true
  find: true
  findIndex: true
  flat: true
  flatMap: true
  includes: true
  keys: true
  values: true
 */
