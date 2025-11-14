<template>
  <v-container class="text-body-1" fluid>
    <v-skeleton-loader :loading="isLoading" type="card">
      <template v-if="programVacancies">
        <v-row no-gutters>
          <v-col cols="12">
            <v-card class="pa-4 mb-4" outlined style="border-color: #2c5282; border-width: 2px">
              <p class="mb-2">
                <v-icon size="x-large" class="py-1 noticeInfoIcon"> mdi-information </v-icon>
                Please complete the following questionnaire and update your responses whenever there are changes.
              </p>
              <p class="mb-0">
                The information collected will be used to administer your facility's Child Care Operating Funding and to
                update details on the
                <a
                  href="https://maps.gov.bc.ca/ess/hm/ccf/"
                  target="_blank"
                  style="color: navy; text-decoration: underline; font-weight: 500"
                >
                  Child Care Map</a
                >. Responses to questions marked with an asterisk (*) may appear on the map.
              </p>
            </v-card>
          </v-col>

          <v-col cols="12" class="mb-4">
            <p class="mb-1 text-grey mt-2">Last Updated: {{ lastUpdated }}</p>
          </v-col>
          <v-card class="pa-6 border">
            <div class="d-flex justify-end">
              <AppButton
                v-if="hasPermission(PERMISSIONS.EDIT_PROGRAMS_VACANCIES) && !isEditing"
                size="small"
                :primary="false"
                @click="onEdit"
              >
                Edit
              </AppButton>
            </div>

            <div>
              <p class="mb-2">* What are the age(s) of the children served at this facility? (Check all that apply)</p>
              <div class="d-flex flex-wrap">
                <v-checkbox
                  v-for="age in ageGroups"
                  :key="age.value"
                  v-model="form.selectedPrograms"
                  :label="age.label"
                  :value="age.value"
                  :disabled="!isEditing"
                  class="mr-4"
                />
              </div>
            </div>

            <div>
              <p class="mb-2">* How many vacancies do you currently have based on age group(s)?</p>
              <v-row v-for="(label, key) in vacancyFields" :key="key" class="align-center mb-3" no-gutters>
                <v-col cols="12" sm="5" md="4" class="pr-2">
                  {{ label }}
                </v-col>
                <v-col cols="12" sm="3" md="2" class="mb-2">
                  <v-text-field
                    v-model.number="form[key]"
                    :disabled="!isEditing"
                    type="number"
                    :rules="[rules.wholeNumber]"
                    :placeholder="EMPTY_PLACEHOLDER"
                    density="compact"
                    hide-details
                    style="max-width: 80px"
                    @wheel="$event.target.blur()"
                    @update:model-value="convertBlankNumberToNull(form, key)"
                  />
                </v-col>
              </v-row>
            </div>

            <div class="mt-5">
              <p class="mb-2">* What are the regular days of operation for this facility? (Check all that apply)</p>
              <div class="d-flex flex-wrap">
                <v-checkbox
                  v-for="day in daysOptions"
                  :key="day.value"
                  v-model="form.daysOfOperation"
                  :label="day.label"
                  :value="day.value"
                  :disabled="!isEditing"
                  class="mr-4"
                />
              </div>
            </div>

            <div class="mt-4">
              <p class="mb-2">* In what language(s) do you offer services at this facility? (Check all that apply)</p>
              <div class="d-flex flex-wrap">
                <v-checkbox
                  v-for="lang in languageOptions"
                  :key="lang.value"
                  v-model="form.additionalLanguages"
                  :label="lang.label"
                  :value="lang.value"
                  :disabled="!isEditing"
                  class="mr-4"
                />
              </div>
            </div>

            <div class="mt-4">
              <p class="mb-2">* Do you provide a meal program (breakfast, lunch, or dinner) on a consistent basis?</p>
              <v-radio-group v-model="form.mealServices" :disabled="!isEditing">
                <v-row>
                  <v-col v-for="option in mealOptions" :key="option.value" cols="auto">
                    <v-radio :label="option.label" :value="option.value" />
                  </v-col>
                </v-row>
              </v-radio-group>
            </div>

            <div class="mt-4">
              <p class="mb-2">
                * Do you provide pick-up or drop-off service (to and /or from facility by vehicle or walking)?
              </p>
              <v-radio-group v-model="form.pickupServices" :disabled="!isEditing">
                <v-row>
                  <v-col v-for="option in pickupOptions" :key="option.value" cols="auto">
                    <v-radio :label="option.label" :value="option.value" />
                  </v-col>
                </v-row>
              </v-radio-group>
            </div>

            <div>
              <p class="mb-2">* What time of day are preschool sessions offered? (Check all that apply)</p>
              <div class="d-flex flex-wrap">
                <v-checkbox
                  v-for="option in preschoolOptions"
                  :key="option.value"
                  v-model="form.preschoolServices"
                  :label="option.label"
                  :value="option.value"
                  :disabled="!isEditing"
                  class="mr-4"
                />
              </div>
            </div>

            <div>
              <p class="mb-2">
                * Do you offer specific programs or services to support the cultural needs of First Nations, Métis and
                Inuit children and families?
              </p>
              <v-radio-group v-model="form.aboriginalProgramming" :disabled="!isEditing">
                <v-row>
                  <v-col cols="auto"><v-radio label="Yes" :value="true" /></v-col>
                  <v-col cols="auto"><v-radio label="No" :value="false" /></v-col>
                </v-row>
              </v-radio-group>
            </div>

            <div>
              <p class="mb-2">
                * Does this facility consider itself an Indigenous-led (First Nations, Métis and/or Inuit) organization?
                Please select all that apply.
              </p>
              <div class="d-flex flex-wrap">
                <v-checkbox
                  v-for="option in indigenousLedOptions"
                  :key="option.value"
                  v-model="form.indigenousLed"
                  :label="option.label"
                  :value="option.value"
                  :disabled="!isEditing"
                  class="mr-4"
                />
              </div>
            </div>

            <div class="mt-4">
              <p class="mb-2">
                * Is your facility equipped to provide care to children who have physical mobility or accessibility
                support needs (e.g. wheelchair or walker access)?
              </p>
              <v-radio-group v-model="form.accessibility" :disabled="!isEditing">
                <v-row>
                  <v-col cols="auto"><v-radio label="Yes" :value="true" /></v-col>
                  <v-col cols="auto"><v-radio label="No" :value="false" /></v-col>
                </v-row>
              </v-radio-group>
            </div>

            <div>
              <p class="mb-2">
                * Does your program have capacity to provide care to children who require additional support due to
                developmental delay or disability (i.e. support for physical, cognitive, communicative, social,
                emotional, and/or behavioral needs)?
              </p>
              <v-radio-group v-model="form.accommodatesSpecialNeeds" :disabled="!isEditing">
                <v-row>
                  <v-col cols="auto"><v-radio label="Yes" :value="true" /></v-col>
                  <v-col cols="auto"><v-radio label="No" :value="false" /></v-col>
                </v-row>
              </v-radio-group>
            </div>

            <div>
              <p class="mb-2">
                * Do one or more of the child care staff (including yourself) have an Early Childhood Educator (ECE)
                Certificate?
              </p>
              <v-radio-group v-model="form.ece" :disabled="!isEditing">
                <v-row>
                  <v-col cols="auto"><v-radio label="Yes" :value="true" /></v-col>
                  <v-col cols="auto"><v-radio label="No" :value="false" /></v-col>
                </v-row>
              </v-radio-group>
            </div>

            <div>
              <p class="mb-2">* Is the BC Early Learning Framework (ELF) used as a resource at this facility?</p>
              <v-radio-group v-model="form.elf" :disabled="!isEditing">
                <v-row>
                  <v-col cols="auto"><v-radio label="Yes" :value="true" /></v-col>
                  <v-col cols="auto"><v-radio label="No" :value="false" /></v-col>
                </v-row>
              </v-radio-group>
            </div>
            <div v-if="isEditing" class="d-flex justify-end">
              <AppButton size="small" :loading="isProcessing" :disabled="isProcessing" @click="onSave">
                Save
              </AppButton>
              <AppButton size="small" :primary="false" class="ml-2" :disabled="isProcessing" @click="onCancel">
                Cancel
              </AppButton>
            </div>
          </v-card>
        </v-row>
      </template>
      <template v-else>
        <p class="text-center mt-4">No Programs and Vacancies available for this facility.</p>
      </template>
    </v-skeleton-loader>
  </v-container>
</template>

<script>
import { isEmpty } from 'lodash';
import moment from 'moment';

import AppButton from '@/components/guiComponents/AppButton.vue';

import alertMixin from '@/mixins/alertMixin.js';
import globalMixin from '@/mixins/globalMixin.js';
import permissionsMixin from '@/mixins/permissionsMixin.js';

import ProgramsVacanciesService from '@/services/programsVacancies.js';

import {
  AGE_GROUPS,
  DAYS_OPTIONS,
  EMPTY_PLACEHOLDER,
  INDIGENOUS_LED_OPTIONS,
  LANGUAGE_OPTIONS,
  MEAL_OPTIONS,
  PICKUP_OPTIONS,
  PRESCHOOL_OPTIONS,
  VACANCY_FIELDS,
} from '@/utils/constants.js';
import { formatStringToNumberList, formatUTCDateToLocal } from '@/utils/format';
import rules from '@/utils/rules.js';

export default {
  name: 'ManageProgramsVacancies',
  components: { AppButton },
  mixins: [alertMixin, globalMixin, permissionsMixin],
  data() {
    return {
      isLoading: false,
      isEditing: false,
      isProcessing: false,
      programVacancies: null,
      form: {},
    };
  },
  computed: {
    lastUpdated() {
      return formatUTCDateToLocal(this.programVacancies?.updatedOn);
    },
  },
  created() {
    this.EMPTY_PLACEHOLDER = EMPTY_PLACEHOLDER;
    this.rules = rules;
    this.ageGroups = AGE_GROUPS;
    this.daysOptions = DAYS_OPTIONS;
    this.languageOptions = LANGUAGE_OPTIONS;
    this.indigenousLedOptions = INDIGENOUS_LED_OPTIONS;
    this.preschoolOptions = PRESCHOOL_OPTIONS;
    this.mealOptions = MEAL_OPTIONS;
    this.pickupOptions = PICKUP_OPTIONS;
    this.vacancyFields = VACANCY_FIELDS;
    this.loadData();
  },
  methods: {
    formatUTCDateToLocal,
    async loadData() {
      this.isLoading = true;
      try {
        const response = await ProgramsVacanciesService.getProgramsVacancies(this.$route.params.facilityId);
        if (!isEmpty(response)) {
          this.programVacancies = response[0];
          this.form = {
            ...this.programVacancies,
            selectedPrograms: formatStringToNumberList(this.programVacancies.selectedPrograms),
            daysOfOperation: formatStringToNumberList(this.programVacancies.daysOfOperation),
            additionalLanguages: formatStringToNumberList(this.programVacancies.additionalLanguages),
            indigenousLed: formatStringToNumberList(this.programVacancies.indigenousLed),
            preschoolServices: formatStringToNumberList(this.programVacancies.preschoolServices),
          };
        }
      } catch (error) {
        this.setFailureAlert('Failed to load Programs and Vacancies.', error);
      } finally {
        this.isLoading = false;
      }
    },
    onEdit() {
      this.isEditing = true;
      this.formBackup = { ...this.form };
    },
    onCancel() {
      this.isEditing = false;
      this.form = this.formBackup;
    },
    async onSave() {
      this.isProcessing = true;
      try {
        const payload = {
          ...this.form,
          selectedPrograms: this.form.selectedPrograms?.length ? this.form.selectedPrograms.join(',') : null,
          daysOfOperation: this.form.daysOfOperation?.length ? this.form.daysOfOperation.join(',') : null,
          additionalLanguages: this.form.additionalLanguages?.length ? this.form.additionalLanguages.join(',') : null,
          indigenousLed: this.form.indigenousLed?.length ? this.form.indigenousLed.join(',') : null,
          preschoolServices: this.form.preschoolServices?.length ? this.form.preschoolServices.join(',') : null,
        };
        await ProgramsVacanciesService.updateProgramsVacancies(this.form.programsVacanciesId, payload);
        // Manually update timestamp since server doesn't return updated value
        this.programVacancies.updatedOn = moment().utc().format('YYYY-MM-DDTHH:mm:ss[Z]');
        this.setSuccessAlert('Programs and Vacancies updated successfully.');
        this.isEditing = false;
      } catch (error) {
        this.setFailureAlert('Failed to update Programs and Vacancies.');
        console.error(error);
      } finally {
        this.isProcessing = false;
      }
    },
  },
};
</script>
