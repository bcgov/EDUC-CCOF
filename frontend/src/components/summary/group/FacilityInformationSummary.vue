<template>
  <FacilityInformationSummaryV1
    v-if="showApplicationTemplateV1"
    :facility-info="facilityInfo"
    :funding="funding"
    :facility-id="facilityId"
    :change-rec-guid="changeRecGuid"
    :program-year-id="programYearId"
  />
  <FacilityInformationSummaryV2
    v-else
    :facility-info="facilityInfo"
    :funding="funding"
    :facility-id="facilityId"
    :change-rec-guid="changeRecGuid"
    :program-year-id="programYearId"
  />
</template>

<script>
import { mapState } from 'pinia';
import FacilityInformationSummaryV1 from '@/components/applicationTemplates/v1/group/summary/FacilityInformationSummary.vue';
import FacilityInformationSummaryV2 from '@/components/applicationTemplates/v2/group/summary/FacilityInformationSummary.vue';
import { useApplicationStore } from '@/store/application.js';

export default {
  components: { FacilityInformationSummaryV1, FacilityInformationSummaryV2 },
  props: {
    facilityInfo: {
      type: Object,
      required: true,
    },
    facilityId: {
      type: String,
      required: true,
    },
    funding: {
      type: Object,
      default: () => ({}),
    },
    changeRecGuid: {
      type: String,
      default: '',
    },
    programYearId: {
      type: String,
      default: '',
    },
  },
  computed: {
    ...mapState(useApplicationStore, ['showApplicationTemplateV1']),
  },
};
</script>
