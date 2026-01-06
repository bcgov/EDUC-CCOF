<template>
  <v-skeleton-loader :loading="isApplicationProcessing" type="table-tbody" class="mb-12">
    <v-container fluid class="mx-lg-16">
      <v-form ref="form" v-model="isValidForm">
        <ApplicationPCFHeader :program-year="formattedProgramYear" :organization-name="organizationName" />
        <div class="my-8">
          <p>
            The Funding Agreement outlines the legal terms and conditions to participate in and receive Child Care
            Operating Funding (CCOF) Base Payment and if applicable, Child Care Fee Reduction Initiative (CCFRI) and
            Early Childhood Educator Wage Enhancement (ECE-WE).
          </p>
          <p class="my-4">
            Review the Funding Agreement below in full to understand the requirements, payments, and obligations of both
            you and the Province before proceeding with your CCOF, CCFRI and/or ECE-WE renewal. Each licence eligible to
            receive funding under this organization is shown as a separate Schedule A in the Funding Agreement.
          </p>
          <p>Also, check that:</p>
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
        <div class="d-flex justify-end my-4">
          <AppButton :loading="isApplicationProcessing" size="medium" @click="goToChangeRequest">
            Request a Change
          </AppButton>
        </div>
        <v-card v-if="fundingAgreement" class="px-8 px-lg-12 py-4 mb-8">
          <AppPDFViewer :pdf-file="fundingAgreement.pdfFile" />
          <v-card class="card-top-border-primary my-8 px-8 py-6">
            <div class="mb-2">
              <p class="mb-2">I confirm I have read the Funding Agreement and:</p>
              <ul class="pl-6">
                <li>the organization information on the first page is correct;</li>
                <li>no licence needs to be added to, or removed from, the Funding Agreement; and</li>
                <li>the information in each Schedule A is correct.</li>
              </ul>
            </div>
            <v-radio-group v-model="isFundingAgreementConfirmed" :disabled="readonly" :rules="rules.required">
              <v-radio label="Yes" :value="YES_NO_VALUES.YES" />
              <v-radio label="No" :value="YES_NO_VALUES.NO" />
            </v-radio-group>

            <v-card v-if="isFundingAgreementConfirmed === YES_NO_VALUES.NO" rounded="0" class="mb-4">
              <v-card-title class="noticeAlert">
                <v-icon size="x-large" class="noticeAlertIcon">mdi-alert-octagon</v-icon>
                Do not continue.
              </v-card-title>
              <p class="px-8 py-4">
                Submit a
                <router-link class="text-decoration-underline" :to="PATHS.ROOT.CHANGE_LANDING"
                  >change request</router-link
                >. This will bring you to a different page.
              </p>
            </v-card>
          </v-card>
        </v-card>
        <v-card v-if="isFundingAgreementConfirmed">
          <p class="px-6 py-3 card-title font-weight-bold">Licence and Service Details Record(s)</p>
          <div class="px-8 px-lg-12 pt-6">
            <p>
              Click each licence to expand and review the Licence and Service Details Record. Notify the Child Care
              Operating Funding Program of a change to your Facility Licence or Child Care Service Details by submitting
              a change request.
            </p>
            <div class="d-flex justify-end my-4">
              <AppButton :loading="isApplicationProcessing" size="medium" @click="goToChangeRequest">
                Request a Change
              </AppButton>
            </div>
            <v-expansion-panels multiple class="mb-6">
              <v-expansion-panel v-for="licence in licences" :key="licence.licenceId">
                <v-expansion-panel-title>
                  <strong class="mr-8"> Licence #: {{ licence.licenceNumber }} </strong>
                  <strong> Facility ID: {{ licence.facilityAccountNumber }} </strong>
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <ServiceDetails :licence="licence" />
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
            <v-card class="card-top-border-primary mb-8 px-8 py-6">
              <p class="mb-2">I confirm all Licence and Service Details Records are correct.</p>
              <v-radio-group v-model="areLicenceDetailsConfirmed" :disabled="readonly" :rules="rules.required">
                <v-radio label="Yes" :value="YES_NO_VALUES.YES" />
                <v-radio label="No" :value="YES_NO_VALUES.NO" />
              </v-radio-group>
              <v-card v-if="areLicenceDetailsConfirmed === YES_NO_VALUES.NO" rounded="0" class="mb-4">
                <v-card-title class="noticeAlert">
                  <v-icon size="x-large" class="noticeAlertIcon">mdi-alert-octagon</v-icon>
                  Do not continue.
                </v-card-title>
                <p class="px-8 py-4">
                  Submit a
                  <router-link class="text-decoration-underline" :to="PATHS.ROOT.CHANGE_LANDING">
                    change request</router-link
                  >. This will bring you to a different page.
                </p>
              </v-card>
            </v-card>
          </div>
        </v-card>
      </v-form>
    </v-container>
  </v-skeleton-loader>
  <NavButton
    :is-next-displayed="true"
    :is-save-displayed="true"
    :is-next-disabled="isNextDisabled"
    :is-save-disabled="readonly"
    :is-processing="isApplicationProcessing"
    @previous="back"
    @next="next"
    @save="save(true)"
    @validate-form="validateForm"
  />
</template>
<script>
import { isEmpty } from 'lodash';
import moment from 'moment';
import { mapActions, mapState } from 'pinia';
import ServiceDetails from '@/components/licences/ServiceDetails.vue';
import AppButton from '@/components/guiComponents/AppButton.vue';
import AppPDFViewer from '@/components/guiComponents/AppPDFViewer.vue';
import ApplicationPCFHeader from '@/components/util/ApplicationPCFHeader.vue';
import NavButton from '@/components/util/NavButton.vue';
import alertMixin from '@/mixins/alertMixin.js';
import permissionsMixin from '@/mixins/permissionsMixin.js';
import ApplicationService from '@/services/applicationService';
import FundingAgreementService from '@/services/fundingAgreementService.js';
import LicenceService from '@/services/licenceService.js';
import { useApplicationStore } from '@/store/application.js';
import { useNavBarStore } from '@/store/navBar.js';
import { useOrganizationStore } from '@/store/ccof/organization.js';
import { PATHS, YES_NO_VALUES } from '@/utils/constants.js';
import rules from '@/utils/rules.js';

export default {
  components: { AppButton, AppPDFViewer, ApplicationPCFHeader, NavButton, ServiceDetails },
  mixins: [alertMixin, permissionsMixin],
  async beforeRouteLeave(_to, _from, next) {
    await this.save(false);
    next();
  },
  data() {
    return {
      isValidForm: false,
      isFundingAgreementConfirmed: null,
      areLicenceDetailsConfirmed: null,
      fundingAgreement: null,
      licences: [],
    };
  },
  computed: {
    ...mapState(useApplicationStore, [
      'applicationId',
      'formattedProgramYear',
      'isApplicationProcessing',
      'isApplicationSubmitted',
      'renewalApplicationCCOF',
      'unlockRenewal',
    ]),
    ...mapState(useNavBarStore, ['nextPath', 'previousPath']),
    ...mapState(useOrganizationStore, ['organizationId', 'organizationName']),
    readonly() {
      return (
        (this.isApplicationSubmitted && !this.unlockRenewal) ||
        isEmpty(this.fundingAgreement?.pdfFile) ||
        isEmpty(this.licences)
      );
    },
    isNextDisabled() {
      return !this.isValidForm || !this.isFundingAgreementConfirmed || !this.areLicenceDetailsConfirmed;
    },
  },
  async created() {
    this.PATHS = PATHS;
    this.YES_NO_VALUES = YES_NO_VALUES;
    this.rules = rules;
    await this.loadData();
  },
  methods: {
    ...mapActions(useApplicationStore, ['setIsApplicationProcessing']),
    ...mapActions(useNavBarStore, ['refreshNavBarList']),
    async loadData() {
      try {
        this.setIsApplicationProcessing(true);
        this.isFundingAgreementConfirmed = this.renewalApplicationCCOF?.isFundingAgreementConfirmed;
        this.areLicenceDetailsConfirmed = this.renewalApplicationCCOF?.areLicenceDetailsConfirmed;
        await Promise.all([this.loadFundingAgreement(), this.loadLicences()]);
        this.filterActiveLicencesForFundingAgreement();
      } catch (error) {
        console.error(error);
        this.setFailureAlert('An error occurred while loading. Please try again later.');
      } finally {
        this.setIsApplicationProcessing(false);
      }
    },
    async loadFundingAgreement() {
      const response = await FundingAgreementService.getFundingAgreements({
        organizationId: this.organizationId,
        programYearId: this.$route.params.programYearGuid,
        fundingAgreementOrderNumber: 0,
        includePdf: true,
      });
      this.fundingAgreement = response[0];
      if (isEmpty(this.fundingAgreement?.pdfFile)) {
        this.setWarningAlert('Funding Agreement not found for this application.');
      } else {
        this.fundingAgreement.pdfFile = `data:application/pdf;base64,${this.fundingAgreement.pdfFile}`;
      }
    },
    async loadLicences() {
      this.licences = await LicenceService.getLicences({
        organizationId: this.organizationId,
      });
    },
    filterActiveLicencesForFundingAgreement() {
      const fundingAgreementStartDate = this.formatDate(this.fundingAgreement?.fundingAgreementStartDate);
      this.licences = this.licences.filter((licence) => {
        const licenceStartDate = this.formatDate(licence.recordStartDate);
        const licenceEndDate = this.formatDate(licence.recordEndDate);
        const validStart = licenceStartDate?.isSameOrBefore(fundingAgreementStartDate);
        const validEnd = !licenceEndDate || licenceEndDate.isAfter(fundingAgreementStartDate);
        return validStart && validEnd;
      });
      if (isEmpty(this.licences)) {
        this.setWarningAlert('Licence not found for this application.');
      }
    },
    formatDate(date) {
      return date ? moment.utc(date, 'YYYY-MM-DD') : null;
    },
    back() {
      this.$router.push(this.previousPath);
    },
    next() {
      this.$router.push(this.nextPath);
    },
    async save(showNotification) {
      try {
        if (this.readonly) return;
        this.setIsApplicationProcessing(true);
        const payload = {
          isFundingAgreementConfirmed: this.isFundingAgreementConfirmed,
          areLicenceDetailsConfirmed: this.areLicenceDetailsConfirmed,
        };
        const isUpdated =
          this.renewalApplicationCCOF.isFundingAgreementConfirmed !== payload.isFundingAgreementConfirmed ||
          this.renewalApplicationCCOF.areLicenceDetailsConfirmed !== payload.areLicenceDetailsConfirmed;
        if (isUpdated) {
          Object.assign(this.renewalApplicationCCOF, payload);
          await ApplicationService.updateApplication(this.applicationId, payload);
          this.refreshNavBarList();
        }
        if (showNotification) {
          this.setSuccessAlert('Application saved successfully.');
        }
      } catch (error) {
        console.error(error);
        this.setFailureAlert('An error occurred while saving. Please try again later.');
      } finally {
        this.setIsApplicationProcessing(false);
      }
    },
    validateForm() {
      this.$refs.form?.validate();
    },
    goToChangeRequest() {
      this.$router.push(PATHS.ROOT.CHANGE_LANDING);
    },
  },
};
</script>
