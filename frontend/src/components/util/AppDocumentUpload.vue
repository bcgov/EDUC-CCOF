<template>
  <v-form>
    <template v-if="title">
      <div class="mb-2">
        <span class="text-h6 font-weight-bold mr-6">{{ title }}</span>
        <span> (Required)</span>
      </div>
      <div class="mb-4">
        {{ FILE_REQUIREMENTS_TEXT }}
      </div>
    </template>
    <v-card elevation="2" :class="!readonly ? 'pa-4 my-4' : 'pb-6'">
      <AppButton
        v-if="showAddFileButton"
        id="add-new-file"
        :primary="false"
        size="large"
        class="add-file-button"
        @click="addFile"
      >
        Add File
      </AppButton>
      <div v-if="documents.length > 0" class="mt-6">
        <v-row v-for="item in documents" :key="item.id" no-gutters>
          <v-col cols="12" md="4" class="pr-4">
            <v-file-input
              v-model="item.file"
              label="Select a file"
              prepend-icon="mdi-file-upload"
              :rules="rules.fileRules"
              :accept="FILE_TYPES_ACCEPT"
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
          item-key="annotationId"
          items-per-page="-1"
          density="compact"
        >
          <template #item.actionButtons="{ item }">
            <v-icon v-if="isDeletable(item)" small @click="$emit('deleteUploadedDocument', item.annotationId)">
              mdi-delete
            </v-icon>
          </template>
          <template #bottom><!-- no paging --></template>
        </v-data-table>
      </div>
      <div v-if="showErrorMessage" class="error-message mt-4">Required</div>
    </v-card>
  </v-form>
</template>
<script>
import { uuid } from 'vue-uuid';
import { isEmpty } from 'lodash';

import AppButton from '@/components/guiComponents/AppButton.vue';
import alertMixin from '@/mixins/alertMixin.js';
import rules from '@/utils/rules.js';
import { DOCUMENT_TYPES, FILE_REQUIREMENTS_TEXT, FILE_TYPES_ACCEPT } from '@/utils/constants';
import { isValidFile, readFile } from '@/utils/file';

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
    showErrorMessage: {
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
              const convertedFile = await readFile(item.file);
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
    this.FILE_REQUIREMENTS_TEXT = FILE_REQUIREMENTS_TEXT;
    this.FILE_TYPES_ACCEPT = FILE_TYPES_ACCEPT;
    this.rules = rules;
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
      document.isValidFile = isEmpty(document?.file) || isValidFile(document?.file);
    },

    resetDocuments() {
      this.documents = [];
    },

    isDeletable(document) {
      return !this.loading && !this.readonly && document?.documentType !== DOCUMENT_TYPES.APPLICATION_AFS_SUBMITTED;
    },
  },
};
</script>
<style scoped>
:deep(.v-field__input) {
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
