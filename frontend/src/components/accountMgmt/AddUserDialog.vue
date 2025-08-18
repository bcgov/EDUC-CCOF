<template>
  <AppDialog v-model="dialog" title="Add New User" max-width="800px" text-alignment="left" @close="closeDialog">
    <template #content>
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
          </v-row>
        </v-window-item>
        <v-window-item :value="2" />
        <v-window-item :value="3" />
      </v-window>
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
          <AppButton v-if="step < 3" display="inline" size="small" class="ml-2" @click="step++">Next</AppButton>
          <AppButton v-if="step === 3" display="inline" size="small" class="ml-2" @click="addUser">Add</AppButton>
        </v-col>
      </v-row>
    </template>
  </AppDialog>
</template>

<script>
import { OFM_PORTAL_ROLES } from '@/utils/constants';

import AppButton from '@/components/guiComponents/AppButton.vue';
import AppDialog from '@/components/guiComponents/AppDialog.vue';

export default {
  name: 'AddUserDialog',
  components: { AppButton, AppDialog },
  props: {
    show: {
      type: Boolean,
      required: true,
    },
  },
  emits: ['close-add-dialog'],
  data() {
    return {
      dialog: false,
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
      userRole: 8,
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
    };
  },
  watch: {
    show(val) {
      this.dialog = val;
    },
  },
  methods: {
    closeDialog() {
      this.$emit('close-add-dialog');
      setTimeout(() => (this.step = 1), 350);
    },
    addUser() {
      // For now, just close the dialog
      this.closeDialog();
    },
  },
};
</script>
