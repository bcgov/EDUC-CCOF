<template>
  <v-container fluid>
    <v-form ref="form">
      <v-row class="d-flex justify-center">
        <span class="text-h4">Child Care Operating Funding Program - {{ formattedProgramYear }}</span>
      </v-row>
      <v-row class="d-flex justify-center">
        <h2>Funding Agreement Change Notification</h2>
      </v-row>
      <v-row
        class="d-flex justify-center text-h5"
        style="color: #003466"
      >
        {{ userInfo.organizationName }}
      </v-row>
      <GroupChangeDialogueContent v-if="organizationProviderType === 'GROUP'" />
      <FamilyChangeDialogueContent v-else />
      <v-row class="d-flex justify-center">
        <p>
          For more information about reporting changes,
          <a
            href="https://www2.gov.bc.ca/gov/content/family-social-supports/caring-for-young-children/childcarebc-programs/child-care-operating-funding/report-changes "
          >visit the Child Care Operating Funding Website</a>.
        </p>
      </v-row>
      <NavButton
        :is-processing="processing"
        :is-next-displayed="true"
        class="mt-10"
        @previous="previous"
        @next="next"
      />
    </v-form>
  </v-container>
</template>

<script>
import { mapActions, mapState } from 'pinia';
import { useAuthStore } from '../../store/auth.js';
import { useOrganizationStore } from '../../store/ccof/organization.js';
import { useApplicationStore } from '../../store/application.js';
import { useReportChangesStore } from '../../store/reportChanges.js';

import { PATHS, CHANGE_TYPES, changeUrlGuid } from '../../utils/constants.js';
import NavButton from '../../components/util/NavButton.vue';
import { ORGANIZATION_PROVIDER_TYPES } from '../../utils/constants.js';
import alertMixin from '../../mixins/alertMixin.js';
import GroupChangeDialogueContent from '../../components/requestChanges/GroupChangeDialogueContent.vue';
import FamilyChangeDialogueContent from '../../components/requestChanges/FamilyChangeDialogueContent.vue';

export default {
  name: 'ChangeNotificationDialogue',
  components: { NavButton, GroupChangeDialogueContent, FamilyChangeDialogueContent },
  mixins: [alertMixin],
  data() {
    return {
      isGroup: true,
      processing: false,
      providerType: ORGANIZATION_PROVIDER_TYPES.GROUP,
    };
  },
  computed: {
    ...mapState(useAuthStore, ['userInfo', 'isMinistryUser']),
    ...mapState(useOrganizationStore, ['organizationProviderType']),
    ...mapState(useApplicationStore, ['formattedProgramYear']),
  },
  methods: {
    ...mapActions(useReportChangesStore, ['createChangeRequest', 'setChangeRequestId', 'setChangeActionId']),
    previous() {
      this.$router.push(PATHS.ROOT.CHANGE_LANDING);
    },
    async createNewChangeRequest(changeType) {
      let newReq;
      try {
        newReq = await this.createChangeRequest(changeType);
      } catch (error) {
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
        this.$router.push(
          changeUrlGuid(
            PATHS.CHANGE_NOTIFICATION_FORM,
            newReq?.changeRequestId,
            newReq?.changeActionId,
            CHANGE_TYPES.CHANGE_NOTIFICATION,
          ),
        );
      } else {
        this.setChangeRequestId(changeRequestId);
        this.setChangeActionId(changeActionId);
        this.$router.push(
          changeUrlGuid(
            PATHS.CHANGE_NOTIFICATION_FORM,
            changeRequestId,
            changeActionId,
            CHANGE_TYPES.CHANGE_NOTIFICATION,
          ),
        );
      }
    },
  },
};
</script>
