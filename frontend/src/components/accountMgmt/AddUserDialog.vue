<template>
  <AppDialog v-model="dialog" title="Add New User" max-width="800px" text-alignment="left" @close="closeDialog">
    <template #content>
      <v-form ref="form" v-model="formValid" @submit.prevent="addUser">
        <v-window v-model="step">
          <v-window-item :value="1">
            <v-row no-gutters>
              <v-col cols="12">
                <p>What type of user are you adding?</p>
                <v-select
                  v-model="userType"
                  :items="userTypes"
                  item-title="description"
                  item-value="type"
                  label="User Type"
                  variant="outlined"
                  density="compact"
                  class="mt-4"
                />
              </v-col>
              <v-col cols="12">
                <v-slide-y-transition>
                  <div v-show="userType === 'portal'">
                    <p>What level of portal access should this user have?</p>
                    <v-select
                      v-model="userRole"
                      :items="userRoles"
                      item-title="description"
                      item-value="type"
                      label="User Role"
                      variant="outlined"
                      density="compact"
                      class="mt-4"
                    />
                  </div>
                </v-slide-y-transition>
              </v-col>
              <v-col cols="12">
                <v-slide-y-transition>
                  <div v-show="newFacAdmin">
                    <p>Which facilities should this user have access to?</p>
                    <v-select
                      v-model="facilitiesSelected"
                      :items="facilities"
                      :rules="rulesForFacilities"
                      item-title="facilityName"
                      item-value="facilityId"
                      label="Facilities"
                      variant="outlined"
                      density="compact"
                      class="mt-4"
                      multiple
                    />
                  </div>
                </v-slide-y-transition>
              </v-col>
            </v-row>
          </v-window-item>
          <v-window-item :value="2">
            <v-row no-gutters class="pt-2">
              <v-col cols="12">
                <v-text-field v-model="userFields.firstName" label="First Name" density="compact" variant="outlined" />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="userFields.lastName"
                  label="Last Name"
                  density="compact"
                  variant="outlined"
                  :rules="rules.required"
                />
              </v-col>
              <v-col v-if="userType === 'portal'" cols="12">
                <v-text-field
                  v-model="userFields.bceid"
                  label="Business BCeID"
                  density="compact"
                  variant="outlined"
                  :rules="rules.required"
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="userFields.telephone"
                  label="Phone Number"
                  density="compact"
                  variant="outlined"
                  :rules="[...rules.required, rules.phone]"
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="userFields.email"
                  label="Email Address"
                  density="compact"
                  variant="outlined"
                  :rules="[...rules.required, ...rules.email]"
                />
              </v-col>
            </v-row>
          </v-window-item>
          <v-window-item :value="3" />
        </v-window>
      </v-form>
    </template>
    <template #button>
      <v-row class="text-center" justify="center">
        <v-col>
          <AppButton display="inline" :primary="false" size="small" @click="closeDialog">Cancel</AppButton>
        </v-col>
        <v-col>
          <AppButton v-if="step > 1" display="inline" :primary="false" size="small" @click="step--">Back</AppButton>
        </v-col>
        <v-col>
          <AppButton v-if="step < 2" display="inline" size="small" class="ml-2" @click="advanceForm">Next</AppButton>
          <AppButton
            v-if="step === 2"
            display="inline"
            size="small"
            class="ml-2"
            type="submit"
            :disabled="!formValid"
            @click.prevent="addUser"
          >
            Add
          </AppButton>
        </v-col>
      </v-row>
    </template>
  </AppDialog>
</template>

<script>
import { mapState } from 'pinia';
import { isEmpty } from 'lodash';
import { OFM_PORTAL_ROLES } from '@/utils/constants';
import { rules, allRulesAreValid } from '@/utils/rules';

import OrganizationService from '@/services/organizationService.js';
import { useOrganizationStore } from '@/store/ccof/organization';

import alertMixin from '@/mixins/alertMixin.js';
import AppButton from '@/components/guiComponents/AppButton.vue';
import AppDialog from '@/components/guiComponents/AppDialog.vue';

export default {
  name: 'AddUserDialog',
  components: { AppButton, AppDialog },
  mixins: [alertMixin],
  props: {
    show: {
      type: Boolean,
      required: true,
    },
  },
  emits: ['close-add-dialog'],
  data() {
    return {
      rules,
      dialog: false,
      formValid: true,
      step: 1,
      userType: 'portal',
      userTypes: [
        {
          type: 'portal',
          description: 'Portal User - can log in to the portal (Business BCeID required)',
        },
        {
          type: 'contact',
          description: 'Contact Only - cannot log in to the portal (Business BCeID not required)',
        },
      ],
      userRole: OFM_PORTAL_ROLES.READ_ONLY,
      userRoles: [
        {
          description: 'Organization Administrator',
          type: OFM_PORTAL_ROLES.ORG_ADMIN,
        },
        {
          description: 'Facility Administrator',
          type: OFM_PORTAL_ROLES.FAC_ADMIN,
        },
        {
          description: 'Read Only',
          type: OFM_PORTAL_ROLES.READ_ONLY,
        },
      ],
      facilities: [],
      facilitiesLoading: false,
      facilitiesSelected: [],
      userFields: {
        firstName: '',
        lastName: '',
        email: '',
        telephone: '',
        bceid: '',
      },
    };
  },
  computed: {
    ...mapState(useOrganizationStore, ['organizationId']),
    newFacAdmin() {
      return this.userRole === OFM_PORTAL_ROLES.FAC_ADMIN;
    },
    rulesForFacilities() {
      return [
        (v) => {
          if (this.newFacAdmin) {
            console.log('evaluating new fac admin', typeof v);
            return this.rules.required[0](v);
          } else {
            return true;
          }
        },
      ];
    },
  },
  watch: {
    show(val) {
      this.dialog = val;
    },
  },
  async mounted() {
    try {
      if (isEmpty(this.facilities)) {
        this.facilitiesLoading = true;
        this.facilities = await OrganizationService.loadFacilities(this.organizationId);
      }
    } catch (error) {
      this.setFailureAlert('There was an error loading the facilities');
      console.error('Error loading facilities: ', error);
    } finally {
      this.facilitiesLoading = false;
    }
  },
  methods: {
    closeDialog() {
      this.$emit('close-add-dialog');
      setTimeout(() => (this.step = 1), 350);
    },
    advanceForm() {
      if (
        this.step === 1 &&
        this.userType === 'portal' &&
        this.userRole === OFM_PORTAL_ROLES.FAC_ADMIN &&
        !allRulesAreValid(this.rulesForFacilities, this.facilitiesSelected)
      ) {
        return this.$refs.form?.validate();
      }
      this.step++;
    },
    clearFields() {
      this.step = 1;
      this.userType = 'portal';
      this.userRole = OFM_PORTAL_ROLES.READ_ONLY;
      this.facilitiesSelected = [];

      for (const k in this.userFields) {
        this.userFields[k] = '';
      }
    },
    addUser() {
      // For now, just close the dialog
      this.$refs.form?.validate();
      if (this.formValid) {
        alert('Adding User');
        this.closeDialog();
        setTimeout(this.clearFields, 350);
      }
    },
  },
};
</script>
