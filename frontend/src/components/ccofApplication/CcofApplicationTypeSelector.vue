<template>
  <v-container>
    <v-row justify="center">
      <div class="pa-10 text-h4">Welcome to CCOF!</div>
    </v-row>
    <v-row justify="center">
      <p class="px-10 text-h6">
        If you select the incorrect provider type, you will need to contact the program at 1 (888) 338-6622 (Option 2).
        <br>
        If you are unsure which type to select, you can view a PDF version of the 
        <a class="text-decoration-underline" href="https://www2.gov.bc.ca/assets/gov/family-and-social-supports/child-care/child-care-operating-funding/cf1320_ccof_family_application.pdf">family form</a>
        and the 
        <a class="text-decoration-underline" href="https://www2.gov.bc.ca/assets/gov/family-and-social-supports/child-care/child-care-operating-funding/cf1321_ccof_group_application.pdf">group form</a>.
      </p>
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
    <v-row justify="space-around" class="stickyNavButtons pt-16">
      <v-btn class="blueButton" required x-large to="/">Back</v-btn>
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
