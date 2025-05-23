<template>
  <v-form ref="form" v-model="isValidForm">
    <v-container fluid>
      <v-card class="ma-4 mb-12">
        <v-card-title class="text-center text-wrap">
          <span class="text-h5">
            Child Care Operating Funding Program - {{ formattedProgramYear }} Program Confirmation Form
          </span>
        </v-card-title>
        <h2 class="text-center">Supporting Document Upload</h2>
        <div class="text-h5 text-center py-4" style="color: #003466">
          {{ userInfo.organizationName }}
        </div>
        <div class="px-6 text-body-1">
          Provide any additional documents you would like the program to review as part of your CCOF, CCFRI, or ECE-WE
          funding assessment.
        </div>
        <div class="pa-6 pt-2 text-body-2">
          {{ FILE_REQUIREMENTS_TEXT }}
        </div>
        <v-data-table
          v-if="!isApplicationDocumentsLoading"
          :headers="headers"
          :items="uploadedSupportingDocuments"
          class="elevation-1 pa-4"
          hide-default-header
          hide-default-footer
          :items-per-page="-1"
        >
          <template #top>
            <v-col flex>
              <AppButton v-if="!isLocked" id="add-new-file" :primary="false" size="large" class="mb-2" @click="addNew">
                Add File
              </AppButton>
            </v-col>
          </template>
          <template #item.facilityName="{ item }">
            <div v-if="item?.annotationId">
              <span> {{ item?.facilityName }} </span>
            </div>
            <v-select
              v-else
              v-model="item.selectFacility"
              :items="facilityNames"
              item-title="facilityName"
              placeholder="Select a facility"
              return-object
              class="drop-down-select mt-4"
              :rules="rules.required"
            />
          </template>

          <template #item.document="{ item }">
            <div v-if="item?.annotationId">
              <span> {{ item?.fileName }} </span>
            </div>
            <v-file-input
              v-else
              :id="item.id"
              :rules="rules.fileRules"
              prepend-icon="mdi-file-upload"
              :clearable="false"
              :accept="FILE_TYPES_ACCEPT"
              placeholder="Select your file"
              class="mt-4"
              @click:clear="deleteItem(item)"
              @change="selectFile"
            />
          </template>
          <template #item.description="{ item }">
            <div v-if="item?.annotationId">
              <span> {{ item?.description }} </span>
            </div>
            <v-text-field
              v-else
              v-model="item.description"
              placeholder="Enter a description (Optional)"
              clearable
              :rules="[rules.maxLength(255)]"
              class="mt-4"
              @change="updateDescription(item)"
            />
          </template>

          <template #item.actions="{ item }">
            <v-icon v-if="!isLocked" @click="deleteItem(item)"> mdi-delete </v-icon>
          </template>
        </v-data-table>
        <v-card v-if="isApplicationDocumentsLoading" class="pl-6 pr-6 pt-4">
          <v-skeleton-loader :loading="true" type="button" />
          <v-skeleton-loader max-height="375px" :loading="true" type="table-row-divider@3" />
        </v-card>
      </v-card>
      <div v-if="isChangeRequest" class="mx-12">
        <v-skeleton-loader :loading="isApplicationDocumentsLoading" type="table-tbody">
          <v-card class="mb-8 rounded-lg cc-top-level-card" width="100%">
            <v-card-text class="pt-7 pa-0">
              <div class="px-md-12 px-7">
                <p class="text-h5 text--primary">
                  Would you like to report any other changes to your licence or service?
                </p>
                <v-radio-group v-model="otherChanges" required :rules="rules.required" :disabled="isLocked">
                  <v-radio label="Yes" value="Yes" />
                  <v-radio label="No" value="No" @click="noReportChanges()" />
                </v-radio-group>
              </div>
            </v-card-text>
          </v-card>
        </v-skeleton-loader>
      </div>
      <v-row v-if="otherChanges == 'Yes'" class="d-flex justify-center">
        <GroupChangeDialogueContent style="max-width: 1200px" class="pb-4" />
      </v-row>
      <NavButton
        :is-next-displayed="true"
        :is-save-displayed="true"
        :is-save-disabled="!isSaveDisabled || isLocked"
        :is-next-disabled="!isNextEnabled"
        :is-processing="isProcessing || isApplicationDocumentsLoading"
        @previous="previous"
        @next="next"
        @validate-form="validateForm()"
        @save="save(true)"
      />
    </v-container>

    <AppDialog
      v-model="dialog"
      persistent
      max-width="525px"
      title="Please Confirm"
      :loading="false"
      @close="dialog = false"
    >
      <template #content>
        <p>
          Are you sure you want to change your response? This will remove any documents uploaded to the Change
          Notification Form section.
        </p>
        <p>Select "Continue" to confirm.</p>
      </template>
      <template #button>
        <v-row>
          <v-col cols="12" md="6" class="d-flex justify-center">
            <AppButton :primary="false" @click="backSelected()"> Back </AppButton>
          </v-col>
          <v-col cols="12" md="6" class="d-flex justify-center">
            <AppButton :primary="true" @click="confirmNoSelected()"> Continue </AppButton>
          </v-col>
        </v-row>
      </template>
    </AppDialog>
  </v-form>
</template>

<script>
import { isEmpty } from 'lodash';
import { mapActions, mapState } from 'pinia';
import { uuid } from 'vue-uuid';

import { useAuthStore } from '@/store/auth.js';
import { useFacilityStore } from '@/store/ccof/facility.js';
import { useNavBarStore } from '@/store/navBar.js';
import { useApplicationStore } from '@/store/application.js';
import { useReportChangesStore } from '@/store/reportChanges.js';
import { useSupportingDocumentUploadStore } from '@/store/supportingDocumentUpload.js';

import AppButton from '@/components/guiComponents/AppButton.vue';
import GroupChangeDialogueContent from '@/components/requestChanges/GroupChangeDialogueContent.vue';
import NavButton from '@/components/util/NavButton.vue';
import AppDialog from '@/components/guiComponents/AppDialog.vue';

import DocumentService from '@/services/documentService';
import rules from '@/utils/rules.js';
import alertMixin from '@/mixins/alertMixin.js';
import { isValidFile, readFile } from '@/utils/file.js';
import { deepCloneObject } from '@/utils/common.js';
import { PATHS, DOCUMENT_TYPES, FILE_REQUIREMENTS_TEXT, FILE_TYPES_ACCEPT, changeUrlGuid } from '@/utils/constants.js';

export default {
  components: { AppButton, AppDialog, NavButton, GroupChangeDialogueContent },
  mixins: [alertMixin],
  async beforeRouteLeave(_to, _from, next) {
    if (!this.isLocked) {
      await this.save(false);
    }
    next();
  },
  data() {
    return {
      dialog: false,
      isProcessing: false,
      facilityNames: [],
      model: {},
      tempFacilityId: null,
      isValidForm: true,
      currentrow: null,
      otherChanges: null,
      headers: [
        {
          title: 'Facility Name',
          value: 'facilityName',
          width: '35%',
          sortable: false,
        },
        {
          title: 'Document',
          value: 'document',
          width: '25%',
          sortable: false,
        },
        {
          title: 'Description',
          value: 'description',
          width: '35%',
          sortable: false,
        },
        {
          title: 'Actions',
          sortable: false,
          width: '5%',
          value: 'actions',
        },
      ],
      fileMap: new Map(),
      uploadedSupportingDocuments: [],
      editedIndex: -1,
      editedItem: {
        selectFacility: '',
      },
      defaultItem: {
        selectFacility: '',
      },
    };
  },
  computed: {
    ...mapState(useAuthStore, ['userInfo']),
    ...mapState(useFacilityStore, ['facilityModel', 'facilityId']),
    ...mapState(useNavBarStore, ['navBarList', 'changeRequestId', 'nextPath', 'previousPath', 'isChangeRequest']),
    ...mapState(useApplicationStore, [
      'applicationUploadedDocuments',
      'isApplicationDocumentsLoading',
      'isRenewal',
      'unlockSupportingDocuments',
      'applicationStatus',
      'applicationId',
      'formattedProgramYear',
    ]),
    ...mapState(useSupportingDocumentUploadStore, ['uploadedDocuments']),
    ...mapState(useReportChangesStore, [
      'loadedChangeRequest',
      'isSupportingDocumentsUnlocked',
      'changeRequestStatus',
      'getChangeNotificationActionId',
    ]),
    isLocked() {
      if (this.isChangeRequest) {
        if (this.isSupportingDocumentsUnlocked || !this.changeRequestStatus) {
          return false;
        } else if (this.changeRequestStatus !== 'INCOMPLETE') {
          return true;
        }
        return false;
      }
      if (this.unlockSupportingDocuments) {
        return false;
      } else if (this.applicationStatus === 'SUBMITTED') {
        return true;
      }
      return false;
    },
    isSaveDisabled() {
      const newFilesAdded = this.uploadedSupportingDocuments?.filter((el) => !!el.id);
      return this.isValidForm && (!isEmpty(newFilesAdded) || !isEmpty(this.uploadedSupportingDocuments?.deletedItems));
    },
    isNextEnabled() {
      return this.isValidForm;
    },
  },
  watch: {
    isApplicationDocumentsLoading: {
      handler() {
        this.loadSupportingDocuments();
      },
    },
  },
  created() {
    this.FILE_REQUIREMENTS_TEXT = FILE_REQUIREMENTS_TEXT;
    this.FILE_TYPES_ACCEPT = FILE_TYPES_ACCEPT;
    this.rules = rules;
    this.mapFacilityData();
    if (this.isChangeRequest) {
      if (this.getChangeNotificationActionId) {
        this.otherChanges = 'Yes';
      } else {
        this.otherChanges = 'No';
      }
    }
    this.loadSupportingDocuments();
  },
  methods: {
    ...mapActions(useApplicationStore, ['getApplicationUploadedDocuments']),
    ...mapActions(useSupportingDocumentUploadStore, ['saveUploadedDocuments']),
    ...mapActions(useReportChangesStore, [
      'createChangeAction',
      'deleteChangeAction',
      'addChangeNotificationId',
      'deleteChangeNotificationId',
    ]),
    ...mapActions(useNavBarStore, ['forceNavBarRefresh']),
    loadSupportingDocuments() {
      this.uploadedSupportingDocuments = this.applicationUploadedDocuments?.filter((document) => {
        return (
          this.navBarList?.some((item) => item.facilityId === document.facilityId) &&
          document?.documentType === DOCUMENT_TYPES.APPLICATION_SUPPORTING
        );
      });
    },
    backSelected() {
      this.otherChanges = 'Yes';
      this.dialog = false;
    },
    noReportChanges() {
      let changeNotificationId = this.getChangeNotificationActionId;
      if (changeNotificationId) {
        this.dialog = true;
      }
    },
    confirmNoSelected() {
      this.otherChanges = 'No';
      this.dialog = false;
    },
    previous() {
      this.$router.push(this.previousPath);
    },
    async next() {
      this.isProcessing = true;
      try {
        if (this.isChangeRequest) {
          if (this.otherChanges == 'Yes') {
            let changeNotificationId = this.getChangeNotificationActionId;
            if (!changeNotificationId) {
              const results = await this.createChangeAction({
                changeRequestId: this.changeRequestId,
                type: 'documents',
              });

              this.addChangeNotificationId({
                changeRequestId: this.changeRequestId,
                changeNotificationActionId: results.changeActionId,
              });
              changeNotificationId = results.changeActionId;
            }
            this.$router.push(
              changeUrlGuid(PATHS.CHANGE_NEW_FACILITY_OTHER, this.changeRequestId, changeNotificationId),
            );
          } else {
            let changeActionId = this.getChangeNotificationActionId;
            if (changeActionId) {
              await this.deleteChangeAction(changeActionId);
              this.deleteChangeNotificationId({ changeRequestId: this.changeRequestId });
              this.forceNavBarRefresh();
            }
            this.$router.push(this.nextPath);
          }
        } else {
          this.$router.push(this.nextPath);
        }
      } catch {
        this.setFailureAlert('An error occurred while saving. Please try again later.');
      } finally {
        this.isProcessing = false;
      }
    },
    validateForm() {
      this.$refs.form?.validate();
    },
    async saveClicked() {
      await this.save();
    },
    async save(showConfirmation = true) {
      this.isProcessing = true;
      try {
        await this.processDocumentFileDelete();
        const newFilesAdded = this.uploadedSupportingDocuments?.filter((el) => !!el.id);
        if (!isEmpty(newFilesAdded)) {
          await this.processDocumentFilesSave(newFilesAdded);
          this.fileMap?.clear();
        }
        await this.getApplicationUploadedDocuments();
        if (showConfirmation) {
          this.setSuccessAlert('Changes Successfully Saved');
        }
      } catch (error) {
        console.error(error);
        this.setFailureAlert('An error occurred while saving. Please try again later.');
      } finally {
        this.isProcessing = false;
      }
    },
    async processDocumentFilesSave(newFilesAdded) {
      const payload = [];
      for (const file of newFilesAdded) {
        const obj = {
          ccof_applicationid: this.applicationId,
          ccof_facility: file.selectFacility?.facilityId,
          subject: DOCUMENT_TYPES.APPLICATION_SUPPORTING,
          notetext: file.description,
          changeRequestNewFacilityId: file.selectFacility?.changeRequestNewFacilityId,
          ...this.fileMap.get(file.id),
        };
        payload.push(obj);
      }
      try {
        await this.saveUploadedDocuments(payload);
      } catch (error) {
        console.error(error);
        this.setFailureAlert('An error occurred while saving. Please try again later.');
      }
    },
    async processDocumentFileDelete() {
      if (!isEmpty(this.uploadedSupportingDocuments?.deletedItems)) {
        await DocumentService.deleteDocuments(this.uploadedSupportingDocuments.deletedItems);
        this.uploadedSupportingDocuments.deletedItems = [];
      }
    },
    async selectFile(event) {
      try {
        this.currentrow = event.target.id;
        const file = event?.target?.files[0];
        if (file && isValidFile(file)) {
          const doc = await readFile(file);
          this.fileMap.set(this.currentrow, deepCloneObject(doc));
        } else {
          this.fileMap.delete(this.currentrow);
        }
      } catch (e) {
        console.error(e);
        this.setFailureAlert('An error occurred while uploading file. Please try again later.');
      }
    },
    editItem(item) {
      this.editedIndex = this.uploadedSupportingDocuments.indexOf(item);
      this.editedItem = Object.assign({}, item);
    },

    deleteItem(item) {
      const index = this.uploadedSupportingDocuments.indexOf(item);
      if (item.annotationId) {
        let deletedItems = this.uploadedSupportingDocuments['deletedItems'];
        if (!isEmpty(deletedItems)) {
          deletedItems.push(item.annotationId);
          this.uploadedSupportingDocuments['deletedItems'] = deletedItems;
        } else {
          deletedItems = [];
          deletedItems.push(item.annotationId);
          this.uploadedSupportingDocuments['deletedItems'] = deletedItems;
        }
      }
      this.uploadedSupportingDocuments.splice(index, 1);
    },
    addNew() {
      const addObj = Object.assign({}, this.defaultItem);
      addObj.id = uuid.v1();
      this.uploadedSupportingDocuments?.unshift(addObj);
      this.editItem(addObj);
    },
    updateDescription(item) {
      const index = this.uploadedSupportingDocuments.indexOf(item);
      this.uploadedSupportingDocuments[index].description = item.description;
    },
    async mapFacilityData() {
      for (let facilityInfo of this.navBarList) {
        const facility = {};
        facility.facilityId = facilityInfo.facilityId;
        facility.facilityName = facilityInfo.facilityName;
        facility.licenseNumber = facilityInfo.licenseNumber;
        facility.changeRequestNewFacilityId = facilityInfo.changeRequestNewFacilityId;
        this.facilityNames.push(facility);
      }
    },
  },
};
</script>
<style scoped>
.table-header {
  background-color: #f2f2f2;
}
.drop-down-select {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
:deep(.v-field__input) {
  overflow: hidden;
  text-overflow: ellipsis;
}
:deep(.v-select__selection) {
  padding-left: 12px;
}
</style>
