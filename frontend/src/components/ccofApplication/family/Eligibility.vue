<template>
  <v-form ref="form" v-model="model.isFacilityComplete">
    <v-container>
      <v-skeleton-loader :loading="loading" type="table-tbody" class="mb-12">
        <v-container fluid class="pa-0">
          <v-row justify="center" class="pt-4, pb-4">
            <span class="text-h5">Information to Determine Eligibility</span>
          </v-row>
          <v-row justify="space-around">
            <v-card class="cc-top-level-card" width="1200">
              <v-container>
                <v-row>
                  <v-col cols="12" md="12">
                    <v-text-field
                      v-model="model.facilityName"
                      :disabled="isLocked"
                      variant="outlined"
                      required
                      :rules="rules.required"
                      label="Facility Name"
                    />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="model.licenseNumber"
                      :disabled="isLocked"
                      variant="outlined"
                      required
                      :rules="rules.required"
                      label="Facility Licence Number"
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <AppDateInput
                      id="licence-effective-date"
                      v-model="model.licenseEffectiveDate"
                      :rules="[...rules.required, rules.MMDDYYYY]"
                      :disabled="isLocked"
                      :hide-details="isLocked"
                      label="Effective Date of Current Licence"
                    />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <v-radio-group
                      v-model="model.hasReceivedFunding"
                      :disabled="isLocked"
                      inline
                      :rules="rules.required"
                      label="Has this facility or you as the applicant ever received funding under the Child Care Operating Funding Program?"
                    >
                      <v-radio label="No" value="no" />
                      <v-radio label="Yes" value="yes" />
                    </v-radio-group>
                  </v-col>
                </v-row>

                <v-row v-show="model.hasReceivedFunding === 'yes'">
                  <v-col>
                    <v-text-field
                      v-model="model.fundingFacility"
                      :disabled="isLocked"
                      variant="outlined"
                      required
                      :rules="model.hasReceivedFunding === 'yes' ? rules.required : []"
                      label="Facility Name"
                    />
                  </v-col>
                </v-row>
              </v-container>
            </v-card>
          </v-row>
        </v-container>
      </v-skeleton-loader>

      <NavButton
        :is-next-displayed="true"
        :is-save-displayed="true"
        :is-save-disabled="isLocked"
        :is-next-disabled="!model.isFacilityComplete"
        :is-processing="processing"
        @previous="previous"
        @next="next"
        @validate-form="validateForm()"
        @save="save(true)"
      />
    </v-container>
  </v-form>
</template>

<script>
import AppDateInput from '@/components/guiComponents/AppDateInput.vue';
import facilityMixin from '@/mixins/facilityMixin.js';

export default {
  name: 'EligibilityComponent',
  components: { AppDateInput },
  mixins: [facilityMixin],
  async beforeRouteLeave(_to, _from, next) {
    await this.save(false);
    next();
  },
};
</script>
