<template>
  <v-container>
    <div align="center">
      <div class="text-h5">
        Child Care Operating Funding Program - {{ formattedProgramYear }} Program Confirmation Form
      </div>
      <div class="text-h5 my-6">Child Care Fee Reduction Initiative (CCFRI)</div>
      <div class="text-h5 my-6">Confirm CCFRI participation for each facility.</div>
    </div>

    <v-btn
      dark
      :color="isReadOnly ? '' : '#003366'"
      :disabled="isReadOnly"
      class="mx-0 justify-end"
      @click="toggleAll()"
    >
      Opt-In All Facilities
    </v-btn>
    <LargeButtonContainer>
      <v-form ref="form" v-model="isValidForm">
        <!-- <v-skeleton-loader max-height="475px" v-if="!facilityList" :loading="loading"  type="image, image, image"></v-skeleton-loader> -->

        <v-card
          v-for="(
            { facilityName, facilityId, licenseNumber, ccfriOptInStatus, facilityAccountNumber }, index
          ) in navBarList"
          :key="facilityId"
          elevation="4"
          class="py-2 px-5 mx-2 my-10 rounded-lg col-12"
          min-width="500px"
          rounded
          tiled
          exact
          tile
          :ripple="false"
        >
          <v-card-text>
            <v-row>
              <v-col cols="" class="col-12 col-md-7">
                <p v-if="facilityAccountNumber" class="text--primary">
                  <strong> Facility ID: {{ facilityAccountNumber }}</strong>
                </p>
                <p class="text--primary">
                  <strong> Facility Name: {{ facilityName }}</strong>
                </p>
                <p class="text--primary">
                  <strong>Licence Number: {{ licenseNumber }}</strong>
                </p>
                <strong>
                  <p class="text--primary">
                    Opt-In:
                    {{
                      ccfriOptInStatus == 'IN'
                        ? 'IN'
                        : ccfriOptInStatus == '1'
                          ? 'IN'
                          : ccfriOptInStatus == '0'
                            ? 'OUT'
                            : 'NOT SELECTED'
                    }}
                  </p>
                </strong>
              </v-col>
              <v-col v-if="!showOptStatus[index]" cols="" class="d-flex align-center col-12 col-md-5">
                <v-btn
                  class="my-10 mx-14 justify-end"
                  :show-opt-status="showOptStatus[index]"
                  dark
                  :color="isReadOnly ? '' : '#003366'"
                  :rules="rules"
                  :disabled="isReadOnly"
                  @click="toggle(index)"
                >
                  UPDATE
                </v-btn>
              </v-col>
              <v-col v-else cols="" class="d-flex align-center col-12 col-md-5">
                <v-row>
                  <v-radio-group v-model="ccfriOptInOrOut[index]" class="mx-12" :rules="rules">
                    <v-radio label="Opt-In" value="1" />
                    <v-radio label="Opt-Out" value="0" />
                  </v-radio-group>
                </v-row>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-form>
    </LargeButtonContainer>

    <NavButton
      :is-next-displayed="true"
      :is-save-displayed="true"
      :is-save-disabled="isReadOnly"
      :is-next-disabled="!isPageComplete()"
      :is-processing="processing"
      @previous="previous"
      @next="next"
      @validate-form="validateForm()"
      @save="save(true)"
    />
  </v-container>
</template>

<script>
import { mapState, mapActions } from 'pinia';
import { useApplicationStore } from '@/store/application.js';
import { useAppStore } from '@/store/app.js';
import { useNavBarStore } from '@/store/navBar.js';
import { useReportChangesStore } from '@/store/reportChanges.js';

import LargeButtonContainer from '@/components/guiComponents/LargeButtonContainer.vue';
import NavButton from '@/components/util/NavButton.vue';

import alertMixin from '@/mixins/alertMixin.js';
import ApiService from '@/common/apiService.js';
import { PATHS, changeUrl, changeUrlGuid, pcfUrl, pcfUrlGuid } from '@/utils/constants.js';
import { isChangeRequest } from '@/utils/common.js';
import { ApiRoutes } from '@/utils/constants';

let ccfriOptInOrOut = {};
let textInput = '';
let model = { x: [], ccfriOptInOrOut, textInput };

export default {
  name: 'CcfriLandingPage',
  components: { LargeButtonContainer, NavButton },
  mixins: [alertMixin],
  beforeRouteLeave(_to, _from, next) {
    next();
  },
  data() {
    return {
      isUnlocked: false,
      originalFacilityList: [],
      model,
      //textInput,
      showOptStatus: '',
      isValidForm: true,
      processing: false,
      loading: false,
      ccfriOptInOrOut,
      rules: [(v) => !!v || 'Required.'],
    };
  },
  computed: {
    ...mapState(useApplicationStore, [
      'applicationStatus',
      'formattedProgramYear',
      'programYearId',
      'applicationId',
      'isRenewal',
    ]),
    ...mapState(useAppStore, ['programYearList']),
    ...mapState(useNavBarStore, [
      'navBarList',
      'userProfileList',
      'changeRequestId',
      'previousPath',
      'isChangeRequest',
      'getChangeActionNewFacByFacilityId',
    ]),
    ...mapState(useReportChangesStore, ['changeRequestMap', 'changeRequestStatus']),
    isReadOnly() {
      if (this.unlockedFacilities) {
        return false;
      }
      if (this.isChangeRequest) {
        if (!this.changeRequestStatus) {
          return false;
        }
        return this.changeRequestStatus != 'INCOMPLETE';
      }
      return this.applicationStatus === 'SUBMITTED';
    },
    unlockedFacilities() {
      return this.navBarList.some((facility) => facility.unlockCcfri);
    },
  },
  beforeMount: function () {
    this.showOptStatus = new Array(this.navBarList.length).fill(false);

    this.navBarList.forEach((fac, index) => {
      if (fac.ccfriOptInStatus) {
        this.ccfriOptInOrOut[index] = String(fac.ccfriOptInStatus);
      } else {
        this.ccfriOptInOrOut[index] = undefined;
      }
    });
  },
  methods: {
    ...mapActions(useNavBarStore, ['forceNavBarRefresh', 'refreshNavBarList']),
    toggle(index) {
      this.showOptStatus[index] = true;
    },
    toggleAll() {
      this.navBarList.forEach((_fac, index) => {
        this.toggle(index);
        this.ccfriOptInOrOut[index] = '1';
      });
    },
    previous() {
      this.$router.push(this.previousPath);
    },
    //checks to ensure each facility has a CCFRI application started before allowing the user to proceed.
    isPageComplete() {
      const radioButtonsIncomplete = Object.values(this.ccfriOptInOrOut).includes(undefined);

      let allOptStatusIncomplete = false;
      for (const element of this.navBarList) {
        if (element.ccfriOptInStatus == null) {
          allOptStatusIncomplete = true;
          break;
        }
      }

      //if all opt in status is incomplete, disable next button
      if (allOptStatusIncomplete && radioButtonsIncomplete) {
        return false;
      }

      return this.isValidForm;
    },
    async next() {
      await this.save(false);

      let firstOptInFacility = this.navBarList.find(({ ccfriOptInStatus }) => ccfriOptInStatus == 1);

      //if all facilites are opt OUT, go to ECE WE
      if (!firstOptInFacility) {
        //when ECEWE report change is integrated, add in a statement here to send to the appropirate page
        if (isChangeRequest(this)) {
          this.$router.push(changeUrl(PATHS.ECEWE_ELIGIBILITY, this.$route.params.changeRecGuid));
        } else {
          this.$router.push(pcfUrl(PATHS.ECEWE_ELIGIBILITY, this.programYearId));
        }
      }
      //if application is a change request, go to add new fees
      else if (isChangeRequest(this)) {
        this.$router.push(
          changeUrlGuid(PATHS.CCFRI_NEW_FEES, this.$route.params.changeRecGuid, firstOptInFacility.ccfriApplicationId),
        );
      }
      //if application locked, send to add new fees
      else if (this.isReadOnly) {
        this.$router.push(pcfUrlGuid(PATHS.CCFRI_NEW_FEES, this.programYearId, firstOptInFacility.ccfriApplicationId));
      }
      //if CCFRI is being renewed, go to page that displays fees
      else if (this.isRenewal) {
        this.$router.push(
          pcfUrlGuid(PATHS.CCFRI_CURRENT_FEES, this.programYearId, firstOptInFacility.ccfriApplicationId),
        );
      }
      // else go directly to addNewFees page
      else {
        this.$router.push(pcfUrlGuid(PATHS.CCFRI_NEW_FEES, this.programYearId, firstOptInFacility.ccfriApplicationId));
      }
    },
    validateForm() {
      this.$refs.form?.validate();
    },
    async save(withAlert) {
      this.processing = true;
      let payload = [];

      for (let i = 0; i < this.navBarList.length; i++) {
        //change this to only send payloads with value chosen --- don't send undefined
        if (!ccfriOptInOrOut[i]) {
          continue;
        }

        let newFac = this.getChangeActionNewFacByFacilityId(this.navBarList[i].facilityId);

        if (this.navBarList[i].ccfriOptInStatus != this.ccfriOptInOrOut[i]) {
          // only add if status has changed
          let userProfileFacility = this.userProfileList.find((el) => el.facilityId == this.navBarList[i].facilityId);
          if (newFac) {
            newFac.ccfri.ccfriOptInStatus = this.ccfriOptInOrOut[i];
          } else {
            userProfileFacility.ccfriOptInStatus = this.ccfriOptInOrOut[i];
          }
          payload.push({
            applicationID: this.applicationId, //CCOF BASE application ID
            facilityID: this.navBarList[i].facilityId,
            optInResponse: this.ccfriOptInOrOut[i],
            ccfriApplicationId: this.navBarList[i].ccfriApplicationId,
            changeRequestNewFacilityId: newFac?.changeRequestNewFacilityId
              ? newFac.changeRequestNewFacilityId
              : undefined,
          });
        }
      }

      this.refreshNavBarList();
      if (payload.length > 0) {
        try {
          const response = await ApiService.apiAxios.patch(ApiRoutes.APPLICATION_CCFRI, payload);
          response.data.forEach((item) => {
            if (item.ccfriApplicationId) {
              this.userProfileList.find((facility) => {
                if (facility.facilityId == item.facilityId) {
                  facility.ccfriApplicationId = item.ccfriApplicationId;
                  //if this is a CR new facility - update the change action data in the navBar so the navBar will always be up to date without a reload to dynamics
                  let newFac = this.getChangeActionNewFacByFacilityId(item.facilityId);
                  if (newFac) {
                    newFac.ccfri.ccfriApplicationId = item.ccfriApplicationId;
                  }
                }
              });
            }
          });
          this.refreshNavBarList();
          this.forceNavBarRefresh();
          if (withAlert) {
            this.setSuccessAlert('Success! CCFRI Opt-In status has been saved.');
          }
        } catch (error) {
          console.info(error);
          if (withAlert) {
            this.setFailureAlert('An error occurred while saving. Please try again later.');
          }
        }
      }
      this.processing = false;
    },
  },
};
</script>
