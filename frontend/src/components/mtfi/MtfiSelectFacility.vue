<template>
  <v-container>
    <div class="row pt-4 text-center">
      <span class="text-h5">Child Care Operating Funding Program - Request a Parent Fee Increase</span>
    </div>
    <div class="row pt-4 text-center">
      <span class="text-h5 font-weight-bold">Child Care Fee Reduction Initiative (CCFRI)</span>
    </div>
    <div class="row pt-4 text-center">
      <span class="text-h6 font-weight-bold blueText">{{ organizationName }}</span>
    </div>
    <v-row no-gutters class="justify-center align-center pt-12">
      <v-tooltip location="top" color="#003366">
        <template #activator="{ props }">
          <v-icon size="x-large" class="pr-5 noticeInfoIcon" v-bind="props"> mdi-help-circle </v-icon>
        </template>
        <span>You can request a Mid-term Fee Increase after the facility has been approved for the fiscal year.</span>
      </v-tooltip>
      <div class="text-h5">Please select which facility you would like to update</div>
    </v-row>
    <div v-if="loading" class="my-12">
      <v-skeleton-loader max-height="475px" :loading="true" type="image, image, image" />
    </div>
    <LargeButtonContainer v-else>
      <v-form ref="isValidForm" v-model="isValidForm">
        <v-card
          v-for="(
            { facilityName, facilityAccountNumber, licenseNumber, ccfriOptInStatus, ccfriStatus }, index
          ) in filteredUserProfileList"
          :key="index"
          elevation="4"
          class="py-2 px-5 mx-2 my-10 rounded-lg col-12"
          min-width="500px"
          :disabled="isFacilityDisabled(ccfriOptInStatus, ccfriStatus) || isReadOnly"
        >
          <v-card-text>
            <v-row>
              <v-col class="col-12 col-xl-10 col-lg-10 col-md-9">
                <p class="text--primary">
                  <strong> Facility ID: {{ facilityAccountNumber }} </strong>
                </p>
                <p class="text--primary">
                  <strong>Facility Name: {{ facilityName }}</strong>
                </p>
                <p class="text--primary">
                  <strong>Licence Number: {{ licenseNumber }}</strong>
                </p>
              </v-col>
              <v-col v-if="ccfriOptInStatus == 1" class="d-flex align-center justify-center">
                <v-checkbox
                  v-model="checkbox[index]"
                  style="transform: scale(1.5)"
                  :disabled="isReadOnly"
                  :loading="processing"
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-form>
    </LargeButtonContainer>

    <NavButton
      :is-next-displayed="true"
      :is-save-displayed="true"
      :is-save-disabled="loading || isReadOnly"
      :is-next-disabled="loading || isNextButtonDisabled"
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
import { useOrganizationStore } from '@/store/ccof/organization.js';
import { useNavBarStore } from '@/store/navBar.js';
import { useReportChangesStore } from '@/store/reportChanges.js';

import LargeButtonContainer from '@/components/guiComponents/LargeButtonContainer.vue';
import { PATHS, changeUrlGuid, CHANGE_TYPES } from '@/utils/constants.js';
import alertMixin from '@/mixins/alertMixin.js';
import NavButton from '@/components/util/NavButton.vue';

let ccfriOptInOrOut = {};
let textInput = '';
let model = { x: [], ccfriOptInOrOut, textInput };

export default {
  name: 'MtfiSelectFacility',
  components: { LargeButtonContainer, NavButton },
  mixins: [alertMixin],
  async beforeRouteLeave(_to, _from, next) {
    if (!this.isReadOnly && !this.loading) {
      await this.save(false);
    }
    next();
  },
  data() {
    return {
      model,
      isValidForm: false,
      processing: false,
      loading: true,
      ccfriOptInOrOut,
      checkbox: [],
    };
  },
  computed: {
    ...mapState(useApplicationStore, ['programYearId', 'applicationId', 'isRenewal']),
    ...mapState(useOrganizationStore, ['organizationId', 'organizationName']),
    ...mapState(useNavBarStore, ['userProfileList', 'navBarList', 'previousPath']),
    ...mapState(useReportChangesStore, ['changeActionId', 'mtfiFacilities', 'changeRequestStatus']),
    isReadOnly() {
      return this.changeRequestStatus != 'INCOMPLETE';
    },
    isNextButtonDisabled() {
      return !this.checkbox?.includes(true);
    },
    // CCFRI-2584 - All facilties displayed in the PCF should be shown on the MTFI Select Facility page -> same logic as filterNavBar() in navBar.js
    filteredUserProfileList() {
      return this.userProfileList.filter(
        (el) => el.facilityAccountNumber && (el.facilityStatus || this.isMtfiCreated(el)),
      );
    },
  },
  async beforeMount() {
    this.loading = true;
    try {
      await this.getChangeRequest(this.$route.params.changeRecGuid);
      this.filteredUserProfileList?.forEach((facility, index) => {
        if (this.mtfiFacilities?.find((item) => item.facilityId == facility.facilityId)) this.checkbox[index] = true;
      });
      this.loading = false;
      this.refreshNavBarList();
    } catch (error) {
      console.log('Error loading Change Request.', error);
      this.setFailureAlert('Error loading change request.');
    }
  },
  methods: {
    ...mapActions(useNavBarStore, ['forceNavBarRefresh', 'refreshNavBarList', 'removeChangeMap', 'loadChangeRequest']),
    ...mapActions(useReportChangesStore, ['createChangeRequestMTFI', 'deleteChangeRequestMTFI', 'getChangeRequest']),
    isFacilityDisabled(ccfriOptInStatus, ccfriStatus) {
      return ccfriOptInStatus == 0 || ccfriStatus != 'APPROVED';
    },
    isMtfiCreated(facility) {
      let index = this.mtfiFacilities?.findIndex((item) => item.facilityId === facility?.facilityId);
      return index > -1;
    },
    previous() {
      this.$router.push(PATHS.ROOT.CHANGE_LANDING);
    },
    async next() {
      if (!this.isReadOnly) {
        await this.save(false);
      }
      this.$router.push(
        changeUrlGuid(
          PATHS.MTFI_GROUP_FEE_VERIFICATION,
          this.$route.params.changeRecGuid,
          this.navBarList[0]?.ccfriApplicationId,
          CHANGE_TYPES.MTFI,
        ),
      );
    },
    validateForm() {
      this.$refs.isValidForm?.validate();
    },
    isMTFIExisted(facility) {
      let index = this.mtfiFacilities?.findIndex((item) => item.facilityId == facility.facilityId);
      return index > -1;
    },
    getNewMTFIFacilities() {
      let newMTFIFacilities = [];
      this.checkbox?.forEach((item, index) => {
        let facility = this.filteredUserProfileList[index];
        if (item && facility && !this.isMTFIExisted(facility)) {
          this.removeChangeMap();
          newMTFIFacilities.push({
            facilityID: facility.facilityId,
            applicationID: this.applicationId,
            changeActionId: this.changeActionId,
            optInResponse: 1,
            programYearId: this.programYearId,
            organizationId: this.organizationId,
          });
        }
      });
      return newMTFIFacilities;
    },
    getDeleteMTFIFacilities() {
      let deleteMTFIFacilities = [];
      this.checkbox?.forEach((item, index) => {
        let mtfiFacility = this.mtfiFacilities?.find(
          (item) => item.facilityId == this.filteredUserProfileList[index]?.facilityId,
        );
        if (!item && mtfiFacility && this.isMTFIExisted(mtfiFacility)) {
          this.removeChangeMap();
          deleteMTFIFacilities.push({
            facilityId: mtfiFacility.facilityId,
            changeRequestMtfiId: mtfiFacility.changeRequestMtfiId,
            ccfriApplicationId: mtfiFacility.ccfriApplicationId,
          });
        }
      });
      return deleteMTFIFacilities;
    },
    async save(withAlert) {
      this.processing = true;
      try {
        let newMTFIFacilities = await this.getNewMTFIFacilities();
        let deleteMTFIFacilities = await this.getDeleteMTFIFacilities();

        if (newMTFIFacilities?.length > 0) await this.createChangeRequestMTFI(newMTFIFacilities);

        if (deleteMTFIFacilities?.length > 0) await this.deleteChangeRequestMTFI(deleteMTFIFacilities);

        await this.loadChangeRequest(this.$route.params.changeRecGuid);
        this.processing = false;
        if (withAlert) {
          this.setSuccessAlert('Success! Your update has been saved.');
        }
        this.refreshNavBarList();
      } catch (error) {
        console.log(error);
        this.setFailureAlert('An error occurred while saving. Please try again later.');
      }
    },
  },
};
</script>
<style scoped>
.blueText {
  color: rgb(0, 52, 102) !important;
}
</style>
