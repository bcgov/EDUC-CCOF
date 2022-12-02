<template>
  <v-form ref="form" v-model="isValidForm">
    <v-container>
      <v-row justify="space-around">
        <v-card class="cc-top-level-card" width="1200">
          <v-container>
            <v-row>
              <v-col>
                <v-text-field outlined required v-model="model.facilityName" :rules="rules.required" label="Facility Name (as it appears on the Community Care Assisted Living Act licence)" />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="6">
                <v-text-field outlined required v-model="model.yearBeginOperation" :rules="rules.required" label="Year Facility Began operation (YYYY)" />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field outlined required v-model="model.facilityAddress" :rules="rules.required" label="Facility Street Address" />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="6">
                <v-text-field outlined required v-model="model.city" :rules="rules.required" label="City/Town" />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field outlined required v-model="model.postalCode" :rules="[...rules.required, ...rules.postalCode]" label="Postal Code" />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="6">
                <v-text-field outlined required v-model="model.contactName" :rules="rules.required" label="Facility Contact Name" />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field outlined required v-model="model.position" :rules="rules.required" label="Position" />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="6">
                <v-text-field outlined required v-model="model.phone" :rules="rules.required" label="Business Phone" />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field outlined required v-model="model.email" :rules="[...rules.required, ...rules.email]" label="Organization Facility Email" />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="6">
                <v-text-field outlined required v-model="model.licenseNumber" :rules="rules.required" label="Facility Licence Number" />
              </v-col>
              <v-col cols="12" md="6">
                <v-menu v-model="model.calendarMenu" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="auto">
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field outlined required v-model="model.licenseEffectiveDate" :rules="rules.notRequired" label="Effective Date of Current Licence" readonly v-bind="attrs" v-on="on"/>
                  </template>
                  <v-date-picker v-model="model.licenseEffectiveDate" @input="model.calendarMenu = false"/>
                </v-menu>
              </v-col>
            </v-row>

            <v-row>
              <v-col>
                <label>Has this facility or you as the applicant ever received funding
                  under the Child Care Operating Funding Program?</label>
                <v-radio-group row v-model="model.hasReceivedFunding" :rules="rules.notRequired">
                  <v-radio label="No" value="no"></v-radio>
                  <v-radio label="Yes" value="yes"></v-radio>
                  <v-radio label="Yes, as facility" value="yesFacility"></v-radio>
                </v-radio-group>
              </v-col>
            </v-row>

            <v-row v-show="model.hasReceivedFunding === 'yesFacility'">
              <v-col>
                <v-text-field outlined required v-model="model.fundingFacility" :rules="model.hasReceivedFunding === 'yesFacility' ? rules.notRequired : []" label="Facility Name" />
              </v-col>
            </v-row>

          </v-container>
        </v-card>
      </v-row>

      <v-row justify="space-around">
        <v-btn color="info" outlined required x-large @click="previous()">Back</v-btn>
        <v-btn color="secondary" outlined x-large @click="next()" :disabled="!isValidForm">Next</v-btn>
        <v-btn color="primary" outlined x-large :loading="processing" @click="saveClicked()">Save</v-btn>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>

import { PATHS } from '@/utils/constants';
import rules from '@/utils/rules';
import { mapActions, mapState, mapMutations, } from 'vuex';
import alertMixin from '@/mixins/alertMixin';


export default {
  mixins: [alertMixin],
  props: {
  },
  computed: {
    ...mapState('facility', ['facilityModel', 'facilityId']),
    ...mapState('app', ['navBarList']),
  },
  beforeRouteLeave(_to, _from, next) {
    this.setNavBarFacilityComplete({facilityId: this.$route.params.urlGuid, complete: this.isValidForm});
    this.addFacilityToStore( {facilityId: this.$route.params.urlGuid, facilityModel: this.model});
    next();
  },  
  watch: {
    '$route.params.urlGuid': {
      handler() {
        let facilityId = this.$route.params.urlGuid;
        if (facilityId) {
          this.loadFacility(facilityId);
        } else {
          this.newFacility();
        }
      },
      immediate: true,
      deep: true
    },
    facilityModel: {
      handler() {
        this.model = JSON.parse(JSON.stringify(this.facilityModel));
        this.$refs.form?.resetValidation();
      },
      immediate: true,
      deep: true
    }
  },
  data() {
    return {
      rules,
      processing: false,
      model: {},
      isValidForm: undefined
    };
  },
  
  methods: {
    ...mapActions('facility', ['loadFacility', 'saveFacility', 'newFacility']),
    ...mapMutations('facility', ['setFacilityModel', 'addFacilityToStore']),
    ...mapMutations('app', ['setNavBarFacilityComplete']),
    previous() {
      let navBar = this.$store.getters['app/getNextPrevByFacilityId'](this.$route.params.urlGuid);
      if (navBar?.ccofBaseFundingId) {
        this.$router.push(PATHS.group.fundAmount + '/' + navBar.ccofBaseFundingId);
      } else {
        this.$router.push(PATHS.group.orgInfo);
      }
      
    },
    next() {
      // await this.save();
      let navBar = this.$store.getters['app/getNavByFacilityId'](this.$route.params.urlGuid);
      console.log('navbar: ', navBar);
      if (navBar?.ccofBaseFundingId) {
        this.$router.push(PATHS.group.fundAmount + '/' + navBar.ccofBaseFundingId);
      } else {
        this.$router.push(PATHS.group.fundAmount);
      }
    },
    async saveClicked() {
      await this.save();
      if (!this.$route.params.urlGuid) {
        this.$router.push(PATHS.group.facInfo + '/' + this.facilityId);
      }
    },
    async save() {
      this.processing = true;
      this.setFacilityModel(this.model);
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
