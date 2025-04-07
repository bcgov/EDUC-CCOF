<!--
* NOTE (vietle-cgi):  
* This file contains **legacy code** from the previous application layout, which was deprecated and replaced as of March 2025.  
* **DO NOT modify this file** to maintain compatibility with submitted PCF application/change request.
*  
* Source: Copied from commit 59d5425 on Dec 19, 2024 with some minor changes.
-->
<template>
  <v-row no-gutters class="d-flex flex-column">
    <v-form ref="organizationSummaryForm" v-model="isValidForm">
      <v-expansion-panel-title>
        <SummaryExpansionPanelTitle
          title="Organization Information"
          :loading="isApplicationProcessing"
          :is-complete="isValidForm"
        />
      </v-expansion-panel-title>
      <v-expansion-panel-text eager>
        <div>
          <v-row no-gutters>
            <v-col cols="12">
              <div class="summary-label">
                Legal Name (first, middle and last) or Organization (As it appears in BC Corporate Registry)
              </div>
              <v-text-field
                placeholder="Required"
                :model-value="summaryModel?.organization?.legalName"
                class=""
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
              <div class="summary-label">Organization Mailing Address</div>
              <v-text-field
                placeholder="Required"
                class="summary-value"
                :model-value="summaryModel?.organization?.address1"
                density="compact"
                flat
                variant="solo"
                hide-details
                readonly
                :rules="rules.required"
              />
            </v-col>
            <template v-if="summaryModel?.application?.organizationProviderType === ORGANIZATION_PROVIDER_TYPES.GROUP">
              <v-col cols="12" md="6">
                <div class="summary-label">Organization Contact Name</div>
                <v-text-field
                  placeholder="Required"
                  :model-value="summaryModel?.organization?.contactName"
                  density="compact"
                  flat
                  variant="solo"
                  hide-details
                  readonly
                  :rules="rules.required"
                />
              </v-col>
              <v-col cols="12" md="6">
                <div class="summary-label">Position</div>
                <v-text-field
                  placeholder="Required"
                  class="summary-value"
                  :model-value="summaryModel?.organization?.position"
                  density="compact"
                  flat
                  variant="solo"
                  hide-details
                  readonly
                  :rules="rules.required"
                />
              </v-col>
            </template>
          </v-row>
          <v-row no-gutters>
            <v-col cols="12" md="4">
              <div class="summary-label">City/Town</div>
              <v-text-field
                placeholder="Required"
                class="summary-value"
                :model-value="summaryModel?.organization?.city1"
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
                class="summary-value"
                :model-value="summaryModel?.organization?.province1"
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
                class="summary-value"
                :model-value="summaryModel?.organization?.postalCode1"
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
              <div class="summary-label">Business phone</div>
              <v-text-field
                placeholder="Required"
                class="summary-value"
                :model-value="summaryModel?.organization?.phone"
                density="compact"
                flat
                variant="solo"
                hide-details
                readonly
                :rules="rules.required"
              />
            </v-col>
            <v-col cols="12" md="4">
              <div class="summary-label">E-mail Address of Signing Authority</div>
              <v-text-field
                placeholder="Required"
                class="summary-value"
                :model-value="summaryModel?.organization?.email"
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
              <div class="summary-label">Provider Type</div>
              <v-text-field
                placeholder="Required"
                class="summary-value"
                :model-value="summaryModel?.application?.organizationProviderType"
                density="compact"
                flat
                variant="solo"
                hide-details
                readonly
                :rules="rules.required"
              />
            </v-col>
            <v-col cols="12" md="4">
              <div class="summary-label">Type of Organization</div>
              <v-text-field
                placeholder="Required"
                class="summary-value"
                :model-value="organizationType"
                density="compact"
                flat
                variant="solo"
                hide-details
                readonly
                :rules="rules.required"
              />
            </v-col>
            <v-col cols="12" md="4">
              <div class="summary-label">Business BCeID</div>
              <v-text-field
                placeholder="Required"
                class="summary-value"
                :model-value="userInfo.userName"
                density="compact"
                flat
                variant="solo"
                hide-details
                readonly
                :rules="rules.required"
              />
            </v-col>
            <v-col
              v-if="
                summaryModel?.organization?.organizationType == ORGANIZATION_TYPES.NON_PROFIT_SOCIETY ||
                summaryModel?.organization?.organizationType == ORGANIZATION_TYPES.REGISTERED_COMPANY
              "
              cols="12"
              md="4"
            >
              <div class="summary-label">Incorporation Number</div>
              <v-text-field
                placeholder="Required"
                class="summary-value"
                :model-value="summaryModel?.organization?.incNumber"
                density="compact"
                flat
                variant="solo"
                hide-details
                readonly
                :rules="rules.required"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <div class="summary-label">Organization Street Address</div>
              <v-text-field
                class="summary-value"
                :model-value="summaryModel?.organization?.address2"
                :rules="rules.required"
                density="compact"
                flat
                variant="solo"
                hide-details
                readonly
              />
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col cols="12" md="4">
              <div class="summary-label">City/Town</div>
              <v-text-field
                class="summary-value"
                :model-value="summaryModel?.organization?.city2"
                :rules="rules.required"
                density="compact"
                flat
                variant="solo"
                hide-details
                readonly
              />
            </v-col>
            <v-col cols="12" md="4">
              <div class="summary-label">Province</div>
              <v-text-field
                class="summary-value"
                :model-value="summaryModel?.organization?.province2"
                :rules="rules.required"
                density="compact"
                flat
                variant="solo"
                hide-details
                readonly
              />
            </v-col>
            <v-col cols="12" md="4">
              <div class="summary-label">Postal Code</div>
              <v-text-field
                class="summary-value"
                :model-value="summaryModel?.organization?.postalCode2"
                :rules="rules.required"
                density="compact"
                flat
                variant="solo"
                hide-details
                readonly
              />
            </v-col>
          </v-row>
        </div>
        <router-link v-if="!isValidForm" :to="routingPath">
          <u class="text-error">To add this information, click here. This will bring you to a different page.</u>
        </router-link>
      </v-expansion-panel-text>
    </v-form>
  </v-row>
</template>
<script>
import summaryMixin from '@/mixins/summaryMixin.js';
import { PATHS, pcfUrl } from '@/utils/constants.js';

export default {
  name: 'OrganizationSummary',
  mixins: [summaryMixin],
  data() {
    return {
      isValidForm: true,
    };
  },
  computed: {
    routingPath() {
      return this.isGroup
        ? pcfUrl(PATHS.CCOF_GROUP_ORG, this.summaryModel?.application?.programYearId)
        : pcfUrl(PATHS.CCOF_FAMILY_ORG, this.summaryModel?.application?.programYearId);
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
  color: black !important;
}

*:disabled {
  background-color: dimgrey !important;
  color: red !important;
  opacity: 1 !important;
}

:deep(::placeholder) {
  color: red !important;
  opacity: 1 !important;
}

.summary-label-smaller {
  color: grey;
  font-size: x-small;
}

.summary-label-bold {
  color: black;
  font-size: small;
  font-style: initial;
}

.summary-value-small {
  color: black;
  font-size: small;
  font-weight: bold;
}

:deep(.v-field__input) {
  padding-left: 0px;
}
</style>
