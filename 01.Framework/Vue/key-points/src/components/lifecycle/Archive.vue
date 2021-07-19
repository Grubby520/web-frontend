<template>
  <div>Archive component</div>
</template>

<script>
export default {
  activated() {
    console.log("Archive activated");
  },
  deactivated() {
    console.log("Archive deactivated");
  },
  beforeDestroy() {
    console.log("Archive beforeDestroy");
  },
  destroyed() {
    console.log("Archive destroyed");
  },
};
</script>
