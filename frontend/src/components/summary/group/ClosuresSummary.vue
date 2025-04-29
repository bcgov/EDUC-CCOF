<template>
  <v-form ref="closuresSummaryForm" v-model="isValidForm">
    <v-expansion-panel-title>
      <SummaryExpansionPanelTitle title="Closures" :is-complete="isValidForm" />
    </v-expansion-panel-title>
    <v-expansion-panel-text eager>
      <div class="mb-2">
        <span class="summary-label">
          Do you charge parent fees at this facility for any closures on business days (other than provincial statutory
          holidays)? Only indicate the date of closures where parent fees are charged.
        </span>
        <v-text-field
          placeholder="Required"
          :model-value="getYesNoValue(ccfri.hasClosureFees)"
          density="compact"
          flat
          variant="solo"
          hide-details
          readonly
          :rules="rules.required"
          class="summary-value no-padding-left"
        />
      </div>
      <v-data-table
        v-if="ccfri.hasClosureFees === CCFRI_HAS_CLOSURE_FEE_TYPES.YES"
        v-model:sort-by="sortBy"
        :headers="closureTableHeaders"
        :items="formattedClosures"
        :mobile="null"
        mobile-breakpoint="md"
        class="elevation-2 mb-2"
      >
        <template #no-data>
          <v-text-field
            placeholder="Required"
            density="compact"
            flat
            variant="solo"
            hide-details
            :rules="rules.required"
            readonly
            class="center-placeholder"
          />
        </template>
        <template #[`item.startDate`]="{ item }">
          <v-text-field
            :model-value="item.startDate"
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
        <template #[`item.endDate`]="{ item }">
          <v-text-field
            :model-value="item.endDate"
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
            :model-value="item.closureReason"
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
        <template #[`item.fullClosureType`]="{ item }">
          <v-text-field
            :model-value="item.fullClosureType"
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
        <template #[`item.ageGroups`]="{ item }">
          <v-text-field
            v-if="!item.fullClosure"
            :model-value="item.ageGroups"
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
      </v-data-table>
      <div v-if="!isValidForm" class="mt-4">
        <router-link :to="routingPath">
          <u class="text-error">To add this information, click here. This will bring you to a different page.</u>
        </router-link>
      </div>
    </v-expansion-panel-text>
  </v-form>
</template>
<script>
import { isEmpty } from 'lodash';
import moment from 'moment';

import { isChangeRequest } from '@/utils/common.js';
import {
  CCFRI_HAS_CLOSURE_FEE_TYPES,
  CLOSURE_AFFECTED_AGE_GROUPS_VALUES_TO_TEXT,
  PATHS,
  changeUrlGuid,
  pcfUrlGuid,
} from '@/utils/constants.js';
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
        { title: 'Closure Start Date', value: 'startDate', width: '18%', sortable: true },
        { title: 'Closure End Date', value: 'endDate', width: '18%', sortable: true },
        { title: 'Closure Type', value: 'fullClosureType', sortable: true },
        { title: 'Reason', value: 'closureReason', width: '20%' },
        { title: 'Affected Care Categories', value: 'ageGroups', width: '30%' },
      ],
      sortBy: [{ key: 'startDate', order: 'asc' }],
    };
  },
  computed: {
    routingPath() {
      return isChangeRequest(this)
        ? changeUrlGuid(PATHS.CCFRI_CLOSURES, this.changeRecGuid, this.ccfri?.ccfriId)
        : pcfUrlGuid(PATHS.CCFRI_CLOSURES, this.programYearId, this.ccfri?.ccfriId);
    },
    formattedClosures() {
      return this.ccfri?.closures?.map((closure) => {
        return {
          startDate: closure?.startDate ? moment.utc(closure?.startDate).format('YYYY-MM-DD') : null,
          endDate: closure?.endDate ? moment.utc(closure?.endDate).format('YYYY-MM-DD') : null,
          fullClosure: closure?.fullClosure,
          fullClosureType: closure?.fullClosure ? 'Full' : 'Partial',
          closureReason: closure.closureReason,
          ageGroups: closure.ageGroups
            ?.split(',')
            ?.map((val) => CLOSURE_AFFECTED_AGE_GROUPS_VALUES_TO_TEXT[Number(val)])
            .join(', '),
        };
      });
    },
  },
  created() {
    this.CCFRI_HAS_CLOSURE_FEE_TYPES = CCFRI_HAS_CLOSURE_FEE_TYPES;
  },
  methods: {
    isEmpty,
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

:deep(.center-placeholder .v-field__input) {
  text-align: center;
}
</style>
