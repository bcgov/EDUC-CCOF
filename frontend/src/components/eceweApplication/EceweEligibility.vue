<template>
  <v-form ref="form">

    <v-container>
      <div class="row pt-4 justify-center">
        <span class="text-h5">Child Care Operating Funding Program - {{ formattedProgramYear }} Program Confirmation Form</span>
      </div>
      <br>
      <div class="row pt-4 justify-center">
        <span class="text-h5">Early Childhood Educator Wage Enhancement (ECE-WE)</span>
      </div>
      <br>
      <v-row class="pt-4 text-h5 justify-center" style="color:#003466;">
        {{this.userInfo.organizationName}}
      </v-row>
      <v-row class="mt-6 justify-center">
        <v-alert
          class="col-11 mb-0"
          outlined
          prominent>
          <span class="pr-1" style="float:left">
            <v-icon
              x-large
              color="rgb(0 51 102)"
              class="py-1 px-3">
              mdi-information
            </v-icon>
          </span>
          <span>
            <strong>Note:</strong> Please read and understand the full eligibility requirements in the <u>ECE-WE Funding Guildelines</u>.  All CCFRI-eligible facilities must opt-in to CCFRI <u>to be eligible for ECE-WE.</u>
          </span>
        </v-alert>
      </v-row>
      <v-row class="justify-center">
        <v-card elevation="4" class="py-2 px-5 mx-2 mt-10 rounded-lg col-11">
          <v-container>
            <v-row v-if="isLoading">
              <v-col>
                <v-skeleton-loader v-if="isLoading" :loading="isLoading" type="text@1"></v-skeleton-loader>
                <v-skeleton-loader v-if="isLoading" :loading="isLoading" type="actions"></v-skeleton-loader>
              </v-col>
            </v-row>
            <v-row v-if="!isLoading" class="justify-center">
              <v-col align-self="start">
              <v-radio-group
                v-model="model.optInECEWE"
                :disabled="isReadOnly('optInECEWE')"
                :rules="rules.required">
                <template v-slot:label>
                  <span class="radio-label" style="text-align: left;">For the {{formattedProgramYear}} funding term, would you like to opt-in to ECE-WE for any facility in your organization?</span>
                </template>
                <div class="flex-left pt-2">
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
            </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-row>

      <v-row v-if="(this.model.optInECEWE == 1) || isLoading" class="justify-center">
        <v-card elevation="4" class="py-2 px-5 mx-2 mt-10 rounded-lg col-11">
          <v-container>
            <v-row v-if="isLoading">
              <v-col>
                <v-skeleton-loader v-if="isLoading" :loading="isLoading" type="text@1"></v-skeleton-loader>
                <v-skeleton-loader v-if="isLoading" :loading="isLoading" type="actions"></v-skeleton-loader>
              </v-col>
            </v-row>
            <v-row v-if="!isLoading" class="justify-center">
              <v-col align-self="start">
                <v-radio-group
                  v-model="model.belongsToUnion"
                  :disabled="isReadOnly('belongsToUnion')"
                  :rules="rules.required">
                  <template v-slot:label>
                    <span class="radio-label">Do any of the ECE Employees at any facility in your organization belong to a union?</span>
                  </template>
                  <div class="flex-left">
                  <v-radio class="pt-2 pr-8"
                    label="Yes"
                    :value="1"
                ></v-radio>
                <v-radio
                    class="pt-1"
                    label="No"
                    :value="0"
                    @click="model.applicableSector=null"
                  ></v-radio>
                  </div>
                </v-radio-group>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-row>
      <v-row v-if="(model.belongsToUnion == 1 && model.optInECEWE == 1) || isLoading" class="justify-center">
        <v-card elevation="4" class="py-2 px-5 mx-2 mt-10 rounded-lg col-11">
          <v-container>
            <v-row v-if="isLoading">
              <v-col>
                <v-skeleton-loader v-if="isLoading" :loading="isLoading" type="text@1"></v-skeleton-loader>
                <v-skeleton-loader v-if="isLoading" :loading="isLoading" type="actions"></v-skeleton-loader>
              </v-col>
            </v-row>
            <v-row v-if="!isLoading" class="justify-left">
              <v-col align-self="start">
                <v-radio-group
                  v-model="model.applicableSector"
                  :disabled="isReadOnly()"
                  :rules="rules.required">
                  <template v-slot:label>
                    <div class="radio-label text-left">Select the sector:</div>
                  </template>
                  <div class="flex-left">
                  <v-radio class="pt-2 pr-8"
                    label="Community Social Services Employers' Association (CSSEA) Member"
                    :value="100000000"
                    @click="model.confirmation=null"
                ></v-radio>
                <v-radio
                    class="pt-1"
                    label="Other Unionized Employer"
                    :value="100000001"
                    @click="model.confirmation=null"
                  ></v-radio>
                </div>
                </v-radio-group>
              </v-col>
            </v-row>
          </v-container>
          <v-card v-if="(model.applicableSector == 100000001 && model.belongsToUnion == 1 && model.optInECEWE == 1) || isLoading" class="mx-2 mb-4 justify-center">
            <v-row v-if="!isLoading" >
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
            <v-row v-if="!isLoading" >
              <v-col class="pl-6 d-flex py-0">
                <v-checkbox
                  class="pa-0"
                  v-model="model.confirmation"
                  :value="1"
                  label="I confirm our organization/facilities has reached an agreement with the union to amend the collective agreement(s) in order to implement the ECE Wage Enhancement."
                  :disabled="isReadOnly()"
                  :rules="rules.required">
                </v-checkbox>
              </v-col>
            </v-row>
          </v-card>
        </v-card>
      </v-row>

      <v-row v-if="(model.applicableSector == 100000000 && model.belongsToUnion == 1 && model.optInECEWE == 1) || isLoading" class="justify-center">
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
            <v-row v-if="!isLoading">
              <v-col align-self="start">
                <v-radio-group
                  v-model="model.fundingModel"
                  :disabled="isReadOnly()"
                  :rules="rules.required">
                  <template v-slot:label>
                    <div class="radio-label text-left">Select your funding model:</div>
                  </template>
                  <div class="flex-left">
                    <v-radio
                      :label="fundingModelTypeList[0].description"
                      :value="fundingModelTypeList[0].id"
                      class="pt-2 pr-8">
                    </v-radio>
                    <v-radio
                      :label="fundingModelTypeList[1].description"
                      :value="fundingModelTypeList[1].id"
                      class="pt-1 pr-8"
                    ></v-radio>
                    <v-radio
                      :label="fundingModelTypeList[2].description"
                      :value="fundingModelTypeList[2].id"
                      class="pt-1 pr-8"
                    ></v-radio>
                  </div>
                </v-radio-group>
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
              <v-row class="pa-2 justify-center">
                Government’s Low-Wage Redress Funding supports ECE wage adjustments
              </v-row>
            </v-card>
            <div v-else-if="model.fundingModel == fundingModelTypeList[1].id">
              <v-card width="100%" class="mb-4">
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
                <v-row class="pa-2 justify-center">
                  Only ECEs in non-provincially funded programs are eligible for ECE Wage Enhancement.
                </v-row>
              </v-card>
            </div>
            <v-card v-if="model.fundingModel === fundingModelTypeList[1].id || model.fundingModel === fundingModelTypeList[2].id" width="100%">
              <v-row v-if="!isLoading" >
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
              <v-row v-if="!isLoading" >
                <v-col class="pl-6 d-flex py-0">
                  <v-checkbox
                    class="pa-0"
                    v-model="model.confirmation"
                    :value="1"
                    label="I confirm that my organization/facilities pay the Joint Job Evaluation Plan (JJEP) wage rates or, if a lesser amount, a side agreement is being concluded to implement the ECE Wage Enhancement."
                    :disabled="isReadOnly()"
                    :rules="rules.required">
                  </v-checkbox>
                </v-col>
              </v-row>
            </v-card>
          </v-container>
        </v-card>
      </v-row>
      <NavButton class="mt-10" :isNextDisplayed="true" :isSaveDisplayed="true"
        :isSaveDisabled="isReadOnly()" :isNextDisabled="!enableButtons" :isProcessing="isProcessing"
        @previous="previous" @next="next" @validateForm="validateForm()" @save="saveECEWEApplication"></NavButton>
    </v-container>
  </v-form>
</template>

<script>

import { PATHS, changeUrl, pcfUrl } from '@/utils/constants';
import { mapGetters, mapState, mapActions, mapMutations } from 'vuex';
import alertMixin from '@/mixins/alertMixin';
import NavButton from '@/components/util/NavButton';
import rules from '@/utils/rules';
import { isNullOrBlank } from '@/utils/common';

export default {
  components: { NavButton },
  mixins: [alertMixin],
  data() {
    return {
      rules,
      model: {},
      isLoading: false, // flag to UI if screen is getting data or not.
      isProcessing: false, // flag to UI if screen is saving/processing data or not.
    };
  },
  computed: {
    ...mapGetters('auth', ['userInfo']),
    ...mapState('eceweApp', ['isStarted','eceweModel', 'loadedFacilities','optinECEWEChangeRequestReadonly', 'belongsToUnionChangeRequestReadonly']),
    ...mapState('app', ['fundingModelTypeList']),
    ...mapState('navBar', ['navBarList', 'changeRequestId']),
    ...mapState('application', ['formattedProgramYear', 'programYearId', 'applicationStatus', 'unlockEcewe', 'applicationId']),
    ...mapGetters('navBar', ['previousPath', 'isChangeRequest']),
    ...mapState('reportChanges', ['loadedChangeRequest']),
    ...mapGetters('reportChanges',['isEceweUnlocked','changeRequestStatus']),
    filteredNavBarList() {
      if (this.isChangeRequest) {
        return this.navBarList.filter(el => el.changeRequestId === this.$route.params.changeRecGuid);
      } else {
        return this.navBarList.filter(el => !el.changeRequestId);
      }
    },
    filteredECEWEFacilityList() {
      if (this.isChangeRequest) {
        return this.$store.state.eceweApp.facilities?.filter(el => el.changeRequestId === this.$route.params.changeRecGuid);
      } else {
        return this.$store.state.eceweApp.facilities?.filter(el => !el.changeRequestId);
      }
    },
    facilities: {
      get() { return this.filteredECEWEFacilityList; },
      set(value) { this.$store.commit('eceweApp/setFacilities', value); }
    },
    enableButtons() {
      return (this.model.belongsToUnion === 1 && this.model.applicableSector == 100000000 && (this.model.fundingModel === this.fundingModelTypeList[1].id || this.model.fundingModel === this.fundingModelTypeList[2].id) && this.model.confirmation === 1)
            ||(this.model.belongsToUnion === 1 && this.model.applicableSector == 100000000 && this.model.fundingModel === this.fundingModelTypeList[0].id)
            ||(this.model.belongsToUnion === 1 && this.model.applicableSector == 100000001 && this.model.confirmation === 1)
            ||this.model.belongsToUnion === 0
            ||this.model.optInECEWE === 0;
    },
  },
  async mounted() {
    try {
      this.isLoading = true;
      this.setFundingModelTypes({...this.fundingModelTypeList});
      this.setApplicationId(this.applicationId);
      let response = await this.loadData();
      if (response) {
        this.setIsStarted(true);
        this.initECEWEFacilities(this.filteredNavBarList);
        let copyFacilities = JSON.parse(JSON.stringify(this.facilities));
        this.setLoadedFacilities(copyFacilities);
        this.model = {...this.eceweModel};
        this.isLoading = false;
      }
    } catch(error) {
      console.log (error);
      this.isLoading = false;
    }
  },
  async beforeRouteLeave(_to, _from, next) {
    this.setIsStarted(true);
    await this.saveECEWEApplication(false);
    next();
  },
  methods: {
    ...mapActions('eceweApp', ['loadECEWE', 'saveECEWE', 'initECEWEFacilities', 'saveECEWEFacilities', 'loadECEWEModelFromChangeRequest']),
    ...mapMutations('eceweApp', ['setIsStarted', 'setEceweModel', 'setApplicationId', 'setFundingModelTypes', 'setLoadedFacilities']),
    ...mapMutations('application', ['setIsEceweComplete']),
    ...mapMutations('reportChanges', ['setCRIsEceweComplete']),
    ...mapActions('reportChanges', ['getChangeRequest']),
    ...mapMutations('navBar', ['forceNavBarRefresh']),
    isReadOnly(question) {
      if (this.isChangeRequest) {
        if (this.isEceweUnlocked || !this.changeRequestStatus)
          return (((question == 'optInECEWE') && this.optinECEWEChangeRequestReadonly)
            || ((question == 'belongsToUnion') && this.belongsToUnionChangeRequestReadonly));
        else if(this.changeRequestStatus!=='INCOMPLETE'){
          return true;
        }
        return (((question == 'optInECEWE') && this.optinECEWEChangeRequestReadonly)
          || ((question == 'belongsToUnion') && this.belongsToUnionChangeRequestReadonly));
      }
      if (this.unlockEcewe) {
        return false;
      } else if (this.applicationStatus === 'SUBMITTED') {
        return true;
      }
      return false;
    },
    previous() {
      this.$router.push(this.previousPath);
    },
    async next() {
      if (this.isChangeRequest) {
        if (this.model.optInECEWE == 0) {
          this.$router.push(changeUrl(PATHS.SUPPORTING_DOCS, this.$route.params.changeRecGuid));
        } else {
          this.$router.push(changeUrl(PATHS.ECEWE_FACILITITES, this.$route.params.changeRecGuid));
        }
      } else {
        if (this.model.optInECEWE == 0) {
          this.$router.push(pcfUrl(PATHS.SUPPORTING_DOCS, this.programYearId));
        } else {
          this.$router.push(pcfUrl(PATHS.ECEWE_FACILITITES, this.programYearId));
        }
      }
    },
    validateForm() {
      this.$refs.form?.validate();
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
    /* Questions values have a hierarchy, recalculate values incase values have changed. */
    updateQuestions() {
      if (this.model.optInECEWE === 0) {
        this.model.belongsToUnion = null;
        this.model.fundingModel = null;
        this.model.confirmation = null;
      } else {
        if (this.model.belongsToUnion === 0 || this.model.belongsToUnion === null) {
          this.model.fundingModel = null;
          this.model.confirmation = null;
        } else {
          if (this.model.applicableSector == 100000001) {
            this.model.fundingModel = null;
          } else if (this.model.applicableSector == 100000000 && this.model.fundingModel === this.fundingModelTypeList[0].id) {
            this.model.confirmation = null;
          }
        }
      }
    },
    async loadData() {
      if (this.isStarted && (this.facilities?.length > 0)  && (this.facilities[0].changeRequestId == this.$route.params.changeRecGuid)) {
        return true;
      }
      if (this.applicationId) {
        try {
          let response = await this.loadECEWE();
          if (this.isChangeRequest) {
            await this.getChangeRequest(this.$route.params.changeRecGuid);
            if (this.loadedChangeRequest && !isNullOrBlank(this.loadedChangeRequest.optInECEWE)) {
              await this.loadECEWEModelFromChangeRequest(this.loadedChangeRequest);
            }
          }
          return response;
        } catch (error) {
          console.log('Error loading ECEWE application.', error);
          this.setFailureAlert('Error loading ECEWE application.');
        }
        this.setIsStarted(true);
      }
    },
    optOutFacilities() {
      //this was modified by JB to try and fix bugs with the checkmarks.
      //instead of running map - I update the facility and nav bar with the opt out status.

      // this.facilities = this.facilities.map(facility => {
      //   if (facility.optInOrOut != 0) {
      //     facility.optInOrOut = 0;
      //   }
      //   return facility;
      // });
      this.filteredNavBarList.forEach(facility => {
        facility.eceweOptInStatus = 0;
      });
      this.facilities.forEach(facility => {
        facility.optInOrOut = 0;
      });
    },
    async saveECEWEApplication(showConfirmation = true) {
      this.isProcessing = true;
      try {
        this.updateQuestions();
        this.setEceweModel(this.model);
        if (this.isChangeRequest && isNullOrBlank(this.loadedChangeRequest?.optInECEWE)) {
          this.setIsStarted(false);
        }
        if (this.isChangeRequest) {
          await this.saveECEWE({
            isFormComplete: this.enableButtons,
            isChangeRequest: true,
            changeRequestId: this.$route.params.changeRecGuid
          });
        } else {
          await this.saveECEWE({
            isFormComplete: this.enableButtons,
            isChangeRequest: false,
            changeRequestId: null
          });
        }
        if (this.isChangeRequest) {
          this.setCRIsEceweComplete({changeRequestId: this.changeRequestId, isComplete: this.enableButtons});
        } else {
          this.setIsEceweComplete(this.enableButtons);
        }
        this.forceNavBarRefresh();

        const optOutFacilities = this.model.optInECEWE === 0 && this.facilities.some(facility => facility.eceweApplicationId != null && facility.optInOrOut === 1);

        //jb below
        if (this.model.optInECEWE === 0){
          this.optOutFacilities();
        }

        // If funding model is option 1, opt out all facilities and save. OR If opting out of ecewe,
        // ensure there are no previously saved opted in facilties, if there are, update to opt out and save.
        if (this.model.fundingModel === this.fundingModelTypeList[0].id || optOutFacilities) {
          this.optOutFacilities();
        }

        //save the facilites reagrdless so ECE WE application is always created
        await this.saveECEWEFacilities();
        if (showConfirmation) {
          this.setSuccessAlert('Success! ECEWE application has been saved.');
        }
      } catch (error) {
        this.setFailureAlert('An error occurred while saving ECEWE application. Please try again later.');
      } finally {
        this.isProcessing = false;
      }
    }
  },
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
