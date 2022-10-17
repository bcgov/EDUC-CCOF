<template>
  <v-container>
    <v-row justify="space-around">
      <v-card class="cc-top-level-card" width="1200">
        <v-container>
          <v-row justify="center">
            You have successfully applied for CCOF for the following Facilities:
          </v-row>

          <v-row justify="center" style="padding-top: 2em;">
            <ul style="list-style: none">
              <li v-for="item in facilities" :key="item.id" style="">
                <a>{{ item.name }}</a>
              </li>
            </ul>
          </v-row>
        </v-container>
      </v-card>

      <v-card class="cc-top-level-card" width="1200">
        <v-container>
          <v-row justify="center">
            Do you want to add another facility?
          </v-row>

          <v-row justify="center">
            <v-btn color="primary" outlined x-large style="margin: 2em;" @click="addAnotherFacility()">Yes</v-btn>
            <v-btn color="secondary" outlined x-large style="margin: 2em;">No</v-btn>
          </v-row>
        </v-container>
      </v-card>
    </v-row>

    <v-row justify="space-around">
      <v-btn color="info" outlined required x-large @click="previous()">Back</v-btn>
    </v-row>
  </v-container>
</template>

<script>

import PATHS from '../paths';

export default {
  props: {
  },
  computed: {
  },
  data() {
    return {
      facilities: [{ name: 'Facility 1', id: 'fac1' }, { name: 'Facility 2', id: 'fac2' }, { name: 'Facility 3', id: 'fac3' }]
    };
  },
  methods: {
    previous() {
      this.$router.push(PATHS.fundAmount);
    },
    addAnotherFacility() { 
      this.$router.push(PATHS.facInfo);
    }
  }
};
</script>
