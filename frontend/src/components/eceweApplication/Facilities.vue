<template>
    <v-container>
      <v-row justify="center" class="pt-4">
        <span class="text-h5">Early Childhood Educator-Wage Enhancement (ECE-WE)</span>
      </v-row>
      <v-row justify="center" class="pt-4 text-h6" style="color:#003466;">
        AMBER MELO
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
      <div v-for="(item, index) in this.facilities" :key="item.index">
        <v-row justify="center" class="pa-4">
          <v-card elevation="1" class="cc-top-level-card eceweCard" width="75%">
            <v-row>
              <v-col cols="4" class="d-flex">
                {{item.facilityId}}
              </v-col>
            </v-row>
            <v-row class="">
              <v-col cols="5" class="flex-column">
                {{item.name}}
              </v-col>
              <v-col cols="4" class="flex-column">
                <span v-show="item.update === false">
                  Status: Opt {{item.optInOrOut == '1'?'in':'out'}} ECE-WE
                </span>
                <v-radio-group
                  v-show="item.update === true"
                  v-model="item.optInOrOut"
                  class="pt-0"
                  row
                  >
                  <v-radio
                    @click="toggleRadio(index)"
                    label="Opt in"
                    :value="1">
                  </v-radio>
                  <v-radio
                    @click="toggleRadio(index)"
                    label="Opt out"
                    :value="0">
                  </v-radio>
                </v-radio-group>
              </v-col>
              <v-col cols="3" class="">
                <v-btn
                  @click="item.update=(item.update==false)?true:false"
                  color="#003366"
                  dark> 
                    Update
                  </v-btn>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                License #: {{item.licenseNumber}}
              </v-col>
            </v-row>
          </v-card>
        </v-row>
      </div>
      <v-row justify="space-around">
        <v-btn color="info" outlined required x-large @click="previous()">Back</v-btn>
        <v-btn color="secondary" outlined x-large @click="next()">Next</v-btn>
        <v-btn color="primary" outlined x-large @click="saveFacilities()">Save</v-btn>
      </v-row>
    </v-container>
  </template>
  
<script>
  
import { PATHS } from '@/utils/constants';
import { mapActions } from 'vuex';
import alertMixin from '@/mixins/alertMixin';

export default {
  mixins: [alertMixin],
  data() {
    return {
      row: '',
    };
  },
  computed: {
    facilities: {
      get() { return this.$store.state.eceweApp.facilities; },
      set(value) { this.$store.commit('eceweApp/setFacilities', value); }
    }
  },
  mounted() {
    this.facilities = this.facilities.map(obj => ({ ...obj, update: false }));
  },
  methods: {
    ...mapActions('eceweApp', ['loadEceweApp', 'saveApplication', 'saveECEWEFacilityApplications']),
    toggleRadio(index) {
      this.facilities[index].update = (this.facilities[index].update==true)?false:true;
    },
    previous() {
      return this.$router.go(-1);
    },
    next() {
      this.$router.push(PATHS.documentUpload);
    },
    async loadData() {
      if (this.isStarted) {
        return;
      }
      if (this.applicationId) {
        this.processing = true;
        try {
          await this.loadEceweApp(this.applicationId);
        } catch (error) {
          console.log('Error loading ECEWE application.', error);
          this.setFailureAlert('Error loading ECEWE application.');
        }
        this.processing = false;
        this.setIsStarted(true);
      }
    },
    async save() {
      try {
        await this.saveApplication();
        this.setSuccessAlert('Success! ECEWE appcliation has been saved.');
      } catch (error) {
        this.setFailureAlert('An error occurred while saving ECEWE application. Please try again later.'+error);
      }
      this.processing = false;
    },
    async saveFacilities() {
      try {
        await this.saveECEWEFacilityApplications();
        this.setSuccessAlert('Success! ECEWE Facility appcliations have been saved.');
      } catch (error) {
        this.setFailureAlert('An error occurred while saving ECEWE facility applications. Please try again later.'+error);
      }
      this.processing = false;
    }



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
  font-family:'BCSans',Verdana,Arial,sans-serif;
  padding-top:8px;
  padding-bottom:8px;
  background-color:#F9F1C6;
  border:1px solid #6C4A00;
}
</style>
