const { createLocalVue, mount } = require("@vue/test-utils");
import ElementUI from "element-ui";
import { Button } from "element-ui";
import Vuex from "vuex";

import moduleA from "../../../src/store/modules/moduleA";
import VuexComponent from "@/components/boundary/Vuex.vue";

const localVue = createLocalVue();
localVue.use(Vuex);

describe("Vuex.vue", () => {
  // init vuex
  let store;
  beforeEach(() => {
    store = new Vuex.Store({
      modules: {
        moduleA: {
          namespaced: true,
          state: moduleA.state,
          getters: moduleA.getters, // 检查 getter 是否返回正确的 state
          mutations: moduleA.mutations,
        },
      },
    });
  });

  const wrapper = mount(VuexComponent, {
    localVue,
    store,
    mocks: {
      $store: {
        state: {
          moduleA: moduleA.state,
        },
        getters: moduleA.getters,
      },
    },
  });

  expect(wrapper.vm.count).toBe(1);
});
