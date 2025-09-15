<template>
  <v-container fluid class="pa-12">
    <h1>Manage Users</h1>
    <p class="mb-6">
      <b>{{ organizationName }}</b> <br />
      ID: {{ organizationAccountNumber }}
    </p>
    <v-row>
      <v-col class="d-flex justify-end">
        <AppButton
          v-if="hasPermission(PERMISSIONS.MANAGE_USERS_ALL)"
          size="small"
          prepend-icon="mdi-plus"
          display="inline-grid"
          @click="addUserDialogOpen = true"
        >
          Add User
        </AppButton>
      </v-col>
    </v-row>
    <v-row v-if="contactsLoading" no-gutters>
      <v-col cols="12">
        <v-card variant="outlined" class="soft-outline fill-height px-2">
          <v-skeleton-loader type="paragraph" />
        </v-card>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col>
        <v-data-table
          v-model:sort-by="sortBy"
          :headers="headers"
          :items="contacts"
          item-key="contactId"
          :items-per-page="10"
          density="compact"
          :mobile="null"
          mobile-breakpoint="md"
          class="soft-outline"
        >
          <template #[`item.edit-user`]="{ item }">
            <v-row no-gutters class="my-2 align-center justify-end justify-md-start">
              <AppButton v-if="mayEditUser(item)" :primary="false" size="small" @click="editUser(item.contactId)">
                Edit
              </AppButton>
            </v-row>
          </template>
          <template #[`item.accessType`]="{ item }">
            <div class="d-flex justify-end justify-md-start align-center flex-wrap">
              {{ item.accessType }}
              <v-chip v-if="item.isPrimaryContact" class="ml-2 primary-contact border-success" color="success" label>
                Primary Contact
              </v-chip>
            </div>
          </template>
          <template #[`item.remove-user`]="{ item }">
            <v-row no-gutters class="my-2 align-center justify-end">
              <AppButton
                v-if="mayRemoveUser(item)"
                :primary="false"
                color="#d8292f"
                size="small"
                @click="() => confirmDeleteUser(item.contactId)"
              >
                Remove
              </AppButton>
            </v-row>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <NavButton @previous="() => $router.push(PATHS.ROOT.HOME)" />
      </v-col>
    </v-row>
  </v-container>
  <RemoveUserDialog
    :show="removeUserDialogOpen"
    :user="targetUser"
    @contact-deactivated="contactDeactivatedHandler"
    @close-remove-dialog="removeUserDialogOpen = false"
  />
  <AddUserDialog
    :show="addUserDialogOpen"
    @contact-created="reloadContacts"
    @close-add-dialog="addUserDialogOpen = false"
  />
  <EditUserDialog
    :show="editUserDialogOpen"
    :user="targetUser"
    @contact-updated="reloadContacts"
    @close-edit-dialog="editUserDialogOpen = false"
  />
</template>

<script>
import { mapState, mapActions } from 'pinia';
import { isEmpty } from 'lodash';

import AppButton from '@/components/guiComponents/AppButton.vue';
import AddUserDialog from '@/components/accountMgmt/AddUserDialog.vue';
import EditUserDialog from '@/components/accountMgmt/EditUserDialog.vue';
import NavButton from '@/components/util/NavButton.vue';
import RemoveUserDialog from '@/components/accountMgmt/RemoveUserDialog.vue';

import alertMixin from '@/mixins/alertMixin.js';
import permissionsMixin from '@/mixins/permissionsMixin.js';

import contactService from '@/services/contactService.js';

import { useAuthStore } from '@/store/auth';
import { useOrganizationStore } from '@/store/ccof/organization';

import { ROLES, PATHS } from '@/utils/constants.js';
import { PERMISSIONS } from '@/utils/constants/permissions';

export default {
  name: 'ManageUsers',
  components: { AppButton, AddUserDialog, NavButton, RemoveUserDialog, EditUserDialog },
  mixins: [alertMixin, permissionsMixin],
  data() {
    return {
      tab: undefined,
      PATHS,
      contacts: [],
      targetUser: {},
      sortBy: [{ key: 'isPrimaryContact', order: 'desc' }],
      contactsLoading: false,
      removeUserDialogOpen: false,
      addUserDialogOpen: false,
      editUserDialogOpen: false,
    };
  },
  computed: {
    ...mapState(useOrganizationStore, [
      'organizationId',
      'organizationName',
      'organizationAccountNumber',
      'loadedModel',
    ]),
    ...mapState(useAuthStore, ['userInfo']),
    headers() {
      return [
        { title: '', key: 'edit-user', sortable: false },
        { title: 'First Name', key: 'firstName' },
        { title: 'Last Name', key: 'lastName' },
        { title: 'Phone Number', key: 'telephone' },
        { title: 'Email', key: 'email' },
        { title: 'Access Type', key: 'accessType' },
        { title: '', key: 'remove-user', align: 'end', sortable: false },
      ];
    },
  },
  async mounted() {
    try {
      this.contactsLoading = true;
      if (isEmpty(this.loadedModel)) {
        await this.loadOrganization(this.organizationId);
      }
      const contactsData = await contactService.loadContacts(this.organizationId);
      this.contacts = this.sortUsers(contactsData.map(this.setAccessTypeField));
    } catch (error) {
      this.setFailureAlert('There was an error loading the users');
      console.error('Error loading users: ', error);
    } finally {
      this.contactsLoading = false;
    }
  },
  methods: {
    ...mapActions(useOrganizationStore, ['loadOrganization']),
    setAccessTypeField(contact) {
      return {
        ...contact,
        isPrimaryContact: contact.contactId === this.loadedModel.primaryContactId,
        accessType: contact.isPortalUser ? 'Portal User' : 'Contact Only',
      };
    },
    editUser(id) {
      this.targetUser = this.contacts.find((c) => c.contactId == id);
      this.editUserDialogOpen = true;
    },
    async confirmDeleteUser(id) {
      this.targetUser = this.contacts.find((c) => c.contactId == id);
      this.removeUserDialogOpen = true;
    },
    mayEditUser(user) {
      if (!user.isPortalUser) {
        return false;
      }
      if (this.isSelf(user)) {
        return this.hasPermission(PERMISSIONS.MANAGE_SELF);
      }
      return this.hasPermission(PERMISSIONS.MANAGE_USERS_ALL);
    },
    mayRemoveUser(user) {
      return this.hasPermission(PERMISSIONS.MANAGE_USERS_ALL) && !user.isPrimaryContact && !this.isSelf(user);
    },
    isSelf(user) {
      return this.userInfo.contactId === user.contactId;
    },
    contactDeactivatedHandler(id) {
      this.contacts = this.contacts.filter((c) => c.contactId !== id);
    },
    async reloadContacts() {
      this.contacts = this.sortUsers(
        (await contactService.loadContacts(this.organizationId)).map(this.setAccessTypeField),
      );
    },
    sortUsers(contacts) {
      const rolePriority = {
        [ROLES.ORG_ADMIN]: 1,
        [ROLES.FAC_ADMIN_ADVANCED]: 2,
        [ROLES.FAC_ADMIN_BASIC]: 3,
        [ROLES.READ_ONLY]: 4,
      };
      const defaultPriority = 100;
      // 1. Primary contact first
      return contacts.sort((a, b) => {
        if (a.isPrimaryContact !== b.isPrimaryContact) {
          return a.isPrimaryContact ? -1 : 1;
        }

        // 2. Sort by role priority (1.ORG_ADMIN, 2.FAC_ADMIN_ADVANCED, 3.FAC_ADMIN_BASIC, 4.READONLY, 5.Concats Only)
        const priorityA = rolePriority[a.role.roleNumber] ?? defaultPriority;
        const priorityB = rolePriority[b.role.roleNumber] ?? defaultPriority;

        if (priorityA !== priorityB) {
          return priorityA - priorityB;
        }

        // 3. Sort by last name (A-Z)
        return a.lastName.localeCompare(b.lastName);
      });
    },
  },
};
</script>

<style scoped>
/* These are default framework settings that was somehow allowed to be overriden in CcfriEstimator.vue */
:deep(h1) {
  font-size: 2em;
}

.primary-contact {
  border: 2px solid;
}
</style>
