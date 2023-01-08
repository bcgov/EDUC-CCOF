<template>
  <v-form ref="form">
    <v-container>
      <v-row justify="center" class="pt-4">
        <span class="text-h5">Early Childhood Educator-Wage Enhancement (ECE-WE)</span>
      </v-row>
      <v-row justify="center" class="pt-4 text-h5" style="color:#003466;">
        {{this.userInfo.organizationName}}
      </v-row>
      <v-row justify="center">
        <v-card elevation="4" class="py-2 px-5 mx-2 mt-10 rounded-lg col-11">
          <v-container>
            <v-row v-if="isLoading">
              <v-col>
                <v-skeleton-loader v-if="isLoading" :loading="isLoading" type="text@1"></v-skeleton-loader>
                <v-skeleton-loader v-if="isLoading" :loading="isLoading" type="actions"></v-skeleton-loader>
              </v-col>
            </v-row>
            <v-row v-if="!isLoading" justify="center">
              <v-radio-group
                v-model="optInECEWE">
                <template v-slot:label>
                  <span class="radio-label" style="align-content: center;">For the 2022/23 funding term, would you like to opt-in to ECE-WE for any facility in your organization?</span>
                </template>
                <div class="flex-center pt-2">
                  <v-radio
                    class="pt-2 pr-8"
                    label="Yes"
                    :value="1"
                    ></v-radio>
                  <v-radio
                    class="pt-1"
                    label="No"
                    :value="0"
                    ></v-radio>
                </div>
              </v-radio-group>
            </v-row>
          </v-container>
        </v-card>
      </v-row>
      <v-row v-if="(optInECEWE == 1) || isLoading" justify="center">
        <v-card elevation="4" class="py-2 px-5 mx-2 mt-10 rounded-lg col-11">
          <v-container>
            <v-row v-if="isLoading">
              <v-col>
                <v-skeleton-loader v-if="isLoading" :loading="isLoading" type="text@1"></v-skeleton-loader>
                <v-skeleton-loader v-if="isLoading" :loading="isLoading" type="actions"></v-skeleton-loader>
              </v-col>
            </v-row>
            <v-row v-if="!isLoading" justify="center">
              <v-radio-group
                v-model="belongsToUnion">
                <template v-slot:label>
                  <span class="radio-label">Do any of the ECE Employees at any facility in your organization belong to a union?</span>
                </template>
                <div class="flex-center">
                <v-radio class="pt-2 pr-8"
                  label="Yes"
                  :value="1"
              ></v-radio>
              <v-radio
                  class="pt-1"
                  label="No"
                  :value="0"
                ></v-radio>
              </div>
              </v-radio-group>
            </v-row>
          </v-container>
        </v-card>
      </v-row>
      <v-row v-if="(belongsToUnion == 1 && optInECEWE == 1) || isLoading" justify="center">
        <v-card elevation="4" class="py-2 px-5 mx-2 mt-10 rounded-lg col-11">
          <v-container>
            <v-row v-if="isLoading">
              <v-col>
                <v-skeleton-loader v-if="isLoading" :loading="isLoading" type="card-heading"></v-skeleton-loader>
                <v-skeleton-loader v-if="isLoading" :loading="isLoading" type="list-item-avatar"></v-skeleton-loader>
                <v-skeleton-loader v-if="isLoading" :loading="isLoading" type="list-item-avatar"></v-skeleton-loader>
                <v-skeleton-loader v-if="isLoading" :loading="isLoading" type="list-item-avatar"></v-skeleton-loader>
              </v-col>
            </v-row>
            <div v-if="!isLoading">
            <v-row justify="center" >
              <v-col style="padding-bottom:0px;margin-bottom:0px;">
                Select the applicable funding model:
              </v-col>
            </v-row>
            <v-radio-group
                v-model="fundingModel"
                row>
            <v-row justify="center">
              <v-col class="pt-2">
                <v-radio
                  :label="this.fundingModelTypeList[0].description"
                  :value="this.fundingModelTypeList[0].id"
                  ></v-radio>
              </v-col>
            </v-row>
            <v-card v-if="fundingModel == this.fundingModelTypeList[0].id" width="100%">
              <v-row>
                <v-col class="py-0">
                  <v-card-title class="py-0 noticeAlert">
                    <span style="float:left">
                  <v-icon
                    x-large
                    class="py-1 px-3 noticeAlertIcon">
                    mdi-alert-octagon
                  </v-icon>
                  </span>
                    ECEs at these facilities are not eligible for ECE Wage Enhancement
                  </v-card-title>
                </v-col>
              </v-row>
              <v-row justify="center" class="pa-2">
                Government’s Low-Wage Redress Funding supports ECE wage ajustments
              </v-row>
            </v-card>
            <v-row>
              <v-col class="pt-7">
                <v-radio
                  :label="this.fundingModelTypeList[1].description"
                  :value="this.fundingModelTypeList[1].id"
                ></v-radio>
              </v-col>
            </v-row>
            <v-card v-if="fundingModel == this.fundingModelTypeList[1].id" width="100%">
              <v-row>
                <v-col class="py-0">
                  <v-card-title class="py-0 noticeWarning">
                    <span style="float:left">
                  <v-icon
                    x-large
                    class="py-1 px-3 noticeWarningIcon">
                    mdi-alert
                  </v-icon>
                  </span>
                    ECEs in provincially funded programs are not eligible
                  </v-card-title>
                </v-col>
              </v-row>
              <v-row justify="center" class="pa-2">
                Only ECEs in non-provincially funded programs are eligible for ECE Wage Enhancement.
              </v-row>
            </v-card>
            <v-row>
              <v-col class="pt-7">
                <v-radio
                  :label="this.fundingModelTypeList[2].description"
                  :value="this.fundingModelTypeList[2].id"
                ></v-radio>
              </v-col>
            </v-row>
            <v-card v-if="fundingModel === this.fundingModelTypeList[2].id" width="100%">
              <v-row>
                <v-col class="py-0">
                  <v-card-title class="py-0 noticeInfo">
                    <span style="float:left">
                  <v-icon
                    x-large
                    color="#D40D19"
                    class="py-1 px-3 noticeInfoIcon">
                    mdi-information
                  </v-icon>
                  </span>
                    Please confirm
                  </v-card-title>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="pl-6 d-flex py-0">
                  <v-checkbox
                    class="pa-0"
                    v-model="confirmation"
                    :value="1"
                    label="I confirm that my organization/facilities pay the Joint Job Evaluation Plan (JJEP) wage rates or, if a lesser amount, a side agreement is being concluded to implement the ECE Wage Enhancement."
                    >
                  </v-checkbox>
                </v-col>
              </v-row>
            </v-card>
            </v-radio-group>
            </div>
          </v-container>
        </v-card>
      </v-row>
      <v-row v-if="!isLoading" justify="space-around" class="mt-10">
        <v-btn color="info" outlined required x-large @click="previous()">Back</v-btn>
        <v-btn :disabled="!enableButtons" :loading="isProcessing" color="secondary" outlined x-large @click="next()">Next</v-btn>
        <v-btn :disabled="!enableButtons" :loading="isProcessing" color="primary" outlined x-large @click="saveECEWEApplication()">Save</v-btn>
      </v-row>
      <v-row v-else justify="space-around" class="pt-6">
        <v-skeleton-loader :loading="true" type="button"></v-skeleton-loader>
        <v-skeleton-loader :loading="true" type="button"></v-skeleton-loader>
        <v-skeleton-loader :loading="true" type="button"></v-skeleton-loader>
    </v-row>
    </v-container>
  </v-form>
</template>
  
<script>
  
import { PATHS } from '@/utils/constants';
import { mapGetters, mapState, mapActions, mapMutations } from 'vuex';
import alertMixin from '@/mixins/alertMixin';

export default {
  mixins: [alertMixin],
  data() {
    return {
      isLoading: false, // flag to UI if screen is getting data or not.
      isProcessing: false, // flag to UI if screen is saving/processing data or not.
    };
  },
  computed: {
    ...mapGetters('auth', ['userInfo']),
    ...mapState('eceweApp', ['isStarted']),
    ...mapState('app', ['navBarList', 'fundingModelTypeList']),
    ...mapState('organization', ['applicationId']),

    enableButtons() {
      return (this.belongsToUnion === 1 && this.fundingModel === this.fundingModelTypeList[2].id && this.confirmation === 1)
            ||(this.belongsToUnion === 1 && this.fundingModel != this.fundingModelTypeList[2].id)
            ||this.belongsToUnion === 0
            || this.optInECEWE === 0;
    },
    optInECEWE: {
      get() { return this.$store.state.eceweApp.optInECEWE; },
      set(value) { this.$store.commit('eceweApp/setOptInECEWE', value); }
    },
    belongsToUnion: {
      get() { return this.$store.state.eceweApp.belongsToUnion; },
      set(value) { this.$store.commit('eceweApp/setBelongsToUnion', value); }
    },
    fundingModel: {
      get() { return this.$store.state.eceweApp.fundingModel; },
      set(value) { this.$store.commit('eceweApp/setFundingModel', value); }
    },
    fundingModelTypes: {
      get() { return this.$store.state.eceweApp.fundingModelTypes; },
      set(value) { this.$store.commit('eceweApp/setFundingModelTypes', value); }
    },
    confirmation: {
      get() { return this.$store.state.eceweApp.confirmation; },
      set(value) { this.$store.commit('eceweApp/setConfirmation', value); }
    },
    facilities: {
      get() { return this.$store.state.eceweApp.facilities; },
      set(value) { this.$store.commit('eceweApp/setFacilities', value); }
    },
    isValidForm: { 
      get () { return this.$store.state.organization.isValidForm; }, 
      set (value) { this.$store.commit('organization/setIsValidForm', value); }
    }
  },
  mounted() {
    this.fundingModelTypes = this.fundingModelTypeList;
    this.loadData();
  },
  methods: {
    ...mapActions('eceweApp', ['loadECEWE', 'saveECEWE', 'initECEWEFacilities', 'saveECEWEFacilities']),
    ...mapMutations('eceweApp', ['setIsStarted']),
    previous() {
      this.$router.push(PATHS.ccfriHome);
    },
    async next() {
      if (this.optInECEWE == 0) {
        this.$router.push(PATHS.supportingDocumentUpload);
      } else {
        this.isProcessing = true;
        // If fundingMoel question 1, we need to deterimine if factilities are all opted out or not. If
        // not, we want to set all to opted out and save.
        if (this.fundingModel === this.fundingModelTypeList[0].id) {
          if (!this.allFacilitiesOptedOut()) {
            this.initECEWEFacilities(this.navBarList);
            this.saveECEWEFacilities();
          }
        }
        this.isProcessing = false;
        this.$router.push(PATHS.eceweFacilities);
      }
    },
    /* Determines if all facilites are currently opted out. */
    allFacilitiesOptedOut() {
      for (let facility of this.facilities) {
        if (facility.optInOrOut == 1 || facility.optInOrOut == null) {
          return false;
        }
      }
      return true;
    },
    async loadData() {
      if (this.isStarted) {
        return;
      }
      if (this.applicationId) {
        this.isLoading = true;
        try {
          await this.loadECEWE(this.applicationId);
        } catch (error) {
          console.log('Error loading ECEWE application.', error);
          this.setFailureAlert('Error loading ECEWE application.');
        }
        this.setIsStarted(true);
        this.isLoading = false;
      }
    },
    async saveECEWEApplication() {
      try {
        this.isProcessing = true;
        await this.saveECEWE();
        this.isProcessing = false;
        this.setSuccessAlert('Success! ECEWE appcliation has been saved.');
      } catch (error) {
        this.setFailureAlert('An error occurred while saving ECEWE application. Please try again later.'+error);
      }
    },
  }
};
</script>
<style>
.flex-center {
  display: flex;
  align-items: center;
  align-self: center;
}
.radio-label {
  font-size: 17px;
}

div.v-skeleton-loader__actions.v-skeleton-loader__bone {
  align-self:center;
  align-items: center;
  text-align: center;
}
</style>
