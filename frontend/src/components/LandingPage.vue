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
          <p class="text-h6" v-if="isCCOFApproved">
            Child Care Operating Funding <strong>(CCOF)</strong>
          </p>
          <p class="text-h6" v-else>
            Apply for Child Care Operating Funding <strong>(CCOF)</strong> including:
          </p>
          <div v-if="!isCCOFApproved">
            <v-container class="px-0"  v-for="item in ccofNewApplicationText" :key="item.infoTitle" fluid >
              <h3 class="text--primary">
                {{item.title}}
              </h3>
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
          <v-btn dark class="blueButton" @click="newApplication()" v-if="ccofStatus === CCOF_STATUS_NEW">Start Application</v-btn>
          <v-btn dark class="blueButton" @click="actionRequiredOrganizationRoute()" v-else-if="ccofStatus === CCOF_STATUS_ACTION_REQUIRED">Update your PCF</v-btn>
          <div v-else-if="ccofStatus === CCOF_STATUS_CONTINUE">
            <p class="text-h5 blueText">Status: Incomplete</p>
            <v-btn dark class="blueButton" @click="continueApplication()">Continue Application</v-btn>
          </div>
          <div v-else>
            <p class="text-h5 blueText mb-0" v-if="ccofStatus === CCOF_STATUS_APPROVED">Status of your funding agreement for the current fiscal year: Approved</p>
            <p class="text-h5 blueText mb-0" v-else>Status: Submitted</p>
            <v-btn dark class="blueButton mt-4" @click="viewApplication('NEW')" v-if="applicationType === 'NEW'">View Application</v-btn>
          </div>
        </template>
      </SmallCard>

      <SmallCard :class="smallCardLayout('RENEW')" :title="`Renew my funding agreement for ${this.renewalYearLabel}`" :disable="!isRenewEnabled">
        <template #content>
          <p class="text-h6">Renew my Funding Agreement</p>
          <p>
            Current providers must renew their Funding Agreement every year. For more information, visit the government website:
          </p>
          <p>
            <a class='text-decoration-underline' href="https://www2.gov.bc.ca/gov/content/family-social-supports/caring-for-young-children/running-daycare-preschool/child-care-operating-funding">gov.bc.ca/childcareoperatingfunding</a>
          </p>
          <div class="text-h5 blueText" v-if="ccofRenewStatus === RENEW_STATUS_APPROVED">Status of the PCF: Approved</div>
          <div v-else-if="ccofRenewStatus === RENEW_STATUS_COMPLETE">
            <p class="text-h6 blueText">Status of the PCF: Submitted</p>
            <span>We will contact you if we require further information. You can view your latest submission from the button below.</span>
          </div>
        </template>
        <template #button>
          <v-btn :color='buttonColor(!isRenewEnabled)' dark v-if="ccofRenewStatus === RENEW_STATUS_NEW" @click="renewApplication()">Renew my Funding Agreement</v-btn>
          <v-btn :color='buttonColor(!isRenewEnabled)' dark v-else-if="ccofRenewStatus === RENEW_STATUS_CONTINUE" @click="continueRenewal()">Continue Renewal</v-btn>
          <v-btn :color='buttonColor(!isRenewEnabled)' dark v-else-if="ccofRenewStatus === RENEW_STATUS_ACTION_REQUIRED" @click="actionRequiredOrganizationRoute()">Update your PCF</v-btn>
          <v-btn dark class="blueButton" @click="viewApplication('RENEW')" v-else>View Application</v-btn>
        </template>
      </SmallCard>

      <SmallCard :class="smallCardLayout('OTHERS')" class="col-lg-2" >
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
          <v-btn  @click="goToReportChange()" :color='buttonColor(!isCCOFApproved)' dark>Report a change</v-btn>
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

    <v-card class="rounded-lg elevation-0 pa-4 mt-8" outlined v-if="navBarList?.length > 0">
      <v-row v-if="navBarList?.length > 2" no-gutters>
        <v-col class="col-12 col-md-6 px-4 mt-4">
          <!--TODO: sezarch box only looks at facility name. Update it later to search for status and licence
            Update when data comes in from the API
            Filter by Facility Name, status, or licence: "
            .-->
          <v-text-field
            clearable
            filled
            label="Filter by Facility Name "
            v-model="input"
            :bind="input">
          </v-text-field>
        </v-col>
      </v-row>
      <v-row no-gutters justify="space-around">
        <v-col class="col-12 col-xl-6 pa-4 flex d-flex flex-column"
          v-for="({facilityName, facilityId, ccfriApplicationId, ccfriStatus, eceweStatus, ccfriOptInStatus, eceweOptInStatus, facilityAccountNumber, licenseNumber}) in filteredList" :key="facilityId">
          <v-card class="elevation-4 pa-2 rounded-lg blueBorder flex d-flex flex-column" min-height="230">
            <v-card-text>
              <p class="text-h5 text--primary text-center" v-if="facilityAccountNumber">Facility ID: {{facilityAccountNumber}}</p>
              <p class="text-h5 text--primary text-center" v-if="facilityName">Facility Name: {{facilityName}}</p>
              <p class="text-h5 text--primary text-center" v-if="licenseNumber">Licence Number: {{licenseNumber}}</p>
              <br>
              <p class="blueText">
                Child Care Fee Reduction Initiative (CCFRI) Status:
                <strong v-if="ccfriOptInStatus === 0"> OPTED OUT </strong>
                <strong v-else> {{ccfriStatus}} </strong>
              </p>
              <br>
              <p class="blueText">
                Early Childhood Educator Wage Enhancement (ECE-WE) Status:
                <strong v-if="eceweOptInStatus === 0"> OPTED OUT </strong>
                <strong v-else> {{eceweStatus}} </strong>
              </p>
            </v-card-text>
            <v-row justify="center" no-gutters class="mb-4" v-if="isCCFRIUnlock(ccfriApplicationId) || isNMFUnlock(ccfriApplicationId) || isRFIUnlock(ccfriApplicationId)">
              <v-btn class="blueButton" dark width="80%" align="center" @click="actionRequiredFacilityRoute(ccfriApplicationId)">Update your PCF</v-btn>
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

import { mapGetters, mapState, mapMutations, mapActions} from 'vuex';
import SmallCard from './guiComponents/SmallCard.vue';
import MessagesToolbar from './guiComponents/MessagesToolbar.vue';
import { PATHS } from '@/utils/constants';
import alertMixin from '@/mixins/alertMixin';

export default {
  name: 'LandingPage',
  mixins: [alertMixin],
  data() {
    return {
      input: '',
      PATHS: PATHS,
      results : {},
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
          body: 'Providers with licensed care facilities can apply for a $4 per hour wage enhancement for Early Childhood Educators (ECEs) they employ directly.',
        },
      ],
      CCOFCardTitle : 'Apply for Child Care Operating Funding (CCOF) including:'
    };
  },

  created () {
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

    this.getAllMessagesVuex();
  },
  computed: {
    ...mapGetters('auth', ['userInfo']),
    ...mapGetters('app', ['renewalYearLabel']),
    ...mapState('app', ['navBarList', 'programYearList']),
    ...mapState('organization', ['organizationProviderType', 'organizationId', 'organizationName', 'organizationAccountNumber']),
    ...mapState('application', ['applicationType', 'programYearId', 'ccofApplicationStatus', 'unlockBaseFunding',
      'unlockDeclaration', 'unlockEcewe', 'unlockLicenseUpload', 'unlockSupportingDocuments', 'applicationStatus']),

    filteredList() {
      if (this.input === '' || this.input === ' ' || this.input === null){
        return this.navBarList;
      }
      return this.navBarList.filter((fac) => fac.facilityName.toLowerCase().includes(this.input.toLowerCase()));
    },
    isCCFRIandECEWEComplete() {
      if (!this.navBarList) {
        return false;
      }
      let enabled = true;
      //TODO: uncomment out this code
      // let navBarLength = this.navBarList?.length;
      // for (let i = 0; i < navBarLength; i ++) {
      //   if (this.navBarList[i].eceweStatus === 'NOT STARTED' || this.navBarList[i].ccfriStatus === 'NOT STARTED '
      //     || this.navBarList[i].eceweStatus === 'DRAFT' || this.navBarList[i].ccfriStatus === 'DRAFT'
      //     || this.navBarList[i].eceweStatus === 'ACTION_REQUIRED' || this.navBarList[i].ccfriStatus === 'ACTION_REQUIRED'
      //     || this.navBarList[i].eceweStatus === 'SUBMITTED' || this.navBarList[i].ccfriStatus === 'ACTION_REQUIRED') {
      //     enabled = false;
      //     i = navBarLength;  //Can't break a foreach in javascript, so end the for loop.
      //   }
      // }
      console.log('isCCFRIandECEWEComplete: ', enabled);
      return enabled;
    },
    isWithinRenewDate() {
      let isEnabled = (this.userInfo.serverTime > this.programYearList?.renewal?.intakeStart
        && this.userInfo.serverTime < this.programYearList?.renewal?.intakeEnd);
      console.log('isWithinRenewDate: ', isEnabled);
      return isEnabled;
    },
    isRenewEnabled() {
      if (this.applicationType === 'NEW') {
        if (this.applicationStatus === 'DRAFT') {
          return false;
        } else if (this.applicationStatus === 'SUBMITTED' || this.applicationStatus === 'APPROVED') {
          let isEnabled = this.isCCFRIandECEWEComplete
            && this.isWithinRenewDate
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
        } else if (this.programYearId == this.programYearList.renewal?.previousYearId) {
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
      this.navBarList.forEach((facility) => {
        if (facility.unlockCcfri)
          unlockList.push(facility.ccfriApplicationId);
      });
      return unlockList;
    },
    unlockNMFList() {
      let unlockList = [];
      this.navBarList.forEach((facility) => {
        if (facility.unlockNmf)
          unlockList.push(facility.ccfriApplicationId);
      });
      return unlockList;
    },
    unlockRFIList() {
      let unlockList = [];
      this.navBarList.forEach((facility) => {
        if (facility.unlockRfi)
          unlockList.push(facility.ccfriApplicationId);
      });
      return unlockList;
    },
    isCCOFApproved() {
      return (this.applicationType === 'RENEW') || (this.ccofStatus === this.CCOF_STATUS_APPROVED);
    },
  },
  methods: {
    ...mapState('app',['isRenewal','navBarStatus']),
    ...mapMutations('app', ['setIsRenewal','setNavBarStatus']),
    ...mapActions('message', ['getAllMessages']),
    renewApplication() {
      this.setNavBarStatus('APPLICATION');
      this.setIsRenewal(true);
      this.setNavBarStatus('APPLICATION');
      this.$router.push(PATHS.group.renewOrganization);
    },
    goToReportChange(){
      this.setNavBarStatus('REPORT_CHANGE');
      this.$router.push(PATHS.reportChange);
    },
    continueRenewal() {
      this.setNavBarStatus('APPLICATION');
      this.goToLicenseUpload();
    },
    newApplication() {
      this.setIsRenewal(false);
      this.setNavBarStatus('APPLICATION');
      this.$router.push(PATHS.selectApplicationType);
    },
    continueApplication() {
      this.setIsRenewal(false);
      this.setNavBarStatus('APPLICATION');
      console.log('continueApplication .organizationProviderType', this.organizationProviderType);
      if (this.organizationProviderType === 'GROUP') {
        this.$router.push(PATHS.group.orgInfo);
      } else if (this.organizationProviderType === 'FAMILY') {
        this.$router.push(PATHS.family.orgInfo);
      } else {
        this.setFailureAlert(`Unknown Organization Provider Type: ${this.organizationProviderType}`);
      }
    },
    goToCCOFOrganizationInfo() {
      if (this.organizationProviderType === 'GROUP') {
        this.$router.push(PATHS.group.orgInfo);
      } else if (this.organizationProviderType === 'FAMILY') {
        this.$router.push(PATHS.family.orgInfo);
      }
    },
    goToCCOFFunding() {
      let firstFacilityId = this.navBarList[0]?.facilityId;
      let navBar = this.$store.getters['app/getNavByFacilityId'](firstFacilityId);
      if (navBar?.ccofBaseFundingId) {
        if (this.organizationProviderType === 'GROUP') {
          this.$router.push(PATHS.group.fundAmount + '/' + navBar.ccofBaseFundingId);
        } else if (this.organizationProviderType === 'FAMILY') {
          this.$router.push(PATHS.family.fundAmount + '/' + navBar.ccofBaseFundingId);
        }
      }
    },
    goToLicenseUpload() {
      this.$router.push(PATHS.group.licenseUpload);
    },
    goToCCFRI(ccfriApplicationId) {
      let path = this.isRenewal? PATHS.currentFees : PATHS.addNewFees;
      if (ccfriApplicationId)
        this.$router.push(path + '/' + ccfriApplicationId);
      else
        this.$router.push(path + '/' + this.unlockCCFRIList[0]);
    },
    goToNMF(ccfriApplicationId) {
      if (ccfriApplicationId)
        this.$router.push(PATHS.NMF + '/' + ccfriApplicationId);
      else
        this.$router.push(PATHS.NMF + '/' + this.unlockNMFList[0]);
    },
    goToRFI(ccfriApplicationId) {
      if (ccfriApplicationId)
        this.$router.push(PATHS.ccfriRequestMoreInfo + '/' + ccfriApplicationId);
      else
        this.$router.push(PATHS.ccfriRequestMoreInfo + '/' + this.unlockRFIList[0]);
    },
    goToECEWE() {
      this.$router.push(PATHS.eceweEligibility);
    },
    goToSupportingDocumentUpload() {
      this.$router.push(PATHS.supportingDocumentUpload);
    },
    goToSummaryDeclaration() {
      this.$router.push(PATHS.summaryDeclaration);
    },
    viewApplication(type) {
      this.setNavBarStatus('APPLICATION');
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
    actionRequiredOrganizationRoute() {
      this.setNavBarStatus('APPLICATION');
      if (this.unlockLicenseUpload)
        this.goToLicenseUpload();
      else if (this.unlockBaseFunding && (this.applicationType === 'NEW'))
        this.goToCCOFFunding();
      else if (this.unlockEcewe)
        this.goToECEWE();
      else if (this.unlockSupportingDocuments)
        this.goToSupportingDocumentUpload();
      else if (this.unlockCCFRIList.length > 0 )
        this.goToCCFRI();
      else if (this.unlockNMFList.length > 0 )
        this.goToNMF();
      else if (this.unlockRFIList.length > 0 )
        this.goToRFI();
      else if (this.unlockDeclaration)
        this.goToSummaryDeclaration();
    },
    actionRequiredFacilityRoute(ccfriApplicationId) {
      if (this.isCCFRIUnlock(ccfriApplicationId))
        this.goToCCFRI(ccfriApplicationId);
      else if (this.isNMFUnlock(ccfriApplicationId))
        this.goToNMF(ccfriApplicationId);
      else if (this.isRFIUnlock(ccfriApplicationId))
        this.goToRFI(ccfriApplicationId);
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
    isCCFRIUnlock(ccfriApplicationId) {
      return (this.applicationStatus === 'SUBMITTED' && this.unlockCCFRIList.includes(ccfriApplicationId));
    },
    isNMFUnlock(ccfriApplicationId) {
      return (this.applicationStatus === 'SUBMITTED' && this.unlockNMFList.includes(ccfriApplicationId));
    },
    isRFIUnlock(ccfriApplicationId) {
      return (this.applicationStatus === 'SUBMITTED' && this.unlockRFIList.includes(ccfriApplicationId));
    },
  },

  components: { SmallCard, MessagesToolbar}
};
</script>

<style scoped>
.blueBorder{
  border-top: 5px solid #003366 !important;
}
.blueButton {
  background-color: #003366 !important;
}
.blueText {
  color: rgb(0, 52, 102) !important;
}
</style>
