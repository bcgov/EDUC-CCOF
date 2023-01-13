<template>
  <v-container>
    <v-row justify="center" class="pt-4">
      <span class="text-h5 text-center">Early Childhood Educator-Wage Enhancement (ECE-WE)
        <span v-if="isRenewal"> - {{this.programYearLabel}} Program Confirmation Form</span></span>
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
            <v-card-title v-if="model.fundingModel == this.fundingModelTypeList[0].id && !isLoading" class="py-1 noticeInfo">
              <span style="float:left">
                <v-icon
                  x-large
                  class="py-1 px-3 noticeInfoIcon">
                  mdi-alert
                </v-icon>
              </span>
              You've indicated that all of your facilities have provincially funded ECEs and receive Low Wage Redress Funding.
            </v-card-title>
            <v-card-title v-else-if="!isLoading" class="py-1 noticeWarning">
              <span style="float:left">
                <v-icon
                  x-large
                  class="py-1 px-3 noticeWarningIcon">
                  mdi-alert
                </v-icon>
              </span>
              At least one facility must be opted-in
            </v-card-title>
            <v-card-title v-else class="py-1">
              <span style="float:left">
                <v-skeleton-loader v-if="isLoading" :loading="isLoading" type="avatar"></v-skeleton-loader>
              </span>
            </v-card-title>
          </v-col>
        </v-row>
        <v-row justify="center" class="pa-2">
          <v-col>
          <span v-if="model.fundingModel == this.fundingModelTypeList[0].id && !isLoading">These facilities are not eligible for ECE-WE and have been automatically opted out.</span>
          <span v-else-if="!isLoading">In order to continue, you must opt-in at least one facility to ECE-WE.</span>
          <v-skeleton-loader v-else :loading="true" type="text"></v-skeleton-loader>
        </v-col>
        </v-row>
      </v-card>
    </v-row>
    <div v-if="!isLoading">
      <div v-for="(facility, index) in this.uiFacilities" :key="(index)">
        <v-row justify="center" class="pa-4">
          <v-card elevation="4" class="py-2 px-5 mx-2 rounded-lg col-9" width="75%">
            <v-row>
              <v-col cols="12" class="d-flex">
                <span v-if="!isLoading">{{navBarList[index].facilityAccountNumber}}</span>
                <v-skeleton-loader v-else :loading="true" type="table-cell"></v-skeleton-loader>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="5" class="flex-column">
                <span v-if="!isLoading">{{navBarList[index].facilityName}}</span>
                <v-skeleton-loader v-else :loading="true" type="table-cell"></v-skeleton-loader>
              </v-col>
              <v-col v-if="!uiFacilities[index].update" cols="4" class="flex-column text-center">
                <span v-if="!isLoading">
                  Status: Opt {{uiFacilities[index].optInOrOut == 1?'in':'out'}}
                </span>
                <v-skeleton-loader v-else :loading="true" type="table-cell"></v-skeleton-loader>
              </v-col>
              <v-col v-else-if="uiFacilities[index].update" cols="3" class="d-flex justify-center align-center pt-0">
                <v-radio-group
                  v-if="!isLoading"
                  v-model="uiFacilities[index].optInOrOut"
                  class="pt-0 my-0"
                  row
                  :disabled="isReadOnly">
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
                <div v-else style="float:left;display:flex">
                  <v-skeleton-loader :loading="true" type="avatar"></v-skeleton-loader>
                  <v-skeleton-loader :loading="true" type="table-cell"></v-skeleton-loader>
                  <v-skeleton-loader :loading="true" type="avatar"></v-skeleton-loader>
                  <v-skeleton-loader :loading="true" type="table-cell"></v-skeleton-loader>
                </div>
              </v-col>
              <v-col cols="3">
                <v-btn
                  v-if="(!uiFacilities?.[index].update && !isLoading) && (model.fundingModel != fundingModelTypeList[0].id)"
                  @click="uiFacilities[index].update=(uiFacilities[index].update==false)?true:false;"
                  color="#003366"
                  dark
                  :disabled="isReadOnly"> 
                    Update
                </v-btn>
                <v-skeleton-loader v-else-if="!uiFacilities[index].update && isLoading" :loading="true" type="button"></v-skeleton-loader>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <span v-if="!isLoading">
                  License #: {{navBarList[index].licenseNumber}}
                </span>
                <v-skeleton-loader v-else :loading="true" type="table-cell"></v-skeleton-loader>
              </v-col>
            </v-row>
          </v-card>
        </v-row>
      </div>
    </div>
    <div v-if="isLoading">
      <div v-for="index in 2" :key="index">
        <v-row justify="center" class="pa-4">
          <v-card elevation="4" class="py-2 px-5 mx-2 rounded-lg col-9" width="75%">
            <v-row>
              <v-col cols="12" class="d-flex pa-0">
                <v-skeleton-loader :loading="true" type="table-cell" class="pa-0"></v-skeleton-loader>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="5" class="flex-column pa-0">
                <v-skeleton-loader :loading="true" type="table-cell"></v-skeleton-loader>
              </v-col>
              <v-col cols="4" class="d-flex justify-center align-center pt-0">
                <v-skeleton-loader :loading="true" type="table-cell"></v-skeleton-loader>
                <v-skeleton-loader :loading="true" type="table-cell"></v-skeleton-loader>
              </v-col>
              <v-col cols="3" class="pa-0">
                <v-skeleton-loader :loading="true" type="button"></v-skeleton-loader>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" class="pa-0">
                <v-skeleton-loader :loading="true" type="table-cell"></v-skeleton-loader>
              </v-col>
            </v-row>
          </v-card>
        </v-row>
      </div>
    </div>
    <v-row><v-col></v-col></v-row>
    <v-row justify="space-around">
      <v-btn color="info" :loading="isProcessing" outlined required x-large @click="previous()">Back</v-btn>
      <v-btn color="secondary" :loading="isProcessing" :disabled="!enableNextBtn" outlined x-large @click="next()">Next</v-btn>
      <v-btn color="primary" :loading="isProcessing" :disabled="!enableSaveBtn || isReadOnly" outlined x-large @click="saveFacilities()">Save</v-btn>
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
      uiFacilities: {},
      model: {},
      isLoading: false, // flag to UI if screen is getting data or not.
      isProcessing: false, // flag to UI if screen is saving/processing data or not.
      enableNextBtn: true,
      enableSaveBtn: true,
    };
  },
  computed: {
    ...mapGetters('auth', ['userInfo']),
    ...mapState('eceweApp', ['isStarted', 'eceweModel']),
    ...mapState('app', ['navBarList', 'fundingModelTypeList']),
    ...mapState('organization', ['applicationId']),
    ...mapState('application', ['programYearLabel', 'applicationStatus', 'unlockEcewe', 'isRenewal']),
    facilities: {
      get() { return this.$store.state.eceweApp.facilities; },
      set(value) { this.$store.commit('eceweApp/setFacilities', value); }
    },
    isReadOnly() {
      if (this.eceweUnlock){
        return false;
      }
      else if (this.applicationStatus === 'SUBMITTED'){
        return true; 
      }
      return false;
    }
  },
  async beforeMount() {
    this.setFundingModelTypes({...this.fundingModelTypeList});
    this.setApplicationId(this.applicationId);
    await this.loadData();
    let copyFacilities = JSON.parse(JSON.stringify(this.facilities));
    copyFacilities.forEach(element => element.update = element.optInOrOut == null);
    this.uiFacilities = copyFacilities;
    this.setLoadedFacilities([...this.facilities]);
    this.model = {...this.eceweModel};
    this.enableButtons();
  },
  async beforeRouteLeave(_to, _from, next) {
    await this.saveFacilities(false);
    next();
  },
  methods: {
    ...mapActions('eceweApp', ['loadECEWE', 'saveECEWEFacilities', 'initECEWEFacilities']),
    ...mapMutations('app', ['refreshNavBar', 'setEceweFacilityComplete']),
    ...mapMutations('eceweApp', ['setEceweModel', 'setLoadedFacilities', 'setFacilities', 'setApplicationId', 'setFundingModelTypes']),
    enableButtons() {
      if (this.model.fundingModel == this.fundingModelTypeList[0].id) {
        this.enableSaveBtn = false;
        this.enableNextBtn = true;
      }
    },
    toggleRadio(index) {
      this.uiFacilities[index].update = (this.uiFacilities[index].update==true)?false:true;
    },
    previous() {
      return this.$router.push(PATHS.eceweEligibility);
    },
    next() {
      this.$router.push(PATHS.supportingDocumentUpload);
    },
    async loadData() {
      if (this.isStarted) {
        return;
      }
      if (this.applicationId) {
        this.isLoading = true;
        try {
          await this.loadECEWE();
        } catch (error) {
          console.log('Error loading ECEWE application.', error);
          this.setFailureAlert('Error loading ECEWE application.');
        }
        this.isLoading = false;
      }
    },
    async saveFacilities(showConfirmation) {
      this.isProcessing = true;
      try {
        let uiFacilitiesCopy = JSON.parse(JSON.stringify(this.uiFacilities));
        uiFacilitiesCopy = uiFacilitiesCopy.map(({ update, ...item }) => item);
        this.setFacilities(uiFacilitiesCopy);
        await this.saveECEWEFacilities();
        if (showConfirmation || showConfirmation == null) {
          this.setSuccessAlert('Success! ECEWE Facility appcliations have been saved.');
        }
      } catch (error) {
        this.setFailureAlert('An error occurred while saving ECEWE facility applications. Please try again later.'+error);
      }
      this.isProcessing = false;
    },
  }
};
</script>
