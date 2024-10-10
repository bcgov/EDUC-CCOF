<template>
  <v-form ref="form">
    <v-container>
      <div class="row pt-4 justify-center">
        <span class="text-h5"
          >Child Care Operating Funding Program - {{ formattedProgramYear }} Program Confirmation Form</span
        >
      </div>
      <br />
      <div class="row pt-4 justify-center">
        <span class="text-h5">Early Childhood Educator Wage Enhancement (ECE-WE)</span>
      </div>
      <br />
      <v-row justify="center" class="pt-4 text-h5" style="color: #003466">
        {{ userInfo.organizationName }}
      </v-row>
      <v-row><v-col /></v-row>
      <v-row justify="center"> Please select each facility you would like to opt-in to ECE-WE: </v-row>
      <v-row><v-col /></v-row>
      <v-row justify="center">
        <v-alert class="col-11" variant="outlined" prominent>
          <span style="float: left">
            <v-icon size="x-large" color="rgb(0 51 102)" class="py-1 px-3"> mdi-information </v-icon>
          </span>
          <span>
            Note: if any of your facilities are located in the Vancouver Coastal Health Authority, you must opt-in to
            ECE-WE for each licence located at the same physical address.
          </span>
        </v-alert>
      </v-row>
      <br />
      <v-btn class="mx-0 justify-end" dark color="#003366" :disabled="isReadOnly" @click="toggleAll()">
        Opt in All Facilities
      </v-btn>
      <div v-if="!isLoading">
        <div v-for="(_facility, index) in uiFacilities" :key="index">
          <v-row justify="center" class="pa-4">
            <v-card elevation="4" class="py-2 px-5 mx-2 rounded-lg col-9" width="75%">
              <v-row>
                <v-col cols="12" class="d-flex">
                  <span
                    ><strong> Facility ID: {{ navBarList[index].facilityAccountNumber }}</strong></span
                  >
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="5" class="flex-column">
                  <span
                    ><strong> Facility Name: {{ navBarList[index].facilityName }}</strong></span
                  >
                </v-col>
                <v-col v-if="!uiFacilities[index].update" cols="4" class="flex-column text-center">
                  <strong> Status: Opt-{{ uiFacilities[index].optInOrOut == 1 ? 'In' : 'Out' }} </strong>
                </v-col>
                <v-col v-else-if="uiFacilities[index].update" cols="3" class="d-flex justify-center align-center pt-0">
                  <v-radio-group
                    v-model="uiFacilities[index].optInOrOut"
                    class="pt-0 my-0"
                    inline
                    :disabled="isReadOnly"
                    :rules="rules.required"
                  >
                    <v-radio label="Opt-In" :value="1" @click="toggleRadio(index)" />
                    <v-radio label="Opt-Out" :value="0" @click="toggleRadio(index)" />
                  </v-radio-group>
                </v-col>
                <v-col cols="3">
                  <v-btn
                    v-if="
                      !uiFacilities?.[index].update && !isLoading && model.fundingModel != fundingModelTypeList[0].id
                    "
                    color="#003366"
                    dark
                    :disabled="isReadOnly"
                    @click="uiFacilities[index].update = uiFacilities[index].update == false ? true : false"
                  >
                    Update
                  </v-btn>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <strong>Licence Number: {{ navBarList[index].licenseNumber }}</strong>
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
                  <v-skeleton-loader :loading="true" type="table-cell" class="pa-0" />
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="5" class="flex-column pa-0">
                  <v-skeleton-loader :loading="true" type="table-cell" />
                </v-col>
                <v-col cols="4" class="d-flex justify-center align-center pt-0">
                  <v-skeleton-loader :loading="true" type="table-cell" />
                  <v-skeleton-loader :loading="true" type="table-cell" />
                </v-col>
                <v-col cols="3" class="pa-0">
                  <v-skeleton-loader :loading="true" type="button" />
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" class="pa-0">
                  <v-skeleton-loader :loading="true" type="table-cell" />
                </v-col>
              </v-row>
            </v-card>
          </v-row>
        </div>
      </div>
      <v-row><v-col /></v-row>
      <NavButton
        :is-next-displayed="true"
        :is-save-displayed="true"
        :is-save-disabled="isSaveBtnDisabled || isReadOnly"
        :is-next-disabled="isNextBtnDisabled"
        :is-processing="isProcessing"
        @previous="previous"
        @next="next"
        @validate-form="validateForm()"
        @save="saveFacilities(true)"
      />
    </v-container>
  </v-form>
</template>

<script>
import { mapState, mapActions } from 'pinia';
import { useAuthStore } from '../../store/auth.js';
import { useEceweAppStore } from '../../store/eceweApp.js';
import { useAppStore } from '../../store/app.js';
import { useApplicationStore } from '../../store/application.js';
import { useReportChangesStore } from '../../store/reportChanges.js';
import { useNavBarStore } from '../../store/navBar.js';

import { PATHS, changeUrl, pcfUrl } from '../../utils/constants.js';
import alertMixin from '../../mixins/alertMixin.js';
import NavButton from '../../components/util/NavButton.vue';
import rules from '../../utils/rules.js';

export default {
  components: { NavButton },
  mixins: [alertMixin],
  async beforeRouteLeave(_to, _from, next) {
    await this.saveFacilities(false);
    next();
  },
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
    ...mapState(useAuthStore, ['userInfo']),
    ...mapState(useEceweAppStore, ['isStarted', 'eceweModel']),
    ...mapState(useAppStore, ['fundingModelTypeList']),
    ...mapState(useNavBarStore, [
      'navBarList',
      'userProfileList',
      'changeRequestId',
      'previousPath',
      'isChangeRequest',
      'getChangeActionNewFacByFacilityId',
    ]),
    ...mapState(useApplicationStore, [
      'formattedProgramYear',
      'programYearId',
      'applicationStatus',
      'unlockEcewe',
      'applicationId',
    ]),
    ...mapState(useReportChangesStore, ['isEceweUnlocked', 'changeRequestStatus']),
    isNextBtnDisabled() {
      return this.uiFacilities.some((item) => item.optInOrOut === null);
    },
    isSaveBtnDisabled() {
      return this.model.fundingModel === this.fundingModelTypeList[0].id;
    },
    facilities() {
      return {
        get() {
          return useEceweAppStore().facilities;
        },
        set(value) {
          useEceweAppStore().setFacilities(value);
        },
      };
    },
    isReadOnly() {
      //will only return true if set by a ministry user in dynamics
      if (this.isChangeRequest) {
        if (this.isEceweUnlocked || !this.changeRequestStatus) {
          return false;
        } else if (this.changeRequestStatus !== 'INCOMPLETE') {
          return true;
        }
        return false;
      }
      if (this.unlockEcewe) {
        return false;
      }
      return this.applicationStatus === 'SUBMITTED';
    },
  },
  async mounted() {
    this.setFundingModelTypes({ ...this.fundingModelTypeList });
    this.setApplicationId(this.applicationId);
    let response = await this.loadData();
    if (response) {
      this.initECEWEFacilities(this.navBarList);
      this.setupUiFacilities();
      this.model = { ...this.eceweModel };
    }
  },
  methods: {
    ...mapActions(useEceweAppStore, [
      'loadECEWE',
      'saveECEWEFacilities',
      'initECEWEFacilities',
      'setEceweModel',
      'setLoadedFacilities',
      'setFacilities',
      'setApplicationId',
      'setFundingModelTypes',
    ]),
    ...mapActions(useNavBarStore, ['refreshNavBarList']),
    setupUiFacilities() {
      let copyFacilities = JSON.parse(JSON.stringify(this.facilities));
      copyFacilities.forEach((element) => (element.update = element.optInOrOut == null));
      this.uiFacilities = copyFacilities;
      this.setLoadedFacilities([...this.facilities]);
      this.setFacilities([...this.facilities]);
    },
    toggleRadio(index) {
      this.uiFacilities[index].update = this.uiFacilities[index].update == true ? false : true;
    },
    toggleAll() {
      this.uiFacilities.forEach((_fac, index) => {
        this.toggleRadio(index);
        this.uiFacilities[index].optInOrOut = 1;
      });
    },
    previous() {
      if (this.isChangeRequest) {
        this.$router.push(changeUrl(PATHS.ECEWE_ELIGIBILITY, this.$route.params.changeRecGuid));
      } else {
        this.$router.push(pcfUrl(PATHS.ECEWE_ELIGIBILITY, this.programYearId));
      }
    },
    next() {
      if (this.isChangeRequest) {
        this.$router.push(changeUrl(PATHS.SUPPORTING_DOCS, this.$route.params.changeRecGuid));
      } else {
        this.$router.push(pcfUrl(PATHS.SUPPORTING_DOCS, this.programYearId));
      }
    },
    validateForm() {
      this.$refs.form?.validate();
    },
    async loadData() {
      if (
        this.isStarted &&
        this.facilities?.length > 0 &&
        this.facilities[0].changeRequestId == this.$route.params.changeRecGuid
      ) {
        return true;
      }
      if (this.applicationId) {
        this.isLoading = true;
        try {
          let response = await this.loadECEWE();
          this.isLoading = false;
          return response;
        } catch (error) {
          console.log('Error loading ECEWE application.', error);
          this.setFailureAlert('Error loading ECEWE application.');
        }
      }
    },
    async saveFacilities(showConfirmation) {
      if (this.isReadOnly) {
        return;
      }
      this.isProcessing = true;
      try {
        let uiFacilitiesCopy = JSON.parse(JSON.stringify(this.uiFacilities));
        // eslint-disable-next-line no-unused-vars
        uiFacilitiesCopy = uiFacilitiesCopy.map(({ update, ...item }) => item);
        this.setFacilities(uiFacilitiesCopy);
        let response = await this.saveECEWEFacilities();
        if (response?.data?.facilities) {
          response.data.facilities?.forEach((el) => {
            console.log('this is el');
            console.log(el);
            let facility = this.userProfileList.find((f) => f.facilityId === el.facilityId);
            if (facility) {
              facility.eceweOptInStatus = el.optInOrOut;
            }

            //update the CR map with the data so navbar will work properly for CR new fac
            if (this.isChangeRequest) {
              let newFac = this.getChangeActionNewFacByFacilityId(el.facilityId);

              newFac.ecewe = {
                eceweOptInStatus: el.optInOrOut,
                eceweApplicationId: el.eceweApplicationId,
                eceweFacilityId: el.facilityId,
              };
              console.log('newfac', newFac);
            }
          });
          this.refreshNavBarList();
        }
        this.setupUiFacilities();
        if (showConfirmation || showConfirmation == null) {
          this.setSuccessAlert('Success! ECEWE Facility applications have been saved.');
        }
      } catch (error) {
        this.setFailureAlert(
          'An error occurred while saving ECEWE facility applications. Please try again later.' + error,
        );
      }
      this.isProcessing = false;
    },
  },
};
</script>
