<template>
  <v-container>
    <div class="row pt-4 justify-center text-center">
      <span class="text-h5">Change Notification Form</span>
    </div>
    <br>
    <v-form ref="isValidForm" value="false" v-model="isValidForm">
      <v-container>
        <v-row class="justify-space-around">
          <v-col class="col-lg-7 ">
            <v-row>
              <v-col class="col-lg-12">
                <a href="https://www2.gov.bc.ca/assets/gov/family-and-social-supports/child-care/cf1345_cc_operating_program_funding_agreement_change_notification.pdf" target="_blank">
                  <v-btn dark class="blueButton mb-10 ml-2" x-large>
                    <strong>Download a Change Notification Form</strong>
                  </v-btn>
                </a>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="col-lg-12 ">
                <p class="px-2 text--primary">
                  <strong>Upload the completed Change Notification Form below.</strong>
                </p>
                <v-skeleton-loader v-show="isLoading" max-height="375px" :loading="true" type="image"></v-skeleton-loader>
                <ChangeFileUpload
                  v-show="!isLoading"
                  ref="childRef"
                  :changeType="changeTypeForm"
                  @fileChange="updateChangeNotificationFormCompleteStatus($event)"
                ></ChangeFileUpload>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="col-lg-12 ">
                <p class="px-2 text--primary">
                  <strong>Upload supporting documents for your requested changes.</strong>
                </p>
                <v-skeleton-loader v-show="isLoading" max-height="375px" :loading="true" type="image"></v-skeleton-loader>
                <ChangeFileUpload
                  v-show="!isLoading"
                  ref="childRef2"
                  :changeType="changeTypeSupportingDoc"
                  @fileChange="updateSupportingDocumentCompleteStatus(($event))"
                ></ChangeFileUpload>
              </v-col>
            </v-row>
          </v-col>
          <v-col class="col-lg-4 boarder pl-10" >
            <p class="text--primary font-weight-bold mb-10">
              Supporting Documents
            </p>
            <p>
              The Change Notification Form will specify what supporting documents to upload.
            </p>
            <p class="mt-10">
              These could include:
              <ul>
                <li class="pb-0 font-italic">
                  Community Care and Assisted Living Act License
                </li>
                <li>
                  Proof of name change document
                  <br>
                  (e.g. marriage certificate, resumption of surname certificate, BC Corporate Registry "Notice of Name Change")
                </li>
              </ul>
            </p>
            <p class="mt-10">
              For more information 
              <a href="https://www2.gov.bc.ca/gov/content/family-social-supports/caring-for-young-children/running-daycare-preschool/child-care-operating-funding" class="text-decoration-underline">visit the Child Care Operating Funding website</a>
            </p>
            <p class="mt-10">
              Greater Victoria area: 
              <a href="tel:+2503566501" class="text-decoration-underline">250 356-6501</a>
              <br>
              Outside Greater Victoria (toll free): 
              <a href="tel:+18883386622" class="text-decoration-underline">1 888 338-6622</a>
            </p>
          </v-col>
        </v-row>
      </v-container>
    </v-form>

    <NavButton :isNextDisplayed="true" :isSaveDisplayed="true"
        :isSaveDisabled="isReadOnly" :isNextDisabled="!isChangeNotificationFormComplete || !isSupportingDocumentComplete" :isProcessing="isLoading"
        @previous="previous" @next="next" @validateForm="validateForm" @save="save(true)"></NavButton>
  </v-container>
</template>

<script>
import { mapState, mapMutations, mapActions, mapGetters } from 'vuex';
import { PATHS, changeUrlGuid } from '@/utils/constants';
import alertMixin from '@/mixins/alertMixin';
import NavButton from '@/components/util/NavButton';
import ChangeFileUpload from './ChangeFileUpload.vue';
import { isNullOrBlank } from '@/utils/common';

export default {
  name: 'ReportChange',
  mixins: [alertMixin],
  data() {
    return {
      isLoading: true,
      changeTypeForm: 'NOTIFICATION_FORM',
      changeTypeSupportingDoc: 'SUPPORTING_DOC',
      isUnlocked: false,
      isValidForm: false,
      processing: false,
      loading: false,
      isChangeNotificationFormComplete: false,
      isSupportingDocumentComplete: true,
    };
  },
  async mounted(){
    if (this.$route.params?.urlGuid) {
      this.isLoading = true;
      await this.loadChangeRequestDocs(this.$route.params.urlGuid);
      this.updateChangeNotificationFormCompleteStatus();
    }
    this.isLoading = false;
  },
  async beforeRouteLeave(_to, _from, next) {
    if(!this.isReadOnly){
      await this.save(false);
    }
    next();
  },
  computed: {
    ...mapGetters('reportChanges', ['getUploadedDocuments']),
    ...mapState('application', ['applicationStatus', 'formattedProgramYear', 'applicationId']),
    ...mapState('reportChanges', ['unsubmittedDocuments', 'changeRequestStore', 'loadedChangeRequest', 'uploadedDocuments']),
    isReadOnly() {
      if (this.unlockedFacilities) {
        return false;
      }
      return (this.loadedChangeRequest?.externalStatus === 'SUBMITTED');
    },
  },
  methods: {
    ...mapMutations('app', ['setCcfriOptInComplete', 'forceNavBarRefresh']),
    ...mapMutations('navBar', ['forceNavBarRefresh']),
    ...mapActions('reportChanges', ['createChangeRequest','loadChangeRequest', 'loadChangeRequestDocs', 'saveUploadedDocuments']),
    ...mapMutations('reportChanges', ['setUploadedDocument']),
    previous() {
      this.$router.push(PATHS.ROOT.CHANGE_LANDING);
    },
    async save(showNotification = false){
      this.isLoading = true;
      try{
        //call the save in the child component that will save the newly added documents
        //each child runs it's own save, because they are unaware of what has changed in the sibling component. If I have time, will change this to be more efficeint (one call to dynamics)
        await this.$refs.childRef.save(false);
        await this.$refs.childRef2.save(false);
        await this.loadChangeRequestDocs(this.$route.params.urlGuid);
        if (showNotification) {
          this.setSuccessAlert('Success! Request for Information has been saved.');
        }
      }
      catch (error)  {
        console.log(error);
        this.setFailureAlert('An error occurred while saving. Please try again later.');
      }
      this.isLoading = false;
    },
    next() {
      this.$router.push(changeUrlGuid(PATHS.CHANGE_NOTIFICATION_DECLARATION, this.$route.params?.changeRecGuid, this.$route.params?.urlGuid));
    },
    async validateForm() {
      await this.$refs.childRef.checkUploadCompleteStatus();
      await this.$refs.childRef2.checkUploadCompleteStatus();
    },
    updateChangeNotificationFormCompleteStatus(newStatus) {
      if (isNullOrBlank(newStatus)) {
        let savedChangeNotificationFormDocuments = this.uploadedDocuments?.filter(document => {
          return (document.annotationid && document.subject == this.changeTypeForm);
        });
        this.isChangeNotificationFormComplete = savedChangeNotificationFormDocuments?.length > 0;
      } else {
        this.isChangeNotificationFormComplete = newStatus;
      }
    },
    updateSupportingDocumentCompleteStatus(newStatus) {
      this.isSupportingDocumentComplete = newStatus;
    },
  },
  components: { NavButton, ChangeFileUpload }
};
</script>
<style scoped>
.blueBorder{
  border-top: 5px solid #003366 !important;
}
.boarder{
  border-left: 1px solid #efefef !important;
}
.blueButton {
  background-color: #003366 !important;
}
.blueText {
  color: rgb(0, 52, 102) !important;
}
</style>
