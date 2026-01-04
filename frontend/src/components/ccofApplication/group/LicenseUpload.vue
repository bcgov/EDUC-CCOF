<template>
  <v-skeleton-loader :loading="isApplicationProcessing" type="table-tbody" class="mb-12">
    <v-container fluid class="mx-lg-16">
      <v-form ref="form" v-model="isValidForm">
        <v-card v-if="isSomeChangeRequestActive() && isLocked && !isChangeRequest" class="my-10">
          <v-card-title class="py-2 noticeAlert">
            <v-icon size="x-large" class="py-1 px-3 noticeAlertIcon"> mdi-alert-octagon </v-icon>
            You have a change request in progress.
          </v-card-title>
          <v-card-text class="pa-4">
            We will complete the assessment of your Program Confirmation Form once your change has been processed.
          </v-card-text>
        </v-card>
        <v-card class="cc-top-level-card">
          <v-card-title class="text-center text-wrap pb-0">
            <h3>
              Licence Upload
              <span v-if="isRenewal"> - {{ formattedProgramYear }} Program Confirmation Form</span>
            </h3>
          </v-card-title>
          <div class="licence-upload-hint pb-5 mx-10 text-center">
            Upload a copy of the Community Care and Assisted Living Act Facility Licence for each facility.
            {{ FILE_REQUIREMENTS_TEXT }}
          </div>
          <v-data-table
            :headers="headers"
            :items="licenseUploadData"
            hide-default-footer
            :items-per-page="-1"
            :mobile="null"
            mobile-breakpoint="md"
            class="pa-4"
          >
            <template #header.document="{ column }">
              <v-row align="center">
                <v-col v-if="!showApplicationTemplateV1" style="max-width: 40px">
                  <AppTooltip tooltip-content="Upload the licence issued by your Health Authority." />
                </v-col>
                <v-col>{{ column.title }}</v-col>
              </v-row>
            </template>
            <template v-if="!showApplicationTemplateV1" #item.healthAuthority="{ item }">
              {{ getHealthAuthorityNameById(item.healthAuthority) }}
            </template>
            <template #item.document="{ item }">
              <div v-if="item.document?.annotationid">
                <span class="mr-2"> {{ item.document?.filename }} </span>
                <v-icon v-if="!isLocked" small @click="deleteFile(item)">mdi-delete</v-icon>
              </div>
              <v-file-input
                v-else
                :id="item.facilityId"
                color="#003366"
                :rules="rules.fileRules"
                prepend-icon="mdi-file-upload"
                class="pt-4"
                :accept="FILE_TYPES_ACCEPT"
                :disabled="isLocked"
                placeholder="Select your file"
                @click:clear="deleteFile(item)"
                @change="selectFile"
              />
            </template>
          </v-data-table>
        </v-card>
      </v-form>
    </v-container>
  </v-skeleton-loader>
  <NavButton
    :is-next-displayed="true"
    :is-save-displayed="true"
    :is-save-disabled="!isValidForm || isLocked"
    :is-next-disabled="!isValidForm || nextButtonDisabled"
    :is-processing="isApplicationProcessing"
    @previous="previous"
    @next="next"
    @validate-form="validateForm()"
    @save="saveClicked()"
  />
</template>
<script>
import { mapActions, mapState } from 'pinia';

import AppTooltip from '@/components/guiComponents/AppTooltip.vue';
import NavButton from '@/components/util/NavButton.vue';

import alertMixin from '@/mixins/alertMixin.js';

import { useAppStore } from '@/store/app.js';
import { useApplicationStore } from '@/store/application.js';
import { useLicenseUploadStore } from '@/store/licenseUpload.js';
import { useNavBarStore } from '@/store/navBar.js';
import { useReportChangesStore } from '@/store/reportChanges.js';

import { deepCloneObject, isAnyChangeRequestActive } from '@/utils/common.js';
import { DOCUMENT_TYPES, FILE_REQUIREMENTS_TEXT, FILE_TYPES_ACCEPT } from '@/utils/constants.js';
import { isValidFile, readFile } from '@/utils/file.js';
import rules from '@/utils/rules.js';

export default {
  components: { AppTooltip, NavButton },
  mixins: [alertMixin],
  async beforeRouteLeave(_to, _from, next) {
    if (!this.isLocked) {
      await this.save(false);
    }
    next();
  },
  data() {
    return {
      licenseUploadData: [],
      isValidForm: true,
      currentrow: null,
      fileMap: new Map(), // this is not reactive
    };
  },
  computed: {
    ...mapState(useAppStore, ['getHealthAuthorityNameById']),
    ...mapState(useApplicationStore, [
      'isApplicationProcessing',
      'isRenewal',
      'formattedProgramYear',
      'applicationStatus',
      'unlockLicenseUpload',
      'applicationId',
      'isLicenseUploadComplete',
      'applicationMap',
      'programYearId',
      'showApplicationTemplateV1',
      'unlockRenewal',
    ]),
    ...mapState(useLicenseUploadStore, ['uploadedLicenses']),
    ...mapState(useNavBarStore, [
      'navBarList',
      'changeRequestId',
      'nextPath',
      'previousPath',
      'isChangeRequest',
      'userProfileList',
    ]),
    ...mapState(useReportChangesStore, ['changeRequestStore', 'isLicenseUploadUnlocked', 'changeRequestStatus']),
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
      } else if (this.unlockRenewal) {
        return false;
      } else if (this.applicationStatus === 'SUBMITTED') {
        return true;
      }
      return false;
    },
    headers() {
      const tableHeadersTemplateV1 = [
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
          id: 'document',
          title: 'Upload Community Care and Assisted Living Act Licence',
          value: 'document',
          sortable: false,
          width: '30%',
        },
      ];
      const tableHeadersTemplateV2 = [
        {
          title: 'Facility Name',
          value: 'facilityName',
          sortable: true,
          width: '20%',
        },
        {
          title: 'Facility ID',
          value: 'facilityAccountNumber',
          sortable: false,
          width: '15%',
        },
        {
          title: 'Facility Licence Number',
          value: 'licenseNumber',
          sortable: false,
          width: '15%',
        },
        {
          title: 'Health Authority',
          value: 'healthAuthority',
          sortable: true,
          width: '20%',
        },
        {
          id: 'document',
          title: 'Upload Community Care and Assisted Living Act Licence',
          value: 'document',
          sortable: false,
          width: '30%',
        },
      ];
      return this.showApplicationTemplateV1 ? tableHeadersTemplateV1 : tableHeadersTemplateV2;
    },
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
  created() {
    this.FILE_REQUIREMENTS_TEXT = FILE_REQUIREMENTS_TEXT;
    this.FILE_TYPES_ACCEPT = FILE_TYPES_ACCEPT;
    this.rules = rules;
  },
  async mounted() {
    await this.createTable();
  },
  methods: {
    ...mapActions(useLicenseUploadStore, ['saveLicenseFiles', 'getLicenseFiles', 'deleteLicenseFiles']),
    ...mapActions(useApplicationStore, [
      'setIsApplicationProcessing',
      'setIsLicenseUploadCompleteInMap',
      'setIsLicenseUploadComplete',
    ]),
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
      try {
        this.setIsApplicationProcessing(true);
        await this.processLicenseFileDelete();
        if (this.fileMap.size > 0) {
          await this.processLicenseFilesSave();
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
        this.fileMap.clear();
        this.setIsApplicationProcessing(false);
      }
    },
    async processLicenseFilesSave() {
      const fileList = [];
      for (const facilityId of this.fileMap.keys()) {
        const file = this.fileMap.get(facilityId);
        const currFac = this.userProfileList.find((fac) => fac.facilityId === facilityId);
        const obj = {
          ccof_applicationid: this.applicationId,
          ccof_facility: facilityId,
          subject: DOCUMENT_TYPES.APPLICATION_LICENCE,
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

      try {
        await this.saveLicenseFiles(payload);
      } catch (e) {
        console.error(e);
        if (e.response.data.status === 422) {
          // Most likely found a virus
          this.setFailureAlert(e.response.data.message);
        } else {
          this.setFailureAlert('An error occurred while saving. Please try again later.');
        }
      }
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
      try {
        this.currentrow = event.target.id;
        const file = event?.target?.files[0];
        if (file && isValidFile(file)) {
          const doc = await readFile(file);
          const map = new Map();
          this.fileMap.forEach((value, key) => {
            map.set(key, value);
          });
          map.set(this.currentrow, deepCloneObject(doc));
          this.fileMap = map;
          this.$refs.form.validate();
        } else {
          this.fileMap.delete(this.currentrow);
        }
      } catch (e) {
        console.error(e);
        this.setFailureAlert('An error occurred while uploading file. Please try again later.');
      }
    },
    async createTable() {
      try {
        this.setIsApplicationProcessing(true);
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
        this.fileMap?.clear();
        this.setIsApplicationProcessing(false);
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
