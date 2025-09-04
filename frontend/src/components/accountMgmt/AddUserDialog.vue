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
                  <div v-show="userType === USER_TYPE.PORTAL">
                    <p>What level of portal access should this user have?</p>
                    <v-select
                      v-model="portalRole"
                      :items="portalRoles"
                      item-title="name"
                      item-value="roleNumber"
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
                  <div v-show="isFacilityAdmin">
                    <p>Which facilities should this user have access to?</p>
                    <v-select
                      v-model="selectedFacilities"
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
              <v-col v-if="userType === USER_TYPE.PORTAL" cols="12">
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
  <AppDialog
    v-model="showSuccessDialog"
    title="User Added"
    max-width="500px"
    text-alignment="left"
    @close="goToManageUsers"
  >
    <template #content>
      <div class="text-center">
        <p><strong>User Added Successfully</strong></p>
        <p class="mt-4">The new user has been added with the selected role and access.</p>
      </div>
    </template>

    <template #button>
      <v-row justify="center">
        <v-col cols="auto">
          <AppButton size="small" @click="goToManageUsers"> Return to Manage Users </AppButton>
        </v-col>
      </v-row>
    </template>
  </AppDialog>
</template>

<script>
import { mapState } from 'pinia';
import { useAppStore } from '@/store/app.js';
import { OFM_PORTAL_ROLES } from '@/utils/constants';
import { rules, allRulesAreValid } from '@/utils/rules';

import contactService from '@/services/contactService.js';
import OrganizationService from '@/services/organizationService.js';
import { useOrganizationStore } from '@/store/ccof/organization';

import alertMixin from '@/mixins/alertMixin.js';
import AppButton from '@/components/guiComponents/AppButton.vue';
import AppDialog from '@/components/guiComponents/AppDialog.vue';

const USER_TYPE = {
  PORTAL: 'portal',
  CONTACT: 'contact',
};

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
  emits: ['close-add-dialog', 'contact-created'],
  data() {
    return {
      rules,
      dialog: false,
      formValid: true,
      step: 1,
      USER_TYPE,
      userType: USER_TYPE.PORTAL,
      portalRole: OFM_PORTAL_ROLES.READ_ONLY,
      facilities: [],
      selectedFacilities: [],
      userFields: {
        firstName: '',
        lastName: '',
        email: '',
        telephone: '',
        bceid: '',
      },
      showSuccessDialog: false,
    };
  },
  computed: {
    ...mapState(useOrganizationStore, ['organizationId']),
    ...mapState(useAppStore, ['lookupInfo']),
    portalRoles() {
      return (this.lookupInfo?.roles || []).map((role) => ({
        name: role.roleName,
        roleNumber: role.roleNumber,
        roleId: role.roleId,
      }));
    },
    isFacilityAdmin() {
      return this.portalRole === OFM_PORTAL_ROLES.FAC_ADMIN;
    },
    rulesForFacilities() {
      return [
        (v) => {
          if (this.isFacilityAdmin) {
            return this.rules.required[0](v);
          }
          return true;
        },
      ];
    },
    userTypes() {
      return [
        {
          type: 'portal',
          description: 'Portal User - can log in to the portal (Business BCeID required)',
        },
        {
          type: 'contact',
          description: 'Contact Only - cannot log in to the portal (Business BCeID not required)',
        },
      ];
    },
  },
  watch: {
    show(val) {
      this.dialog = val;
    },
  },
  async created() {
    try {
      this.facilities = await OrganizationService.loadFacilities(this.organizationId);
    } catch (error) {
      this.setFailureAlert('There was an error loading the facilities');
      console.error('Error loading facilities: ', error);
    }
  },
  methods: {
    closeDialog() {
      this.clearFields();
      this.$emit('close-add-dialog');
      setTimeout(() => (this.step = 1), 350);
    },
    advanceForm() {
      if (
        this.step === 1 &&
        this.userType === USER_TYPE.PORTAL &&
        this.portalRole === OFM_PORTAL_ROLES.FAC_ADMIN &&
        !allRulesAreValid(this.rulesForFacilities, this.selectedFacilities)
      ) {
        return this.$refs.form?.validate();
      }
      this.step++;
    },
    clearFields() {
      this.step = 1;
      this.userType = USER_TYPE.PORTAL;
      this.portalRole = OFM_PORTAL_ROLES.READ_ONLY;
      this.selectedFacilities = [];

      for (const k in this.userFields) {
        this.userFields[k] = '';
      }
    },
    async addUser() {
      this.$refs.form?.validate();
      if (this.formValid) {
        try {
          const payload = {
            firstName: this.userFields.firstName,
            lastName: this.userFields.lastName,
            email: this.userFields.email,
            telephone: this.userFields.telephone,
            organizationId: this.organizationId,
          };

          if (this.userType === USER_TYPE.PORTAL) {
            const selectedRole = this.portalRoles.find((role) => role.roleNumber === this.portalRole);
            payload.role = selectedRole
              ? {
                  roleId: selectedRole.roleId,
                  roleNumber: selectedRole.roleNumber,
                }
              : null;
            payload.bceid = this.userFields.bceid;
            payload.facilities = this.portalRole === OFM_PORTAL_ROLES.FAC_ADMIN ? this.selectedFacilities : [];
          } else {
            payload.facilities = [];
          }
          const response = await contactService.addContact(payload);
          this.clearFields();
          this.dialog = false;
          this.showSuccessDialog = true;
          this.$emit('contact-created', response);
        } catch (e) {
          if (e.response?.status === 412) {
            this.setFailureAlert('This BCeID already exists in the system');
            return;
          }
          console.error(e);
        }
      }
    },
    goToManageUsers() {
      this.showSuccessDialog = false;
      this.$emit('close-add-dialog');
    },
  },
};
</script>
