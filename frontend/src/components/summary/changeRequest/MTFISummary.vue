<template>
  <v-row no-gutters class="d-flex flex-column ma-0 pa-0">
    <v-form ref="mtfiSummaryForm" v-model="isValidForm">
      <v-expansion-panel-title>
        <SummaryExpansionPanelTitle title="Parent fees" :is-complete="isValidForm && isNewCcfriValid" />
      </v-expansion-panel-title>
      <v-expansion-panel-text eager class="rounded">
        <div v-if="isNewCcfriValid">
          <div v-for="(item, index) in oldCcfri?.childCareTypes" :key="index">
            <div class="ma-0 pa-0">
              <div class="pa-0 mx-0 my-5">
                <p class="text-h6 text-primary">
                  Parent Fees {{ item.programYear }}: <strong>Full-time {{ item.childCareCategory }}</strong>
                  (Over four hours, five days a week)
                </p>
              </div>
              <v-row no-gutters>
                <v-row v-if="item.feeFrequency != newModel?.childCareTypes[index].feeFrequency" no-gutters>
                  <v-col class="col-12 col-lg-4 pb-3"> Current parent fee frequency: {{ item.feeFrequency }} </v-col>
                  <v-col class="col-12 col-lg-4 pb-3">
                    New parent fee frequency: {{ newModel?.childCareTypes[index].feeFrequency }}
                  </v-col>
                </v-row>
                <div v-else>
                  <p>Parent fee frequency: {{ item.feeFrequency }}</p>
                </div>
              </v-row>
              <div class="">
                <br />
                <v-container class="ma-0 pa-0 pr-16 gridContainer">
                  <div class="feeTitle summary-label">
                    <span>Current parent fees: </span>
                  </div>

                  <div no-gutters class="feeTitle summary-label justify-start ma-0">
                    Apr
                    <v-text-field
                      v-model.number="item.approvedFeeApr"
                      type="number"
                      density="compact"
                      flat
                      variant="solo"
                      hide-details
                      readonly
                      prefix="$"
                    />
                  </div>

                  <div no-gutters class="feeTitle summary-label justify-start ma-0">
                    May
                    <v-text-field
                      v-model.number="item.approvedFeeMay"
                      type="number"
                      density="compact"
                      flat
                      variant="solo"
                      hide-details
                      readonly
                      prefix="$"
                    />
                  </div>

                  <div no-gutters class="feeTitle summary-label justify-start ma-0">
                    Jun
                    <v-text-field
                      v-model.number="item.approvedFeeJun"
                      type="number"
                      density="compact"
                      flat
                      variant="solo"
                      hide-details
                      readonly
                      prefix="$"
                    />
                  </div>

                  <div no-gutters class="feeTitle summary-label justify-start ma-0">
                    Jul
                    <v-text-field
                      v-model.number="item.approvedFeeJul"
                      type="number"
                      density="compact"
                      flat
                      variant="solo"
                      hide-details
                      readonly
                      prefix="$"
                    />
                  </div>

                  <div no-gutters class="feeTitle summary-label justify-start ma-0">
                    Aug
                    <v-text-field
                      v-model.number="item.approvedFeeAug"
                      type="number"
                      density="compact"
                      flat
                      variant="solo"
                      hide-details
                      readonly
                      prefix="$"
                    />
                  </div>

                  <div no-gutters class="feeTitle summary-label justify-start ma-0">
                    Sep
                    <v-text-field
                      v-model.number="item.approvedFeeSep"
                      type="number"
                      density="compact"
                      flat
                      variant="solo"
                      hide-details
                      readonly
                      prefix="$"
                    />
                  </div>

                  <div class="feeTitle summary-label">
                    <span>New parent fees: </span>
                  </div>

                  <div no-gutters class="feeTitle summary-label justify-start ma-0">
                    Apr
                    <v-text-field
                      v-model.number="newModel.childCareTypes[index].approvedFeeApr"
                      type="number"
                      density="compact"
                      flat
                      variant="solo"
                      :hide-details="isNullOrBlank(newModel.childCareTypes[index].approvedFeeApr) || isValidForm"
                      readonly
                      :rules="ccfriFeeRules"
                      placeholder="Required"
                      label=""
                      prefix="$"
                      class="summary-value"
                    />
                  </div>

                  <div no-gutters class="feeTitle summary-label justify-start ma-0">
                    May
                    <v-text-field
                      v-model.number="newModel.childCareTypes[index].approvedFeeMay"
                      type="number"
                      density="compact"
                      flat
                      variant="solo"
                      :hide-details="isNullOrBlank(newModel.childCareTypes[index].approvedFeeMay) || isValidForm"
                      readonly
                      :rules="ccfriFeeRules"
                      placeholder="Required"
                      label=""
                      prefix="$"
                      class="summary-value"
                    />
                  </div>

                  <div no-gutters class="feeTitle summary-label justify-start ma-0">
                    Jun
                    <v-text-field
                      v-model.number="newModel.childCareTypes[index].approvedFeeJun"
                      type="number"
                      density="compact"
                      flat
                      variant="solo"
                      :hide-details="isNullOrBlank(newModel.childCareTypes[index].approvedFeeJun) || isValidForm"
                      readonly
                      :rules="ccfriFeeRules"
                      placeholder="Required"
                      label=""
                      prefix="$"
                      class="summary-value"
                    />
                  </div>

                  <div no-gutters class="feeTitle summary-label justify-start ma-0">
                    Jul
                    <v-text-field
                      v-model.number="newModel.childCareTypes[index].approvedFeeJul"
                      type="number"
                      density="compact"
                      flat
                      variant="solo"
                      :hide-details="isNullOrBlank(newModel.childCareTypes[index].approvedFeeJul) || isValidForm"
                      readonly
                      :rules="ccfriFeeRules"
                      placeholder="Required"
                      label=""
                      prefix="$"
                      class="summary-value"
                    />
                  </div>

                  <div no-gutters class="feeTitle summary-label justify-start ma-0">
                    Aug
                    <v-text-field
                      v-model.number="newModel.childCareTypes[index].approvedFeeAug"
                      type="number"
                      density="compact"
                      flat
                      variant="solo"
                      :hide-details="isNullOrBlank(newModel.childCareTypes[index].approvedFeeAug) || isValidForm"
                      readonly
                      :rules="ccfriFeeRules"
                      placeholder="Required"
                      label=""
                      prefix="$"
                      class="summary-value"
                    />
                  </div>

                  <div no-gutters class="feeTitle summary-label justify-start ma-0">
                    Sep
                    <v-text-field
                      v-model.number="newModel.childCareTypes[index].approvedFeeSep"
                      type="number"
                      density="compact"
                      flat
                      variant="solo"
                      :hide-details="isNullOrBlank(newModel.childCareTypes[index].approvedFeeSep) || isValidForm"
                      readonly
                      :rules="ccfriFeeRules"
                      placeholder="Required"
                      label=""
                      prefix="$"
                      class="summary-value"
                    />
                  </div>
                </v-container>
                <br />
                <br />

                <v-container class="ma-0 pa-0 pr-16 gridContainer">
                  <div class="feeTitle summary-label">
                    <span>Current parent fees: </span>
                  </div>

                  <div no-gutters class="feeTitle summary-label justify-start ma-0">
                    Oct
                    <v-text-field
                      v-model.number="item.approvedFeeOct"
                      type="number"
                      density="compact"
                      flat
                      variant="solo"
                      hide-details
                      readonly
                      prefix="$"
                    />
                  </div>

                  <div no-gutters class="feeTitle summary-label justify-start ma-0">
                    Nov
                    <v-text-field
                      v-model.number="item.approvedFeeNov"
                      type="number"
                      density="compact"
                      flat
                      variant="solo"
                      hide-details
                      readonly
                      prefix="$"
                    />
                  </div>

                  <div no-gutters class="feeTitle summary-label justify-start ma-0">
                    Dec
                    <v-text-field
                      v-model.number="item.approvedFeeDec"
                      type="number"
                      density="compact"
                      flat
                      variant="solo"
                      hide-details
                      readonly
                      prefix="$"
                    />
                  </div>

                  <div no-gutters class="feeTitle summary-label justify-start ma-0">
                    Jan
                    <v-text-field
                      v-model.number="item.approvedFeeJan"
                      type="number"
                      density="compact"
                      flat
                      variant="solo"
                      hide-details
                      readonly
                      prefix="$"
                    />
                  </div>

                  <div no-gutters class="feeTitle summary-label justify-start ma-0">
                    Feb
                    <v-text-field
                      v-model.number="item.approvedFeeFeb"
                      type="number"
                      density="compact"
                      flat
                      variant="solo"
                      hide-details
                      readonly
                      prefix="$"
                    />
                  </div>

                  <div no-gutters class="feeTitle summary-label justify-start ma-0">
                    Mar
                    <v-text-field
                      v-model.number="item.approvedFeeMar"
                      type="number"
                      density="compact"
                      flat
                      variant="solo"
                      hide-details
                      readonly
                      prefix="$"
                    />
                  </div>

                  <div class="feeTitle summary-label">
                    <span>New parent fees: </span>
                  </div>

                  <div no-gutters class="feeTitle summary-label justify-start ma-0">
                    Oct
                    <v-text-field
                      v-model.number="newModel.childCareTypes[index].approvedFeeOct"
                      type="number"
                      density="compact"
                      flat
                      variant="solo"
                      :hide-details="isNullOrBlank(newModel.childCareTypes[index].approvedFeeOct) || isValidForm"
                      readonly
                      :rules="ccfriFeeRules"
                      placeholder="Required"
                      prefix="$"
                      class="summary-value"
                    />
                  </div>

                  <div no-gutters class="feeTitle summary-label justify-start ma-0">
                    Nov
                    <v-text-field
                      v-model.number="newModel.childCareTypes[index].approvedFeeNov"
                      type="number"
                      density="compact"
                      flat
                      variant="solo"
                      :hide-details="isNullOrBlank(newModel.childCareTypes[index].approvedFeeNov) || isValidForm"
                      readonly
                      :rules="ccfriFeeRules"
                      placeholder="Required"
                      label=""
                      prefix="$"
                      class="summary-value"
                    />
                  </div>

                  <div no-gutters class="feeTitle summary-label justify-start ma-0">
                    Dec
                    <v-text-field
                      v-model.number="newModel.childCareTypes[index].approvedFeeDec"
                      type="number"
                      density="compact"
                      flat
                      variant="solo"
                      :hide-details="isNullOrBlank(newModel.childCareTypes[index].approvedFeeDec) || isValidForm"
                      readonly
                      :rules="ccfriFeeRules"
                      placeholder="Required"
                      label=""
                      prefix="$"
                      class="summary-value"
                    />
                  </div>

                  <div no-gutters class="feeTitle summary-label justify-start ma-0">
                    Jan
                    <v-text-field
                      v-model.number="newModel.childCareTypes[index].approvedFeeJan"
                      type="number"
                      density="compact"
                      flat
                      variant="solo"
                      :hide-details="isNullOrBlank(newModel.childCareTypes[index].approvedFeeJan) || isValidForm"
                      readonly
                      :rules="ccfriFeeRules"
                      placeholder="Required"
                      label=""
                      prefix="$"
                      class="summary-value"
                    />
                  </div>

                  <div no-gutters class="feeTitle summary-label justify-start ma-0">
                    Feb
                    <v-text-field
                      v-model.number="newModel.childCareTypes[index].approvedFeeFeb"
                      type="number"
                      density="compact"
                      flat
                      variant="solo"
                      :hide-details="isNullOrBlank(newModel.childCareTypes[index].approvedFeeFeb) || isValidForm"
                      readonly
                      :rules="ccfriFeeRules"
                      placeholder="Required"
                      label=""
                      prefix="$"
                      class="summary-value"
                    />
                  </div>

                  <div no-gutters class="feeTitle summary-label justify-start ma-0">
                    Mar
                    <v-text-field
                      v-model.number="newModel.childCareTypes[index].approvedFeeMar"
                      type="number"
                      density="compact"
                      flat
                      variant="solo"
                      :hide-details="isNullOrBlank(newModel.childCareTypes[index].approvedFeeMar) || isValidForm"
                      readonly
                      :rules="ccfriFeeRules"
                      placeholder="Required"
                      label=""
                      prefix="$"
                      class="summary-value"
                    />
                  </div>

                  <br />
                </v-container>
              </div>
            </div>
          </div>
          <v-row no-gutters class="d-flex justify-start">
            <span class="summary-label"
              >Is there any other information about this facility you would like us to know?</span
            >
          </v-row>
          <v-row>
            <v-textarea
              class="col-10 summary-value"
              :model-value="newCcfri.ccfriApplicationNotes"
              density="compact"
              flat
              variant="solo"
              hide-details
              no-resize
              readonly
              rows="3"
            />
          </v-row>
        </div>

        <div v-if="!isValidForm || !isNewCcfriValid">
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
import { deepCloneObject } from '@/utils/common.js';
import { CHANGE_TYPES, PATHS, changeUrlGuid } from '@/utils/constants.js';

export default {
  mixins: [summaryMixin],
  props: {
    oldCcfri: {
      type: Object,
      default: () => ({}),
    },
    newCcfri: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      isValidForm: false,
      newModel: {},
    };
  },
  computed: {
    routingPath() {
      return changeUrlGuid(
        PATHS.MTFI_GROUP_FEE_VERIFICATION,
        this.$route.params.changeRecGuid,
        this.newCcfri.ccfriApplicationId,
        CHANGE_TYPES.MTFI,
      );
    },
    isNewCcfriValid() {
      return this.newModel?.childCareTypes?.length === this.oldCcfri?.childCareTypes?.length;
    },
  },
  created() {
    this.newModel = deepCloneObject(this.newCcfri);
  },
  mounted() {
    this.$refs.mtfiSummaryForm.validate();
  },
};
</script>

<style scoped>
.gridContainer {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: repeat(2, 65px);
}

.feeTitle {
  display: flex;
  align-items: center;
  text-align: end !important;
  text-align: right !important;
  justify-items: end;
  justify-content: end;
  padding: 0px 16px 0px 8px;
}

:deep(::placeholder) {
  color: #d8292f !important;
  opacity: 1 !important;
}

:deep(.v-input__details) {
  text-align: left;
}
</style>
