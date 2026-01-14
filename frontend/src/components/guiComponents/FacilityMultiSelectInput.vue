<template>
  <v-select v-model="selectedFacilities" :items="items" :item-value="itemValue" variant="outlined" multiple>
    <template #prepend-item>
      <v-list-item title="Select All" @click="toggleSelectAll">
        <template #prepend>
          <v-checkbox-btn :model-value="isAllSelected" :indeterminate="isSomeSelected" color="#003366" />
        </template>
      </v-list-item>
      <v-divider class="mt-2" />
    </template>
    <template #item="{ props, item }">
      <v-list-item v-bind="{ ...props, title: undefined }">
        <template #prepend>
          <v-checkbox
            :model-value="isFacilitySelected(item.raw.facilityId)"
            density="compact"
            hide-details
            tabindex="-1"
          />
        </template>
        <v-list-item-title>
          {{ item.raw.facilityAccountNumber ?? EMPTY_PLACEHOLDER }},
          {{ item.raw.facilityName }}
        </v-list-item-title>
      </v-list-item>
    </template>
    <template #selection="{ item, index }">
      <template v-if="isAllSelected">
        <v-chip v-if="index === 0">All facilities</v-chip>
      </template>
      <template v-else>
        <v-chip v-if="index < maxDisplayedFacilities">
          <span>{{ item.raw.facilityAccountNumber ?? EMPTY_PLACEHOLDER }}, {{ item.raw.facilityName }}</span>
        </v-chip>
        <span v-if="index === maxDisplayedFacilities" class="text-grey text-caption align-self-center">
          (+{{ selectedFacilities.length - maxDisplayedFacilities }} others)
        </span>
      </template>
    </template>
    <template #no-data>
      <v-list-item>
        <v-list-item-title>No available facilities.</v-list-item-title>
      </v-list-item>
    </template>
  </v-select>
</template>

<script>
import { isEqual } from 'lodash';
import { EMPTY_PLACEHOLDER } from '@/utils/constants.js';

export default {
  name: 'FacilityMultiSelectInput',
  inheritAttrs: true,
  props: {
    modelValue: {
      type: Array,
      default: () => [],
    },
    items: {
      type: Array,
      default: () => [],
    },
    itemValue: {
      type: String,
      default: null,
    },
    maxDisplayedFacilities: {
      type: Number,
      default: 5,
    },
  },
  emits: ['update:modelValue'],
  data() {
    return {
      selectedFacilities: [],
    };
  },
  computed: {
    isAllSelected() {
      return this.items?.length > 0 && this.selectedFacilities?.length === this.items?.length;
    },
    isSomeSelected() {
      return this.selectedFacilities?.length > 0 && this.selectedFacilities?.length < this.items?.length;
    },
  },
  watch: {
    modelValue: {
      handler(value) {
        if (!isEqual(value, this.selectedFacilities)) {
          this.selectedFacilities = value;
        }
      },
      immediate: false,
    },
    selectedFacilities: {
      handler(value) {
        if (!isEqual(value, this.modelValue)) {
          this.$emit('update:modelValue', value);
        }
      },
      immediate: false,
    },
  },
  created() {
    this.EMPTY_PLACEHOLDER = EMPTY_PLACEHOLDER;
    this.selectedFacilities = this.modelValue;
  },
  methods: {
    isFacilitySelected(facilityId) {
      return this.selectedFacilities?.includes(facilityId);
    },
    toggleSelectAll() {
      this.selectedFacilities = this.isAllSelected ? [] : this.items?.map((item) => item[this.itemValue]);
    },
  },
};
</script>
