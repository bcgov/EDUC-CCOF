<template>
  <v-container class="pa-0 text-body-1" fluid>
    <v-row no-gutters>
      <v-card class="pa-4 mb-4" outlined style="border-color: #0d47a1; border-width: 2px">
        <p class="mb-2">
          Please complete the following questionnaire and update your responses whenever there are changes.
        </p>
        <p class="mb-0">
          The information collected will be used to administer your facility's Child Care Operating Funding and to
          update details on the Child Care Map. Responses to questions marked with an asterisk(*) may appear on the map.
        </p>
      </v-card>
      <div>
        <p class="mb-1">Fiscal Year: {{ programVacancies?.fiscalYear || '-' }}</p>
        <p class="mb-1">Last Updated: {{ programVacancies?.lastUpdated || '-' }}</p>
      </div>
      <v-card class="pa-4 mb-4" outlined style="border-color: grey; border-width: 2px">
        <p class="mb-2">* What are the age(s) of the children served at this facility?</p>
        <p class="mb-2">* How many vacancies do you currently have based on age group?</p>
        <p class="mb-0">* What are the regular days of operation for this facility?</p>
      </v-card>
    </v-row>
  </v-container>
</template>

<script>
import { isEmpty } from 'lodash';
import alertMixin from '@/mixins/alertMixin.js';
import ProgramsVacanciesService from '@/services/programsVacancies.js';

export default {
  name: 'ManageProgramsVacancies',
  mixins: [alertMixin],
  data() {
    return {
      isLoading: false,
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    async loadData() {
      this.isLoading = true;
      try {
        this.programVacancies = await ProgramsVacanciesService.getprogramsVacancies(this.$route.params.facilityId);
        if (isEmpty(this.programVacancies)) {
          this.setWarningAlert('No Programs and Vacancies for this facility.');
        }
      } catch (error) {
        this.setFailureAlert('Failed to load Programs and Vacancies.');
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>
