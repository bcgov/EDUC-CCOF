<template>
  <v-container fluid>
    <AppSimpleCard>
      <template #title>Unauthorized Access</template>
      <template #text>You do not have required roles to perform actions on this page.</template>
    </AppSimpleCard>
  </v-container>
</template>

<script>
import AppSimpleCard from '@/components/util/AppSimpleCard.vue';
export default {
  name: 'UnauthorizedView',
  components: { AppSimpleCard },
};
</script>
