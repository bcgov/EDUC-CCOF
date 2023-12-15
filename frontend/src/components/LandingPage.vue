<template>
  <v-container fluid class="pa-12">

    <MessagesToolbar></MessagesToolbar>

    <div v-if="organizationAccountNumber || organizationName" class="font-weight-bold pb-6 text-h5 text-center">
      <p v-if="organizationAccountNumber">Organization ID: {{ organizationAccountNumber }}</p>
      <p v-if="organizationName">Organization Name: {{ organizationName }}</p>
    </div>

    <div class="pb-12 text-h4 text-center">
      What would you like to do?
    </div>


    <v-row class="" align="stretch" justify="space-around">
      <SmallCard :class="smallCardLayout('CCOF')">
        <template #content>
          <p class="text-h6" v-if="isCCOFApproved && getActionRequiredApplicationsForCCOFCard?.length === 0">
            Child Care Operating Funding <strong>(CCOF)</strong>
          </p>
          <p class="text-h6" v-else>
            Apply for Child Care Operating Funding <strong>(CCOF)</strong> including:
          </p>
          <div v-if="!isCCOFApproved || getActionRequiredApplicationsForCCOFCard?.length > 0">
            <v-container class="pa-0"  v-for="item in ccofNewApplicationText" :key="item.infoTitle" fluid >
              <ul>
                <li class="pa-0">{{item.title}}</li>
              </ul>
              <v-card color="#B3E5FF" class="mt-1 pa-1 py-2" outlined v-if="ccofStatus === CCOF_STATUS_NEW" style="border: 1px solid #5fbbeb;">
                <v-row align="center" no-gutters>
                  <v-col :cols="12" lg="1" align="center">
                    <v-icon color="#003366" aria-hidden="false" size="40">
                      mdi-information
                    </v-icon>
                  </v-col>
                  <v-col :cols="12" lg="11" v-html="item.body" class="px-2 py-1">
                  </v-col>
                </v-row>
              </v-card>
            </v-container>
          </div>
          <p class="pt-2" v-if="ccofStatus === CCOF_STATUS_NEW">
            For more information, visit the government website:
            <a class='text-decoration-underline' href="https://www2.gov.bc.ca/gov/content/family-social-supports/caring-for-young-children/running-daycare-preschool/child-care-operating-funding">gov.bc.ca/childcareoperatingfunding</a>
          </p>
        </template>
        <template #button>
          <div v-if="ccofStatus === CCOF_STATUS_NEW">
            <v-btn dark class="blueButton" @click="newApplicationIntermediatePage()">
              Start Application
            </v-btn>
            <p class="mt-4">Fiscal year runs April 1 to March 31</p>
          </div>

          <div v-else-if="ccofStatus === CCOF_STATUS_CONTINUE">
            <p class="text-h5 blueText">Status: Incomplete</p>
            <v-btn dark class="blueButton" @click="continueApplication()">Continue Application</v-btn>
            <p class="mt-4">Fiscal year runs April 1 to March 31</p>
            <v-btn v-if="isCancelPcfButtonEnabled" dark class="redButton" @click="openDialog()">Cancel Application</v-btn>
          </div>

          <div v-else>
            <div v-if="getActionRequiredApplicationsForCCOFCard?.length > 0">
              <div v-for="item in getActionRequiredApplicationsForCCOFCard" :key="item.applicationId">
                <v-btn dark class="blueButton my-2" @click="actionRequiredOrganizationRoute(item.ccofProgramYearId)">
                  Update {{ item.ccofProgramYearName?.slice(0,-3) }} PCF
                </v-btn>
              </div>
            </div>
            <div v-else>
              <p class="text-h5 blueText mb-0" v-if="ccofStatus === CCOF_STATUS_APPROVED">Status of your funding agreement for the current fiscal year: Active</p>
              <p class="text-h5 blueText mb-0" v-else>Status: Submitted</p>
              <v-btn dark class="blueButton mt-4" @click="viewApplication('NEW')" v-if="applicationType === 'NEW'">View Application</v-btn>
              <v-btn dark class="blueButton" @click="viewApplication('RENEW')" v-else-if="applicationType === 'RENEW' && applicationStatus === 'SUBMITTED' && ccofRenewStatus != RENEW_STATUS_ACTION_REQUIRED">View Application</v-btn>
            </div>
            <p class="mt-4">Fiscal year runs April 1 to March 31</p>
            <router-link v-if="isSubmissionHistoryDisplayed" class='text-decoration-underline' :to="PATHS.ROOT.SUBMISSION_HISTORY">
              View submission history
            </router-link>
          </div>
        </template>
      </SmallCard>

      <v-dialog
        v-model="showDeleteDialog"
        persistent
        max-width="700px">
        <v-card>
          <v-container class="pt-0">
            <v-row>
              <v-col cols="7" class="py-0 pl-0" style="background-color:#234075;">
                <v-card-title class="white--text">Cancel Application Warning</v-card-title>
              </v-col>
              <v-col cols="5" class="d-flex justify-end" style="background-color:#234075;">
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" style="background-color:#FFC72C;padding:2px;"></v-col>
            </v-row>
            <v-row>
              <v-col cols="12" style="text-align: center;">
                <p>If you cancel your application, any information you entered will be deleted. If you create a new application, you will need to re-enter this information.</p>
                <p class="pt-4">Are you sure you want to cancel your application and delete your information?</p>
                <v-btn :loading="!isLoadingComplete" dark color="secondary" class="mr-10" @click="closeDialog()">Back</v-btn>
                <v-btn :loading="!isLoadingComplete" dark color="primary" @click="deletePcf()">Continue</v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-dialog>

      <SmallCard :class="smallCardLayout('RENEW')" :title="`Renew my funding agreement for ${renewalYearLabel}`" :disable="!isRenewEnabled ">
        <template #content>
          <!-- <p class="text-h6">Renew my Funding Agreement {{ renewalYearLabel }}</p> -->
          <p class="text-h6">Renew my Funding Agreement {{ getRenewYearLabel }}</p>

          <p>
            Current providers must renew their Funding Agreement every year. For more information, visit the government website:
          </p>
          <p>
            <a class='text-decoration-underline' style="pointer-events: all;" href="https://www2.gov.bc.ca/gov/content/family-social-supports/caring-for-young-children/running-daycare-preschool/child-care-operating-funding">gov.bc.ca/childcareoperatingfunding</a>
          </p>
          <!-- <div class="text-h5 blueText" v-if="ccofRenewStatus === RENEW_STATUS_APPROVED">Status of the {{formattedProgramYear}} PCF: Approved</div> -->
          <div v-if="ccofRenewStatus === RENEW_STATUS_COMPLETE">
            <!-- <p class="text-h6 blueText">Status of the PCF: Submitted</p> -->
            <span>We will contact you if we require further information. You can view your latest submission from the button below.</span>
          </div>
        </template>
        <template #button>
          <!-- wait for CR list to be loaded before starting a renewal- to not allow user to start renewal if there is active change request -->
          <div v-if="!isLoadingComplete">
            <v-skeleton-loader class="ma-0 pa-0" type="chip"></v-skeleton-loader>
          </div>
          <div v-else>
            <!-- {{ isRenewEnabled }} -->
            <v-btn :color='buttonColor(!isRenewEnabled)' dark v-if="ccofRenewStatus === RENEW_STATUS_NEW" @click="renewApplication()">Renew my Funding Agreement </v-btn>
            <v-btn :color='buttonColor(!isRenewEnabled)' dark v-else-if="ccofRenewStatus === RENEW_STATUS_CONTINUE" @click="continueRenewal()">Continue Renewal</v-btn>
            <v-btn :color='buttonColor(!isRenewEnabled)' dark v-else-if="ccofRenewStatus === RENEW_STATUS_ACTION_REQUIRED" @click="actionRequiredOrganizationRoute()">Update your PCF</v-btn>
            <v-btn :color='buttonColor(true)' :disabled=true v-else>Renew my Funding Agreement</v-btn>
          </div>
        </template>
      </SmallCard>

      <SmallCard :class="smallCardLayout('OTHERS')" class="col-lg-2" :disable="!isReportChangeButtonEnabled">
        <template #content>
          <p class="text-h6">
            Report changes to your licence or service
          </p>
          <p>
            You must notify the Child Care Operating Funding program within two business days of any change to your facility licence
            or the services outlined in Schedule A of your Child Care Operating Funding Agreement.
          </p>
        </template>
        <template #button>
          <v-row no-gutters>
            <v-col v-if="isLoadingComplete && isUpdateChangeRequestDisplayed" class="col-12 mb-3">
              <v-btn @click="goToChangeRequestHistory()" :color='buttonColor(false)' dark>
                Update change request
              </v-btn>
            </v-col>
            <v-col class="col-12">
              <v-btn @click="goToReportChange()" :color='buttonColor(!isReportChangeButtonEnabled)' dark>
                Report a change
              </v-btn>
            </v-col>
          </v-row>
        </template>
      </SmallCard>

      <SmallCard :class="smallCardLayout('OTHERS')" :disable="!isCCOFApproved">
        <template #content>
          <p class="text-h6">
            Submit Enrolment Reports or monthly ECE reports to receive funding
          </p>
          <p>
            If you are expecting a new licence or change to your licence or service details,
            contact the Child Care Operating Funding program before submitting your next enrolment report or monthly ECE report.
          </p>
        </template>
        <template #button>
          <v-btn href="https://childcareinfo.gov.bc.ca/childcare/welcome_ccof.aspx" :color='buttonColor(!isCCOFApproved)' dark>Submit a report</v-btn>
        </template>
      </SmallCard>
    </v-row>

    <v-skeleton-loader class="mt-12" :loading="!isLoadingComplete" type="paragraph, text@3, text@3, paragraph" v-if="!isLoadingComplete"></v-skeleton-loader>
    <v-card class="rounded-lg elevation-0 pa-4 mt-8" outlined v-else-if="navBarList?.length > 0">
      <v-row no-gutters>
        <v-col class="col-12 col-md-6 ml-4 mb-4">
          <h2>Fiscal Year: {{ programYearNameForFacilityCards }}</h2>
        </v-col>
      </v-row>
      <v-row no-gutters justify="space-between">
        <v-col class="col-12 col-lg-7 ml-4">
          <!--TODO: sezarch box only looks at facility name. Update it later to search for status and licence
            Update when data comes in from the API
            Filter by Facility Name, status, or licence: "
            .-->
          <v-text-field
            clearable
            filled
            label="Filter by Facility Name "
            v-model="input"
            :bind="input"
            v-if="facilityListForFacilityCards?.length > 2">
          </v-text-field>
        </v-col>
        <v-col class="col-12 col-lg-4">
          <v-row class="justify-right align-center mr-4">
            <h3 class="mr-4" v-if="applicationIds?.length > 1">Select fiscal year: </h3>
            <FiscalYearSlider @selectProgramYear="selectProgramYear"></FiscalYearSlider>
          </v-row>
        </v-col>
      </v-row>
      <v-row no-gutters justify="space-around">
        <v-col class="col-12 col-xl-6 pa-4 flex d-flex flex-column"
          v-for="facility in filteredFacilityListForFacilityCards" :key="facility?.facilityId">
          <v-card class="elevation-4 pa-2 rounded-lg blueBorder flex d-flex flex-column" min-height="230">
            <v-card-text>
              <p class="text-h5 text--primary text-center" v-if="facility?.facilityAccountNumber">Facility ID: {{facility?.facilityAccountNumber}}</p>
              <p class="text-h5 text--primary text-center" v-if="facility?.facilityName">Facility Name: {{facility?.facilityName}}</p>
              <p class="text-h5 text--primary text-center" v-if="facility?.licenseNumber">Licence Number: {{facility?.licenseNumber}}</p>
              <br>
              <p class="blueText">
                Child Care Fee Reduction Initiative (CCFRI) Status:
                <strong> {{getCcfriStatusForFacilityCard(facility)}}</strong>
              </p>
              <br>
              <p class="blueText">
                Early Childhood Educator Wage Enhancement (ECE-WE) Status:
                <strong> {{getEceweStatusForFacilityCard(facility)}}</strong>
              </p>
            </v-card-text>
            <v-row justify="center" no-gutters class="mb-4" v-if="isFacilityCardUnlock(facility?.ccfriApplicationId)">
              <v-btn class="blueButton" dark width="80%" align="center" @click="actionRequiredFacilityRoute(facility?.ccfriApplicationId)">Update your PCF</v-btn>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
    <p class="text-center mt-4 font-weight-bold">
      Note: For assistance completing your Program Confirmation Form, contact the program at 1-888-338-6622 (Option 2).
    </p>
  </v-container>
</template>
<script>

import _ from 'lodash';
import { mapGetters, mapState, mapMutations, mapActions} from 'vuex';
import SmallCard from './guiComponents/SmallCard.vue';
import MessagesToolbar from './guiComponents/MessagesToolbar.vue';
import FiscalYearSlider from './guiComponents/FiscalYearSlider';
import { PATHS, pcfUrl, pcfUrlGuid, CHANGE_REQUEST_EXTERNAL_STATUS } from '@/utils/constants';
import alertMixin from '@/mixins/alertMixin';
import { checkApplicationUnlocked } from '@/utils/common';


export default {
  name: 'LandingPage',
  mixins: [alertMixin],
  data() {
    return {
      input: '',
      PATHS: PATHS,
      results : {},
      showDeleteDialog: false,
      ccofNewApplicationText: [
        {
          title: 'CCOF Base Funding',
          body: '<p><strong>(CCOF)</strong> Base Funding assists eligible licensed family and group child care providers with the day-to-day costs of running a facility.</p><strong> CCOF Base Funding is a prerequisite to participate in CCFRI and ECE-WE.</strong>',
        },
        {
          title: 'Child Care Fee Reduction Initiative (CCFRI) Funding',
          body: 'The CCFRI offers funding to eligible, licensed child care providers to reduce and stabilize parents’ monthly child care fees.',
        },
        {
          title: 'Early Childhood Educator Wage Enhancement (ECE-WE) Funding',
          body: 'Providers with licensed care facilities can apply for a wage enhancement for Early Childhood Educators (ECEs) they employ directly.',
        },
      ],
      CCOFCardTitle : 'Apply for Child Care Operating Funding (CCOF) including:',
      isLoadingComplete: false,
      selectedProgramYear: undefined
    };
  },

  async created () {
    this.CCOF_STATUS_NEW = 'NEW';
    this.CCOF_STATUS_COMPLETE = 'COMPLETE';
    this.CCOF_STATUS_CONTINUE = 'CONTINUE';
    this.CCOF_STATUS_APPROVED = 'APPROVED';
    this.CCOF_STATUS_ACTION_REQUIRED = 'ACTION_REQUIRED';

    this.RENEW_STATUS_NEW = 'NEW';
    this.RENEW_STATUS_COMPLETE = 'COMPLETE';
    this.RENEW_STATUS_CONTINUE = 'CONTINUE';
    this.RENEW_STATUS_APPROVED = 'APPROVED';
    this.RENEW_STATUS_ACTION_REQUIRED = 'ACTION_REQUIRED';

    this.isLoadingComplete = false;
    this.getAllMessagesVuex();
    this.refreshNavBarList();
    await this.getChangeRequestList();
    this.isLoadingComplete = true;
  },
  computed: {
    ...mapGetters('auth', ['userInfo']),
    ...mapGetters('app', ['renewalYearLabel']),
    ...mapGetters('application', ['latestProgramYearId', 'applicationIds', 'getFacilityListForPCFByProgramYearId', 'formattedProgramYear']),
    ...mapState('app', ['programYearList']),
    ...mapState('navBar', ['navBarList']),
    ...mapState('organization', ['fundingAgreementNumber', 'organizationAccountNumber', 'organizationProviderType', 'organizationId', 'organizationName', 'organizationAccountNumber']),
    ...mapState('application', ['applicationType', 'programYearId', 'programYearLabel', 'ccofApplicationStatus', 'unlockBaseFunding', 'isRenewal',
      'unlockDeclaration', 'unlockEcewe', 'unlockLicenseUpload', 'unlockSupportingDocuments', 'applicationStatus', 'applicationMap', 'applicationId']),
    ...mapState('reportChanges', ['changeRequestStore']),
    getRenewYearLabel(){
      console.log('sss');
      console.log(this.applicationType);
      console.log(this.ccofRenewStatus);
      if (this.applicationType == "NEW" && this.applicationStatus == "DRAFT"  || (!this.applicationId)){
        console.log('no year');
        return "";
      }
      //show the year ahead because we can't pull from application year YET
      else if (this.ccofRenewStatus === this.RENEW_STATUS_NEW){
        console.log(this.programYearList?.list);
        let nameToReturn = this.programYearList?.list?.find(el => el.previousYearId == this.latestProgramYearId)?.name;
        console.log('///////////////');
        console.log(nameToReturn);
        console.log(nameToReturn.substring(0,7));
        return nameToReturn?.substring(0,7);
      }

      else if (this.ccofRenewStatus === this.RENEW_STATUS_CONTINUE || this.ccofRenewStatus === this.RENEW_STATUS_ACTION_REQUIRED  ){
        return this.formattedProgramYear;
      }
      return this.formattedProgramYear;
    },
    getActionRequiredApplicationsForCCOFCard() {
      const applicationList = Array.from(this.applicationMap?.values());
      return applicationList?.filter(application => {
        const isLatestRenewApplication = (application.ccofProgramYearId === this.latestProgramYearId) && (this.ccofRenewStatus !== this.RENEW_STATUS_NEW) && (application.applicationType === 'RENEW');
        const isApplicationUnlocked = checkApplicationUnlocked(application);
        return (!isLatestRenewApplication && isApplicationUnlocked);
      });
    },
    facilityListForFacilityCards() {
      if (this.selectedProgramYear)
        return this.getFacilityListForPCFByProgramYearId(this.selectedProgramYear?.programYearId);
      return this.getFacilityListForPCFByProgramYearId(this.programYearId);
    },
    programYearNameForFacilityCards() {
      if (this.selectedProgramYear)
        return this.selectedProgramYear?.name;
      return this.programYearLabel?.slice(0,-3);
    },
    filteredFacilityListForFacilityCards() {
      if (this.input === '' || this.input === ' ' || this.input === null){
        return this.facilityListForFacilityCards;
      }
      return this.facilityListForFacilityCards?.filter((fac) => fac.facilityName.toLowerCase().includes(this.input.toLowerCase()));
    },
    isWithinRenewDate() {
      let isEnabled = (this.userInfo.serverTime > this.programYearList?.renewal?.intakeStart
        && this.userInfo.serverTime < this.programYearList?.renewal?.intakeEnd);
      console.log('isWithinRenewDate: ', isEnabled);
      return isEnabled;
    },
    isRenewEnabled() {
      console.log('can renew?: ' , this.isWithinRenewDate);
      if (this.applicationType === 'NEW') {
        if (this.applicationStatus === 'DRAFT') {
          return false;
        } else if ((this.applicationStatus === 'SUBMITTED' || this.applicationStatus === 'APPROVED') && this.organizationAccountNumber && this.ccofApplicationStatus === 'ACTIVE') {
          let isEnabled = this.isWithinRenewDate
            && this.programYearId == this.programYearList?.renewal?.previousYearId // can only renew if the last application was for the previous year
            && this.programYearId != this.programYearList?.renewal?.programYearId; // cannot renew if current application program year is the same as renewal program year
          return isEnabled;
        }
      }
      return (this.applicationType === 'RENEW');
    },
    ccofStatus() {
      if (!this.applicationType) {
        return this.CCOF_STATUS_NEW;
      }
      if (this.applicationType === 'NEW') {
        switch (this.applicationStatus) {
        case 'DRAFT':
          return this.CCOF_STATUS_CONTINUE;
        case 'SUBMITTED':
          if (this.isOrganizationUnlock)
            return this.CCOF_STATUS_ACTION_REQUIRED;
          else
            return (this.ccofApplicationStatus === 'ACTIVE') ? this.CCOF_STATUS_APPROVED : this.CCOF_STATUS_COMPLETE;
        default:
          return this.CCOF_STATUS_NEW;
        }
      } else {
        return this.CCOF_STATUS_APPROVED;
      }
    },
    ccofRenewStatus() {
      if (this.applicationType === 'RENEW') {
        console.log(this.applicationStatus);
        if (this.applicationStatus === 'DRAFT') {
          return this.RENEW_STATUS_CONTINUE;
        } else if (this.programYearId == this.programYearList.renewal?.previousYearId && this.isWithinRenewDate) {
          return this.RENEW_STATUS_NEW;
        } else if (this.isOrganizationUnlock) {
          return this.RENEW_STATUS_ACTION_REQUIRED;
        } else if (this.applicationStatus === 'SUBMITTED' && this.ccofApplicationStatus === 'ACTIVE') {
          return this.RENEW_STATUS_APPROVED;
        } else {
          return this.RENEW_STATUS_COMPLETE;
        }
      } else {
        return this.RENEW_STATUS_NEW;
      }
    },
    isOrganizationUnlock() {
      return ((this.unlockBaseFunding && (this.applicationType === 'NEW'))
        || this.unlockDeclaration || this.unlockEcewe || this.unlockLicenseUpload || this.unlockSupportingDocuments
        || (this.unlockCCFRIList.length > 0 || this.unlockNMFList.length > 0 || this.unlockRFIList.length > 0));
    },
    unlockCCFRIList() {
      let unlockList = [];
      this.navBarList?.forEach((facility) => {
        if (facility.unlockCcfri)
          unlockList.push(facility.ccfriApplicationId);
      });
      return unlockList;
    },
    unlockNMFList() {
      let unlockList = [];
      this.navBarList?.forEach((facility) => {
        if (facility.unlockNmf)
          unlockList.push(facility.ccfriApplicationId);
      });
      return unlockList;
    },
    unlockRFIList() {
      let unlockList = [];
      this.navBarList?.forEach((facility) => {
        if (facility.unlockRfi)
          unlockList.push(facility.ccfriApplicationId);
      });
      return unlockList;
    },
    isCCOFApproved() {
      return (this.applicationType === 'RENEW') || (this.ccofStatus === this.CCOF_STATUS_APPROVED);
    },
    isReportChangeButtonEnabled() {
      return !!(this.organizationAccountNumber && this.fundingAgreementNumber);
    },
    isUpdateChangeRequestDisplayed() {
      const index = this.changeRequestStore?.findIndex(changeRequest => changeRequest.externalStatus === CHANGE_REQUEST_EXTERNAL_STATUS.ACTION_REQUIRED);
      return index > -1;
    },
    isSubmissionHistoryDisplayed() {
      const applicationList = Array.from(this.applicationMap?.values());
      const index = applicationList?.findIndex(application => application.applicationStatus != 'DRAFT');
      return (index > -1);
    },
    mtfiChangeRequestList() {
      let result = [];
      if (this.changeRequestStore?.length > 0) {
        result = this.changeRequestStore.filter(changeRequest => {
          if (changeRequest.programYearId === this.selectedProgramYear?.programYearId) {
            let index = changeRequest.changeActions?.findIndex(changeAction => changeAction.changeType === 'PARENT_FEE_CHANGE');
            return (index > -1);
          }
          return false;
        });
      }
      return result;
    },
    isCancelPcfButtonEnabled(){
      return this.applicationStatus === "DRAFT" && this.applicationType === "NEW" && this.ccofApplicationStatus === "NEW";
    }
  },
  methods: {
    ...mapMutations('application', ['setIsRenewal',]),
    ...mapActions('message', ['getAllMessages']),
    ...mapActions('application', ['deletePcfApplication']),
    ...mapMutations('navBar', ['refreshNavBarList']),
    ...mapActions('reportChanges', ['getChangeRequestList']),
    closeDialog() {
      this.showDeleteDialog = false;
    },
    openDialog() {
      this.showDeleteDialog = true;
    },
    newApplicationIntermediatePage() {
      this.setIsRenewal(false);
      this.$router.push(pcfUrl(PATHS.NEW_APPLICATION_INTERMEDIATE, this.programYearList.newApp.programYearId));
    },
    renewApplication() {
      this.setIsRenewal(true);
      this.$router.push(pcfUrl(PATHS.RENEW_CONFIRM, this.programYearList.renewal.programYearId));
    },
    goToReportChange(){
      this.$router.push(PATHS.ROOT.CHANGE_INFO);
    },
    goToChangeRequestHistory() {
      this.$router.push(PATHS.ROOT.CHANGE_LANDING + '#change-request-history');
    },
    continueRenewal() {
      this.goToLicenseUpload();
    },
    newApplication() {
      this.setIsRenewal(false);
      this.$router.push(pcfUrl(PATHS.SELECT_APPLICATION_TYPE, this.programYearList.newApp.programYearId));
    },
    continueApplication() {
      this.setIsRenewal(false);
      this.$router.push(pcfUrl(this.organizationProviderType === 'GROUP' ? PATHS.CCOF_GROUP_ORG : PATHS.CCOF_FAMILY_ORG, this.programYearId));
    },
    goToCCOFOrganizationInfo() {
      this.$router.push(pcfUrl(this.organizationProviderType === 'GROUP' ? PATHS.CCOF_GROUP_ORG : PATHS.CCOF_FAMILY_ORG, this.programYearId));
    },
    goToCCOFFunding(programYearId, facilityList) {
      if (facilityList?.length > 0) {
        const ccofBaseFundingId = facilityList[0].ccofBaseFundingId;
        if (ccofBaseFundingId && programYearId) {
          this.$router.push(pcfUrlGuid(this.organizationProviderType === 'GROUP' ? PATHS.CCOF_GROUP_FUNDING : PATHS.CCOF_FAMILY_FUNDING, programYearId, ccofBaseFundingId));
        }
      }
    },
    goToLicenseUpload(programYearId = this.programYearId) {
      this.$router.push(pcfUrl(PATHS.LICENSE_UPLOAD, programYearId));
    },
    goToCCFRI(ccfriApplicationId, application) {
      let path = application?.isRenewal ? PATHS.CCFRI_CURRENT_FEES : PATHS.CCFRI_NEW_FEES;
      this.$router.push(pcfUrlGuid(path, application?.ccofProgramYearId, ccfriApplicationId));
    },
    goToNMF(ccfriApplicationId, programYearId) {
      this.$router.push(pcfUrlGuid(PATHS.CCFRI_NMF, programYearId, ccfriApplicationId));
    },
    goToRFI(ccfriApplicationId, programYearId) {
      this.$router.push(pcfUrlGuid(PATHS.CCFRI_RFI, programYearId, ccfriApplicationId));
    },
    goToECEWE(programYearId) {
      this.$router.push(pcfUrl(PATHS.ECEWE_ELIGIBILITY, programYearId));
    },
    goToSupportingDocumentUpload(programYearId = this.programYearId) {
      this.$router.push(pcfUrl(PATHS.SUPPORTING_DOCS, programYearId));
    },
    goToSummaryDeclaration(programYearId = this.programYearId) {
      this.$router.push(pcfUrl(PATHS.SUMMARY_DECLARATION, programYearId));
    },
    viewApplication(type) {
      if (type === 'NEW') {
        this.goToCCOFOrganizationInfo();
      } else {
        this.goToLicenseUpload();
      }
    },
    async getAllMessagesVuex() {
      try {
        await this.getAllMessages(this.organizationId);
      } catch (error) {
        console.info(error);
      }
    },

    async deletePcf() {
      try {
        this.isLoadingComplete = false;
        await this.deletePcfApplication();

        location.reload(); //force a refresh because we just nuked all the data
      } catch (error) {
        console.info(error);
      }
    },
    actionRequiredOrganizationRoute(programYearId = this.programYearId) {
      let application = this.applicationMap?.get(programYearId);
      const facilityList = this.getFacilityListForPCFByProgramYearId(programYearId);
      const unlockCCFRIList = this.getUnlockCCFRIList(facilityList);
      const unlockRFIList = this.getUnlockRFIList(facilityList);
      const unlockNMFList = this.getUnlockNMFList(facilityList);
      if (application?.unlockLicenseUpload)
        this.goToLicenseUpload(programYearId);
      else if (application?.unlockBaseFunding && (application?.applicationType === 'NEW'))
        this.goToCCOFFunding(programYearId, facilityList);
      else if (application?.unlockEcewe)
        this.goToECEWE(programYearId);
      else if (application?.unlockSupportingDocuments)
        this.goToSupportingDocumentUpload(programYearId);
      else if (unlockCCFRIList?.length > 0)
        this.goToCCFRI(unlockCCFRIList[0], application);
      else if (unlockNMFList?.length > 0)
        this.goToNMF(unlockNMFList[0], programYearId);
      else if (unlockRFIList?.length > 0)
        this.goToRFI(unlockRFIList[0], programYearId);
      else if (application?.unlockDeclaration)
        this.goToSummaryDeclaration(programYearId);
    },
    actionRequiredFacilityRoute(ccfriApplicationId) {
      const programYearId = this.selectedProgramYear?.programYearId ? this.selectedProgramYear?.programYearId : this.programYearId;
      const application = this.applicationMap?.get(programYearId);
      if (this.isCCFRIUnlock(ccfriApplicationId, application))
        this.goToCCFRI(ccfriApplicationId, application);
      else if (this.isNMFUnlock(ccfriApplicationId, application))
        this.goToNMF(ccfriApplicationId, programYearId);
      else if (this.isRFIUnlock(ccfriApplicationId, application))
        this.goToRFI(ccfriApplicationId, programYearId);
    },
    buttonColor(isDisabled) {
      return isDisabled ? '#909090' : '#003366';
    },
    smallCardLayout(card) {
      if (this.ccofStatus === this.CCOF_STATUS_NEW) {
        switch (card) {
        case 'CCOF':
          return 'col-lg-5';
        case 'RENEW':
          return 'col-lg-3';
        default:
          return 'col-lg-2';
        }
      }
      return 'col-lg-3';
    },
    isFacilityCardUnlock(ccfriApplicationId) {
      const programYearId = this.selectedProgramYear?.programYearId ? this.selectedProgramYear?.programYearId : this.programYearId;
      let application = this.applicationMap?.get(programYearId);
      return (this.isCCFRIUnlock(ccfriApplicationId, application)
            || this.isNMFUnlock(ccfriApplicationId, application)
            || this.isRFIUnlock(ccfriApplicationId, application));
    },
    isCCFRIUnlock(ccfriApplicationId, application) {
      const facilityList = this.getFacilityListForPCFByProgramYearId(application?.ccofProgramYearId);
      const unlockCCFRIList = this.getUnlockCCFRIList(facilityList);
      return (application?.applicationStatus === 'SUBMITTED' && unlockCCFRIList.includes(ccfriApplicationId));
    },
    isNMFUnlock(ccfriApplicationId, application) {
      const facilityList = this.getFacilityListForPCFByProgramYearId(application?.ccofProgramYearId);
      const unlockNMFList = this.getUnlockNMFList(facilityList);
      return (application?.applicationStatus === 'SUBMITTED' && unlockNMFList.includes(ccfriApplicationId));
    },
    isRFIUnlock(ccfriApplicationId, application) {
      const facilityList = this.getFacilityListForPCFByProgramYearId(application?.ccofProgramYearId);
      const unlockRFIList = this.getUnlockRFIList(facilityList);
      return (application?.applicationStatus === 'SUBMITTED' && unlockRFIList.includes(ccfriApplicationId));
    },
    getUnlockCCFRIList(facilityList) {
      let unlockList = [];
      facilityList?.forEach((facility) => {
        if (facility.unlockCcfri)
          unlockList.push(facility.ccfriApplicationId);
      });
      return unlockList;
    },
    getUnlockNMFList(facilityList) {
      let unlockList = [];
      facilityList?.forEach((facility) => {
        if (facility.unlockNmf)
          unlockList.push(facility.ccfriApplicationId);
      });
      return unlockList;
    },
    getUnlockRFIList(facilityList) {
      let unlockList = [];
      facilityList?.forEach((facility) => {
        if (facility.unlockRfi)
          unlockList.push(facility.ccfriApplicationId);
      });
      return unlockList;
    },
    selectProgramYear(programYear) {
      this.selectedProgramYear = programYear;
    },
    getLastSubmittedMTFIChangeRequest(facilityId) {
      let lastMTFIChangeRequest;
      if (this.mtfiChangeRequestList?.length > 0) {
        let mtfiChangeRequestListForFacility = this.mtfiChangeRequestList?.filter(item => {
          if (item.firstSubmissionDate) {
            const mtfiChangeAction = item.changeActions?.find(changeAction => (changeAction.changeType === 'PARENT_FEE_CHANGE'));
            const index = mtfiChangeAction?.mtfiFacilities?.findIndex(fac => fac.facilityId === facilityId);
            return (index > -1);
          }
          return false;
        });
        if (mtfiChangeRequestListForFacility?.length > 0) {
          mtfiChangeRequestListForFacility = _.orderBy(mtfiChangeRequestListForFacility, 'firstSubmissionDate', 'desc');
          lastMTFIChangeRequest = mtfiChangeRequestListForFacility[0];
        }
      }
      return lastMTFIChangeRequest;
    },
    getCcfriStatusForFacilityCard(facility) {
      if (facility?.ccfriOptInStatus === 0)
        return 'OPTED OUT';
      else {
        const lastMTFIChangeRequest = this.getLastSubmittedMTFIChangeRequest(facility?.facilityId);
        if (lastMTFIChangeRequest?.changeActions?.length > 0) {
          const mtfiFacility = lastMTFIChangeRequest.changeActions[0].mtfiFacilities?.find(item => item.facilityId === facility?.facilityId);
          return mtfiFacility?.ccfriStatus;
        }
        return facility?.ccfriStatus;
      }
    },
    getEceweStatusForFacilityCard(facility) {
      if (facility?.eceweOptInStatus === 0)
        return 'OPTED OUT';
      else {
        return facility?.eceweStatus;
      }
    }
  },
  components: { SmallCard, MessagesToolbar, FiscalYearSlider }
};
</script>

<style scoped>
.blueBorder{
  border-top: 5px solid #003366 !important;
}
.blueButton {
  background-color: #003366 !important;
}
.redButton {
  background-color: #cc0f0f !important;
}
.blueText {
  color: rgb(0, 52, 102) !important;
}
</style>
