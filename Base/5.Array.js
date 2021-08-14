let arr = [];
let result = null;
/**
 * 
__proto__: Array(0)
  concat: ƒ concat()
  constructor: ƒ Array()
  copyWithin: ƒ copyWithin()
  entries: ƒ entries()
  every: ƒ every()
  fill: ƒ fill()
  filter: ƒ filter()
  find: ƒ find()
  findIndex: ƒ findIndex()
  flat: ƒ flat()
  flatMap: ƒ flatMap()
  forEach: ƒ forEach()
  includes: ƒ includes()
  indexOf: ƒ indexOf()
  join: ƒ join()
  keys: ƒ keys()
  lastIndexOf: ƒ lastIndexOf()
  length: 0
  map: ƒ map()
  pop: ƒ pop()
  push: ƒ push()
  reduce: ƒ reduce()
  reduceRight: ƒ reduceRight()
  reverse: ƒ reverse()
  shift: ƒ shift()
  slice: ƒ slice()
  some: ƒ some()
  sort: ƒ sort()
  splice: ƒ splice()
  toLocaleString: ƒ toLocaleString()
  toString: ƒ toString()
  unshift: ƒ unshift()
  values: ƒ values()
  Symbol(Symbol.iterator): ƒ values()
  Symbol(Symbol.unscopables): {copyWithin: true, …}
  __proto__: Object
 */

// --------------- Array 构造函数本身的方法 ----------- //

/**
  Array.from
  从一个类似数组或可迭代对象创建一个新的数组实例
  浅拷贝
  <伪数组> （拥有一个 length 属性和若干索引属性的任意对象）
  <可迭代对象> @@iterator Symbol.iterator (MDN: 迭代协议)
 */
const isIterable = (obj) => {
  return obj !== null && typeof obj[Symbol.iterator] === "function";
};
// String
Array.from("foo"); // ['f', 'o', 'o']
// Set
const set = new Set(["f", "o", "o"]);
arr = Array.from(set); // ['f', 'o', 'o']
// Map
const map = new Map([
  [0, "f"],
  [1, "o"],
]);
arr = Array.from(map).flat(); // [0, "f", 1, "o"]

/**
 * Array.isArray(obj)
 * 判断变量的数据类型是不是数组对象
 * @returns { Boolean }
 */
result = Array.isArray(arr);

/**
 * Array.of(element0[, element1[, ...[, elementN]]])
 * 多个参数一起生成一个新数组实例
 * @returns { Array }
 */
result = Array.of(1, 2, arr);

// --------------- Array.prototype 原型上的属性----------- //

// (1) 属性 ------------- //
// .constructor
Array.prototype.constructor === Array; // true

// .length
Array.length === 1; // true

// (2) 修改数组本身的方法 ------------- //
// .copyWithin

/**
 * arr.fill(value[, start[, end]])
 * 使用一个固定值填充从一个数组的起始索引到终止索引（不包括）内的全部元素
 * @returns { Array } arr
 */
arr = Array(5).fill("str", 0, 1);
arr = Array(3).fill("str");

/**
 * arr.pop()
 * 从数组末尾删除一个元素
 * @returns { any } 被删除的元素 | undefined
 */
result = arr.pop();

/**
 * arr.push(element1, ..., elementN)
 * 从数组末尾添加一个或多个任意类型的元素
 * @returns { Number } arr.length 数组长度
 */
result = arr.push("end1", "end2"); // 4

/**
 * arr.shift()
 * 从数组头部删除一个元素
 * @returns { any } 被删除的元素 | undefined
 */
result = arr.shift(); // 'str'

/**
 * arr..unshift(element1, ..., elementN)
 * 从数组头部添加一个或多个任意类型的元素
 * @returns { Number } arr.length 数组长度
 */
result = arr.unshift("start1", "start2"); // 5

/**
 * arr.sort([compareFunction])
 * 对数组进行排序。
 * 默认排序：讲元素转换为字符串，再比较UTF-16代码单元值序列顺序
 * 具体实现取决于各浏览器的实现，无法保证排序的时间和空间复杂度
 * Google：桶排序 + 快排
 * @returns { Array } arr
 */
arr = [4, 41, 2, 21, 1];
result = arr.sort(); // [1, 2, 21, 4, 41]
result = arr.sort((a, b) => a - b); // [1, 2, 4, 21, 41]
result = arr.sort((a, b) => b - a); // [41, 21, 4, 2, 1]

/**
 * arr.reverse()
 * 颠倒数组的顺序
 * @returns { Array } arr
 */
result = arr.reverse(); // [1, 2, 4, 21, 41]

/**
 * arr..splice(start[, deleteCount[, item1[, item2[, ...]]]])
 * 指定从一个start起点索引开始，可以同时进行删除，新增，替换等操作
 * @returns { Array } 被删除元素组成的集合
 */
result = arr.splice(2, 3, 3, 4, 5); // [4, 21, 41]
arr; // [1, 2, 3, 4, 5]
// 删除最后一个元素，并拿到它
result = arr.splice(arr.length - 1, 1); // [5]

// (3) 不会修改数组，但会返回一个新的数组或一个期望的值 ------------- //
/**
 * arr.concat([element1[, element2[, ...]]])
 * 把一个或多个元素拼装成一个新的数组
 * 浅拷贝
 * @returns { Array }
 */
result = arr.concat(); // 一份arr的浅拷贝
result = arr.concat([5, 6], 7); // 传数组，会进行一层平铺(flat)的效果

/**
 * arr.includes(valueToFind[, fromIndex])
 * 指定索引（默认 0）开始位置查找是否包含某个元素
 * @returns { Boolean }
 *
 */
result = arr.includes(3);

/**
 * arr.join([separator])
 * 指定一个分隔符（默认 英文逗号 ,）把数组转成字符串
 * @returns { String }
 */
result = arr.join();
result = arr.join("-");

/**
 * arr.slice([begin[, end]])
 * 指定从begin（包含）到end（不包含）索引段的浅拷贝
 * @returns { Array } 新的浅拷贝的数组
 */
result = arr.slice();
result = arr.slice(-1); // 最后一位

/**
 * arr.indexOf(searchElement[, fromIndex])
 * 从指定位置（默认 0）开始，返回查询到指定元素的第一个索引
 * @returns { Number } 找不到 -1
 */
result = arr.indexOf(3);
result = arr.indexOf(1, 2);

/**
 * arr.lastIndexOf(searchElement[, fromIndex])
 * 从指定位置（默认 -1）开始，返回查询到指定元素的第后一个索引
 * 从右向左开始查找 -1：右边第一位 | -2：右边第二位
 * @returns { Number } 找不到 -1
 */
arr = [1, 2, 3, 4, 5];
result = arr.lastIndexOf(1); // 0
result = arr.lastIndexOf(1, -5); // 0
result = arr.lastIndexOf(1, -6); // -1

/**
 * arr.flat([depth])
 * 指定提取嵌套数组的结构深度（默认 1）
 * @returns { Array } 扁平化的新的数组
 */
arr = [1, [2, 3], [[4, 5, 6]]];
result = arr.flat();
result = arr.flat(2);

/**
 * arr.flatMap((currentValue[, index[, arr]])[, thisArg])
 * 与 .flat(1) 一样，多了一个map函数，对数组的每个元素执行一次回调，返回新的数组
 * @returns { Array } 组成的新的数组
 */
arr = [[1], [2], [3]];
// 实际场景是?
result = arr.flatMap((cur) => cur); // [1, 2, 3]

/**
 * arr.toString()
 * 逐个元素调用 toString 方法，转成字符串，并用逗号拼接在一起
 * 递归遍历：
 * 引用类型会输出 [object Object]
 * 基础数据类型 undefined 和 null 输出 empty
 *
 * @returns { String }
 */
arr = [1, 2, 3];
result = arr.toString(); // "1,2,3"
result = [1, [2]].toString(); // "1,2"
result = [{ a: 1 }, [[2]]].toString(); // "[object Object],2"
const fn = function () {
  return 1;
};
result = [undefined, null, 1, true, [1], [{ a: 1 }], fn].toString(); // ",,1,true,1,[object Object],function fn() {return 1}"

// .toLocaleString
// .toSource

arr = [1, 2, 3];

// (4) 迭代方法 length会被缓存，遍历过程补药对原数组进行任何修改（可读性和可维护性） ------------- //

/**
 以 forEach 遍历时共同的特点 (some, every 等等都一样)：
 指定一个遍历时执行的cb函数
  遍历开始（即第一次调用 cb 时）就会确定其遍历范围（快照）
  按升序遍历执行
  只对包含有效值（跳过已删除或未初始化的项）的项执行一次 cb  函数
  调用 forEach 后添加的新项不会被遍历到
  如果已经存在的值被改变，才传递给cb的值是forEach()遍历那一刻的值
  已删除的项不会被遍历到
  特别注意，只有forEach 不能链式调用：
  执行 cb，返回 undefined，不可链式调用（side effects）；
  无法使用break跳出循环，用其他循环方法替换；

  都是浅拷贝
 */
/**
 * arr.forEach(callback(currentValue [, index [, array]])[, thisArg])
 * 纯遍历原数组，跟for循环一样
 * 但是，只有它不能链式调用
 * 但是，不能提前跳出循环
 * @returns { undefined }
 */
result = [];
arr.forEach((item, index) => result.push(item * ++index));
// result [1, 4, 9]

/**
 * arr.every(callback(element[, index[, array]])[, thisArg])
 * 当遇到第一个不满足条件的，立即结束循环
 * 若是空集合没有元素，返回 true
 * @returns { Boolean }
 */
result = arr.every((item) => item > 0);

/**
 * arr.some(callback(element[, index[, array]])[, thisArg])
 * 当遇到第一个符合条件的，立即结束循环
 * 若是空集合，或找不到符合的，返回 false
 * @returns { Boolean }
 */
result = arr.some((item) => item === 2);

/**
 * arr.filter(callback(element[, index[, array]])[, thisArg])
 * 过滤数组，给满足条件的元素一起组成一个新数组
 * @returns { Array } 每一个符合的即为空数组 []
 */
result = arr.filter((item) => item > 2);

/**
 * arr.find(callback(element[, index[, array]])[, thisArg])
 * 找到第一个符合条件的元素，结束循环
 * 找不到 undefined
 * @returns { any } 任何类型的元素
 */
result = arr.find((item) => item < 2); // 1
result = arr.find((item) => item === 2); // 2
result = arr.find((item) => item === 4); // undefined

/**
 * arr.findIndex(callback(element[, index[, array]])[, thisArg])
 * 找到第一个符合条件的元素对应的索引，结束循环
 * 找不到 -1
 * @returns { Number } 任何类型的元素
 */
result = arr.findIndex((item) => item < 2); // 0
result = arr.findIndex((item) => item === 2); // 1
result = arr.findIndex((item) => item === 4); // -1

/**
 * arr.map(callback(currentValue[, index[, array]])[, thisArg])
 * cb回调函数的结果，组成一个新的数组
 * 如果函数没有返回值，默认 undefined
 * @returns { Array }
 */
result = arr.map((item, index) => ({
  [index]: item,
}));

/**
 * arr.reduceRight()
 * arr.reduce(callback(accumulator, currentValue[, index[, array]])[, initialValue])
 *  指定一个 reducer 函数（升序执行），对数组中的每个元素执行该函数，将其结果汇总为单个返回值。
 cb 的参数：
   acc 必填 累计器累计回调的返回值
   cur 必填 数组中正在处理的元素
   index 正在处理的当前元素的索引
   arr 正在处理的数组
 initialValue：
 第一次执行 cb 时的第一个参数的值；
 若没传，则是数组中的第一个元素
 @returns { any } 函数累计处理的结果
 */

// 累加
result = arr.reduce((acc, cur) => {
  return acc + cur;
});
// 求最大值
result = arr.reduce((acc, cur) => {
  return acc > cur ? acc : cur;
});
// 去重
arr.reduce((acc, cur) => {
  // 使用initialValue,要注意数据的类型
  acc.indexOf(cur) === -1 && acc.push(cur);
  return acc;
}, []);

/**
 * arr.entries()
 * 生产一个新的 Array Iterator 迭代器对象，原型上 __proto__: Array Iterator, 包含一个 next 方法
 * value 值包含了每个索引的 键/值 对
 * Array Iterator {}
    __proto__: Array Iterator
    next: ƒ next()
    Symbol(Symbol.toStringTag): "Array Iterator"
    __proto__:
    Symbol(Symbol.iterator): ƒ [Symbol.iterator]()
    __proto__: Object
 * @returns { Array Iterator Object } { value: [key, value], done: Boolean }
 */
result = arr.entries();
result.next(); // { value: [0, 1], done: false }

/**
 * arr.keys()
 * value 值包含了每个索引的 键
 */
result = arr.keys();
result.next(); // { value: 0, done: false }

/**
 * arr.values()
 * value 值包含了每个索引的 值
 */
result = arr.values();
result.next(); // { value: 1, done: false }
