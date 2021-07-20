<template>
  <div class="boundary-m-container">
    <h4>自定义组件的v-model</h4>
    <p>{{ checked }}</p>
    <Model v-model="checked" />

    <el-divider></el-divider>

    <h4>sync 修饰符</h4>
    <p>{{ name }}</p>
    <!-- 父组件 prop带上sync修饰符 -->
    <Sync :name.sync="name" />

    <!-- 通信方式 EventBus
      1.实现 Model 和 Sync 两个兄弟组件之间的通信
    -->
  </div>
</template>

<script>
import Model from "./model.vue";
import Sync from "./sync.vue";
export default {
  components: {
    Model,
    Sync,
  },
  data() {
    return {
      checked: true,
      name: "lili",
    };
  },
};
</script>
