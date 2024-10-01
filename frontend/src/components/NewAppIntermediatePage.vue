<template>
  <v-container>
    <div class="row pt-4 justify-center">
      <v-container>
        <v-row
          class="justify-center text-h5 pb-5"
          style="color: #003466"
        >
          Welcome to CCOF!
        </v-row>
      </v-container>
      <v-container>
        <v-row
          class="justify-center pb-5"
          style="color: #003466"
        >
          <p style="max-width: 801px">
            If your organization currently receives funding from the Child Care Operating Funding (CCOF) program, do not
            submit a new application. You can request support for applying on MyCCBC by calling the program at
            1-888-338-6622 (Option 2).
          </p>
        </v-row>
      </v-container>
      <v-row class="justify-center">
        <v-col class="d-flex justify-center">
          <v-btn
            dark
            class="blueButton"
            @click="backToLanding()"
          >
            Cancel
          </v-btn>
        </v-col>
        <v-col class="d-flex justify-center">
          <v-btn
            dark
            class="blueButton"
            @click="newApplication()"
          >
            Start Application
          </v-btn>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script>
import { mapState, mapActions } from 'pinia';
import { useAuthStore } from '../store/auth.js';
import { useAppStore } from '../store/app.js';
import { useOrganizationStore } from '../store/ccof/organization.js';
import { useApplicationStore } from '../store/application.js';

import { PATHS, pcfUrl } from '../utils/constants.js';
import alertMixin from '../mixins/alertMixin.js';

export default {
  name: 'NewAppIntermediatePage',
  components: {},
  mixins: [alertMixin],
  data() {
    return {};
  },
  computed: {
    ...mapState(useAuthStore, ['userInfo', 'isMinistryUser']),
    ...mapState(useOrganizationStore, ['organizationProviderType']),
    ...mapState(useApplicationStore, ['formattedProgramYear']),
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

<style scoped></style>
