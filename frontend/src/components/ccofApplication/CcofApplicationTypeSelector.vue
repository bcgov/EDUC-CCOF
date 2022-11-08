<template>
  <v-container>
    <v-row justify="center">
      <div class="pa-10 text-h4">Welcome (Organization name) to CCOF!</div>
    </v-row>
    <v-row>
      <SmallCard title="Group Provider">
        <p>Lorem ipsum Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        <v-btn absolute bottom dark color='#003366' :to="paths.group.orgInfo">GO</v-btn>
      </SmallCard>

      <SmallCard title="Family In Home">
        <p>Lorem ipsum Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        <v-btn absolute bottom dark color='#003366' :to="paths.group.familyOrgInfo">GO</v-btn>
      </SmallCard>

      <SmallCard title="Multi Age Provider">
        <p>Lorem ipsum Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        <v-btn absolute bottom dark color='#003366' :to="paths.group.orgInfo">GO</v-btn>
      </SmallCard>
    </v-row>
  </v-container>
</template>

<script>

import SmallCard from '@/components/guiComponents/SmallCard.vue';
import { PATHS } from '@/utils/constants';

export default {
  name: 'LandingPage',
  data() {
    return {
      paths: {
        group: {
          orgInfo: PATHS.orgInfo,
          familyOrgInfo: PATHS.familyOrgInfo
        }
      }
    };
  },
  components: { SmallCard }
};

</script>
