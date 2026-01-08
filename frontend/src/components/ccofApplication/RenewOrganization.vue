<template>
  <v-form ref="form" v-model="isValidForm">
    <v-container>
      <div class="pa-10 text-h5 text-center">
        Child Care Operating Funding Program - {{ formattedNextProgramYearName }} Program Confirmation Form
      </div>

      <div v-if="processing">
        <v-skeleton-loader max-height="475px" :loading="processing" type="image, image" />
        <br /><br />
        <v-skeleton-loader max-height="475px" :loading="processing" type="image, image" />
      </div>

      <div v-else>
        <v-row>
          <v-card v-if="isSomeChangeRequestActive()" width="100%" class="mx-3 my-10">
            <v-row>
              <v-col class="py-0">
                <v-card-title class="py-1 noticeAlert">
                  <span style="float: left">
                    <v-icon size="x-large" class="py-1 px-3 noticeAlertIcon"> mdi-alert-octagon </v-icon>
                  </span>
                  You have a change request for the {{ currentYearLabel }} funding term still in progress.
                </v-card-title>
              </v-col>
            </v-row>
            <v-card-text>
              The {{ renewalYearLabel }} Program Confirmation Form cannot be submitted until the change is complete.<br /><br />
              <br />

              <v-btn dark class="blueButton mb-10" :loading="processing" @click="goToChangeRequestHistory()">
                View My Changes
              </v-btn>
            </v-card-text>
          </v-card>
        </v-row>
        <v-row justify="space-around">
          <v-card class="cc-top-level-card justify-center pa-4" width="800">
            <v-card-text>
              Do your current licence and service details match the information found in Schedule A of your most recent
              Funding Agreement?
            </v-card-text>
            <v-row>
              <v-col class="d-flex justify-center">
                <v-radio-group v-model="fundingGroup" inline :disabled="isSomeChangeRequestActive()">
                  <v-radio label="Yes" value="true" />
                  <v-radio label="No" value="false" />
                </v-radio-group>
              </v-col>
            </v-row>
            <v-row>
              <v-card v-if="fundingGroup == 'false'" width="100%" class="mx-3">
                <v-row>
                  <v-col class="py-0">
                    <v-card-title class="py-1 noticeAlert">
                      <span style="float: left">
                        <v-icon size="x-large" class="py-1 px-3 noticeAlertIcon"> mdi-alert-octagon </v-icon>
                      </span>
                      Do not continue.
                    </v-card-title>
                  </v-col>
                </v-row>
                <v-card-text>
                  If your current licence and service details do not match the information found in schedule A of your
                  most recent funding agreement then please submit a change request.
                  <br /><br />

                  Please submit a change request using the link below:
                  <br />
                  <br />
                  <router-link :to="goToChangeDashboard()">
                    <span style="color: #3289ec; text-underline: black"
                      ><u>Go to Report a Change. This will bring you to a different page.</u></span
                    >
                  </router-link>
                </v-card-text>
              </v-card>
            </v-row>
          </v-card>
        </v-row>
        <v-row justify="space-around">
          <v-card class="cc-top-level-card justify-center pa-4" width="800">
            <v-card-text> Has your banking information changed? </v-card-text>
            <v-row>
              <v-col class="d-flex justify-center">
                <v-radio-group v-model="bankingGroup" inline :disabled="isSomeChangeRequestActive()">
                  <v-radio label="Yes" value="true" />
                  <v-radio label="No" value="false" />
                </v-radio-group>
              </v-col>
            </v-row>
            <v-row>
              <v-card v-if="bankingGroup == 'true'" width="100%" class="mx-3">
                <v-row>
                  <v-col class="py-0">
                    <v-card-title class="py-1 noticeAlert">
                      <span style="float: left">
                        <v-icon size="x-large" class="py-1 px-3 noticeAlertIcon"> mdi-alert-octagon </v-icon>
                      </span>
                      Do not continue.
                    </v-card-title>
                  </v-col>
                </v-row>
                <v-card-text>
                  Once these changes have been processed, you may complete your {{ renewalYearLabel }} Program
                  Confirmation Form.<br /><br />
                  Update your banking information by submitting the
                  <a
                    href="https://www2.gov.bc.ca/assets/gov/british-columbians-our-governments/services-policies-for-government/internal-corporate-services/finance-forms/fin-312-direct-deposit-application.pdf"
                    target="_blank"
                  >
                    Direct Deposit Application
                  </a>
                  by email to <a href="mailto:ccdda@gov.bc.ca" target="_blank">ccdda@gov.bc.ca.</a><br />You can also
                  submit the form by mail to:<br />
                  Child Care Operating Funding<br />
                  PO Box 9965 Stn Prov Govt<br />
                  Victoria BC V8W 9R4<br /><br />
                  For any questions, call the program at 1-888-338-6622 (option 2)
                </v-card-text>
              </v-card>
            </v-row>
          </v-card>
        </v-row>
      </div>

      <NavButton
        :is-next-displayed="true"
        :is-next-disabled="!(fundingGroup == 'true' && bankingGroup == 'false')"
        :is-processing="processing"
        @previous="back"
        @next="next"
        @validate-form="validateForm"
      />
    </v-container>
  </v-form>
</template>
<script>
import { mapActions, mapState } from 'pinia';

import NavButton from '@/components/util/NavButton.vue';
import { useAppStore } from '@/store/app.js';
import { useApplicationStore } from '@/store/application.js';
import { useReportChangesStore } from '@/store/reportChanges.js';
import { useOrganizationStore } from '@/store/ccof/organization.js';
import { isAnyChangeRequestActive } from '@/utils/common.js';
import { PATHS, pcfUrl } from '@/utils/constants.js';
import { formatFiscalYearName } from '@/utils/format';
import rules from '@/utils/rules.js';

export default {
  components: { NavButton },
  data() {
    return {
      rules,
      processing: false,
      isValidForm: true,
      fundingGroup: undefined,
      bankingGroup: undefined,
    };
  },
  computed: {
    ...mapState(useApplicationStore, ['applicationStatus', 'applicationType', 'latestProgramYearId']),
    ...mapState(useAppStore, ['programYearList', 'renewalYearLabel', 'currentYearLabel']),
    ...mapState(useReportChangesStore, ['changeRequestStore']),
    nextProgramYear() {
      return this.programYearList?.list?.find((el) => el.previousYearId == this.latestProgramYearId);
    },
    formattedNextProgramYearName() {
      return formatFiscalYearName(this.nextProgramYear?.name);
    },
  },
  async created() {
    this.processing = true;
    if (this.applicationStatus === 'DRAFT' && this.applicationType === 'RENEW') {
      this.$router.push(PATHS.ROOT.HOME);
    }
    await this.getChangeRequestList();
    this.processing = false;
  },
  methods: {
    ...mapActions(useOrganizationStore, ['renewApplication']),
    ...mapActions(useReportChangesStore, ['getChangeRequestList']),
    async next() {
      this.processing = true;
      await this.renewApplication();
      this.$router.push(pcfUrl(PATHS.LICENSE_UPLOAD, this.nextProgramYear?.programYearId));
    },
    isSomeChangeRequestActive() {
      //Status of : "Submitted" "Action Required";
      if (!this.changeRequestStore) {
        return true;
      }
      return isAnyChangeRequestActive(this.changeRequestStore);
    },
    validateForm() {
      this.$refs.form?.validate();
    },
    back() {
      this.$router.push(PATHS.ROOT.HOME);
    },
    goToChangeRequestHistory() {
      this.$router.push(PATHS.ROOT.CHANGE_LANDING + '#change-request-history');
    },
    goToChangeDashboard() {
      return PATHS.ROOT.CHANGE_LANDING;
    },
  },
};
</script>
