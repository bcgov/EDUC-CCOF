<!--
* NOTE (vietle-cgi):  
* This file contains **legacy code** from the previous application layout, which was deprecated and replaced as of March 2025.  
* **DO NOT modify this file** to maintain compatibility with submitted PCF application/change request.
*  
* Source: Copied from commit 4adb36 on Dec 13, 2024 with some minor changes.
-->
<template>
  <v-form ref="ccofSummaryForm" v-model="isValidForm">
    <v-expansion-panel-title>
      <SummaryExpansionPanelTitle
        title="Child Care Operating Funding (CCOF)"
        :loading="isApplicationProcessing"
        :is-complete="isValidForm"
      />
    </v-expansion-panel-title>
    <v-expansion-panel-text eager>
      <v-row no-gutters class="d-flex flex-column pb-1 pt-1 ml-2">
        <v-row class="d-flex justify-start">
          <v-col cols="12" md="6" class="pb-0 pt-0">
            <v-row no-gutters class="d-flex justify-start">
              <v-col cols="12" class="d-flex justify-start">
                <span class="summary-label pt-3">Maximum number of <b>days per week</b> you provide child care: </span>
                <v-text-field
                  placeholder="Required"
                  :model-value="funding?.maxDaysPerWeek"
                  class="summary-value ma-0 pa-0 px-0"
                  density="compact"
                  flat
                  variant="solo"
                  hide-details
                  readonly
                  :rules="rules.required"
                />
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" md="6" class="pb-0 pt-0">
            <v-row no-gutters class="d-flex justify-start">
              <v-col cols="12" class="d-flex justify-start">
                <span class="summary-label pt-3">Maximum number of <b>weeks per year</b> you provide child care: </span>
                <v-text-field
                  placeholder="Required"
                  :model-value="funding?.maxWeeksPerYear"
                  class="summary-value"
                  density="compact"
                  flat
                  variant="solo"
                  hide-details
                  readonly
                  :rules="rules.required"
                />
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row class="d-flex justify-start">
          <v-col v-if="funding?.hasClosedMonth" cols="12" lg="6" class="pb-0 pt-0">
            <v-row no-gutters class="d-flex justify-start">
              <v-col cols="12" class="d-flex justify-start">
                <span class="summary-label pt-3"
                  >Months where ALL of the programs at this facility are closed for the entire month:
                </span>
              </v-col>
              <v-col v-if="funding?.closedIn1" cols="6" sm="4" class="d-flex justify-start">
                <v-text-field
                  model-value="January"
                  class="summary-value"
                  density="compact"
                  flat
                  variant="solo"
                  hide-details
                  readonly
                  :rules="rules.required"
                />
              </v-col>
              <v-col v-if="funding?.closedIn2" cols="6" sm="4" class="d-flex justify-start">
                <v-text-field
                  model-value="February"
                  class="summary-value"
                  density="compact"
                  flat
                  variant="solo"
                  hide-details
                  readonly
                  :rules="rules.required"
                />
              </v-col>
              <v-col v-if="funding?.closedIn3" cols="6" sm="4" class="d-flex justify-start">
                <v-text-field
                  model-value="March"
                  class="summary-value"
                  density="compact"
                  flat
                  variant="solo"
                  hide-details
                  readonly
                  :rules="rules.required"
                />
              </v-col>
              <v-col v-if="funding?.closedIn4" cols="6" sm="4" class="d-flex justify-start">
                <v-text-field
                  model-value="April"
                  class="summary-value"
                  density="compact"
                  flat
                  variant="solo"
                  hide-details
                  readonly
                  :rules="rules.required"
                />
              </v-col>
              <v-col v-if="funding?.closedIn5" cols="6" sm="4" class="d-flex justify-start">
                <v-text-field
                  model-value="May"
                  class="summary-value"
                  density="compact"
                  flat
                  variant="solo"
                  hide-details
                  readonly
                  :rules="rules.required"
                />
              </v-col>
              <v-col v-if="funding?.closedIn6" cols="6" sm="4" class="d-flex justify-start">
                <v-text-field
                  model-value="June"
                  class="summary-value"
                  density="compact"
                  flat
                  variant="solo"
                  hide-details
                  readonly
                  :rules="rules.required"
                />
              </v-col>
              <v-col v-if="funding?.closedIn7" cols="6" sm="4" class="d-flex justify-start">
                <v-text-field
                  model-value="July"
                  class="summary-value"
                  density="compact"
                  flat
                  variant="solo"
                  hide-details
                  readonly
                  :rules="rules.required"
                />
              </v-col>
              <v-col v-if="funding?.closedIn8" cols="6" sm="4" class="d-flex justify-start">
                <v-text-field
                  model-value="August"
                  class="summary-value"
                  density="compact"
                  flat
                  variant="solo"
                  hide-details
                  readonly
                  :rules="rules.required"
                />
              </v-col>
              <v-col v-if="funding?.closedIn9" cols="6" sm="4" class="d-flex justify-start">
                <v-text-field
                  model-value="September"
                  class="summary-value"
                  density="compact"
                  flat
                  variant="solo"
                  hide-details
                  readonly
                  :rules="rules.required"
                />
              </v-col>
              <v-col v-if="funding?.closedIn10" cols="6" sm="4" class="d-flex justify-start">
                <v-text-field
                  model-value="October"
                  class="summary-value"
                  density="compact"
                  flat
                  variant="solo"
                  hide-details
                  readonly
                  :rules="rules.required"
                />
              </v-col>
              <v-col v-if="funding?.closedIn11" cols="6" sm="4" class="d-flex justify-start">
                <v-text-field
                  model-value="November"
                  class="summary-value"
                  density="compact"
                  flat
                  variant="solo"
                  hide-details
                  readonly
                  :rules="rules.required"
                />
              </v-col>
              <v-col v-if="funding?.closedIn12" cols="6" sm="4" class="d-flex justify-start">
                <v-text-field
                  model-value="December"
                  class="summary-value"
                  density="compact"
                  flat
                  variant="solo"
                  hide-details
                  readonly
                  :rules="rules.required"
                />
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" lg="6" class="pb-0 pt-0">
            <v-row no-gutters class="d-flex justify-start">
              <v-col cols="12" md="4" class="d-flex justify-start flex-nowrap">
                <span class="summary-label pt-3">Facility hours of operation:</span>
              </v-col>
              <v-col cols="12" sm="6" md="4" class="d-flex justify-start">
                <span class="summary-label pt-3">From:</span>
                <v-text-field
                  placeholder="Required"
                  :model-value="formatTime24to12(funding?.hoursFrom)"
                  class="summary-value"
                  density="compact"
                  flat
                  variant="solo"
                  hide-details
                  readonly
                  :rules="rules.required"
                />
              </v-col>
              <v-col cols="12" sm="6" md="4" class="d-flex justify-start">
                <span class="summary-label pt-3">To:</span>
                <v-text-field
                  placeholder="Required"
                  :model-value="formatTime24to12(funding?.hoursTo)"
                  class="summary-value"
                  density="compact"
                  flat
                  variant="solo"
                  hide-details
                  readonly
                  :rules="rules.required"
                />
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row class="d-flex justify-start">
          <v-col cols="6" class="pb-0 pt-0">
            <v-row no-gutters class="d-flex justify-start">
              <v-col cols="10" class="d-flex justify-start">
                <span class="summary-value">Type of Service</span>
              </v-col>
              <v-col cols="10" class="d-flex justify-start pb-2 pt-2">
                <span class="summary-label">Maximum Licensed Capacity</span>
              </v-col>
              <v-col cols="10" class="d-flex justify-start pb-2 pt-2">
                <span class="summary-label">Group Child Care (Under 36 months)</span>
              </v-col>
              <v-col cols="10" class="d-flex justify-start pb-2 pt-3">
                <span class="summary-label">Group Child Care (30 Months to School Age)</span>
              </v-col>
              <v-col cols="10" class="d-flex justify-start pb-2 pt-3">
                <span class="summary-label">Preschool</span>
              </v-col>
              <v-col cols="10" class="d-flex justify-start pb-2 pt-3">
                <span class="summary-label">Group Child Care (School Age/ School Age Care on School Grounds)</span>
              </v-col>
              <v-col cols="10" class="d-flex justify-start pb-2 pt-3">
                <span class="summary-label">Multi-Age Child Care</span>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="6" class="pb-0 pt-0">
            <v-row no-gutters class="d-flex justify-start">
              <v-col cols="10" class="d-flex justify-start">
                <span class="summary-value">Maximum Number</span>
              </v-col>
              <v-col cols="10" class="d-flex justify-start">
                <v-text-field
                  placeholder="Required"
                  :model-value="funding?.maxLicensesCapacity"
                  class="summary-value"
                  density="compact"
                  flat
                  variant="solo"
                  hide-details
                  readonly
                  :rules="rules.required"
                />
              </v-col>
              <v-col cols="10" class="d-flex justify-start">
                <v-text-field
                  placeholder="Required"
                  :model-value="funding?.maxGroupChildCareUnder36"
                  class="summary-value"
                  density="compact"
                  flat
                  variant="solo"
                  hide-details
                  readonly
                  :rules="rules.required"
                />
              </v-col>
              <v-col cols="10" class="d-flex justify-start">
                <v-text-field
                  placeholder="Required"
                  :model-value="funding?.maxGroupChildCare36"
                  class="summary-value"
                  density="compact"
                  flat
                  variant="solo"
                  hide-details
                  readonly
                  :rules="rules.required"
                />
              </v-col>
              <v-col cols="10" class="d-flex justify-start">
                <v-text-field
                  placeholder="Required"
                  :model-value="funding?.maxPreschool"
                  class="summary-value"
                  density="compact"
                  flat
                  variant="solo"
                  hide-details
                  readonly
                  :rules="rules.required"
                />
              </v-col>
              <v-col cols="10" class="d-flex justify-start">
                <v-text-field
                  placeholder="Required"
                  :model-value="funding?.maxGroupChildCareSchool"
                  class="summary-value"
                  density="compact"
                  flat
                  variant="solo"
                  hide-details
                  readonly
                  :rules="rules.required"
                />
              </v-col>
              <v-col cols="10" class="d-flex justify-start">
                <v-text-field
                  placeholder="Required"
                  :model-value="funding?.maxGroupChildCareMultiAge"
                  class="summary-value"
                  density="compact"
                  flat
                  variant="solo"
                  hide-details
                  readonly
                  :rules="rules.required"
                />
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <span v-if="funding?.maxPreschool > 0">
          <v-row class="d-flex justify-start">
            <v-col cols="12" lg="12" class="pb-0 pt-0">
              <v-row no-gutters class="d-flex justify-start pt-2">
                <v-col cols="12" class="d-flex justify-start">
                  <span class="summary-label">Preschool sessions your facility offers per day:</span>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-row class="d-flex justify-start pt-2">
            <v-col cols="2" class="pb-0 pt-0">
              <v-row no-gutters class="d-flex justify-start">
                <v-col cols="12" class="d-flex justify-start">
                  <span class="summary-label">Monday</span>
                </v-col>
                <v-text-field
                  placeholder="Required"
                  :model-value="funding?.monday"
                  class="summary-value"
                  density="compact"
                  flat
                  variant="solo"
                  hide-details
                  readonly
                  :rules="rules.required"
                />
              </v-row>
            </v-col>
            <v-col cols="2" class="pb-0 pt-0">
              <v-row no-gutters class="d-flex justify-start">
                <v-col cols="12" class="d-flex justify-start">
                  <span class="summary-label">Tuesday</span>
                </v-col>
                <v-text-field
                  placeholder="Required"
                  :model-value="funding?.tusday"
                  class="summary-value"
                  density="compact"
                  flat
                  variant="solo"
                  hide-details
                  readonly
                  :rules="rules.required"
                />
              </v-row>
            </v-col>
            <v-col cols="2" class="pb-0 pt-0">
              <v-row no-gutters class="d-flex justify-start">
                <v-col cols="12" class="d-flex justify-start">
                  <span class="summary-label">Wednesday</span>
                </v-col>

                <v-text-field
                  placeholder="Required"
                  :model-value="funding?.wednesday"
                  class="summary-value"
                  density="compact"
                  flat
                  variant="solo"
                  hide-details
                  readonly
                  required
                  :rules="rules.required"
                />
              </v-row>
            </v-col>
            <v-col cols="2" class="pb-0 pt-0">
              <v-row no-gutters class="d-flex justify-start">
                <v-col cols="12" class="d-flex justify-start">
                  <span class="summary-label">Thursday</span>
                </v-col>

                <v-text-field
                  placeholder="Required"
                  :model-value="funding?.thursday"
                  class="summary-value"
                  density="compact"
                  flat
                  variant="solo"
                  hide-details
                  readonly
                  :rules="rules.required"
                />
              </v-row>
            </v-col>
            <v-col cols="2" class="pb-0 pt-0">
              <v-row no-gutters class="d-flex justify-start">
                <v-col cols="12" class="d-flex justify-start">
                  <span class="summary-label">Friday</span>
                </v-col>

                <v-text-field
                  placeholder="Required"
                  :model-value="funding?.friday"
                  class="summary-value"
                  density="compact"
                  flat
                  variant="solo"
                  hide-details
                  readonly
                  :rules="rules.required"
                />
              </v-row>
            </v-col>
            <v-col cols="2" class="pb-0 pt-0">
              <v-row no-gutters class="d-flex justify-start">
                <v-col cols="12" class="d-flex justify-start">
                  <span class="summary-label">Total</span>
                </v-col>

                <v-text-field
                  placeholder="Required"
                  :model-value="funding?.total"
                  class="summary-value"
                  density="compact"
                  flat
                  variant="solo"
                  hide-details
                  readonly
                  :rules="rules.required"
                />
              </v-row>
            </v-col>
          </v-row>
        </span>
        <v-row v-if="funding?.maxGroupChildCareSchool > 0" class="pb-0 pt-0">
          <v-col cols="12" class="pb-0 pt-0">
            <v-row no-gutters class="d-flex justify-start">
              <v-col cols="12" sm="6" lg="4" xl="3" class="d-flex justify-start">
                <span class="summary-label pt-1">Is the facility located on school property?</span>
              </v-col>
              <v-col cols="12" sm="6" lg="8" xl="9" class="d-flex justify-start">
                <v-text-field
                  placeholder="Required"
                  :model-value="getYesNoValue(funding?.isSchoolProperty)"
                  class="summary-value"
                  density="compact"
                  flat
                  variant="solo"
                  hide-details
                  readonly
                  :rules="rules.required"
                />
              </v-col>
            </v-row>
            <span v-if="showSchoolPropertyQuestion">
              <v-row no-gutters class="d-flex justify-start">
                <v-col cols="12" class="d-flex justify-start">
                  <span class="summary-label pt-1">Please indicate each service that your facility offers:</span>
                </v-col>
              </v-row>
              <v-row no-gutters class="d-flex justify-start">
                <v-col cols="12" class="d-flex justify-start">
                  <v-text-field
                    placeholder="Required"
                    :model-value="schoolPropertyLabel"
                    class="summary-value ml-n5 pl-2"
                    density="compact"
                    flat
                    variant="solo"
                    hide-details
                    readonly
                    :rules="rules.required"
                  />
                </v-col>
              </v-row>
            </span>
          </v-col>
        </v-row>
        <v-row class="d-flex justify-start">
          <v-col cols="12" lg="12" class="pb-0 pt-0">
            <v-row no-gutters class="d-flex justify-start pt-2">
              <v-col cols="12" sm="6" class="d-flex justify-start">
                <span class="summary-label pt-2"
                  >Do you <b>regularly offer</b> extended daily hours of child care
                  <b>(before 6am, after 7pm or overnight)</b>?</span
                >
              </v-col>
              <v-col cols="12" sm="6" class="d-flex justify-start">
                <v-text-field
                  placeholder="Required"
                  :model-value="getYesNoValue(funding?.isExtendedHours)"
                  class="summary-value"
                  density="compact"
                  flat
                  variant="solo"
                  hide-details
                  readonly
                  :rules="rules.required"
                />
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <span v-if="funding?.isExtendedHours">
          <v-row class="d-flex justify-start">
            <v-col cols="6" lg="6" class="pb-0 pt-0">
              <v-row no-gutters class="d-flex justify-start">
                <v-col cols="12" class="d-flex justify-start pb-2 pt-7">
                  <span class="summary-label"
                    >Maximum number of days per week you offer extended hours of child care?</span
                  >
                </v-col>
                <v-col cols="12" class="d-flex justify-start pb-2 pt-2">
                  <span class="summary-label"
                    >Maximum number of weeks per year you offer extended hours of child care?</span
                  >
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="4" lg="4" class="pb-0 pt-3">
              <v-row no-gutters class="d-flex justify-start">
                <v-col cols="12" class="d-flex justify-center">
                  <v-text-field
                    placeholder="Required"
                    :rules="rules.required"
                    :model-value="funding?.maxDaysPerWeekExtended"
                    class="summary-value"
                    density="compact"
                    flat
                    variant="solo"
                    hide-details
                    readonly
                  />
                </v-col>
                <v-col cols="12" class="d-flex justify-center">
                  <v-text-field
                    placeholder="Required"
                    :rules="rules.required"
                    :model-value="funding?.maxWeeksPerYearExtended"
                    class="summary-value"
                    density="compact"
                    flat
                    variant="solo"
                    hide-details
                    readonly
                  />
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </span>
        <v-row class="d-flex justify-start">
          <v-col cols="12" lg="12" class="pb-0 pt-0">
            <v-row no-gutters class="d-flex justify-start">
              <v-col cols="12" class="d-flex justify-start">
                <span class="summary-label"
                  >For each type of service, indicate the <b>maximum number of spaces</b> for which you offer extended
                  hours of child care:</span
                >
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row class="d-flex justify-start">
          <v-col cols="4" lg="4" class="pb-0 pt-0">
            <v-row no-gutters class="d-flex justify-start">
              <v-col cols="12" class="d-flex justify-start">
                <span class="summary-value pt-1">Type of Service</span>
              </v-col>
              <v-col cols="12" class="d-flex justify-start pb-2 pt-7">
                <span class="summary-label">Group Child Care (Under 36 months)</span>
              </v-col>
              <v-col cols="12" class="d-flex justify-start pb-2 pt-2">
                <span class="summary-label">Group Child Care (30 Months to School Age)</span>
              </v-col>
              <v-col cols="12" class="d-flex justify-start pb-2 pt-2">
                <span class="summary-label">Group Child Care (School Age/ School Age Care on School Grounds)</span>
              </v-col>
              <v-col cols="12" class="d-flex justify-start pb-2 pt-3">
                <span class="summary-label">Multi-Age Child Care</span>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="4" lg="4" class="pb-0 pt-0">
            <v-row no-gutters class="d-flex justify-start">
              <v-col cols="5" class="d-flex justify-start">
                <span class="summary-value"><b>4 hours or less </b>extended child care</span>
              </v-col>
              <v-col cols="12" class="d-flex justify-end">
                <v-text-field
                  :model-value="funding?.extendedChildCareUnder36Months4OrLess"
                  class="summary-value"
                  density="compact"
                  flat
                  variant="solo"
                  hide-details
                  readonly
                />
              </v-col>
              <v-col cols="12" class="d-flex">
                <v-text-field
                  :model-value="funding?.extendedChildCare36MonthsToSchoolAge4OrLess"
                  class="summary-value"
                  density="compact"
                  flat
                  variant="solo"
                  hide-details
                  readonly
                />
              </v-col>
              <v-col cols="12" class="d-flex justify-center">
                <v-text-field
                  :model-value="funding?.extendedChildCareSchoolAge4OrLess"
                  class="summary-value"
                  density="compact"
                  flat
                  variant="solo"
                  hide-details
                  readonly
                />
              </v-col>
              <v-col cols="12" class="d-flex justify-center">
                <v-text-field
                  :model-value="funding?.multiAgeCare4OrLess"
                  class="summary-value"
                  density="compact"
                  flat
                  variant="solo"
                  hide-details
                  readonly
                />
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="4" lg="4" class="pb-0 pt-0">
            <v-row no-gutters class="d-flex justify-start">
              <v-col cols="5" class="d-flex justify-start">
                <span class="summary-value"><b>More than 4 hours</b> extended child care</span>
              </v-col>
              <v-col cols="12" class="d-flex justify-center">
                <v-text-field
                  :model-value="funding?.extendedChildCareUnder36Months4OrMore"
                  class="summary-value"
                  density="compact"
                  flat
                  variant="solo"
                  hide-details
                  readonly
                />
              </v-col>
              <v-col cols="12" class="d-flex justify-center">
                <v-text-field
                  :model-value="funding?.extendedChildCare36MonthsToSchoolAge4OrMore"
                  class="summary-value"
                  density="compact"
                  flat
                  variant="solo"
                  hide-details
                  readonly
                />
              </v-col>
              <v-col cols="12" class="d-flex justify-center">
                <v-text-field
                  :model-value="funding?.extendedChildCareSchoolAge4OrMore"
                  class="summary-value"
                  density="compact"
                  flat
                  variant="solo"
                  hide-details
                  readonly
                />
              </v-col>
              <v-col cols="12" class="d-flex justify-center">
                <v-text-field
                  :model-value="funding?.multiAgeCare4more"
                  class="summary-value"
                  density="compact"
                  flat
                  variant="solo"
                  hide-details
                  readonly
                />
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-row>
      <router-link v-if="!isValidForm" :to="routingPath">
        <u class="text-error"> To add this information, click here. This will bring you to a different page. </u>
      </router-link>
    </v-expansion-panel-text>
  </v-form>
</template>
<script>
import summaryMixin from '@/mixins/summaryMixin.js';
import { isChangeRequest } from '@/utils/common.js';
import { PATHS, pcfUrlGuid, pcfUrl, changeUrlGuid } from '@/utils/constants.js';

export default {
  name: 'CCOFSummary',
  mixins: [summaryMixin],
  props: {
    funding: {
      type: Object,
      required: true,
    },
    changeRecGuid: {
      type: String,
      default: '',
    },
    programYearId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      isChangeRequest: isChangeRequest(this),
      isValidForm: false,
    };
  },
  computed: {
    schoolPropertyLabel() {
      const arr = [];
      if (this.funding?.beforeSchool) {
        arr.push('BEFORE SCHOOL');
      }
      if (this.funding?.afterSchool) {
        arr.push('AFTER SCHOOL');
      }
      if (this.funding?.beforeKindergarten) {
        arr.push('BEFORE KINDERGARTEN');
      }
      if (this.funding?.afterKindergarten) {
        arr.push('AFTER KINDERGARTEN');
      }
      return String(arr);
    },
    routingPath() {
      if (this.isChangeRequest) {
        return changeUrlGuid(PATHS.CCOF_GROUP_FUNDING, this.changeRecGuid, this.funding.ccofBaseFundingId);
      }
      return this.funding.ccofBaseFundingId
        ? pcfUrlGuid(PATHS.CCOF_GROUP_FUNDING, this.programYearId, this.funding.ccofBaseFundingId)
        : pcfUrl(PATHS.CCOF_GROUP_FACILITY, this.programYearId);
    },
    showSchoolPropertyQuestion() {
      return this.funding?.maxGroupChildCareSchool > 0 && this.funding?.isSchoolProperty;
    },
  },
};
</script>
<style scoped>
:deep(.summary-value .v-label) {
  color: #d8292f !important;
  opacity: 1 !important;
}

:deep(::placeholder) {
  color: #d8292f !important;
  opacity: 1 !important;
}
</style>
