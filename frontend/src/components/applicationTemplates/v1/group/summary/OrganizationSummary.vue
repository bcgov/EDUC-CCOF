<!--
* NOTE (vietle-cgi):  
* This file contains **legacy code** from the previous application layout, which was deprecated and replaced as of March 2025.  
* **DO NOT modify this file** to maintain compatibility with submitted PCF application/change request.
*  
* Source: Copied from commit 59d5425 on Dec 19, 2024 with some minor changes.
-->
<template>
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
        <p class="summary-label">
          Legal Name (first, middle and last) or Organization (As it appears in BC Corporate Registry)
        </p>
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
      </div>

      <div>
        <p class="summary-label">Organization Mailing Address</p>
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
      </div>

      <v-row
        v-if="summaryModel?.application?.organizationProviderType === ORGANIZATION_PROVIDER_TYPES.GROUP"
        no-gutters
      >
        <v-col cols="12" md="6">
          <p class="summary-label">Organization Contact Name</p>
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
          <p class="summary-label">Position</p>
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
      </v-row>
      <v-row no-gutters>
        <v-col cols="12" md="4">
          <p class="summary-label">City/Town</p>
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
          <p class="summary-label">Province</p>
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
          <p class="summary-label">Postal Code</p>
          <v-text-field
            placeholder="Required"
            class="summary-value"
            :model-value="summaryModel?.organization?.postalCode1"
            density="compact"
            flat
            variant="solo"
            :hide-details="isNullOrBlank(summaryModel?.organization?.postalCode1) || isValidForm"
            readonly
            :rules="[...rules.required, ...rules.postalCode]"
          />
        </v-col>
      </v-row>

      <v-row no-gutters>
        <v-col cols="12" md="4">
          <p class="summary-label">Business phone</p>
          <v-text-field
            placeholder="Required"
            class="summary-value"
            :model-value="summaryModel?.organization?.phone"
            density="compact"
            flat
            variant="solo"
            :hide-details="isNullOrBlank(summaryModel?.organization?.phone) || isValidForm"
            readonly
            :rules="[...rules.required, rules.phone]"
          />
        </v-col>
        <v-col cols="12" md="4">
          <p class="summary-label">E-mail Address of Signing Authority</p>
          <v-text-field
            placeholder="Required"
            class="summary-value"
            :model-value="summaryModel?.organization?.email"
            density="compact"
            flat
            variant="solo"
            :hide-details="isNullOrBlank(summaryModel?.organization?.email) || isValidForm"
            readonly
            :rules="[...rules.required, ...rules.email]"
          />
        </v-col>
      </v-row>

      <v-row no-gutters>
        <v-col cols="12" md="4">
          <p class="summary-label">Provider Type</p>
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
          <p class="summary-label">Type of Organization</p>
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
          <p class="summary-label">Business BCeID</p>
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
          <p class="summary-label">Incorporation Number</p>
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
      <div>
        <p class="summary-label">Organization Street Address</p>
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
      </div>
      <v-row no-gutters>
        <v-col cols="12" md="4">
          <p class="summary-label">City/Town</p>
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
          <p class="summary-label">Province</p>
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
          <p class="summary-label">Postal Code</p>
          <v-text-field
            class="summary-value"
            :model-value="summaryModel?.organization?.postalCode2"
            :rules="[...rules.required, ...rules.postalCode]"
            density="compact"
            flat
            variant="solo"
            :hide-details="isNullOrBlank(summaryModel?.organization?.postalCode2) || isValidForm"
            readonly
          />
        </v-col>
      </v-row>
      <div v-if="!isValidForm" class="mt-4">
        <router-link :to="routingPath">
          <u class="text-error">To add this information, click here. This will bring you to a different page.</u>
        </router-link>
      </div>
    </v-expansion-panel-text>
  </v-form>
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
  mounted() {
    this.$refs.organizationSummaryForm.validate();
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
</style>
