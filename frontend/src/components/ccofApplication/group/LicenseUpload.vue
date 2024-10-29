<template>
  <v-container class="px-xl-12">
    <v-form ref="form" v-model="isValidForm">
      <div align="center">
        <v-card v-if="isSomeChangeRequestActive() && isLocked && !isChangeRequest" class="my-10">
          <v-card-title class="py-2 noticeAlert text-left">
            <v-icon size="x-large" class="py-1 px-3 noticeAlertIcon"> mdi-alert-octagon </v-icon>
            You have a change request in progress.
          </v-card-title>
          <v-card-text class="pa-4 text-left">
            We will complete the assessment of your Program Confirmation Form once your change has been processed.
          </v-card-text>
        </v-card>
      </div>
      <v-card class="cc-top-level-card">
        <v-card-title class="text-center text-wrap pb-0">
          <h3>
            Licence Upload
            <span v-if="isRenewal"> - {{ formattedProgramYear }} Program Confirmation Form</span>
          </h3>
        </v-card-title>
        <div class="licence-upload-hint pb-5 mx-10 text-center">
          Upload a copy of the Community Care and Assisted Living Act Facility Licence for each facility. The maximum
          file size is 2MB for each document. Accepted file types are jpg, jpeg, heic, png, pdf, docx, doc, xls, and
          xlsx.
        </div>
        <v-data-table
          v-if="!isLoading"
          :headers="headers"
          :items="licenseUploadData"
          hide-default-footer
          :items-per-page="-1"
          :mobile="null"
          mobile-breakpoint="md"
          class="pa-4"
        >
          <template #item.document="{ item }">
            <div v-if="item.document?.annotationid">
              <span class="mr-2"> {{ item.document?.filename }} </span>
              <v-icon v-if="!isLocked" small @click="deleteFile(item)">mdi-delete</v-icon>
            </div>
            <v-file-input
              v-else
              :id="item.facilityId"
              color="#003366"
              :rules="[...fileRules, ...rules.required]"
              prepend-icon="mdi-file-upload"
              class="pt-4"
              :accept="fileAccept"
              :disabled="isLocked"
              placeholder="Select your file"
              :error-messages="fileInputError"
              @click:clear="deleteFile(item)"
              @change="selectFile"
            />
          </template>
        </v-data-table>
        <v-card v-if="isLoading" class="pl-6 pr-6 pt-4">
          <v-skeleton-loader :loading="true" type="button" />
          <v-skeleton-loader max-height="375px" :loading="true" type="table-row-divider@3" />
        </v-card>
      </v-card>
      <NavButton
        :is-next-displayed="true"
        :is-save-displayed="true"
        :is-save-disabled="!isValidForm || isLocked"
        :is-next-disabled="!isValidForm || nextButtonDisabled"
        :is-processing="isProcessing"
        @previous="previous"
        @next="next"
        @validate-form="validateForm()"
        @save="saveClicked()"
      />
    </v-form>
  </v-container>
</template>
<script>
import { mapActions, mapState } from 'pinia';

import { useFacilityStore } from '@/store/ccof/facility.js';
import { useReportChangesStore } from '@/store/reportChanges.js';
import { useNavBarStore } from '@/store/navBar.js';
import { useApplicationStore } from '@/store/application.js';
import { useLicenseUploadStore } from '@/store/licenseUpload.js';

import NavButton from '@/components/util/NavButton.vue';

import alertMixin from '@/mixins/alertMixin.js';
import { deepCloneObject, getFileExtension, isAnyChangeRequestActive } from '@/utils/common.js';
import rules from '@/utils/rules.js';
import { getFileNameWithMaxNameLength, humanFileSize } from '@/utils/file.js';

export default {
  components: { NavButton },
  mixins: [alertMixin],
  async beforeRouteLeave(_to, _from, next) {
    if (!this.isLocked) {
      await this.save(false);
    }
    next();
  },
  props: {},
  data() {
    return {
      isLoading: false,
      isProcessing: false,
      licenseUploadData: [],
      rules,
      model: {},
      tempFacilityId: null,
      isValidForm: true,
      currentrow: null,
      headers: [
        {
          title: 'Facility Name',
          value: 'facilityName',
          sortable: true,
          width: '30%',
        },
        {
          title: 'Facility ID',
          value: 'facilityAccountNumber',
          sortable: false,
          width: '20%',
        },
        {
          title: 'Facility Licence Number',
          value: 'licenseNumber',
          sortable: false,
          width: '20%',
        },
        {
          title: 'Upload Licence',
          value: 'document',
          sortable: false,
          width: '30%',
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
      fileMap: new Map(), // this is not reactive
      fileRules: [],
      fileAdded: false,
    };
  },
  computed: {
    ...mapState(useFacilityStore, ['facilityModel', 'facilityId']),
    ...mapState(useReportChangesStore, ['changeRequestStore', 'isLicenseUploadUnlocked', 'changeRequestStatus']),
    ...mapState(useNavBarStore, ['navBarList', 'changeRequestId', 'nextPath', 'previousPath', 'isChangeRequest']),
    ...mapState(useApplicationStore, [
      'isRenewal',
      'formattedProgramYear',
      'applicationStatus',
      'unlockLicenseUpload',
      'applicationId',
      'isLicenseUploadComplete',
      'applicationMap',
      'programYearId',
    ]),
    ...mapState(useLicenseUploadStore, ['uploadedLicenses']),
    isLocked() {
      if (this.isChangeRequest) {
        if (this.isLicenseUploadUnlocked || !this.changeRequestStatus) {
          return false;
        } else if (this.changeRequestStatus !== 'INCOMPLETE') {
          return true;
        }
        return false;
      } else if (this.unlockLicenseUpload) {
        return false;
      } else if (this.applicationStatus === 'SUBMITTED') {
        return true;
      }
      return false;
    },
    // getFacilityList(){
    //   let facilityList;
    //   if (this.isChangeRequest) {
    //     facilityList =  this.navBarList.filter(el => el.changeRequestId === this.$route.params.changeRecGuid);
    //   } else {
    //     facilityList = this.navBarList.filter(el => !el.changeRequestId);
    //   }
    //   return facilityList;
    // },
    nextButtonDisabled() {
      let facilityList = this.navBarList;

      for (let navBarItem of facilityList) {
        const facilityId = navBarItem.facilityId;
        const uploadedLicenceCount = this.uploadedLicenses?.filter(
          (uploadedDocsInServer) => uploadedDocsInServer.ccof_facility === facilityId,
        ).length;
        const deletedLicenceCount = this.licenseUploadData.filter(
          (element) =>
            element.deletedDocument && element.deletedDocument.annotationid && element.facilityId === facilityId,
        ).length;
        let fileMapLicencePerFacilityCount = 0;
        if (this.fileMap.size > 0 && this.fileMap.get(facilityId)) {
          fileMapLicencePerFacilityCount = this.fileMap.get(facilityId)?.length;
        }
        if (uploadedLicenceCount - deletedLicenceCount + fileMapLicencePerFacilityCount === 0) {
          return true; // disable next button if no licence is uploaded for any of the facility
        }
      }
      return false; // enable next button if at least 1 licence exists per facility
    },
  },
  async mounted() {
    const maxSize = 2100000; // 2.18 MB is max size since after base64 encoding it might grow upto 3 MB.

    this.fileRules = [
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
    ...mapActions(useLicenseUploadStore, ['saveLicenseFiles', 'getLicenseFiles', 'deleteLicenseFiles']),
    ...mapActions(useApplicationStore, ['setIsLicenseUploadCompleteInMap', 'setIsLicenseUploadComplete']),
    ...mapActions(useNavBarStore, ['forceNavBarRefresh']),
    ...mapActions(useReportChangesStore, ['setCRIsLicenseComplete']),
    isSomeChangeRequestActive() {
      //Status of : "Submitted" "Action Required";
      return isAnyChangeRequestActive(this.changeRequestStore);
    },
    previous() {
      this.$router.push(this.previousPath);
    },
    next() {
      this.$router.push(this.nextPath);
    },
    validateForm() {
      this.$refs.form?.validate();
    },
    async deleteFile(item) {
      this.licenseUploadData = this.licenseUploadData.map((element) => {
        if (element.facilityId === item.facilityId) {
          if (item.document?.annotationid) {
            element['deletedDocument'] = item.document;
          }
          element['document'] = {};
          this.fileMap.delete(element.facilityId);
        }
        this.$refs.form.validate();
        return element;
      });
    },
    async saveClicked() {
      await this.save();
    },
    async save(showConfirmation = true) {
      this.isProcessing = true;
      try {
        await this.processLicenseFileDelete();
        if (this.fileMap.size > 0) {
          await this.processLicenseFilesSave();
          this.fileMap.clear(); // clear the map.
        }
        if (this.isChangeRequest) {
          this.setCRIsLicenseComplete({ changeRequestId: this.changeRequestId, isComplete: !this.nextButtonDisabled });
        } else {
          this.setIsLicenseUploadCompleteInMap(!this.nextButtonDisabled);
          this.setIsLicenseUploadComplete(!this.nextButtonDisabled);
        }
        this.forceNavBarRefresh();
        if (showConfirmation) {
          await this.createTable();
          this.setSuccessAlert('Changes Successfully Saved');
        }
      } catch (e) {
        console.error(e);
        this.setFailureAlert('An error occurred while saving. Please try again later.');
      } finally {
        this.isProcessing = false;
      }
    },
    async processLicenseFilesSave() {
      const fileList = [];
      for (const facilityId of this.fileMap.keys()) {
        const file = this.fileMap.get(facilityId);
        //let facilityList = this.getFacilityList;
        let currFac = this.navBarList.find((fac) => fac.facilityId === facilityId);
        const obj = {
          ccof_applicationid: this.applicationId,
          ccof_facility: facilityId,
          subject: 'Facility License',
          changeRequestNewFacilityId: this.isChangeRequest ? currFac.changeRequestNewFacilityId : undefined,
          ...file,
        };
        fileList.push(obj);
      }
      const payload = {
        fileList,
        isLicenseUploadComplete: !this.nextButtonDisabled,
        applicationId: this.applicationId,
        changeRequestId: this.isChangeRequest ? this.changeRequestId : undefined,
      };
      await this.saveLicenseFiles(payload);
    },
    async processLicenseFileDelete() {
      const deletedFiles = this.licenseUploadData
        .filter((element) => element.deletedDocument && element.deletedDocument.annotationid)
        .map((element) => element.deletedDocument);
      if (deletedFiles?.length > 0) {
        const payload = {
          deletedFiles,
          isLicenseUploadComplete: !this.nextButtonDisabled,
          applicationId: this.applicationId,
        };
        await this.deleteLicenseFiles(payload);
      }
    },
    async selectFile(event) {
      this.currentrow = event.target.id;
      const file = event?.target?.files[0];
      if (file) {
        const doc = await this.readFile(file);
        const map = new Map();
        this.fileMap.forEach((value, key) => {
          map.set(key, value);
        });
        map.set(this.currentrow, deepCloneObject(doc));
        this.fileMap = map;
        this.$refs.form.validate();
      }
    },
    readFile(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
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
    handleFileReadErr() {
      this.setErrorAlert('Sorry, an unexpected error seems to have occurred. Try uploading your files later.');
    },
    async createTable() {
      this.isLoading = true;
      try {
        this.licenseUploadData = deepCloneObject(this.navBarList);
        let appID = this.applicationMap?.get(this.programYearId)?.applicationId;

        if (!appID) {
          appID = this.applicationId;
        }
        await this.getLicenseFiles(appID); //get from appMap so correct application loaded when viewing a historical CR
        this.licenseUploadData = this.licenseUploadData.map((element) => {
          element['document'] = this.uploadedLicenses?.find(
            (uploadedDocsInServer) => uploadedDocsInServer.ccof_facility === element.facilityId,
          );
          return element;
        });
      } catch (e) {
        console.error(e);
      } finally {
        this.isLoading = false;
        this.fileMap?.clear();
      }
    },
  },
};
</script>

<style scoped>
.licence-upload-hint {
  font-style: italic;
  color: grey;
}
</style>
