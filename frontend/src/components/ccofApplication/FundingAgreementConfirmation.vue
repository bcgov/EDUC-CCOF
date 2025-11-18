<template>
  <v-skeleton-loader :loading="loading" type="table-tbody" class="mb-12">
    <v-container fluid class="mx-lg-16">
      <v-form ref="form" v-model="isValidForm">
        <ApplicationPCFHeader :program-year="formattedProgramYear" :organization-name="organizationName" />
        <ApplicationChangeRequestInProgressAlert v-if="hasActiveChangeRequest" :loading="isProcessing" class="my-8" />
        <div class="my-8">
          <p>
            The Funding Agreement outlines the legal obligations you are agreeing to if you enter into this agreement
            with the Province to receive Child Care Operating Funding Base Funding Payments and, if applicable, to
            participate in the Child Care Fee Reduction Initiative and Early Childhood Educator Wage Enhancement.
          </p>
          <p class="my-4">
            Review the Funding Agreement below to ensure you understand your obligations. Each licence eligible to
            receive funding under this organization is shown as a separate Schedule A in the agreement.
          </p>
          <p>Check that:</p>
          <ul class="ml-5">
            <li>the organization information on the first page is correct;</li>
            <li>no licence needs to be added to, or removed from, the Funding Agreement; and</li>
            <li>the information in each Schedule A is correct.</li>
          </ul>
          <p class="my-4">
            Notify the Child Care Operating Funding Program of a change to organization information, licences or
            Schedule A information.
          </p>
        </div>
        <div class="d-flex justify-end align-end my-4">
          <AppButton :loading="isProcessing" size="medium" @click="goToChangeRequest"> Request a Change </AppButton>
        </div>
        <v-card v-if="pdfFile" class="px-8 px-lg-12 py-4">
          <AppPDFViewer :pdf-file="pdfFile" />
          <v-card class="card-top-border-primary my-8 px-8 py-6">
            <div class="mb-2">
              <p class="mb-2">I confirm I have read the Funding Agreement and:</p>
              <ul class="pl-6">
                <li>the organization information on the first page is correct;</li>
                <li>no licence needs to be added to, or removed from, the Funding Agreement; and</li>
                <li>the information in each Schedule A is correct.</li>
              </ul>
            </div>
            <v-radio-group v-model="isScheduleACorrect" :disabled="hasActiveChangeRequest" :rules="rules.required">
              <v-radio label="Yes" :value="true" />
              <v-radio label="No" :value="false" />
            </v-radio-group>

            <v-card v-if="isScheduleACorrect === false" rounded="0" class="mb-4">
              <v-card-title class="noticeAlert">
                <v-icon size="x-large" class="noticeAlertIcon">mdi-alert-octagon</v-icon>
                Do not continue.
              </v-card-title>
              <div class="px-8 py-4">
                <p class="pb-2">Submit a change request using the link below:</p>
                <router-link :to="PATHS.ROOT.CHANGE_LANDING">
                  Go to Request a Change. This will bring you to a different page.
                </router-link>
              </div>
            </v-card>
          </v-card>
        </v-card>
      </v-form>
    </v-container>
  </v-skeleton-loader>
  <NavButton
    :is-next-displayed="true"
    :is-save-displayed="true"
    :is-next-disabled="isNextDisabled"
    :is-processing="isProcessing"
    @previous="back"
    @next="next"
    @validate-form="validateForm"
  />
</template>
<script>
import { isEmpty } from 'lodash';
import { mapActions, mapState, mapWritableState } from 'pinia';
import AppButton from '@/components/guiComponents/AppButton.vue';
import AppPDFViewer from '@/components/guiComponents/AppPDFViewer.vue';
import ApplicationChangeRequestInProgressAlert from '@/components/util/ApplicationChangeRequestInProgressAlert.vue';
import ApplicationPCFHeader from '@/components/util/ApplicationPCFHeader.vue';
import NavButton from '@/components/util/NavButton.vue';
import FundingAgreementService from '@/services/fundingAgreementService.js';
import { useAppStore } from '@/store/app.js';
import { useApplicationStore } from '@/store/application.js';
import { useNavBarStore } from '@/store/navBar.js';
import { useReportChangesStore } from '@/store/reportChanges.js';
import { useOrganizationStore } from '@/store/ccof/organization.js';
import { PATHS } from '@/utils/constants.js';
import rules from '@/utils/rules.js';

export default {
  components: { AppButton, AppPDFViewer, ApplicationChangeRequestInProgressAlert, ApplicationPCFHeader, NavButton },
  data() {
    return {
      loading: false,
      processing: false,
      isValidForm: true,
      isScheduleACorrect: null,
      pdfFile: null,
    };
  },
  computed: {
    ...mapState(useAppStore, ['programYearList', 'renewalYearLabel']),
    ...mapState(useApplicationStore, [
      'applicationMap',
      'applicationStatus',
      'applicationType',
      'formattedProgramYear',
      'isApplicationProcessing',
      'latestProgramYearId',
    ]),
    ...mapState(useNavBarStore, ['nextPath', 'previousPath']),
    ...mapState(useReportChangesStore, ['hasActiveChangeRequest']),
    ...mapState(useOrganizationStore, ['organizationName']),
    ...mapWritableState(useApplicationStore, ['isRenewalFAComplete']),
    isProcessing() {
      return this.loading || this.processing || this.isApplicationProcessing;
    },
    isDataComplete() {
      return !isEmpty(this.pdfFile);
    },
    isNextDisabled() {
      // TODO (vietle-cgi) - update this line after we add Licence Info to this page
      return this.isProcessing || !this.isDataComplete || !this.isValidForm || !this.isScheduleACorrect;
    },
  },
  async created() {
    this.PATHS = PATHS;
    this.rules = rules;
    await this.loadData();
  },
  methods: {
    ...mapActions(useOrganizationStore, ['renewApplication']),
    ...mapActions(useReportChangesStore, ['getChangeRequestList']),
    async loadData() {
      try {
        this.loading = true;
        await this.loadFundingAgreementPDF();
      } catch (error) {
        console.error(error);
        this.setFailureAlert('An error occurred while loading. Please try again later.');
      } finally {
        this.loading = false;
      }
    },
    async loadFundingAgreementPDF() {
      try {
        console.log(this.applicationMap?.get(this.$route.params.programYearGuid));
        // TODO (vietle-cgi) - update this line after we confirm with Danna which FA to display
        // const fundingAgreementId = this.applicationMap?.get(this.$route.params.programYearGuid)?.fundingAgreementId;
        const fundingAgreementId = '5602dc56-3e6e-f011-b4cb-7ced8d05e0a9';
        const pdfFile = await FundingAgreementService.getFundingAgreementPDF(fundingAgreementId);
        this.pdfFile = `data:application/pdf;base64,${pdfFile}`;
      } catch (error) {
        console.error('Failed to load PDF', error);
      }
    },
    async next() {
      this.processing = true;
      // TODO (vietle-cgi) - update this line whenever CMS add the isRenewalFAComplete field to Application entity
      this.isRenewalFAComplete = true;
      this.$router.push(this.nextPath);
      console.log('NEXT');
    },
    validateForm() {
      this.$refs.form?.validate();
    },
    back() {
      this.$router.push(this.previousPath);
    },
    goToChangeRequest() {
      this.$router.push(PATHS.ROOT.CHANGE_LANDING);
    },
  },
};
</script>
