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
        <v-row no-gutters>
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
        </v-row>

        <template v-if="isPartnership">
          <div v-for="index in numberOfPartners" :key="index">
            <p class="summary-label pb-2">Partner {{ index }}</p>
            <v-row no-gutters>
              <v-col cols="12" md="4">
                <p class="summary-label">First Name</p>
                <v-text-field
                  placeholder="Required"
                  :model-value="summaryModel?.organization[`partner${index}FirstName`]"
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
                <p class="summary-label">Middle Name (if applicable)</p>
                <v-text-field
                  :model-value="summaryModel?.organization[`partner${index}MiddleName`] ?? EMPTY_PLACEHOLDER"
                  class="summary-value"
                  density="compact"
                  flat
                  variant="solo"
                  hide-details
                  readonly
                />
              </v-col>
              <v-col cols="12" md="4">
                <p class="summary-label">Last Name</p>
                <v-text-field
                  placeholder="Required"
                  :model-value="summaryModel?.organization[`partner${index}LastName`]"
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
          </div>
        </template>

        <v-row no-gutters>
          <v-col cols="12" md="8" class="pr-2">
            <p class="summary-label">{{ legalNameLabel }}</p>
            <p v-if="summaryModel?.organization?.legalName" class="py-2">{{ summaryModel?.organization?.legalName }}</p>
            <v-text-field
              v-else
              placeholder="Required"
              :model-value="summaryModel?.organization?.legalName"
              class="summary-value"
              density="compact"
              flat
              variant="solo"
              hide-details
              readonly
              :rules="rules.required"
            />
          </v-col>
          <v-col v-if="isPartnership" cols="12" md="4">
            <p class="summary-label">Doing Business As</p>
            <v-text-field
              placeholder="Required"
              class="summary-value"
              :model-value="summaryModel?.organization?.doingBusinessAs"
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
              summaryModel?.organization?.organizationType === ORGANIZATION_TYPES.NON_PROFIT_SOCIETY ||
              summaryModel?.organization?.organizationType === ORGANIZATION_TYPES.REGISTERED_COMPANY
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

        <v-row v-if="isSoleProprietorship" no-gutters>
          <v-col cols="12" md="4" class="pr-2">
            <p class="summary-label">Phone Number</p>
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
          <v-col cols="12" md="4" class="pr-2">
            <p class="summary-label">Email Address</p>
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
        </v-row>

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
        <div>
          <p class="summary-label">Organization Street Address</p>
          <v-text-field
            placeholder="Required"
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
              placeholder="Required"
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
              placeholder="Required"
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
              placeholder="Required"
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
        <template v-if="!isSoleProprietorship">
          <v-row no-gutters>
            <v-col cols="12" md="4">
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
            <v-col cols="12" md="4">
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
            <v-col cols="12" md="4" class="pr-2">
              <p class="summary-label">Phone Number of the Organization's Authorized Signing Authority</p>
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
            <v-col cols="12" md="4" class="pr-2">
              <p class="summary-label">Email Address of the Organization's Authorized Signing Authority</p>
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
          </v-row>
        </template>
        <div v-if="!isValidForm" class="mt-4">
          <router-link :to="routingPath">
            <u class="text-error">To add this information, click here. This will bring you to a different page.</u>
          </router-link>
        </div>
      </v-expansion-panel-text>
    </v-form>
  </v-row>
</template>
<script>
import summaryMixin from '@/mixins/summaryMixin.js';
import { getOrganizationNameLabel } from '@/utils/common.js';
import { PATHS, pcfUrl } from '@/utils/constants.js';

export default {
  name: 'OrganizationSummary',
  mixins: [summaryMixin],
  data() {
    return {
      isValidForm: false,
    };
  },
  computed: {
    routingPath() {
      return this.isGroup
        ? pcfUrl(PATHS.CCOF_GROUP_ORG, this.summaryModel?.application?.programYearId)
        : pcfUrl(PATHS.CCOF_FAMILY_ORG, this.summaryModel?.application?.programYearId);
    },
    legalNameLabel() {
      return getOrganizationNameLabel(this.summaryModel?.organization?.organizationType);
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
