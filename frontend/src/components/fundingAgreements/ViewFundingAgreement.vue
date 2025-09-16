<template>
  <v-container fluid v-bind="$attrs" class="px-md-16">
    <h1>{{ fundingAgreementNumber }}</h1>
    <p>Carefully review your funding agreement.</p>

    <v-row class="mt-6" justify="center">
      <v-col cols="12" md="10" lg="8">
        <AppPDFViewer v-if="pdfFile" :pdf-file="pdfFile" />
        <v-skeleton-loader v-else type="image" height="800px" />
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

        <v-checkbox
          v-model="fundingAgreement.consentCheck"
          class="ml-3"
          color="primary"
          :disabled="isReadOnly || processing"
          label="I agree, consent and certify"
        />
        <v-text-field
          v-model="fundingAgreement.signedBy"
          variant="outlined"
          :disabled="isReadOnly || processing"
          label="Your Organization's Authorized Signing Authority"
        />
        <v-row class="mt-4" align="center" dense>
          <v-col cols="auto">
            <AppButton color="primary" @click="goBackToManageFundingAgreement"> Back </AppButton>
          </v-col>

          <v-col cols="auto" class="ml-4">
            <AppButton color="primary" :disabled="isSubmitDisabled" :loading="processing" @click="submit">
              Submit
            </AppButton>
          </v-col>
        </v-row>
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
  </v-container>
</template>

<script>
import AppButton from '@/components/guiComponents/AppButton.vue';
import AppDialog from '@/components/guiComponents/AppDialog.vue';
import AppPDFViewer from '@/components/guiComponents/AppPDFViewer.vue';

import alertMixin from '@/mixins/alertMixin.js';

import FundingAgreementService from '@/services/fundingAgreementService.js';
import { FUNDING_AGREEMENTS_STATUS, PATHS } from '@/utils/constants.js';

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
  },
  mixins: [alertMixin],
  data() {
    return {
      fundingAgreement: null,
      pdfFile: null,
      isLoading: false,
      processing: false,
      showSubmissionConfirmationDialog: false,
      signedBy: '',
    };
  },
  computed: {
    isReadOnly() {
      return READ_ONLY_STATUSES.includes(this.fundingAgreement?.externalStatus);
    },
    fundingAgreementNumber() {
      return this.fundingAgreement?.fundingAgreementNumber;
    },
    isDeclarationB() {
      return this.fundingAgreement?.fundingAgreementOrderNumber >= 0;
    },
    isSubmitDisabled() {
      const hasSignedBy = this.fundingAgreement?.signedBy?.trim().length > 0;
      return this.isReadOnly || this.processing || !this.fundingAgreement?.consentCheck || !hasSignedBy;
    },
  },
  async created() {
    await this.loadData();
  },
  methods: {
    async loadData() {
      try {
        this.isLoading = true;
        await this.loadFundingAgreement();
        await this.loadFundingAgreementPDF();
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
