{
  // let data = [];
  // $.ajax({
  //   url: www.javascript.com,
  //   data: data,
  //   success: () => {
  //     console.log("发送成功!");
  //   },
  // });
  // console.log("代码执行结束");
}
/**
 * 执行栈-主线程
 * 遇到ajax异步操作，ajax进入 Event Table，注册 回调函数 success
 * 打印 ‘代码执行结束’
 * 栈空
 * ajax事件完成，回调函数 success 进入 Event Queue
 * 主线程从 Event Queue 读取回调函数 success 并执行
 * 栈空
 */

{
  // new Promise((r) => { // pro1
  //   console.log("pro1");
  //   r();
  // })
  //   .then(() => console.log(1))
  //   .then(() => console.log(2));
  // new Promise((r) => { // pro2
  //   console.log("pro2");
  //   r();
  // })
  //   .then(() => console.log(4))
  //   .then(() => console.log(5));
}
/**
 * Promise 创建的是微任务
 * 多个then() 链式调用，并不是连续创建多个微任务并推入为任务队列
 * .then() 返回一个新的Promise，后续的then只有当上一个Promise状态变化后才会创建相应微任务
 * 执行顺序：
 * 主线程的宏任务
 * pro1实例，立即执行Promise构造器内部的同步代码 打印'pro1'
 * pro2实例，立即执行同步代码 打印'pro2'
 * Promise状态变化，pro1 第一个then的回调作为一个微任务推入微任务队列
 * pro2 第一个then的回调作为一个微任务推入微任务队列
 * 执行任务队列：
 * 打印1 pro1的第二个then的回调作为微任务推入微任务队列
 * 打印4 pro2的第二个then的回调作为微任务推入微任务队列
 * 打印2
 * 打印5
 */

setTimeout(function () {
  console.log("定时器开始啦");
});

new Promise(function (resolve) {
  console.log("马上执行for循环啦");
  for (var i = 0; i < 10000; i++) {
    i == 99 && resolve();
  }
}).then(function () {
  console.log("执行then函数啦");
});

console.log("代码执行结束");
/**
 * 普通微任务+宏任务
 * 打印顺序：
 * ’马上执行for循环啦‘
 * ’代码执行结束‘
 * ’执行then函数啦‘
 * ’定时器开始啦‘
 * 执行过程：
 * 1.整段代码作为宏任务执行，遇到setTimeout宏任务分配到宏任务Event Queue中
 * 2.遇到promise内部为同步方法直接执行-“马上执行for循环啦”
 * 3.注册then回调到Event Queue
 * 4.主代码宏任务执行完毕-“代码执行结束”
 * 5.主代码宏任务结束被monitoring process进程监听到，主任务执行Event Queue的微任务
 * 6.微任务执行完毕-“执行then函数啦”
 * 7.执行宏任务console.log('定时器开始啦')
 */
