<template>
  <v-container fluid class="pa-12">

    <MessagesToolbar></MessagesToolbar>

    <v-row justify="center" no-gutters>
      <div
        class="pb-12 text-h4 text-center"
        v-text="'What would you like to do?'" />
    </v-row >

    <v-row class="" align="stretch" justify="space-around"> 
      <SmallCard :class="smallCardLayout('CCOF')" :title="CCOFCardTitle">
        <template #content>
          <v-row v-if="!isCCOFApproved()">
            <v-container v-for="item in ccofNewApplicationText" :key="item.infoTitle" fluid>
              <h4 class="text--primary">
                {{item.title}}
              </h4>
              <v-card color="#B3E5FF" class="mt-1 py-2" v-if="ccofStatus === CCOF_STATUS_NEW">
                <v-row align="center" no-gutters class="pa-1">
                  <v-col :cols="12" lg="1" align="center">
                    <v-icon color="black" aria-hidden="false" size="40">
                      mdi-information
                    </v-icon>
                  </v-col>
                  <v-col :cols="12" lg="11" v-html="item.body" class="pa-2">
                  </v-col>
                </v-row>
              </v-card>
            </v-container>
          </v-row>
        </template>
        <template #button>
          <v-row v-if="ccofStatus === CCOF_STATUS_NEW" no-gutters>
            <v-col :cols="12">
              <p>
                For more information, visit the government website:
                <a href="https://www2.gov.bc.ca/gov/content/family-social-supports/caring-for-young-children/running-daycare-preschool/child-care-operating-funding">gov.bc.ca/childcareoperatingfunding</a>
              </p>
            </v-col>
            <v-col :cols="12">
              <v-btn dark class="blueButton" @click="newApplication()">Start Application</v-btn>
            </v-col>             
          </v-row>
          <v-row v-else-if="ccofStatus === CCOF_STATUS_CONTINUE" no-gutters>
            <v-col :cols="12">
              <p class="text-h5">Status: Incomplete</p>
            </v-col>             
            <v-col :cols="12" class="pb-2">
              <v-btn dark class="blueButton" @click="continueApplication()">Continue Application</v-btn>
            </v-col>             
          </v-row>    
          <v-row v-else-if="ccofStatus === CCOF_STATUS_ACTION_REQUIRED" no-gutters>
            <v-col :cols="12">
              <v-btn dark class="blueButton" @click="actionRequiredOrganizationRoute()">Update your PCF</v-btn>
            </v-col>                     
          </v-row>
          <v-row v-else-if="isCCOFApproved()" no-gutters>
            <v-col :cols="12">
              <span class="text-h5 blueText">Status: Approved</span>
            </v-col>
            <v-col :cols="12">
              <v-btn dark class="blueButton mt-4" @click="viewApplication('NEW')" v-if="!isRenewEnabled">View Application</v-btn>
            </v-col> 
          </v-row>
          <v-row v-else no-gutters>
            <v-col :cols="12">
              <span class="text-h5 blueText">Status: Submitted</span>
            </v-col>
            <v-col :cols="12">
              <v-btn dark class="blueButton mt-4" @click="viewApplication('NEW')">View Application</v-btn>
            </v-col>                     
          </v-row>
        </template>
      </SmallCard>

      <SmallCard :class="smallCardLayout('RENEW')" :title="`Renew my funding agreement for ${this.futureYearLabel}`" :disable="!isRenewEnabled">
        <template #button>
          <v-btn :color='buttonColor(!isRenewEnabled)' dark v-if="ccofRenewStatus === RENEW_STATUS_NEW" @click="renewApplication()">Renew my funding</v-btn>
          <v-btn :color='buttonColor(!isRenewEnabled)' dark v-else-if="ccofRenewStatus === RENEW_STATUS_CONTINUE" @click="continueRenewal()">Continue Renewal</v-btn>
          <v-btn :color='buttonColor(!isRenewEnabled)' dark v-else-if="ccofRenewStatus === RENEW_STATUS_ACTION_REQUIRED" @click="actionRequiredOrganizationRoute()">Update your PCF</v-btn>
          <v-row v-else-if="ccofRenewStatus === RENEW_STATUS_APPROVED" no-gutters>
            <v-col :cols="12">
              <span class="text-h5 blueText">Status: Approved</span>
            </v-col>
            <v-col :cols="12">
              <v-btn dark class="blueButton mt-4" @click="viewApplication('RENEW')">View Application</v-btn>
            </v-col>                     
          </v-row>
          <v-row v-else no-gutters>
            <v-col :cols="12">
              <span class="text-h5 blueText">Status: Submitted</span>
            </v-col>
            <v-col :cols="12">
              <v-btn dark class="blueButton mt-4" @click="viewApplication('RENEW')">View Application</v-btn>
            </v-col>                     
          </v-row>
        </template>
      </SmallCard>

      <SmallCard :class="smallCardLayout('OTHERS')" title="Make a change to my information, parent fees, or funding agreement" class="col-lg-2" :disable="!isCCOFApproved()">
        <template #button>
          <v-btn href="https://www2.gov.bc.ca/gov/content/family-social-supports/caring-for-young-children/running-daycare-preschool/child-care-operating-funding/report-changes" :color='buttonColor(!isCCOFApproved())' dark>Report Changes</v-btn>
        </template>
      </SmallCard>

      <SmallCard :class="smallCardLayout('SUBMIT_REPORTS')" title="Submit Enrolment Reports or monthly ECE-WE reports to receive payment" :disable="!isCCOFApproved()">
        <template #button>
          <v-btn href="https://childcareinfo.gov.bc.ca/childcare/welcome_ccof.aspx" :color='buttonColor(!isCCOFApproved())' dark>Submit Monthly Reports</v-btn>
        </template>
      </SmallCard>
    </v-row>

    <v-card class="elevation-4 rounded-lg pa-1 mt-8 greyBorder" disabled v-if="navBarList?.length === 0">
      <v-card-text>
        <p class="text-h5 text--primary">
          G-XXXXX-YYYYY Facility Name ABCDE-123456
        </p>
        <p>
          Details of your facility will appear here once we have received your application.
        </p>
      </v-card-text>
    </v-card>
    <v-card class="rounded-lg elevation-0 pa-4 mt-8" outlined v-else-if="navBarList?.length > 0">
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
              <p>
                <span class="text-h5 text--primary" v-if="facilityAccountNumber">Facility ID: {{facilityAccountNumber}}, </span>
                <span class="text-h5 text--primary" v-if="facilityName">Facility Name: {{facilityName}}, </span>
                <span class="text-h5 text--primary" v-if="licenseNumber">Licence Number: {{licenseNumber}}</span>
              </p>
              <!-- <p class="text-h5 text--primary">
                Facility Name:  {{facilityName}}
              </p> -->
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
                sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, 
                quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
              </p>
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
          body: '<p>Child Care Operating Funding (CCOF) Base Funding assists eligible licensed family and group child care providers with the day-to-day costs of running a facility.</p><strong> CCOF Base Funding is a prerequisite to participate in CCFRI and ECE-WE.</strong>',
        },
        {
          title: 'Child Care Fee Reduction Initiative (CCFRI) Funding',
          body: 'CCFRI offers funding to eligible, licensed child care providers to reduce and stabilize parents’ monthly child care fees.',
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
    ...mapGetters('app', ['futureYearLabel']),
    ...mapState('app', ['navBarList', 'programYearList']),
    ...mapState('organization', ['organizationProviderType', 'organizationId']),
    ...mapState('application', ['applicationType', 'programYearId', 'ccofApplicationStatus', 'unlockBaseFunding', 
      'unlockDeclaration', 'unlockEcewe', 'unlockLicenseUpload', 'unlockSupportingDocuments', 'applicationStatus']),
    filteredList() {
      if (this.input === '' || this.input === ' ' || this.input === null){
        return this.navBarList;
      }
      return this.navBarList.filter((fac) => fac.facilityName.toLowerCase().includes(this.input.toLowerCase()));
    },
    getApplicationStatus(){
      return this.applicationStatus === null;
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
      let isEnabled = (this.userInfo.serverTime > this.programYearList?.future?.intakeStart 
        && this.userInfo.serverTime < this.programYearList?.future?.intakeEnd);
      console.log('isWithinRenewDate: ', isEnabled);
      return isEnabled;
    },
    isRenewEnabled() {
      // if (this.applicationType === 'RENEW') {
      //   if (this.applicationStatus === 'DRAFT') {
      //     console.log('isRenewEnabled1: ', true);
      //     return true;
      //   } else if (this.applicationStatus === 'SUBMITTED') {
      //     let isEnabled = (this.isCCFRIandECEWEComplete && this.isWithinRenewDate 
      //     && this.programYearId == this.programYearList?.current?.programYearId) || this.isOrganizationUnlock;
      //     console.log('isRenewEnabled2: ', isEnabled);
      //     return isEnabled;
      //   }
      // } else 
      if (this.applicationType === 'NEW') {
        if (this.applicationStatus === 'DRAFT') {
          console.log('isRenewEnabled3: ', false);
          return false;
        } else if (this.applicationStatus === 'SUBMITTED' || this.applicationStatus === 'APPROVED') {
          let isEnabled = (this.isCCFRIandECEWEComplete
            && this.isWithinRenewDate
            && this.programYearId == this.programYearList?.current?.programYearId)
            || this.isOrganizationUnlock;
          console.log('isRenewEnabled4: ', isEnabled);
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
        } else if (this.programYearId == this.programYearList.current?.programYearId) {
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
  },
  methods: {
    ...mapMutations('app', ['setIsRenewal']),
    ...mapActions('message', ['getAllMessages']),
    renewApplication() {
      this.setIsRenewal(true);
      this.$router.push(PATHS.group.renewOrganization);
    },
    continueRenewal() {
      this.goToLicenseUpload();
    },
    newApplication() {
      this.setIsRenewal(false);
      this.$router.push(PATHS.selectApplicationType);
    },
    continueApplication() {
      this.setIsRenewal(false);
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
      if (this.unlockLicenseUpload) 
        this.goToLicenseUpload();
      else if (this.unlockBaseFunding && (this.applicationType === 'NEW')) 
        this.goToCCOFOrganizationInfo();
      else if (this.unlockEcewe) 
        this.goToECEWE();
      else if (this.unlockSupportingDocuments)
        this.goToSupportingDocumentUpload();
      else if (this.unlockDeclaration)
        this.goToSummaryDeclaration();
      // TO-DO: Update with the correct route for CCFRI/RFI/NMF
      else if (this.unlockCCFRIList.length > 0 )
        this.goToCCFRI();
      else if (this.unlockNMFList.length > 0 )
        this.goToNMF();
      else if (this.unlockRFIList.length > 0 )
        this.goToRFI();
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
          return 'col-lg-2 col-xl-3';
        case 'SUBMIT_REPORTS':
          return 'col-lg-3 col-xl-2';
        default:
          return 'col-lg-2';
        }
      }
      return 'col-lg-3';
    },
    isCCOFApproved() {
      if ((this.applicationType === 'RENEW') || (this.ccofStatus === this.CCOF_STATUS_APPROVED)) {
        this.CCOFCardTitle = 'Child Care Operating Funding (CCOF) application';
        return true;
      }
      return false;
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
.greyBorder {
  min-height: 230px;
  border-top: 5px solid #909090 !important;
}
.blueButton {
  background-color: #003366 !important;
}
.blueText {
  color: rgb(0, 52, 102) !important;
}
</style>
