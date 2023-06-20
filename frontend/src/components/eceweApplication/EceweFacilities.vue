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
        prominent>
        <span style="float:left">
          <v-icon
            x-large
            color="rgb(0 51 102)"
            class="py-1 px-3">
             mdi-information
          </v-icon>
        </span>
        <span>
          Note: if any of your facilities are located in the Vancouver Coastal Health Authority, you must opt-in to ECE-WE for each licence located at the same physical address.
        </span>
      </v-alert>
    </v-row>
    <br>
    <v-btn
        class = "mx-0 justify-end"
        @click="toggleAll()"
        dark color='#003366'
        :disabled="isReadOnly"
        >
        Opt in All Facilities
      </v-btn>
    <div v-if="!isLoading">
      <div v-for="(facility, index) in this.uiFacilities" :key="(index)">
        <v-row justify="center" class="pa-4">
          <v-card elevation="4" class="py-2 px-5 mx-2 rounded-lg col-9" width="75%">
            <v-row>
              <v-col cols="12" class="d-flex">
                <span>{{uiFacilities[index].facilityAccountNumber}}</span>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="5" class="flex-column">
                <span>{{uiFacilities[index].facilityName}}</span>
              </v-col>
              <v-col v-if="!uiFacilities[index].update" cols="4" class="flex-column text-center">
                  Status: Opt {{uiFacilities[index].optInOrOut == 1?'in':'out'}}
              </v-col>
              <v-col v-else-if="uiFacilities[index].update" cols="3" class="d-flex justify-center align-center pt-0">
                <v-radio-group
                  v-model="uiFacilities[index].optInOrOut"
                  class="pt-0 my-0"
                  row
                  :disabled="isReadOnly"
                  :rules="rules.required">
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
              <v-col cols="3">
                <v-btn
                  v-if="(!uiFacilities?.[index].update && !isLoading) && (model.fundingModel != fundingModelTypeList[0].id)"
                  @click="uiFacilities[index].update=(uiFacilities[index].update==false)?true:false;"
                  color="#003366"
                  dark
                  :disabled="isReadOnly">
                    Update
                </v-btn>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                  License #: {{navBarList[index].licenseNumber}}
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
    <NavButton :isNextDisplayed="true" :isSaveDisplayed="true"
      :isSaveDisabled="isSaveBtnDisabled || isReadOnly" :isNextDisabled="isNextBtnDisabled" :isProcessing="isProcessing"
      @previous="previous" @next="next" @validateForm="validateForm()" @save="saveFacilities(true)"></NavButton>
  </v-container>
  </v-form>
</template>

<script>

import { PATHS } from '@/utils/constants';
import { mapGetters, mapState, mapActions, mapMutations } from 'vuex';
import alertMixin from '@/mixins/alertMixin';
import NavButton from '@/components/util/NavButton';
import rules from '@/utils/rules';
import { isChangeRequest } from '@/utils/common';

export default {
  components: { NavButton },
  mixins: [alertMixin],
  data() {
    return {
      rules,
      uiFacilities: [],
      model: {},
      isLoading: false, // flag to UI if screen is getting data or not.
      isProcessing: false, // flag to UI if screen is saving/processing data or not.
    };
  },
  computed: {
    ...mapGetters('auth', ['userInfo']),
    ...mapState('eceweApp', ['isStarted', 'eceweModel']),
    ...mapState('app', ['navBarList', 'fundingModelTypeList']),
    ...mapState('application', ['formattedProgramYear', 'applicationStatus', 'unlockEcewe', 'applicationId']),
    ...mapState('reportChanges', ['changeRequestId', 'newFacilityList']),
    isNextBtnDisabled() {
      return this.uiFacilities.some(item => item.optInOrOut === null);
    },
    isSaveBtnDisabled() {
      return this.model.fundingModel === this.fundingModelTypeList[0].id;
    },
    facilities: {
      get() {
        if (isChangeRequest(this)) {
          let selectedFacility = [];
          this.newFacilityList.forEach(f => {
            if (f.changeRequestId === this.changeRequestId) {
              selectedFacility.push(f.facilityId);
            }
          });
          console.log('-----------> THIS IS selectedFacility ');
          console.log(selectedFacility);
          console.log('FACILITIES = ');
          console.log(this.navBarList.filter(f => selectedFacility.includes(f.facilityId)));
          // let foundhere = this.navBarList.filter((fac) => {
          //   console.log(fac.changeRequestId);
          //   console.log(fac.changeRequestId == this.changeRequestId);
          // });
          // this.$store.state.eceweApp.facilities.filter((fac) => {
          //   console.log(fac);
          //   console.log(fac.changeRequestId == this.changeRequestId);
          // });
          // return this.navBarList.find(f => f.changeRequestId === this.changeRequestId);
          return this.navBarList.filter(f => selectedFacility.includes(f.facilityId));
        }
        return this.$store.state.eceweApp.facilities;
      },
      set(value) { this.$store.commit('eceweApp/setFacilities', value); }
    },
    isReadOnly() {
      //will only return true if set by a ministry user in dynamics
      if (this.unlockEcewe){
        return false;
      }
      return (this.applicationStatus === 'SUBMITTED');
    }
  },
  async beforeMount() {
    this.setFundingModelTypes({...this.fundingModelTypeList});
    this.setApplicationId(this.applicationId);
    await this.loadData();
    this.initECEWEFacilities(this.navBarList);
    this.setupUiFacilities();
    this.model = {...this.eceweModel};
  },
  async beforeRouteLeave(_to, _from, next) {
    await this.saveFacilities(false);
    next();
  },
  methods: {
    ...mapActions('eceweApp', ['loadECEWE', 'saveECEWEFacilities', 'initECEWEFacilities']),
    ...mapMutations('app', ['setEceweFacilityComplete']),
    ...mapMutations('eceweApp', ['setEceweModel', 'setLoadedFacilities', 'setFacilities', 'setApplicationId', 'setFundingModelTypes']),
    setupUiFacilities() {
      let copyFacilities = JSON.parse(JSON.stringify(this.facilities));
      copyFacilities.forEach(element => element.update = element.optInOrOut == null);
      this.uiFacilities = copyFacilities;
      console.log(this.uiFacilities);
      this.setLoadedFacilities([...this.facilities]);
    },
    toggleRadio(index) {
      this.uiFacilities[index].update = (this.uiFacilities[index].update==true)?false:true;
    },
    toggleAll(){
      this.uiFacilities.forEach((fac, index) => {
        this.toggleRadio(index);
        this.uiFacilities[index].optInOrOut = 1 ;
      });
    },
    previous() {
      return this.$router.push(PATHS.eceweEligibility);
    },
    next() {
      this.$router.push(PATHS.supportingDocumentUpload);
    },
    validateForm() {
      this.$refs.form?.validate();
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
        console.log('uiFacilitiesCopy 1 ', uiFacilitiesCopy);
        // eslint-disable-next-line no-unused-vars
        uiFacilitiesCopy = uiFacilitiesCopy.map(({ update, ...item }) => item);
        console.log('uiFacilitiesCopy 2 ', uiFacilitiesCopy);
        this.setFacilities(uiFacilitiesCopy);
        let response = await this.saveECEWEFacilities();
        if (response?.data?.facilities) {
          response.data.facilities?.forEach(el => {
            let facility = this.navBarList.find(f => f.facilityId === el.facilityId);
            if (facility) {
              facility.eceweOptInStatus = el.optInOrOut;
            }
          });
        }
        this.setupUiFacilities();
        if (showConfirmation || showConfirmation == null) {
          this.setSuccessAlert('Success! ECEWE Facility applications have been saved.');
        }
      } catch (error) {
        this.setFailureAlert('An error occurred while saving ECEWE facility applications. Please try again later.'+error);
      }
      this.isProcessing = false;
    },
  }
};
</script>
