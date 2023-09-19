<template>
  <v-container>
    <v-row justify="space-around">
      <v-card class="cc-top-level-card" width="1200">
        <v-container>
          <v-row justify="center">
            You have successfully applied for CCOF for the following facilities:
          </v-row>

          <v-row justify="center" style="padding-top: 2em;">
            <ul style="list-style: none">
              <li v-for="item in navBarList" :key="item.facilityId" style="">
                <router-link :to="getRoutingPath(item.facilityId)"><span>{{ item.facilityName }}</span></router-link>
                <v-btn v-if="!isLocked && navBarList.length > 1" variant="outlined" icon color="red" @click="confirmDeleteApplication(item.facilityId, item.changeRequestNewFacilityId, item.facilityName, item.ccfriApplicationId, item.eceweApplicationId, item.ccofBaseFundingId)">
                  <v-icon>mdi-trash-can-outline</v-icon>
                </v-btn>
              </li>
            </ul>
          </v-row>
        </v-container>
      </v-card>

      <v-card class="cc-top-level-card" width="1200">
        <v-container>
          <v-row justify="center">
            Do you want to add another facility?
          </v-row>

          <v-row justify="center">
            <v-btn color="primary" outlined x-large style="margin: 2em;" @click="addAnotherFacility()" :disabled="isLocked">Yes</v-btn>
            <v-btn color="secondary" outlined x-large style="margin: 2em;" @click="next()" >No</v-btn>
          </v-row>
        </v-container>
      </v-card>
    </v-row>

    <v-row justify="space-around">
      <v-btn color="info" outlined required x-large @click="previous()">Back</v-btn>
    </v-row>

    <v-dialog v-model="dialog" persistent max-width="525px">
      <v-card>
        <v-container class="pt-0">
          <v-row>
            <v-col cols="7" class="py-0 pl-0" style="background-color:#234075;">
              <v-card-title class="white--text">Delete Application</v-card-title>
            </v-col>
            <v-col cols="5" class="d-flex justify-end" style="background-color:#234075;">
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" style="background-color:#FFC72C;padding:2px;"></v-col>
          </v-row>
          <v-row>
            <v-col cols="12" style="text-align: left;">
              <p class="pt-4">Are you sure you want to delete application for facility {{ deleteFacilityName }}?</p>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" style="text-align: center;">
              <v-btn dark color="secondary" :loading="processing" class="mr-10" @click="dialog = false">Cancel</v-btn>
              <v-btn dark color="primary" :loading="processing" @click="deleteApplication()">Continue</v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>

import { PATHS, changeUrl, changeUrlGuid, pcfUrl, pcfUrlGuid } from '@/utils/constants';
import { mapState, mapMutations, mapActions, mapGetters } from 'vuex';
import { isChangeRequest } from '@/utils/common';
import alertMixin from '@/mixins/alertMixin';

export default {
  data() {
    return {
      dialog: false,
      deleteFacilityName: undefined,
      deleteFacilityId: undefined,
      deleteChangeRequestNewFacilityId: undefined,
      processing: false,
      deleteCcfriId: undefined,
      deleteEceweId: undefined,
      deleteCcofBaseFundingId: undefined,
    };
  },
  mixins: [alertMixin],
  computed: {
    ...mapState('navBar', ['navBarList','changeRequestId']),
    ...mapState('application', ['applicationStatus', 'applicationId', 'programYearId', ]),
    ...mapState('organization', ['organizationProviderType']),
    ...mapState('reportChanges',['userProfileChangeRequests']),
    ...mapGetters('navBar', ['previousPath']),
    ...mapGetters('reportChanges',['isCCOFUnlocked','changeRequestStatus']),
    isLocked() {
      if (isChangeRequest(this)) {
        return (this.changeRequestStatus !== 'INCOMPLETE');
      }
      return (this.applicationStatus === 'SUBMITTED');
    }
  },
  methods: {
    ...mapMutations('application', ['setCcofConfirmationEnabled']),
    ...mapActions('facility', ['deleteFacility']),
    ...mapActions('reportChanges', ['getChangeRequest']),
    previous() {
      this.$router.push(this.previousPath);
    },
    getRoutingPath(facilityId) {
      if(isChangeRequest(this)){
        return changeUrlGuid(PATHS.CCOF_GROUP_FACILITY, this.changeRequestId, facilityId);
      }
      else {
        return pcfUrlGuid(PATHS.CCOF_GROUP_FACILITY, this.programYearId, facilityId);
      }
    },
    addAnotherFacility() {
      if (isChangeRequest(this)) {
        this.$router.push(changeUrl(PATHS.CCOF_GROUP_FACILITY, this.$route.params.changeRecGuid));
      } else {
        this.$router.push(pcfUrl(PATHS.CCOF_GROUP_FACILITY, this.programYearId));
      }
    },
    async next() {
      if (isChangeRequest(this)) {
        this.$router.push(changeUrl(PATHS.LICENSE_UPLOAD, this.$route.params.changeRecGuid));
      } else {
        this.$router.push(pcfUrl(PATHS.LICENSE_UPLOAD, this.programYearId));
      }
    },
    confirmDeleteApplication(facilityId, changeRequestNewFacilityId, facilityName, ccfriId, eceweId, ccofBaseFundingId) {
      this.deleteFacilityName = facilityName;
      this.deleteFacilityId = facilityId;
      this.deleteChangeRequestNewFacilityId = changeRequestNewFacilityId;
      this.dialog = true;
      this.deleteCcfriId = ccfriId;
      this.deleteEceweId = eceweId;
      this.deleteCcofBaseFundingId = ccofBaseFundingId;
    },
    async deleteApplication() {
      this.processing = true;
      try {
        await this.deleteFacility({ facilityId: this.deleteFacilityId, changeRequestNewFacilityId: this.deleteChangeRequestNewFacilityId, ccfriId: this.deleteCcfriId, eceweId: this.deleteEceweId, ccofBaseFundingId: this.deleteCcofBaseFundingId, applicationId: this.applicationId});
      } catch (error) {
        this.setFailureAlert('An error occurred while deleting facility. Please try again later.');
      } finally {
        this.processing = false;
        this.dialog = false;
      }
    }
  },
  async mounted() {
    this.setCcofConfirmationEnabled(true);
    if (isChangeRequest(this)) {
      let index = this.navBarList.findIndex(facility => facility.changeRequestNewFacilityId)
      if (index === -1)
        await this.getChangeRequest(this.$route.params.changeRecGuid);
    }
  },

};
</script>
