<template>
  <v-container fluid style="padding:0">

    <MessagesToolbar></MessagesToolbar>

    <v-row justify="center">
      <div
        class="pa-10"
        :class="'text-h4'"
        v-text="'What would you like to do?'" />
        <v-btn
        @click="goToCCFRI()">
        CCFRI 
        </v-btn>
        <v-btn
        @click="goToRFI()">
        GO TO RFI
        </v-btn>
        
    </v-row >
    
     <!-- Application Approved screens starts here -->
    <v-container 
    class="px-10"
    >
      <v-row class="" align="stretch" justify="space-around" > 
        <!-- TODO: FIX THIS: Now that the buttons are aligning nice to the bottom of card, they sometimes overflow when shrinking the screensize.-->
          <SmallCard title="Apply for Child Care Operating Funding (CCOF)" :disable="(ccofStatus === CCOF_STATUS_COMPLETE)">
              <br><br>
              <v-btn absolute bottom  class="" dark color='#003366' v-if="ccofStatus === CCOF_STATUS_NEW" @click="newApplication()">Start Application</v-btn>
              <v-btn absolute bottom class="" dark color='#003366' v-else-if="ccofStatus === CCOF_STATUS_CONTINUE" @click="continueApplication()">Continue Application</v-btn>
              <v-btn absolute bottom class="" dark color='#003366' v-else >Complete</v-btn>
          </SmallCard>
          <SmallCard :title="`Renew my funding agreement for ${this.futureYearLabel}`" :disable="!isRenewEnabled">
              <br>
              <v-btn absolute bottom  class="" dark color='#003366' v-if="ccofRenewStatus === RENEW_STATUS_NEW" @click="renewApplication()">Renew my funding</v-btn>
              <v-btn absolute bottom class="" dark color='#003366' v-else-if="ccofRenewStatus === RENEW_STATUS_CONTINUE" @click="continueRenewal()">Continue Renewal</v-btn>
              <v-btn absolute bottom class="" dark color='#003366' v-else >Complete</v-btn>

          </SmallCard>
          <!-- <SmallCard  title="Make a change to my information, parent fees, or funding agreement" :disable=getApplicationStatus>
            <br>
            <v-btn  absolute bottom  class="" dark color='#003366'>Make a change</v-btn>
          </SmallCard> -->
          <SmallCard title="Submit Enrolment Reports or monthly ECE-WE reports to receive payment" :disable="ccofStatus != CCOF_STATUS_COMPLETE">
              <br>
              <v-btn absolute bottom class="" dark color='#003366'>Submit reports</v-btn>
          </SmallCard>
      </v-row>

      <br><br>
      <v-divider>
      </v-divider>
      <br><br>
        <v-row v-if="navBarList?.length > 2">
        <v-col class="col-12 col-md-6 ml-xl-3">
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

      <v-row>
        <v-card elevation="6" class="pa-4 mx-auto my-10 rounded-lg col-12 col-xl-5 blueBorder"
          min-height="230"
          rounded
          tiled
          exact tile
          :ripple="false"
          v-for="({facilityName, facilityId, ccfriStatus, eceweStatus}  ) in filteredList" :key="facilityId"
          
          >
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
              <br>
              <p class="text--primary">Child Care Fee Reduction Initiative (CCFRI) Status: <strong>{{ccfriStatus}} </strong> </p><br>
              <p class="text--primary">Early Childhood Educator Wage Enhancement (ECE-WE) Status: <strong>{{eceweStatus}} </strong></p>
            </v-card-text>
        </v-card>
      </v-row>
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
      results : {}
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

    this.RENEW_STATUS_NEW = 'NEW';
    this.RENEW_STATUS_COMPLETE = 'COMPLETE';
    this.RENEW_STATUS_CONTINUE = 'CONTINUE';

    this.getAllMessagesVuex();
  },  
  computed: {
    ...mapGetters('auth', ['userInfo']),
    ...mapGetters('app', ['futureYearLabel', 'programYearList']),
    ...mapState('app', ['navBarList', 'programYearList']),
    ...mapState('organization', ['applicationType', 'applicationStatus', 'organizationProviderType']),
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
      let navBarLength = this.navBarList?.length;
      for (let i = 0; i < navBarLength; i ++) {
        if (this.navBarList[i].eceweStatus === 'NOT STARTED' || this.navBarList[i].ccfriStatus === 'NOT STARTED '
          || this.navBarList[i].eceweStatus === 'DRAFT' || this.navBarList[i].ccfriStatus === 'DRAFT'
          || this.navBarList[i].eceweStatus === 'ACTION_REQUIRED' || this.navBarList[i].ccfriStatus === 'ACTION_REQUIRED'
          || this.navBarList[i].eceweStatus === 'SUBMITTED' || this.navBarList[i].ccfriStatus === 'ACTION_REQUIRED') {
          enabled = false; 
          i = navBarLength;  //Can't break a foreach in javascript, so end the for loop.
        }
      }
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
          let isEnabled = (this.isCCFRIandECEWEComplete
            && this.isWithinRenewDate
            && this.userInfo.ccofProgramYearId == this.programYearList?.current?.programYearId);
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
          && this.userInfo.ccofProgramYearId == this.programYearList?.current?.programYearId);
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
        if (this.applicationStatus === 'DRAFT') {
          return this.CCOF_STATUS_CONTINUE;
        } else if (this.applicationStatus === 'SUBMITTED') {
          return this.CCOF_STATUS_COMPLETE;
        }else {
          return this.CCOF_STATUS_NEW;
        }
      } else {
        return this.CCOF_STATUS_COMPLETE;
      }
    },
    ccofRenewStatus() {
      if (this.applicationType === 'RENEW') {
        if (this.applicationStatus === 'DRAFT') {
          return this.RENEW_STATUS_CONTINUE;
        } else {
          return this.RENEW_STATUS_COMPLETE;
        }
      } else {
        return this.RENEW_STATUS_NEW;
      }
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
    } ,
    goToRFI(){
      this.$router.push(PATHS.ccfriRequestMoreInfo);
    },
    goToCCFRI() {
      this.$router.push(PATHS.ccfriHome); 
    },   
    async getAllMessagesVuex() {
      try {
        const organizationId = this.userInfo.organizationId;
        await this.getAllMessages(organizationId);
      } catch (error) {
        console.info(error);
      }
    },
  },
  ccofStatusLabel() {
    if (this.applicationType === 'RENEW') {
      return 'Compelete';
    }
  },
    
  components: { SmallCard, MessagesToolbar}
};
</script>

<style scoped>

.blueBorder{
  border-top: 5px solid #003366 !important;
}

  
</style>
