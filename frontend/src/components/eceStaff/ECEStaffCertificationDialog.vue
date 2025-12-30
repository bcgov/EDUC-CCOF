<template>
  <AppDialog v-model="dialogOpen" title="Staff Certification Details" max-width="600px" @close="closeDialog">
    <template #content>
      <v-row class="mb-3" justify="center" align="center">
        <v-col cols="5" class="text-left"> Certification Start Date </v-col>
        <v-col cols="4">
          <v-text-field
            :value="formatUTCDate(staff?.certStartDate)"
            disabled
            hide-details
            density="compact"
            variant="outlined"
          />
        </v-col>
      </v-row>

      <v-row class="mb-3" justify="center" align="center">
        <v-col cols="5" class="text-left"> Certification End Date </v-col>
        <v-col cols="4">
          <v-text-field
            :value="formatUTCDate(staff?.certEndDate)"
            disabled
            hide-details
            density="compact"
            variant="outlined"
          />
        </v-col>
      </v-row>

      <v-row class="mb-3" justify="center" align="center">
        <v-col cols="5" class="text-left"> Staff Start Date </v-col>
        <v-col cols="4">
          <v-text-field
            :value="formatUTCDate(staff?.staffStartDate)"
            disabled
            hide-details
            density="compact"
            variant="outlined"
          />
        </v-col>
      </v-row>

      <v-row class="mb-3" justify="center" align="center">
        <v-col cols="5" class="text-left"> Staff End Date </v-col>
        <v-col cols="4">
          <v-text-field
            :value="formatUTCDate(staff?.staffEndDate)"
            disabled
            hide-details
            density="compact"
            variant="outlined"
          />
        </v-col>
      </v-row>
    </template>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/guiComponents/AppDialog.vue';
import { formatUTCDate } from '@/utils/format';

export default {
  name: 'ECEStaffCertificationDialog',
  components: { AppDialog },
  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },
    staff: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ['update:modelValue'],
  computed: {
    dialogOpen: {
      get() {
        return this.modelValue;
      },
      set(val) {
        this.$emit('update:modelValue', val);
      },
    },
  },
  methods: {
    formatUTCDate,
    closeDialog() {
      this.dialogOpen = false;
    },
  },
};
</script>
