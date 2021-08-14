/**
 基本数据类型
 string, number, boolean, null, undefined, bigInt, Symbol
 
 基本包装类型
 String, Number, Boolean, BigInt, Symbol

 特点：
 值不可变
 */
function print() {
  console.log(arguments[0])
}

str = 'string'
num = 1.12
boo = true
nul = null
und = undefined

bigint = 1n
symbol = Symbol('foo')

// 1. typeof 判断类型

print(typeof str) // 'string'
print(typeof num) // 'number'
print(typeof boo) // 'boolean'
print(typeof nul) // 'object'
print(typeof und) // 'undefined'
print(typeof bigint) // 'bigint'
print(typeof symbol) // 'symbol'

// 2. 业务上，对 null, undefined 做额外处理

function isPrimitive(v) {
  return (typeof v !== 'object' && typeof v !== 'undefined') || v !== null
}

function isUndef(v) {
  return v === undefined || v === null
}

function isDef(v) {
  return v !== undefined && v !== null
}

// 3. 基本包装类型
// primitive values 原始值，没有属性和方法，值可以被替换，但值不可改变。
// 通常，我们用不到包装类型。< 当调用只有值对应的对象上才有的方法或查询值的时候，JS内部会自动把基本类型转成对象，再执行方法或查询。>

// e.g. String
strObj = new String('1')
print(typeof strObj) // 'object'

print(str.includes('ing'))

// ---------- ---------- ---------- //
/**
 引用数据类型
 Object 对象
 传址，而非传值；标识符(变量)存的是内存的一块区域的地址，类似C的指针；
 */
arr = [1, '1', [1, 2], { a: 1 }, [{ b: 1 }]]
obj = { a: 1 }

// 1. typeof
print(typeof arr) // 'object'
print(typeof obj) // 'object'

// 2. object instanceof constructor 检测 object 实例的原型链上是否存在 constructor.prototype

// 数组 instanceof
print(arr instanceof Array)
print(arr instanceof Object)

// 数组 Object.getPrototypeOf
Object.getPrototypeOf(arr) === Array.prototype

// 数组 Array.isArray
Array.isArray(arr)

// 对象 instanceof 无法区分是 array 还是 其他内置对象创建的
print(obj instanceof Object)

// 对象 Object.getPrototypeOf < 通过constructor判断有风险，比如通过 Object.setPrototypeOf 修改原型 >
Object.getPrototypeOf(obj) === Object.prototype

// 万能大法 Object.prototype.toString
const toString = Object.prototype.toString
function getDataType(v) {
  return toString.call(v)
}

print(getDataType(str))
print(getDataType(num))
print(getDataType(boo))
print(getDataType(und))
print(getDataType(nul))
print(getDataType(bigint))
print(getDataType(symbol))
print(getDataType(arr))
print(getDataType(obj))

date = new Date()
regexp = new RegExp()
fn = function() {}

print(getDataType(date))
print(getDataType(regexp))
print(getDataType(fn))

set = new Set()
map = new Map()

print(getDataType(set))
print(getDataType(map))

// 函数比较特殊
typeof fn === 'function'

// 补充1：判断是否是可迭代的 iterable, 具有 Symbol.iterator 接口
function iterable(v) {
  const iter = v[Symbol.iterator]
  // 这里排除是自己实现的接口的情况
  return isNative(iter)

  // if (typeof iter !== 'function') {
  //   return false
  // }
  // const obj = iter() // 内置的，不能这样玩
}

// 补充2：判断是否是原生方法
function isNative(ctor) {
  return typeof ctor === 'function' && /native code/.test(ctor.toString())
}

// true
print(iterable(arr))
print(iterable(str))
print(iterable(set))
print(iterable(map))

// false
print(iterable(num))
print(iterable(obj))
print(iterable(boo))

// ---------- ---------- ---------- //
/**
 数据结构
 几乎所有通过 new keyword() 创建的对象，都能作为数据结构
 new Object
 new Array
 new Map
 new Set
 new WeakMap
 new WeakSet

 (其他内置对象...)
 */
