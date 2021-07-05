/**
 * 使用 类 class 实现一个全局的通用的异步调度器
 * title: 实现一个带并发限制的异步调度器Scheduler，保证同时运行的任务最多2个，完善Scheduler类
 * 业务场景：所有Promise都通过 scheduler 添加异步任务并进行管理，它内部实现并发管控；而不是直接执行Promise
 * 
 * 分析：
 * 触发的起点：add方法被调用！
 * 通过调用 add 方法，向待执行队列里新增一条；
 * 准备flush执行中的队列：
 * 1.判断执行中的队列的情况，未达到并发数，立即执行；注意：先进先出，shift()从头部取一条进行执行；
 * 2.已达到并发数，监听整个执行队列，一旦返回一条，则执行上面1的逻辑，执行一条；注意，Promise.race()的能力；
 * 3.反向思考：如果没有 Promise.race()，我们应该怎么做
 */

// way one
class Scheduler {
    constructor(requestLimit = 2) {
        this.requestLimit = requestLimit
        this.taskQueue = [] // 待执行
        this.runQueue = [] // 执行中
    }
    add(task) {
        this.taskQueue.push(task)
        return this.flushSchedulerQueue() // 这个 return 之后返回的Promise，传递的层级就有点隐晦的，不如后面的方法
    }
    flushSchedulerQueue() {
        // 判断当前执行状态
        if (this.runQueue.length < this.requestLimit && this.taskQueue) {
            // branch-01 满足立即执行
            const task = this.taskQueue.shift() // 先进先出
            const result = task().then((res) => {
                console.log('fulfilled: ', res)
                return res // 链式向下传值
            }).catch(err => {
                console.log('reject: ', err)
                return err
            }).finally(() => {
                // 成功后把自身从runQueue队列里移除掉
                this.runQueue.splice(this.runQueue.indexOf(result), 1)
            })

            this.runQueue.push(result)
            return result // 返回promise，实现外部链式调用
        } else {
            // branch-02 已经最大并发量，则需要返回一个再执行一个. 
            // ? 不用 Promise.race 又该如何实现 ？
            return Promise.race(this.runQueue).then(() => this.flushSchedulerQueue()) // 返回一个加一个
        }
    }
}

// way two
class Scheduler_01 {
    constructor(limit) {
        this.limit = limit;
    }
    waiting = [] // 临时存储，用于跟踪等待请求的api列表
    count = 0 // 计数，正在请求中的api的数量
    // 利用async, await 简化代码
    // ? 可读性变差，是因为对 async 不足够的了解！
    async add(fn) {
        // 判断当前的执行状态
        if (this.count >= this.limit) {
            console.log('以及满了，waiting...')
            // branch-01 已经最大并发量，则需要等待，resolve之后，继续向下执行
            // 方法：通过临时创建一个Promise，等待正在执行的api有返回后，通过.shift()()触发最先进入的resolve的执行
            await new Promise(resolve => this.waiting.push(resolve));
        }
        // branch-01 满足立即执行
        this.count++; // 计数
        console.log('开始执行，执行中的个数', this.count)
        let res = await fn(); // 立即执行本次请求
        this.count--; // 计数
        console.log('结束执行，执行中的个数', this.count)

        // ending: 待执行列表的长度是否为0
        if (this.waiting.length > 0) {
            this.waiting.shift()(); // 先进先出的原则，resolve() 最先进来的fn，执行fn
        }
        return res; // async函数返回一个Promise，外部可以继续链式调用
    }
}

// way three
class Scheduler_02 {
    constructor(max = 2) {
        this._max = max;
        this.waiting = [];
        this.working = [];
    }

    add(asyncTask) {
        // 优势 在于更加直观，执行add返回一个Promise，外部继续链式调用
        return new Promise((resolve) => {
            asyncTask.resolve = resolve; // keyPoint 给promise实例上添加一个resolve属性，用于触发完结这个Promise
            if (this.working.length < this._max) {
                // branch 01: 可以立即执行
                this.runTask(asyncTask);
            } else {
                // branch 02: 排队等待
                this.waiting.push(asyncTask);
            }
        })
    }

    runTask(asyncTask) {
        this.working.push(asyncTask); // 类似上面的count++
        asyncTask().then((res) => {
            asyncTask.resolve(res); // asyncTask异步任务完成以后，再调用外层Promise的resolve以便add().then()的执行
            var index = this.working.indexOf(asyncTask);
            this.working.splice(index, 1); // working长度减一，类似上面的count--
            if (this.waiting.length > 0) {
                this.runTask(this.waiting.shift()); // 返回一条 then 执行一条
            }
        })
    }
}

// mock axios promise
const api = (temp) => {
    return () => {
        console.log('start: ', temp)
        const start = new Date().valueOf()
        return new Promise(resolve => {
            const timeout = Math.random() * 1000 + 300
            setTimeout(() => {
                console.log('end: ' + temp)
                console.log(`${temp}设置的timeout时间：${timeout}`)
                const end = new Date().valueOf()
                const timing = (end - start) / 1000
                resolve(temp + ': ' + timing)
            }, timeout);
        })
    }
}

const scheduler = new Scheduler(2)
const scheduler_01 = new Scheduler_01(2)
const scheduler_02 = new Scheduler_02(2)

scheduler_02.add(api('第1个')).then(res => {
    console.log('外部then ', res)
})
scheduler_02.add(api('第2个')).then(res => {
    console.log('外部then ', res)
})
scheduler_02.add(api('第3个')).then(res => {
    console.log('外部then ', res)
})
scheduler_02.add(api('第4个')).then(res => {
    console.log('外部then ', res)
})
