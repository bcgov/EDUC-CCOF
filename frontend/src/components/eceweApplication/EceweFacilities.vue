<template>
  <v-form ref="form">
    <v-container>
      <div align="center">
        <div class="text-h5">
          Child Care Operating Funding Program - {{ formattedProgramYear }} Program Confirmation Form
        </div>
        <div class="text-h5 my-6">Early Childhood Educator Wage Enhancement (ECE-WE)</div>
        <div class="text-h5 my-6" style="color: #003466">
          {{ userInfo.organizationName }}
        </div>
      </div>
      <div v-if="organizationProviderType === ORGANIZATION_PROVIDER_TYPES.GROUP">
        <v-row v-if="showUnionQuestion" justify="center" class="pb-6"
          >Please select each facility you would like to opt-in to ECE-WE and indicate if they are unionized.</v-row
        >
        <v-row v-else justify="center" class="pb-6"
          >Please select each facility you would like to opt-in to ECE-WE:</v-row
        >

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
      </div>
      <v-row v-else-if="isFamilyFacilityOptIn" justify="center">
        <v-alert class="col-11" variant="outlined" prominent>
          <span style="float: left">
            <v-icon size="x-large" color="rgb(0 51 102)" class="py-1 px-3"> mdi-information </v-icon>
          </span>
          <span>
            On the previous page, you indicated that you would like to opt-in to ECE-WE for any facility in your
            organization. As your organization has only one facility, the opt-in status has automatically been selected
            for that facility. Click the next button to confirm that you would like to opt-in this facility.
          </span>
        </v-alert>
      </v-row>
      <br />
      <v-skeleton-loader :loading="isLoading" type="table-tbody" class="my-2">
        <v-container fluid class="pa-0">
          <v-btn
            v-if="organizationProviderType === ORGANIZATION_PROVIDER_TYPES.GROUP"
            class="mx-0 justify-end"
            dark
            color="#003366"
            :disabled="isReadOnly"
            @click="toggleAll()"
          >
            Opt-In All Facilities
          </v-btn>
          <div>
            <div v-for="(facility, index) in uiFacilities" :key="index">
              <v-row justify="center" class="pa-4">
                <v-card elevation="4" class="py-2 px-5 mx-2 rounded-lg col-9" width="75%">
                  <v-row>
                    <v-col cols="12" class="d-flex">
                      <strong>Facility ID: {{ navBarList[index].facilityAccountNumber }}</strong>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="5" class="flex-column">
                      <strong>Facility Name: {{ navBarList[index].facilityName }}</strong>
                    </v-col>
                    <v-col v-if="!facility.update" cols="4" class="flex-column text-center">
                      <strong> Status: Opt-{{ getOptInString(facility) }} </strong>
                    </v-col>

                    <v-col v-if="organizationProviderType === ORGANIZATION_PROVIDER_TYPES.GROUP" cols="3">
                      <v-btn
                        v-if="showUpdateButton(index)"
                        color="#003366"
                        dark
                        :disabled="isReadOnly"
                        @click="facility.update = facility.update == false ? true : false"
                      >
                        Update
                      </v-btn>
                    </v-col>
                  </v-row>
                  <template v-if="facility.update">
                    <v-row class="ml-16">
                      <v-radio-group
                        v-model="facility.optInOrOut"
                        class="justify-space-around"
                        inline
                        :disabled="isReadOnly"
                        :rules="rules.required"
                      >
                        <v-col cols="12" md="4" class="d-flex ml-16">
                          <v-radio label="Opt-In" :value="OPT_STATUSES.OPT_IN" />
                        </v-col>
                        <v-col cols="12" md="4" class="d-flex ml-16">
                          <v-radio label="Opt-Out" :value="OPT_STATUSES.OPT_OUT" />
                        </v-col>
                      </v-radio-group>
                    </v-row>
                    <v-row v-if="facility.optInOrOut === OPT_STATUSES.OPT_IN && showUnionQuestion" class="ml-16">
                      <v-radio-group
                        v-model="facility.facilityUnionStatus"
                        class=""
                        inline
                        :disabled="isReadOnly"
                        :rules="rules.required"
                      >
                        <v-col cols="12" md="4" class="d-flex ml-16">
                          <v-radio label="Unionized" :value="ECEWE_FACILITY_UNION_TYPES.UNIONIZED" />
                        </v-col>
                        <v-col cols="12" md="4" class="d-flex ml-16">
                          <v-radio label="Non-Unionized" :value="ECEWE_FACILITY_UNION_TYPES.NON_UNIONIZED" />
                        </v-col>
                      </v-radio-group>
                    </v-row>
                  </template>

                  <v-row v-if="facility.optInOrOut === OPT_STATUSES.OPT_IN && showUnionQuestion">
                    <v-col cols="12">
                      <strong>
                        {{
                          facility.facilityUnionStatus === ECEWE_FACILITY_UNION_TYPES.UNIONIZED
                            ? 'Unionized'
                            : facility.facilityUnionStatus === ECEWE_FACILITY_UNION_TYPES.NON_UNIONIZED
                              ? 'Non-Unionized'
                              : ''
                        }}
                      </strong>
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
        </v-container>
      </v-skeleton-loader>
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
import { cloneDeep } from 'lodash';

import { useAuthStore } from '@/store/auth.js';
import { useEceweAppStore } from '@/store/eceweApp.js';
import { useAppStore } from '@/store/app.js';
import { useApplicationStore } from '@/store/application.js';
import { useReportChangesStore } from '@/store/reportChanges.js';
import { useNavBarStore } from '@/store/navBar.js';
import { useOrganizationStore } from '@/store/ccof/organization.js';

import {
  PATHS,
  changeUrl,
  pcfUrl,
  ORGANIZATION_PROVIDER_TYPES,
  PROGRAM_YEAR_LANGUAGE_TYPES,
  OPT_STATUSES,
  ECEWE_FACILITY_UNION_TYPES,
} from '@/utils/constants.js';
import alertMixin from '@/mixins/alertMixin.js';
import NavButton from '@/components/util/NavButton.vue';
import rules from '@/utils/rules.js';

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
    ...mapState(useOrganizationStore, ['organizationProviderType']),
    ...mapState(useAuthStore, ['userInfo']),
    ...mapState(useEceweAppStore, ['isStarted', 'eceweModel', 'facilities']),
    ...mapState(useAppStore, ['fundingModelTypeList', 'getLanguageYearLabel']),
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
      return this.uiFacilities.some((item) => {
        if (this.showUnionQuestion) {
          return item.optInOrOut === null || item.facilityUnionStatus === null;
        }
        return item.optInOrOut === null;
      });
    },
    isSaveBtnDisabled() {
      if (this.getLanguageYearLabel === PROGRAM_YEAR_LANGUAGE_TYPES.FY2025_26) {
        return false;
      }
      return this.model.fundingModel === this.fundingModelTypeList[0].id;
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
    isFamilyFacilityOptIn() {
      return this.uiFacilities.every((fac) => fac.optInOrOut);
    },
    showUnionQuestion() {
      return this.model?.fundingModel && this.getLanguageYearLabel === PROGRAM_YEAR_LANGUAGE_TYPES.FY2025_26;
    },
  },
  async mounted() {
    this.setFundingModelTypes({ ...this.fundingModelTypeList });
    this.setApplicationId(this.applicationId);
    const response = await this.loadData();
    if (response) {
      this.initECEWEFacilities(this.navBarList);
      this.setupUiFacilities();
      this.model = { ...this.eceweModel };
    }
  },
  created() {
    this.ORGANIZATION_PROVIDER_TYPES = ORGANIZATION_PROVIDER_TYPES;
    this.OPT_STATUSES = OPT_STATUSES;
    this.ECEWE_FACILITY_UNION_TYPES = ECEWE_FACILITY_UNION_TYPES;
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
    getOptInString(facility) {
      return facility.optInOrOut === OPT_STATUSES.OPT_IN ? 'In' : 'Out';
    },
    showUpdateButton(index) {
      if (this.getLanguageYearLabel !== PROGRAM_YEAR_LANGUAGE_TYPES.FY2025_26) {
        return (
          !this.uiFacilities?.[index].update &&
          !this.isLoading &&
          this.model.fundingModel != this.fundingModelTypeList[0].id
        );
      }
      return !this.uiFacilities?.[index].update && !this.isLoading;
    },
    setupUiFacilities() {
      const copyFacilities = cloneDeep(this.facilities);
      copyFacilities?.forEach((element) => (element.update = element.optInOrOut == null));
      this.uiFacilities = copyFacilities;
      this.setLoadedFacilities([...this.facilities]);
      this.setFacilities([...this.facilities]);
    },
    toggleRadio(index) {
      this.uiFacilities[index].update = !this.uiFacilities[index].update;
    },
    toggleAll() {
      this.uiFacilities.forEach((_fac, index) => {
        this.toggleRadio(index);
        this.uiFacilities[index].optInOrOut = OPT_STATUSES.OPT_IN;
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
          const response = await this.loadECEWE();
          this.isLoading = false;
          return response;
        } catch (error) {
          console.log('Error loading ECEWE application.', error);
          this.setFailureAlert('Error loading ECEWE application.');
        }
      }
    },
    //if a facility decides to opt-out of ecewe - we should reset the union respone to 'non unionzed' before save
    resetUnionResponse() {
      this.uiFacilities.forEach((el) => {
        if (el.optInOrOut === OPT_STATUSES.OPT_OUT) el.facilityUnionStatus = ECEWE_FACILITY_UNION_TYPES.NON_UNIONIZED;
      });
    },
    async saveFacilities(showConfirmation) {
      if (this.isReadOnly) {
        return;
      }
      this.isProcessing = true;
      try {
        if (this.showUnionQuestion) {
          this.resetUnionResponse();
        }
        let uiFacilitiesCopy = [...this.uiFacilities];

        // eslint-disable-next-line no-unused-vars
        uiFacilitiesCopy = uiFacilitiesCopy.map(({ update, ...item }) => item);

        this.setFacilities(uiFacilitiesCopy);
        const response = await this.saveECEWEFacilities();
        if (response?.data?.facilities) {
          response.data.facilities?.forEach((el) => {
            const facility = this.userProfileList.find((f) => f.facilityId === el.facilityId);
            if (facility) {
              facility.eceweOptInStatus = el.optInOrOut;
            }

            //update the CR map with the data so navbar will work properly for CR new fac
            if (this.isChangeRequest) {
              const newFac = this.getChangeActionNewFacByFacilityId(el.facilityId);
              newFac.ecewe = {
                eceweOptInStatus: el.optInOrOut,
                eceweApplicationId: el.eceweApplicationId,
                eceweFacilityId: el.facilityId,
              };
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
