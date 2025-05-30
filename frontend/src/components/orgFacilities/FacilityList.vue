<template>
  <v-data-table
    v-model:sort-by="sortBy"
    :headers="headers"
    :items="facilities"
    item-key="facilityId"
    :items-per-page="10"
    density="compact"
    :mobile="null"
    mobile-breakpoint="md"
    class="soft-outline"
  >
    <template #[`item.action`]="{ item }">
      <v-row no-gutters class="my-2 align-center justify-end justify-md-start">
        <AppButton :primary="false" size="small" @click="navigateToFacility(item.facilityId)">Open</AppButton>
      </v-row>
    </template>
  </v-data-table>
</template>
<script>
import { mapState } from 'pinia';

import { useOrganizationStore } from '@/store/ccof/organization';

import AppButton from '@/components/guiComponents/AppButton.vue';

export default {
  name: 'FacilityList',
  components: { AppButton },
  props: {
    facilities: {
      type: Array,
      required: false,
      default: () => [],
    },
  },
  data() {
    return {
      sortBy: [{ key: 'facilityName', order: 'asc' }],
    };
  },
  computed: {
    ...mapState(useOrganizationStore, ['organizationProviderType']),
    providerType() {
      return `${this.organizationProviderType[0]}${this.organizationProviderType.slice(1).toLowerCase()}`;
    },
    headers() {
      return [
        { title: 'Facility Name', value: 'facilityName' },
        { title: 'Facility Address', key: 'facilityAddress', value: (item) => `${item.addressLineOne}, ${item.city}` },
        { title: 'Facility ID', value: 'facilityAccountNumber' },
        { title: 'License Number', value: 'licenseNumber' },
        { title: 'Action', key: 'action' },
        { title: 'End Date', key: 'readableEndDate', value: (item) => this.formatEndDate(item) },
      ];
    },
  },
  methods: {
    formatEndDate(facility) {
      return new Date(facility?.fundingAgreements[0]?.endDate).toLocaleDateString();
    },
    navigateToFacility(id) {
      alert(id);
    },
  },
};
</script>
