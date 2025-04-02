<!--
* NOTE (vietle-cgi):  
* This file contains **legacy code** from the previous application layout, which was deprecated and replaced as of March 2025.  
* **DO NOT modify this file** to maintain compatibility with submitted PCF application/change request.
*  
* Source: Copied from commit 97b8210 on Dec 31, 2024.
-->
<template>
  <v-form ref="facilitySummaryForm" v-model="isValidForm">
    <v-expansion-panel-title>
      <SummaryExpansionPanelTitle title="Facility Information" :is-complete="isValidForm" />
    </v-expansion-panel-title>
    <v-expansion-panel-text eager>
      <template v-if="(!isRenewal && isGroup) || isChangeRequest">
        <v-row no-gutters>
          <v-col cols="12" md="8" class="pr-2">
            <div class="summary-label">
              Facility Name (as it appears on the Community Care Assisted Living Act Licence)
            </div>
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
            <div class="summary-label">Year Facility Began Operation (YYYY)</div>
            <v-text-field
              placeholder="Required"
              :model-value="facilityInfo?.yearBeganOperation"
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
            <div class="summary-label">Facility Street Address</div>
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
          </v-col>
          <v-col cols="12" md="4">
            <div class="summary-label">Facility Contact Name</div>
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
            <div class="summary-label">Position</div>
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
          <v-col cols="12">
            <v-row no-gutters>
              <v-col cols="12" md="4">
                <div class="summary-label">City/Town</div>
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
                <div class="summary-label">Province</div>
                <v-text-field
                  placeholder="Required"
                  :model-value="facilityInfo?.province"
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
                <div class="summary-label">Postal Code</div>
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
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12">
            <v-row no-gutters>
              <v-col cols="12" md="4">
                <div class="summary-label">Business phone</div>
                <v-text-field
                  placeholder="Required"
                  :model-value="facilityInfo?.phone"
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
                <div class="summary-label">Facility E-mail Address</div>
                <v-text-field
                  placeholder="Required"
                  :model-value="facilityInfo?.email"
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
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col cols="12">
            <v-row no-gutters>
              <v-col cols="12" md="4">
                <div class="summary-label">Facility Licence Number</div>
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
                <div class="summary-label">Effective Date of Current Licence (YYYY-MM-DD)</div>
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
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col cols="12">
            <div class="summary-label">
              Has this facility or you as the applicant ever received funding under the Child Care Operating Funding
              Program?
            </div>
            <v-text-field
              placeholder="Required"
              :model-value="yesNoFacilityLabel"
              class="summary-value"
              density="compact"
              flat
              variant="solo"
              hide-details
              readonly
              :rules="rules.required"
            />
          </v-col>
          <v-row
            v-if="facilityInfo?.hasReceivedFunding?.toUpperCase() === 'YESFACILITY'"
            no-gutters
            class="d-flex justify-start pt-2"
          >
            <v-col cols="10" class="d-flex justify-start ml-3">
              <span class="summary-label">Facility Name</span>
            </v-col>
            <v-col cols="10" class="d-flex justify-start">
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
            </v-col>
          </v-row>
        </v-row>
      </template>

      <!-- FAMILY APPLICATION -->
      <template v-else-if="!isRenewal && !isGroup">
        <v-row no-gutters>
          <v-col cols="12">
            <v-row no-gutters>
              <v-col cols="12">
                <span class="summary-label"
                  >Facility Name (as it appears on the Community Care Assisted Living Act Licence)</span
                >
              </v-col>
              <v-col cols="12">
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
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" lg="6">
            <v-row no-gutters>
              <v-col cols="12">
                <span class="summary-label">Postal Code</span>
              </v-col>
              <v-col cols="12">
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
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col cols="12" lg="6">
            <v-row no-gutters>
              <v-col cols="12">
                <span class="summary-label">Facility Licence Number</span>
              </v-col>
              <v-col cols="12">
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
            </v-row>
          </v-col>
          <v-col cols="12" lg="6">
            <v-row no-gutters>
              <v-col cols="12">
                <span class="summary-label">Effective Date of Current Licence (YYYY-MM-DD)</span>
              </v-col>
              <v-col cols="12">
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
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col cols="12">
            <v-row no-gutters>
              <v-col cols="12">
                <span class="summary-label">
                  Has this facility or you as the applicant ever received funding under the Child Care Operating Funding
                  Program?
                </span>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  placeholder="Required"
                  :model-value="facilityInfo?.hasReceivedFunding?.toUpperCase()"
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
            <v-row v-if="facilityInfo?.hasReceivedFunding?.toUpperCase() === 'YES'" no-gutters>
              <v-col cols="12">
                <span class="summary-label">Facility Name</span>
              </v-col>
              <v-col cols="12">
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
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </template>
      <router-link v-if="!isValidForm" :to="isGroup ? routingPathGroup : routingPathFamily">
        <u class="text-error">To add this information, click here. This will bring you to a different page.</u>
      </router-link>
    </v-expansion-panel-text>
  </v-form>
</template>

<script>
import { isChangeRequest } from '@/utils/common.js';
import { PATHS, changeUrlGuid, pcfUrl, pcfUrlGuid } from '@/utils/constants.js';
import summaryMixin from '@/mixins/summaryMixin.js';

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
    yesNoFacilityLabel() {
      if (this.facilityInfo?.hasReceivedFunding?.toUpperCase() === 'YESFACILITY') {
        return 'YES AS FACILITY';
      }
      return this.facilityInfo?.hasReceivedFunding?.toUpperCase();
    },
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
  mounted() {
    this.$refs.facilitySummaryForm.validate();
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
