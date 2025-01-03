<template>
  <v-form ref="form">
    <v-container class="pa-0">
      <div class="mt-2 mb-4">
        {{ FILE_REQUIREMENTS_TEXT }}
      </div>
      <v-data-table
        v-if="!isLoading"
        :headers="headers"
        :items="getFilteredDocs"
        class="elevation-1 pa-2"
        hide-default-header
        hide-default-footer
        :items-per-page="-1"
      >
        <template #top>
          <v-col flex>
            <AppButton v-if="!isReadOnly" id="add-new-file" :primary="false" size="large" class="mb-2" @click="addNew">
              Add File
            </AppButton>
          </v-col>
        </template>

        <template #item.document="{ item }">
          <div v-if="item?.annotationid">
            <span> {{ item?.filename }} </span>
          </div>
          <v-file-input
            v-else
            :id="item.id"
            color="#003366"
            :rules="rules.fileRules"
            prepend-icon="mdi-file-upload"
            :clearable="false"
            class="pt-6 file-input"
            :accept="FILE_TYPES_ACCEPT"
            :disabled="isReadOnly"
            placeholder="Select your file"
            @click:clear="deleteItem(item)"
            @change="selectFile"
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
            clearable
            :rules="[rules.maxLength(255)]"
            class="pt-6"
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
      <div v-if="showErrorMessage && !isFileUploaded" class="px-3 pt-4 text-body-1 error-message">
        Please upload the Change Notification Form.
      </div>
    </v-container>
  </v-form>
</template>

<script>
import { mapActions, mapState } from 'pinia';
import { uuid } from 'vue-uuid';

import AppButton from '@/components/guiComponents/AppButton.vue';

import { useReportChangesStore } from '@/store/reportChanges.js';
import { useAuthStore } from '@/store/auth.js';
import { useApplicationStore } from '@/store/application.js';
import { useNavBarStore } from '@/store/navBar.js';

import DocumentService from '@/services/documentService';

import rules from '@/utils/rules.js';
import alertMixin from '@/mixins/alertMixin.js';
import { isValidFile, readFile } from '@/utils/file.js';
import { deepCloneObject } from '@/utils/common.js';
import { DOCUMENT_TYPES, FILE_REQUIREMENTS_TEXT, FILE_TYPES_ACCEPT } from '@/utils/constants.js';

export default {
  components: { AppButton },
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
    showErrorMessage: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['fileChange'],
  data() {
    return {
      filteredDocs: [],
      isLoading: false,
      isProcessing: false,
      facilityNames: [],
      model: {},
      tempFacilityId: null,
      currentrow: null,
      headers: [
        {
          title: 'Document',
          sortable: false,
          key: 'document',
          width: '40%',
        },
        {
          title: 'Description',
          sortable: false,
          key: 'notetext',
          width: '54%',
        },
        {
          title: 'Actions',
          sortable: false,
          key: 'actions',
          width: '6%',
        },
      ],
      fileMap: new Map(),
      editedIndex: -1,
      editedItem: {
        ccof_change_action_id: '',
      },
      defaultItem: {
        ccof_change_action_id: this.$route.params.urlGuid,
        subject: this.changeType,
      },
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
      } else if (this.changeType === DOCUMENT_TYPES.CR_NOTIFICATION_FORM_SUPPORTING) {
        if (this.isOtherDocumentsUnlocked) {
          return false;
        }
      }
      let currentCR = this.changeRequestMap.get(this.$route.params?.changeRecGuid);
      return currentCR?.externalStatus !== 'INCOMPLETE';
    },
    savedDocumentsCount() {
      const savedDocuments = this.uploadedDocuments.filter((document) => {
        return document.annotationid && document.subject == this.changeType;
      });
      return savedDocuments?.length;
    },
    unsavedDocumentsCount() {
      const unsavedDocuments = this.uploadedDocuments.filter((document) => {
        return !document.annotationid && document.subject == this.changeType && this.fileMap.has(document.id);
      });
      return unsavedDocuments?.length;
    },
    isFileUploaded() {
      return this.savedDocumentsCount + this.unsavedDocumentsCount > 0;
    },
  },

  watch: {
    isFileUploaded: {
      handler() {
        if (this.changeType === DOCUMENT_TYPES.CR_NOTIFICATION_FORM) {
          this.$emit('fileChange', this.isFileUploaded);
        }
      },
    },
  },

  created() {
    this.FILE_REQUIREMENTS_TEXT = FILE_REQUIREMENTS_TEXT;
    this.FILE_TYPES_ACCEPT = FILE_TYPES_ACCEPT;
    this.rules = rules;
  },
  methods: {
    ...mapActions(useReportChangesStore, ['createChangeRequest']),

    async save(showConfirmation = true) {
      this.isProcessing = true;
      try {
        await this.processDocumentFileDelete();
        if (this.fileMap.size > 0) {
          const newFilesAdded = this.uploadedDocuments.filter((el) => !!el.id);
          if (newFilesAdded.length > 0) {
            await this.processDocumentFilesSave(newFilesAdded);
            this.fileMap?.clear();
          }
          if (showConfirmation) {
            this.setSuccessAlert('Changes Successfully Saved');
          }
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
          ccof_change_action_id: this.$route.params?.urlGuid,
          subject: this.changeType,
          notetext: file.notetext,
          ...this.fileMap.get(file.id),
        };

        //only add objects from this component to the payload
        //each child componenet sends it's own save payload to Dynamics
        if (obj.filename) {
          payload.push(obj);
        }
      }
      try {
        await DocumentService.createChangeActionDocuments(payload);
      } catch {
        this.setFailureAlert('An error occurred while saving. Please try again later.');
      }
    },
    async processDocumentFileDelete() {
      if (this.uploadedDocuments?.deletedItems?.length > 0) {
        await DocumentService.deleteDocuments(this.uploadedDocuments.deletedItems);
        this.uploadedDocuments.deletedItems = [];
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
    },
    addNew() {
      const addObj = Object.assign({}, this.defaultItem);
      addObj.id = uuid.v1();
      this.uploadedDocuments.unshift(addObj);
      this.editItem(addObj);
    },
    updateDescription(item) {
      const index = this.uploadedDocuments.indexOf(item);
      this.uploadedDocuments[index].notetext = item.notetext;
    },
  },
};
</script>
<style scoped>
.table-header {
  background-color: #f2f2f2;
}
.file-input {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
