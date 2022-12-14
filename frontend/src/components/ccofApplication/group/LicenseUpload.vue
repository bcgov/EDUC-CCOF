<template>
  <v-form ref="form" v-model="isValidForm">
    <v-container>
      <v-skeleton-loader v-if="isLoading" :loading="isLoading" type="text@3"></v-skeleton-loader>
      <span v-else>
        <v-row justify="space-around">
          <v-card class="cc-top-level-card" width="1200">
            <v-card-title class="justify-center"><h3>License Upload</h3></v-card-title>
            <v-data-table
              :headers="headers"
              :items="licenseUploadData"
              class="elevation-1"
              hide-default-header
              hide-default-footer
            >
              <template v-slot:header="{ props: { headers } }">
                <thead>
                <tr>
                  <th v-bind:key="h.value" :id="h.value" v-for="h in headers" :class="h.class">
                    <span>{{ h.text }}</span>
                  </th>
                </tr>
                </thead>
              </template>
              <template v-slot:item.document="{ item }">
                <div v-if="item.document?.annotationid">
                  <span> {{ item.document?.filename }} </span>
                  <v-btn icon @click="deleteFile(item)">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </div>
                <v-file-input v-else
                              color="#003366"
                              :rules="fileRules"
                              prepend-icon="mdi-file-upload"
                              class="pt-0"
                              :id="item.facilityId"
                              :accept="fileAccept"
                              :disabled="false"
                              placeholder="Select your file"
                              :error-messages="fileInputError"
                              @change="selectFile"
                              @click="uploadLicenseClicked($event)"
                ></v-file-input>
              </template>
            </v-data-table>
          </v-card>
        </v-row>
      </span>
      <v-row justify="space-around">
        <v-btn color="info" outlined required x-large @click="previous()">Back</v-btn>
        <v-btn color="secondary" :disabled="nextButtonDisabled" outlined x-large @click="next()">Next</v-btn>
        <v-btn color="primary" outlined x-large :loading="processing" @click="saveClicked()">Save</v-btn>
      </v-row>

    </v-container>
  </v-form>
</template>

<script>

import {PATHS} from '@/utils/constants';
import rules from '@/utils/rules';
import {mapActions, mapGetters, mapMutations, mapState,} from 'vuex';
import alertMixin from '@/mixins/alertMixin';
import {getFileNameWithMaxNameLength, humanFileSize} from '@/utils/file';
import {deepCloneObject} from '@/utils/common';


export default {
  mixins: [alertMixin],
  props: {},
  computed: {
    ...mapState('facility', ['facilityModel', 'facilityId']),
    ...mapState('app', ['navBarList', 'isLicenseUploadComplete', 'isRenewal']),
    ...mapState('organization', ['applicationId', 'organizationProviderType']),
    ...mapGetters('licenseUpload', ['getUploadedLicenses']),

    nextButtonDisabled() {
      return (this.navBarList?.length !== this.getUploadedLicenses.length);
    }
  },


  async mounted() {
    const maxSize = 2180000; // 2.18 MB is max size since after base64 encoding it might grow upto 3 MB.

    this.fileRules = [
      value => !value || value.name.length < 255 || 'File name can be max 255 characters.',
      value => !value || value.size < maxSize || `File size should not be larger than ${humanFileSize(maxSize)}!`,
      value => !value || !this.fileAccept.includes(value.type) || `File formats should be one of these ${this.fileFormats}.`,
    ];

    await this.createTable();
  },
  data() {
    return {
      isLoading: false,
      licenseUploadData: [],
      rules,
      processing: false,
      model: {},
      tempFacilityId: null,
      isValidForm: undefined,
      currentrow: null,
      headers: [
        {
          text: 'Facility Name',
          align: 'start',
          sortable: false,
          value: 'facilityName',
          class: 'table-header'
        },
        {
          text: 'Facility License Number',
          sortable: false,
          value: 'licenseNumber',
          class: 'table-header'

        },
        {
          text: 'Upload License',
          sortable: false,
          value: 'document',
          class: 'table-header'
        }
      ],
      fileAccept: '.pdf,.png,.jpg,.jpeg,.heic',
      fileFormats: 'PDF, JPEG, JPG, HEIC and PNG',
      fileInputError: [],
      fileMap: new Map(),
      fileRules: []
    };
  },

  methods: {
    ...mapActions('licenseUpload', ['saveLicenseFiles', 'getLicenseFiles', 'deleteLicenseFiles', 'updateLicenseCompleteStatus']),
    ...mapMutations('app', ['setCcofLicenseUploadComplete']),
    previous() {
      if (this.isRenewal) {
        this.$router.push(PATHS.home);
      } else {
        if (this.organizationProviderType == 'FAMILY') {
          let navBar = this.navBarList[0]; 
          if (navBar?.ccofBaseFundingId) {
            this.$router.push(`${PATHS.family.fundAmount}/${navBar.ccofBaseFundingId}`);
          }
        } else {
          this.$router.push(PATHS.group.confirmation);
        }

      }
    },
    next() {
      this.$router.push(PATHS.ccfriHome);
    },
    deleteFile(item) {
      this.licenseUploadData = this.licenseUploadData.map(element => {
        if (element.facilityId === item.facilityId) {
          element['deletedDocument'] = item.document;
          element['document'] = {};
          this.fileMap.delete(element.facilityId);
        }
        return element;
      });

    },
    async saveClicked() {
      await this.save();
    },
    async save() {
      this.processing = true;
      try {
        await this.processLicenseFileDelete();
        if (this.fileMap.size > 0) {
          await this.processLicenseFilesSave();
        }
        await this.createTable();
        await this.updateLicenseCompleteStatus(!this.nextButtonDisabled);
        this.setCcofLicenseUploadComplete(!this.nextButtonDisabled);
        this.setSuccessAlert('Changes Successfully Saved');
      } catch (e) {
        console.log(e);
        this.setFailureAlert('An error occurred while saving. Please try again later.');
      } finally {
        this.processing = false;
      }
    },
    async processLicenseFilesSave() {
      const payload = [];
      for (const facilityId of this.fileMap.keys()) {
        const file = this.fileMap.get(facilityId);
        const obj = {
          ccof_applicationid: this.applicationId,
          ccof_facility: facilityId,
          subject: 'Facility License',
          ...file
        };
        payload.push(obj);
      }
      try {
        await this.saveLicenseFiles(payload);
      } catch (error) {
        this.setFailureAlert('An error occurred while saving. Please try again later.');
      }
    },
    async processLicenseFileDelete() {
      const deletedFiles = this.licenseUploadData.filter(element => (element.deletedDocument && element.deletedDocument.annotationid)).map(element => element.deletedDocument);
      if (deletedFiles?.length > 0) {
        await this.deleteLicenseFiles(deletedFiles);
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
    uploadLicenseClicked(event) {
      this.currentrow = event.target.id;
    },
    handleFileReadErr() {
      this.setErrorAlert('Sorry, an unexpected error seems to have occurred. Try uploading your files later.');
    },
    async createTable() {
      this.isLoading = true;
      try {
        this.licenseUploadData = deepCloneObject(this.navBarList);
        await this.getLicenseFiles(this.applicationId);
        this.licenseUploadData = this.licenseUploadData.map(element => {
          element['document'] = this.getUploadedLicenses.find(uploadedDocsInServer => uploadedDocsInServer.ccof_facility === element.facilityId);
          return element;
        });
      } catch (e) {
        console.error(e);
      } finally {
        this.isLoading = false;
        this.fileMap?.clear();
      }
    }
  }
};
</script>
<style scoped>
.table-header {
  background-color: #F2F2F2;
}
</style>
