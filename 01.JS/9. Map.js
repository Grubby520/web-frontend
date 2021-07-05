Map.prototype;

/**
 Map(2) {"oem" => 0, "odm" => 1}
  [[Entries]]
  0: {"oem" => 0}
  1: {"odm" => 1}
  size: 2
  __proto__: Map
  clear: ƒ clear()
  constructor: ƒ Map()
  delete: ƒ delete()
  entries: ƒ entries()
  forEach: ƒ forEach()
  get: ƒ ()
  has: ƒ has()
  keys: ƒ keys()
  set: ƒ ()
  size: (...)
  values: ƒ values()
  Symbol(Symbol.iterator): ƒ entries()
  Symbol(Symbol.toStringTag): "Map"
  get size: ƒ size()
  __proto__: Object
*/

// 基本用法 ---------- ---------- //
let map = new Map([
  ["oem", 0],
  ["odm", 1],
]);

map.size; // 2
map.get("oem"); // 0
map.has("oem"); // true

map.delete("oem"); // true
map.get("oem"); // undefined
map.has("oem"); // false
map.set("oem", 0);

map.clear(); // Map(0) {}

/* 最大的特点 vs object：
  object的键值对（Hash结构）的键名 只接受<字符串>（隐式强制转换成字符串 .toString()方法 ）
  1.map的键的范围不限于字符串，<任何类型的值(函数，对象，基本类型)>都可以当成键，值-值
  2.键名 与内存地址绑定的
  3.方法可以链式调用
  4.相同的键名，后者会覆盖前者
  5.记住键的原始插入顺序，Iterable, for.of按顺序遍历
*/

// object 的键名，隐式转换
let k = [{ a: 1 }];
let obj = { [k]: "key1-value" }; // {[object Object]: "key1-value"}

// 键名 的比较，基于 sameValueZero 算法, Object.is 严格相等
let key1 = ["foo"];
let key2 = ["foo"];
// key1 和 key2，不严格相等
Object.is(key1, key2) === false;
map = new Map().set(key1, "foo").set(key2, "foo");
map.has(key1);
map.has(key2);

// 键名覆盖的情况
key1 = "foo";
key2 = "foo";
Object.is(key1, key2) === true;
map = new Map().set(key1, "foo").set(key2, "foo");

// 函数作为键名
let fn = function () {
  return true;
};
map = new Map().set(fn, "function"); // Map(1) {ƒ => "function"}
map.has(fn); // true

// Map.prototype 实例的方法 ---------- ---------- //
// 增删改查
Map.prototype.set;
Map.prototype.get;
Map.prototype.has;
Map.prototype.delete;
Map.prototype.clear;

// 实例属性
map.size;

// 循环遍历Map对象
Map.prototype.keys;
Map.prototype.values;
Map.prototype.entries;
Map.prototype.forEach;

map = new Map([
  ["key1", "value1"],
  ["key2", "value2"],
]);

map.keys(); // MapIterator {"key1", "key2"}
for (let k of map.keys()) {
  console.log(k);
}

map.values(); // MapIterator {"value1", "value2"}
for (let k of map.values()) {
  console.log(k);
}

map.entries();
for (let [k, v] of map.entries()) {
  console.log(k, v);
}
// 与 entries() 效果一致
for (let [k, v] of map) {
  console.log(k, v);
}

// 入参 与 Array.prototype.forEach 一致
map.forEach((value, key) => {
  console.log(value, key);
});

// 使用扩展运算符 ... Map转成Array
[...map.entries()];
[...map.entries()].flat();
[...map.keys()];
[...map.values()];

// Map转成Object
function mapToObj(map) {
  const obj = Object.create(null);
  for (let [k, v] of map) {
    obj[k] = v;
  }
  return obj;
}

// Map与JSON互转
let str = '[[true,7],[{"foo":3},["abc"]]]';
map = new Map(JSON.parse(str));

str = JSON.stringify([...map]);

// WeakMap ---------- ---------- //
// 针对与 object 的差别，更加纯粹的 Map
// 1.只接受对象作为键名（null除外）
// 2.WeakMap 的键名所指向的对象，不计入垃圾回收机制。一旦不再需要，WeakMap 里面的键名对象和所对应的键值对会自动消失，不用手动删除引用
// 3.某个键名是否存在完全不可预测，跟垃圾回收机制是否运行相关，所以 <没有遍历方法，只有增删改查方法>

WeakMap.prototype;

/**
 * WeakMap {constructor: ƒ, delete: ƒ, get: ƒ, set: ƒ, has: ƒ, …}
    constructor: ƒ WeakMap()
    delete: ƒ delete()
    get: ƒ ()
    has: ƒ has()
    set: ƒ ()
    Symbol(Symbol.toStringTag): "WeakMap"
    __proto__: Object
 */
