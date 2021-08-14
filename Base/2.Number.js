Number.prototype;
/**
	Number {0, constructor: ƒ, toExponential: ƒ, toFixed: ƒ, toPrecision: ƒ, …}
		constructor: ƒ Number()
		toExponential: ƒ toExponential()
		toFixed: ƒ toFixed()
		toLocaleString: ƒ toLocaleString()
		toPrecision: ƒ toPrecision()
		toString: ƒ toString()
		valueOf: ƒ valueOf()
		__proto__: Object
			[[PrimitiveValue]]: 0
 */

/**
 * Number 类型：双精度 IEEE 754 64位浮点 类型
 * stage3: BigInt 任意精度数字类型
 */
let num = null;
// 01 创建 ---------- ---------- //
num = 11;
num = Number("11"); // 执行类型转换
num = Number(11);

// Number 对象
num = new Number(11);
typeof num === "object";
num instanceof Number === true;

// 02 构造器上的静态属性 ---------- ---------- //
Number.EPSILON;
Number.MAX_SAFE_INTEGER;
Number.MAX_VALUE;
Number.MIN_SAFE_INTEGER;
Number.MIN_VALUE;
Number.NaN;
Number.NEGATIVE_INFINITY;
Number.POSITIVE_INFINITY;
Number.prototype;

// 02 构造器上的静态方法 ---------- ---------- //
Number.isNaN();
Number.isFinite();
Number.isInteger();
Number.isSafeInteger();
Number.parseInt();
Number.parseFloat();

// 03 String.prototype ---------- ---------- //
Number.prototype.constructor;
Number.prototype.toExponential;
Number.prototype.toFixed;
Number.prototype.toLocaleString;
Number.prototype.toPrecision;
Number.prototype.toString;
Number.prototype.valueOf;
Number.prototype.__proto__;

// 04 固定用法 ---------- ---------- //
// 转换 Date 对象
date = new Date(1624518628798);
date.valueOf() === Number(date);

// 转换 字符串
Number(123e-1); // 12.3
Number("12.00"); // 12
Number(null); // 0
Number(""); // 0
Number.isNaN(Number(undefined)); // true
Number(undefined); // NaN
Number("foo"); // NaN
Number("ff10"); // NaN
Number("10ff"); // NaN
Number("-Infinity"); // -Infinity
typeof Infinity === "number";

// 精度丢失的问题
0.1 + 0.2 === 0.3; // false
