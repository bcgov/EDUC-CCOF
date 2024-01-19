<template>
  <v-container fluid>
    <v-form ref="form" v-model="isValidForm">
      <v-row class="d-flex justify-center">
        <span class="text-h5">Child Care Operating Funding Program{{ pageTitle }}</span>
      </v-row>
      <v-row class="d-flex justify-center">
        <h2>Summary and Declaration</h2>
      </v-row>
      <v-row class="d-flex justify-center text-h5" style="color:#003466;">
        {{ this.userInfo.organizationName }}
      </v-row>

      <v-row v-if="!this.isSummaryComplete && !this.isProcessing" class="justify-center">
        <v-card class="py-0 px-3 mx-0 mt-10 rounded-lg col-11" elevation="4">
          <v-container class="pa-0 col-12">
            <v-row>
              <v-col class="pa-0">
                <v-card-title class="rounded-t-lg pt-3 pb-3 noticeAlert">
                  <v-icon
                    x-large
                    class="py-1 px-3 noticeAlertIcon">
                    mdi-alert-octagon
                  </v-icon>
                  Incomplete Form
                </v-card-title>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="pb-0 pr-3 justify-center">
                <div >
                  <p>You will not be able to submit your application until it is complete.</p>
                  <p>Incomplete sections are marked with a red exclamation point.</p>
                </div>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-row>

      <v-row class="d-flex justify-center">
          <v-card width="80%" class="mx-3 my-10 justify-center" v-if="isSomeApplicationUnlocked">
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
                You have an unlocked PCF application still in progress.
                </v-card-title>
              </v-col>
            </v-row>
              <br>
              <p class="ml-4">You will be unable to submit a change request until the Program Confirmation Form is updated.</p><br>
              <br>

              <!-- <v-btn dark class="blueButton mb-10" @click="goToChangeRequestHistory()" :loading="processing">View My Changes</v-btn> -->

          </v-card>
        </v-row>
      <div>
        <v-row class="d-flex justify-center">
          <v-card class="py-0 px-3 mx-0 mt-10 rounded-lg col-11" elevation="4">
            <v-row class="d-flex justify-start">
              <v-col class="pa-0">
                <v-card-title class="rounded-t-lg pt-3 pb-3 card-title" style="color:#003466;">Summary</v-card-title>
              </v-col>
            </v-row>
            <v-expansion-panels ref="v-expansion-panels" focusable multiple accordion v-model="expand">
              <v-row v-if="isMainLoading">
                <v-col>
                  <v-skeleton-loader
                    v-if="isMainLoading" :loading="isMainLoading"
                    type="paragraph, text@3, paragraph, text@3, paragraph, paragraph, text@2, paragraph">
                  </v-skeleton-loader>
                </v-col>
              </v-row>
              <v-row v-else no-gutters class="d-flex flex-column mb-2">

                <!-- Change Notification Form Summary -->
                <v-expansion-panel variant="accordion" v-if="hasChangeRequestType('PDF_CHANGE')" class="mb-8 mt-8">
                  <ChangeNotificationFormSummary
                    @isSummaryValid="isFormComplete"
                    :changeNotificationFormDocuments="summaryModel?.changeNotificationFormDocuments">
                  </ChangeNotificationFormSummary>
                </v-expansion-panel>

                <!-- MTFI Summary -->
                <v-row no-gutters class="d-flex flex-column mb-2 mt-10" v-if="hasChangeRequestType('MTFI')">
                  <div v-for=" (facility, index) in facilities" :key="facility?.facilityId" class="mt-0 py-0">
                    <v-skeleton-loader
                      v-if="isSummaryLoading[index]" :loading="isSummaryLoading[index]"
                      type="paragraph, text@3, paragraph, text@3, paragraph">
                    </v-skeleton-loader>
                    <div v-else>
                      <v-expansion-panel variant="accordion">
                        <v-row no-gutters class="d-flex pl-6 pt-5">
                          <v-col class="col-6 col-lg-4">
                            <p class="summary-label">Facility Name</p>
                            <p label="--" class="summary-value">{{ facility.facilityName ? facility.facilityName : '--'  }}</p>
                          </v-col>
                          <v-col class="col-6 col-lg-3">
                            <p class="summary-label">Facility ID</p>
                            <p label="--" class="summary-value">{{ facility.facilityAccountNumber ? facility.facilityAccountNumber : '--' }}</p>
                          </v-col>
                          <v-col class="col-6 col-lg-3">
                            <p class="summary-label">Licence Number</p>
                            <p label="--" class="summary-value">{{ facility.licenseNumber ? facility.licenseNumber : '--' }}</p>
                          </v-col>
                        </v-row>
                      </v-expansion-panel>
                      <v-expansion-panel variant="accordion">
                        <MTFISummary v-if="hasChangeRequestType('MTFI') && !isSummaryLoading[index]"
                          @isSummaryValid="isFormComplete"
                          :oldCcfri="facility?.oldCcfri"
                          :newCcfri="facility?.newCcfri"
                          :facilityId="facility.facilityId">
                        </MTFISummary>
                      </v-expansion-panel>
                      <v-expansion-panel variant="accordion" v-if="facility?.hasRfi && !isSummaryLoading[index]">
                        <RFISummary
                          @isSummaryValid="isFormComplete"
                          :rfiApp="facility?.rfiApp"
                          :ccfriId="facility?.ccfriApplicationId"
                          :facilityId="facility.facilityId">
                        </RFISummary>
                      </v-expansion-panel>
                    </div>
                  </div>
                </v-row>

              </v-row>
            </v-expansion-panels>
          </v-card>
        </v-row>
      </div>


      <!---Declaration Start--->
      <v-row justify="center">

        <v-row v-if="fundingAgreementNumber  && languageYearLabel == programYearTypes.HISTORICAL" justify="center" class="pt-4 text-h5" style="color:#003466;">
          Funding Agreement Number: {{ fundingAgreementNumber }}
        </v-row>

        <v-card class="py-0 px-3 mx-0 mt-10 rounded-lg col-11" elevation="4">

            <v-row>
              <v-col class="pa-0">
                <v-card-title class="rounded-t-lg pt-3 pb-3 card-title">Declaration</v-card-title>
              </v-col>
            </v-row>
            <v-row v-if="isProcessing">
              <v-col>
                <v-skeleton-loader v-if="isProcessing" :loading="isProcessing"
                                   type="paragraph, text@3, paragraph, text@3, paragraph, paragraph, text@2, paragraph"></v-skeleton-loader>
              </v-col>
            </v-row>
            <v-row v-if="!isProcessing">
              <v-col class="pb-0">
                <div v-show="!this.isRenewal && !this.organizationAccountNumber">
                  <p>I hereby confirm that the information I have provided in this application is complete and accurate.
                    I certify that I have read and understand the following requirements:</p>
                  <ul style="padding-top:10px;">
                    <li>Each facility must be licensed under the Community Care and Assisted Living Act;</li>
                    <li>Each facility must be in compliance with the Community Care and Assisted Living Act and Child
                      Care Licensing
                      Regulation;
                    </li>
                    <li>Each facility must be willing to provide services to families who receive the Affordable Child
                      Care Benefit;
                    </li>
                    <li>The organization must be in good standing with BC Corporate Registry (if a nonprofit society or
                      a registered company);
                      and
                    </li>
                    <li>The applicant must be in good standing with the Ministry of Education and Child Care (that is,
                      the Applicant must either
                      have no outstanding balances owing to the Ministry OR the Applicant must have established payment
                      plans for
                      outstanding balances and these must be in good standing).
                    </li>
                  </ul>
                  <p style="padding-top:10px;">Intentionally supplying information that is false or misleading with
                    respect to a material fact in order to obtain a child care grant may
                    lead to action being taken under Section 9 of the Child Care BC Act. If you are convicted of an
                    offence under section 9, a court may
                    order you imprisoned for up to six months, fine you not more than $2,000.00, or order you to pay the
                    government all or part of any
                    amount received under the child care grant.
                  </p>
                </div>

                 <!-- Declaration A -->
                <div v-show="!isDeclarationBDisplayed">
                  <p>I do hereby certify that I am the <strong>authorized signing authority</strong> and that all of the
                    information provided is true and complete to the best of my knowledge and belief.</p>
                  <p>I consent to the Ministry contacting other branches within the Ministry and other Province
                    ministries to validate the accuracy of any information that I have provided.</p>
                </div>
                <!-- Declaration B -->
                <div v-show="isDeclarationBDisplayed">
                  <p>I do hereby certify that I am the <strong>authorized signing authority</strong> and that all of the
                    information provided is true and complete to the best of my knowledge and belief.</p>
                  <p>I consent to the Ministry contacting other branches within the Ministry and other Province
                    ministries to validate the accuracy of any information that I have provided.</p>
                  <p>By completing and submitting this Program Confirmation Form (the Form) electronically, I hereby
                    confirm that I have carefully read this Form and the corresponding terms and conditions of the Child
                    Care Operating Funding Agreement (the Funding Agreement) and that I agree to be bound by such terms
                    and conditions. I further confirm that by clicking “I agree” below, I represent and warrant
                    that:</p>

                  <ol type="a" style="padding-top:10px;">
                    <li>I am the authorized representative and signing authority of the Provider as named in the CCOF
                      Agreement (the Provider);
                    </li>
                    <li>I have authority to submit the Form on behalf of the Provider and that by clicking “I agree”, I
                      do hereby bind the Provider to the terms and
                      conditions of the Funding Agreement if the Province accepts this Form and enrolls the Provider in
                      any or all of the Child Care Operating Funding
                      Program, the CCFRI, or the ECE Wage Enhancement;
                    </li>
                    <li>All information provided in the Form or otherwise in support of the Provider to receive funding
                      under the Funding Agreement is true and
                      complete to the best of my knowledge and belief. I understand and acknowledge that providing false
                      or misleading information either on the
                      Form or otherwise to the Province to obtain any funding under the Funding Agreement or otherwise
                      failing to comply with the Funding
                      Agreement could result in certain penalties or repayment obligations, or both, under any or all of
                      the Child Care BC Act, any successor
                      legislation, or the Funding Agreement;
                    </li>
                    <li>If I have applied for and been approved by the Province to enroll in the ECE Wage Enhancement,
                      the Provider has taken all actions required
                      under any collective agreement to which it is a party to ensure it is:
                    </li>
                  </ol>
                  <v-row>
                    <v-col cols="1"></v-col>
                    <v-col cols="1">i.</v-col>
                    <v-col cols="10">permitted to apply for the ECE Wage Enhancement for any of its unionized Early
                      Childhood Educators (ECEs); and
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="1"></v-col>
                    <v-col cols="1">ii.</v-col>
                    <v-col cols="10">able to comply with its ECE Wage Enhancement related obligations under the Funding
                      Agreement.
                    </v-col>
                  </v-row>
                  <p style="padding-top:10px;">I understand and acknowledge that until such time as the Province
                    confirms approval or temporary approval of enrolment, in writing, in the CCFRI or the ECE Wage
                    Enhancement, the Provider is not formally enrolled in these initiatives. The Province is not
                    responsible for any pre-payments the Provider may make in anticipation of enrolment in either of
                    these initiatives and any pre-payments made are at the Provider’s own risk.</p>
                </div>
              </v-col>
            </v-row>
            <v-row v-if="!isProcessing">
              <v-col cols="12" class="pl-6 pt-0 pb-0">
                <v-checkbox class="pt-0" v-if="!isRenewal" v-model="model.agreeConsentCertify" :disabled="isReadOnly"
                            :value="1"
                            label="I, the applicant, do hereby certify that all the information provided is true and complete to the best of my knowledge and belief. By clicking this check-box, I indicate that I agree to the foregoing terms and conditions."></v-checkbox>
                <v-checkbox class="pt-0" v-else-if="isRenewal" v-model="model.agreeConsentCertify"
                            :disabled="isReadOnly" :value="1" label="I agree, consent, and certify"></v-checkbox>
              </v-col>
            </v-row>
            <v-row v-if="!isProcessing">
              <v-col class="pt-0">
                <v-text-field
                  id="signatureTextField"
                  v-if="!isProcessing"
                  outlined
                  v-model="model.orgContactName"
                  :disabled="isReadOnly"
                  label="Your Organization's Authorized Signing Authority"
                />
              </v-col>
            </v-row>

        </v-card>
      </v-row>
      <NavButton :isSubmitDisplayed="true" class="mt-10"
        :isSubmitDisabled="!isPageComplete() || isReadOnly || isSomeApplicationUnlocked" :isProcessing="isProcessing"
        @previous="previous" @submit="submit" v-if="!printableVersion"></NavButton>
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
                <p class="pt-4">Your submission has been received. Please refer to your dashboard for updates on the
                  progress of your application. We will contact you if more information is required.</p>
                <p>
                  <router-link :to="landingPage">Return to your dashboard</router-link>
                </p>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-dialog>
    </v-form>
  </v-container>
</template>
<script>

import { PATHS, CHANGE_REQUEST_TYPES, CHANGE_TYPES, changeUrlGuid, PROGRAM_YEAR_LANGUAGE_TYPES } from '@/utils/constants';
import { mapGetters, mapActions, mapState } from 'vuex';
import alertMixin from '@/mixins/alertMixin';
import NavButton from '@/components/util/NavButton';
import MTFISummary from '@/components/summary/changeRequest/MTFISummary';
import RFISummary from '@/components/summary/group/RFISummary';
import ChangeNotificationFormSummary from '@/components/summary/changeRequest/ChangeNotificationFormSummary';
import { isAnyApplicationUnlocked } from '@/utils/common';

export default {
  components: {
    MTFISummary,
    ChangeNotificationFormSummary,
    RFISummary,
    NavButton
  },
  mixins: [alertMixin],
  data() {
    return {
      isValidForm: false,
      isProcessing: false,
      dialog: false,
      landingPage: PATHS.ROOT.HOME,
      summaryKey: 1,
      invalidSummaryForms: [],
      payload: {},
      printableVersion: false,
      expand: [],
    };
  },
  async beforeMount() {
    this.$store.commit('summaryDeclaration/isMainLoading', true);
    await this.loadChangeRequestSummaryDeclaration(this.$route.params?.changeRecGuid);
    // Determine:
    //   - which user declaration text version (status a or b) will display
    //   - which declaration status (a or b) will be saved on submit.
    // saved as part of submission.
    if (this.isDeclarationBDisplayed) {
      this.model.declarationBStatus = 1;
      this.model.declarationAStatus = undefined;
    } else {
      this.model.declarationAStatus = 1;
      this.model.declarationBStatus = undefined;
    }
  },
  computed: {
    ...mapGetters('auth', ['userInfo', 'isMinistryUser']),
    ...mapGetters('navBar', ['previousPath']),
    ...mapGetters('reportChanges', ['getChangeNotificationActionId']),
    ...mapState('navBar', ['changeType']),
    ...mapState('organization', ['organizationAccountNumber', 'fundingAgreementNumber']),
    ...mapState('summaryDeclaration', ['isSummaryLoading', 'isMainLoading', 'isLoadingComplete']),
    ...mapState('summaryDeclaration', ['summaryModel', 'model']),
    ...mapState('application', ['isRenewal', 'applicationMap']),
    ...mapGetters('app', ['getFundingUrl', 'getLanguageYearLabel']),
    languageYearLabel(){
      return this.getLanguageYearLabel;
    },
    programYearTypes(){
      return PROGRAM_YEAR_LANGUAGE_TYPES;
    },
    isReadOnly() {
      if (this.isMinistryUser || !this.isLoadingComplete) {
        return true;
      } else if (this.model?.unlockDeclaration) {
        return false;
      } else if (this.model?.externalStatus != 'INCOMPLETE') {
        return true;
      }
      return false;
    },
    isSomeApplicationUnlocked(){
      const applicationList = Array.from(this.applicationMap?.values());
      console.log(isAnyApplicationUnlocked(applicationList));
      return isAnyApplicationUnlocked(applicationList);
    },
    numberOfPanelsToExpand() {
      return this.$refs["v-expansion-panels"]?.$children.length;
    },
    isSummaryComplete() {
      if (this.hasChangeRequestType('MTFI') && this.summaryModel?.mtfiFacilities?.length === 0)
        return false;
      return (this.invalidSummaryForms.length < 1);
    },
    facilities() {
      if (this.summaryModel?.mtfiFacilities) {
        return this.summaryModel?.mtfiFacilities;
      }
      return null;
    },
    relockPayload() {
      let relockPayload = {
        unlockDeclaration: this.model.unlockDeclaration,
      };
      return relockPayload;
    },
    isDeclarationBDisplayed() {
      return (this.model.enabledDeclarationB || this.hasChangeRequestType('MTFI'));
    },
    pageTitle() {
      let changeRequestTypes = this.summaryModel?.changeRequestTypes;
      if (changeRequestTypes?.length === 1) {
        return changeRequestTypes?.includes(CHANGE_REQUEST_TYPES.PARENT_FEE_CHANGE) ? ' - Request a Parent Fee Increase' : '';
      }
      return '';
    }
  },
  methods: {
    ...mapActions('summaryDeclaration', ['updateDeclaration', 'loadChangeRequestSummaryDeclaration']),
    expandAllPanels() {
      for (let i = 0; i < this.numberOfPanelsToExpand; i ++) {
        this.expand.push(i);
      }
    },
    isPageComplete() {
      if (this.model.agreeConsentCertify && this.model.orgContactName && this.isSummaryComplete) {
        this.isValidForm = true;
      } else {
        this.isValidForm = false;
      }
      return this.isValidForm;
    },
    async submit() {
      this.isProcessing = true;
      try {
        this.$store.commit('summaryDeclaration/model', this.model);
        // await this.updateDeclaration({changeRequestId: this.$route.params?.changeRecGuid, reLockPayload: this.relockPayload});
        await this.updateDeclaration({changeRequestId: this.$route.params?.changeRecGuid, reLockPayload: []});
        this.dialog = true;
      } catch (error) {
        this.setFailureAlert('An error occurred while SUBMITTING change request. Please try again later.' + error);
      } finally {
        this.isProcessing = false;
      }
    },
    previous() {
      if (this.changeType === CHANGE_TYPES.CHANGE_NOTIFICATION) {
        this.$router.push(changeUrlGuid(PATHS.CHANGE_NOTIFICATION_FORM, this.$route.params?.changeRecGuid, this.getChangeNotificationActionId, CHANGE_TYPES.CHANGE_NOTIFICATION));
      }
      this.$router.push(this.previousPath);
    },
    async isFormComplete(formObj, isComplete) {
      if (!isComplete) {
        this.invalidSummaryForms.push(formObj);
      }
      if (this.printableVersion) {
        this.expandAllPanels();
      }
      // this.updateNavBarStatus(formObj, isComplete);
    },
    hasChangeRequestType(changeType) {
      switch (changeType) {
      case 'MTFI':
        return this.summaryModel?.changeRequestTypes?.includes(CHANGE_REQUEST_TYPES.PARENT_FEE_CHANGE);
      case 'PDF_CHANGE':
        return this.summaryModel?.changeRequestTypes?.includes(CHANGE_REQUEST_TYPES.PDF_CHANGE);
      default:
        return false;
      }
    }
  },
  async mounted(){
      if (this.$route.path.endsWith('printable')) {
        this.printableVersion = true;
      }
    },
};
</script>

<style scoped>
li {
  padding-bottom: 12px;
}

*
.card-title {
  color: #003466;
  font-size: 20px;
  font-weight: bold;
  background-color: #E5E4E4;
}

.summary-label {
  color: grey;
  font-size: small;
}

.summary-value {
  font-size: medium;
  color: black;
}
</style>
