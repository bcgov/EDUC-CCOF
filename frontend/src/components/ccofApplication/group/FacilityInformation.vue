<template>
  <v-form ref="form" v-model="isValidForm">
    <v-container>
      <v-row justify="space-around">
        <v-card class="cc-top-level-card" width="1200">
          <v-container>
            <v-row>
              <v-col>
                <v-text-field outlined required v-model="facilityName" :rules="rules.required" label="Facility Name (as it appears on the Community Care Assisted Living Act licence)" />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="6">
                <v-text-field outlined required v-model.number="yearBeginOperation" type="number" :rules="rules.required" label="Year Facility Began operation (YYYY)" />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field outlined required v-model="facilityAddress" :rules="rules.required" label="Facility Street Address" />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="6">
                <v-text-field outlined required v-model="city" :rules="rules.required" label="City/Town" />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field outlined required v-model="postalCode" :rules="[...rules.required, ...rules.postalCode]" label="Postal Code" />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="6">
                <v-text-field outlined required v-model="contactName" :rules="rules.required" label="Facility Contact Name" />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field outlined required v-model="position" :rules="rules.required" label="Position" />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="6">
                <v-text-field outlined required v-model="phone" :rules="rules.required" label="Business Phone" />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field outlined required v-model="email" :rules="[...rules.required, ...rules.email]" label="Organization Facility Email" />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="6">
                <v-text-field outlined required v-model.number="licenseNumber" :rules="rules.required" label="Facility Licence Number" />
              </v-col>
              <v-col cols="12" md="6">
                <v-menu v-model="calendarMenu" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="auto">
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field outlined required v-model="licenseEffectiveDate" label="Effective Date of Current Licence (YYYY-MM-DD)" readonly v-bind="attrs" v-on="on">
                    </v-text-field>
                  </template>
                  <v-date-picker v-model="licenseEffectiveDate" @input="calendarMenu = false">
                  </v-date-picker>
                </v-menu>
              </v-col>
            </v-row>

            <v-row>
              <v-col>
                <label>Has this facility or you as the applicant ever received funding
                  under the Child Care Operating Funding Program?</label>
                <v-radio-group row v-model="hasReceivedFunding">
                  <v-radio label="No" value="no"></v-radio>
                  <v-radio label="Yes" value="yes"></v-radio>
                  <v-radio label="Yes, as facility" value="yesFacility"></v-radio>
                </v-radio-group>
              </v-col>
            </v-row>

            <v-row v-show="hasReceivedFunding === 'yesFacility'">
              <v-col>
                <v-text-field outlined required v-model="facilityName" :rules="hasReceivedFunding === 'yesFacility' ? rules.required : []" label="Facility Name" />
              </v-col>
            </v-row>

          </v-container>
        </v-card>
      </v-row>

      <v-row justify="space-around">
        <v-btn color="info" outlined required x-large @click="previous()">Back</v-btn>
        <v-btn color="secondary" outlined x-large @click="next()" :disabled="!isValidForm">Next</v-btn>
        <v-btn color="primary" outlined x-large :loading="processing" @click="save()">Save</v-btn>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>

import { PATHS } from '@/utils/constants';
import rules from '@/utils/rules';
import { mapActions } from 'vuex';
import alertMixin from '@/mixins/alertMixin';


export default {
  mixins: [alertMixin],
  props: {
  },
  computed: {
    facilityName: {
      get() { return this.$store.state.facility.facilityName; },
      set(value) { this.$store.commit('facility/setFacilityName', value); }
    },
    city: {
      get() { return this.$store.state.facility.city; },
      set(value) { this.$store.commit('facility/setCity', value); }
    },
    facilityAddress: {
      get() { return this.$store.state.facility.facilityAddress; },
      set(value) { this.$store.commit('facility/setFacilityAddress', value); }
    },    
    postalCode: {
      get() { return this.$store.state.facility.postalCode; },
      set(value) { this.$store.commit('facility/setPostalCode', value); }
    },    
    licenseNumber: {
      get() { return this.$store.state.facility.licenseNumber; },
      set(value) { this.$store.commit('facility/setLicenseNumber', value); }
    },    
    yearBeginOperation: {
      get() { return this.$store.state.facility.yearBeginOperation; },
      set(value) { this.$store.commit('facility/setYearBeginOperation', value); }
    },    
    contactName: {
      get() { return this.$store.state.facility.contactName; },
      set(value) { this.$store.commit('facility/setContactName', value); }
    },    
    position: {
      get() { return this.$store.state.facility.position; },
      set(value) { this.$store.commit('facility/setPosition', value); }
    },    
    phone: {
      get() { return this.$store.state.facility.phone; },
      set(value) { this.$store.commit('facility/setPhone', value); }
    },        
    email: {
      get() { return this.$store.state.facility.email; },
      set(value) { this.$store.commit('facility/setEmail', value); }
    },    
    isValidForm: { 
      get () { return this.$store.state.organization.isValidForm; }, 
      set (value) { this.$store.commit('organization/setIsValidForm', value); }
    },       
  },
  watch: {
    '$route.params.urlFacilityId': {
      handler() {
        this.refreshWithFacility();
      },
      immediate: true,
      deep: true
    }
  },
  data() {
    return {
      licenseEffectiveDate: undefined,
      hasReceivedFunding: 'no',
      rules,
      calendarMenu: false,
      processing: false,
    };
  },
  methods: {
    ...mapActions('facility', ['loadFacility', 'saveFacility', 'newFacility']),

    previous() {
      this.$router.push(PATHS.group.orgInfo);
    },
    next() {
      this.$router.push(PATHS.group.fundAmount);
    },
    refreshWithFacility() {
      let facilityId = this.$route.params.urlFacilityId;
      if (facilityId) {
        this.loadFacility(facilityId);
      } else {
        this.newFacility();
      }
    },
    async save() {
      this.processing = true;
      try {
        await this.saveFacility();
        this.setSuccessAlert('Success! Facility information has been saved.');
      } catch (error) {
        this.setFailureAlert('An error occurred while saving. Please try again later.');
      }
      this.processing = false;
    },

  }
};
</script>
