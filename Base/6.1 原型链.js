/**
[[prototype]]机制
  [[prototype]]机制就是存在与对象中的一个内部链接，它会引用其他对象。
  通常来说，这个链接的作用是：如果在对象上没有找到需要的属性或者方法引用，引擎就会继续在 [[ptototype]]关联的对象上进行查找，同理，如果在后者中也没有找到需要的引用就会继续查找它的[[prototype]],以此类推。这一系列对象的链接被称为“原型链”。

  但是哪里是 [[prototype]]的 ”尽头“呢？
  所有普通的 [[prototype]]链最终都会执行内置的 Object.prototype。由于所有的"普通"(内置，不是特定主机的扩展)对象都”源于“(或者说把[[prototype]] 链顶端设置为)这个Object.prototype对象，所以说它包含JavaScript中许多通用的功能。比如说.toString()和 .valueOf()等等。
*/

// (1) 测试数组
const arr = []

arr.__proto__ === Array.prototype // 实例上的属性 __proto__ 浏览器实现
Array.prototype.constructor === Array // 原型内部都一个指针 constructor 指向本身
arr instanceof Array === true // instanceof 实例的原型链上是否有指定构造函数的原型

// 上1层

const ArrayPro = Array.prototype // 实例对象变成了 Array.prototype

ArrayPro.__proto__ === Object.prototype // Array 其实是 Object 的一个子类型而已
Object.prototype.constructor === Object
arr instanceof Object === true

// 上2层
const ObjectPro = Object.prototype // Object 构造函数
ObjectPro.__proto__ === null // true 到顶层了

typeof Object === 'function' // true


// 上3层
Object instanceof Function === true // 说明 Object 构造函数 是 Function 的一个子类型

arr instanceof Function === false // Function 在原型链上不可见

// (2) 测试函数
const fn = () => {}
typeof fn === 'function'
fn instanceof Function === true
fn.__proto__ === Function.prototype
