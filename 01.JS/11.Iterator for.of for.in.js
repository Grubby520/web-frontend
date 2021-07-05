/**
	Iterator（遍历器）的概念：
		四种数据'集合'：Array, Object, Set, Map
		JavaScript 原有的表示“集合”的数据结构，主要是数组（Array）和对象（Object）; ES6 又添加了Map和Set;

		why iterator?
		用户还可以组合使用它们，定义自己的数据结构，比如数组的成员是Map，Map的成员是对象。这样就需要一种统一的接口机制，来处理所有不同的数据结构。

		how iterator?
		遍历器（Iterator）是一种接口，为各种不同的数据结构提供统一的访问机制。任何数据结构只要部署 Iterator 接口，就可以完成遍历操作（即依次处理该数据结构的所有成员）。

		Iterator 的作用有三个：
		一是为各种数据结构，提供一个统一的、简便的访问接口；
		二是使得数据结构的成员能够按某种次序排列；
		三是 ES6 创造了一种新的遍历命令for...of循环，Iterator 接口主要供for...of消费。

	Iterator 的遍历过程是这样的。
	（1）创建一个指针对象，指向当前数据结构的起始位置。也就是说，遍历器对象本质上，就是一个指针对象。
	（2）第一次调用指针对象的next方法，可以将指针指向数据结构的第一个成员。
	（3）第二次调用指针对象的next方法，指针就指向数据结构的第二个成员。
	（4）不断调用指针对象的next方法，直到它指向数据结构的结束位置。

	每一次调用next方法，都会返回数据结构的当前成员的信息。具体来说，就是返回一个包含value和done两个属性的对象。
	其中，value属性是当前成员的值，done属性是一个布尔值，表示遍历是否结束。

	迭代协议（可迭代协议，迭代器协议）
	 @@iterator 方法。通过常量 Symbol.iterator 访问该属性
 */

let arr = [1, 2, 3];
let iterator = null;
function a() {
	return 1;
}

function makeIterator(array) {
	var nextIndex = 0;
	return {
		next: function () {
			return nextIndex <
				array.length
				? {
					value: array[
						nextIndex++
					],
					done: false,
				}
				: {
					value: undefined,
					done: true,
				};
		},
	};
}

iterator = makeIterator(arr);
iterator.next(); // {value: 1, done: false}

// 如果使用 TypeScript 的写法，遍历器接口（Iterable）、指针对象（Iterator）和next方法返回值的规格可以描述如下。
// {
// interface Iterable {
//   [Symbol.iterator]() : Iterator,
// }
// interface Iterator {
//   next(value?: any) : IterationResult,
// }
// interface IterationResult {
//   value: any,
//   done: boolean,
// }
// }

// Iterator的目的：为所有数据结构，提供了一种统一的访问机制，即for...of循环（详见下文）。当使用for...of循环遍历某种数据结构时，该循环会自动去寻找 Iterator 接口。

/**
	一种数据结构只要部署了 Iterator 接口，我们就称这种数据结构是“可遍历的”（iterable）
	ES6 规定，默认的 Iterator 接口部署在数据结构的 <Symbol.iterator> 属性。
	或者说，一个数据结构只要具有Symbol.iterator属性，就可以认为是“可遍历的”（iterable）。
	Symbol.iterator属性本身是一个函数，就是当前数据结构默认的遍历器生成函数。执行这个函数，就会返回一个遍历器。
	至于属性名Symbol.iterator，它是一个表达式，返回Symbol对象的iterator属性，这是一个预定义好的、类型为 Symbol 的特殊值，所以要放在方括号内（参见《Symbol》一章）。
 */

// 自己在 Symbol.iterator 属性上部署 Iterator 接口
let myIterable = {};
myIterable[Symbol.iterator] = function* () {
	yield 1;
	yield 2;
	yield 3;
};

function forOf(iterable) {
	// for.of 自动遍历原生的 <遍历器生成函数>
	for (let v of iterable) {
		console.log(
			v
		);
	}
}

forOf(myIterable);

/**
 原生具备 Iterator 接口的数据结构如下：
	Array
	String
	Map
	Set
	TypedArray
	函数的 arguments 对象
	NodeList 对象

 其他 实现了 Iterator 接口
	扩展运算符 [...arr]
	Array.from(iterator)
 */

// Array
arr = [1, 2];
arr[Symbol.iterator]; // ƒ values() { [native code] }
typeof arr[Symbol.iterator] === "function";
forOf(arr);

// 部署了Symbol.iterator属性的数据结构，就称为部署了遍历器接口。调用这个接口，就会返回一个遍历器对象
let iter = arr[Symbol.iterator]();

// Array Iterator {}
// __proto__: Array Iterator
// next: ƒ next()
// Symbol(Symbol.toStringTag): "Array Iterator"
// __proto__: Object

iter[Symbol.toStringTag] === "Array Iterator";

iter.next();
iter.next();
iter.next(); // {value: undefined, done: true}

// String
str = "string";
str[Symbol.iterator]; // ƒ [Symbol.iterator]() { [native code] }
iter = str[Symbol.iterator]()
iter.next()
iter.next()

arr = [...str] // 解构-扩展运算符，也会调用迭代器对象

// Map
map = new Map().set("k", "v");
map[Symbol.iterator]; // ƒ entries() { [native code] }
for (let [k, v] of map) {
	// 返回的是一个数组
	console.log(k, v)
}

// Set
set = new Set().add({ a: 1 });
set[Symbol.iterator]; // ƒ values() { [native code] }
for (let v of set) {
	// 返回的是一个值
	console.log(v)
}


// 对象原生不支持迭代协议，手写一个类 ---------- ---------- //
class RangeIterator {
	constructor(start, stop) {
		this.value = start;
		this.stop = stop;
	}

	// Symbol.iterator 属性，是一个函数，执行后返回this，即当前对象的遍历器对象，包含一个next方法 {next: f }
	[Symbol.iterator]() { return this; }

	next() {
		var value = this.value;
		if (value < this.stop) {
			this.value++;
			return { done: false, value: value };
		}
		return { done: true, value: undefined };
	}
}

function range(start, stop) {
	return new RangeIterator(start, stop); // 模拟一个 iterator 接口
}

for (var value of range(0, 3)) {
	console.log(value); // 0, 1, 2
}


// 下面是通过遍历器实现指针结构的例子 ---------- ---------- //
function Obj(value) {
	this.value = value;
	this.next = null;
}

Obj.prototype[Symbol.iterator] = function () {
	var iterator = { next: next };

	var current = this;

	function next() {
		if (current) {
			var value = current.value;
			current = current.next;
			return { done: false, value: value };
		}
		return { done: true };
	}
	return iterator;
}

var one = new Obj(1);
var two = new Obj(2);
var three = new Obj(3);

one.next = two;
two.next = three;

for (var i of one) {
	console.log(i); // 1, 2, 3
}

// 直接给 对象 添加 Iterator 接口
let obj = {
	data: ['hello', 'world'],
	[Symbol.iterator]() {
		const self = this;
		let index = 0;
		return {
			next() {
				if (index < self.data.length) {
					return {
						value: self.data[index++],
						done: false
					};
				}
				return { value: undefined, done: true };
			}
		};
	}
};

// 类似数组的对象 调用数组的Symbol.iterator方法的例子

let iterable = {
	0: 'a',
	1: 'b',
	2: 'c',
	length: 3,
	[Symbol.iterator]: Array.prototype[Symbol.iterator]
};
for (let item of iterable) {
	console.log(item); // 'a', 'b', 'c'
}

// Qs: 什么样的数据结构可以用for.of遍历？
// As: 有遍历器接口，是一个函数，必须返回一个遍历器对象，包含next方法，执行方法返回包含value和done属性
//     遍历器对象每次移动指针（next方法），检查done属性，继续移动指针，直到done为true。

// 1. 获取遍历器接口，执行，返回遍历器对象
var $iterator = ITERABLE[Symbol.iterator]();
// 调用 next 方法
var $result = $iterator.next();
// 直到完成 done为true
while (!$result.done) {
	var x = $result.value;
	// ... 移动指针
	$result = $iterator.next();
}

//（1）解构赋值

// 对数组和 Set 结构进行解构赋值时，会默认调用Symbol.iterator方法。

let set = new Set().add('a').add('b').add('c');

let [x, y] = set;
// x='a'; y='b'

let [first, ...rest] = set;
// first='a'; rest=['b','c'];

//（2）扩展运算符

// 扩展运算符（...）也会调用默认的 Iterator 接口。
// 例一
var str = 'hello';
[...str] //  ['h','e','l','l','o']

// 例二
let arr = ['b', 'c'];
['a', ...arr, 'd']
// ['a', 'b', 'c', 'd']

// 例三
map = new Map([[1, 2]])
arr = [...map]

//（3）yield*

// yield*后面跟的是一个可遍历的结构，它会调用该结构的遍历器接口。

let generator = function* () {
	yield 1;
	yield* [2, 3, 4];
	yield 5;
};

var iterator = generator();

iterator.next() // { value: 1, done: false }
iterator.next() // { value: 2, done: false }
iterator.next() // { value: 3, done: false }
iterator.next() // { value: 4, done: false }
iterator.next() // { value: 5, done: false }
iterator.next() // { value: undefined, done: true }

//（4）其他场合

// 由于数组的遍历会调用遍历器接口，所以任何接受数组作为参数的场合，其实都调用了遍历器接口。下面是一些例子。

/**
	for...of
	Array.from()
	Map(), Set(), WeakMap(), WeakSet()（比如new Map([['a',1],['b',2]])）
	Promise.all()
	Promise.race()
	字符串的 Iterator 接口
	字符串是一个类似数组的对象，也原生具有 Iterator 接口。
 */

// --------------- ------------------ ------------------- //

// Iterator 接口与 Generator 函数
// 1. 使用 Generator 实现 Symbol.iterator() 函数
obj = {
	*[Symbol.iterator]() {
		yield 'hello';
		yield 'world';
	}
};

[...obj]

forOf(obj)

// return(), throw()

str = 'string'

// 使用 break 跳出循环，触发内部 return 方法
for (let v of str) {
	if (v === 'r') {
		break
	}
	console.log(v)
}

// throw 抛出异常，触发 return
for (let v of str) {
	if (v === 'r') {
		throw new Error()
	}
	console.log(v)
}

// 骚操作 object
obj = {}
arr = [1, 2]
// 给 object 手动添加 array 的迭代器对象
obj[Symbol.iterator] = arr[Symbol.iterator].bind(arr)

forOf(obj)

// for.in vs for.of ---------- ---------- //
/** 
	for...in循环有几个缺点。

	1.数组的键名是数字，但是for...in循环是以字符串作为键名“0”、“1”、“2”等等。
	2.for...in循环不仅遍历<数字键名>，还会遍历手动添加的<其他键>，甚至包括<原型链上的键>。
	3.某些情况下，for...in循环会以<任意顺序>遍历键名。
	4.总之，for...in循环主要是为<遍历对象>而设计的，不适用于遍历数组。
	5.对象：<可迭代的属性>，包括<原型链上的属性>

	for...of循环相比上面几种做法，有一些显著的优点:

	1.有着同for...in一样的简洁语法，但是没有for...in那些缺点。
	2.不同于forEach方法，它可以与<break、continue和return>配合使用。
	3.提供了遍历<所有数据结构的统一操作接口>。
*/
function forIn(data) {
	for (let k in data) {
		console.log(k)
	}
}

// for.in 遍历的是 key 键名
forIn(arr)

// for.of 遍历的是 value 键值
forOf(arr)

// for.of 也想获取 键名, 利用 entries, keys 方法
forOf(arr.keys())
forOf(arr.entries())

// 对象使用 for.in
obj = { a: 1, b: 2 }
forIn(obj) // 'a', 'b'

// array 和 object, 还有一个重要的不同点

arr.foo = 'foo'
// 数组的遍历器接口只返回具有数字索引的属性
forOf(arr)
// 不影响
forIn(arr) // 读取到 ’foo‘

// 其他不常见的对象 ---------- ---------- //
// DOM NodeList对象
let paras = document.querySelectorAll("p");

for (let p of paras) {
	p.classList.add("test");
}

// arguments对象
function printArgs() {
	for (let x of arguments) {
		console.log(x);
	}
}
printArgs('a', 'b');
// 'a'
// 'b'

// 对于字符串来说，for...of循环还有一个特点，就是会正确识别 32 位 UTF-16 字符。

for (let x of 'a\uD83D\uDC0A') {
	console.log(x);
}
// 'a'
// '\uD83D\uDC0A'

// 并不是所有类似数组的对象都具有 Iterator 接口，一个简便的解决方法，就是使用Array.from方法将其转为数组。

let arrayLike = { length: 2, 0: 'a', 1: 'b' };

// 报错
for (let x of arrayLike) {
	console.log(x);
}

// 正确 from() 把类数组转成真正的数组
for (let x of Array.from(arrayLike)) {
	console.log(x);
}
