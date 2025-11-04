<template>
  <div class="spinner-container">
    <v-progress-circular indeterminate size="96" :width="6" color="primary" />
  </div>
</template>

<script>
export default {
  name: 'SpinnerComponent',
};
</script>

<style scoped>
.spinner-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 70vh;
}
</style>
