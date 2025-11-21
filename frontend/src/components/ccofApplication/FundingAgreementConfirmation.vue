<template>
  <v-skeleton-loader :loading="isApplicationProcessing" type="table-tbody" class="mb-12">
    <v-container fluid class="mx-lg-16">
      <v-form ref="form" v-model="isValidForm">
        <ApplicationPCFHeader :program-year="formattedProgramYear" :organization-name="organizationName" />
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
              <v-radio label="Yes" :value="true" />
              <v-radio label="No" :value="false" />
            </v-radio-group>

            <v-card v-if="isFundingAgreementConfirmed === false" rounded="0" class="mb-4">
              <v-card-title class="noticeAlert">
                <v-icon size="x-large" class="noticeAlertIcon">mdi-alert-octagon</v-icon>
                Do not continue.
              </v-card-title>
              <p class="px-8 py-4">
                Submit a <router-link :to="PATHS.ROOT.CHANGE_LANDING">change request</router-link>. This will bring you
                to a different page.
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
                  <strong>
                    {{ licence.serviceDeliveryDetails[0].facilityName }} - {{ licence.facilityAccountNumber }}
                  </strong>
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <ServiceDetails :licence="licence" />
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
            <v-card class="card-top-border-primary mb-8 px-8 py-6">
              <p class="mb-2">I confirm all Licence and Service Details Records are correct.</p>
              <v-radio-group v-model="areLicenceDetailsConfirmed" :disabled="readonly" :rules="rules.required">
                <v-radio label="Yes" :value="true" />
                <v-radio label="No" :value="false" />
              </v-radio-group>
              <v-card v-if="areLicenceDetailsConfirmed === false" rounded="0" class="mb-4">
                <v-card-title class="noticeAlert">
                  <v-icon size="x-large" class="noticeAlertIcon">mdi-alert-octagon</v-icon>
                  Do not continue.
                </v-card-title>
                <p class="px-8 py-4">
                  Submit a <router-link :to="PATHS.ROOT.CHANGE_LANDING">change request</router-link>. This will bring
                  you to a different page.
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
import { mapActions, mapState } from 'pinia';
import ServiceDetails from '@/components/licences/ServiceDetails.vue';
import AppButton from '@/components/guiComponents/AppButton.vue';
import AppPDFViewer from '@/components/guiComponents/AppPDFViewer.vue';
import ApplicationPCFHeader from '@/components/util/ApplicationPCFHeader.vue';
import NavButton from '@/components/util/NavButton.vue';
import alertMixin from '@/mixins/alertMixin.js';
import permissionsMixin from '@/mixins/permissionsMixin.js';
import FundingAgreementService from '@/services/fundingAgreementService.js';
import LicenceService from '@/services/licenceService.js';
import { useAppStore } from '@/store/app.js';
import { useApplicationStore } from '@/store/application.js';
import { useNavBarStore } from '@/store/navBar.js';
import { useOrganizationStore } from '@/store/ccof/organization.js';
import { PATHS } from '@/utils/constants.js';
import rules from '@/utils/rules.js';

export default {
  components: { AppButton, AppPDFViewer, ApplicationPCFHeader, NavButton, ServiceDetails },
  mixins: [alertMixin, permissionsMixin],
  async beforeRouteLeave(_to, _from, next) {
    if (!this.readonly) {
      this.save(false);
    }
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
    ...mapState(useAppStore, ['programYearList', 'renewalYearLabel']),
    ...mapState(useApplicationStore, [
      'applicationMap',
      'applicationStatus',
      'applicationType',
      'formattedProgramYear',
      'isApplicationProcessing',
      'isApplicationSubmitted',
      'latestProgramYearId',
      'renewalApplicationCCOF',
    ]),
    ...mapState(useNavBarStore, ['nextPath', 'previousPath']),
    ...mapState(useOrganizationStore, ['organizationId', 'organizationName']),
    readonly() {
      return this.isApplicationSubmitted || isEmpty(this.fundingAgreement) || isEmpty(this.licences);
    },
    isNextDisabled() {
      return (
        this.readonly || !this.isValidForm || !this.isFundingAgreementConfirmed || !this.areLicenceDetailsConfirmed
      );
    },
    licenceToDisplay() {
      return [this.licences.find((l) => !l.recordEndDate) || this.licences[0]];
    },
  },
  async created() {
    this.PATHS = PATHS;
    this.rules = rules;
    await this.loadData();
  },
  methods: {
    ...mapActions(useApplicationStore, ['setIsApplicationProcessing']),
    async loadData() {
      try {
        this.setIsApplicationProcessing(true);
        this.isFundingAgreementConfirmed = this.renewalApplicationCCOF?.isFundingAgreementConfirmed;
        this.areLicenceDetailsConfirmed = this.renewalApplicationCCOF?.areLicenceDetailsConfirmed;
        await this.loadFundingAgreementPDF();
        await this.loadLicences();
      } catch (error) {
        console.error(error);
        this.setFailureAlert('An error occurred while loading. Please try again later.');
      } finally {
        this.setIsApplicationProcessing(false);
      }
    },
    async loadFundingAgreementPDF() {
      try {
        this.fundingAgreement = await FundingAgreementService.getFundingAgreementPDFByQuery({
          organizationId: this.organizationId,
          programYearId: this.$route.params.programYearGuid,
          fundingAgreementOrderNumber: 0,
        });
        this.fundingAgreement.pdfFile = `data:application/pdf;base64,${this.fundingAgreement.pdfFile}`;
      } catch (error) {
        if (error.response?.status === 404) {
          this.setFailureAlert('Funding Agreement not found for this application.');
        } else {
          throw error;
        }
      }
    },
    async loadLicences() {
      this.licences = await LicenceService.getLicences({
        fundingAgreementId: this.fundingAgreement?.fundingAgreementId,
      });
      if (isEmpty(this.licences)) {
        this.setFailureAlert('Licence not found for this application.');
      }
    },
    back() {
      this.$router.push(this.previousPath);
    },
    next() {
      this.$router.push(this.nextPath);
    },
    save(showNotification) {
      this.setIsApplicationProcessing(true);
      this.renewalApplicationCCOF.isFundingAgreementConfirmed = this.isFundingAgreementConfirmed;
      this.renewalApplicationCCOF.areLicenceDetailsConfirmed = this.areLicenceDetailsConfirmed;
      if (showNotification) {
        this.setSuccessAlert('Application saved successfully.');
      }
      this.setIsApplicationProcessing(false);
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
