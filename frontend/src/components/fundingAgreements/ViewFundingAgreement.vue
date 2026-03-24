<template>
  <v-container fluid v-bind="$attrs" class="px-md-16">
    <h1 class="mb-6">Licence and Service Details Record</h1>

    <v-skeleton-loader v-if="isLoading" type="list-item" class="mb-6" />
    <v-expansion-panels v-else-if="licences.length" multiple class="mb-6">
      <v-expansion-panel v-for="licence in licenceToDisplay" :key="licence.licenceId">
        <v-expansion-panel-title>
          <strong>{{ licence.serviceDeliveryDetails[0].facilityName }} - {{ licence.facilityAccountNumber }}</strong>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <ServiceDetails :licence="licence" />
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
    <div v-else class="mb-6">No active or approved licences found.</div>

    <h1 class="mb-6">Funding Agreement {{ fundingAgreementNumber }}</h1>
    <p>Carefully review your funding agreement.</p>

    <v-row class="mt-6" justify="center">
      <v-col cols="12" md="10" lg="8">
        <v-skeleton-loader v-if="isLoading || !pdfFile" type="image" height="800px" />
        <AppPDFViewer v-else :pdf-file="pdfFile" />
      </v-col>
    </v-row>

    <br />
    <br />
    <h4 v-if="isSignatureRequired" id="declaration" class="lg-px-10">Declaration</h4>
    <v-skeleton-loader v-if="isSignatureRequired" :loading="isLoading" type="table-tbody">
      <div>
        <FundingAgreementDeclarationTextV2 v-if="showDeclarationV2" />
        <FundingAgreementDeclarationTextV1 v-else />
        <template v-if="displaySignFundingAgreementSection">
          <v-checkbox
            v-model="fundingAgreement.consentCheck"
            class="ml-3"
            color="primary"
            :disabled="isReadOnly || processing"
            label="I agree, consent and certify"
          />
          <v-text-field
            v-model.trim="fundingAgreement.signedBy"
            variant="outlined"
            :disabled="isReadOnly || processing"
            label="Your Organization's Authorized Signing Authority"
          />
        </template>
        <AppDialog
          v-model="showSubmissionConfirmationDialog"
          persistent
          max-width="510px"
          title="Submission Complete"
          @close="goBackToManageFundingAgreement"
        >
          <template #content>
            <p>
              Your funding agreement has been signed. Refer to the Funding Agreements in Account Management for updates
              to your agreement.
            </p>
          </template>

          <template #button>
            <div class="center-button">
              <AppButton color="primary" @click="goBackToManageFundingAgreement">
                Return to Funding Agreements
              </AppButton>
            </div>
          </template>
        </AppDialog>
      </div>
    </v-skeleton-loader>
    <NavButton
      :is-submit-displayed="displaySignFundingAgreementSection"
      :is-submit-disabled="isSubmitDisabled"
      :is-processing="processing || isLoading"
      @previous="goBackToManageFundingAgreement"
      @submit="submit"
    />
  </v-container>
</template>

<script>
import { mapState } from 'pinia';
import AppButton from '@/components/guiComponents/AppButton.vue';
import AppDialog from '@/components/guiComponents/AppDialog.vue';
import AppPDFViewer from '@/components/guiComponents/AppPDFViewer.vue';
import ServiceDetails from '@/components/licences/ServiceDetails.vue';
import NavButton from '@/components/util/NavButton.vue';

import alertMixin from '@/mixins/alertMixin.js';
import permissionsMixin from '@/mixins/permissionsMixin.js';

import FundingAgreementDeclarationTextV1 from '@/components/fundingAgreements/fundingAgreementDeclarationTextVersions/FundingAgreementDeclarationTextV1.vue';
import FundingAgreementDeclarationTextV2 from '@/components/fundingAgreements/fundingAgreementDeclarationTextVersions/FundingAgreementDeclarationTextV2.vue';
import FundingAgreementService from '@/services/fundingAgreementService.js';
import LicenceService from '@/services/licenceService.js';
import { useAuthStore } from '@/store/auth.js';
import {
  DECLARATION_TEXT_VERSIONS,
  FUNDING_AGREEMENTS_STATUS,
  FUNDING_AGREEMENT_EXTERNAL_STATUSES,
  PATHS,
} from '@/utils/constants.js';

const READ_ONLY_STATUSES = [
  FUNDING_AGREEMENTS_STATUS.DRAFTED_WITH_MINISTRY,
  FUNDING_AGREEMENTS_STATUS.REPLACED,
  FUNDING_AGREEMENTS_STATUS.ACTIVE,
  FUNDING_AGREEMENTS_STATUS.APPROVED,
  FUNDING_AGREEMENTS_STATUS.EXPIRED,
  FUNDING_AGREEMENTS_STATUS.CANCELLED,
  FUNDING_AGREEMENTS_STATUS.TERMINATED,
];

export default {
  name: 'ViewFundingAgreement',
  components: {
    AppButton,
    AppDialog,
    AppPDFViewer,
    FundingAgreementDeclarationTextV1,
    FundingAgreementDeclarationTextV2,
    NavButton,
    ServiceDetails,
  },
  mixins: [alertMixin, permissionsMixin],
  data() {
    return {
      fundingAgreement: null,
      pdfFile: null,
      isLoading: false,
      processing: false,
      showSubmissionConfirmationDialog: false,
      licences: [],
    };
  },
  computed: {
    ...mapState(useAuthStore, ['isMinistryUser']),
    isReadOnly() {
      if (this.isMinistryUser) return true;
      return READ_ONLY_STATUSES.includes(this.fundingAgreement?.externalStatusText);
    },
    showDeclarationV2() {
      return !this.isReadOnly || this.fundingAgreement?.declarationVersion === DECLARATION_TEXT_VERSIONS.V2;
    },
    fundingAgreementNumber() {
      return this.fundingAgreement?.fundingAgreementNumber;
    },
    isSubmitDisabled() {
      return (
        this.isReadOnly || this.processing || !this.fundingAgreement?.consentCheck || !this.fundingAgreement?.signedBy
      );
    },
    displaySignFundingAgreementSection() {
      const status = this.fundingAgreement?.externalStatusText;
      const hasPerm = this.hasPermission(this.PERMISSIONS.SIGN_FUNDING_AGREEMENT);
      return hasPerm || status !== FUNDING_AGREEMENTS_STATUS.DRAFTED_PROVIDER_ACTION_REQUIRED;
    },
    licenceToDisplay() {
      const faStart = new Date(this.fundingAgreement.fundingAgreementStartDate);
      return this.licences.filter((l) => {
        const start = new Date(l.recordStartDate);
        const end = l.recordEndDate ? new Date(l.recordEndDate) : null;
        return start <= faStart && (!end || end > faStart);
      });
    },
    isSignatureRequired() {
      return !this.fundingAgreement?.allowWithoutSignature;
    },
  },
  async created() {
    await this.loadData();
  },
  methods: {
    async loadData() {
      this.isLoading = true;
      try {
        await Promise.all([
          this.loadFundingAgreement(),
          this.loadFundingAgreementPDF(),
          this.loadFundingAgreementLicences(),
        ]);
      } catch (error) {
        console.error('Failed to load Funding Agreement', error);
      } finally {
        this.isLoading = false;
      }
    },

    async loadFundingAgreement() {
      this.fundingAgreement = await FundingAgreementService.getFundingAgreement(this.$route.params.fundingAgreementId);
    },

    async loadFundingAgreementPDF() {
      try {
        const pdfFile = await FundingAgreementService.getFundingAgreementPDF(this.$route.params.fundingAgreementId);
        this.pdfFile = `data:application/pdf;base64,${pdfFile}`;
      } catch (error) {
        console.error('Failed to load PDF', error);
      }
    },

    async loadFundingAgreementLicences() {
      try {
        this.licences = await LicenceService.getLicences({
          fundingAgreementId: this.$route.params.fundingAgreementId,
        });
        this.sortLicencesByFacilityName();
      } catch (error) {
        console.error('Failed to load licences by Funding Agreement', error);
      }
    },

    sortLicencesByFacilityName() {
      this.licences.sort((a, b) => {
        const nameA = a.serviceDeliveryDetails[0]?.facilityName?.toLowerCase();
        const nameB = b.serviceDeliveryDetails[0]?.facilityName?.toLowerCase();
        return nameA.localeCompare(nameB);
      });
    },

    goBackToManageFundingAgreement() {
      this.$router.push(`${PATHS.ROOT.MANAGE_ORG_FACILITIES}?tab=funding-agreement-tab`);
    },

    async submit() {
      try {
        this.processing = true;
        const payload = {
          consentCheck: this.fundingAgreement.consentCheck,
          signedOn: new Date().toISOString(),
          signedBy: this.fundingAgreement.signedBy,
          externalStatusCode: FUNDING_AGREEMENT_EXTERNAL_STATUSES.DRAFTED_WITH_MINISTRY,
          declarationVersion: DECLARATION_TEXT_VERSIONS.V2,
        };
        await FundingAgreementService.updateFundingAgreement(this.fundingAgreement.fundingAgreementId, payload);
        this.showSubmissionConfirmationDialog = true;
      } catch (error) {
        this.setFailureAlert('Failed to update Funding Agreement');
        console.error(error);
      } finally {
        this.processing = false;
      }
    },
  },
};
</script>
<style scoped>
li {
  padding-bottom: 12px;
}
.center-button {
  display: flex;
  justify-content: center;
  width: 100%;
}
</style>
