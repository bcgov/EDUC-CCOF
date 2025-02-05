<template>
  <v-combobox
    :loading="loading"
    :items="matchedAddresses"
    item-title="Text"
    item-value="id"
    return-object
    variant="outlined"
    prepend-inner-icon="mdi-magnify"
    @update:search="findMatchedAddresses"
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
import { isEmpty } from 'lodash';
import alertMixin from '@/mixins/alertMixin.js';
import CanadaPostService from '@/services/canadaPostService';

export default {
  name: 'AppAddressLookup',
  mixins: [alertMixin],
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
  },
  methods: {
    async findMatchedAddresses(value, bySearchTerm = true) {
      try {
        this.loading = true;
        this.matchedAddresses = [];
        if (isEmpty(value) || this.selectedAddress?.Text === value) return;
        const response = bySearchTerm
          ? await CanadaPostService.findAddressesBySearchTerm(value)
          : await CanadaPostService.findAddressesByLastId(value);
        this.matchedAddresses = response?.map((item) => {
          return { ...item, id: uuid.v1() };
        });
      } catch (error) {
        console.error(error);
        this.setFailureAlert('An error occurred while finding addresses. Please try again later.');
      } finally {
        this.loading = false;
      }
    },
    async selectAddress(value) {
      if (!value || !(value instanceof Object)) return;
      this.selectedAddress = value;
      if (value?.Next === this.NEXT_ACTION.FIND) {
        await this.findMatchedAddresses(value?.Id, false);
      } else {
        this.$emit('updateAddress', value);
      }
    },
  },
};
</script>
