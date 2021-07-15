<template>
  <div class="parent">
    <p>{{ name }}</p>
    <input v-model="text">
    <button @click="plus">点我</button>
    <Child :list="list" @del="del" />
  </div>
</template>

<script>
/**
（1）生命周期及其加载顺序
  mount阶段 -》dispatch阶段 -》destroy阶段
  1.单个组件：
  挂载阶段：beforeCreate, created, beforeMount, mounted
  更新阶段：beforeUpdate, updated
  销毁阶段：beforeDestroy, destroyed

  2.父子组件
  挂载阶段：
    beforeCreate(父), created(父), beforeMount(父), 
    beforeCreate(子), created(子), beforeMount(子), mounted(子)
    mounted(父)
  更新阶段:
    beforeUpdate(父)
    beforeUpdate(子), updated(子)
    update(父)
  销毁阶段：
    beforeDestroy(父),
    beforeDestroy(子), destroyed(子)
    destroyed(父)
 */
import Child from "./Child.vue";
export default {
  name: "Parent",
  components: {
    Child
  },
  data() {
    return {
      name: "parent",
      list: [
        {
          label: "张三",
          key: 0,
        },
      ],
      key: 0,
      text: ''
    };
  },
  methods: {
    plus() {
      this.key++;
      this.list.push({
        label: this.text,
        key: this.key
      });
    },
    del(index) {
      this.list.splice(index, 1)
    }
  },
  beforeCreate() {
    console.log("parent beforeCreate");
  },
  created() {
    console.log("parent created");
  },
  beforeMount() {
    console.log("parent beforeMount");
  },
  mounted() {
    console.log("parent mounted");
  },
  beforeUpdate() {
    console.log("parent beforeUpdate");
  },
  updated() {
    console.log("parent updated");
  },
  beforeDestroy() {
    console.log("parent beforeDestroy");
  },
  destroyed() {
    console.log("parent destroyed");
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
