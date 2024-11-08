<template>
  <div class="text-center">
    <div v-if="facilityAccountNumber" class="">
      <p class="text-h5 blueText">Facility ID: {{ facilityAccountNumber }}</p>
    </div>
    <br />
    <p class="text-h5 blueText">Facility Name: {{ facilityName }}</p>
    <br />
    <p v-if="licenseNumber" class="text-h5 blueText">Licence Number: {{ licenseNumber }}</p>
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

<style>
.blueBorder {
  border-top: 5px solid #003366 !important;
}

.blueText {
  color: rgb(0, 52, 102);
}
</style>
