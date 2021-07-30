### 搞明白要测试什么？

1. UI组件
  1.撰写为断言你的组件的公共接口；
  2.断言一些输入 (用户的交互或 prop 的改变) 提供给某组件之后是否导致预期结果 (渲染结果或触发自定义事件)；
  好处：
  组件的内部实现已经随时间发生了改变，只要你的组件的公共接口始终保持一致。

3. 异步测试行为
  nextTick;
  来自 Vue 的更新
  来自外部行为的更新

4. 模拟用户行为(鼠标，键盘等DOM事件)

5. mount vs shallowMount
shallowMount: 方法只挂载一个组件而不渲染其子组件

6. 父子组件事件 v-on, emit, props

### vue-loader, vuex, ts
