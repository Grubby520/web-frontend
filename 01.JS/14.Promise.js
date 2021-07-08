Promise.prototype

/**
Promise {Symbol(Symbol.toStringTag): "Promise", constructor: ƒ, then: ƒ, catch: ƒ, finally: ƒ}
    catch: ƒ catch()
    constructor: ƒ Promise()
        all: ƒ all()
        allSettled: ƒ allSettled()
        any: ƒ any()
        arguments: (...)
        caller: (...)
        length: 1
        name: "Promise"
        prototype: Promise {Symbol(Symbol.toStringTag): "Promise", constructor: ƒ, then: ƒ, catch: ƒ, finally: ƒ}
        race: ƒ race()
        reject: ƒ reject()
        resolve: ƒ resolve()
        Symbol(Symbol.species): (...)
        get Symbol(Symbol.species): ƒ [Symbol.species]()
        __proto__: ƒ ()
        [[Scopes]]: Scopes[0]
    finally: ƒ finally()
    then: ƒ then()
    Symbol(Symbol.toStringTag): "Promise"
 */

/**
 * Promise 异步编程的解决方案，比传统的解决方案-层层嵌套的回调函数（回调地狱）和事件 更合理更强大
 * Promise本身是一个构造函数对象，提供统一的API处理异步编程，相当于一个容器，里面保存着未来才会结束的事件（异步操作，XHR/Event事件）的结果。
 * 把异步操作用同步的操作的流程表达出来。（异步代码同步的方式编写）
 * 
 * 特点：
 * 1.状态不受外界影响。只有异步操作的结果才能改变状态。pending、fulfilled、rejected 3个状态。
 * 2.状态一旦改变，就会被锁定，再也不能被改变。这个时候叫 settled 状态。pending -> fulfilled | pending -> rejected。
 * 缺点：
 * 1.一旦开始无法取消
 * 2.如果不设置catch回调，内部的错误不会反应到外部
 * 3.pending态时，无法监听进度（即将结束还是才开始？）
 */
// console.log('执行栈 start')

typeof Promise === 'function'

let api = () => {
    // KP: executor function 的两个参数分别是resolve和reject,它们是两个函数，由 JavaScript 引擎提供，不用自己部署
    return new Promise((resolve, reject) => {
        // 新建promise之后，就会立即执行同步代码
        console.log('我是同步代码，会立即执行')
        setTimeout(() => {
            // KP: 将结果作为函数的参数，传递出去，作为外部回调函数的参数
            reject(new Error('reject!'))
            // KP: 调用 reject，并不会影响参数函数的执行
            console.log('reject after')
        }, 1000)
        console.log('reject函数之后的代码依然会执行')
    })
}

const task = () => {
    // doubt 1：链式调用，返回新的Promise，它的状态是由最后的链返回的结果来决定的
    return api().then(res => {
        console.log('fulfilled', res)
        return res
    }).catch(err => {
        console.log('reject', err)
        // doubt 2：链式传值，取决于内部函数是否有 return 值，没有默认是 undefined
        return err
    })
}

// const result = task() // 这里一定是 fulfilled 态的新的 Promise

// KP: 通过then方法，指定resolved和rejected的回调函数
// result.then(res => {
//     console.log('fulfilled ', res)
// }, err => {
//     console.log('rejected ', err)
// })

// KP: catch方法，等价于 .then(null, err => {})
// result.then(() => { }).catch(() => { })

// * 下面是异步加载图片的例子。
function loadImageAsync(url) {
    return new Promise(function (resolve, reject) {
        const image = new Image();

        image.onload = function () {
            resolve(image);
        };

        image.onerror = function () {
            reject(new Error('Could not load image at ' + url));
        };

        image.src = url;
    });
}

// * 下面是一个用Promise对象实现的 Ajax 操作的例子。
const getJSON = function (url) {
    const promise = new Promise(function (resolve, reject) {
        const handler = function () {
            if (this.readyState !== 4) {
                return;
            }
            if (this.status === 200) {
                resolve(this.response);
            } else {
                reject(new Error(this.statusText));
            }
        };
        const client = new XMLHttpRequest();
        client.open("GET", url);
        client.onreadystatechange = handler;
        client.responseType = "json";
        client.setRequestHeader("Accept", "application/json");
        client.send();

    });

    return promise;
};

// ** 异步操作返回的是另一个Promise
const p1 = new Promise(function (resolve, reject) {
    // setTimeout(() => reject(new Error('fail')), 3000)
    setTimeout(() => resolve('success'), 3000)
})

const p2 = new Promise(function (resolve, reject) {
    // KP: 原本1s后会变成resolved，但由于异步结果的返回值是Promise，所以它的结果取决于这个 p1的结果
    // 3s后，p1 settled之后，触发p2 也 settled，状态也为rejected态
    setTimeout(() => resolve(p1), 1000)
})

// p2.then(res => {
//     console.log('p2 ', res)
// }).catch(err => {
//     console.log('p2 ', err)
// })

// p1.then(res => {
//     console.log('p1 ', res)
// })

// * 同步执行时，立即resolve，执行过程会怎样？在本轮事件循环的末尾执行，总是晚于本轮循环的同步任务
// setTimeout(() => {
//     console.log('执行栈的setTimeout API')
// })

p3 = new Promise(resolve => {
    return resolve(1)
})

// p3.then(res => {
//     console.log('p3 ', res) // 会在本次 event loop的末尾执行（微任务），等到同步任务执行完成之后
// })

// console.log('执行栈 end')

// * Promise API
Promise.prototype.constructor
/**
 * Promise 的静态方法
 * 方法：
 * all(iterable) 全部成功才触发成功，一个失败就触发失败
 * allSettled(iterable) 全部settled（不管成功还是失败）后触发
 * any(iterable) 任意一个成功就触发成功，全部失败才触发失败
 * race(iterable) 任意一个settled触发成功
 * reject(reason) 返回一个rejected态的Promise
 * resolve(value) 结果由value的决定的Promise
 * 
 * 属性：
 * length 1
 * name 'Promise'
 * 
 * Promise.prototype 的方法
 * then(cb) fulfilled态的回调
 * catch(cb) rejected态的回调
 * finally(cb) settled之后都会调用的回调,它没有入参
 */

// all
const promise = {
    fulfilled(params, timer = 500) {
        return new Promise(resolve => {
            setTimeout(() => resolve(params), timer)
        })
    },
    rejected(params, timer = 800) {
        return new Promise((resolve, reject) => {
            setTimeout(() => reject(params), timer)
        })
    }
}
const { fulfilled, rejected } = promise
Promise.all([fulfilled('resolve1'), fulfilled('resolve2')])
    .then(res => {
        console.log(res) // 按原来iterable的顺序返回对应的Promise的结果的数组
    })
    .catch(err => {
        console.log(err)
    })

Promise.all([fulfilled('resolve'), rejected('reject')])
    .then(res => {
        console.log(res)
    })
    .catch(err => {
        console.log(err) // 返回错误的Promise的结果
    })

// allSettled
Promise.allSettled([fulfilled('resolve'), rejected('reject')])
    .then(res => {
        console.log(res) // 每个Promise返回的结构是 { status, value }
    })

// any
// 任意一个fulfilled，就then
Promise.any([fulfilled('resolve'), rejected('reject')])
    .then(res => {
        console.log(res) // 返回fulfilled态的Promise的结果
    })

// 全部rejected，才catch
Promise.any([rejected('reject1'), rejected('reject2')])
    .catch(err => {
        console.log(err) // tc39 stage4, 返回一个 AggregateError: All promises were rejected
    })

// race
// 返回第一个settled的Promise的结果. 注意,该Promise的状态取决于返回的Promise的状态
Promise.race([fulfilled('resolve'), rejected('reject')])
    .then(res => {
        console.log('race: ', res) // then 返回第一个fulfilled的Promise的结果
    })
Promise.race([fulfilled('resolve'), rejected('reject', 300)])
    .catch(err => {
        console.log('race: ', err) // catch 返回第一个rejected的Promise的结果
    })

console.log('start')

// resolve
Promise.resolve('immediate resolved')
    .then(res => {
        // 插队了啥，直接加入本次循环的微任务队列
        console.log('resolve: ', res) // 当前事件循环的末尾执行（微任务），等到同步任务执行完成
    })

// reject
Promise.reject('immediate rejected')
    .catch(res => {
        // 插队了啥，直接加入本次循环的微任务队列
        console.log('reject: ', res) // 当前事件循环的末尾执行（微任务），等到同步任务执行完成
    })

setTimeout(() => {
    console.log('主线程上的setTimeout') // 进入Event Queue，第一次event loop后，进入第二次的event loop（最先执行）
})

console.log('end')

Promise.length === 1
Promise.name = 'Promise'
