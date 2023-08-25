<template>
    <v-container>
      <v-row justify="space-around">
        <div class="pa-10 text-h4 text-center">Welcome to CCOF!</div>
      </v-row>
      <v-row justify="space-around">
        <div>
        <h4 class="text-h4"><b>Instructions:</b></h4>

        <br>
        <p class="px-10 text-h6">
          You must notify the Child Care Operating Funding Program within two business days of any change to:
          
          <ul>
            
            <li>Your facility licence</li>
            <li>Services outlined in Schedule in Schedule A of your Child Care Operating Funding Agreement</li>
          </ul>
          <br>
          To ensure accurate payments, please notify us of any changes <b>before</b> submitting an enrolment report of a monthly ECE report.
        </p>
          <v-card outlined class="mx-10">
            
              <v-card-title class="test">
                <v-icon
                  x-large
                  class="py-1 noticeInfoIcon">
                  mdi-information
                </v-icon>
                <span><b>Additional funding cannot be paid in the month that:</b></span></v-card-title>
              <v-card-text>
                  <ul>
                      <li>the Funding Agreement starts</li>
                      <li>the Funding Agreement has already been modified</li>
                      <li>you submitted an enrolment report and received payment</li>
                  </ul>
              </v-card-text>
        </v-card>
        <br>
        <p class="px-10 text-h6">
          <br>
            <a href="https://www2.gov.bc.ca/gov/content/family-social-supports/caring-for-young-children/running-daycare-preschool/child-care-operating-funding/report-changes">
            Learn more about reporting changes</a> to your licence or service.
            <br>
            <b>Before you continue:</b>
            <ul>
                <li>You may need to attach an <b>updated </b><i> Community Care and Assisted Living Act</i> licence</li>
                <li>You may need to download and complete additional forms</li>
                <li>You may need to attach other supporting documents related to your change request</li>
            </ul>
        </p>
      </div>
      </v-row>
      <NavButton 
      :isNextDisplayed="true" @previous="previous" @next="next"></NavButton>
    </v-container>
  </template>

<script>
import { mapState, mapMutations, mapActions, mapGetters } from 'vuex';
import { PATHS } from '@/utils/constants';
import alertMixin from '@/mixins/alertMixin';
import NavButton from '@/components/util/NavButton';

export default {
  name: 'ReportChange',
  mixins: [alertMixin],
  data() {
    return {
      isLoading: true,

      loading: false,

    };
  },
  computed: {
  },
  methods: {
    previous() {
      this.$router.push(PATHS.ROOT.HOME);
    },
    next(){
        this.$router.push(PATHS.ROOT.CHANGE_LANDING);
    },
  },
  components: { NavButton}
};
</script>
<style scoped>
.test{
  background-color: #c1dcf6;
  margin: auto;
}

</style>