<template>
  <AppDialog v-model="dialogOpen" title="Edit User" max-width="800px" text-alignment="left" @close="closeDialog">
    <template #content>
      <v-form ref="form" v-model="formValid" @submit.prevent="updateUser">
        <v-row no-gutters class="pt-2">
          <v-col cols="12" class="mb-2">
            <v-text-field
              v-model="editedUser.firstName"
              label="First Name"
              density="compact"
              variant="outlined"
              :rules="rules.required"
            />
          </v-col>
          <v-col cols="12" class="mb-2">
            <v-text-field
              v-model="editedUser.lastName"
              label="Last Name"
              density="compact"
              variant="outlined"
              :rules="rules.required"
            />
          </v-col>
          <v-col cols="12" class="mb-2">
            <v-text-field
              v-model="editedUser.bceid"
              label="Business BCeID"
              density="compact"
              variant="outlined"
              :rules="rules.required"
              disabled
            />
          </v-col>
          <v-col cols="12" class="mb-2">
            <v-text-field
              v-model="editedUser.telephone"
              label="Phone Number"
              density="compact"
              variant="outlined"
              :rules="[...rules.required, rules.phone]"
            />
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="editedUser.email"
              class="mb-4"
              label="Email Address"
              density="compact"
              variant="outlined"
              :rules="[...rules.required, ...rules.email]"
            />
          </v-col>
          <v-col v-if="hasPermission(PERMISSIONS.MANAGE_USERS_ALL)" cols="12">
            <v-select
              v-model="selectedRole"
              :items="portalRoles"
              item-title="roleName"
              item-value="roleNumber"
              label="User Role"
              variant="outlined"
              density="compact"
              class="mb-4"
              :disabled="isSelf"
            />
          </v-col>
          <v-col v-if="isFacilityAdminSelected" cols="12">
            <v-select
              v-model="selectedFacilities"
              :items="facilities"
              item-title="facilityName"
              item-value="facilityId"
              label="Facilities"
              variant="outlined"
              density="compact"
              class="mb-4"
              multiple
            />
          </v-col>
        </v-row>
      </v-form>
    </template>

    <template #button>
      <v-row class="text-center px-4 pb-2" justify="center">
        <v-col cols="auto">
          <AppButton :primary="false" size="small" class="mr-4" @click="closeDialog">Cancel</AppButton>
        </v-col>
        <v-col cols="auto">
          <AppButton
            :primary="true"
            size="small"
            class="ml-2"
            :loading="isProcessing"
            :disabled="!formValid || isProcessing"
            @click="updateUser"
          >
            Update
          </AppButton>
        </v-col>
      </v-row>
    </template>
  </AppDialog>
</template>

<script>
import { cloneDeep } from 'lodash';
import { mapState } from 'pinia';

import AppButton from '@/components/guiComponents/AppButton.vue';
import AppDialog from '@/components/guiComponents/AppDialog.vue';

import alertMixin from '@/mixins/alertMixin.js';
import permissionsMixin from '@/mixins/permissionsMixin.js';

import contactService from '@/services/contactService.js';
import OrganizationService from '@/services/organizationService.js';

import { useAppStore } from '@/store/app';
import { useAuthStore } from '@/store/auth';
import { useOrganizationStore } from '@/store/ccof/organization';

import { ROLES } from '@/utils/constants';
import { PERMISSIONS } from '@/utils/constants/permissions';
import { rules } from '@/utils/rules';

export default {
  name: 'EditUserDialog',
  components: { AppDialog, AppButton },
  mixins: [alertMixin, permissionsMixin],
  props: {
    show: { type: Boolean, default: false },
    user: { type: Object, required: true },
  },
  emits: ['close-edit-dialog', 'contact-updated'],
  data() {
    return {
      dialogOpen: false,
      formValid: false,
      isProcessing: false,
      editedUser: {},
      selectedRole: null,
      selectedFacilities: [],
      facilities: [],
      rules,
    };
  },
  computed: {
    ...mapState(useOrganizationStore, ['organizationId']),
    ...mapState(useAppStore, ['lookupInfo']),
    ...mapState(useAuthStore, ['userInfo']),
    portalRoles() {
      return (this.lookupInfo?.roles || []).map(({ roleId, roleName, roleNumber }) => {
        return { roleId, roleName, roleNumber };
      });
    },
    isFacilityAdminSelected() {
      return (
        this.hasPermission(PERMISSIONS.MANAGE_USERS_ALL) &&
        (this.selectedRole === ROLES.FAC_ADMIN_ADVANCED || this.selectedRole === ROLES.FAC_ADMIN_BASIC)
      );
    },
    isSelf() {
      return this.user.contactId === this.userInfo?.contactId;
    },
  },
  watch: {
    show(newVal) {
      this.dialogOpen = newVal;
      if (newVal) {
        this.loadEditUserData();
      }
    },
    selectedRole(newRole) {
      if (newRole === ROLES.FAC_ADMIN_ADVANCED || newRole === ROLES.FAC_ADMIN_BASIC) {
        this.loadFacilities();
      }
    },
  },
  methods: {
    async loadEditUserData() {
      this.editedUser = cloneDeep(this.user);
      this.selectedRole = this.user.role?.roleNumber ?? null;
      this.selectedFacilities = this.user.facilities?.map((f) => f.facilityId) || [];
      if (this.isFacilityAdminSelected) {
        await this.loadFacilities();
      }
    },
    async loadFacilities() {
      try {
        this.facilities = await OrganizationService.loadFacilities(this.organizationId);
      } catch (error) {
        console.error('Failed to load facilities', error);
        this.setFailureAlert('Error loading facilities.');
      }
    },
    async updateUser() {
      const isValid = await this.$refs.form.validate();
      if (!isValid) return;
      try {
        this.isProcessing = true;
        const payload = {
          firstName: this.editedUser.firstName,
          lastName: this.editedUser.lastName,
          email: this.editedUser.email,
          telephone: this.editedUser.telephone,
        };

        if (this.hasPermission(PERMISSIONS.MANAGE_USERS_ALL)) {
          payload.role = this.portalRoles.find((role) => role.roleNumber === this.selectedRole) || null;
          payload.facilities = this.isFacilityAdminSelected ? this.selectedFacilities : [];
        }

        await contactService.updateContact(this.editedUser.contactId, payload);
        this.setSuccessAlert(`${this.editedUser.firstName} ${this.editedUser.lastName}'s info has been updated`);
        this.$emit('contact-updated');
      } catch (error) {
        this.setFailureAlert('Failed to update user');
        console.error('Error updating user:', error);
      } finally {
        this.isProcessing = false;
        this.closeDialog();
      }
    },
    closeDialog() {
      this.dialogOpen = false;
      this.$emit('close-edit-dialog');
    },
  },
};
</script>
