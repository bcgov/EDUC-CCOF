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
              <li v-for="item in facilityList" :key="item.facilityId" style="">
                <span>{{ item.facilityName }}</span>
                <v-btn v-if="!isLocked && facilityList.length > 1" variant="outlined" icon color="red" @click="confirmDeleteApplication(item.facilityId, item.changeRequestNewFacilityId, item.facilityName, item.ccfriApplicationId, item.eceweApplicationId, item.ccofBaseFundingId)">
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
            <v-btn color="secondary" outlined x-large style="margin: 2em;" @click="next()" :disabled="isLocked">No</v-btn>
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

import { PATHS, changeUrl, pcfUrl } from '@/utils/constants';
import { mapState, mapMutations, mapActions, mapGetters } from 'vuex';
import { isChangeRequest } from '@/utils/common';

export default {
  data() {
    return {
      dialog: false,
      deleteFacilityName: undefined,
      deleteFacilityId: undefined,
      deletechangeRequestNewFacilityId: undefined,
      processing: false,
      deleteCcfriId: undefined,
      deleteEceweId: undefined,
      deleteCcofBaseFundingId: undefined,
    };
  },
  computed: {
    ...mapState('navBar', ['navBarList','changeRequestId']),
    ...mapState('application', ['applicationStatus', 'applicationId', 'programYearId', ]),
    ...mapState('organization', ['organizationProviderType']),
    ...mapState('reportChanges',['userProfileChangeRequests']),
    ...mapGetters('navBar', ['previousPath']),
    isLocked() {
      if (isChangeRequest(this)) {
        let currentCR = this.userProfileChangeRequests?.filter(el=>el.changeRequestId===this.changeRequestId)[0];
        if(!currentCR){
          return false;
        }
        else if(currentCR.unlockCCOF){
          return false;
        }
        else if(currentCR.externalStatus!=='INCOMPLETE'){
          return true;
        }
        return false;
      }
      if (this.unlockBaseFunding) {
        return false;
      }
      return (this.applicationStatus === 'SUBMITTED');
    },
    facilityList() {
      if (isChangeRequest(this)) {
        return this.navBarList.filter(el => el.changeRequestId === this.$route.params.changeRecGuid);
      } else {
        return this.navBarList.filter(el => !el.changeRequestId);
      }
    }
  },
  methods: {
    ...mapMutations('application', ['setCcofConfirmationEnabled']),
    ...mapActions('facility', ['deleteFacility']),
    previous() {
      this.$router.push(this.previousPath);
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
      this.deletechangeRequestNewFacilityId = changeRequestNewFacilityId,
      this.dialog = true;
      this.deleteCcfriId = ccfriId;
      this.deleteEceweId = eceweId;
      this.deleteCcofBaseFundingId = ccofBaseFundingId;
    },
    async deleteApplication() {
      this.processing = true;
      console.log(this.deleteFacilityId);
      console.log(this.deleteCcfriId);
      console.log(this.applicationId);
      await this.deleteFacility({ facilityId: this.deleteFacilityId, changeRequestNewFacilityId: this.deletechangeRequestNewFacilityId, ccfriId: this.deleteCcfriId, eceweId: this.deleteEceweId, ccofBaseFundingId: this.deleteCcofBaseFundingId, applicationId: this.applicationId});
      this.processing = false;
      this.dialog = false;
    }
  },
  mounted() {
    this.setCcofConfirmationEnabled(true);
  },

};
</script>
