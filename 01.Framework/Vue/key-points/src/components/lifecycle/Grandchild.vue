<template>
  <span>{{ label }}</span>
</template>

<script>
export default {
  name: "Grandchild",
  inheritAttrs: false,
  props: {
    label: {
      required: true,
      default: "",
    },
  },
  beforeCreate() {
    // 这里还拿不到 this
    console.log(`Grandchild beforeCreate`);
  },
  created() {
    console.log(`Grandchild ${this.label} created`);
  },
  beforeMount() {
    console.log(`Grandchild ${this.label} beforeMount`);
  },
  mounted() {
    console.log(`Grandchild ${this.label} mounted`);
    // 通信方法 孙子组件接收到了祖父组件传递的 data property
    this.$console(this.$attrs); // {staticValue: "static value"}
  },
  beforeUpdate() {
    console.log(`Grandchild ${this.label} beforeUpdate`);
  },
  updated() {
    console.log(`Grandchild ${this.label} updated`);
  },
  beforeDestroy() {
    console.log(`Grandchild ${this.label} beforeDestroy`);
  },
  destroyed() {
    console.log(`Grandchild ${this.label} destroyed`);
  },
};
</script>
