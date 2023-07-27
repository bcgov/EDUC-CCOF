<template>
  <v-container>

    <div class="row pt-4 justify-center">
      <span class="text-h5">Child Care Operating Funding Program - Request a Parent Fee Increase</span>
    </div>
    <br>
    <div class="row pt-4 justify-center">
      <span class="text-h5">Child Care Fee Reduction Initiative (CCFRI)</span>
    </div>
    <br>
    <div class="row pt-4 justify-center">
      <span class="text-h5">Please select which facility you would like to update</span>
    </div>
    <!-- <v-btn
      class = "mx-0 justify-end"
      @click="toggleAll()"
      dark color='#003366'
      :disabled="isReadOnly"
      >
      Opt in All Facilities
    </v-btn> -->
      <LargeButtonContainer>


        <v-form ref="isValidForm" value="false" v-model="isValidForm">

        <!-- <v-skeleton-loader max-height="475px" v-if="!facilityList" :loading="loading"  type="image, image, image"></v-skeleton-loader> -->

        <v-card elevation="4" class="py-2 px-5 mx-2 my-10 rounded-lg col-12 " min-width="500px"
          rounded
          tiled
          exact tile
          :ripple="false"
          :disabled="!ccfriOptInStatus==1"
          v-for="({facilityName, facilityId, licenseNumber, ccfriOptInStatus } , index) in userProfileList" :key="facilityId">
          <v-card-text >
            <v-row>
              <v-col cols="" class="col-12 col-md-8">
                <p class="text--primary "><strong> Facility Name: {{facilityName}}</strong></p>
                <p class="text--primary"> License: {{licenseNumber}}</p>
                <strong> <p class="text--primary  " >Opt In:  {{ccfriOptInStatus == "IN" ? "IN"  :  ccfriOptInStatus == "1" ? "IN" :  ccfriOptInStatus == "0" ?"OUT" :  "NOT SELECTED" }} </p> </strong>
              </v-col>
              <v-col cols="" class="d-flex align-center pl-13 col-12 col-md-4"
              >

                <v-checkbox v-model="checkbox1"> </v-checkbox>

              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-form>


      </LargeButtonContainer>

      <NavButton :isNextDisplayed="true" :isSaveDisplayed="true"
        :isSaveDisabled="isReadOnly" :isNextDisabled="!isPageComplete()" :isProcessing="processing"
        @previous="previous" @next="next" @validateForm="validateForm()" @save="save(true)"></NavButton>
  </v-container>
</template>

<script>



import { mapState, mapMutations, mapGetters } from 'vuex';
import LargeButtonContainer from '../guiComponents/LargeButtonContainer.vue';
import { PATHS, changeUrl, changeUrlGuid, pcfUrl, pcfUrlGuid } from '@/utils/constants';
import ApiService from '@/common/apiService';
import alertMixin from '@/mixins/alertMixin';
import NavButton from '@/components/util/NavButton';
import { isChangeRequest } from '@/utils/common';


let ccfriOptInOrOut = {};
let textInput = '' ;
let model = { x: [], ccfriOptInOrOut, textInput };

export default {
  name: 'CcfriLandingPage',
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
      loading: false,
      ccfriOptInOrOut,
      rules: [
        (v) => !!v  || 'Required.',
      ],
    };
  },
  computed: {
    ...mapState('application', ['applicationStatus',  'formattedProgramYear', 'programYearId', 'applicationId']),
    ...mapState('app', ['isRenewal', 'ccfriOptInComplete', 'programYearList']),
    ...mapState('navBar', ['navBarList', 'userProfileList']),
    ...mapGetters('navBar', ['previousPath']),
    isReadOnly(){
      if (this.unlockedFacilities || isChangeRequest(this)) {
        return false;
      }
      else
        return (this.applicationStatus === 'SUBMITTED');
    },
    unlockedFacilities(){
      return this.navBarList.some(facility => facility.unlockCcfri);
    },

  },
  beforeMount: function() {
    this.showOptStatus = new Array(this.navBarList.length).fill(false);

    this.navBarList.forEach((fac, index) => {
      if (fac.ccfriOptInStatus){
        this.$set(this.ccfriOptInOrOut, index, String(fac.ccfriOptInStatus));
      }
      else {
        this.$set(this.ccfriOptInOrOut, index, undefined);
      }
    });
  },
  methods: {
    ...mapMutations('navBar', ['forceNavBarRefresh', 'refreshNavBarList']),
    toggle(index) {
      this.$set(this.showOptStatus, index, true);
    },
    toggleAll(){
      this.navBarList.forEach((fac, index) => {
        this.toggle(index);
        this.$set(this.ccfriOptInOrOut, index, '1');
      });
    },
    previous() {
      this.$router.push(this.previousPath);
    },
    //checks to ensure each facility has a CCFRI application started before allowing the user to proceed.
    isPageComplete(){
      const radioButtonsIncomplete = Object.values(this.ccfriOptInOrOut).includes(undefined);

      let allOptStatusIncomplete = false;
      for (const element of this.navBarList) {
        if (element.ccfriOptInStatus == null){
          allOptStatusIncomplete = true;
          break;
        }
      }

      //if all opt in status is incomplete, disable next button
      if (allOptStatusIncomplete && radioButtonsIncomplete){
        return false;
      }

      return this.isValidForm;
    },
    async next() {

      this.$router.push(changeUrlGuid(PATHS.MTFI_GROUP_FEE_VERIFICATION, this.$route.params.changeRecGuid, 'f672d73f-2b2b-ee11-bdf4-000d3a09d499' ));

      //await this.save(false);

      //let firstOptInFacility = this.navBarList.find(({ ccfriOptInStatus }) =>  ccfriOptInStatus == 1 );

      // //if all facilites are opt OUT, go to ECE WE
      // if(!firstOptInFacility){
      //   //when ECEWE report change is integrated, add in a statement here to send to the appropirate page
      //   if (isChangeRequest(this) ) {
      //     this.$router.push(changeUrl(PATHS.ECEWE_ELIGIBILITY, this.$route.params.changeRecGuid));
      //   }
      //   else {
      //     this.$router.push(pcfUrl(PATHS.ECEWE_ELIGIBILITY, this.programYearId));
      //   }
      // }

    },
    validateForm() {
      this.$refs.isValidForm?.validate();
    },
    async save(withAlert) {
      this.processing = true;
      let payload = [];

      //Refresh the filtered list
      this.refreshNavBarList();

      if (withAlert) {
        this.setSuccessAlert('Success! CCFRI Opt In status has been saved.');
      }
      this.processing = false;
    },
  },
  mounted() {
    this.model = this.$store.state.ccfriApp.model ?? model;
  },
  beforeRouteLeave(_to, _from, next) {
    this.$store.commit('ccfriApp/model', this.model);
    next();
  },
  components: {LargeButtonContainer,NavButton}
};
</script>
