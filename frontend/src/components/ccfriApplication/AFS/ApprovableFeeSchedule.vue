<template>
  <v-form ref="form" v-model="isValidForm">
    <v-container fluid>
      <v-row justify="space-around">
        <v-card class="mx-12 mb-12 pa-8">
          <div class="text-center">
            <div class="text-h5">
              Child Care Operating Funding Program - {{ formattedProgramYear }} Program Confirmation Form
            </div>
            <div class="text-h5 mt-6"><strong>Approvable Fee Schedule</strong></div>
          </div>
          <FacilityHeader
            v-if="currentFacility"
            :facility-account-number="currentFacility?.facilityAccountNumber"
            :facility-name="currentFacility?.facilityName"
            :license-number="currentFacility?.licenseNumber"
            class="mb-10"
          />
          <div class="mt-8">
            <div class="mb-4">
              Thank you for working with us while we completed the assessment of your application for the Child Care Fee
              Reduction Initiative (CCFRI). This schedule is to inform you of the approvable parent fees for your
              facility.
            </div>
            <div>
              Based on the information you provided and the policies in the
              <a
                :href="getFundingUrl(programYearId)"
                target="_blank"
                rel="noopener"
                class="ccfri-funding-guideline-link"
              >
                {{ formattedProgramYear }} CCFRI Funding Guidelines
              </a>
              <span>, we can approve the following parent fee schedule:</span>
            </div>
          </div>

          <ApprovableParentFeesCards
            :loading="isEmpty(afs)"
            :approvable-fee-schedules="afs?.approvableFeeSchedules"
            class="my-4"
          />
          <div class="mb-8">
            <div class="mb-4">Next steps:</div>
            <ul class="pl-4">
              <li>
                <strong class="text-decoration-underline">Accept the fee schedule</strong>: By selecting "I accept", you
                confirm that you agree to the approvable fee schedule as indicated above. These fees will replace your
                requested Parent Fees and are the maximum Parent Fees you may charge.
              </li>
              <li>
                <strong class="text-decoration-underline">Upload Supporting Documents</strong>: By selecting "I want to
                upload supporting documents", you confirm that you decline the approvable fee schedule and have new
                information to submit for review, This will require additional processing time for your application.
              </li>
              <li>
                <strong class="text-decoration-underline">Decline the fee schedule</strong>: By selecting "I decline",
                you confirm that you decline the approvable fee schedule and confirm your decision not to participate in
                the Child Care Fee Reduction Initiative (CCFRI). Your facility will remain eligible to receive Child
                Care Operating Funding Base Funding and may re-apply to CCFRI at any time.
              </li>
            </ul>
            <div class="mt-2">
              Please call us at 1-888-338-6622 (Option 2) if you have any questions or require assistance.
            </div>
          </div>
          <v-skeleton-loader :loading="isEmpty(afs)" type="table-tbody">
            <v-container fluid class="pa-0">
              <v-card elevation="2" class="pa-4">
                <div class="mb-2">
                  Please select one of the following options regarding the approvable fee schedule:
                </div>
                <v-radio-group v-model="afs.afsStatus" :rules="rules.required" :disabled="isReadOnly" color="primary">
                  <v-radio label="I accept" :value="AFS_STATUSES.ACCEPT" />
                  <div v-if="afs?.afsStatus === AFS_STATUSES.ACCEPT" class="text-body-2 pl-2">
                    After submission, please wait for a notification confirming your approval to participate in CCFRI.
                  </div>
                  <v-radio label="I want to upload supporting documents" :value="AFS_STATUSES.UPLOAD_DOCUMENTS" />
                  <v-radio label="I decline" :value="AFS_STATUSES.DECLINE" />
                  <div v-if="afs?.afsStatus === AFS_STATUSES.DECLINE" class="text-body-2 pl-2">
                    After submission please wait to receive confirmation from the ministry on the results of your CCFRI
                    application.
                  </div>
                </v-radio-group>
              </v-card>
            </v-container>
          </v-skeleton-loader>
        </v-card>
      </v-row>
      <NavButton
        :is-next-displayed="true"
        :is-save-displayed="true"
        :is-save-disabled="isReadOnly"
        :is-next-disabled="!isFormComplete"
        :is-processing="processing"
        @previous="back"
        @next="next"
        @validate-form="validateForm"
        @save="save(true)"
      />
    </v-container>
  </v-form>
</template>

<script>
import { mapState, mapActions } from 'pinia';
import { isEmpty } from 'lodash';

import ApprovableParentFeesCards from '@/components/ccfriApplication/AFS/ApprovableParentFeesCards.vue';
import FacilityHeader from '@/components/guiComponents/FacilityHeader.vue';
import NavButton from '@/components/util/NavButton.vue';

import alertMixin from '@/mixins/alertMixin.js';

import { useAppStore } from '@/store/app.js';
import { useApplicationStore } from '@/store/application.js';
import { useCcfriAppStore } from '@/store/ccfriApp.js';
import { useNavBarStore } from '@/store/navBar.js';

import { AFS_STATUSES } from '@/utils/constants.js';
import rules from '@/utils/rules.js';

export default {
  name: 'ApprovableFeeSchedule',
  components: { ApprovableParentFeesCards, FacilityHeader, NavButton },
  mixins: [alertMixin],
  async beforeRouteLeave(_to, _from, next) {
    await this.save(false);
    next();
  },
  data() {
    return {
      afs: {},
      isValidForm: false,
      processing: false,
    };
  },
  computed: {
    ...mapState(useAppStore, ['getFundingUrl']),
    ...mapState(useApplicationStore, ['formattedProgramYear', 'isApplicationSubmitted', 'programYearId']),
    ...mapState(useCcfriAppStore, ['approvableFeeSchedules']),
    ...mapState(useNavBarStore, ['navBarList', 'nextPath', 'previousPath']),
    currentFacility() {
      return this.navBarList.find((el) => el.ccfriApplicationId == this.$route.params.urlGuid);
    },
    // Note: CCFRI-3752 - AFS for change request is not in scope at this time.
    isReadOnly() {
      return isEmpty(this.afs) || this.processing || (this.isApplicationSubmitted && !this.currentFacility?.unlockAfs);
    },
    isFormComplete() {
      return this.isValidForm;
    },
  },
  watch: {
    approvableFeeSchedules: {
      handler() {
        this.reloadAfs();
      },
    },
    '$route.params.urlGuid': {
      handler() {
        this.reloadAfs();
      },
    },
  },
  created() {
    this.rules = rules;
    this.AFS_STATUSES = AFS_STATUSES;
    this.reloadAfs();
  },
  methods: {
    ...mapActions(useCcfriAppStore, ['updateApplicationCCFRI']),
    ...mapActions(useNavBarStore, ['setNavBarAfsComplete']),
    isEmpty,
    reloadAfs() {
      this.afs = this.approvableFeeSchedules?.find((item) => item.ccfriApplicationId === this.$route.params.urlGuid);
    },
    next() {
      this.$router.push(this.nextPath);
    },
    validateForm() {
      this.$refs.form?.validate();
    },
    back() {
      this.$router.push(this.previousPath);
    },
    // TODO (vietle-cgi) - CCFRI-3756 - work in progress
    async save(showMessage) {
      try {
        if (this.isReadOnly) return;
        this.processing = true;
        const payload = {
          afsStatus: this.afs?.afsStatus,
        };
        await this.updateApplicationCCFRI(this.$route.params.urlGuid, payload);
        this.setNavBarAfsComplete({ ccfriId: this.$route.params.urlGuid, complete: this.isFormComplete });
        if (showMessage) {
          this.setSuccessAlert('Changes Successfully Saved');
        }
      } catch (error) {
        console.log(error);
        this.setFailureAlert('An error occurred while saving. Please try again later.');
      } finally {
        this.processing = false;
      }
    },
  },
};
</script>
<style scoped>
.ccfri-funding-guideline-link {
  display: inline-block;
  text-decoration: underline;
}

:deep(.v-label) {
  opacity: 1;
}
</style>
