<template>
  <div class=" text-center" >
    <div class="" v-if="facilityAccountNumber">
      <p class="text-h5 blueText">Facility ID: {{facilityAccountNumber}} </p>
    </div>
    <br>
    <p class="text-h5 blueText"> Facility Name:  {{facilityName}}  </p>
    <br>
    <p class="text-h5 blueText" v-if="licenseNumber"> Licence Number:
        {{ licenseNumber }} </p>

  </div>
</template>

<script>
export default {
  name: 'FacilityHeader',
  props: {
    facilityAccountNumber: String,
    facilityName: String,
    licenseNumber: String
  }
};
</script>

<style>

.blueBorder{
  border-top: 5px solid #003366 !important;
}

.blueText {
  color: rgb(0, 52, 102);
}

</style>
