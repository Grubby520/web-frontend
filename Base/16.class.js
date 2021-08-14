// class写法只是让对象原型的写法更加清晰，更像面向对象编程的语法而已
function consol(boo) {
    console.log(boo)
}

const bar = Symbol('bar')

class Point {
    // * 实例属性也可以写在顶层或外层
    _count = 0 // 不需要添加 this.

    // 静态属性
    static length = 1 // 在类上，而不在实例上

    // 私有属性的一种提案,只是提案 #xx, 可以，属性，方法
    #owner = 'owner'
    // 方法，只能类内部调用
    #setOwner(value) {
        this.#owner = value
    }
    // 使用关键字
    static #self = 'self'

    // 构造器, 如果没有显示定义，引擎会默认添加一个空的constructor方法
    constructor(x = 1, y = 1) {
        // new执行初始化时，执行这个方法，他们都是实例上的属性
        this.x = x
        // * 实例属性的1种写法
        this.y = y
        // new.target 指向 构造函数，区分是通过new创建还是 Reflect.construct() - 值为undefined
        consol(new.target === Point) // 通过 new 调用
    }
    
    get value() {
        consol('getter')
        return this._count
    }
    increment() {
        this._count++
    }

    // 原型上的方法
    toString() {
        consol('toString fn')
        return this
    }
    // 静态方法
    static is() {
        consol('class is')
        // 内部的this指向的是类本身，而不是实例，说明还可以去实例的方法同名
        console.log('is fn', this)
        return true
    }
    is() {
        console.log('prototype is')
    }

    // 给属性设置存取值函数
    get prop() {
        consol('getter')
        return this.x
    }
    set prop(value) {
        consol('setter')
        this.x = value
    }

    // ? 类如何实现私有方法 使用 Symbol
    [bar]() {
        console.log(bar)
        return this.x
    }

    getOwner() {
        consol(this.#owner)
    }
}

// 类不同于普通构造函数，它必须用new执行
let point = new Point()
point.toString()
Point.is()
consol(Point.length)
consol(Point.prototype)

// ES5的行为，它都有
typeof Point === 'function'
Point.prototype.constructor === Point // true
point instanceof Point // true

// 类的内部定义的方法都是不可枚举 { enumerable: false }
consol(Object.keys(Point.prototype)) // []
consol(Object.getOwnPropertyNames(Point.prototype)) // ["constructor", "toString"]
consol(Object.getOwnPropertyDescriptor(Point.prototype, 'toString'))

// 实例上的属性
point.hasOwnProperty('x') === true
point.hasOwnProperty('toString') === false // 在原型上
point.__proto__.hasOwnProperty('toString') === true // 实例通过 __proto__
Point.prototype.hasOwnProperty('toString') === true // 类通过 prototype

let p1 = new Point()
let p2 = new Point()

// 实例共享原型
p1.__proto__ === p2.__proto__

// __proto__ 是浏览器厂商实现时添加的私有属性，不建议在生产环境使用，可以获取原型再添加方法/属性
// wrong
point.__proto__.print = function () {
    return this.x
}
// right
const proto = Object.getPrototypeOf(point)
Object.assign(proto, {
    toValue() {
        return this.x + this.y
    }
})

// setter, getter
point.prop
point.prop = 10

// 类表达式 意义不大
// 外部只能使用 MyClass
let MyClass = class Me {
    // 内部只能使用 Me
    // class 内部，一定是严格模式，不用使用 use strict
}
// 内部不使用 匿名类
MyClass = class { }

// * class 不存在提升 原因：与继承有关，必须保证子类在父类之后定义
{
    let Far = class { }
    class Bar extends Far { }
}

// name 属性
consol(Point.name === 'Point')

// this 的指向 默认指向类的实例。错误操作：单独使用时，类内部是严格模式，this的值是undefined,调用this.xx就会报错

// 解决this的指向，可以考虑箭头函数 arrow fn

// 子类可以继承父类的 <static 方法>
class Child extends Point {

}

consol(Child.is())

consol(point[bar]())

// 外部还是可以拿到私有方法 2种方法
consol(Reflect.ownKeys(Point.prototype))
consol(Object.getOwnPropertySymbols(Point.prototype))

point[Object.getOwnPropertySymbols(Point.prototype)[0]]() === 0 // 依然可以调用

// 
consol(point['#owner']) // undefined
point.getOwner() // 'owner'

consol(point)

// ？如何实现只能继承，不能实例化
class Shape {
    constructor() {
        if (new.target === Shape) {
            throw new Error('can not be instantiation')
        }
    }
}

// Uncaught Error
new Shape()
