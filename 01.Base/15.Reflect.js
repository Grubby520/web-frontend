Reflect;
/**
 Reflect {defineProperty: ƒ, deleteProperty: ƒ, apply: ƒ, construct: ƒ, get: ƒ, …}
    apply: ƒ apply()
    construct: ƒ construct()
    defineProperty: ƒ defineProperty()
    deleteProperty: ƒ deleteProperty()
    get: ƒ ()
    getOwnPropertyDescriptor: ƒ getOwnPropertyDescriptor()
    getPrototypeOf: ƒ getPrototypeOf()
    has: ƒ has()
    isExtensible: ƒ isExtensible()
    ownKeys: ƒ ownKeys()
    preventExtensions: ƒ preventExtensions()
    set: ƒ ()
    setPrototypeOf: ƒ setPrototypeOf()
    Symbol(Symbol.toStringTag): "Reflect"
    __proto__: Object
*/

/**
 * kp: 
 * 拥有与 Proxy 一样的方法，两者一一对应，Proxy+Reflect 完成方法的默认行为，关注点在具体的拦截行为里面
 * Reflect 只有静态属性和静态方法（与 Math 类似），并不是一个构造函数
 * 将Object对象的一些明显属于语言内部的方法（比如Object.defineProperty），放到Reflect对象上
 * 修改Object的某些方法的返回结果，不要报错会更合理
 */

function consol(boo) {
    console.log(boo)
}

consol(Reflect.has(Object, 'assign'))
consol(Reflect.has(Object, 'defineProperty'))

let obj = {
    a: 1,
    b: 2
}

// 命令式 -> 函数式
consol(Reflect.has(obj, 'a'))

// Proxy对象上使用，用Reflect完成对应的方法的默认行为
let target = {}
let proxy = new Proxy(target, {
    set(target, name, value) {
        consol('set')
        const result = Reflect.set(target, name, value) // 完成方法的默认行为
        return result
    },
    get(target, key) {
        consol('get')
        return Reflect.get(target, key)
    },
    deleteProperty(target, name) {
        consol('deleteProperty')
        return Reflect.deleteProperty(target, name)
    },
    has(target, name) {
        consol('has')
        return Reflect.has(target, name)
    }
})

proxy.a = 1
proxy.a
proxy.b = 2
delete proxy.b
consol(Reflect.has(obj, 'a'))
consol('b' in proxy)

consol(proxy)
