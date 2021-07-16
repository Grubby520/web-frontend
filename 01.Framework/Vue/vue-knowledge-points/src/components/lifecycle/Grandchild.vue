<template>
  <span>{{ label }}</span>
</template>

<script>
export default {
  name: 'Grandchild',
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
