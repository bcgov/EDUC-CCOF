<template>
  <v-form ref="form" v-model="isValidForm">
    <v-container class="pa-0">
      <v-row no-gutters>
        <v-col class="col-12 mb-6">
          The maximum file size is 2MB for each document. Accepted file types are jpg, jpeg, heic, png, pdf, docx, doc,
          xls, and xlsx.
        </v-col>
        <v-col class="col-12">
          <v-data-table
            v-if="!isLoading"
            :headers="headers"
            :items="getFilteredDocs"
            class="elevation-1"
            hide-default-header
            hide-default-footer
            :items-per-page="-1"
          >
            <template #top>
              <v-col flex>
                <v-toolbar flat color="white">
                  <div class="d-flex">
                    <v-btn
                      color="primary"
                      class="ml-2 text-white v-skeleton-loader-small-button"
                      :disabled="isReadOnly"
                      @click="addNew"
                    >
                      <v-icon dark> mdi-plus </v-icon>
                      Add
                    </v-btn>
                  </div>
                </v-toolbar>
              </v-col>
            </template>

            <template #item.document="{ item }">
              <div v-if="item?.annotationid">
                <span> {{ item?.filename }} </span>
              </div>
              <v-file-input
                v-else
                :id="String(item.id)"
                color="#003366"
                :rules="[...fileRules, ...rules.required]"
                prepend-icon="mdi-file-upload"
                :clearable="false"
                class="pt-0"
                :accept="fileAccept"
                :disabled="isReadOnly"
                placeholder="Select your file"
                :error-messages="fileInputError"
                required
                @click:clear="deleteItem(item)"
                @change="selectFile"
                @click="uploadDocumentClicked($event)"
              />
            </template>
            <template #item.notetext="{ item }">
              <div v-if="item?.annotationid">
                <span> {{ item?.notetext }} </span>
              </div>
              <v-text-field
                v-else
                v-model="item.notetext"
                placeholder="Enter a description (Optional)"
                density="compact"
                clearable
                :rules="[rules.maxLength(255)]"
                @change="updateDescription(item)"
              />
            </template>

            <template #item.actions="{ item }">
              <v-icon v-if="!isReadOnly" size="small" @click="deleteItem(item)"> mdi-delete </v-icon>
            </template>

            <template #no-data>
              <div class="text-body-1">
                {{ noDataDefaultText }}
              </div>
            </template>
          </v-data-table>
          <v-card v-if="isLoading" class="pl-6 pr-6 pt-4">
            <v-skeleton-loader :loading="true" type="button" />
            <v-skeleton-loader max-height="375px" :loading="true" type="table-row-divider@3" />
          </v-card>
          <v-row
            v-if="changeType === DOCUMENT_TYPES.CR_NOTIFICATION_FORM && !isFileUploaded"
            class="px-3 pt-4 text-body-1 text-red"
          >
            Please upload the Change Notification Form.
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>
import { mapActions, mapState } from 'pinia';
import { useReportChangesStore } from '@/store/reportChanges.js';
import { useAuthStore } from '@/store/auth.js';
import { useApplicationStore } from '@/store/application.js';
import { useNavBarStore } from '@/store/navBar.js';

import rules from '@/utils/rules.js';
import alertMixin from '@/mixins/alertMixin.js';
import { getFileNameWithMaxNameLength, humanFileSize } from '@/utils/file.js';
import { deepCloneObject, getFileExtension } from '@/utils/common.js';
import { DOCUMENT_TYPES } from '@/utils/constants.js';

export default {
  components: {},
  mixins: [alertMixin],
  async beforeRouteLeave(_to, _from, next) {
    if (!this.isReadOnly) {
      await this.save(false);
    }
    next();
  },
  props: {
    changeType: {
      type: String,
      required: true,
    },
    noDataDefaultText: {
      type: String,
      required: false,
      default: '',
    },
  },
  emits: ['fileChange'],
  data() {
    return {
      filteredDocs: [],
      isLoading: false,
      isProcessing: false,
      rules,
      facilityNames: [],
      model: {},
      tempFacilityId: null,
      isValidForm: false,
      currentrow: null,
      headers: [
        {
          title: 'Document',
          align: 'left',
          sortable: false,
          value: 'document',
          class: 'table-header',
        },
        {
          title: 'Description',
          align: 'left',
          sortable: false,
          value: 'notetext',
          class: 'table-header',
        },
        {
          title: 'Actions',
          align: 'left',
          sortable: false,
          value: 'actions',
          class: 'table-header',
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
      fileInputError: [],
      fileMap: new Map(),
      fileRules: [],
      editedIndex: -1,
      editedItem: {
        ccof_change_action_id: '',
      },
      defaultItem: {
        ccof_change_action_id: this.$route.params.urlGuid,
        subject: this.changeType,
      },
      isFileUploaded: true,
    };
  },

  computed: {
    ...mapState(useApplicationStore, ['applicationStatus', 'applicationId', 'formattedProgramYear']),
    ...mapState(useAuthStore, ['userInfo']),
    ...mapState(useNavBarStore, ['changeRequestId']),
    ...mapState(useReportChangesStore, [
      'uploadedDocuments',
      'loadedChangeRequest',
      'changeRequestMap',
      'isChangeRequestUnlocked',
      'isOtherDocumentsUnlocked',
    ]),
    getFilteredDocs() {
      return this.uploadedDocuments.filter((el) => el.subject == this.changeType);
    },
    isReadOnly() {
      if (this.changeType === DOCUMENT_TYPES.CR_NOTIFICATION_FORM) {
        if (this.isChangeRequestUnlocked) {
          return false;
        }
      } else if (this.changeType === 'SUPPORTING_DOC') {
        if (this.isOtherDocumentsUnlocked) {
          return false;
        }
      }
      let currentCR = this.changeRequestMap.get(this.$route.params?.changeRecGuid);
      return currentCR?.externalStatus !== 'INCOMPLETE';
    },
  },
  created() {
    const maxSize = 2100000; // 2.18 MB is max size since after base64 encoding it might grow upto 3 MB.
    this.DOCUMENT_TYPES = DOCUMENT_TYPES;
    this.fileRules = [
      (v) => !!v || 'This is required',
      (value) => !value || value.name.length < 255 || 'File name can be max 255 characters.',
      (value) =>
        !value || value.size < maxSize || `The maximum file size is ${humanFileSize(maxSize)} for each document.`,
      (value) =>
        !value ||
        this.fileExtensionAccept.includes(getFileExtension(value.name)?.toLowerCase()) ||
        `Accepted file types are ${this.fileFormats}.`,
    ];
  },
  methods: {
    ...mapActions(useReportChangesStore, [
      'createChangeRequest',
      'loadChangeRequestDocs',
      'saveUploadedDocuments',
      'setUploadedDocuments',
      'deleteDocuments',
    ]),

    async save(showConfirmation = true) {
      this.isProcessing = true;
      try {
        await this.processDocumentFileDelete();

        if (this.fileMap.size > 0) {
          const newFilesAdded = this.uploadedDocuments.filter((el) => !!el.id);
          console.log('newFilesAdded', newFilesAdded);
          if (newFilesAdded.length > 0) {
            await this.processDocumentFilesSave(newFilesAdded);
            this.fileMap?.clear();
          }
          if (showConfirmation) {
            this.setSuccessAlert('Changes Successfully Saved');
          }
        } else {
          console.log('returning...');
          return;
        }
      } catch {
        this.setFailureAlert('error in CHILD');
      } finally {
        this.isProcessing = false;
      }
    },
    async processDocumentFilesSave(newFilesAdded) {
      const payload = [];
      for (const file of newFilesAdded) {
        const obj = {
          ccof_change_action_id: this.$route.params?.urlGuid,
          subject: this.changeType,
          notetext: file.notetext,
          ...this.fileMap.get(String(file.id)),
        };

        //only add objects from this component to the payload
        //each child componenet sends it's own save payload to Dynamics
        if (obj.filename) {
          payload.push(obj);
        }
      }
      try {
        await this.saveUploadedDocuments(payload);
      } catch {
        this.setFailureAlert('An error occurred while saving. Please try again later.');
      }
    },
    async processDocumentFileDelete() {
      if (this.uploadedDocuments?.deletedItems?.length > 0) {
        await this.deleteDocuments(this.uploadedDocuments.deletedItems);
        this.uploadedDocuments.deletedItems = [];
      }
    },
    async selectFile(file) {
      if (file) {
        const doc = await this.readFile(file);
        this.fileMap.set(this.currentrow, deepCloneObject(doc));
        await this.checkUploadCompleteStatus();
      }
    },
    readFile(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsBinaryString(file);
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
    uploadDocumentClicked(event) {
      this.currentrow = event.target.id;
    },
    handleFileReadErr() {
      this.setErrorAlert('Sorry, an unexpected error seems to have occurred. Try uploading your files later.');
    },
    editItem(item) {
      this.editedIndex = this.filteredDocs.indexOf(item);
      this.editedItem = Object.assign({}, item);
    },
    async deleteItem(item) {
      const index = this.uploadedDocuments.indexOf(item);
      if (item.annotationid) {
        let deletedItems = this.uploadedDocuments['deletedItems'];
        if (deletedItems?.length > 0) {
          deletedItems.push(item.annotationid);
          this.uploadedDocuments['deletedItems'] = deletedItems;
        } else {
          deletedItems = [];
          deletedItems.push(item.annotationid);
          this.uploadedDocuments['deletedItems'] = deletedItems;
        }
      }
      this.fileMap.delete('' + item.id);
      this.uploadedDocuments.splice(index, 1);
      await this.checkUploadCompleteStatus();
    },
    addNew() {
      const addObj = Object.assign({}, this.defaultItem);
      addObj.id = Math.floor(Math.random() * 1000000); //TODO: i think this where we need UUID
      this.uploadedDocuments.unshift(addObj);
      //this.testUploadedDocs.unshift(addObj); //this is the prop from parent, might not do anything, idk this point
      this.editItem(addObj);
    },
    updateDescription(item) {
      const index = this.uploadedDocuments.indexOf(item);
      this.uploadedDocuments[index].notetext = item.notetext;
    },
    async getSavedDocumentsCount() {
      let savedDocuments = this.uploadedDocuments.filter((document) => {
        return document.annotationid && document.subject == this.changeType;
      });
      let savedDocumentsCount = savedDocuments?.length ? savedDocuments?.length : 0;
      return savedDocumentsCount;
    },
    async getUnsavedDocumentsCount() {
      let unsavedDocuments = this.uploadedDocuments.filter((document) => {
        return !document.annotationid && document.subject == this.changeType && this.fileMap.has('' + document.id);
      });
      let unsavedDocumentsCount = unsavedDocuments?.length ? unsavedDocuments?.length : 0;
      return unsavedDocumentsCount;
    },
    async checkUploadCompleteStatus() {
      if (this.changeType === DOCUMENT_TYPES.CR_NOTIFICATION_FORM) {
        let savedDocumentsCount = await this.getSavedDocumentsCount();
        let unsavedDocumentsCount = await this.getUnsavedDocumentsCount();
        this.isFileUploaded = savedDocumentsCount + unsavedDocumentsCount > 0;
        this.$emit('fileChange', this.isFileUploaded && this.isValidForm);
      } else {
        this.$emit('fileChange', this.isValidForm);
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
</style>
