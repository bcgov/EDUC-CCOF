<template>
  <v-form ref="form" v-model="isValidForm">
    <v-container>
      <v-row justify="space-around">
        <v-card class="cc-top-level-card" width="1200">
          <v-card-title class="justify-center"><h3>Supporting Document Upload - {{this.programYearLabel}} Program Confirmation Form</h3></v-card-title>
          <v-data-table v-if="!isLoading"
            :headers="headers"
            :items="uploadedDocuments"
            class="elevation-1"
            hide-default-header
            hide-default-footer
          >
            <template v-slot:top>
              <v-col flex>
              <v-toolbar flat color="white">
                <div class="d-flex">
                  <v-btn
                    color="primary"
                    class="ml-2 white--text v-skeleton-loader-small-button"
                    :disabled="isLocked"
                    @click="addNew">
                    <v-icon dark>mdi-plus</v-icon>
                    Add
                  </v-btn>
                </div>
              </v-toolbar>
              </v-col>
            </template>

            <template v-slot:item.facilityName="{ item }">
              <v-col flex>
              <div v-if="item?.annotationid">
                <span> {{ item?.ccof_facility_name }} </span>
              </div>
              <v-select v-else
                        v-model="item.selectFacility"
                        :items="facilityNames"
                        item-text="facilityName"
                        return-object
                        class="drop-down-select"
                        required
                        :rules="selectRules"
              ></v-select>
              </v-col>
            </template>


            <template v-slot:item.document="{ item }">
              <div v-if="item?.annotationid">
                <span> {{ item?.filename }} </span>
              </div>
              <v-file-input v-else
                            color="#003366"
                            :rules="fileRules"
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
          <v-card v-if="isLoading" class="pl-6 pr-6 pt-4">
            <v-skeleton-loader :loading="true" type="button"></v-skeleton-loader>
            <v-skeleton-loader max-height="375px" :loading="true" type="table-row-divider@3"></v-skeleton-loader>
          </v-card>
        </v-card>
      </v-row>
      <v-row justify="space-around">
        <v-btn color="info" outlined required x-large :loading="isProcessing" @click="previous()">Back</v-btn>
        <v-btn color="secondary" outlined x-large :loading="isProcessing" @click="next()">Next</v-btn>
        <v-btn color="primary" outlined x-large :loading="isProcessing" :disabled="!isSaveDisabled || isLocked" @click="saveClicked()">Save</v-btn>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>

import {PATHS} from '@/utils/constants';
import rules from '@/utils/rules';
import {mapActions, mapGetters, mapState,} from 'vuex';
import alertMixin from '@/mixins/alertMixin';
import {getFileNameWithMaxNameLength, humanFileSize} from '@/utils/file';
import {deepCloneObject} from '@/utils/common';

export default {
  mixins: [alertMixin],
  components: {
  },
  props: {},

  computed: {
    ...mapState('facility', ['facilityModel', 'facilityId']),
    ...mapState('app', ['navBarList']),
    ...mapState('application', ['isRenewal', 'programYearLabel', 'unlockSupportingDocuments','applicationStatus']),
    ...mapState('organization', ['applicationId']),
    ...mapGetters('supportingDocumentUpload', ['getUploadedDocuments']),
    isLocked() {
      if (this.unlockSupportingDocuments) {
        return false;
      } else if (this.applicationStatus === 'SUBMITTED') {
        return true;
      }
      return false;
    },
    isSaveDisabled(){
      const newFilesAdded = this.uploadedDocuments.filter(el=> !!el.id);
      return this.isValidForm &&( (newFilesAdded.length > 0) || this.uploadedDocuments?.deletedItems?.length > 0);
    },

  },

  async mounted() {
    const maxSize = 2100000; // 2.18 MB is max size since after base64 encoding it might grow upto 3 MB.

    this.fileRules = [
      v => !!v || 'This is required',
      value => !value || value.name.length < 255 || 'File name can be max 255 characters.',
      value => !value || value.size < maxSize || `The maximum file size is ${humanFileSize(maxSize)} for each document.`,
      value => !value || !this.fileAccept.includes(value.type) || `Accepted file types are ${this.fileFormats}.`,
    ];
    await this.mapFacilityData();
    await this.createTable();

  },
  async beforeRouteLeave(_to, _from, next) {
    if(!this.isLocked){
      await this.save(false);
    }
    next();
  },

  data() {
    return {
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
          text: 'Facility Name',
          align: 'left',
          sortable: false,
          value: 'facilityName',
          class: 'table-header'
        },
        {
          text: 'Document',
          align: 'left',
          sortable: false,
          value: 'document',
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
      fileAccept: '.pdf,.png,.jpg,.jpeg,.heic,.doc,.docx,.xls,.xlsx',
      fileFormats: 'PDF, JPEG, JPG, PNG, HEIC, DOC, DOCX, XLS and XLSX',
      fileInputError: [],
      fileMap: new Map(),
      fileRules: [],
      uploadedDocuments: [],
      editedIndex: -1,
      editedItem: {
        selectFacility: '',
      },
      defaultItem: {
        selectFacility: '',
      },
      selectRules: [v => !!v || 'This is required']

    };
  },

  methods: {
    ...mapActions('supportingDocumentUpload', ['saveUploadedDocuments', 'getDocuments', 'deleteDocuments']),
    previous() {
      this.$router.push(PATHS.eceweFacilities);
    },
    next() {
      this.$router.push(PATHS.summaryDeclaration);
    },

    async saveClicked() {
      await this.save();
    },
    async save(showConfirmation = true) {
      this.isProcessing = true;
      try {
        await this.processDocumentFileDelete();
        const newFilesAdded = this.uploadedDocuments.filter(el=> !!el.id);
        if (newFilesAdded.length > 0) {
          await this.processDocumentFilesSave(newFilesAdded);
        }

        if (showConfirmation) {
          await this.createTable();
          this.setSuccessAlert('Changes Successfully Saved');
        }
      } catch (e) {
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
          ...this.fileMap.get(String(file.id))
        };
        payload.push(obj);
      }
      try {
        await this.saveUploadedDocuments(payload);
      } catch (error) {
        this.setFailureAlert('An error occurred while saving. Please try again later.');
      }
    },
    async processDocumentFileDelete() {
      if (this.uploadedDocuments?.deletedItems?.length > 0) {
        await this.deleteDocuments(this.uploadedDocuments.deletedItems);
      }
    },
    async selectFile(file) {
      if (file) {
        const doc = await this.readFile(file);
        this.fileMap.set(this.currentrow, deepCloneObject(doc));
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
        await this.getDocuments(this.applicationId);
        this.uploadedDocuments = this.getUploadedDocuments;
      } catch (e) {
        console.error(e);
      } finally {
        this.isLoading = false;
        this.fileMap?.clear();
      }
    },
    editItem(item) {
      this.editedIndex = this.uploadedDocuments.indexOf(item);
      this.editedItem = Object.assign({}, item);
    },

    deleteItem(item) {
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
      this.uploadedDocuments.splice(index, 1);

    },
    addNew() {
      const addObj = Object.assign({}, this.defaultItem);
      addObj.id = this.uploadedDocuments.length + 1;
      this.uploadedDocuments.unshift(addObj);
      this.editItem(addObj);
    },

    async mapFacilityData() {
      for (let facilityInfo of this.navBarList) {
        const facility = {};
        facility.facilityId = facilityInfo.facilityId;
        facility.facilityName = facilityInfo.facilityName;
        facility.licenseNumber = facilityInfo.licenseNumber;
        this.facilityNames.push(facility);
      }
    },


  }
};
</script>
<style scoped>
.table-header {
  background-color: #F2F2F2;
}
.drop-down-select{
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
