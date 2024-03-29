<template>
  <v-form ref="form" v-model="isValidForm">
    <v-container>
      <span>
        <v-row>
              <v-card width="100%" class="mx-3 my-10" v-if="isSomeChangeRequestActive()  && isLocked && !isChangeRequest">
                <v-row>
                  <v-col class="py-0">
                    <v-card-title class="py-1 noticeAlert">
                      <span style="float:left">
                    <v-icon
                      x-large
                      class="py-1 px-3 noticeAlertIcon">
                      mdi-alert-octagon
                    </v-icon>
                    </span>
                    You have a change request in progress.
                    </v-card-title>
                  </v-col>
                </v-row>
                <v-card-text>
                  We will complete the assessment of your Program Confirmation Form once your change has been processed.<br><br>
                  <br>
                </v-card-text>
              </v-card>
            </v-row>
        <v-row justify="space-around">
          <v-card class="cc-top-level-card" width="1200">
            <v-card-title class="justify-center pb-0"><h3>Licence Upload<span v-if="isRenewal"> - {{ this.formattedProgramYear }} Program Confirmation Form</span></h3></v-card-title>
             <v-row flex >
              <caption class="licence-upload-hint pb-5">Upload a copy of the Community Care and Assisted Living Act Facility Licence for each facility. The maximum file size is 2MB for each document. Accepted file types are jpg, jpeg, heic, png, pdf, docx, doc, xls, and xlsx.</caption>
            </v-row>
            <v-data-table v-if="!isLoading"
                          :headers="headers"
                          :items="licenseUploadData"
                          class="elevation-1"
                          hide-default-header
                          hide-default-footer
                          :items-per-page="-1"
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
                  <v-btn v-if="!isLocked" icon @click="deleteFile(item)">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </div>
                <v-file-input v-else
                              color="#003366"
                              :rules="[...fileRules, ...rules.required]"
                              prepend-icon="mdi-file-upload"
                              class="pt-0"
                              @click:clear="deleteFile(item)"
                              :id="item.facilityId"
                              :accept="fileAccept"
                              :disabled="isLocked"
                              placeholder="Select your file"
                              :error-messages="fileInputError"
                              @change="selectFile"
                              @click="uploadLicenseClicked($event)"
                ></v-file-input>
              </template>
            </v-data-table>
            <v-card v-if="isLoading" class="pl-6 pr-6 pt-4">
              <v-skeleton-loader :loading="true" type="button"></v-skeleton-loader>
              <v-skeleton-loader max-height="375px" :loading="true" type="table-row-divider@3"></v-skeleton-loader>
            </v-card>
            </v-card>
        </v-row>
      </span>
      <NavButton :isNextDisplayed="true" :isSaveDisplayed="true"
        :isSaveDisabled="!isValidForm || isLocked" :isNextDisabled="!isValidForm || nextButtonDisabled" :isProcessing="isProcessing"
        @previous="previous" @next="next" @validateForm="validateForm()" @save="saveClicked()"></NavButton>
    </v-container>
  </v-form>
</template>
<script>

import rules from '@/utils/rules';
import {mapActions, mapGetters, mapMutations, mapState,} from 'vuex';
import alertMixin from '@/mixins/alertMixin';
import {getFileNameWithMaxNameLength, humanFileSize} from '@/utils/file';
import {deepCloneObject, getFileExtension, isAnyChangeRequestActive} from '@/utils/common';
import NavButton from '@/components/util/NavButton';

export default {
  components: { NavButton },
  mixins: [alertMixin],
  props: {},
  computed: {
    ...mapState('facility', ['facilityModel', 'facilityId']),
    ...mapState('reportChanges', ['changeRequestStore',]),
    ...mapState('navBar', ['navBarList', 'changeRequestId']),
    ...mapState('application', ['isRenewal', 'formattedProgramYear', 'applicationStatus', 'unlockLicenseUpload', 'applicationId', 'isLicenseUploadComplete', 'applicationMap', 'programYearId']),
    ...mapGetters('licenseUpload', ['getUploadedLicenses']),
    ...mapGetters('navBar', ['nextPath', 'previousPath', 'isChangeRequest']),
    ...mapGetters('reportChanges',['isLicenseUploadUnlocked','changeRequestStatus']),
    isLocked() {
      if(this.isChangeRequest){
        if(this.isLicenseUploadUnlocked||!this.changeRequestStatus){
          return false;
        }
        else if(this.changeRequestStatus!=='INCOMPLETE'){
          return true;
        }
        return false;
      }
      else if (this.unlockLicenseUpload) {
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
        const uploadedLicenceCount = this.getUploadedLicenses.filter(uploadedDocsInServer => uploadedDocsInServer.ccof_facility === facilityId).length;
        const deletedLicenceCount = this.licenseUploadData.filter(element => (element.deletedDocument && element.deletedDocument.annotationid && (element.facilityId === facilityId))).length;
        let fileMapLicencePerFacilityCount =  0;
        if(this.fileMap.size > 0 && this.fileMap.get(facilityId)){
          fileMapLicencePerFacilityCount = this.fileMap.get(facilityId)?.length;
        }
        if ((uploadedLicenceCount-deletedLicenceCount)+fileMapLicencePerFacilityCount === 0) {
          return true; // disable next button if no licence is uploaded for any of the facility
        }
      }
      return false; // enable next button if at least 1 licence exists per facility
    },
  },


  async mounted() {
    const maxSize = 2100000; // 2.18 MB is max size since after base64 encoding it might grow upto 3 MB.

    this.fileRules = [
      value => !value || value.name.length < 255 || 'File name can be max 255 characters.',
      value => !value || value.size < maxSize || `The maximum file size is ${humanFileSize(maxSize)} for each document.`,
      value => !value || this.fileExtensionAccept.includes(getFileExtension(value.name)?.toLowerCase()) || `Accepted file types are ${this.fileFormats}.`,
    ];

    await this.createTable();
  },
  async beforeRouteLeave(_to, _from, next) {
    if (!this.isLocked) {
      await this.save(false);
    }
    next();
  },
  data() {
    return {
      isLoading: false,
      isProcessing: false,
      licenseUploadData: [],
      rules,
      model: {},
      tempFacilityId: null,
      isValidForm: false,
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
          text: 'Facility Licence Number',
          sortable: false,
          value: 'licenseNumber',
          class: 'table-header'

        },
        {
          text: 'Upload Licence',
          sortable: false,
          value: 'document',
          class: 'table-header'
        }
      ],
      fileAccept: ['image/png', 'image/jpeg', 'image/jpg', '.pdf', '.png', '.jpg', '.jpeg', '.heic', '.doc', '.docx', '.xls', '.xlsx'],
      fileExtensionAccept: ['pdf', 'png', 'jpg', 'jpeg', 'heic', 'doc', 'docx', 'xls', 'xlsx'],
      fileFormats: 'PDF, JPEG, JPG, PNG, HEIC, DOC, DOCX, XLS and XLSX',
      fileInputError: [],
      fileMap: new Map(), // this is not reactive
      fileRules: [],
      fileAdded: false,
    };
  },

  methods: {
    ...mapActions('licenseUpload', ['saveLicenseFiles', 'getLicenseFiles', 'deleteLicenseFiles']),
    ...mapMutations('application', ['setIsLicenseUploadCompleteInMap' , 'setIsLicenseUploadComplete']),
    ...mapMutations('navBar', ['forceNavBarRefresh']),
    ...mapMutations('reportChanges', ['setCRIsLicenseComplete']),
    isSomeChangeRequestActive(){
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
      this.licenseUploadData = this.licenseUploadData.map(element => {
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
          this.fileMap.clear();// clear the map.
        }
        if (this.isChangeRequest) {
          this.setCRIsLicenseComplete({changeRequestId: this.changeRequestId, isComplete: !this.nextButtonDisabled});
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
        let currFac = this.navBarList.find(fac => fac.facilityId === facilityId);
        const obj = {
          ccof_applicationid: this.applicationId,
          ccof_facility: facilityId,
          subject: 'Facility License',
          changeRequestNewFacilityId : this.isChangeRequest ? currFac.changeRequestNewFacilityId : undefined,
          ...file
        };
        fileList.push(obj);
      }
      const payload = {fileList,
        isLicenseUploadComplete:!this.nextButtonDisabled,
        applicationId: this.applicationId,
        changeRequestId: this.isChangeRequest? this.changeRequestId : undefined
      };
      await this.saveLicenseFiles(payload);
    },
    async processLicenseFileDelete() {
      const deletedFiles = this.licenseUploadData.filter(element => (element.deletedDocument && element.deletedDocument.annotationid)).map(element => element.deletedDocument);
      if (deletedFiles?.length > 0) {
        const payload = {deletedFiles,
          isLicenseUploadComplete:!this.nextButtonDisabled,
          applicationId: this.applicationId};
        await this.deleteLicenseFiles(payload);
      }
    },
    async selectFile(file) {
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
        let appID = this.applicationMap?.get(this.programYearId)?.applicationId;

        if (!appID){
          appID = this.applicationId;
        }
        await this.getLicenseFiles(appID); //get from appMap so correct application loaded when viewing a historical CR
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
    },
  }
};
</script>
<style scoped>
.table-header {
  background-color: #F2F2F2;
}
.licence-upload-hint{
  font-style: italic;
  color: grey;
}
</style>
