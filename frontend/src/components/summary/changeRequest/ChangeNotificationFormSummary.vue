<template>
  <v-row no-gutters class="d-flex flex-column">
    <v-form ref="changeNotificationFormSummaryForm">
      <v-expansion-panel-header>
        <h4 class="blueText">
          Change Notification Form
          <v-icon v-if="isLoadingComplete && isChangeNotificationFormComplete" color="green" large>mdi-check-circle-outline</v-icon>
          <v-icon v-if="isLoadingComplete && !isChangeNotificationFormComplete" color="#ff5252" large>mdi-alert-circle-outline</v-icon>
          <span v-if="isLoadingComplete && !isChangeNotificationFormComplete" style="color:#ff5252;">Your form is missing required information. Click here to view. </span>
        </h4>
      </v-expansion-panel-header>
      <v-expansion-panel-content eager>
        <div class="my-4">
          <h4>
            Change Notification Form Documents
          </h4>
          <div>
            <v-row no-gutters>
              <v-col :cols="6" class="summary-label pr-8">
                File name
              </v-col>
              <v-col :cols="6" class="summary-label">
                Description (optional)
              </v-col>
            </v-row>
            <v-row
              v-for="(item,index) in this.notificationFormDocuments"
              :key="index"
              no-gutters
              v-if="isChangeNotificationFormComplete"
            >
              <v-col :cols="6" class="summary-value pr-8">
                {{ item.filename }}
              </v-col>
              <v-col :cols="6">
                {{ item.notetext }}
              </v-col>
            </v-row>
            <v-row no-gutters v-if="!isChangeNotificationFormComplete">
              <v-col :cols="6" class="summary-value-missing">
                Required
              </v-col>
            </v-row>
          </div>
        </div>
        <div class="my-4">
          <h4>Supporting Documents</h4>
          <div>
            <v-row no-gutters>
              <v-col :cols="6" class="summary-label pr-8">
                File name
              </v-col>
              <v-col :cols="6" class="summary-label">
                Description (optional)
              </v-col>
            </v-row>
            <v-row
              v-for="(item,index) in this.supportingDocuments"
              :key="index"
              no-gutters
            >
              <v-col :cols="6" class="summary-value pr-8">
                {{ item.filename }}
              </v-col>
              <v-col :cols="6" class="summary-value">
                {{ item.notetext }}
              </v-col>
            </v-row>
          </div>
        </div>
        <router-link :to="getRoutingPath" v-if="!isChangeNotificationFormComplete">
          <span style="color:#ff5252">
            <u>To add this information, click here. This will bring you to a different page.</u>
          </span>
        </router-link>
      </v-expansion-panel-content>
    </v-form>
  </v-row>
</template>

<script>
import { PATHS, changeUrlGuid, CHANGE_TYPES } from '../../../utils/constants';
import { mapState, mapGetters } from 'vuex';

export default {
  props: {
    changeNotificationFormDocuments: {
      type: Array,
      required: false
    },
  },
  data() {
    return {
      PATHS,
      formObj:{
        formName: 'ChangeNotificationFormSummary',
      },
    };
  },
  watch: {
    isLoadingComplete: {
      handler: function (val) {
        if (val) {
          this.$emit('isSummaryValid', this.formObj, this.isChangeNotificationFormComplete);
        }
      },
    }
  },
  computed:{
    ...mapGetters('reportChanges', ['getChangeNotificationActionId', 'isChangeNotificationFormComplete']),
    ...mapState('summaryDeclaration', ['isLoadingComplete', 'summaryModel']),
    ...mapState('navBar', ['changeType']),
    getRoutingPath() {
      if (this.changeType === CHANGE_TYPES.CHANGE_NOTIFICATION) {
        return changeUrlGuid(PATHS.CHANGE_NOTIFICATION_FORM, this.$route.params?.changeRecGuid,  this.getChangeNotificationActionId, CHANGE_TYPES.CHANGE_NOTIFICATION);
      }
      return changeUrlGuid(PATHS.CHANGE_NEW_FACILITY_OTHER, this.$route.params?.changeRecGuid, this.getChangeNotificationActionId);
    },
    supportingDocuments() {
      return this.changeNotificationFormDocuments?.filter(document => document.subject == 'SUPPORTING_DOC');
    },
    notificationFormDocuments() {
      return this.changeNotificationFormDocuments?.filter(document => document.subject == 'NOTIFICATION_FORM');
    },
  },
  methods: {
  }
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
  color:#ff5252 !important;
}

.blueText {
  color: #003466 !important;
}

</style>
