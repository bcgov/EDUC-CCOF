<template>
  <v-container fluid class="page-scroll-wrapper px-8 px-xl-12 pt-0 mb-12">
    <div v-if="loading" class="text-center">
      <v-progress-circular indeterminate size="100" :width="6" color="#003366" class="min-height-screen" />
    </div>
    <template v-else>
      <EnrolmentReportHeader :enrolment-report="enrolmentReport" />
      <v-skeleton-loader v-if="processing" :loading="processing" type="table-tbody" class="mt-4 mb-8" />
      <v-card v-else variant="outlined" class="overflow-auto mt-4 pa-4 pt-0 pa-md-8 pt-md-0">
        <v-row no-gutters class="py-2">
          <span class="pr-2 pt-4">Report full month closure or no enrolment</span>
          <v-switch
            v-model="enrolmentReport.isFullMonthClosure"
            :disabled="readonly"
            color="primary"
            hide-details
            @update:model-value="toggleFullMonthClosure"
          />
          <span class="pt-4 pl-2">
            <AppTooltip
              tooltip-content="Select this if your facility was closed or had no enrolment for the entire reporting month."
            />
          </span>
        </v-row>
        <div class="table-scroll-wrapper mb-6">
          <v-row no-gutters class="background-light-grey border-bottom font-weight-bold sticky-row row-0">
            <v-col class="border-right first-column cell-text-center"></v-col>
            <v-col class="border-right cell-text-center">0 - 18 Months</v-col>
            <v-col class="border-right cell-text-center">18 - 36 Months</v-col>
            <v-col class="border-right cell-text-center">3 Years to Kinder</v-col>
            <v-col class="border-right cell-text-center">Kinder Before & After</v-col>
            <v-col class="border-right cell-text-center">Grade 1 - 12 Years</v-col>
            <v-col v-if="isGroup" cols="1" class="border-right cell-text-center">Preschool</v-col>
          </v-row>
          <v-row no-gutters class="border-bottom text-center">
            <v-col class="first-column border-right background-light-grey d-flex align-center justify-center">
              <span class="pr-1"> Total Enrolled </span>
              <AppTooltip
                tooltip-content="For each rate category, enter the number of individual children, including drop-ins, who were enrolled this month."
              />
            </v-col>
            <v-col class="border-right">
              <AppNumberInput
                v-model="enrolmentReport.totalEnrolled0To18"
                maxlength="3"
                :disabled="isFormDisabled"
                :default-value="0"
                :class="getTotalEnrolledClass('totalEnrolled0To18')"
              />
            </v-col>
            <v-col class="border-right">
              <AppNumberInput
                v-model="enrolmentReport.totalEnrolled18To36"
                maxlength="3"
                :disabled="isFormDisabled"
                :default-value="0"
                :class="getTotalEnrolledClass('totalEnrolled18To36')"
              />
            </v-col>
            <v-col class="border-right">
              <AppNumberInput
                v-model="enrolmentReport.totalEnrolled3YK"
                maxlength="3"
                :disabled="isFormDisabled"
                :default-value="0"
                :class="getTotalEnrolledClass('totalEnrolled3YK')"
              />
            </v-col>
            <v-col class="border-right">
              <AppNumberInput
                v-model="enrolmentReport.totalEnrolledOOSCK"
                maxlength="3"
                :disabled="isFormDisabled"
                :default-value="0"
                :class="getTotalEnrolledClass('totalEnrolledOOSCK')"
              />
            </v-col>
            <v-col class="border-right">
              <AppNumberInput
                v-model="enrolmentReport.totalEnrolledOOSCG"
                maxlength="3"
                :disabled="isFormDisabled"
                :default-value="0"
                :class="getTotalEnrolledClass('totalEnrolledOOSCG')"
              />
            </v-col>
            <v-col v-if="isGroup" cols="1" class="border-right">
              <AppNumberInput
                v-model="enrolmentReport.totalEnrolledPre"
                maxlength="3"
                :disabled="isFormDisabled"
                :default-value="0"
                :class="getTotalEnrolledClass('totalEnrolledPre')"
              />
            </v-col>
          </v-row>
          <v-row
            v-if="hasPermission(PERMISSIONS.VIEW_A_CR)"
            no-gutters
            class="background-light-grey border-bottom border-right px-8 py-2"
          >
            <p>
              Approved Parent Fees are the fees approved by the program. If any of these fees are incorrect, click
              <router-link :to="PATHS.ROOT.CHANGE_LANDING">
                <span class="text-primary text-decoration-underline">here</span>
              </router-link>
              to request a change.
            </p>
          </v-row>
          <v-row no-gutters class="background-light-grey border-bottom">
            <v-col class="border-right first-column cell-text-center">Approved Parent Fees $</v-col>
            <v-col class="border-right cell-text-center">
              {{ getApprovedParentFees(enrolmentReport.approvedParentFees0To18) }}
            </v-col>
            <v-col class="border-right cell-text-center">
              {{ getApprovedParentFees(enrolmentReport.approvedParentFees18To36) }}
            </v-col>
            <v-col class="border-right cell-text-center">
              {{ getApprovedParentFees(enrolmentReport.approvedParentFees3YK) }}
            </v-col>
            <v-col class="border-right cell-text-center">
              {{ getApprovedParentFees(enrolmentReport.approvedParentFeesOOSCK) }}
            </v-col>
            <v-col class="border-right cell-text-center">
              {{ getApprovedParentFees(enrolmentReport.approvedParentFeesOOSCG) }}
            </v-col>
            <v-col v-if="isGroup" cols="1" class="border-right cell-text-center">
              {{ getApprovedParentFees(enrolmentReport.approvedParentFeesPre) }}
            </v-col>
          </v-row>
          <v-row no-gutters class="background-light-grey">
            <v-col class="border-right first-column cell-text-center">Frequency</v-col>
            <v-col class="border-right cell-text-center">
              {{ getParentFeesFrequency(enrolmentReport.approvedParentFeesFrequency0To18) }}
            </v-col>
            <v-col class="border-right cell-text-center">
              {{ getParentFeesFrequency(enrolmentReport.approvedParentFeesFrequency18To36) }}
            </v-col>
            <v-col class="border-right cell-text-center">
              {{ getParentFeesFrequency(enrolmentReport.approvedParentFeesFrequency3YK) }}
            </v-col>
            <v-col class="border-right cell-text-center">
              {{ getParentFeesFrequency(enrolmentReport.approvedParentFeesFrequencyOOSCK) }}
            </v-col>
            <v-col class="border-right cell-text-center">
              {{ getParentFeesFrequency(enrolmentReport.approvedParentFeesFrequencyOOSCG) }}
            </v-col>
            <v-col v-if="isGroup" cols="1" class="border-right cell-text-center">
              {{ getParentFeesFrequency(enrolmentReport.approvedParentFeesFrequencyPre) }}
            </v-col>
          </v-row>
          <v-row no-gutters class="background-light-grey border-bottom border-top sticky-row row-1">
            <v-col class="border-right first-column cell-text-center">Day</v-col>
            <v-col v-for="i in 5" :key="i" class="border-right">
              <v-row no-gutters>
                <v-col class="border-right cell-text-center">4 Hours Or Less</v-col>
                <v-col class="cell-text-center">Over 4 Hours</v-col>
              </v-row>
            </v-col>
            <v-col v-if="isGroup" cols="1" class="border-right cell-text-center" />
          </v-row>
          <v-row
            v-for="(dailyEnrolment, rowIndex) in dailyEnrolments"
            :key="dailyEnrolment.dailyEnrolmentId"
            no-gutters
            :class="getRowClass(dailyEnrolment, rowIndex)"
          >
            <v-col class="background-light-grey border-right first-column d-flex align-center justify-center">
              <span>{{ dailyEnrolment.day }}</span>
              <span class="day-label">
                {{ getDayOfWeek(dailyEnrolment.day, enrolmentReport.month, enrolmentReport.year) }}
              </span>
            </v-col>
            <v-col>
              <v-row no-gutters>
                <v-col class="border-right">
                  <AppNumberInput
                    v-model="dailyEnrolment.less0To18"
                    maxlength="3"
                    :disabled="isFormDisabled"
                    :class="getDailyEnrolmentClass(dailyEnrolment, 'less0To18')"
                  />
                </v-col>
                <v-col class="border-right">
                  <AppNumberInput
                    v-model="dailyEnrolment.over0To18"
                    maxlength="3"
                    :disabled="isFormDisabled"
                    :class="getDailyEnrolmentClass(dailyEnrolment, 'over0To18')"
                  />
                </v-col>
              </v-row>
            </v-col>
            <v-col>
              <v-row no-gutters>
                <v-col class="border-right">
                  <AppNumberInput
                    v-model="dailyEnrolment.less18To36"
                    maxlength="3"
                    :disabled="isFormDisabled"
                    :class="getDailyEnrolmentClass(dailyEnrolment, 'less18To36')"
                  />
                </v-col>
                <v-col class="border-right">
                  <AppNumberInput
                    v-model="dailyEnrolment.over18To36"
                    maxlength="3"
                    :disabled="isFormDisabled"
                    :class="getDailyEnrolmentClass(dailyEnrolment, 'over18To36')"
                  />
                </v-col>
              </v-row>
            </v-col>
            <v-col>
              <v-row no-gutters>
                <v-col class="border-right">
                  <AppNumberInput
                    v-model="dailyEnrolment.less3YK"
                    maxlength="3"
                    :disabled="isFormDisabled"
                    :class="getDailyEnrolmentClass(dailyEnrolment, 'less3YK')"
                  />
                </v-col>
                <v-col class="border-right">
                  <AppNumberInput
                    v-model="dailyEnrolment.over3YK"
                    maxlength="3"
                    :disabled="isFormDisabled"
                    :class="getDailyEnrolmentClass(dailyEnrolment, 'over3YK')"
                  />
                </v-col>
              </v-row>
            </v-col>
            <v-col>
              <v-row no-gutters>
                <v-col class="border-right">
                  <AppNumberInput
                    v-model="dailyEnrolment.lessOOSCK"
                    maxlength="3"
                    :disabled="isFormDisabled"
                    :class="getDailyEnrolmentClass(dailyEnrolment, 'lessOOSCK')"
                  />
                </v-col>
                <v-col class="border-right">
                  <AppNumberInput
                    v-model="dailyEnrolment.overOOSCK"
                    maxlength="3"
                    :disabled="isFormDisabled"
                    :class="getDailyEnrolmentClass(dailyEnrolment, 'overOOSCK')"
                  />
                </v-col>
              </v-row>
            </v-col>
            <v-col>
              <v-row no-gutters>
                <v-col class="border-right">
                  <AppNumberInput
                    v-model="dailyEnrolment.lessOOSCG"
                    maxlength="3"
                    :disabled="isFormDisabled"
                    :class="getDailyEnrolmentClass(dailyEnrolment, 'lessOOSCG')"
                  />
                </v-col>
                <v-col class="border-right">
                  <AppNumberInput
                    v-model="dailyEnrolment.overOOSCG"
                    maxlength="3"
                    :disabled="isFormDisabled"
                    :class="getDailyEnrolmentClass(dailyEnrolment, 'overOOSCG')"
                  />
                </v-col>
              </v-row>
            </v-col>
            <v-col v-if="isGroup" cols="1">
              <v-row no-gutters>
                <v-col class="border-right">
                  <AppNumberInput
                    v-model="dailyEnrolment.lessPre"
                    maxlength="3"
                    :disabled="isFormDisabled"
                    :class="getDailyEnrolmentClass(dailyEnrolment, 'lessPre')"
                  />
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-row no-gutters class="background-light-grey border-top-yellow">
            <v-col class="border-right first-column font-weight-bold cell-text-left">Current Total</v-col>
            <v-col class="border-right">
              <v-row no-gutters>
                <v-col class="border-right cell-text-right">{{ enrolmentReport.currentTotalLess0To18 }}</v-col>
                <v-col class="cell-text-right">{{ enrolmentReport.currentTotalOver0To18 }}</v-col>
              </v-row>
            </v-col>
            <v-col class="border-right">
              <v-row no-gutters>
                <v-col class="border-right cell-text-right">{{ enrolmentReport.currentTotalLess18To36 }}</v-col>
                <v-col class="cell-text-right">{{ enrolmentReport.currentTotalOver18To36 }}</v-col>
              </v-row>
            </v-col>
            <v-col class="border-right">
              <v-row no-gutters>
                <v-col class="border-right cell-text-right">{{ enrolmentReport.currentTotalLess3YK }}</v-col>
                <v-col class="cell-text-right">{{ enrolmentReport.currentTotalOver3YK }}</v-col>
              </v-row>
            </v-col>
            <v-col class="border-right">
              <v-row no-gutters>
                <v-col class="border-right cell-text-right">{{ enrolmentReport.currentTotalLessOOSCK }}</v-col>
                <v-col class="cell-text-right">{{ enrolmentReport.currentTotalOverOOSCK }}</v-col>
              </v-row>
            </v-col>
            <v-col class="border-right">
              <v-row no-gutters>
                <v-col class="border-right cell-text-right">{{ enrolmentReport.currentTotalLessOOSCG }}</v-col>
                <v-col class="cell-text-right">{{ enrolmentReport.currentTotalOverOOSCG }}</v-col>
              </v-row>
            </v-col>
            <v-col v-if="isGroup" cols="1" class="border-right cell-text-right">
              {{ enrolmentReport.currentTotalLessPre }}
            </v-col>
          </v-row>
          <template v-if="enrolmentReport.isAdjustment">
            <v-row no-gutters class="background-light-grey border-top">
              <v-col class="border-right first-column font-weight-bold cell-text-left">Prev Approved</v-col>
              <v-col class="border-right">
                <v-row no-gutters>
                  <v-col class="border-right cell-text-right">
                    {{ previousEnrolmentReport.currentTotalLess0To18 }}
                  </v-col>
                  <v-col class="cell-text-right">
                    {{ previousEnrolmentReport.currentTotalOver0To18 }}
                  </v-col>
                </v-row>
              </v-col>
              <v-col class="border-right">
                <v-row no-gutters>
                  <v-col class="border-right cell-text-right">
                    {{ previousEnrolmentReport.currentTotalLess18To36 }}
                  </v-col>
                  <v-col class="cell-text-right">{{ previousEnrolmentReport.currentTotalOver18To36 }}</v-col>
                </v-row>
              </v-col>
              <v-col class="border-right">
                <v-row no-gutters>
                  <v-col class="border-right cell-text-right">{{ previousEnrolmentReport.currentTotalLess3YK }}</v-col>
                  <v-col class="cell-text-right">{{ previousEnrolmentReport.currentTotalOver3YK }}</v-col>
                </v-row>
              </v-col>
              <v-col class="border-right">
                <v-row no-gutters>
                  <v-col class="border-right cell-text-right">
                    {{ previousEnrolmentReport.currentTotalLessOOSCK }}
                  </v-col>
                  <v-col class="cell-text-right">{{ previousEnrolmentReport.currentTotalOverOOSCK }}</v-col>
                </v-row>
              </v-col>
              <v-col class="border-right">
                <v-row no-gutters>
                  <v-col class="border-right cell-text-right">
                    {{ previousEnrolmentReport.currentTotalLessOOSCG }}
                  </v-col>
                  <v-col class="cell-text-right">{{ previousEnrolmentReport.currentTotalOverOOSCG }}</v-col>
                </v-row>
              </v-col>
              <v-col v-if="isGroup" cols="1" class="border-right cell-text-right">
                {{ previousEnrolmentReport.currentTotalLessPre }}
              </v-col>
            </v-row>
            <v-row no-gutters class="background-light-grey border-top">
              <v-col class="border-right first-column font-weight-bold cell-text-left">Difference</v-col>
              <v-col class="border-right">
                <v-row no-gutters>
                  <v-col class="border-right cell-text-right">
                    {{ enrolmentReport.differences?.diffCurrentTotalLess0To18 }}
                  </v-col>
                  <v-col class="cell-text-right">
                    {{ enrolmentReport.differences?.diffCurrentTotalOver0To18 }}
                  </v-col>
                </v-row>
              </v-col>
              <v-col class="border-right">
                <v-row no-gutters>
                  <v-col class="border-right cell-text-right">
                    {{ enrolmentReport.differences?.diffCurrentTotalLess18To36 }}
                  </v-col>
                  <v-col class="cell-text-right">
                    {{ enrolmentReport.differences?.diffCurrentTotalOver18To36 }}
                  </v-col>
                </v-row>
              </v-col>
              <v-col class="border-right">
                <v-row no-gutters>
                  <v-col class="border-right cell-text-right">
                    {{ enrolmentReport.differences?.diffCurrentTotalLess3YK }}
                  </v-col>
                  <v-col class="cell-text-right">
                    {{ enrolmentReport.differences?.diffCurrentTotalOver3YK }}
                  </v-col>
                </v-row>
              </v-col>
              <v-col class="border-right">
                <v-row no-gutters>
                  <v-col class="border-right cell-text-right">
                    {{ enrolmentReport.differences?.diffCurrentTotalLessOOSCK }}
                  </v-col>
                  <v-col class="cell-text-right">
                    {{ enrolmentReport.differences?.diffCurrentTotalOverOOSCK }}
                  </v-col>
                </v-row>
              </v-col>
              <v-col class="border-right">
                <v-row no-gutters>
                  <v-col class="border-right cell-text-right">
                    {{ enrolmentReport.differences?.diffCurrentTotalLessOOSCG }}
                  </v-col>
                  <v-col class="cell-text-right">
                    {{ enrolmentReport.differences?.diffCurrentTotalOverOOSCG }}
                  </v-col>
                </v-row>
              </v-col>
              <v-col v-if="isGroup" cols="1" class="border-right cell-text-right">
                {{ enrolmentReport.differences?.diffCurrentTotalLessPre }}
              </v-col>
            </v-row>
          </template>

          <div class="border-top-blue">
            <v-row v-if="hasClosureDays" no-gutters class="background-light-grey">
              <v-col class="border-right first-column font-weight-bold cell-text-left">
                CCOF Base Eligible Enrolment Counts
              </v-col>
              <v-col class="border-right">
                <v-row no-gutters>
                  <v-col class="border-right cell-text-right">{{ paymentEligibleDaysCount.CCOF['less0To18'] }}</v-col>
                  <v-col class="cell-text-right">{{ paymentEligibleDaysCount.CCOF['over0To18'] }}</v-col>
                </v-row>
              </v-col>
              <v-col class="border-right">
                <v-row no-gutters>
                  <v-col class="border-right cell-text-right">{{ paymentEligibleDaysCount.CCOF['less18To36'] }}</v-col>
                  <v-col class="cell-text-right">{{ paymentEligibleDaysCount.CCOF['over18To36'] }}</v-col>
                </v-row>
              </v-col>
              <v-col class="border-right">
                <v-row no-gutters>
                  <v-col class="border-right cell-text-right">{{ paymentEligibleDaysCount.CCOF['less3YK'] }}</v-col>
                  <v-col class="cell-text-right">{{ paymentEligibleDaysCount.CCOF['over3YK'] }}</v-col>
                </v-row>
              </v-col>
              <v-col class="border-right">
                <v-row no-gutters>
                  <v-col class="border-right cell-text-right">{{ paymentEligibleDaysCount.CCOF['lessOOSCK'] }}</v-col>
                  <v-col class="cell-text-right">{{ paymentEligibleDaysCount.CCOF['overOOSCK'] }}</v-col>
                </v-row>
              </v-col>
              <v-col class="border-right">
                <v-row no-gutters>
                  <v-col class="border-right cell-text-right">{{ paymentEligibleDaysCount.CCOF['lessOOSCG'] }}</v-col>
                  <v-col class="cell-text-right">{{ paymentEligibleDaysCount.CCOF['overOOSCG'] }}</v-col>
                </v-row>
              </v-col>
              <v-col v-if="isGroup" cols="1" class="border-right cell-text-right">
                {{ paymentEligibleDaysCount.CCOF['lessPre'] }}
              </v-col>
            </v-row>
            <v-row no-gutters class="background-light-grey border-top">
              <v-col class="border-right first-column font-weight-bold cell-text-left">CCOF Base Rate $</v-col>
              <v-col class="border-right">
                <v-row no-gutters>
                  <v-col class="border-right cell-text-right">
                    {{ formatCurrency(enrolmentReport.baseFundingRates.less0To18) }}
                  </v-col>
                  <v-col class="cell-text-right">
                    {{ formatCurrency(enrolmentReport.baseFundingRates.over0To18) }}
                  </v-col>
                </v-row>
              </v-col>
              <v-col class="border-right">
                <v-row no-gutters>
                  <v-col class="border-right cell-text-right">
                    {{ formatCurrency(enrolmentReport.baseFundingRates.less18To36) }}
                  </v-col>
                  <v-col class="cell-text-right">
                    {{ formatCurrency(enrolmentReport.baseFundingRates.over18To36) }}
                  </v-col>
                </v-row>
              </v-col>
              <v-col class="border-right">
                <v-row no-gutters>
                  <v-col class="border-right cell-text-right">
                    {{ formatCurrency(enrolmentReport.baseFundingRates.less3YK) }}
                  </v-col>
                  <v-col class="cell-text-right">
                    {{ formatCurrency(enrolmentReport.baseFundingRates.over3YK) }}
                  </v-col>
                </v-row>
              </v-col>
              <v-col class="border-right">
                <v-row no-gutters>
                  <v-col class="border-right cell-text-right">
                    {{ formatCurrency(enrolmentReport.baseFundingRates.lessOOSCK) }}
                  </v-col>
                  <v-col class="cell-text-right">
                    {{ formatCurrency(enrolmentReport.baseFundingRates.overOOSCK) }}
                  </v-col>
                </v-row>
              </v-col>
              <v-col class="border-right">
                <v-row no-gutters>
                  <v-col class="border-right cell-text-right">
                    {{ formatCurrency(enrolmentReport.baseFundingRates.lessOOSCG) }}
                  </v-col>
                  <v-col class="cell-text-right">
                    {{ formatCurrency(enrolmentReport.baseFundingRates.overOOSCG) }}
                  </v-col>
                </v-row>
              </v-col>
              <v-col v-if="isGroup" cols="1" class="border-right cell-text-right">
                {{ formatCurrency(enrolmentReport.baseFundingRates.lessPre) }}
              </v-col>
            </v-row>
            <v-row no-gutters class="background-light-grey border-top">
              <v-col class="border-right first-column font-weight-bold cell-text-left">CCOF Base $</v-col>
              <v-col class="border-right">
                <v-row no-gutters>
                  <v-col class="border-right cell-text-right">
                    {{ formatCurrency(enrolmentReport.ccofBaseAmountLess0To18) }}
                  </v-col>
                  <v-col class="cell-text-right">{{ formatCurrency(enrolmentReport.ccofBaseAmountOver0To18) }}</v-col>
                </v-row>
              </v-col>
              <v-col class="border-right">
                <v-row no-gutters>
                  <v-col class="border-right cell-text-right">
                    {{ formatCurrency(enrolmentReport.ccofBaseAmountLess18To36) }}
                  </v-col>
                  <v-col class="cell-text-right">{{ formatCurrency(enrolmentReport.ccofBaseAmountOver18To36) }}</v-col>
                </v-row>
              </v-col>
              <v-col class="border-right">
                <v-row no-gutters>
                  <v-col class="border-right cell-text-right">
                    {{ formatCurrency(enrolmentReport.ccofBaseAmountLess3YK) }}
                  </v-col>
                  <v-col class="cell-text-right">{{ formatCurrency(enrolmentReport.ccofBaseAmountOver3YK) }}</v-col>
                </v-row>
              </v-col>
              <v-col class="border-right">
                <v-row no-gutters>
                  <v-col class="border-right cell-text-right">
                    {{ formatCurrency(enrolmentReport.ccofBaseAmountLessOOSCK) }}
                  </v-col>
                  <v-col class="cell-text-right">{{ formatCurrency(enrolmentReport.ccofBaseAmountOverOOSCK) }}</v-col>
                </v-row>
              </v-col>
              <v-col class="border-right">
                <v-row no-gutters>
                  <v-col class="border-right cell-text-right">
                    {{ formatCurrency(enrolmentReport.ccofBaseAmountLessOOSCG) }}
                  </v-col>
                  <v-col class="cell-text-right">{{ formatCurrency(enrolmentReport.ccofBaseAmountOverOOSCG) }}</v-col>
                </v-row>
              </v-col>
              <v-col v-if="isGroup" cols="1" class="border-right cell-text-right">
                {{ formatCurrency(enrolmentReport.ccofBaseAmountLessPre) }}
              </v-col>
            </v-row>
            <template v-if="enrolmentReport.isAdjustment">
              <v-row no-gutters class="background-light-grey border-top">
                <v-col class="border-right first-column font-weight-bold cell-text-left">Prev CCOF Base $</v-col>
                <v-col class="border-right">
                  <v-row no-gutters>
                    <v-col class="border-right cell-text-right">
                      {{ formatCurrency(previousEnrolmentReport.ccofBaseAmountLess0To18) }}
                    </v-col>
                    <v-col class="cell-text-right">
                      {{ formatCurrency(previousEnrolmentReport.ccofBaseAmountOver0To18) }}
                    </v-col>
                  </v-row>
                </v-col>
                <v-col class="border-right">
                  <v-row no-gutters>
                    <v-col class="border-right cell-text-right">
                      {{ formatCurrency(previousEnrolmentReport.ccofBaseAmountLess18To36) }}
                    </v-col>
                    <v-col class="cell-text-right">
                      {{ formatCurrency(previousEnrolmentReport.ccofBaseAmountOver18To36) }}
                    </v-col>
                  </v-row>
                </v-col>
                <v-col class="border-right">
                  <v-row no-gutters>
                    <v-col class="border-right cell-text-right">
                      {{ formatCurrency(previousEnrolmentReport.ccofBaseAmountLess3YK) }}
                    </v-col>
                    <v-col class="cell-text-right">
                      {{ formatCurrency(previousEnrolmentReport.ccofBaseAmountOver3YK) }}
                    </v-col>
                  </v-row>
                </v-col>
                <v-col class="border-right">
                  <v-row no-gutters>
                    <v-col class="border-right cell-text-right">
                      {{ formatCurrency(previousEnrolmentReport.ccofBaseAmountLessOOSCK) }}
                    </v-col>
                    <v-col class="cell-text-right">
                      {{ formatCurrency(previousEnrolmentReport.ccofBaseAmountOverOOSCK) }}
                    </v-col>
                  </v-row>
                </v-col>
                <v-col class="border-right">
                  <v-row no-gutters>
                    <v-col class="border-right cell-text-right">
                      {{ formatCurrency(previousEnrolmentReport.ccofBaseAmountLessOOSCG) }}
                    </v-col>
                    <v-col class="cell-text-right">
                      {{ formatCurrency(previousEnrolmentReport.ccofBaseAmountOverOOSCG) }}
                    </v-col>
                  </v-row>
                </v-col>
                <v-col v-if="isGroup" cols="1" class="border-right cell-text-right">
                  {{ formatCurrency(previousEnrolmentReport.ccofBaseAmountLessPre) }}
                </v-col>
              </v-row>
              <v-row no-gutters class="background-light-grey border-top">
                <v-col class="border-right first-column font-weight-bold cell-text-left">Difference CCOF Base $</v-col>
                <v-col class="border-right">
                  <v-row no-gutters>
                    <v-col class="border-right cell-text-right">
                      {{ formatCurrency(enrolmentReport.differences?.diffCcofBaseAmountLess0To18) }}
                    </v-col>
                    <v-col class="cell-text-right">
                      {{ formatCurrency(enrolmentReport.differences?.diffCcofBaseAmountOver0To18) }}
                    </v-col>
                  </v-row>
                </v-col>
                <v-col class="border-right">
                  <v-row no-gutters>
                    <v-col class="border-right cell-text-right">
                      {{ formatCurrency(enrolmentReport.differences?.diffCcofBaseAmountLess18To36) }}
                    </v-col>
                    <v-col class="cell-text-right">
                      {{ formatCurrency(enrolmentReport.differences?.diffCcofBaseAmountOver18To36) }}
                    </v-col>
                  </v-row>
                </v-col>
                <v-col class="border-right">
                  <v-row no-gutters>
                    <v-col class="border-right cell-text-right">
                      {{ formatCurrency(enrolmentReport.differences?.diffCcofBaseAmountLess3YK) }}
                    </v-col>
                    <v-col class="cell-text-right">
                      {{ formatCurrency(enrolmentReport.differences?.diffCcofBaseAmountOver3YK) }}
                    </v-col>
                  </v-row>
                </v-col>
                <v-col class="border-right">
                  <v-row no-gutters>
                    <v-col class="border-right cell-text-right">
                      {{ formatCurrency(enrolmentReport.differences?.diffCcofBaseAmountLessOOSCK) }}
                    </v-col>
                    <v-col class="cell-text-right">
                      {{ formatCurrency(enrolmentReport.differences?.diffCcofBaseAmountOverOOSCK) }}
                    </v-col>
                  </v-row>
                </v-col>
                <v-col class="border-right">
                  <v-row no-gutters>
                    <v-col class="border-right cell-text-right">
                      {{ formatCurrency(enrolmentReport.differences?.diffCcofBaseAmountLessOOSCG) }}
                    </v-col>
                    <v-col class="cell-text-right">
                      {{ formatCurrency(enrolmentReport.differences?.diffCcofBaseAmountOverOOSCG) }}
                    </v-col>
                  </v-row>
                </v-col>
                <v-col v-if="isGroup" cols="1" class="border-right cell-text-right">
                  {{ formatCurrency(enrolmentReport.differences?.diffCcofBaseAmountLessPre) }}
                </v-col>
              </v-row>
            </template>
          </div>

          <div class="border-top-blue">
            <v-row v-if="hasClosureDays" no-gutters class="background-light-grey">
              <v-col class="border-right first-column font-weight-bold cell-text-left">
                CCFRI Eligible Enrolment Counts
              </v-col>
              <v-col class="border-right">
                <v-row no-gutters>
                  <v-col class="border-right cell-text-right">{{ paymentEligibleDaysCount.CCFRI['less0To18'] }}</v-col>
                  <v-col class="cell-text-right">{{ paymentEligibleDaysCount.CCFRI['over0To18'] }}</v-col>
                </v-row>
              </v-col>
              <v-col class="border-right">
                <v-row no-gutters>
                  <v-col class="border-right cell-text-right">{{ paymentEligibleDaysCount.CCFRI['less18To36'] }}</v-col>
                  <v-col class="cell-text-right">{{ paymentEligibleDaysCount.CCFRI['over18To36'] }}</v-col>
                </v-row>
              </v-col>
              <v-col class="border-right">
                <v-row no-gutters>
                  <v-col class="border-right cell-text-right">{{ paymentEligibleDaysCount.CCFRI['less3YK'] }}</v-col>
                  <v-col class="cell-text-right">{{ paymentEligibleDaysCount.CCFRI['over3YK'] }}</v-col>
                </v-row>
              </v-col>
              <v-col class="border-right">
                <v-row no-gutters>
                  <v-col class="border-right cell-text-right">{{ paymentEligibleDaysCount.CCFRI['lessOOSCK'] }}</v-col>
                  <v-col class="cell-text-right">{{ paymentEligibleDaysCount.CCFRI['overOOSCK'] }}</v-col>
                </v-row>
              </v-col>
              <v-col class="border-right">
                <v-row no-gutters>
                  <v-col class="border-right cell-text-right">{{ paymentEligibleDaysCount.CCFRI['lessOOSCG'] }}</v-col>
                  <v-col class="cell-text-right">{{ paymentEligibleDaysCount.CCFRI['overOOSCG'] }}</v-col>
                </v-row>
              </v-col>
              <v-col v-if="isGroup" cols="1" class="border-right cell-text-right">
                {{ paymentEligibleDaysCount.CCFRI['lessPre'] }}
              </v-col>
            </v-row>
            <v-row no-gutters class="background-light-grey border-top">
              <v-col class="border-right first-column font-weight-bold cell-text-left">Daily CCFRI Rate $</v-col>
              <v-col class="border-right">
                <v-row no-gutters>
                  <v-col class="border-right cell-text-right">
                    {{ formatCCFRICurrency(enrolmentReport.dailyCcfriRateLess0To18) }}
                  </v-col>
                  <v-col class="cell-text-right">
                    {{ formatCCFRICurrency(enrolmentReport.dailyCcfriRateOver0To18) }}
                  </v-col>
                </v-row>
              </v-col>
              <v-col class="border-right">
                <v-row no-gutters>
                  <v-col class="border-right cell-text-right">
                    {{ formatCCFRICurrency(enrolmentReport.dailyCcfriRateLess18To36) }}
                  </v-col>
                  <v-col class="cell-text-right">
                    {{ formatCCFRICurrency(enrolmentReport.dailyCcfriRateOver18To36) }}
                  </v-col>
                </v-row>
              </v-col>
              <v-col class="border-right">
                <v-row no-gutters>
                  <v-col class="border-right cell-text-right">
                    {{ formatCCFRICurrency(enrolmentReport.dailyCcfriRateLess3YK) }}
                  </v-col>
                  <v-col class="cell-text-right">
                    {{ formatCCFRICurrency(enrolmentReport.dailyCcfriRateOver3YK) }}
                  </v-col>
                </v-row>
              </v-col>
              <v-col class="border-right">
                <v-row no-gutters>
                  <v-col class="border-right cell-text-right">
                    {{ formatCCFRICurrency(enrolmentReport.dailyCcfriRateLessOOSCK) }}
                  </v-col>
                  <v-col class="cell-text-right">
                    {{ formatCCFRICurrency(enrolmentReport.dailyCcfriRateOverOOSCK) }}
                  </v-col>
                </v-row>
              </v-col>
              <v-col class="border-right">
                <v-row no-gutters>
                  <v-col class="border-right cell-text-right">
                    {{ formatCCFRICurrency(enrolmentReport.dailyCcfriRateLessOOSCG) }}
                  </v-col>
                  <v-col class="cell-text-right">
                    {{ formatCCFRICurrency(enrolmentReport.dailyCcfriRateOverOOSCG) }}
                  </v-col>
                </v-row>
              </v-col>
              <v-col v-if="isGroup" cols="1" class="border-right cell-text-right">
                {{ formatCCFRICurrency(enrolmentReport.dailyCcfriRateLessPre) }}
              </v-col>
            </v-row>
            <v-row no-gutters class="background-light-grey border-top">
              <v-col class="border-right first-column font-weight-bold cell-text-left">CCFRI $</v-col>
              <v-col class="border-right">
                <v-row no-gutters>
                  <v-col class="border-right cell-text-right">
                    {{ formatCCFRICurrency(enrolmentReport.ccfriAmountLess0To18) }}
                  </v-col>
                  <v-col class="cell-text-right">{{ formatCCFRICurrency(enrolmentReport.ccfriAmountOver0To18) }}</v-col>
                </v-row>
              </v-col>
              <v-col class="border-right">
                <v-row no-gutters>
                  <v-col class="border-right cell-text-right">
                    {{ formatCCFRICurrency(enrolmentReport.ccfriAmountLess18To36) }}
                  </v-col>
                  <v-col class="cell-text-right">
                    {{ formatCCFRICurrency(enrolmentReport.ccfriAmountOver18To36) }}
                  </v-col>
                </v-row>
              </v-col>
              <v-col class="border-right">
                <v-row no-gutters>
                  <v-col class="border-right cell-text-right">
                    {{ formatCCFRICurrency(enrolmentReport.ccfriAmountLess3YK) }}
                  </v-col>
                  <v-col class="cell-text-right">{{ formatCCFRICurrency(enrolmentReport.ccfriAmountOver3YK) }}</v-col>
                </v-row>
              </v-col>
              <v-col class="border-right">
                <v-row no-gutters>
                  <v-col class="border-right cell-text-right">
                    {{ formatCCFRICurrency(enrolmentReport.ccfriAmountLessOOSCK) }}
                  </v-col>
                  <v-col class="cell-text-right">{{ formatCCFRICurrency(enrolmentReport.ccfriAmountOverOOSCK) }}</v-col>
                </v-row>
              </v-col>
              <v-col class="border-right">
                <v-row no-gutters>
                  <v-col class="border-right cell-text-right">
                    {{ formatCCFRICurrency(enrolmentReport.ccfriAmountLessOOSCG) }}
                  </v-col>
                  <v-col class="cell-text-right">{{ formatCCFRICurrency(enrolmentReport.ccfriAmountOverOOSCG) }}</v-col>
                </v-row>
              </v-col>
              <v-col v-if="isGroup" cols="1" class="border-right cell-text-right">
                {{ formatCCFRICurrency(enrolmentReport.ccfriAmountLessPre) }}
              </v-col>
            </v-row>
            <template v-if="enrolmentReport.isAdjustment">
              <v-row no-gutters class="background-light-grey border-top">
                <v-col class="border-right first-column font-weight-bold cell-text-left">Prev CCFRI $</v-col>
                <v-col class="border-right">
                  <v-row no-gutters>
                    <v-col class="border-right cell-text-right">
                      {{ formatCCFRICurrency(previousEnrolmentReport.ccfriAmountLess0To18) }}
                    </v-col>
                    <v-col class="cell-text-right">
                      {{ formatCCFRICurrency(previousEnrolmentReport.ccfriAmountOver0To18) }}
                    </v-col>
                  </v-row>
                </v-col>
                <v-col class="border-right">
                  <v-row no-gutters>
                    <v-col class="border-right cell-text-right">
                      {{ formatCCFRICurrency(previousEnrolmentReport.ccfriAmountLess18To36) }}
                    </v-col>
                    <v-col class="cell-text-right">
                      {{ formatCCFRICurrency(previousEnrolmentReport.ccfriAmountOver18To36) }}
                    </v-col>
                  </v-row>
                </v-col>
                <v-col class="border-right">
                  <v-row no-gutters>
                    <v-col class="border-right cell-text-right">
                      {{ formatCCFRICurrency(previousEnrolmentReport.ccfriAmountLess3YK) }}
                    </v-col>
                    <v-col class="cell-text-right">
                      {{ formatCCFRICurrency(previousEnrolmentReport.ccfriAmountOver3YK) }}
                    </v-col>
                  </v-row>
                </v-col>
                <v-col class="border-right">
                  <v-row no-gutters>
                    <v-col class="border-right cell-text-right">
                      {{ formatCCFRICurrency(previousEnrolmentReport.ccfriAmountLessOOSCK) }}
                    </v-col>
                    <v-col class="cell-text-right">
                      {{ formatCCFRICurrency(previousEnrolmentReport.ccfriAmountOverOOSCK) }}
                    </v-col>
                  </v-row>
                </v-col>
                <v-col class="border-right">
                  <v-row no-gutters>
                    <v-col class="border-right cell-text-right">
                      {{ formatCCFRICurrency(previousEnrolmentReport.ccfriAmountLessOOSCG) }}
                    </v-col>
                    <v-col class="cell-text-right">
                      {{ formatCCFRICurrency(previousEnrolmentReport.ccfriAmountOverOOSCG) }}
                    </v-col>
                  </v-row>
                </v-col>
                <v-col v-if="isGroup" cols="1" class="border-right cell-text-right">
                  {{ formatCCFRICurrency(previousEnrolmentReport.ccfriAmountLessPre) }}
                </v-col>
              </v-row>
              <v-row no-gutters class="background-light-grey border-top">
                <v-col class="border-right first-column font-weight-bold cell-text-left">Difference CCFRI $</v-col>
                <v-col class="border-right">
                  <v-row no-gutters>
                    <v-col class="border-right cell-text-right">
                      {{ formatCCFRICurrency(enrolmentReport.differences?.diffCcfriAmountLess0To18) }}
                    </v-col>
                    <v-col class="cell-text-right">
                      {{ formatCCFRICurrency(enrolmentReport.differences?.diffCcfriAmountOver0To18) }}
                    </v-col>
                  </v-row>
                </v-col>
                <v-col class="border-right">
                  <v-row no-gutters>
                    <v-col class="border-right cell-text-right">
                      {{ formatCCFRICurrency(enrolmentReport.differences?.diffCcfriAmountLess18To36) }}
                    </v-col>
                    <v-col class="cell-text-right">
                      {{ formatCCFRICurrency(enrolmentReport.differences?.diffCcfriAmountOver18To36) }}
                    </v-col>
                  </v-row>
                </v-col>
                <v-col class="border-right">
                  <v-row no-gutters>
                    <v-col class="border-right cell-text-right">
                      {{ formatCCFRICurrency(enrolmentReport.differences?.diffCcfriAmountLess3YK) }}
                    </v-col>
                    <v-col class="cell-text-right">
                      {{ formatCCFRICurrency(enrolmentReport.differences?.diffCcfriAmountOver3YK) }}
                    </v-col>
                  </v-row>
                </v-col>
                <v-col class="border-right">
                  <v-row no-gutters>
                    <v-col class="border-right cell-text-right">
                      {{ formatCCFRICurrency(enrolmentReport.differences?.diffCcfriAmountLessOOSCK) }}
                    </v-col>
                    <v-col class="cell-text-right">
                      {{ formatCCFRICurrency(enrolmentReport.differences?.diffCcfriAmountOverOOSCK) }}
                    </v-col>
                  </v-row>
                </v-col>
                <v-col class="border-right">
                  <v-row no-gutters>
                    <v-col class="border-right cell-text-right">
                      {{ formatCCFRICurrency(enrolmentReport.differences?.diffCcfriAmountLessOOSCG) }}
                    </v-col>
                    <v-col class="cell-text-right">
                      {{ formatCCFRICurrency(enrolmentReport.differences?.diffCcfriAmountOverOOSCG) }}
                    </v-col>
                  </v-row>
                </v-col>
                <v-col v-if="isGroup" cols="1" class="border-right cell-text-right">
                  {{ formatCCFRICurrency(enrolmentReport.differences?.diffCcfriAmountLessPre) }}
                </v-col>
              </v-row>
            </template>
          </div>

          <div class="border-top-blue">
            <v-row v-if="hasClosureDays" no-gutters class="background-light-grey">
              <v-col class="border-right first-column font-weight-bold cell-text-left">
                CCFRI Provider Eligible Enrolment Counts
              </v-col>
              <v-col class="border-right">
                <v-row no-gutters>
                  <v-col class="border-right cell-text-right">{{ paymentEligibleDaysCount.CCFRI['less0To18'] }}</v-col>
                  <v-col class="cell-text-right">{{ paymentEligibleDaysCount.CCFRI['over0To18'] }}</v-col>
                </v-row>
              </v-col>
              <v-col class="border-right">
                <v-row no-gutters>
                  <v-col class="border-right cell-text-right">{{ paymentEligibleDaysCount.CCFRI['less18To36'] }}</v-col>
                  <v-col class="cell-text-right">{{ paymentEligibleDaysCount.CCFRI['over18To36'] }}</v-col>
                </v-row>
              </v-col>
              <v-col class="border-right">
                <v-row no-gutters>
                  <v-col class="border-right cell-text-right">{{ paymentEligibleDaysCount.CCFRI['less3YK'] }}</v-col>
                  <v-col class="cell-text-right">{{ paymentEligibleDaysCount.CCFRI['over3YK'] }}</v-col>
                </v-row>
              </v-col>
              <v-col class="border-right">
                <v-row no-gutters>
                  <v-col class="border-right cell-text-right">{{ paymentEligibleDaysCount.CCFRI['lessOOSCK'] }}</v-col>
                  <v-col class="cell-text-right">{{ paymentEligibleDaysCount.CCFRI['overOOSCK'] }}</v-col>
                </v-row>
              </v-col>
              <v-col class="border-right">
                <v-row no-gutters>
                  <v-col class="border-right cell-text-right">{{ paymentEligibleDaysCount.CCFRI['lessOOSCG'] }}</v-col>
                  <v-col class="cell-text-right">{{ paymentEligibleDaysCount.CCFRI['overOOSCG'] }}</v-col>
                </v-row>
              </v-col>
              <v-col v-if="isGroup" cols="1" class="border-right cell-text-right">
                {{ paymentEligibleDaysCount.CCFRI['lessPre'] }}
              </v-col>
            </v-row>
            <v-row no-gutters class="background-light-grey border-top">
              <v-col class="border-right first-column font-weight-bold cell-text-left">
                CCFRI Provider Payment Rate $
              </v-col>
              <v-col class="border-right">
                <v-row no-gutters>
                  <v-col class="border-right cell-text-right">
                    {{ formatCCFRICurrency(enrolmentReport.ccfriProviderPaymentRates.less0To18) }}
                  </v-col>
                  <v-col class="cell-text-right">
                    {{ formatCCFRICurrency(enrolmentReport.ccfriProviderPaymentRates.over0To18) }}
                  </v-col>
                </v-row>
              </v-col>
              <v-col class="border-right">
                <v-row no-gutters>
                  <v-col class="border-right cell-text-right">
                    {{ formatCCFRICurrency(enrolmentReport.ccfriProviderPaymentRates.less18To36) }}
                  </v-col>
                  <v-col class="cell-text-right">
                    {{ formatCCFRICurrency(enrolmentReport.ccfriProviderPaymentRates.over18To36) }}
                  </v-col>
                </v-row>
              </v-col>
              <v-col class="border-right">
                <v-row no-gutters>
                  <v-col class="border-right cell-text-right">
                    {{ formatCCFRICurrency(enrolmentReport.ccfriProviderPaymentRates.less3YK) }}
                  </v-col>
                  <v-col class="cell-text-right">
                    {{ formatCCFRICurrency(enrolmentReport.ccfriProviderPaymentRates.over3YK) }}
                  </v-col>
                </v-row>
              </v-col>
              <v-col class="border-right">
                <v-row no-gutters>
                  <v-col class="border-right cell-text-right">
                    {{ formatCCFRICurrency(enrolmentReport.ccfriProviderPaymentRates.lessOOSCK) }}
                  </v-col>
                  <v-col class="cell-text-right">
                    {{ formatCCFRICurrency(enrolmentReport.ccfriProviderPaymentRates.overOOSCK) }}
                  </v-col>
                </v-row>
              </v-col>
              <v-col class="border-right">
                <v-row no-gutters>
                  <v-col class="border-right cell-text-right">
                    {{ formatCCFRICurrency(enrolmentReport.ccfriProviderPaymentRates.lessOOSCG) }}
                  </v-col>
                  <v-col class="cell-text-right">
                    {{ formatCCFRICurrency(enrolmentReport.ccfriProviderPaymentRates.overOOSCG) }}
                  </v-col>
                </v-row>
              </v-col>
              <v-col v-if="isGroup" cols="1" class="border-right cell-text-right">
                {{ formatCCFRICurrency(enrolmentReport.ccfriProviderPaymentRates.lessPre) }}
              </v-col>
            </v-row>
            <v-row no-gutters class="background-light-grey border-top">
              <v-col class="border-right first-column font-weight-bold cell-text-left">CCFRI Provider $</v-col>
              <v-col class="border-right">
                <v-row no-gutters>
                  <v-col class="border-right cell-text-right">
                    {{ formatCCFRICurrency(enrolmentReport.ccfriProviderAmountLess0To18) }}
                  </v-col>
                  <v-col class="cell-text-right">
                    {{ formatCCFRICurrency(enrolmentReport.ccfriProviderAmountOver0To18) }}
                  </v-col>
                </v-row>
              </v-col>
              <v-col class="border-right">
                <v-row no-gutters>
                  <v-col class="border-right cell-text-right">
                    {{ formatCCFRICurrency(enrolmentReport.ccfriProviderAmountLess18To36) }}
                  </v-col>
                  <v-col class="cell-text-right">
                    {{ formatCCFRICurrency(enrolmentReport.ccfriProviderAmountOver18To36) }}
                  </v-col>
                </v-row>
              </v-col>
              <v-col class="border-right">
                <v-row no-gutters>
                  <v-col class="border-right cell-text-right">
                    {{ formatCCFRICurrency(enrolmentReport.ccfriProviderAmountLess3YK) }}
                  </v-col>
                  <v-col class="cell-text-right">
                    {{ formatCCFRICurrency(enrolmentReport.ccfriProviderAmountOver3YK) }}
                  </v-col>
                </v-row>
              </v-col>
              <v-col class="border-right">
                <v-row no-gutters>
                  <v-col class="border-right cell-text-right">
                    {{ formatCCFRICurrency(enrolmentReport.ccfriProviderAmountLessOOSCK) }}
                  </v-col>
                  <v-col class="cell-text-right">
                    {{ formatCCFRICurrency(enrolmentReport.ccfriProviderAmountOverOOSCK) }}
                  </v-col>
                </v-row>
              </v-col>
              <v-col class="border-right">
                <v-row no-gutters>
                  <v-col class="border-right cell-text-right">
                    {{ formatCCFRICurrency(enrolmentReport.ccfriProviderAmountLessOOSCG) }}
                  </v-col>
                  <v-col class="cell-text-right">
                    {{ formatCCFRICurrency(enrolmentReport.ccfriProviderAmountOverOOSCG) }}
                  </v-col>
                </v-row>
              </v-col>
              <v-col v-if="isGroup" cols="1" class="border-right cell-text-right">
                {{ formatCCFRICurrency(enrolmentReport.ccfriProviderAmountLessPre) }}
              </v-col>
            </v-row>
            <template v-if="enrolmentReport.isAdjustment">
              <v-row no-gutters class="background-light-grey border-top">
                <v-col class="border-right first-column font-weight-bold cell-text-left">Prev CCFRI Provider $</v-col>
                <v-col class="border-right">
                  <v-row no-gutters>
                    <v-col class="border-right cell-text-right">
                      {{ formatCCFRICurrency(previousEnrolmentReport.ccfriProviderAmountLess0To18) }}
                    </v-col>
                    <v-col class="cell-text-right">
                      {{ formatCCFRICurrency(previousEnrolmentReport.ccfriProviderAmountOver0To18) }}
                    </v-col>
                  </v-row>
                </v-col>
                <v-col class="border-right">
                  <v-row no-gutters>
                    <v-col class="border-right cell-text-right">
                      {{ formatCCFRICurrency(previousEnrolmentReport.ccfriProviderAmountLess18To36) }}
                    </v-col>
                    <v-col class="cell-text-right">
                      {{ formatCCFRICurrency(previousEnrolmentReport.ccfriProviderAmountOver18To36) }}
                    </v-col>
                  </v-row>
                </v-col>
                <v-col class="border-right">
                  <v-row no-gutters>
                    <v-col class="border-right cell-text-right">
                      {{ formatCCFRICurrency(previousEnrolmentReport.ccfriProviderAmountLess3YK) }}
                    </v-col>
                    <v-col class="cell-text-right">
                      {{ formatCCFRICurrency(previousEnrolmentReport.ccfriProviderAmountOver3YK) }}
                    </v-col>
                  </v-row>
                </v-col>
                <v-col class="border-right">
                  <v-row no-gutters>
                    <v-col class="border-right cell-text-right">
                      {{ formatCCFRICurrency(previousEnrolmentReport.ccfriProviderAmountLessOOSCK) }}
                    </v-col>
                    <v-col class="cell-text-right">
                      {{ formatCCFRICurrency(previousEnrolmentReport.ccfriProviderAmountOverOOSCK) }}
                    </v-col>
                  </v-row>
                </v-col>
                <v-col class="border-right">
                  <v-row no-gutters>
                    <v-col class="border-right cell-text-right">
                      {{ formatCCFRICurrency(previousEnrolmentReport.ccfriProviderAmountLessOOSCG) }}
                    </v-col>
                    <v-col class="cell-text-right">
                      {{ formatCCFRICurrency(previousEnrolmentReport.ccfriProviderAmountOverOOSCG) }}
                    </v-col>
                  </v-row>
                </v-col>
                <v-col v-if="isGroup" cols="1" class="border-right cell-text-right">
                  {{ formatCCFRICurrency(previousEnrolmentReport.ccfriProviderAmountLessPre) }}
                </v-col>
              </v-row>
              <v-row no-gutters class="background-light-grey border-top">
                <v-col class="border-right first-column font-weight-bold cell-text-left">
                  Difference CCFRI Provider $
                </v-col>
                <v-col class="border-right">
                  <v-row no-gutters>
                    <v-col class="border-right cell-text-right">
                      {{ formatCCFRICurrency(enrolmentReport.differences?.diffCcfriProviderAmountLess0To18) }}
                    </v-col>
                    <v-col class="cell-text-right">
                      {{ formatCCFRICurrency(enrolmentReport.differences?.diffCcfriProviderAmountOver0To18) }}
                    </v-col>
                  </v-row>
                </v-col>
                <v-col class="border-right">
                  <v-row no-gutters>
                    <v-col class="border-right cell-text-right">
                      {{ formatCCFRICurrency(enrolmentReport.differences?.diffCcfriProviderAmountLess18To36) }}
                    </v-col>
                    <v-col class="cell-text-right">
                      {{ formatCCFRICurrency(enrolmentReport.differences?.diffCcfriProviderAmountOver18To36) }}
                    </v-col>
                  </v-row>
                </v-col>
                <v-col class="border-right">
                  <v-row no-gutters>
                    <v-col class="border-right cell-text-right">
                      {{ formatCCFRICurrency(enrolmentReport.differences?.diffCcfriProviderAmountLess3YK) }}
                    </v-col>
                    <v-col class="cell-text-right">
                      {{ formatCCFRICurrency(enrolmentReport.differences?.diffCcfriProviderAmountOver3YK) }}
                    </v-col>
                  </v-row>
                </v-col>
                <v-col class="border-right">
                  <v-row no-gutters>
                    <v-col class="border-right cell-text-right">
                      {{ formatCCFRICurrency(enrolmentReport.differences?.diffCcfriProviderAmountLessOOSCK) }}
                    </v-col>
                    <v-col class="cell-text-right">
                      {{ formatCCFRICurrency(enrolmentReport.differences?.diffCcfriProviderAmountOverOOSCK) }}
                    </v-col>
                  </v-row>
                </v-col>
                <v-col class="border-right">
                  <v-row no-gutters>
                    <v-col class="border-right cell-text-right">
                      {{ formatCCFRICurrency(enrolmentReport.differences?.diffCcfriProviderAmountLessOOSCG) }}
                    </v-col>
                    <v-col class="cell-text-right">
                      {{ formatCCFRICurrency(enrolmentReport.differences?.diffCcfriProviderAmountOverOOSCG) }}
                    </v-col>
                  </v-row>
                </v-col>
                <v-col v-if="isGroup" cols="1" class="border-right cell-text-right">
                  {{ formatCCFRICurrency(enrolmentReport.differences?.diffCcfriProviderAmountLessPre) }}
                </v-col>
              </v-row>
            </template>
          </div>

          <v-row no-gutters class="background-light-green border-right border-top-yellow font-weight-bold">
            <v-col class="cell-text-center"> Grand Totals </v-col>
          </v-row>
          <v-row no-gutters class="background-light-green border-right border-top font-weight-bold">
            <v-col cols="1" class="border-right cell-text-center" />
            <v-col class="border-right cell-text-center">CCOF Base</v-col>
            <v-col class="border-right cell-text-center">CCFRI Payment</v-col>
            <v-col class="cell-text-center">CCFRI Provider Payment</v-col>
          </v-row>
          <v-row no-gutters class="background-light-green border-right border-top">
            <v-col cols="1" class="border-right font-weight-bold cell-text-left">Current $</v-col>
            <v-col class="border-right cell-text-right">{{ formatCurrency(enrolmentReport.grandTotalBase) }}</v-col>
            <v-col class="border-right cell-text-right">
              {{ formatCCFRICurrency(enrolmentReport.grandTotalCcfri) }}
            </v-col>
            <v-col class="cell-text-right">{{ formatCCFRICurrency(enrolmentReport.grandTotalCcfriProvider) }}</v-col>
          </v-row>
          <template v-if="enrolmentReport.isAdjustment">
            <v-row no-gutters class="background-light-green border-right border-top">
              <v-col cols="1" class="border-right font-weight-bold cell-text-left">Prev Paid $</v-col>
              <v-col class="border-right cell-text-right">
                {{ formatCurrency(previousEnrolmentReport.grandTotalBase) }}
              </v-col>
              <v-col class="border-right cell-text-right">
                {{ formatCCFRICurrency(previousEnrolmentReport.grandTotalCcfri) }}
              </v-col>
              <v-col class="cell-text-right">
                {{ formatCCFRICurrency(previousEnrolmentReport.grandTotalCcfriProvider) }}
              </v-col>
            </v-row>
            <v-row no-gutters class="background-light-green border-right border-top">
              <v-col cols="1" class="border-right font-weight-bold cell-text-left">Difference $</v-col>
              <v-col class="border-right cell-text-right">
                {{ formatCurrency(enrolmentReport.differences?.diffGrandTotalBase) }}
              </v-col>
              <v-col class="border-right cell-text-right">
                {{ formatCCFRICurrency(enrolmentReport.differences?.diffGrandTotalCcfri) }}
              </v-col>
              <v-col class="cell-text-right">
                {{ formatCCFRICurrency(enrolmentReport.differences?.diffGrandTotalCcfriProvider) }}
              </v-col>
            </v-row>
          </template>
        </div>
        <div class="legend">
          <div class="legend-item"><span class="color-box background-light-blue"></span>Stat holidays</div>
          <div class="legend-item"><span class="color-box background-light-yellow"></span>Weekends</div>
        </div>
      </v-card>
    </template>
  </v-container>
  <BackConfirmationDialog v-model="showBackConfirmationDialog" />
  <FullMonthClosureConfirmationDialog
    v-model="showFullMonthClosureConfirmationDialog"
    :loading="loading || processing"
    @cancel="cancelFullMonthClosure"
    @proceed="confirmFullMonthClosure"
  />
  <ReportNavButtons
    :loading="loading || processing"
    :is-save-displayed="isSaveDisplayed"
    :is-next-displayed="isNextDisplayed"
    @previous="previous"
    @next="next"
    @save="save(true)"
  />
</template>

<script>
import { cloneDeep, isEmpty, isEqual, pick } from 'lodash';

import AppNumberInput from '@/components/guiComponents/AppNumberInput.vue';
import AppTooltip from '@/components/guiComponents/AppTooltip.vue';
import BackConfirmationDialog from '@/components/manageReports/enrolmentReports/BackConfirmationDialog.vue';
import FullMonthClosureConfirmationDialog from '@/components/manageReports/enrolmentReports/FullMonthClosureConfirmationDialog.vue';
import enrolmentReportMixin from '@/mixins/enrolmentReportMixin.js';
import permissionsMixin from '@/mixins/permissionsMixin.js';
import EnrolmentReportService from '@/services/enrolmentReportService.js';

import { addDecimal, getDayOfWeek, getUpdatedObjectsByKeys, multiplyDecimal, subtractDecimal } from '@/utils/common.js';
import {
  CLOSURE_PAYMENT_ELIGIBILITIES,
  DAY_TYPES,
  EMPTY_PLACEHOLDER,
  ORGANIZATION_PROVIDER_TYPES_IDS,
  PARENT_FEE_FREQUENCIES,
  PATHS,
} from '@/utils/constants.js';
import { formatCurrency } from '@/utils/format';

export default {
  name: 'EnrolmentReportForm',
  components: {
    AppNumberInput,
    AppTooltip,
    BackConfirmationDialog,
    FullMonthClosureConfirmationDialog,
  },
  mixins: [enrolmentReportMixin, permissionsMixin],
  data() {
    return {
      originalEnrolmentReport: {},
      previousEnrolmentReport: {},
      dailyEnrolments: [],
      originalDailyEnrolments: [],
      previousDailyEnrolments: [],
      paymentEligibleDaysCount: {},
      showBackConfirmationDialog: false,
      showFullMonthClosureConfirmationDialog: false,
    };
  },
  computed: {
    isGroup() {
      return this.enrolmentReport.organizationProviderType === ORGANIZATION_PROVIDER_TYPES_IDS.GROUP;
    },
    categoryFields() {
      const categories = [
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
      return this.isGroup ? [...categories, 'lessPre'] : categories;
    },
    previousDailyEnrolmentsMap() {
      return new Map(
        (this.previousDailyEnrolments || []).map((dailyEnrolment) => [dailyEnrolment.day, dailyEnrolment]),
      );
    },
    areCCFRIRatesEmpty() {
      return this.categoryFields.every((category) => {
        const ccfriRateField = this.buildCalculationFieldName('dailyCcfriRate', category);
        return !this.enrolmentReport[ccfriRateField] && !this.enrolmentReport.ccfriProviderPaymentRates[category];
      });
    },
    isFormDisabled() {
      return this.readonly || this.enrolmentReport.isFullMonthClosure;
    },
    isNextDisplayed() {
      return !this.readonly && this.hasPermission(this.PERMISSIONS.SUBMIT_ENROLMENT_REPORT);
    },
    isSaveDisplayed() {
      return (
        !this.readonly && this.hasPermission([this.PERMISSIONS.EDIT_DRAFT_ER, this.PERMISSIONS.ADJUST_EXISTING_ER])
      );
    },
    hasClosureDays() {
      return this.dailyEnrolments?.some((item) =>
        [
          CLOSURE_PAYMENT_ELIGIBILITIES.INELIGIBLE,
          CLOSURE_PAYMENT_ELIGIBILITIES.CCFRI_AND_CCOF,
          CLOSURE_PAYMENT_ELIGIBILITIES.CCFRI,
          CLOSURE_PAYMENT_ELIGIBILITIES.CCOF,
        ].includes(item.paymentEligibility),
      );
    },
  },
  async created() {
    window.scrollTo(0, 0);
    this.DAILY_ENROLMENT_CATEGORIES = {
      less0To18: 100000000,
      over0To18: 100000001,
      less18To36: 100000002,
      over18To36: 100000003,
      less3YK: 100000004,
      over3YK: 100000005,
      lessOOSCK: 100000006,
      overOOSCK: 100000007,
      lessOOSCG: 100000008,
      overOOSCG: 100000009,
      lessPre: 100000010,
    };
    await this.loadData();
    if (!this.readonly) {
      this.calculate();
    }
  },
  methods: {
    formatCurrency,
    getDayOfWeek,
    async loadData() {
      try {
        this.loading = true;
        await this.loadEnrolmentReport();
        await this.loadDailyEnrolments();
        this.initializePaymentEligibleDaysCount();
        if (this.enrolmentReport.isAdjustment) {
          await this.loadPreviousEnrolmentReport();
        }
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

    async loadPreviousEnrolmentReport() {
      this.previousEnrolmentReport = await EnrolmentReportService.getEnrolmentReport(
        this.enrolmentReport.prevEnrolmentReportId,
      );
      this.previousDailyEnrolments = await EnrolmentReportService.getDailyEnrolments(
        this.previousEnrolmentReport.enrolmentReportId,
      );
    },

    formatCCFRICurrency(value) {
      return this.areCCFRIRatesEmpty ? EMPTY_PLACEHOLDER : formatCurrency(value);
    },

    getApprovedParentFees(fee) {
      return fee == null ? EMPTY_PLACEHOLDER : formatCurrency(fee);
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

    getTotalEnrolledClass(field) {
      return {
        'background-green':
          this.enrolmentReport.isAdjustment && this.enrolmentReport[field] !== this.previousEnrolmentReport[field],
      };
    },

    getDailyEnrolmentClass(dailyEnrolment, category) {
      const previousDailyEnrolment = this.previousDailyEnrolmentsMap?.get(dailyEnrolment?.day);
      return {
        'background-green':
          this.enrolmentReport.isAdjustment && dailyEnrolment?.[category] !== previousDailyEnrolment?.[category],
      };
    },

    buildCalculationFieldName(prefix, category) {
      const updatedCategory = category.charAt(0).toUpperCase() + category.slice(1);
      return prefix + updatedCategory;
    },

    normalizeRates() {
      for (const category of this.categoryFields) {
        const ccfriRateField = this.buildCalculationFieldName('dailyCcfriRate', category);
        this.enrolmentReport[ccfriRateField] = this.enrolmentReport[ccfriRateField] || 0;
        this.enrolmentReport.baseFundingRates[category] = this.enrolmentReport.baseFundingRates[category] || 0;
        this.enrolmentReport.ccfriProviderPaymentRates[category] =
          this.enrolmentReport.ccfriProviderPaymentRates[category] || 0;
      }
    },

    initializePaymentEligibleDaysCount() {
      this.paymentEligibleDaysCount = { CCOF: {}, CCFRI: {} };
      for (const category of this.categoryFields) {
        this.paymentEligibleDaysCount.CCOF[category] = 0;
        this.paymentEligibleDaysCount.CCFRI[category] = 0;
      }
    },

    calculatePaymentEligibleDays() {
      this.initializePaymentEligibleDaysCount();
      for (const dailyEnrolment of this.dailyEnrolments) {
        for (const category of this.categoryFields) {
          if (!dailyEnrolment[category]) continue;
          const eligibility = dailyEnrolment.paymentEligibility;
          switch (eligibility) {
            case null:
            case CLOSURE_PAYMENT_ELIGIBILITIES.PENDING:
            case CLOSURE_PAYMENT_ELIGIBILITIES.INELIGIBLE:
            case CLOSURE_PAYMENT_ELIGIBILITIES.CCFRI_AND_CCOF:
              this.paymentEligibleDaysCount.CCOF[category] += dailyEnrolment[category] || 0;
              this.paymentEligibleDaysCount.CCFRI[category] += dailyEnrolment[category] || 0;
              break;
            case CLOSURE_PAYMENT_ELIGIBILITIES.CCOF:
              this.paymentEligibleDaysCount.CCOF[category] += dailyEnrolment[category] || 0;
              break;
            case CLOSURE_PAYMENT_ELIGIBILITIES.CCFRI:
              this.paymentEligibleDaysCount.CCFRI[category] += dailyEnrolment[category] || 0;
              break;
            default:
              break;
          }
        }
      }
    },

    calculateCurrentTotals() {
      const currentTotals = Object.fromEntries(this.categoryFields.map((category) => [category, 0]));
      for (const dailyEnrolment of this.dailyEnrolments) {
        for (const category of this.categoryFields) {
          currentTotals[category] += dailyEnrolment[category] || 0;
        }
      }
      for (const category of this.categoryFields) {
        const currentTotalField = this.buildCalculationFieldName('currentTotal', category);
        this.enrolmentReport[currentTotalField] = currentTotals[category] || 0;
      }
    },

    calculateBaseFundingAmounts() {
      for (const category of this.categoryFields) {
        const ccofBaseAmountField = this.buildCalculationFieldName('ccofBaseAmount', category);
        this.enrolmentReport[ccofBaseAmountField] = multiplyDecimal(
          this.paymentEligibleDaysCount.CCOF[category],
          this.enrolmentReport.baseFundingRates[category],
        );
      }
    },

    calculateCcfriAmounts() {
      for (const category of this.categoryFields) {
        const ccfriAmountField = this.buildCalculationFieldName('ccfriAmount', category);
        const ccfriRateField = this.buildCalculationFieldName('dailyCcfriRate', category);
        this.enrolmentReport[ccfriAmountField] = multiplyDecimal(
          this.paymentEligibleDaysCount.CCFRI[category],
          this.enrolmentReport[ccfriRateField],
        );
      }
    },

    calculateCcfriProviderAmounts() {
      for (const category of this.categoryFields) {
        const ccfriProviderAmountField = this.buildCalculationFieldName('ccfriProviderAmount', category);
        this.enrolmentReport[ccfriProviderAmountField] = multiplyDecimal(
          this.paymentEligibleDaysCount.CCFRI[category],
          this.enrolmentReport.ccfriProviderPaymentRates[category],
        );
      }
    },

    calculateGrantTotals() {
      const grantTotals = {
        ccofBaseAmount: 0,
        ccfriAmount: 0,
        ccfriProviderAmount: 0,
      };
      for (const category of this.categoryFields) {
        const ccofBaseAmountField = this.buildCalculationFieldName('ccofBaseAmount', category);
        const ccfriAmountField = this.buildCalculationFieldName('ccfriAmount', category);
        const ccfriProviderAmountField = this.buildCalculationFieldName('ccfriProviderAmount', category);
        grantTotals.ccofBaseAmount = addDecimal(grantTotals.ccofBaseAmount, this.enrolmentReport[ccofBaseAmountField]);
        grantTotals.ccfriAmount = addDecimal(grantTotals.ccfriAmount, this.enrolmentReport[ccfriAmountField]);
        grantTotals.ccfriProviderAmount = addDecimal(
          grantTotals.ccfriProviderAmount,
          this.enrolmentReport[ccfriProviderAmountField],
        );
      }
      this.enrolmentReport.grandTotalBase = grantTotals.ccofBaseAmount || 0;
      this.enrolmentReport.grandTotalCcfri = grantTotals.ccfriAmount || 0;
      this.enrolmentReport.grandTotalCcfriProvider = grantTotals.ccfriProviderAmount || 0;
    },

    calculateDifferences() {
      for (const category of this.categoryFields) {
        const currentTotalField = this.buildCalculationFieldName('currentTotal', category);
        const diffCurrentTotalField = this.buildCalculationFieldName('diffCurrentTotal', category);
        this.enrolmentReport.differences[diffCurrentTotalField] = subtractDecimal(
          this.enrolmentReport[currentTotalField],
          this.previousEnrolmentReport[currentTotalField],
        );

        const ccofBaseAmountField = this.buildCalculationFieldName('ccofBaseAmount', category);
        const diffCcofBaseAmountField = this.buildCalculationFieldName('diffCcofBaseAmount', category);
        this.enrolmentReport.differences[diffCcofBaseAmountField] = subtractDecimal(
          this.enrolmentReport[ccofBaseAmountField],
          this.previousEnrolmentReport[ccofBaseAmountField],
        );

        const ccfriAmountField = this.buildCalculationFieldName('ccfriAmount', category);
        const diffCcfriAmountField = this.buildCalculationFieldName('diffCcfriAmount', category);
        this.enrolmentReport.differences[diffCcfriAmountField] = subtractDecimal(
          this.enrolmentReport[ccfriAmountField],
          this.previousEnrolmentReport[ccfriAmountField],
        );

        const ccfriProviderAmountField = this.buildCalculationFieldName('ccfriProviderAmount', category);
        const diffCcfriProviderAmountField = this.buildCalculationFieldName('diffCcfriProviderAmount', category);
        this.enrolmentReport.differences[diffCcfriProviderAmountField] = subtractDecimal(
          this.enrolmentReport[ccfriProviderAmountField],
          this.previousEnrolmentReport[ccfriProviderAmountField],
        );
      }

      this.enrolmentReport.differences['diffGrandTotalBase'] = subtractDecimal(
        this.enrolmentReport.grandTotalBase,
        this.previousEnrolmentReport.grandTotalBase,
      );
      this.enrolmentReport.differences['diffGrandTotalCcfri'] = subtractDecimal(
        this.enrolmentReport.grandTotalCcfri,
        this.previousEnrolmentReport.grandTotalCcfri,
      );
      this.enrolmentReport.differences['diffGrandTotalCcfriProvider'] = subtractDecimal(
        this.enrolmentReport.grandTotalCcfriProvider,
        this.previousEnrolmentReport.grandTotalCcfriProvider,
      );
    },

    calculate() {
      this.calculateCurrentTotals();
      this.calculatePaymentEligibleDays();
      this.calculateBaseFundingAmounts();
      this.calculateCcfriAmounts();
      this.calculateCcfriProviderAmounts();
      this.calculateGrantTotals();
      if (this.enrolmentReport.isAdjustment) {
        this.calculateDifferences();
      }
    },

    flagDailyEnrolmentChanges() {
      if (!this.enrolmentReport.isAdjustment) return;
      for (const dailyEnrolment of this.dailyEnrolments) {
        const previousDailyEnrolment = this.previousDailyEnrolmentsMap?.get(dailyEnrolment?.day);
        const updatedColumns = this.categoryFields
          .filter((category) => dailyEnrolment[category] !== previousDailyEnrolment[category])
          .map((category) => this.DAILY_ENROLMENT_CATEGORIES[category]);
        dailyEnrolment.updatedColumns = isEmpty(updatedColumns) ? null : updatedColumns.join(',');
      }
    },

    toggleFullMonthClosure() {
      if (this.enrolmentReport.isFullMonthClosure) {
        this.showFullMonthClosureConfirmationDialog = true;
      } else {
        this.resetForm();
      }
    },

    cancelFullMonthClosure() {
      this.enrolmentReport.isFullMonthClosure = false;
    },

    async confirmFullMonthClosure() {
      this.resetForm(0);
      await this.next();
    },

    resetForm(resetValue = null) {
      this.enrolmentReport.totalEnrolled0To18 = resetValue;
      this.enrolmentReport.totalEnrolled18To36 = resetValue;
      this.enrolmentReport.totalEnrolled3YK = resetValue;
      this.enrolmentReport.totalEnrolledOOSCK = resetValue;
      this.enrolmentReport.totalEnrolledOOSCG = resetValue;
      if (this.isGroup) {
        this.enrolmentReport.totalEnrolledPre = resetValue;
      }
      for (const dailyEnrolment of this.dailyEnrolments) {
        for (const category of this.categoryFields) {
          dailyEnrolment[category] = resetValue;
        }
      }
      this.calculate();
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
        if (this.enrolmentReport.isAdjustment) {
          this.flagDailyEnrolmentChanges();
        }
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
        'isFullMonthClosure',
      ];
      for (const category of this.categoryFields) {
        const currentTotalField = this.buildCalculationFieldName('currentTotal', category);
        const ccofBaseAmountField = this.buildCalculationFieldName('ccofBaseAmount', category);
        const ccfriAmountField = this.buildCalculationFieldName('ccfriAmount', category);
        const ccfriProviderAmountField = this.buildCalculationFieldName('ccfriProviderAmount', category);
        keysForBackend.push(currentTotalField, ccofBaseAmountField, ccfriAmountField, ccfriProviderAmountField);
      }
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
      if (this.enrolmentReport.isAdjustment) {
        payload.differences = this.enrolmentReport.differences;
        payload.differences.enrolmentReportExtensionId = this.enrolmentReport.enrolmentReportExtensionId;
      }
      await EnrolmentReportService.updateEnrolmentReport(this.$route.params.enrolmentReportId, payload);
      await this.loadEnrolmentReport();
    },

    async saveDailyEnrolments() {
      const keysForBackend = [...this.categoryFields, 'dailyEnrolmentId'];
      if (this.enrolmentReport.isAdjustment) {
        keysForBackend.push('updatedColumns');
      }
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

.background-green {
  background-color: #7fcf6c;
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

.first-column {
  min-width: 345px;
  max-width: 345px;
  position: relative;
  overflow: hidden;
}

.day-label {
  font-size: 14px;
  left: 60%;
  position: absolute;
}

.page-scroll-wrapper {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.table-scroll-wrapper {
  border: 1px solid;
  max-height: 60vh;
  min-width: 1800px;
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

.cell-text-left {
  padding: 4px 0px 4px 6px !important;
  text-align: left;
}

.cell-text-center {
  padding: 4px !important;
  text-align: center;
}

.cell-text-right {
  padding: 4px 6px !important;
  text-align: right;
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
