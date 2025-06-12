<template>
  <v-container fluid class="px-lg-12">
    <v-card class="pa-8 mb-8">
      <p class="text-center mb-4">You have successfully applied for CCOF for the following facilities:</p>
      <ul class="text-center" style="list-style: none">
        <li v-for="item in navBarList" :key="item.facilityId" style="">
          <router-link :to="getRoutingPath(item.facilityId)">
            <span>{{ item.facilityName }}</span>
          </router-link>
          <v-btn
            v-if="!isLocked && navBarList.length > 1"
            variant="text"
            icon="mdi-trash-can-outline"
            class="text-error"
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
          </v-btn>
        </li>
      </ul>
    </v-card>

    <v-card class="pa-8 my-8">
      <div class="text-center pb-4">
        <p class="mb-2">Do you want to add another facility to your application?</p>
        <p>Note: You need to apply for each licence.</p>
      </div>

      <v-row justify="center" class="pb-4">
        <v-col cols="auto" class="px-3">
          <AppButton :primary="true" size="large" :disabled="isLocked" @click="addAnotherFacility()">Yes</AppButton>
        </v-col>
        <v-col cols="auto" class="px-3">
          <AppButton :primary="false" size="large" @click="next()">No</AppButton>
        </v-col>
      </v-row>
    </v-card>

    <v-row justify="space-around" class="pb-4">
      <AppButton :primary="false" size="x-large" @click="previous()"> Back </AppButton>
    </v-row>

    <AppDialog
      v-model="dialog"
      persistent
      max-width="525px"
      title="Delete Application"
      :loading="processing"
      @close="dialog = false"
    >
      <template #content>
        <p class="text-left pt-4">Are you sure you want to delete application for facility {{ deleteFacilityName }}?</p>
      </template>
      <template #button>
        <v-row justify="space-around">
          <v-col cols="12" md="6" class="d-flex justify-center">
            <AppButton :primary="false" :loading="processing" class="mr-10" @click="dialog = false"> Cancel </AppButton>
          </v-col>
          <v-col cols="12" md="6" class="d-flex justify-center">
            <AppButton :primary="true" :loading="processing" @click="deleteApplication()"> Continue </AppButton>
          </v-col>
        </v-row>
      </template>
    </AppDialog>
  </v-container>
</template>

<script>
import { mapState, mapActions } from 'pinia';
import { useNavBarStore } from '@/store/navBar.js';
import { useApplicationStore } from '@/store/application.js';
import { useFacilityStore } from '@/store/ccof/facility.js';
import { useReportChangesStore } from '@/store/reportChanges.js';

import { PATHS, changeUrl, changeUrlGuid, pcfUrl, pcfUrlGuid } from '@/utils/constants.js';

import alertMixin from '@/mixins/alertMixin.js';
import AppButton from '@/components/guiComponents/AppButton.vue';
import AppDialog from '@/components/guiComponents/AppDialog.vue';

export default {
  components: { AppButton, AppDialog },
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
    ...mapState(useReportChangesStore, ['changeRequestStatus']),
    isLocked() {
      if (this.isChangeRequest) {
        return this.changeRequestStatus !== 'INCOMPLETE';
      }
      return this.applicationStatus === 'SUBMITTED';
    },
  },
  async mounted() {
    if (this.isChangeRequest) {
      let index = this.navBarList.findIndex((facility) => facility.changeRequestNewFacilityId);
      if (index === -1) await this.getChangeRequest(this.$route.params.changeRecGuid);
    }
  },
  methods: {
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
