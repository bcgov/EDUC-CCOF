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
        <v-row class="d-flex justify-start">


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
                  <v-btn dark class="blueButton mb-10" @click="goToChangeDialogue()" >Upload a Change Notification Form</v-btn>
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
          mobile-breakpoint="md"
          fixed-header
          :item-class="getChangeRequestStyle"
          class="elevation-4 my-4"
          disable-pagination hide-default-footer
          :sort-by="['priority', 'submissionDate']"
          :sort-desc="[true, true]"
          v-else
        >
          <template v-slot:item.facilityNames="{ item }">
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <div v-on="on" class="tableText" :style="maxfacilityNamesStringLength">{{ item.facilityNames }}</div>
              </template>
              <div class="tableTooltip">{{ item.facilityNames }}</div>
            </v-tooltip>
          </template>
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
              @click="updateButton(item.index, item.changeType, item.changeActionId, item.changeRequestId)"
              outlined
              :width="changeHistoryButtonWidth"
            >
              Update
            </v-btn>
            <v-btn
              v-if="isCancelButtonDisplayed(item.externalStatus)"
              class="blueOutlinedButton my-2"
              @click="confirmCancelChangeRequest(item.changeRequestId, item.changeTypeString, item.externalStatus, item.submissionDateString)"
              outlined
              :width="changeHistoryButtonWidth"
            >
              Cancel
            </v-btn>
          </template>
        </v-data-table>
        <v-dialog v-model="dialog" persistent max-width="525px">
          <v-card>
            <v-container class="pt-0">
              <v-row>
                <v-col cols="7" class="py-0 pl-0" style="background-color:#234075;">
                  <v-card-title class="white--text font-weight-bold">Cancel a change request</v-card-title>
                </v-col>
                <v-col cols="5" class="d-flex justify-end" style="background-color:#234075;">
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" style="background-color:#FFC72C;padding:2px;"></v-col>
              </v-row>
              <v-row class="pa-6">
                <p>Are you sure you want to cancel this change request?</p>
                <p class="pt-2">[{{cancelChangeRequestType}}]  [{{cancelChangeRequestStatus}}]  [{{cancelChangeRequestSubmissionDate}}]</p>
                <p class="pt-2">You will not be able to resume a cancelled request. They will be viewable in your change history.</p>
              </v-row>
              <v-row class="d-flex justify-right">
                  <v-btn dark color="secondary" :loading="processing" class="mr-10" @click="dialog = false">Cancel</v-btn>
                  <v-btn dark color="primary" :loading="processing" @click="cancel()">Continue</v-btn>
              </v-row>
            </v-container>
          </v-card>
        </v-dialog>
      </v-container>
    </v-form>

    <NavButton :isNextDisplayed="false" :isSaveDisplayed="false"
         :isNextDisabled="true" :isProcessing="processing"
        @previous="previous" @next="false" @validateForm="validateForm()" @save="save(true)"></NavButton>
  </v-container>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import { PATHS, CHANGE_TYPES, changeUrlGuid , changeUrl} from '@/utils/constants';
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
      headersGroup: [
        { text: 'Change Requests', value: 'changeTypeString', class: 'tableHeader'},
        { text: 'Fiscal Year', value: 'fiscalYear', class: 'tableHeader' },
        { text: 'Facility(s) name', value: 'facilityNames', class: 'tableHeader' },
        { text: 'Status', value: 'externalStatus', class: 'tableHeader' },
        { text: 'Submission Date', value: 'submissionDateString', class: 'tableHeader' },
        { text: ' ', value: 'actions', align: 'start', sortable: false },
      ],
      headersFamily: [
        { text: 'Change Requests', value: 'changeTypeString', class: 'tableHeader'},
        { text: 'Fiscal Year', value: 'fiscalYear', class: 'tableHeader' },
        { text: 'Status', value: 'externalStatus', class: 'tableHeader' },
        { text: 'Submission Date', value: 'submissionDateString', class: 'tableHeader' },
        { text: ' ', value: 'actions', align: 'start', sortable: false },
      ],
      changeHistoryButtonWidth: '88px',
      dialog: false,
      cancelChangeRequestId: undefined,
      cancelChangeRequestType: undefined,
      cancelChangeRequestStatus: undefined,
      cancelChangeRequestSubmissionDate: undefined,
    };
  },
  computed: {
    ...mapState('app', ['programYearList']),
    ...mapState('application', ['applicationStatus', 'formattedProgramYear', 'applicationId']),
    ...mapState('reportChanges', ['changeRequestStore','userProfileChangeRequests']),
    ...mapState('organization', ['organizationProviderType',]),
    ...mapState('navBar', ['userProfileList']),
    isReadOnly() {
      if (this.unlockedFacilities) {
        return false;
      }
      return (this.applicationStatus === 'SUBMITTED');
    },
    allChangeRequests() {
      let allChangeRequests = [];
      if (this.changeRequestStore?.length > 0) {
        // FUTURE RELEASE - filter by Program Year
        // allChangeRequests = this.changeRequestStore?.filter(changeRequest => this.isCurrentOrFuture(changeRequest.programYearId));
        allChangeRequests = this.changeRequestStore?.map((changeRequest, index) => {
          let sortedChangeActions = this.sortChangeActions(changeRequest, 'desc');
          return {
            index: index,
            changeRequestId: changeRequest?.changeRequestId,
            changeActionId: sortedChangeActions[0]?.changeActionId,
            changeType: sortedChangeActions[0]?.changeType,
            changeTypeString: this.getChangeTypeString(sortedChangeActions[0]?.changeType),
            fiscalYear: this.getProgramYearString(changeRequest.programYearId),
            facilityNames: this.createFacilityNameString(changeRequest.changeActions),
            internalStatus: this.getInternalStatusString(changeRequest.status),
            externalStatus: this.getExternalStatusString(changeRequest.externalStatus),
            submissionDate: changeRequest?.firstSubmissionDate,
            submissionDateString: this.getSubmissionDateString(changeRequest?.firstSubmissionDate),
            priority: changeRequest?.priority
          }
        });
      }
      return allChangeRequests;
    },
    // Table should be vertically scrollable once rows > 8
    maxChangeHistoryTableHeight() {
      return this.allChangeRequests?.length > 8 ? 53 * 9 : undefined;
    },
    headers() {
      return this.organizationProviderType == 'GROUP' ? this.headersGroup : this.headersFamily;
    },
    maxfacilityNamesStringLength() {
      if (this.$vuetify.breakpoint.width > 3500) {
        return ('--maxLength: 700px');
      }
      switch (this.$vuetify.breakpoint.name) {
      case 'xl':
        return ('--maxLength: ' + (Math.floor(this.$vuetify.breakpoint.width / 10) + 350) + 'px');
      case 'lg':
        return ('--maxLength: ' + (Math.floor(this.$vuetify.breakpoint.width / 10)) + 'px');
      case 'md':
        return ('--maxLength: ' + (Math.floor(this.$vuetify.breakpoint.width / 10) + 300) + 'px');
      case 'sm':
        return ('--maxLength: ' + (Math.floor(this.$vuetify.breakpoint.width / 10) + 300) + 'px');
      case 'xs':
        return ('--maxLength: ' + (Math.floor(this.$vuetify.breakpoint.width / 10) + 100) + 'px');
      default:
        return ('--maxLength: 100px');
      }
    },
    unlockCCFRIList() {
      let unlockList = [];
      this.userProfileList?.forEach((facility) => {
        if (facility.unlockCcfri)
          unlockList.push(facility.ccfriApplicationId);
      });
      return unlockList;
    },
    unlockNMFList() {
      let unlockList = [];
      this.userProfileList?.forEach((facility) => {
        if (facility.unlockNmf)
          unlockList.push(facility.ccfriApplicationId);
      });
      return unlockList;
    },
    unlockRFIList() {
      let unlockList = [];
      this.userProfileList?.forEach((facility) => {
        if (facility.unlockRfi)
          unlockList.push(facility.ccfriApplicationId);
      });
      return unlockList;
    },
  },
  methods: {
    ...mapActions('reportChanges', ['loadChangeRequest', 'deleteChangeRequest', 'createChangeRequest', 'cancelChangeRequest']),
    ...mapMutations('reportChanges', ['setChangeRequestId', 'setChangeActionId']),
    previous() {
      this.$router.push(PATHS.ROOT.HOME);
    },
    // FUTURE RELEASE - filter change request to be displayed in Change History by Program Year
    // isCurrentOrFuture(programYearId) {
    //   let currentFutureYears = this.programYearList?.list?.map(programYear => {
    //     if (['CURRENT','FUTURE'].includes(programYear.status)) {
    //       return programYear.programYearId;
    //     }
    //   });
    //   return currentFutureYears?.includes(programYearId);
    // },
    getProgramYearString(programYearId) {
      let label = this.programYearList?.list?.find(programYear => programYear.programYearId == programYearId)?.name;
      return label?.replace(/[^\d/]/g, '');
    },
    getChangeTypeString(changeType){
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
        return "In Progress";
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
    getSubmissionDateString(date) {
      if (date) {
        // date display format: YYYY/MM/DD
        return new Date(date).toLocaleDateString("zh-CN",{ year: 'numeric', month: '2-digit', day: '2-digit' });
      }
      return "- - - -";
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
      let sortedChangeActions = this.sortChangeActions(this.changeRequestStore[index], 'desc');
      if (changeType == 'PDF_CHANGE'){
        this.goToChangeForm(changeActionId, changeRequestId);
      }
      else if (changeType == 'NEW_FACILITY'){
        this.setChangeRequestId(changeRequestId);
        this.setChangeActionId(changeActionId);
        this.$router.push(changeUrlGuid(PATHS.CCOF_GROUP_FACILITY, changeRequestId, sortedChangeActions[0].facilities[0].facilityId));
      }
      else if (changeType == 'PARENT_FEE_CHANGE'){
        this.setChangeRequestId(changeRequestId);
        this.$router.push(changeUrl(PATHS.MTFI_INFO, changeRequestId));
      }
    },
    notificationFormActionRequiredRoute(changeActionId, changeRequestId) {
      let currentCR = this.userProfileChangeRequests?.find(el=>el.changeRequestId===changeRequestId);
      if (currentCR?.unlockChangeRequest || currentCR?.unlockOtherChangesDocuments) {
        this.goToChangeForm(changeActionId, changeRequestId);
      } else if (currentCR?.unlockDeclaration) {
        this.$router.push(changeUrlGuid(PATHS.CHANGE_NOTIFICATION_DECLARATION, changeRequestId, changeActionId, CHANGE_TYPES.CHANGE_NOTIFICATION));
      } else {
        this.goToChangeForm(changeActionId, changeRequestId);
      }
    },
    newFacilityActionRequiredRoute(changeRequestId, index) {
      let currentCR = this.userProfileChangeRequests?.find(el=>el.changeRequestId===changeRequestId);
      if (currentCR?.unlockCCOF) {
        this.$router.push(changeUrlGuid(PATHS.CCOF_GROUP_FACILITY, changeRequestId, this.changeRequestStore[index].changeActions[0].facilities[0].facilityId));
      } else if (currentCR?.unlockLicenseUpload) {
        this.$router.push(changeUrl(PATHS.LICENSE_UPLOAD, changeRequestId));
      } else if (this.unlockCCFRIList?.length > 0) {
        this.$router.push(changeUrl(PATHS.CCFRI_HOME, changeRequestId));
      } else if (this.unlockRFIList?.length > 0) {
        this.$router.push(changeUrlGuid(PATHS.CCFRI_RFI, changeRequestId, this.unlockRFIList[0]));
      } else if (this.unlockNMFList?.length > 0) {
        this.$router.push(changeUrlGuid(PATHS.CCFRI_NMF, changeRequestId, this.unlockNMFList[0]));
      } else if (currentCR?.unlockEcewe) {
        this.$router.push(changeUrl(PATHS.ECEWE_ELIGIBILITY, changeRequestId));
      } else if (currentCR?.unlockSupportingDocuments) {
        this.$router.push(changeUrl(PATHS.SUPPORTING_DOCS, changeRequestId));
      } else if (currentCR?.unlockDeclaration) {
        this.$router.push(changeUrl(PATHS.SUMMARY_DECLARATION, changeRequestId));
      } else {
        this.$router.push(changeUrlGuid(PATHS.CCOF_GROUP_FACILITY, changeRequestId, this.changeRequestStore[index].changeActions[0].facilities[0].facilityId));
      }
    },
    updateButton(index, changeType, changeActionId = null,  changeRequestId = null){
      this.setChangeRequestId(changeRequestId);
      this.setChangeActionId(changeActionId);
      if (changeType == 'PDF_CHANGE'){
        this.notificationFormActionRequiredRoute(changeActionId, changeRequestId);
      }
      else if (changeType == 'NEW_FACILITY') {
        this.newFacilityActionRequiredRoute(changeRequestId, index);
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
    goToChangeDialogue() {
      this.$router.push(PATHS.CHANGE_NOTIFICATION_DIALOGUE);
    },
    async goToChangeForm(changeActionId = null,  changeRequestId = null){

      this.processing = true;

      //create the change action first, then push it
      if (!changeActionId){
        let newReq = await this.createNewChangeRequest('PDF_CHANGE');
        this.$router.push(changeUrlGuid(PATHS.CHANGE_NOTIFICATION_FORM, newReq?.changeRequestId, newReq?.changeActionId, CHANGE_TYPES.CHANGE_NOTIFICATION));
      }
      else{
        this.setChangeRequestId(changeRequestId);
        this.setChangeActionId(changeActionId);
        this.$router.push(changeUrlGuid(PATHS.CHANGE_NOTIFICATION_FORM, changeRequestId, changeActionId, CHANGE_TYPES.CHANGE_NOTIFICATION));
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

    confirmCancelChangeRequest(requestId, requestType, requestStatus, submissionDate) {
      this.cancelChangeRequestId = requestId;
      this.cancelChangeRequestType = requestType;
      this.cancelChangeRequestStatus = requestStatus;
      this.cancelChangeRequestSubmissionDate = submissionDate;
      this.dialog = true;
    },

    async cancel(){
      this.processing = true;
      try {
        await this.cancelChangeRequest(this.cancelChangeRequestId);
        this.cancelChangeRequestId = undefined;
        this.setSuccessAlert('Success! Your change request have been canceled.');
      }
      catch(error){
        this.setFailureAlert('An error occurred while canceling a change request. Please try again later.');
      }

      this.processing = false;
      this.dialog = false;
    },
    isViewButtonDisplayed(externalStatus) {
      return ['Submitted','Approved','Cancelled'].includes(externalStatus);
    },
    isContinueButtonDisplayed(externalStatus) {
      return ['In Progress'].includes(externalStatus);
    },
    isCancelButtonDisplayed(externalStatus) {
      // return (['Incomplete','Submitted','WITH_PROVIDER'].includes(internalStatus));
      return (['In Progress'].includes(externalStatus));
    },
    isUpdateButtonDisplayed(externalStatus) {
      return ['Action Required'].includes(externalStatus);
    },
    sortChangeActions(changeRequest, order) {
      return _.sortBy(changeRequest.changeActions, 'createdOn', order);
    },
  },
  async mounted() {
    this.processing = true;
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
.blueButton {
  background-color: #003366 !important;
}
.blueOutlinedButton {
  color: #003366 !important;
}
:deep(.tableHeader) {
  color: rgb(0, 52, 102) !important;
  font-weight: bold !important;
  font-size: 16px !important;
}
:deep(.redText) {
  color: red !important;
}
.tableTooltip {
  max-width: 70em;
  overflow-wrap: break-word;
}
.tableText {
  max-width: var(--maxLength); /* the element needs a fixed width (in px, em, %, etc) */
  overflow: hidden; /* make sure it hides the content that overflows */
  white-space: nowrap; /* don't break the line */
  text-overflow: ellipsis; /* give the beautiful '...' effect */
}
</style>
