<template>
    <v-container>

  
      <v-form ref="isValidForm" value="false" v-model="isValidForm">
  
        <v-container>
  
          <v-row no-gutters id="change-request-history">
            <v-col class= "col-lg-12 mt-10">
              <h2>Submission History</h2>
            </v-col>
          </v-row>
          <v-row v-if="processing">
            <v-col >
              <v-skeleton-loader :loading="processing" type="paragraph, text@3, text@3, paragraph"></v-skeleton-loader>
            </v-col>
          </v-row>
          <v-data-table
            :headers="headers"
            :items="allItems"
            :height = "maxChangeHistoryTableHeight"
            mobile-breakpoint="md"
            fixed-header
            class="elevation-4 my-4"
            disable-pagination hide-default-footer
            :sort-by="['priority', 'submissionDate']"
            :sort-desc="[true, true]"
          >
            <template v-slot:item.facilityNames="{ item }">
            </template>
            <template v-slot:item.PDF="{ item }">
              <router-link
                :to="{
                path: 'api/pdf/getDocument/'+item.annotationId
                }"
                target="_blank"
                >
                {{item.fileName}}
              </router-link>
            </template>
          </v-data-table>
        </v-container>
      </v-form>
  
      <NavButton :isNextDisplayed="false" :isSaveDisplayed="false"
           :isNextDisabled="true" :isProcessing="processing"
          @previous="previous" @next="false" @validateForm="validateForm()" @save="save(true)"></NavButton>
    </v-container>
  </template>
  
  <script>
  import { mapState, mapMutations, mapActions } from 'vuex';
  import { PATHS } from '@/utils/constants';
  import alertMixin from '@/mixins/alertMixin';
  import NavButton from './util/NavButton.vue';
  import {ApiRoutes} from '@/utils/constants';
  
  
  
  
  export default {
    mixins: [alertMixin],
    data() {
      return {
        isValidForm: false,
        processing: false,
        loading: false,
        rules: [
          (v) => !!v || 'Required.',
        ],
        headersGroup: [
          { text: 'Application/Change Request ID', value: 'appId', class: 'tableHeader'},
          { text: 'Type', value: 'type', class: 'tableHeader' },
          { text: 'Fiscal Year', value: 'fiscalYear', class: 'tableHeader' }, 
          { text: 'Submission Date', value: 'submissionDateString', class: 'tableHeader' },
          { text: 'PDF', value: 'PDF', class: 'tableHeader' },
        ],
        changeHistoryButtonWidth: '88px'
      };
    },
    computed: {
      ...mapState('app', ['programYearList']),
      ...mapState('application', ['applicationStatus', 'formattedProgramYear', 'applicationId']),
      ...mapState('reportChanges', ['changeRequestStore','userProfileChangeRequests']),
      ...mapState('navBar', ['userProfileList']),
      ...mapState('document',['pdfs']),
      isReadOnly() {
        return false;
      },
      allItems() {
        let allItems = [];    
        //if (this.changeRequestStore?.length > 0) {
        allItems =  this.pdfs?.map((submission, index) => {
          //let sortedSubmissions = this.sortChangeActions(changeRequest, 'desc');
          return {
            index: index,
            annotationId: submission?.annotationId,
            appId: submission?.fileName.split('_')[0],
            type: submission?.type,
            fiscalYear: submission?.fiscalYear.replace(/[^\d/]/g, ''),
            submissionDate: submission?.createDate,
            submissionDateString: this.getSubmissionDateString(submission?.createDate),
            fileName: submission?.fileName,
            fileSize: submission?.fileSize/1000,
          };
        });
        //}
        return allItems;
      },
      // Table should be vertically scrollable once rows > 8
      maxChangeHistoryTableHeight() {
        return this.allItems?.length > 8 ? 53 * 9 : undefined;
      },
      headers() {
        return this.headersGroup;
      },
      maxfacilityNamesStringLength() {
        if (this.$vuetify.breakpoint.width > 3500) {
          return ('--maxLength: 700px');
        }
        switch (this.$vuetify.breakpoint.name) {
        case 'xl':
          return ('--maxLength: ' + (Math.floor(this.$vuetify.breakpoint.width / 10) + 350) + 'px');
        case 'lg':
          return ('--maxLength: ' + (Math.floor(this.$vuetify.breakpoint.width / 10)) + 'px');
        case 'md':
          return ('--maxLength: ' + (Math.floor(this.$vuetify.breakpoint.width / 10) + 300) + 'px');
        case 'sm':
          return ('--maxLength: ' + (Math.floor(this.$vuetify.breakpoint.width / 10) + 300) + 'px');
        case 'xs':
          return ('--maxLength: ' + (Math.floor(this.$vuetify.breakpoint.width / 10) + 100) + 'px');
        default:
          return ('--maxLength: 100px');
        }
      },

    },
    methods: {
      ...mapActions('reportChanges', ['getChangeRequestList', 'createChangeRequest', 'cancelChangeRequest']),
      ...mapActions('document',['getPDFs']),
      ...mapMutations('reportChanges', ['setChangeRequestId', 'setChangeActionId']),
      previous() {
        this.$router.push(PATHS.ROOT.HOME);
      },
      getProgramYearString(programYearId) {
        let label = this.programYearList?.list?.find(programYear => programYear.programYearId == programYearId)?.name;
        return label?.replace(/[^\d/]/g, '');
      },
      getChangeTypeString(changeType){
        switch(changeType){
        case 'PDF_CHANGE':
          return "Report other changes";
        case 'NEW_FACILITY':
          return "Add new facility(s)";
        case 'PARENT_FEE_CHANGE':
          return 'Midterm Fee Increase';
  
        default:
          return 'New Category'; //I put this there because past Report Other Change types were incorrectly mapped to New Category
        }
      },
      // getPDFList(applicationId){
      //   let pdfList =[];
      //   pdfList = this.getPDFs(applicationId);
      //   return pdfList;
      // },

     
      getSubmissionDateString(date) {
        if (date) {
          // date display format: YYYY/MM/DD
          return new Date(date).toLocaleDateString("zh-CN",{ year: 'numeric', month: '2-digit', day: '2-digit' });
        }
        return "- - - -";
      },
      next() {
        this.$router.push(PATHS.ROOT.HOME);
      },

      sortChangeActions(changeRequest, order) {
        return _.sortBy(changeRequest.changeActions, 'createdOn', order);
      },
    },
    async mounted() {
      this.processing = true;
      await this.getPDFs(this.applicationId);
      this.processing = false;
    },
    beforeRouteLeave(_to, _from, next) {
      next();
    },
    components: { NavButton }
  };
  </script>
  <style scoped>
  .blueButton {
    background-color: #003366 !important;
  }
  .blueOutlinedButton {
    color: #003366 !important;
  }
  :deep(.tableHeader) {
    color: rgb(0, 52, 102) !important;
    font-weight: bold !important;
    font-size: 16px !important;
  }
  :deep(.redText) {
    color: red !important;
  }
  .tableTooltip {
    max-width: 70em;
    overflow-wrap: break-word;
  }
  .tableText {
    max-width: var(--maxLength); /* the element needs a fixed width (in px, em, %, etc) */
    overflow: hidden; /* make sure it hides the content that overflows */
    white-space: nowrap; /* don't break the line */
    text-overflow: ellipsis; /* give the beautiful '...' effect */
  }
  </style>
  