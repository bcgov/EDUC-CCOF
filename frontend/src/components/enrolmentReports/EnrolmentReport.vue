<template>
  <v-container fluid class="px-12">
    <p class="text-h4 font-weight-bold">Enrolment Report</p>
    <div class="text-h6 text-primary">
      <p class="font-weight-bold mt-2">{{ currentFacility?.facilityName }}</p>
      <p>{{ currentFacility?.facilityAccountNumber }}</p>
      <p>Licence #: {{ currentFacility?.licenseNumber }}</p>
    </div>
    <div>
      <p class="py-2">Reporting month: {{ FULL_MONTH_NAMES[enrolmentReport?.month] }} {{ enrolmentReport?.year }}</p>
      <p>Version number: {{ getReportVersionText(enrolmentReport) }}</p>
    </div>

    <v-card class="pa-6 my-6">
      {{ loading }}
      {{ enrolmentReport }}
      <v-row class="border text-center">
        <v-col cols="2" class="close-column border bg-light-grey"></v-col>
        <v-col class="border bg-light-grey">0-18 Months</v-col>
        <v-col class="border bg-light-grey">18-36 Months</v-col>
        <v-col class="border bg-light-grey">3 Years to Kinder</v-col>
        <v-col class="border bg-light-grey">Kinder Before & After</v-col>
        <v-col class="border bg-light-grey">Grade 1 - 12 Years</v-col>
        <v-col cols="1" class="border bg-light-grey">Preschool</v-col>
      </v-row>
      <v-row class="border text-center">
        <v-col cols="2" class="close-column border bg-light-grey">Total Enrolled</v-col>
        <v-col v-for="i in 5" :key="i" class="border">
          <v-text-field type="number" variant="plain" density="compact" hide-details />
        </v-col>
        <v-col cols="1" class="border">
          <v-text-field type="number" variant="plain" density="compact" hide-details />
        </v-col>
      </v-row>
      <v-row class="border bg-light-grey text-center px-6 py-2">
        <p>
          Approved Parent Fees are the fees approved by the program. If any of these fees are incorrect, click
          <router-link :to="changeLandingUrl"> here </router-link>
          <a :href="changeLandingUrl" class="text-decoration-underline">here</a> to request a change.
        </p>
      </v-row>
      <v-row class="border bg-light-grey text-center">
        <v-col cols="2" class="close-column border bg-light-grey">Approved Parent Fees $</v-col>
        <v-col class="border bg-light-grey">1,000</v-col>
        <v-col class="border bg-light-grey">1,000</v-col>
        <v-col class="border bg-light-grey">1,000</v-col>
        <v-col class="border bg-light-grey">1,500</v-col>
        <v-col class="border bg-light-grey">1,500</v-col>
        <v-col cols="1" class="border bg-light-grey">1,500</v-col>
      </v-row>
      <v-row class="border text-center">
        <v-col cols="2" class="close-column border bg-light-grey">Frequency</v-col>
        <v-col v-for="i in 5" :key="i" class="border bg-light-grey">Monthly</v-col>
        <v-col cols="1" class="border bg-light-grey">Monthly</v-col>
      </v-row>
      <v-row class="border text-center">
        <v-col cols="2" class="close-column border bg-light-grey">Day</v-col>
        <v-col v-for="i in 5" :key="i" class="bg-light-grey py-0">
          <v-row>
            <v-col class="border py-0">4 Hours Or Less</v-col>
            <v-col class="border py-0">Over 4 Hours</v-col>
          </v-row>
        </v-col>
        <v-col cols="1" class="border bg-light-grey" />
      </v-row>
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
import { FULL_MONTH_NAMES, PATHS } from '@/utils/constants.js';
import { formatDateToStandardFormat } from '@/utils/format';

export default {
  name: 'EnrolmentReport',
  components: { AppButton, AppMultiSelectInput, AppTooltip, FiscalYearSlider, NavButton },
  mixins: [alertMixin],
  data() {
    return {
      loading: true,
      enrolmentReport: null,
    };
  },
  computed: {
    ...mapState(useAppStore, ['lookupInfo']),
    ...mapState(useApplicationStore, ['getFacilityListForPCFByProgramYearId', 'programYearId']),
    ...mapState(useOrganizationStore, ['organizationAccountNumber', 'organizationId', 'organizationName']),
    currentFacility() {
      const facilities = this.getFacilityListForPCFByProgramYearId(this.programYearId);
      return facilities?.find((item) => item.facilityId === this.enrolmentReport?.facilityId);
    },
    changeLandingUrl() {
      return PATHS.ROOT.CHANGE_LANDING;
    },
  },
  async created() {
    this.PATHS = PATHS;
    this.FULL_MONTH_NAMES = FULL_MONTH_NAMES;
    await this.loadEnrolmentReport();
  },
  methods: {
    formatDateToStandardFormat,
    async loadEnrolmentReport() {
      try {
        this.loading = true;
        console.log(this.$route.params);
        this.enrolmentReport = await EnrolmentReportService.getEnrolmentReport(this.$route.params.enrolmentReportId);
        this.enrolmentReport.isAdjustment = this.enrolmentReport.reportVersion > 1;
        console.log('DONE');
      } catch (error) {
        console.log(error);
        this.setFailureAlert('Failed to load enrolment report');
      } finally {
        this.loading = false;
      }
    },
    getReportVersionText(report) {
      const version = padString(report?.reportVersion, 2, '0');
      return report?.isAdjustment ? `${version}-Adjustment` : version;
    },
  },
};
</script>
<style scoped>
.border {
  border: 1px solid #5d5d5d;
}

.bg-light-grey {
  background-color: #f3f2f2;
}

:deep(.center-placeholder .v-field__input) {
  text-align: center;
}

:deep(.v-field__input) {
  text-align: center;
  padding: 0 !important;
}

.close-column {
  max-width: 225px;
}
</style>
