<template>
  <v-form ref="form" v-model="isValidForm">
    <v-container>
      <v-skeleton-loader :loading="loading" type="table-tbody" class="mb-12">
        <v-row justify="space-around">
          <v-card class="cc-top-level-card mx-12" width="100%">
            <div align="center">
              <div class="text-h5">
                Child Care Operating Funding Program - {{ formattedProgramYear }} Program Confirmation Form
              </div>
              <div class="text-h5 my-6">Child Care Fee Reduction Initiative (CCFRI)</div>
            </div>
            <FacilityHeader
              :facility-account-number="currentFacility?.facilityAccountNumber"
              :facility-name="currentFacility.facilityName"
              :license-number="currentFacility?.licenseNumber"
              class="mb-10"
            />
            <div>
              <ApprovableParentFeesCards />
            </div>
          </v-card>
        </v-row>
      </v-skeleton-loader>
      <NavButton
        :is-next-displayed="true"
        :is-save-displayed="true"
        :is-save-disabled="isLocked"
        :is-next-disabled="!isValidForm"
        :is-processing="processing"
        @previous="back"
        @next="next"
        @validate-form="validateForm()"
        @save="save(true)"
      />
    </v-container>
  </v-form>
</template>

<script>
import { mapState } from 'pinia';

import ApprovableParentFeesCards from '@/components/ccfriApplication/AFS/ApprovableParentFeesCards.vue';
import FacilityHeader from '@/components/guiComponents/FacilityHeader.vue';
import NavButton from '@/components/util/NavButton.vue';

import { useAppStore } from '@/store/app.js';
import { useNavBarStore } from '@/store/navBar.js';
import { useReportChangesStore } from '@/store/reportChanges.js';

import organizationMixin from '@/mixins/organizationMixin.js';
import { ORGANIZATION_PROVIDER_TYPES, PROVINCES } from '@/utils/constants.js';
import { isAnyChangeRequestActive } from '@/utils/common.js';

export default {
  name: 'ApprovableFeeSchedule',
  components: { ApprovableParentFeesCards, NavButton, FacilityHeader },
  mixins: [organizationMixin],
  async beforeRouteLeave(_to, _from, next) {
    await this.save(false);
    next();
  },
  data() {
    return {
      providerType: ORGANIZATION_PROVIDER_TYPES.GROUP,
    };
  },
  computed: {
    ...mapState(useAppStore, ['renewalYearLabel', 'currentYearLabel']),
    ...mapState(useReportChangesStore, ['changeRequestStore']),
    ...mapState(useNavBarStore, ['navBarList']),
    currentFacility() {
      return this.navBarList.find((el) => el.ccfriApplicationId == this.$route.params.urlGuid);
    },
  },
  created() {
    this.PROVINCES = PROVINCES;
    this.model.province1 = this.model.province1 ?? PROVINCES.find((province) => province.value === 'BC')?.value;
    this.model.province2 = this.model.province2 ?? PROVINCES.find((province) => province.value === 'BC')?.value;
  },
  methods: {
    isSomeChangeRequestActive() {
      //Status of : "Submitted" "Action Required";
      return isAnyChangeRequestActive(this.changeRequestStore);
    },
  },
};
</script>
