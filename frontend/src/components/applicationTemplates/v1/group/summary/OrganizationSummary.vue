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
        <h4 style="color: #003466">
          Organization Information
          <v-icon v-if="isValidForm" color="green" size="large"> mdi-check-circle-outline </v-icon>
          <v-icon v-if="!isValidForm && !isProcessing" color="#ff5252" size="large"> mdi-alert-circle-outline </v-icon>
          <span v-if="!isValidForm && !isProcessing" style="color: #ff5252"
            >Your form is missing required information. Click here to view</span
          >
        </h4>
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
                summaryModel?.organization?.organizationType == 100000000 ||
                summaryModel?.organization?.organizationType == 100000002
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
        <div v-if="!isValidForm">
          <router-link :to="routingPath">
            <span style="color: #ff5252; text-underline: black">
              <u>To add this information, click here. This will bring you to a different page.</u>
            </span>
          </router-link>
        </div>
      </v-expansion-panel-text>
    </v-form>
  </v-row>
</template>
<script>
import { mapState } from 'pinia';
import { useAuthStore } from '@/store/auth';
import { useSummaryDeclarationStore } from '@/store/summaryDeclaration';
import rules from '@/utils/rules.js';
import { PATHS, pcfUrl, ORGANIZATION_PROVIDER_TYPES, ORGANIZATION_TYPES } from '@/utils/constants.js';

export default {
  name: 'OrganizationSummary',
  props: {
    programYear: {
      type: String,
      required: true,
    },
    isProcessing: {
      type: Boolean,
      required: false,
    },
    programYearId: {
      type: String,
      required: false,
      default: '',
    },
  },
  emits: ['isSummaryValid'],
  data() {
    return {
      PATHS,
      rules,
      legalName: null,
      isValidForm: true,
      formObj: {
        formName: 'OrganizationSummary',
        formId: this.summaryModel?.application?.organizationId,
      },
    };
  },
  computed: {
    ...mapState(useAuthStore, ['userInfo']),
    ...mapState(useSummaryDeclarationStore, ['isLoadingComplete', 'summaryModel']),
    organizationType() {
      switch (this.summaryModel?.organization?.organizationType) {
        case ORGANIZATION_TYPES.NON_PROFIT_SOCIETY:
          return 'Non-Profit Society';
        case ORGANIZATION_TYPES.PUBLIC_INSTITUTION:
          return 'Public Institution(college/university)';
        case ORGANIZATION_TYPES.REGISTERED_COMPANY:
          return 'Registered Company';
        case ORGANIZATION_TYPES.LOCAL_GOVERNMENT:
          return 'Local Government';
        case ORGANIZATION_TYPES.FIRST_NATIONS_GOVERNMENT:
          return 'First Nations Government';
        case ORGANIZATION_TYPES.SOLE_PROPRIETORSHIP_PARTNERSHIP:
          return 'Sole Proprietorship or Partnership';
        default:
          return '';
      }
    },
    routingPath() {
      return this.summaryModel?.application?.organizationProviderType === ORGANIZATION_PROVIDER_TYPES.GROUP
        ? pcfUrl(PATHS.CCOF_GROUP_ORG, this.programYearId)
        : pcfUrl(PATHS.CCOF_FAMILY_ORG, this.programYearId);
    },
  },
  watch: {
    isValidForm: {
      handler() {
        this.$refs.organizationSummaryForm.validate();
        if (this.isLoadingComplete && this.isValidForm !== null) {
          this.$emit('isSummaryValid', this.formObj, this.isValidForm);
        }
      },
    },
  },
  created() {
    this.ORGANIZATION_PROVIDER_TYPES = ORGANIZATION_PROVIDER_TYPES;
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
