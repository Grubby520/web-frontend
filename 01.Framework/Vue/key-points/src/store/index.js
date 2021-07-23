import Vue from "vue";
import Vuex from "vuex";
import rootStore from "@/store/rootStore";

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== "production";

export default new Vuex.Store({
  modules: {
    rootStore,
  },
  strict: debug,
  plugins: [],
});
