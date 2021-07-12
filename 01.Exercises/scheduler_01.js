/**
 * 并发节流的一个调度者函数
 * e.g. 最大并发量是N,函数最终返回请求的结果集，且按原来的api的顺序排序的。
 * 
 * 三步分析：
    1.定义变量：需要什么值，存状态的值，用于逻辑处理的值
    2.思维导图：清晰的表述执行的逻辑和完整的流程
    3.编码：把流程转成执行代码
 */

function scheduler(apiList = [], n = 10) {
    /**
     * 具体实现
     * result 存结果
     * curIndex 逻辑运算，当前数组执行的位置，便于取下一次执行的位置，说明每执行一次+1
     * len 逻辑运算，数组长度，也是执行的结束的判断逻辑
     * 
     * 方法的开头，一定是写ending的逻辑，然后接下来就写达成ending的逻辑
     * 并发量是n，先执行n次，然后每返回一个，执行一个，直到数组执行完成（curIndex判断是否执行完成）
     */
    const len = apiList.length
    let curIndex = 0
    const result = Array(len).fill(false) // false填充，非常6

    return new Promise(resolve => {
        // keyPoint 
        while (curIndex < n) {
            fetch()
        }
        function fetch() {
            const index = curIndex++ // 自增，发一个加一个
            // console.log('start: ' + index)
            console.log(index, len)
            // ending judge
            // curIndex === len时，仅代表请求全部发出，不代表全部返回
            if (index >= len) {
                // 通过填充的是 false，所以不用多创建一个变量来跟踪进度
                !result.includes(false) && resolve(result)
                // 即使没有全部返回，请求已全部发送，故 return
                return
            }
            apiList[index](index).then(res => {
                result[index] = res // 按顺序存储
                // result.push(res) // 按返回的先后顺序存储
                fetch() // 回来一个，请求一个
            }).catch(err => {
                result[index] = err
                fetch() // 捕获异常，回一个，发一个
            })
        }
    })
}

const api = (i) => {
    return new Promise((resolve, reject) => {
        const timeout = Math.random() * 1000 + 300
        setTimeout(() => {
            // console.log('end: ' + i)
            resolve(i + ': ' + new Date().valueOf())
        }, timeout);
    })
}

const apiList = new Array(10).fill(api)
scheduler(apiList, 5).then(res => {
    console.log(res)
})
