<template>
  <v-container>

    <div class="row pt-4 justify-center">
      <span class="text-h5">Child Care Operating Funding Program - {{ formattedProgramYear }} Program Confirmation Form</span>
    </div>
    <br>
    <div class="row pt-4 justify-center">
      <span class="text-h5">Child Care Fee Reduction Initiative (CCFRI)</span>
    </div>
    <br>
    <div class="row pt-4 justify-center">
      <span class="text-h5">Confirm CCFRI participation for each facility.</span>
    </div>
    <v-btn
      class = "mx-0 justify-end"
      @click="toggleAll()"
      dark color='#003366'
      :disabled="isReadOnly"
      >
      Opt in All Facilities
    </v-btn>
      <LargeButtonContainer>


        <v-form ref="isValidForm" value="false" v-model="isValidForm">

        <!-- <v-skeleton-loader max-height="475px" v-if="!facilityList" :loading="loading"  type="image, image, image"></v-skeleton-loader> -->

        <v-card elevation="4" class="py-2 px-5 mx-2 my-10 rounded-lg col-12 " min-width="500px"
          rounded
          tiled
          exact tile
          :ripple="false"
          v-for="({facilityName, facilityId, licenseNumber, ccfriOptInStatus } , index) in navBarList" :key="facilityId">
          <v-card-text>
            <v-row>
              <v-col cols="" class="col-12 col-md-7">
                <p class="text--primary "><strong> Facility Name: {{facilityName}}</strong></p>
                <p class="text--primary"> License: {{licenseNumber}}</p>
                <strong> <p class="text--primary  " >Opt In:  {{ccfriOptInStatus == "IN" ? "IN"  :  ccfriOptInStatus == "1" ? "IN" :  ccfriOptInStatus == "0" ?"OUT" :  "NOT SELECTED" }} </p> </strong>
              </v-col>
              <v-col cols="" class="d-flex align-center col-12 col-md-5"
                v-if="!showOptStatus[index]"
              >

                <v-btn
                class = "my-10 mx-14 justify-end"
                @click="toggle(index)"
                :showOptStatus = "showOptStatus[index]"
                dark color='#003366'
                :rules = "rules"
                :disabled="isReadOnly"
                >
                  UPDATE
                </v-btn>
              </v-col>
              <v-col v-else cols="" class="d-flex align-center col-12 col-md-5"
              >
                <v-row>
                  <v-radio-group
                    v-model="ccfriOptInOrOut[index]"
                    class = "mx-12"
                    :rules = "rules"
                  >
                    <v-radio
                      label="Opt In"
                      value="1"

                    ></v-radio>
                    <v-radio
                      label="Opt Out"
                      value="0"

                    ></v-radio>
                  </v-radio-group>
                </v-row>
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
import LargeButtonContainer from '../../guiComponents/LargeButtonContainer.vue';
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
    ...mapState('navBar', ['navBarList', 'userProfileList','changeRequestId']),
    ...mapGetters('navBar', ['previousPath','isChangeRequest']),
    ...mapState('reportChanges',['userProfileChangeRequests']),
    ...mapGetters('reportChanges',['changeRequestStatus']),
    isReadOnly(){
      if (this.unlockedFacilities) {
        return false;
      }
      else if(this.isChangeRequest){
        if (!this.changeRequestStatus){
          return false;
        }
        else if(this.changeRequestStatus!=='INCOMPLETE'){
          return true;
        }
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
      await this.save(false);

      let firstOptInFacility = this.navBarList.find(({ ccfriOptInStatus }) =>  ccfriOptInStatus == 1 );

      //if all facilites are opt OUT, go to ECE WE
      if(!firstOptInFacility){
        //when ECEWE report change is integrated, add in a statement here to send to the appropirate page
        if (isChangeRequest(this) ) {
          this.$router.push(changeUrl(PATHS.ECEWE_ELIGIBILITY, this.$route.params.changeRecGuid));
        }
        else {
          this.$router.push(pcfUrl(PATHS.ECEWE_ELIGIBILITY, this.programYearId));
        }
      }
      //if application is a change request, go to add new fees
      else if (isChangeRequest(this) ) {
        this.$router.push(changeUrlGuid(PATHS.CCFRI_NEW_FEES, firstOptInFacility.changeRequestId, firstOptInFacility.ccfriApplicationId));

      }
      //if application locked, send to add new fees
      else if (this.isReadOnly ) {
        this.$router.push(pcfUrlGuid(PATHS.CCFRI_NEW_FEES, this.programYearId, firstOptInFacility.ccfriApplicationId));
      }
      //if CCFRI is being renewed, go to page that displays fees
      else if (this.isRenewal){
        this.$router.push(pcfUrlGuid(PATHS.CCFRI_CURRENT_FEES, this.programYearId, firstOptInFacility.ccfriApplicationId));
      }
      // else go directly to addNewFees page
      else {
        this.$router.push(pcfUrlGuid(PATHS.CCFRI_NEW_FEES, this.programYearId, firstOptInFacility.ccfriApplicationId));
      }
    },
    validateForm() {
      this.$refs.isValidForm?.validate();
    },
    async save(withAlert) {
      this.processing = true;
      let payload = [];

      for (let i = 0; i < this.navBarList.length; i++) {
      //change this to only send payloads with value chosen --- don't send undefined
        if (!ccfriOptInOrOut[i]){
          continue;
        }
        if (this.navBarList[i].ccfriOptInStatus != this.ccfriOptInOrOut[i]) { // only add if status has changed
          const userProfileFacility = this.userProfileList.find(el => el.facilityId == this.navBarList[i].facilityId);
          if (userProfileFacility) {
            userProfileFacility.ccfriOptInStatus = this.ccfriOptInOrOut[i];
          }
          payload.push( {
            applicationID : this.applicationId, //CCOF BASE application ID
            facilityID : this.navBarList[i].facilityId,
            optInResponse: this.ccfriOptInOrOut[i],
            ccfriApplicationId: this.navBarList[i].ccfriApplicationId,
            changeRequestFacilityId: this.navBarList[i].changeRequestNewFacilityId? this.navBarList[i].changeRequestNewFacilityId : undefined,
            //toDo: check if is Change request first, then if so, attached the change request Facility ID GUID
            //so it can be linked in the backend. It works with the above hardcoded guid ^
            //I did not implement fully because it sounds like we might get that info back from profiderProfile
          });
        }
      }//end for loop
      //Refresh the filtered list
      this.refreshNavBarList();
      if (payload.length > 0) {
        try {
          const response = await ApiService.apiAxios.patch('/api/application/ccfri/', payload);

          response.data.forEach(item => {
            if (item.ccfriApplicationId) {
              this.userProfileList.find(facility => {
                if (facility.facilityId == item.facilityId) {
                  facility.ccfriApplicationId = item.ccfriApplicationId;
                }
              });
            }
          });
          this.forceNavBarRefresh();
          if (withAlert) {
            this.setSuccessAlert('Success! CCFRI Opt In status has been saved.');
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
