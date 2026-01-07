<template>
  <v-select v-model="selectedItems" :items="items" :item-value="itemValue" variant="outlined" multiple>
    <template #prepend-item>
      <v-list-item title="Select All" @click="toggleSelectAll">
        <template #prepend>
          <v-checkbox-btn
            :color="isSomeSelected ? '#003366' : undefined"
            :indeterminate="isSomeSelected && !isAllSelected"
            :model-value="isSomeSelected"
          />
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
        <v-chip v-if="index < maxDisplayedItems">
          <span>{{ item.raw.facilityAccountNumber ?? EMPTY_PLACEHOLDER }}, {{ item.raw.facilityName }}</span>
        </v-chip>
        <span v-if="index === maxDisplayedItems" class="text-grey text-caption align-self-center"
          >(+{{ items.length - maxDisplayedItems }} others)</span
        >
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
    maxDisplayedItems: {
      type: Number,
      default: 5,
    },
  },
  emits: ['update:modelValue'],
  data() {
    return {
      selectedItems: [],
    };
  },
  computed: {
    isAllSelected() {
      return this.selectedItems?.length === this.items?.length;
    },
    isSomeSelected() {
      return this.selectedItems?.length > 0;
    },
  },
  watch: {
    modelValue: {
      handler(value) {
        if (!isEqual(value, this.selectedItems)) {
          this.selectedItems = value;
        }
      },
    },
    selectedItems: {
      handler() {
        this.$emit('update:modelValue', this.selectedItems);
      },
    },
  },
  created() {
    this.EMPTY_PLACEHOLDER = EMPTY_PLACEHOLDER;
    this.selectedItems = this.modelValue;
  },
  methods: {
    isFacilitySelected(facilityId) {
      return this.selectedItems?.includes(facilityId);
    },
    toggleSelectAll() {
      this.selectedItems = this.isAllSelected ? [] : this.items?.map((item) => item[this.itemValue]);
    },
  },
};
</script>
