<template>
  <v-row no-gutters class="d-flex flex-column">
    <v-form ref="changeNotificationFormSummaryForm">
      <v-expansion-panel-title>
        <SummaryExpansionPanelTitle
          title="Change Notification Form"
          :loading="isProcessing"
          :is-complete="isChangeNotificationFormComplete"
        />
      </v-expansion-panel-title>
      <v-expansion-panel-text eager>
        <div class="my-4">
          <h4>Change Notification Form Documents</h4>
          <div>
            <v-row no-gutters>
              <v-col :cols="6" class="summary-label pr-8"> File name </v-col>
              <v-col :cols="6" class="summary-label"> Description (optional) </v-col>
            </v-row>
            <div v-if="isChangeNotificationFormComplete">
              <v-row v-for="(item, index) in notificationFormDocuments" :key="index" no-gutters>
                <v-col :cols="6" class="summary-value pr-8">
                  {{ item.filename }}
                </v-col>
                <v-col :cols="6">
                  {{ item.notetext }}
                </v-col>
              </v-row>
            </div>
            <v-row v-if="!isChangeNotificationFormComplete" no-gutters>
              <v-col :cols="6" class="summary-value-missing"> Required </v-col>
            </v-row>
          </div>
        </div>
        <div class="my-4">
          <h4>Supporting Documents</h4>
          <div>
            <v-row no-gutters>
              <v-col :cols="6" class="summary-label pr-8"> File name </v-col>
              <v-col :cols="6" class="summary-label"> Description (optional) </v-col>
            </v-row>
            <v-row v-for="(item, index) in supportingDocuments" :key="index" no-gutters>
              <v-col :cols="6" class="summary-value pr-8">
                {{ item.filename }}
              </v-col>
              <v-col :cols="6" class="summary-value">
                {{ item.notetext }}
              </v-col>
            </v-row>
          </div>
        </div>
        <router-link v-if="!isChangeNotificationFormComplete" :to="getRoutingPath">
          <u class="text-error">To add this information, click here. This will bring you to a different page.</u>
        </router-link>
      </v-expansion-panel-text>
    </v-form>
  </v-row>
</template>

<script>
import { mapState } from 'pinia';
import SummaryExpansionPanelTitle from '@/components/guiComponents/SummaryExpansionPanelTitle.vue';
import { useReportChangesStore } from '@/store/reportChanges.js';
import { useSummaryDeclarationStore } from '@/store/summaryDeclaration.js';
import { useNavBarStore } from '@/store/navBar.js';

import { PATHS, changeUrlGuid, CHANGE_TYPES, DOCUMENT_TYPES } from '@/utils/constants.js';

export default {
  components: { SummaryExpansionPanelTitle },
  props: {
    changeNotificationFormDocuments: {
      type: Array,
      required: false,
      default: () => [],
    },
    isProcessing: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['isSummaryValid'],
  data() {
    return {
      PATHS,
      formObj: {
        formName: 'ChangeNotificationFormSummary',
      },
    };
  },
  computed: {
    ...mapState(useReportChangesStore, ['getChangeNotificationActionId', 'isChangeNotificationFormComplete']),
    ...mapState(useSummaryDeclarationStore, ['summaryModel']),
    ...mapState(useNavBarStore, ['changeType']),
    getRoutingPath() {
      if (this.changeType === CHANGE_TYPES.CHANGE_NOTIFICATION) {
        return changeUrlGuid(
          PATHS.CHANGE_NOTIFICATION_FORM,
          this.$route.params?.changeRecGuid,
          this.getChangeNotificationActionId,
          CHANGE_TYPES.CHANGE_NOTIFICATION,
        );
      }
      return changeUrlGuid(
        PATHS.CHANGE_NEW_FACILITY_OTHER,
        this.$route.params?.changeRecGuid,
        this.getChangeNotificationActionId,
      );
    },
    supportingDocuments() {
      return this.changeNotificationFormDocuments?.filter(
        (document) => document.subject === DOCUMENT_TYPES.CR_NOTIFICATION_FORM_SUPPORTING,
      );
    },
    notificationFormDocuments() {
      return this.changeNotificationFormDocuments?.filter(
        (document) => document.subject === DOCUMENT_TYPES.CR_NOTIFICATION_FORM,
      );
    },
  },
  watch: {
    isProcessing: {
      handler() {
        if (this.isProcessing) return;
        this.$emit('isSummaryValid', this.formObj, this.isChangeNotificationFormComplete);
      },
    },
  },
};
</script>

<style scoped>
.summary-label {
  color: grey;
  font-size: small;
}

.summary-value {
  font-size: medium;
  color: black !important;
}

.summary-value-missing {
  font-size: medium;
  color: #d8292f !important;
}
</style>
