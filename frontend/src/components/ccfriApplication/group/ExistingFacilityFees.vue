<template>
  <v-container>
    <div class="row pt-4 justify-center">
      <span class="text-h5">
        Child Care Operating Funding Program - {{ formattedProgramYear }} Program Confirmation Form
      </span>
    </div>
    <br />
    <div class="row pt-4 justify-center">
      <span class="text-h5">Child Care Fee Reduction Initiative (CCFRI)</span>
    </div>
    <v-form ref="isValidForm" v-model="isValidForm">
      <v-skeleton-loader v-if="loading" max-height="475px" :loading="loading" type="image, image, image" />
      <br />
      <v-skeleton-loader v-if="loading" max-height="475px" :loading="loading" type="image" class="pb-6">
        <br /><br />
      </v-skeleton-loader>

      <v-card
        v-else
        elevation="6"
        class="pa-4 mx-auto my-10 rounded-lg col-12"
        min-height="230"
        rounded
        tiled
        exact
        tile
        :ripple="false"
      >
        <v-card-text>
          <FacilityHeader
            :facility-account-number="currentFacility?.facilityAccountNumber"
            :facility-name="currentFacility.facilityName"
            :license-number="currentFacility?.licenseNumber"
          />
          <br />
          <!--get current year from CCOF year id -NOT first in array-->
          <p class="text-h6 text--primary text-center">
            Our records show this facility's parent fees for
            <strong> January {{ previousProgramYearLabel }} </strong> to
            <strong> March {{ previousProgramYearLabel }} </strong> are as follows:
          </p>
          <br />
          <v-table v-if="feeList.length > 0">
            <thead>
              <tr>
                <th scope="col" class="text-left">Date</th>
                <th v-for="(item, index) in feeList" :key="index" class="text-center" scope="col">
                  {{ item.childCareCategory }} - {{ item.feeFrequency }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>January {{ previousProgramYearLabel }}</td>
                <td v-for="(item, index) in feeList" :key="index" class="text-center">${{ item.approvedFeeJan }}</td>
              </tr>
              <tr>
                <td>February {{ previousProgramYearLabel }}</td>
                <td v-for="(item, index) in feeList" :key="index" class="text-center">${{ item.approvedFeeFeb }}</td>
              </tr>
              <tr>
                <td>March {{ previousProgramYearLabel }}</td>
                <td v-for="(item, index) in feeList" :key="index" class="text-center">${{ item.approvedFeeMar }}</td>
              </tr>
            </tbody>
          </v-table>
          <h2 v-else class="text-center">
            We have no fees on record for this facility. Click "Next" to enter your fees for the previous 24 months.
          </h2>
        </v-card-text>
      </v-card>

      <v-card
        v-if="!loading && feeList.length > 0"
        elevation="6"
        class="pa-4 mx-auto my-10 rounded-lg col-12"
        min-height="230"
        rounded
        tiled
        exact
        tile
        :ripple="false"
      >
        <v-card-text>
          <p class="text-h6 text--primary">Are these fees listed above correct for this facility?</p>
          <br />
          <v-radio-group v-model="model.q1" :rules="rules.required" inline>
            <v-radio label="Yes" value="Yes" />
            <v-radio label="No" value="No" />
          </v-radio-group>
        </v-card-text>
      </v-card>

      <NavButton
        :is-next-displayed="true"
        :is-next-disabled="!isFormValidAndLoaded"
        @previous="previous"
        @next="next"
        @validate-form="validateForm"
      />
    </v-form>
  </v-container>
</template>

<script>
import { mapState, mapActions } from 'pinia';
import { useAppStore } from '@/store/app.js';
import { useApplicationStore } from '@/store/application.js';
import { useNavBarStore } from '@/store/navBar.js';
import { useCcfriAppStore } from '@/store/ccfriApp.js';

import { PATHS, pcfUrlGuid, CCFRI_FEE_CORRECT_TYPES, ApiRoutes } from '@/utils/constants.js';
import { deepCloneObject } from '@/utils/common.js';
import alertMixin from '@/mixins/alertMixin.js';
import NavButton from '@/components/util/NavButton.vue';
import ApiService from '@/common/apiService.js';
import FacilityHeader from '@/components/guiComponents/FacilityHeader.vue';
import rules from '@/utils/rules.js';

export default {
  components: { NavButton, FacilityHeader },
  mixins: [alertMixin],
  data() {
    return {
      prevFees: {},
      loading: true,
      model: {},
      isValidForm: false,
      feeList: [],
      currentCCFRI: undefined,
    };
  },
  computed: {
    ...mapState(useNavBarStore, ['previousPath', 'getNavByCCFRIId', 'navBarList']),
    ...mapState(useAppStore, ['programYearList']),
    ...mapState(useApplicationStore, ['formattedProgramYear', 'programYearId', 'applicationId']),
    ...mapState(useCcfriAppStore, ['CCFRIFacilityModel', 'getCCFRIById', 'getPreviousApprovedParentFee']),
    currentFacility() {
      return this.getNavByCCFRIId(this.$route.params.urlGuid);
    },
    previousProgramYearGuid() {
      //updated this to no longer look at the auth store for program year ID
      const programYear = this.programYearList.list.find(({ programYearId }) => programYearId == this.programYearId);
      return programYear.previousYearId;
    },
    previousProgramYearLabel() {
      const programYear = this.programYearList.list.find(({ programYearId }) => programYearId == this.programYearId);

      //if no RegEx match is found, this will return whatever the name is in full. Might look weird if the user set field is changed to something different.
      return programYear?.name.replace(/^.*\b(\d{4})\b.*$/, '$1');
    },
    isFormValidAndLoaded() {
      if (this.loading) {
        //we need this to disable button while the page is loading
        return false;
      }
      if (this.feeList.length === 0) {
        return true;
      }
      return this.isValidForm;
    },
  },
  watch: {
    //get facilityID from here and then set it !
    '$route.params.urlGuid': {
      async handler() {
        try {
          this.loading = true;
          await this.loadCCFRIFacility(this.$route.params.urlGuid);
          if (this.CCFRIFacilityModel.existingFeesCorrect === CCFRI_FEE_CORRECT_TYPES.YES) {
            this.model.q1 = 'Yes';
          } else if (this.CCFRIFacilityModel.existingFeesCorrect === CCFRI_FEE_CORRECT_TYPES.NO) {
            this.model.q1 = 'No';
          } else {
            this.model.q1 = undefined;
          }
          this.feeList = [];
          const prevFees = await this.getPreviousApprovedFees({
            facilityId: this.CCFRIFacilityModel.facilityId,
            programYearId: this.previousProgramYearGuid,
          });
          //only display last years child care fees
          const prevYearGuid = this.previousProgramYearGuid;
          prevFees?.childCareTypes?.forEach((item) => {
            if (item.programYearId == prevYearGuid) {
              this.feeList.push(item);
            }
          });
          this.feeList.sort((a, b) => a.orderNumber - b.orderNumber);
          this.loading = false;
        } catch (error) {
          console.log(error);
          if (this.CCFRIFacilityModel.previousCcfriId) {
            this.setFailureAlert('An error occured while getting CCFRI data');
          } else {
            this.setFailureAlert('The server was busy.  Please wait 10 seconds and refresh this screen.');
          }
        }
      },
      immediate: true,
      deep: true,
    },
  },
  created() {
    this.rules = rules;
  },
  methods: {
    ...mapActions(useCcfriAppStore, [
      'loadCCFRIFacility',
      'getPreviousCCFRI',
      'getPreviousApprovedFees',
      'setCCFRIFacilityModel',
      'addCCFRIToStore',
      'removeCCFRIFromStore',
    ]),
    previous() {
      this.$router.push(this.previousPath);
    },
    setFees(areFeesCorrect) {
      this.currentCCFRI = deepCloneObject(this.getCCFRIById(this.$route.params.urlGuid));
      this.currentCCFRI.prevYearFeesCorrect = areFeesCorrect;
      this.currentCCFRI.existingFeesCorrect = areFeesCorrect ? CCFRI_FEE_CORRECT_TYPES.YES : CCFRI_FEE_CORRECT_TYPES.NO;
      this.addCCFRIToStore({ ccfriId: this.$route.params.urlGuid, CCFRIFacilityModel: this.currentCCFRI });
    },
    async next() {
      this.loading = true;

      if (this.model.q1 == 'No') {
        this.setFees(false);
        await this.save();
      } else if (this.model.q1 == 'Yes') {
        this.setFees(true);
        await this.save();
      }
      this.$router.push(pcfUrlGuid(PATHS.CCFRI_NEW_FEES, this.programYearId, this.$route.params.urlGuid));
    },
    async save() {
      if (this.currentCCFRI.existingFeesCorrect) {
        const payload = { existingFeesCorrect: this.currentCCFRI.existingFeesCorrect };
        await ApiService.apiAxios.patch(`${ApiRoutes.APPLICATION_CCFRI}/${this.$route.params.urlGuid}`, payload);
      }
    },
    validateForm() {
      this.$refs.isValidForm?.validate();
    },
  },
};
</script>
