<template>
  <v-form ref="form">
    <v-container>
      <v-row justify="center" class="pt-4">
        <span class="text-h5">Early Childhood Educator-Wage Enhancement (ECE-WE) - {{this.programYearLabel}} Program Confirmation Form</span>
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
                v-model="model.optInECEWE"
                :disabled="isReadOnly">
                <template v-slot:label>
                  <span class="radio-label" style="align-content: center;">For the {{programYearLabel}} funding term, would you like to opt-in to ECE-WE for any facility in your organization?</span>
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
      <v-row v-if="(this.model.optInECEWE == 1) || isLoading" justify="center">
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
                v-model="model.belongsToUnion"
                :disabled="isReadOnly">
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
      <v-row v-if="(model.belongsToUnion == 1 && model.optInECEWE == 1) || isLoading" justify="center">
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
                v-model="model.fundingModel"
                row
                :disabled="isReadOnly">
            <v-row justify="center">
              <v-col class="pt-2">
                <v-radio
                  :label="fundingModelTypeList[0].description"
                  :value="fundingModelTypeList[0].id"
                  ></v-radio>
              </v-col>
            </v-row>
            <v-card v-if="model.fundingModel == fundingModelTypeList[0].id" width="100%">
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
                Government’s Low-Wage Redress Funding supports ECE wage adjustments
              </v-row>
            </v-card>
            <v-row>
              <v-col class="pt-7">
                <v-radio
                  :label="fundingModelTypeList[1].description"
                  :value="fundingModelTypeList[1].id"
                ></v-radio>
              </v-col>
            </v-row>
            <v-card v-if="model.fundingModel == fundingModelTypeList[1].id" width="100%">
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
                  :label="fundingModelTypeList[2].description"
                  :value="fundingModelTypeList[2].id"
                ></v-radio>
              </v-col>
            </v-row>
            <v-card v-if="model.fundingModel === fundingModelTypeList[2].id" width="100%">
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
                    v-model="model.confirmation"
                    :value="1"
                    label="I confirm that my organization/facilities pay the Joint Job Evaluation Plan (JJEP) wage rates or, if a lesser amount, a side agreement is being concluded to implement the ECE Wage Enhancement."
                    :disabled="isReadOnly">
                  </v-checkbox>
                </v-col>
              </v-row>
            </v-card>
            </v-radio-group>
            </div>
          </v-container>
        </v-card>
      </v-row>
      <v-row justify="space-around" class="mt-10">
        <v-btn color="info" :loading="isProcessing" outlined required x-large @click="previous()">Back</v-btn>
        <v-btn :disabled="!enableButtons" :loading="isProcessing" color="secondary" outlined x-large @click="next()">Next</v-btn>
        <v-btn :disabled="!enableButtons || isReadOnly" :loading="isProcessing" color="primary" outlined x-large @click="saveECEWEApplication()">Save</v-btn>
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
      isUnlocked: true,
      model: {},
      isLoading: false, // flag to UI if screen is getting data or not.
      isProcessing: false, // flag to UI if screen is saving/processing data or not.
    };
  },
  computed: {
    ...mapGetters('auth', ['userInfo']),
    ...mapState('eceweApp', ['isStarted','eceweModel', 'loadedFacilities', 'eceweEligibilityComplete', 'eceweFacilitiesComplete']),
    ...mapState('app', ['navBarList', 'fundingModelTypeList']),
    ...mapState('organization', ['applicationId']),
    ...mapState('application', ['programYearLabel', 'applicationStatus', 'unlockEcewe']),
    facilities: {
      get() { return this.$store.state.eceweApp.facilities; },
      set(value) { this.$store.commit('eceweApp/setFacilities', value); }
    },
    enableButtons() {
      return (this.model.belongsToUnion === 1 && this.model.fundingModel === this.fundingModelTypeList[2].id && this.model.confirmation === 1)
            ||(this.model.belongsToUnion === 1 && this.model.fundingModel != this.fundingModelTypeList[2].id)
            ||this.model.belongsToUnion === 0
            || this.model.optInECEWE === 0;
    },
    isReadOnly() {
      if (this.eceweUnlock) {
        return false;
      } else if (this.applicationStatus === 'SUBMITTED') {
        return true; 
      }
      return false;
    }
  },
  async mounted() {
    try {
      this.setFundingModelTypes({...this.fundingModelTypeList});
      this.setApplicationId(this.applicationId);
      await this.loadData();
      this.setIsStarted(true);
      this.model = {...this.eceweModel};
      this.setEceweEligibilityComplete(this.eceweEligibilityComplete);
      this.setEceweFacilitiesComplete(this.eceweFacilitiesComplete);
      let copyFacilities = JSON.parse(JSON.stringify(this.facilities));
      this.setLoadedFacilities(copyFacilities);
      this.initECEWEFacilities(this.navBarList);
    } catch(error) {
      console.log (error);
    }
  },
  async beforeRouteLeave(_to, _from, next) {
    this.setIsStarted(true);
    await this.saveECEWEApplication(false);
    next();
  },
  methods: {
    ...mapActions('eceweApp', ['loadECEWE', 'saveECEWE', 'initECEWEFacilities', 'saveECEWEFacilities']),
    ...mapMutations('app', ['setEceweEligibilityComplete', 'setEceweFacilitiesComplete']),
    ...mapMutations('eceweApp', ['setIsStarted', 'setEceweModel', 'setApplicationId', 'setFundingModelTypes', 'setLoadedFacilities']),
    previous() {
      this.$router.push(PATHS.ccfriHome);
    },
    async next() {
      if (this.model.optInECEWE == 0) {
        this.$router.push(PATHS.supportingDocumentUpload);
      } else {
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
    updateQuestions() {
      this.model.belongsToUnion = (this.model.optInECEWE==0)?null:this.model.belongsToUnion;
      this.model.fundingModel = (this.model.belongsToUnion==0 || this.model.belongsToUnion == null)?null:this.model.fundingModel;
      this.model.confirmation = (this.model.fundingModel == this.fundingModelTypeList[2].id)?1:null;
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
        this.setIsStarted(true);
      }
      this.isLoading = false;
    },
    optOutFacilities() {
      this.facilities = this.facilities.map(facility => {
        if (facility.eceweApplicationId != null && facility.optInOrOut != null) {
          facility.optInOrOut = 0;
        }
        return facility;
      });
    },
    async saveECEWEApplication(showConfirmation = true) {
      this.isProcessing = true;
      try {
        this.updateQuestions();
        this.setEceweModel(this.model);
        await this.saveECEWE();
        this.setEceweEligibilityComplete(this.eceweEligibilityComplete);
        const optOutFacilities = this.model.optInECEWE === 0 && this.facilities.some(facility => facility.eceweApplicationId != null && facility.optInOrOut === 1);
        // If funding model is option 1, opt out all facilities and save. OR If opting out of ecewe,
        // ensure there are no previously saved opted in facilties, if there are, update to opt out and save.
        if (this.model.fundingModel === this.fundingModelTypeList[0].id || optOutFacilities) {
          this.optOutFacilities();
          await this.saveECEWEFacilities(showConfirmation);
        }
        if (showConfirmation) {
          this.setSuccessAlert('Success! ECEWE application has been saved.');
        }
      } catch (error) {
        this.setFailureAlert('An error occurred while saving ECEWE application. Please try again later.');
      } finally {
        this.isProcessing = false;
      }
    }
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
