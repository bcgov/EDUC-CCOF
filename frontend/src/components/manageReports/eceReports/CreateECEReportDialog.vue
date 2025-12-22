<template>
  <AppDialog
    v-model="isDisplayed"
    title="Create ECE Report"
    max-width="1000"
    text-alignment="left"
    @close="closeDialog"
  >
    <template #content>
      <v-form ref="form" v-model="isValidForm" @submit.prevent="false">
        <v-row no-gutters class="pb-4">
          <v-col cols="12" md="4" lg="3">
            <p class="font-weight-bold py-1 pr-4">Select fiscal year:</p>
          </v-col>
          <v-col cols="12" md="8" lg="9" class="d-flex justify-start">
            <FiscalYearSlider
              :always-display="true"
              :readonly="loading"
              :default-program-year-id="currentProgramYearId"
              @select-program-year="selectProgramYear"
            />
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col cols="12" md="4" lg="3">
            <p class="font-weight-bold pt-6 pr-4">Select facility:</p>
          </v-col>
          <v-col cols="12" md="8" lg="9" class="d-flex justify-start">
            <v-select
              v-model.lazy="selectedFacilityId"
              :loading="loading"
              :disabled="loading"
              :items="facilityList"
              item-value="facilityId"
              item-title="facilityName"
              label="Select facility"
              variant="outlined"
              :rules="rules.required"
              class="mt-2 wrap-select text-wrap"
            >
              <template #no-data>
                <v-list-item>
                  <v-list-item-title>No available facilities.</v-list-item-title>
                </v-list-item>
              </template>
            </v-select>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col cols="12" md="4" lg="3">
            <p class="font-weight-bold pt-6 pr-4">Select reporting month:</p>
          </v-col>
          <v-col cols="12" md="8" lg="9" class="d-flex justify-start">
            <v-select
              v-model.lazy="selectedReportingMonth"
              :loading="loading"
              :disabled="loading"
              :items="allReportingMonths"
              item-title="label"
              item-value="value"
              label="Select reporting month"
              variant="outlined"
              :rules="rules.required"
              class="mt-2"
            >
              <template #no-data>
                <v-list-item>
                  <v-list-item-title>No available months.</v-list-item-title>
                </v-list-item>
              </template>
            </v-select>
          </v-col>
        </v-row>
      </v-form>
    </template>
    <template #button>
      <v-row justify="space-around">
        <v-col cols="12" sm="6" class="d-flex justify-center">
          <AppButton :primary="false" :loading="loading" min-width="180" @click="closeDialog"> Cancel </AppButton>
        </v-col>
        <v-col cols="12" sm="6" class="d-flex justify-center">
          <AppButton type="submit" :loading="loading" min-width="180" @click="submit"> Create Report </AppButton>
        </v-col>
      </v-row>
    </template>
  </AppDialog>
</template>

<script>
import { mapState } from 'pinia';
import { useAppStore } from '@/store/app.js';
import { useApplicationStore } from '@/store/application.js';
import { rules } from '@/utils/rules';

import { useOrganizationStore } from '@/store/ccof/organization';

import alertMixin from '@/mixins/alertMixin.js';
import AppButton from '@/components/guiComponents/AppButton.vue';
import AppDialog from '@/components/guiComponents/AppDialog.vue';
import FiscalYearSlider from '@/components/guiComponents/FiscalYearSlider.vue';
import ECEReportService from '@/services/eceReportService.js';
import { formatMonthYearToString } from '@/utils/format';

export default {
  name: 'CreateECEReportDialog',
  components: { AppButton, AppDialog, FiscalYearSlider },
  mixins: [alertMixin],
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    eceReports: {
      type: Array,
      default: () => [],
    },
  },
  emits: ['close', 'reload'],
  data() {
    return {
      loading: false,
      isDisplayed: false,
      isValidForm: false,
      selectedFacilityId: null,
      selectedReportingMonth: null,
      selectedProgramYear: null,
    };
  },
  computed: {
    ...mapState(useAppStore, ['lookupInfo', 'programYearList']),
    ...mapState(useApplicationStore, ['getFacilityListForPCFByProgramYearId', 'programYearId']),
    ...mapState(useOrganizationStore, ['organizationAccountNumber', 'organizationId', 'organizationName']),
    currentProgramYearId() {
      return this.programYearList?.newApp?.programYearId;
    },
    selectedProgramYearId() {
      return this.selectedProgramYear ? this.selectedProgramYear.programYearId : this.currentProgramYearId;
    },
    facilityList() {
      return this.getFacilityListForPCFByProgramYearId(this.selectedProgramYearId);
    },
    /*
    TODO
    - if a facility is created recently, need to check the ECE payment Eligibility start date. they cannot select month before that.
      if a facility has Mid-year Opt-out last date of funding, they cannot select month after that.
      Only display facility with current date is within Temp Approval Start and End Date or ECEWE Status is Complete Approved
    - current month is Dec 2025. they should not be able to open 2026/27 fiscal year, because there's nothing there.
      if current month is July 2026, they should only see from April to July 2026.
    */
    allReportingMonths() {
      const programYear = this.lookupInfo?.programYear?.list?.find(
        (year) => year.programYearId === this.selectedProgramYearId,
      );
      const existingReportMonths = this.eceReports
        .filter((report) => report.facilityId === this.selectedFacilityId)
        .map((report) => report.month);
      const startYear = new Date(programYear.intakeStart).getUTCFullYear();
      const endYear = new Date(programYear.intakeEnd).getUTCFullYear();
      const currentMonth = new Date().getMonth() + 1;
      const lastSixMonths = this.getLastSixMonths(currentMonth);
      console.log('lastSixMonths');
      console.log(lastSixMonths);
      console.log('existingReportMonths');
      console.log(this.eceReports);
      const availableMonths = lastSixMonths.filter((month) => !existingReportMonths.includes(month));
      return availableMonths.map((month) => {
        const year = month >= 4 ? startYear : endYear;
        return {
          label: formatMonthYearToString(month, year),
          value: { month, year },
        };
      });
    },
  },
  watch: {
    show: {
      handler(value) {
        this.isDisplayed = value;
      },
    },
    selectedProgramYearId: {
      handler() {
        this.selectedFacilityId = null;
        this.selectedReportingMonth = null;
      },
    },
    selectedFacilityId: {
      handler() {
        this.selectedReportingMonth = null;
      },
    },
  },
  created() {
    this.rules = rules;
  },
  methods: {
    loadECEWEFacilities() {
      try {
        this.loading = true;
        // this.eceReports = await ECEReportService.getECEReports({
        //   organizationId: this.organizationId,
        //   programYearId: this.selectedProgramYearId,
        // });
        // console.log(this.eceReports);
      } catch (error) {
        console.log(error);
        this.setFailureAlert('An error occurred while loading. Please try again later.');
      } finally {
        this.loading = false;
      }
    },
    // Returns the last 6 months (including currentMonth), handling year wrap-around
    getLastSixMonths(currentMonth) {
      const months = [];
      for (let offset = 5; offset >= 0; offset--) {
        let month = currentMonth - offset;
        if (month <= 0) {
          month += 12;
        }
        months.push(month);
      }
      return months;
    },
    closeDialog() {
      this.isDisplayed = false;
      this.$refs.form?.reset();
      this.$emit('close');
    },
    selectProgramYear(programYear) {
      this.selectedProgramYear = programYear;
    },
    async submit() {
      this.$refs.form?.validate();
      if (!this.isValidForm) return;
      try {
        this.loading = true;
        await ECEReportService.createECEReport({
          programYearId: this.selectedProgramYearId,
          facilityId: this.selectedFacilityId,
        });
        this.setSuccessAlert('ECE report created successfully.');
      } catch (error) {
        this.setFailureAlert('An error occurred while creating ECE report. Please try again later.');
        console.log(error);
      } finally {
        this.closeDialog();
        this.$emit('reload');
        this.loading = false;
      }
    },
  },
};
</script>
<style scoped>
/* dropdown items */
.wrap-select .v-list-item-title {
  white-space: normal;
  line-height: 1.3;
}

/* selected value */
.wrap-select .v-select__selection-text {
  white-space: normal;
}

/* Selected value inside the input */
.wrap-v-select .v-field__input {
  white-space: normal !important;
  line-height: 1.4;
}

/* Dropdown list items */
.wrap-v-select .v-list-item-title {
  white-space: normal !important;
  line-height: 1.4;
}

/* Prevent vertical clipping */
.wrap-v-select .v-field {
  align-items: flex-start;
}
</style>
