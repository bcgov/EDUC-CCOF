<template>
  <v-skeleton-loader :loading="isApplicationProcessing" type="table-tbody" class="mb-12">
    <v-container class="mx-lg-16">
      <AddNewFeesV1 v-if="showApplicationTemplateV1" />
      <AddNewFeesV2 v-else />
    </v-container>
  </v-skeleton-loader>
  <AppDialog v-model="showRfiDialog" persistent max-width="700px" title="Request for Information" @close="closeDialog">
    <template #content>
      <v-col cols="12">
        <p>
          You have entered a parent fee above the {{ formattedProgramYear }} parent fee increase limit for the following
          care categories:<br /><br />
          <span v-for="item in rfi3percentCategories" :key="item">{{ item }}<br /></span>
        </p>
        <p>
          Parent fee increases over the limit will be assessed under the Parent Fee Increase Exceptions policy in the
          {{ formattedProgramYear }} <a :href="fundingUrl" target="_blank">Funding Guidelines</a>. You can continue to
          the Request for Information section or press back to update your fees.
        </p>
        <p>
          Please confirm you have provided your highest full-time (i.e. over 4 hours, 5 days a week) parent fee for each
          care category before CCFRI is applied. Submit your daily parent fee if you only offer care for 4 days or fewer
          per week.
        </p>
      </v-col>
    </template>

    <template #button>
      <v-row justify="center" class="pb-4">
        <v-col cols="auto" class="pb-3">
          <AppButton :primary="false" required size="x-large" style="width: 120px; height: 48px" @click="closeDialog()">
            Back
          </AppButton>
        </v-col>
        <v-col cols="auto" class="pb-3">
          <AppButton :primary="true" required size="large" style="width: 120px; height: 48px" @click="toRfi()">
            Continue
          </AppButton>
        </v-col>
      </v-row>
    </template>
  </AppDialog>
  <NavButton
    :is-next-displayed="true"
    :is-save-displayed="true"
    :is-save-disabled="isReadOnly || hasIllegalDates(CCFRIFacilityModel)"
    :is-next-disabled="isApplicationProcessing || !CCFRIFacilityModel.isComplete"
    :is-processing="isApplicationProcessing"
    @previous="previous"
    @next="next"
    @validate-form="validateApplicationForm"
    @save="save(true)"
  />
</template>
<script>
import AddNewFeesV1 from '@/components/applicationTemplates/v1/CCFRI/AddNewFees.vue';
import AddNewFeesV2 from '@/components/applicationTemplates/v2/CCFRI/AddNewFees.vue';
import NavButton from '@/components/util/NavButton.vue';
import alertMixin from '@/mixins/alertMixin.js';
import ccfriMixin from '@/mixins/ccfriMixin.js';
import globalMixin from '@/mixins/globalMixin.js';

export default {
  components: {
    AddNewFeesV1,
    AddNewFeesV2,
    NavButton,
  },
  mixins: [alertMixin, ccfriMixin, globalMixin],
  async beforeRouteLeave(_to, _from, next) {
    await this.save(false);
    next();
  },
  async beforeRouteUpdate(_to, _from, next) {
    await this.save(false);
    next();
  },
  watch: {
    '$route.params.urlGuid': {
      async handler() {
        await this.loadData();
        window.scrollTo(0, 0);
      },
      immediate: true,
    },
  },
  methods: {
    async loadData() {
      try {
        if (!this.$route.params.urlGuid) return;
        this.setIsApplicationProcessing(true);
        await this.loadCCFRIFacility(this.$route.params.urlGuid);
        await this.decorateWithCareTypes(this.currentFacility.facilityId);
        this.loadCCFisCCRIMedian(); //this can be async. no need to wait.
        this.prevFeesCorrect =
          this.CCFRIFacilityModel.existingFeesCorrect === this.CCFRI_FEE_CORRECT_TYPES.YES ? 'Yes' : 'No';
        this.updateChosenDates();
      } catch (error) {
        console.error(`Failed to get CCFRI with error - ${error}`);
        this.setFailureAlert('An error occurred while loading. Please try again later.');
      } finally {
        this.setIsApplicationProcessing(false);
      }
    },
  },
};
</script>
