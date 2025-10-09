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
                          display="inline"
                          :disabled="!valid.phone"
                          :loading="isProcessing"
                          :primary="false"
                          @click="() => saveField('phone')"
                        >
                          Save
                        </AppButton>
                        <AppButton
                          class="ml-1"
                          size="small"
                          display="inline"
                          :primary="false"
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
                          display="inline"
                          :disabled="workingFieldInUse || isProcessing"
                          :primary="false"
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
                <v-col cols="12" sm="6" xl="5" xxl="3">
                  <p><AppLabel>Facility hours operation from:</AppLabel></p>
                </v-col>
                <v-col cols="12" sm="6" xl="7" xxl="9">
                  <v-form v-model="valid.hoursFrom" @submit.prevent>
                    <v-row v-if="editing.hoursFrom" no-gutters align="center">
                      <v-col cols="12" md="7">
                        <AppTimeInput
                          v-model="workingFields.hoursFrom"
                          class="time-field-edit-align"
                          density="compact"
                          variant="underlined"
                          hide-details="auto"
                        />
                      </v-col>
                      <v-col cols="3" class="text-no-wrap">
                        <AppButton
                          size="small"
                          type="submit"
                          display="inline"
                          :disabled="!valid.hoursFrom"
                          :loading="isProcessing"
                          :primary="false"
                          @click="() => saveField('hoursFrom')"
                        >
                          Save
                        </AppButton>
                        <AppButton
                          class="ml-1"
                          size="small"
                          display="inline"
                          :primary="false"
                          :disabled="isProcessing"
                          @click="() => cancelEditing('hoursFrom')"
                        >
                          Cancel
                        </AppButton>
                      </v-col>
                    </v-row>
                    <v-row v-else no-gutters>
                      <v-col cols="12" md="9">
                        <p>{{ formatFacilityHours(facility.hoursFrom) }}</p>
                      </v-col>
                      <v-col cols="3">
                        <AppButton
                          size="small"
                          display="inline"
                          :disabled="workingFieldInUse || isProcessing"
                          :primary="false"
                          @click="editing.hoursFrom = true"
                        >
                          Edit
                        </AppButton>
                      </v-col>
                    </v-row>
                  </v-form>
                </v-col>
              </v-row>
              <v-row dense>
                <v-col cols="12" sm="6" xl="5" xxl="3">
                  <p><AppLabel>Facility hours operation to:</AppLabel></p>
                </v-col>
                <v-col cols="12" sm="6" xl="7" xxl="9">
                  <v-form v-model="valid.hoursTo" @submit.prevent>
                    <v-row v-if="editing.hoursTo" no-gutters align="center">
                      <v-col cols="12" md="7">
                        <AppTimeInput
                          v-model="workingFields.hoursTo"
                          class="time-field-edit-align"
                          :rules="[rules.validHourTo(workingFields.hoursFrom)]"
                          density="compact"
                          variant="underlined"
                          hide-details="auto"
                        />
                      </v-col>
                      <v-col cols="3" class="text-no-wrap">
                        <AppButton
                          size="small"
                          type="submit"
                          display="inline"
                          :disabled="!valid.hoursTo"
                          :loading="isProcessing"
                          :primary="false"
                          @click="() => saveField('hoursTo')"
                        >
                          Save
                        </AppButton>
                        <AppButton
                          class="ml-1"
                          size="small"
                          display="inline"
                          :primary="false"
                          :disabled="isProcessing"
                          @click="() => cancelEditing('hoursTo')"
                        >
                          Cancel
                        </AppButton>
                      </v-col>
                    </v-row>
                    <v-row v-else no-gutters>
                      <v-col cols="12" md="9">
                        <p>{{ formatFacilityHours(facility.hoursTo) }}</p>
                      </v-col>
                      <v-col cols="3">
                        <AppButton
                          size="small"
                          display="inline"
                          :disabled="workingFieldInUse || isProcessing"
                          :primary="false"
                          @click="editing.hoursTo = true"
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
                          display="inline"
                          :disabled="!valid.email"
                          :loading="isProcessing"
                          :primary="false"
                          @click="() => saveField('email')"
                        >
                          Save
                        </AppButton>
                        <AppButton
                          class="ml-1"
                          size="small"
                          display="inline"
                          :primary="false"
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
                          display="inline"
                          :disabled="workingFieldInUse || isProcessing"
                          :primary="false"
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
import { EMPTY_PLACEHOLDER } from '@/utils/constants.js';
import { capitalize, formatTime24to12 } from '@/utils/format';
import rules from '@/utils/rules';
import FacilityService from '@/services/facilityService';

import { useOrganizationStore } from '@/store/ccof/organization';

import AppButton from '@/components/guiComponents/AppButton.vue';
import AppLabel from '@/components/guiComponents/AppLabel.vue';
import AppTimeInput from '@/components/guiComponents/AppTimeInput.vue';
import alertMixin from '@/mixins/alertMixin.js';

export default {
  name: 'ManageFacilityDetails',
  components: { AppButton, AppLabel, AppTimeInput },
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
        hoursFrom: false,
        hoursTo: false,
      },
      workingFields: {
        email: '',
        phone: '',
        hoursFrom: '',
        hoursTo: '',
      },
      valid: {
        email: true,
        phone: true,
        hoursFrom: true,
        hoursTo: true,
      },
      facilityCopy: {
        phone: '',
        email: '',
        hoursFrom: '',
        hoursTo: '',
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
  created() {
    this.EMPTY_PLACEHOLDER = EMPTY_PLACEHOLDER;
  },
  mounted() {
    const { email, phone, hoursFrom, hoursTo } = this.facility;
    this.workingFields = { email, phone, hoursFrom, hoursTo };
    this.facilityCopy = { email, phone, hoursFrom, hoursTo };
  },
  methods: {
    formatTime24to12,
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
    formatFacilityHours(time) {
      const formattedHour = this.formatTime24to12(time);
      return formattedHour?.toUpperCase() || EMPTY_PLACEHOLDER;
    },
  },
};
</script>

<style scoped>
.v-row.v-row--dense {
  min-height: 38px;
}
.time-field-edit-align {
  margin-top: -15px;
}
</style>
