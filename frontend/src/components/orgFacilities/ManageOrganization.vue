<template>
  <v-container class="pa-0 text-body-1" fluid>
    <v-row no-gutters>
      <v-col>
        <p>View and update your organization information.</p>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12"><h2>Organization Info</h2></v-col>
    </v-row>
    <v-row v-if="orgLoading" no-gutters>
      <v-col cols="12" lg="6">
        <v-card variant="outlined" class="soft-outline fill-height px-2">
          <v-skeleton-loader type="paragraph" />
        </v-card>
      </v-col>
      <v-col cols="12" lg="6" class="mt-3 mt-lg-0 pl-lg-3">
        <v-card variant="outlined" class="soft-outline fill-height px-2">
          <v-skeleton-loader type="paragraph" />
        </v-card>
      </v-col>
    </v-row>
    <v-row v-else no-gutters>
      <v-col cols="12" lg="6">
        <v-card variant="outlined" class="soft-outline fill-height px-2">
          <v-row dense>
            <v-col cols="12" sm="5" xl="4" xxl="3">
              <p><AppLabel>Organization Name:</AppLabel></p>
            </v-col>
            <v-col cols="12" sm="7" xl="8" xxl="9">
              <p>{{ loadedModel.legalName }}</p>
            </v-col>
          </v-row>
          <v-row v-if="shouldHaveIncorporationNumber" dense>
            <v-col cols="12" sm="5" xl="4" xxl="3">
              <p><AppLabel>Incorporation Number:</AppLabel></p>
            </v-col>
            <v-col cols="12" sm="7" xl="8" xxl="9">
              <p>{{ loadedModel.incNumber }}</p>
            </v-col>
          </v-row>
          <v-row v-if="loadedModel.doingBusinessAs" dense>
            <v-col cols="12" sm="5" xl="4" xxl="3">
              <p><AppLabel>Doing Business As:</AppLabel></p>
            </v-col>
            <v-col cols="12" sm="7" xl="8" xxl="9">
              <p>{{ loadedModel.doingBusinessAs }}</p>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col cols="12" sm="5" xl="4" xxl="3">
              <p><AppLabel>Organization ID:</AppLabel></p>
            </v-col>
            <v-col cols="12" sm="7" xl="8" xxl="9">
              <p>{{ loadedModel.accountNumber }}</p>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col cols="12" sm="5" xl="4" xxl="3">
              <p><AppLabel>Organization Type:</AppLabel></p>
            </v-col>
            <v-col cols="12" sm="7" xl="8" xxl="9">
              <p>{{ loadedModel.organizationTypeDesc }}</p>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col cols="12" sm="5" xl="4" xxl="3">
              <p><AppLabel>Email Address:</AppLabel></p>
            </v-col>
            <v-col cols="12" sm="7" xl="8" xxl="9">
              <v-form v-model="valid.email" @submit.prevent>
                <v-row v-if="editing.email" no-gutters>
                  <v-col cols="12" md="7">
                    <v-text-field
                      v-model="workingFields.email"
                      class="less-jitter"
                      density="compact"
                      variant="underlined"
                      label="Email Address"
                      :rules="[...rules.email, ...rules.required]"
                      :single-line="true"
                      hide-details="auto"
                    />
                  </v-col>
                  <v-col cols="3" class="text-no-wrap">
                    <AppButton
                      size="small"
                      type="submit"
                      :display-block="false"
                      :disabled="!valid.email"
                      :loading="isProcessing"
                      @click="() => saveField('email')"
                    >
                      Save
                    </AppButton>
                    <AppButton
                      class="ml-1"
                      size="small"
                      :primary="false"
                      :display-block="false"
                      :disabled="isProcessing"
                      @click="() => cancelEditing('email')"
                    >
                      Cancel
                    </AppButton>
                  </v-col>
                </v-row>
                <v-row v-else no-gutters>
                  <v-col cols="12" md="8">
                    <p>{{ loadedModel.email }}</p>
                  </v-col>
                  <v-col cols="3">
                    <AppButton
                      size="small"
                      :display-block="false"
                      :disabled="workingFieldInUse || isProcessing"
                      @click="editing.email = true"
                    >
                      Edit
                    </AppButton>
                  </v-col>
                </v-row>
              </v-form>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col cols="12" sm="5" xl="4" xxl="3">
              <p><AppLabel>Phone:</AppLabel></p>
            </v-col>
            <v-col cols="12" sm="7" xl="8" xxl="9">
              <v-form v-model="valid.phone" @submit.prevent>
                <v-row v-if="editing.phone" no-gutters>
                  <v-col cols="12" md="7">
                    <v-text-field
                      v-model="workingFields.phone"
                      class="less-jitter"
                      density="compact"
                      variant="underlined"
                      label="Phone Number"
                      :rules="[...rules.required, rules.phone]"
                      :single-line="true"
                      hide-details="auto"
                    />
                  </v-col>
                  <v-col cols="3" class="text-no-wrap">
                    <AppButton
                      size="small"
                      type="submit"
                      :display-block="false"
                      :disabled="!valid.phone"
                      :loading="isProcessing"
                      @click="() => saveField('phone')"
                    >
                      Save
                    </AppButton>
                    <AppButton
                      class="ml-1"
                      size="small"
                      :display-block="false"
                      :disabled="isProcessing"
                      :primary="false"
                      @click="() => cancelEditing('phone')"
                    >
                      Cancel
                    </AppButton>
                  </v-col>
                </v-row>
                <v-row v-else no-gutters>
                  <v-col cols="12" md="8">
                    <p>{{ loadedModel.phone }}</p>
                  </v-col>
                  <v-col cols="3">
                    <AppButton
                      size="small"
                      :display-block="false"
                      :disabled="workingFieldInUse || isProcessing"
                      @click="editing.phone = true"
                    >
                      Edit
                    </AppButton>
                  </v-col>
                </v-row>
              </v-form>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col cols="12" sm="5" xl="4" xxl="3">
              <p><AppLabel>Website:</AppLabel></p>
            </v-col>
            <v-col cols="12" sm="7" xl="8" xxl="9">
              <v-form v-model="valid.website" @submit.prevent>
                <v-row v-if="editing.website" no-gutters>
                  <v-col cols="12" md="7">
                    <v-text-field
                      v-model="workingFields.website"
                      class="less-jitter"
                      density="compact"
                      variant="underlined"
                      label="Website Address"
                      :rules="[rules.website]"
                      :single-line="true"
                      hide-details="auto"
                    />
                  </v-col>
                  <v-col cols="3" class="text-no-wrap">
                    <AppButton
                      size="small"
                      color="#003366"
                      type="submit"
                      :display-block="false"
                      :disabled="!valid.website"
                      :loading="isProcessing"
                      @click="() => saveField('website')"
                    >
                      Save
                    </AppButton>
                    <AppButton
                      class="ml-1"
                      size="small"
                      :primary="false"
                      :display-block="false"
                      :disabled="isProcessing"
                      @click="() => cancelEditing('website')"
                    >
                      Cancel
                    </AppButton>
                  </v-col>
                </v-row>
                <v-row v-else no-gutters>
                  <v-col cols="12" md="8">
                    <p>{{ loadedModel.website || 'N/A' }}</p>
                  </v-col>
                  <v-col cols="3">
                    <AppButton
                      size="small"
                      color="#003366"
                      :display-block="false"
                      :disabled="workingFieldInUse || isProcessing"
                      @click="editing.website = true"
                    >
                      Edit
                    </AppButton>
                  </v-col>
                </v-row>
              </v-form>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
      <v-col cols="12" lg="6" class="mt-3 mt-lg-0 pl-lg-3">
        <v-card variant="outlined" class="soft-outline fill-height px-2">
          <v-row dense>
            <v-col>
              <p><AppLabel>Mailing Address</AppLabel></p>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col cols="12" sm="5" xl="4" xxl="3">
              <p><AppLabel>Street Address:</AppLabel></p>
            </v-col>
            <v-col cols="12" sm="7" xl="8">
              <p>{{ loadedModel.address1 }}</p>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col cols="12" sm="5" xl="4" xxl="3">
              <p><AppLabel>City:</AppLabel></p>
            </v-col>
            <v-col cols="12" sm="7" xl="8" xxl="9">
              <p>{{ loadedModel.city1 }}</p>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col cols="12" sm="5" xl="4" xxl="3">
              <p><AppLabel>Province:</AppLabel></p>
            </v-col>
            <v-col cols="12" sm="7" xl="8" xxl="9">
              <p>{{ loadedModel.province1 }}</p>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col cols="12" sm="5" xl="4" xxl="3">
              <p><AppLabel>Postal Code:</AppLabel></p>
            </v-col>
            <v-col cols="12" sm="7" xl="8" xxl="9">
              <p>{{ loadedModel.postalCode1 }}</p>
            </v-col>
          </v-row>
          <br />
          <v-row dense>
            <v-col>
              <p><AppLabel>Physical Address</AppLabel></p>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col cols="12" sm="5" xl="4" xxl="3">
              <p><AppLabel>Street Address:</AppLabel></p>
            </v-col>
            <v-col cols="12" sm="7" xl="8">
              <p>{{ loadedModel.address2 }}</p>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col cols="12" sm="5" xl="4" xxl="3">
              <p><AppLabel>City:</AppLabel></p>
            </v-col>
            <v-col cols="12" sm="7" xl="8" xxl="9">
              <p>{{ loadedModel.city2 }}</p>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col cols="12" sm="5" xl="4" xxl="3">
              <p><AppLabel>Province:</AppLabel></p>
            </v-col>
            <v-col cols="12" sm="7" xl="8" xxl="9">
              <p>{{ loadedModel.province2 }}</p>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col cols="12" sm="5" xl="4" xxl="3">
              <p><AppLabel>Postal Code:</AppLabel></p>
            </v-col>
            <v-col cols="12" sm="7" xxl="8">
              <p>{{ loadedModel.postalCode2 }}</p>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapActions, mapState, mapWritableState } from 'pinia';
import { isEmpty } from 'lodash';

import { useOrganizationStore } from '@/store/ccof/organization.js';
import { ORGANIZATION_TYPES } from '@/utils/constants.js';
import rules from '@/utils/rules.js';

import AppButton from '@/components/guiComponents/AppButton.vue';
import AppLabel from '@/components/guiComponents/AppLabel.vue';
import alertMixin from '@/mixins/alertMixin.js';

export default {
  name: 'ManageOrganization',
  components: {
    AppButton,
    AppLabel,
  },
  mixins: [alertMixin],
  data() {
    return {
      orgLoading: false,
      editing: {
        phone: false,
        email: false,
        website: false,
      },
      workingFields: {
        email: '',
        phone: '',
        website: '',
      },
      valid: {
        email: true,
        phone: true,
        website: true,
      },
      isProcessing: false,
      rules,
    };
  },
  computed: {
    ...mapState(useOrganizationStore, ['organizationId']),
    ...mapWritableState(useOrganizationStore, ['organizationModel', 'loadedModel']),
    shouldHaveIncorporationNumber() {
      return [ORGANIZATION_TYPES.NON_PROFIT_SOCIETY, ORGANIZATION_TYPES.REGISTERED_COMPANY].includes(
        this.organizationModel.organizationType,
      );
    },
    workingFieldInUse() {
      return Object.values(this.editing).some((value) => value === true);
    },
  },
  async mounted() {
    try {
      if (isEmpty(this.loadedModel)) {
        this.orgLoading = true;
        await this.loadOrganization(this.organizationId);
      }
    } catch (error) {
      this.setFailureAlert('There was an error loading the organization.');
      console.error('Error loading organization: ', error);
    } finally {
      this.orgLoading = false;

      const { email, phone, website } = this.loadedModel;
      this.workingFields = {
        email,
        phone,
        website,
      };
    }
  },
  methods: {
    ...mapActions(useOrganizationStore, ['loadOrganization', 'saveOrganization']),
    async saveField(key) {
      if (this.workingFields[key] === this.loadedModel[key]) {
        this.editing[key] = false;
        return;
      }

      this.organizationModel[key] = this.workingFields[key];
      this.isProcessing = true;
      try {
        const res = await this.saveOrganization();
        this.loadedModel = {
          ...this.loadedModel,
          ...res.data,
        };
        this.setSuccessAlert('Organization updated successfully.');
      } catch {
        this.setFailureAlert('An error occurred while updating the organization.');
      } finally {
        this.editing[key] = false;
        this.isProcessing = false;
      }
    },
    cancelEditing(key) {
      this.editing[key] = false;
      this.workingFields[key] = this.loadedModel[key];
    },
  },
};
</script>
<style scoped>
.less-jitter :deep(input) {
  padding-top: 0;
  font-size: 1rem;
  letter-spacing: 0.03125em;
  min-height: 0;
}

.less-jitter :deep(label.v-label) {
  top: 0;
}

.v-row.v-row--dense {
  min-height: 38px;
}
</style>
