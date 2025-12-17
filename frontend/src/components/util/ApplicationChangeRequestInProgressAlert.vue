<template>
  <v-container fluid class="px-0">
    <v-card>
      <v-card-title class="noticeAlert text-wrap">
        <v-icon size="x-large" class="noticeAlertIcon"> mdi-alert-octagon </v-icon>
        You have a change request for the {{ changeRequestYearLabel }} funding term still in progress.
      </v-card-title>
      <p class="pa-8 pt-6">
        The {{ formattedProgramYear }} Program Confirmation Form cannot be submitted until the change is complete.
        <AppButton :loading="loading" size="medium" class="mt-4" @click="goToChangeRequestHistory">
          View My Changes
        </AppButton>
      </p>
    </v-card>
  </v-container>
</template>

<script>
import { mapState } from 'pinia';
import AppButton from '@/components/guiComponents/AppButton.vue';
import { useAppStore } from '@/store/app.js';
import { useApplicationStore } from '@/store/application.js';
import { useReportChangesStore } from '@/store/reportChanges.js';
import { CHANGE_REQUEST_TYPE_TEXTS, CHANGE_REQUEST_EXTERNAL_STATUS, PATHS } from '@/utils/constants.js';
import { formatFiscalYearName } from '@/utils/format';

export default {
  name: 'ApplicationChangeRequestInProgressAlert',
  components: { AppButton },
  props: {
    loading: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    ...mapState(useAppStore, ['programYearList']),
    ...mapState(useApplicationStore, ['formattedProgramYear', 'programYearId']),
    ...mapState(useReportChangesStore, ['changeRequestStore']),
    changeRequestYearLabel() {
      const programYearList = this.programYearList?.list;
      const currProgramYear = programYearList?.find((year) => year.programYearId === this.programYearId);
      const prevProgramYear = programYearList?.find((year) => year.programYearId === currProgramYear.previousYearId);
      const previousYearCR = this.changeRequestStore?.find(
        (cr) =>
          (cr.externalStatus === CHANGE_REQUEST_EXTERNAL_STATUS.SUBMITTED ||
            cr.externalStatus === CHANGE_REQUEST_EXTERNAL_STATUS.ACTION_REQUIRED) &&
          cr.changeActions[0].changeType !== CHANGE_REQUEST_TYPE_TEXTS.MTFI &&
          cr.programYearId === prevProgramYear.programYearId,
      );
      return previousYearCR ? formatFiscalYearName(prevProgramYear.name) : this.formattedProgramYear;
    },
  },
  methods: {
    goToChangeRequestHistory() {
      this.$router.push(`${PATHS.ROOT.CHANGE_LANDING}#change-request-history`);
    },
  },
};
</script>
