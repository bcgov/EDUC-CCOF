<template>
  <v-container max-width="1200">
    <p class="text-h4 text-center">Welcome to Child Care Operating Funding (CCOF)</p>
    <p class="px-4 mt-12 mb-4">
      Select the applicable provider type for your Organization. If you are unsure which type to select, you can preview
      a PDF version of the
      <a
        href="https://www2.gov.bc.ca/assets/gov/family-and-social-supports/child-care/childcarebc-programs/ccof/cf1320_ccof_family_application.pdf"
        target="_blank"
      >
        <u>Family Form</u>
      </a>
      or
      <a
        href="https://www2.gov.bc.ca/assets/gov/family-and-social-supports/child-care/childcarebc-programs/ccof/cf1321_ccof_group_application.pdf"
        target="_blank"
      >
        <u>Group Form</u></a
      >. To learn more about eligibility visit the
      <a
        href="https://www2.gov.bc.ca/gov/content/family-social-supports/caring-for-young-children/childcarebc-programs/child-care-operating-funding/base-funding"
        target="_blank"
      >
        <u>Child Care Operating Funding - Base Funding</u>
      </a>
      page. If you choose the wrong option, you will need to contact the program at 1(888)338-6622 (Option 2).
    </p>
    <v-row class="px-4 pb-8">
      <v-col cols="12" md="6" class="d-flex">
        <v-card class="pa-4 d-flex flex-column flex-grow-1 elevation-4" height="250">
          <v-card-title>Group Provider</v-card-title>
          <v-card-text>
            You have a Group or Multi-Age Licence for eight or more children for a facility that is not your personal
            residence.
          </v-card-text>
          <v-card-actions>
            <AppButton size="medium" @click="toGroup">Start Application</AppButton>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" class="d-flex">
        <v-card class="pa-4 d-flex flex-column flex-grow-1 elevation-4">
          <v-card-title>Family Provider</v-card-title>
          <v-card-text>
            Family, In-Home or Multi-Age Licence for eight or fewer children in a personal residence.
          </v-card-text>
          <v-card-actions>
            <AppButton size="medium" @click="toFamily">Start Application</AppButton>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <NavButton @previous="previous" />
  </v-container>
</template>

<script>
import { mapActions, mapState } from 'pinia';

import AppButton from '@/components/guiComponents/AppButton.vue';
import NavButton from '@/components/util/NavButton.vue';
import { useAppStore } from '@/store/app.js';
import { useOrganizationStore } from '@/store/ccof/organization.js';
import { PATHS, pcfUrl, ORGANIZATION_PROVIDER_TYPES } from '@/utils/constants.js';

export default {
  name: 'CcofApplicationTypeSelector',
  components: { AppButton, NavButton },
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
