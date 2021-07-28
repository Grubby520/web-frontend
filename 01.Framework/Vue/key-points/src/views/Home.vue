<template>
  <div class="home-c">
    <p>我是主页</p>
    <el-button type="primary" @click="jump">nestRouter/104</el-button>
  </div>
</template>
<script>
export default {
  name: "Home",
  methods: {
    jump() {
      this.$router.push({ path: "nestRouter/18" });
    },
  },
};
</script>

<style lang="scss" scoped>
.home {
  font-size: 16px;
}
</style>
