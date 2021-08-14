a = {
  b: []
 }
 
 b = {a: []}
 
 a.b = b
 
 b.a = a
//  {
//    b: {
//      a: {
//        b: {

//        }
//      }
//    }
//  }
 
 function deepClone(data) {
   debugger
   const result = {}
   const cache = []
   const keyMap = new Map()
   inner(data, result)
   function inner(data, result) {
    debugger
     for (let key in data) {
       const val = data[key]
       if (typeof data[key] === 'object') {
         if (!cache.includes(val)) {
           cache.push(val)
           keyMap.set(val, key)
           inner(data[key], result[key] = {})
         } else {
           // 循环引用-跳出循环
           result[key] = val
           // val deepClone ... 处理 key
          //  inner(val)
         }
       } else {
        result[key] = data[key]
       }
     }
   }
   return result
 }
 
 var deep = deepClone(a)
 