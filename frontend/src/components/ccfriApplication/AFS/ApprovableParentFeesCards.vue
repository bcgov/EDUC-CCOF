<template>
  <v-skeleton-loader :loading="loading" type="table-tbody">
    <v-container fluid class="pa-0">
      <v-card v-for="item in approvableFeeSchedules" :key="item.approvableFeeScheduleId" elevation="2" class="my-8">
        <div class="pa-2 gray-background">
          <p class="text-h6 px-4">
            Parent Fees {{ getProgramYearNameById(item.programYearId) }}: Full-Time
            {{ getChildCareCategoryNameById(item.childCareCategoryId) }}
          </p>
        </div>
        <div class="pt-4 px-8">
          <v-radio-group v-model="item.feeFrequency" label="Parent fee frequency" :disabled="true">
            <v-radio label="Daily" :value="PARENT_FEE_FREQUENCIES.DAILY" />
            <v-radio label="Monthly" :value="PARENT_FEE_FREQUENCIES.MONTHLY" />
          </v-radio-group>

          <v-row>
            <v-col cols="12" sm="6" md="4" lg="2">
              <v-text-field v-model="item.approvedFeeApr" :disabled="true" variant="outlined" label="Apr" prefix="$" />
            </v-col>
            <v-col cols="12" sm="6" md="4" lg="2">
              <v-text-field v-model="item.approvedFeeMay" :disabled="true" variant="outlined" label="May" prefix="$" />
            </v-col>
            <v-col cols="12" sm="6" md="4" lg="2">
              <v-text-field v-model="item.approvedFeeJun" :disabled="true" variant="outlined" label="Jun" prefix="$" />
            </v-col>
            <v-col cols="12" sm="6" md="4" lg="2">
              <v-text-field v-model="item.approvedFeeJul" :disabled="true" variant="outlined" label="Jul" prefix="$" />
            </v-col>
            <v-col cols="12" sm="6" md="4" lg="2">
              <v-text-field v-model="item.approvedFeeAug" :disabled="true" variant="outlined" label="Aug" prefix="$" />
            </v-col>
            <v-col cols="12" sm="6" md="4" lg="2">
              <v-text-field v-model="item.approvedFeeSep" :disabled="true" variant="outlined" label="Sep" prefix="$" />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" sm="6" md="4" lg="2">
              <v-text-field v-model="item.approvedFeeOct" :disabled="true" variant="outlined" label="Oct" prefix="$" />
            </v-col>
            <v-col cols="12" sm="6" md="4" lg="2">
              <v-text-field v-model="item.approvedFeeNov" :disabled="true" variant="outlined" label="Nov" prefix="$" />
            </v-col>
            <v-col cols="12" sm="6" md="4" lg="2">
              <v-text-field v-model="item.approvedFeeDec" :disabled="true" variant="outlined" label="Dec" prefix="$" />
            </v-col>
            <v-col cols="12" sm="6" md="4" lg="2">
              <v-text-field v-model="item.approvedFeeJan" :disabled="true" variant="outlined" label="Jan" prefix="$" />
            </v-col>
            <v-col cols="12" sm="6" md="4" lg="2">
              <v-text-field v-model="item.approvedFeeFeb" :disabled="true" variant="outlined" label="Feb" prefix="$" />
            </v-col>
            <v-col cols="12" sm="6" md="4" lg="2">
              <v-text-field v-model="item.approvedFeeMar" :disabled="true" variant="outlined" label="Mar" prefix="$" />
            </v-col>
          </v-row>
        </div>
      </v-card>
    </v-container>
  </v-skeleton-loader>
</template>
<script>
import { mapState } from 'pinia';
import { useAppStore } from '@/store/app.js';
import { PARENT_FEE_FREQUENCIES } from '@/utils/constants.js';

export default {
  name: 'ApprovableParentFeesCards',
  props: {
    loading: {
      type: Boolean,
      default: true,
    },
    approvableFeeSchedules: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    ...mapState(useAppStore, ['getChildCareCategoryNameById', 'getProgramYearNameById']),
  },
  created() {
    this.PARENT_FEE_FREQUENCIES = PARENT_FEE_FREQUENCIES;
  },
};
</script>
<style scoped>
.gray-background {
  background-color: lightgray;
}
</style>
