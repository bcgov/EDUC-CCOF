<template>
  <v-app-bar v-if="bannerColor" id="app-env-bar" :color="bannerColor" height="20" class="env-bar">
    <div>
      <h3 class="env-text">{{ bannerEnvironment }} Environment</h3>
    </div>
  </v-app-bar>
</template>

<script>
import StaticConfig from '@/common/staticConfig';

export default {
  name: 'TheEnvBar',
  data() {
    return {
      bannerEnvironment: StaticConfig.BANNER_ENVIRONMENT,
      bannerColor: StaticConfig.BANNER_COLOR,
    };
  },
};
</script>
<style scoped>
.env-bar {
  margin-top: 2px;
  padding: 0 16px;
}
.env-text {
  color: #ffffff;
  font-size: 0.8rem;
}
</style>
