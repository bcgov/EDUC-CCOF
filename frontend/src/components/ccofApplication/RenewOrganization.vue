<template>
  <v-skeleton-loader :loading="processing" type="table-tbody" class="mb-12">
    <v-container fluid class="mx-lg-16">
      <v-form ref="form" v-model="isValidForm">
        <ApplicationPCFHeader :program-year="renewalYearLabel" />
        <ApplicationChangeRequestInProgressAlert v-if="hasActiveChangeRequest" :loading="processing" class="my-8" />
        <v-card class="my-8 pa-8 pb-4">
          <p>Has your banking information changed?</p>
          <v-radio-group
            v-model="hasBankingInfoChanged"
            inline
            :disabled="hasActiveChangeRequest"
            :rules="rules.required"
          >
            <v-radio label="Yes" :value="true" />
            <v-radio label="No" :value="false" />
          </v-radio-group>
          <v-card v-if="hasBankingInfoChanged" rounded="0" class="mb-4">
            <v-card-title class="noticeAlert">
              <v-icon size="x-large" class="noticeAlertIcon">mdi-alert-octagon</v-icon>
              Do not continue.
            </v-card-title>
            <div class="px-8 py-4">
              <p>
                Once these changes have been processed, you may complete your {{ renewalYearLabel }} Program
                Confirmation Form.
              </p>
              <p class="py-2">
                Update your banking information by submitting the
                <a
                  href="https://www2.gov.bc.ca/assets/gov/british-columbians-our-governments/services-policies-for-government/internal-corporate-services/finance-forms/fin-312-direct-deposit-application.pdf"
                  target="_blank"
                >
                  Direct Deposit Application
                </a>
                by email to <a href="mailto:ccdda@gov.bc.ca" target="_blank">ccdda@gov.bc.ca.</a>
              </p>
              <p class="pb-2">
                You can also submit the form by mail to:<br />
                Child Care Operating Funding<br />
                PO Box 9965 Stn Prov Govt<br />
                Victoria BC V8W 9R4
              </p>
              <p>For any questions, call the program at 1-888-338-6622 (option 2)</p>
            </div>
          </v-card>
        </v-card>
      </v-form>
    </v-container>
  </v-skeleton-loader>
  <NavButton
    :is-next-displayed="true"
    :is-next-disabled="!isValidForm || hasBankingInfoChanged"
    :is-processing="processing"
    @previous="back"
    @next="next"
    @validate-form="validateForm"
  />
</template>
<script>
import { mapActions, mapState, mapWritableState } from 'pinia';
import ApplicationChangeRequestInProgressAlert from '@/components/util/ApplicationChangeRequestInProgressAlert.vue';
import ApplicationPCFHeader from '@/components/util/ApplicationPCFHeader.vue';
import NavButton from '@/components/util/NavButton.vue';
import { useAppStore } from '@/store/app.js';
import { useApplicationStore } from '@/store/application.js';
import { useReportChangesStore } from '@/store/reportChanges.js';
import { useOrganizationStore } from '@/store/ccof/organization.js';
import { APPLICATION_STATUSES, APPLICATION_TYPES, PATHS, pcfUrl } from '@/utils/constants.js';
import rules from '@/utils/rules.js';

export default {
  components: { ApplicationChangeRequestInProgressAlert, ApplicationPCFHeader, NavButton },
  data() {
    return {
      processing: false,
      isValidForm: true,
      hasBankingInfoChanged: null,
    };
  },
  computed: {
    ...mapState(useAppStore, ['programYearList', 'renewalYearLabel']),
    ...mapState(useApplicationStore, [
      'applicationStatus',
      'applicationType',
      'latestProgramYearId',
      'showApplicationTemplateV1',
    ]),
    ...mapState(useReportChangesStore, ['hasActiveChangeRequest']),
    ...mapWritableState(useApplicationStore, ['isRenewalBankingInfoComplete']),
    hasDraftRenewalApplication() {
      return (
        this.applicationStatus === APPLICATION_STATUSES.DRAFT && this.applicationType === APPLICATION_TYPES.RENEWAL
      );
    },
  },
  async created() {
    this.PATHS = PATHS;
    this.rules = rules;
    await this.init();
  },
  methods: {
    ...mapActions(useOrganizationStore, ['renewApplication']),
    ...mapActions(useReportChangesStore, ['getChangeRequestList']),
    async init() {
      try {
        this.processing = true;
        await this.getChangeRequestList();
        // Prevents users from creating a duplicate RENEWAL application if they click the browser's back arrow and try again.
        if (this.showApplicationTemplateV1 && this.hasDraftRenewalApplication) {
          this.back();
        }
      } catch (error) {
        console.error(error);
        this.setFailureAlert('An error occurred while loading. Please try again later.');
      } finally {
        this.processing = false;
      }
    },
    async next() {
      if (this.showApplicationTemplateV1) {
        this.processing = true;
        const nextProgramYear = this.programYearList?.list?.find(
          (el) => el.previousYearId === this.latestProgramYearId,
        );
        await this.renewApplication();
        this.$router.push(pcfUrl(PATHS.LICENSE_UPLOAD, nextProgramYear?.programYearId));
      } else {
        // TODO (vietle-cgi) - update this line whenever CMS add the isRenewalBankingInfoComplete field to Application entity
        this.isRenewalBankingInfoComplete = true;
        this.$router.push(pcfUrl(PATHS.CCOF_RENEWAL_FA, this.latestProgramYearId));
      }
    },
    validateForm() {
      this.$refs.form?.validate();
    },
    back() {
      this.$router.push(PATHS.ROOT.HOME);
    },
    goToChangeRequestHistory() {
      this.$router.push(`${PATHS.ROOT.CHANGE_LANDING}#change-request-history`);
    },
  },
};
</script>
