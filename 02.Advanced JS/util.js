/**
 * 汇总JS抽象出来的公共方法，夯实JS基础
 */

// 针对async函数异常处理，优雅的方式
export function awaitTo(promise) {
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
