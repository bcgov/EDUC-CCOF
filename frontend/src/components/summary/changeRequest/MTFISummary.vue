<template>
  <v-row no-gutters class="d-flex flex-column ma-0 pa-0">
    <v-form ref="mtfiSummaryForm" v-model="isValidForm">
      <v-expansion-panel-title>
        <h4 class="blueText">
          Parent fees
          <v-icon v-if="isValidForm && isNewCcfriValid" color="green" size="large"> mdi-check-circle-outline </v-icon>
          <v-icon v-if="!isValidForm || !isNewCcfriValid" color="#ff5252" size="large">
            mdi-alert-circle-outline
          </v-icon>
          <span v-if="!isValidForm || !isNewCcfriValid" style="color: #ff5252"
            >Your form is missing required information. Click here to view.
          </span>
        </h4>
      </v-expansion-panel-title>
      <v-expansion-panel-text eager class="rounded">
        <div v-if="isNewCcfriValid">
          <div v-for="(item, index) in oldCcfri?.childCareTypes" :key="index">
            <div class="ma-0 pa-0">
              <div class="pa-0 mx-0 my-5">
                <p class="text-h6 blueText">
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
                      hide-details
                      readonly
                      :rules="rules.required"
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
                      hide-details
                      readonly
                      :rules="rules.required"
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
                      hide-details
                      readonly
                      :rules="rules.required"
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
                      hide-details
                      readonly
                      :rules="rules.required"
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
                      hide-details
                      readonly
                      :rules="rules.required"
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
                      hide-details
                      readonly
                      :rules="rules.required"
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
                      hide-details
                      readonly
                      :rules="rules.required"
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
                      hide-details
                      readonly
                      :rules="rules.required"
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
                      hide-details
                      readonly
                      :rules="rules.required"
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
                      hide-details
                      readonly
                      :rules="rules.required"
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
                      hide-details
                      readonly
                      :rules="rules.required"
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
                      hide-details
                      readonly
                      :rules="rules.required"
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

        <v-row v-if="!isValidForm || !isNewCcfriValid" class="d-flex justify-start pt-4">
          <v-col cols="6" lg="4" class="pb-0 pt-0 ml-2">
            <v-row no-gutters class="d-flex justify-start">
              <v-col class="d-flex justify-start">
                <router-link :to="getRoutingPath">
                  <span style="color: #ff5252; text-underline: black">
                    <u>To add this information, click here. This will bring you to a different page.</u>
                  </span>
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
import { PATHS, changeUrlGuid, CHANGE_TYPES } from '@/utils/constants.js';
import rules from '@/utils/rules.js';
import { deepCloneObject } from '@/utils/common.js';
import { useSummaryDeclarationStore } from '@/store/summaryDeclaration.js';

export default {
  props: {
    oldCcfri: {
      type: Object,
      required: false,
      default: () => ({}),
    },
    newCcfri: {
      type: Object,
      required: false,
      default: () => ({}),
    },
    facilityId: {
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
      isValidForm: true,
      formObj: {
        formName: 'MTFISummary',
        formId: this.facilityId,
      },
      newModel: {},
    };
  },
  computed: {
    ...mapState(useSummaryDeclarationStore, ['isLoadingComplete']),
    getRoutingPath() {
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
  watch: {
    isLoadingComplete: {
      handler: function (val) {
        if (val) {
          if (!this.isNewCcfriValid) this.isValidForm = false;
          this.$emit('isSummaryValid', this.formObj, this.isValidForm);
        }
      },
    },
  },
  created() {
    this.newModel = deepCloneObject(this.newCcfri);
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

.blueText {
  color: #003466 !important;
}

>>> ::placeholder {
  color: #ff5252 !important;
  opacity: 1;
}
</style>
