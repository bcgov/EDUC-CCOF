<template>
  <v-form ref="form" v-model="isValidForm">
    <v-container>
      <v-row justify="space-around">
        <v-card class="cc-top-level-card" width="1200">
          <v-container>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field outlined required v-model.number="facilityLicenceNumber" type="number" :rules="rules.required" label="Facility Licence Number" />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field outlined required v-model.number="effectiveDate" type="number" :rules="[...rules.required, ...rules.YYYY]" label="Effective Date of Current Licence (YYYY-MM-DD)" />
              </v-col>
            </v-row>

            <v-row>
              <v-col>
                <label>Has this facility or you as the applicant ever received funding under the Child Care Operating Funding Program?</label>
                <v-radio-group row v-model="hasReceivedFunding">
                  <v-radio label="No" value="no"></v-radio>
                  <v-radio label="Yes" value="yes"></v-radio>
                </v-radio-group>
              </v-col>
            </v-row>

            <v-row v-show="hasReceivedFunding === 'yes'">
              <v-col>
                <v-text-field outlined required v-model="facilityName" :rules="hasReceivedFunding === 'yes' ? rules.required : []" label="Facility Name" />
              </v-col>
            </v-row>

          </v-container>
        </v-card>
      </v-row>

      <v-row justify="space-around">
        <v-btn color="info" outlined required x-large @click="previous()">Back</v-btn>
        <v-btn color="secondary" outlined x-large @click="next()" :disabled="!isValidForm">Next</v-btn>
        <v-btn color="primary" outlined x-large>Save</v-btn>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>

import { PATHS } from '@/utils/constants';
import rules from '@/utils/rules';
import { mapActions } from 'vuex';


export default {
  props: {
  },
  computed: {
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
      isValidForm: undefined,
      facilityLicenceNumber: undefined,
      hasReceivedFunding: undefined,
      facilityName: undefined,
      effectiveDate: undefined,
      rules,
      calendarMenu: false,
    };
  },
  methods: {
    ...mapActions('facility', ['loadFacility']),

    previous() {
      this.$router.push(PATHS.family.orgInfo);
    },
    next() {
      this.$router.push(PATHS.family.fundAmount);
    },
    refreshWithFacility() {
      let x = this.$route.params.urlFacilityId;
      this.loadFacility(x);
    }
  }
};
</script>
