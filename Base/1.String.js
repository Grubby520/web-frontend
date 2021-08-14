new String("1");
/**
String {"1"}
0: "1"
length: 1
__proto__: String
anchor: ƒ anchor()
big: ƒ big()
blink: ƒ blink()
bold: ƒ bold()
charAt: ƒ charAt()
charCodeAt: ƒ charCodeAt()
codePointAt: ƒ codePointAt()
concat: ƒ concat()
constructor: ƒ String()
endsWith: ƒ endsWith()
fixed: ƒ fixed()
fontcolor: ƒ fontcolor()
fontsize: ƒ fontsize()
includes: ƒ includes()
indexOf: ƒ indexOf()
italics: ƒ italics()
lastIndexOf: ƒ lastIndexOf()
length: 0
link: ƒ link()
localeCompare: ƒ localeCompare()
match: ƒ match()
matchAll: ƒ matchAll()
normalize: ƒ normalize()
padEnd: ƒ padEnd()
padStart: ƒ padStart()
repeat: ƒ repeat()
replace: ƒ replace()
replaceAll: ƒ replaceAll()
search: ƒ search()
slice: ƒ slice()
small: ƒ small()
split: ƒ split()
startsWith: ƒ startsWith()
strike: ƒ strike()
sub: ƒ sub()
substr: ƒ substr()
substring: ƒ substring()
sup: ƒ sup()
toLocaleLowerCase: ƒ toLocaleLowerCase()
toLocaleUpperCase: ƒ toLocaleUpperCase()
toLowerCase: ƒ toLowerCase()
toString: ƒ toString()
toUpperCase: ƒ toUpperCase()
trim: ƒ trim()
trimEnd: ƒ trimEnd()
trimLeft: ƒ trimStart()
trimRight: ƒ trimEnd()
trimStart: ƒ trimStart()
valueOf: ƒ valueOf()
Symbol(Symbol.iterator): ƒ [Symbol.iterator]()
__proto__: Object
[[PrimitiveValue]]: ""
[[PrimitiveValue]]: "1"
 */
let str = "";
let result = null;
// 01 创建字符串 -------------------------- //
/**
 * 创建字符串:
 * 字面量
 * 初始化器
 * 构造函数
 * 模板字符串
 * 转义字符:
 *  \n 换行
    \r 回车
 */

str = "string";
str = String(str);
"string" === String(str); // true
str = new String(str);
typeof str === "object";

str = `${str}s`;

// 02 属性 -------------------------- //
String.prototype;
String.prototype === str.__proto__;

// 03 方法 -------------------------- //
/**
 * String.fromCharCode()
 * 通过一串 Unicode 创建字符串
 */
// String.fromCodePoint()
// String.raw()

// 04 原型 String.prototype 上的属性和方法 -------------------------- //
str = "string";
/**
 * 特别说明：
 * 字符串字面量和使用String创建的字符串都是基本字符串。
 * 当基本字符串调用一个字符串对象上才有的方法或查询值的时候，JS会自动将基本字符串转化为字符串对象并调用相应的方法或执行查询。
 */
// str.constructor
// str.length

/**
 * 最难的一个方法
 * str.replace(regexp|substr, newSubStr|function)
 * 替换字符串，可以定义一个正则，替换可以定义函数
 * 变量名	代表的值
   $$	插入一个 "$"。
   $&	插入匹配的子串。
   $`	插入当前匹配的子串左边的内容。
   $'	插入当前匹配的子串右边的内容。
   $n	假如第一个参数是 RegExp对象，并且 n 是个小于100的非负整数，那么插入第 n 个括号匹配的字符串。提示：索引是从1开始。如果不存在第 n个分组，那么将会把匹配到到内容替换为字面量。比如不存在第3个分组，就会用“$3”替换匹配到的内容。
   $<Name>	 这里Name 是一个分组名称。如果在正则表达式中并不存在分组（或者没有匹配），这个变量将被处理为空字符串。只有在支持命名分组捕获的浏览器中才能使用。

 * 函数
   变量名	代表的值
      match	匹配的子串。（对应于上述的$&。）
      p1,p2, ...	假如replace()方法的第一个参数是一个RegExp 对象，则代表第n个括号匹配的字符串。（对应于上述的$1，$2等。）例如，如果是用 /(\a+)(\b+)/ 这个来匹配，p1 就是匹配的 \a+，p2 就是匹配的 \b+。
      offset  匹配到的子字符串在原字符串中的偏移量。（比如，如果原字符串是 'abcd'，匹配到的子字符串是 'bc'，那么这个参数将会是 1）
      string	被匹配的原字符串。
      NamedCaptureGroup	命名捕获组匹配的对象
   精确的参数个数依赖于replace的第一个参数的正则，和它指定的多少个<括号子串>，还可以使用命名捕获
 */

// 替换第一个匹配项
str = "string-stRing";
str.replace("s", "S"); // "String-string"
// 函数
"abc12345#$*%".replace(
  /([^\d]*)(\d*)([^\w]*)/,
  function (match, p1, p2, p3, offset, string) {
    console.log(arguments);
    /*
      0: "abc12345#$*%"
      1: "abc"
      2: "12345"
      3: "#$*%"
      4: 0
      5: "abc12345#$*%"
    */
    return [p1, p2, p3].join(" - ");
  }
);

// 替换所有匹配项 （global ignore 选项）
str.replace(/s/g, "S"); // "String-String"
str = "string-stRing";
str.replace(/r/gi, "S"); // "stSing-stSing"

// 交换
"Li-lei".replace(/(\w+)-(\w+)/, "$2 $1"); // "lei Li"

// 匹配的所有大写字母转成小写，并在前面加上特定的符号
function styleHyphenFormat(name, temp = "$") {
  function upperToHyphenLower(match) {
    return temp + match.toLowerCase();
  }
  return name.replace(/[A-Z]/g, upperToHyphenLower);
}
styleHyphenFormat("borderTop", "-"); // "border-top"

/**
 * str.search(regexp)
 * regexp 正则表达式对象，如果不是，则内部使用 new RegExp 自动转
 * @returns { Number } 索引 匹配不上 -1
 */
str = "string StrinG ";
str.search("in"); // 2
str.search(/in/); // 2
str.search(/[A-Z]/g); // 7 置灰找到第一个匹配上的索引

/**
 * str.match(regexp)
 * 返回该字符串匹配正则表达式的结果
 */
// 使用 global
str.match(/[A-Z]/g); // ["S", "G"]
// 不使用 g
str.match(/[A-Z]/); // 额外的属性：["S", index: 7, input: "string StrinG ", groups: undefined]

/**
 * str.includes(searchString[, position])
 * 是否包含某一段字符串
 * @returns { Boolean }
 */
result = str.includes("str"); // true

/**
 * str.concat(str2[, ...strN])
 * 连接字符串，组成新的字符串
 * 递归遍历，每个元素调用自身的 toString 方法
 * 官方强烈建议使用 +=
 */
result = str.concat("-", ["b"]); // 'string-b'
result = str.concat("-", [{ a: 1 }]); // "string-[object Object]"

/**
 * str.startsWith(searchString[, position])
 * 可选的指定某个索引位置开始查找，判断str是否以指定字符串开头的
 * @returns { Boolean }
 */
result = str.startsWith("str"); // true
result = str.startsWith("str", 1); // false

/**
 * str.endsWith(searchString[, length])
 */
result = str.endsWith("ing");

/**
 * str.lastIndexOf(searchValue[, fromIndex]) 从右向左查找，fromIndex还是从左向右计算索引开始位置
 * str.indexOf(searchValue[, fromIndex])
 * 指定索引开始的位置，返回查找的指定元素的第一个索引值
 * @returns { Number } 找不到 -1
 */
result = str.indexOf("tr"); // 1
result = str.indexOf("tr1"); // -1

result = str.lastIndexOf("g"); // -1
result = str.lastIndexOf("g", 5); // 5

/**
 * str.charAt(index)
 * 通过索引查找对应的值
 * 与 indexOf 正好相反，它是根据值查索引
 */
result = str.charAt();
result = str.charAt(0);
result = str.charAt(1);
result = str.charAt(10); // ''

/**
 * str.substr(startIndex[, length]) 请使用 substring 代替 substr
 * str.substring(indexStart[, indexEnd])
 * 截取字符串，包括开始位置，不包括结束位置
 * @returns { String } 截取的那一段字符串
 */
result = str.substring(); // 实际操作可以不传参数
result = str.substring(0); // 与 str 相同
result = str.substring(1); // 第一位开始截取

/**
 * str.slice(beginIndex[, endIndex])
 * 截取字符串,不包括 endIndex
 * @returns { String } 截取的那一段字符串
 */
str.slice();
str.slice(0, 1);
str.slice(-1); // 截取最后一位
str.slice(-2, -1); // 截取倒数第二位

/**
 * str.split(separator[, limit])
 */
str.split(); // ['string']
str.split(""); // ["s", "t", "r", "i", "n", "g"]
str.split("").join("-"); // "s-t-r-i-n-g"

/**
 * str.repeat(count)
 * 指定重复的次数，count必须是有效的数，负数和0都返回空字符串
 */
str.repeat(1); // 'string'
str.repeat(2); // 'stringstring'

/**
 * .toLocaleLowerCase([locale])
 * .toLocaleUpperCase([locale])
 * .toLowerCase()
 * .toUpperCase()
 */
str.toUpperCase().toLowerCase();

/**
 * .trim()
 * .trimLeft()
 * .trimStart()
 * .trimRight()
 * .trimEnd()
 * 删除空白字符。包括：space, tab, no-break space ... 和 行终止符字符（LF，CR ...）
 */
"  string string  ".trim();

/**
 * str.charCodeAt()
 * 返回给定索引处的 UTF-16 代码单元
 * @returns { Number } 0 - 65535 索引不存在 NaN
 *
 * str.codePointAt()
 * 返回 一个 Unicode 编码点值的非负整数
 */
"string".charCodeAt();
"string".charCodeAt(1);
"string".charCodeAt(-1); // NaN

/**
 * .toString()
 * .valueof()
 * String对象 覆盖了 Object对象 的toString方法,
 * 返回对象的字符串形式
 */
new String("string").toString();
new String("string").valueOf();

// str.normalize([from])
// toSource 非标准的特性，不考虑
