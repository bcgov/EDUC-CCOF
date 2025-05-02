<template>
  <v-container class="pl-0 pr-0" fluid>
    <v-row class="pb-1">
      <v-col cols="12" sm="6"><h2>Organization Info</h2></v-col>
      <v-col cols="12" sm="6">
        <v-row no-gutters justify="beginning" justify-sm="end">
          <v-btn
            :class="isReportChangeButtonEnabled ? 'blueButton' : 'disabledButton'"
            theme="dark"
            :href="`${PATHS.ROOT.CHANGE_LANDING}#change-request-history`"
            :disabled="!isReportChangeButtonEnabled"
          >
            Request a Change
          </v-btn>
        </v-row>
      </v-col>
    </v-row>
    <v-row v-if="isLoadingModel" class="mb-4" no-gutters>
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
    <v-row v-else no-gutters class="mb-4">
      <v-col cols="12" lg="6">
        <v-card variant="outlined" class="soft-outline fill-height px-2">
          <v-row no-gutters class="my-2">
            <v-col cols="12" sm="5" xl="4" xxl="3">
              <AppLabel>Organization Name:</AppLabel>
            </v-col>
            <v-col cols="12" sm="7" xl="8" xxl="9">
              {{ organizationName }}
            </v-col>
          </v-row>
          <v-row v-if="organizationModel.doingBusinessAs" no-gutters class="my-2">
            <v-col cols="12" sm="5" xl="4" xxl="3">
              <AppLabel>Doing Business As:</AppLabel>
            </v-col>
            <v-col cols="12" sm="7" xl="8" xxl="9">
              {{ organizationModel.doingBusinessAs }}
            </v-col>
          </v-row>
          <v-row no-gutters class="my-2">
            <v-col cols="12" sm="5" xl="4" xxl="3">
              <AppLabel>Organization ID:</AppLabel>
            </v-col>
            <v-col cols="12" sm="7" xl="8" xxl="9">
              {{ organizationAccountNumber }}
            </v-col>
          </v-row>
          <v-row no-gutters class="my-2">
            <v-col cols="12" sm="5" xl="4" xxl="3">
              <AppLabel>Organization Type:</AppLabel>
            </v-col>
            <v-col cols="12" sm="7" xl="8" xxl="9">
              {{ organizationModel.organizationTypeDesc }}
            </v-col>
          </v-row>
          <v-row no-gutters class="my-2">
            <v-col cols="12" sm="5" xl="4" xxl="3">
              <AppLabel>Email Address:</AppLabel>
            </v-col>
            <v-col cols="12" sm="7" xl="8" xxl="9">
              {{ organizationModel.email }}
            </v-col>
          </v-row>
          <v-row no-gutters class="my-2">
            <v-col cols="12" sm="5" xl="4" xxl="3">
              <AppLabel>Phone:</AppLabel>
            </v-col>
            <v-col cols="12" sm="7" xl="8" xxl="9">
              {{ organizationModel.phone }}
            </v-col>
          </v-row>
        </v-card>
      </v-col>
      <v-col cols="12" lg="6" class="mt-3 mt-lg-0 pl-lg-3">
        <v-card variant="outlined" class="soft-outline fill-height px-2">
          <v-row no-gutters class="my-2">
            <AppLabel>Mailing{{ organizationModel.isSameAsMailing ? ' &amp; Physical' : '' }} Address:</AppLabel>
          </v-row>
          <v-row no-gutters class="my-2">
            <v-col cols="12" sm="5" xl="4" xxl="3">
              <AppLabel>Street Address:</AppLabel>
            </v-col>
            <v-col cols="12" sm="7" xl="8">
              {{ organizationModel.address1 }}
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col cols="12">
              <v-row no-gutters>
                <v-col cols="12" sm="5" xl="4" xxl="3">
                  <AppLabel>City:</AppLabel>
                </v-col>
                <v-col cols="12" sm="7" xl="8" xxl="9">
                  {{ organizationModel.city1 }}
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12" class="my-2">
              <v-row no-gutters>
                <v-col cols="12" sm="5" xl="4" xxl="3">
                  <AppLabel>Province:</AppLabel>
                </v-col>
                <v-col cols="12" sm="7" xl="8" xxl="9">
                  {{ organizationModel.province1 }}
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12">
              <v-row no-gutters>
                <v-col cols="12" sm="5" xl="4" xxl="3">
                  <AppLabel>Postal Code:</AppLabel>
                </v-col>
                <v-col cols="12" sm="7" xl="8" xxl="9">
                  {{ organizationModel.postalCode1 }}
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <div v-if="!organizationModel.isSameAsMailing">
            <v-row no-gutters class="mt-6 mb-2">
              <AppLabel>Physical Address:</AppLabel>
            </v-row>
            <v-row no-gutters class="my-2">
              <v-col cols="12" sm="5" xl="4" xxl="3">
                <AppLabel>Street Address</AppLabel>
              </v-col>
              <v-col cols="12" sm="7" xl="8">
                {{ organizationModel.address2 }}
              </v-col>
            </v-row>
            <v-row no-gutters class="my-2">
              <v-col cols="12">
                <v-row no-gutters>
                  <v-col cols="12" sm="5" xl="4" xxl="3">
                    <AppLabel>City:</AppLabel>
                  </v-col>
                  <v-col cols="12" sm="7" xl="8" xxl="9">
                    {{ organizationModel.city2 }}
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" class="my-2 my-xl-0">
                <v-row no-gutters>
                  <v-col cols="12" sm="5" xl="4" xxl="3">
                    <AppLabel>Province:</AppLabel>
                  </v-col>
                  <v-col cols="12" sm="7" xl="8" xxl="9">
                    {{ organizationModel.province2 }}
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12">
                <v-row no-gutters>
                  <v-col cols="12" sm="5" xl="4" xxl="3">
                    <AppLabel>Postal Code:</AppLabel>
                  </v-col>
                  <v-col cols="12" sm="7" xxl="8">
                    {{ organizationModel.postalCode2 }}
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapState } from 'pinia';
import { PATHS } from '@/utils/constants.js';

import { useOrganizationStore } from '@/store/ccof/organization.js';
import { useApplicationStore } from '@/store/application.js';

import AppLabel from '@/components/util/AppLabel.vue';

export default {
  name: 'OrganizationInfo',
  components: {
    AppLabel,
  },
  data() {
    return {
      PATHS,
    };
  },
  computed: {
    ...mapState(useOrganizationStore, [
      'organizationAccountNumber',
      'organizationName',
      'organizationModel',
      'isLoadingModel',
    ]),
    isReportChangeButtonEnabled() {
      const applicationStore = useApplicationStore();
      if (applicationStore.applicationType === 'RENEW' && this.organizationAccountNumber) {
        return true;
      }
      return !!(
        this.organizationAccountNumber &&
        applicationStore.applicationMap?.get(applicationStore.programYearId)?.fundingAgreementNumber
      );
    },
  },
};
</script>
<style scoped></style>
