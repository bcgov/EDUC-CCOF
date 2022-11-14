<template>
  <v-form ref="form" v-model="isValidForm">
    <v-container>
      <v-row justify="space-around">
        <v-card class="cc-top-level-card" width="1200">
          <v-container>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field outlined required v-model.number="model.facilityLicenceNumber" type="number" :rules="rules.required" label="Facility Licence Number" />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field outlined required v-model.number="model.effectiveDate" type="number" :rules="[...rules.required, ...rules.YYYY]" label="Effective Date of Current Licence (YYYY-MM-DD)" />
              </v-col>
            </v-row>

            <v-row>
              <v-col>
                <label>Has this facility or you as the applicant ever received funding under the Child Care Operating Funding Program?</label>
                <v-radio-group row v-model="model.hasReceivedFunding">
                  <v-radio label="No" value="no"></v-radio>
                  <v-radio label="Yes" value="yes"></v-radio>
                </v-radio-group>
              </v-col>
            </v-row>

            <v-row v-show="model.hasReceivedFunding === 'yes'">
              <v-col>
                <v-text-field outlined required v-model="model.facilityName" :rules="model.hasReceivedFunding === 'yes' ? rules.required : []" label="Facility Name" />
              </v-col>
            </v-row>

          </v-container>
        </v-card>
      </v-row>

      <v-row justify="space-around">
        <v-btn color="info" outlined required x-large @click="previous()">Back</v-btn>
        <v-btn color="secondary" outlined x-large @click="next()" :disabled="!isValidForm">Next</v-btn>
        <v-btn color="primary" outlined x-large @click="save()">Save</v-btn>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>

import { PATHS } from '@/utils/constants';
import rules from '@/utils/rules';
import { mapActions } from 'vuex';
import alertMixin from '@/mixins/alertMixin';

let model = {};

export default {
  mixins: [alertMixin],
  props: {
  },
  computed: {
  },
  data() {
    return {
      model,
      isValidForm: undefined,
      rules,
      calendarMenu: false,
    };
  },
  methods: {
    ...mapActions('familyEligibility', ['saveFamilyEligibility']),

    previous() {
      this.$router.push(PATHS.family.orgInfo);
    },
    next() {
      this.$router.push(PATHS.family.fundAmount);
    },
    async save() {
      console.log('SAVING');

      this.processing = true;
      this.saveModel();

      try {
        await this.saveFamilyEligibility();
        this.setSuccessAlert('Success! Eligibility information has been saved.');
      } catch (error) {
        this.setFailureAlert('An error occurred while saving. Please try again later.');
      }
      this.processing = false;
    },
    saveModel() {
      this.$store.commit('familyEligibility/model', this.model);
    }
  },
  mounted() {
    console.log('MOUNTED', this.model);
    this.model = this.$store.state.familyEligibility.model ?? model;
  },
  beforeRouteLeave(_to, _from, next) {
    console.log('LEAVING');
    this.saveModel();
    next();
  }
};
</script>
