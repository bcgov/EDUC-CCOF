<template>
  <v-container max-width="1200">
    <p class="text-h4 text-primary text-center">Welcome to Child Care Operating Funding (CCOF)</p>
    <p class="text-primary px-8 px-lg-16 my-16">
      If your organization currently receives funding from the Child Care Operating Funding (CCOF) program, do not
      submit a new application. You can request support for applying on MyCCBC by calling the program at 1-888-338-6622
      (Option 2).
    </p>
    <v-row>
      <v-col cols="12" sm="6" class="d-flex justify-center">
        <AppButton id="cancel-button" :primary="false" size="medium" min-width="200px" @click="backToLanding">
          Cancel
        </AppButton>
      </v-col>
      <v-col cols="12" sm="6" class="d-flex justify-center">
        <AppButton id="start-application" size="medium" min-width="200px" @click="newApplication">
          Start Application
        </AppButton>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState, mapActions } from 'pinia';
import AppButton from '@/components/guiComponents/AppButton.vue';
import { useAppStore } from '@/store/app.js';
import { useApplicationStore } from '@/store/application.js';
import { PATHS, pcfUrl } from '@/utils/constants.js';

export default {
  name: 'NewAppIntermediatePage',
  components: { AppButton },
  computed: {
    ...mapState(useAppStore, ['programYearList']),
  },
  methods: {
    ...mapActions(useApplicationStore, ['setIsRenewal']),
    newApplication() {
      this.setIsRenewal(false);
      this.$router.push(pcfUrl(PATHS.SELECT_APPLICATION_TYPE, this.programYearList.newApp.programYearId));
    },
    backToLanding() {
      this.$router.push(PATHS.ROOT.HOME);
    },
  },
};
</script>
