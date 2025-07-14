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
              <AppButton :primary="false" color="#d8292f" size="small" @click="() => deleteUser(item.contactId)">
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
</template>
<script>
import { mapState, mapActions } from 'pinia';
import { isEmpty } from 'lodash';
import { PATHS } from '@/utils/constants.js';
import contactService from '@/services/contactService.js';
import { useOrganizationStore } from '@/store/ccof/organization';

import alertMixin from '@/mixins/alertMixin.js';
import AppButton from '@/components/guiComponents/AppButton.vue';
import NavButton from '@/components/util/NavButton.vue';

export default {
  name: 'ManageUsers',
  components: { AppButton, NavButton },
  mixins: [alertMixin],
  data() {
    return {
      tab: undefined,
      PATHS,
      contacts: [],
      sortBy: [{ key: 'isPrimaryContact', order: 'desc' }],
      contactsLoading: false,
    };
  },
  computed: {
    ...mapState(useOrganizationStore, [
      'organizationId',
      'organizationName',
      'organizationAccountNumber',
      'loadedModel',
    ]),
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
    deleteUser(id) {
      alert(`Delete: ${id}`);
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
