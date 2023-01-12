<template>
  <v-container fluid class="pa-6">

    <MessagesToolbar></MessagesToolbar>

    <v-row justify="center" no-gutters>
      <div
        class="pa-6 text-h4"
        v-text="'What would you like to do?'" />
    </v-row >

    <v-container fluid>
      <v-row class="" align="stretch" justify="space-around"> 
        <SmallCard :class="smallCardLayout('CCOF')" title="Child Care Operating Funding (CCOF) application" disable v-if="ccofStatus === CCOF_STATUS_APPROVED">
          <template #button>
            <span class="text-h5 text--primary">Status: Approved</span>
          </template>
        </SmallCard>
        <SmallCard :class="smallCardLayout('CCOF')" title="Apply for Child Care Operating Funding (CCOF) including:" :disable="!isCCOFEnabled" v-else>
          <template #content>
            <v-row>
              <v-container v-for="item in ccofInfoText" :key="item.infoTitle" fluid>
                <h4 class="text--primary">
                  {{item.infoTitle}}
                </h4>
                <v-card color="#B3E5FF" class="mt-1" v-if="ccofStatus === CCOF_STATUS_NEW">
                  <v-row align="center" no-gutters class="pa-1">
                    <v-col :cols="12" lg="2" align="center">
                      <v-icon color="black" aria-hidden="false" size="40">
                        mdi-information
                      </v-icon>
                    </v-col>
                    <v-col :cols="12" lg="10" v-html="item.infoText" class="px-2">
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
                <v-btn dark class="dashboardButton" @click="newApplication()">Start Application</v-btn>
              </v-col>             
            </v-row>
            <v-row v-else-if="ccofStatus === CCOF_STATUS_CONTINUE" no-gutters>
              <v-col :cols="12">
                <p class="text-h5 text--primary">Status: Incomplete</p>
              </v-col>             
              <v-col :cols="12" class="pb-2">
                <v-btn dark class="dashboardButton" @click="continueApplication()">Continue Application</v-btn>
              </v-col>             
            </v-row>    
            <v-row v-else-if="ccofStatus === CCOF_STATUS_ACTION_REQUIRED" no-gutters>
              <v-col :cols="12">
                <v-btn dark class="dashboardButton" @click="actionRequiredRoute()">Action Required</v-btn>
              </v-col>                     
            </v-row>
            <v-row v-else no-gutters>
              <v-col :cols="12">
                <span class="text-h5 text--primary">Status: Submitted</span>
              </v-col>                     
            </v-row>
          </template>
        </SmallCard>

        <SmallCard :class="smallCardLayout('RENEW')" :title="`Renew my funding agreement for ${this.futureYearLabel}`" :disable="!isRenewEnabled">
          <template #button>
            <v-btn :color='buttonColor(!isRenewEnabled)' dark v-if="ccofRenewStatus === RENEW_STATUS_NEW" @click="renewApplication()">Renew my funding</v-btn>
            <v-btn :color='buttonColor(!isRenewEnabled)' dark v-else-if="ccofRenewStatus === RENEW_STATUS_CONTINUE" @click="continueRenewal()">Continue Renewal</v-btn>
            <v-btn :color='buttonColor(!isRenewEnabled)' dark v-else-if="ccofRenewStatus === RENEW_STATUS_ACTION_REQUIRED" @click="actionRequiredRoute()">Action Required</v-btn>
            <v-btn :color='buttonColor(!isRenewEnabled)' dark v-else >Complete</v-btn>
          </template>
        </SmallCard>

        <SmallCard :class="smallCardLayout('OTHERS')" title="Make a change to my information, parent fees, or funding agreement" class="col-lg-2" :disable="isCCOFEnabled">
          <template #button>
            <v-btn href="https://www2.gov.bc.ca/gov/content/family-social-supports/caring-for-young-children/running-daycare-preschool/child-care-operating-funding" dark :color='buttonColor(isCCOFEnabled)'>Make a change</v-btn>
          </template>
        </SmallCard>

        <SmallCard :class="smallCardLayout('OTHERS')" title="Submit Enrolment Reports or monthly ECE-WE reports to receive payment" :disable="isCCOFEnabled">
          <template #button>
            <v-btn :color='buttonColor(isCCOFEnabled)' dark>Submit reports</v-btn>
          </template>
        </SmallCard>
      </v-row>

      <br>

    <v-card class="rounded-lg elevation-0 pa-6 mt-1" outlined>
      <v-row v-if="navBarList?.length > 2">
        <v-col class="col-12 col-md-6 px-6">
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
          v-for="({facilityName, facilityId, ccfriStatus, eceweStatus, ccfriOptInStatus, eceweOptInStatus}) in filteredList" :key="facilityId">
          <v-card class="elevation-4 pa-4 rounded-lg blueBorder flex d-flex flex-column" min-height="230">
            <v-card-text>
              <!-- <p class="text-h5 text--primary">
                Facility {{index +1}}
              </p> -->
              <p class="text-h5 text--primary">
                Facility Name:  {{facilityName}}
              </p>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
                sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, 
                quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
              </p>
              <br>
              <p class="text--primary">
                Child Care Fee Reduction Initiative (CCFRI) Status:
                <strong v-if="ccfriOptInStatus === 0"> OPTED OUT </strong> 
                <strong v-else> {{ccfriStatus}} </strong> 
              </p>
              <br>
              <p class="text--primary">
                Early Childhood Educator Wage Enhancement (ECE-WE) Status: 
                <strong v-if="eceweOptInStatus === 0"> OPTED OUT </strong> 
                <strong v-else> {{eceweStatus}} </strong>
              </p>
            </v-card-text>
            <v-col align="center" v-if="ccfriOptInStatus === 0 || eceweOptInStatus === 0">
              <v-btn class="optinButton text-truncate my-4" dark v-if="ccfriOptInStatus === 0" @click="goToCCFRI()">
                <span class="text-wrap">
                  OPT IN
                  <br/>
                  Child Care Fee Reduction Initiative (CCFRI)
                </span>
              </v-btn>          
              <v-btn class="optinButton text-truncate my-4" dark v-if="eceweOptInStatus === 0" @click="goToECEWE()">
                <span class="text-wrap">
                  OPT IN
                  <br/>
                  Early Childhood Educator Wage Enhancement (ECE-WE)
                </span>
              </v-btn>
            </v-col>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
  
  </v-container>
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
      ccofInfoText: [
        {
          infoTitle: 'CCOF Base Funding',
          infoText: '<p>Child Care Operating Funding (CCOF) Base Funding assists eligible licensed family and group child care providers with the day-to-day costs of running a facility.</p><strong> CCOF Base Funding is a prerequisite to participate in CCFRI and ECE-WE.</strong>',
        },
        {
          infoTitle: 'Child Care Fee Reduction Initiative (CCFRI) Funding',
          infoText: 'CCFRI offers funding to eligible, licensed child care providers to reduce and stabilize parents’ monthly child care fees.',
        },
        {
          infoTitle: 'Early Childhood Educator Wage Enhancement (ECE-WE) Funding',
          infoText: 'Providers with licensed care facilities can apply for a $4 per hour wage enhancement for Early Childhood Educators (ECEs) they employ directly.',
        },
      ]
    };
  },

  created () {
    //Used for constants
    // this.CCOF_STATUS_COMPLETE = 'Completed';
    // this.CCOF_STATUS_NEW = 'Start Application';
    // this.CCOF_STATUS_CONTINUE = 'Continue Application';
    this.CCOF_STATUS_COMPLETE = 'COMPLETE';
    this.CCOF_STATUS_NEW = 'NEW';
    this.CCOF_STATUS_CONTINUE = 'CONTINUE';
    this.CCOF_STATUS_APPROVED = 'APPROVED';
    this.CCOF_STATUS_ACTION_REQUIRED = 'ACTION_REQUIRED';

    this.RENEW_STATUS_NEW = 'NEW';
    this.RENEW_STATUS_COMPLETE = 'COMPLETE';
    this.RENEW_STATUS_CONTINUE = 'CONTINUE';
    this.RENEW_STATUS_ACTION_REQUIRED = 'ACTION_REQUIRED';

    this.getAllMessagesVuex();
  },  
  computed: {
    ...mapGetters('auth', ['userInfo']),
    ...mapGetters('app', ['futureYearLabel']),
    ...mapState('app', ['navBarList', 'programYearList']),
    ...mapState('organization', ['organizationProviderType', 'organizationId', 'applicationStatus']),
    ...mapState('application', ['applicationType', 'programYearId', 'unlockBaseFunding', 
      'unlockDeclaration', 'unlockEcewe', 'unlockLicenseUpload', 'unlockSupportingDocuments']),
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
      if (this.applicationType === 'RENEW') {
        if (this.applicationStatus === 'DRAFT') {
          console.log('isRenewEnabled1: ', true);
          return true;
        } else if (this.applicationStatus === 'SUBMITTED') {
          let isEnabled = (this.isCCFRIandECEWEComplete && this.isWithinRenewDate 
          && this.programYearId == this.programYearList?.current?.programYearId) || this.isApplicationUnlock;
          console.log('isRenewEnabled2: ', isEnabled);
          return isEnabled;
        }
      } else if (this.applicationType === 'NEW') {
        if (this.applicationStatus === 'DRAFT') {
          console.log('isRenewEnabled3: ', false);
          return false;
        } else if (this.applicationStatus === 'SUBMITTED') {
          let isEnabled = (this.isCCFRIandECEWEComplete
            && this.isWithinRenewDate
            && this.programYearId == this.programYearList?.current?.programYearId
            && this.isApplicationUnlock);
          console.log('isRenewEnabled4: ', isEnabled);
          return isEnabled;
        }
      }
      return false;
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
          return this.isApplicationUnlock ? this.CCOF_STATUS_ACTION_REQUIRED : this.CCOF_STATUS_COMPLETE;
          // return this.CCOF_STATUS_SUBMITTED;
        case 'APPROVED':
          return this.CCOF_STATUS_APPROVED;
        default:
          return this.CCOF_STATUS_NEW;
        }
      } else {
        return this.CCOF_STATUS_APPROVED;
      }
    },
    isApplicationUnlock() {
      return (this.unlockBaseFunding || this.unlockDeclaration || this.unlockEcewe || this.unlockLicenseUpload || this.unlockSupportingDocuments);
    },
    ccofRenewStatus() {
      if (this.applicationType === 'RENEW') {
        console.log(this.applicationStatus);
        if (this.applicationStatus === 'DRAFT') {
          return this.RENEW_STATUS_CONTINUE;
        } else if (this.programYearId == this.programYearList.current?.programYearId) {
          return this.RENEW_STATUS_NEW;
        } else if (this.isApplicationUnlock) {
          return this.RENEW_STATUS_ACTION_REQUIRED;
        } else {
          return this.RENEW_STATUS_COMPLETE;
        }
      } else {
        return this.RENEW_STATUS_NEW;
      }
    },
    isCCOFEnabled() {
      if ((this.applicationType === 'NEW') && (this.ccofStatus != this.CCOF_STATUS_COMPLETE && this.ccofStatus != this.CCOF_STATUS_APPROVED)) {
        return true;
      }
      return false;
    }
  },
  methods: {
    ...mapMutations('app', ['setIsRenewal']),
    ...mapActions('message', ['getAllMessages']),
    clicked (){
      console.log('clicked');
      return '';
    },
    renewApplication() {
      this.setIsRenewal(true);
      this.$router.push(PATHS.group.renewOrganization);
    },
    continueRenewal() {
      this.$router.push(PATHS.group.licenseUpload);
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
    goToRFI(){
      this.$router.push(PATHS.ccfriRequestMoreInfo + '/' + '2dd4af36-9688-ed11-81ac-000d3a09ce90');
    },
    goToLicenseUpload() {
      this.$router.push(PATHS.group.licenseUpload);
    },
    goToCCFRI() {
      this.$router.push(PATHS.ccfriHome); 
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
    async getAllMessagesVuex() {
      try {
        await this.getAllMessages(this.organizationId);
      } catch (error) {
        console.info(error);
      }
    },
    actionRequiredRoute() {
      if (this.unlockLicenseUpload) 
        this.goToLicenseUpload();
      else if (this.unlockBaseFunding) 
        this.goToCCFRI();
      else if (this.unlockEcewe) 
        this.goToECEWE();
      else if (this.unlockSupportingDocuments)
        this.goToSupportingDocumentUpload();
      else if (this.unlockDeclaration)
        this.goToSummaryDeclaration();
    },
    buttonColor(isDisabled) {
      return isDisabled ? '#909090' : '#003366';
    },
    smallCardLayout(card) {
      if (this.ccofStatus === this.CCOF_STATUS_NEW) {
        switch (card) {
        case 'CCOF':
          return 'col-lg-6 col-xl-5';
        case 'RENEW':
          return 'col-lg-2 col-xl-3';
        default:
          return 'col-lg-2';
        }
      }
      return 'col-lg-3';
    },   
  },
  
  components: { SmallCard, MessagesToolbar}
};
</script>

<style scoped>

.blueBorder{
  border-top: 5px solid #003366 !important;
}
.dashboardButton {
  background-color: #003366 !important;
}
.optinButton {
  background-color: #003366 !important;
  min-height: 60px;
  width: 80%;
}
</style>
