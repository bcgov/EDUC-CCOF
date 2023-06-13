<template>
  <v-container>

    <div class="row pt-4 justify-center text-center">
    <span class="text-h5">Child Care Operating Funding Program - {{ formattedProgramYear }}</span>
    </div>
    <br>
    <div class="row pt-4 justify-center">
    <!-- <span class="text-h5">What would you like to change?</span> -->
    </div>

    <v-form ref="isValidForm" value="false" v-model="isValidForm">

      <v-container>

        <p class="text-h6 text-center">What changes do you want to make?</p>
        <v-row justify="space-around">


          <SmallCard  class= "col-lg-6 " :disable="false">
            <template #content class="px-10">
              <p class="text-h6 text-center "> Add a New facility to an existing organization </p>
              <p class="px-2">
                This will lead you through the CCOF application process. Please have your facility, CCFRI and ECE-WE information ready.
              </p>
              <p class="px-2">
                You need to attach an <strong>updated</strong><i> Community Care And Assisted Living Act</i> license.
              </p>
            </template>
              <template #button class="ma-0 pa-0 ">
                <v-row justify="space-around">
                  <v-btn dark class="blueButton mb-10" @click="routeToFacilityAdd()" >Add new facility</v-btn>
                </v-row>
              </template>

          </SmallCard>

          <SmallCard  class= "col-lg-6 " :disable="false">
            <template #content class="px-10">
              <p class="text-h6 text-center">Report changes to your License or service</p>
              <p class="px-2">
                Please have your <i>Community Care And Assisted Living Act</i> license (if required) and other supporting documents ready.
              </p>
            </template>
              <template #button class="ma-0 pa-0 ">
                <v-row justify="space-around">
                  <v-btn dark class="blueButton mb-10" @click="goToChangeForm()" >Upload a Change Notification Form</v-btn>
                </v-row>
              </template>

          </SmallCard>


        </v-row>

        <v-skeleton-loader v-if="this.processing" :loading="this.processing"
                                    type="paragraph, text@3, text@3, paragraph"></v-skeleton-loader>

        <v-row v-else>
          <v-col class= "col-lg-10 mt-3">
            <h2>Change History</h2>
            <v-row>
            <v-col class= "col-lg-3">
                <h4>Change Requests</h4>
              </v-col>
              <v-col class= "col-lg-3">
                <h4>Status</h4>
              </v-col>
              <v-col class= "col-lg-3">
                <h4>Submission Date</h4>
              </v-col>
              <v-col class= "col-lg-2">

              </v-col>

              <v-col class= "col-lg-1">

              </v-col>
            </v-row>
            <!--TODO: ADD skeleton loader and isLoaded var-->
            <!--TODO: Change action data taken from first index! needs improvement -->
            <v-row v-for=" (changeRequest, index) in changeRequestStore" :key="index">
              <v-col class= "col-lg-3">
                <h4></h4>

                <!--TODO: ADD a function that maps these values-->
                {{changeRequest.changeActions[0].changeType == 'PDF_CHANGE' ? 'CHANGE FORM' : 'NEW FACILITY'}}
              </v-col>
              <v-col class= "col-lg-3">
                {{changeRequest.changeActions[0].status == 1? 'ACTIVE' : 'INACTIVE'}}
              </v-col>
              <v-col class= "col-lg-3">
                {{ changeRequest.createdOnDate }}
              </v-col>
                <v-col class= "col-lg-2">
                  <v-btn class= "" @click="continueButton(changeRequest.changeActions[0].changeType, changeRequest.changeActions[0].changeActionId, changeRequest.changeActions[0].changeRequestId)">Continue</v-btn>
                </v-col>
                <v-col class= "col-lg-1">
                  <v-btn class= "" @click="deleteRequest(changeRequest.changeActions[0].changeRequestId)">Delete</v-btn>
                </v-col>
            </v-row>
          </v-col>
        </v-row>


      </v-container>
    </v-form>


    <NavButton :isNextDisplayed="false" :isSaveDisplayed="false"
         :isNextDisabled="true" :isProcessing="processing"
        @previous="previous" @next="false" @validateForm="validateForm()" @save="save(true)"></NavButton>
  </v-container>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import { PATHS, CHANGE_URL_PREFIX } from '@/utils/constants';
import alertMixin from '@/mixins/alertMixin';
import SmallCard from '../guiComponents/SmallCard.vue';
import NavButton from '../util/NavButton.vue';



export default {
  name: 'ReportChange',
  mixins: [alertMixin],
  data() {
    return {
      isValidForm: false,
      processing: false,
      loading: false,
      rules: [
        (v) => !!v || 'Required.',
      ],
    };
  },
  computed: {
    ...mapState('application', ['applicationStatus', 'formattedProgramYear', 'applicationId']),
    ...mapState('reportChanges', ['changeRequestStore',]),
    isReadOnly() {
      if (this.unlockedFacilities) {
        return false;
      }
      return (this.applicationStatus === 'SUBMITTED');
    },

  },
  methods: {
    ...mapActions('reportChanges', ['loadChangeRequest', 'deleteChangeRequest', 'createChangeRequest' ]),
    ...mapMutations('reportChanges', ['setChangeRequestId']),
    async previous() {
      this.$router.push(PATHS.home);
    },

    isPageComplete() {

    },
    next() {
      this.$router.push(PATHS.home);
    },
    routeToFacilityAdd(){
      this.$router.push(PATHS.reportChange.facInfo);
    },
    continueButton(changeType, changeActionId = null,  changeRequestId = null){
      if (changeType == 'PDF_CHANGE'){
        this.goToChangeForm(changeActionId, changeRequestId);
      }
      else if (changeType == 'NEW_FACILITY'){
        this.setChangeRequestId(changeRequestId);
        this.$router.push(CHANGE_URL_PREFIX + '/' + changeRequestId + '/facility/' + this.changeRequestStore[changeRequestId].changeActions[0].facilityData.facilityId);
      }
    },
    async goToChangeForm(changeActionId = null,  changeRequestId = null){

      this.processing = true;

      //create the change action first, then push it
      if (!changeActionId){

        let newReq;
        try{
          newReq = await this.createChangeRequest();
        }
        catch(error){
          console.log('unable to create a new Req');
          this.setFailureAlert('An error occurred while creating a change request Please try again later.');
        }

        this.$router.push(PATHS.reportChange.notificationForm + '/' + newReq.changeActionId);
      }
      else{
        this.setChangeRequestId(changeRequestId);
        this.$router.push(PATHS.reportChange.notificationForm + '/' + changeActionId);
      }

    },
    async deleteRequest(requestId){
      this.processing = true;
      try{
        await this.deleteChangeRequest(requestId);
      }
      catch(error){
        this.setFailureAlert('An error occurred while deleting a change request Please try again later.');
      }

      this.processing = false;
    }
  },
  async mounted() {
    this.processing = true;
    console.log(this.applicationId);
    await this.loadChangeRequest();
    this.processing = false;
  },
  beforeRouteLeave(_to, _from, next) {
    //this.$store.commit('ccfriApp/model', this.model);
    next();
  },
  components: { SmallCard, NavButton }
};
</script>
<style scoped>
.blueBorder{
  border-top: 5px solid #003366 !important;
}
.blueButton {
  background-color: #003366 !important;
}
.blueText {
  color: rgb(0, 52, 102) !important;
}
</style>
