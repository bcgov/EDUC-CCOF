<template>
  <v-container>

    <div class="row pt-4 justify-center">
      <span class="text-h5">Child Care Operating Funding Program - Request a Parent Fee Increase</span>
    </div>
    <div class="row pt-4 justify-center">
      <span class="text-h5 font-weight-bold">Child Care Fee Reduction Initiative (CCFRI)</span>
    </div>
    <div class="row pt-4 justify-center">
      <span class="text-h6 font-weight-bold blueText">{{this.organizationName}}</span>
    </div>
    <v-row no-gutters class="justify-center align-center pt-12">
      <v-tooltip top color="#003366">
        <template v-slot:activator="{ on, attrs }">
          <v-icon
            x-large
            v-bind="attrs" v-on="on"
            class="pr-5 noticeInfoIcon"
          >
            mdi-help-circle
          </v-icon>
        </template>
        <span>You can request a Mid-term Fee Increase after the facility has been approved for the fiscal year.</span>
      </v-tooltip>
      <div class="text-h5">
        Please select which facility you would like to update
      </div>
    </v-row>
    <div v-if="loading" class="my-12">
      <v-skeleton-loader max-height="475px" :loading="true" type="image, image, image"></v-skeleton-loader>
    </div>
    <LargeButtonContainer v-else>
      <v-form ref="isValidForm" value="false" v-model="isValidForm" >
        <v-card elevation="4" class="py-2 px-5 mx-2 my-10 rounded-lg col-12" min-width="500px"
          :disabled="isFacilityDisabled(ccfriOptInStatus, ccfriStatus) || isReadOnly"
          v-for="({facilityName, facilityAccountNumber, licenseNumber, ccfriOptInStatus, ccfriStatus} , index) in filteredUserProfileList" :key="index">
          <v-card-text>
            <v-row>
              <v-col class="col-12 col-xl-10 col-lg-10 col-md-9">
                <p class="text--primary">Facility ID: {{facilityAccountNumber}}</p>
                <p class="text--primary"><strong>Facility Name: {{facilityName}}</strong></p>
                <p class="text--primary">Licence #: {{licenseNumber}}</p>
              </v-col>
              <v-col v-if="ccfriOptInStatus==1" class="d-flex align-center justify-center">
                <v-checkbox style="transform: scale(1.5)" v-model="checkbox[index]" :disabled="isReadOnly" :loading="processing"></v-checkbox>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-form>
    </LargeButtonContainer>

    <NavButton :isNextDisplayed="true" :isSaveDisplayed="true"
      :isSaveDisabled="loading || isReadOnly" :isNextDisabled="loading || isNextButtonDisabled" :isProcessing="processing"
      @previous="previous" @next="next" @validateForm="validateForm()" @save="save(true)"></NavButton>
  </v-container>
</template>

<script>



import { mapState, mapMutations, mapGetters, mapActions } from 'vuex';
import LargeButtonContainer from '../guiComponents/LargeButtonContainer.vue';
import { PATHS, changeUrlGuid, CHANGE_TYPES } from '@/utils/constants';
import alertMixin from '@/mixins/alertMixin';
import NavButton from '@/components/util/NavButton';
import { isFacilityAvailable } from '@/utils/common';

let ccfriOptInOrOut = {};
let textInput = '' ;
let model = { x: [], ccfriOptInOrOut, textInput };

export default {
  name: 'MtfiSelectFacility',
  mixins: [alertMixin],
  data() {
    return {
      isUnlocked: false,
      originalFacilityList: [],
      model,
      //textInput,
      showOptStatus : '',
      isValidForm: false,
      processing: false,
      loading: true,
      ccfriOptInOrOut,
      checkbox: [],
      rules: [
        (v) => !!v  || 'Required.',
      ],
    };
  },
  computed: {
    ...mapState('application', ['programYearId', 'applicationId', 'isRenewal']),
    ...mapState('organization', ['organizationId', 'organizationName']),
    ...mapState('navBar', ['userProfileList','navBarList']),
    ...mapState('reportChanges', ['changeActionId','mtfiFacilities']),
    ...mapGetters('navBar', ['previousPath']),
    ...mapGetters('reportChanges',['changeRequestStatus']),

    isReadOnly() {
      return (this.changeRequestStatus != 'INCOMPLETE');
    },
    isNextButtonDisabled() {
      return (!this.checkbox?.includes(true));
    },
    // CCFRI-2584 - All facilties displayed in the PCF should be shown on the MTFI Select Facility page -> same logic as filterNavBar() in navBar.js
    filteredUserProfileList() {
      if (this.isRenewal) {
        return this.userProfileList.filter(el => el.facilityAccountNumber && (isFacilityAvailable(el) || this.isMtfiCreated(el)));
      }
      return this.userProfileList.filter(el => (!el.changeRequestId || el.facilityAccountNumber) && (isFacilityAvailable(el) || this.isMtfiCreated(el)));
    }
  },
  async beforeMount() {
    this.loading = true;
    try {
      await this.getChangeRequest(this.$route.params.changeRecGuid);
      this.filteredUserProfileList?.forEach((facility, index) => {
        if (this.mtfiFacilities?.find(item => item.facilityId == facility.facilityId))
          this.checkbox[index] = true;
      });
      this.loading = false;
      this.refreshNavBarList();
    } catch(error) {
      console.log('Error loading Change Request.', error);
      this.setFailureAlert('Error loading change request.');
    }
  },
  methods: {
    ...mapMutations('navBar', ['forceNavBarRefresh', 'refreshNavBarList', 'addToNavBar','removeChangeMap']),
    ...mapActions('reportChanges', ['createChangeRequestMTFI', 'deleteChangeRequestMTFI', 'getChangeRequest']),
    ...mapActions('navBar',['loadChangeRequest']),
    isFacilityDisabled(ccfriOptInStatus, ccfriStatus)  {
      return (ccfriOptInStatus == 0 || ccfriStatus != 'APPROVED');
    },
    isMtfiCreated(facility) {
      let index = this.mtfiFacilities?.findIndex(item => item.facilityId === facility?.facilityId);
      return index > -1;
    },
    previous() {
      this.$router.push(PATHS.ROOT.CHANGE_LANDING);
    },
    async next() {
      if (!this.isReadOnly) {
        await this.save(false);
      }
      this.$router.push(changeUrlGuid(PATHS.MTFI_GROUP_FEE_VERIFICATION, this.$route.params.changeRecGuid, this.navBarList[0]?.ccfriApplicationId, CHANGE_TYPES.MTFI));
    },
    validateForm() {
      this.$refs.isValidForm?.validate();
    },
    isMTFIExisted(facility) {
      let index = this.mtfiFacilities?.findIndex(item => item.facilityId == facility.facilityId);
      return (index > -1);
    },
    getNewMTFIFacilities() {
      let newMTFIFacilities = [];
      this.checkbox?.forEach((item, index) => {
        let facility = this.filteredUserProfileList[index];
        if (item && facility && !this.isMTFIExisted(facility)){
          this.removeChangeMap();
          newMTFIFacilities.push({
            'facilityID': facility.facilityId,
            'applicationID': this.applicationId,
            'changeActionId': this.changeActionId,
            'optInResponse': 1,
            // 'ccfriApplicationId': facility.ccfriApplicationId,
            // 'ccfriFacilityId': facility.ccfriFacilityId,
            'programYearId': this.programYearId,
            'organizationId': this.organizationId
          });
        }
      });
      return newMTFIFacilities;
    },
    getDeleteMTFIFacilities() {
      let deleteMTFIFacilities = [];
      this.checkbox?.forEach((item, index) => {
        let mtfiFacility = this.mtfiFacilities?.find(item => item.facilityId == this.filteredUserProfileList[index]?.facilityId);
        if (!item && mtfiFacility && this.isMTFIExisted(mtfiFacility)){
          this.removeChangeMap();
          deleteMTFIFacilities.push({
            'facilityId': mtfiFacility.facilityId,
            'changeRequestMtfiId': mtfiFacility.changeRequestMtfiId,
            'ccfriApplicationId': mtfiFacility.ccfriApplicationId,
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

        if (newMTFIFacilities?.length > 0)
          await this.createChangeRequestMTFI(newMTFIFacilities);

        if (deleteMTFIFacilities?.length > 0)
          await this.deleteChangeRequestMTFI(deleteMTFIFacilities);

        await this.loadChangeRequest(this.$route.params.changeRecGuid);
        this.processing = false;
        if (withAlert) {
          this.setSuccessAlert('Success! Your update has been saved.');
        }
        this.refreshNavBarList();
      } catch (error)  {
        console.log(error);
        this.setFailureAlert('An error occurred while saving. Please try again later.');
      }
    },
  },
  mounted() {
  },
  async beforeRouteLeave(_to, _from, next) {
    if (!this.isReadOnly && !this.loading) {
      await this.save(false);
    }
    next();
  },
  components: {LargeButtonContainer,NavButton}
};
</script>
<style scoped>
.blueText {
  color: rgb(0, 52, 102) !important;
}
</style>
