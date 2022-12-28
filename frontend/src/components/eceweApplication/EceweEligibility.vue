<template>
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
            <v-row justify="center">
              <br/>
              For the 2022/23 funding term, would you like to opt-in to ECE-WE for any facility in your organization?
            </v-row>
            <v-row justify="center">
              <v-radio-group
                v-model="optInECEWE"
                row>
              <v-col>
                <v-radio style="padding-right:80px"
                  label="Yes"
                  :value="1"
                  @click="enableButtons()"
              ></v-radio>
              </v-col>
              <v-col>
                <v-radio
                  label="No"
                  :value="0"
                  @click="enableButtons()"
                ></v-radio>
              </v-col>
              </v-radio-group>
            </v-row>
          </v-container>
        </v-card>
      </v-row>
      
      <v-row v-if="(optInECEWE == 1)" justify="center">
        <v-card elevation="4" class="py-2 px-5 mx-2 mt-10 rounded-lg col-11">
          <v-container>
            <v-row justify="center">
              <br/>
              Do any of the ECE Employees at any facility in your organization belong to a union?
            </v-row>
            <v-row justify="center">
              <v-radio-group
                v-model="belongsToUnion"
                row>
              <v-col>
                <v-radio style="padding-right:80px"
                  label="Yes"
                  :value="1"
                  @click="enableButtons()"
                ></v-radio>
              </v-col>
              <v-col>
                <v-radio
                  label="No"
                  :value="0"
                  @click="enableButtons()"                  
                ></v-radio>
              </v-col>
              </v-radio-group>
            </v-row>
          </v-container>
        </v-card>
      </v-row>

      <v-row v-if="(belongsToUnion == 1 && optInECEWE == 1)" justify="center">
        <v-card elevation="4" class="py-2 px-5 mx-2 mt-10 rounded-lg col-11">
          <v-container>
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
                  <v-card-title class="py-1 noticeAlert">
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
              <v-row justify="center" class="pa-4">
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
                  <v-card-title class="py-1 noticeWarning">
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
              <v-row justify="center" class="pa-4">
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
                  <v-card-title class="py-1 noticeInfo">
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
              <v-row justify="center">
                <v-col cols="1" class="pl-6">
                  <v-checkbox v-model="confirmation" :value="1" @click="enableButtons()">
                  </v-checkbox>
                </v-col>
                <v-col>
                I confirm that my organization/facilities pay the Joint Job Evaluation Plan (JJEP) wage rates or, if a lesser amount, a side agreement is being concluded to implement the ECE Wage Enhancement.
                </v-col>
              </v-row>
            </v-card>
          </v-radio-group>
          </v-container>
        </v-card>
      </v-row>

      <v-row justify="space-around" class="mt-10">
        <v-btn color="info" outlined required x-large @click="previous()">Back</v-btn>
        <v-btn :disabled="!this.enableNextBtn" color="secondary" outlined x-large @click="next()">Next</v-btn>
        <v-btn :disabled="!this.enableSaveBtn" color="primary" outlined x-large @click="save()">Save</v-btn>
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
      enableNextBtn: false,
      enableSaveBtn: false,
    };
  },
  computed: {
    ...mapGetters('auth', ['userInfo']),
    ...mapState('eceweApp', ['isStarted']),
    ...mapState('app', ['navBarList', 'fundingModelTypeList']),
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
  beforeMount() {
    this.loadData().then(() => this.initECEWEFacilities(this.navBarList)).then(() => {
      if (this.optInECEWE != null) {
        this.enableButtons();
      }
    });
  },
  methods: {
    ...mapActions('eceweApp', ['loadECEWE', 'saveECEWE', 'initECEWEFacilities']),
    ...mapMutations('eceweApp', ['setIsStarted']),
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
        this.setIsStarted(true);
      }
    },
    next() {
      if (this.optInECEWE == 0) {
        this.$router.push(PATHS.eceweDocUpload);
      } else {
        this.$router.push(PATHS.eceweFacilities);
      }
    },
    enableButtons() {
      if ((this.belongsToUnion == 1 && this.fundingModel == this.fundingModelTypeList[2].id && this.confirmation == 1) ||
         (this.belongsToUnion == 0) ||
         (this.optInECEWE == 0)) {
        this.enableNextBtn = true;
      } else {
        this.enableNextBtn = false;
      }
      this.enableSaveBtn = true;
    },
    async save() {
      try {
        this.belongsToUnion = (this.optInECEWE==0)?null:this.belongsToUnion;
        this.fundingModel = (this.belongsToUnion==0)?null:this.fundingModel;
        this.confirmation = (this.fundingModel!=this.fundingModelTypeList[2].id)?null:this.confirmation;
        await this.saveECEWE();
        this.setSuccessAlert('Success! ECEWE appcliation has been saved.');
      } catch (error) {
        this.setFailureAlert('An error occurred while saving ECEWE application. Please try again later.'+error);
      }
      this.processing = false;
    }
  }
};
</script>
<style>
.noticeAlertIcon {
  color:#D40D19 !important;
}
.noticeAlert {
  font-size:medium;
  color:#D40D19;
  font-family:'BCSans',Verdana,Arial,sans-serif;
  padding-top:8px;
  padding-bottom:8px;
  background-color:#F2DEDE;
  border:1px solid #D40D19;
}
.noticeInfoIcon {
  color:#313132 !important;
}
.noticeInfo {
  font-size:medium;
  color:#313132;
  font-family:'BCSans',Verdana,Arial,sans-serif;
  padding-top:8px;
  padding-bottom:8px;
  background-color:#C1DCF6;
  border:1px solid #313132;
}
</style>
