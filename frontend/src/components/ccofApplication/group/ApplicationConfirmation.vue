<template>
  <v-container>
    <v-row justify="space-around">
      <v-card class="cc-top-level-card" width="1200">
        <v-container>
          <v-row justify="center"> You have successfully applied for CCOF for the following facilities: </v-row>

          <v-row justify="center" style="padding-top: 2em">
            <ul style="list-style: none">
              <li v-for="item in navBarList" :key="item.facilityId" style="">
                <router-link :to="getRoutingPath(item.facilityId)">
                  <span>{{ item.facilityName }}</span>
                </router-link>
                <v-btn
                  v-if="!isLocked && navBarList.length > 1"
                  variant="outlined"
                  icon
                  color="red"
                  @click="
                    confirmDeleteApplication(
                      item.facilityId,
                      item.changeRequestNewFacilityId,
                      item.facilityName,
                      item.ccfriApplicationId,
                      item.eceweApplicationId,
                      item.ccofBaseFundingId,
                    )
                  "
                >
                  <v-icon>mdi-trash-can-outline</v-icon>
                </v-btn>
              </li>
            </ul>
          </v-row>
        </v-container>
      </v-card>

      <v-card class="cc-top-level-card" width="1200">
        <v-container>
          <v-row justify="center" class="pb-4"> Do you want to add another facility? </v-row>

          <v-row justify="center" class="pb-4">
            <v-col cols="auto" class="px-3">
              <AppButton :primary="true" required size="large" :disabled="isLocked" @click="addAnotherFacility()">
                Yes
              </AppButton>
            </v-col>
            <v-col cols="auto" class="px-3">
              <AppButton :primary="false" required size="large" @click="next()"> No </AppButton>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-row>

    <v-row justify="space-around" class="pb-4">
      <AppButton :primary="false" required size="large" @click="previous()"> Back </AppButton>
    </v-row>

    <v-dialog v-model="dialog" persistent max-width="525px">
      <v-card>
        <v-container class="pt-0">
          <v-row>
            <v-col cols="7" class="py-0 pl-0" style="background-color: #234075">
              <v-card-title class="text-white"> Delete Application </v-card-title>
            </v-col>
            <v-col cols="5" class="d-flex justify-end" style="background-color: #234075" />
          </v-row>
          <v-row>
            <v-col cols="12" style="background-color: #ffc72c; padding: 2px" />
          </v-row>
          <v-row>
            <v-col cols="12" style="text-align: left">
              <p class="pt-4">Are you sure you want to delete application for facility {{ deleteFacilityName }}?</p>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" style="text-align: center">
              <AppButton :primary="false" :loading="processing" class="mr-10" @click="dialog = false">
                Cancel
              </AppButton>
              <AppButton :primary="true" :loading="processing" @click="deleteApplication()"> Continue </AppButton>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapState, mapActions } from 'pinia';
import { useNavBarStore } from '@/store/navBar.js';
import { useApplicationStore } from '@/store/application.js';
import { useOrganizationStore } from '@/store/ccof/organization.js';
import { useFacilityStore } from '@/store/ccof/facility.js';
import { useReportChangesStore } from '@/store/reportChanges.js';

import { PATHS, changeUrl, changeUrlGuid, pcfUrl, pcfUrlGuid } from '@/utils/constants.js';

import alertMixin from '@/mixins/alertMixin.js';
import AppButton from '@/components/guiComponents/AppButton.vue';

export default {
  components: { AppButton },
  mixins: [alertMixin],
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
  computed: {
    ...mapState(useNavBarStore, [
      'navBarList',
      'changeRequestId',
      'previousPath',
      'getChangeActionNewFacByFacilityId',
      'isChangeRequest',
    ]),
    ...mapState(useApplicationStore, ['applicationStatus', 'applicationId', 'programYearId']),
    ...mapState(useOrganizationStore, ['organizationProviderType']),
    ...mapState(useReportChangesStore, ['isCCOFUnlocked', 'changeRequestStatus']),
    isLocked() {
      if (this.isChangeRequest) {
        return this.changeRequestStatus !== 'INCOMPLETE';
      }
      return this.applicationStatus === 'SUBMITTED';
    },
  },
  async mounted() {
    this.setCcofConfirmationEnabled(true);
    if (this.isChangeRequest) {
      let index = this.navBarList.findIndex((facility) => facility.changeRequestNewFacilityId);
      if (index === -1) await this.getChangeRequest(this.$route.params.changeRecGuid);
    }
  },
  methods: {
    ...mapActions(useApplicationStore, ['setCcofConfirmationEnabled']),
    ...mapActions(useFacilityStore, ['deleteFacility']),
    ...mapActions(useReportChangesStore, ['getChangeRequest']),
    previous() {
      this.$router.push(this.previousPath);
    },
    getRoutingPath(facilityId) {
      if (this.isChangeRequest) {
        return changeUrlGuid(PATHS.CCOF_GROUP_FACILITY, this.changeRequestId, facilityId);
      } else {
        return pcfUrlGuid(PATHS.CCOF_GROUP_FACILITY, this.programYearId, facilityId);
      }
    },
    addAnotherFacility() {
      if (this.isChangeRequest) {
        this.$router.push(changeUrl(PATHS.CCOF_GROUP_FACILITY, this.$route.params.changeRecGuid));
      } else {
        this.$router.push(pcfUrl(PATHS.CCOF_GROUP_FACILITY, this.programYearId));
      }
    },
    async next() {
      if (this.isChangeRequest) {
        this.$router.push(changeUrl(PATHS.LICENSE_UPLOAD, this.$route.params.changeRecGuid));
      } else {
        this.$router.push(pcfUrl(PATHS.LICENSE_UPLOAD, this.programYearId));
      }
    },
    confirmDeleteApplication(
      facilityId,
      _changeRequestNewFacilityId,
      facilityName,
      ccfriId,
      eceweId,
      ccofBaseFundingId,
    ) {
      this.deleteFacilityName = facilityName;
      this.deleteFacilityId = facilityId;
      this.deleteChangeRequestNewFacilityId =
        this.getChangeActionNewFacByFacilityId(facilityId)?.changeRequestNewFacilityId;
      this.dialog = true;
      this.deleteCcfriId = ccfriId;
      this.deleteEceweId = eceweId;
      this.deleteCcofBaseFundingId = ccofBaseFundingId;
    },
    async deleteApplication() {
      this.processing = true;
      try {
        await this.deleteFacility({
          facilityId: this.deleteFacilityId,
          changeRequestNewFacilityId: this.deleteChangeRequestNewFacilityId,
          ccfriId: this.deleteCcfriId,
          eceweId: this.deleteEceweId,
          ccofBaseFundingId: this.deleteCcofBaseFundingId,
          applicationId: this.applicationId,
        });
      } catch {
        this.setFailureAlert('An error occurred while deleting facility. Please try again later.');
      } finally {
        this.processing = false;
        this.dialog = false;
      }
    },
  },
};
</script>
