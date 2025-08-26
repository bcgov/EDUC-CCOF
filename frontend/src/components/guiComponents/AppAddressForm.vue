<template>
  <v-container fluid class="pa-0">
    <v-row no-gutters align="center">
      <AppTooltip
        tooltip-content="Select this option if your address is incorrect or missing from the address lookup tool"
      />
      <v-checkbox
        v-model="model.manualEntry"
        :disabled="disabled"
        hide-details
        color="primary"
        label="Enter address manually"
        class="ml-2"
        data-cy="Enter address manually"
      />
    </v-row>
    <div :class="hasLeftPadding ? 'pl-lg-11' : ''">
      <v-row>
        <v-col>
          <v-text-field
            v-if="model.manualEntry"
            v-model="model.address"
            :disabled="disabled"
            variant="outlined"
            :rules="rules.required"
            :label="addressLabel"
          />
          <AppAddressLookup
            v-else
            :saved-address="model.address"
            :disabled="disabled"
            :rules="rules.required"
            :label="addressLabel"
            @update-address="updateAddress"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="6" md="4">
          <v-text-field
            v-model="model.city"
            :disabled="disabled"
            :readonly="!model.manualEntry"
            variant="outlined"
            :rules="rules.required"
            label="City/Town"
          />
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <v-select
            v-model="model.province"
            :items="PROVINCES"
            item-value="value"
            :rules="provinceRules"
            :disabled="disabled"
            :readonly="!model.manualEntry"
            label="Province"
            variant="outlined"
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="model.postalCode"
            :disabled="disabled"
            :readonly="!model.manualEntry"
            variant="outlined"
            :rules="[...rules.required, ...rules.postalCode]"
            label="Postal Code"
          />
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script>
import { cloneDeep, isEmpty } from 'lodash';
import AppAddressLookup from '@/components/guiComponents/AppAddressLookup.vue';
import AppTooltip from '@/components/guiComponents/AppTooltip.vue';
import { PROVINCES } from '@/utils/constants.js';
import rules from '@/utils/rules.js';

export default {
  name: 'AppAddressForm',
  components: { AppAddressLookup, AppTooltip },
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    manualEntry: {
      type: Boolean,
      default: false,
    },
    address: {
      type: String,
      default: null,
    },
    addressLabel: {
      type: String,
      default: null,
    },
    city: {
      type: String,
      default: null,
    },
    province: {
      type: String,
      default: null,
    },
    postalCode: {
      type: String,
      default: null,
    },
    hasBcProvinceValidation: {
      type: Boolean,
      default: false,
    },
    hasLeftPadding: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update'],
  data() {
    return {
      model: {},
    };
  },
  computed: {
    provinceRules() {
      return this.hasBcProvinceValidation
        ? [...rules.required, rules.equalTo('BC', 'Facilities must be located within BC')]
        : rules.required;
    },
  },
  watch: {
    model: {
      handler() {
        if (isEmpty(this.model)) return;
        this.$emit('update', cloneDeep(this.model));
      },
      deep: true,
    },
  },
  created() {
    this.rules = rules;
    this.PROVINCES = PROVINCES;
    this.model = {
      manualEntry: this.manualEntry,
      address: this.address,
      city: this.city,
      province: this.province,
      postalCode: this.postalCode,
    };
  },
  methods: {
    updateAddress(value) {
      if (!value || !(value instanceof Object)) return;
      this.model.address = value.Text;
      const address = value.Description?.split(',');
      this.model.city = address[0]?.trim();
      this.model.province = address[1]?.trim();
      this.model.postalCode = address[2]?.trim();
    },
  },
};
</script>
