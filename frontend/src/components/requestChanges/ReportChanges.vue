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


          <SmallCard  class= "col-lg-6 " :disable="false" v-if="this.organizationProviderType == 'GROUP'">
            <template #content class="px-10">
              <p class="text-h6 text-center "> Add a New facility to an existing organization </p>
              <p class="px-2 text-center">
                This will lead you through the CCOF application process. Please have your facility, CCFRI and ECE-WE information ready.
              </p>
              <p class="px-2 text-center">
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
              <p class="px-2 text-center">
                Please have your <i>Community Care And Assisted Living Act</i> license (if required) and other supporting documents ready.
              </p>
            </template>
              <template #button class="ma-0 pa-0 ">
                <v-row justify="space-around">
                  <v-btn dark class="blueButton mb-10" @click="goToChangeForm()" >Upload a Change Notification Form</v-btn>
                </v-row>
              </template>

          </SmallCard>

          <SmallCard  class= "col-lg-6 " :disable="false">
            <template #content class="px-10">
              <p class="text-h6 text-center">Parent fee increase (MTFI)</p>
              <p class="px-2 text-center">
                Text description to be provided by the ministry.
              </p>
            </template>
              <template #button class="ma-0 pa-0 ">
                <v-row justify="space-around">
                  <v-btn dark class="blueButton mb-10" @click="goToMTFI()" >Update parent fees</v-btn>
                </v-row>
              </template>

          </SmallCard>


        </v-row>

        <v-row no-gutters id="change-request-history">
          <v-col class= "col-lg-12 mt-10">
            <h2>Change History</h2>
          </v-col>
        </v-row>
        <v-row v-if="processing">
          <v-col >
            <v-skeleton-loader :loading="processing" type="paragraph, text@3, text@3, paragraph"></v-skeleton-loader>
          </v-col>
        </v-row>
        <v-data-table
          :headers="headers"
          :items="allChangeRequests"
          :height = "maxChangeHistoryTableHeight"
          mobile-breakpoint="960"
          fixed-header
          :item-class="getChangeRequestStyle"
          class="elevation-4 my-4"
          disable-pagination hide-default-footer
          :sort-by="['priority', 'submissionDate']"
          :sort-desc="[true, true]"
          v-else
        >
          <template v-slot:item.actions="{ item }">
            <v-btn
              v-if="isContinueButtonDisplayed(item.externalStatus)"
              class="blueOutlinedButton mr-3 my-2"
              @click="continueButton(item.changeType, item.changeActionId, item.changeRequestId, item.index)"
              outlined
              :width="changeHistoryButtonWidth"
            >
              Continue
            </v-btn>
            <v-btn
              v-if="isViewButtonDisplayed(item.externalStatus)"
              class="blueOutlinedButton mr-3 my-2"
              @click="continueButton(item.changeType, item.changeActionId, item.changeRequestId, item.index)"
              outlined
              :width="changeHistoryButtonWidth"
            >
              View
            </v-btn>
            <v-btn
              v-if="isUpdateButtonDisplayed(item.externalStatus)"
              class="blueOutlinedButton mr-3 my-2"
              @click="continueButton(item.changeType, item.changeActionId, item.changeRequestId, item.index)"
              outlined
              :width="changeHistoryButtonWidth"
            >
              Update
            </v-btn>
            <v-btn
              v-if="isDiscardButtonDisplayed(item.externalStatus)"
              class="blueOutlinedButton mr-3 my-2"
              @click="deleteRequest(item.changeRequestId)"
              outlined
              :width="changeHistoryButtonWidth"
            >
              Discard
            </v-btn>
            <v-btn
              v-if="isWithdrawButtonDisplayed(item.externalStatus, item.internalStatus)"
              class="blueOutlinedButton mr-3 my-2"
              @click="false"
              outlined
              :width="changeHistoryButtonWidth"
            >
              Withdraw
            </v-btn>
          </template>
        </v-data-table>
      </v-container>
    </v-form>

    <NavButton :isNextDisplayed="false" :isSaveDisplayed="false"
         :isNextDisabled="true" :isProcessing="processing"
        @previous="previous" @next="false" @validateForm="validateForm()" @save="save(true)"></NavButton>
  </v-container>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import { PATHS, changeUrlGuid , changeUrl} from '@/utils/constants';
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
      headers: [
        {
          text: 'Change Requests',
          align: 'start',
          sortable: false,
          value: 'changeTypeUpdated',
          class: 'tableHeader'
        },
        { text: 'Fiscal Year', value: 'fiscalYear', class: 'tableHeader' },
        { text: 'Facility(s) name', value: 'facilityNames', class: 'tableHeader' },
        { text: 'Status', value: 'externalStatus', class: 'tableHeader' },
        { text: 'Submission Date', value: 'submissionDate', class: 'tableHeader' },
        { text: ' ', value: 'actions', align: 'start', sortable: false },
      ],
      changeHistoryButtonWidth: '100px',
    };
  },
  computed: {
    ...mapState('application', ['applicationStatus', 'formattedProgramYear', 'applicationId']),
    ...mapState('reportChanges', ['changeRequestStore',]),
    ...mapState('organization', ['organizationProviderType',]),
    isReadOnly() {
      if (this.unlockedFacilities) {
        return false;
      }
      return (this.applicationStatus === 'SUBMITTED');
    },
    allChangeRequests() {
      let allChangeRequests = [];
      if (this.changeRequestStore?.length > 0) {
        allChangeRequests = this.changeRequestStore?.map((changeRequest, index) => ({
          index: index,
          changeRequestId: changeRequest.changeActions[0]?.changeRequestId,
          changeActionId: changeRequest.changeActions[0]?.changeActionId,
          changeType: changeRequest.changeActions[0]?.changeType,
          changeTypeUpdated: this.getChangeTypeString(changeRequest.changeActions[0]?.changeType),
          fiscalYear: this.formattedProgramYear,
          facilityNames: this.createFacilityNameString(changeRequest.changeActions),
          internalStatus: this.getInternalStatusString(changeRequest.status),
          externalStatus: this.getExternalStatusString(changeRequest.externalStatus),
          submissionDate: changeRequest?.createdOnDate,
          priority: changeRequest?.priority
        }));
      }
      return allChangeRequests;
    },
    // Table should be vertically scrollable once rows > 8
    maxChangeHistoryTableHeight() {
      return this.allChangeRequests?.length > 8 ? 48 * 9 : undefined;
    },
  },
  methods: {
    ...mapActions('reportChanges', ['loadChangeRequest', 'deleteChangeRequest', 'createChangeRequest' ]),
    ...mapMutations('reportChanges', ['setChangeRequestId', 'setChangeActionId']),
    previous() {
      this.$router.push(PATHS.ROOT.HOME);
    },
    getChangeTypeString(changeType){
      console.log('change type', changeType);
      switch(changeType){
      case 'PDF_CHANGE':
        return "Report other changes";
      case 'NEW_FACILITY':
        return "Add new facility(s)";
      case 'PARENT_FEE_CHANGE':
        return 'Midterm Fee Increase';

      default:
        return 'New Category'; //I put this there because past Report Other Change types were incorrectly mapped to New Category
      }
    },
    createFacilityNameString(changeActions){

      //TODO - add more logic to grab facility name from relevent change request. IE: MTFI

      //did it this way so if there are many change Actions, it checks all of them to see if there is a new facility. Maybe change in the future
      if (!changeActions.find(el => el.changeType == "NEW_FACILITY")){
        return "- - - -";
      }

      let str = "";

      //change in backend, only returns 1 at a time rn
      let action = changeActions.find(el => el.changeType == "NEW_FACILITY");
      if (action.facilities) {
        action.facilities.forEach(fac => {
          if (fac.facilityName){
            str = str + `${fac.facilityName}, `;
          }
        });
      }
      return str.slice(0, -2);
    },
    getExternalStatusString(status){
      switch (status){
      case 1:
        return "Incomplete";
      case 2:
        return "Submitted";
      case 3:
        return "Action Required";
      case 4:
        return "Ineligible";
      case 5 :
        return "Approved";
      case 6:
        return "Cancelled";
      default:
        return "Unknown"; //should never happen!
      }
    },
    getInternalStatusString(status){
      switch (status){
      case 1:
        return "Incomplete";
      case 3:
        return "Submitted";
      case 4:
        return "Processing";
      case 5:
        return "WITH_PROVIDER";
      case 6:
        return "Ineligible";
      case 7:
        return "Approved";
      case 8:
        return "Cancelled";
      default:
        return "Unknown"; //should never happen!
      }
    },
    getChangeRequestStyle(changeRequest){
      return changeRequest.externalStatus == 'Action Required' ? 'redText' : '';
    },
    next() {
      this.$router.push(PATHS.ROOT.HOME);
    },
    routeToFacilityAdd(){
      this.$router.push(PATHS.ROOT.CHANGE_NEW_FACILITY);
    },
    continueButton(changeType, changeActionId = null,  changeRequestId = null, index){
      if (changeType == 'PDF_CHANGE'){
        this.goToChangeForm(changeActionId, changeRequestId);
      }
      else if (changeType == 'NEW_FACILITY'){
        this.setChangeRequestId(changeRequestId);
        this.setChangeActionId(changeActionId);
        this.$router.push(changeUrlGuid(PATHS.CCOF_GROUP_FACILITY, changeRequestId, this.changeRequestStore[index].changeActions[0].facilities[0].facilityId));
      }
      else if (changeType == 'PARENT_FEE_CHANGE'){
        this.setChangeRequestId(changeRequestId);
        this.$router.push(changeUrl(PATHS.MTFI_INFO, changeRequestId));
      }
    },
    async createNewChangeRequest(changeType){

      let newReq;
      try{
        newReq = await this.createChangeRequest(changeType);
      }
      catch(error){
        console.log('unable to create a new Req');
        this.setFailureAlert('An error occurred while creating a new change request. Please try again later.');
      }
      return newReq;
    },
    async goToChangeForm(changeActionId = null,  changeRequestId = null){

      this.processing = true;

      //create the change action first, then push it
      if (!changeActionId){
        let newReq = await this.createNewChangeRequest('PDF_CHANGE');
        this.$router.push(changeUrlGuid(PATHS.CHANGE_NOTIFICATION_FORM, newReq?.changeRequestId, newReq?.changeActionId));
      }
      else{
        this.setChangeRequestId(changeRequestId);
        this.setChangeActionId(changeActionId);
        this.$router.push(changeUrlGuid(PATHS.CHANGE_NOTIFICATION_FORM, changeRequestId, changeActionId));
      }

    },
    async goToMTFI(changeRequestId = null){

      if (!changeRequestId){
        let newReq = await this.createNewChangeRequest('PARENT_FEE_CHANGE');
        this.$router.push(changeUrl(PATHS.MTFI_INFO, newReq.changeRequestId ));
      }
      else{
        this.$router.push(changeUrl(PATHS.MTFI_INFO, changeRequestId));
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
    },
    isViewButtonDisplayed(externalStatus) {
      return ['Submitted','Approved','Cancelled'].includes(externalStatus);
    },
    isContinueButtonDisplayed(externalStatus) {
      return ['Incomplete'].includes(externalStatus);
    },
    isDiscardButtonDisplayed(externalStatus) {
      return ['Incomplete'].includes(externalStatus);
    },
    isWithdrawButtonDisplayed(externalStatus, internalStatus) {
      if (externalStatus == 'Submitted' && (['Submitted','Incomplete','WITH_PROVIDER'].includes(internalStatus))) {
        return true;
      }
      return false;
    },
    isUpdateButtonDisplayed(externalStatus) {
      return ['Action Required'].includes(externalStatus);
    },
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
.blueOutlinedButton {
  color: #003366 !important;
}
::v-deep .tableHeader {
  color: rgb(0, 52, 102) !important;
  font-weight: bold !important;
  font-size: 16px !important;
}
::v-deep .redText {
  color: red !important;
}
</style>
