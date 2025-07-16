<template>
  <v-container fluid class="scroll-wrapper px-12">
    <div v-if="loading" align="center">
      <v-progress-circular
        indeterminate
        size="100"
        :width="6"
        color="#003366"
        class="min-height-screen"
      ></v-progress-circular>
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
      {{ enrolmentReport }}
      <div :class="tableStyle">
        <v-card variant="outlined" class="pa-0 my-6" min-width="1700px">
          <v-row class="border-bottom text-center">
            <v-col class="close-column border-right bg-light-grey"></v-col>
            <v-col class="border-right bg-light-grey">0-18 Months</v-col>
            <v-col class="border-right bg-light-grey">18-36 Months</v-col>
            <v-col class="border-right bg-light-grey">3 Years to Kinder</v-col>
            <v-col class="border-right bg-light-grey">Kinder Before & After</v-col>
            <v-col class="border-right bg-light-grey">Grade 1 - 12 Years</v-col>
            <v-col cols="1" class="bg-light-grey">Preschool</v-col>
          </v-row>
          <v-row class="border-bottom text-center py-0">
            <v-col class="close-column border-right bg-light-grey d-flex align-center justify-center">
              Total Enrolled
            </v-col>
            <v-col class="border-right bg-light-grey">
              <AppNumberInput v-model="enrolmentReport.totalEnrolled0To18" maxLength="3" :disabled="false" />
            </v-col>
            <v-col class="border-right bg-light-grey">
              <AppNumberInput v-model="enrolmentReport.totalEnrolled18To36" maxLength="3" :disabled="false" />
            </v-col>
            <v-col class="border-right bg-light-grey">
              <AppNumberInput v-model="enrolmentReport.totalEnrolled3YK" maxLength="3" :disabled="false" />
            </v-col>
            <v-col class="border-right bg-light-grey">
              <AppNumberInput v-model="enrolmentReport.totalEnrolledOOSCK" maxLength="3" :disabled="false" />
            </v-col>
            <v-col class="border-right bg-light-grey">
              <AppNumberInput v-model="enrolmentReport.totalEnrolledOOSCG" maxLength="3" :disabled="false" />
            </v-col>
            <v-col cols="1" class="bg-light-grey">
              <AppNumberInput v-model="enrolmentReport.totalEnrolledPre" maxLength="3" :disabled="false" />
            </v-col>
          </v-row>
          <v-row class="border-bottom bg-light-grey text-center px-8 py-2">
            <p>
              Approved Parent Fees are the fees approved by the program. If any of these fees are incorrect, click
              <router-link :to="PATHS.ROOT.CHANGE_LANDING" class="text-decoration-underline">here</router-link> to
              request a change.
            </p>
          </v-row>
          <v-row class="border-bottom bg-light-grey text-center">
            <v-col class="close-column border-right bg-light-grey">Approved Parent Fees $</v-col>
            <v-col class="border-right bg-light-grey">1,000</v-col>
            <v-col class="border-right bg-light-grey">1,000</v-col>
            <v-col class="border-right bg-light-grey">1,000</v-col>
            <v-col class="border-right bg-light-grey">1,500</v-col>
            <v-col class="border-right bg-light-grey">1,500</v-col>
            <v-col cols="1" class="bg-light-grey">1,500</v-col>
          </v-row>
          <v-row class="border-bottom text-center">
            <v-col class="close-column border-right bg-light-grey">Frequency</v-col>
            <v-col v-for="i in 5" :key="i" class="border-right bg-light-grey">Monthly</v-col>
            <v-col cols="1" class="bg-light-grey">Monthly</v-col>
          </v-row>
          <v-row class="text-center">
            <v-col class="close-column border-right bg-light-grey">Day</v-col>
            <v-col v-for="i in 5" :key="i" class="bg-light-grey border-right py-0">
              <v-row class="fill-height">
                <v-col class="d-flex align-center justify-center border-right">4 Hours Or Less</v-col>
                <v-col class="d-flex align-center justify-center">Over 4 Hours</v-col>
              </v-row>
            </v-col>
            <v-col cols="1" class="border bg-light-grey" />
          </v-row>
          <v-row
            v-for="(dailyEnrolment, rowIndex) in dailyEnrolments"
            :key="dailyEnrolment.dailyEnrolmentId"
            :class="{
              'border-bottom': rowIndex < dailyEnrolments.length - 1,
              'border-top': rowIndex === 0,
              'bg-light-yellow': dailyEnrolment.dayType > 100000000,
            }"
          >
            <v-col class="close-column border-right bg-light-grey text-center position-relative">
              <!-- Perfectly centered day number -->
              <span class="day-number">{{ dailyEnrolment.day }}</span>

              <!-- Absolutely positioned day label that stays inside the column -->
              <span class="day-label">
                {{ getDayOfWeek(dailyEnrolment.day, enrolmentReport?.month, enrolmentReport?.year) }}
              </span>
            </v-col>
            <v-col class="border-right py-0">
              <v-row class="fill-height">
                <v-col class="border-right">{{ dailyEnrolment.less0To18 }}</v-col>
                <v-col>{{ dailyEnrolment.over0To18 }}</v-col>
              </v-row>
            </v-col>
            <v-col class="border-right py-0">
              <v-row class="fill-height">
                <v-col class="border-right">{{ dailyEnrolment.less18To36 }}</v-col>
                <v-col>{{ dailyEnrolment.over18To36 }}</v-col>
              </v-row>
            </v-col>
            <v-col class="border-right py-0">
              <v-row class="fill-height">
                <v-col class="border-right">{{ dailyEnrolment.less3YK }}</v-col>
                <v-col>{{ dailyEnrolment.over3YK }}</v-col>
              </v-row>
            </v-col>
            <v-col class="border-right py-0">
              <v-row class="fill-height">
                <v-col class="border-right">{{ dailyEnrolment.lessOOSCG }}</v-col>
                <v-col>{{ dailyEnrolment.overOOSCG }}</v-col>
              </v-row>
            </v-col>
            <v-col class="border-right py-0">
              <v-row class="fill-height">
                <v-col class="border-right">{{ dailyEnrolment.lessOOSCK }}</v-col>
                <v-col>{{ dailyEnrolment.overOOSCK }}</v-col>
              </v-row>
            </v-col>
            <v-col cols="1" class="" />
          </v-row>
        </v-card>
      </div>
    </template>
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
import AppNumberInput from '@/components/guiComponents/AppNumberInput.vue';
import AppTooltip from '@/components/guiComponents/AppTooltip.vue';
import FiscalYearSlider from '@/components/guiComponents/FiscalYearSlider.vue';
import NavButton from '@/components/util/NavButton.vue';

import alertMixin from '@/mixins/alertMixin.js';

import EnrolmentReportService from '@/services/enrolmentReportService.js';
import { useAppStore } from '@/store/app.js';
import { useApplicationStore } from '@/store/application.js';
import { useOrganizationStore } from '@/store/ccof/organization.js';

import { getDayOfWeek, padString } from '@/utils/common.js';
import { FULL_MONTH_NAMES, PATHS } from '@/utils/constants.js';
import { formatDateToStandardFormat } from '@/utils/format';
import rules from '@/utils/rules.js';

export default {
  name: 'EnrolmentReport',
  components: { AppButton, AppMultiSelectInput, AppNumberInput, AppTooltip, FiscalYearSlider, NavButton },
  mixins: [alertMixin],
  data() {
    return {
      loading: true,
      enrolmentReport: {},
      dailyEnrolments: [],
      tableData: [
        ['Name', 'Role', 'Location'],
        ['Alice', 'Developer', 'Toronto'],
        ['Bob', 'Designer', 'Montreal'],
        ['Charlie', 'Manager', 'Vancouver'],
      ],
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
    tableStyle() {
      let tableStyle = 'card-scroll-wrapper';
      if (this.$vuetify.display.smAndDown) {
        tableStyle += ' font-xsmall';
      } else if (this.$vuetify.display.lgAndDown) {
        tableStyle += ' font-small';
      }
      return tableStyle;
    },
  },
  async created() {
    this.PATHS = PATHS;
    this.FULL_MONTH_NAMES = FULL_MONTH_NAMES;
    this.rules = rules;
    await this.loadData();
  },
  methods: {
    formatDateToStandardFormat,
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
  },
};
</script>
<style scoped>
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
  background-color: #f3f2f2;
}

.bg-light-yellow {
  background-color: #feffc8;
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
  min-height: 55vh;
}
</style>
