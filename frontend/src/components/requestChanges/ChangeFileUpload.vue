<template>
  <v-form ref="form" v-model="isValidForm">
    <v-container>
      <v-row justify="space-around">
        <v-card class="cc-top-level-card" width="1200">
          <!-- <v-card-title class="justify-center">
            <span class="text-h5">Child Care Operating Funding Program - {{this.formattedProgramYear}} Program Confirmation Form</span>
          </v-card-title> -->
          <h2 class="text-center">
            {{ changeType == 'NOTIFICATION_FORM' ? 'Change Notification Form Upload' : 'Supporting Documents Upload'}}
          </h2>
          <v-row justify="center" class="text-h5 py-4" style="color:#003466;">
            {{this.userInfo.organizationName}}
          </v-row>
          <v-row class="px-6 text-body-1">
            Provide any additional documents you would like the program to review as part of your CCOF, CCFRI, or ECE-WE funding assessment.
          </v-row>
          <v-row class="pa-6 pt-2 text-body-2">
            The maximum file size is 2MB for each document. Accepted file types are jpg, jpeg, png, pdf, docx, doc, xls, and xlsx.
          </v-row>
          <v-data-table v-if="!isLoading"
            :headers="headers"
            :items="getFilteredDocs"
            class="elevation-1"
            hide-default-header
            hide-default-footer
            :items-per-page="-1"
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

            <!-- <template v-slot:item.facilityName="{ item }">
              <v-col flex>
              <div v-if="item?.annotationid">
                <span> {{ item?.ccof_facility_name }} </span>
              </div>
              <v-select v-else
                        v-model="item.selectFacility"
                        :items="facilityNames"
                        item-text="facilityName"
                        placeholder="Select a facility"
                        return-object
                        class="drop-down-select"
                        required
                        :rules="selectRules"
              ></v-select>
              </v-col>
            </template> -->


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
                            v-model="item.description"
                            @change="updateDescription(item)"
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
          <v-card v-if="isLoading" class="pl-6 pr-6 pt-4">
            <v-skeleton-loader :loading="true" type="button"></v-skeleton-loader>
            <v-skeleton-loader max-height="375px" :loading="true" type="table-row-divider@3"></v-skeleton-loader>
          </v-card>
        </v-card>
      </v-row>


      <!-- <NavButton :isNextDisplayed="true" :isSaveDisplayed="true"
        :isSaveDisabled="false" :isNextDisabled="true" :isProcessing="false"
        @previous="previous" @next="false" @validateForm="validateForm()" @save="save(true)"></NavButton> -->
    </v-container>
  </v-form>
</template>

<script>

import {PATHS} from '@/utils/constants';
import rules from '@/utils/rules';
import {mapActions, mapGetters, mapState,} from 'vuex';
import alertMixin from '@/mixins/alertMixin';
import {getFileNameWithMaxNameLength, humanFileSize} from '@/utils/file';
import { deepCloneObject, getFileExtension } from '@/utils/common';
import NavButton from '@/components/util/NavButton';

export default {
  mixins: [alertMixin],
  components: { NavButton },
  props: {
    changeType: {
      type: String,
      required: true
    },
    // testUploadedDocs: {
    //   type: Array,
    //   required: true
    // },

  },
  data() {
    return {
      filteredDocs : [],
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
      fileAccept: ['image/png','image/jpeg','image/jpg','.pdf','.png','.jpg','.jpeg','.heic','.doc','.docx','.xls','.xlsx'],
      fileExtensionAccept: ['pdf','png','jpg','jpeg','heic','doc','docx','xls','xlsx'],
      fileFormats: 'PDF, JPEG, JPG, PNG, HEIC, DOC, DOCX, XLS and XLSX',
      fileInputError: [],
      fileMap: new Map(),
      fileRules: [],
      //uploadedDocuments: [],
      editedIndex: -1,
      editedItem: {
        ccof_change_requestid: '',
      },
      defaultItem: {
        ccof_change_requestid: this.changeRequestId,
        subject : this.changeType
      },
      selectRules: [v => !!v || 'This is required']

    };
  },

  computed: {
    //...mapState('reportChanges', ['uploadedDocuments']),
    ...mapGetters('reportChanges', ['getUploadedDocuments']),

    ...mapState('reportChanges', ['changeRequestId', 'uploadedDocuments']),

    ...mapGetters('auth', ['userInfo']),
    ...mapState('facility', ['facilityModel', 'facilityId']),
    ...mapState('app', ['navBarList']),
    ...mapState('navBar', ['canSubmit']),
    ...mapState('application', ['isRenewal','unlockSupportingDocuments','applicationStatus', 'applicationId','formattedProgramYear']),
    getFilteredDocs(){
      return this.uploadedDocuments.filter(el=> el.subject == this.changeType);
    },
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
    isNextEnabled() {
      return this.isValidForm && this.canSubmit;
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
    await this.mapFacilityData();
    await this.createTable();

    //this.testUploadedDocs.push('test');
    //console.log('tsetttt', this.testUploadedDocs);
  },
  async beforeRouteLeave(_to, _from, next) {
    if(!this.isLocked){
      await this.save(false);
    }
    next();
  },
  methods: {
    //...mapActions('supportingDocumentUpload', ['saveUploadedDocuments', 'getDocuments', 'deleteDocuments', ]),
    ...mapActions('reportChanges', ['createChangeRequest', 'loadChangeRequestDocs', 'saveUploadedDocuments', 'setUploadedDocuments']),
    ...mapActions('reportChanges', ['createChangeRequest', 'loadChangeRequestDocs']),

    gatherDocs(){
      this.$emit('onSaveDocs', this.filteredDocs);
    },
    previous() {
      this.$router.push(PATHS.eceweFacilities);
    },
    next() {
      this.$router.push(PATHS.summaryDeclaration);
    },
    validateForm() {
      this.$refs.form?.validate();
    },
    async saveClicked() {
      await this.save();
    },
    async save(showConfirmation = true) {

      console.log('saving from child component!');
      //console.log('filtered D save from this component is: ', this.filteredDocs);

      this.isProcessing = true;

      console.log('filemap : ', this.fileMap);
      console.log('filemap : ', this.fileMap.size);

      try {
        //await this.saveUploadedDocuments();
       // await this.processDocumentFileDelete();
        //console.log('uploaded D in save', this.uploadedDocuments);

        if (this.fileMap.size > 0){
          const newFilesAdded = this.uploadedDocuments.filter(el=> !!el.id);
          console.log('newFilesAdded', newFilesAdded);
          if (newFilesAdded.length > 0) {
            await this.processDocumentFilesSave(newFilesAdded);
            this.fileMap?.clear();
          }

          if (showConfirmation) {
            await this.createTable();
            this.setSuccessAlert('Changes Successfully Saved');
          }
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
          ccof_change_requestid: this.changeRequestId,
          subject: this.changeType,
          notetext: file.description,
          ...this.fileMap.get(String(file.id))
        };

        //only add objects from this component to the payload
        //each child componenet sends it's own save payload to Dynamics
        if(obj.filename){
          payload.push(obj);
        }

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


        //console.log('uploaded Dd', this.uploadedDocuments);
        console.log(this.changeType);
        //filter based on subject so the user can visually see a difference between the two uplaod boxes
        this.filteredDocs = this.uploadedDocuments.filter(el=> el.subject == this.changeType);
        //console.log('filtered D', this.filteredDocs);
      } catch (e) {
        console.error(e);
      } finally {
        this.isLoading = false;
        this.fileMap?.clear();
      }
    },
    editItem(item) {
      this.editedIndex = this.filteredDocs.indexOf(item);
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
      addObj.id = Math.floor(Math.random() * 1000000); //TODO: i think this where we need UUID
      this.uploadedDocuments.unshift(addObj);
      //this.testUploadedDocs.unshift(addObj); //this is the prop from parent, might not do anything, idk this point
      this.editItem(addObj);
    },
    updateDescription(item) {
      const index = this.uploadedDocuments.indexOf(item);
      this.uploadedDocuments[index].description = item.description;
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
