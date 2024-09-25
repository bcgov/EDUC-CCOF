<template>
  <v-container>
    <v-row  justify="space-around">
      <div class="pa-10 text-h4 text-center">Welcome to CCOF!</div>
    </v-row>
    <v-row>
      <span class="text-h4">Instructions:</span>
      <br><br><br>
      <p class="px-10 text-h6">
        Under the Child Care Operating Funding (CCOF) Agreement, section 4.1 f and g, you must submit a request to increase parent fees after approval for the Child Care Fee Reduction Initiative (CCFRI). Use this form to submit any request to increase your parent fees in the 2023/24 Fiscal Year.
        To complete this form, you will need the following:
        <br><br>
        <ul>
          <li>
            A proposed Parent Fee Schedule; and
          </li>
          <li>
            if the increase you are requesting is above the Fee Increase Limit for your <a href="https://www2.gov.bc.ca/assets/gov/family-and-social-supports/child-care/child-care-operating-funding/ccfri_funding_guidelines_23_24.pdf"> Service Delivery Area </a>, you are required to complete a Request for Information and will be required to submit supporting documentation..
          </li>
        </ul>
        </p>

        <p class="px-15 text-h6">* The facilities that are not opted in to CCFRI cannot be selected </p>
    </v-row>
    <v-row justify="space-around">
      <v-col cols="6">

      </v-col>
    </v-row>

    <NavButton :isNextDisplayed="true" :isSaveDisplayed="false"
         :isNextDisabled="false" :isProcessing="loading"
        @previous="previous()" @next="next()"  @save="true"></NavButton>
  </v-container>
</template>

<script>
import { PATHS, changeUrlGuid, changeUrl, CHANGE_TYPES, CHANGE_REQUEST_EXTERNAL_STATUS } from '../../utils/constants.js';
import alertMixin from '../../mixins/alertMixin.js';
//import SmallCard from '../guiComponents/SmallCard.vue';

import { mapActions, mapState, mapMutations } from 'vuex';
import NavButton from '../../components/util/NavButton.vue';

export default {
  components: {NavButton},
  mixins: [alertMixin],
  data() {
    return {
      isValidForm: false,
      newReq: undefined,
      processing: false,
      loading: false,
      rules: [
        (v) => !!v || 'Required.',
      ],
    };
  },
  async beforeMount() {
    this.loading = true;
    if (this.changeRequestStore?.length === 0) {
      await this.getChangeRequestList();
    }
    this.loading = false;
  },
  computed: {
    ...mapState('application', ['programYearId', 'applicationId']),
    ...mapState('organization', ['organizationId', 'organizationName', 'organizationProviderType']),
    ...mapState('navBar', ['userProfileList']),
    ...mapState('reportChanges', ['changeActionId','mtfiFacilities','changeRequestStore']),
  },
  methods: {
    ...mapActions('reportChanges', ['createChangeRequest', 'createChangeRequestMTFI', 'getChangeRequest', 'getChangeRequestList']),
    ...mapMutations('reportChanges', ['setMTFIFacilities']),
    ...mapMutations('navBar', ['forceNavBarRefresh', 'refreshNavBarList']),
    ...mapActions('navBar', ['reloadChangeRequest']),
    previous() {
      this.$router.push(PATHS.ROOT.CHANGE_LANDING);
    },
    async next() {
      this.loading = true;

      const activeMTFIChangeRequest = this.getActiveMTFIChangeRequest();
      if (!activeMTFIChangeRequest){
        this.newReq = await this.createChangeRequest('PARENT_FEE_CHANGE');
        this.$route.params.changeRecGuid = this.newReq.changeRequestId;
      } else {
        this.$route.params.changeRecGuid = activeMTFIChangeRequest?.changeRequestId;
        await this.reloadChangeRequest(activeMTFIChangeRequest?.changeRequestId);
      }

      //below code i think can be removed as now only new CR sees this page?
      if(this.organizationProviderType == 'FAMILY'){ // && mtfi does not exist yet?

        if (this.mtfiFacilities?.length == 0){
          await this.save();
        }
        this.$router.push(changeUrlGuid(PATHS.MTFI_GROUP_FEE_VERIFICATION, this.$route.params.changeRecGuid, this.mtfiFacilities[0]?.ccfriApplicationId, CHANGE_TYPES.MTFI));
      }
      else{
        this.$router.push(changeUrl(PATHS.MTFI_GROUP_SELECT_FACILITY, this.$route.params.changeRecGuid, CHANGE_TYPES.MTFI));
      }
    },
    //we only need to save a MTFI change rec on this page for family org. We do this so we can skip the facility selection page.
    async save (){
      try{
        await this.createChangeRequestMTFI([
          {
            'facilityID': this.userProfileList[0].facilityId,
            'applicationID': this.applicationId,
            'changeActionId': this.newReq?.changeActionId ? this.newReq.changeActionId : this.changeActionId,
            'optInResponse': 1,
            'programYearId': this.programYearId,
            'organizationId': this.organizationId
          }
        ]);
        await this.reloadChangeRequest(this.$route.params.changeRecGuid);
      }
      catch (error)  {
        console.log(error);
        this.setFailureAlert('An error occurred while saving. Please try again later.');
      }
    },
    getActiveMTFIChangeRequest() {
      return this.changeRequestStore?.find(item => {
        const isSameApplication = (item.applicationId === this.applicationId);
        const isMTFIChangeRequest = (item.changeActions?.findIndex(changeAction => changeAction.changeType === 'PARENT_FEE_CHANGE') > -1);
        const isActive = [CHANGE_REQUEST_EXTERNAL_STATUS.IN_PROGRESS, CHANGE_REQUEST_EXTERNAL_STATUS.SUBMITTED, CHANGE_REQUEST_EXTERNAL_STATUS.ACTION_REQUIRED].includes(item.externalStatus);
        return (isSameApplication && isMTFIChangeRequest && isActive);
      });
    }
  },
};

</script>

