<template>
  <v-container class="pa-0 text-body-1" fluid>
    <div class="my-4"></div>
    <v-card class="fill-height px-2 py-1" elevation="0">
      <v-skeleton-loader :loading="loading" type="table-tbody">
        <v-data-table
          :items="licences"
          :headers="licenceTableHeaders"
          :custom-sort="customSort"
          :items-per-page="10"
          class="elevation-2"
        >
          <template #[`item.licenceStartDate`]="{ item }">
            {{ formatUTCDate(item.licenceStartDate) }}
          </template>

          <template #[`item.recordStartDate`]="{ item }">
            {{ formatUTCDate(item.recordStartDate) }}
          </template>

          <template #[`item.recordEndDate`]="{ item }">
            {{ formatUTCDate(item.recordEndDate) }}
          </template>

          <template #[`item.licenceStatus`]="{ item }">
            <span :class="getLicenceStatusClass(item.licenceStatus)">
              {{ item.licenceStatus }}
            </span>
          </template>

          <template #[`item.licenceNumber`]="{ item }">
            {{ item.licenceNumber }}
          </template>

          <template #[`item.actions`]="{ item }">
            <v-row class="action-buttons align-center justify-end justify-md-start ga-2">
              <AppButton :primary="false" size="small" @click="$emit('view-service-details', item)">
                View Record
              </AppButton>
            </v-row>
          </template>
        </v-data-table>
      </v-skeleton-loader>
    </v-card>
  </v-container>
</template>

<script>
import AppButton from '@/components/guiComponents/AppButton.vue';
import { formatUTCDate } from '@/utils/format';
import { getLicenceStatusClass } from '@/utils/common.js';

export default {
  name: 'LicenceHistory',
  components: { AppButton },
  props: {
    licences: {
      type: Array,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['view-service-details'],
  data() {
    return {
      licenceTableHeaders: [
        { title: 'Status', sortable: true, value: 'licenceStatus' },
        { title: 'Licence Number', sortable: true, value: 'licenceNumber' },
        { title: 'Licence Effective Date', sortable: true, value: 'licenceStartDate' },
        { title: 'Record Start Date', sortable: true, value: 'recordStartDate' },
        { title: 'Record End Date', sortable: true, value: 'recordEndDate' },
        { title: 'Actions', sortable: false, value: 'actions' },
      ],
    };
  },
  methods: {
    formatUTCDate,
    getLicenceStatusClass,
    customSort(items, sortBy, sortDesc) {
      //1.licencedate= null 2.recordEndDate (newest to oldest)
      if (sortBy.length === 1 && sortBy[0] === 'recordEndDate') {
        return items.sort((a, b) => {
          if (!a.licenceEndDate && b.licenceEndDate) return -1;
          if (a.licenceEndDate && !b.licenceEndDate) return 1;

          const aDate = new Date(a.recordEndDate);
          const bDate = new Date(b.recordEndDate);

          return sortDesc[0] ? bDate - aDate : aDate - bDate;
        });
      }
      return items;
    },
  },
};
</script>
