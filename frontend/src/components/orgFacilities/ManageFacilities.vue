<template>
  <v-container class="pa-0" fluid>
    <v-row no-gutters>
      <v-col>
        <p>View and update your facilities.</p>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapActions, mapState } from 'pinia';
import { isEmpty } from 'lodash';

import { useOrganizationStore } from '@/store/ccof/organization';
import alertMixin from '@/mixins/alertMixin.js';

export default {
  name: 'ManageFacilities',
  mixins: [alertMixin],
  data() {
    return {
      facilitiesLoading: false,
    };
  },
  computed: {
    ...mapState(useOrganizationStore, ['organizationId', 'facilities']),
  },
  async mounted() {
    try {
      if (isEmpty(this.facilities)) {
        this.facilitiesLoading = true;
        await this.loadFacilities(this.organizationId);
      }
    } catch (error) {
      this.setFailureAlert('There was an error loading the facilities');
      console.error('Error loading facilities: ', error);
    } finally {
      this.facilitiesLoading = false;
    }
  },
  methods: {
    ...mapActions(useOrganizationStore, ['loadFacilities']),
  },
};
</script>
