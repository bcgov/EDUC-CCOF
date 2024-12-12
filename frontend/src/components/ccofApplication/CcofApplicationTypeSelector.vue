<template>
  <v-container>
    <v-row justify="center">
      <div class="pa-10 text-h4">Welcome to CCOF!</div>
    </v-row>
    <v-row justify="center">
      <p class="px-10 text-h6">
        If you select the incorrect provider type, you will need to contact the program at 1 (888) 338-6622 (Option 2).
        <br />
        If you are unsure which type to select, you can view a PDF version of the
        <a
          class="text-decoration-underline"
          href="https://www2.gov.bc.ca/assets/gov/family-and-social-supports/child-care/childcarebc-programs/ccof/cf1320_ccof_family_application.pdf"
          target="_blank"
          >family form</a
        >
        and the
        <a
          class="text-decoration-underline"
          href="https://www2.gov.bc.ca/assets/gov/family-and-social-supports/child-care/childcarebc-programs/ccof/cf1321_ccof_group_application.pdf"
          target="_blank"
          >group form</a
        >.
      </p>
    </v-row>
    <v-row justify="space-around">
      <v-col cols="6">
        <LargeCard title="Group Provider">
          <template #content>
            <p>
              You have a Group or Multi-Age Licence for more than eight children for a facility that is not your
              personal residence
            </p>
          </template>
          <template #button>
            <v-btn theme="dark" class="blueButton" @click="toGroup"> GO </v-btn>
          </template>
        </LargeCard>
      </v-col>
      <v-col cols="6">
        <LargeCard title="Family Provider">
          <template #content>
            <p>Family, In-Home or Multi-Age Licence for eight or fewer children in a personal residence</p>
          </template>
          <template #button>
            <v-btn theme="dark" class="blueButton" @click="toFamily()"> GO </v-btn>
          </template>
        </LargeCard>
      </v-col>
    </v-row>
    <NavButton @previous="previous" />
  </v-container>
</template>

<script>
import { mapActions, mapState } from 'pinia';

import LargeCard from '@/components/guiComponents/LargeCard.vue';
import NavButton from '@/components/util/NavButton.vue';
import { useAppStore } from '@/store/app.js';
import { useOrganizationStore } from '@/store/ccof/organization.js';
import { PATHS, pcfUrl, ORGANIZATION_PROVIDER_TYPES } from '@/utils/constants.js';

export default {
  name: 'CcofApplicationTypeSelector',
  components: { LargeCard, NavButton },
  computed: {
    ...mapState(useAppStore, ['programYearList']),
  },
  methods: {
    ...mapActions(useOrganizationStore, ['setOrganizationProviderType']),
    previous() {
      this.$router.push(PATHS.ROOT.HOME);
    },
    toGroup() {
      this.setOrganizationProviderType(ORGANIZATION_PROVIDER_TYPES.GROUP);
      this.$router.push(pcfUrl(PATHS.CCOF_GROUP_ORG, this.programYearList.newApp.programYearId));
    },
    toFamily() {
      this.setOrganizationProviderType(ORGANIZATION_PROVIDER_TYPES.FAMILY);
      this.$router.push(pcfUrl(PATHS.CCOF_FAMILY_ORG, this.programYearList.newApp.programYearId));
    },
  },
};
</script>
