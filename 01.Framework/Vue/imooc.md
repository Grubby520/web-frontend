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
event参数
事件修饰符，按键修饰符
【观察】事件被绑定到哪里










