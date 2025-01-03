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
            placeholder="--"
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
        <h4 style="color: #003466">
          Facility Information
          <v-icon v-if="isValidForm" color="green" size="large"> mdi-check-circle-outline </v-icon>
          <v-icon v-if="!isValidForm" color="#ff5252" size="large"> mdi-alert-circle-outline </v-icon>
          <span v-if="!isValidForm" style="color: #ff5252"
            >Your form is missing required information. Click here to view.</span
          >
        </h4>
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
        <v-row v-if="!isValidForm" no-gutters>
          <!-- ccof base funding CAN be undefined if new app, so send them to page before if that is the case.  -->
          <router-link :to="getRoutingPathGroup()">
            <span style="color: #ff5252; text-underline: black">
              <u>To add this information, click here. This will bring you to a different page.</u>
            </span>
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
          <v-icon v-if="!isValidForm" color="#ff5252" size="large"> mdi-alert-circle-outline </v-icon>
          <span v-if="!isValidForm" style="color: #ff5252"
            >Your form is missing required information. Click here to view.</span
          >
        </h4>
      </v-expansion-panel-title>
      <v-expansion-panel-text eager class="exp-style">
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
        <v-row v-if="!isValidForm" no-gutters>
          <v-col cols="6" lg="4">
            <v-row no-gutters>
              <v-col cols="12">
                <!-- ccof base funding CAN be undefined if new app, so send them to page before if that is the case.  -->

                <router-link :to="getRoutingPathFamily()">
                  <span style="color: #ff5252; text-underline: black"
                    ><u>To add this information, click here. This will bring you to a different page.</u></span
                  >
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
      PATHS,
      rules,
      isValidForm: true,
      legal: null,
      formObj: {
        formName: 'FacilityInformationSummary',
        formId: this.facilityId,
      },
    };
  },
  computed: {
    ...mapState(useApplicationStore, ['isRenewal']),
    ...mapState(useNavBarStore, ['navBarList']),
    ...mapState(useOrganizationStore, ['organizationProviderType']),
    ...mapState(useSummaryDeclarationStore, ['summaryModel', 'isLoadingComplete']),
    yesNoFacilityLabel() {
      if (this.facilityInfo?.hasReceivedFunding?.toUpperCase() === 'YESFACILITY') {
        return 'YES AS FACILITY';
      }
      return this.facilityInfo?.hasReceivedFunding?.toUpperCase();
    },
  },
  watch: {
    isLoadingComplete: {
      handler: function (val) {
        if (val) {
          this.$emit('isSummaryValid', this.formObj, this.isValidForm);
        }
      },
    },
  },
  created() {
    this.ORGANIZATION_PROVIDER_TYPES = ORGANIZATION_PROVIDER_TYPES;
  },
  methods: {
    ...mapActions(useSummaryDeclarationStore, ['setIsLoadingComplete']),
    getOptInOptOut(status) {
      if (status === 1) {
        return 'Opt-In';
      } else if (status === 0) {
        return 'Opt-Out';
      } else {
        return '';
      }
    },
    calculateTotal() {
      let total = 0;
      total =
        this.funding.monday +
        this.funding.tusday +
        this.funding.wednesday +
        this.funding.thursday +
        this.funding.friday;
      return total;
    },
    getRoutingPathGroup() {
      if (isChangeRequest(this)) {
        return changeUrlGuid(PATHS.CCOF_GROUP_FACILITY, this.changeRecGuid, this.facilityId);
      } else {
        return pcfUrlGuid(PATHS.CCOF_GROUP_FACILITY, this.programYearId, this.facilityId);
      }
    },
    getRoutingPathFamily() {
      if (!this.funding.ccofBaseFundingId) {
        return pcfUrl(PATHS.CCOF_FAMILY_ORG, this.programYearId);
      } else {
        return pcfUrlGuid(PATHS.CCOF_FAMILY_ELIGIBILITY, this.programYearId, this.facilityId);
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

.facility-info {
  border-top: 5px solid grey !important;
}

:deep(.v-field__input) {
  padding-left: 0px;
}
</style>
