<template>
  <v-row no-gutters class="d-flex flex-column">
    <v-card class="facility-info pa-4 pb-2">
      <v-row no-gutters>
        <v-col cols="12">
          <div class="summary-label">Facility Name</div>
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
        <v-col cols="12" md="3">
          <div class="summary-label">Facility ID</div>
          <!-- Facility ID is assigned in dynamics, and may not exist as far as I know, so no required is implemented here -- JB -->
          <v-text-field
            :model-value="facilityInfo?.facilityAccountNumber"
            class="summary-value"
            density="compact"
            flat
            variant="solo"
            hide-details
            readonly
          />
        </v-col>
        <v-col cols="12" md="3">
          <div class="summary-label">Licence Number</div>
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
      <v-row no-gutters>
        <v-col cols="12" md="6">
          <div class="summary-label">Licence Categories</div>
          <!-- change below value to :value -->
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
        </v-col>
        <v-col cols="12" md="3">
          <div class="summary-label">CCFRI</div>
          <v-text-field
            placeholder="Required"
            :model-value="getOptInOptOut(ccfriStatus)"
            class="summary-value"
            density="compact"
            flat
            variant="solo"
            hide-details
            readonly
            :rules="rules.required"
          />
        </v-col>
        <v-col cols="12" md="3">
          <div class="summary-label">ECE-WE</div>
          <v-text-field
            placeholder="Required"
            :model-value="getOptInOptOut(eceweStatus)"
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
    </v-card>

    <!-- JB here to make this work with renewels-->
    <v-form
      v-if="(!isRenewal && organizationProviderType === ORGANIZATION_PROVIDER_TYPES.GROUP) || isChangeRequest"
      ref="informationSummaryForm"
      v-model="isValidForm"
    >
      <v-expansion-panel-title>
        <SummaryExpansionPanelTitle title="Facility Information" :is-complete="isValidForm" />
      </v-expansion-panel-title>
      <v-expansion-panel-text eager class="exp-style">
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
              :hide-details="isNullOrBlank(facilityInfo?.yearBeganOperation) || isValidForm"
              readonly
              :rules="[...rules.required, ...rules.YYYY]"
            />
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col cols="12">
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
        </v-row>
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
              :rules="[...rules.required, rules.equalTo('BC', 'Facilities must be located within BC')]"
              :hide-details="isNullOrBlank(facilityInfo?.province) || isValidForm"
              readonly
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
              :hide-details="isNullOrBlank(facilityInfo?.postalCode) || isValidForm"
              readonly
              :rules="[...rules.required, ...rules.postalCode]"
            />
          </v-col>
        </v-row>
        <v-row no-gutters>
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
                <div class="summary-label">Facility Phone Number</div>
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
                <div class="summary-label">Facility Email Address</div>
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
              <v-col cols="12" md="4">
                <div class="summary-label">Health Authority</div>
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
        <v-row v-if="!isValidForm" no-gutters>
          <!-- ccof base funding CAN be undefined if new app, so send them to page before if that is the case.  -->
          <router-link :to="routingPathGroup">
            <u class="text-error">To add this information, click here. This will bring you to a different page.</u>
          </router-link>
        </v-row>
      </v-expansion-panel-text>
    </v-form>

    <v-form
      v-else-if="!isRenewal && providerType === ORGANIZATION_PROVIDER_TYPES.FAMILY"
      ref="informationSummaryForm"
      v-model="isValidForm"
    >
      <v-expansion-panel-title>
        <h4 style="color: #003466">
          Facility Information
          <v-icon v-if="isValidForm" color="green" size="large"> mdi-check-circle-outline </v-icon>
          <v-icon v-if="!isValidForm" class="text-error" size="large"> mdi-alert-circle-outline </v-icon>
          <span v-if="!isValidForm" class="text-error">Your form is missing required information. Click to view.</span>
        </h4>
      </v-expansion-panel-title>
      <v-expansion-panel-text eager class="exp-style">
        <v-row no-gutters>
          <v-col cols="12">
            <v-row no-gutters>
              <v-col cols="12">
                <span class="summary-label">
                  Facility Name (as it appears on the Community Care Assisted Living Act Licence)
                </span>
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
        <v-row v-if="!isValidForm" no-gutters>
          <v-col cols="6" lg="4">
            <v-row no-gutters>
              <v-col cols="12">
                <!-- ccof base funding CAN be undefined if new app, so send them to page before if that is the case.  -->

                <router-link :to="routingPathFamily">
                  <u class="text-error">
                    To add this information, click here. This will bring you to a different page.
                  </u>
                </router-link>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-expansion-panel-text>
    </v-form>
  </v-row>
</template>

<script>
import { mapState } from 'pinia';
import SummaryExpansionPanelTitle from '@/components/guiComponents/SummaryExpansionPanelTitle.vue';
import { useAppStore } from '@/store/app.js';
import { useSummaryDeclarationStore } from '@/store/summaryDeclaration.js';
import { useApplicationStore } from '@/store/application.js';
import { useOrganizationStore } from '@/store/ccof/organization.js';
import { isChangeRequest, isNullOrBlank } from '@/utils/common.js';
import { PATHS, changeUrlGuid, pcfUrl, pcfUrlGuid, ORGANIZATION_PROVIDER_TYPES } from '@/utils/constants.js';
import rules from '@/utils/rules.js';

export default {
  components: { SummaryExpansionPanelTitle },
  props: {
    facilityInfo: {
      type: Object,
      required: true,
    },
    facilityId: {
      type: String,
      required: true,
    },
    ccfriStatus: {
      type: Number,
      required: false,
      default: 0,
    },
    eceweStatus: {
      type: Number,
      required: false,
      default: 0,
    },
    licenseCategories: {
      type: String,
      required: false,
      default: '',
    },
    funding: {
      type: Object,
      required: false,
      default: () => ({}),
    },
    providerType: {
      type: String,
      required: false,
      default: '',
    },
    changeRecGuid: {
      type: String,
      required: false,
      default: '',
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
      isChangeRequest: isChangeRequest(this),
      isValidForm: true,
      formObj: {
        formName: 'FacilityInformationSummary',
        formId: this.facilityId,
      },
    };
  },
  computed: {
    ...mapState(useAppStore, ['getHealthAuthorityNameById']),
    ...mapState(useApplicationStore, ['isRenewal']),
    ...mapState(useOrganizationStore, ['organizationProviderType']),
    ...mapState(useSummaryDeclarationStore, ['isLoadingComplete']),
    yesNoFacilityLabel() {
      return this.facilityInfo?.hasReceivedFunding?.toUpperCase() === 'YESFACILITY'
        ? 'YES AS FACILITY'
        : this.facilityInfo?.hasReceivedFunding?.toUpperCase();
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
  watch: {
    isValidForm: {
      handler() {
        this.$refs?.informationSummaryForm.validate();
        if (this.isLoadingComplete && this.isValidForm !== null) {
          this.$emit('isSummaryValid', this.formObj, this.isValidForm);
        }
      },
    },
  },
  created() {
    this.ORGANIZATION_PROVIDER_TYPES = ORGANIZATION_PROVIDER_TYPES;
    this.PATHS = PATHS;
    this.rules = rules;
  },
  methods: {
    isNullOrBlank,
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
  color: #d8292f !important;
  opacity: 1 !important;
}

.summary-label-smaller {
  color: grey;
  font-size: x-small;
}

.facility-info {
  border-top: 5px solid grey !important;
}

:deep(.v-field__input) {
  padding-left: 0px;
}

:deep(.v-input__details) {
  padding-left: 0;
}
</style>
