<template>
    <v-container>
      <v-row justify="center" class="pt-4">
        <span class="text-h5">Early Childhood Educator-Wage Enhancement (ECE-WE)</span>
      </v-row>
      <v-row justify="center" class="pt-4 text-h6" style="color:#003466;">
        {{this.userInfo.organizationName}}
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
      <div v-for="(item, index) in this.navBarList" :key="(index)">
        <v-row justify="center" class="pa-4">
          <v-card elevation="1" class="cc-top-level-card eceweCard" width="75%">
            <v-row>
              <v-col cols="4" class="d-flex">
                {{item.facilityAccountNumber}}
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="5" class="flex-column">
                {{item.facilityName}}
              </v-col>
              <v-col v-if="/*updating(index)*/!facilities?.[index]?.update" cols="4" class="flex-column text-center">
                <span>
                  Status: Opt {{facilities?.[index]?.optInOrOut == 1?'in':'out'}}
                </span>
              </v-col>
              <v-col v-else cols="7" class="d-flex justify-center align-center pt-0">
                <v-radio-group
                  v-model="facilities[index].optInOrOut"
                  class="pt-0 my-0"
                  row>
                  <v-radio
                    @click="toggleRadio(index)"
                    label="Opt-In"
                    :value="1">
                  </v-radio>
                  <v-radio
                    @click="toggleRadio(index)"
                    label="Opt-Out"
                    :value="0">
                  </v-radio>
                </v-radio-group>
              </v-col>        
              <v-col v-if="!facilities?.[index]?.update" cols="3" class="">
                <v-btn
                  @click="facilities[index].update=(facilities[index].update==false)?true:false"
                  color="#003366"
                  dark> 
                    Update
                  </v-btn>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                License #: {{'??? NO LICENSE ???'}}
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
import { mapGetters, mapState, mapActions, mapMutations } from 'vuex';
import alertMixin from '@/mixins/alertMixin';

export default {
  mixins: [alertMixin],
  data() {
    return {
      row: '',
      updateMode: '',
    };
  },
  watch: {
    '$route.params.urlGuid': {
      handler() {
        this.applicationId = this.$route.params.urlGuid;
        if (this.applicationId) {
          this.loadData().then(() => {
            this.initFacilities();
          });
        }
      },
      immediate: true,
      deep: true
    },
  },
  computed: {
    ...mapGetters('auth', ['userInfo']),
    ...mapState('app', ['navBarList']),
    applicationId: {
      get() { return this.$store.state.eceweApp.applicationId; },
      set(value) { this.$store.commit('eceweApp/setApplicationId', value); }
    },
    facilities: {
      get() { return this.$store.state.eceweApp.facilities; },
      set(value) { this.$store.commit('eceweApp/setFacilities', value); }
    }
  },
  beforeMount() {},
  mounted() {},
  methods: {
    ...mapActions('eceweApp', ['loadECEWE', 'saveECEWEFacilities']),
    toggleRadio(index) {
      this.facilities[index].update = (this.facilities[index].update===true)?false:true;
    },
    previous() {
      return this.$router.push(PATHS.eceweEligibility);
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
          await this.loadECEWE(this.applicationId);
        } catch (error) {
          console.log('Error loading ECEWE application.', error);
          this.setFailureAlert('Error loading ECEWE application.');
        }
        this.processing = false;
      }
    },
    async saveFacilities() {
      try {
        await this.saveECEWEFacilities();
        this.setSuccessAlert('Success! ECEWE Facility appcliations have been saved.');
      } catch (error) {
        this.setFailureAlert('An error occurred while saving ECEWE facility applications. Please try again later.'+error);
      }
      this.processing = false;
    },
    /* If no ECEWE faclities found, then create the faclities list from navBarList. */
    initFacilities() {
      if (this.facilities?.length == 0 || this.facilities == null) {
        this.facilities = new Array(this.navBarList.length).fill({});
        for (let i = 0; i < this.navBarList.length; i++) {
          this.facilities[i] = {applicationid: this.applicationId, facilityId: this.navBarList[i].facilityId, optInOrOut: null, statuscode: 1};
        }
        this.facilities = this.facilities.map(obj => ({ ...obj, update: true }));
      } else {
        let tempFacilities = new Array(this.navBarList.length).fill({});
        for (let j = 0; j < this.navBarList.length; j++) {
          tempFacilities[j] = {applicationid: this.applicationId,
                               facilityId: this.navBarList[j].facilityId,
                               optInOrOut: this.getOptInOrOut(this.navBarList[j].facilityId),
                               eceweApplicationId: this.getEceweApplicationId(this.navBarList[j].facilityId),
                               statuscode: this.getStatuscode(this.navBarList[j].facilityId),
                               update: this.getUpdate(this.navBarList[j].facilityId)};
        }
        this.facilities = tempFacilities;
      }
    },
    updating(index) {
      let result = false;
      try {
        if (this.facilities?.[index]?.optInOrOut != null && this.facilities?.[index]?.update == true) {
          result = true;
        }
      } catch (error) {
        //TODO remove...
        console.log('WERSRSERSERESRSEREs '+error);
      }
      return result;
    },
    getEceweApplicationId(facilityId) {
      const index = this.facilities.map(facilty => facilty.facilityId).indexOf(facilityId);
      return (index >= 0)?this.facilities[index].eceweApplicationId:null;
    },
    getOptInOrOut(facilityId) {
      const index = this.facilities.map(facilty => facilty.facilityId).indexOf(facilityId);
      return (index >= 0)?this.facilities[index].optInOrOut:null;
    },
    getStatuscode(facilityId) {
      const index = this.facilities.map(facilty => facilty.facilityId).indexOf(facilityId);
      return (index >= 0)?this.facilities[index].statuscode:null;
    },
    getUpdate(facilityId) {
      const index = this.facilities.map(facilty => facilty.facilityId).indexOf(facilityId);
      return (index >= 0)?(this.facilities[index].optInOrOut !=null?false:true):true;
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
