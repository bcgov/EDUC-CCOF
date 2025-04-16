<template>
  <AppDialog
    v-model="isDisplayed"
    title="New Closure Request"
    :loading="isLoading"
    text-alignment="left"
    @close="closeDialog"
  >
    <template #content>
      <v-form v-model="isValidForm">
        <v-container width="80%" class="text-primary pa-0">
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
            :items="facilityList"
            :loading="isLoading"
            item-value="facilityId"
            item-title="facilityName"
            placeholder="Select a facility"
            variant="outlined"
            class="mt-2"
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
          <v-row>
            <v-col cols="12" lg="9">
              <h3 class="mt-2">Will parents pay for this closure?</h3>
            </v-col>
            <v-col cols="12" lg="3" class="pl-0">
              <v-radio-group v-model="input.paidClosure" :rules="rules.required">
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
          <v-container v-if="input.facilityId && input.paidClosure !== undefined" width="100%" class="pa-0">
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
            <div v-if="input.fullClosure === false">
              <v-row class="ml-0">
                <h3 class="pr-2">Affected Care Categorie(s)</h3>
                <p>(select all that apply):</p>
              </v-row>
              <v-select
                v-model.lazy="input.ageGroups"
                :loading="isLoading"
                :items="ageGroups"
                item-title="label"
                item-value="value"
                label="Select affected care categories"
                variant="outlined"
                class="mt-2 pl-0 text-left"
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
            </div>
            <v-row>
              <v-col cols="12" lg="3">
                <h3 class="mt-2">
                  Dates:
                  <AppTooltip tooltip-content="Select the estimated end date, if applicable." />
                </h3>
              </v-col>
              <v-col cols="12" lg="4">
                <AppDateInput
                  v-model="input.startDate"
                  :min="fiscalStartAndEndDates.startDate"
                  :max="input.endDate ? input.endDate : fiscalStartAndEndDates.endDate"
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
              <v-col cols="12" lg="4">
                <AppDateInput
                  v-model="input.endDate"
                  :min="input.startDate ? input.startDate : fiscalStartAndEndDates.startDate"
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
            <v-row>
              <v-col cols="12" lg="3">
                <h3>Reason:</h3>
              </v-col>
              <v-col cols="12" lg="9">
                <v-text-field v-model="input.closureReason" variant="outlined" :rules="rules.required"></v-text-field>
              </v-col>
            </v-row>
            <h3>Request Description:</h3>
            <v-textarea
              v-model="input.description"
              variant="outlined"
              label="Detailed description of request"
              class="text-left"
            />
            <AppDocumentUpload
              :loading="isLoading"
              :document-type="DOCUMENT_TYPES.CLOSURE_REQUEST"
              title="Supporting Documents"
              class=""
              :required="false"
              @update-documents-to-upload="updateDocuments"
            />
          </v-container>
        </v-container>
      </v-form>
    </template>
    <template #button>
      <v-container width="80%">
        <v-row>
          <v-col cols="6" md="6">
            <AppButton :primary="false" :disabled="isLoading" @click="closeDialog">Cancel</AppButton>
          </v-col>
          <v-col cols="6" md="6" align="right">
            <AppButton :disabled="!isValidForm" @click="submit">Submit</AppButton>
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
import { CHANGE_REQUEST_TYPES, CLOSURE_AFFECTED_AGE_GROUPS, DOCUMENT_TYPES } from '@/utils/constants.js';
import rules from '@/utils/rules.js';
import ClosureService from '@/services/closureService.js';
import FacilityService from '@/services/facilityService';

import alertMixin from '@/mixins/alertMixin';
import { useAppStore } from '@/store/app.js';
import { useApplicationStore } from '@/store/application.js';
import { useAuthStore } from '@/store/Auth.js';
import { readonly } from 'vue';

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
      isValidForm: false,
      isDisplayed: false,
      isLoading: false,
      input: {
        ageGroups: [],
        documents: [],
      },
      selectedFacilityWasChanged: true,
      ageGroups: [],
    };
  },
  computed: {
    ...mapState(useAppStore, ['getProgramYearNameById', 'getFundingUrl']),
    ...mapState(useApplicationStore, ['fiscalStartAndEndDates', 'getFacilityListForPCFByProgramYearId']),
    ...mapState(useAuthStore, ['userInfo']),
    facilityList() {
      return this.getFacilityListForPCFByProgramYearId(this.programYearId);
    },
    rulesAgeGroups() {
      return this.input.fullClosure === false ? rules.required : [];
    },
    allAgeGroupsSelected() {
      return this.input.ageGroups?.length === this.ageGroups?.length;
    },
    someAgeGroupsSelected() {
      return this.input.ageGroups?.length > 0;
    },
    applicationId() {
      const application = this.userInfo.applications?.find(
        (application) => application.ccofProgramYearId === this.programYearId,
      );
      return application?.applicationId;
    },
  },
  watch: {
    show: {
      handler(value) {
        this.isDisplayed = value;
      },
    },
  },
  created() {
    this.rules = rules;
    this.DOCUMENT_TYPES = DOCUMENT_TYPES;
  },
  methods: {
    async handleFacilityChange(facilityId) {
      this.isLoading = true;
      this.selectedFacilityWasChanged = true;
      this.facilityId = facilityId;
      this.input.ageGroups = [];
      const ageGroups = [];
      if (facilityId && this.input.fullClosure === false) {
        try {
          const facilityAgeGroups = await FacilityService.getLicenseCategories(facilityId);
          this.selectedFacilityWasChanged = false;
          for (const ageGroup of facilityAgeGroups) {
            ageGroups.push({
              label: ageGroup.childCareCategory,
              value: CLOSURE_AFFECTED_AGE_GROUPS[ageGroup.childCareCategory],
            });
          }
          ageGroups.sort((a, b) => a.value - b.value);
        } catch (e) {
          console.log(e);
          this.setFailureAlert('Failed to load age categories for facility');
        }
      }
      this.ageGroups = ageGroups;
      this.isLoading = false;
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
    toggleSelectAll() {
      const ageGroups = [];
      if (!this.allAgeGroupsSelected) {
        for (const ageGroup of this.ageGroups) {
          ageGroups.push(ageGroup.value);
        }
      }
      this.input.ageGroups = ageGroups;
    },
    updateDocuments(documents) {
      this.input.documents = documents;
    },
    processDocuments(documents) {
      const processedDocuments = [];
      for (const document of documents) {
        const obj = {
          documentType: this.DOCUMENT_TYPES.CLOSURE_REQUEST,
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
      this.input.applicationId = this.applicationId;
      this.input.programYearId = this.programYearId;
      this.input.organizationId = this.userInfo?.organizationId;
      this.input.startDate = new Date(this.input.startDate).toISOString().slice(0, 10);
      this.input.endDate = new Date(this.input.endDate).toISOString().slice(0, 10);
      this.input.changeType = CHANGE_REQUEST_TYPES.NEW_CLOSURE;
      this.input.documents = this.processDocuments(this.input.documents);
      this.input.ageGroups = this.input.fullClosure ? undefined : this.input.ageGroups.join(',');
      try {
        const response = await ClosureService.createNewClosureChangeRequest(this.input);
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
      this.input = {
        ageGroups: [],
        documents: [],
      };
    },
  },
};
</script>

<style scoped>
.drop-down-select {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
