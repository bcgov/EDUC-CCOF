<template>
  <v-form
    ref="form"
    v-model="model.isFacilityComplete"
    :class="loading ? 'ccof-skeleton-loader' : ''"
  >
    <v-container>
      <v-row
        justify="center"
        class="pt-4, pb-4"
      >
        <span class="text-h5">Information to Determine Eligibility</span>
      </v-row>
      <v-row justify="space-around">
        <v-card
          class="cc-top-level-card"
          width="1200"
        >
          <v-container>
            <v-row>
              <v-col
                cols="12"
                md="12"
              >
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
              <v-col
                cols="12"
                md="6"
              >
                <v-text-field
                  v-model="model.licenseNumber"
                  :disabled="isLocked"
                  variant="outlined"
                  required
                  :rules="rules.required"
                  label="Facility Licence Number"
                />
              </v-col>
              <v-col
                cols="12"
                md="6"
              >
                <v-menu
                  v-if="!isLocked"
                  v-model="model.calendarMenu"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template #activator="{ props }">
                    <v-text-field
                      v-model="model.licenseEffectiveDate"
                      readonly
                      variant="outlined"
                      required
                      :rules="rules.required"
                      label="Effective Date of Current Licence"

                      v-bind="props"
                    />
                  </template>
                  <v-date-picker
                    v-model="model.licenseEffectiveDate"
                    @input="model.calendarMenu = false"
                  />
                </v-menu>

                <v-text-field
                  v-if="isLocked"
                  v-model="model.licenseEffectiveDate"
                  disabled
                  variant="outlined"
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
                  <v-radio
                    label="No"
                    value="no"
                  />
                  <v-radio
                    label="Yes"
                    value="yes"
                  />
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

      <NavButton
        :is-next-displayed="true"
        :is-save-displayed="true"
        :is-save-disabled="isLocked"
        :is-next-disabled="!model.isFacilityComplete"
        :is-processing="processing"
        @previous="previous"
        @next="next"
        @validate-form="validateForm()"
        @save="saveClicked()"
      />
    </v-container>
  </v-form>
</template>

<script>
import facilityMixin from '../../../mixins/facilityMixin.js';
import { ORGANIZATION_PROVIDER_TYPES } from '../../../utils/constants.js';

export default {
  mixins: [facilityMixin],
  data() {
    return {
      providerType: ORGANIZATION_PROVIDER_TYPES.FAMILY,
    };
  },
};
</script>
