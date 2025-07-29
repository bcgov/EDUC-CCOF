<template>
  <v-container fluid class="px-12">
    <p class="text-h4 font-weight-bold">Enrolment Report</p>
    <div class="text-h6 text-primary mt-2 mb-8">
      <p class="font-weight-bold my-2">{{ organizationName }}</p>
      <p>{{ organizationAccountNumber }}</p>
    </div>
    <p class="my-8">View, create and update monthly enrolment reports for your facility(ies).</p>
    <v-card class="pa-6">
      <div class="mb-8">
        <v-row no-gutters class="py-2">
          <v-col cols="12" md="4" lg="2">
            <p class="font-weight-bold py-1 pr-4">Select fiscal year:</p>
          </v-col>
          <v-col cols="12" md="8" lg="10" xl="8" class="d-flex justify-start">
            <FiscalYearSlider :always-display="true" :readonly="loading" @select-program-year="selectProgramYear" />
          </v-col>
        </v-row>
        <v-row no-gutters class="py-2">
          <v-col cols="12" md="4" lg="2">
            <p class="font-weight-bold pt-6 pr-4">Select reporting month:</p>
          </v-col>
          <v-col cols="12" md="8" xl="6" class="d-flex justify-start">
            <AppMultiSelectInput
              v-model.lazy="selectedReportingMonths"
              :loading="loading"
              :disabled="loading"
              :items="allReportingMonths"
              item-title="label"
              item-value="value"
              label="Select reporting month"
              hide-details
              clearable
              class="mt-2"
            />
          </v-col>
        </v-row>
        <v-row no-gutters class="py-2">
          <v-col cols="12" md="4" lg="2">
            <p class="font-weight-bold pt-6 pr-4">Select facility:</p>
          </v-col>
          <v-col cols="12" md="8" xl="6" class="d-flex justify-start">
            <AppMultiSelectInput
              v-model.lazy="selectedFacilities"
              :loading="loading"
              :disabled="loading"
              :items="facilityList"
              item-value="facilityId"
              item-title="facilityName"
              label="Select facility"
              clearable
              hide-details
              class="mt-2"
            />
          </v-col>
        </v-row>
      </div>
      <v-skeleton-loader :loading="loading" type="table-tbody">
        <v-data-table
          :headers="enrolmentReportsHeaders"
          :items="filteredEnrolmentReports"
          :items-per-page="20"
          :mobile="null"
          mobile-breakpoint="lg"
          class="elevation-2"
        >
          <template #item.reportVersion="{ item }">
            {{ item.versionText }}
            <AppTooltip
              v-if="item.isAdjustment"
              tooltip-content="An Adjustment is a modified version of a submitted Enrolment Report."
            />
          </template>
          <template #item.reportingMonth="{ item }"> {{ formatMonthYearToString(item?.month, item?.year) }} </template>
          <template #item.submissionDeadline="{ item }">
            {{ formatDateToStandardFormat(item.submissionDeadline) }}
          </template>
          <!-- TODO (vietle-cgi) - review v-if logic once the ER status/action ticket is ready -->
          <template #item.actions="{ item }">
            <v-row class="action-buttons justify-end justify-lg-start">
              <AppButton
                v-if="true"
                :loading="loading"
                :primary="false"
                size="medium"
                @click="goToEnrolmentReport(item)"
              >
                Edit
              </AppButton>
              <template v-else>
                <AppButton :loading="loading" :primary="false" size="medium" @click="console.log(item)">
                  View
                </AppButton>
                <AppButton :loading="loading" :primary="false" size="medium" @click="console.log(item)">
                  Adjust
                </AppButton>
              </template>
            </v-row>
          </template>
        </v-data-table>
      </v-skeleton-loader>
    </v-card>
    <v-row class="pt-12">
      <v-col>
        <NavButton @previous="$router.push(PATHS.ROOT.HOME)" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { isEmpty } from 'lodash';
import moment from 'moment';
import { mapState } from 'pinia';

import AppButton from '@/components/guiComponents/AppButton.vue';
import AppMultiSelectInput from '@/components/guiComponents/AppMultiSelectInput.vue';
import AppTooltip from '@/components/guiComponents/AppTooltip.vue';
import FiscalYearSlider from '@/components/guiComponents/FiscalYearSlider.vue';
import NavButton from '@/components/util/NavButton.vue';

import alertMixin from '@/mixins/alertMixin.js';

import EnrolmentReportService from '@/services/enrolmentReportService.js';
import { useAppStore } from '@/store/app.js';
import { useApplicationStore } from '@/store/application.js';
import { useOrganizationStore } from '@/store/ccof/organization.js';

import { padString } from '@/utils/common.js';
import { PATHS } from '@/utils/constants.js';
import { formatDateToStandardFormat, formatMonthYearToString } from '@/utils/format';

export default {
  name: 'ViewEnrolmentReports',
  components: { AppButton, AppMultiSelectInput, AppTooltip, FiscalYearSlider, NavButton },
  mixins: [alertMixin],
  data() {
    return {
      loading: true,
      selectedFacilities: [],
      selectedReportingMonths: [],
      selectedProgramYear: null,
      enrolmentReportsHeaders: [
        { title: 'Version Number', key: 'reportVersion' },
        { title: 'Facility ID', key: 'facilityAccountNumber' },
        { title: 'Facility Name', key: 'facilityName' },
        { title: 'Licence Number', key: 'licenceNumber' },
        { title: 'Reporting Month', key: 'reportingMonth' },
        { title: 'Submission Deadline', key: 'submissionDeadline' },
        { title: 'CCOF Base Funding Status', key: 'ccofStatus' },
        { title: 'CCFRI Funding Status', key: 'ccfriStatus' },
        { title: 'Actions', key: 'actions', width: '12%', sortable: false },
      ],
      enrolmentReports: [],
    };
  },
  computed: {
    ...mapState(useAppStore, ['lookupInfo']),
    ...mapState(useApplicationStore, ['getFacilityListForPCFByProgramYearId', 'programYearId']),
    ...mapState(useOrganizationStore, ['organizationAccountNumber', 'organizationId', 'organizationName']),
    facilityList() {
      return this.getFacilityListForPCFByProgramYearId(this.selectedProgramYearId);
    },
    allReportingMonths() {
      const reportingMonths = [];
      const programYear = this.lookupInfo?.programYear?.list?.find(
        (year) => year.programYearId === this.selectedProgramYearId,
      );
      const startYear = moment(programYear?.intakeStart).year();
      const endYear = moment(programYear?.intakeEnd).year();
      for (let month = 4; month < 13; month++) {
        reportingMonths.push({
          label: `${formatMonthYearToString(month, startYear)}`,
          value: {
            month: month,
            year: startYear,
          },
        });
      }
      for (let month = 1; month < 4; month++) {
        reportingMonths.push({
          label: `${formatMonthYearToString(month, endYear)}`,
          value: {
            month: month,
            year: endYear,
          },
        });
      }
      return reportingMonths;
    },
    selectedProgramYearId() {
      return this.selectedProgramYear ? this.selectedProgramYear.programYearId : this.programYearId;
    },
    filteredEnrolmentReports() {
      if (isEmpty(this.enrolmentReports)) return [];
      return this.enrolmentReports.filter((report) => {
        const isMonthSelected = this.selectedReportingMonths?.some(
          (item) => Number(report.month) === item.month && Number(report.year) === item.year,
        );
        const isFacilitySelected = this.selectedFacilities?.includes(report.facilityId);
        return isMonthSelected && isFacilitySelected;
      });
    },
  },
  watch: {
    selectedProgramYearId: {
      async handler() {
        await this.loadData();
      },
    },
  },
  async created() {
    this.PATHS = PATHS;
    await this.loadData();
  },
  methods: {
    formatDateToStandardFormat,
    formatMonthYearToString,
    async loadData() {
      this.selectedFacilities = this.facilityList?.map((facility) => facility.facilityId);
      this.selectedReportingMonths = this.allReportingMonths?.map((report) => report.value);
      await this.loadEnrolmentReports();
    },
    async loadEnrolmentReports() {
      try {
        this.loading = true;
        this.enrolmentReports = await EnrolmentReportService.getEnrolmentReports(
          this.organizationId,
          this.selectedProgramYearId,
        );
        this.enrolmentReports?.forEach((report) => {
          const facility = this.facilityList?.find((item) => item.facilityId === report.facilityId);
          report.facilityAccountNumber = facility?.facilityAccountNumber;
          report.facilityName = facility?.facilityName;
          report.licenceNumber = facility?.licenseNumber;
          report.reportingMonth = `${report?.year}-${padString(report?.month, 2, '0')}`; // Format as YYYY-MM to support sorting
          // TODO (vietle-cgi) - review/update these statuses once CMS team added them to ER entity
          report.ccofStatus = facility?.ccofBaseFundingStatus;
          report.ccfriStatus = facility?.ccfriStatus;
        });
        this.sortEnrolmentReports();
      } catch (error) {
        console.log(error);
        this.setFailureAlert('Failed to load enrolment reports');
      } finally {
        this.loading = false;
      }
    },
    sortEnrolmentReports() {
      // TODO (vietle-cgi) - review/update this sorting order once CMS team add the CCOF status to ER entity
      this.enrolmentReports?.sort((a, b) => {
        // Sort by Reporting Month (asc - oldest to newest)
        if (a.reportingMonth !== b.reportingMonth) {
          return a.reportingMonth < b.reportingMonth ? -1 : 1;
        }

        // Sort by Facility ID (facilityAccountNumber) (desc)
        if (a.facilityAccountNumber !== b.facilityAccountNumber) {
          return a.facilityAccountNumber > b.facilityAccountNumber ? -1 : 1;
        }

        // Sort by Report Version (desc - last adjustment to the original report)
        const versionA = a.reportVersion ?? 0;
        const versionB = b.reportVersion ?? 0;
        return versionB - versionA;
      });
    },
    selectProgramYear(programYear) {
      this.selectedProgramYear = programYear;
    },
    goToEnrolmentReport(report) {
      this.$router.push(`${PATHS.ROOT.ENROLMENT_REPORTS}/${report.enrolmentReportId}`);
    },
  },
};
</script>
<style scoped>
.action-buttons {
  gap: 8px;
  padding: 10px;
}
</style>
