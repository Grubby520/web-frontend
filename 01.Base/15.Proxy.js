/**
 * 用于创建一个对象的代理，从而实现基本操作的拦截和自定义（如属性查找、赋值、枚举、函数调用等）
 * let p = new Proxy(taeget, handler)
 * 语法：
 * target 被Proxy包装的目标对象，可以是任意对象，包括函数和原生对象等
 * handler 通常以函数作为属性的对象，各属性中的函数分别定义在执行各种操作时代理 p 的行为
 */

// handler 可配置的选项( 13 种)
/**
 getPrototypeOf(target) 拦截 Object.getPrototypeOf(), 返回对象
 setPrototypeOf(target, proto) 拦截 Object.setPrototypeOf() @returns { Boolean }
 isExtensible(target) Object.isExtensible() @returns { Boolean }
 preventExtensions(target) 拦截 Object.preventExtensions() @returns { Boolean }
 getOwnPropertyDescriptor(target, propKey) 拦截 Object.getOwnPropertyDescriptor(target, propKey) 返回属性的描述符对象
 defineProperty(target, propKey, propDesc) 拦截 Object.defineProperty(), Object.defineProperties() @returns { Boolean }
 has 拦截判断是否包含对象属性 'foo' in p @returns { Boolean }
 get(target, propKey, p) 拦截对象属性的读取 p.foo
 set(target, propKey, value, p) 拦截对象属性的设置 p.foo = 'foo' @returns { Boolean }
 deleteProperty(target, propKey) 拦截对象属性的删除操作 delete p.foo @returns { Boolean }
 ownKeys(target) 拦截Object.getOwnPropertyNames(proxy)、Object.getOwnPropertySymbols(proxy)、Object.keys(proxy)、for...in循环，返回一个数组
 apply(target, object, args) 拦截 Proxy 实例p作为函数调用的操作 p(...args), p.call(), p.apply()
 construct(target, args) 拦截 实例p作为构造函数调用的操作 new p(...args)
 */

let proto = {}

let handler = {
    // 查值操作
    get(obj, prop) {
        console.log('get operation')
        return prop in obj ? obj[prop]: '默认值'
    },
    // 赋值操作
    set(obj, prop, value, p) {
        console.log('set operation')
        obj[prop] = value
    },
    deleteProperty(target, key) {
        console.log('deleteProperty operation')
        if (key in target) {
            delete target[key]
            return true
        } else {
            return false
        }
    },
    enumerate(target, key) {
        console.log('enumerate operation')
    },
    ownKeys(target, key) {
        console.log('ownKeys operation')
        return Object.keys(target)
    },
    has(target, key) {
        console.log('has operation')
        return key in target
    },
    defineProperty(target, key, propDesc = {}) {
        console.log('defineProperty operation')
        Object.defineProperty(target, key, propDesc)
        return true
    },
    getOwnPropertyDescriptor(target, key) {
        console.log('getOwnPropertyDescriptor operation')
    },
    enumerate(target, key) {
        console.log('enumerate operation')
    },
    isExtensible(target) {
        console.log('isExtensible operation')
        return Object.isExtensible(proto)
    },
    getPrototypeOf(target) {
        console.log('getPrototypeOf operation')
        return proto
    },
    setPrototypeOf(target, key) {
        console.log('setPrototypeOf operation')
    }
}

let p = new Proxy(proto, handler)

// console.log(p.c) // 查值，调用 get

// target.b = 1 // target修改，p同步修改
// console.log(p)

p.a = 1
p.a
delete p.a
for(item in p) {
    console.log(p[item])
}
p.b = 2
'b' in p === true

Object.isExtensible(p)

Object.defineProperty(p, 'c', {
    value: 3
})