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
                <span>{{ item.facilityName }}</span>
                <v-btn variant="outlined" icon color="red" @click="confirmDeleteApplication(item.facilityId, item.facilityName, item.ccfriApplicationId, item.eceweApplicationId, item.ccofBaseFundingId)">
                  <v-icon>mdi-close-circle</v-icon>
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

import { PATHS } from '@/utils/constants';
import { mapState, mapMutations, mapActions } from 'vuex';
import NavButton from '@/components/util/NavButton';

export default {
  data() {
    return {
      dialog: false,
      deleteFacilityName: undefined,
      deleteFacilityId: undefined,
      processing: false,
      deleteCcfriId: undefined,
      deleteEceweId: undefined,
      deleteCcofBaseFundingId: undefined,
    };
  },
  computed: {
    ...mapState('app', ['navBarList', 'isLicenseUploadComplete']),
    ...mapState('application', ['applicationStatus', 'applicationId']),
    ...mapState('organization', ['organizationProviderType']),
    isLocked() {
      if (this.unlockBaseFunding) {
        return false;
      }
      return (this.applicationStatus === 'SUBMITTED');
    }
  },
  methods: {
    ...mapMutations('app', ['setCcofConfirmationEnabled', 'setIsLicenseUploadComplete']),
    ...mapActions('licenseUpload', ['updateLicenseCompleteStatus']),
    ...mapActions('facility', ['deleteFacility']),
    previous() {
      let navItem = this.navBarList[this.navBarList.length - 1];
      this.$router.push(PATHS.group.fundAmount + '/' + navItem?.ccofBaseFundingId);
      this.$router.push(PATHS.group.fundAmount + '/' + navItem?.ccofBaseFundingId);
    },
    addAnotherFacility() {
      this.$router.push(PATHS.group.facInfo);
    },
    async next() {
      this.$router.push(PATHS.group.licenseUpload);
    },
    confirmDeleteApplication(facilityId, facilityName, ccfriId, eceweId, ccofBaseFundingId) {
      this.deleteFacilityName = facilityName;
      this.deleteFacilityId = facilityId;
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
      await this.deleteFacility({ facilityId: this.deleteFacilityId , ccfriId: this.deleteCcfriId, eceweId: this.deleteEceweId, ccofBaseFundingId: this.deleteCcofBaseFundingId, applicationId: this.applicationId});
      this.processing = false;
      this.dialog = false;
    }
  },
  mounted() {
    this.setCcofConfirmationEnabled(true);
  },

};
</script>
