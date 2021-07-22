<script>
export default {
  functional: true,
  name: "Render",
  /** render函数写着头痛 - 放弃
   * createElement(
      tag?: string | Class<Component> | Function | Object,
      data?: VNodeData,
      children?: any,
   * )
   */
  // 函数式组件中，data会失效，无状态，没有生命周期，没有响应式
  data() {
    return {
      showFoo: true,
    };
  },
  // 只能接收prop (其他任何玩意儿都会失效)
  props: {
    showBar: {
      type: Boolean,
      default: true,
    },
  },
  render(h, ctx) {
    console.log(ctx);
    return h(
      "div",
      {
        class: {
          foo: true,
          bar: ctx.props.showBar,
        },
        style: {
          "font-size": "16px",
        },
      },
      [
        "div元素 start",
        h("p", { class: { "warining-text": true } }, "这是P元素"),
        "div元素 end",
      ]
    );
  },
};
</script>

<style lang="scss" scoped>
.foo {
  color: blue;
  &.bar {
    color: #e6a23c;
  }
}
.warining-text {
  color: red;
}
</style>
