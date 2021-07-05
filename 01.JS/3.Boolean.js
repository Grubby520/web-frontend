Boolean.prototype;
/**
  Boolean {false, constructor: ƒ, toString: ƒ, valueOf: ƒ}
    constructor: ƒ Boolean()
    toString: ƒ toString()
    valueOf: ƒ valueOf()
    __proto__: Object
    [[PrimitiveValue]]: false
 */

/**
 * Boolean 对象，是布尔值的对象包装器
 * 为false的初始化参数：0, -0, +0, null, false, NaN, undefined, ''
 * 否则，都为true
 */
let boo = null;
let exp = "";

// 不要把非布尔值用 new Boolean 的方式转换，而是直接使用 Boolean
exp = false;
boo = Boolean(exp);
boo = !!exp;

boo = new Boolean(exp); // 对象, 条件语句一定为true

// 实例的属性和方法 ---------- ---------- //
Boolean.prototype.constructor === Boolean;
// 只会是 'true' / 'false'
Boolean.prototype.toString;
// 原始值只会是 true / false
Boolean.prototype.valueOf;

new Boolean([]).valueOf(); // true
new Boolean([]).toString(); // 'true'
new Boolean(false).valueOf(); // false
new Boolean(false).toString(); // 'false'

new Boolean(null).valueOf();
Boolean(null).valueOf();
