/**
 * async/await 等价于 generator + Promise
 * 用同步的方式写异步代码
 * async/await关键字让我们可以用一种更简洁的方式写出基于Promise的异步行为，而无需刻意地链式调用promise
 * @returns { Promise } 即使不是，也会包装成Promise
 * 
 * 优势：
 * 1.内置执行器（内部的 co模块）
 * 2.更好的语义（await 等待后面的表达式的结果）
 * 3.更广的实用性（co模块规定-yield后面只能跟chunk函数/Promise对象；await-后面可以是Promise/原始类型的值（数值、字符串和布尔值，会转成resolved的Promise，Promise.resolve(x)））
 * 4.返回Promise（Generator返回的是Iterator遍历器对象，而async返回Promise，可以then继续调用）
 * 
 * 难点：
 * 1.错误处理机制（才有了 awaitTo 函数）
 */

// 没有跑服务，所以import会存在跨域的问题，浏览器不支持模块化
// import { awaitTo } from '../02.Advanced-进阶/util'

function awaitTo(promise) {
    return promise
        .then((res) => {
            if (res.success) {
                return [undefined, res]
            } else {
                return [res.error.message]
            }
        })
        .catch((err) => {
            return [err.message || '接口服务器异常']
        })
}

const myPromise = {
    resolvePromise(temp, timeout = 1000) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(temp)
            }, timeout)
        })
    },
    rejectPromise(temp, timeout = 1000) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                reject(new Error(temp))
            }, timeout)
        })
    }
}

const tasks = {
    async easyTest() {
        console.log('resolvePromise before')
        const res = await myPromise.resolvePromise()
        // doubt 1：await 后面的代码，实际是放入异步回调后才执行（好比then的cb）
        // await表达式会暂停整个async函数的执行进程并让出其控制权，只有基于它后面的promise有了结果后才会恢复进程
        console.log('resolvePromise after')
        const err = await myPromise.rejectPromise()
        // doubt 2：await的promise如果reject，则会中断后续的执行
        console.log('rejectPromise after')
    },
    async exceptionHandler() {
        // 异步代码，捕获异常的方式(try.catch)
        try {
            const err = await myPromise.rejectPromise('exceptionHandler')
            console.log('rejectPromise after')
            console.log(err)
        } catch (error) {
            console.log(error)
        }
        // 另一种处理异常的方式(.catch)
        await myPromise.rejectPromise('throw error')
            .catch(err => err)
        return 'sth wrong!'
    },
    async betterHandler() {
        // 更加优雅的处理异常的方式（借鉴了node对error的处理方式）
        const [err, res] = await awaitTo(myPromise.rejectPromise('exceptionHandler'))
        console.log(err, res)
        console.log('rejectPromise after')
    },
    async resolveTest() {
        const res = await myPromise.resolvePromise('resolve test')
        // coding
        return res
    },
    async rejectTest() {
        return await myPromise.rejectPromise('reject test')
    },
    async syncTest() {
        // doubt 同步代码
        // return 1

        // doubt 只要有 await，就一定是异步代码
        await 1 // 内部包装
        // 等价于
        await Promise.resolve(1).then(() => { })
    }
}

// tasks.easyTest()
// tasks.exceptionHandler()
// tasks.betterHandler()
let response = tasks.resolveTest()
// doubt 3: async函数返回的一定是一个Promise（如果不是，也会包装成一个Promise）
typeof response === 'object'
response instanceof Promise === true


// step 1 -------------- --------------- //

// 01 并发调度器的测试代码（为了理解 scheduler_02.js 中的 Scheduler_02 类）
let queue = []
let count = 0
let limit = 1
async function scheduler(fn) {
    if (count >= limit) {
        console.log('await before')
        await new Promise(resolve => queue.push(resolve))
        console.log('await before')
    }
    console.log('cb start')
    count++
    const res = await fn()
    console.log('cb end', res)
    count--
    if (queue.length) {
        queue.shift()()
    }
}

// scheduler(myPromise.resolvePromise.bind('第一个'), 2000)
// scheduler(myPromise.resolvePromise, 3000)
// scheduler(myPromise.resolvePromise, 1000)
// scheduler(myPromise.resolvePromise, 2000)
// scheduler(myPromise.resolvePromise, 1000)

// 02 各类骚操作汇总 -------------- --------------- //
// * async函数的5种使用形式
// 函数声明
async function test01() {
    await myPromise.resolvePromise('test01')
}
// 函数表达式
const test02 = async function () {
    await myPromise.resolvePromise('test02')
}
// 对象的属性
let obj = {
    async test03() {
        await myPromise.resolvePromise('test03')
    }
}
// 箭头函数
const test04 = async () => {
    await myPromise.resolvePromise('test02')
}
// class
class myClass {
    async test05() {
        await myPromise.resolvePromise('test02')
    }
}

// * 同步代码，依然会异步执行
{
    console.log('start')
    async function test() {
        await (1 + 1)
        console.log('after await') // 'end' 之后才会执行
    }
    test()
    setTimeout(() => {
        console.log('宏任务执行')
    })
    console.log('end')
}

// * async函数体内部又多个await，一旦一个await出错，async函数就会中断，执行结束
async function multiAwait() {
    await myPromise.rejectPromise('wrong') // 后面的代码不会执行
    await myPromise.resolvePromise('right')
    console.log('done')
}

// * await命令不能用于普通函数内部
let arr = [1, 2, 3]
async function errorUsing() {
    // error
    arr.forEach(item => {
        await myPromise.resolvePromise(item)
    })
    // wrong using
    arr.forEach(async item => {
        await myPromise.resolvePromise(item) // 并发执行，而不是继发执行
    })
    // right using
    for (let item of arr) {
        await myPromise.resolvePromise(item) // 继发执行
    }
}

// * return语句不是必须的，看是否需要使用返回值

// * async函数可以保留执行堆栈

const a = async () => {
    await myPromise.resolvePromise(); // a()是暂停执行，上下文环境都保存着
    myPromise.resolvePromise(); // 一旦某一个报错，错误堆栈讲包括 a()
};

// async函数实现原理 -------------- --------------- //
// 放到 < 02.Advanced-进阶 > 里面学习！