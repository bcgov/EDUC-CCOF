<template>
  <v-container fluid>
    <v-form id="printable-form" ref="form">
      <div class="text-center">
        <div class="text-h4">
          Child Care Operating Funding Program - {{ formattedProgramYear }} Program Confirmation Form
        </div>
        <h2>Summary and Declaration</h2>
        <div class="text-h5" style="color: #003466">{{ userInfo.organizationName }}</div>
      </div>
      <v-row>
        <!-- Do not allow PCF to be submitted if CR is active-->
        <v-card v-if="isSomeChangeRequestActive() && !isChangeRequest" width="100%" class="mx-3 my-10">
          <v-row>
            <v-col class="py-0">
              <v-card-title class="py-1 noticeAlert">
                <span style="float: left">
                  <v-icon size="x-large" class="py-1 px-3 noticeAlertIcon"> mdi-alert-octagon </v-icon>
                </span>
                You have a change request for the {{ getChangeRequestYear }} funding term still in progress.
              </v-card-title>
            </v-col>
          </v-row>
          <v-card-text>
            The {{ formattedProgramYear }} Program Confirmation Form cannot be submitted until the change is
            complete.<br /><br />
            <br />

            <v-btn theme="dark" class="blueButton mb-10" @click="goToChangeRequestHistory()"> View My Changes </v-btn>
          </v-card-text>
        </v-card>
      </v-row>

      <!-- Do not allow CR New Fac to be submitted if PCF is unlocked-->
      <v-row class="" justify="center">
        <v-card v-if="isSomeApplicationUnlocked && isChangeRequest" class="py-0 px-3 mx-0 mt-10 rounded-lg col-11">
          <v-container class="pa-0 col-12">
            <v-row>
              <v-col class="pa-0">
                <v-card-title class="rounded-t-lg pt-3 pb-3 noticeAlert">
                  <span style="float: left">
                    <v-icon size="x-large" class="py-1 px-3 noticeAlertIcon"> mdi-alert-octagon </v-icon>
                  </span>
                  You have an unlocked PCF application still in progress.
                </v-card-title>
              </v-col>
            </v-row>
          </v-container>

          <br />
          <p>You will be unable to submit a change request until the Program Confirmation Form is updated.</p>
          <br />
          <br />
        </v-card>
      </v-row>

      <div v-if="!isSomeChangeRequestActive()" class="text-center text-h5" style="color: #003466">
        To submit your application, review this summary of your information and scroll down to sign the declaration.
      </div>
      <v-card v-if="!isSummaryComplete && !isProcessing" elevation="4" class="mx-8 mt-8">
        <v-card-title class="rounded-t-lg pt-3 pb-3 noticeAlert">
          <v-icon size="x-large" class="py-1 px-3 noticeAlertIcon"> mdi-alert-octagon </v-icon>
          Incomplete Form
        </v-card-title>
        <div class="pa-4">
          <p>You will not be able to submit your application until it is complete.</p>
          <p>Incomplete sections are marked with a red exclamation point.</p>
        </div>
      </v-card>
      <div>
        <v-card class="py-0 px-3 mx-12 mt-4 rounded-lg" elevation="4">
          <v-row class="d-flex justify-start">
            <v-col class="pa-0">
              <v-card-title class="rounded-t-lg pt-3 pb-3 card-title" style="color: #003466"> Summary </v-card-title>
            </v-col>
          </v-row>
          <v-expansion-panels v-model="expand['global']" multiple variant="accordion">
            <v-row v-if="isSummaryLoading">
              <v-col>
                <v-skeleton-loader
                  :loading="isSummaryLoading"
                  type="paragraph, text@3, paragraph, text@3, paragraph, paragraph, text@2, paragraph"
                />
              </v-col>
            </v-row>
            <v-row v-else no-gutters class="d-flex flex-column pb-2 pt-2">
              <div v-if="!isRenewal">
                <v-expansion-panel variant="accordion" value="organization-summary">
                  <OrganizationSummary
                    :program-year="formattedProgramYear"
                    :summary-model="summaryModel"
                    :is-processing="isProcessing"
                    :program-year-id="summaryModel?.application?.programYearId"
                    @is-summary-valid="isFormComplete"
                  />
                </v-expansion-panel>
              </div>

              <div v-for="facility in facilities" :key="facility?.facilityId" class="special">
                <v-expansion-panels v-model="expand[facility.facilityId]" multiple>
                  <v-expansion-panel
                    v-if="facility?.facilityInfo"
                    :key="`${facility.facilityId}-facility-information`"
                    :value="`${facility.facilityId}-facility-information`"
                    variant="accordion"
                  >
                    <FacilityInformationSummary
                      :facility-info="facility?.facilityInfo"
                      :funding="facility?.funding"
                      :facility-id="facility.facilityId"
                      :ccfri-status="facility?.ccfri?.ccfriOptInStatus"
                      :ecewe-status="facility?.ecewe?.optInOrOut"
                      :license-categories="facility?.licenseCategories"
                      :provider-type="summaryModel?.application?.organizationProviderType"
                      :change-rec-guid="facility?.changeRequestId"
                      :program-year-id="summaryModel?.application?.programYearId"
                      @is-summary-valid="isFormComplete"
                    />
                  </v-expansion-panel>
                  <v-expansion-panel
                    :key="`${facility.facilityId}-ccof-summary`"
                    :value="`${facility.facilityId}-ccof-summary`"
                    variant="accordion"
                  >
                    <div v-if="!facility.funding || isRenewal" />
                    <div v-else>
                      <CCOFSummaryFamily
                        v-if="
                          summaryModel?.application?.organizationProviderType === ORGANIZATION_PROVIDER_TYPES.FAMILY
                        "
                        :funding="facility.funding"
                        :facility-id="facility.facilityId"
                        :program-year-id="summaryModel?.application?.programYearId"
                        @is-summary-valid="isFormComplete"
                      />
                      <CCOFSummary
                        v-else
                        :funding="facility.funding"
                        :facility-id="facility.facilityId"
                        :change-rec-guid="facility.changeRequestId"
                        :program-year-id="summaryModel?.application?.programYearId"
                        @is-summary-valid="isFormComplete"
                      />
                    </div>
                  </v-expansion-panel>
                  <v-expansion-panel
                    :key="`${facility.facilityId}-ccfri-summary`"
                    :value="`${facility.facilityId}-ccfri-summary`"
                    variant="accordion"
                  >
                    <CCFRISummary
                      :ccfri="facility?.ccfri"
                      :facility-id="facility.facilityId"
                      :change-rec-guid="facility?.changeRequestId"
                      :program-year-id="summaryModel?.application?.programYearId"
                      :is-processing="isProcessing"
                      @is-summary-valid="isFormComplete"
                    />
                  </v-expansion-panel>
                  <v-expansion-panel
                    v-if="facility?.rfiApp"
                    :key="`${facility.facilityId}-rfi-summary`"
                    :value="`${facility.facilityId}-rfi-summary`"
                    variant="accordion"
                  >
                    <RFISummary
                      :rfi-app="facility?.rfiApp"
                      :ccfri-id="facility?.ccfri?.ccfriId"
                      :facility-id="facility.facilityId"
                      :change-rec-guid="facility?.changeRequestId"
                      :program-year-id="summaryModel?.application?.programYearId"
                      @is-summary-valid="isFormComplete"
                    />
                  </v-expansion-panel>
                  <v-expansion-panel
                    v-if="facility?.nmfApp"
                    :key="`${facility.facilityId}-nmf-summary`"
                    :value="`${facility.facilityId}-nmf-summary`"
                    variant="accordion"
                  >
                    <NMFSummary
                      :nmf-app="facility?.nmfApp"
                      :ccfri-id="facility?.ccfri?.ccfriId"
                      :facility-id="facility.facilityId"
                      :change-rec-guid="facility?.changeRequestId"
                      :program-year-id="summaryModel?.application?.programYearId"
                      @is-summary-valid="isFormComplete"
                    />
                  </v-expansion-panel>
                  <v-expansion-panel
                    v-if="facility?.ccfri?.enableAfs"
                    :key="`${facility.facilityId}-afs-summary`"
                    :value="`${facility.facilityId}-afs-summary`"
                    variant="accordion"
                  >
                    <AFSSummary
                      :ccfri-id="facility?.ccfri?.ccfriId"
                      :facility-id="facility?.facilityId"
                      :program-year-id="summaryModel?.application?.programYearId"
                      @is-summary-valid="isFormComplete"
                    />
                  </v-expansion-panel>

                  <v-expansion-panel
                    :key="`${facility.facilityId}-ecewe-summary-org`"
                    :value="`${facility.facilityId}-ecewe-summary-org`"
                    variant="accordion"
                  >
                    <ECEWESummary
                      :ecewe="summaryModel.ecewe"
                      :ecewe-facility="null"
                      :is-processing="isProcessing"
                      :program-year-id="summaryModel?.application?.programYearId"
                      @is-summary-valid="isFormComplete"
                    />
                  </v-expansion-panel>

                  <v-expansion-panel
                    :key="`${facility.facilityId}-ecewe-summary-facility`"
                    :value="`${facility.facilityId}-ecewe-summary-facility`"
                    variant="accordion"
                  >
                    <ECEWESummary
                      :ecewe="{}"
                      :ecewe-facility="facility.ecewe"
                      :funding-model="summaryModel?.ecewe?.fundingModel"
                      :is-processing="isProcessing"
                      :change-rec-guid="facility.changeRequestId"
                      :program-year-id="summaryModel?.application?.programYearId"
                      @is-summary-valid="isFormComplete"
                    />
                  </v-expansion-panel>

                  <v-expansion-panel
                    :key="`${facility.facilityId}-uploaded-documents-summary`"
                    :value="`${facility.facilityId}-uploaded-documents-summary`"
                    variant="accordion"
                  >
                    <UploadedDocumentsSummary
                      :documents="getDocumentsByFacility(facility)"
                      :program-year-id="summaryModel?.application?.programYearId"
                      @is-summary-valid="isFormComplete"
                    />
                  </v-expansion-panel>
                </v-expansion-panels>
              </div>
              <v-expansion-panel
                v-if="hasChangeNotificationFormDocuments"
                variant="accordion"
                value="change-notification-form-summary"
                class="mt-10"
              >
                <ChangeNotificationFormSummary
                  :change-notification-form-documents="summaryModel?.changeNotificationFormDocuments"
                  @is-summary-valid="isFormComplete"
                />
              </v-expansion-panel>
            </v-row>
          </v-expansion-panels>
        </v-card>
      </div>
      <!---Declaration Start--->
      <v-row
        v-if="getFundingAgreementNumber && !isChangeRequest"
        justify="center"
        class="pt-4 text-h5"
        style="color: #003466"
      >
        Funding Agreement Number: {{ getFundingAgreementNumber }}
      </v-row>
      <v-row justify="center" class="pb-12" :class="printableVersion ? 'ma-0' : 'ma-12'">
        <v-card class="py-0 px-3 mx-0 mt-10 rounded-lg col-11" elevation="4">
          <v-row>
            <v-col class="pa-0">
              <v-card-title class="rounded-t-lg pt-3 pb-3 card-title"> Declaration </v-card-title>
            </v-col>
          </v-row>
          <v-row v-if="isProcessing">
            <v-col>
              <v-skeleton-loader
                v-if="isProcessing"
                :loading="isProcessing"
                type="paragraph, text@3, paragraph, text@3, paragraph, paragraph, text@2, paragraph"
              />
            </v-col>
          </v-row>
          <v-row v-if="!isProcessing" class="px-8">
            <v-col class="pb-0">
              <div v-if="isDeclarationADisplayed">
                <!-- Ministry Requirements for Change Request Add New Facility is always show Dec A first -->
                <!-- always show Dec A first for any new orgs completing PCF for the first time-->
                <p>
                  I hereby confirm that the information I have provided in this application is complete and accurate. I
                  certify that I have read and understand the following requirements:
                </p>
                <ul class="ml-5 pt-5">
                  <li>Each facility must be licensed under the Community Care and Assisted Living Act;</li>
                  <li>
                    Each facility must be in compliance with the Community Care and Assisted Living Act and Child Care
                    Licensing Regulation;
                  </li>
                  <li>
                    Each facility must be willing to provide services to families who receive the Affordable Child Care
                    Benefit;
                  </li>
                  <li>
                    The organization must be in good standing with BC Registrar of Companies (if a nonprofit society or
                    a registered company); and
                  </li>
                  <li>
                    The applicant must be in good standing with the Ministry of Education and Child Care (that is, the
                    Applicant must either have no outstanding balances owing to the Ministry OR the Applicant must have
                    established payment plans for outstanding balances and these must be in good standing).
                  </li>
                </ul>
                <p style="padding-top: 10px">
                  Intentionally supplying information that is false or misleading with respect to a material fact in
                  order to obtain a child care grant may lead to action being taken under section 16 of the Early
                  Learning and Child Care Act. If you are convicted of an offence under section 16, in addition to any
                  punishment imposed, the court may order you to pay to the government all or part of any amount you
                  received under the Early Learning and Child Care Act as a result of committing the offence.
                </p>
              </div>
              <!-- Minstry Requirements for Change Request Add New Facility is  after Dec A is signed, to have provider sign Dec B also-->
              <div v-else-if="isDeclarationBDisplayed">
                <p>
                  I do hereby certify that I am the <strong>authorized signing authority</strong> and that all of the
                  information provided is true and complete to the best of my knowledge and belief.
                </p>
                <p>
                  I consent to the Ministry contacting other branches within the Ministry and other Province ministries
                  to validate the accuracy of any information that I have provided.
                </p>
                <p>
                  By completing and submitting this Program Confirmation Form (the Form) electronically, I hereby
                  confirm that I have carefully read this Form and the corresponding terms and conditions of the Child
                  Care Operating Funding Agreement (the Funding Agreement) and that I agree to be bound by such terms
                  and conditions. I further confirm that by clicking “I agree” below, I represent and warrant that:
                </p>

                <ol class="declarationBList" type="a">
                  <li>
                    I am the authorized representative and signing authority of the Provider as named in the Funding
                    Agreement (the Provider);
                  </li>
                  <li>
                    I have authority to submit the Form on behalf of the Provider and that by clicking “I agree”, I do
                    hereby bind the Provider to the terms and conditions of the Funding Agreement if the Province
                    accepts this Form and enrolls the Provider in any or all of the Child Care Operating Funding
                    Program, the CCFRI, or the ECE Wage Enhancement;
                  </li>
                  <li>
                    All information provided in the Form or otherwise in support of the Provider to receive funding
                    under the Funding Agreement is true and complete to the best of my knowledge and belief. I
                    understand and acknowledge that providing false or misleading information either on the Form or
                    otherwise to the Province to obtain any funding under the Funding Agreement or otherwise failing to
                    comply with the Funding Agreement could result in certain penalties or repayment obligations, or
                    both, under any or all of the Early Learning and Child Care Act, any successor legislation, or the
                    Funding Agreement;
                  </li>
                  <li>
                    If I have applied for and been approved by the Province to enroll in the ECE Wage Enhancement, the
                    Provider has taken all actions required under any collective agreement to which it is a party to
                    ensure it is:
                  </li>
                </ol>
                <v-row style="padding-left: 90px">
                  <v-col cols="12">
                    i. permitted to apply for the ECE Wage Enhancement for any of its unionized Early Childhood
                    Educators (ECEs); and</v-col
                  >
                </v-row>
                <v-row style="padding-left: 90px">
                  <v-col cols="12">
                    ii. able to comply with its ECE Wage Enhancement related obligations under the Funding Agreement.
                  </v-col>
                </v-row>
                <p style="padding-top: 10px">
                  I understand and acknowledge that until such time as the Province confirms approval or temporary
                  approval of enrolment, in writing, in the CCFRI or the ECE Wage Enhancement, the Provider is not
                  formally enrolled in these initiatives. The Province is not responsible for any pre-payments the
                  Provider may make in anticipation of enrolment in either of these initiatives and any pre-payments
                  made are at the Provider's own risk.
                </p>
              </div>
              <div v-else>
                <!-- show for early renewals who do not have a FA yet -->
                <p>
                  I do hereby certify that I am the <strong>authorized signing authority</strong> and that all of the
                  information provided is true and complete to the best of my knowledge and belief.
                </p>
                <p>
                  I consent to the Ministry contacting other branches within the Ministry and other Province ministries
                  to validate the accuracy of any information that I have provided.
                </p>
              </div>
            </v-col>
          </v-row>
          <v-row v-if="!isProcessing">
            <v-col cols="12" class="pl-6 pt-0 pb-0">
              <v-checkbox
                v-if="!isRenewal"
                v-model="model.agreeConsentCertify"
                class="pt-0"
                :disabled="isReadOnly"
                :value="1"
                label="I, the applicant, do hereby certify that all the information provided is true and complete to the best of my knowledge and belief. By clicking this check-box, I indicate that I agree to the foregoing terms and conditions."
              />
              <v-checkbox
                v-else-if="isRenewal"
                v-model="model.agreeConsentCertify"
                class="pt-0"
                :disabled="isReadOnly"
                :value="1"
                label="I agree, consent, and certify"
              />
            </v-col>
          </v-row>
          <v-row v-if="!isProcessing">
            <v-col class="pt-0">
              <v-text-field
                v-if="!isProcessing"
                id="signatureTextField"
                v-model="model.orgContactName"
                variant="outlined"
                :disabled="isReadOnly"
                label="Your Organization's Authorized Signing Authority"
              />
            </v-col>
          </v-row>
        </v-card>
      </v-row>
      <NavButton
        v-if="!printableVersion"
        :is-submit-displayed="true"
        class="mt-10"
        :is-submit-disabled="!isPageComplete() || isReadOnly || (isSomeChangeRequestActive() && !isChangeRequest)"
        :is-processing="isProcessing"
        @previous="previous"
        @submit="submit"
      />
      <AppDialog
        v-model="dialog"
        persistent
        max-width="525px"
        title="Submission Complete"
        :loading="false"
        @close="dialog = false"
      >
        <template #content>
          <p>
            Your submission has been received. Please refer to your dashboard for updates on the progress of your
            application. We will contact you if more information is required.
          </p>
          <p>
            <router-link :to="landingPage"> Return to your dashboard </router-link>
          </p>
        </template>
      </AppDialog>
    </v-form>
  </v-container>
</template>
<script>
import { cloneDeep, isEmpty } from 'lodash';
import { mapActions, mapState } from 'pinia';
import { useAuthStore } from '@/store/auth.js';
import { useNavBarStore } from '@/store/navBar.js';
import { useAppStore } from '@/store/app.js';
import { useOrganizationStore } from '@/store/ccof/organization.js';
import { useSummaryDeclarationStore } from '@/store/summaryDeclaration.js';
import { useApplicationStore } from '@/store/application.js';
import { useCcfriAppStore } from '@/store/ccfriApp.js';
import { useReportChangesStore } from '@/store/reportChanges.js';
import DocumentService from '@/services/documentService';
import AppDialog from '@/components/guiComponents/AppDialog.vue';

import {
  AFS_STATUSES,
  DOCUMENT_TYPES,
  PATHS,
  CHANGE_REQUEST_TYPES,
  PROGRAM_YEAR_LANGUAGE_TYPES,
  ORGANIZATION_PROVIDER_TYPES,
} from '@/utils/constants.js';
import alertMixin from '@/mixins/alertMixin.js';
import NavButton from '@/components/util/NavButton.vue';
import FacilityInformationSummary from '@/components/summary/group/FacilityInformationSummary.vue';
import CCOFSummary from '@/components/summary/group/CCOFSummary.vue';
import ECEWESummary from '@/components/summary/group/ECEWESummary.vue';
import CCFRISummary from '@/components/summary/group/CCFRISummary.vue';
import RFISummary from '@/components/summary/group/RFISummary.vue';
import NMFSummary from '@/components/summary/group/NMFSummary.vue';
import AFSSummary from '@/components/summary/group/AFSSummary.vue';
import OrganizationSummary from '@/components/summary/group/OrganizationSummary.vue';
import UploadedDocumentsSummary from '@/components/summary/group/UploadedDocumentsSummary.vue';
import CCOFSummaryFamily from '@/components/summary/group/CCOFSummaryFamily.vue';
import ChangeNotificationFormSummary from '@/components/summary/changeRequest/ChangeNotificationFormSummary.vue';
import { isAnyApplicationUnlocked, isAnyChangeRequestActive } from '@/utils/common.js';

export default {
  components: {
    AppDialog,
    OrganizationSummary,
    UploadedDocumentsSummary,
    NMFSummary,
    RFISummary,
    AFSSummary,
    FacilityInformationSummary,
    CCOFSummary,
    CCFRISummary,
    ECEWESummary,
    CCOFSummaryFamily,
    ChangeNotificationFormSummary,
    NavButton,
  },
  mixins: [alertMixin],
  data() {
    return {
      model: {},
      isLoading: false,
      isProcessing: false,
      dialog: false,
      landingPage: PATHS.ROOT.HOME,
      summaryKey: 1,
      summaryModelFacilities: [],
      invalidSummaryForms: [],
      payload: {},
      printableVersion: false,
      expand: [],
    };
  },
  computed: {
    ...mapState(useAuthStore, ['userInfo', 'isMinistryUser']),
    ...mapState(useNavBarStore, [
      'getNavByFacilityId',
      'getNavByFundingId',
      'getNavByCCFRIId',
      'previousPath',
      'isChangeRequest',
    ]),
    ...mapState(useAppStore, ['programYearList', 'getFundingUrl', 'getLanguageYearLabel']),
    ...mapState(useNavBarStore, ['navBarList', 'changeRequestId']),
    ...mapState(useOrganizationStore, ['organizationAccountNumber', 'isOrganizationComplete']),
    ...mapState(useSummaryDeclarationStore, [
      'declarationModel',
      'summaryModel',
      'facilities',
      'isSummaryLoading',
      'isLoadingComplete',
    ]),
    ...mapState(useApplicationStore, [
      'applicationUploadedDocuments',
      'formattedProgramYear',
      'isRenewal',
      'programYearId',
      'unlockBaseFunding',
      'isLicenseUploadComplete',
      'unlockDeclaration',
      'unlockEcewe',
      'unlockLicenseUpload',
      'unlockSupportingDocuments',
      'applicationStatus',
      'isEceweComplete',
      'applicationMap',
    ]),
    ...mapState(useCcfriAppStore, ['approvableFeeSchedules']),
    ...mapState(useReportChangesStore, ['changeRequestStore', 'isCREceweComplete', 'isCRLicenseComplete']),
    languageYearLabel() {
      return this.getLanguageYearLabel;
    },
    programYearTypes() {
      return PROGRAM_YEAR_LANGUAGE_TYPES;
    },
    getFundingAgreementNumber() {
      return this.applicationMap?.get(this.programYearId)?.fundingAgreementNumber;
    },
    getChangeRequestYear() {
      const currProgramYear = this.programYearList?.list?.find((el) => el.programYearId == this.programYearId);
      const prevProgramYear = this.programYearList?.list?.find(
        (el) => el.programYearId == currProgramYear.previousYearId,
      );
      const changeReq = this.changeRequestStore?.find(
        (el) =>
          (el.externalStatus == 2 || el.externalStatus == 3) &&
          el.changeActions[0].changeType != 'PARENT_FEE_CHANGE' &&
          el.programYearId == prevProgramYear.programYearId,
      );
      //we can have CR's open for multiple years. Show older CR first if it exists.
      if (!this.isSomeChangeRequestActive) {
        //no change req active, so warning box is hidden. Return empty string so page doesn't break
        return '';
      } else if (changeReq) {
        return prevProgramYear.name;
      }
      return currProgramYear.name;
    },
    isReadOnly() {
      if (this.isMinistryUser) {
        return true;
      } else if (
        (this.model.externalStatus == 'INCOMPLETE' || this.model.externalStatus == 'ACTION_REQUIRED') &&
        !this.allFacilitiesApproved
      ) {
        //allow users to submit their Dec A Change Request form without having to manually unlock
        return false;
      } else if (
        (!this.isChangeRequest && this.unlockDeclaration) ||
        (this.isChangeRequest && this.model.unlockDeclaration)
      ) {
        //ministry unlocks declaration for PCF or Change Request New Facility
        return false;
      } else if (
        this.isChangeRequest &&
        !(this.model.externalStatus == 'INCOMPLETE' || this.model.externalStatus == 'ACTION_REQUIRED')
      ) {
        //ensure summary dec is locked for completed CR when viewing a historical record.
        return true;
      } else if (this.applicationStatus == 'SUBMITTED') {
        //ensure summary dec is locked for completed CR when viewing a historical record.
        return true;
      }
      return false;
    },
    isSomeApplicationUnlocked() {
      const applicationList = Array.from(this.applicationMap?.values());
      return isAnyApplicationUnlocked(applicationList);
    },
    isFacilitiesAvailable() {
      return this.facilities?.length > 0;
    },
    isSummaryComplete() {
      return this.invalidSummaryForms.length < 1;
    },
    allFacilitiesApproved() {
      return this.facilities?.every((facility) => {
        return facility.facilityInfo.facilityAccountNumber;
      });
    },
    hasChangeNotificationFormDocuments() {
      return this.summaryModel?.changeRequestTypes?.includes(CHANGE_REQUEST_TYPES.PDF_CHANGE);
    },
    isDeclarationBDisplayed() {
      if (this.isChangeRequest) {
        return this.model?.enabledDeclarationB;
      }
      //ccfri-4447 - show DEC B to any new org with FA number. This will also show DecB after submission
      return this.getFundingAgreementNumber && this.organizationAccountNumber;
    },
    isDeclarationADisplayed() {
      return (
        (!this.isRenewal && !this.organizationAccountNumber) || (this.isChangeRequest && !this.isDeclarationBDisplayed)
      );
    },
  },
  watch: {
    isLoadingComplete: {
      handler: function (val) {
        if (val) {
          setTimeout(() => {
            const keys = Object.keys(this.payload);
            //If this is a change request, we'll have 2 items in the payload.
            if ((!this.isChangeRequest && keys.length > 1) || (this.isChangeRequest && keys.length > 2)) {
              this.updateApplicationStatus(this.payload);
              this.forceNavBarRefresh();
            }
          }, 1000);
        }
      },
    },
  },
  async mounted() {
    this.isProcessing = true;
    if (this.$route.path.endsWith('printable')) {
      this.printableVersion = true;
    }
    await Promise.all([
      this.getChangeRequestList(),
      this.loadSummary(this.$route.params?.changeRecGuid),
      this.loadData(),
    ]);

    if (!isEmpty(this.declarationModel)) {
      this.model = cloneDeep(this.declarationModel);
    }

    if (!this.isChangeRequest && (this.isRenewal || (this.unlockDeclaration && this.organizationAccountNumber))) {
      // Establish the server time
      const serverTime = new Date(this.userInfo.serverTime);

      // Determine declaration b start date
      let declarationBStart = null;
      this.programYearList.list.find((item) => {
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
        this.model.declarationBStatus = undefined;
      } else {
        this.model.declarationBStatus = 1;
        this.model.declarationAStatus = undefined;
      }
    }
    this.summaryKey = this.summaryKey + 1;
    this.isProcessing = false;
    if (this.printableVersion) {
      this.expandAllPanels();
    }
  },
  created() {
    this.ORGANIZATION_PROVIDER_TYPES = ORGANIZATION_PROVIDER_TYPES;
  },
  methods: {
    ...mapActions(useSummaryDeclarationStore, [
      'loadDeclaration',
      'loadChangeRequestDeclaration',
      'loadChangeRequestSummaryDeclaration',
      'loadSummary',
      'setDeclarationModel',
      'updateApplicationStatus',
      'updateDeclaration',
    ]),
    ...mapActions(useApplicationStore, ['setIsEceweComplete', 'setIsLicenseUploadComplete']),
    ...mapActions(useNavBarStore, ['setNavBarFacilityComplete', 'setNavBarFundingComplete', 'forceNavBarRefresh']),
    ...mapActions(useOrganizationStore, ['setIsOrganizationComplete']),
    ...mapActions(useReportChangesStore, ['getChangeRequestList', 'setCRIsLicenseComplete', 'setCRIsEceweComplete']),
    isPageComplete() {
      return this.model.agreeConsentCertify && this.model.orgContactName && this.isSummaryComplete;
    },

    isSomeChangeRequestActive() {
      //Status of : "Submitted" "Action Required";
      return isAnyChangeRequestActive(this.changeRequestStore);
    },
    goToChangeRequestHistory() {
      this.$router.push(PATHS.ROOT.CHANGE_LANDING + '#change-request-history');
    },
    async loadData() {
      this.isLoading = true;
      try {
        //always load the change request store so we can prevent PCF submission if active change request

        if (this.isChangeRequest) {
          await this.loadChangeRequestSummaryDeclaration(this.$route.params?.changeRecGuid);
        } else {
          await this.loadDeclaration();
        }
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
        this.setDeclarationModel(this.model);
        if (this.isChangeRequest) {
          // await this.updateDeclaration({changeRequestId: this.$route.params?.changeRecGuid, reLockPayload:this.createChangeRequestRelockPayload()});
          await this.updateDeclaration({ changeRequestId: this.$route.params?.changeRecGuid, reLockPayload: [] });
        } else {
          await this.updateAfsSupportingDocuments();
          await this.updateDeclaration({ changeRequestId: undefined, reLockPayload: this.createRelockPayload() });
        }
        this.dialog = true;
      } catch (error) {
        this.setFailureAlert('An error occurred while SUBMITTING application. Please try again later.' + error);
      } finally {
        this.isProcessing = false;
      }
    },
    createRelockPayload() {
      let applicationRelockPayload = this.createRelockPayloadForApplication();
      let ccrfiRelockPayload = this.createRelockPayloadForCCFRI();
      if (Object.keys(ccrfiRelockPayload).length > 0) {
        applicationRelockPayload['facilities'] = ccrfiRelockPayload;
      }
      return applicationRelockPayload;
    },
    createChangeRequestRelockPayload() {
      let applicationRelockPayload = {
        unlockDeclaration: this.model.unlockDeclaration,
        unlockChangeRequestDocument: this.model.unlockChangeRequestDocument,
        unlockChangeRequest: this.model.unlockChangeRequest,
      };

      let ccrfiRelockPayload = this.createRelockPayloadForCCFRI(); //mentioned that we might need this, but actually I think no.. TODO: ask rob
      if (Object.keys(ccrfiRelockPayload).length > 0) {
        applicationRelockPayload['facilities'] = ccrfiRelockPayload;
      }
      // Create payload with only unlock propteries set to 1.

      applicationRelockPayload = Object.fromEntries(
        Object.entries(applicationRelockPayload).filter(([_, v]) => v == true),
      );

      // Update payload unlock properties from true to false for change request
      Object.keys(applicationRelockPayload).forEach((key) => {
        applicationRelockPayload[key] = false;
      });

      return applicationRelockPayload;
    },
    createRelockPayloadForApplication() {
      let applicationRelockPayload = {
        unlockBaseFunding: this.unlockBaseFunding,
        unlockDeclaration: this.unlockDeclaration,
        unlockEcewe: this.unlockEcewe,
        unlockLicenseUpload: this.unlockLicenseUpload,
        unlockSupportingDocuments: this.unlockSupportingDocuments,
      };
      // Create payload with only unlock propteries set to 1.

      applicationRelockPayload = Object.fromEntries(
        Object.entries(applicationRelockPayload).filter(([_, v]) => v == 1),
      );
      // Update payload unlock properties from 1 to 0.
      Object.keys(applicationRelockPayload).forEach((key) => {
        applicationRelockPayload[key] = '0';
      });
      return applicationRelockPayload;
    },
    createRelockPayloadForCCFRI() {
      let ccrfiRelockPayload = new Array(0);
      for (const facility of this.navBarList) {
        let applicationIdPayload = { ccfriApplicationId: facility.ccfriApplicationId };
        let unlockPayload = {
          unlockCcfri: facility.unlockCcfri,
          unlockNmf: facility.unlockNmf,
          unlockRfi: facility.unlockRfi,
          unlockAfs: facility.unlockAfs,
        };
        // Create payload with only unlock propteries set to 1.
        unlockPayload = Object.fromEntries(Object.entries(unlockPayload).filter(([_, v]) => v == 1));
        // Update payload unlock properties from 1 to 0.
        Object.keys(unlockPayload).forEach((key) => {
          unlockPayload[key] = '0';
        });

        const afs = this.approvableFeeSchedules?.find(
          (item) => item.ccfriApplicationId === facility.ccfriApplicationId,
        );
        if (afs?.afsStatus === AFS_STATUSES.UPLOAD_DOCUMENTS) {
          unlockPayload.enableAfs = '0';
        }

        if (Object.keys(unlockPayload).length > 0) {
          ccrfiRelockPayload.push({ ...applicationIdPayload, ...unlockPayload });
        }
      }
      return ccrfiRelockPayload;
    },
    previous() {
      this.$router.push(this.previousPath);
    },
    async isFormComplete(formObj, isComplete) {
      if (!isComplete) {
        this.invalidSummaryForms.push(formObj);
      }
      this.updateNavBarStatus(formObj, isComplete);
    },
    expandAllPanels() {
      this.facilities.forEach((facility) => {
        const facilityId = facility.facilityId;
        this.expand[facilityId] = [
          `${facilityId}-facility-information`,
          `${facilityId}-ccof-summary`,
          `${facilityId}-ccfri-summary`,
          `${facilityId}-rfi-summary`,
          `${facilityId}-nmf-summary`,
          `${facilityId}-afs-summary`,
          `${facilityId}-ecewe-summary-facility`,
          `${facilityId}-ecewe-summary-org`,
          `${facilityId}-uploaded-documents-summary`,
        ];
      });

      this.expand['global'] = ['organization-summary', 'ecewe-summary-b', 'change-notification-form-summary'];
    },
    updateNavBarStatus(formObj, isComplete) {
      if (formObj && !this.isReadOnly) {
        if (this.isChangeRequest) {
          this.payload['changeRequestId'] = this.changeRequestId;
        }
        console.info(`-- updating status for [${formObj?.formName}]' to be complete: [${isComplete}]`);
        if (!this.payload.applicationId) {
          this.payload['applicationId'] = this.summaryModel?.application?.applicationId;
        }
        switch (formObj.formName) {
          case 'FacilityInformationSummary':
            if (this.getNavByFacilityId(formObj.formId)?.isFacilityComplete != isComplete) {
              this.setNavBarFacilityComplete({ facilityId: formObj.formId, complete: isComplete });
              if (!this.payload.facilities) {
                this.payload['facilities'] = [];
              }
              this.payload.facilities.push({ facilityId: formObj.formId, isFacilityComplete: isComplete });
            }
            break;
          case 'CCOFSummary':
            if (this.getNavByFundingId(formObj.formId)?.isCCOFComplete != isComplete) {
              this.setNavBarFundingComplete({ fundingId: formObj.formId, complete: isComplete });
              if (!this.payload.fundings) {
                this.payload['fundings'] = [];
              }
              this.payload.fundings.push({ basefundingId: formObj.formId, isCCOFComplete: isComplete });
            }
            break;
          case 'ECEWESummary':
            if (this.isChangeRequest) {
              if (this.isCREceweComplete != isComplete) {
                this.setCRIsEceweComplete({ changeRequestId: this.changeRequestId, isComplete: isComplete });
                this.payload['isEceweComplete'] = isComplete;
              }
            } else {
              if (this.isEceweComplete != isComplete) {
                this.setIsEceweComplete(isComplete);
                this.payload['isEceweComplete'] = isComplete;
              }
            }
            break;
          case 'CCFRISummary':
            if (this.getNavByCCFRIId(formObj.formId)?.isCCFRIComplete != isComplete) {
              this.getNavByCCFRIId(formObj.formId).isCCFRIComplete = isComplete;
              if (!this.payload.ccfris) {
                this.payload['ccfris'] = [];
              }
              const findIndex = this.payload.ccfris.findIndex((item) => item.ccfriId === formObj.formId);
              if (findIndex > -1) {
                const item = this.payload.ccfris[findIndex];
                item['isCCFRIComplete'] = isComplete;
              } else {
                this.payload.ccfris.push({ ccfriId: formObj.formId, isCCFRIComplete: isComplete });
              }
            }
            break;
          case 'RFISummary':
            if (this.getNavByFacilityId(formObj.formId)?.isRfiComplete != isComplete) {
              this.getNavByFacilityId(formObj.formId).isRfiComplete = isComplete;
              const ccfriId = this.getNavByFacilityId(formObj.formId).ccfriApplicationId;
              if (!this.payload.ccfris) {
                this.payload['ccfris'] = [];
              }
              const findIndex = this.payload.ccfris.findIndex((item) => item.ccfriId === ccfriId);
              if (findIndex > -1) {
                const item = this.payload.ccfris[findIndex];
                item['isRfiComplete'] = isComplete;
              } else {
                this.payload.ccfris.push({ ccfriId: ccfriId, isRfiComplete: isComplete });
              }
            }
            break;
          case 'NMFSummary':
            if (this.getNavByFacilityId(formObj.formId)?.isNmfComplete != isComplete) {
              this.getNavByFacilityId(formObj.formId).isNmfComplete = isComplete;
              const ccfriId = this.getNavByFacilityId(formObj.formId).ccfriApplicationId;
              if (!this.payload.ccfris) {
                this.payload['ccfris'] = [];
              }
              const findIndex = this.payload.ccfris.findIndex((item) => item.ccfriId === ccfriId);
              if (findIndex > -1) {
                const item = this.payload.ccfris[findIndex];
                item['isNmfComplete'] = isComplete;
              } else {
                this.payload.ccfris.push({ ccfriId: ccfriId, isNmfComplete: isComplete });
              }
            }
            break;
          case 'OrganizationSummary':
            if (this.isOrganizationComplete != isComplete) {
              this.setIsOrganizationComplete(isComplete);
              this.payload['organizationId'] = formObj.formId;
              this.payload['isOrganizationComplete'] = isComplete;
            }
            break;
          case 'DocumentSummary':
            if (this.isChangeRequest) {
              if (this.isCRLicenseComplete != isComplete) {
                this.setCRIsLicenseComplete({ changeRequestId: this.changeRequestId, isComplete: isComplete });
                this.payload['isLicenseUploadComplete'] = isComplete;
              }
            } else {
              if (this.isLicenseUploadComplete != isComplete) {
                this.setIsLicenseUploadComplete(isComplete);
                this.payload['isLicenseUploadComplete'] = isComplete;
              }
            }
            break;
        }
      }
      this.forceNavBarRefresh();
    },

    getDocumentsByFacility(facility) {
      return this.applicationUploadedDocuments?.filter((document) => facility?.facilityId === document.facilityId);
    },

    // CCFRI-3808 - This function ensures that submitted AFS documents from previous submissions cannot be deleted from the Portal when the Ministry Adjudicators re-enable/re-unlock the AFS section.
    // i.e.: Documents with documentType = APPLICATION_AFS_SUBMITTED are not deletable.
    async updateAfsSupportingDocuments() {
      const afsDocuments = this.applicationUploadedDocuments?.filter(
        (document) => document.documentType === DOCUMENT_TYPES.APPLICATION_AFS,
      );
      await Promise.all(
        afsDocuments?.map(async (document) => {
          const payload = {
            documentType: DOCUMENT_TYPES.APPLICATION_AFS_SUBMITTED,
          };
          await DocumentService.updateDocument(document.annotationId, payload);
        }),
      );
    },
  },
};
</script>

<style>
li {
  padding-bottom: 12px;
}

:deep(::placeholder) {
  color: #d8292f !important;
  opacity: 1 !important;
}

* .card-title {
  color: #003466;
  font-size: 20px;
  font-weight: bold;
  background-color: #e5e4e4;
}

.summary-label {
  color: grey;
  font-size: small;
}

.summary-value {
  font-size: medium;
  color: black;
}

.special {
  margin-top: 5vh !important;
}

@media print {
  #printable-form .v-card {
    margin-left: 0 !important;
    margin-right: 0 !important;
  }
}
</style>
