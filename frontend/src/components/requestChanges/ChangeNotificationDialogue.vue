<template>
  <v-container fluid>
    <v-form ref="form">
      <v-row class="d-flex justify-center">
        <span class="text-h4">Child Care Operating Funding Program  - {{ formattedProgramYear }}</span>
      </v-row>
      <v-row class="d-flex justify-center">
        <h2>Funding Agreement Change Notification</h2>
      </v-row>
      <v-row class="d-flex justify-center text-h5" style="color:#003466;">
        {{ this.userInfo.organizationName }}
      </v-row>
      <GroupChangeDialogueContent v-if="organizationProviderType === 'GROUP'"></GroupChangeDialogueContent>
      <FamilyChangeDialogueContent v-else></FamilyChangeDialogueContent>
      <v-row class="d-flex justify-center">
        <p>For more information about reporting changes, <a href='https://www2.gov.bc.ca/gov/content/family-social-supports/caring-for-young-children/childcarebc-programs/child-care-operating-funding/report-changes '>visit the Child Care Operating Funding Website</a>.</p>
      </v-row>
      <NavButton :isProcessing="processing" :isNextDisplayed="true" class="mt-10" @previous="previous" @next="next">
      </NavButton>
    </v-form>
  </v-container>
</template>

<script>
import { mapGetters, mapActions, mapState, mapMutations } from 'vuex';
import { PATHS, CHANGE_TYPES, changeUrlGuid } from '@/utils/constants';
import NavButton from '@/components/util/NavButton';
import { ORGANIZATION_PROVIDER_TYPES } from '@/utils/constants';
import alertMixin from '@/mixins/alertMixin';
import GroupChangeDialogueContent from '@/components/requestChanges/GroupChangeDialogueContent';
import FamilyChangeDialogueContent from '@/components/requestChanges/FamilyChangeDialogueContent';

export default {
  name: 'ChangeNotificationDialogue',
  components: { NavButton, GroupChangeDialogueContent, FamilyChangeDialogueContent },
  mixins: [alertMixin],
  data() {
    return {
      isGroup: true,
      processing: false,
      providerType: ORGANIZATION_PROVIDER_TYPES.GROUP
    };
  },
  computed: {
    ...mapGetters('auth', ['userInfo', 'isMinistryUser']),
    ...mapState('organization', ['organizationProviderType']),
    ...mapState('application', ['formattedProgramYear']),

  },
  methods: {
    ...mapActions('reportChanges', ['createChangeRequest']),
    ...mapMutations('reportChanges', ['setChangeRequestId', 'setChangeActionId']),
    previous() {
      this.$router.push(PATHS.ROOT.CHANGE_LANDING);
    },
    async createNewChangeRequest(changeType) {

      let newReq;
      try {
        newReq = await this.createChangeRequest(changeType);
      }
      catch (error) {
        console.log('unable to create a new Req');
        this.setFailureAlert('An error occurred while creating a new change request. Please try again later.');
      }
      return newReq;
    },
    async next(changeActionId = null, changeRequestId = null) {

      this.processing = true;

      //create the change action first, then push it
      if (!changeActionId) {
        let newReq = await this.createNewChangeRequest('PDF_CHANGE');
        this.$router.push(changeUrlGuid(PATHS.CHANGE_NOTIFICATION_FORM, newReq?.changeRequestId, newReq?.changeActionId, CHANGE_TYPES.CHANGE_NOTIFICATION));
      }
      else {
        this.setChangeRequestId(changeRequestId);
        this.setChangeActionId(changeActionId);
        this.$router.push(changeUrlGuid(PATHS.CHANGE_NOTIFICATION_FORM, changeRequestId, changeActionId, CHANGE_TYPES.CHANGE_NOTIFICATION));
      }

    }
  }
};
</script>
