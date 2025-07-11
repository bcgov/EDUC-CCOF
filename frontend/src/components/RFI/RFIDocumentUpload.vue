<template>
  <v-form ref="form" v-model="isValidForm">
    <p class="text-h5 text-primary mb-2">Documentation Required</p>
    <div>
      <p class="text-body-1 mb-1">
        Upload supporting documents (for example, receipts, quotes, invoices, and/or budget/finance documents)
      </p>
      <p class="text-body-2">
        {{ FILE_REQUIREMENTS_TEXT }}
      </p>
    </div>
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
          <AppButton v-if="!isLocked" id="add-new-file" :primary="false" size="large" class="mb-2" @click="addNew">
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
          :id="String(item.id)"
          color="#003366"
          :rules="rules.fileRules"
          prepend-icon="mdi-file-upload"
          :clearable="false"
          class="mt-4"
          :accept="FILE_TYPES_ACCEPT"
          :disabled="false"
          placeholder="Select your file"
          required
          @click:clear="deleteItem(item)"
          @mousedown:control="uploadDocumentClicked($event)"
          @update:model-value="selectFile"
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
          clearable
          :rules="[rules.maxLength(255)]"
          max-length="255"
          class="mt-4"
          @change="descriptionChanged(item)"
        />
      </template>
      <template #item.actions="{ item }">
        <v-icon v-if="!isLocked" size="small" @click="deleteItem(item)"> mdi-delete </v-icon>
      </template>
    </v-data-table>
  </v-form>
</template>
<script>
import { mapState } from 'pinia';

import AppButton from '@/components/guiComponents/AppButton.vue';

import { useApplicationStore } from '@/store/application.js';
import { useNavBarStore } from '@/store/navBar.js';
import { useReportChangesStore } from '@/store/reportChanges.js';

import { getFileNameWithMaxNameLength } from '@/utils/file.js';
import alertMixin from '@/mixins/alertMixin.js';
import rules from '@/utils/rules.js';
import { deepCloneObject } from '@/utils/common.js';
import { CHANGE_TYPES, FILE_REQUIREMENTS_TEXT, FILE_TYPES_ACCEPT } from '@/utils/constants.js';

export default {
  components: { AppButton },
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
      isValidForm: false,
      currentrow: null,
      headers: [
        {
          text: 'Document',
          value: 'document',
          sortable: false,
          width: '35%',
          class: 'table-header',
        },
        {
          text: 'Description',
          value: 'description',
          sortable: false,
          width: '55%',
          class: 'table-header',
        },
        {
          text: 'Actions',
          value: 'actions',
          sortable: false,
          class: 'table-header',
        },
      ],
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
  created() {
    this.FILE_REQUIREMENTS_TEXT = FILE_REQUIREMENTS_TEXT;
    this.FILE_TYPES_ACCEPT = FILE_TYPES_ACCEPT;
    this.rules = rules;
  },
  async mounted() {
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
:deep(.v-field__input) {
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
