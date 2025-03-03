<template>
  <div class="text-center mb-4">
    <p class="text-h5 mb-4">Child Care Operating Funding Program - {{ programYear }} Program Confirmation Form</p>
    <h2 v-if="pageTitle" class="my-4">{{ pageTitle }}</h2>
    <div v-if="organizationName" class="text-h5 my-4 blue-text">
      {{ organizationName }}
    </div>
    <FacilityHeader
      v-if="facility"
      :facility-account-number="facility.facilityAccountNumber"
      :facility-name="facility.facilityName"
      :license-number="facility.licenseNumber"
    />
  </div>
</template>

<script>
import FacilityHeader from '@/components/guiComponents/FacilityHeader.vue';

export default {
  name: 'ApplicationPCFHeader',
  components: { FacilityHeader },
  props: {
    pageTitle: {
      type: String,
      default: '',
    },
    programYear: {
      type: String,
      default: '',
    },
    organizationName: {
      type: String,
      default: '',
    },
    facility: {
      type: Object,
      default: null,
    },
  },
};
</script>
