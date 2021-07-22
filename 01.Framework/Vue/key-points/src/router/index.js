import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter); // 插件 Plugin 一个库，提供强大的API

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/lifecycle",
    name: "lifecycle",
    component: () =>
      import(/* webpackChunkName: "Lifecycle" */ "../views/Lifecycle.vue"),
  },
  {
    path: "/slot",
    name: "Slot",
    component: () => import("../views/Slot.vue"),
  },
  {
    path: "/boundary",
    name: "Boundary",
    component: () => import("../views/Boundary.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
