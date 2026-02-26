<template>
  <v-container fluid>
    <div class="text-center mb-md-8">
      <span class="text-h4">Change Notification Form</span>
    </div>
    <v-form ref="isValidForm" v-model="isValidForm">
      <v-container fluid class="px-md-16">
        <v-row class="justify-space-around">
          <v-col cols="12" md="8" :class="borderClass" class="pa-8">
            <a href="https://www2.gov.bc.ca/assets/download/E7A1C3009EA24111A7EFB93554D08428" target="_blank">
              <AppButton class="mb-10">
                <strong>Download a Change Notification Form</strong>
              </AppButton>
            </a>
            <div class="mb-12">
              <p class="text-h5 font-weight-bold">Upload the completed Change Notification Form below.</p>
              <v-skeleton-loader
                v-show="isLoading || processing"
                max-height="375px"
                :loading="isLoading"
                type="image"
              />
              <ChangeFileUpload
                v-show="!isLoading && !processing"
                ref="childRef"
                :show-error-message="showErrorMessage"
                :change-type="DOCUMENT_TYPES.CR_NOTIFICATION_FORM"
                no-data-default-text="Upload Change Notification Form (Required)"
                @file-change="updateChangeNotificationFormCompleteStatus($event)"
              />
            </div>
            <div>
              <p class="text-h5 font-weight-bold">Upload supporting documents for your requested changes.</p>
              <v-skeleton-loader
                v-show="isLoading || processing"
                max-height="375px"
                :loading="isLoading"
                type="image"
              />
              <ChangeFileUpload
                v-show="!isLoading && !processing"
                ref="childRef2"
                :change-type="DOCUMENT_TYPES.CR_NOTIFICATION_FORM_SUPPORTING"
                no-data-default-text="Upload supporting documents"
                @file-change="updateSupportingDocumentCompleteStatus($event)"
              />
            </div>
          </v-col>
          <v-col cols="12" md="4" class="pa-8">
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
      :is-processing="isLoading || processing"
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
import { CHANGE_TYPES, DOCUMENT_TYPES } from '@/utils/constants.js';

import AppButton from '@/components/guiComponents/AppButton.vue';
import NavButton from '@/components/util/NavButton.vue';
import ChangeFileUpload from '@/components/requestChanges/ChangeFileUpload.vue';

export default {
  name: 'ChangeNotificationForm',
  components: { AppButton, NavButton, ChangeFileUpload },
  mixins: [alertMixin],
  async beforeRouteLeave(_to, _from, next) {
    this.processing = true;
    if (!this.isReadOnly) {
      await this.save(false);
    }
    next();
  },
  data() {
    return {
      isLoading: true,
      isUnlocked: false,
      isValidForm: false,
      processing: false,
      loading: false,
      isChangeNotificationFormComplete: false,
      isSupportingDocumentComplete: true,
      showErrorMessage: false,
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
        // Mutation by reference. We're flattening a potential array of change requests into the first available
        /* eslint-disable-next-line no-useless-assignment */
        currentCR = currentCR[0];
      }
      if (this.isChangeRequestUnlocked || this.isOtherDocumentsUnlocked) {
        return false;
      }

      return this.loadedChangeRequest?.externalStatus !== 'INCOMPLETE';
    },
    borderClass() {
      return this.$vuetify.display.mdAndUp ? 'border-right' : 'border-bottom';
    },
  },
  async created() {
    this.DOCUMENT_TYPES = DOCUMENT_TYPES;
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
      'getChangeRequest',
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
    validateForm() {
      this.showErrorMessage = true;
    },
    updateChangeNotificationFormCompleteStatus(newStatus) {
      if (isNullOrBlank(newStatus)) {
        let savedChangeNotificationFormDocuments = this.uploadedDocuments?.filter((document) => {
          return document.annotationid && document.subject === DOCUMENT_TYPES.CR_NOTIFICATION_FORM;
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
