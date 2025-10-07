<template>
  <AppDialog v-model="isOpen" max-width="1200px" text-alignment="left" persistent scrollable @close="closeDialog">
    <template #content>
      <div class="outer-box">
        <div class="box-container mb-4">
          <v-row class="mb-2">
            <v-col cols="12" md="6" class="field-container">
              <strong class="label">Licence Number:</strong>
              <span>{{ licence.licenceNumber }}</span>
              <span class="ml-2" :class="getStatusClass(licence.licenceStatus)">
                {{ licence.licenceStatus }}
              </span>
            </v-col>
          </v-row>
          <v-row class="mb-2">
            <v-col cols="12" md="4" class="field-container">
              <strong class="label">Licence Effective Date:</strong>
              <span>{{ formatUTCDate(licence.licenceStartDate) }}</span>
            </v-col>
            <v-col cols="12" md="4" class="field-container">
              <strong class="label">Record Start Date:</strong>
              <span>{{ licence.recordStartDate }}</span>
            </v-col>
            <v-col cols="12" md="4" class="field-container">
              <strong class="label">Record End Date:</strong>
              <span>{{ licence.recordEndDate ?? EMPTY_PLACEHOLDER }}</span>
            </v-col>
          </v-row>
        </div>
        <h2 class="mb-2 section-heading">Community Care and Assisted Living Act Facility Licence Details</h2>

        <div v-if="licence?.serviceDeliveryDetails?.length">
          <div class="box-container mb-4">
            <v-row class="mb-2">
              <v-col cols="12" md="6" class="field-container">
                <strong class="label">Maximum Capacity:</strong>
                <span>{{ licence.licenceMaxCapacity ?? EMPTY_PLACEHOLDER }}</span>
              </v-col>
            </v-row>
            <v-row v-for="(serviceDetail, index) in licence.serviceDeliveryDetails" :key="index" class="mb-2">
              <v-col cols="12" md="6" class="field-container">
                <strong class="label">Licence Category:</strong>
                <span>{{ capitalize(serviceDetail.licenceCategory) }}</span>
              </v-col>
              <v-col cols="12" md="6" class="field-container">
                <strong class="label">Maximum Capacity by Care Type:</strong>
                <span>{{ serviceDetail.licencedSpaces }}</span>
              </v-col>
            </v-row>
          </div>

          <h2 class="mb-1 section-heading">Service Details</h2>
          <div class="box-container mb-4">
            <v-row class="mb-2">
              <v-col cols="12" md="6" class="field-container">
                <strong class="label">Max number of days per week you provide child care:</strong>
                <span>{{ licence.licenceMaxDaysPerWeek ?? EMPTY_PLACEHOLDER }}</span>
              </v-col>
              <v-col cols="12" md="6" class="field-container">
                <strong class="label">Max number of weeks per year you provide child care:</strong>
                <span>{{ licence.licenceMaxWeeksPerYear ?? EMPTY_PLACEHOLDER }}</span>
              </v-col>
            </v-row>
            <v-row class="mb-2">
              <v-col cols="12" md="6" class="field-container">
                <strong class="label">Is the facility located on school property?</strong>
                <span>{{ licence.locatedOnSchoolProperty ? 'Yes' : 'No' }}</span>
              </v-col>
              <v-col v-if="Object.keys(preschoolDetail).length" cols="12" md="6" class="field-container">
                <strong class="label">Number of preschool sessions per week:</strong>
                <span>{{ preschoolDetail.preschoolSessions ?? EMPTY_PLACEHOLDER }}</span>
              </v-col>
            </v-row>
            <template v-if="Object.keys(schoolAgeCareDetail).length">
              <v-row class="mb-2">
                <v-col cols="12" md="6" class="field-container">
                  <strong class="label">Before school care offered:</strong>
                  <span>{{ schoolAgeCareDetail.beforeSchoolCare ? 'Yes' : 'No' }}</span>
                </v-col>
                <v-col cols="12" md="6" class="field-container">
                  <strong class="label">After school care offered:</strong>
                  <span>{{ schoolAgeCareDetail.afterSchoolCare ? 'Yes' : 'No' }}</span>
                </v-col>
              </v-row>
              <v-row class="mb-2">
                <v-col cols="12" md="6" class="field-container">
                  <strong class="label">Before Kindergarten care offered:</strong>
                  <span>{{ schoolAgeCareDetail.morningKinderCare ? 'Yes' : 'No' }}</span>
                </v-col>
                <v-col cols="12" md="6" class="field-container">
                  <strong class="label">After Kindergarten care offered:</strong>
                  <span>{{ schoolAgeCareDetail.afterKinderCare ? 'Yes' : 'No' }}</span>
                </v-col>
              </v-row>
            </template>
          </div>

          <h2 class="mb-1 section-heading">Extended Hours Details</h2>
          <div class="box-container mb-4">
            <v-row class="mb-2">
              <v-col cols="12" class="field-container">
                <strong class="label">
                  Care before 6:00 AM, after 7:00 PM or overnight service regularly offered:
                </strong>
                <span>{{ licence.licenceExtendedHours ? 'Yes' : 'No' }}</span>
              </v-col>
            </v-row>
          </div>
        </div>
      </div>
    </template>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/guiComponents/AppDialog.vue';
import { EMPTY_PLACEHOLDER } from '@/utils/constants.js';
import { capitalize, formatUTCDate } from '@/utils/format';

export default {
  name: 'ViewServiceDetails',
  components: { AppDialog },
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    licence: {
      type: Object,
      required: true,
    },
  },
  emits: ['update:show'],
  computed: {
    isOpen: {
      get() {
        return this.show;
      },
      set(val) {
        this.$emit('update:show', val);
      },
    },
    preschoolDetail() {
      return this.licence.serviceDeliveryDetails?.find((d) => d.licenceCategory?.toLowerCase() === 'preschool') || {};
    },
    schoolAgeCareDetail() {
      return (
        this.licence.serviceDeliveryDetails?.find((d) =>
          ['school age care on school grounds', 'group child care (school age)'].includes(
            d.licenceCategory?.toLowerCase(),
          ),
        ) || {}
      );
    },
  },
  created() {
    this.EMPTY_PLACEHOLDER = EMPTY_PLACEHOLDER;
  },
  methods: {
    capitalize,
    formatUTCDate,
    closeDialog() {
      this.isOpen = false;
    },
    getStatusClass(status) {
      switch (status) {
        case 'Approved':
          return 'status-green';
        case 'Inactive':
          return 'status-gray';
        default:
          return 'status-default';
      }
    },
  },
};
</script>
<style scoped>
.section-heading {
  font-size: 1.1rem;
  font-weight: bold;
  margin-bottom: 12px;
}
.box-container {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 24px;
}
.label {
  font-weight: bold;
  margin-right: 8px;
  white-space: nowrap;
}
.field-container {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 4px;
}
@media (max-width: 600px) {
  .section-heading {
    font-size: 1rem;
  }
  .box-container {
    padding: 14px;
  }
  .field-container {
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 12px;
  }
  .label {
    margin-bottom: 4px;
    white-space: normal;
  }
}
</style>
