<template>
  <v-container fluid class="page-scroll-wrapper px-8 px-xl-12 pt-0 mb-12">
    <div v-if="loading" class="text-center">
      <v-progress-circular indeterminate size="100" :width="6" color="#003366" class="min-height-screen" />
    </div>
    <template v-else>
      <EnrolmentReportHeader :enrolment-report="enrolmentReport" />
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
              maxlength="3"
              :disabled="readonly"
              :default-value="0"
            />
          </v-col>
          <v-col class="border-right">
            <AppNumberInput
              v-model="enrolmentReport.totalEnrolled18To36"
              maxlength="3"
              :disabled="readonly"
              :default-value="0"
            />
          </v-col>
          <v-col class="border-right">
            <AppNumberInput
              v-model="enrolmentReport.totalEnrolled3YK"
              maxlength="3"
              :disabled="readonly"
              :default-value="0"
            />
          </v-col>
          <v-col class="border-right">
            <AppNumberInput
              v-model="enrolmentReport.totalEnrolledOOSCK"
              maxlength="3"
              :disabled="readonly"
              :default-value="0"
            />
          </v-col>
          <v-col class="border-right">
            <AppNumberInput
              v-model="enrolmentReport.totalEnrolledOOSCG"
              maxlength="3"
              :disabled="readonly"
              :default-value="0"
            />
          </v-col>
          <v-col v-if="isGroup" cols="1">
            <AppNumberInput
              v-model="enrolmentReport.totalEnrolledPre"
              maxlength="3"
              :disabled="readonly"
              :default-value="0"
            />
          </v-col>
        </v-row>
        <v-row no-gutters class="background-light-grey border-bottom border-right text-center px-8 py-2">
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
            {{ getApprovedParentFees(enrolmentReport.approvedParentFees0To18) }}
          </v-col>
          <v-col class="border-right text-cell">
            {{ getApprovedParentFees(enrolmentReport.approvedParentFees18To36) }}
          </v-col>
          <v-col class="border-right text-cell">
            {{ getApprovedParentFees(enrolmentReport.approvedParentFees3YK) }}
          </v-col>
          <v-col class="border-right text-cell">
            {{ getApprovedParentFees(enrolmentReport.approvedParentFeesOOSCK) }}
          </v-col>
          <v-col class="border-right text-cell">
            {{ getApprovedParentFees(enrolmentReport.approvedParentFeesOOSCG) }}
          </v-col>
          <v-col v-if="isGroup" cols="1" class="text-cell">
            {{ getApprovedParentFees(enrolmentReport.approvedParentFeesPre) }}
          </v-col>
        </v-row>
        <v-row no-gutters class="background-light-grey text-center">
          <v-col class="border-right close-column text-cell">Frequency</v-col>
          <v-col class="border-right text-cell">
            {{ getParentFeesFrequency(enrolmentReport.approvedParentFeesFrequency0To18) }}
          </v-col>
          <v-col class="border-right text-cell">
            {{ getParentFeesFrequency(enrolmentReport.approvedParentFeesFrequency18To36) }}
          </v-col>
          <v-col class="border-right text-cell">
            {{ getParentFeesFrequency(enrolmentReport.approvedParentFeesFrequency3YK) }}
          </v-col>
          <v-col class="border-right text-cell">
            {{ getParentFeesFrequency(enrolmentReport.approvedParentFeesFrequencyOOSCK) }}
          </v-col>
          <v-col class="border-right text-cell">
            {{ getParentFeesFrequency(enrolmentReport.approvedParentFeesFrequencyOOSCG) }}
          </v-col>
          <v-col v-if="isGroup" cols="1" class="text-cell">
            {{ getParentFeesFrequency(enrolmentReport.approvedParentFeesFrequencyPre) }}
          </v-col>
        </v-row>
        <v-row no-gutters class="background-light-grey border-bottom border-top text-center sticky-row row-1">
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
          :class="getRowClass(dailyEnrolment, rowIndex)"
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
                <AppNumberInput v-model="dailyEnrolment.less0To18" maxlength="3" :disabled="readonly" />
              </v-col>
              <v-col class="border-right">
                <AppNumberInput v-model="dailyEnrolment.over0To18" maxlength="3" :disabled="readonly" />
              </v-col>
            </v-row>
          </v-col>
          <v-col>
            <v-row no-gutters>
              <v-col class="border-right">
                <AppNumberInput v-model="dailyEnrolment.less18To36" maxlength="3" :disabled="readonly" />
              </v-col>
              <v-col class="border-right">
                <AppNumberInput v-model="dailyEnrolment.over18To36" maxlength="3" :disabled="readonly" />
              </v-col>
            </v-row>
          </v-col>
          <v-col>
            <v-row no-gutters>
              <v-col class="border-right">
                <AppNumberInput v-model="dailyEnrolment.less3YK" maxlength="3" :disabled="readonly" />
              </v-col>
              <v-col class="border-right">
                <AppNumberInput v-model="dailyEnrolment.over3YK" maxlength="3" :disabled="readonly" />
              </v-col>
            </v-row>
          </v-col>
          <v-col>
            <v-row no-gutters>
              <v-col class="border-right">
                <AppNumberInput v-model="dailyEnrolment.lessOOSCK" maxlength="3" :disabled="readonly" />
              </v-col>
              <v-col class="border-right">
                <AppNumberInput v-model="dailyEnrolment.overOOSCK" maxlength="3" :disabled="readonly" />
              </v-col>
            </v-row>
          </v-col>
          <v-col>
            <v-row no-gutters>
              <v-col class="border-right">
                <AppNumberInput v-model="dailyEnrolment.lessOOSCG" maxlength="3" :disabled="readonly" />
              </v-col>
              <v-col class="border-right">
                <AppNumberInput v-model="dailyEnrolment.overOOSCG" maxlength="3" :disabled="readonly" />
              </v-col>
            </v-row>
          </v-col>
          <v-col v-if="isGroup" cols="1">
            <v-row no-gutters>
              <v-col>
                <AppNumberInput v-model="dailyEnrolment.lessPre" maxlength="3" :disabled="readonly" />
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row no-gutters class="background-light-grey border-top-yellow">
          <v-col class="border-right close-column font-weight-bold pl-2 py-1">Current Total</v-col>
          <v-col class="border-right text-center">
            <v-row no-gutters>
              <v-col class="border-right text-cell">{{ enrolmentReport?.currentTotalLess0To18 }}</v-col>
              <v-col class="text-cell">{{ enrolmentReport?.currentTotalOver0To18 }}</v-col>
            </v-row>
          </v-col>
          <v-col class="border-right text-center">
            <v-row no-gutters>
              <v-col class="border-right text-cell">{{ enrolmentReport?.currentTotalLess18To36 }}</v-col>
              <v-col class="text-cell">{{ enrolmentReport?.currentTotalOver18To36 }}</v-col>
            </v-row>
          </v-col>
          <v-col class="border-right text-center">
            <v-row no-gutters>
              <v-col class="border-right text-cell">{{ enrolmentReport?.currentTotalLess3YK }}</v-col>
              <v-col class="text-cell">{{ enrolmentReport?.currentTotalOver3YK }}</v-col>
            </v-row>
          </v-col>
          <v-col class="border-right text-center">
            <v-row no-gutters>
              <v-col class="border-right text-cell">{{ enrolmentReport?.currentTotalLessOOSCK }}</v-col>
              <v-col class="text-cell">{{ enrolmentReport?.currentTotalOverOOSCK }}</v-col>
            </v-row>
          </v-col>
          <v-col class="border-right text-center">
            <v-row no-gutters>
              <v-col class="border-right text-cell">{{ enrolmentReport?.currentTotalLessOOSCG }}</v-col>
              <v-col class="text-cell">{{ enrolmentReport?.currentTotalOverOOSCG }}</v-col>
            </v-row>
          </v-col>
          <v-col v-if="isGroup" cols="1" class="text-cell text-center">
            {{ enrolmentReport?.currentTotalLessPre }}
          </v-col>
        </v-row>
        <v-row no-gutters class="background-light-grey border-top-blue">
          <v-col class="border-right close-column font-weight-bold pl-2 py-1">CCOF Base Rate</v-col>
          <v-col class="border-right text-center">
            <v-row no-gutters>
              <v-col class="border-right text-cell">{{ enrolmentReport?.baseFundingRates.less0To18 }}</v-col>
              <v-col class="text-cell">{{ enrolmentReport?.baseFundingRates.over0To18 }}</v-col>
            </v-row>
          </v-col>
          <v-col class="border-right text-center">
            <v-row no-gutters>
              <v-col class="border-right text-cell">{{ enrolmentReport?.baseFundingRates.less18To36 }}</v-col>
              <v-col class="text-cell">{{ enrolmentReport?.baseFundingRates.over18To36 }}</v-col>
            </v-row>
          </v-col>
          <v-col class="border-right text-center">
            <v-row no-gutters>
              <v-col class="border-right text-cell">{{ enrolmentReport?.baseFundingRates.less3YK }}</v-col>
              <v-col class="text-cell">{{ enrolmentReport?.baseFundingRates.over3YK }}</v-col>
            </v-row>
          </v-col>
          <v-col class="border-right text-center">
            <v-row no-gutters>
              <v-col class="border-right text-cell">{{ enrolmentReport?.baseFundingRates.lessOOSCK }}</v-col>
              <v-col class="text-cell">{{ enrolmentReport?.baseFundingRates.overOOSCK }}</v-col>
            </v-row>
          </v-col>
          <v-col class="border-right text-center">
            <v-row no-gutters>
              <v-col class="border-right text-cell">{{ enrolmentReport?.baseFundingRates.lessOOSCG }}</v-col>
              <v-col class="text-cell">{{ enrolmentReport?.baseFundingRates.overOOSCG }}</v-col>
            </v-row>
          </v-col>
          <v-col v-if="isGroup" cols="1" class="text-cell text-center">
            {{ enrolmentReport?.baseFundingRates.lessPre }}
          </v-col>
        </v-row>
        <v-row no-gutters class="background-light-grey border-top">
          <v-col class="border-right close-column font-weight-bold pl-2 py-1">CCOF Base $</v-col>
          <v-col class="border-right text-center">
            <v-row no-gutters>
              <v-col class="border-right text-cell">{{ enrolmentReport?.ccofBaseAmountLess0To18 }}</v-col>
              <v-col class="text-cell">{{ enrolmentReport?.ccofBaseAmountOver0To18 }}</v-col>
            </v-row>
          </v-col>
          <v-col class="border-right text-center">
            <v-row no-gutters>
              <v-col class="border-right text-cell">{{ enrolmentReport?.ccofBaseAmountLess18To36 }}</v-col>
              <v-col class="text-cell">{{ enrolmentReport?.ccofBaseAmountOver18To36 }}</v-col>
            </v-row>
          </v-col>
          <v-col class="border-right text-center">
            <v-row no-gutters>
              <v-col class="border-right text-cell">{{ enrolmentReport?.ccofBaseAmountLess3YK }}</v-col>
              <v-col class="text-cell">{{ enrolmentReport?.ccofBaseAmountOver3YK }}</v-col>
            </v-row>
          </v-col>
          <v-col class="border-right text-center">
            <v-row no-gutters>
              <v-col class="border-right text-cell">{{ enrolmentReport?.ccofBaseAmountLessOOSCK }}</v-col>
              <v-col class="text-cell">{{ enrolmentReport?.ccofBaseAmountOverOOSCK }}</v-col>
            </v-row>
          </v-col>
          <v-col class="border-right text-center">
            <v-row no-gutters>
              <v-col class="border-right text-cell">{{ enrolmentReport?.ccofBaseAmountLessOOSCG }}</v-col>
              <v-col class="text-cell">{{ enrolmentReport?.ccofBaseAmountOverOOSCG }}</v-col>
            </v-row>
          </v-col>
          <v-col v-if="isGroup" cols="1" class="text-cell text-center">
            {{ enrolmentReport?.ccofBaseAmountLessPre }}
          </v-col>
        </v-row>
        <v-row no-gutters class="background-light-grey border-top-blue">
          <v-col class="border-right close-column font-weight-bold pl-2 py-1">Daily CCFRI Rate</v-col>
          <v-col class="border-right text-center">
            <v-row no-gutters>
              <v-col class="border-right text-cell">{{ enrolmentReport?.dailyCcfriRateLess0To18 }}</v-col>
              <v-col class="text-cell">{{ enrolmentReport?.dailyCcfriRateOver0To18 }}</v-col>
            </v-row>
          </v-col>
          <v-col class="border-right text-center">
            <v-row no-gutters>
              <v-col class="border-right text-cell">{{ enrolmentReport?.dailyCcfriRateLess18To36 }}</v-col>
              <v-col class="text-cell">{{ enrolmentReport?.dailyCcfriRateOver18To36 }}</v-col>
            </v-row>
          </v-col>
          <v-col class="border-right text-center">
            <v-row no-gutters>
              <v-col class="border-right text-cell">{{ enrolmentReport?.dailyCcfriRateLess3YK }}</v-col>
              <v-col class="text-cell">{{ enrolmentReport?.dailyCcfriRateOver3YK }}</v-col>
            </v-row>
          </v-col>
          <v-col class="border-right text-center">
            <v-row no-gutters>
              <v-col class="border-right text-cell">{{ enrolmentReport?.dailyCcfriRateLessOOSCK }}</v-col>
              <v-col class="text-cell">{{ enrolmentReport?.dailyCcfriRateOverOOSCK }}</v-col>
            </v-row>
          </v-col>
          <v-col class="border-right text-center">
            <v-row no-gutters>
              <v-col class="border-right text-cell">{{ enrolmentReport?.dailyCcfriRateLessOOSCG }}</v-col>
              <v-col class="text-cell">{{ enrolmentReport?.dailyCcfriRateOverOOSCG }}</v-col>
            </v-row>
          </v-col>
          <v-col v-if="isGroup" cols="1" class="text-cell text-center">
            {{ enrolmentReport?.dailyCcfriRateLessPre }}
          </v-col>
        </v-row>
        <v-row no-gutters class="background-light-grey border-top">
          <v-col class="border-right close-column font-weight-bold pl-2 py-1">CCFRI $</v-col>
          <v-col class="border-right text-center">
            <v-row no-gutters>
              <v-col class="border-right text-cell">{{ enrolmentReport?.ccfriAmountLess0To18 }}</v-col>
              <v-col class="text-cell">{{ enrolmentReport?.ccfriAmountOver0To18 }}</v-col>
            </v-row>
          </v-col>
          <v-col class="border-right text-center">
            <v-row no-gutters>
              <v-col class="border-right text-cell">{{ enrolmentReport?.ccfriAmountLess18To36 }}</v-col>
              <v-col class="text-cell">{{ enrolmentReport?.ccfriAmountOver18To36 }}</v-col>
            </v-row>
          </v-col>
          <v-col class="border-right text-center">
            <v-row no-gutters>
              <v-col class="border-right text-cell">{{ enrolmentReport?.ccfriAmountLess3YK }}</v-col>
              <v-col class="text-cell">{{ enrolmentReport?.ccfriAmountOver3YK }}</v-col>
            </v-row>
          </v-col>
          <v-col class="border-right text-center">
            <v-row no-gutters>
              <v-col class="border-right text-cell">{{ enrolmentReport?.ccfriAmountLessOOSCK }}</v-col>
              <v-col class="text-cell">{{ enrolmentReport?.ccfriAmountOverOOSCK }}</v-col>
            </v-row>
          </v-col>
          <v-col class="border-right text-center">
            <v-row no-gutters>
              <v-col class="border-right text-cell">{{ enrolmentReport?.ccfriAmountLessOOSCG }}</v-col>
              <v-col class="text-cell">{{ enrolmentReport?.ccfriAmountOverOOSCG }}</v-col>
            </v-row>
          </v-col>
          <v-col v-if="isGroup" cols="1" class="text-cell text-center">
            {{ enrolmentReport?.ccfriAmountLessPre }}
          </v-col>
        </v-row>
        <v-row no-gutters class="background-light-grey border-top-blue">
          <v-col class="border-right close-column font-weight-bold pl-2 py-1">CCFRI Provider Payment Rate</v-col>
          <v-col class="border-right text-center">
            <v-row no-gutters>
              <v-col class="border-right text-cell">
                {{ enrolmentReport?.ccfriProviderPaymentRates.less0To18 }}
              </v-col>
              <v-col class="text-cell">
                {{ enrolmentReport?.ccfriProviderPaymentRates.over0To18 }}
              </v-col>
            </v-row>
          </v-col>
          <v-col class="border-right text-center">
            <v-row no-gutters>
              <v-col class="border-right text-cell">
                {{ enrolmentReport?.ccfriProviderPaymentRates.less18To36 }}
              </v-col>
              <v-col class="text-cell">
                {{ enrolmentReport?.ccfriProviderPaymentRates.over18To36 }}
              </v-col>
            </v-row>
          </v-col>
          <v-col class="border-right text-center">
            <v-row no-gutters>
              <v-col class="border-right text-cell">
                {{ enrolmentReport?.ccfriProviderPaymentRates.less3YK }}
              </v-col>
              <v-col class="text-cell">
                {{ enrolmentReport?.ccfriProviderPaymentRates.over3YK }}
              </v-col>
            </v-row>
          </v-col>
          <v-col class="border-right text-center">
            <v-row no-gutters>
              <v-col class="border-right text-cell">
                {{ enrolmentReport?.ccfriProviderPaymentRates.lessOOSCK }}
              </v-col>
              <v-col class="text-cell">
                {{ enrolmentReport?.ccfriProviderPaymentRates.overOOSCK }}
              </v-col>
            </v-row>
          </v-col>
          <v-col class="border-right text-center">
            <v-row no-gutters>
              <v-col class="border-right text-cell">
                {{ enrolmentReport?.ccfriProviderPaymentRates.lessOOSCG }}
              </v-col>
              <v-col class="text-cell">
                {{ enrolmentReport?.ccfriProviderPaymentRates.overOOSCG }}
              </v-col>
            </v-row>
          </v-col>
          <v-col v-if="isGroup" cols="1" class="text-cell text-center">
            {{ enrolmentReport?.ccfriProviderPaymentRates.lessPre }}
          </v-col>
        </v-row>
        <v-row no-gutters class="background-light-grey border-top">
          <v-col class="border-right close-column font-weight-bold pl-2 py-1">CCFRI Provider $</v-col>
          <v-col class="border-right text-center">
            <v-row no-gutters>
              <v-col class="border-right text-cell">{{ enrolmentReport?.ccfriProviderAmountLess0To18 }}</v-col>
              <v-col class="text-cell">{{ enrolmentReport?.ccfriProviderAmountOver0To18 }}</v-col>
            </v-row>
          </v-col>
          <v-col class="border-right text-center">
            <v-row no-gutters>
              <v-col class="border-right text-cell">{{ enrolmentReport?.ccfriProviderAmountLess18To36 }}</v-col>
              <v-col class="text-cell">{{ enrolmentReport?.ccfriProviderAmountOver18To36 }}</v-col>
            </v-row>
          </v-col>
          <v-col class="border-right text-center">
            <v-row no-gutters>
              <v-col class="border-right text-cell">{{ enrolmentReport?.ccfriProviderAmountLess3YK }}</v-col>
              <v-col class="text-cell">{{ enrolmentReport?.ccfriProviderAmountOver3YK }}</v-col>
            </v-row>
          </v-col>
          <v-col class="border-right text-center">
            <v-row no-gutters>
              <v-col class="border-right text-cell">{{ enrolmentReport?.ccfriProviderAmountLessOOSCK }}</v-col>
              <v-col class="text-cell">{{ enrolmentReport?.ccfriProviderAmountOverOOSCK }}</v-col>
            </v-row>
          </v-col>
          <v-col class="border-right text-center">
            <v-row no-gutters>
              <v-col class="border-right text-cell">{{ enrolmentReport?.ccfriProviderAmountLessOOSCG }}</v-col>
              <v-col class="text-cell">{{ enrolmentReport?.ccfriProviderAmountOverOOSCG }}</v-col>
            </v-row>
          </v-col>
          <v-col v-if="isGroup" cols="1" class="text-cell text-center">
            {{ enrolmentReport?.ccfriProviderAmountLessPre }}
          </v-col>
        </v-row>
        <v-row no-gutters class="background-light-green border-right border-top-yellow font-weight-bold py-1">
          <v-col class="text-center"> Grand Totals </v-col>
        </v-row>
        <v-row no-gutters class="background-light-green border-right border-top font-weight-bold">
          <v-col cols="1" class="border-right pl-2 py-1"></v-col>
          <v-col class="border-right pl-2 py-1">CCOF Base</v-col>
          <v-col class="border-right pl-2 py-1">CCFRI Payment</v-col>
          <v-col class="pl-2 py-1">CCFRI Provider Payment</v-col>
        </v-row>
        <v-row no-gutters class="background-light-green border-right border-top">
          <v-col cols="1" class="border-right font-weight-bold pl-2 py-1">Current $</v-col>
          <v-col class="border-right pl-2 py-1">{{ enrolmentReport?.grandTotalBase }}</v-col>
          <v-col class="border-right pl-2 py-1">{{ enrolmentReport?.grandTotalCcfri }}</v-col>
          <v-col class="pl-2 py-1">{{ enrolmentReport?.grandTotalCcfriProvider }}</v-col>
        </v-row>
      </div>
      <div class="legend">
        <div class="legend-item"><span class="color-box background-light-blue"></span>Stat holidays</div>
        <div class="legend-item"><span class="color-box background-light-yellow"></span>Weekends</div>
      </div>
    </template>
  </v-container>
  <BackConfirmationDialog :show="showBackConfirmationDialog" @close="showBackConfirmationDialog = false" />
  <EnrolmentReportNavButtons
    :loading="loading || processing"
    :is-save-displayed="true"
    :is-save-disabled="readonly"
    :is-next-displayed="true"
    @previous="previous"
    @next="next"
    @save="save(true)"
  />
</template>

<script>
import { cloneDeep, isEmpty, isEqual, pick } from 'lodash';

import AppNumberInput from '@/components/guiComponents/AppNumberInput.vue';
import AppTooltip from '@/components/guiComponents/AppTooltip.vue';
import BackConfirmationDialog from '@/components/enrolmentReports/BackConfirmationDialog.vue';
import enrolmentReportMixin from '@/mixins/enrolmentReportMixin.js';
import EnrolmentReportService from '@/services/enrolmentReportService.js';

import { addDecimal, getDayOfWeek, getUpdatedObjectsByKeys, multiplyDecimal } from '@/utils/common.js';
import {
  DAY_TYPES,
  EMPTY_PLACEHOLDER,
  ORGANIZATION_PROVIDER_TYPES,
  PARENT_FEE_FREQUENCIES,
  PATHS,
} from '@/utils/constants.js';
import { formatDecimalNumber } from '@/utils/format';

export default {
  name: 'EnrolmentReportForm',
  components: {
    AppNumberInput,
    AppTooltip,
    BackConfirmationDialog,
  },
  mixins: [enrolmentReportMixin],
  data() {
    return {
      originalEnrolmentReport: {},
      dailyEnrolments: [],
      originalDailyEnrolments: [],
      showBackConfirmationDialog: false,
    };
  },
  computed: {
    isGroup() {
      return this.enrolmentReport?.organizationProviderType === ORGANIZATION_PROVIDER_TYPES.GROUP;
    },
  },
  async created() {
    window.scrollTo(0, 0);
    this.CATEGORY_FIELDS = [
      'less0To18',
      'over0To18',
      'less18To36',
      'over18To36',
      'less3YK',
      'over3YK',
      'lessOOSCK',
      'overOOSCK',
      'lessOOSCG',
      'overOOSCG',
    ];
    if (this.isGroup) {
      this.CATEGORY_FIELDS.push('lessPre');
    }
    await this.loadData();
    this.calculate();
  },
  methods: {
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
      this.normalizeRates();
      this.originalEnrolmentReport = cloneDeep(this.enrolmentReport);
    },

    async loadDailyEnrolments() {
      this.dailyEnrolments = await EnrolmentReportService.getDailyEnrolments(this.$route.params.enrolmentReportId);
      this.originalDailyEnrolments = cloneDeep(this.dailyEnrolments);
    },

    getApprovedParentFees(fee) {
      return formatDecimalNumber(fee) ?? EMPTY_PLACEHOLDER;
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
          return EMPTY_PLACEHOLDER;
      }
    },

    getRowClass(dailyEnrolment, rowIndex) {
      return {
        'background-light-blue': dailyEnrolment.dayType === DAY_TYPES.STATUTORY,
        'background-light-yellow': dailyEnrolment.dayType === DAY_TYPES.WEEKEND,
        'border-bottom': rowIndex < this.dailyEnrolments.length - 1,
      };
    },

    buildCalculationFieldName(prefix, category) {
      const updatedCategory = category.charAt(0).toUpperCase() + category.slice(1);
      return prefix + updatedCategory;
    },

    normalizeRates() {
      this.CATEGORY_FIELDS.forEach((category) => {
        const ccfriRateField = this.buildCalculationFieldName('dailyCcfriRate', category);
        this.enrolmentReport[ccfriRateField] = this.enrolmentReport[ccfriRateField] || 0;
        this.enrolmentReport.baseFundingRates[category] = this.enrolmentReport.baseFundingRates[category] || 0;
        this.enrolmentReport.ccfriProviderPaymentRates[category] =
          this.enrolmentReport.ccfriProviderPaymentRates[category] || 0;
      });
    },

    calculateCurrentTotals() {
      const currentTotals = Object.fromEntries(this.CATEGORY_FIELDS.map((category) => [category, 0]));
      this.dailyEnrolments.forEach((dailyEnrolment) => {
        this.CATEGORY_FIELDS.forEach((category) => {
          currentTotals[category] += dailyEnrolment[category] || 0;
        });
      });
      this.CATEGORY_FIELDS.forEach((category) => {
        const currentTotalField = this.buildCalculationFieldName('currentTotal', category);
        this.enrolmentReport[currentTotalField] = currentTotals[category] || 0;
      });
    },

    calculateBaseFundingAmounts() {
      this.CATEGORY_FIELDS.forEach((category) => {
        const currentTotalField = this.buildCalculationFieldName('currentTotal', category);
        const ccofBaseAmountField = this.buildCalculationFieldName('ccofBaseAmount', category);
        this.enrolmentReport[ccofBaseAmountField] = multiplyDecimal(
          this.enrolmentReport[currentTotalField],
          this.enrolmentReport.baseFundingRates[category],
        );
      });
    },

    calculateCcfriAmounts() {
      this.CATEGORY_FIELDS.forEach((category) => {
        const currentTotalField = this.buildCalculationFieldName('currentTotal', category);
        const ccfriAmountField = this.buildCalculationFieldName('ccfriAmount', category);
        const ccfriRateField = this.buildCalculationFieldName('dailyCcfriRate', category);
        this.enrolmentReport[ccfriAmountField] = multiplyDecimal(
          this.enrolmentReport[currentTotalField],
          this.enrolmentReport[ccfriRateField],
        );
      });
    },

    calculateCcfriProviderAmounts() {
      this.CATEGORY_FIELDS.forEach((category) => {
        const currentTotalField = this.buildCalculationFieldName('currentTotal', category);
        const ccfriProviderAmountField = this.buildCalculationFieldName('ccfriProviderAmount', category);
        this.enrolmentReport[ccfriProviderAmountField] = multiplyDecimal(
          this.enrolmentReport[currentTotalField],
          this.enrolmentReport.ccfriProviderPaymentRates[category],
        );
      });
    },

    calculateGrantTotals() {
      const grantTotals = {
        ccofBaseAmount: 0,
        ccfriAmount: 0,
        ccfriProviderAmount: 0,
      };
      this.CATEGORY_FIELDS.forEach((category) => {
        const ccofBaseAmountField = this.buildCalculationFieldName('ccofBaseAmount', category);
        const ccfriAmountField = this.buildCalculationFieldName('ccfriAmount', category);
        const ccfriProviderAmountField = this.buildCalculationFieldName('ccfriProviderAmount', category);
        grantTotals.ccofBaseAmount = addDecimal(grantTotals.ccofBaseAmount, this.enrolmentReport[ccofBaseAmountField]);
        grantTotals.ccfriAmount = addDecimal(grantTotals.ccfriAmount, this.enrolmentReport[ccfriAmountField]);
        grantTotals.ccfriProviderAmount = addDecimal(
          grantTotals.ccfriProviderAmount,
          this.enrolmentReport[ccfriProviderAmountField],
        );
      });
      this.enrolmentReport.grandTotalBase = grantTotals.ccofBaseAmount || 0;
      this.enrolmentReport.grandTotalCcfri = grantTotals.ccfriAmount || 0;
      this.enrolmentReport.grandTotalCcfriProvider = grantTotals.ccfriProviderAmount || 0;
    },

    calculate() {
      this.calculateCurrentTotals();
      this.calculateBaseFundingAmounts();
      this.calculateCcfriAmounts();
      this.calculateCcfriProviderAmounts();
      this.calculateGrantTotals();
    },

    previous() {
      if (this.readonly) {
        this.$router.push(PATHS.ROOT.ENROLMENT_REPORTS);
      } else {
        this.showBackConfirmationDialog = true;
      }
    },

    async next() {
      await this.save(false);
      this.$router.push(`${PATHS.ROOT.ENROLMENT_REPORTS}/${this.$route.params.enrolmentReportId}/declaration`);
    },

    async save(showMessage) {
      if (this.readonly) return;
      try {
        this.processing = true;
        this.calculate();
        await this.saveEnrolmentReport();
        await this.saveDailyEnrolments();
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

    buildEnrolmentReportKeysForBackend() {
      const keysForBackend = [
        'totalEnrolled0To18',
        'totalEnrolled18To36',
        'totalEnrolled3YK',
        'totalEnrolledOOSCK',
        'totalEnrolledOOSCG',
        'grandTotalBase',
        'grandTotalCcfri',
        'grandTotalCcfriProvider',
      ];
      this.CATEGORY_FIELDS.forEach((category) => {
        const currentTotalField = this.buildCalculationFieldName('currentTotal', category);
        const ccofBaseAmountField = this.buildCalculationFieldName('ccofBaseAmount', category);
        const ccfriAmountField = this.buildCalculationFieldName('ccfriAmount', category);
        const ccfriProviderAmountField = this.buildCalculationFieldName('ccfriProviderAmount', category);
        keysForBackend.push(currentTotalField, ccofBaseAmountField, ccfriAmountField, ccfriProviderAmountField);
      });
      if (this.isGroup) {
        keysForBackend.push(
          'totalEnrolledPre',
          'currentTotalLessPre',
          'ccofBaseAmountLessPre',
          'ccfriAmountLessPre',
          'ccfriProviderAmountLessPre',
        );
      }
      return keysForBackend;
    },

    async saveEnrolmentReport() {
      const keysForBackend = this.buildEnrolmentReportKeysForBackend();
      if (isEqual(pick(this.originalEnrolmentReport, keysForBackend), pick(this.enrolmentReport, keysForBackend))) {
        return;
      }
      const payload = pick(this.enrolmentReport, keysForBackend);
      await EnrolmentReportService.updateEnrolmentReport(this.$route.params.enrolmentReportId, payload);
      await this.loadEnrolmentReport();
    },

    async saveDailyEnrolments() {
      const keysForBackend = [...this.CATEGORY_FIELDS, 'dailyEnrolmentId'];
      const updatedDailyEnrolments = getUpdatedObjectsByKeys(
        this.originalDailyEnrolments,
        this.dailyEnrolments,
        keysForBackend,
        'dailyEnrolmentId',
      );
      if (isEmpty(updatedDailyEnrolments)) return;
      const payload = updatedDailyEnrolments?.map((item) => pick(item, keysForBackend));
      await EnrolmentReportService.updateDailyEnrolments(this.$route.params.enrolmentReportId, payload);
      await this.loadDailyEnrolments();
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
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.table-scroll-wrapper {
  border: 1px solid;
  max-height: 60vh;
  min-width: 1700px;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.sticky-row {
  position: sticky;
  z-index: 3;
}

.sticky-row.row-0 {
  top: 0px;
  height: 32px;
}

.sticky-row.row-1 {
  top: 32px;
}

.text-cell {
  padding: 4px 0px !important;
}

.legend {
  display: flex;
  gap: 12px 24px;
  flex-wrap: wrap;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.color-box {
  min-width: 60px;
  min-height: 25px;
  border: 1px solid;
  border-radius: 2px;
}
</style>
