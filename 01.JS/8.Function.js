// 设置默认值
function log(x, y = "boy") {
  console.log(x, y);
}

log();
log("hello");
log("hello", null);
// 严格判断 undefined 才会使用默认值
log("hello", undefined);

// error 函数内部不能声明与入参相同的变量
function log(x, y = "boy") {
  // Uncaught SyntaxError: Identifier 'x' has already been declared
  let x = "default";
}

// 设置参数默认值时，不能有同名参数
function log(x, x, y) {}
// Uncaught SyntaxError: Duplicate parameter name not allowed in this context [ˈdjuːplɪkeɪt]
function log(x, x, y = 1) {}

// 默认值是惰性求值
let x = 1;
function foo(p = x + 1) {
  console.log(p);
}
foo();
x = 10;
foo();

// 解构赋值，参考 <7.解构赋值>
// 如果匹配的模式不设置默认值，传参就要有默认值
function fetch(url, { body = "", method = "GET", headers = {} }) {}
// Uncaught TypeError: Cannot read property 'body' of undefined
fetch("apiUrl");
// 正确写法
fetch("apiUrl", {});

// 实际开发，参考这种写法
function fetch(url, { body = "", method = "GET", headers = {} } = {}) {}

fetch("apiUrl", {
  body: "not default",
});

// 设置默认值
// 入参骚操作会发现报错，实际开发鬼都不会这样玩
function fn(x = 1, y) {}

fn();
fn(10);
fn(undefined, 1); // 所以推荐把 默认值放到最后
// Uncaught SyntaxError: Unexpected token ','
// fn(, 1)

// length 属性

// 01 rest 参数 ---------- ---------- //
// 只有 rest
function rest(...list) {
  console.log(list);
}

rest(1, 2, [{ a: 1 }]);
// rest [1, 2, [{a: 1}]]

// 普通参数 + rest
function rest(first, ...list) {
  console.log(first, list);
}
rest(1, 2, [{ a: 1 }]);

// rest 只能放在最后
// Uncaught SyntaxError: Rest parameter must be last formal parameter
function rest(first, ...list, last) {
  console.log(first, list, last);
}

// 02 箭头函数 arrow function ---------- ---------- //
let arrow = () => {}

list = [{a: 1}]
// 返回对象，又不使用 return, 使用 () 包起来
listBy = list.map(item => ({
	b: item.a
}))

/**
  （1）箭头函数没有自己的this对象（详见下文）。

	（2）不可以当作构造函数，也就是说，不可以对箭头函数使用new命令，否则会抛出一个错误。

	（3）不可以使用arguments对象，该对象在函数体内不存在。如果要用，可以用 rest 参数代替。

	（4）不可以使用yield命令，因此箭头函数不能用作 Generator 函数
 */

// this 指向函数本身的this
// ES6
function foo() {
  setTimeout(() => {
    console.log('id:', this.id);
  }, 100);
}

// ES5
function foo() {
  var _this = this;

  setTimeout(function () {
    console.log('id:', _this.id);
  }, 100);
}

// 案例1
function foo() {
	return () => {
		return () => {
			return () => {
				console.log(this.id)
			}
		}
	}
}
f = foo.call({id: 1})

f.call({id: 2})()() // 1
f().call({id: 2})() // 1
f()().call({id: 2}) // 1

// λ 演算
// λ演算的写法
// fix = λf.(λx.f(λv.x(x)(v)))(λx.f(λv.x(x)(v)))

// ES6的写法
var fix = f => (x => f(v => x(x)(v)))(x => f(v => x(x)(v)));

// 02 尾调用 Tail Call ---------- ---------- //
// 概念
// 尾调用优化
// 尾递归
// 尾递归优化
// 尾逗号规则

// 03 其他 ---------- ---------- //
// toString 不会去掉 comments, 直接把函数转成字符串,代码都在
Function.prototype.toString
let fn = function() {return 1}
// 很多隐式转换 会使用
let str = fn.toString() // "function() {return 1}"


// ES2019 try.catch，catch可以省略传参
try {
	// xxx
} catch {
	// handle error
}

