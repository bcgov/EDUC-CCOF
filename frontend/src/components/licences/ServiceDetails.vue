<template>
  <div class="outer-box">
    <div class="box-container">
      <v-row class="mb-2">
        <v-col cols="12" md="6" class="d-flex flex-wrap align-center">
          <strong class="mr-2">Licence Number:</strong>
          <span>{{ licence.licenceNumber }}</span>
          <span class="ml-2" :class="getLicenceStatusClass(licence.licenceStatus)">
            {{ licence.licenceStatus }}
          </span>
        </v-col>
      </v-row>
      <v-row class="mb-2">
        <v-col cols="12" md="4" class="d-flex flex-wrap align-center">
          <strong class="mr-2">Licence Effective Date:</strong>
          <span>{{ formatUTCDate(licence.licenceStartDate) }}</span>
        </v-col>
        <v-col cols="12" md="4" class="d-flex flex-wrap align-center">
          <strong class="mr-2">Record Start Date:</strong>
          <span>{{ licence.recordStartDate }}</span>
        </v-col>
        <v-col cols="12" md="4" class="d-flex flex-wrap align-center">
          <strong class="mr-2">Record End Date:</strong>
          <span>{{ licence.recordEndDate ?? EMPTY_PLACEHOLDER }}</span>
        </v-col>
      </v-row>
    </div>

    <h2 class="text-h6 font-weight-bold">Community Care and Assisted Living Act Facility Licence Details</h2>
    <div v-if="licence?.serviceDeliveryDetails?.length">
      <div class="box-container">
        <v-row class="mb-2">
          <v-col cols="12" md="6" class="d-flex flex-wrap align-center">
            <strong class="mr-2">Maximum Capacity:</strong>
            <span>{{ licence.licenceMaxCapacity ?? EMPTY_PLACEHOLDER }}</span>
          </v-col>
        </v-row>
        <v-row v-for="(serviceDetail, index) in licence.serviceDeliveryDetails" :key="index" class="mb-2">
          <v-col cols="12" md="6" class="d-flex flex-wrap align-center">
            <strong class="mr-2">Licence Category:</strong>
            <span>{{ capitalize(serviceDetail.licenceCategory) }}</span>
          </v-col>
          <v-col cols="12" md="6" class="d-flex flex-wrap align-center">
            <strong class="mr-2">Maximum Capacity by Care Type:</strong>
            <span>{{ serviceDetail.maxCapacity }}</span>
          </v-col>
        </v-row>
      </div>

      <h2 class="text-h6 font-weight-bold">Service Details</h2>
      <div class="box-container">
        <v-row class="mb-2">
          <v-col cols="12" md="6" class="d-flex flex-wrap align-center">
            <strong class="mr-2">Max number of days per week you provide child care:</strong>
            <span>{{ licence.licenceMaxDaysPerWeek ?? EMPTY_PLACEHOLDER }}</span>
          </v-col>
          <v-col cols="12" md="6" class="d-flex flex-wrap align-center">
            <strong class="mr-2">Max number of weeks per year you provide child care:</strong>
            <span>{{ licence.licenceMaxWeeksPerYear ?? EMPTY_PLACEHOLDER }}</span>
          </v-col>
        </v-row>
        <v-row v-if="Object.keys(preschoolDetail).length" class="mb-2">
          <v-col cols="12" md="6" class="d-flex flex-wrap align-center">
            <strong class="mr-2">Number of preschool sessions per week:</strong>
            <span>{{ preschoolDetail.preschoolSessions ?? EMPTY_PLACEHOLDER }}</span>
          </v-col>
        </v-row>
        <template v-if="Object.keys(schoolAgeCareDetail).length">
          <v-row class="mb-2">
            <v-col cols="12" md="6" class="d-flex flex-wrap align-center">
              <strong class="mr-2">Before school care offered:</strong>
              <span>{{ getYesNoValue(schoolAgeCareDetail.beforeSchoolCare) }}</span>
            </v-col>
            <v-col cols="12" md="6" class="d-flex flex-wrap align-center">
              <strong class="mr-2">After school care offered:</strong>
              <span>{{ getYesNoValue(schoolAgeCareDetail.afterSchoolCare) }}</span>
            </v-col>
          </v-row>
          <v-row class="mb-2">
            <v-col cols="12" md="6" class="d-flex flex-wrap align-center">
              <strong class="mr-2">Before Kindergarten care offered:</strong>
              <span>{{ getYesNoValue(schoolAgeCareDetail.morningKinderCare) }}</span>
            </v-col>
            <v-col cols="12" md="6" class="d-flex flex-wrap align-center">
              <strong class="mr-2">After Kindergarten care offered:</strong>
              <span>{{ getYesNoValue(schoolAgeCareDetail.afterKinderCare) }}</span>
            </v-col>
          </v-row>
        </template>
      </div>

      <h2 class="text-h6 font-weight-bold">Extended Hours Details</h2>
      <div class="box-container">
        <v-row class="mb-2">
          <v-col cols="12" class="d-flex flex-wrap align-center">
            <strong class="mr-2"> Care before 6:00 AM, after 7:00 PM or overnight service regularly offered: </strong>
            <span>{{ getYesNoValue(licence.licenceExtendedHours) }}</span>
          </v-col>
        </v-row>
        <template v-if="licence.licenceExtendedHours">
          <v-row class="mb-2">
            <v-col cols="12" class="d-flex flex-wrap align-center">
              <strong class="mr-2">Extended Hours - Maximum number of days per week:</strong>
              <span>{{ licence.extendedDaysPerWeek ?? EMPTY_PLACEHOLDER }}</span>
            </v-col>
          </v-row>
          <v-row class="mb-4">
            <v-col cols="12" class="d-flex flex-wrap align-center">
              <strong class="mr-2">Extended Hours - Maximum number of weeks per year:</strong>
              <span>{{ licence.extendedWeeksPerYear ?? EMPTY_PLACEHOLDER }}</span>
            </v-col>
          </v-row>
          <div class="extended-hours-table-wrapper">
            <table class="extended-hours-table font-regular">
              <thead>
                <tr>
                  <th>Licence Category (Extended Hours)</th>
                  <th>Maximum spaces offered (4 hours or less)</th>
                  <th>Maximum spaces offered (over 4 hours)</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(detail, idx) in licence.serviceDeliveryDetails" :key="idx">
                  <td>{{ capitalize(detail.licenceCategory) }}</td>
                  <td>{{ detail.maxfourorLess ?? EMPTY_PLACEHOLDER }}</td>
                  <td>{{ detail.maxoverFour ?? EMPTY_PLACEHOLDER }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
import { EMPTY_PLACEHOLDER } from '@/utils/constants.js';
import { getLicenceStatusClass, getYesNoValue } from '@/utils/common.js';
import { capitalize, formatUTCDate } from '@/utils/format';

const LICENCE_CATEGORIES = {
  PRESCHOOL: 'preschool',
  SCHOOL_AGE_CARE_ON_SCHOOL_GROUNDS: 'school age care on school grounds',
  GROUP_CHILD_CARE_SCHOOL_AGE: 'group child care (school age)',
};

export default {
  name: 'ServiceDetails',
  props: {
    licence: {
      type: Object,
      required: true,
    },
  },
  computed: {
    preschoolDetail() {
      return (
        this.licence.serviceDeliveryDetails?.find(
          (d) => d.licenceCategory?.toLowerCase() === LICENCE_CATEGORIES.PRESCHOOL,
        ) ?? {}
      );
    },
    schoolAgeCareDetail() {
      return (
        this.licence.serviceDeliveryDetails?.find((d) =>
          [
            LICENCE_CATEGORIES.SCHOOL_AGE_CARE_ON_SCHOOL_GROUNDS,
            LICENCE_CATEGORIES.GROUP_CHILD_CARE_SCHOOL_AGE,
          ].includes(d.licenceCategory?.toLowerCase()),
        ) ?? {}
      );
    },
  },
  created() {
    this.EMPTY_PLACEHOLDER = EMPTY_PLACEHOLDER;
  },
  methods: {
    capitalize,
    formatUTCDate,
    getYesNoValue,
    getLicenceStatusClass,
  },
};
</script>
<style scoped>
.outer-box {
  padding: 16px;
  border: 2px solid #ccc;
  border-radius: 6px;
}
.box-container {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 20px;
}
.extended-hours-table-wrapper {
  overflow-x: auto;
}
.extended-hours-table {
  width: 100%;
  border-collapse: collapse;
}
.extended-hours-table th,
.extended-hours-table td {
  border: 1px solid #ccc;
  padding: 8px;
  text-align: left;
}
</style>
