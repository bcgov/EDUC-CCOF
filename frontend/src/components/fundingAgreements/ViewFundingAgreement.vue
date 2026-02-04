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
    <h4 id="declaration" class="lg-px-10">Declaration</h4>
    <v-skeleton-loader :loading="isLoading" type="table-tbody">
      <div>
        <v-col cols="12" class="pt-0">
          <div class="pa-lg-7 pa-5 overflow-y-auto grey-div-with-border">
            <template v-if="isDeclarationB">
              <p>
                I do hereby certify that I am the <strong>authorized signing authority</strong> and that all of the
                information provided is true and complete to the best of my knowledge and belief.
              </p>
              <p>
                I consent to the Ministry contacting other branches within the Ministry and other Province ministries to
                validate the accuracy of any information that I have provided.
              </p>
              <p>
                By completing and submitting this Program Confirmation Form (the Form) electronically, I hereby confirm
                that I have carefully read this Form and the corresponding terms and conditions of the Child Care
                Operating Funding Agreement (the Funding Agreement) and that I agree to be bound by such terms and
                conditions. I further confirm that by clicking “I agree” below, I represent and warrant that:
              </p>

              <ol class="declarationBList" type="a">
                <li>
                  I am the authorized representative and signing authority of the Provider as named in the Funding
                  Agreement (the Provider);
                </li>
                <li>
                  I have authority to submit the Form on behalf of the Provider and that by clicking “I agree”, I do
                  hereby bind the Provider to the terms and conditions of the Funding Agreement if the Province accepts
                  this Form and enrols the Provider in any or all of the Child Care Operating Funding Program, the
                  CCFRI, or the ECE Wage Enhancement;
                </li>
                <li>
                  All information provided in the Form or otherwise in support of the Provider to receive funding under
                  the Funding Agreement is true and complete to the best of my knowledge and belief. I understand and
                  acknowledge that providing false or misleading information either on the Form or otherwise to the
                  Province to obtain any funding under the Funding Agreement or otherwise failing to comply with the
                  Funding Agreement could result in certain penalties or repayment obligations, or both, under any or
                  all of the Early Learning and Child Care Act, any successor legislation, or the Funding Agreement;
                </li>
                <li>
                  If I have applied for and been approved by the Province to enrol in the ECE Wage Enhancement, the
                  Provider has taken all actions required under any collective agreement to which it is a party to
                  ensure it is:
                </li>
              </ol>
              <v-row style="padding-left: 90px">
                <v-col cols="12">
                  i. permitted to apply for the ECE Wage Enhancement for any of its unionized Early Childhood Educators
                  (ECEs); and</v-col
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
                Provider may make in anticipation of enrolment in either of these initiatives and any pre-payments made
                are at the Provider's own risk.
              </p>
            </template>
          </div>
        </v-col>
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

import FundingAgreementService from '@/services/fundingAgreementService.js';
import LicenceService from '@/services/licenceService.js';
import { useAuthStore } from '@/store/auth.js';
import { FUNDING_AGREEMENTS_STATUS, FUNDING_AGREEMENT_EXTERNAL_STATUSES, PATHS } from '@/utils/constants.js';

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
    fundingAgreementNumber() {
      return this.fundingAgreement?.fundingAgreementNumber;
    },
    isDeclarationB() {
      return this.fundingAgreement?.fundingAgreementOrderNumber >= 0;
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
      return this.licences.length <= 1 ? this.licences : this.licences.filter((l) => !l.recordEndDate);
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
