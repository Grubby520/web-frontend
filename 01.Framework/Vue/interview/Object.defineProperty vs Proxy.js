/**
 * 面试题: 
 * 1.深入 Vue 响应式原理?
 * 2.知道Vue响应式数据原理吗？Proxy 与 Object.defineProperty 优劣对比?
    Object.defineProperty：
     从这个接口可以看出来，它只能劫持对象的属性。而属性的值可能又是一个对象，这是一个深度遍历的过程。
     数组也可以劫持索引
     问题1.监听不到数组长度的变化（包括 .length, push. pop, shift, unshift, splice等，都会改变数组长苏）；
     问题2.监听数组所有索引的成本太高；
    Proxy:
     不仅可以代理对象，也可以代理数组，还可以代理动态增加的属性。
 */

// start ----- //
// 修改数组的原型，拦截原型链上的方法，arrayMethod 是一个全局唯一的对象，对它做拦截处理
function def(obj, key, value, enumerable) {
    Object.defineProperty(obj, key, {
        configurable: true,
        enumerable: !!enumerable,
        writable: true,
        value
    })
}

const arrayProto = Array.prototype
const arrayMethod = Object.create(arrayProto)
// 给7个修改length的方法patch打补丁
const methodsToPatch = [
    "push",
    "pop",
    "shift",
    "unshift",
    "splice",
    "sort",
    "reverse"
]
// intercept mutating methods and emit events
methodsToPatch.forEach(method => {
    const original = arrayMethod[method]
    def(arrayMethod, method, function mutator(...args) {
        const result = original.apply(this, args) // 入参是数组，与预期的结果能一致?
        const ob = this.__ob__
        switch (method) {
            case "push":
            case "unshift":
                inserted = args; // unshift添加进开头的新元素
                break;
            case "splice":
                inserted = args.slice(2); // splice添加进来的新元素
                break;
        }
        if (inserted) ob.observeArray(inserted) // 新插入的元素实现响应式
        // 触发更新
        console.log(`array method update: ${method}`)
        return result
    })
})

// 处理之后数组的数据结构:
// __ob__: Observer {value: Array(1)}
// [[Prototype]]: Array
// pop: ƒ mutator(...args)
// push: ƒ mutator(...args)
// reverse: ƒ mutator(...args)
// shift: ƒ mutator(...args)
// sort: ƒ mutator(...args)
// splice: ƒ mutator(...args)
// unshift: ƒ mutator(...args)
// [[Prototype]]: Array(0)

function defineReactive(obj, key, val) {
    const property = Object.getOwnPropertyDescriptor(obj, key)
    if (property && property.configurable === false) {
        return
    }
    // 先默认外部声明时都没有定义 set, get
    const getter = property && property.get
    const setter = property && property.set
    // 初始化 data 默认不会传 val
    if ((!getter || setter) && arguments.length === 2) {
        val = obj[key]
    }
    // 递归深度遍历
    let childOb = observe(val)

    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get() {
            // 开始收集依赖
            const value = getter ? getter.call(obj) : val
            // 对数组做特殊处理
            if (Array.isArray(value)) {
                dependArray(value)
            }
            // console.log(`collect dependencies：${key} = ${JSON.stringify(value)} `)
            return value
        },
        set(newVal) {
            // 派发更新
            const value = getter ? getter.call(obj) : val
            if (newVal === value) {
                // 数组变更，索引对应的值可能不变
                return
            }
            if (getter && !setter) {
                return
            }
            if (setter) {
                setter.call(obj, newVal)
            } else {
                val = newVal
            }
            // 新值实现响应式
            childOb = observe(newVal)

            console.log(`notify update: ${key} = ${JSON.stringify(newVal)}`)
        }
    })
}

class Observer {
    constructor(value) {
        this.value = value
        def(value, "__ob__", this)
        if (Array.isArray(value)) {
            // start 数组响应式
            if ('__proto__' in {}) {
                // 基础知识 arr.__proto__ === Array.prototype 现代浏览器设计的一个 __proto__ 属性
                value.__proto__ = arrayMethod // 改写了 value 的原型
            }
            this.observeArray(value)
        } else {
            // 对象或其他基本类型走这
            this.walk(value)
        }
    }

    walk(obj) {
        const keys = Object.keys(obj)
        for (let i = 0; i < keys.length; i++) {
            defineReactive(obj, keys[i])
        }
    }

    observeArray(items) {
        for (let i = 0, l = items.length; i < l; i++) {
            observe(items[i]);
        }
    }
}

function observe(value) {
    const isObject = (value) => value !== null && typeof value === 'object'
    // 基本数据类型不处理
    if (!isObject) {
        return
    }
    let ob = null
    const hasOwn = (obj, key) => {
        return Object.prototype.hasOwnProperty.call(obj, key)
    }
    const isPlainObject = (obj) => {
        return Object.prototype.toString.call(obj) === '[object Object]'
    }
    // 可能其他更新方式，需要跳过已经attached的属性
    if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
        ob = value.__ob__
    } else if ((Array.isArray(value) || isPlainObject(value)) && Object.isExtensible(value) ) {
        // 深度遍历，只处理对象和数组
        ob = new Observer(value)
    }
    return ob
}

function dependArray(value) {
    // 收集 watcher ...
}
// end ----- //


// 测试-对象 ----- //
// let obj = {
//     a: 1,
//     b: {
//         'b-1': 1,
//         'b-2': 2
//     },
//     c: 3,
// }

// let observer = new Observer(obj)

// obj.a
// obj.b
// obj.b["b-1"] // 会先触发 get obj.b
// obj.c

// obj.a = 11
// obj.b["b-1"] = 101 // 会先触发 get obj.b
// obj.c = 33

// console.log(obj.a)

// // 提前定义，否则会失效
// obj.d = 4
// obj.d

// obj.c = {
//     'c1': 1
// }

// obj.c.c1




// 测试-数组 ----- //
// let cArr = {
//     arr: [1, 2, 3]
// }

// let observer = new Observer(cArr)
// // 触发 get
// cArr.arr
// // 触发 set
// cArr.arr[0] = 11
// cArr.arr[1] = 22
// cArr.arr[2] = 33

// 数组变化
// cArr.arr

// * 1.改变length，并不会触发 set
// cArr.arr.length = 2 


// cArr.arr = [{
//     a: 1
// }]

// cArr.arr[0]

// cArr.arr[0] = ['1-1', '1-2']

// * 2.索引10 并没有初始化，所以也无法触发 set
// cArr.arr[10] = '1-1-1-1'

// cArr.arr[0][0]

// console.log(cArr)

// 凡是动态改变length的方法都会失效
// cArr.arr.push(4)
// cArr.arr.pop()

// cArr.arr.unshift(0) // 索引 3，不会触发 set

// cArr.arr.shift() // 索引0, 1 更新，3被删除，也不知道?

// console.log(JSON.stringify(cArr))


// 拦截数组的方法 ----- //
cArr = {
    arr: [{
        label: 'who',
        value: 1
    }],
    obj: {
        a: 'a',
        b: 'b'
    }
}

observer = new Observer(cArr)

// 2种方式会失效
cArr.arr[0] = [1, 2, 3]
cArr.arr.length = 1

// 正确的操作
cArr.arr.push([{'aa': 1}])

cArr.arr.unshift({'unshift': 23})

cArr.arr.splice(0, 1)

console.log(observer)