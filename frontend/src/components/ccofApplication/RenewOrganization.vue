<template>
  <v-form ref="form" v-model="isValidForm">
    <v-container>
      <v-row justify="center">
        <div
          class="pa-10 text-h5"
          v-text="`Child Care Operating Funding Program - ${getNextProgramYear.name.replace(/[^\d/]/g, '')} Program Confirmation Form`" />
      </v-row >

      <div v-if="processing">
        <v-skeleton-loader max-height="475px"  :loading="processing" type="image, image"></v-skeleton-loader>
        <br><br>
        <v-skeleton-loader max-height="475px"  :loading="processing" type="image, image"></v-skeleton-loader>
      </div>

      <div v-else>

          <v-row>
            <v-card width="100%" class="mx-3 my-10" v-if="isSomeChangeRequestActive()">
              <v-row>
                <v-col class="py-0">
                  <v-card-title class="py-1 noticeAlert">
                    <span style="float:left">
                  <v-icon
                    x-large
                    class="py-1 px-3 noticeAlertIcon">
                    mdi-alert-octagon
                  </v-icon>
                  </span>
                  You have a change request for the {{ currentYearLabel }} funding term still in progress.
                  </v-card-title>
                </v-col>
              </v-row>
              <v-card-text>
                The {{renewalYearLabel}} Program Confirmation Form cannot be submitted until the change is complete.<br><br>
                <br>

                <v-btn dark class="blueButton mb-10" @click="goToChangeRequestHistory()" :loading="processing">View My Changes</v-btn>
              </v-card-text>
            </v-card>
          </v-row>
        <v-row justify="space-around">
          <v-card class="cc-top-level-card justify-center" width="800">
              <v-card-text>
                  Do your current licence and service details match the information found in
                  Schedule A of your most recent Funding Agreement?


              </v-card-text>
              <v-row>
                <v-col class="d-flex justify-center">
                  <v-radio-group row v-model="fundingGroup" :disabled="isSomeChangeRequestActive()" >
                    <v-radio
                      label="Yes"
                      value="true"/>
                    <v-radio
                      label="No"
                      value="false"/>
                  </v-radio-group>
                </v-col>
              </v-row>
              <v-row>
                <v-card width="100%" class="mx-3" v-if="fundingGroup == 'false'">
                  <v-row>
                    <v-col class="py-0">
                      <v-card-title class="py-1 noticeAlert">
                        <span style="float:left">
                      <v-icon
                        x-large
                        class="py-1 px-3 noticeAlertIcon">
                        mdi-alert-octagon
                      </v-icon>
                      </span>
                        Do not continue.
                      </v-card-title>
                    </v-col>
                  </v-row>
                  <v-card-text>
                    If your current licence and service details do not match the information found in schedule A of your most recent funding agreement then please submit a change request.
                    <br><br>

                    Please submit a change request using the link below:
                    <br> <br>
                    <router-link :to="goToChangeDashboard()" > <span style="color:#3289ec; text-underline: black"><u>Go to Report a Change. This will bring you to a different page.</u></span></router-link>
                  </v-card-text>
                </v-card>
              </v-row>
          </v-card>
        </v-row>
        <v-row justify="space-around">
          <v-card class="cc-top-level-card justify-center" width="800">
            <v-card-text>
                Has your banking information changed?
            </v-card-text>
            <v-row>
              <v-col class="d-flex justify-center">
                <v-radio-group row v-model="bankingGroup" :disabled="isSomeChangeRequestActive()">
                  <v-radio
                    label="Yes"
                    value="true"/>
                  <v-radio
                    label="No"
                    value="false"/>
                </v-radio-group>
              </v-col>
            </v-row>
            <v-row>
              <v-card width="100%" class="mx-3" v-if="bankingGroup == 'true'">
                <v-row>
                  <v-col class="py-0">
                    <v-card-title class="py-1 noticeAlert">
                      <span style="float:left">
                    <v-icon
                      x-large
                      class="py-1 px-3 noticeAlertIcon">
                      mdi-alert-octagon
                    </v-icon>
                    </span>
                      Do not continue.
                    </v-card-title>
                  </v-col>
                </v-row>
                <v-card-text>
                  Once these changes have been processed, you may complete your {{renewalYearLabel}} Program Confirmation Form.<br><br>
                  Update your banking information:
                  <br><a href="https://www2.gov.bc.ca/assets/gov/british-columbians-our-governments/services-policies-for-government/internal-corporate-services/finance-forms/fin-312-direct-deposit-application.pdf">
                  https://www2.gov.bc.ca/assets/gov/british-columbians-our-governments/services-policies-for-government/internal-corporate-services/finance-forms/fin-312-direct-deposit-application.pdf</a>
                  <br><br>For any questions, call the program at 1-888-338-6622 (option 2)
                </v-card-text>
              </v-card>
            </v-row>
          </v-card>
        </v-row>

    </div>

      <NavButton :isNextDisplayed="true"
          :isNextDisabled="!(fundingGroup == 'true' && bankingGroup == 'false')" :isProcessing="processing"
          @previous="back" @next="next" @validateForm="validateForm"></NavButton>

    </v-container>
  </v-form>
</template>
<script>

import { mapActions, mapGetters, mapState } from 'vuex';
import { PATHS, pcfUrl } from '@/utils/constants';
import rules from '@/utils/rules';
import NavButton from '@/components/util/NavButton';
import {isAnyChangeRequestActive } from '@/utils/common';

export default {
  components: { NavButton },
  data() {
    return {
      rules,
      processing: false,
      isValidForm: true,
      fundingGroup: undefined,
      bankingGroup: undefined,
    };
  },
  computed: {
    ...mapGetters('app', ['renewalYearLabel', 'currentYearLabel']),
    ...mapGetters('application', ['latestProgramYearId']),
    ...mapState('application', ['applicationStatus', 'applicationType', 'ccofApplicationStatus', 'programYearId', ]),
    ...mapState('app', ['programYearList']),
    ...mapState('reportChanges', ['changeRequestStore',]),
    getNextProgramYear(){
      return this.programYearList?.list?.find(el => el.previousYearId == this.latestProgramYearId);
    },
  },
  async created(){
    this.processing = true;
    await this.getChangeRequestList();
    this.processing = false;
  },
  mounted() {
    //this.processing = false;
    //prevents a user from creating another RENEWAL, in case they hit the 'back' button on the browser and try again.
    if (this.applicationStatus == 'DRAFT'
      && this.applicationType == 'RENEW'
      && this.ccofApplicationStatus == 'NEW'
      && this.programYearId ==  this.getNextProgramYear?.programYearId) {
      this.$router.push(pcfUrl(PATHS.LICENSE_UPLOAD, this.getNextProgramYear.programYearId));

    }
  },
  methods: {
    ...mapActions('organization', ['renewApplication']),
    ...mapActions('reportChanges', ['getChangeRequestList']),
    async next() {
      this.processing = true;
      await this.renewApplication();
      this.$router.push(pcfUrl(PATHS.LICENSE_UPLOAD, this.getNextProgramYear.programYearId));
    },
    isSomeChangeRequestActive(){
      //Status of : "Submitted" "Action Required";
      if (!this.changeRequestStore){
        return true;
      }
      return isAnyChangeRequestActive(this.changeRequestStore);
    },
    validateForm() {
      this.$refs.form?.validate();
    },
    back() {
      this.$router.push(PATHS.ROOT.HOME);
    },
    goToChangeRequestHistory() {
      this.$router.push(PATHS.ROOT.CHANGE_LANDING + '#change-request-history');
    },
    goToChangeDashboard(){
      return PATHS.ROOT.CHANGE_LANDING;
    }


  },
};
</script>

<style scoped>

.blueBorder{
  border-top: 5px solid #003366 !important;
}


</style>
