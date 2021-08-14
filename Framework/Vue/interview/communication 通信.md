1. 父子通信 prop + emit
  保持数据单向流，父传子通过 prop，子传父通过事件分发 $emit;

2. 组件之间的引用关系 $refs + ref
  通过 ref 获取组件实例对象，可以链式调用；
  this.$refs.parent.parent；
  this.$refs.child；
  注：主要用于操作DOM对象，其他方式调用并不推荐；

3. $attrs + $listeners
  分别访问传递给组件的（不作为 prop 传递的）attribute 和事件监听器，有一个 inheritAttrs 可选属性；
  对第三方组件库进行二次封装的时候很有用；
  封装复杂的高阶组件时很有用；

4. provide + inject
  父组件通过定义 provide，所有子孙组件通过 inject 接收；
  一般都是传递静态属性，没有this；
  通过函数 () => Object 拿到this，并返回一个对象；
  注：如果传递的是对象或数组，同样是响应式的；

5. vuex
  状态管理的库，并遵循相应的规则管理和更新state的变化；

6. EventBus 自定义事件 $on, $off, $once, $emit
  允许组件随意通信，无论组件处于组件树的那一层；
  早期1.x从dispatch方法迁移过来时使用，一般用不到；

7. 浏览器存储 localStorage, sessionStorage

8. 组件实例上的 $parent, $children
  深度耦合，不推荐；
  数据流的变化将会变得十分怪异，极难维护；
