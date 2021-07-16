<template>
  <!-- <div class="child">
    {{ name }} -->
    <ul>
      <li v-for="(item, index) in list" :key="item.id">
        <Grandchild :label="item.label" />  <span @click="del(index)" style="margin-left: 10px; color: red;">X</span>
      </li>
    </ul>
  <!-- </div> -->
</template>

<script>
import Grandchild from "./Grandchild.vue";
export default {
  name: "Child",
  components: {
    Grandchild
  },
  props: ["list"],
  data() {
    return {
      name: "child",
    };
  },
  methods: {
    del(index) {
      this.$emit('del', index)
    }
  },
  beforeCreate() {
    console.log("child beforeCreate");
  },
  created() {
    console.log("child created");
  },
  beforeMount() {
    console.log("child beforeMount");
  },
  mounted() {
    console.log("child mounted");
  },
  beforeUpdate() {
    console.log("child beforeUpdate");
  },
  updated() {
    console.log("child updated");
  },
  beforeDestroy() {
    console.log("child beforeDestroy");
  },
  destroyed() {
    console.log("child destroyed");
  }
};
</script>

<style></style>
