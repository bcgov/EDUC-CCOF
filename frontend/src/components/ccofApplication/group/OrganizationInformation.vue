<template>
  <v-form ref="form" v-model="isValidForm">
    <v-container>
      <v-row justify="space-around">
        <v-card class="cc-top-level-card" width="1200">
          <v-container>
            <v-row>
              <v-col>
                <v-text-field outlined required v-model="legalName" :rules="rules.required" label="Legal Name (first, middle and last) or Organization (as it appears in BC corporate Registry)" />
              </v-col>
            </v-row>

            <v-divider></v-divider>

            <v-card-subtitle> Organization Mailing Address </v-card-subtitle>

            <v-row>
              <v-col>
                <v-text-field outlined required v-model="address1" :rules="rules.required" label="Mailing Address" />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="6">
                <v-text-field outlined required v-model="city1" :rules="rules.required" label="City/Town" />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field outlined required v-model="postalCode1" :rules="[...rules.required, ...rules.postalCode]" label="Postal Code" />
              </v-col>
            </v-row>

            <v-divider></v-divider>

            <v-card-subtitle> Organization Street Address, if different from the Mailing Address (Optional) </v-card-subtitle>

            <v-row>
              <v-col>
                <v-text-field outlined required v-model="address2" label="Street Address" />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="6">
                <v-text-field outlined required v-model="city2" label="City/Town" />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field outlined required v-model="postalCode2" :rules="rules.postalCode" label="Postal Code" />
              </v-col>
            </v-row>

            <v-divider></v-divider>

            <v-row>
              <v-col cols="12" md="6">
                <v-text-field outlined required v-model="contactName" :rules="rules.required" label="Organization Contact Name" />
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
                <v-text-field outlined required v-model="businessId" :rules="rules.required" label="Business BCeID" />
              </v-col>
            </v-row>

            <v-divider></v-divider>

            <v-row>
              <v-col cols="12" md="6">
                <v-text-field outlined required v-model="email" type="email" :rules="[...rules.required, ...rules.email]" label="E-mail Address of Signing Authority" />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field outlined required :rules="rules.required" v-model="incNumber" type="number" label="Incorporation Number (as it appears in BC Corporate Registry)" />
              </v-col>
            </v-row>

            <v-divider></v-divider>

            <v-row>
              <v-col>
                <label>Type of Orgnization</label>
                <v-radio-group v-model="organizationType" :rules="rules.required">
                  <v-radio v-for="item in this.organizationTypeList" :key="item.id" :label="item.name" :value="item.id"></v-radio>
                </v-radio-group>
              </v-col>
            </v-row>

          </v-container>
        </v-card>
      </v-row>

      <v-row justify="space-around">
        <v-btn color="info" outlined x-large>Back</v-btn>
        <v-btn color="secondary" outlined x-large @click="next()" :disabled="!isValidForm">Next</v-btn>
        <v-btn color="primary" outlined x-large :loading="processing" @click="save()">Save</v-btn>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>

import { PATHS } from '@/utils/constants';
import rules from '@/utils/rules';
import alertMixin from '@/mixins/alertMixin';
import { mapGetters, mapState, mapActions, mapMutations } from 'vuex';


export default {
  props: {
  },
  computed: {
    ...mapState('app', ['organizationTypeList', 'navBarList']),
    ...mapState('organization', ['isStarted']),
    ...mapState('facility', ['facilityList']),
    ...mapGetters('auth', ['userInfo']),
    organizationId: {
      get() { return this.$store.state.organization.organizationId; },
      set(value) { this.$store.commit('organization/setOrganizationId', value); }
    },
    legalName: {
      get() { return this.$store.state.organization.legalName; },
      set(value) { this.$store.commit('organization/setLegalName', value); }
    },
    address1: {
      get() { return this.$store.state.organization.address1; },
      set(value) { this.$store.commit('organization/setAddress1', value); }
    },
    city1: {
      get() { return this.$store.state.organization.city1; },
      set(value) { this.$store.commit('organization/setCity1', value); }
    },
    postalCode1: {
      get() { return this.$store.state.organization.postalCode1; },
      set(value) { this.$store.commit('organization/setPostalCode1', value); }
    },
    address2: {
      get() { return this.$store.state.organization.address2; },
      set(value) { this.$store.commit('organization/setAddress2', value); }
    },
    city2: {
      get() { return this.$store.state.organization.city2; },
      set(value) { this.$store.commit('organization/setCity2', value); }
    },
    postalCode2: {
      get() { return this.$store.state.organization.postalCode2; },
      set(value) { this.$store.commit('organization/setPostalCode2', value); }
    },
    contactName: {
      get() { return this.$store.state.organization.contactName; },
      set(value) { this.$store.commit('organization/setContactName', value); }
    },
    position: {
      get() { return this.$store.state.organization.position; },
      set(value) { this.$store.commit('organization/setPosition', value); }
    },
    phone: {
      get() { return this.$store.state.organization.phone; },
      set(value) { this.$store.commit('organization/setPhone', value); }
    },
    businessId: {
      get() { return this.$store.state.organization.businessId; },
      set(value) { this.$store.commit('organization/setBusinessId', value); }
    },
    email: {
      get() { return this.$store.state.organization.email; },
      set(value) { this.$store.commit('organization/setEmail', value); }
    },
    incNumber: {
      get() { return this.$store.state.organization.incNumber; },
      set(value) { this.$store.commit('organization/setIncNumber', value); }
    },
    organizationType: {
      get() { return this.$store.state.organization.organizationType; },
      set(value) { this.$store.commit('organization/setOrganizationType', value); }
    },
  },
  mixins: [alertMixin],
  data() {
    return {
      rules,
      processing: false,
      isValidForm: true,
    };
  },
  mounted() {
    this.businessId = this.userInfo.userName;
    this.loadData();
  },
  beforeRouteLeave(_to, _from, next) {
    this.setIsOrganizationComplete(this.isValidForm);
    this.setIsStarted(true);
    next();
  },

  methods: {
    ...mapActions('organization', ['saveOrganization', 'loadOrganization']),
    ...mapMutations('organization', ['setIsStarted', 'setIsOrganizationComplete']),
    next() {
      if (this.navBarList && this.navBarList.length > 0) {
        this.$router.push(PATHS.group.facInfo + '/' + this.navBarList[0].facilityId);
      } else {
        this.$router.push(PATHS.group.facInfo);
      }
    },
    async save() {
      this.processing = true;
      try {
        await this.saveOrganization();
        this.setSuccessAlert('Success! Organization information has been saved.');
      } catch (error) {
        this.setFailureAlert('An error occurred while saving. Please try again later.');
      }
      this.processing = false;
    },
    async loadData() {
      if (this.isStarted) {
        return;
      }
      if (this.organizationId) {
        this.processing = true;
        try {
          await this.loadOrganization(this.organizationId);
        } catch (error) {
          console.log('Error loading organization.', error);
          this.setFailureAlert('An error occurred while saving. Please try again later.');
        }
        this.processing = false;
        this.setIsOrganizationComplete(this.isFormValid);
        this.setIsStarted(true);
      }
    }
  }
};
</script>
