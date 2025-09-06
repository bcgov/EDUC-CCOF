<template>
  <AppDialog v-model="dialogOpen" title="Remove User" max-width="800px" @close="$emit('close-remove-dialog')">
    <template #content>
      Are you sure you want to remove {{ userDisplayName(user, 'this user') }}? You can't undo this.
    </template>
    <template #button>
      <v-row justify="center">
        <v-col>
          <AppButton :primary="false" size="small" @click="$emit('close-remove-dialog')">Cancel</AppButton>
        </v-col>
        <v-col>
          <AppButton
            :primary="true"
            size="small"
            :loading="removeBusy"
            :disabled="removeBusy"
            @click="deleteUser(user.contactId)"
          >
            Yes, remove the user
          </AppButton>
        </v-col>
      </v-row>
    </template>
  </AppDialog>
</template>

<script>
import contactService from '@/services/contactService.js';

import alertMixin from '@/mixins/alertMixin.js';
import AppDialog from '@/components/guiComponents/AppDialog.vue';
import AppButton from '@/components/guiComponents/AppButton.vue';

export default {
  name: 'RemoveUserDialog',
  components: { AppButton, AppDialog },
  mixins: [alertMixin],
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    user: {
      type: Object,
      required: true,
    },
  },
  emits: ['close-remove-dialog', 'contact-deactivated'],
  data() {
    return {
      dialogOpen: false,
      removeBusy: false,
    };
  },
  watch: {
    show(newVal) {
      this.dialogOpen = newVal;
    },
  },
  methods: {
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
        this.removeBusy = true;
        await contactService.deleteContact(this.user.contactId);
        this.$emit('contact-deactivated', this.user.contactId);
        this.setSuccessAlert(`${this.userDisplayName(this.user, 'The user')} has been removed from the organization`);
      } catch (error) {
        this.setFailureAlert('Failed to remove the contact.');
        console.error('Error removing contact: ', error);
      } finally {
        this.removeBusy = false;
        this.dialogOpen = false;
        this.$emit('close-remove-dialog');
      }
    },
  },
};
</script>
