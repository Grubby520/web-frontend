function consol(boo) {
    console.log(boo)
}

// 指数运算符
let result = 2 ** 3
consol(result)

// 链判断运算符
let obj = {
    a: {
        b: {
            c: 1
        }
    },
    func() {
        return 2
    }
}

result = obj?.a?.b?.c || 'default' // 写法1 对象属性
let variable = 'c'
result = obj?.a?.b?.[variable] || 'default' // 写法2 变量的值是对象属性
consol(result)

result = obj?.a?.c // 碰到 undefined, null 终止链判断，返回 undefined
consol(result)

result = obj.func?.() // 写法3 函数
consol(result)

// Null 判断运算符 ??（ES2020）
result = 0 || 'default'
consol(result)

result = 0 ?? 'default' // 只有值是 undefined, null, 才会使用默认值
consol(result)

result = (0 || null) ?? 'default'
consol(result)
result = (0 || false) ?? 'default'
consol(result)

// 逻辑赋值运算符
let str = 'string'
result ||= str
consol(result)

result &&= str
consol(result)

result ??= str
consol(result)
