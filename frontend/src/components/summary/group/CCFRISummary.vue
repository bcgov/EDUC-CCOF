<template>
  <v-form ref="ccfriSummaryForm" v-model="isValidForm">
    <v-expansion-panel-title>
      <SummaryExpansionPanelTitle title="Child Care Fee Reduction Initiative (CCFRI)" :is-complete="isValidForm" />
    </v-expansion-panel-title>
    <v-expansion-panel-text eager>
      <template v-if="!ccfri?.ccfriOptInStatus">
        <span cols="12" class="summary-label">CCFRI Opt-In/Opt-Out Status:</span>
        <v-text-field
          cols="12"
          placeholder="Required"
          class="summary-value"
          :model-value="getOptInOptOut(ccfri?.ccfriOptInStatus)"
          density="compact"
          flat
          variant="solo"
          hide-details
          readonly
          :rules="rules.required"
        >
        </v-text-field>
      </template>
      <template v-else>
        <div v-for="(ccType, index) in ccfri?.childCareTypes" :key="index">
          <v-row no-gutters>
            <span v-if="!!ccType.programYear && !!ccType.childCareCategory" class="summary-label pt-3">
              {{ generateProgYearText(ccType.programYear, ccType.childCareCategory) }}
            </span>
            <v-text-field
              v-else
              placeholder="Required"
              :model-value="generateProgYearText(ccType.programYear, ccType.childCareCategory)"
              class="summary-label"
              density="compact"
              flat
              variant="solo"
              hide-details
              readonly
              :rules="rules.required"
              prefix="Parent Fees"
            />
            <v-text-field
              placeholder="Required"
              :model-value="ccType.feeFrequency"
              class="summary-value"
              density="compact"
              flat
              variant="solo"
              hide-details
              readonly
              :rules="rules.required"
            />
          </v-row>
          <div>
            <span v-if="!!ccType.feeFrequency" class="summary-label">
              Your <b>highest {{ ccType.feeFrequency.toLowerCase() }} parent fee before CCFRI is applied</b> in every
              month below.
            </span>
            <v-text-field
              v-else
              placeholder="Required"
              :model-value="ccType.feeFrequency"
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
            <v-col cols="12" sm="6" md="4" lg="2" class="d-flex">
              <span class="summary-label pt-3">Apr:</span>
              <v-text-field
                placeholder="Required"
                :model-value="ccType.approvedFeeApr"
                class="summary-value"
                density="compact"
                flat
                variant="solo"
                hide-details
                readonly
                :rules="rules.required"
                prefix="$"
              />
            </v-col>
            <v-col cols="12" sm="6" md="4" lg="2" class="d-flex">
              <span class="summary-label pt-3">May:</span>
              <v-text-field
                placeholder="Required"
                :model-value="ccType.approvedFeeMay"
                class="summary-value"
                density="compact"
                flat
                variant="solo"
                hide-details
                readonly
                :rules="rules.required"
                prefix="$"
              />
            </v-col>
            <v-col cols="12" sm="6" md="4" lg="2" class="d-flex">
              <span class="summary-label pt-3">Jun:</span>
              <v-text-field
                placeholder="Required"
                :model-value="ccType.approvedFeeJun"
                class="summary-value"
                density="compact"
                flat
                variant="solo"
                hide-details
                readonly
                :rules="rules.required"
                prefix="$"
              />
            </v-col>
            <v-col cols="12" sm="6" md="4" lg="2" class="d-flex">
              <span class="summary-label pt-3">Jul:</span>
              <v-text-field
                placeholder="Required"
                :model-value="ccType.approvedFeeJul"
                class="summary-value"
                density="compact"
                flat
                variant="solo"
                hide-details
                readonly
                :rules="rules.required"
                prefix="$"
              />
            </v-col>
            <v-col cols="12" sm="6" md="4" lg="2" class="d-flex">
              <span class="summary-label pt-3">Aug:</span>
              <v-text-field
                placeholder="Required"
                :model-value="ccType.approvedFeeAug"
                class="summary-value"
                density="compact"
                flat
                variant="solo"
                hide-details
                readonly
                :rules="rules.required"
                prefix="$"
              />
            </v-col>
            <v-col cols="12" sm="6" md="4" lg="2" class="d-flex">
              <span class="summary-label pt-3">Sep:</span>
              <v-text-field
                placeholder="Required"
                :model-value="ccType.approvedFeeSep"
                class="summary-value"
                density="compact"
                flat
                variant="solo"
                hide-details
                readonly
                :rules="rules.required"
                prefix="$"
              />
            </v-col>
            <v-col cols="12" sm="6" md="4" lg="2" class="d-flex">
              <span class="summary-label pt-3">Oct:</span>
              <v-text-field
                placeholder="Required"
                :model-value="ccType.approvedFeeOct"
                class="summary-value"
                density="compact"
                flat
                variant="solo"
                hide-details
                readonly
                :rules="rules.required"
                prefix="$"
              />
            </v-col>
            <v-col cols="12" sm="6" md="4" lg="2" class="d-flex">
              <span class="summary-label pt-3">Nov:</span>
              <v-text-field
                placeholder="Required"
                :model-value="ccType.approvedFeeNov"
                class="summary-value"
                density="compact"
                flat
                variant="solo"
                hide-details
                readonly
                :rules="rules.required"
                prefix="$"
              />
            </v-col>
            <v-col cols="12" sm="6" md="4" lg="2" class="d-flex">
              <span class="summary-label pt-3">Dec:</span>
              <v-text-field
                placeholder="Required"
                :model-value="ccType.approvedFeeDec"
                class="summary-value"
                density="compact"
                flat
                variant="solo"
                hide-details
                readonly
                :rules="rules.required"
                prefix="$"
              />
            </v-col>
            <v-col cols="12" sm="6" md="4" lg="2" class="d-flex">
              <span class="summary-label pt-3">Jan:</span>
              <v-text-field
                placeholder="Required"
                :model-value="ccType.approvedFeeJan"
                class="summary-value"
                density="compact"
                flat
                variant="solo"
                hide-details
                readonly
                :rules="rules.required"
                prefix="$"
              />
            </v-col>
            <v-col cols="12" sm="6" md="4" lg="2" class="d-flex">
              <span class="summary-label pt-3">Feb:</span>
              <v-text-field
                placeholder="Required"
                :model-value="ccType.approvedFeeFeb"
                class="summary-value"
                density="compact"
                flat
                variant="solo"
                hide-details
                readonly
                :rules="rules.required"
                prefix="$"
              />
            </v-col>
            <v-col cols="12" sm="6" md="4" lg="2" class="d-flex">
              <span class="summary-label pt-3">Mar:</span>
              <v-text-field
                placeholder="Required"
                :model-value="ccType.approvedFeeMar"
                class="summary-value"
                density="compact"
                flat
                variant="solo"
                hide-details
                readonly
                :rules="rules.required"
                prefix="$"
              />
            </v-col>
          </v-row>
        </div>

        <div class="mt-4 mb-6">
          <div>
            <span class="summary-label">
              Do you charge parent fees at this facility to any closures on business days (other than statutory
              holidays)
            </span>
            <v-text-field
              placeholder="Required"
              :model-value="getYesNoValue(ccfri.hasClosureFees)"
              class="summary-value"
              density="compact"
              flat
              variant="solo"
              hide-details
              readonly
              :rules="rules.required"
            />
          </div>

          <template v-if="ccfri.hasClosureFees === CCFRI_HAS_CLOSURE_FEE_TYPES.YES">
            <v-text-field
              v-if="ccfri.dates.length === 0"
              placeholder="Required"
              density="compact"
              flat
              variant="solo"
              hide-details
              :rules="rules.required"
              readonly
            />
            <v-data-table
              v-else
              :headers="closureTableHeaders"
              :items="ccfri.dates"
              :mobile="null"
              mobile-breakpoint="md"
              class="elevation-2"
            >
              <template #[`item.formattedStartDate`]="{ item }">
                <v-text-field
                  v-model="item.formattedStartDate"
                  placeholder="Required"
                  density="compact"
                  flat
                  variant="solo"
                  hide-details
                  :rules="rules.required"
                  readonly
                  class="no-padding-left"
                />
              </template>
              <template #[`item.formattedEndDate`]="{ item }">
                <v-text-field
                  v-model="item.formattedEndDate"
                  placeholder="Required"
                  density="compact"
                  flat
                  variant="solo"
                  hide-details
                  required
                  readonly
                  :rules="rules.required"
                  class="no-padding-left"
                />
              </template>
              <template #[`item.closureReason`]="{ item }">
                <v-text-field
                  v-model="item.closureReason"
                  placeholder="Required"
                  readonly
                  density="compact"
                  flat
                  variant="solo"
                  hide-details
                  :rules="rules.required"
                  class="no-padding-left"
                />
              </template>
              <template #[`item.feesPaidWhileClosed`]="{ item }">
                <v-text-field
                  placeholder="Required"
                  readonly
                  density="compact"
                  flat
                  variant="solo"
                  hide-details
                  :model-value="getYesNoValue(item.feesPaidWhileClosed)"
                  :rules="rules.required"
                  class="no-padding-left"
                />
              </template>
            </v-data-table>
          </template>
        </div>

        <div>
          <span class="summary-label">CCFRI Opt-In/Opt-Out Status:</span>
          <v-text-field
            placeholder="Required"
            :model-value="getOptInOptOut(ccfri?.ccfriOptInStatus)"
            class="summary-value"
            flat
            variant="solo"
            hide-details
            readonly
            :rules="rules.required"
          />
        </div>
        <div>
          <span class="summary-label">
            Is there any other information about this facility you would like us to know?
          </span>
          <v-textarea
            class="summary-value"
            :model-value="ccfri.ccfriApplicationNotes"
            density="compact"
            flat
            variant="solo"
            hide-details
            no-resize
            readonly
            rows="3"
          />
        </div>
      </template>
      <router-link v-if="!isValidForm" :to="routingPath">
        <u class="text-error">To add this information, click here. This will bring you to a different page.</u>
      </router-link>
    </v-expansion-panel-text>
  </v-form>
</template>
<script>
import { isChangeRequest } from '@/utils/common.js';
import { PATHS, pcfUrlGuid, pcfUrl, changeUrl, changeUrlGuid, CCFRI_HAS_CLOSURE_FEE_TYPES } from '@/utils/constants.js';
import summaryMixin from '@/mixins/summaryMixin.js';

export default {
  mixins: [summaryMixin],
  props: {
    ccfri: {
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
      isValidForm: false,
      closureTableHeaders: [
        { title: 'Closure Start Date', value: 'formattedStartDate', sortable: true },
        { title: 'End Date', value: 'formattedEndDate', sortable: true },
        { title: 'Reason', value: 'closureReason' },
        { title: 'Did parents pay for this closure?', value: 'feesPaidWhileClosed', sortable: true },
      ],
    };
  },
  computed: {
    routingPath() {
      if (!this.ccfri) {
        return isChangeRequest(this)
          ? changeUrl(PATHS.CCFRI_HOME, this.changeRecGuid)
          : pcfUrl(PATHS.CCFRI_HOME, this.programYearId);
      }
      if (isChangeRequest(this)) {
        return changeUrlGuid(PATHS.CCFRI_NEW_FEES, this.changeRecGuid, this.ccfri?.ccfriId);
      }
      if (this.isRenewal) {
        return pcfUrlGuid(PATHS.CCFRI_CURRENT_FEES, this.programYearId, this.ccfri?.ccfriId);
      }
      return pcfUrlGuid(PATHS.CCFRI_NEW_FEES, this.programYearId, this.ccfri?.ccfriId);
    },
  },
  created() {
    this.CCFRI_HAS_CLOSURE_FEE_TYPES = CCFRI_HAS_CLOSURE_FEE_TYPES;
  },
  methods: {
    generateProgYearText(programYear, childCareCategory) {
      return programYear && childCareCategory ? `Parent Fees ${programYear}: ${childCareCategory}:` : null;
    },
  },
};
</script>
<style scoped>
:deep(::placeholder) {
  color: #d8292f !important;
  opacity: 1 !important;
}

:deep(.no-padding-left .v-field__input) {
  padding-left: 0 !important;
}
</style>
