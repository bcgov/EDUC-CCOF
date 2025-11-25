<template>
  <v-container>
    <v-card class="mx-12 mb-12 pa-8">
      <div class="row pt-4 text-center">
        <span class="text-h5">Child Care Operating Funding Program - Request a Parent Fee Increase</span>
      </div>
      <br />
      <div class="row pt-4 text-center">
        <span class="text-h5">Child Care Fee Reduction Initiative (CCFRI)</span>
      </div>
      <br />
      <FacilityHeader
        :facility-account-number="currentFacility?.facilityAccountNumber"
        :facility-name="currentFacility.facilityName"
        :license-number="currentFacility?.licenseNumber"
      />
      <br />

      <div v-if="languageYearLabel != programYearTypes.HISTORICAL" class="row pt-4 text-center">
        <p>
          CCFRI regions align with the BCSSA's grouping of school districts into 6 regional chapters. Use the
          <a :href="BCSSALink" target="_blank">BCSSA region lookup</a> to find your region.
        </p>
        <br />
        <br />
        <p>
          Note: Parent fee increases will be reviewed and additional information may be requested, which may result in
          increased processing times. If approved, this parent fee will be posted on the Ministry website.
        </p>
        <br /><br />
      </div>

      <br /><br />
      <v-form ref="isValidForm" v-model="isValidForm">
        <div v-if="loading">
          <v-skeleton-loader max-height="475px" :loading="loading" type="table-heading, card, card" />
          <br /><br />
        </div>

        <div v-else-if="currentPcfCcfri.childCareTypes?.length > 0">
          <div v-for="(item, index) in currentPcfCcfri.childCareTypes" :key="item.childCareCategoryId">
            <v-card
              elevation="6"
              class="px-0 py-0 mx-auto my-10 rounded-lg col-12"
              min-height="230"
              rounded
              tiled
              exact
              tile
              :ripple="false"
            >
              <v-card-text class="pa-0">
                <div class="pa-2 pa-md-4 ma-0 backG">
                  <p class="text-h5 text--primary px-5 py-0 my-0">
                    Approved Parent Fees {{ item.programYear }}: Full-Time {{ item.childCareCategory }}
                  </p>
                </div>
                <div class="px-md-12 px-7">
                  <br />

                  <v-row class="d-flex">
                    <v-col cols="12" md="3" lg="4">
                      <v-select
                        v-model="CCFRIFacilityModel.childCareTypes[index].feeFrequency"
                        label="Parent fee frequency: "
                        :items="feeChoices"
                        class="cols-4 justify-space-around"
                        variant="outlined"
                        :disabled="isReadOnly"
                        @update:model-value="clearFees(index)"
                      >
                        <option v-for="feeChoice in feeChoices" :key="feeChoice" :value="feeChoice">
                          {{ feeChoice }}
                        </option>
                      </v-select>
                    </v-col>

                    <v-col
                      v-if="!isReadOnly"
                      cols="12"
                      sm="8"
                      md="5"
                      xl="4"
                      class="pb-0 pt-3"
                      style="display: flex; justify-content: flex-start; align-items: flex-start"
                    >
                      <v-btn
                        v-if="!isReadOnly"
                        style="margin-right: 1px"
                        class="blueButton mb-10 ml-2"
                        :disabled="!isButtonActive(index)"
                        @click="copyFees(index)"
                      >
                        Auto-fill approved parent fees
                      </v-btn>
                      <v-tooltip location="top" color="#003366">
                        <template #activator="{ props }">
                          <v-card
                            style="background-color: #003366 !important; color: #313131"
                            class="tooltip ml-xl-6 mt-1"
                            v-bind="props"
                          >
                            <v-icon class="pt-2" size="small" style="color: #ffffff !important"> mdi-help </v-icon>
                          </v-card>
                        </template>
                        <span v-if="isButtonActive(index)">
                          This automatically fills the new parent fees fields with the current approved fee values. This
                          will replace any data entered for this care category.
                        </span>
                        <span v-else>
                          Enter your new parent fees for all months. Current parent fee values will not change.
                          <br />
                          Note: Auto-fill is not available if you change the parent fee frequency
                        </span>
                      </v-tooltip>
                    </v-col>

                    <v-col cols="12" sm="4" md="4" lg="3">
                      <v-btn v-if="!isReadOnly" :disabled="!isButtonActive(index)" @click="clearFees(index)">
                        Clear parent fees
                      </v-btn>
                    </v-col>
                  </v-row>

                  <v-container class="ma-0 pa-0 gridContainer">
                    <div class="feeTitle">
                      <span class="font-16">Approved Parent Fees: </span>
                    </div>

                    <div class="feeTitle">
                      <span class="font-16">Apr:</span>
                      <v-text-field
                        v-model.number="item.approvedFeeApr"
                        tabindex="-1"
                        class=""
                        density="compact"
                        flat
                        variant="solo"
                        hide-details
                        readonly
                        type="number"
                        :disabled="false"
                        :rules="feeRules"
                        prefix="$"
                        @update:model-value="convertBlankNumberToNull(item, 'approvedFeeApr')"
                      />
                    </div>

                    <div class="feeTitle">
                      <span class="font-16">May:</span>
                      <v-text-field
                        v-model.number="item.approvedFeeMay"
                        tabindex="-1"
                        class=""
                        type="number"
                        density="compact"
                        flat
                        variant="solo"
                        hide-details
                        readonly
                        :disabled="false"
                        :rules="feeRules"
                        prefix="$"
                        @wheel="$event.target.blur()"
                        @update:model-value="convertBlankNumberToNull(item, 'approvedFeeMay')"
                      />
                    </div>

                    <div class="feeTitle">
                      <span class="font-16">Jun:</span>
                      <v-text-field
                        v-model.number="item.approvedFeeJun"
                        tabindex="-1"
                        type="number"
                        density="compact"
                        flat
                        variant="solo"
                        hide-details
                        readonly
                        :disabled="false"
                        :rules="feeRules"
                        prefix="$"
                        @wheel="$event.target.blur()"
                        @update:model-value="convertBlankNumberToNull(item, 'approvedFeeJun')"
                      />
                    </div>

                    <div class="feeTitle">
                      <span class="font-16">Jul:</span>
                      <v-text-field
                        v-model.number="item.approvedFeeJul"
                        tabindex="-1"
                        type="number"
                        density="compact"
                        flat
                        variant="solo"
                        hide-details
                        readonly
                        :disabled="false"
                        :rules="feeRules"
                        prefix="$"
                        @wheel="$event.target.blur()"
                        @update:model-value="convertBlankNumberToNull(item, 'approvedFeeJul')"
                      />
                    </div>

                    <div class="feeTitle">
                      <span class="font-16">Aug:</span>
                      <v-text-field
                        v-model.number="item.approvedFeeAug"
                        tabindex="-1"
                        type="number"
                        density="compact"
                        flat
                        variant="solo"
                        hide-details
                        readonly
                        :disabled="false"
                        :rules="feeRules"
                        prefix="$"
                        @wheel="$event.target.blur()"
                        @update:model-value="convertBlankNumberToNull(item, 'approvedFeeAug')"
                      />
                    </div>

                    <div class="feeTitle">
                      <span class="font-16">Sep:</span>
                      <v-text-field
                        v-model.number="item.approvedFeeSep"
                        tabindex="-1"
                        type="number"
                        density="compact"
                        flat
                        variant="solo"
                        hide-details
                        readonly
                        :disabled="false"
                        :rules="feeRules"
                        prefix="$"
                        @wheel="$event.target.blur()"
                        @update:model-value="convertBlankNumberToNull(item, 'approvedFeeSep')"
                      />
                    </div>

                    <!-- End Row One of Grid-->

                    <div class="feeTitleInput">
                      <span class="font-16">New Parent Fees: </span>
                    </div>

                    <div class="inputBoxWrapper">
                      <v-text-field
                        v-model.number="CCFRIFacilityModel.childCareTypes[index].approvedFeeApr"
                        class=""
                        type="number"
                        :disabled="isReadOnly"
                        variant="outlined"
                        :rules="feeRules"
                        prefix="$"
                        @wheel="$event.target.blur()"
                        @update:model-value="convertBlankNumberToNull(item, 'approvedFeeApr')"
                      />
                    </div>

                    <div class="inputBoxWrapper">
                      <v-text-field
                        v-model.number="CCFRIFacilityModel.childCareTypes[index].approvedFeeMay"
                        type="number"
                        :disabled="isReadOnly"
                        variant="outlined"
                        :rules="feeRules"
                        prefix="$"
                        @wheel="$event.target.blur()"
                        @update:model-value="convertBlankNumberToNull(item, 'approvedFeeApr')"
                      />
                    </div>

                    <div class="inputBoxWrapper">
                      <v-text-field
                        v-model.number="CCFRIFacilityModel.childCareTypes[index].approvedFeeJun"
                        type="number"
                        :disabled="isReadOnly"
                        variant="outlined"
                        :rules="feeRules"
                        prefix="$"
                        @wheel="$event.target.blur()"
                        @update:model-value="convertBlankNumberToNull(item, 'approvedFeeApr')"
                      />
                    </div>

                    <div class="inputBoxWrapper">
                      <v-text-field
                        v-model.number="CCFRIFacilityModel.childCareTypes[index].approvedFeeJul"
                        type="number"
                        :disabled="isReadOnly"
                        variant="outlined"
                        :rules="feeRules"
                        prefix="$"
                        @wheel="$event.target.blur()"
                        @update:model-value="convertBlankNumberToNull(item, 'approvedFeeApr')"
                      />
                    </div>

                    <div class="inputBoxWrapper">
                      <v-text-field
                        v-model.number="CCFRIFacilityModel.childCareTypes[index].approvedFeeAug"
                        type="number"
                        :disabled="isReadOnly"
                        variant="outlined"
                        :rules="feeRules"
                        prefix="$"
                        @wheel="$event.target.blur()"
                        @update:model-value="convertBlankNumberToNull(item, 'approvedFeeApr')"
                      />
                    </div>

                    <div class="inputBoxWrapper">
                      <v-text-field
                        v-model.number="CCFRIFacilityModel.childCareTypes[index].approvedFeeSep"
                        type="number"
                        :disabled="isReadOnly"
                        variant="outlined"
                        :rules="feeRules"
                        prefix="$"
                        @wheel="$event.target.blur()"
                        @update:model-value="convertBlankNumberToNull(item, 'approvedFeeApr')"
                      />
                    </div>

                    <!-- End Row Two of Grid-->
                  </v-container>
                  <br />
                  <br />

                  <v-container class="ma-0 pa-0 gridContainer">
                    <div class="feeTitle">
                      <span class="font-16">Approved Parent Fees: </span>
                    </div>

                    <div class="feeTitle">
                      <span class="font-16">Oct:</span>
                      <v-text-field
                        v-model.number="item.approvedFeeOct"
                        tabindex="-1"
                        class=""
                        density="compact"
                        flat
                        variant="solo"
                        hide-details
                        readonly
                        type="number"
                        :disabled="false"
                        :rules="feeRules"
                        prefix="$"
                        @update:model-value="convertBlankNumberToNull(item, 'approvedFeeApr')"
                      />
                    </div>

                    <div class="feeTitle">
                      <span class="font-16">Nov:</span>
                      <v-text-field
                        v-model.number="item.approvedFeeNov"
                        tabindex="-1"
                        class=""
                        type="number"
                        density="compact"
                        flat
                        variant="solo"
                        hide-details
                        readonly
                        :disabled="false"
                        :rules="feeRules"
                        prefix="$"
                        @wheel="$event.target.blur()"
                        @update:model-value="convertBlankNumberToNull(item, 'approvedFeeMay')"
                      />
                    </div>

                    <div class="feeTitle">
                      <span class="font-16">Dec:</span>
                      <v-text-field
                        v-model.number="item.approvedFeeDec"
                        tabindex="-1"
                        type="number"
                        density="compact"
                        flat
                        variant="solo"
                        hide-details
                        readonly
                        :disabled="false"
                        :rules="feeRules"
                        prefix="$"
                        @wheel="$event.target.blur()"
                        @update:model-value="convertBlankNumberToNull(item, 'approvedFeeJun')"
                      />
                    </div>

                    <div class="feeTitle">
                      <span class="font-16">Jan:</span>
                      <v-text-field
                        v-model.number="item.approvedFeeJan"
                        tabindex="-1"
                        type="number"
                        density="compact"
                        flat
                        variant="solo"
                        hide-details
                        readonly
                        :disabled="false"
                        :rules="feeRules"
                        prefix="$"
                        @wheel="$event.target.blur()"
                        @update:model-value="convertBlankNumberToNull(item, 'approvedFeeJul')"
                      />
                    </div>

                    <div class="feeTitle">
                      <span class="font-16">Feb:</span>
                      <v-text-field
                        v-model.number="item.approvedFeeFeb"
                        tabindex="-1"
                        type="number"
                        density="compact"
                        flat
                        variant="solo"
                        hide-details
                        readonly
                        :disabled="false"
                        :rules="feeRules"
                        prefix="$"
                        @wheel="$event.target.blur()"
                        @update:model-value="convertBlankNumberToNull(item, 'approvedFeeAug')"
                      />
                    </div>

                    <div class="feeTitle">
                      <span class="font-16">Mar:</span>
                      <v-text-field
                        v-model.number="item.approvedFeeMar"
                        tabindex="-1"
                        type="number"
                        density="compact"
                        flat
                        variant="solo"
                        hide-details
                        readonly
                        :disabled="false"
                        :rules="feeRules"
                        prefix="$"
                        @wheel="$event.target.blur()"
                        @update:model-value="convertBlankNumberToNull(item, 'approvedFeeSep')"
                      />
                    </div>

                    <!-- End Row One of Grid-->

                    <div class="feeTitleInput">
                      <span class="font-16">New Parent Fees: </span>
                    </div>

                    <div class="inputBoxWrapper">
                      <v-text-field
                        v-model.number="CCFRIFacilityModel.childCareTypes[index].approvedFeeOct"
                        type="number"
                        :disabled="isReadOnly"
                        variant="outlined"
                        :rules="feeRules"
                        prefix="$"
                        @wheel="$event.target.blur()"
                        @update:model-value="convertBlankNumberToNull(item, 'approvedFeeApr')"
                      />
                    </div>

                    <div class="inputBoxWrapper">
                      <v-text-field
                        v-model.number="CCFRIFacilityModel.childCareTypes[index].approvedFeeNov"
                        type="number"
                        :disabled="isReadOnly"
                        variant="outlined"
                        :rules="feeRules"
                        prefix="$"
                        @wheel="$event.target.blur()"
                        @update:model-value="convertBlankNumberToNull(item, 'approvedFeeApr')"
                      />
                    </div>

                    <div class="inputBoxWrapper">
                      <v-text-field
                        v-model.number="CCFRIFacilityModel.childCareTypes[index].approvedFeeDec"
                        type="number"
                        :disabled="isReadOnly"
                        variant="outlined"
                        :rules="feeRules"
                        prefix="$"
                        @wheel="$event.target.blur()"
                        @update:model-value="convertBlankNumberToNull(item, 'approvedFeeApr')"
                      />
                    </div>

                    <div class="inputBoxWrapper">
                      <v-text-field
                        v-model.number="CCFRIFacilityModel.childCareTypes[index].approvedFeeJan"
                        type="number"
                        :disabled="isReadOnly"
                        variant="outlined"
                        :rules="feeRules"
                        prefix="$"
                        @wheel="$event.target.blur()"
                        @update:model-value="convertBlankNumberToNull(item, 'approvedFeeApr')"
                      />
                    </div>

                    <div class="inputBoxWrapper">
                      <v-text-field
                        v-model.number="CCFRIFacilityModel.childCareTypes[index].approvedFeeFeb"
                        type="number"
                        :disabled="isReadOnly"
                        variant="outlined"
                        :rules="feeRules"
                        prefix="$"
                        @wheel="$event.target.blur()"
                        @update:model-value="convertBlankNumberToNull(item, 'approvedFeeApr')"
                      />
                    </div>

                    <div class="inputBoxWrapper">
                      <v-text-field
                        v-model.number="CCFRIFacilityModel.childCareTypes[index].approvedFeeMar"
                        type="number"
                        :disabled="isReadOnly"
                        variant="outlined"
                        :rules="feeRules"
                        prefix="$"
                        @wheel="$event.target.blur()"
                        @update:model-value="convertBlankNumberToNull(item, 'approvedFeeApr')"
                      />
                    </div>

                    <!-- End Row Two of Grid-->
                    <br />
                  </v-container>
                </div>
              </v-card-text>
            </v-card>
          </div>
        </div>

        <div v-else>
          <div class="row pt-4 justify-center pb-3">
            <span class="text-h6">No Approved Parent fees have been found for this facility.</span>
            <span class="text-h6"
              >Please go back to 'Select Facility' and remove this Facility from your selection.</span
            >
          </div>
        </div>

        <v-card v-if="!loading" elevation="6">
          <v-card-text class="pa-0">
            <div class="pa-2 pa-md-4 ma-0 backG">
              <p class="text-h5 text--primary px-5 py-0 my-0">
                Is there any other information about this facility you would like us to know?
              </p>
            </div>
            <div class="px-md-12 px-7">
              <br />
              <v-textarea
                v-model="CCFRIFacilityModel.ccfriApplicationNotes"
                :disabled="isReadOnly"
                variant="outlined"
                name="input-7-4"
                label="Describe here"
              />
            </div>
          </v-card-text>
        </v-card>
      </v-form>
    </v-card>

    <NavButton
      :is-next-displayed="true"
      :is-save-displayed="true"
      :is-save-disabled="isReadOnly || loading"
      :is-next-disabled="!isValidForm"
      :is-processing="processing"
      @previous="previous"
      @next="next"
      @validate-form="validateForm()"
      @save="save(true)"
    />

    <AppDialog
      v-model="showRfiDialog"
      persistent
      max-width="700px"
      :title="'Request for Information'"
      :loading="false"
      @close="closeDialog()"
    >
      <template #content>
        <v-col cols="12">
          <p>
            You have entered a parent fee above the {{ formattedProgramYear }} parent fee increase limit for the
            following care categories:<br /><br />
            <span v-for="item in rfi3percentCategories" :key="item">{{ item }}<br /></span>
          </p>
          <p>
            Parent fee increases over the limit will be assessed under the Parent Fee Increase Exceptions policy in the
            {{ formattedProgramYear }} <a :href="fundingUrl" target="_blank">Funding Guidelines</a>. You can continue to
            the Request for Information section or press back to update your fees.
          </p>
          <p>
            Please confirm you have provided your highest full-time (i.e. over 4 hours, 5 days a week) parent fee for
            each care category before CCFRI is applied. Submit your daily parent fee if you only offer care for 4 days
            or fewer per week.
          </p>
        </v-col>
      </template>

      <template #button>
        <v-row justify="center" class="pb-4">
          <v-col cols="auto" class="pb-3">
            <AppButton
              :primary="false"
              required
              size="x-large"
              style="width: 120px; height: 48px"
              @click="closeDialog()"
            >
              Back
            </AppButton>
          </v-col>
          <v-col cols="auto" class="pb-3">
            <AppButton :primary="true" required size="large" style="width: 120px; height: 48px" @click="toRfi()">
              Continue
            </AppButton>
          </v-col>
        </v-row>
      </template>
    </AppDialog>
  </v-container>
</template>

<script>
import { isEqual } from 'lodash';
import { mapState, mapActions } from 'pinia';

import AppButton from '@/components/guiComponents/AppButton.vue';
import AppDialog from '@/components/guiComponents/AppDialog.vue';
import FacilityHeader from '@/components/guiComponents/FacilityHeader.vue';
import NavButton from '@/components/util/NavButton.vue';

import ApiService from '@/common/apiService.js';
import alertMixin from '@/mixins/alertMixin.js';
import globalMixin from '@/mixins/globalMixin.js';

import { useAppStore } from '@/store/app.js';
import { useApplicationStore } from '@/store/application.js';
import { useCcfriAppStore } from '@/store/ccfriApp.js';
import { useNavBarStore } from '@/store/navBar.js';
import { useOrganizationStore } from '@/store/ccof/organization.js';
import { useReportChangesStore } from '@/store/reportChanges.js';

import { deepCloneObject } from '@/utils/common.js';
import {
  CCFRI_MAX_FEE,
  CCFRI_MIN_FEE,
  CHANGE_TYPES,
  ORGANIZATION_PROVIDER_TYPES,
  PATHS,
  PROGRAM_YEAR_LANGUAGE_TYPES,
  ApiRoutes,
  changeUrlGuid,
} from '@/utils/constants.js';
import rules from '@/utils/rules.js';

let model = {};

export default {
  name: 'CurrentFeeVerification',
  components: { AppButton, AppDialog, FacilityHeader, NavButton },
  mixins: [alertMixin, globalMixin],
  async beforeRouteLeave(_to, _from, next) {
    next();
  },
  data() {
    return {
      showRfiDialog: false,
      rfi3percentCategories: [],
      feeChoices: ['Daily', 'Monthly'],
      dialog: false,
      currentFacility: undefined,
      currentPcfCcfri: undefined,
      model,
      isValidForm: false,
      processing: false,
      loading: false,
    };
  },
  computed: {
    ...mapState(useCcfriAppStore, [
      'CCFRIFacilityModel',
      'ccfriChildCareTypes',
      'loadedModel',
      'ccfriId',
      'getCCFRIById',
    ]),
    ...mapState(useOrganizationStore, ['organizationProviderType']),
    ...mapState(useApplicationStore, [
      'applicationStatus',
      'formattedProgramYear',
      'programYearId',
      'applicationId',
      'applicationMap',
    ]),
    ...mapState(useAppStore, ['programYearList', 'getBcssaUrl', 'getFundingUrl', 'getLanguageYearLabel']),
    ...mapState(useApplicationStore, ['programYearId', 'isRenewal', 'fiscalStartAndEndDates']),
    ...mapState(useNavBarStore, [
      'navBarList',
      'userProfileList',
      'changeRequestMap',
      'previousPath',
      'nextPath',
      'getNavByCCFRIId',
    ]),
    ...mapState(useReportChangesStore, ['changeRequestStatus']),
    BCSSALink() {
      return this.getBcssaUrl(this.programYearId);
    },
    languageYearLabel() {
      return this.getLanguageYearLabel;
    },
    programYearTypes() {
      return PROGRAM_YEAR_LANGUAGE_TYPES;
    },
    getCurrentFacility() {
      return this.getNavByCCFRIId(this.$route.params.urlGuid);
    },
    isReadOnly() {
      if (!this.changeRequestStatus || this.getCurrentFacility.unlockCcfri) {
        return false;
      }
      if (this.changeRequestStatus !== 'INCOMPLETE') {
        return true;
      }
      return false;
    },
    fundingUrl() {
      return this.getFundingUrl(this.programYearId);
    },
  },
  watch: {
    '$route.params.urlGuid': {
      async handler() {
        try {
          this.loading = true;
          let fac = this.navBarList?.find((el) => el.ccfriApplicationId == this.$route.params.urlGuid); //find the facility in navBar so we can look up the old CCFRI ID
          this.currentFacility = this.applicationMap
            .get(this.programYearId)
            ?.facilityList.find((el) => el.facilityId == fac.facilityId); //facility from applicationMAP so we can grab the old PCF ccfriID no matter what year we are on.
          this.currentPcfCcfri = await this.getPreviousApprovedFees({
            facilityId: this.currentFacility.facilityId,
            programYearId: this.programYearId,
          });
          this.currentPcfCcfri.childCareTypes = this.currentPcfCcfri.childCareTypes.filter(
            (el) => el.programYearId == this.programYearId,
          ); //filter so only current fiscal years appear
          this.currentPcfCcfri.ccfriApplicationId = this.$route.params.urlGuid;
          await this.loadCCFRIFacility(this.$route.params.urlGuid);
          await this.loadCCFisCCRIMedian(); //load the CCFRI median of the existing PCf (old) CCFRI
          await this.decorateWithCareTypes(this.CCFRIFacilityModel.facilityId);

          let arr = [];

          //sort the child care types so they match the cards of the old CCFRI fees
          for (const childCareType of this.currentPcfCcfri.childCareTypes) {
            let careCategory = this.CCFRIFacilityModel.childCareTypes.find(
              (el) =>
                el.childCareCategoryId == childCareType.childCareCategoryId && el.programYearId == this.programYearId,
            );
            //if this is the first time, the new CCFRI will not have any fees yet. Assign to 0 so they can be filled in and saved
            if (!careCategory.feeFrequency) {
              let fees = {
                approvedFeeApr: null,
                approvedFeeAug: null,
                approvedFeeDec: null,
                approvedFeeFeb: null,
                approvedFeeJan: null,
                approvedFeeJul: null,
                approvedFeeJun: null,
                approvedFeeMar: null,
                approvedFeeMay: null,
                approvedFeeNov: null,
                approvedFeeOct: null,
                approvedFeeSep: null,
                feeFrequency: childCareType.feeFrequency, //per the requirements, set the fee frequency to whatever was selected on the PCF
              };
              careCategory = { ...careCategory, ...fees };
            }
            arr.push(careCategory);
          }
          //ccfri-3655remove fees correct question - assume fees always correct
          this.CCFRIFacilityModel.existingFeesCorrect = '100000000';

          this.CCFRIFacilityModel.childCareTypes = arr;

          this.loading = false;
        } catch (error) {
          console.log(error);

          this.setFailureAlert('An error occured while getting.');
        }
      },
      immediate: true,
      deep: true,
    },
  },
  created() {
    this.feeRules = [
      rules.isNumber,
      rules.max(CCFRI_MAX_FEE, `Max fee is $${CCFRI_MAX_FEE}.00`),
      rules.min(CCFRI_MIN_FEE, 'Input a positive number'),
    ];
  },
  methods: {
    ...mapActions(useCcfriAppStore, [
      'saveCcfri',
      'loadCCFRIFacility',
      'getPreviousApprovedFees',
      'decorateWithCareTypes',
      'getCcfriOver3percent',
      'loadCCFisCCRIMedian',
      'setLoadedModel',
      'setCCFRIFacilityModel',
      'setModel',
    ]),
    ...mapActions(useNavBarStore, ['setNavBarCCFRIComplete', 'setNavBarValue']),

    cancel() {
      this.dialog = false;
    },
    closeDialog() {
      this.showRfiDialog = false;
    },
    clearFees(index) {
      this.CCFRIFacilityModel.childCareTypes[index].approvedFeeApr = 0;
      this.CCFRIFacilityModel.childCareTypes[index].approvedFeeMay = 0;
      this.CCFRIFacilityModel.childCareTypes[index].approvedFeeJun = 0;
      this.CCFRIFacilityModel.childCareTypes[index].approvedFeeJul = 0;
      this.CCFRIFacilityModel.childCareTypes[index].approvedFeeAug = 0;
      this.CCFRIFacilityModel.childCareTypes[index].approvedFeeSep = 0;
      this.CCFRIFacilityModel.childCareTypes[index].approvedFeeOct = 0;
      this.CCFRIFacilityModel.childCareTypes[index].approvedFeeNov = 0;
      this.CCFRIFacilityModel.childCareTypes[index].approvedFeeDec = 0;
      this.CCFRIFacilityModel.childCareTypes[index].approvedFeeJan = 0;
      this.CCFRIFacilityModel.childCareTypes[index].approvedFeeFeb = 0;
      this.CCFRIFacilityModel.childCareTypes[index].approvedFeeMar = 0;
    },
    copyFees(index) {
      this.CCFRIFacilityModel.childCareTypes[index].approvedFeeApr =
        this.currentPcfCcfri.childCareTypes[index].approvedFeeApr;
      this.CCFRIFacilityModel.childCareTypes[index].approvedFeeMay =
        this.currentPcfCcfri.childCareTypes[index].approvedFeeMay;
      this.CCFRIFacilityModel.childCareTypes[index].approvedFeeJun =
        this.currentPcfCcfri.childCareTypes[index].approvedFeeJun;
      this.CCFRIFacilityModel.childCareTypes[index].approvedFeeJul =
        this.currentPcfCcfri.childCareTypes[index].approvedFeeJul;
      this.CCFRIFacilityModel.childCareTypes[index].approvedFeeAug =
        this.currentPcfCcfri.childCareTypes[index].approvedFeeAug;
      this.CCFRIFacilityModel.childCareTypes[index].approvedFeeSep =
        this.currentPcfCcfri.childCareTypes[index].approvedFeeSep;
      this.CCFRIFacilityModel.childCareTypes[index].approvedFeeOct =
        this.currentPcfCcfri.childCareTypes[index].approvedFeeOct;
      this.CCFRIFacilityModel.childCareTypes[index].approvedFeeNov =
        this.currentPcfCcfri.childCareTypes[index].approvedFeeNov;
      this.CCFRIFacilityModel.childCareTypes[index].approvedFeeDec =
        this.currentPcfCcfri.childCareTypes[index].approvedFeeDec;
      this.CCFRIFacilityModel.childCareTypes[index].approvedFeeJan =
        this.currentPcfCcfri.childCareTypes[index].approvedFeeJan;
      this.CCFRIFacilityModel.childCareTypes[index].approvedFeeFeb =
        this.currentPcfCcfri.childCareTypes[index].approvedFeeFeb;
      this.CCFRIFacilityModel.childCareTypes[index].approvedFeeMar =
        this.currentPcfCcfri.childCareTypes[index].approvedFeeMar;
    },
    hasModelChanged() {
      return !isEqual(this.CCFRIFacilityModel, this.loadedModel);
    },

    isButtonActive(index) {
      return (
        this.CCFRIFacilityModel.childCareTypes[index].feeFrequency ==
        this.currentPcfCcfri.childCareTypes[index].feeFrequency
      );
    },

    getMtfiFacility(facilityId) {
      let mtfiFacility;
      const changeRequest = this.changeRequestMap?.get(this.$route.params.changeRecGuid);
      if (changeRequest?.changeActions?.length > 0) {
        const mtfiDetails = changeRequest?.changeActions[0].mtfi;
        mtfiFacility = mtfiDetails?.find((item) => item.facilityId === facilityId);
      }
      return mtfiFacility;
    },
    async toRfi() {
      try {
        this.setNavBarValue({ facilityId: this.currentFacility.facilityId, property: 'hasRfi', value: true });
        if (this.getCurrentFacility.unlockCcfri) {
          this.setNavBarValue({ facilityId: this.currentFacility.facilityId, property: 'unlockRfi', value: true });
          const mtfiFacility = this.getMtfiFacility(this.currentFacility.facilityId);
          await ApiService.apiAxios.patch(ApiRoutes.CHANGE_REQUEST + '/mtfi/' + mtfiFacility?.changeRequestMtfiId, {
            ccof_unlock_rfi: true,
          });
        }
        await this.save(false);
        this.$router.push(
          changeUrlGuid(
            PATHS.CCFRI_RFI,
            this.$route.params.changeRecGuid,
            this.$route.params.urlGuid,
            CHANGE_TYPES.MTFI,
          ),
        );
      } catch (error) {
        console.log(error);
        this.setFailureAlert('An error occured while navigating to RFI.');
      }
    },
    async next() {
      if (this.isReadOnly && !this.loading) {
        this.$router.push(this.nextPath);
      } else {
        this.currentPcfCcfri.existingFeesCorrect = this.CCFRIFacilityModel.existingFeesCorrect;
        this.setModel({ ...this.currentPcfCcfri });

        //always check for RFI regardless of new or renewal state
        this.rfi3percentCategories = await this.getCcfriOver3percent(this.currentPcfCcfri);
        if (this.rfi3percentCategories.length > 0) {
          if (this.getCurrentFacility.hasRfi) {
            //already has RFI. just go to the next page
            await this.save(false);
            this.$router.push(
              changeUrlGuid(
                PATHS.CCFRI_RFI,
                this.$route.params.changeRecGuid,
                this.$route.params.urlGuid,
                CHANGE_TYPES.MTFI,
              ),
            );
          } else {
            this.showRfiDialog = true;
          }
        } else {
          //no need for RFI.
          if (this.getMtfiFacility(this.currentFacility.facilityId).hasRfi) {
            this.setNavBarValue({ facilityId: this.currentFacility.facilityId, property: 'hasRfi', value: false });
            this.getMtfiFacility(this.currentFacility.facilityId).hasRfi = false; //update it in the change request as well
            // Use nextTick to ensure the DOM is updated before continuing
            await this.$nextTick();
            await ApiService.apiAxios.delete(ApiRoutes.APPLICATION_RFI + '/' + this.$route.params.urlGuid + '/rfi');
          }
          await this.save(false);
          this.$router.push(this.nextPath);
        }
      }
    },
    previous() {
      if (this.organizationProviderType === ORGANIZATION_PROVIDER_TYPES.FAMILY) {
        this.$router.push(PATHS.ROOT.CHANGE_LANDING);
      } else {
        this.$router.push(this.previousPath);
      }
    },
    validateForm() {},
    async save(showMessage) {
      //only save data to Dynamics if the form has changed.
      this.setNavBarCCFRIComplete({ ccfriId: this.ccfriId, complete: this.isValidForm });
      try {
        if (this.hasModelChanged()) {
          this.processing = true;
          this.setLoadedModel(deepCloneObject(this.CCFRIFacilityModel)); //when saving update the loaded model to look for changes
          await this.saveCcfri({
            isFormComplete: this.isValidForm,
            hasRfi: this.getNavByCCFRIId(this.$route.params.urlGuid).hasRfi,
          });
          this.setNavBarCCFRIComplete({ ccfriId: this.$route.params.urlGuid, complete: this.isValidForm });
          this.processing = false;
        }
        if (showMessage) {
          this.setSuccessAlert('Success! CCFRI Parent fees have been saved.');
        }
      } catch (error) {
        console.info(error);
        this.setFailureAlert('An error occurred while saving.');
      }
    },
  },
};
</script>

<style scoped>
.blueBorder {
  border-top: 55px solid grey !important;
}

.font-16 {
  font-size: 16px;
}

.backG {
  background-color: lightgray;
}

.textItemSpacing {
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.gridContainer {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: repeat(2, 75px);
  grid-gap: 10px;
}

.row {
  flex-wrap: wrap;
}

.feeTitle {
  display: flex;
  align-content: flex-start;
  align-items: center;
  margin-left: 0px;
  padding-left: 0px;
  border-right: 2px black;
}
.feeTitleInput {
  display: flex;
  align-content: flex-start;
  align-items: center;
}

.inputBoxWrapper {
  display: flex;
  align-content: flex-end;
  align-items: flex-end;
  width: 100%;
}

.noPadding {
  margin-left: 0px;
}

.blueButton {
  background-color: #003366 !important;
}

:deep(i.v-icon.v-icon) {
  color: #003366 !important;
}
</style>
