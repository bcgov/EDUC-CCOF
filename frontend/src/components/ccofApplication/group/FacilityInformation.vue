<template>
  <v-form ref="form" v-model="model.isFacilityComplete">
    <v-skeleton-loader :loading="loading" type="table-tbody" class="mb-12">
      <v-container class="mx-lg-16">
        <v-card class="cc-top-level-card pa-2">
          <v-card-title class="text-center pb-0"><h3>Facility Information</h3></v-card-title>
          <v-container>
            <v-row>
              <v-col>
                <v-text-field
                  v-model="model.facilityName"
                  :disabled="isLocked"
                  variant="outlined"
                  required
                  :rules="rules.required"
                  label="Facility Name (as it appears on the Community Care Assisted Living Act Licence)"
                />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="model.yearBeganOperation"
                  :disabled="isLocked"
                  variant="outlined"
                  required
                  :rules="[...rules.required, ...rules.YYYY]"
                  label="Year Facility Began Operation (YYYY)"
                />
              </v-col>
            </v-row>

            <v-divider class="mb-2" />

            <AppAddressForm
              :disabled="isLocked"
              :address="model.facilityAddress"
              :city="model.city"
              :province="model.province"
              :postal-code="model.postalCode"
              :has-BC-province-validation="true"
              address-label="Facility Street Address"
              @update="updateStreetAddress"
            />

            <v-divider class="mb-2" />

            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="model.contactName"
                  :disabled="isLocked"
                  variant="outlined"
                  required
                  :rules="rules.required"
                  label="Facility Contact Name"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="model.position"
                  :disabled="isLocked"
                  variant="outlined"
                  required
                  :rules="rules.required"
                  label="Position"
                />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="model.phone"
                  :disabled="isLocked"
                  variant="outlined"
                  required
                  :rules="[...rules.required, rules.phone]"
                  label="Business Phone"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="model.email"
                  :disabled="isLocked"
                  variant="outlined"
                  required
                  :rules="[...rules.required, ...rules.email]"
                  label="Facility Email Address"
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
                  :rules="rules.required"
                  label="Has this facility or you as the applicant ever received funding under the Child Care Operating Funding Program?"
                  color="primary"
                  class="application-label"
                >
                  <v-radio label="No" value="no" />
                  <v-radio label="Yes" value="yes" />
                  <v-radio label="Yes, as facility" value="yesFacility" />
                </v-radio-group>
              </v-col>
            </v-row>

            <v-row v-if="model.hasReceivedFunding === 'yesFacility'">
              <v-col>
                <v-text-field
                  v-model="model.fundingFacility"
                  :disabled="isLocked"
                  variant="outlined"
                  required
                  :rules="rules.required"
                  label="Facility Name"
                />
              </v-col>
            </v-row>
          </v-container>
        </v-card>
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
      @save="saveClicked()"
    />
  </v-form>
</template>

<script>
import { isEmpty } from 'lodash';
import AppDateInput from '@/components/guiComponents/AppDateInput.vue';
import facilityMixin from '@/mixins/facilityMixin.js';

export default {
  components: { AppDateInput },
  mixins: [facilityMixin],
  async beforeRouteLeave(_to, _from, next) {
    if (!this.isModelEmpty) {
      await this.save(false);
    }
    next();
  },
  methods: {
    updateStreetAddress(updatedModel) {
      if (isEmpty(updatedModel)) return;
      this.model.facilityAddress = updatedModel.address;
      this.model.city = updatedModel.city;
      this.model.province = updatedModel.province;
      this.model.postalCode = updatedModel.postalCode;
    },
  },
};
</script>
