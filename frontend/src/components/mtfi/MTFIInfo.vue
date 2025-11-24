<template>
  <v-container>
    <v-row justify="space-around">
      <div class="pa-10 text-h4 text-center">Welcome to CCOF!</div>
    </v-row>
    <v-row>
      <v-container>
        <span class="text-h4">Important:</span>
        <br /><br /><br />
        <p class="px-10 text-h6">
          Under the Child Care Operating Funding (CCOF) Agreement you must receive written approval to increase parent
          fees for the Child Care Fee Reduction Initiative (CCFRI). Use this form to submit a request to increase your
          parent fees after you have received approval for the CCFRI. <br />
        </p>
        <br />
        <p class="px-10 text-h6">To complete this form, you will need the following:</p>
        <br />
        <ul class="px-10 text-h6 ml-10">
          <li>A proposed parent fee schedule; and</li>
          <li>
            If the total parent fee increase you are requesting for the funding term, including any prior approved fee
            increases, is above the Fee Increase Limit for your region, you may be required to submit supporting
            documentation. CCFRI Regions align with the BCSSA's grouping of school districts into 6 regional chapters.
            Use the <a :href="BCSSALink" target="_blank">BCSSA region lookup</a> to find your region and applicable Fee
            Increase Limits.
          </li>
        </ul>
      </v-container>
    </v-row>
    <v-row justify="space-around">
      <v-col cols="6" />
    </v-row>

    <NavButton
      :is-next-displayed="true"
      :is-save-displayed="false"
      :is-next-disabled="false"
      :is-processing="loading"
      @previous="previous()"
      @next="next()"
      @save="true"
    />
  </v-container>
</template>

<script>
import { mapActions, mapState } from 'pinia';
import { useApplicationStore } from '@/store/application.js';
import { useOrganizationStore } from '@/store/ccof/organization.js';
import { useNavBarStore } from '@/store/navBar.js';
import { useReportChangesStore } from '@/store/reportChanges.js';
import { useAppStore } from '@/store/app.js';

import { getBCSSALink } from '@/utils/common.js';
import {
  PATHS,
  changeUrlGuid,
  changeUrl,
  CHANGE_TYPES,
  CHANGE_REQUEST_EXTERNAL_STATUS,
  ORGANIZATION_PROVIDER_TYPES,
} from '@/utils/constants.js';
import alertMixin from '@/mixins/alertMixin.js';

import NavButton from '@/components/util/NavButton.vue';

export default {
  components: { NavButton },
  mixins: [alertMixin],
  data() {
    return {
      newReq: undefined,
      processing: false,
      loading: false,
    };
  },
  computed: {
    ...mapState(useAppStore, ['getLanguageYearLabel']),
    ...mapState(useApplicationStore, ['programYearId', 'applicationId', 'formattedProgramYear']),
    ...mapState(useOrganizationStore, ['organizationId', 'organizationName', 'organizationProviderType']),
    ...mapState(useNavBarStore, ['userProfileList']),
    ...mapState(useReportChangesStore, ['changeActionId', 'mtfiFacilities', 'changeRequestStore']),
    BCSSALink() {
      try {
        const link = getBCSSALink(this.getLanguageYearLabel);
        return link;
      } catch (e) {
        console.error(e);
        return '';
      }
    },
  },
  async beforeMount() {
    this.loading = true;
    if (this.changeRequestStore?.length === 0) {
      await this.getChangeRequestList();
    }
    this.loading = false;
  },
  methods: {
    ...mapActions(useReportChangesStore, [
      'createChangeRequest',
      'createChangeRequestMTFI',
      'getChangeRequest',
      'getChangeRequestList',
      'setMTFIFacilities',
    ]),
    ...mapActions(useNavBarStore, ['forceNavBarRefresh', 'refreshNavBarList', 'reloadChangeRequest']),
    previous() {
      this.$router.push(PATHS.ROOT.CHANGE_LANDING);
    },
    async next() {
      this.loading = true;

      const activeMTFIChangeRequest = this.getActiveMTFIChangeRequest();
      if (!activeMTFIChangeRequest) {
        this.newReq = await this.createChangeRequest('PARENT_FEE_CHANGE');
        this.$route.params.changeRecGuid = this.newReq.changeRequestId;
      } else {
        this.$route.params.changeRecGuid = activeMTFIChangeRequest?.changeRequestId;
        await this.reloadChangeRequest(activeMTFIChangeRequest?.changeRequestId);
      }

      //below code i think can be removed as now only new CR sees this page?
      if (this.organizationProviderType === ORGANIZATION_PROVIDER_TYPES.FAMILY) {
        // && mtfi does not exist yet?

        if (this.mtfiFacilities?.length == 0) {
          await this.save();
        }
        this.$router.push(
          changeUrlGuid(
            PATHS.MTFI_GROUP_FEE_VERIFICATION,
            this.$route.params.changeRecGuid,
            this.mtfiFacilities[0]?.ccfriApplicationId,
            CHANGE_TYPES.MTFI,
          ),
        );
      } else {
        this.$router.push(
          changeUrl(PATHS.MTFI_GROUP_SELECT_FACILITY, this.$route.params.changeRecGuid, CHANGE_TYPES.MTFI),
        );
      }
    },
    //we only need to save a MTFI change rec on this page for family org. We do this so we can skip the facility selection page.
    async save() {
      try {
        await this.createChangeRequestMTFI([
          {
            facilityID: this.userProfileList[0].facilityId,
            applicationID: this.applicationId,
            changeActionId: this.newReq?.changeActionId ? this.newReq.changeActionId : this.changeActionId,
            optInResponse: 1,
            programYearId: this.programYearId,
            organizationId: this.organizationId,
          },
        ]);
        await this.reloadChangeRequest(this.$route.params.changeRecGuid);
      } catch (error) {
        console.log(error);
        this.setFailureAlert('An error occurred while saving. Please try again later.');
      }
    },
    getActiveMTFIChangeRequest() {
      return this.changeRequestStore?.find((item) => {
        const isSameApplication = item.applicationId === this.applicationId;
        const isMTFIChangeRequest =
          item.changeActions?.findIndex((changeAction) => changeAction.changeType === 'PARENT_FEE_CHANGE') > -1;
        const isActive = [
          CHANGE_REQUEST_EXTERNAL_STATUS.IN_PROGRESS,
          CHANGE_REQUEST_EXTERNAL_STATUS.SUBMITTED,
          CHANGE_REQUEST_EXTERNAL_STATUS.ACTION_REQUIRED,
        ].includes(item.externalStatus);
        return isSameApplication && isMTFIChangeRequest && isActive;
      });
    },
  },
};
</script>
