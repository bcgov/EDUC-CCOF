<template>
  <v-form ref="form" v-model="isValidForm">
    <v-container>
      <v-row justify="space-around">
        <v-card class="cc-top-level-card" width="1200">
          <v-card-title class="text-center">
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
            The maximum file size is 2MB for each document. Accepted file types are jpg, jpeg, heic, png, pdf, docx,
            doc, xls, and xlsx.
          </div>
          <v-data-table
            v-if="!isLoading"
            :headers="headers"
            :items="uploadedSupportingDocuments"
            class="elevation-1"
            hide-default-header
            hide-default-footer
            :items-per-page="-1"
          >
            <template #top>
              <div class="ma-4 d-flex">
                <v-btn color="primary" class="ml-2" :disabled="isLocked" @click="addNew">
                  <v-icon>mdi-plus</v-icon>
                  Add
                </v-btn>
              </div>
            </template>

            <template #item.facilityName="{ item }">
              <div v-if="item?.annotationid">
                <span> {{ item?.ccof_facility_name }} </span>
              </div>
              <v-select
                v-else
                v-model="item.selectFacility"
                :items="facilityNames"
                item-title="facilityName"
                placeholder="Select a facility"
                return-object
                class="drop-down-select"
                :rules="selectRules"
              />
            </template>

            <template #item.document="{ item }">
              <div v-if="item?.annotationid">
                <span> {{ item?.filename }} </span>
              </div>
              <v-file-input
                v-else
                :id="String(item.id)"
                :rules="fileRules"
                prepend-icon="mdi-file-upload"
                :clearable="false"
                :accept="fileAccept"
                placeholder="Select your file"
                @click:clear="deleteItem(item)"
                @change="selectFile"
              />
            </template>
            <template #item.description="{ item }">
              <div v-if="item?.annotationid">
                <span> {{ item?.description }} </span>
              </div>
              <v-text-field
                v-else
                v-model="item.description"
                placeholder="Enter a description (Optional)"
                density="compact"
                clearable
                :rules="[rules.maxLength(255)]"
                @change="updateDescription(item)"
              />
            </template>

            <template #item.actions="{ item }">
              <v-icon v-if="!isLocked" size="small" @click="deleteItem(item)"> mdi-delete </v-icon>
            </template>
          </v-data-table>
          <v-card v-if="isLoading" class="pl-6 pr-6 pt-4">
            <v-skeleton-loader :loading="true" type="button" />
            <v-skeleton-loader max-height="375px" :loading="true" type="table-row-divider@3" />
          </v-card>
        </v-card>
      </v-row>
      <v-row v-if="isChangeRequest">
        <v-card v-if="isLoading" class="mx-auto mb-4 rounded-lg cc-top-level-card" width="1200">
          <v-skeleton-loader v-if="isLoading" :loading="isLoading" type="card-heading" />
          <v-skeleton-loader v-if="isLoading" :loading="isLoading" type="list-item-avatar" />
          <v-skeleton-loader v-if="isLoading" :loading="isLoading" type="list-item-avatar" />
        </v-card>
        <v-card v-else class="px-0 py-0 mx-auto mb-4 rounded-lg cc-top-level-card" width="1200">
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
      </v-row>
      <v-row v-if="otherChanges == 'Yes'" class="d-flex justify-center">
        <GroupChangeDialogueContent style="max-width: 1200px" class="pb-4" />
      </v-row>
      <NavButton
        :is-next-displayed="true"
        :is-save-displayed="true"
        :is-save-disabled="!isSaveDisabled || isLocked"
        :is-next-disabled="!isNextEnabled"
        :is-processing="isProcessing || isLoading"
        @previous="previous"
        @next="next"
        @validate-form="validateForm()"
        @save="save(true)"
      />
    </v-container>

    <v-dialog v-model="dialog" persistent max-width="525px">
      <v-card>
        <v-container class="pt-0">
          <v-row>
            <v-col cols="7" class="py-0 pl-0" style="background-color: #234075">
              <v-card-title class="text-white"> Please confirm </v-card-title>
            </v-col>
            <v-col cols="5" class="d-flex justify-end" style="background-color: #234075" />
          </v-row>
          <v-row>
            <v-col cols="12" style="background-color: #ffc72c; padding: 2px" />
          </v-row>
          <v-row>
            <v-col cols="12" style="text-align: left">
              <p class="pt-4">
                Are you sure you want to change your response? This will remove any documents uploaded to the Change
                Notification Form section.
              </p>
              <p class="pt-4">Select "Continue" to confirm.</p>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" style="text-align: center">
              <v-btn theme="dark" color="secondary" class="mr-10" @click="backSelected()"> Back </v-btn>
              <v-btn theme="dark" color="primary" @click="confirmNoSelected()"> Continue </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-dialog>
  </v-form>
</template>

<script>
import { mapActions, mapState } from 'pinia';
import { useAuthStore } from '@/store/auth.js';
import { useFacilityStore } from '@/store/ccof/facility.js';
import { useNavBarStore } from '@/store/navBar.js';
import { useApplicationStore } from '@/store/application.js';
import { useReportChangesStore } from '@/store/reportChanges.js';
import { useSupportingDocumentUploadStore } from '@/store/supportingDocumentUpload.js';

import GroupChangeDialogueContent from '@/components/requestChanges/GroupChangeDialogueContent.vue';
import NavButton from '@/components/util/NavButton.vue';

import rules from '@/utils/rules.js';
import alertMixin from '@/mixins/alertMixin.js';
import { getFileNameWithMaxNameLength, humanFileSize } from '@/utils/file.js';
import { deepCloneObject, getFileExtension } from '@/utils/common.js';
import { PATHS, changeUrlGuid } from '@/utils/constants.js';

export default {
  components: { NavButton, GroupChangeDialogueContent },
  mixins: [alertMixin],
  async beforeRouteLeave(_to, _from, next) {
    if (!this.isLocked) {
      await this.save(false);
    }
    next();
  },
  props: {},
  data() {
    return {
      dialog: false,
      isLoading: false,
      isProcessing: false,
      rules,
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
      fileAccept: [
        'image/png',
        'image/jpeg',
        'image/jpg',
        '.pdf',
        '.png',
        '.jpg',
        '.jpeg',
        '.heic',
        '.doc',
        '.docx',
        '.xls',
        '.xlsx',
      ],
      fileExtensionAccept: ['pdf', 'png', 'jpg', 'jpeg', 'heic', 'doc', 'docx', 'xls', 'xlsx'],
      fileFormats: 'PDF, JPEG, JPG, PNG, HEIC, DOC, DOCX, XLS and XLSX',
      fileMap: new Map(),
      fileRules: [],
      uploadedSupportingDocuments: [],
      editedIndex: -1,
      editedItem: {
        selectFacility: '',
      },
      defaultItem: {
        selectFacility: '',
      },
      selectRules: [(v) => !!v || 'This is required'],
    };
  },
  computed: {
    ...mapState(useAuthStore, ['userInfo']),
    ...mapState(useFacilityStore, ['facilityModel', 'facilityId']),
    ...mapState(useNavBarStore, [
      'canSubmit',
      'navBarList',
      'changeRequestId',
      'nextPath',
      'previousPath',
      'isChangeRequest',
    ]),
    ...mapState(useApplicationStore, [
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
      const newFilesAdded = this.uploadedSupportingDocuments.filter((el) => !!el.id);
      return (
        this.isValidForm && (newFilesAdded.length > 0 || this.uploadedSupportingDocuments?.deletedItems?.length > 0)
      );
    },
    isNextEnabled() {
      if (this.isChangeRequest) return this.isValidForm;
      return this.isValidForm && this.canSubmit;
    },
  },
  async mounted() {
    const maxSize = 2100000; // 2.18 MB is max size since after base64 encoding it might grow upto 3 MB.

    this.fileRules = [
      (v) => !!v || 'This is required',
      (value) => {
        return !value || !value.length || value[0]?.name?.length < 255 || 'File name can be max 255 characters.';
      },
      (value) => {
        return (
          !value ||
          !value.length ||
          value[0].size < maxSize ||
          `The maximum file size is ${humanFileSize(maxSize)} for each document.`
        );
      },
      (value) => {
        return (
          !value ||
          !value.length ||
          this.fileExtensionAccept.includes(getFileExtension(value[0].name)?.toLowerCase()) ||
          `Accepted file types are ${this.fileFormats}.`
        );
      },
    ];

    await this.mapFacilityData();
    await this.createTable();
    if (this.isChangeRequest) {
      if (this.getChangeNotificationActionId) {
        this.otherChanges = 'Yes';
      } else {
        this.otherChanges = 'No';
      }
    }
  },
  methods: {
    ...mapActions(useSupportingDocumentUploadStore, ['saveUploadedDocuments', 'getDocuments', 'deleteDocuments']),
    ...mapActions(useReportChangesStore, [
      'createChangeAction',
      'deleteChangeAction',
      'addChangeNotificationId',
      'deleteChangeNotificationId',
    ]),
    ...mapActions(useNavBarStore, ['forceNavBarRefresh']),
    backSelected() {
      this.otherChanges = 'Yes';
      this.dialog = false;
    },
    noReportChanges() {
      let changeNotificationId = this.getChangeNotificationActionId;
      console.log('change action id: ', changeNotificationId);
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
              console.log('change action id: ', results.changeActionId);
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
          console.log('next path: ', this.nextPath);
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
        const newFilesAdded = this.uploadedSupportingDocuments.filter((el) => !!el.id);
        if (newFilesAdded.length > 0) {
          await this.processDocumentFilesSave(newFilesAdded);
          this.fileMap?.clear();
        }

        if (showConfirmation) {
          await this.createTable();
          this.setSuccessAlert('Changes Successfully Saved');
        }
      } catch {
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
          subject: 'SUPPORTING',
          notetext: file.description,
          changeRequestNewFacilityId: file.selectFacility?.changeRequestNewFacilityId,
          ...this.fileMap.get(String(file.id)),
        };
        payload.push(obj);
      }
      try {
        await this.saveUploadedDocuments(payload);
      } catch {
        this.setFailureAlert('An error occurred while saving. Please try again later.');
      }
    },
    async processDocumentFileDelete() {
      if (this.uploadedSupportingDocuments?.deletedItems?.length > 0) {
        await this.deleteDocuments(this.uploadedSupportingDocuments.deletedItems);
      }
    },
    async selectFile(event) {
      this.currentrow = event.target.id;
      const file = event?.target?.files[0];
      if (file) {
        const doc = await this.readFile(file);
        this.fileMap.set(this.currentrow, deepCloneObject(doc));
      }
    },
    readFile(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onload = () => {
          const doc = {
            filename: getFileNameWithMaxNameLength(file.name),
            filesize: file.size,
            documentbody: window.btoa(reader.result),
          };
          resolve(doc);
        };
        reader.onabort = () => {
          this.setErrorAlert('Sorry, an unexpected error seems to have occurred. Try uploading your files later.');
          reject();
        };
        reader.onerror = () => {
          this.setErrorAlert('Sorry, an unexpected error seems to have occurred. Try uploading your files later.');
          reject();
        };
      });
    },
    handleFileReadErr() {
      this.setErrorAlert('Sorry, an unexpected error seems to have occurred. Try uploading your files later.');
    },
    async createTable() {
      this.isLoading = true;
      try {
        await this.getDocuments(this.applicationId);
        this.uploadedSupportingDocuments = this.uploadedDocuments.filter(
          (document) => this.navBarList.findIndex((item) => item.facilityId == document.ccof_facility) > -1,
        );
      } catch (e) {
        console.error(e);
      } finally {
        this.isLoading = false;
        this.fileMap?.clear();
      }
    },
    editItem(item) {
      this.editedIndex = this.uploadedSupportingDocuments.indexOf(item);
      this.editedItem = Object.assign({}, item);
    },

    deleteItem(item) {
      const index = this.uploadedSupportingDocuments.indexOf(item);
      if (item.annotationid) {
        let deletedItems = this.uploadedSupportingDocuments['deletedItems'];
        if (deletedItems?.length > 0) {
          deletedItems.push(item.annotationid);
          this.uploadedSupportingDocuments['deletedItems'] = deletedItems;
        } else {
          deletedItems = [];
          deletedItems.push(item.annotationid);
          this.uploadedSupportingDocuments['deletedItems'] = deletedItems;
        }
      }
      this.uploadedSupportingDocuments.splice(index, 1);
    },
    addNew() {
      const addObj = Object.assign({}, this.defaultItem);
      addObj.id = Math.random() * 10;
      //addObj.id = this.uploadedSupportingDocuments.length + 1;
      this.uploadedSupportingDocuments.unshift(addObj);
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
