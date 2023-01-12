<template>
  <v-container>
    <v-row justify="center">
      <div class="pa-10 text-h4">Welcome to CCOF!</div>
    </v-row>
    <v-row justify="space-around">
      <v-col cols="6">
        <LargeCard title="Group Provider">
          <p>You have a Group or Multi-Age Licence for more than eight children for a facility that is not your personal residence</p>
          <v-btn absolute bottom dark color='#003366' @click="toGroup">GO</v-btn>
        </LargeCard>
      </v-col>
      <v-col cols="6">
        <LargeCard title="Family Provider">
          <p>Family, In-Home or Multi-Age Licence for eight or fewer children in a personal residence</p>
          <v-btn absolute bottom dark color='#003366' @click="toFamily()">GO</v-btn>
        </LargeCard>
      </v-col>
    </v-row>
    <v-row justify="space-around" class="pt-16">
      <v-btn color="info" outlined required x-large to="/">Back</v-btn>
      <span/>
      <span/>
    </v-row>    
  </v-container>
</template>

<script>

import LargeCard from '@/components/guiComponents/LargeCard.vue';
import { PATHS } from '@/utils/constants';
import { mapMutations } from 'vuex';

export default {
  name: 'LandingPage',
  data() {
    return {
      paths: PATHS
    };
  },
  components: { LargeCard },
  methods: {
    ...mapMutations('organization', ['setOrganizationProviderType']),

    toGroup() {
      this.setOrganizationProviderType('GROUP');
      this.$router.push(this.paths.group.orgInfo);
    },
    toFamily() {
      this.setOrganizationProviderType('FAMILY');
      this.$router.push(this.paths.family.orgInfo);
    }
  }
};

</script>
