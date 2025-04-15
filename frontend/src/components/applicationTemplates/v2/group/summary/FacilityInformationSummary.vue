<template>
  <v-form ref="facilitySummaryForm" v-model="isValidForm">
    <v-expansion-panel-title>
      <SummaryExpansionPanelTitle
        title="Facility Information"
        :loading="isApplicationProcessing"
        :is-complete="isValidForm"
      />
    </v-expansion-panel-title>
    <v-expansion-panel-text eager>
      <!-- GROUP APPLICATION or ADD NEW FACILITY CHANGE REQUEST -->
      <template v-if="(!isRenewal && isGroup) || isChangeRequest">
        <v-row no-gutters>
          <v-col cols="12" md="8" class="pr-2">
            <p class="summary-label">Facility Name (as it appears on the Community Care Assisted Living Act Licence)</p>
            <v-textarea
              placeholder="Required"
              :model-value="facilityInfo.facilityName"
              class="summary-value"
              auto-grow
              rows="2"
              density="compact"
              flat
              variant="solo"
              hide-details
              readonly
              :rules="rules.required"
            />
          </v-col>
          <v-col cols="12" md="2">
            <p class="summary-label">Year Facility Began Operation (YYYY)</p>
            <v-text-field
              placeholder="Required"
              :model-value="facilityInfo?.yearBeganOperation"
              class="summary-value"
              density="compact"
              flat
              variant="solo"
              :hide-details="isNullOrBlank(facilityInfo?.yearBeganOperation) || isValidForm"
              readonly
              :rules="[...rules.required, ...rules.YYYY]"
            />
          </v-col>
        </v-row>
        <div>
          <p class="summary-label">Facility Street Address</p>
          <v-text-field
            placeholder="Required"
            :model-value="facilityInfo?.facilityAddress"
            class="summary-value"
            density="compact"
            flat
            variant="solo"
            hide-details
            readonly
            :rules="rules.required"
          />
        </div>
        <v-row no-gutters>
          <v-col cols="12" md="4">
            <p class="summary-label">City/Town</p>
            <v-text-field
              placeholder="Required"
              :model-value="facilityInfo?.city"
              class="summary-value"
              density="compact"
              flat
              variant="solo"
              hide-details
              readonly
              :rules="rules.required"
            />
          </v-col>
          <v-col cols="12" md="4">
            <p class="summary-label">Province</p>
            <v-text-field
              placeholder="Required"
              :model-value="facilityInfo?.province"
              class="summary-value"
              density="compact"
              flat
              variant="solo"
              :rules="[...rules.required, rules.equalTo('BC', 'Facilities must be located within BC')]"
              :hide-details="isNullOrBlank(facilityInfo?.province) || isValidForm"
              readonly
            />
          </v-col>
          <v-col cols="12" md="4">
            <p class="summary-label">Postal Code</p>
            <v-text-field
              placeholder="Required"
              :model-value="facilityInfo?.postalCode"
              class="summary-value"
              density="compact"
              flat
              variant="solo"
              :hide-details="isNullOrBlank(facilityInfo?.postalCode) || isValidForm"
              readonly
              :rules="[...rules.required, ...rules.postalCode]"
            />
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col cols="12" md="4">
            <p class="summary-label">Facility Contact Name</p>
            <v-text-field
              placeholder="Required"
              :model-value="facilityInfo?.contactName"
              class="summary-value"
              density="compact"
              flat
              variant="solo"
              hide-details
              readonly
              :rules="rules.required"
            />
          </v-col>
          <v-col cols="12" md="4">
            <p class="summary-label">Position</p>
            <v-text-field
              placeholder="Required"
              :model-value="facilityInfo?.position"
              class="summary-value"
              density="compact"
              flat
              variant="solo"
              hide-details
              readonly
              :rules="rules.required"
            />
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col cols="12" md="4">
            <p class="summary-label">Facility Phone Number</p>
            <v-text-field
              placeholder="Required"
              :model-value="facilityInfo?.phone"
              class="summary-value"
              density="compact"
              flat
              variant="solo"
              :hide-details="isNullOrBlank(facilityInfo?.phone) || isValidForm"
              readonly
              :rules="[...rules.required, rules.phone]"
            />
          </v-col>
          <v-col cols="12" md="4">
            <p class="summary-label">Facility Email Address</p>
            <v-text-field
              placeholder="Required"
              :model-value="facilityInfo?.email"
              class="summary-value"
              density="compact"
              flat
              variant="solo"
              :hide-details="isNullOrBlank(facilityInfo?.email) || isValidForm"
              readonly
              :rules="[...rules.required, ...rules.email]"
            />
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col cols="12" md="4">
            <p class="summary-label">Facility Licence Number</p>
            <v-text-field
              placeholder="Required"
              :model-value="facilityInfo?.licenseNumber"
              class="summary-value"
              density="compact"
              flat
              variant="solo"
              hide-details
              readonly
              :rules="rules.required"
            />
          </v-col>
          <v-col cols="12" md="4">
            <p class="summary-label">Effective Date of Current Licence (YYYY-MM-DD)</p>
            <v-text-field
              placeholder="Required"
              class="summary-value"
              :model-value="facilityInfo?.licenseEffectiveDate"
              density="compact"
              flat
              variant="solo"
              hide-details
              readonly
              :rules="rules.required"
            />
          </v-col>
          <v-col cols="12" md="4">
            <p class="summary-label">Health Authority</p>
            <v-text-field
              :model-value="getHealthAuthorityNameById(facilityInfo?.healthAuthority)"
              placeholder="Required"
              density="compact"
              flat
              variant="solo"
              hide-details
              readonly
              :rules="rules.required"
              class="summary-value"
            />
          </v-col>
        </v-row>
        <div>
          <p class="summary-label">
            Has this facility or you as the applicant ever received funding under the Child Care Operating Funding
            Program?
          </p>
          <v-text-field
            placeholder="Required"
            :model-value="facilityHasReceivedFundingLabels"
            class="summary-value"
            density="compact"
            flat
            variant="solo"
            hide-details
            readonly
            :rules="rules.required"
          />
          <template v-if="facilityInfo?.hasReceivedFunding === FACILITY_HAS_RECEIVE_FUNDING_VALUES.YES_FACILITY">
            <p class="summary-label">Facility Name</p>
            <v-text-field
              placeholder="Required"
              :model-value="facilityInfo?.fundingFacility"
              class="summary-value"
              density="compact"
              flat
              variant="solo"
              hide-details
              readonly
              :rules="rules.required"
            />
          </template>
        </div>
      </template>

      <!-- FAMILY APPLICATION -->
      <template v-else-if="!isRenewal && !isGroup">
        <div>
          <p class="summary-label">Facility Name (as it appears on the Community Care Assisted Living Act Licence)</p>
          <v-text-field
            placeholder="Required"
            :model-value="facilityInfo.facilityName"
            class="summary-value"
            density="compact"
            flat
            variant="solo"
            hide-details
            readonly
            :rules="rules.required"
          />
        </div>
        <div>
          <p class="summary-label">Postal Code</p>
          <v-text-field
            placeholder="Required"
            :model-value="facilityInfo?.postalCode"
            class="summary-value"
            density="compact"
            flat
            variant="solo"
            hide-details
            readonly
            :rules="rules.required"
          />
        </div>
        <v-row no-gutters>
          <v-col cols="12" lg="6">
            <p class="summary-label">Facility Licence Number</p>
            <v-text-field
              placeholder="Required"
              :model-value="facilityInfo?.licenseNumber"
              class="summary-value"
              density="compact"
              flat
              variant="solo"
              hide-details
              readonly
              :rules="rules.required"
            />
          </v-col>
          <v-col cols="12" lg="6">
            <p class="summary-label">Effective Date of Current Licence (YYYY-MM-DD)</p>
            <v-text-field
              placeholder="Required"
              class="summary-value"
              :model-value="facilityInfo?.licenseEffectiveDate"
              density="compact"
              flat
              variant="solo"
              hide-details
              readonly
              :rules="rules.required"
            />
          </v-col>
        </v-row>
        <div>
          <p class="summary-label">
            Has this facility or you as the applicant ever received funding under the Child Care Operating Funding
            Program?
          </p>
          <v-text-field
            placeholder="Required"
            :model-value="facilityHasReceivedFundingLabels"
            class="summary-value"
            density="compact"
            flat
            variant="solo"
            hide-details
            readonly
            :rules="rules.required"
          />
          <template v-if="facilityInfo?.hasReceivedFunding === FACILITY_HAS_RECEIVE_FUNDING_VALUES.YES">
            <p class="summary-label">Facility Name</p>
            <v-text-field
              placeholder="Required"
              :model-value="facilityInfo?.fundingFacility"
              class="summary-value"
              density="compact"
              flat
              variant="solo"
              hide-details
              readonly
              :rules="rules.required"
            />
          </template>
        </div>
      </template>
      <!-- ccof base funding CAN be undefined if new app, so send them to page before if that is the case.  -->
      <router-link v-if="!isValidForm" :to="isGroup ? routingPathGroup : routingPathFamily">
        <u class="text-error">To add this information, click here. This will bring you to a different page.</u>
      </router-link>
    </v-expansion-panel-text>
  </v-form>
</template>

<script>
import { mapState } from 'pinia';
import { useAppStore } from '@/store/app.js';
import summaryMixin from '@/mixins/summaryMixin.js';
import { isChangeRequest } from '@/utils/common.js';
import { PATHS, changeUrlGuid, pcfUrl, pcfUrlGuid } from '@/utils/constants.js';

export default {
  mixins: [summaryMixin],
  props: {
    facilityInfo: {
      type: Object,
      required: true,
    },
    facilityId: {
      type: String,
      required: true,
    },
    funding: {
      type: Object,
      default: () => ({}),
    },
    changeRecGuid: {
      type: String,
      default: '',
    },
    programYearId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      isChangeRequest: isChangeRequest(this),
      isValidForm: true,
    };
  },
  computed: {
    ...mapState(useAppStore, ['getHealthAuthorityNameById']),
    routingPathGroup() {
      return this.isChangeRequest
        ? changeUrlGuid(PATHS.CCOF_GROUP_FACILITY, this.changeRecGuid, this.facilityId)
        : pcfUrlGuid(PATHS.CCOF_GROUP_FACILITY, this.programYearId, this.facilityId);
    },
    routingPathFamily() {
      return !this.funding.ccofBaseFundingId
        ? pcfUrl(PATHS.CCOF_FAMILY_ORG, this.programYearId)
        : pcfUrlGuid(PATHS.CCOF_FAMILY_ELIGIBILITY, this.programYearId, this.facilityId);
    },
  },
};
</script>
<style scoped>
:deep(::placeholder) {
  color: #d8292f !important;
  opacity: 1 !important;
}

:deep(.v-field__input) {
  padding-left: 0px;
}

:deep(.v-input__details) {
  padding-left: 0;
}
</style>
