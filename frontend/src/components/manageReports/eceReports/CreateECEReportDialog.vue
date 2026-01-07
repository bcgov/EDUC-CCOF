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
              :default-program-year-id="selectedProgramYearId"
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
              :items="filteredFacilities"
              item-value="facilityId"
              label="Select facility"
              variant="outlined"
              :rules="rules.required"
              class="mt-2"
            >
              <template #item="{ props, item }">
                <!-- remove default title -->
                <v-list-item v-bind="{ ...props, title: undefined }">
                  <v-list-item-title>
                    {{ item.raw.facilityAccountNumber ?? EMPTY_PLACEHOLDER }}, {{ item.raw.facilityName }}
                  </v-list-item-title>
                </v-list-item>
              </template>
              <template #selection="{ item }">
                {{ item.raw.facilityAccountNumber ?? EMPTY_PLACEHOLDER }}, {{ item.raw.facilityName }}
              </template>
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
            <p class="font-weight-bold pt-6 pr-4">Select month of service:</p>
          </v-col>
          <v-col cols="12" md="8" lg="9" class="d-flex justify-start">
            <v-select
              v-model.lazy="selectedReportingMonth"
              :loading="loading"
              :disabled="isSelectMonthDisabled"
              :hide-details="isSelectMonthDisabled"
              :items="allReportingMonths.get(selectedFacilityId) || []"
              item-title="label"
              item-value="value"
              label="Select month of service"
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
          <AppButton type="submit" :loading="loading" :disabled="!isValidForm" min-width="180" @click="submit">
            Create Report
          </AppButton>
        </v-col>
      </v-row>
    </template>
  </AppDialog>
</template>

<script>
import { isEmpty } from 'lodash';
import { mapState } from 'pinia';

import alertMixin from '@/mixins/alertMixin.js';
import AppButton from '@/components/guiComponents/AppButton.vue';
import AppDialog from '@/components/guiComponents/AppDialog.vue';
import FiscalYearSlider from '@/components/guiComponents/FiscalYearSlider.vue';
import ApplicationService from '@/services/applicationService';
import ECEReportService from '@/services/eceReportService.js';
import { useAppStore } from '@/store/app.js';
import { useApplicationStore } from '@/store/application.js';
import { useAuthStore } from '@/store/auth.js';
import { useOrganizationStore } from '@/store/ccof/organization';
import {
  ECE_REPORT_TYPES,
  ECEWE_FACILITY_STATUSES,
  EMPTY_PLACEHOLDER,
  FISCAL_YEAR_MONTHS,
  OPT_STATUSES,
  PATHS,
} from '@/utils/constants';
import { formatFirstDateOfMonth, formatMonthYearToString, formatUTCtoPacificTime } from '@/utils/format';
import { rules } from '@/utils/rules';

export default {
  name: 'CreateECEReportDialog',
  components: { AppButton, AppDialog, FiscalYearSlider },
  mixins: [alertMixin],
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['close'],
  data() {
    return {
      loading: false,
      isDisplayed: false,
      isValidForm: false,
      eceReports: [],
      eceweFacilities: new Map(),
      selectedFacilityId: null,
      selectedReportingMonth: null,
      selectedProgramYear: null,
    };
  },
  computed: {
    ...mapState(useAppStore, ['lookupInfo', 'programYearList']),
    ...mapState(useApplicationStore, ['getFacilityListForPCFByProgramYearId']),
    ...mapState(useAuthStore, ['userInfo']),
    ...mapState(useOrganizationStore, ['organizationId']),
    selectedProgramYearId() {
      return this.selectedProgramYear?.programYearId;
    },
    defaultFacilityId() {
      return this.filteredFacilities?.length === 1 ? this.filteredFacilities[0].facilityId : null;
    },
    defaultReportingMonth() {
      if (!this.selectedFacilityId) {
        return null;
      }
      const reportingMonths = this.allReportingMonths.get(this.selectedFacilityId);
      return isEmpty(reportingMonths) ? null : reportingMonths[reportingMonths.length - 1]?.value;
    },
    isSelectedProgramYearInFuture() {
      return this.userInfo.serverTime < this.selectedProgramYear?.intakeStart;
    },
    facilities() {
      return this.getFacilityListForPCFByProgramYearId(this.selectedProgramYearId);
    },
    filteredFacilities() {
      return this.facilities
        ?.filter((facility) => {
          const ecewe = this.eceweFacilities.get(facility.facilityId);
          const reportingMonths = this.allReportingMonths.get(facility.facilityId);
          return ecewe?.optInECEWE === OPT_STATUSES.OPT_IN && !isEmpty(reportingMonths);
        })
        .sort((a, b) =>
          (a.facilityAccountNumber ?? '').localeCompare(b.facilityAccountNumber ?? '', undefined, {
            sensitivity: 'base',
          }),
        );
    },
    isSelectMonthDisabled() {
      return this.loading || !this.selectedFacilityId;
    },
    reportingMonthCandidates() {
      if (!this.selectedProgramYear) {
        return [];
      }
      const startYear = formatUTCtoPacificTime(this.selectedProgramYear.intakeStart)?.year;
      const endYear = formatUTCtoPacificTime(this.selectedProgramYear.intakeEnd)?.year;
      const currentMonth = formatUTCtoPacificTime(this.userInfo?.serverTime)?.month;
      return this.getTrailingMonths(currentMonth).map((month) => {
        const year = month >= FISCAL_YEAR_MONTHS[0] ? startYear : endYear;
        return {
          month,
          year,
          firstDate: formatFirstDateOfMonth(month, year),
        };
      });
    },
    /*
      CCFRI-6645 - Reporting month rules:
      - Only allow months within the selected fiscal year (April to March).
      - If a future fiscal year is selected, return an empty array
        (e.g. Dec 2025 cannot create reports for FY 2026/27).
      - Users can create reports for the current month and for any of the previous 6 months. (getTrailingMonths - maxMonths defaults to DEFAULT_MAX_MONTHS)
        (e.g. Jul 2025 to Jan 2026).
      - Months before the ECE payment eligibility start date are not displayed.
      - Months after the mid-year opt-out date are not displayed.
      - Facility must be either:
        - Fully approved (ECEWE status = Complete Approved), or
        - Temporarily approved with the current date within the temp approval window.

      Additional constraints:
      - Exclude months that already have a report created for the facility.
    */
    allReportingMonths() {
      const reportingMonths = new Map();
      if (this.isSelectedProgramYearInFuture) {
        return reportingMonths;
      }
      for (const facility of this.facilities ?? []) {
        reportingMonths.set(facility.facilityId, this.getReportingMonthsByFacilityId(facility.facilityId));
      }
      return reportingMonths;
    },
  },
  watch: {
    show: {
      handler(value) {
        this.isDisplayed = value;
      },
    },
    selectedProgramYearId: {
      async handler() {
        this.$refs.form?.resetValidation();
        await this.loadData();
        this.selectedFacilityId = this.defaultFacilityId;
        this.selectedReportingMonth = null;
      },
    },
    selectedFacilityId: {
      handler() {
        this.selectedReportingMonth = this.defaultReportingMonth;
      },
    },
  },
  created() {
    this.DEFAULT_MAX_MONTHS = 7;
    this.EMPTY_PLACEHOLDER = EMPTY_PLACEHOLDER;
    this.rules = rules;
    this.selectedProgramYear = this.programYearList?.newApp; // default to current program year
  },
  methods: {
    async loadData() {
      try {
        this.loading = true;
        await Promise.all([this.loadECEReports(), this.loadECEWEFacilities()]);
      } catch (error) {
        console.error(error);
        this.setFailureAlert('An error occurred while loading. Please try again later.');
      } finally {
        this.loading = false;
      }
    },
    async loadECEReports() {
      this.eceReports = await ECEReportService.getECEReports({
        organizationId: this.organizationId,
        programYearId: this.selectedProgramYearId,
      });
    },
    async loadECEWEFacilities() {
      const application = this.userInfo?.applications?.find(
        (item) => item.ccofProgramYearId === this.selectedProgramYearId,
      );
      const response = await ApplicationService.getAdjudicationECEWEFacilities(application?.applicationId);
      this.eceweFacilities = new Map((response ?? []).map((f) => [f.facilityId, f]));
    },
    getTrailingMonths(currentMonth, maxMonths = this.DEFAULT_MAX_MONTHS) {
      if (!currentMonth) {
        return [];
      }
      const currentIndex = FISCAL_YEAR_MONTHS.indexOf(currentMonth);
      const startIndex = Math.max(0, currentIndex - (maxMonths - 1));
      return FISCAL_YEAR_MONTHS.slice(startIndex, currentIndex + 1);
    },
    getReportingMonthsByFacilityId(facilityId) {
      const eceweFacility = this.eceweFacilities.get(facilityId);
      if (!eceweFacility) {
        return [];
      }
      const existingReportMonths = new Set(
        this.eceReports.filter((report) => report.facilityId === facilityId).map((report) => report.month),
      );
      const midYearOptOutDate = eceweFacility.midYearOptOutDate ? `${eceweFacility.midYearOptOutDate}-01` : null;
      const paymentEligibilityStartDate = eceweFacility.paymentEligibilityStartDate
        ? `${eceweFacility.paymentEligibilityStartDate}-01`
        : null;
      const isFullyApproved = eceweFacility.statusCode === ECEWE_FACILITY_STATUSES.COMPLETE_APPROVED;
      const reportingMonths = this.reportingMonthCandidates.filter((item) => {
        const hasNoReportCreated = !existingReportMonths.has(item.month);
        const isTempApproved =
          eceweFacility.tempApprovalStartDate &&
          eceweFacility.tempApprovalEndDate &&
          item.firstDate >= eceweFacility.tempApprovalStartDate &&
          item.firstDate <= eceweFacility.tempApprovalEndDate;
        const isECEWEFacilityApproved = isFullyApproved || isTempApproved;
        const isAfterPaymentEligibilityStartDate = paymentEligibilityStartDate
          ? item.firstDate >= paymentEligibilityStartDate
          : true;
        const isBeforeMidYearOptOutDate = midYearOptOutDate ? item.firstDate < midYearOptOutDate : true;
        return (
          isECEWEFacilityApproved &&
          isAfterPaymentEligibilityStartDate &&
          isBeforeMidYearOptOutDate &&
          hasNoReportCreated
        );
      });
      return reportingMonths.map((item) => {
        return {
          label: formatMonthYearToString(item.month, item.year),
          value: { month: item.month, year: item.year },
        };
      });
    },
    selectProgramYear(programYear) {
      this.selectedProgramYear = this.lookupInfo?.programYear?.list?.find(
        (item) => item.programYearId === programYear.programYearId,
      );
    },
    closeDialog() {
      this.isDisplayed = false;
      this.$refs.form?.reset();
      this.$emit('close');
    },
    async submit() {
      if (!this.isValidForm) return;
      try {
        this.loading = true;
        const response = await ECEReportService.createECEReport({
          organizationId: this.organizationId,
          facilityId: this.selectedFacilityId,
          programYearId: this.selectedProgramYearId,
          month: this.selectedReportingMonth?.month,
          year: this.selectedReportingMonth?.year,
          reportType: ECE_REPORT_TYPES.BASE,
        });
        const eceReportId = response?.data;
        await this.$router.push(`${PATHS.ROOT.MONTHLY_ECE_REPORTS}/${eceReportId}`);
        this.setSuccessAlert('ECE report created successfully.');
        this.closeDialog();
      } catch (error) {
        this.setFailureAlert('An error occurred while creating ECE report. Please try again later.');
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
