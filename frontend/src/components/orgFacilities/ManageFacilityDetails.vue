<template>
  <v-container class="pa-0 text-body-1" fluid>
    <v-row v-if="facilityLoading" no-gutters>
      <v-col cols="12">
        <v-card variant="outlined" class="soft-outline fill-height px-2">
          <v-skeleton-loader type="paragraph" />
        </v-card>
      </v-col>
    </v-row>
    <v-row v-else justify="start" no-gutters>
      <v-col class="mt-2">
        <v-card variant="outlined" class="soft-outline fill-height px-2">
          <v-row>
            <v-col class="py-0" cols="12" lg="6">
              <v-row dense>
                <v-col cols="12" sm="6" xl="5" xxl="3">
                  <p>
                    <AppLabel>*Facility Name:</AppLabel>
                  </p>
                </v-col>
                <v-col class="d-flex align-end" cols="12" sm="6" xl="7" xxl="9">
                  <p>{{ facility.facilityName }}</p>
                </v-col>
              </v-row>
              <v-row dense>
                <v-col cols="12" sm="6" xl="5" xxl="3">
                  <p>
                    <AppLabel>*Funding Type:</AppLabel>
                  </p>
                </v-col>
                <v-col class="d-flex align-end" cols="12" sm="6" xl="7" xxl="9">
                  <p>{{ providerType }}</p>
                </v-col>
              </v-row>
              <v-row dense>
                <v-col cols="12" sm="6" xl="5" xxl="3">
                  <p>
                    <AppLabel>Community Care Facility Licence #:</AppLabel>
                  </p>
                </v-col>
                <v-col class="d-flex align-end" cols="12" sm="6" xl="7" xxl="9">
                  <p>{{ facility.licenseNumber }}</p>
                </v-col>
              </v-row>
              <v-row dense>
                <v-col cols="12" sm="6" xl="5" xxl="3">
                  <p>
                    <AppLabel>Facility ID:</AppLabel>
                  </p>
                </v-col>
                <v-col class="d-flex align-end" cols="12" sm="6" xl="7" xxl="9">
                  <p>{{ facility.facilityAccountNumber }}</p>
                </v-col>
              </v-row>
              <v-row dense>
                <v-col cols="12" sm="6" xl="5" xxl="3">
                  <p><AppLabel>*Business Phone:</AppLabel></p>
                </v-col>
                <v-col cols="12" sm="6" xl="7" xxl="9">
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
                          :primary="false"
                          :display-block="false"
                          :disabled="isProcessing"
                          @click="() => cancelEditing('phone')"
                        >
                          Cancel
                        </AppButton>
                      </v-col>
                    </v-row>
                    <v-row v-else no-gutters>
                      <v-col cols="12" md="9">
                        <p>{{ facility.phone }}</p>
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
            </v-col>
            <v-col class="py-0" cols="12" lg="6">
              <v-row dense>
                <v-col cols="12" sm="6" xl="5" xxl="3">
                  <p>
                    <AppLabel>Facility Street Address:</AppLabel>
                  </p>
                </v-col>
                <v-col class="d-flex align-end" cols="12" sm="6" xl="7" xxl="9">
                  <p>{{ facility.facilityAddress }}</p>
                </v-col>
              </v-row>
              <v-row dense>
                <v-col cols="12" sm="6" xl="5" xxl="3">
                  <p>
                    <AppLabel>City/Town:</AppLabel>
                  </p>
                </v-col>
                <v-col class="d-flex align-end" cols="12" sm="6" xl="7" xxl="9">
                  <p>{{ facility.city }}</p>
                </v-col>
              </v-row>
              <v-row dense>
                <v-col cols="12" sm="6" xl="5" xxl="3">
                  <p>
                    <AppLabel>Province:</AppLabel>
                  </p>
                </v-col>
                <v-col class="d-flex align-end" cols="12" sm="6" xl="7" xxl="9">
                  <p>{{ facility.province }}</p>
                </v-col>
              </v-row>
              <v-row dense>
                <v-col cols="12" sm="6" xl="5" xxl="3">
                  <p>
                    <AppLabel>Postal Code:</AppLabel>
                  </p>
                </v-col>
                <v-col class="d-flex align-end" cols="12" sm="6" xl="7" xxl="9">
                  <p>{{ facility.postalCode }}</p>
                </v-col>
              </v-row>
              <v-row dense>
                <v-col cols="12" sm="6" xl="5" xxl="3">
                  <p><AppLabel>Facility Email Address:</AppLabel></p>
                </v-col>
                <v-col cols="12" sm="6" xl="7" xxl="9">
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
                      <v-col cols="12" md="9">
                        <p>{{ facility.email }}</p>
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
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapState } from 'pinia';
import { capitalize } from '@/utils/format';
import rules from '@/utils/rules';
import FacilityService from '@/services/facilityService';

import { useOrganizationStore } from '@/store/ccof/organization';

import AppButton from '@/components/guiComponents/AppButton.vue';
import AppLabel from '@/components/guiComponents/AppLabel.vue';
import alertMixin from '@/mixins/alertMixin.js';

export default {
  name: 'ManageFacilityDetails',
  components: { AppButton, AppLabel },
  mixins: [alertMixin],
  props: {
    facility: {
      type: Object,
      required: true,
    },
    facilityLoading: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  emits: ['facility-updated'],
  data() {
    return {
      editing: {
        phone: false,
        email: false,
      },
      workingFields: {
        email: '',
        phone: '',
      },
      valid: {
        email: true,
        phone: true,
      },
      facilityCopy: {
        phone: '',
        email: '',
      },
      isProcessing: false,
      rules,
    };
  },
  computed: {
    ...mapState(useOrganizationStore, ['organizationProviderType']),
    providerType() {
      return capitalize(this.organizationProviderType);
    },
    workingFieldInUse() {
      return Object.values(this.editing).some((value) => value);
    },
  },
  mounted() {
    const { email, phone } = this.facility;
    this.workingFields = { email, phone };
    this.facilityCopy = { email, phone };
  },
  methods: {
    async saveField(key) {
      if (this.workingFields[key] === this.facility[key]) {
        this.editing[key] = false;
        return;
      }

      this.facilityCopy[key] = this.workingFields[key];
      this.isProcessing = true;
      try {
        await FacilityService.updateFacility(this.facility.facilityId, this.facilityCopy);
        this.$emit('facility-updated', this.facilityCopy);
        this.setSuccessAlert('Facility updated successfully.');
      } catch {
        this.setFailureAlert('An error occurred while updating the facility.');
      } finally {
        this.editing[key] = false;
        this.isProcessing = false;
      }
    },
    cancelEditing(key) {
      this.editing[key] = false;
      this.workingFields[key] = this.facility[key];
    },
  },
};
</script>

<style scoped>
.v-row.v-row--dense {
  min-height: 38px;
}
</style>
