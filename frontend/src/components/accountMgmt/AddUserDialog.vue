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
                  :items="USER_TYPE_ITEMS"
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
                      item-title="roleName"
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
          <AppButton display="inline" :primary="false" size="small" :disabled="isProcessing" @click="closeDialog">
            Cancel
          </AppButton>
        </v-col>
        <v-col>
          <AppButton
            v-if="step > 1"
            display="inline"
            :primary="false"
            size="small"
            :disabled="isProcessing"
            @click="step--"
            >Back</AppButton
          >
        </v-col>
        <v-col>
          <AppButton v-if="step < 2" display="inline" size="small" class="ml-2" @click="advanceForm">Next</AppButton>
          <AppButton
            v-if="step === 2"
            display="inline"
            size="small"
            class="ml-2"
            type="submit"
            :loading="isProcessing"
            :disabled="!formValid || isProcessing"
            @click.prevent="addUser"
          >
            Add
          </AppButton>
        </v-col>
      </v-row>
    </template>
  </AppDialog>
  <AppDialog
    v-model="showLinkConfirmationDialog"
    title="Link Existing BCeID"
    max-width="500px"
    text-alignment="left"
    @close="cancelLinkContact"
  >
    <template #content>
      <div class="text-center">
        <p><strong>This BCeID exists but is not associated with any organization.</strong></p>
        <p v-if="pendingLinkContact?.deactivated" class="mt-2">
          This account is currently deactivated and will be reactivated when linked.
        </p>
        <p class="mt-4">
          Would you like to link
          <strong>{{ pendingLinkContact?.firstName }} {{ pendingLinkContact?.lastName }}</strong> ({{
            userFields.bceid
          }}) to your organization?
        </p>
      </div>
    </template>
    <template #button>
      <v-row justify="center">
        <v-col cols="auto">
          <AppButton :primary="false" size="small" @click="cancelLinkContact">Cancel</AppButton>
        </v-col>
        <v-col cols="auto">
          <AppButton size="small" :loading="isProcessing" :disabled="isProcessing" @click="confirmLinkContact">
            Link User
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
import { ROLES } from '@/utils/constants';
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

const USER_TYPE_ITEMS = [
  {
    type: USER_TYPE.PORTAL,
    description: 'Portal User - can log in to the portal (Business BCeID required)',
  },
  {
    type: USER_TYPE.CONTACT,
    description: 'Contact Only - cannot log in to the portal (Business BCeID not required)',
  },
];

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
      userType: USER_TYPE.PORTAL,
      portalRole: ROLES.READ_ONLY,
      facilities: [],
      selectedFacilities: [],
      userFields: {
        firstName: '',
        lastName: '',
        email: '',
        telephone: '',
        bceid: '',
      },
      isProcessing: false,
      showSuccessDialog: false,
      showLinkConfirmationDialog: false,
      pendingLinkContact: null,
    };
  },
  computed: {
    ...mapState(useOrganizationStore, ['organizationId']),
    ...mapState(useAppStore, ['lookupInfo']),
    portalRoles() {
      return (this.lookupInfo?.roles || []).map(({ roleId, roleName, roleNumber }) => {
        return { roleId, roleName, roleNumber };
      });
    },
    isFacilityAdmin() {
      return this.portalRole === ROLES.FAC_ADMIN_ADVANCED || this.portalRole === ROLES.FAC_ADMIN_BASIC;
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
  },
  watch: {
    show(val) {
      this.dialog = val;
    },
  },
  async created() {
    this.USER_TYPE = USER_TYPE;
    this.USER_TYPE_ITEMS = USER_TYPE_ITEMS;
    await this.loadData();
  },
  methods: {
    async loadData() {
      try {
        this.facilities = await OrganizationService.getFacilities(this.organizationId);
      } catch (error) {
        this.setFailureAlert('There was an error loading the facilities');
        console.error('Error loading facilities: ', error);
      }
    },
    closeDialog() {
      this.showLinkConfirmationDialog = false;
      this.pendingLinkContact = null;
      this.clearFields();
      this.$emit('close-add-dialog');
      setTimeout(() => (this.step = 1), 350);
    },
    advanceForm() {
      if (
        this.step === 1 &&
        this.userType === USER_TYPE.PORTAL &&
        this.isFacilityAdmin &&
        !allRulesAreValid(this.rulesForFacilities, this.selectedFacilities)
      ) {
        return this.$refs.form?.validate();
      }
      this.step++;
    },
    clearFields() {
      this.$refs.form?.reset();
      this.step = 1;
      this.userType = USER_TYPE.PORTAL;
      this.portalRole = ROLES.READ_ONLY;
    },
    async addUser() {
      this.$refs.form?.validate();
      if (this.formValid) {
        try {
          this.isProcessing = true;
          const payload = {
            firstName: this.userFields.firstName,
            lastName: this.userFields.lastName,
            email: this.userFields.email,
            telephone: this.userFields.telephone,
            organizationId: this.organizationId,
          };

          if (this.userType === USER_TYPE.PORTAL) {
            payload.role = this.portalRoles.find((role) => role.roleNumber === this.portalRole) || null;
            payload.bceid = this.userFields.bceid;
            payload.facilities = this.isFacilityAdmin ? this.selectedFacilities : [];
          } else {
            payload.facilities = [];
          }
          const response = await contactService.addContact(payload);

          if (response?.orphaned) {
            this.pendingLinkContact = response;
            this.dialog = false;
            this.showLinkConfirmationDialog = true;
            return;
          }

          this.clearFields();
          this.dialog = false;
          this.showSuccessDialog = true;
          this.$emit('contact-created', response);
        } catch (e) {
          if (e.response?.status === 412) {
            this.setFailureAlert(
              e.response?.data?.message || 'This BCeID is already associated with another organization.',
            );
            return;
          }
          this.setFailureAlert('Failed to Add User');
          console.error(e);
        } finally {
          this.isProcessing = false;
        }
      }
    },
    async confirmLinkContact() {
      try {
        this.isProcessing = true;
        const payload = {
          contactId: this.pendingLinkContact.contactId,
          organizationId: this.organizationId,
          role: this.portalRoles.find((role) => role.roleNumber === this.portalRole) || null,
          facilities: this.isFacilityAdmin ? this.selectedFacilities : [],
        };

        await contactService.linkContactWithOrg(payload);

        this.showLinkConfirmationDialog = false;
        this.pendingLinkContact = null;
        this.clearFields();
        this.dialog = false;
        this.showSuccessDialog = true;
        this.$emit('contact-created');
      } catch (e) {
        if (e.response?.status === 412) {
          this.setFailureAlert(
            e.response?.data?.message || 'This BCeID is already associated with another organization.',
          );
          return;
        }
        this.setFailureAlert('Failed to Link User');
        console.error(e);
      } finally {
        this.isProcessing = false;
      }
    },
    cancelLinkContact() {
      this.showLinkConfirmationDialog = false;
      this.pendingLinkContact = null;
      this.dialog = true;
      this.isProcessing = false;
    },
    goToManageUsers() {
      this.showSuccessDialog = false;
      this.$emit('close-add-dialog');
    },
  },
};
</script>
