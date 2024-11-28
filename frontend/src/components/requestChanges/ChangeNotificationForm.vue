<template>
  <v-container>
    <div class="row py-8 justify-center text-center">
      <span class="text-h4">Change Notification Form</span>
    </div>
    <br />
    <v-form ref="isValidForm" v-model="isValidForm" model-value="false">
      <v-container>
        <v-row class="justify-space-around">
          <v-col class="col-lg-7">
            <v-row>
              <v-col class="col-lg-12">
                <a href="https://www2.gov.bc.ca/assets/download/E7A1C3009EA24111A7EFB93554D08428" target="_blank">
                  <v-btn dark class="blueButton mb-10" size="x-large">
                    <strong>Download a Change Notification Form</strong>
                  </v-btn>
                </a>
              </v-col>
            </v-row>
            <v-row class="mb-12">
              <v-col class="col-lg-12">
                <p class="text-h5 mb-1">
                  <strong>Upload the completed Change Notification Form below.</strong>
                </p>
                <v-skeleton-loader v-show="isLoading" max-height="375px" :loading="true" type="image" />
                <ChangeFileUpload
                  v-show="!isLoading"
                  ref="childRef"
                  :change-type="changeTypeForm"
                  no-data-default-text="Upload Change Notification Form (Required)"
                  @file-change="updateChangeNotificationFormCompleteStatus($event)"
                />
              </v-col>
            </v-row>
            <v-row class="mb-12">
              <v-col class="col-lg-12">
                <p class="text-h5 mb-1">
                  <strong>Upload supporting documents for your requested changes.</strong>
                </p>
                <v-skeleton-loader v-show="isLoading" max-height="375px" :loading="true" type="image" />
                <ChangeFileUpload
                  v-show="!isLoading"
                  ref="childRef2"
                  :change-type="changeTypeSupportingDoc"
                  no-data-default-text="Upload supporting documents"
                  @file-change="updateSupportingDocumentCompleteStatus($event)"
                />
              </v-col>
            </v-row>
          </v-col>
          <v-col class="col-lg-4 col-sm-12 boarder pl-10">
            <p class="text--primary font-weight-bold mb-10">Supporting Documents</p>
            <p>The Change Notification Form will specify what supporting documents to upload.</p>
            <p class="mt-10">These could include:</p>

            <ul>
              <li class="pb-0 font-italic">Community Care and Assisted Living Act Licence</li>
              <li>
                Proof of name change document
                <br />
                (e.g. marriage certificate, resumption of surname certificate, BC Corporate Registry "Notice of Name
                Change")
              </li>
            </ul>
            <p class="mt-10">
              For more information
              <a
                href="https://www2.gov.bc.ca/gov/content/family-social-supports/caring-for-young-children/childcarebc-programs/child-care-operating-funding/report-changes"
                class="text-decoration-underline"
              >
                visit the Child Care Operating Funding website</a
              >
            </p>
            <p class="mt-10">
              Toll Free: <a href="tel:+18883386622" class="text-decoration-underline">1 888 338-6622 (Option 2)</a>
              <br />
              Local Phone: <a href="tel:+2503566501" class="text-decoration-underline">250 356-6501</a>
            </p>
          </v-col>
        </v-row>
      </v-container>
    </v-form>

    <NavButton
      :is-next-displayed="true"
      :is-save-displayed="true"
      :is-save-disabled="isReadOnly"
      :is-next-disabled="!isChangeNotificationFormComplete || !isSupportingDocumentComplete"
      :is-processing="isLoading"
      @previous="previous"
      @next="next"
      @validate-form="validateForm"
      @save="save(true)"
    />
  </v-container>
</template>

<script>
import { mapState, mapActions } from 'pinia';
import { useReportChangesStore } from '@/store/reportChanges.js';
import { useNavBarStore } from '@/store/navBar.js';
import { useApplicationStore } from '@/store/application.js';
import { useAppStore } from '@/store/app.js';

import { PATHS, changeUrl } from '@/utils/constants.js';
import alertMixin from '@/mixins/alertMixin.js';
import { isNullOrBlank } from '@/utils/common.js';
import { CHANGE_TYPES } from '@/utils/constants.js';

import NavButton from '@/components/util/NavButton.vue';
import ChangeFileUpload from '@/components/requestChanges/ChangeFileUpload.vue';

export default {
  name: 'ReportChange',
  components: { NavButton, ChangeFileUpload },
  mixins: [alertMixin],
  async beforeRouteLeave(_to, _from, next) {
    this.isLoading = true;
    if (!this.isReadOnly) {
      await this.save(false);
    }
    next();
  },
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
  computed: {
    ...mapState(useNavBarStore, ['changeType', 'nextPath', 'previousPath']),
    ...mapState(useApplicationStore, ['applicationStatus', 'formattedProgramYear', 'applicationId']),
    ...mapState(useReportChangesStore, [
      'unsubmittedDocuments',
      'changeRequestStore',
      'loadedChangeRequest',
      'uploadedDocuments',
      'changeRequestMap',
      'isChangeRequestUnlocked',
      'isOtherDocumentsUnlocked',
      'uploadedDocuments',
    ]),
    isReadOnly() {
      let currentCR = this.changeRequestMap.get(this.$route.params?.changeRecGuid);
      if (currentCR && currentCR.length > 0) {
        currentCR = currentCR[0];
      }
      if (this.isChangeRequestUnlocked || this.isOtherDocumentsUnlocked) {
        return false;
      }

      return this.loadedChangeRequest?.externalStatus !== 'INCOMPLETE';
    },
  },
  async mounted() {
    if (this.$route.params?.urlGuid) {
      this.isLoading = true;
      await this.getChangeRequest(this.$route.params?.changeRecGuid);
      await this.loadChangeRequestDocs(this.$route.params.urlGuid);
      this.updateChangeNotificationFormCompleteStatus();
    }
    this.isLoading = false;
  },
  methods: {
    ...mapActions(useAppStore, ['setCcfriOptInComplete']),
    ...mapActions(useNavBarStore, ['forceNavBarRefresh']),
    ...mapActions(useReportChangesStore, [
      'createChangeRequest',
      'getChangeRequestList',
      'loadChangeRequestDocs',
      'saveUploadedDocuments',
      'getChangeRequest',
      'setUploadedDocument',
    ]),
    previous() {
      if (this.changeType === CHANGE_TYPES.NEW_FACILITY) {
        this.$router.push(this.previousPath);
      } else {
        this.$router.push(PATHS.ROOT.CHANGE_LANDING);
      }
    },
    async save(showNotification = false) {
      this.isLoading = true;
      try {
        //call the save in the child component that will save the newly added documents
        //each child runs it's own save, because they are unaware of what has changed in the sibling component. If I have time, will change this to be more efficeint (one call to dynamics)
        await this.$refs.childRef.save(false);
        await this.$refs.childRef2.save(false);
        await this.loadChangeRequestDocs(this.$route.params.urlGuid);
        this.forceNavBarRefresh();
        if (showNotification) {
          this.setSuccessAlert('Success! Request for Information has been saved.');
        }
      } catch (error) {
        console.log(error);
        this.setFailureAlert('An error occurred while saving. Please try again later.');
      }
      this.isLoading = false;
    },
    next() {
      if (this.changeType === CHANGE_TYPES.NEW_FACILITY) {
        this.$router.push(this.nextPath);
      } else {
        this.$router.push(
          changeUrl(PATHS.SUMMARY_DECLARATION, this.$route.params?.changeRecGuid, CHANGE_TYPES.CHANGE_NOTIFICATION),
        );
      }
    },
    async validateForm() {
      await this.$refs.childRef.checkUploadCompleteStatus();
      await this.$refs.childRef2.checkUploadCompleteStatus();
    },
    updateChangeNotificationFormCompleteStatus(newStatus) {
      if (isNullOrBlank(newStatus)) {
        let savedChangeNotificationFormDocuments = this.uploadedDocuments?.filter((document) => {
          return document.annotationid && document.subject == this.changeTypeForm;
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
};
</script>
<style scoped>
.blueBorder {
  border-top: 5px solid #003366 !important;
}
.boarder {
  border-left: 1px solid #efefef !important;
}
.blueButton {
  background-color: #003366 !important;
}
.blueText {
  color: rgb(0, 52, 102) !important;
}
</style>
