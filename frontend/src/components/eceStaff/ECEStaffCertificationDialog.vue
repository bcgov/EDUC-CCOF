<template>
  <AppDialog v-model="dialogOpen" title="Staff Certification Details" max-width="800px" @close="closeDialog">
    <template #content>
      <v-data-table :headers="headers" :items="staff?.certificates" hide-default-footer>
        <template #item.certificateLevel="{ item }">
          {{ item.certificateLevel || EMPTY_PLACEHOLDER }}
        </template>

        <template #item.effectiveStartDate="{ item }">
          {{ item.effectiveStartDate || EMPTY_PLACEHOLDER }}
        </template>

        <template #item.effectiveEndDate="{ item }">
          {{ item.effectiveEndDate || EMPTY_PLACEHOLDER }}
        </template>

        <template #item.certStatus="{ item }">
          <span
            v-if="item.certStatus === ECE_STAFF_CERT_STATUSES.EXPIRED"
            :class="getECECertStatusClass(item.certStatus)"
          >
            {{ item.certStatus }}
          </span>
        </template>

        <template #no-data>
          <div class="text-center py-4">No certificates available</div>
        </template>
      </v-data-table>
    </template>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/guiComponents/AppDialog.vue';
import { getECECertStatusClass } from '@/utils/common.js';
import { ECE_STAFF_CERT_STATUSES, EMPTY_PLACEHOLDER } from '@/utils/constants.js';

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
      default: null,
    },
  },
  emits: ['update:modelValue'],
  data() {
    return {
      headers: [
        { title: 'Certifications', key: 'certificateLevel', sortable: true },
        { title: 'Effective Start Date', key: 'effectiveStartDate', sortable: true },
        { title: 'Effective End Date', key: 'effectiveEndDate', sortable: true },
        { title: 'Status', key: 'certStatus', sortable: true },
      ],
    };
  },
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
  created() {
    this.EMPTY_PLACEHOLDER = EMPTY_PLACEHOLDER;
    this.ECE_STAFF_CERT_STATUSES = ECE_STAFF_CERT_STATUSES;
  },
  methods: {
    getECECertStatusClass,
    closeDialog() {
      this.dialogOpen = false;
    },
  },
};
</script>
