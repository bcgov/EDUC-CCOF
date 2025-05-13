<template>
  <v-container class="pa-0" fluid>
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
            <template v-if="editing.email">
              <v-col cols="12" sm="7" xl="8" xxl="9">
                <v-form v-model="valid.email" @submit.prevent>
                  <v-row no-gutters justify="space-between">
                    <v-col>
                      <v-text-field
                        v-model="workingFields.email"
                        class="micro"
                        density="compact"
                        variant="underlined"
                        label="Email Address"
                        :rules="[...rules.email, ...rules.required]"
                        :single-line="true"
                        hide-details="auto"
                      />
                    </v-col>
                    <v-col class="ml-2">
                      <v-btn
                        size="x-small"
                        color="#003366"
                        variant="flat"
                        prepend-icon="mdi-content-save"
                        type="submit"
                        :disabled="!valid.email"
                        :loading="isUpdating"
                        @click="() => saveField('email')"
                      >
                        Save
                      </v-btn>
                      <v-btn
                        class="ml-1"
                        size="x-small"
                        color="#003366"
                        variant="outlined"
                        prepend-icon="mdi-cancel"
                        :disabled="isUpdating"
                        @click="editing.email = false"
                      >
                        Cancel
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-form>
              </v-col>
            </template>
            <template v-else>
              <v-col cols="12" sm="7" xl="8" xxl="9">
                <v-row no-gutters justify="space-between">
                  <v-col>
                    <p>{{ loadedModel.email }}</p>
                  </v-col>
                  <v-col class="ml-2">
                    <v-btn
                      size="x-small"
                      color="#003366"
                      variant="outlined"
                      prepend-icon="mdi-pencil"
                      :disabled="isUpdating"
                      @click="editing.email = true"
                    >
                      Edit
                    </v-btn>
                  </v-col>
                </v-row>
              </v-col>
            </template>
          </v-row>
          <v-row dense>
            <v-col cols="12" sm="5" xl="4" xxl="3">
              <p><AppLabel>Phone:</AppLabel></p>
            </v-col>
            <template v-if="editing.phone">
              <v-col cols="12" sm="7" xl="8" xxl="9">
                <v-form v-model="valid.phone" @submit.prevent>
                  <v-row no-gutters justify="space-between">
                    <v-col>
                      <v-text-field
                        v-model="workingFields.phone"
                        class="micro"
                        density="compact"
                        variant="underlined"
                        label="Phone Number"
                        :rules="[...rules.required, rules.phone]"
                        :single-line="true"
                        hide-details="auto"
                      />
                    </v-col>
                    <v-col class="ml-2">
                      <v-btn
                        size="x-small"
                        color="#003366"
                        variant="flat"
                        prepend-icon="mdi-content-save"
                        type="submit"
                        :disabled="!valid.phone"
                        :loading="isUpdating"
                        @click="() => saveField('phone')"
                      >
                        Save
                      </v-btn>
                      <v-btn
                        class="ml-1"
                        size="x-small"
                        color="#003366"
                        variant="outlined"
                        prepend-icon="mdi-cancel"
                        :disabled="isUpdating"
                        @click="editing.phone = false"
                      >
                        Cancel
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-form>
              </v-col>
            </template>
            <template v-else>
              <v-col cols="12" sm="7" xl="8" xxl="9">
                <v-row no-gutters justify="space-between">
                  <v-col>
                    <p>{{ loadedModel.phone }}</p>
                  </v-col>
                  <v-col class="ml-2">
                    <v-btn
                      size="x-small"
                      color="#003366"
                      variant="outlined"
                      prepend-icon="mdi-pencil"
                      :disabled="isUpdating"
                      @click="editing.phone = true"
                    >
                      Edit
                    </v-btn>
                  </v-col>
                </v-row>
              </v-col>
            </template>
          </v-row>
          <v-row dense>
            <v-col cols="12" sm="5" xl="4" xxl="3">
              <p><AppLabel>Website:</AppLabel></p>
            </v-col>
            <template v-if="editing.website">
              <v-col cols="12" sm="7" xl="8" xxl="9">
                <v-form v-model="valid.website" @submit.prevent>
                  <v-row no-gutters justify="space-between">
                    <v-col>
                      <v-text-field
                        v-model="workingFields.website"
                        class="micro"
                        density="compact"
                        variant="underlined"
                        label="Website Address"
                        :rules="[rules.website]"
                        :single-line="true"
                        hide-details="auto"
                      />
                    </v-col>
                    <v-col class="ml-2">
                      <v-btn
                        size="x-small"
                        color="#003366"
                        variant="flat"
                        prepend-icon="mdi-content-save"
                        type="submit"
                        :disabled="!valid.website"
                        :loading="isUpdating"
                        @click="() => saveField('website')"
                      >
                        Save
                      </v-btn>
                      <v-btn
                        class="ml-1"
                        size="x-small"
                        color="#003366"
                        variant="outlined"
                        prepend-icon="mdi-cancel"
                        :disabled="isUpdating"
                        @click="editing.website = false"
                      >
                        Cancel
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-form>
              </v-col>
            </template>
            <template v-else>
              <v-col cols="12" sm="7" xl="8" xxl="9">
                <v-row no-gutters justify="space-between">
                  <v-col>
                    <p>{{ loadedModel.website || 'N/A' }}</p>
                  </v-col>
                  <v-col class="ml-2">
                    <v-btn
                      size="x-small"
                      color="#003366"
                      variant="outlined"
                      prepend-icon="mdi-pencil"
                      :disabled="isUpdating"
                      @click="editing.website = true"
                    >
                      Edit
                    </v-btn>
                  </v-col>
                </v-row>
              </v-col>
            </template>
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

import AppLabel from '@/components/util/AppLabel.vue';
import alertMixin from '@/mixins/alertMixin.js';

export default {
  name: 'ManageOrganization',
  components: {
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
      isUpdating: false,
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
      this.isUpdating = true;
      try {
        const res = await this.saveOrganization();
        this.loadedModel = {
          ...this.loadedModel,
          ...res.data,
        };
        this.setSuccessAlert('Update successful');
      } catch {
        this.setFailureAlert('An error occurred while saving. Please try again later.');
      } finally {
        this.editing[key] = false;
        this.isUpdating = false;
      }
    },
  },
};
</script>
<style scoped>
.micro :deep(input) {
  padding-top: 0;
  font-size: 0.875rem;
  min-height: 0;
}

.micro :deep(label) {
  font-size: 0.875rem;
  top: 0 !important;
}
</style>
