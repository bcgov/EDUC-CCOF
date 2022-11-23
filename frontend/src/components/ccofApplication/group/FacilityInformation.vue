<template>
  <v-form ref="form" v-model="facilityModel.isValidForm">
    <v-container>
      <v-row justify="space-around">
        <v-card class="cc-top-level-card" width="1200">
          <v-container>
            <v-row>
              <v-col>
                <v-text-field outlined required v-model="facilityModel.facilityName" :rules="rules.required" label="Facility Name (as it appears on the Community Care Assisted Living Act licence)" />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="6">
                <v-text-field outlined required v-model.number="facilityModel.yearBeginOperation" type="number" :rules="rules.required" label="Year Facility Began operation (YYYY)" />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field outlined required v-model="facilityModel.facilityAddress" :rules="rules.required" label="Facility Street Address" />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="6">
                <v-text-field outlined required v-model="facilityModel.city" :rules="rules.required" label="City/Town" />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field outlined required v-model="facilityModel.postalCode" :rules="[...rules.required, ...rules.postalCode]" label="Postal Code" />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="6">
                <v-text-field outlined required v-model="facilityModel.contactName" :rules="rules.required" label="Facility Contact Name" />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field outlined required v-model="facilityModel.position" :rules="rules.required" label="Position" />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="6">
                <v-text-field outlined required v-model="facilityModel.phone" :rules="rules.required" label="Business Phone" />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field outlined required v-model="facilityModel.email" :rules="[...rules.required, ...rules.email]" label="Organization Facility Email" />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="6">
                <v-text-field outlined required v-model="facilityModel.licenseNumber" :rules="rules.required" label="Facility Licence Number" />
              </v-col>
              <v-col cols="12" md="6">
                <v-menu v-model="calendarMenu" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="auto">
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field outlined required v-model="facilityModel.licenseEffectiveDate" label="Effective Date of Current Licence (YYYY-MM-DD)" readonly v-bind="attrs" v-on="on">
                    </v-text-field>
                  </template>
                  <v-date-picker v-model="facilityModel.licenseEffectiveDate" @input="calendarMenu = false">
                  </v-date-picker>
                </v-menu>
              </v-col>
            </v-row>

            <v-row>
              <v-col>
                <label>Has this facility or you as the applicant ever received funding
                  under the Child Care Operating Funding Program?</label>
                <v-radio-group row v-model="facilityModel.hasReceivedFunding">
                  <v-radio label="No" value="no"></v-radio>
                  <v-radio label="Yes" value="yes"></v-radio>
                  <v-radio label="Yes, as facility" value="yesFacility"></v-radio>
                </v-radio-group>
              </v-col>
            </v-row>

            <v-row v-show="hasReceivedFunding === 'yesFacility'">
              <v-col>
                <v-text-field outlined required v-model="facilityModel.facilityName" :rules="hasReceivedFunding === 'yesFacility' ? rules.required : []" label="Facility Name" />
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
import { mapActions, mapState, mapMutations } from 'vuex';
import alertMixin from '@/mixins/alertMixin';


export default {
  mixins: [alertMixin],
  props: {
  },
  computed: {
    ...mapState('facility', ['facilityModel']),
    isValidForm: { 
      get () { return this.$store.state.organization.isValidForm; }, 
      set (value) { this.$store.commit('organization/setIsValidForm', value); }
    },       
  },
  watch: {
    '$route.params.urlGuid': {
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
  beforeRouteLeave(_to, _from, next) {
    console.log('leaving');
    next();
  },

  methods: {
    ...mapActions('facility', ['loadFacility', 'saveFacility', 'newFacility']),
    ...mapMutations('facility', ['setFacilityModel']),

    previous() {
      this.$router.push(PATHS.group.orgInfo);
    },
    next() {
      this.$router.push(PATHS.group.fundAmount);
    },
    async refreshWithFacility() {
      let facilityId = this.$route.params.urlGuid;
      if (facilityId) {
        await this.loadFacility(facilityId);
      } else {
        this.newFacility();
      }
    },
    async save() {
      this.processing = true;
      this.setFacilityModel(this.facilityModel);
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
