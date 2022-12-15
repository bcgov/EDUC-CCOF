<template>
    <v-container>
      <v-row justify="center" class="pt-4">
        <span class="text-h5 text-center">Early Childhood Educator-Wage Enhancement (ECE-WE)</span>
      </v-row>
      <v-row justify="center" class="pt-4 text-h5" style="color:#003466;">
        {{this.userInfo.organizationName}}
      </v-row>
      <v-row><v-col></v-col></v-row>
      <v-row justify="center">
        Please select each facility you would like to opt-in to ECE-WE:
      </v-row>
      <v-row><v-col></v-col></v-row>
      <v-row justify="center">
        <v-alert
          class="col-11"
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
      <v-row><v-col></v-col></v-row>
      <v-row justify="center">
        <v-card elevation="4" class="col-9 pa-0">
          <v-row>
            <v-col class="py-0">
              <v-card-title class="py-1 noticeWarning">
                <span style="float:left">
                  <v-icon
                    x-large
                    class="py-1 px-3 noticeWarningIcon">
                    mdi-alert
                  </v-icon>
                </span>
                At least one facility must be opted-in
              </v-card-title>
            </v-col>
          </v-row>
          <v-row justify="center" class="pa-2">
            In order to continue, you must opt-in at least one facility to ECE-WE
          </v-row>
        </v-card>
      </v-row>
      <div v-for="(item, index) in this.navBarList" :key="(index)">
        <v-row justify="center" class="pa-4">
          <v-card elevation="4" class="py-2 px-5 mx-2 rounded-lg col-9" width="75%">
            <v-row>
              <v-col cols="4" class="d-flex">
                {{item.eceweApplicationName}}
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="5" class="flex-column">
                {{item.facilityName}}
              </v-col>
              <v-col v-if="!facilities?.[index]?.update" cols="4" class="flex-column text-center">
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
                License #: {{item.licenseNumber}}
              </v-col>
            </v-row>
          </v-card>
        </v-row>
      </div>
      <v-row><v-col></v-col></v-row>
      <v-row justify="space-around">
        <v-btn color="info" outlined required x-large @click="previous()">Back</v-btn>
        <v-btn color="secondary" outlined x-large @click="next()">Next</v-btn>
        <v-btn color="primary" outlined x-large :loading="processing" @click="saveFacilities()">Save</v-btn>
      </v-row>
    </v-container>
  </template>
  
<script>
  
import { PATHS } from '@/utils/constants';
import { mapGetters, mapState, mapActions } from 'vuex';
import alertMixin from '@/mixins/alertMixin';

export default {
  mixins: [alertMixin],
  data() {
    return {
      row: '',
      updateMode: '',
      processing: false,
    };
  },
  computed: {
    ...mapGetters('auth', ['userInfo']),
    ...mapState('app', ['navBarList']),
    facilities: {
      get() { return this.$store.state.eceweApp.facilities; },
      set(value) { this.$store.commit('eceweApp/setFacilities', value); }
    }
  },
  beforeMount() {
    this.loadData().then(() => {
      this.initECEWEFacilities(this.navBarList);
    });
  },
  mounted() {},
  methods: {
    ...mapActions('eceweApp', ['loadECEWE', 'saveECEWEFacilities', 'initECEWEFacilities']),
    toggleRadio(index) {
      this.facilities[index].update = (this.facilities[index].update===true)?false:true;
    },
    previous() {
      return this.$router.push(PATHS.eceweEligibility);
    },
    next() {
      this.$router.push(PATHS.eceweDocUpload);
    },
    async loadData() {
      if (this.isStarted) {
        return;
      }
      if (this.userInfo.applicationId) {
        this.processing = true;
        try {
          await this.loadECEWE(this.userInfo.applicationId);
        } catch (error) {
          console.log('Error loading ECEWE application.', error);
          this.setFailureAlert('Error loading ECEWE application.');
        }
        this.processing = false;
      }
    },
    async saveFacilities() {
      this.processing = true;
      try {
        await this.saveECEWEFacilities();
        this.setSuccessAlert('Success! ECEWE Facility appcliations have been saved.');
      } catch (error) {
        this.setFailureAlert('An error occurred while saving ECEWE facility applications. Please try again later.'+error);
      }
      this.processing = false;
    }
  }
};
</script>
//TODO add styles here and add prefex ECEWE to filename
<style>
  
</style>
