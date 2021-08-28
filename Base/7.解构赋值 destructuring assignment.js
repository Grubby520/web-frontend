// 01 数组  ---------- ---------- //
// 匹配模式
let [a, b] = [1, 2];
// 默认 undefined
let [a, b] = [1]; // b undefined
// 嵌套复杂的
let [a, [b]] = [1, [2]];
// 不完全解构
let [a, [b], c] = [1, [2, 3], 4, 5];

// 报错的场景：等号右边不是数组（严格讲，不是可遍历的解构，Iterator）
// [b] 右边是 2
let [a, [b]] = [1, 2]; // Uncaught TypeError: undefined is not a function
// 其他情况: Uncaught TypeError: ${xxx} is not iterable
let [foo] = 1;
let [foo] = false;
let [foo] = NaN;
let [foo] = undefined;
let [foo] = null;
let [foo] = {};

// 只要数据结构具有 Iterator 接口，都可以采用数组形式的解构赋值
function* fibs() {
  let a = 0;
  let b = 1;
  while (true) {
    yield a;
    [a, b] = [b, a + b];
  }
}

let [a, b, c, d] = fibs;

// 设置 默认值
let [foo = "foo"] = [];
let [x, y = true] = [1];
// 只有数组成员严格等于 undefined（严格相等运算符 === ）,默认值才会生效
let [x, y = true, z] = [1, undefined, null];

// 惰性求值，使用函数
function lazyValue() {
  return "lazy";
}
let [x = lazyValue()] = [1];

// 错误操作，变量未声明直接使用
let [x = y, y = 1] = []; // Uncaught ReferenceError: y is not defined
// 正确演示
let [x = 1, y = x] = [];

// 01 对象  ---------- ---------- //
// 匹配属性名，没有顺序之分
let { x, y } = { x: 1, y: 2 };
// 默认 undefined
let { x } = {};

// 赋值过程：找到同名属性，再赋值给对应的变量
let { y } = { y: 1 };
let { y: y } = { y: 1 };
let { x: y } = { x: 1 };
// 定义一个别名 匹配api返回的data属性名，赋值给真正的变量 tableList
let { data: tableList } = { data: [] };
const { designCode, patternVersion: version } = {designCode: 1, patternVersion: 2}

// 复杂嵌套
let response = {
  data: {
    list: [{ id: 1 }, { id: 2 }],
    pageNum: 1,
    pageSize: 20,
    total: 47,
  },
};
// 创建变量 tableList, pageNum, pageSize, total
let {
  data: { list: tableList = [], pageNum = 1, pageSize = 10, total = 0 },
} = response;

// 设置 默认值 严格相等模式为 undefined
// $$ 报错：嵌套对象，子对象所在的父属性不存在
// Uncaught TypeError: Cannot read property 'list' of undefined
let {
  data: { list: tableList = [], pageNum = 1, pageSize = 10, total = 0 },
} = null || {};
// 正确写法
response = null;
let {
  data: { list: tableList = [], pageNum = 1, pageSize = 10, total = 0 },
} = response || { data: {} };
// iterable的数据结构都不会报错，即使 {} vs []
let {
  data: { list: tableList = [], pageNum = 1, pageSize = 10, total = 0 },
} = { data: [] };

// $$ 报错：非嵌套对象
// 匹配的foo的值为undefined，再取子属性{bar} 当然会报错
let {
  foo: { bar },
} = { baz: "baz" };

// 默认值为 undefined
let { x = 3 } = { x: undefined }; // x 3

// 03 特别注意的点 ---------- ---------- //
// 1. 已声明变量，{x}被认为是代码块
let x;
// Uncaught SyntaxError: Unexpected token '='
// {x} = {x: 1}

// 正确使用
({ x } = { x: 1 })(
  // 2. = 左边可以没有变量
  ({} = [])
);
// 3. 数组对象也能当普通对象进行解构
arr = ["foo", "faz"];
let { 0: first, [arr.length - 1]: last } = arr;

// 04 Boolean, Number, String ---------- ---------- //
// String 也能 for.of
let str = "string";
for (let value of str) {
  console.log(value);
}
// 字符串也能当数组的方式 进行解构
let [a, b, c] = str;

// 等号右边不是数组或对象，会先转为对象
// Boolean
let { toString: nativeCode } = true;
nativeCode === Boolean.prototype.toString;

// Number
let { toString: nativeCode } = 1;
nativeCode === Number.prototype.toString;

// 05 Function ---------- ---------- //
// array, 与数组解构一样
function arr([data = [], type = "update"]) {}
arr([]);

// object 设置匹配项的默认值，设置变量的默认值
function obj({ x = 0, y = 1 } = {}) {
  console.log(x, y);
}
// undefined 使用默认值 {}
obj(undefined);
// null 报错
obj(null);
// 隐式转换为对象
obj(1);
obj(true);
obj("str");

// 匹配项的默认值 vs 变量的默认值
function obj({ x, y } = { x: 1, y: 2 }) {
  console.log(x, y);
}
obj();
obj({ x: 1 }); // 1 undefined
obj({}); // undefined undefined

// 06 圆括号的问题 ---------- ---------- //
// 编译器要判断是 表达式 or 模式，模式不能使用()

// 小技巧
let x = 1;
let y = 2;
[x, y] = [y, x]; // 交换值

// 遍历 Map
let map = new Map([
  ["x", 0],
  ["y", 1],
]);

for (let item of map) {
  console.log(item);
}
// 利用数组解构
for (let [key, value] of map) {
  console.log(key, value);
}
for (let [key] of map) {
  console.log(key, value);
}
for (let [, value] of map) {
  console.log(key, value);
}

// 模块
// const {a, b} = require('./util')

const { hasOwnProperty } = Object.prototype;
hasOwnProperty.call({ a: 1 }, "a"); // true
