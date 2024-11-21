<template>
  <v-form ref="form" v-model="isValidForm">
    <div class="mb-2">
      <span class="text-h6 font-weight-bold mr-6">{{ title }}</span>
      <span> (Required)</span>
    </div>
    <div class="mb-4">{{ DOCUMENTS_REQUIREMENT_MESSAGE }}</div>
    <v-card elevation="2" class="pa-4 my-4">
      <AppButton
        v-if="showAddFileButton"
        id="add-new-file"
        :disabled="disabled"
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
            ></v-file-input>
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
        <h3 v-if="!documentType">Uploaded Documents</h3>
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
import AppButton from '@/components/guiComponents/AppButton.vue';
import { humanFileSize, getFileExtensionWithDot } from '@/utils/file';
import { uuid } from 'vue-uuid';
import { DOCUMENTS_REQUIREMENT_MESSAGE } from '@/utils/constants';

export default {
  components: { AppButton },
  props: {
    title: {
      type: String,
      default: undefined,
    },
    entityName: {
      type: String,
      required: false,
      default: undefined,
    },
    documentLabel: {
      type: String,
      default: undefined,
    },
    documentType: {
      type: String,
      required: false,
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
    disabled: {
      type: Boolean,
      default: false,
    },
    uploadedDocuments: {
      type: Array,
      default: () => [],
    },
    uploadLimit: {
      type: String,
      default: undefined,
    },
  },
  emits: ['update:modelValue', 'deleteUploadedDocument', 'validateDocumentsToUpload'],
  data() {
    return {
      documents: [],
      isValidForm: false,
    };
  },
  computed: {
    uploadLimitReached() {
      return this.uploadLimit && this.documents?.length + this.uploadedDocuments?.length >= Number(this.uploadLimit);
    },
    showAddFileButton() {
      return !this.loading && !this.readonly && !this.uploadLimitReached;
    },
  },
  watch: {
    documents: {
      handler() {
        this.validateDocumentsToUpload();
        const documentsToUpload = this.documents?.filter((document) => document.isValidFile && document.file);
        this.$emit('update:modelValue', documentsToUpload);
      },
      deep: true,
    },
    loading: {
      handler(value) {
        if (value) return;
        this.documents = [];
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
    if (!this.disabled && !this.readonly && !this.uploadLimitReached) {
      this.addFile();
    }
  },
  methods: {
    addFile() {
      this.documents.push({
        id: uuid.v1(),
        entityName: this.entityName,
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

    // Need to add this validation because isValidForm is not responsive when file is updated
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
