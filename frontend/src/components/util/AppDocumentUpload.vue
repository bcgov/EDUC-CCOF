<template>
  <v-form>
    <div class="mb-2">
      <span class="text-h6 font-weight-bold mr-6">{{ title }}</span>
      <span> (Required)</span>
    </div>
    <div class="mb-4">{{ DOCUMENTS_REQUIREMENT_MESSAGE }}</div>
    <v-card elevation="2" class="pa-4 my-4">
      <AppButton
        v-if="showAddFileButton"
        id="add-new-file"
        :primary="false"
        size="large"
        class="add-file-button"
        @click="addFile"
        >Add File</AppButton
      >
      <div v-if="documents.length > 0" class="mt-6">
        <v-row v-for="item in documents" :key="item.id" no-gutters>
          <v-col cols="12" md="4" class="pr-4">
            <v-file-input
              v-model="item.file"
              label="Select a file"
              prepend-icon="mdi-file-upload"
              :rules="[...fileRules]"
              :accept="fileExtensionAccept"
              :disabled="loading"
              @update:model-value="validateFile(item.id)"
            />
          </v-col>
          <v-col cols="11" md="7" class="pr-4">
            <v-text-field
              v-model.trim="item.description"
              :disabled="loading"
              placeholder="Enter a description (Optional)"
              counter
              maxlength="1000"
              dense
              clearable
            ></v-text-field>
          </v-col>
          <v-col v-if="!loading && !readonly" cols="1" class="pt-3">
            <v-icon small @click="deleteFile(item.id)">mdi-delete</v-icon>
          </v-col>
        </v-row>
      </div>
      <div v-if="uploadedDocuments.length > 0" class="mt-6 mx-4 mx-md-8 mx-lg-12">
        <h3>Uploaded Documents</h3>
        <v-data-table
          :headers="headersUploadedDocuments"
          :items="uploadedDocuments"
          item-key="documentId"
          items-per-page="-1"
          density="compact"
        >
          <template #item.actionButtons="{ item }">
            <v-icon
              v-if="!loading && !readonly"
              small
              @click="$emit('deleteUploadedDocument', item.documentId, documentType)"
              >mdi-delete</v-icon
            >
          </template>
          <template #bottom><!-- no paging --></template>
        </v-data-table>
      </div>
      <div>
        <v-row>
          <v-col>
            <slot></slot>
          </v-col>
        </v-row>
      </div>
    </v-card>
  </v-form>
</template>
<script>
import { uuid } from 'vue-uuid';

import AppButton from '@/components/guiComponents/AppButton.vue';
import alertMixin from '@/mixins/alertMixin.js';
import { DOCUMENTS_REQUIREMENT_MESSAGE } from '@/utils/constants';
import { humanFileSize, getFileExtensionWithDot, getFileNameWithMaxNameLength } from '@/utils/file';

export default {
  components: { AppButton },
  mixins: [alertMixin],
  props: {
    title: {
      type: String,
      default: undefined,
    },
    documentType: {
      type: String,
      default: undefined,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    uploadedDocuments: {
      type: Array,
      default: () => [],
    },
  },
  emits: ['updateDocumentsToUpload', 'deleteUploadedDocument', 'validateDocumentsToUpload'],
  data() {
    return {
      documents: [],
    };
  },
  computed: {
    showAddFileButton() {
      return !this.loading && !this.readonly;
    },
  },
  watch: {
    documents: {
      async handler() {
        this.validateDocumentsToUpload();
        const documentsToUpload = await Promise.all(
          this.documents
            ?.filter((document) => document.isValidFile && document.file)
            ?.map(async (item) => {
              const convertedFile = await this.readFile(item.file);
              return { ...item, ...convertedFile };
            }),
        );
        this.$emit('updateDocumentsToUpload', documentsToUpload);
      },
      deep: true,
    },
    loading: {
      handler(value) {
        if (value) return;
        this.resetDocuments();
        this.addFile();
      },
    },
  },
  created() {
    this.DOCUMENTS_REQUIREMENT_MESSAGE = DOCUMENTS_REQUIREMENT_MESSAGE;
    this.MAX_FILE_SIZE = 4194304; // 4 MB
    this.fileExtensionAccept = ['.pdf', '.png', '.jpg', '.jpeg', '.heic', '.doc', '.docx', '.xls', '.xlsx'];
    this.fileFormats = 'PDF, JPEG, JPG, PNG, HEIC, DOC, DOCX, XLS, and XLSX';
    this.fileRules = [
      (value) => {
        return (
          !value ||
          !value.length ||
          value[0].size < this.MAX_FILE_SIZE ||
          `The maximum file size is ${humanFileSize(this.MAX_FILE_SIZE)} for each document.`
        );
      },
      (value) => {
        return (
          !value ||
          !value.length ||
          this.fileExtensionAccept.includes(getFileExtensionWithDot(value[0].name)?.toLowerCase()) ||
          `Accepted file types are ${this.fileFormats}.`
        );
      },
    ];
    this.headersUploadedDocuments = [
      { title: 'File Name', key: 'fileName', width: '34%' },
      { title: 'Description', key: 'description', width: '60%' },
      { title: '', key: 'actionButtons', sortable: false, width: '6%' },
    ];
    this.addFile();
  },
  methods: {
    addFile() {
      if (this.readonly) return;
      this.documents.push({
        id: uuid.v1(),
        isValidFile: true,
        documentType: this.documentType,
      });
    },

    deleteFile(deletedItemId) {
      const index = this.documents.findIndex((item) => item.id === deletedItemId);
      if (index > -1) {
        this.documents.splice(index, 1);
      }
    },

    validateDocumentsToUpload() {
      this.$emit(
        'validateDocumentsToUpload',
        this.documents?.every((file) => file.isValidFile),
      );
    },

    validateFile(updatedItemId) {
      const document = this.documents.find((item) => item.id === updatedItemId);
      const file = document?.file;
      if (file) {
        const isLessThanMaxSize = file.size < this.MAX_FILE_SIZE;
        const isFileExtensionAccepted = this.fileExtensionAccept.includes(
          getFileExtensionWithDot(file.name)?.toLowerCase(),
        );
        document.isValidFile = isLessThanMaxSize && isFileExtensionAccepted;
      } else {
        document.isValidFile = true;
      }
    },

    resetDocuments() {
      this.documents = [];
    },

    readFile(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onload = () => {
          const arrayBuffer = reader.result;
          const binaryString = new Uint8Array(arrayBuffer).reduce((acc, byte) => acc + String.fromCharCode(byte), '');
          const base64String = window.btoa(binaryString); // Convert to Base64
          const doc = {
            fileName: getFileNameWithMaxNameLength(file.name),
            fileSize: file.size,
            documentBody: base64String,
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
  },
};
</script>
<style scoped>
.add-file-button {
  font-size: 16px;
}

:deep(.v-field__input) {
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
