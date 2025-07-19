<template>
  <v-container fluid class="scroll-wrapper px-8 px-xl-12">
    <div v-if="loading" align="center">
      <v-progress-circular indeterminate size="100" :width="6" color="#003366" class="min-height-screen" />
    </div>
    <template v-else>
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
      <div :class="tableStyle" :style="{ '--input-font-size': inputFontSize }">
        <v-card variant="outlined" class="pa-0 my-6" min-width="1700px">
          <v-row no-gutters class="border-bottom text-center">
            <v-col class="close-column border-right bg-light-grey"></v-col>
            <v-col class="border-right bg-light-grey">0-18 Months</v-col>
            <v-col class="border-right bg-light-grey">18-36 Months</v-col>
            <v-col class="border-right bg-light-grey">3 Years to Kinder</v-col>
            <v-col class="border-right bg-light-grey">Kinder Before & After</v-col>
            <v-col class="border-right bg-light-grey">Grade 1 - 12 Years</v-col>
            <v-col v-if="isGroup" cols="1" class="bg-light-grey">Preschool</v-col>
          </v-row>
          <v-row no-gutters class="border-bottom text-center">
            <v-col class="close-column border-right bg-light-grey d-flex align-center justify-center">
              Total Enrolled
            </v-col>
            <v-col class="border-right table-cell">
              <AppNumberInput v-model="enrolmentReport.totalEnrolled0To18" maxLength="3" :disabled="false" />
            </v-col>
            <v-col class="border-right table-cell">
              <AppNumberInput v-model="enrolmentReport.totalEnrolled18To36" maxLength="3" :disabled="false" />
            </v-col>
            <v-col class="border-right table-cell">
              <AppNumberInput v-model="enrolmentReport.totalEnrolled3YK" maxLength="3" :disabled="false" />
            </v-col>
            <v-col class="border-right table-cell">
              <AppNumberInput v-model="enrolmentReport.totalEnrolledOOSCK" maxLength="3" :disabled="false" />
            </v-col>
            <v-col class="border-right table-cell">
              <AppNumberInput v-model="enrolmentReport.totalEnrolledOOSCG" maxLength="3" :disabled="false" />
            </v-col>
            <v-col v-if="isGroup" cols="1" class="table-cell">
              <AppNumberInput v-model="enrolmentReport.totalEnrolledPre" maxLength="3" :disabled="false" />
            </v-col>
          </v-row>
          <v-row no-gutters class="border-bottom bg-light-grey text-center px-8 py-3">
            <p>
              Approved Parent Fees are the fees approved by the program. If any of these fees are incorrect, click
              <router-link :to="PATHS.ROOT.CHANGE_LANDING" class="text-decoration-underline">here</router-link> to
              request a change.
            </p>
          </v-row>
          <v-row no-gutters class="bg-light-grey border-bottom text-center">
            <v-col class="close-column border-right">Approved Parent Fees $</v-col>
            <v-col class="border-right">
              {{ formatDecimalNumber(enrolmentReport.approvedParentFees0To18) }}
            </v-col>
            <v-col class="border-right">
              {{ formatDecimalNumber(enrolmentReport.approvedParentFees18To36) }}
            </v-col>
            <v-col class="border-right">
              {{ formatDecimalNumber(enrolmentReport.approvedParentFees3YK) }}
            </v-col>
            <v-col class="border-right">
              {{ formatDecimalNumber(enrolmentReport.approvedParentFeesOOSCK) }}
            </v-col>
            <v-col class="border-right">
              {{ formatDecimalNumber(enrolmentReport.approvedParentFeesOOSCG) }}
            </v-col>
            <v-col v-if="isGroup" cols="1">
              {{ formatDecimalNumber(enrolmentReport.approvedParentFeesPre) }}
            </v-col>
          </v-row>
          <v-row no-gutters class="bg-light-grey border-bottom text-center">
            <v-col class="close-column border-right">Frequency</v-col>
            <v-col class="border-right">
              {{ getParentFeesFrequency(enrolmentReport.approvedParentFeesFrequency0To18) }}
            </v-col>
            <v-col class="border-right">
              {{ getParentFeesFrequency(enrolmentReport.approvedParentFeesFrequency18To36) }}
            </v-col>
            <v-col class="border-right">
              {{ getParentFeesFrequency(enrolmentReport.approvedParentFeesFrequency3YK) }}
            </v-col>
            <v-col class="border-right">
              {{ getParentFeesFrequency(enrolmentReport.approvedParentFeesFrequencyOOSCK) }}
            </v-col>
            <v-col class="border-right">
              {{ getParentFeesFrequency(enrolmentReport.approvedParentFeesFrequencyOOSCG) }}
            </v-col>
            <v-col v-if="isGroup" cols="1">
              {{ getParentFeesFrequency(enrolmentReport.approvedParentFeesFrequencyPre) }}
            </v-col>
          </v-row>
          <v-row no-gutters class="text-center bg-light-grey">
            <v-col class="close-column border-right">Day</v-col>
            <v-col v-for="i in 5" :key="i" class="border-right">
              <v-row no-gutters>
                <v-col class="border-right">4 Hours Or Less</v-col>
                <v-col>Over 4 Hours</v-col>
              </v-row>
            </v-col>
            <v-col v-if="isGroup" cols="1" />
          </v-row>
          <v-row
            v-for="(dailyEnrolment, rowIndex) in dailyEnrolments"
            :key="dailyEnrolment.dailyEnrolmentId"
            no-gutters
            :class="{
              'border-bottom': rowIndex < dailyEnrolments.length - 1,
              'border-top': rowIndex === 0,
              'bg-light-yellow': dailyEnrolment.dayType > DAY_TYPES.WEEKDAY,
            }"
          >
            <v-col class="close-column border-right bg-light-grey d-flex align-center justify-center">
              <!-- Perfectly centered day number -->
              <span class="day-number">{{ dailyEnrolment.day }}</span>

              <!-- Absolutely positioned day label that stays inside the column -->
              <span class="day-label">
                {{ getDayOfWeek(dailyEnrolment.day, enrolmentReport?.month, enrolmentReport?.year) }}
              </span>
            </v-col>
            <v-col>
              <v-row no-gutters>
                <v-col class="border-right table-cell">
                  <AppNumberInput v-model="dailyEnrolment.less0To18" maxLength="3" :disabled="false" />
                </v-col>
                <v-col class="border-right table-cell">
                  <AppNumberInput v-model="dailyEnrolment.over0To18" maxLength="3" :disabled="false" />
                </v-col>
              </v-row>
            </v-col>
            <v-col>
              <v-row no-gutters>
                <v-col class="border-right table-cell">
                  <AppNumberInput v-model="dailyEnrolment.less18To36" maxLength="3" :disabled="false" />
                </v-col>
                <v-col class="border-right table-cell">
                  <AppNumberInput v-model="dailyEnrolment.over18To36" maxLength="3" :disabled="false" />
                </v-col>
              </v-row>
            </v-col>
            <v-col>
              <v-row no-gutters>
                <v-col class="border-right table-cell">
                  <AppNumberInput v-model="dailyEnrolment.less3YK" maxLength="3" :disabled="false" />
                </v-col>
                <v-col class="border-right table-cell">
                  <AppNumberInput v-model="dailyEnrolment.over3YK" maxLength="3" :disabled="false" />
                </v-col>
              </v-row>
            </v-col>
            <v-col>
              <v-row no-gutters>
                <v-col class="border-right table-cell">
                  <AppNumberInput v-model="dailyEnrolment.lessOOSCG" maxLength="3" :disabled="false" />
                </v-col>
                <v-col class="border-right table-cell">
                  <AppNumberInput v-model="dailyEnrolment.overOOSCG" maxLength="3" :disabled="false" />
                </v-col>
              </v-row>
            </v-col>
            <v-col>
              <v-row no-gutters>
                <v-col class="border-right table-cell">
                  <AppNumberInput v-model="dailyEnrolment.lessOOSCK" maxLength="3" :disabled="false" />
                </v-col>
                <v-col class="border-right table-cell">
                  <AppNumberInput v-model="dailyEnrolment.overOOSCK" maxLength="3" :disabled="false" />
                </v-col>
              </v-row>
            </v-col>
            <v-col v-if="isGroup" cols="1">
              <v-row no-gutters>
                <v-col class="table-cell">
                  <AppNumberInput v-model="dailyEnrolment.lessPre" maxLength="3" :disabled="false" />
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card>
      </div>
    </template>
  </v-container>
  <EnrolmentReportNavButtons
    :is-save-displayed="true"
    :is-next-displayed="true"
    @previous="$router.push(PATHS.ROOT.HOME)"
  />
</template>

<script>
import { isEmpty } from 'lodash';
import moment from 'moment';
import { mapState } from 'pinia';

import AppButton from '@/components/guiComponents/AppButton.vue';
import AppMultiSelectInput from '@/components/guiComponents/AppMultiSelectInput.vue';
import AppNumberInput from '@/components/guiComponents/AppNumberInput.vue';
import AppTooltip from '@/components/guiComponents/AppTooltip.vue';
import FiscalYearSlider from '@/components/guiComponents/FiscalYearSlider.vue';
import EnrolmentReportNavButtons from '@/components/enrolmentReports/EnrolmentReportNavButtons.vue';

import alertMixin from '@/mixins/alertMixin.js';

import EnrolmentReportService from '@/services/enrolmentReportService.js';
import { useAppStore } from '@/store/app.js';
import { useApplicationStore } from '@/store/application.js';
import { useOrganizationStore } from '@/store/ccof/organization.js';

import { getDayOfWeek, padString } from '@/utils/common.js';
import {
  DAY_TYPES,
  FULL_MONTH_NAMES,
  ORGANIZATION_PROVIDER_TYPES,
  PARENT_FEE_FREQUENCIES,
  PATHS,
} from '@/utils/constants.js';
import { formatDateToStandardFormat, formatDecimalNumber } from '@/utils/format';
import rules from '@/utils/rules.js';

export default {
  name: 'EnrolmentReport',
  components: {
    AppButton,
    AppMultiSelectInput,
    AppNumberInput,
    AppTooltip,
    FiscalYearSlider,
    EnrolmentReportNavButtons,
  },
  mixins: [alertMixin],
  data() {
    return {
      loading: true,
      enrolmentReport: {},
      dailyEnrolments: [],
    };
  },
  computed: {
    ...mapState(useAppStore, ['lookupInfo']),
    ...mapState(useApplicationStore, ['getFacilityListForPCFByProgramYearId', 'programYearId']),
    ...mapState(useOrganizationStore, ['organizationAccountNumber', 'organizationId', 'organizationName']),
    isGroup() {
      return this.enrolmentReport?.organizationProviderType !== ORGANIZATION_PROVIDER_TYPES.GROUP;
    },
    currentFacility() {
      const facilities = this.getFacilityListForPCFByProgramYearId(this.programYearId);
      return facilities?.find((item) => item.facilityId === this.enrolmentReport?.facilityId);
    },
    tableStyle() {
      let tableStyle = 'card-scroll-wrapper';
      if (this.$vuetify.display.smAndDown) {
        tableStyle += ' font-xsmall';
      } else {
        tableStyle += ' font-small';
      }
      return tableStyle;
    },
    inputFontSize() {
      return this.$vuetify.display.smAndDown ? '12px' : '14px';
    },
  },
  async created() {
    window.scrollTo(0, 0);
    this.DAY_TYPES = DAY_TYPES;
    this.FULL_MONTH_NAMES = FULL_MONTH_NAMES;
    this.PATHS = PATHS;
    this.rules = rules;
    await this.loadData();
  },
  methods: {
    formatDateToStandardFormat,
    formatDecimalNumber,
    getDayOfWeek,
    async loadData() {
      try {
        this.loading = true;
        // console.log(this.$route.params);
        this.enrolmentReport = await EnrolmentReportService.getEnrolmentReport(this.$route.params.enrolmentReportId);
        this.enrolmentReport.isAdjustment = this.enrolmentReport.reportVersion > 1;
        this.dailyEnrolments = await EnrolmentReportService.getDailyEnrolments(this.$route.params.enrolmentReportId);
        // console.log(this.dailyEnrolments);
        // console.log('DONE');
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

    verifyValue(value) {
      return value != null || value < 1000;
    },

    getParentFeesFrequency(frequency) {
      switch (frequency) {
        case PARENT_FEE_FREQUENCIES.MONTHLY:
          return 'Monthly';
        case PARENT_FEE_FREQUENCIES.WEEKLY:
          return 'Weekly';
        case PARENT_FEE_FREQUENCIES.DAILY:
          return 'Daily';
        default:
          return null;
      }
    },
  },
};
</script>
<style scoped>
:deep(.v-field__input) {
  font-size: var(--input-font-size);
}

.table-cell {
  padding: 0px 0px;
}

.table-cell:hover {
  box-shadow: inset 0 0 0 2px #3399ff;
}

:deep(.table-cell input:focus-visible) {
  box-shadow:
    inset 0 0 0 2px #003366,
    0 0 0 2px rgba(0, 51, 102, 0.2);
  background-color: white;
}

.table-text {
  font-size: 1rem;
}

.table-text-medium {
  font-size: 12px;
}

.table-text-small {
  font-size: 10px;
}

.border-top {
  border-top: 1px solid;
}

.border-right {
  border-right: 1px solid;
}

.border-left {
  border-left: 1px solid;
}

.border-bottom {
  border-bottom: 1px solid;
}

.bg-light-grey {
  background-color: #f0f0f0;
}

.bg-light-yellow {
  background-color: rgb(255, 255, 188);
}

:deep(.center-placeholder .v-field__input) {
  text-align: center;
}

:deep(.v-field__input) {
  text-align: center;
  padding: 0 !important;
}

.close-column {
  max-width: 250px;
  position: relative;
  overflow: hidden; /* Prevents the label from spilling outside */
}

.day-number {
  z-index: 1;
}

.day-label {
  position: absolute;
  left: 60%;
}

.scroll-wrapper {
  max-width: 100vw;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.min-height-screen {
  min-height: 70vh;
}
</style>
