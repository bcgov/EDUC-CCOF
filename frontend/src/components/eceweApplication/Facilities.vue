<template>
    <v-container>
      <v-row justify="center" class="pb-0">
        <br/>
        Early Childhood Educator-Wage Enhancement (ECE-WE)
      </v-row>
      <v-row justify="center" class="pt-2">
        {Organization Name}
      </v-row>
      <v-row><v-col></v-col></v-row>
      <v-row><v-col></v-col></v-row>
      <v-row justify="center">
        Please select each facility you would like to opt-in to ECE-WE:
      </v-row>
      <v-row><v-col></v-col></v-row>
      <v-row justify="center">
          <v-alert
            width="75%"
                outlined
                prominent
                color="#ABADAE">
                <span style="float:left">
                  <v-icon
                    x-large
                    color="rgb(0 51 102)"
                    class="py-1 px-3">
                    mdi-information
                  </v-icon>
                </span>
                <span class="pa-1">
                  Note: if any of your facilities are located in the Vancouver Coastal Health Authority, you must opt-in to ECE-WE for each licence located at the same physical address.
                </span>
          </v-alert>
      </v-row>
      <v-row justify="center">
        <v-card width="75%" elevation="1">
          <v-row>
            <v-col class="py-0">
              <v-card-title class="py-1 notice2">
                <span style="float:left">
                  <v-icon
                    x-large
                    class="py-1 px-3 iconNotice2">
                    mdi-alert
                  </v-icon>
                </span>
                At least one facility must be opted-in
              </v-card-title>
            </v-col>
          </v-row>
          <v-row justify="center" class="pa-4">
            In order to continue, you must opt-in at least one facility to ECE-WE
          </v-row>
        </v-card>
      </v-row>
      <v-row><v-col></v-col></v-row>
      <v-flex v-for="item in this.facilities" :key="item.id">
        <v-row justify="center" class="pa-4">
          <v-card elevation="1" class="cc-top-level-card eceweCard">
            <v-row>
              <v-col class="pl-8">
                {{item.id}}
              </v-col>
            </v-row>
            <v-row>
              <v-col class="pl-8">
                {{item.name}}
              </v-col>
              <v-col class="pl-8 text-right">
                Status: {{item.status}}
              </v-col>
              <v-col class="pl-8 text-center">
                <v-btn>Update</v-btn>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="pl-8">
                License #: {{item.licence}}
              </v-col>
            </v-row>
          </v-card>
        </v-row>
      </v-flex>
      <v-row>
        <v-col cols="4" class="text-left">
          <v-btn outlined required @click="back()">Back</v-btn>
        </v-col>
        <v-col cols="4" class="text-center">
          <v-btn outlined required @click="next()">Next</v-btn>
        </v-col>
        <v-col cols="4" class="text-right">
          <v-btn outlined required @click="save()">Save</v-btn>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
<script>
  
import { PATHS } from '@/utils/constants';

export default {
  props: {
  },
  computed: {
  },
  data() {
    return {
      eceweOptInQ1: '',
      employeesBelongToUnionQ2: '',
      fundingModelQ3: '',
      row: '',
      facilities: [
        { name: 'Some Facility Name 1', id: 'F-00001-00001', licence: '1526632', status: 'Opt in ECE-WE'},
        { name: 'Some Facility Name 2', id: 'G-00002-00002', licence: '7331621', status: 'Opt out ECE-WE'},
        { name: 'Some Facility Name 3', id: 'G-00003-00003', licence: '5526423', status: 'Opt out ECE-WE'},
        { name: 'Some Facility Name 4', id: 'F-00004-00004', licence: '6278422', status: 'Opt out ECE-WE'}]
    };
  },
  methods: {
    back() {
      return this.$router.go(-1);
    },
    next() {
      this.$router.push(PATHS.documentUpload);
    },
  }
};
</script>
  
<style>

.eceweCard {
  width:60%;
}
.iconNotice2 {
  color:#6C4A00 !important;
}
.notice2 {
  font-size:medium;
  color:#6C4A00;
  font-family:BCSans;
  padding-top:8px;
  padding-bottom:8px;
  background-color:#F9F1C6;
  border:1px solid #6C4A00;
}
</style>
