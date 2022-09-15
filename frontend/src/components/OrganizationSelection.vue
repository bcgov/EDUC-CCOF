<template>
  <v-container>
    <v-row justify="center">
      <div
        class="pa-10"
        :class="'text-h4'"
        v-text="`Welcome ${userInfo.displayName}`" />
    </v-row >
    <v-row justify="center" v-for="organization in userInfo.organizationList" :key="organization.id">
      <v-col cols="8" >
        <v-card elevation="4" class="pa-4 mx-auto rounded-lg"
          max-width="450"
          rounded
          tiled
          color="#336799"
          :to="userInfo.facilityList.length > 1 ?'/fri-calculator' : 'error-page'" exact tile
          :ripple="false"
         >

          <v-card-text class="text-h4 white--text text-center" >
              {{ organization.name }}
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="8" >
        <v-card elevation="4" class="pa-4 mx-auto rounded-lg"
          max-width="450"
          rounded
          tiled
          :to="userInfo.facilityList.length > 1 ?'/fri-calculator' : 'error-page'" exact tile
          :ripple="false"
         >

          <v-card-text class="text-h4 text-center" >
              Add new organization
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

  </v-container>
</template>
<script>

import { mapGetters} from 'vuex';

export default {
  name: 'LandingPage',
  props: {
    currentYear: {
      type: Number,
      default: 2023,
      required: false,
    },
  },
  computed: {
    ...mapGetters('auth', ['userInfo']),
    currentYearTwoDigit() {
      return this.currentYear - 2000;
    },
    nextYearTwoDigit() {
      return this.currentYear - 1999;
    }
  },
};
</script>

<style scoped>
</style>
