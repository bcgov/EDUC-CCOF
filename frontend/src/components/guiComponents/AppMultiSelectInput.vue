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
    <template #selection="{ item, index }">
      <v-chip v-if="index < maxDisplayedItems">
        <span>{{ item.title }}</span>
      </v-chip>
      <span v-if="index === maxDisplayedItems" class="text-grey text-caption align-self-center"
        >(+{{ items.length - maxDisplayedItems }} others)</span
      >
    </template>
  </v-select>
</template>

<script>
export default {
  name: 'AppMultiSelectInput',
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
    selectedItems: {
      handler() {
        this.$emit('update:modelValue', this.selectedItems);
      },
    },
  },
  created() {
    this.selectedItems = this.modelValue;
  },
  methods: {
    toggleSelectAll() {
      this.selectedItems = this.isAllSelected ? [] : this.items?.map((item) => item[this.itemValue]);
    },
  },
};
</script>
