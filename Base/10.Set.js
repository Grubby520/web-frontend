Set.prototype;
/**
 * Set {constructor: ƒ, has: ƒ, add: ƒ, delete: ƒ, clear: ƒ, …}
    add: ƒ add()
    clear: ƒ clear()
    constructor: ƒ Set()
    delete: ƒ delete()
    entries: ƒ entries()
    forEach: ƒ forEach()
    has: ƒ has()
    keys: ƒ values()
    size: (...)
    values: ƒ values()
    Symbol(Symbol.iterator): ƒ values()
    Symbol(Symbol.toStringTag): "Set"
    get size: ƒ size()
    __proto__: Object
 */

/**
 * Set 构造函数
 * 一种新的数据结构
 * 特点：
 * 1.值是唯一的
 * 2.属性和方法与 Map 类似
 * 3.类数组，入参必须是 iterable， for.of
 */
let obj = { a: 1 };
let arr = [1];
let set = new Set([1, "1", arr, obj]);

// 增删改查
Set.prototype.size;
Set.prototype.has;
Set.prototype.add; // Map.prototype.set 区别一下
Set.prototype.delete;
Set.prototype.clear;

set.size;
set.has(obj);
set.has(arr);
let symbol = Symbol(1);
set.add(symbol);
set.has(symbol);
set.delete(1);
set.clear();

// 遍历
Set.prototype.keys;
Set.prototype.values;
Set.prototype.entries;
Set.prototype.forEach;

for (let v of set) {
  console.log(v);
}

// keys 和 values 相等
set.keys();
for (let v of set.keys()) {
  console.log(v);
}

for (let v of set.values()) {
  console.log(v);
}

// entries 的 键值对 相等
for (let v of set.entries()) {
  console.log(v);
}

set.forEach((value, key) => {
  console.log(value, key); // value ===  key
});

// 入参 iterable
// 报错的情况
set = new Set({ a: 1 });
set = new Set(1);
set = new Set(true);
// 正常的情况
set = new Set([]);
set = new Set("string");

// 应用场景 ---------- ---------- //
// 01 去重（严格相等才能去重）基本类型去重推荐 Set
set = new Set([
  1,
  "1",
  arr,
  obj,
  arr,
  obj,
  [1],
  [1],
  null,
  undefined,
  null,
  undefined,
]);
// 扩展运算符
let unique = [...set];
// Array.from
unique = Array.from(set);
// [1] 和 [1] 是两个不同的地址，无法去重

let set1 = new Set([1, 11, "1"]);
// 并集
let union = new Set([...set, ...set1]);
// 交集
let intersection = [...set].filter((item) => set1.has(item));
// 差集
let difference = [...set].filter((item) => !set1.has(item));

// WeakMap -------------- --------------- //
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

/**
 * 1.成员只能是对象(不包括 null)
 * WeakSet 中的对象都是弱引用，即垃圾回收机制不考虑 WeakSet 对该对象的引用
 * 如果其他对象都不再引用该对象，那么垃圾回收机制会自动回收该对象所占用的内存，不考虑该对象还存在于 WeakSet 之中
 * WeakSet 里面的引用，都不计入垃圾回收机制，所以就不存在内存泄漏的问题
 */
let weakMap = new WeakMap([arr, obj]);
