<template>
  <div class="search">
    <p>i am search component</p>
    <!-- 1.不具名插槽，接收不具名的slot -->
    <!-- 2.不具名插槽，如果父级slot为空，还可以设置一个默认内容 -->
    <slot>slot为空，后背内容才会显示</slot>
    <!-- 3.具名插槽，带有特殊的 attribute：name； 实现自定义布局效果 -->

    <slot name="operations"></slot>
  </div>
</template>

<script>
export default {};
</script>
