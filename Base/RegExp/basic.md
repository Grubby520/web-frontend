\w
匹配一个单字字符（字母，数字，下划线）
等价于 [A-Za-z0-9_]
```javascript

```

\W
匹配一个非单字字符（字母，数字，下划线）
等价于 [^A-Za-z0-9_]

path = path.replace(/\[(\w+)\]/g, '.$1');
path = path.replace(/^\./, '');