1. 行内代码/关键字

JS里的函数 `console.log()` 怎么使用？
关键函数 `queueWatcher` 用于把 watcher 放入到 watcher 队列中。

2. 多行代码

```javascript
function callUpdatedHooks(queue) {
  let i = queue.length;
  while (i--) {
    const watcher = queue[i];
    const vm = watcher.vm;
    // 整个队列里找到符合条件的：当前watcher + 已经mounted + 没有销毁
    if (vm._watcher === watcher && vm._isMounted && !vm._isDestroyed) {
      callHook(vm, "updated"); // 刷新队列 flushSchedulerQueue 时，调用它
    }
  }
}
```

```html
<div></div>
```

3. 标题
# 这是 H1
## 这是 H2
### 这是 H3
#### 这是 H4
##### 这是 H5
###### 这是 H6

4. 列表
- 列表项目
  1. item1
  2. item2

5. 字体样式
*斜体*或_斜体_
**粗体**
***加粗斜体***
~~删除线~~

Markdown 插入链接：
[链接文字](链接网址 "标题")

Markdown 插入图片：
![alt text](/path/to/img.jpg "Title")

Markdown 引用：
> 引用内容

Markdown 分割线：
---

Markdown 换行：
<br>

Markdown 段首缩进：
&ensp; or &#8194; 表示一个半角的空格
&emsp; or &#8195;  表示一个全角的空格
&emsp;&emsp; 两个全角的空格（用的比较多）
&nbsp; or &#160; 不断行的空白格

