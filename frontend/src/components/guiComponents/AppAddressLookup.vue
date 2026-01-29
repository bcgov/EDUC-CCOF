<template>
  <v-combobox
    v-model="selectedAddress"
    :loading="loading"
    :items="matchedAddresses"
    item-title="Text"
    item-value="id"
    clearable
    variant="outlined"
    prepend-inner-icon="mdi-magnify"
    @update:search="handleInput"
    @update:model-value="selectAddress"
  >
    <template #item="{ props, item }">
      <v-list-item v-bind="props" :append-icon="item.raw.Next === NEXT_ACTION.FIND ? 'mdi-chevron-right' : undefined">
        <v-list-item-subtitle class="ml-2">{{ item.raw.Description }}</v-list-item-subtitle>
      </v-list-item>
    </template>
  </v-combobox>
</template>

<script>
import { uuid } from 'vue-uuid';
import { debounce, isEmpty } from 'lodash';
import alertMixin from '@/mixins/alertMixin.js';
import CanadaPostService from '@/services/canadaPostService';

export default {
  name: 'AppAddressLookup',
  mixins: [alertMixin],
  props: {
    savedAddress: {
      type: String,
      default: '',
    },
  },
  emits: ['updateAddress'],
  data() {
    return {
      loading: false,
      selectedAddress: '',
      matchedAddresses: [],
    };
  },
  created() {
    this.NEXT_ACTION = {
      FIND: 'Find',
      RETRIEVE: 'Retrieve',
    };
    this.selectedAddress = this.savedAddress;
  },
  methods: {
    // Delay triggering findMatchedAddresses() until after the user stops typing to reduce unnecessary API calls and improve performance.
    handleInput: debounce(async function (value) {
      await this.findMatchedAddresses(value);
    }, 800), // Wait 800ms after the last keystroke

    async findMatchedAddresses(value, bySearchTerm = true) {
      try {
        if (isEmpty(value) || this.selectedAddress?.Text === value) return;
        this.loading = true;
        this.matchedAddresses = [];
        const response = bySearchTerm
          ? await CanadaPostService.findAddressesBySearchTerm(value)
          : await CanadaPostService.findAddressesByLastId(value);
        this.matchedAddresses = response?.map((item) => {
          return { ...item, id: uuid.v1() };
        });
      } catch (error) {
        console.error(error);
        if (typeof error?.response?.data === 'string') {
          this.setFailureAlert(error.response.data); // Probably too many requests
        } else {
          this.setFailureAlert('An error occurred while finding addresses. Please try again later.');
        }
      } finally {
        this.loading = false;
      }
    },
    async selectAddress(value) {
      if (!value || !(value instanceof Object)) return;
      if (value?.Next === this.NEXT_ACTION.FIND) {
        await this.findMatchedAddresses(value?.Id, false);
      } else {
        this.$emit('updateAddress', value);
      }
    },
  },
};
</script>
