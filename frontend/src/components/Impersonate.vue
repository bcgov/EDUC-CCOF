<template>
  <v-container>
    <div class="text-h4 pa-10 text-center">Welcome {{ userInfo.displayName }}</div>
    <v-container class="d-flex justify-center">
      <v-form ref="form" @submit.prevent>
        <v-card width="400" class="pa-6 elevation-4">
          <v-row>
            <v-col cols="12" sm="8">
              <v-text-field
                id="businessBCeId-field"
                v-model="businessBCeId"
                variant="outlined"
                :rules="rules.required"
                label="Business BCeID"
                @keydown.enter="setBCeID()"
              />
            </v-col>
            <v-col cols="12" sm="4">
              <AppButton
                id="search-button"
                :loading="processing"
                :primary="false"
                :disabled="!businessBCeId"
                class="mt-sm-1"
                @click="setBCeID()"
              >
                Search
              </AppButton>
            </v-col>
          </v-row>
        </v-card>
      </v-form>
    </v-container>
  </v-container>
</template>
<script>
import { mapState, mapActions } from 'pinia';

import AppButton from '@/components/guiComponents/AppButton.vue';

import { useAuthStore } from '@/store/auth.js';
import { useEceweAppStore } from '@/store/eceweApp.js';

import { PATHS } from '@/utils/constants.js';
import rules from '@/utils/rules.js';
import alertMixin from '@/mixins/alertMixin.js';

export default {
  name: 'ImpersonateAccount',
  components: { AppButton },
  mixins: [alertMixin],
  data() {
    return {
      rules,
      businessBCeId: undefined,
      processing: false,
    };
  },
  computed: {
    ...mapState(useAuthStore, ['userInfo']),
  },
  methods: {
    ...mapActions(useAuthStore, ['setIsUserInfoLoaded', 'setImpersonateId', 'getUserInfo']),
    async setBCeID() {
      const eceweAppStore = useEceweAppStore();
      this.processing = true;
      this.setIsUserInfoLoaded(false);
      eceweAppStore.setIsStarted(false);

      this.setImpersonateId(this.businessBCeId);
      try {
        await this.getUserInfo();
        this.processing = false;
        this.$router.push(PATHS.ROOT.HOME);
      } catch (error) {
        this.processing = false;
        this.setImpersonateId(null);

        if (error.response?.status == '404') {
          this.setFailureAlert(`Unable to find BCeID: [ ${this.businessBCeId} ]`);
        } else if (error.response?.status == '409') {
          this.setFailureAlert(`BCeID: [ ${this.businessBCeId} ] is found, but does not have an associated User GUID`);
        } else {
          this.setFailureAlert('An error occurred while trying to load BCeID');
        }
      }
    },
  },
};
</script>
