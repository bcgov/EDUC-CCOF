<template>
  <v-row no-gutters class="d-flex flex-column">
    <v-form ref="changeNotificationFormSummaryForm" v-model="isValidForm">
      <h4 class="blueText">Change Notification Form
        <v-icon v-if="isValidForm" color="green" large>mdi-check-circle-outline</v-icon>
        <v-icon v-if="!isValidForm" color="#ff5252" large>mdi-alert-circle-outline</v-icon>
        <span v-if="!isValidForm" style="color:#ff5252;">Your form is missing required information. Click here to view. </span>
      </h4>
      <div v-if="!isProcessing">
        <div class="my-2">
          <h4>
            Change Notification Form Documents
            <v-icon v-if="isNotificationFormDocumentsUploadComplete" color="green" large>
              mdi-check-circle-outline
            </v-icon>
            <v-icon v-if="!isNotificationFormDocumentsUploadComplete && !this.isProcessing" color="#ff5252" large>
              mdi-alert-circle-outline
            </v-icon>
            <span v-if="!isNotificationFormDocumentsUploadComplete && !this.isProcessing" style="color:#ff5252;">
              Your form is missing required information.
            </span>
          </h4>
          <div>
            <v-row no-gutters>
              <v-col :cols="6">
                <h5>File name</h5>
              </v-col>
              <v-col :cols="6">
                <h5>Description (optional)</h5>
              </v-col>
            </v-row>
            <v-row
              v-for="(item,index) in this.notificationFormDocuments"
              :key="index"
              no-gutters
            >
              <v-col :cols="6">
                {{ item.name }}
              </v-col>
              <v-col :cols="6">
                {{ item.description }}
              </v-col>
            </v-row>
            <router-link :to="documentUploadPage" v-if="this.notificationFormDocuments?.length <= 0">
              <span style="color:#ff5252; text-underline: black">
                <u>To add this information, click here. This will bring you to a different page.</u>
              </span>
            </router-link>
          </div>
        </div>
        <div class="my-4">
          <h4>Supporting Documents</h4>
          <div>
            <v-row no-gutters>
              <v-col :cols="6">
                <h5>File name</h5>
              </v-col>
              <v-col :cols="6">
                <h5>Description (optional)</h5>
              </v-col>
            </v-row>
            <v-row
              v-for="(item,index) in this.supportingDocuments"
              :key="index"
              no-gutters
            >
              <v-col :cols="6">
                {{ item.name }}
              </v-col>
              <v-col :cols="6">
                {{ item.description }}
              </v-col>
            </v-row>
          </div>
        </div>
      </div>
    </v-form>
  </v-row>
</template>

<script>
import _ from 'lodash';
import { PATHS, changeUrlGuid, CHANGE_TYPES } from '@/utils/constants';
import rules from '@/utils/rules';
import { mapState } from 'vuex';

export default {
  props: {
    oldCcfri: {
      type: Object,
      required: false
    },
    newCcfri: {
      type: Object,
      required: false
    },
    facilityId: {
      type: String,
      required: false
    },
  },
  data() {
    return {
      PATHS,
      rules,
      isValidForm: true,
      formObj:{
        formName: 'MTFISummary',
        formId: this.facilityId,
      },
    };
  },
  watch: {
    isLoadingComplete: {
      handler: function (val) {
        if (val) {
          this.$emit('isSummaryValid', this.formObj, this.isValidForm);
        }
      },
    }
  },
  computed:{
    ...mapState('summaryDeclaration', ['isLoadingComplete']),
    getRoutingPath(){
      return changeUrlGuid(PATHS.MTFI_GROUP_FEE_VERIFICATION, this.$route.params.changeRecGuid, this.newCcfri.ccfriApplicationId, CHANGE_TYPES.MTFI);
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

.summary-label-smaller {
  color: grey;
  font-size: x-small;
}

.summary-label-bold {
  color: black;
  font-size: small;
  font-style: initial;
}
.summary-value-small{
  color: black;
  font-size: small;
  font-weight: bold
}

.gridContainer {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows:    repeat(2, 65px);
}

.feeTitle {
  display: flex;
  align-items: center;
  text-align: end !important;
  text-align: right !important;
  justify-items: end;
  justify-content: end;
  padding: 0px 16px 0px 8px;
  border-right: solid 1px rgba(0, 0, 0, 0.5) !important;
}

.blueText {
  color: #003466 !important;
}

>>>::placeholder {
  color: #ff5252!important;
  opacity: 1;
}
</style>
