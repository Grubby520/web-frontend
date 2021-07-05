const api = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            reject(new Error('reject!'))
        }, 1000)
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

const result = task() // 这里一定是 fulfilled 态

result.then(res => {
    console.log('fulfilled', res)
})

