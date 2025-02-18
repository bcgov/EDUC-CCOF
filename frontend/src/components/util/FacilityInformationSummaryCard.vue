<template>
  <v-card
    :class="isFacilityComplete ? 'success-card' : 'error-card'"
    class="pa-0 mx-auto"
    elevation="4"
    hover
    @click="true"
  >
    <div class="px-2 py-4">
      <v-row no-gutters>
        <v-col cols="6" class="px-2">
          <div class="summary-label">Facility Name</div>
          <div :class="facility.facilityName ? '' : 'text-error'" class="summary-value">
            {{ facility.facilityName ?? 'Required' }}
          </div>
        </v-col>
        <v-col cols="5" class="px-2">
          <div class="summary-label">Facility ID</div>
          <div class="summary-value">
            {{ facility.facilityAccountNumber ?? '--' }}
          </div>
          <!-- Facility ID is assigned in dynamics, and may not exist as far as I know, so no required is implemented here -- JB -->
        </v-col>
        <v-col cols="1" class="d-flex justify-end">
          <v-icon size="small">mdi-open-in-new </v-icon>
        </v-col>
      </v-row>
      <v-row no-gutters class="pt-2">
        <v-col cols="6" md="4" class="px-2">
          <div class="summary-label">Licence Number</div>
          <div :class="facility.licenseNumber ? '' : 'text-error'" class="summary-value">
            {{ facility.licenseNumber ?? 'Required' }}
          </div>
        </v-col>
        <v-col cols="6" md="4" class="px-2">
          <div class="summary-label">CCFRI</div>
          <div :class="facility.ccfriOptInStatus != null ? '' : 'text-error'" class="summary-value">
            {{ getOptInOptOut(facility.ccfriOptInStatus) ?? 'Required' }}
          </div>
        </v-col>
        <v-col cols="6" md="4" class="px-2">
          <div class="summary-label">ECE-WE</div>
          <div :class="facility.eceweOptInStatus != null ? '' : 'text-error'" class="summary-value">
            {{ getOptInOptOut(facility.eceweOptInStatus) ?? 'Required' }}
          </div>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <!-- <v-col cols="12" md="6">
        <div class="summary-label">Licence Categories</div>
        <v-textarea
          :model-value="licenseCategories"
          class="summary-value"
          density="compact"
          flat
          variant="solo"
          hide-details
          readonly
          no-resize
          rows="3"
        />
      </v-col> -->
      </v-row>
      <v-row no-gutters class="pa-2 pb-0">
        <template v-if="isFacilityComplete">
          <v-icon class="text-success" size="large"> mdi-check-circle-outline </v-icon>
          <span class="text-success pl-2">Click here to view.</span>
        </template>
        <template v-else>
          <v-icon class="text-error" size="large"> mdi-alert-circle-outline </v-icon>
          <span class="text-error pl-2"> Your form is missing required information. Click here to view. </span>
        </template>
      </v-row>
    </div>
  </v-card>
</template>

<script>
import { mapState, mapActions } from 'pinia';
import { useSummaryDeclarationStore } from '@/store/summaryDeclaration.js';
import { useApplicationStore } from '@/store/application.js';
import { useNavBarStore } from '@/store/navBar.js';
import { useOrganizationStore } from '@/store/ccof/organization.js';
import { isChangeRequest } from '@/utils/common.js';
import { PATHS, changeUrlGuid, pcfUrl, pcfUrlGuid, ORGANIZATION_PROVIDER_TYPES } from '@/utils/constants.js';
import rules from '@/utils/rules.js';

export default {
  props: {
    facility: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      PATHS,
      rules,
    };
  },
  computed: {
    ...mapState(useApplicationStore, ['isRenewal']),
    ...mapState(useNavBarStore, ['navBarList']),
    ...mapState(useOrganizationStore, ['organizationProviderType']),
    ...mapState(useSummaryDeclarationStore, ['summaryModel', 'isLoadingComplete']),
    isFacilityComplete() {
      return (
        this.facility?.isFacilityComplete &&
        this.facility?.isCCOFComplete &&
        this.facility?.isCCFRIComplete &&
        (!this.facility?.hasRfi || this.facility?.isRfiComplete) &&
        (!this.facility?.hasNmf || this.facility?.isNmfComplete)
      );
    },
  },
  created() {},
  methods: {
    getOptInOptOut(status) {
      if (status === 1) {
        return 'Opt-In';
      } else if (status === 0) {
        return 'Opt-Out';
      } else {
        return '';
      }
    },
  },
};
</script>
<style scoped>
.summary-label {
  color: grey;
  font-size: small;
}
.summary-value {
  font-size: medium;
  color: black;
}

:deep(::placeholder) {
  color: red !important;
  opacity: 1 !important;
}

.summary-label-smaller {
  color: grey;
  font-size: x-small;
}

.error-card {
  border-top: 5px solid #d8292f !important;
}

.success-card {
  border-top: 5px solid #2e8540 !important;
}

:deep(.v-field__input) {
  padding-left: 0px;
}
</style>
