<template>
  <v-skeleton-loader :loading="isApplicationProcessing" type="table-tbody" class="mb-12">
    <v-container fluid class="mx-lg-16">
      <v-form ref="form" v-model="isValidForm">
        <ApplicationPCFHeader :program-year="renewalYearLabel" />
        <ApplicationChangeRequestInProgressAlert
          v-if="hasActiveChangeRequest"
          :loading="isApplicationProcessing"
          class="my-8"
        />
        <v-card class="my-8 pa-8 pb-4">
          <p>Has your banking information changed?</p>
          <v-radio-group
            v-model="hasBankingInfoChanged"
            inline
            :disabled="hasActiveChangeRequest"
            :rules="rules.required"
          >
            <v-radio label="Yes" :value="YES_NO_VALUES.YES" />
            <v-radio label="No" :value="YES_NO_VALUES.NO" />
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
import { mapActions, mapState } from 'pinia';
import ApplicationChangeRequestInProgressAlert from '@/components/util/ApplicationChangeRequestInProgressAlert.vue';
import ApplicationPCFHeader from '@/components/util/ApplicationPCFHeader.vue';
import NavButton from '@/components/util/NavButton.vue';
import alertMixin from '@/mixins/alertMixin.js';
import permissionsMixin from '@/mixins/permissionsMixin.js';
import ApplicationService from '@/services/applicationService';
import { useAppStore } from '@/store/app.js';
import { useApplicationStore } from '@/store/application.js';
import { useNavBarStore } from '@/store/navBar.js';
import { useReportChangesStore } from '@/store/reportChanges.js';
import { PATHS, YES_NO_VALUES } from '@/utils/constants.js';
import rules from '@/utils/rules.js';

export default {
  components: { ApplicationChangeRequestInProgressAlert, ApplicationPCFHeader, NavButton },
  mixins: [alertMixin, permissionsMixin],
  async beforeRouteLeave(_to, _from, next) {
    await this.save(false);
    next();
  },
  data() {
    return {
      isValidForm: false,
      hasBankingInfoChanged: null,
    };
  },
  computed: {
    ...mapState(useAppStore, ['programYearList', 'renewalYearLabel']),
    ...mapState(useApplicationStore, [
      'applicationId',
      'isApplicationProcessing',
      'isApplicationSubmitted',
      'renewalApplicationCCOF',
    ]),
    ...mapState(useNavBarStore, ['nextPath']),
    ...mapState(useReportChangesStore, ['hasActiveChangeRequest']),
    readonly() {
      return this.isApplicationSubmitted || this.hasActiveChangeRequest;
    },
    isNextDisabled() {
      return this.readonly || !this.isValidForm || this.hasBankingInfoChanged === YES_NO_VALUES.YES;
    },
  },
  async created() {
    this.YES_NO_VALUES = YES_NO_VALUES;
    this.rules = rules;
    await this.loadData();
  },
  methods: {
    ...mapActions(useApplicationStore, ['setIsApplicationProcessing']),
    ...mapActions(useReportChangesStore, ['getChangeRequestList']),
    async loadData() {
      try {
        this.setIsApplicationProcessing(true);
        this.hasBankingInfoChanged = this.renewalApplicationCCOF?.hasBankingInfoChanged;
        await this.getChangeRequestList();
      } catch (error) {
        console.error(error);
        this.setFailureAlert('An error occurred while loading. Please try again later.');
      } finally {
        this.setIsApplicationProcessing(false);
      }
    },
    back() {
      this.$router.push(PATHS.ROOT.HOME);
    },
    next() {
      this.$router.push(this.nextPath);
    },
    async save(showNotification) {
      try {
        if (this.readonly) return;
        this.setIsApplicationProcessing(true);
        if (this.renewalApplicationCCOF.hasBankingInfoChanged !== this.hasBankingInfoChanged) {
          this.renewalApplicationCCOF.hasBankingInfoChanged = this.hasBankingInfoChanged;
          await ApplicationService.updateApplication(this.applicationId, {
            hasBankingInfoChanged: this.hasBankingInfoChanged,
          });
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
  },
};
</script>
