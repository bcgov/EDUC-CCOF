<template>
  <v-container>
    <v-row justify="center">
      <div class="pa-10" :class="'text-h4'" v-text="`Welcome ${userInfo.displayName}`" />
    </v-row>
    <v-row>
      <v-form ref="form" v-model="isValidForm" @submit.prevent>
        <v-row>
          <v-card>
            <v-container>
              <v-row>
                <v-col cols="8">
                  <v-text-field
                    id="businessBCeId-field"
                    v-model="businessBCeId"
                    variant="outlined"
                    required
                    :rules="rules.required"
                    label="Business BCeID"
                    @keydown.enter="setBCeID()"
                  />
                </v-col>
                <v-col cols="2">
                  <v-btn
                    color="primary"
                    variant="outlined"
                    size="x-large"
                    :loading="processing"
                    :disabled="!businessBCeId"
                    @click="setBCeID()"
                  >
                    Search
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-card>
        </v-row>
      </v-form>
    </v-row>
  </v-container>
</template>
<script>
import { mapState, mapActions } from 'pinia';
import { useAuthStore } from '../store/auth.js';
import { useOrganizationStore } from '../store/ccof/organization.js';
import { useEceweAppStore } from '../store/eceweApp.js';

import { PATHS } from '../utils/constants.js';
import rules from '../utils/rules.js';
import alertMixin from '../mixins/alertMixin.js';

export default {
  name: 'ImpersonateAccount',
  mixins: [alertMixin],
  data() {
    return {
      rules,
      businessBCeId: undefined,
      isValidForm: true,
      processing: false,
    };
  },
  computed: {
    ...mapState(useAuthStore, ['userInfo']),
  },
  methods: {
    ...mapActions(useAuthStore, ['setIsUserInfoLoaded', 'setImpersonateId', 'getUserInfo']),
    async setBCeID() {
      const organizationStore = useOrganizationStore();
      const eceweAppStore = useEceweAppStore();
      this.processing = true;
      this.setIsUserInfoLoaded(false);
      organizationStore.setIsStarted(false);
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

<style scoped></style>
