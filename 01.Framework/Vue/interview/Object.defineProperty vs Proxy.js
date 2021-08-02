// 深入 Vue 响应式原理

/**
 * 面试题
 * 知道Vue响应式数据原理吗？Proxy 与 Object.defineProperty 优劣对比?
    Object.defineProperty：
     从这个接口可以看出来，它只能劫持对象的属性。而属性的值可能又是一个对象，这是一个深度遍历的过程。
     数组也可以劫持索引
     问题1.监听不到数组长度的变化（包括 .length, push. pop, shift, unshift, splice等，都会改变数组长苏）；
     问题2.监听数组所有索引的成本太高；
    
    Proxy:
    不仅可以代理对象，也可以代理数组，还可以代理动态增加的属性。
 */

// start ----- //
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
            console.log(`collect dependencies：${key} = ${JSON.stringify(value)} `)
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
        this.walk(value)
    }
    walk(obj) {
        const keys = Object.keys(obj)
        for (let i = 0; i < keys.length; i++) {
            defineReactive(obj, keys[i])
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
    ob = new Observer(value)
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
let cArr = {
    arr: [1, 2, 3]
}

let observer = new Observer(cArr)
// // 触发 get
// cArr.arr
// // 触发 set
// cArr.arr[0] = 11
// cArr.arr[1] = 22
// cArr.arr[2] = 33

// 数组变化
cArr.arr

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
