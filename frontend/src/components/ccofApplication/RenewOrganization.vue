<template>
  <v-form ref="form" v-model="isValidForm">
    <v-container>
      <v-row justify="center">
        <div
          class="pa-10 text-h5"
          v-text="`Child Care Operating Funding Program - ${futureYearLabel} Program Confirmation Form`" />
      </v-row >
      <v-row justify="space-around">
        <v-card class="cc-top-level-card justify-center" width="800">
            <v-card-text>
                Do your current license and service details match the information found in
                Schedule A of your most recent Funding Agreement?
            </v-card-text>
            <v-row>
              <v-col class="d-flex justify-center">
                <v-radio-group row v-model="fundingGroup" >
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
                  Once these changes have been processed, you may complete your {{futureYearLabel}} Program Confirmation Form.<br><br>
                  Submit the Change Notification Form:<br>
                  <a href="https://www2.gov.bc.ca/assets/gov/family-and-social-supports/child-care/cf1345_cc_operating_program_funding_agreement_change_notification.pdf">
                  https://www2.gov.bc.ca/assets/gov/family-and-social-supports/child-care/cf1345_cc_operating_program_funding_agreement_change_notification.pdf
                  </a><br><br>
                  available on the program website:<br>
                  <a href="https://www2.gov.bc.ca/gov/content?id=F226747EC2954742B2B09BA90824D8F4">
                  https://www2.gov.bc.ca/gov/content?id=F226747EC2954742B2B09BA90824D8F4
                  </a>
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
              <v-radio-group row v-model="bankingGroup" >
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
                Once these changes have been processed, you may complete your {{futureYearLabel}} Program Confirmation Form.<br><br>
                Update your banking information:
                <br><a href="https://www2.gov.bc.ca/assets/gov/british-columbians-our-governments/services-policies-for-government/internal-corporate-services/finance-forms/fin-312-direct-deposit-application.pdf">
                https://www2.gov.bc.ca/assets/gov/british-columbians-our-governments/services-policies-for-government/internal-corporate-services/finance-forms/fin-312-direct-deposit-application.pdf</a>
                <br><br>For any questions, call the program at 1-888-338-6622 (option 2)
              </v-card-text>
            </v-card>
          </v-row>
        </v-card>
      </v-row>

      <v-row justify="space-around">
        <v-btn color="info" outlined x-large @click="back()">Back</v-btn>
        <v-btn color="secondary" outlined x-large @click="next()" :loading="processing" :disabled="!(fundingGroup == 'true' && bankingGroup == 'false')">Next</v-btn>
      </v-row>
    </v-container>
  </v-form>
</template>
<script>

import { mapActions, mapGetters, mapState } from 'vuex';
import { PATHS } from '@/utils/constants';
import rules from '@/utils/rules';

export default {
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
    ...mapGetters('app', ['futureYearLabel']),
    ...mapState('application', ['applicationStatus', 'applicationType', 'ccofApplicationStatus', 'programYearId']),
    ...mapState('app', ['programYearList']),
  },
  mounted() {
    this.processing = false;
    //prevents a user from creating another RENEWAL, in case they hit the 'back' button on the browser and try again.
    if (this.applicationStatus == 'DRAFT'
      && this.applicationType == 'RENEW'
      && this.ccofApplicationStatus == 'NEW'
      && this.programYearId == this.programYearList.future?.programYearId) {
      this.$router.push(PATHS.group.licenseUpload);  
    }
  },
  methods: {
    ...mapActions('organization', ['renewApplication']),
    async next() {
      this.processing = true;
      await this.renewApplication();
      this.$router.push(PATHS.group.licenseUpload);
    },
    back() {
      this.$router.push(PATHS.home);
    },
    
  },
};
</script>

<style scoped>

.blueBorder{
  border-top: 5px solid #003366 !important;
}

  
</style>
