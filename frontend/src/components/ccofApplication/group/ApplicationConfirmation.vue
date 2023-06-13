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

import { PATHS, CHANGE_URL_PREFIX } from '@/utils/constants';
import { mapState, mapMutations, mapActions } from 'vuex';
import NavButton from '@/components/util/NavButton';
import { isChangeRequest } from '@/utils/common';

export default {
  components: { NavButton },
  props: {
  },
  computed: {
    ...mapState('app', ['navBarList', 'isLicenseUploadComplete']),
    ...mapState('application', ['applicationStatus', 'unlockBaseFunding']),
    isLocked() {
      if (this.unlockBaseFunding) {
        return false;
      }
      return (this.applicationStatus === 'SUBMITTED');
    },
    facilityList() {
      if (isChangeRequest(this)) {
        return this.navBarList.filter(el => el.changeRequestId);
      } else {
        return this.navBarList.filter(el => !el.changeRequestId);
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
      if (isChangeRequest(this)) {
        this.$router.push(`${CHANGE_URL_PREFIX}/${this.$route.params.changeRecGuid}/facility`);
      } else {
        this.$router.push(PATHS.group.facInfo);
      }
    },
    async next() {
      if (isChangeRequest(this)) {
        this.$router.push(PATHS.group.licenseUpload);
      } else {
        this.$router.push(PATHS.group.licenseUpload);
      }
    }
  },
  mounted() {
    this.setCcofConfirmationEnabled(true);
  },

};
</script>
