<template>
  <Search>
    <!-- 1.父模板都是在父作用域中编译的；子模板所有内容都是在子作用域中编译的 -->
    <p>template by parent, {{ parent }}</p>
  </Search>
</template>

<script>
import Search from "./Search.vue";

export default {
  components: {
    Search,
  },
  data() {
    return {
      parent: "Father",
    };
  },
};
</script>

<style></style>
