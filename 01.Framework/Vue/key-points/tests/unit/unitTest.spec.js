import { createLocalVue, mount, shallowMount } from "@vue/test-utils";
import ElementUI from "element-ui";
import { Button } from "element-ui";
import Index from "@/components/unitTest/index.vue";

const localVue = createLocalVue();
localVue.use(ElementUI);

describe("Index.vue", () => {
  it("button click should increment the count", async () => {
    // 1.生成包装器
    const wrapper = mount(Index, { localVue });
    // 2.期望 count: 0
    expect(wrapper.vm.count).toBe(0);
    // 3.触发 ’click‘
    // const btn = wrapper.find("button"); // 如果只有一个 el-button
    // 踩坑：多个 el-button，如何获取;findComponent, findAllComponent (valid element: find, findAll)
    // await wrapper.findAll("button").at(0).trigger("click");
    await wrapper.findAllComponents(Button).at(0).trigger("click");
    // 4.期望 count: 1
    expect(wrapper.vm.count).toBe(1);

    await wrapper.findAllComponents(Button).at(0).trigger("click");
    expect(wrapper.vm.count).toBe(2);
  });

  it("button click should reduce the count", async () => {
    const wrapper = mount(Index, { localVue });
    expect(wrapper.vm.count).toBe(0);

    await wrapper.findAllComponents(Button).at(1).trigger("click");
    expect(wrapper.vm.count).toBe(-1);

    await wrapper.findAllComponents(Button).at(1).trigger("click");
    expect(wrapper.vm.count).toBe(-2);
  });
});
