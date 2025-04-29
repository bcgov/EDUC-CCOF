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
        to find your region.</span
      >
      <br /><br />
      Note: Fee increases will be reviewed and additional information may be requested, which may result in increased
      processing times. If approved, this fee will be posted on the Ministry website. <br /><br />
    </p>

    <v-card
      v-if="isReadOnly && CCFRIFacilityModel.existingFeesCorrect"
      elevation="6"
      class="px-0 py-0 mx-auto my-10 rounded-lg col-12"
      min-height="230"
      rounded
      tiled
      exact
      tile
      :ripple="false"
    >
      <v-card-text class="pt-7 pa-0">
        <div class="px-8">
          <p class="text-h5 text--primary">Are the previous year's fees correct for this facility?</p>
          <br />

          <v-radio-group v-model="prevFeesCorrect" required :disabled="true" :rules="rules.required">
            <v-radio label="Yes" value="Yes" />
            <v-radio label="No" value="No" />
          </v-radio-group>
        </div>
      </v-card-text>
    </v-card>

    <div v-for="(item, index) in CCFRIFacilityModel.childCareTypes" :key="index">
      <v-card
        v-if="!item.deleteMe"
        elevation="6"
        class="px-0 py-0 mx-auto my-10 rounded-lg col-12"
        min-height="230"
        rounded
        tiled
        exact
        tile
        :ripple="false"
      >
        <p class="rounded-t-lg px-6 py-3 card-title font-weight-bold">
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
              <p>If you only offer care for <strong>4 days or fewer </strong> per week, select daily parent fee.</p>
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
                  @update:model-value="convertBlankNumberToNull(item, 'approvedFeeApr')"
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
                  @update:model-value="convertBlankNumberToNull(item, 'approvedFeeMay')"
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
                  @update:model-value="convertBlankNumberToNull(item, 'approvedFeeJun')"
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
                  @update:model-value="convertBlankNumberToNull(item, 'approvedFeeJul')"
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
                  @update:model-value="convertBlankNumberToNull(item, 'approvedFeeAug')"
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
                  @update:model-value="convertBlankNumberToNull(item, 'approvedFeeSep')"
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
                  @update:model-value="convertBlankNumberToNull(item, 'approvedFeeOct')"
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
                  @update:model-value="convertBlankNumberToNull(item, 'approvedFeeNov')"
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
                  @update:model-value="convertBlankNumberToNull(item, 'approvedFeeDec')"
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
                  @update:model-value="convertBlankNumberToNull(item, 'approvedFeeJan')"
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
                  @update:model-value="convertBlankNumberToNull(item, 'approvedFeeFeb')"
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
                  @update:model-value="convertBlankNumberToNull(item, 'approvedFeeMar')"
                />
              </v-col>
            </v-row>
          </template>
        </div>
      </v-card>
    </div>
    <v-card elevation="6" class="mt-12 rounded-lg">
      <p class="rounded-t-lg px-6 py-3 card-title font-weight-bold">
        Is there any other information about this facility you would like us to know?
      </p>
      <v-textarea
        v-model="CCFRIFacilityModel.ccfriApplicationNotes"
        :disabled="isReadOnly"
        variant="outlined"
        name="input-7-4"
        label="Describe here"
        class="pa-8"
      />
    </v-card>
  </v-form>
</template>
<script>
import ccfriMixin from '@/mixins/ccfriMixin.js';
export default {
  mixins: [ccfriMixin],
  watch: {
    isApplicationFormValidated: {
      handler() {
        this.$refs.form?.validate();
      },
    },
  },
};
</script>
