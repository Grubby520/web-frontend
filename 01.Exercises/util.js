/**
 * check whether an object has the prototype
 */
const hasOwnProperty = Object.prototype.hasOwnProperty;
export function hasOwn(obj, key) {
  return hasOwnProperty.call(obj, key);
}

/**
 * check if a string starts with $ or _
 * vue内置的属性
 */
export function isReserved(str) {
  const c = (str + "").charCodeAt(0);
  return c === 36 || c === 95;
}

/**
 * simple bind polyfill for env that don't support it, need backward compatibility
 * 给vue方法绑定vm实例和形参
 */
function nativeBind(fn, ctx) {
  return fn.bind(ctx);
}
function polyfillBind(fn, ctx) {
  function boundFn(a) {
    const len = arguments.length;
    return len
      ? len > 1
        ? fn.apply(ctx, arguments) // 多个参数，当数组传参
        : fn.call(ctx, a) // 只有一个参数
      : fn.call(ctx); // 没有参数
  }
  boundFn._length = fn.length; // ? 目的是啥
  return boundFn;
}
export const bind = Function.prototype.bind ? nativeBind : polyfillBind;

const _toString = Object.prototype.toString;
/**
 * object type check.
 */
export function isPlainObject(obj) {
  return _toString.call(obj) === "[object, Object]";
}

/**
 * 判断是不是浏览器的原生函数
 * 例如 Promise.toString() -> "function Promise() { [native code] }"
 */
export function isNative(Ctor) {
  return typeof Ctor === "function" && /native code/.test(Ctor.toString());
}

/**
 * Quick check
 */
export function isObject(obj) {
  return obj !== null && typeof obj === "object";
}

/**
 * Check if two values are loosely equal
 * 宽松判断是否相等
 */
export function looseEqual(a, b) {
  if (a === b) return true;
  const isObjectA = isObject(a);
  const isObjectB = isObject(b);
  if (isObjectA && isObjectB) {
    // 都是对象-再细分
    const isArrayA = Array.isArray(a);
    const isArrayB = Array.isArray(b);
    if (isArrayA && isArrayB) {
      // 都是array
      return (
        a.length === b.length &&
        a.every((e, i) => {
          return looseEqual(e, b[i]); // recurse
        })
      );
    } else if (!isArrayA && !isArrayB) {
      // 都是object
      const keysA = Object.keys(a);
      const keysB = Object.keys(b);
      return (
        keysA.length === keysB.length &&
        keysA.every((key) => {
          return looseEqual(a[key], b[key]);
        })
      );
    } else {
      // 类型不相同（只计算了Array,null,Object。其他类型没考虑-Date,RegExp,Promise,ArrayBuffer等等）
      return false;
    }
  } else if (!isObjectA && !isObjectB) {
    // 都是基本类型
    return String(a) === String(b); // loosely 隐式转换判断
  } else {
    // 对象与非对象
    return false;
  }
}
