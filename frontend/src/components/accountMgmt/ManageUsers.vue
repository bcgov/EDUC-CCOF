<template>
  <v-container fluid class="pa-12">
    <h1 class="mb-6">Manage Users</h1>
    <v-row>
      <v-col>
        <NavButton @previous="() => $router.push(PATHS.ROOT.HOME)" />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { PATHS } from '@/utils/constants.js';

import NavButton from '@/components/util/NavButton.vue';

export default {
  name: 'ManageUser',
  components: { NavButton },
  data() {
    return {
      tab: undefined,
      PATHS,
    };
  },
};
</script>
