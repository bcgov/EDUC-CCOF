<template>
  <v-form ref="form">
    <v-container fluid>
      <ApplicationPCFHeader
        page-title="Child Care Fee Reduction Initiative (CCFRI)"
        :program-year="formattedProgramYear"
        :facility="currentFacility"
      />
      <div class="mx-lg-16 mb-12">
        <div class="text-center px-4 px-lg-8 my-8">
          <p>
            It is important to tell us your planned closures for the {{ formattedProgramYear }} funding term to avoid
            any impacts on payments. Only report closures for which parent fees will be charged. For CCFRI approval,
            facilities must not charge parent fees for periods greater than two consecutive weeks per month, up to a
            maximum of four weeks per funding agreement term. See the Funding Guidelines for more information.
          </p>
        </div>
        <v-skeleton-loader :loading="isApplicationProcessing" type="table-tbody">
          <v-card elevation="6" width="100%" class="rounded-lg my-4 mb-12">
            <p class="rounded-t-lg px-6 py-3 card-title font-weight-bold">
              Do you charge parent fees at this facility for any closures on business days?
            </p>
            <div class="py-4 px-8">
              <p class="span-label font-regular">
                Do you charge parent fees at this facility for any closures on business days (other than provincial
                statutory holidays)? Only indicate the date of closures where parent fees are charged.
              </p>
              <v-radio-group
                v-model="CCFRIFacilityModel.hasClosureFees"
                :disabled="isReadOnly"
                :rules="rules.required"
                color="primary"
              >
                <v-radio label="Yes" :value="CCFRI_HAS_CLOSURE_FEE_TYPES.YES" />
                <v-radio label="No" :value="CCFRI_HAS_CLOSURE_FEE_TYPES.NO" />
              </v-radio-group>

              <ApplicationClosureCard
                v-if="CCFRIFacilityModel.hasClosureFees === CCFRI_FEE_CORRECT_TYPES.YES"
                ref="closureCards"
                :closures="closures"
                :readonly="isApplicationProcessing || isReadOnly"
                @update-closures="updateClosures"
                @update-closures-complete="updateClosuresComplete"
                @update-has-illegal-dates="updateHasIllegalDates"
              />
            </div>
          </v-card>
        </v-skeleton-loader>
      </div>
      <NavButton
        :is-next-displayed="true"
        :is-save-displayed="true"
        :is-save-disabled="isReadOnly || hasIllegalDates"
        :is-next-disabled="isApplicationProcessing || !isClosuresSectionComplete"
        :is-processing="isApplicationProcessing"
        @previous="previous"
        @next="next"
        @validate-form="validateApplicationForm"
        @save="save(true)"
      />
    </v-container>
  </v-form>
</template>
<script>
import { mapState, mapActions } from 'pinia';

import ApplicationClosureCard from '@/components/util/ApplicationClosureCard.vue';
import ApplicationPCFHeader from '@/components/util/ApplicationPCFHeader.vue';
import NavButton from '@/components/util/NavButton.vue';

import { useApplicationStore } from '@/store/application.js';
import { useCcfriAppStore } from '@/store/ccfriApp.js';
import { useNavBarStore } from '@/store/navBar.js';
import { useReportChangesStore } from '@/store/reportChanges.js';

import rules from '@/utils/rules.js';

import { CHANGE_TYPES, CCFRI_HAS_CLOSURE_FEE_TYPES, CCFRI_FEE_CORRECT_TYPES } from '@/utils/constants.js';
import alertMixin from '@/mixins/alertMixin.js';
import closureMixin from '@/mixins/closureMixin.js';

export default {
  components: {
    ApplicationClosureCard,
    ApplicationPCFHeader,
    NavButton,
  },
  mixins: [alertMixin, closureMixin],
  async beforeRouteLeave(_to, _from, next) {
    await this.save(false);
    next();
  },
  async beforeRouteUpdate(_to, _from, next) {
    await this.save(false);
    next();
  },
  computed: {
    ...mapState(useNavBarStore, [
      'navBarList',
      'changeType',
      'nextPath',
      'previousPath',
      'isChangeRequest',
      'getChangeActionNewFacByFacilityId',
    ]),
    ...mapState(useReportChangesStore, ['changeRequestStatus']),
    currentFacility() {
      return this.navBarList.find((el) => el.ccfriApplicationId == this.$route.params.urlGuid);
    },
    isReadOnly() {
      if (this.currentFacility.unlockCcfri) {
        return false;
      }
      if (this.isChangeRequest) {
        return this.changeRequestStatus && this.changeRequestStatus !== 'INCOMPLETE';
      }
      return this.applicationStatus === 'SUBMITTED';
    },
  },
  watch: {
    '$route.params.urlGuid': {
      async handler() {
        window.scrollTo(0, 0);
        try {
          this.setIsApplicationProcessing(true);
          await this.loadCCFRIFacility(this.$route.params.urlGuid);
          await this.loadClosures(this.$route.params.urlGuid);
        } catch (error) {
          console.log(error);
          this.setFailureAlert('An error occurred while loading. Please try again later.');
        } finally {
          this.setIsApplicationProcessing(false);
        }
      },
      immediate: true,
    },
    isApplicationFormValidated: {
      handler() {
        this.$refs.form?.validate();
        this.$refs.closureCards?.validateForm();
      },
    },
  },
  created() {
    this.rules = rules;
    this.CCFRI_HAS_CLOSURE_FEE_TYPES = CCFRI_HAS_CLOSURE_FEE_TYPES;
    this.CCFRI_FEE_CORRECT_TYPES = CCFRI_FEE_CORRECT_TYPES;
  },
  methods: {
    ...mapActions(useApplicationStore, ['setIsApplicationProcessing', 'validateApplicationForm']),
    ...mapActions(useCcfriAppStore, ['loadCCFRIFacility', 'updateApplicationCCFRI']),
    ...mapActions(useNavBarStore, ['setNavBarCCFRIClosuresComplete']),
    previous() {
      this.$router.push(this.previousPath);
    },
    next() {
      this.$router.push(this.nextPath);
    },
    async save(showMessage) {
      if (this.isReadonly) return;
      try {
        this.setIsApplicationProcessing(true);
        if (this.loadedModel?.hasClosureFees !== this.CCFRIFacilityModel?.hasClosureFees) {
          await this.updateApplicationCCFRI(this.$route.params.urlGuid, {
            hasClosureFees: this.CCFRIFacilityModel.hasClosureFees,
          });
          this.loadedModel.hasClosureFees = this.CCFRIFacilityModel.hasClosureFees;
        }
        await this.processUpdatedClosures();
        await this.loadClosures(this.$route.params.urlGuid);
        this.setNavBarCCFRIClosuresComplete({
          ccfriId: this.$route.params.urlGuid,
          complete: this.isClosuresSectionComplete,
        });
        // if (this.changeType == CHANGE_TYPES.NEW_FACILITY) {
        //   const newFac = this.getChangeActionNewFacByFacilityId(this.CCFRIFacilityModel.facilityId);
        //   newFac.ccfri.isCCFRIComplete = this.isClosuresSectionComplete();
        // }
        if (showMessage) {
          this.setSuccessAlert('Application saved successfully.');
        }
      } catch (error) {
        console.log(error);
        this.setFailureAlert('An error occurred while saving.');
      } finally {
        this.setIsApplicationProcessing(false);
      }
    },
  },
};
</script>
