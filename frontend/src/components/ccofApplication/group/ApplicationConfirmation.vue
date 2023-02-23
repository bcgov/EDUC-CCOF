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
                <v-btn variant="outlined" icon color="red" @click="deleteApplication(item.facilityId, item.facilityName)">
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
  </v-container>
</template>

<script>

import { PATHS } from '@/utils/constants';
import { mapState, mapMutations, mapActions } from 'vuex';

export default {
  props: {
  },
  computed: {
    ...mapState('app', ['navBarList', 'isLicenseUploadComplete']),
    ...mapState('application', ['applicationStatus']),
    ...mapState('organization', ['organizationProviderType']),
    isLocked() {
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
    },
    addAnotherFacility() {
      this.$router.push(PATHS.group.facInfo);
    },
    async next() {
      this.$router.push(PATHS.group.licenseUpload);
    },
    async deleteApplication(facilityId, facilityName) {
      if (!window.confirm(`Are you sure you want to delete application for ${facilityName}?`)) {
        return;
      }

      await this.deleteFacility({ facilityId, facilityName });

      if (this.organizationProviderType === 'GROUP') {
        this.$router.push(PATHS.group.orgInfo);
      } else if (this.organizationProviderType === 'FAMILY') {
        this.$router.push(PATHS.family.orgInfo);
      } else {
        this.setFailureAlert(`Unknown Organization Provider Type: ${this.organizationProviderType}`);
      }
    }
  },
  mounted() {
    this.setCcofConfirmationEnabled(true);
  },

};
</script>
