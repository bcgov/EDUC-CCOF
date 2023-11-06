<template>
  <v-container>
    <div class="row pt-4 justify-center">
      <v-row class="d-flex justify-center text-h5" style="color:#003466;">
        Welcome {{ this.userInfo.organizationName }} to CCOF!
      </v-row>
      <v-row class="d-flex justify-center">
        <p>If you or your ogranization are already in agreement and have active funding with the Child
          Care Operating Funding program, do not submit a new application and call the program
          directly at 1-888-338-6622 (Option 2).</p>
      </v-row>
      <v-row class="d-flex justify-center">
        <v-col class="d-flex justify-center">
          <v-btn dark class="blueButton" @click="backToLanding()">Cancel</v-btn>
        </v-col>
        <v-col class="d-flex justify-center">
          <v-btn dark class="blueButton" @click="newApplication()">Start Application</v-btn>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script>
import { mapGetters, mapState, mapMutations } from 'vuex';
import { PATHS, pcfUrl, } from '@/utils/constants';
import alertMixin from '@/mixins/alertMixin';

export default {
  name: 'NewAppIntermediatePage',
  components: {},
  mixins: [alertMixin],
  data() {
    return {

    };
  },
  computed: {
    ...mapGetters('auth', ['userInfo', 'isMinistryUser']),
    ...mapState('organization', ['organizationProviderType']),
    ...mapState('application', ['formattedProgramYear']),
    ...mapState('app', ['programYearList']),

  },
  methods: {
    ...mapMutations('application', ['setIsRenewal']),
    newApplication() {
      this.setIsRenewal(false);
      this.$router.push(pcfUrl(PATHS.SELECT_APPLICATION_TYPE, this.programYearList.newApp.programYearId));
    },
    backToLanding() {
      this.$router.push(PATHS.ROOT.HOME);
    },
  }
};
</script>

<style scoped>
</style>
