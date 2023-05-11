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
            </v-row>
            <!--TODO: ADD skeleton loader and isLoaded var-->
            <v-row v-for=" (changeRequest, index) in changeActionStore" :key="index">
              <v-col class= "col-lg-3">
                <h4></h4>
                {{changeRequest.changeActions.changeType}}
              </v-col>
              <v-col class= "col-lg-3">
                {{changeRequest.changeActions.status}}
              </v-col>
              <v-col class= "col-lg-3">
                Date
              </v-col>
                <v-col class= "col-lg-2">
                  <v-btn class= "" @click="goToChangeForm(changeRequest.changeActions.changeActionId, changeRequest.changeActions.changeRequestId)">Continue</v-btn>
                </v-col>
                <v-col class= "col-lg-1">
                  <v-btn class= "" @click="deleteRequest(changeRequest.changeActions.changeRequestId)">Delete</v-btn>
                </v-col>
            </v-row>
          </v-col>
        </v-row>


      </v-container>
    </v-form>




      <v-row justify="space-around">
        <v-btn color="info" outlined x-large :loading="processing" @click="previous()">
          Back</v-btn>
      </v-row>
  </v-container>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import { PATHS } from '@/utils/constants';
import alertMixin from '@/mixins/alertMixin';
import SmallCard from '../guiComponents/SmallCard.vue';



export default {
  name: 'ReportChange',
  mixins: [alertMixin],
  data() {
    return {
      isUnlocked: false,
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
    ...mapState('app', ['navBarList', 'isRenewal', 'ccfriOptInComplete', 'programYearList']),
    ...mapState('reportChanges', ['changeActionStore',]),
    isReadOnly() {
      if (this.unlockedFacilities) {
        return false;
      }
      return (this.applicationStatus === 'SUBMITTED');
    },

  },
  methods: {
    ...mapMutations('app', ['setCcfriOptInComplete', 'forceNavBarRefresh','setNavBarStatus']),
    ...mapActions('navBar', ['getPreviousPath']),
    ...mapActions('reportChanges', ['loadChangeRequest', 'deleteChangeRequest', ]),
    ...mapMutations('reportChanges', ['setChangeRequestId']),
    async previous() {
      let path = await this.getPreviousPath();
      this.$router.push(path);
    },
    //checks to ensure each facility has a CCFRI application started before allowing the user to proceed.
    isPageComplete() {

    },
    next() {
      this.$router.push(PATHS.home);
    },
    routeToFacilityAdd(){
      this.setNavBarStatus('RC_NEW_FACILITY');
      this.$router.push(PATHS.group.facInfo);
    },
    goToChangeForm(changeActionId = null,  changeRequestId = null){
      if (!changeActionId){
        this.$router.push(PATHS.changeNotificationForm);
      }
      else{
        console.log('THIS IS THE ID U LOOK FOR', changeRequestId);
        this.setChangeRequestId(changeRequestId);
        this.$router.push(PATHS.changeNotificationForm + '/' + changeActionId);
      }

    },
    async deleteRequest(requestId){
      this.processing = true;
      await this.deleteChangeRequest(requestId);
      this.processing = false;
    }
  },
  async mounted() {
    this.processing = true;
    console.log(this.applicationId);
    await this.loadChangeRequest(this.applicationId);
    this.processing = false;
  },
  beforeRouteLeave(_to, _from, next) {
    //this.$store.commit('ccfriApp/model', this.model);
    next();
  },
  components: { SmallCard }
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
