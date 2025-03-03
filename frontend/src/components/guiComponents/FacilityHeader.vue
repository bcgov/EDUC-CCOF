<template>
  <div class="text-center mt-4 mb-8">
    <p v-if="facilityAccountNumber" class="text-h5 my-4 blue-text">Facility ID: {{ facilityAccountNumber }}</p>
    <p class="text-h5 my-4 blue-text">Facility Name: {{ facilityName }}</p>
    <p v-if="licenseNumber" class="text-h5 my-4 blue-text">Licence Number: {{ licenseNumber }}</p>
  </div>
</template>

<script>
export default {
  name: 'FacilityHeader',
  props: {
    facilityAccountNumber: { type: String, default: '' },
    facilityName: { type: String, default: '' },
    licenseNumber: { type: String, default: '' },
  },
};
</script>
