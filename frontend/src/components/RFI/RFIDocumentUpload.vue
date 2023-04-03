<template>
  <v-form ref="form" v-model="isValidForm">
    <div class="pa-0">
      <div class="pa-2 pa-md-4 ma-0">
        <p class="text-h5 text--primary px-5 py-0 my-0">
          Documentation Required
        </p>
      </div>
      <div class="px-md-12 px-7">
        <v-row class="px-6 text-body-1">
          Upload Supporting Documents (for example receipts, quotes, invoices and/or budget/finance documents here:)
        </v-row>
        <v-row class="pa-6 pt-2 text-body-2">
          The maximum file size is 2MB for each document. Accepted file types are jpg, jpeg, png, pdf, docx, doc, xls,
          and
          xlsx.
        </v-row>
      </div>
      <div class="px-md-12 px-7 pb-10">
      <v-data-table v-if="!isLoading"
                    :headers="headers"
                    :items="uploadedRFITypeDocuments"
                    class="data-table-style"
                    hide-default-header
                    hide-default-footer
                    hide-border
                    :items-per-page="-1"
                   no-data-text=""
      >
        <template v-slot:top>
          <v-col flex>
            <v-toolbar flat color="white">
              <div class="d-flex">
                <v-btn class="my-5" dark color='#003366'
                       :disabled="isLocked"
                       @click="addNew">
                  <v-icon dark>mdi-plus</v-icon>
                  Add
                </v-btn>
              </div>
            </v-toolbar>
          </v-col>
        </template>
        <template v-slot:item.document="{ item }">
          <div v-if="item?.annotationid">
            <span> {{ item?.filename }} </span>
          </div>
          <v-file-input v-else
                        color="#003366"
                        :rules="fileRules"
                        @click:clear="deleteItem(item)"
                        prepend-icon="mdi-file-upload"
                        :clearable="false"
                        class="pt-0"
                        :id="String(item.id)"
                        :accept="fileAccept"
                        :disabled="false"
                        placeholder="Select your file"
                        :error-messages="fileInputError"
                        @change="selectFile"
                        @click="uploadDocumentClicked($event)"
                        required

          ></v-file-input>
        </template>
        <template v-slot:item.description="{ item }">
          <div v-if="item?.annotationid">
            <span> {{ item?.description }} </span>
          </div>
          <v-text-field v-else
                        placeholder="Enter a description (Optional)"
                        dense
                        clearable
                        :rules="[rules.maxLength(255)]"
                        max-length="255"
                        @change="descriptionChanged(item)"
                        v-model="item.description"
          ></v-text-field>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon
            small
            v-if="!isLocked"
            @click="deleteItem(item)"
          >
            mdi-delete
          </v-icon>
        </template>
      </v-data-table>
      </div>
    </div>
  </v-form>
</template>
<script>
import {getFileExtension, getFileNameWithMaxNameLength, humanFileSize} from '@/utils/file';
import alertMixin from '@/mixins/alertMixin';
import rules from '@/utils/rules';
import {deepCloneObject} from '@/utils/common';
import {mapState} from 'vuex';

export default {
  mixins: [alertMixin],
  components: {},
  props: {
    currentFacility: {
      type: Object,
      required: true
    },
    rFIType: {
      type: String,
      required: true
    },
    rFIDocuments: {
      type: Array,
      required: true
    },

  },

  computed: {
    ...mapState('application', ['applicationStatus']),
    isLocked() {
      if (this.currentFacility.unlockRfi === 1) {
        return false;
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
      }
    }
  },

  async mounted() {
    const maxSize = 2100000; // 2.18 MB is max size since after base64 encoding it might grow upto 3 MB.

    this.fileRules = [
      v => !!v || 'This is required',
      value => !value || value.name.length < 255 || 'File name can be max 255 characters.',
      value => !value || value.size < maxSize || `The maximum file size is ${humanFileSize(maxSize)} for each document.`,
      value => !value || this.fileExtensionAccept.includes(getFileExtension(value.name)?.toLowerCase()) || `Accepted file types are ${this.fileFormats}.`,
    ];
    await this.createTable();

  },

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
          class: 'table-header'
        },
        {
          text: 'Description',
          align: 'left',
          sortable: false,
          value: 'description',
          class: 'table-header'
        },
        {
          text: 'Actions',
          align: 'left',
          sortable: false,
          value: 'actions',
          class: 'table-header'
        }
      ],
      fileAccept: ['image/png', 'image/jpeg', 'image/jpg', '.pdf', '.png', '.jpg', '.jpeg', '.heic', '.doc', '.docx', '.xls', '.xlsx'],
      fileExtensionAccept: ['pdf', 'png', 'jpg', 'jpeg', 'heic', 'doc', 'docx', 'xls', 'xlsx'],
      fileFormats: 'PDF, JPEG, JPG, PNG, HEIC, DOC, DOCX, XLS and XLSX',
      fileInputError: [],
      fileRules: [],
      uploadedRFITypeDocuments: [],
      editedIndex: -1,
      editedItem: {
        document: '',
        description: '',
        id: null
      },
      defaultItem: {
        document: '',
        description: '',
        id: null
      },
      selectRules: [v => !!v || 'This is required']
    };
  },

  methods: {

    async selectFile(file) {
      if (file) {
        const doc = await this.readFile(file);
        if (this.isValidForm) {
          const clonedDoc = deepCloneObject(doc);
          const obj = {
            id: this.currentrow,
            documentType: this.rFIType,
            ...clonedDoc
          };
          this.$emit('addRFIDocument', obj);
        }

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
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsBinaryString(file);
        reader.onload = () => {
          const doc = {
            filename: getFileNameWithMaxNameLength(file.name),
            filesize: file.size,
            documentbody: window.btoa(reader.result)
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
      addObj.id = this.rFIType + (this.uploadedRFITypeDocuments.length + 1);
      addObj.documentType = this.rFIType;
      this.editItem(addObj);
      this.$emit('addRFIRow', addObj);
    },
  }
};
</script>
<style scoped>
.table-header {
  background-color: #F2F2F2;
}
.data-table-style {
  border-collapse: collapse;
  border-bottom: none;
}


</style>
