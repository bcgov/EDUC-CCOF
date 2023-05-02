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

    <NavButton @previous="previous"></NavButton>
  </v-container>
</template>

<script>

import { PATHS } from '@/utils/constants';
import {mapState, mapMutations, mapActions, mapGetters} from 'vuex';
import NavButton from '@/components/util/NavButton';

export default {
  components: { NavButton },
  props: {
  },
  computed: {
    ...mapState('app', ['navBarList', 'isLicenseUploadComplete']),
    ...mapState('application', ['applicationStatus']),
    ...mapGetters('app', ['getNavbarStatus']),
    isLocked() {
      switch(this.getNavbarStatus) {
      case 'APPLICATION':
        return (this.applicationStatus === 'SUBMITTED');
      case 'RC_NEW_FACILITY':
        //TODO - find change request application status and based on that return the value.
        return false;
      case 'REPORT_CHANGE':
        return false;
      }
    }
  },
  methods: {
    ...mapMutations('app', ['setCcofConfirmationEnabled', 'setIsLicenseUploadComplete']),
    ...mapActions('licenseUpload', ['updateLicenseCompleteStatus']),
    previous() {
      let navItem = this.navBarList[this.navBarList.length - 1];
      this.$router.push(PATHS.group.fundAmount + '/' + navItem?.ccofBaseFundingId);
    },
    addAnotherFacility() {
      this.$router.push(PATHS.group.facInfo);
    },
    async next() {
      this.$router.push(PATHS.group.licenseUpload);
    }
  },
  mounted() {
    this.setCcofConfirmationEnabled(true);
  },

};
</script>
