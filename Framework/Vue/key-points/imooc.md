Vue描述题：

v-show与v-if的区别
为何 v-for 中要用 key
描述Vue组件生命周期（有父子组件的情况呢）
Vue 组件如何通讯
描述组件渲染和更新的过程
双向数据绑定v-model的实现原理

框架综合应用：
基于Vue设计一个购物车（组件结构，vuex state 数据结构）

如何应对面试题：
框架的使用（基本使用，高级特性，周边插件）
框架的原理（基本原理的了解，热门技术的深度，全面性）
框架的实际应用，即设计能力（组件结构，数据结构）

面试官为何要这样考察：
保证候选人能正常工作-考察使用
多个候选人竞争时，选择 有技术追求中-考察原理
看候选人是否独立承担项目-考察设计能力

3章：

Vue 基本使用的知识点和面试题
Vue 组件的知识点和面试题
Vue 高级使用的知识点和面试题
Vuex 和 Vue-router 相关面试题

不用纠结学vue还是react：
他们之间越来越接近了
vue3 Options API VS React class Component
vue3 Composition API vs React Hooks

自己看文档不行吗：
最低效的方式，不适合自学快速入门
文档本质是一个备忘录，给会用的人查阅，并不是入门教程（有一个快速入门）
文档全面冗长且细节过长，无法突出面试重点

/* ----- ----- ----- ----- */

 基础部分：
 1. 指令，插值，表达式
 v-html：会有XSS风险，会覆盖子组件

 2. computed 和 watch
 computed有缓存，依赖的data不变则不会重新计算
 computed函数，默认就是一个get，也可以设置get和set
 watch如何深度监听？ { deep: true }
 watch监听引用类型，拿不到 oldVal，指向的是同一个堆的地址

3. class和style
驼峰写法
class可以是对象，数组
style是对象

4. 条件渲染
v-if v-else-if v-else ===
v-if 和 v-show的区别？
v-if 和 v-show的使用场景？

5. 循环渲染
v-for 也可以遍历对象
key的重要性
v-if 和 v-for 不要同时使用，可以先filter，可以在v-for里面或外面进行v-if（使用也不会报错）

6. 事件
event参数，模板里有一个固定的参数 $event 原生DOM对象
点修饰符：事件修饰符 包括:
    @click.stop 阻止单击事件继续传播
    @submit.prevent 表单提交不再重载页面
    @click.stop.prevent 串联使用
    @click.capture 内部元素触发的事件先在此处理，再交给内部元素处理
    @click.self 内部元素无法触发
按键修饰符：
    .ctrl
    .enter

【观察】事件被绑定到哪里？ event.target, event.currentTarget
总结：
    event 是原生的
    事件是被挂载到当前元素

7. 表单
元素：input, select, checkbox, radio, textarea
修饰符：
    .trim
    .lazy
    .number

8. Vue组件使用
props 和 $emit
组件间通讯：自定义事件，还有其他形式有哪些？
组件生命周期：必须是最全的，以及每个钩子里能拿到什么（data，method...）

示例：实现一个todoList
    打印组件触发的各生命周期，且执行顺序是怎样的？
    实现父子组件间通信 props + $emit
    实现兄弟组件间通信 自定义事件，不用手动去实现 eventBus，
        event = new Vue(), mounted时自定义事件 event.$on, beforeDestroy时取消事件 event.$off, 
    自己去延伸其他通信方式，并写demo，全部实现一遍！！！

理解生命周期：
两个维度：
    1.单个组件（初级）
    2.父子组件（进阶）
主线：
挂载阶段 -》更新阶段 -》销毁阶段

初始化是外到内，渲染是内到外；
父组件created，子组件created；子组件mounted，父组件mounted；
父组件beforeUpdate，子组件beforeUpdate；子组件updated，父组件updated；
父组件beforeDestroy,子组件beforeDestroy；子组件destroyed，父组件destroyed；

-----------------------------------
Vue高级特性

1.候选人对Vue掌握的全面度，深度；
2.考察项目是否有深度和复杂度（用到了高级特性）；
3.提前做技术储备，可以不用，但必须知道，需要使用时能想到方案；


1.自定义v-model
2.$nextTick
3.slot
4.动态组件
4.1异步组件
5.keep-alive
6.mixin
7.refs

应用：
1.在一个自定义的组件上使用v-model
<CustomColor v-model="color" />
{
    model: { // 对应的就是外部v-model的属性
        prop: 'propName',
        event: 'changeName'
    },
    props: {
        propName: String,
        default: '#fff'
    },
    methods: {
        updateModel() {
            this.$emit('changeName', 'xxx')
        }
    }
}

2.$nextTick
* Vue 是异步渲染（结合原理）
* data改变之后，DOM不会立即渲染
* $nextTick 会在DOM渲染之后才被触发，用于获取更新后的DOM节点
利用todolist测试：
1.利用ref拿到DOM节点，长度3，点击添加按钮，push一条数据，理论上4条，实际还是3条，因为data改变了，DOM并没有
2.页面渲染是会对data的修改做整合，多次修改data只会渲染一次（优化手段，提升性能，一定是异步渲染），同步就不行，需对源码进行深读，里面包含了微任务队列；

3.slot
插槽并不难，只是内容比较多；
具名插槽 根据约定的名称，外部编写子组件渲染的template和事件，内部定义对应名称的模板结构；
作用域插槽 父级模板使用子组件时，在内部定义的 v-slot里拿到子组件的数据，并自定义页面模板内容；
动态插槽

/* ----- ----- ----- ----- */

通信方式：
1. prop + emit
2. $refs + ref
3. $attrs + $listeners
4. provide + inject
5. EventBus 自定义事件 $emit + $on + $off + $once
6. vuex vs 全局事件总线
7. 浏览器存储 localStorage, sessionStorage
8. $parent, $children // 深度耦合，不推荐

合并策略：
mergeOptions 方法
场景覆盖：
1.全局注册的components，directives，filters
2.通过 extends, mixins 合并选项
具体策略：
1.

风格指南：
（1）组件：
1.命名
PascalCase vs kebab-case
template模板：两者都可以，更加推荐 PascalCase；
DOM模块：必须使用 kebab-case（html对大小写不敏感）；

2.自闭合
<MyComponent />

3.单文件组件命名
既然模板里采用 PascalCase，那么为了保持一致，单文件组件的文件名也采用 PascalCase；
如果习惯写 kebab-case，那么文件名也保持 kebab-case；

4.组件名的单词顺序
重点：描述的单词开头，修饰词结尾；
反例：auditDialog
好例：DialogAudit, SearchBtnRun, SearchBtnClear

5.组件名的单词要完整？
完整 vs 简写
强烈推荐：即使单词很长，也要完整单词拼写，不要简写；
好例：PriceOrQuantityBatchUpdate (描述：批量更新单价或数量-组件)；

6.Prop 命名
定义命名：camelCase
template使用：kebab-case
好例：
props: {
  operationType: String
}
<Dialog :operation-type="operationType" />
* 新技能：
加上校验，特别是传递约定值的时候；
props: {
  type: String,
  required: true,
  validator(value) {
    // 外部必须传递约定好的可选类型：新增 | 更新 | 只读
    return ['create', 'update', 'read'].indexOf(value) >= 0
  }
}

7.computed 的使用场景
在模板中编写简单的表达式可以，再稍微复杂一点，或者依赖其他属性时，放在computed中更适合；
它还有缓存，依赖不改变，就会直接反复上次结果,而且是响应式的，触发view更新；
不像methods，每次都要计算；
好例：
<el-button :disabled="onChecked" />
computed: {
  onChecked() {
    this.multipleSelection.length === 0
  },
  totalPrice() {
    return this.unitPrice * (this.counts || 0)
  }
}

8.指令缩写，统一使用缩写
v-bind: -> :
v-on  -> @
v-slot -> #

9.私有 property 命名
场景：mixins 混入；私有属性和方法；
目的：特别是 mixins，要避免冲突；
写法：$_namespace_xxx

10.如何看待关注点分离
关注点分离不等于文件类型分离！
* 我们已经发现相比于把代码库分离成三个大的层次并将其相互交织起来，把它们划分为松散耦合的组件再将其组合起来更合理一些。
* 在一个组件里，其模板、逻辑和样式是内部耦合的，并且把他们搭配在一起实际上使得组件更加内聚且更可维护。

/* ----- ----- ----- ----- */
计划安排表
7.23日
上半段：
vuex + vue-router

下半段：
element-ui中，el-form 如何实现通信？
validate()
validateField()
resetFields()
...

