<template>
  <v-form ref="form" v-model="isValidForm">
    <v-container>
      <v-row justify="center" class="pt-4">
        <span class="text-h4">Declaration - {{this.formattedProgramYear}} Program Confirmation Form</span>
      </v-row>
      <v-row justify="center" class="pt-4 text-h5" style="color:#003466;">
        {{this.userInfo.organizationName}}
      </v-row>
      <v-row v-if="!canSubmit" justify="center">
        <v-card class="py-0 px-3 mx-0 mt-10 rounded-lg col-11" elevation="4">
          <v-container class="pa-0">
            <v-row>
              <v-col class="pa-0">
                <v-card-title class="rounded-t-lg pt-3 pb-3 noticeAlert">
                  <v-icon
                    x-large
                    class="py-1 px-3 noticeAlertIcon">
                    mdi-alert-octagon
                  </v-icon>Incomplete Form</v-card-title>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="pb-0">
                <div>
                  <p>You will not be able to submit your application until it is complete.</p>
                  <p>Incomplete sections will have a circle without a checkmark on the navigational panel to the left of the screen.</p>
                </div>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-row>
      <v-row justify="center">
        <v-card class="py-0 px-3 mx-0 mt-10 rounded-lg col-11" elevation="4">
          <v-container class="pa-0">
            <v-row>
              <v-col class="pa-0">
                <v-card-title class="rounded-t-lg pt-3 pb-3 card-title">Declaration</v-card-title>
              </v-col>
            </v-row>
            <v-row v-if="isProcessing">
              <v-col>
                <v-skeleton-loader v-if="isProcessing" :loading="isProcessing" type="paragraph, text@3, paragraph, text@3, paragraph, paragraph, text@2, paragraph"></v-skeleton-loader>
              </v-col>
            </v-row>
            <v-row v-if="!isProcessing">
              <v-col class="pb-0">
                <div v-show="!this.isRenewal">
                  <p>I hereby confirm that the information I have provided in this application is complete and accurate. I certify that I have read and understand the following requirements:</p>
                  <ul style="padding-top:10px;">
                    <li>Each facility must be licensed under the Community Care and Assisted Living Act;</li>
                    <li>Each facility must be in compliance with the Community Care and Assisted Living Act and Child Care Licensing
                        Regulation;</li>
                    <li>Each facility must be willing to provide services to families who receive the Affordable Child Care Benefit;</li>
                    <li>The organization must be in good standing with BC Corporate Registry (if a nonprofit society or a registered company);
                        and</li>
                    <li>The applicant must be in good standing with the Ministry of Education and Child Care (that is, the Applicant must either
                        have no outstanding balances owing to the Ministry OR the Applicant must have established payment plans for
                        outstanding balances and these must be in good standing).</li>
                  </ul>
                  <p style="padding-top:10px;">Intentionally supplying information that is false or misleading with respect to a material fact in order to obtain a child care grant may
                    lead to action being taken under Section 9 of the Child Care BC Act. If you are convicted of an offence under section 9, a court may
                    order you imprisoned for up to six months, fine you not more than $2,000.00, or order you to pay the government all or part of any
                    amount received under the child care grant.
                  </p>
                </div>
                <div v-show="this.model.declarationAStatus == 1 && this.isRenewal">
                  <p>I do hereby certify that I am the authorized signing authority and that all of the information provided is true and complete to the best of my knowledge and belief.</p>
                  <p>I consent to the Ministry contacting other branches within the Ministry and other Province ministries to validate the accuracy of any information that I have provided.</p>
                </div>
                <div v-show="this.model.declarationBStatus == 1 && this.isRenewal">
                  <p>I do hereby certify that I am the authorized signing authority and that all of the information provided is true and complete to the best of my knowledge and belief.</p>
                  <p>I consent to the Ministry contacting other branches within the Ministry and other Province ministries to validate the accuracy of any information that I have provided.</p>
                  <p>By completing and submitting this Program Confirmation Form (the Form) electronically, I hereby confirm that I have carefully read this Form and the corresponding terms and conditions of the Child Care Operating Funding Agreement (the Funding Agreement) and that I agree to be bound by such terms and conditions. I further confirm that by clicking “I agree” below, I represent and warrant that:</p>

                  <ol type="a" style="padding-top:10px;">
                    <li>I am the authorized representative and signing authority of the Provider as named in the CCOF Agreement (the Provider);</li>
                    <li>I have authority to submit the Form on behalf of the Provider and that by clicking “I agree”, I do hereby bind the Provider to the terms and
                      conditions of the Funding Agreement if the Province accepts this Form and enrolls the Provider in any or all of the Child Care Operating Funding
                      Program, the CCFRI, or the ECE Wage Enhancement;</li>
                    <li>All information provided in the Form or otherwise in support of the Provider to receive funding under the Funding Agreement is true and
                      complete to the best of my knowledge and belief. I understand and acknowledge that providing false or misleading information either on the
                      Form or otherwise to the Province to obtain any funding under the Funding Agreement or otherwise failing to comply with the Funding
                      Agreement could result in certain penalties or repayment obligations, or both, under any or all of the Child Care BC Act, any successor
                      legislation, or the Funding Agreement;</li>
                    <li>If I have applied for and been approved by the Province to enroll in the ECE Wage Enhancement, the Provider has taken all actions required
                      under any collective agreement to which it is a party to ensure it is:</li>
                  </ol>
                  <v-row>
                    <v-col cols="1"></v-col>
                    <v-col cols="1">i.</v-col>
                    <v-col cols="10">permitted to apply for the ECE Wage Enhancement for any of its unionized Early Childhood Educators (ECEs); and</v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="1"></v-col>
                    <v-col cols="1">ii.</v-col>
                    <v-col cols="10">able to comply with its ECE Wage Enhancement related obligations under the Funding Agreement.</v-col>
                  </v-row>
                  <p style="padding-top:10px;">I understand and acknowledge that until such time as the Province confirms approval or temporary approval of enrolment, in writing, in the CCFRI or the ECE Wage Enhancement, the Provider is not formally enrolled in these initiatives. The Province is not responsible for any pre-payments the Provider may make in anticipation of enrolment in either of these initiatives and any pre-payments made are at the Provider’s own risk.</p>
                </div>
              </v-col>
            </v-row>
             <v-row v-if="!isProcessing">
              <v-col cols="12" class="pl-6 pt-0 pb-0">
                 <v-checkbox class="pt-0" v-if="!isRenewal" v-model="model.agreeConsentCertify" :disabled="isReadOnly" :value="1" label="I, the applicant, do hereby certify that all the information provided is true and complete to the best of my knowledge and belief. By clicking this check-box, I indicate that I agree to the foregoing terms and conditions."></v-checkbox>
                <v-checkbox class="pt-0" v-else-if="isRenewal" v-model="model.agreeConsentCertify" :disabled="isReadOnly" :value="1" label="I agree, consent, and certify"></v-checkbox>
              </v-col>
            </v-row>
            <v-row v-if="!isProcessing">
              <v-col class="pt-0">
                <v-text-field
                  v-if="!isProcessing"
                  outlined
                  v-model="model.orgContactName"
                  :disabled="isReadOnly"
                  label="Organization Contact Name/Digital signature."
                />
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-row>
      <v-row justify="space-around" class="mt-10">
        <v-btn color="info" :loading="isProcessing" outlined required x-large @click="previous()">Back</v-btn>
        <v-btn color="primary" :loading="isProcessing" outlined x-large @click="submit()" :disabled="!isPageComplete() || isReadOnly">Submit</v-btn>
      </v-row>
      <v-dialog
        v-model="dialog"
        persistent
        max-width="525px">
        <v-card>
          <v-container class="pt-0">
            <v-row>
              <v-col cols="7" class="py-0 pl-0" style="background-color:#234075;">
                <v-card-title class="white--text">Submission Complete</v-card-title>
              </v-col>
              <v-col cols="5" class="d-flex justify-end" style="background-color:#234075;">
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" style="background-color:#FFC72C;padding:2px;"></v-col>
            </v-row>
            <v-row>
              <v-col cols="12" style="text-align: center;">
                <p class="pt-4">Your submission has been received. Please refer to your dashboard for updates on the progress of your application. We will contact you if more information is required.</p>
                <p><router-link :to="landingPage">Return to your dashboard</router-link></p>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-dialog>
    </v-container>
  </v-form>
</template>
<script>

import { PATHS } from '@/utils/constants';
import { mapGetters, mapActions, mapState } from 'vuex';
import alertMixin from '@/mixins/alertMixin';

let model = {};

export default {
  mixins: [alertMixin],
  computed: {
    ...mapGetters('auth', ['userInfo', 'isMinistryUser']),
    ...mapState('app', ['programYearList', 'navBarList']),
    ...mapState('navBar', ['canSubmit']),
    ...mapState('application', ['formattedProgramYear', 'isRenewal', 'programYearId', 'unlockBaseFunding',
      'unlockDeclaration', 'unlockEcewe', 'unlockLicenseUpload', 'unlockSupportingDocuments', 'applicationStatus']),
    isReadOnly() {
      if (this.isMinistryUser) {
        return true;
      } if (!this.canSubmit) {
        return true;
      } else if (this.unlockDeclaration) {
        return false;
      } else if (this.applicationStatus === 'SUBMITTED') {
        return true;
      }
      return false;
    }
  },
  data() {
    return {
      model,
      isValidForm: false,
      isLoading: false,
      isProcessing: false,
      dialog: false,
      landingPage: PATHS.home,
    };
  },
  methods: {
    ...mapActions('summaryDeclaration', ['loadDeclaration', 'updateDeclaration']),
    ...mapActions('navBar', ['getPreviousPath']),
    isPageComplete(){
      if (this.model.agreeConsentCertify && this.model.orgContactName) {
        this.isValidForm = true;
      } else {
        this.isValidForm = false;
      }
      return this.isValidForm;
    },
    async loadData() {
      this.isLoading = true;
      try {
        await this.loadDeclaration();
      } catch (error) {
        console.log('Error loading application Declaration.', error);
        this.setFailureAlert('Error loading application Declaration.');
      } finally {
        this.isLoading = false;
      }
    },
    async submit() {
      this.isProcessing = true;
      try {
        this.$store.commit('summaryDeclaration/model', this.model);
        await this.updateDeclaration(this.createRelockPayload());
        this.dialog = true;
      } catch (error) {
        this.setFailureAlert('An error occurred while SUBMITTING application. Please try again later.'+error);
      } finally {
        this.isProcessing = false;
      }
    },
    createRelockPayload() {
      let applicationRelockPayload = this.createRelockPayloadForApplication();
      let ccrfiRelockPayload = this.createRelockPayloadForCCFRI();
      if ((Object.keys(ccrfiRelockPayload).length > 0)) {
        applicationRelockPayload['facilities'] = ccrfiRelockPayload;
      }
      return applicationRelockPayload;
    },
    createRelockPayloadForApplication() {
      let applicationRelockPayload = {
        unlockBaseFunding: this.unlockBaseFunding,
        unlockDeclaration: this.unlockDeclaration,
        unlockEcewe: this.unlockEcewe,
        unlockLicenseUpload: this.unlockLicenseUpload,
        unlockSupportingDocuments: this.unlockSupportingDocuments
      };
      // Create payload with only unlock propteries set to 1.
      // eslint-disable-next-line no-unused-vars
      applicationRelockPayload = Object.fromEntries(Object.entries(applicationRelockPayload).filter(([_, v]) => v == 1));
      // Update payload unlock properties from 1 to 0.
      Object.keys(applicationRelockPayload).forEach(key => {
        applicationRelockPayload[key] = '0';
      });
      return applicationRelockPayload;
    },
    createRelockPayloadForCCFRI() {
      let ccrfiRelockPayload = new Array(0);
      for (const facility of this.navBarList) {
        let applicationIdPayload = {ccfriApplicationId: facility.ccfriApplicationId};
        let unlockPayload = {unlockCcfri: facility.unlockCcfri, unlockNmf: facility.unlockNmf, unlockRfi: facility.unlockRfi};
        // Create payload with only unlock propteries set to 1.
        // eslint-disable-next-line no-unused-vars
        unlockPayload = Object.fromEntries(Object.entries(unlockPayload).filter(([_, v]) => v == 1));
        // Update payload unlock properties from 1 to 0.
        Object.keys(unlockPayload).forEach(key => {
          unlockPayload[key] = '0';
        });
        if ((Object.keys(unlockPayload).length > 0)) {
          ccrfiRelockPayload.push({...applicationIdPayload, ...unlockPayload});
        }
      }
      return ccrfiRelockPayload;
    },
    async previous() {
      let path = await this.getPreviousPath();
      this.$router.push(path);
    },
  },
  async mounted() {
    await this.loadData();
    this.model = this.$store.state.summaryDeclaration.model ?? model;
    if (this.isRenewal) {
      // Establish the server time
      const serverTime = new Date(this.userInfo.serverTime);

      // Determine declaration b start date
      let declarationBStart;
      this.programYearList.list.find(item => {
        if (item.programYearId == this.programYearId) {
          declarationBStart = new Date(item.declarationbStart);
        }
      });
      // Determine:
      //   - which user declaration text version (status a or b) will display
      //   - which declaration status (a or b) will be saved on submit.
      // saved as part of submission.
      if (serverTime < declarationBStart) {
        this.model.declarationAStatus = 1;
      } else {
        this.model.declarationBStatus = 1;
      }
    }
  },
};
</script>

<style>
li {
padding-bottom: 12px;
}
.card-title {
color:#003466;
font-size:20px;
font-weight:bold;
background-color:#E5E4E4;
}

</style>
