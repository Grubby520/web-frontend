/**
 * async/await 等价于 generator + Promise
 * 用同步的方式写异步代码
 * async/await关键字让我们可以用一种更简洁的方式写出基于Promise的异步行为，而无需刻意地链式调用promise
 * @returns { Promise } 即使不是，也会包装成Promise
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
        // 异步代码，捕获异常的方式
        try {
            const err = await myPromise.rejectPromise('exceptionHandler')
            console.log('rejectPromise after')
            console.log(err)
        } catch (error) {
            console.log(error)
        }
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
        await Promise.resolve(1).then(() => {})
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

