<template>
  <v-container fluid class="pa-12">
    <h1>Manage Users</h1>
    <p class="mb-6">
      <b>{{ organizationName }}</b> <br />
      ID: {{ organizationAccountNumber }}
    </p>
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
              <AppButton :primary="false" size="small" @click="editUser(item.contactId)">Edit</AppButton>
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
  <AppDialog v-model="dialogOpen" title="Remove User" max-width="800px" @close="dialogOpen = false">
    <template #content>
      Are you sure you want to remove {{ userDisplayName(targetUser, 'this user') }}? You can't undo this.
    </template>
    <template #button>
      <v-row justify="center">
        <v-col>
          <AppButton :primary="false" size="small" @click="dialogOpen = false">Cancel</AppButton>
        </v-col>
        <v-col>
          <AppButton
            :primary="true"
            size="small"
            :loading="dialogLoading"
            :disabled="dialogLoading"
            @click="deleteUser(targetUser.contactId)"
          >
            Yes, remove the user
          </AppButton>
        </v-col>
      </v-row>
    </template>
  </AppDialog>
</template>

<script>
import { mapState, mapActions } from 'pinia';
import { isEmpty } from 'lodash';
import { PATHS } from '@/utils/constants.js';
import contactService from '@/services/contactService.js';
import { useAuthStore } from '@/store/auth';
import { useOrganizationStore } from '@/store/ccof/organization';

import alertMixin from '@/mixins/alertMixin.js';
import AppButton from '@/components/guiComponents/AppButton.vue';
import NavButton from '@/components/util/NavButton.vue';
import AppDialog from '@/components/guiComponents/AppDialog.vue';

export default {
  name: 'ManageUsers',
  components: { AppButton, NavButton, AppDialog },
  mixins: [alertMixin],
  data() {
    return {
      tab: undefined,
      PATHS,
      contacts: [],
      targetUser: {},
      sortBy: [{ key: 'isPrimaryContact', order: 'desc' }],
      contactsLoading: false,
      dialogOpen: false,
      dialogLoading: false,
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
      this.contacts = contactsData.map(this.setAccessTypeField);
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
      alert(`Edit: ${id}`);
    },
    async confirmDeleteUser(id) {
      this.targetUser = this.contacts.find((c) => c.contactId == id);
      this.dialogOpen = true;
    },
    mayRemoveUser(user) {
      return !user.isPrimaryContact && this.userInfo.contactId !== user.contactId;
    },
    userDisplayName(user, fallback = '') {
      const { firstName, lastName } = user;

      let userDisplayName;
      if (firstName && lastName) {
        userDisplayName = `${firstName} ${lastName}`;
      } else if (firstName) {
        userDisplayName = `${firstName}`;
      } else if (lastName) {
        userDisplayName = `${lastName}`;
      } else {
        userDisplayName = fallback;
      }

      return userDisplayName;
    },
    async deleteUser() {
      try {
        this.dialogLoading = true;
        await contactService.deleteContact(this.targetUser.contactId);
        this.contacts = this.contacts.filter((c) => c.contactId !== this.targetUser.contactId);
        this.setSuccessAlert(
          `${this.userDisplayName(this.targetUser, 'The user')} has been removed from the organization`,
        );
      } catch (error) {
        this.setFailureAlert('Failed to remove the contact.');
        console.error('Error removing contact: ', error);
      } finally {
        this.dialogLoading = false;
        this.dialogOpen = false;
      }
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
