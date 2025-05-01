<template>
  <label class="app-label">
    <slot></slot>
  </label>
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
