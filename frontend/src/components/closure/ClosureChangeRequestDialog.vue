<template>
  <AppDialog v-model="isDisplayed" :title="title" :loading="isLoading" text-alignment="left" @close="closeDialog">
    <template #content>
      <v-form v-model="isValidForm">
        <v-container width="90%" class="text-primary pa-0">
          <h1>Fiscal Year: {{ getProgramYearNameById(programYearId).slice(0, -3) }}</h1>
          <p class="mt-6 text-black">
            Closures may impact your CCFRI payments. See the
            <a :href="getFundingUrl(programYearId)" target="_blank" class="text-decoration-underline">
              CCFRI Funding Guidelines</a
            >
            for information on the maximum closure period. Information about eligibility for CCOF Base Funding during
            Emergency closures is available on the CCOF website.
          </p>
          <h3 class="mt-6">Select a Facility:</h3>
          <v-select
            v-model="input.facilityId"
            :rules="rules.required"
            :disabled="isLoading || !isNewClosureRequest"
            :items="facilityList"
            :loading="isLoading"
            item-value="facilityId"
            item-title="facilityName"
            placeholder="Select a facility"
            variant="outlined"
            class="mt-2 max-width"
            @update:model-value="handleFacilityChange"
          >
            <template #item="{ props, item, index }">
              <v-list-item
                :value="props.value"
                :active="props.active"
                :title="null"
                class="text-primary"
                @click="props.onClick"
              >
                <v-row>
                  <v-col cols="12" md="8" class="text-left">
                    <h4>{{ item.raw.facilityName }}</h4>
                    <p>Licence #: {{ item.raw.licenseNumber }}</p>
                  </v-col>
                  <v-col cols="12" md="4" class="text-left">
                    <p>Facility ID:</p>
                    <p>{{ item.raw.facilityAccountNumber }}</p>
                  </v-col>
                </v-row>
              </v-list-item>
              <v-divider v-if="index < facilityList.length - 1" class="mx-4" />
            </template>
            <template #selection="{ item }">
              <v-row>
                <v-col cols="12" md="8" class="ml-0">
                  <h4>{{ item.raw.facilityName }}</h4>
                  <p>Licence #: {{ item.raw.licenseNumber }}</p>
                </v-col>
                <v-col cols="12" md="4">
                  <p>Facility ID:</p>
                  <p>{{ item.raw.facilityAccountNumber }}</p>
                </v-col>
              </v-row>
            </template>
          </v-select>
          <v-row>
            <v-col cols="12" lg="9">
              <h3 class="mt-2">Will parents pay for this closure?</h3>
            </v-col>
            <v-col cols="12" lg="3" class="pl-0">
              <v-radio-group
                v-model="input.paidClosure"
                :rules="rules.required"
                :disabled="!isNewClosureRequest || isLoading"
              >
                <v-row justify="start">
                  <v-col cols="6" class="pl-3 pr-0 pt-0">
                    <v-radio label="Yes" :value="1" />
                  </v-col>
                  <v-col cols="6" class="pl-0 pt-0">
                    <v-radio label="No" :value="0" />
                  </v-col>
                </v-row>
              </v-radio-group>
            </v-col>
          </v-row>
          <template v-if="input.facilityId && input.paidClosure != null">
            <v-row>
              <v-col cols="12" lg="9">
                <h3 class="mt-2">
                  Is this a full facility closure?
                  <AppTooltip
                    tooltip-content="Select no if only some care categories will be affected by the closure."
                  />
                </h3>
              </v-col>
              <v-col cols="12" lg="3" class="pl-0">
                <v-radio-group
                  v-model="input.fullClosure"
                  :rules="rules.required"
                  :disabled="!isNewClosureRequest || isLoading"
                  @update:model-value="handleFullFacilityClosureChange"
                >
                  <v-row justify="start">
                    <v-col cols="6" class="pl-3 pr-0 pt-0">
                      <v-radio label="Yes" :value="true" />
                    </v-col>
                    <v-col cols="6" class="pl-0 pt-0">
                      <v-radio label="No" :value="false" />
                    </v-col>
                  </v-row>
                </v-radio-group>
              </v-col>
            </v-row>
            <template v-if="input.fullClosure === false">
              <v-row class="ml-0" align="center">
                <h3 class="pr-2">Affected Care Categorie(s)</h3>
                <p>(select all that apply):</p>
              </v-row>
              <AppMultiSelectInput
                v-model.lazy="input.ageGroups"
                :loading="isLoading"
                :disabled="isLoading || !isNewClosureRequest"
                :items="ageGroups"
                item-title="label"
                item-value="value"
                label="Select affected care categories"
                class="mt-2"
                :rules="rules.required"
                clearable
              />
            </template>
            <h3 class="mt-6">Dates:</h3>
            <p class="text-black mt-4">
              Select the estimated end date, if applicable. To report a closure for a previous term, please return to
              the home page, select a different fiscal year, and go to Organization Closures.
            </p>
            <template v-if="isEditClosureRequest">
              <h3 class="mt-4">Approved Dates:</h3>
              <v-row>
                <v-col cols="12" lg="5">
                  <AppDateInput v-model="input.approvedStartDate" label="Start Date" disabled />
                </v-col>
                <v-col cols="12" lg="2" align="center" class="mt-md-4">to</v-col>
                <v-col cols="12" lg="5">
                  <AppDateInput v-model="input.approvedEndDate" label="End Date" disabled />
                </v-col>
              </v-row>
              <h3>New Dates:</h3>
            </template>
            <v-row>
              <v-col cols="12" lg="5">
                <AppDateInput
                  v-model="input.startDate"
                  :disabled="isRemoveClosureRequest || isLoading"
                  :loading="isLoading"
                  :min="fiscalStartAndEndDates.startDate"
                  :max="fiscalStartAndEndDates.endDate"
                  :rules="rules.required"
                  :error="fiscalYearError || endDateBeforeStartDateError"
                  label="Start Date"
                  clearable
                />
              </v-col>
              <v-col cols="12" lg="2" align="center" class="mt-md-4">to</v-col>
              <v-col cols="12" lg="5">
                <AppDateInput
                  v-model="input.endDate"
                  :disabled="isRemoveClosureRequest || isLoading"
                  :loading="isLoading"
                  :min="input.startDate ? input.startDate : fiscalStartAndEndDates.startDate"
                  :max="fiscalStartAndEndDates.endDate"
                  :rules="rules.required"
                  :error="fiscalYearError || endDateBeforeStartDateError"
                  label="End Date"
                  clearable
                />
              </v-col>
            </v-row>
            <p v-if="fiscalYearError" class="error-message mb-4">
              {{ ERROR_MESSAGES.CLOSURE_DATE_OUTSIDE_FUNDING_AGREEMENT_YEAR }}
            </p>
            <p v-else-if="endDateBeforeStartDateError" class="error-message mb-4">
              {{ ERROR_MESSAGES.START_DATE_AFTER_END_DATE }}
            </p>
            <v-row>
              <v-col cols="12" lg="3" class="mt-2">
                <h3>Reason:</h3>
              </v-col>
              <v-col cols="12" lg="9">
                <v-text-field
                  v-model="input.closureReason"
                  :disabled="isRemoveClosureRequest || isLoading"
                  :loading="isLoading"
                  variant="outlined"
                  :rules="rules.required"
                ></v-text-field>
              </v-col>
            </v-row>
            <h3>Request Description:</h3>
            <v-textarea
              v-model="input.description"
              :disabled="isRemoveClosureRequest || isLoading"
              :loading="isLoading"
              variant="outlined"
              label="Detailed description of request"
              class="text-left mt-3"
            />
            <AppDocumentUpload
              :loading="isLoading"
              :readonly="isRemoveClosureRequest || isLoading"
              :document-type="DOCUMENT_TYPES.CLOSURE_REQUEST"
              title="Supporting Documents"
              :required="false"
              :uploaded-documents="uploadedDocuments"
              @update-documents-to-upload="updateDocuments"
              @delete-uploaded-document="deleteUploadedDocument"
            />
          </template>
          <div v-if="isRemoveClosureRequest" class="pa-0 pt-4">
            <h3>Reason for closure removal:</h3>
            <v-textarea
              v-model="input.reasonForClosureRemoval"
              :loading="isLoading"
              :disabled="isLoading"
              variant="outlined"
              :rules="rules.required"
              label="Please describe the reason for removal."
              class="text-left mt-3"
            />
          </div>
          <v-card variant="outlined" class="text-black px-8 px-md-12 py-6 mt-12">
            <h2 class="mb-4">Declaration and Submission</h2>
            <p class="mb-3">By submitting this Closure Request, I confirm that:</p>
            <ul class="declaration-list px-md-4 px-xl-12 pb-2">
              <li>
                The information provided in this request is true, accurate and complete to the best of my knowledge;
              </li>
              <li>I am authorized to submit Closure Requests for this facility;</li>
              <li>
                I understand that the Ministry relies on the content of these requests for its decision to disburse
                funds to this organization;
              </li>
              <li>I will maintain proper records regarding this facility’s operating days and closure days;</li>
              <li>
                I will not charge parent fees for any closure days that were not approved by the Ministry, if this
                facility is participating in the Child Care Fee Reduction Initiative.
              </li>
            </ul>
          </v-card>
        </v-container>
      </v-form>
    </template>
    <template #button>
      <v-row justify="space-around">
        <v-col cols="12" md="6" class="d-flex justify-center">
          <AppButton :primary="false" :loading="isLoading" :disabled="isLoading" @click="closeDialog">
            Cancel
          </AppButton>
        </v-col>
        <v-col cols="12" md="6" class="d-flex justify-center">
          <AppButton
            v-if="isRemoveClosureRequest"
            :loading="isLoading"
            :disabled="disableSubmit"
            @click="removeClosure"
          >
            Remove Closure
          </AppButton>
          <AppButton v-else :loading="isLoading" :disabled="disableSubmit" @click="submit">
            Accept and Submit
          </AppButton>
        </v-col>
      </v-row>
    </template>
  </AppDialog>
</template>

<script>
import { mapState } from 'pinia';
import { cloneDeep } from 'lodash';

import AppButton from '@/components/guiComponents/AppButton.vue';
import AppDialog from '@/components/guiComponents/AppDialog.vue';
import AppDateInput from '@/components/guiComponents/AppDateInput.vue';
import AppDocumentUpload from '@/components/util/AppDocumentUpload.vue';
import AppMultiSelectInput from '@/components/guiComponents/AppMultiSelectInput.vue';
import AppTooltip from '@/components/guiComponents/AppTooltip.vue';
import {
  CHANGE_REQUEST_TYPES,
  CLOSURE_AFFECTED_AGE_GROUPS,
  DOCUMENT_TYPES,
  ERROR_MESSAGES,
} from '@/utils/constants.js';
import rules from '@/utils/rules.js';
import ClosureService from '@/services/closureService.js';
import FacilityService from '@/services/facilityService';

import alertMixin from '@/mixins/alertMixin';
import { useAppStore } from '@/store/app.js';
import { useApplicationStore } from '@/store/application.js';
import { useAuthStore } from '@/store/auth.js';

export default {
  name: 'ClosureChangeRequestDialog',
  components: { AppButton, AppDateInput, AppDocumentUpload, AppDialog, AppMultiSelectInput, AppTooltip },
  mixins: [alertMixin],
  props: {
    closure: {
      type: Object,
      default: undefined,
    },
    programYearId: {
      type: String,
      default: '',
      required: true,
    },
    requestType: {
      type: [Number, null],
      default: null,
      required: true,
    },
    show: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  emits: ['close', 'submitted'],
  data() {
    return {
      isValidForm: false,
      isDisplayed: false,
      isLoading: false,
      selectedFacilityWasChanged: true,
      ageGroups: [],
      uploadedDocuments: [],
      input: { documents: [] },
      facilityList: [],
    };
  },
  computed: {
    ...mapState(useAppStore, ['getProgramYearNameById', 'getFundingUrl']),
    ...mapState(useApplicationStore, ['fiscalStartAndEndDates', 'getFacilityListForPCFByProgramYearId']),
    ...mapState(useAuthStore, ['userInfo']),
    title() {
      switch (this.requestType) {
        case CHANGE_REQUEST_TYPES.NEW_CLOSURE:
          return 'New Closure Request';
        case CHANGE_REQUEST_TYPES.EDIT_EXISTING_CLOSURE:
          return 'Update Closure Request';
        case CHANGE_REQUEST_TYPES.REMOVE_A_CLOSURE:
          return 'Remove Closure Request';
        default:
          return '';
      }
    },
    endDateBeforeStartDateError() {
      return this.input.startDate && this.input.endDate && this.input.startDate > this.input.endDate;
    },
    fiscalYearError() {
      return (
        this.input.startDate &&
        this.input.endDate &&
        (this.input.startDate < this.fiscalStartAndEndDates.startDate ||
          this.input.startDate > this.fiscalStartAndEndDates.endDate ||
          this.input.endDate < this.fiscalStartAndEndDates.startDate ||
          this.input.endDate > this.fiscalStartAndEndDates.endDate)
      );
    },
    applicationId() {
      const application = this.userInfo.applications?.find(
        (application) => application.ccofProgramYearId === this.programYearId,
      );
      return application?.applicationId;
    },
    isNewClosureRequest() {
      return this.requestType === CHANGE_REQUEST_TYPES.NEW_CLOSURE;
    },
    isEditClosureRequest() {
      return this.requestType === CHANGE_REQUEST_TYPES.EDIT_EXISTING_CLOSURE;
    },
    isRemoveClosureRequest() {
      return this.requestType === CHANGE_REQUEST_TYPES.REMOVE_A_CLOSURE;
    },

    disableSubmit() {
      return !this.isValidForm || this.isLoading;
    },
  },
  watch: {
    show: {
      async handler(value) {
        this.isLoading = true;
        this.isDisplayed = value;
        if (!value) return;
        await this.clearData();
        if (!this.isNewClosureRequest) {
          this.input = await this.initInput();
        }
        this.isLoading = false;
      },
    },
  },
  created() {
    this.rules = rules;
    this.DOCUMENT_TYPES = DOCUMENT_TYPES;
    this.ERROR_MESSAGES = ERROR_MESSAGES;
    this.loadData();
  },
  methods: {
    async loadData() {
      try {
        this.isLoading = true;
        this.facilityList = await this.getFacilityListForPCFByProgramYearId(this.programYearId);
      } catch (e) {
        console.log(e);
        this.setFailureAlert('An error occurred while loading. Please try again later.');
      } finally {
        this.isLoading = false;
      }
    },
    async initInput() {
      try {
        const input = cloneDeep(this.closure);
        this.ageGroups = await this.getLicenseCategories(this.closure.facilityId);
        input.ageGroups = this.closure?.ageGroups?.split(',').map((value) => Number(value));
        const changeActionClosure = await ClosureService.getChangeActionClosure(this.closure.changeActionClosureId);
        this.uploadedDocuments =
          changeActionClosure?.documents && this.isRemoveClosureRequest ? changeActionClosure.documents : [];
        input.description = changeActionClosure?.closureDescription ? changeActionClosure.closureDescription : '';
        input.approvedStartDate = this.closure.startDate;
        input.approvedEndDate = this.closure.endDate;
        return input;
      } catch (e) {
        console.log(e);
        this.setFailureAlert('An error occurred while loading. Please try again later.');
      }
    },
    async handleFacilityChange(facilityId) {
      this.isLoading = true;
      this.selectedFacilityWasChanged = true;
      this.facilityId = facilityId;
      this.input.ageGroups = [];
      let ageGroups = [];
      if (facilityId && this.input.fullClosure === false) {
        try {
          ageGroups = await this.getLicenseCategories(facilityId);
          this.selectedFacilityWasChanged = false;
        } catch (e) {
          console.log(e);
          this.setFailureAlert('Failed to load age categories for facility');
        }
      }
      this.ageGroups = ageGroups;
      this.isLoading = false;
    },
    async getLicenseCategories(facilityId) {
      const ageGroups = [];
      const facilityAgeGroups = await FacilityService.getLicenseCategories(facilityId);
      facilityAgeGroups.forEach((ageGroup) => {
        ageGroups.push({
          label: ageGroup.childCareCategory,
          value: CLOSURE_AFFECTED_AGE_GROUPS[ageGroup.childCareCategory],
        });
      });
      ageGroups.sort((a, b) => a.value - b.value);
      return ageGroups;
    },
    async handleFullFacilityClosureChange(fullClosure) {
      this.input.fullClosure = fullClosure;
      if (this.selectedFacilityWasChanged && fullClosure === false) {
        await this.handleFacilityChange(this.facilityId);
      }
    },
    closeDialog() {
      this.$emit('close');
    },
    updateDocuments(documents) {
      this.input.documents = documents;
    },
    deleteUploadedDocument(annotationId) {
      this.uploadedDocuments = this.uploadedDocuments.filter((document) => document.annotationId !== annotationId);
    },
    async removeClosure() {
      this.isLoading = true;
      const payload = {
        applicationId: this.applicationId,
        programYearId: this.programYearId,
        organizationId: this.userInfo?.organizationId,
        facilityId: this.input.facilityId,
        changeType: this.requestType,
        closureId: this.closure?.closureId,
        closureReason: this.input.reasonForClosureRemoval,
      };
      try {
        const response = await ClosureService.createClosureChangeRequest(payload);
        payload.changeRequestReferenceId = response.changeRequestReferenceId;
        this.$emit('submitted', payload);
      } catch (e) {
        console.log(e);
        this.setFailureAlert('Failed to submit new closure request');
      } finally {
        this.isLoading = false;
      }
    },
    async submit() {
      this.isLoading = true;
      const payload = {
        applicationId: this.applicationId,
        programYearId: this.programYearId,
        organizationId: this.userInfo?.organizationId,
        facilityId: this.input.facilityId,
        changeType: this.requestType,
        closureId: this.isEditClosureRequest ? this.closure?.closureId : null,
        paidClosure: this.input.paidClosure,
        fullClosure: this.input.fullClosure,
        ageGroups: this.input.fullClosure ? null : this.input.ageGroups.join(','),
        startDate: this.input.startDate,
        endDate: this.input.endDate,
        closureReason: this.input.closureReason,
        closureDescription: this.input.description,
        documents: this.input.documents?.map((document) => this.processDocument(document)),
      };
      try {
        const response = await ClosureService.createClosureChangeRequest(payload);
        payload.changeRequestReferenceId = response.changeRequestReferenceId;
        this.$emit('submitted', payload);
      } catch (e) {
        console.error(e);
        if (e.response.data.status === 422) {
          // Most likely found a virus in payload.documents
          this.setFailureAlert(e.response.data.message);
        } else {
          this.setFailureAlert('Failed to submit new closure request');
        }
      } finally {
        this.isLoading = false;
      }
    },
    processDocument(document) {
      return {
        documentType: this.DOCUMENT_TYPES.CLOSURE_REQUEST,
        fileSize: document.fileSize,
        fileName: document.fileName,
        documentBody: document.documentBody,
        description: document.description,
      };
    },
    async clearData() {
      this.selectedFacilityWasChanged = true;
      this.facilityId = this.closure?.facilityId;
      if (this.isEditClosureRequest) {
        await this.handleFullFacilityClosureChange(this.closure.fullClosure);
      }
      this.ageGroups = [];
      this.uploadedDocuments = [];
      this.input = { documents: [] };
    },
  },
};
</script>

<style scoped>
:deep(.max-width .v-select__selection) {
  width: 100%;
}
</style>
