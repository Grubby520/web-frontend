<!--  1.会被 webpack vue-template-compiler 模板解析
      2.其他 loader 如 file-loader, url-loader 等 解析
-->
<template>
  <div class="home-c">
    <p>我是主页</p>
    <el-button type="primary" @click="jump">nestRouter/104</el-button>
  </div>
</template>
<script>
export default {
  name: "Home",
  data() {
    return {
      arr: [
        {
          label: "who",
          value: 1,
        },
      ],
      obj: {
        a: "a",
        b: "b",
      },
    };
  },
  methods: {
    jump() {
      console.log(this);
      this.$router.push({ path: "nestRouter/18" }); // router 有拦截，会失效！！！
    },
  },
};
</script>

<!-- * 会被 webpack 当做一个 *.scss 文件处理 -->
<style lang="scss" scoped>
.home {
  font-size: 16px;
}
</style>
