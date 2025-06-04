<template>
  <v-row align="center">
    <v-col cols="12" sm="5" md="5" lg="2" xl="2">
      <AppButton id="facility-filter-button" variant="text" @click="toggleShowFilter()">
        Filter by Facility
        <v-icon right>mdi-filter</v-icon>
      </AppButton>
    </v-col>
    <v-col cols="12" sm="6" md="6" lg="3" xl="3" class="pa-0">
      <v-text-field
        v-show="showFilterInput"
        v-model.trim="facilityNameFilter"
        placeholder="Filter by Facility Name"
        variant="underlined"
        density="compact"
        hide-details
      >
      </v-text-field>
    </v-col>
  </v-row>
  <hr />
  <v-data-table
    v-model:sort-by="sortBy"
    :headers="headers"
    :items="filteredFacilities"
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
import { isEmpty } from 'lodash';

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
      showFilterInput: false,
      facilityNameFilter: '',
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
        { title: 'Licence Number', value: 'licenseNumber' },
        { title: 'Action', key: 'action' },
      ];
    },
    filteredFacilities() {
      return isEmpty(this.facilityNameFilter)
        ? this.facilities
        : this.facilities?.filter((facility) =>
            facility.facilityName?.toLowerCase().includes(this.facilityNameFilter?.toLowerCase()),
          );
    },
  },
  methods: {
    formatEndDate(facility) {
      return new Date(facility?.fundingAgreements[0]?.endDate).toLocaleDateString();
    },
    navigateToFacility(id) {
      alert(id);
    },
    toggleShowFilter() {
      this.showFilterInput = !this.showFilterInput;
      if (!this.showFilterInput) {
        this.facilityNameFilter = '';
      }
    },
  },
};
</script>
