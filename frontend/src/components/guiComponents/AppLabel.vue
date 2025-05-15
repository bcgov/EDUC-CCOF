<template>
  <span class="app-label">
    <slot></slot>
  </span>
</template>
<script>
export default {
  inheritAttrs: true,
};
</script>

<style scoped>
.app-label {
  font-weight: 600;
}
</style>
