<template>
  <v-form ref="form" v-model="isValidForm">
    <div class="pa-0">
      <div class="pa-2 pa-md-4 ma-0">
        <p class="text-h5 text--primary px-5 py-0 my-0">Documentation Required</p>
      </div>
      <div class="px-md-12 px-7">
        <v-row class="px-6 text-body-1">
          Upload Supporting Documents (for example receipts, quotes, invoices and/or budget/finance documents here:)
        </v-row>
        <v-row class="pa-6 pt-2 text-body-2">
          The maximum file size is 2MB for each document. Accepted file types are jpg, jpeg, heic, png, pdf, docx, doc,
          xls, and xlsx.
        </v-row>
      </div>
      <div class="px-md-12 px-7 pb-10">
        <v-data-table
          v-if="!isLoading"
          :headers="headers"
          :items="uploadedRFITypeDocuments"
          class="data-table-style"
          hide-default-header
          hide-default-footer
          hide-border
          :items-per-page="-1"
          no-data-text=""
        >
          <template #top>
            <v-col flex>
              <div class="d-flex">
                <v-btn class="my-5" dark color="#003366" :disabled="isLocked" @click="addNew">
                  <v-icon dark> mdi-plus </v-icon>
                  Add
                </v-btn>
              </div>
            </v-col>
          </template>
          <template #item.document="{ item }">
            <div v-if="item?.annotationid">
              <span> {{ item?.filename }} </span>
            </div>
            <v-file-input
              v-else
              :id="String(item.id)"
              @update:model-value="selectFile"
              color="#003366"
              :rules="fileRules"
              prepend-icon="mdi-file-upload"
              :clearable="false"
              class="pt-0"
              :accept="fileAccept"
              :disabled="false"
              placeholder="Select your file"
              :error-messages="fileInputError"
              required
              @click:clear="deleteItem(item)"
              @click="uploadDocumentClicked($event)"
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
              max-length="255"
              @change="descriptionChanged(item)"
            />
          </template>
          <template #item.actions="{ item }">
            <v-icon v-if="!isLocked" size="small" @click="deleteItem(item)"> mdi-delete </v-icon>
          </template>
        </v-data-table>
      </div>
    </div>
  </v-form>
</template>
<script>
import { mapState } from 'pinia';
import { useApplicationStore } from '../../store/application.js';
import { useNavBarStore } from '../../store/navBar.js';
import { useReportChangesStore } from '../../store/reportChanges.js';

import { getFileExtension, getFileNameWithMaxNameLength, humanFileSize } from '../../utils/file.js';
import alertMixin from '../../mixins/alertMixin.js';
import rules from '../../utils/rules.js';
import { deepCloneObject } from '../../utils/common.js';
import { CHANGE_TYPES } from '../../utils/constants.js';

export default {
  components: {},
  mixins: [alertMixin],
  props: {
    currentFacility: {
      type: Object,
      required: true,
    },
    rFIType: {
      type: String,
      required: true,
    },
    rFIDocuments: {
      type: Array,
      required: true,
    },
  },
  emits: ['addRFIDocument', 'addRFIDocumentDescription', 'deleteRFIDocument', 'addRFIRow'],
  data() {
    return {
      isLoading: false,
      isProcessing: false,
      rules,
      isValidForm: false,
      currentrow: null,
      headers: [
        {
          text: 'Document',
          align: 'left',
          sortable: false,
          value: 'document',
          class: 'table-header',
        },
        {
          text: 'Description',
          align: 'left',
          sortable: false,
          value: 'description',
          class: 'table-header',
        },
        {
          text: 'Actions',
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
      fileRules: [],
      uploadedRFITypeDocuments: [],
      editedIndex: -1,
      editedItem: {
        document: '',
        description: '',
        id: null,
      },
      defaultItem: {
        document: '',
        description: '',
        id: null,
      },
      selectRules: [(v) => !!v || 'This is required'],
    };
  },
  computed: {
    ...mapState(useApplicationStore, ['applicationStatus']),
    ...mapState(useNavBarStore, ['changeRequestId', 'changeType', 'isChangeRequest']),
    ...mapState(useReportChangesStore, ['changeRequestStatus']),
    isLocked() {
      if (this.currentFacility.unlockRfi) {
        return false;
      } else if (this.isChangeRequest) {
        if (!this.changeRequestStatus) {
          return false;
        } else if (this.changeRequestStatus !== 'INCOMPLETE') {
          return true;
        }
      } else if (this.applicationStatus === 'SUBMITTED') {
        return true;
      }
      return false;
    },
  },
  watch: {
    rFIDocuments: {
      handler: function (val) {
        this.uploadedRFITypeDocuments = val;
      },
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
    await this.createTable();
  },
  methods: {
    async selectFile(file) {
      if (file) {
        const doc = await this.readFile(file);
        const clonedDoc = deepCloneObject(doc);
        const obj = {
          id: this.currentrow,
          documentType: this.rFIType,
          ...clonedDoc,
        };
        this.$emit('addRFIDocument', obj);
      }
    },
    descriptionChanged(item) {
      if (this.isValidForm) {
        const obj = {
          id: item.id,
          description: item.description,
        };
        this.$emit('addRFIDocumentDescription', obj);
      }
    },
    readFile(file) {
      try {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsArrayBuffer(file); // Use readAsArrayBuffer instead

          reader.onload = () => {
            const arrayBuffer = reader.result;
            const binaryString = new Uint8Array(arrayBuffer).reduce((acc, byte) => acc + String.fromCharCode(byte), '');
            const base64String = window.btoa(binaryString); // Convert to Base64

            const doc = {
              filename:
                this.changeType == CHANGE_TYPES.MTFI
                  ? getFileNameWithMaxNameLength(`MTFI_${file.name}`)
                  : getFileNameWithMaxNameLength(file.name),
              filesize: file.size,
              documentbody: base64String,
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
      } catch (error) {
        console.log('file error: ', error);
      }
    },

    uploadDocumentClicked(event) {
      this.currentrow = event.target.id;
    },

    handleFileReadErr() {
      this.setErrorAlert('Sorry, an unexpected error seems to have occurred. Try uploading your files later.');
    },
    async createTable() {
      this.isLoading = true;
      try {
        this.uploadedRFITypeDocuments = this.rFIDocuments;
      } catch (e) {
        console.error(e);
      } finally {
        this.isLoading = false;
      }
    },
    editItem(item) {
      this.editedIndex = this.uploadedRFITypeDocuments.indexOf(item);
      this.editedItem = Object.assign({}, item);
    },
    deleteItem(item) {
      this.$emit('deleteRFIDocument', item);
    },
    addNew() {
      const addObj = Object.assign({}, this.defaultItem);
      addObj.id = this.rFIType + (this.uploadedRFITypeDocuments?.length + 1);
      addObj.documentType = this.rFIType;
      this.editItem(addObj);
      this.$emit('addRFIRow', addObj);
    },
  },
};
</script>
<style scoped>
.table-header {
  background-color: #f2f2f2;
}
.data-table-style {
  border-collapse: collapse;
  border-bottom: none;
}
</style>
