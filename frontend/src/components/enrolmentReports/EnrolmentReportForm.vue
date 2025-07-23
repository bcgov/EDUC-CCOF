<template>
  <v-container fluid class="page-scroll-wrapper px-8 px-xl-12 pt-0">
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
      <v-skeleton-loader v-if="processing" :loading="processing" type="table-tbody" class="mt-4 mb-8" />
      <div v-else class="table-scroll-wrapper my-6">
        <v-row no-gutters class="background-light-grey border-bottom font-weight-bold text-center sticky-row row-0">
          <v-col class="border-right close-column text-cell"></v-col>
          <v-col class="border-right text-cell">0 - 18 Months</v-col>
          <v-col class="border-right text-cell">18 - 36 Months</v-col>
          <v-col class="border-right text-cell">3 Years to Kinder</v-col>
          <v-col class="border-right text-cell">Kinder Before & After</v-col>
          <v-col class="border-right text-cell">Grade 1 - 12 Years</v-col>
          <v-col v-if="isGroup" cols="1" class="text-cell">Preschool</v-col>
        </v-row>
        <v-row no-gutters class="border-bottom text-center">
          <v-col class="close-column border-right background-light-grey d-flex align-center justify-center">
            <span class="pr-1"> Total Enrolled </span>
            <AppTooltip
              tooltip-content="For each rate category, enter the number of individual children, including drop-ins, who were enrolled this month."
            />
          </v-col>
          <v-col class="border-right">
            <AppNumberInput
              v-model="enrolmentReport.totalEnrolled0To18"
              maxLength="3"
              :disabled="false"
              :default-value="0"
            />
          </v-col>
          <v-col class="border-right">
            <AppNumberInput
              v-model="enrolmentReport.totalEnrolled18To36"
              maxLength="3"
              :disabled="false"
              :default-value="0"
            />
          </v-col>
          <v-col class="border-right">
            <AppNumberInput
              v-model="enrolmentReport.totalEnrolled3YK"
              maxLength="3"
              :disabled="false"
              :default-value="0"
            />
          </v-col>
          <v-col class="border-right">
            <AppNumberInput
              v-model="enrolmentReport.totalEnrolledOOSCK"
              maxLength="3"
              :disabled="false"
              :default-value="0"
            />
          </v-col>
          <v-col class="border-right">
            <AppNumberInput
              v-model="enrolmentReport.totalEnrolledOOSCG"
              maxLength="3"
              :disabled="false"
              :default-value="0"
            />
          </v-col>
          <v-col v-if="isGroup" cols="1">
            <AppNumberInput
              v-model="enrolmentReport.totalEnrolledPre"
              maxLength="3"
              :disabled="false"
              :default-value="0"
            />
          </v-col>
        </v-row>
        <v-row no-gutters class="background-light-grey border-bottom text-center px-8 py-2">
          <p>
            Approved Parent Fees are the fees approved by the program. If any of these fees are incorrect, click
            <router-link :to="PATHS.ROOT.CHANGE_LANDING">
              <span class="text-primary text-decoration-underline">here</span>
            </router-link>
            to request a change.
          </p>
        </v-row>
        <v-row no-gutters class="background-light-grey border-bottom text-center">
          <v-col class="border-right close-column text-cell">Approved Parent Fees $</v-col>
          <v-col class="border-right text-cell">
            {{ formatDecimalNumber(enrolmentReport.approvedParentFees0To18) ?? EMPTY_PLACEHOLDER }}
          </v-col>
          <v-col class="border-right text-cell">
            {{ formatDecimalNumber(enrolmentReport.approvedParentFees18To36) ?? EMPTY_PLACEHOLDER }}
          </v-col>
          <v-col class="border-right text-cell">
            {{ formatDecimalNumber(enrolmentReport.approvedParentFees3YK) ?? EMPTY_PLACEHOLDER }}
          </v-col>
          <v-col class="border-right text-cell">
            {{ formatDecimalNumber(enrolmentReport.approvedParentFeesOOSCK) ?? EMPTY_PLACEHOLDER }}
          </v-col>
          <v-col class="border-right text-cell">
            {{ formatDecimalNumber(enrolmentReport.approvedParentFeesOOSCG) ?? EMPTY_PLACEHOLDER }}
          </v-col>
          <v-col v-if="isGroup" cols="1" class="text-cell">
            {{ formatDecimalNumber(enrolmentReport.approvedParentFeesPre) ?? EMPTY_PLACEHOLDER }}
          </v-col>
        </v-row>
        <v-row no-gutters class="background-light-grey text-center">
          <v-col class="border-right close-column text-cell">Frequency</v-col>
          <v-col class="border-right text-cell">
            {{ getParentFeesFrequency(enrolmentReport.approvedParentFeesFrequency0To18) ?? EMPTY_PLACEHOLDER }}
          </v-col>
          <v-col class="border-right text-cell">
            {{ getParentFeesFrequency(enrolmentReport.approvedParentFeesFrequency18To36) ?? EMPTY_PLACEHOLDER }}
          </v-col>
          <v-col class="border-right text-cell">
            {{ getParentFeesFrequency(enrolmentReport.approvedParentFeesFrequency3YK) ?? EMPTY_PLACEHOLDER }}
          </v-col>
          <v-col class="border-right text-cell">
            {{ getParentFeesFrequency(enrolmentReport.approvedParentFeesFrequencyOOSCK) ?? EMPTY_PLACEHOLDER }}
          </v-col>
          <v-col class="border-right text-cell">
            {{ getParentFeesFrequency(enrolmentReport.approvedParentFeesFrequencyOOSCG) ?? EMPTY_PLACEHOLDER }}
          </v-col>
          <v-col v-if="isGroup" cols="1" class="text-cell">
            {{ getParentFeesFrequency(enrolmentReport.approvedParentFeesFrequencyPre) ?? EMPTY_PLACEHOLDER }}
          </v-col>
        </v-row>
        <v-row no-gutters class="background-light-grey text-center sticky-row row-1">
          <v-col class="border-right close-column text-cell">Day</v-col>
          <v-col v-for="i in 5" :key="i" class="border-right">
            <v-row no-gutters>
              <v-col class="border-right text-cell">4 Hours Or Less</v-col>
              <v-col class="text-cell">Over 4 Hours</v-col>
            </v-row>
          </v-col>
          <v-col v-if="isGroup" cols="1" class="text-cell" />
        </v-row>
        <v-row
          v-for="(dailyEnrolment, rowIndex) in dailyEnrolments"
          :key="dailyEnrolment.dailyEnrolmentId"
          no-gutters
          :class="{
            'background-dark-grey': rowIndex > 6 && rowIndex < 10,
            'background-light-yellow': dailyEnrolment.dayType === DAY_TYPES.WEEKEND,
            'background-light-blue': dailyEnrolment.dayType === DAY_TYPES.STATUTORY,
            'border-bottom': rowIndex < dailyEnrolments.length - 1,
          }"
        >
          <v-col class="background-light-grey border-right close-column d-flex align-center justify-center">
            <span>{{ dailyEnrolment.day }}</span>
            <span class="day-label">
              {{ getDayOfWeek(dailyEnrolment.day, enrolmentReport?.month, enrolmentReport?.year) }}
            </span>
          </v-col>
          <v-col>
            <v-row no-gutters>
              <v-col class="border-right">
                <AppNumberInput v-model="dailyEnrolment.less0To18" maxLength="3" :disabled="false" />
              </v-col>
              <v-col class="border-right">
                <AppNumberInput v-model="dailyEnrolment.over0To18" maxLength="3" :disabled="false" />
              </v-col>
            </v-row>
          </v-col>
          <v-col>
            <v-row no-gutters>
              <v-col class="border-right">
                <AppNumberInput v-model="dailyEnrolment.less18To36" maxLength="3" :disabled="false" />
              </v-col>
              <v-col class="border-right">
                <AppNumberInput v-model="dailyEnrolment.over18To36" maxLength="3" :disabled="false" />
              </v-col>
            </v-row>
          </v-col>
          <v-col>
            <v-row no-gutters>
              <v-col class="border-right">
                <AppNumberInput v-model="dailyEnrolment.less3YK" maxLength="3" :disabled="false" />
              </v-col>
              <v-col class="border-right">
                <AppNumberInput v-model="dailyEnrolment.over3YK" maxLength="3" :disabled="false" />
              </v-col>
            </v-row>
          </v-col>
          <v-col>
            <v-row no-gutters>
              <v-col class="border-right">
                <AppNumberInput v-model="dailyEnrolment.lessOOSCG" maxLength="3" :disabled="false" />
              </v-col>
              <v-col class="border-right">
                <AppNumberInput v-model="dailyEnrolment.overOOSCG" maxLength="3" :disabled="false" />
              </v-col>
            </v-row>
          </v-col>
          <v-col>
            <v-row no-gutters>
              <v-col class="border-right">
                <AppNumberInput v-model="dailyEnrolment.lessOOSCK" maxLength="3" :disabled="false" />
              </v-col>
              <v-col class="border-right">
                <AppNumberInput v-model="dailyEnrolment.overOOSCK" maxLength="3" :disabled="false" />
              </v-col>
            </v-row>
          </v-col>
          <v-col v-if="isGroup" cols="1">
            <v-row no-gutters>
              <v-col>
                <AppNumberInput v-model="dailyEnrolment.lessPre" maxLength="3" :disabled="false" />
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row no-gutters class="background-light-grey border-top-yellow">
          <v-col class="border-right close-column font-weight-bold pl-2 py-1">Current Total</v-col>
          <v-col class="border-right text-center">
            <v-row no-gutters>
              <v-col class="border-right text-cell">{{ enrolmentReport?.currentTotalLess0To18 ?? 0 }}</v-col>
              <v-col class="text-cell">{{ enrolmentReport?.currentTotalOver0To18 ?? 0 }}</v-col>
            </v-row>
          </v-col>
          <v-col class="border-right text-center">
            <v-row no-gutters>
              <v-col class="border-right text-cell">{{ enrolmentReport?.currentTotalLess18To36 ?? 0 }}</v-col>
              <v-col class="text-cell">{{ enrolmentReport?.currentTotalOver18To36 ?? 0 }}</v-col>
            </v-row>
          </v-col>
          <v-col class="border-right text-center">
            <v-row no-gutters>
              <v-col class="border-right text-cell">{{ enrolmentReport?.currentTotalLess3YK ?? 0 }}</v-col>
              <v-col class="text-cell">{{ enrolmentReport?.currentTotalOver3YK ?? 0 }}</v-col>
            </v-row>
          </v-col>
          <v-col class="border-right text-center">
            <v-row no-gutters>
              <v-col class="border-right text-cell">{{ enrolmentReport?.currentTotalLessOOSCG ?? 0 }}</v-col>
              <v-col class="text-cell">{{ enrolmentReport?.currentTotalOverOOSCG ?? 0 }}</v-col>
            </v-row>
          </v-col>
          <v-col class="border-right text-center">
            <v-row no-gutters>
              <v-col class="border-right text-cell">{{ enrolmentReport?.currentTotalLessOOSCK ?? 0 }}</v-col>
              <v-col class="text-cell">{{ enrolmentReport?.currentTotalOverOOSCK ?? 0 }}</v-col>
            </v-row>
          </v-col>
          <v-col v-if="isGroup" cols="1" class="text-cell text-center">
            {{ enrolmentReport?.currentTotalLessPre ?? 0 }}
          </v-col>
        </v-row>
        <v-row no-gutters class="background-light-grey border-top-blue">
          <v-col class="border-right close-column font-weight-bold pl-2 py-1">CCOF Base Rate</v-col>
          <v-col class="border-right text-center">
            <v-row no-gutters>
              <v-col class="border-right text-cell">0</v-col>
              <v-col class="text-cell">0</v-col>
            </v-row>
          </v-col>
          <v-col class="border-right text-center">
            <v-row no-gutters>
              <v-col class="border-right text-cell">0</v-col>
              <v-col class="text-cell">0</v-col>
            </v-row>
          </v-col>
          <v-col class="border-right text-center">
            <v-row no-gutters>
              <v-col class="border-right text-cell">0</v-col>
              <v-col class="text-cell">0</v-col>
            </v-row>
          </v-col>
          <v-col class="border-right text-center">
            <v-row no-gutters>
              <v-col class="border-right text-cell">0</v-col>
              <v-col class="text-cell">0</v-col>
            </v-row>
          </v-col>
          <v-col class="border-right text-center">
            <v-row no-gutters>
              <v-col class="border-right text-cell">0</v-col>
              <v-col class="text-cell">0</v-col>
            </v-row>
          </v-col>
          <v-col v-if="isGroup" cols="1" class="text-cell text-center"> 0 </v-col>
        </v-row>
        <v-row no-gutters class="background-light-grey border-top">
          <v-col class="border-right close-column font-weight-bold pl-2 py-1">CCOF Base $</v-col>
          <v-col class="border-right text-center">
            <v-row no-gutters>
              <v-col class="border-right text-cell">{{ enrolmentReport?.ccofBaseAmountLess0To18 ?? 0 }}</v-col>
              <v-col class="text-cell">{{ enrolmentReport?.ccofBaseAmountOver0To18 ?? 0 }}</v-col>
            </v-row>
          </v-col>
          <v-col class="border-right text-center">
            <v-row no-gutters>
              <v-col class="border-right text-cell">{{ enrolmentReport?.ccofBaseAmountLess18To36 ?? 0 }}</v-col>
              <v-col class="text-cell">{{ enrolmentReport?.ccofBaseAmountOver18To36 ?? 0 }}</v-col>
            </v-row>
          </v-col>
          <v-col class="border-right text-center">
            <v-row no-gutters>
              <v-col class="border-right text-cell">{{ enrolmentReport?.ccofBaseAmountLess3YK ?? 0 }}</v-col>
              <v-col class="text-cell">{{ enrolmentReport?.ccofBaseAmountOver3YK ?? 0 }}</v-col>
            </v-row>
          </v-col>
          <v-col class="border-right text-center">
            <v-row no-gutters>
              <v-col class="border-right text-cell">{{ enrolmentReport?.ccofBaseAmountLessOOSCG ?? 0 }}</v-col>
              <v-col class="text-cell">{{ enrolmentReport?.ccofBaseAmountOverOOSCG ?? 0 }}</v-col>
            </v-row>
          </v-col>
          <v-col class="border-right text-center">
            <v-row no-gutters>
              <v-col class="border-right text-cell">{{ enrolmentReport?.ccofBaseAmountLessOOSCK ?? 0 }}</v-col>
              <v-col class="text-cell">{{ enrolmentReport?.ccofBaseAmountOverOOSCK ?? 0 }}</v-col>
            </v-row>
          </v-col>
          <v-col v-if="isGroup" cols="1" class="text-cell text-center">
            {{ enrolmentReport?.ccofBaseAmountLessPre ?? 0 }}
          </v-col>
        </v-row>
        <v-row no-gutters class="background-light-grey border-top-blue">
          <v-col class="border-right close-column font-weight-bold pl-2 py-1">Daily CCFRI Rate</v-col>
          <v-col class="border-right text-center">
            <v-row no-gutters>
              <v-col class="border-right text-cell">0</v-col>
              <v-col class="text-cell">0</v-col>
            </v-row>
          </v-col>
          <v-col class="border-right text-center">
            <v-row no-gutters>
              <v-col class="border-right text-cell">0</v-col>
              <v-col class="text-cell">0</v-col>
            </v-row>
          </v-col>
          <v-col class="border-right text-center">
            <v-row no-gutters>
              <v-col class="border-right text-cell">0</v-col>
              <v-col class="text-cell">0</v-col>
            </v-row>
          </v-col>
          <v-col class="border-right text-center">
            <v-row no-gutters>
              <v-col class="border-right text-cell">0</v-col>
              <v-col class="text-cell">0</v-col>
            </v-row>
          </v-col>
          <v-col class="border-right text-center">
            <v-row no-gutters>
              <v-col class="border-right text-cell">0</v-col>
              <v-col class="text-cell">0</v-col>
            </v-row>
          </v-col>
          <v-col v-if="isGroup" cols="1" class="text-cell text-center">0</v-col>
        </v-row>
        <v-row no-gutters class="background-light-grey border-top">
          <v-col class="border-right close-column font-weight-bold pl-2 py-1">CCFRI $</v-col>
          <v-col class="border-right text-center">
            <v-row no-gutters>
              <v-col class="border-right text-cell">{{ enrolmentReport?.ccfriAmountLess0To18 ?? 0 }}</v-col>
              <v-col class="text-cell">{{ enrolmentReport?.ccfriAmountOver0To18 ?? 0 }}</v-col>
            </v-row>
          </v-col>
          <v-col class="border-right text-center">
            <v-row no-gutters>
              <v-col class="border-right text-cell">{{ enrolmentReport?.ccfriAmountLess18To36 ?? 0 }}</v-col>
              <v-col class="text-cell">{{ enrolmentReport?.ccfriAmountOver18To36 ?? 0 }}</v-col>
            </v-row>
          </v-col>
          <v-col class="border-right text-center">
            <v-row no-gutters>
              <v-col class="border-right text-cell">{{ enrolmentReport?.ccfriAmountLess3YK ?? 0 }}</v-col>
              <v-col class="text-cell">{{ enrolmentReport?.ccfriAmountOver3YK ?? 0 }}</v-col>
            </v-row>
          </v-col>
          <v-col class="border-right text-center">
            <v-row no-gutters>
              <v-col class="border-right text-cell">{{ enrolmentReport?.ccfriAmountLessOOSCG ?? 0 }}</v-col>
              <v-col class="text-cell">{{ enrolmentReport?.ccfriAmountOverOOSCG ?? 0 }}</v-col>
            </v-row>
          </v-col>
          <v-col class="border-right text-center">
            <v-row no-gutters>
              <v-col class="border-right text-cell">{{ enrolmentReport?.ccfriAmountLessOOSCK ?? 0 }}</v-col>
              <v-col class="text-cell">{{ enrolmentReport?.ccfriAmountOverOOSCK ?? 0 }}</v-col>
            </v-row>
          </v-col>
          <v-col v-if="isGroup" cols="1" class="text-cell text-center">
            {{ enrolmentReport?.ccfriAmountLessPre ?? 0 }}
          </v-col>
        </v-row>
        <v-row no-gutters class="background-light-grey border-top-blue">
          <v-col class="border-right close-column font-weight-bold pl-2 py-1">CCFRI Provider Payment Rate</v-col>
          <v-col class="border-right text-center">
            <v-row no-gutters>
              <v-col class="border-right text-cell">0</v-col>
              <v-col class="text-cell">0</v-col>
            </v-row>
          </v-col>
          <v-col class="border-right text-center">
            <v-row no-gutters>
              <v-col class="border-right text-cell">0</v-col>
              <v-col class="text-cell">0</v-col>
            </v-row>
          </v-col>
          <v-col class="border-right text-center">
            <v-row no-gutters>
              <v-col class="border-right text-cell">0</v-col>
              <v-col class="text-cell">0</v-col>
            </v-row>
          </v-col>
          <v-col class="border-right text-center">
            <v-row no-gutters>
              <v-col class="border-right text-cell">0</v-col>
              <v-col class="text-cell">0</v-col>
            </v-row>
          </v-col>
          <v-col class="border-right text-center">
            <v-row no-gutters>
              <v-col class="border-right text-cell">0</v-col>
              <v-col class="text-cell">0</v-col>
            </v-row>
          </v-col>
          <v-col v-if="isGroup" cols="1" class="text-cell text-center">0</v-col>
        </v-row>
        <v-row no-gutters class="background-light-grey border-top">
          <v-col class="border-right close-column font-weight-bold pl-2 py-1">CCFRI Provider $</v-col>
          <v-col class="border-right text-center">
            <v-row no-gutters>
              <v-col class="border-right text-cell">{{ enrolmentReport?.ccfriProviderAmountLess0To18 ?? 0 }}</v-col>
              <v-col class="text-cell">{{ enrolmentReport?.ccfriProviderAmountOver0To18 ?? 0 }}</v-col>
            </v-row>
          </v-col>
          <v-col class="border-right text-center">
            <v-row no-gutters>
              <v-col class="border-right text-cell">{{ enrolmentReport?.ccfriProviderAmountLess18To36 ?? 0 }}</v-col>
              <v-col class="text-cell">{{ enrolmentReport?.ccfriProviderAmountOver18To36 ?? 0 }}</v-col>
            </v-row>
          </v-col>
          <v-col class="border-right text-center">
            <v-row no-gutters>
              <v-col class="border-right text-cell">{{ enrolmentReport?.ccfriProviderAmountLess3YK ?? 0 }}</v-col>
              <v-col class="text-cell">{{ enrolmentReport?.ccfriProviderAmountOver3YK ?? 0 }}</v-col>
            </v-row>
          </v-col>
          <v-col class="border-right text-center">
            <v-row no-gutters>
              <v-col class="border-right text-cell">{{ enrolmentReport?.ccfriProviderAmountLessOOSCG ?? 0 }}</v-col>
              <v-col class="text-cell">{{ enrolmentReport?.ccfriProviderAmountOverOOSCG ?? 0 }}</v-col>
            </v-row>
          </v-col>
          <v-col class="border-right text-center">
            <v-row no-gutters>
              <v-col class="border-right text-cell">{{ enrolmentReport?.ccfriProviderAmountLessOOSCK ?? 0 }}</v-col>
              <v-col class="text-cell">{{ enrolmentReport?.ccfriProviderAmountOverOOSCK ?? 0 }}</v-col>
            </v-row>
          </v-col>
          <v-col v-if="isGroup" cols="1" class="text-cell text-center">
            {{ enrolmentReport?.ccfriProviderAmountLessPre ?? 0 }}
          </v-col>
        </v-row>
        <v-row no-gutters class="background-light-green border-top-yellow font-weight-bold py-1">
          <v-col class="text-center"> Grand Totals </v-col>
        </v-row>
        <v-row no-gutters class="background-light-green border-top font-weight-bold">
          <v-col cols="1" class="border-right pl-2 py-1"></v-col>
          <v-col class="border-right pl-2 py-1">CCOF Base</v-col>
          <v-col class="border-right pl-2 py-1">CCFRI Payment</v-col>
          <v-col class="pl-2 py-1">CCFRI Provider Payment</v-col>
        </v-row>
        <v-row no-gutters class="background-light-green border-top">
          <v-col cols="1" class="border-right font-weight-bold pl-2 py-1">Current $</v-col>
          <v-col class="border-right pl-2 py-1">{{ enrolmentReport?.grandTotalBase ?? 0 }}</v-col>
          <v-col class="border-right pl-2 py-1">{{ enrolmentReport?.grandTotalCcfri ?? 0 }}</v-col>
          <v-col class="pl-2 py-1">{{ enrolmentReport?.grandTotalCcfriProvider ?? 0 }}</v-col>
        </v-row>
      </div>
    </template>
  </v-container>
  <EnrolmentReportNavButtons
    :is-processing="loading || processing"
    :is-save-displayed="true"
    :is-next-displayed="true"
    @previous="$router.push(PATHS.ROOT.ENROLMENT_REPORTS)"
    @next="next"
    @save="save(true)"
  />
</template>

<script>
import { cloneDeep, isEmpty, isEqual } from 'lodash';
import { mapState } from 'pinia';

import AppNumberInput from '@/components/guiComponents/AppNumberInput.vue';
import AppTooltip from '@/components/guiComponents/AppTooltip.vue';
import EnrolmentReportNavButtons from '@/components/enrolmentReports/EnrolmentReportNavButtons.vue';

import alertMixin from '@/mixins/alertMixin.js';

import EnrolmentReportService from '@/services/enrolmentReportService.js';
import { useApplicationStore } from '@/store/application.js';
import { useOrganizationStore } from '@/store/ccof/organization.js';

import { getDayOfWeek, padString } from '@/utils/common.js';
import {
  DAY_TYPES,
  EMPTY_PLACEHOLDER,
  FULL_MONTH_NAMES,
  ORGANIZATION_PROVIDER_TYPES,
  PARENT_FEE_FREQUENCIES,
  PATHS,
} from '@/utils/constants.js';
import { formatDateToStandardFormat, formatDecimalNumber } from '@/utils/format';
import rules from '@/utils/rules.js';

export default {
  name: 'EnrolmentReportForm',
  components: {
    AppNumberInput,
    AppTooltip,
    EnrolmentReportNavButtons,
  },
  mixins: [alertMixin],
  data() {
    return {
      loading: true,
      processing: false,
      enrolmentReport: {},
      dailyEnrolments: [],
    };
  },
  computed: {
    ...mapState(useApplicationStore, ['getFacilityListForPCFByProgramYearId']),
    ...mapState(useOrganizationStore, ['organizationAccountNumber', 'organizationId', 'organizationName']),
    isGroup() {
      return this.enrolmentReport?.organizationProviderType !== ORGANIZATION_PROVIDER_TYPES.GROUP;
    },
    currentFacility() {
      const facilities = this.getFacilityListForPCFByProgramYearId(this.enrolmentReport?.programYearId);
      return facilities?.find((item) => item.facilityId === this.enrolmentReport?.facilityId);
    },
  },
  async created() {
    window.scrollTo(0, 0);
    this.DAY_TYPES = DAY_TYPES;
    this.EMPTY_PLACEHOLDER = EMPTY_PLACEHOLDER;
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
        await this.loadEnrolmentReport();
        await this.loadDailyEnrolments();
      } catch (error) {
        console.log(error);
        this.setFailureAlert('Failed to load enrolment report');
      } finally {
        this.loading = false;
      }
    },

    async loadEnrolmentReport() {
      this.enrolmentReport = await EnrolmentReportService.getEnrolmentReport(this.$route.params.enrolmentReportId);
      this.enrolmentReport.isAdjustment = this.enrolmentReport.reportVersion > 1;
    },

    async loadDailyEnrolments() {
      this.dailyEnrolments = await EnrolmentReportService.getDailyEnrolments(this.$route.params.enrolmentReportId);
    },

    // TO-DO (vietle-cgi): duplicate function with ViewER
    getReportVersionText(report) {
      const version = padString(report?.reportVersion, 2, '0');
      return report?.isAdjustment ? `${version}-Adjustment` : version;
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

    next() {
      console.log('NEXT');
    },

    async save(showMessage) {
      try {
        this.processing = true;
        // await EnrolmentReportService.updateDailyEnrolments(dailyEnrolmentsToUpdate);
        await this.loadDailyEnrolments();
        if (showMessage) {
          this.setSuccessAlert('Report saved successfully.');
        }
      } catch (error) {
        console.log(error);
        this.setFailureAlert('An error occurred while saving.');
      } finally {
        this.processing = false;
      }
    },
  },
};
</script>
<style scoped>
:deep(.v-field__input) {
  text-align: center;
  padding: 0 !important;
}

:deep(.v-field__input):hover {
  box-shadow: inset 0 0 0 2px #3399ff;
}

:deep(.v-field__input):focus-visible {
  box-shadow:
    inset 0 0 0 2px #003366,
    0 0 0 2px rgba(0, 51, 102, 0.2);
  background-color: white;
}

.background-dark-grey {
  background-color: #bfbfbf !important;
}

.background-light-blue {
  background-color: #d8f0ff;
}

.background-light-green {
  background-color: #d4f7c5;
}

.background-light-grey {
  background-color: #f0f0f0;
}

.background-light-yellow {
  background-color: #ffffbc;
}

.border-top {
  border-top: 1px solid;
}

.border-top-blue {
  border-top: 3px solid #003366;
}

.border-top-yellow {
  border-top: 3px solid rgb(252, 186, 25);
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

.close-column {
  max-width: 250px;
  position: relative;
  overflow: hidden;
}

.day-label {
  font-size: 14px;
  left: 60%;
  position: absolute;
}

.min-height-screen {
  min-height: 70vh;
}

.page-scroll-wrapper {
  max-width: 100vw;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.table-scroll-wrapper {
  border: 1px solid;
  border-top: 0px;
  max-height: 60vh;
  min-width: 1700px;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.sticky-row {
  position: sticky;
  z-index: 3;
  border-top: 1px solid;
}

.sticky-row.row-0 {
  top: 0px;
  height: 32px;
}

.sticky-row.row-1 {
  top: 32px;
  border-bottom: 1px solid;
}

.text-cell {
  padding: 4px 0px !important;
}
</style>
