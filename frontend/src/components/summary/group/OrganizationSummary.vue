<template>
  <v-row
    no-gutters
    class="d-flex flex-column"
  >
    <v-form
      ref="organizationSummaryForm"
      v-model="isValidForm"
    >
      <v-expansion-panel-title>
        <h4 style="color: #003466">
          Organization Information
          <v-icon
            v-if="isValidForm"
            color="green"
            size="large"
          >
            mdi-check-circle-outline
          </v-icon>
          <v-icon
            v-if="!isValidForm && !isProcessing"
            color="#ff5252"
            size="large"
          >
            mdi-alert-circle-outline
          </v-icon>
          <span
            v-if="!isValidForm && !isProcessing"
            style="color: #ff5252"
          >Your form is missing required information. Click here to view</span>
        </h4>
      </v-expansion-panel-title>
      <v-expansion-panel-text eager>
        <v-row
          no-gutters
          class="d-flex flex-column"
        >
          <v-row class="d-flex justify-start">
            <v-col
              cols="8"
              lg="6"
              class="pb-0 pt-0"
            >
              <v-row
                no-gutters
                class="d-flex justify-start"
              >
                <v-col
                  cols="12"
                  class="d-flex justify-start ml-3 pt-2"
                >
                  <span class="summary-label">Legal Name (first, middle and last) or Organization (As it appears in BC Corporate Registry)</span>
                </v-col>
                <v-col
                  cols="12"
                  class="d-flex justify-start"
                >
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
            </v-col>
          </v-row>
          <v-row class="d-flex justify-start">
            <v-col
              cols="6"
              lg="4"
              class="pb-0 pt-0"
            >
              <v-row
                no-gutters
                class="d-flex justify-start"
              >
                <v-col
                  cols="12"
                  class="d-flex justify-start ml-3"
                >
                  <span class="summary-label">Organization Mailing Address</span>
                </v-col>
                <v-col
                  cols="12"
                  class="d-flex justify-start"
                >
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
              </v-row>
            </v-col>
            <v-col
              v-if="summaryModel.application.organizationProviderType == 'GROUP'"
              cols="6"
              lg="4"
              class="pb-0 pt-0"
            >
              <v-row
                no-gutters
                class="d-flex justify-start"
              >
                <v-col
                  cols="12"
                  class="d-flex justify-start ml-3"
                >
                  <span class="summary-label">Organization Contact Name</span>
                </v-col>
                <v-col class="d-flex justify-start">
                  <v-text-field
                    placeholder="Required"
                    class=""
                    :model-value="summaryModel?.organization?.contactName"
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
            <v-col
              v-if="summaryModel.application.organizationProviderType == 'GROUP'"
              cols="6"
              lg="4"
              class="pb-0 pt-0"
            >
              <v-row
                no-gutters
                class="d-flex justify-start flex-column"
              >
                <v-col
                  cols="10"
                  class="d-flex justify-start ml-3"
                >
                  <span class="summary-label">Position</span>
                </v-col>
                <v-col class="d-flex justify-start">
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
            </v-col>
          </v-row>
          <v-row class="d-flex justify-start">
            <v-col
              cols="6"
              lg="4"
              class="pb-0 pt-0"
            >
              <v-row
                no-gutters
                class="d-flex justify-start"
              >
                <v-col
                  cols="5"
                  class="d-flex justify-start ml-3"
                >
                  <span class="summary-label">City/Town</span>
                </v-col>
                <v-col
                  cols="5"
                  class="d-flex justify-start"
                >
                  <span class="summary-label">Postal Code</span>
                </v-col>
                <v-col
                  cols="5"
                  class="d-flex justify-start"
                >
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
                <v-col
                  cols="5"
                  class="d-flex justify-start"
                >
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
            </v-col>
            <v-col
              cols="6"
              lg="4"
              class="pb-0 pt-0"
            >
              <v-row
                no-gutters
                class="d-flex justify-start"
              >
                <v-col
                  cols="12"
                  class="d-flex justify-start ml-3"
                >
                  <span class="summary-label">Business phone</span>
                </v-col>
                <v-col class="d-flex justify-start">
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
              </v-row>
            </v-col>
            <v-col
              cols="6"
              lg="4"
              class="pb-0 pt-0"
            >
              <v-row
                no-gutters
                class="d-flex justify-start"
              >
                <v-col
                  cols="12"
                  class="d-flex justify-start ml-3"
                >
                  <span class="summary-label">E-mail Address of Signing Authority</span>
                </v-col>
                <v-col class="d-flex justify-start">
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
            </v-col>
          </v-row>
          <v-row class="d-flex justify-start">
            <v-col
              cols="6"
              lg="4"
              class="pb-0 pt-0"
            >
              <v-row
                no-gutters
                class="d-flex justify-start"
              >
                <v-col
                  cols="12"
                  class="d-flex justify-start"
                >
                  <span class="summary-label ml-3">Provider Type</span>
                </v-col>
                <v-col class="d-flex justify-start">
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
            </v-col>
            <v-col
              cols="6"
              lg="4"
              class="pb-0 pt-0"
            >
              <v-row
                no-gutters
                class="d-flex justify-start"
              >
                <v-col
                  cols="12"
                  class="d-flex justify-start"
                >
                  <span class="summary-label ml-3">Type of Organization</span>
                </v-col>
                <v-col class="d-flex justify-start">
                  <v-text-field
                    placeholder="Required"
                    class="summary-value"
                    :model-value="getOrgTypeString()"
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
            <v-col
              cols="6"
              lg="4"
              class="pb-0 pt-0"
            >
              <v-row
                no-gutters
                class="d-flex justify-start"
              >
                <v-col
                  cols="12"
                  class="d-flex justify-start ml-3"
                >
                  <span class="summary-label">Business BCeID</span>
                </v-col>
                <v-col class="d-flex justify-start">
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
            </v-col>
            <v-col
              v-if="
                summaryModel?.organization?.organizationType == 100000000 ||
                  summaryModel?.organization?.organizationType == 100000002
              "
              cols="4"
              lg="3"
              class="pb-0 pt-0"
            >
              <v-row
                no-gutters
                class="d-flex justify-start"
              >
                <v-col
                  cols="12"
                  class="d-flex justify-start ml-3"
                >
                  <span class="summary-label">Incorporation Number</span>
                </v-col>
                <v-col class="d-flex justify-start">
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
            </v-col>
          </v-row>
          <v-row class="d-flex justify-start">
            <v-col
              cols="6"
              lg="4"
              class="pb-0 pt-0"
            >
              <v-row
                no-gutters
                class="d-flex justify-start"
              >
                <v-col
                  cols="12"
                  class="d-flex justify-start ml-3"
                >
                  <span class="summary-label">Organization Street Address</span>
                </v-col>
                <v-col class="d-flex justify-start">
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
              <v-row
                no-gutters
                class="d-flex justify-start"
              >
                <v-col
                  cols="5"
                  class="d-flex justify-start ml-3"
                >
                  <span class="summary-label">City/Town</span>
                </v-col>
                <v-col
                  cols="5"
                  class="d-flex justify-start"
                >
                  <span class="summary-label">Postal Code</span>
                </v-col>
                <v-col
                  cols="5"
                  class="d-flex justify-start"
                >
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
                <v-col
                  cols="5"
                  class="d-flex justify-start"
                >
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
            </v-col>
          </v-row>
        </v-row>
        <v-row
          v-if="!isValidForm"
          class="d-flex justify-start"
        >
          <v-col
            cols="6"
            lg="4"
            class="pb-0 pt-0"
          >
            <v-row
              no-gutters
              class="d-flex justify-start"
            >
              <v-col
                cols="12"
                class="d-flex justify-start"
              >
                <router-link :to="getRoutingPath()">
                  <span style="color: #ff5252; text-underline: black"><u>To add this information, click here. This will bring you to a different page.</u></span>
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
import rules from '../../../utils/rules.js';
import { PATHS, pcfUrl } from '../../../utils/constants.js';

export default {
  name: 'OrganizationSummary',
  props: {
    programYear: {
      type: String,
      required: true,
    },
    summaryModel: {
      type: Object,
      required: true,
    },
    isProcessing: {
      type: Boolean,
      required: false,
    },
    programYearId: {
      type: String,
      required: false,
    },
  },
  computed: {
    ...mapState('auth', ['userInfo']),
    ...mapState('summaryDeclaration', ['isLoadingComplete']),
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
  methods: {
    getRoutingPath() {
      if (this.summaryModel.application.organizationProviderType == 'FAMILY') {
        return pcfUrl(PATHS.CCOF_FAMILY_ORG, this.programYearId);
      } else {
        return pcfUrl(PATHS.CCOF_GROUP_ORG, this.programYearId);
      }
    },
    getOrgTypeString() {
      switch (this.summaryModel?.organization?.organizationType) {
      case !this.summaryModel?.organization?.organizationType:
        return '';
      case 100000000:
        return 'Non-Profit Society';
      case 100000001:
        return 'Public Institution(college/university)';
      case 100000002:
        return 'Registered Company';
      case 100000003:
        return 'Local Government';
      case 100000004:
        return 'First Nations Government';
      case 100000005:
        return 'Sole Proprietorship or Partnership';
      default:
        return '';
      }
    },
  },
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

>>> .summary-value .v-label {
  color: #ff5252;
  opacity: 1;
}

>>> ::placeholder {
  color: red !important;
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
</style>
