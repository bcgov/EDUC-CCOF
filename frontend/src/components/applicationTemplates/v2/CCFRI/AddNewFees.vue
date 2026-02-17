<template>
  <v-form ref="form" v-model="CCFRIFacilityModel.isComplete">
    <ApplicationPCFHeader
      page-title="Child Care Fee Reduction Initiative (CCFRI)"
      :program-year="formattedProgramYear"
      :facility="currentFacility"
    />
    <p class="text-center">
      Enter the fees you would charge a new parent for full-time care at this facility for the months below.
      <br /><br />
      If you have more than one fee for the same category, <strong> enter the highest fee. </strong><br /><br />
      <strong>Enter the fee before CCFRI is applied. </strong> <br /><br />
      <span v-if="languageYearLabel != programYearTypes.HISTORICAL">
        CCFRI regions align with the BCSSA's grouping of school districts into 6 regional chapters. Use the
        <a :href="BCSSALink" target="_blank">BCSSA region lookup</a>
        to find your region.
      </span>
      <br /><br />
      Note: Fee increases will be reviewed and additional information may be requested, which may result in increased
      processing times. If approved, this fee will be posted on the Ministry website. <br /><br />
    </p>

    <v-alert v-if="pageContainsErrors" type="error" text="One or more child care types require your attention." />
    <!-- this is for read only mode - when user is viewing a submitted Renewal application - they don't see the page where we ask them if the current fees are correct -->
    <v-card v-if="isReadOnly && CCFRIFacilityModel.existingFeesCorrect" elevation="6" class="my-10 rounded-lg">
      <p class="px-6 py-3 card-title font-weight-bold">Are the previous year's fees correct for this facility?</p>
      <v-radio-group
        v-model="CCFRIFacilityModel.existingFeesCorrect"
        :disabled="true"
        :rules="rules.required"
        class="pa-8"
      >
        <v-radio label="Yes" :value="CCFRI_FEE_CORRECT_TYPES.YES" />
        <v-radio label="No" :value="CCFRI_FEE_CORRECT_TYPES.NO" />
      </v-radio-group>
    </v-card>

    <div v-for="(item, index) in CCFRIFacilityModel.childCareTypes" :key="index">
      <v-card
        v-if="!item.deleteMe"
        :class="{ 'error-border': sectionErrors[index] }"
        elevation="6"
        class="my-10 rounded-lg"
      >
        <p class="px-6 py-3 card-title font-weight-bold">
          Parent Fees {{ item.programYear }}: Full-Time {{ item.childCareCategory }}
        </p>
        <div class="pa-8">
          <v-radio-group
            v-model="item.feeFrequency"
            :rules="rules.required"
            label="Parent fee frequency"
            :disabled="isReadOnly"
          >
            <v-radio label="Daily" value="Daily" />
            <v-radio label="Monthly" value="Monthly" />
          </v-radio-group>

          <template v-if="item.feeFrequency">
            <div class="my-2">
              <p>If you only offer care for <strong>4 days or fewer</strong> per week, select daily parent fee.</p>
              <p class="py-2">
                Enter your
                <strong>highest {{ item.feeFrequency?.toLowerCase() }} parent fee before CCFRI is applied</strong>
                in every month below. If there is a month where you do not charge a parent fee, enter zero.
              </p>
            </div>
            <v-row>
              <v-col cols="6" sm="4" md="3" lg="2">
                <v-text-field
                  v-model.number="item.approvedFeeApr"
                  type="number"
                  :disabled="isReadOnly"
                  variant="outlined"
                  :rules="feeRules"
                  label="Apr"
                  prefix="$"
                  @wheel="$event.target.blur()"
                  @update:model-value="checkSectionValidity(index)"
                />
              </v-col>
              <v-col cols="6" sm="4" md="3" lg="2">
                <v-text-field
                  v-model.number="item.approvedFeeMay"
                  type="number"
                  :disabled="isReadOnly"
                  variant="outlined"
                  :rules="feeRules"
                  label="May"
                  prefix="$"
                  @wheel="$event.target.blur()"
                  @update:model-value="checkSectionValidity(index)"
                />
              </v-col>
              <v-col cols="6" sm="4" md="3" lg="2">
                <v-text-field
                  v-model.number="item.approvedFeeJun"
                  type="number"
                  :disabled="isReadOnly"
                  variant="outlined"
                  :rules="feeRules"
                  label="Jun"
                  prefix="$"
                  @wheel="$event.target.blur()"
                  @update:model-value="checkSectionValidity(index)"
                />
              </v-col>
              <v-col cols="6" sm="4" md="3" lg="2">
                <v-text-field
                  v-model.number="item.approvedFeeJul"
                  type="number"
                  :disabled="isReadOnly"
                  variant="outlined"
                  :rules="feeRules"
                  label="Jul"
                  prefix="$"
                  @wheel="$event.target.blur()"
                  @update:model-value="checkSectionValidity(index)"
                />
              </v-col>
              <v-col cols="6" sm="4" md="3" lg="2">
                <v-text-field
                  v-model.number="item.approvedFeeAug"
                  type="number"
                  :disabled="isReadOnly"
                  variant="outlined"
                  :rules="feeRules"
                  label="Aug"
                  prefix="$"
                  @wheel="$event.target.blur()"
                  @update:model-value="checkSectionValidity(index)"
                />
              </v-col>
              <v-col cols="6" sm="4" md="3" lg="2">
                <v-text-field
                  v-model.number="item.approvedFeeSep"
                  type="number"
                  :disabled="isReadOnly"
                  variant="outlined"
                  :rules="feeRules"
                  label="Sep"
                  prefix="$"
                  @wheel="$event.target.blur()"
                  @update:model-value="checkSectionValidity(index)"
                />
              </v-col>
              <v-col cols="6" sm="4" md="3" lg="2">
                <v-text-field
                  v-model.number="item.approvedFeeOct"
                  type="number"
                  :disabled="isReadOnly"
                  variant="outlined"
                  :rules="feeRules"
                  label="Oct"
                  prefix="$"
                  @wheel="$event.target.blur()"
                  @update:model-value="checkSectionValidity(index)"
                />
              </v-col>
              <v-col cols="6" sm="4" md="3" lg="2">
                <v-text-field
                  v-model.number="item.approvedFeeNov"
                  type="number"
                  :disabled="isReadOnly"
                  variant="outlined"
                  :rules="feeRules"
                  label="Nov"
                  prefix="$"
                  @wheel="$event.target.blur()"
                  @update:model-value="checkSectionValidity(index)"
                />
              </v-col>
              <v-col cols="6" sm="4" md="3" lg="2">
                <v-text-field
                  v-model.number="item.approvedFeeDec"
                  type="number"
                  :disabled="isReadOnly"
                  variant="outlined"
                  :rules="feeRules"
                  label="Dec"
                  prefix="$"
                  @wheel="$event.target.blur()"
                  @update:model-value="checkSectionValidity(index)"
                />
              </v-col>
              <v-col cols="6" sm="4" md="3" lg="2">
                <v-text-field
                  v-model.number="item.approvedFeeJan"
                  type="number"
                  :disabled="isReadOnly"
                  variant="outlined"
                  :rules="feeRules"
                  label="Jan"
                  prefix="$"
                  @wheel="$event.target.blur()"
                  @update:model-value="checkSectionValidity(index)"
                />
              </v-col>
              <v-col cols="6" sm="4" md="3" lg="2">
                <v-text-field
                  v-model.number="item.approvedFeeFeb"
                  type="number"
                  :disabled="isReadOnly"
                  variant="outlined"
                  :rules="feeRules"
                  label="Feb"
                  prefix="$"
                  @wheel="$event.target.blur()"
                  @update:model-value="checkSectionValidity(index)"
                />
              </v-col>
              <v-col cols="6" sm="4" md="3" lg="2">
                <v-text-field
                  v-model.number="item.approvedFeeMar"
                  type="number"
                  :disabled="isReadOnly"
                  variant="outlined"
                  :rules="feeRules"
                  label="Mar"
                  prefix="$"
                  @wheel="$event.target.blur()"
                  @update:model-value="checkSectionValidity(index)"
                />
              </v-col>
            </v-row>
          </template>
        </div>
      </v-card>
    </div>
    <v-card elevation="6" class="mt-12 rounded-lg">
      <p class="px-6 py-3 card-title font-weight-bold">
        Is there any other information about this facility you would like us to know?
      </p>
      <v-textarea
        v-model="CCFRIFacilityModel.ccfriApplicationNotes"
        :disabled="isReadOnly"
        variant="outlined"
        name="input-7-4"
        label="Describe here"
        hide-details
        class="pa-8"
      />
    </v-card>
  </v-form>
</template>
<script>
import ccfriMixin from '@/mixins/ccfriMixin.js';
import ApplicationService from '@/services/applicationService.js';

export default {
  mixins: [ccfriMixin],
  data() {
    return { sectionErrors: {} };
  },
  computed: {
    pageContainsErrors() {
      return Object.values(this.sectionErrors).includes(true);
    },
  },
  watch: {
    isApplicationFormValidated: {
      handler() {
        this.checkAllSections();
        this.$refs.form?.validate();
      },
    },
  },
  methods: {
    async checkSectionValidity(sectionIndex) {
      await this.$nextTick();

      const section = this.CCFRIFacilityModel.childCareTypes[sectionIndex];
      const hasErrors = this.hasSectionErrors(section);
      this.sectionErrors[sectionIndex] = hasErrors;
    },
    hasSectionErrors(section) {
      return !ApplicationService.isChildCareTypeComplete(section);
    },
    checkAllSections() {
      for (const [index, section] of this.CCFRIFacilityModel.childCareTypes.entries()) {
        if (!section.deleteMe) {
          this.sectionErrors[index] = this.hasSectionErrors(section);
        }
      }
    },
  },
};
</script>

<style scoped>
.error-border {
  box-shadow: 0px 0px 5px #d8292f !important;
}
</style>
