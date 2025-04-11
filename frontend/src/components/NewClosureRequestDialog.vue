<template>
  <AppDialog v-model="isDisplayed" title="New Closure Request" :loading="isLoading" @close="closeDialog">
    <template #content>
      <v-container width="80%">
        <v-row class="text-primary">
          <h1>Fiscal Year: {{ getProgramYearNameById(programYearId).slice(0, -3) }}</h1>
        </v-row>
        <v-row>
          <p class="left-align mt-6">
            Closures may impact your CCFRI payments. See the
            <a
              href="https://www2.gov.bc.ca/gov/content?id=733BCA6294F34DCAB28CD6BE73D67F92"
              target="_blank"
              class="text-decoration-underline"
            >
              CCFRI Funding Guidelines</a
            >
            for information on the maximum closure period. Information about eligibility for CCOF Base Funding during
            Emergency closures is available on the CCOF website.
          </p>
        </v-row>
        <v-row>
          <h3 class="text-primary mt-6">Select a Facility:</h3>
        </v-row>
        <v-row class="text-primary">
          <v-select
            v-model="selectedFacility"
            required
            :rules="rules.required"
            :items="facilityList"
            item-value="facilityId"
            item-title="facilityName"
            placeholder="Select a facility"
            variant="outlined"
            class="mt-2"
          >
            <template #item="{ props, item, index }">
              <v-list-item :value="props.value" :active="props.active" :title="null" @click="props.onClick">
                <v-row class="text-primary">
                  <v-col cols="12" md="8" align="start">
                    <h4>{{ item.raw.facilityName }}</h4>
                    <p>License #: {{ item.raw.licenseNumber }}</p>
                  </v-col>
                  <v-col cols="12" md="4" align="start">
                    <p>Facility ID:</p>
                    <p>{{ item.raw.facilityAccountNumber }}</p>
                  </v-col>
                </v-row>
              </v-list-item>
              <v-divider v-if="index < facilityList.length - 1" class="mx-4" />
            </template>
            <template #selection="{ item }">
              <!-- JonahCurlCGI todo: fix formatting -->
              <v-row>
                <v-col cols="12" md="8" align="start" class="ml-0">
                  <h4>{{ item.raw.facilityName }}</h4>
                  <p>License #: {{ item.raw.licenseNumber }}</p>
                </v-col>
                <v-col cols="12" md="4" align="end">
                  <p>Facility ID:</p>
                  <p>{{ item.raw.facilityAccountNumber }}</p>
                </v-col>
              </v-row>
            </template>
          </v-select>
        </v-row>
        <v-row>
          <v-col cols="12" lg="9" class="pl-0">
            <h3 class="text-primary left-align mt-2">Will parents pay for this closure?</h3>
          </v-col>
          <v-col cols="12" lg="3" class="pr-0">
            <v-radio-group v-model="parentsWillPayForClosure" required :rules="rules.required">
              <v-row class="ml-4">
                <v-radio label="Yes" value="1" />
                <v-radio label="No" value="0" />
              </v-row>
            </v-radio-group>
          </v-col>
        </v-row>
        <v-container v-if="selectedFacility && parentsWillPayForClosure" width="100%" class="pa-0">
          <v-row>
            <v-col cols="12" lg="9" class="pl-0">
              <h3 class="text-primary left-align mt-2">
                Is this a full facility closure?
                <AppTooltip tooltip-content="Select no if only some care categories will be affected by the closure." />
              </h3>
            </v-col>
            <v-col cols="12" lg="3" class="pr-0">
              <v-radio-group v-model="fullFacilityClosure" required :rules="rules.required">
                <v-row class="ml-4">
                  <v-radio label="Yes" value="true" />
                  <v-radio label="No" value="false" />
                </v-row>
              </v-radio-group>
            </v-col>
          </v-row>
          <v-row v-if="fullFacilityClosure === 'false'" align="center" class="text-primary pl-0">
            <h3 class="pr-2">Affected Care Categorie(s)</h3>
            <p>(select all that apply):</p>
          </v-row>
          <v-row v-if="fullFacilityClosure === 'false'" class="text-primary pl-0">
            <v-select
              v-model.lazy="selectedAgeGroups"
              :items="ageGroups"
              item-title="label"
              item-value="value"
              label="Select affected care categories"
              variant="outlined"
              class="mt-2"
              multiple
              chips
              :rules="rulesAgeGroups"
              clearable
            >
              <template #prepend-item>
                <v-list-item title="Select All" @click="toggleSelectAll">
                  <template #prepend>
                    <v-checkbox-btn
                      :color="someAgeGroupsSelected ? '#003366' : undefined"
                      :indeterminate="someAgeGroupsSelected && !allAgeGroupsSelected"
                      :model-value="someAgeGroupsSelected"
                    />
                  </template>
                </v-list-item>
                <v-divider class="mt-2" />
              </template>
            </v-select>
          </v-row>
          <v-row class="text-primary">
            <v-col cols="12" lg="3" class="pl-0">
              <h3 class="text-primary left-align mt-2">
                Dates:
                <AppTooltip tooltip-content="Select the estimated end date, if applicable." />
              </h3>
            </v-col>
            <v-col cols="12" lg="4" class="pl-0 pr-0">
              <AppDateInput
                v-model="formattedStartDate"
                :min="fiscalStartAndEndDates.startDate"
                :max="formattedEndDate ? formattedEndDate : fiscalStartAndEndDates.endDate"
                :rules="[
                  ...rules.required,
                  rules.min(fiscalStartAndEndDates.startDate, 'Must exceed fiscal year start date'),
                  rules.max(fiscalStartAndEndDates.endDate, 'Must be before fiscal year end date'),
                  rules.MMDDYYYY,
                ]"
                label="Start Date"
                clearable
              />
            </v-col>
            <v-col cols="12" lg="1" class="pt-6">to</v-col>
            <v-col cols="12" lg="4" class="pl-0 pr-0">
              <AppDateInput
                v-model="formattedEndDate"
                :min="formattedStartDate ? formattedStartDate : fiscalStartAndEndDates.startDate"
                :max="fiscalStartAndEndDates.endDate"
                :rules="[
                  ...rules.required,
                  rules.min(fiscalStartAndEndDates.startDate, 'Must exceed fiscal year start date'),
                  rules.max(fiscalStartAndEndDates.endDate, 'Must be before fiscal year end date'),
                  rules.MMDDYYYY,
                ]"
                label="End Date"
                clearable
              />
            </v-col>
          </v-row>
          <v-row class="text-primary">
            <v-col cols="12" lg="3" align="start" class="pl-0">
              <h3>Reason:</h3>
            </v-col>
            <v-col cols="12" lg="9" align="start" class="pr-0 pl-0">
              <v-text-field v-model="reason" variant="outlined" required :rules="rules.required"></v-text-field>
            </v-col>
          </v-row>
          <v-row class="text-primary">
            <h3>Request Description:</h3>
          </v-row>
          <v-row class="text-primary">
            <v-textarea v-model="requestDescription" variant="outlined" label="Detailed description of request" />
          </v-row>
          <v-row>
            <AppDocumentUpload
              :loading="isLoading"
              :document-type="documentType"
              title="Supporting Documents"
              class="text-primary left-align"
              :required="false"
              @update-documents-to-upload="updateDocuments"
            />
          </v-row>
        </v-container>
      </v-container>
    </template>
    <template #button>
      <v-container width="80%">
        <v-row>
          <v-col cols="12" md="6" align="left">
            <AppButton :primary="false" :disabled="isLoading" @click="closeDialog">Cancel</AppButton>
          </v-col>
          <v-col cols="12" md="6" align="right">
            <AppButton :disabled="!formComplete" @click="submit">Submit</AppButton>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </AppDialog>
</template>

<script>
import { mapState } from 'pinia';

import AppButton from '@/components/guiComponents/AppButton.vue';
import AppDialog from '@/components/guiComponents/AppDialog.vue';
import AppDateInput from '@/components/guiComponents/AppDateInput.vue';
import AppDocumentUpload from '@/components/util/AppDocumentUpload.vue';
import AppTooltip from '@/components/guiComponents/AppTooltip.vue';
import {
  CHANGE_REQUEST_TYPES,
  CLOSURE_AFFECTED_AGE_GROUPS,
  CLOSURE_AFFECTED_AGE_GROUPS_TEXTS,
  DOCUMENT_TYPES,
} from '@/utils/constants.js';
import rules from '@/utils/rules.js';
import ClosureService from '@/services/closureService.js';

import alertMixin from '@/mixins/alertMixin';
import { useAppStore } from '@/store/app.js';
import { useApplicationStore } from '@/store/application.js';
import { useAuthStore } from '@/store/Auth.js';
import { useOrganizationStore } from '@/store/ccof/organization.js';

export default {
  name: 'NewClosureRequestDialog',
  components: { AppButton, AppDateInput, AppDocumentUpload, AppDialog, AppTooltip },
  mixins: [alertMixin],
  props: {
    show: {
      type: Boolean,
      default: false,
      required: true,
    },
    programYearId: {
      type: String,
      default: '',
      required: true,
    },
  },
  emits: ['close', 'submitted'],
  data() {
    return {
      rules,
      isDisplayed: false,
      isLoading: false,
      selectedFacility: undefined,
      parentsWillPayForClosure: undefined,
      fullFacilityClosure: undefined,
      formattedStartDate: undefined,
      formattedEndDate: undefined,
      ageGroups: [
        { label: CLOSURE_AFFECTED_AGE_GROUPS_TEXTS.AGE_0_18, value: CLOSURE_AFFECTED_AGE_GROUPS.AGE_0_18 },
        { label: CLOSURE_AFFECTED_AGE_GROUPS_TEXTS.AGE_18_36, value: CLOSURE_AFFECTED_AGE_GROUPS.AGE_18_36 },
        { label: CLOSURE_AFFECTED_AGE_GROUPS_TEXTS.AGE_3Y_K, value: CLOSURE_AFFECTED_AGE_GROUPS.AGE_3Y_K },
        { label: CLOSURE_AFFECTED_AGE_GROUPS_TEXTS.OOSC_K, value: CLOSURE_AFFECTED_AGE_GROUPS.OOSC_K },
        { label: CLOSURE_AFFECTED_AGE_GROUPS_TEXTS.OOSC_G, value: CLOSURE_AFFECTED_AGE_GROUPS.OOSC_G },
        { label: CLOSURE_AFFECTED_AGE_GROUPS_TEXTS.PRE, value: CLOSURE_AFFECTED_AGE_GROUPS.PRE },
      ],
      selectedAgeGroups: [],
      reason: undefined,
      requestDescription: undefined,
      uploadedDocuments: [],
      rulesAgeGroups: [(v) => this.fullFacilityClosure === 'true' || v?.length > 0 || 'This field is required'],
      documentType: DOCUMENT_TYPES.CLOSURE_REQUEST,
    };
  },
  computed: {
    ...mapState(useAppStore, ['getProgramYearNameById']),
    ...mapState(useApplicationStore, ['fiscalStartAndEndDates', 'getFacilityListForPCFByProgramYearId']),
    ...mapState(useAuthStore, ['userInfo']),
    ...mapState(useOrganizationStore, ['organizationAccountNumber', 'organizationName']),
    facilityList() {
      return this.getFacilityListForPCFByProgramYearId(this.programYearId);
    },
    allAgeGroupsSelected() {
      return this.selectedAgeGroups?.length === this.ageGroups?.length;
    },
    someAgeGroupsSelected() {
      return this.selectedAgeGroups?.length > 0;
    },
    formComplete() {
      return (
        !this.isLoading &&
        this.selectedFacility &&
        this.parentsWillPayForClosure !== null &&
        this.fullFacilityClosure !== null &&
        (this.fullFacilityClosure === 'true' || this.selectedAgeGroups.length > 0) &&
        this.formattedStartDate &&
        this.formattedEndDate &&
        this.reason
      );
    },
    applicationId() {
      for (const application of this.userInfo.applications) {
        if (application.ccofProgramYearId === this.programYearId) {
          return application.applicationId;
        }
      }
      return '';
    },
  },
  watch: {
    show: {
      handler(value) {
        this.isDisplayed = value;
      },
    },
  },
  methods: {
    closeDialog() {
      this.$emit('close');
    },
    toggleSelectAll() {
      this.selectedAgeGroups = this.allAgeGroupsSelected ? [] : this.ageGroups;
    },
    updateDocuments(documents) {
      this.documents = documents;
    },
    processDocuments(documents) {
      const processedDocuments = [];
      for (const document of documents) {
        const obj = {
          documentType: this.documentType,
          fileSize: document.fileSize,
          fileName: document.fileName,
          documentBody: document.documentBody,
          description: document.description,
        };
        processedDocuments.push(obj);
      }
      return processedDocuments;
    },
    async submit() {
      this.isLoading = true;
      const payload = {
        applicationId: this.applicationId,
        programYearId: this.programYearId,
        facilityId: this.selectedFacility,
        organizationId: this.userInfo?.organizationId,
        startDate: new Date(this.formattedStartDate).toISOString().slice(0, 10),
        endDate: new Date(this.formattedEndDate).toISOString().slice(0, 10),
        paidClosure: this.parentsWillPayForClosure,
        fullClosure: this.fullFacilityClosure,
        ageGroups: this.fullFacilityClosure === 'true' ? undefined : this.selectedAgeGroups.join(','),
        closureReason: this.reason,
        description: this.requestDescription,
        changeType: CHANGE_REQUEST_TYPES.NEW_CLOSURE,
        documents: this.processDocuments(this.documents),
      };
      try {
        const response = await ClosureService.createNewClosureChangeRequest(payload);
        this.clearInputs();
        this.$emit('submitted', response.changeRequestReferenceId);
      } catch (e) {
        console.log(e);
        this.setFailureAlert('Failed to submit new closure request');
      } finally {
        this.isLoading = false;
      }
    },
    clearInputs() {
      this.selectedFacility = undefined;
      this.formattedStartDate = undefined;
      this.formattedEndDate = undefined;
      this.parentsWillPayForClosure = undefined;
      this.fullFacilityClosure = undefined;
      this.selectedAgeGroups = [];
      this.reason = undefined;
      this.requestDescription = undefined;
      this.documents = [];
    },
  },
};
</script>

<style scoped>
.left-align {
  text-align: left;
}
.drop-down-select {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
