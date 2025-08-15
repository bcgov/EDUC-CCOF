<template>
  <v-form ref="form">
    <v-container class="pa-0 text-body-1" fluid>
      <v-row no-gutters>
        <v-col cols="12">
          <p class="mb-4">
            Review and update your licence and service details. You may update your hours of operation directly.
          </p>
        </v-col>
        <v-col cols="12" md="9">
          <p class="mb-2">
            To request changes to any other information to this tab, click <strong>Request a Change</strong>.
          </p>
        </v-col>
        <v-col cols="9" md="3" class="mt-2 mt-md-0 d-flex justify-end align-end pr-2">
          <AppButton color="primary" size="small" @click="goToChangeRequestHistory()"> Request a Change </AppButton>
        </v-col>
      </v-row>
      <div class="my-4"></div>
      <v-sheet class="pa-4" elevation="2" rounded>
        <v-row no-gutters>
          <v-col cols="12" lg="6">
            <v-row no-gutters class="mr-2 my-2">
              <v-col cols="12" sm="6" class="pr-2 mt-1">
                <AppLabel><strong>Facility ID:</strong></AppLabel>
              </v-col>
              <v-col cols="12" sm="6" class="mt-1">{{ facility.facilityName }}</v-col>
            </v-row>
          </v-col>
          <v-row><v-col cols="12" class="my-2"></v-col></v-row>
          <v-col cols="12" lg="6">
            <v-row no-gutters class="mr-2 my-2">
              <v-col cols="12" sm="6" class="pr-2 mt-1">
                <AppLabel><strong>Organization ID:</strong></AppLabel>
              </v-col>
              <v-col cols="12" sm="6" class="mt-1">{{ userInfo.organizationName }}</v-col>
            </v-row>
          </v-col>
          <v-col cols="12" lg="6">
            <v-row no-gutters class="mr-2 my-2">
              <v-col cols="12" sm="6" class="pr-2 mt-1">
                <AppLabel><strong>Health Authority:</strong></AppLabel>
              </v-col>
              <v-col cols="12" sm="6" class="mt-1">{{ getHealthAuthorityNameById(facility.healthAuthority) }}</v-col>
            </v-row>
          </v-col>
          <v-row><v-col cols="12" class="my-2"></v-col></v-row>
          <v-col cols="12" lg="6">
            <v-row no-gutters class="mr-2 my-2">
              <v-col cols="12" sm="6" class="pr-2 mt-1">
                <AppLabel><strong></strong></AppLabel>
              </v-col>
              <v-col cols="12" sm="6" class="mt-1">{{}}</v-col>
            </v-row>
          </v-col>
          <v-col cols="12" lg="6">
            <v-row no-gutters class="mr-2 my-2">
              <v-col cols="12" sm="6" class="pr-2 mt-1">
                <AppLabel><strong>Licence Start Date:</strong></AppLabel>
              </v-col>
              <v-col cols="12" sm="6" class="mt-1">{{
                activeLicence?.licenceStartDate ? formatUTCDate(activeLicence?.licenceStartDate) : EMPTY_PLACEHOLDER
              }}</v-col>
            </v-row>
          </v-col>
          <v-row><v-col cols="12" class="my-2"></v-col></v-row>
          <v-col cols="12" lg="6">
            <v-row no-gutters class="mr-2 my-2">
              <v-col cols="12" sm="6" class="pr-2 mt-1">
                <AppLabel><strong>Licence End Date:</strong></AppLabel>
              </v-col>
              <v-col cols="12" sm="6" class="mt-1">{{
                activeLicence?.licenceEndDate ? formatUTCDate(activeLicence?.licenceEndDate) : EMPTY_PLACEHOLDER
              }}</v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-sheet v-if="activeLicence" class="pa-4" elevation="0" rounded>
          <v-col cols="12">
            <div class="mb-2">
              <span class="text-h6 font-weight-bold" style="border-bottom: 2px solid #000"> Type(s) of Service </span>
            </div>
          </v-col>
          <v-col cols="12">
            <v-expansion-panels v-model="panel" multiple>
              <v-expansion-panel v-for="(serviceDetail, index) in activeLicence.serviceDeliveryDetails" :key="index">
                <v-expansion-panel-title>
                  <strong>{{ serviceDetail.licenseCategory }} </strong>
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <v-row>
                    <v-col cols="12" lg="4">
                      <v-row no-gutters>
                        <v-col cols="12" sm="6">
                          <AppLabel>Start Date:</AppLabel>
                        </v-col>
                        <v-col cols="12" sm="6">{{ serviceDetail.licenceStartDate }}</v-col>
                      </v-row>
                    </v-col>
                    <v-col cols="12" lg="4">
                      <v-row no-gutters>
                        <v-col cols="12" sm="6">
                          <AppLabel>End Date:</AppLabel>
                        </v-col>
                        <v-col cols="12" sm="6">{{ serviceDetail.licenceEndDate }}</v-col>
                      </v-row>
                    </v-col>
                    <v-col cols="12" lg="4"> </v-col>
                    <v-col cols="12" lg="4">
                      <v-row no-gutters>
                        <v-col cols="12" sm="6">
                          <AppLabel>Licensed Spaces:</AppLabel>
                        </v-col>
                        <v-col cols="12" sm="6">{{ serviceDetail.licencedSpaces }}</v-col>
                      </v-row>
                    </v-col>
                    <v-col cols="12" lg="4">
                      <v-row no-gutters>
                        <v-col cols="12" sm="6">
                          <AppLabel>Max Capacity:</AppLabel>
                        </v-col>
                        <v-col cols="12" sm="6">{{ serviceDetail.maximumCapacity }}</v-col>
                      </v-row>
                    </v-col>
                    <v-col cols="12" lg="4"> </v-col>
                    <v-col cols="12" lg="4">
                      <v-row no-gutters>
                        <v-col cols="12" sm="6">
                          <AppLabel>Weeks in Operation:</AppLabel>
                        </v-col>
                        <v-col cols="12" sm="6">{{ serviceDetail.maxweeksPerYear }}</v-col>
                      </v-row>
                    </v-col>
                    <v-col cols="12" lg="4">
                      <v-row no-gutters>
                        <v-col cols="12" sm="6">
                          <AppLabel>Days of Week:</AppLabel>
                        </v-col>
                        <v-col cols="12" sm="6">{{ getDayNames(serviceDetail.maxdaysPerWeek) }}</v-col>
                      </v-row>
                    </v-col>
                    <v-col cols="12" lg="4">
                      <v-row no-gutters>
                        <v-col cols="12" sm="6">
                          <AppLabel>Hours:</AppLabel>
                        </v-col>
                        <v-col cols="12" sm="6" class="d-flex align-center">
                          <template v-if="serviceDetail.isEditing">
                            <v-row dense class="d-flex flex-wrap align-center">
                              <v-col cols="auto" sm="6" class="fixed-width">
                                <AppTimeInput v-model="serviceDetail.tempFromTime" label="From" />
                              </v-col>
                              <v-col cols="auto" sm="auto" class="d-flex align-center ml-2 flex-shrink-0">
                                <AppButton size="small" @click="saveHours(serviceDetail)"> Save </AppButton>
                              </v-col>
                              <v-col cols="auto" sm="6" class="fixed-width">
                                <AppTimeInput v-model="serviceDetail.tempToTime" label="To" />
                              </v-col>
                              <v-col cols="auto" sm="auto" class="d-flex align-center ml-2 flex-shrink-0">
                                <AppButton size="small" @click="cancelEdit(serviceDetail)"> Cancel </AppButton>
                              </v-col>
                              <v-col v-if="serviceDetail.errorMessage" cols="12" class="text-error mt-2">
                                {{ serviceDetail.errorMessage }}
                              </v-col>
                            </v-row>
                          </template>
                          <template v-else>
                            {{ formatUTCTimeToLocal(serviceDetail?.facilityHoursFrom) }} -
                            {{ formatUTCTimeToLocal(serviceDetail?.facilityHoursTo) }}
                            <AppButton size="small" class="ml-2" @click="startEdit(serviceDetail)"> Edit </AppButton>
                          </template>
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-col cols="12" lg="4">
                      <v-row no-gutters>
                        <v-col cols="12" sm="6">
                          <AppLabel>Care Type:</AppLabel>
                        </v-col>
                        <v-col cols="12" sm="6">{{ serviceDetail.capacityByCareType }}</v-col>
                      </v-row>
                    </v-col>
                    <v-col cols="12" lg="4">
                      <v-row no-gutters>
                        <v-col cols="12" sm="6">
                          <AppLabel>Overnight Care:</AppLabel>
                        </v-col>
                        <v-col cols="12" sm="6">{{ serviceDetail.overnightCare ? 'Yes' : 'No' }}</v-col>
                      </v-row>
                    </v-col>
                    <v-col cols="12" lg="4">
                      <v-row no-gutters>
                        <v-col cols="12" sm="6">
                          <AppLabel>Extended Hours:</AppLabel>
                        </v-col>
                        <v-col cols="12" sm="6">{{ serviceDetail.extendedHours ? 'Yes' : 'No' }}</v-col>
                      </v-row>
                    </v-col>
                    <template v-if="serviceDetail.overnightCare || serviceDetail.extendedHours">
                      <v-col cols="12" lg="4">
                        <v-row no-gutters>
                          <v-col cols="12" sm="6">
                            <AppLabel>Max 4 or less:</AppLabel>
                          </v-col>
                          <v-col cols="12" sm="6">{{ serviceDetail.maxfourorLess }}</v-col>
                        </v-row>
                      </v-col>
                      <v-col cols="12" lg="4">
                        <v-row no-gutters>
                          <v-col cols="12" sm="6">
                            <AppLabel>Max over 4:</AppLabel>
                          </v-col>
                          <v-col cols="12" sm="6">{{ serviceDetail.maxoverFour }}</v-col>
                        </v-row>
                      </v-col>
                    </template>
                    <v-col
                      v-if="['PRESCHOOL', 'School Aged care on School Grounds'].includes(serviceDetail.licenseCategory)"
                      cols="12"
                    >
                      <v-row no-gutters class="my-2">
                        <v-col cols="12" lg="6">
                          <v-row no-gutters class="mr-2 my-2">
                            <v-col cols="12" sm="6" class="pr-2 mt-1">
                              <AppLabel>Number of preschool sessions:</AppLabel>
                            </v-col>
                            <v-col cols="12" sm="6" class="mt-1">{{ serviceDetail.preschoolSessions }}</v-col>
                          </v-row>
                        </v-col>
                        <v-col cols="12" lg="6">
                          <v-row no-gutters class="mr-2 my-2" style="align-items: center">
                            <v-col cols="12" sm="6" class="pr-2 d-flex align-center">
                              <AppLabel>Accepts Subsidy?</AppLabel>
                            </v-col>
                            <v-col cols="12" sm="6" class="pr-2 d-flex align-center">
                              <v-checkbox v-model="serviceDetail.acceptsSubsidy" label="" disabled hide-details dense />
                            </v-col>
                          </v-row>
                        </v-col>
                        <v-col cols="12" lg="6">
                          <v-row no-gutters class="mr-2 my-2" style="align-items: center">
                            <v-col cols="12" sm="6" class="pr-2 d-flex align-center">
                              <AppLabel>School age on school grounds?</AppLabel>
                            </v-col>
                            <v-col cols="12" sm="6" class="pr-2 d-flex align-center">
                              <v-checkbox
                                v-model="serviceDetail.schoolAgeOnSchoolGrounds"
                                label=""
                                disabled
                                hide-details
                                dense
                              />
                            </v-col>
                          </v-row>
                        </v-col>
                        <v-col cols="12" lg="6">
                          <v-row no-gutters class="mr-2 my-2" style="align-items: center">
                            <v-col cols="12" sm="6" class="pr-2 d-flex align-center">
                              <AppLabel>Recreational Care?</AppLabel>
                            </v-col>
                            <v-col cols="12" sm="6" class="pr-2 d-flex align-center">
                              <v-checkbox
                                v-model="serviceDetail.recreationalCare"
                                label=""
                                disabled
                                hide-details
                                dense
                              />
                            </v-col>
                          </v-row>
                        </v-col>
                        <v-col cols="12" lg="6">
                          <v-row no-gutters class="mr-2 my-2" style="align-items: center">
                            <v-col cols="12" sm="6" class="pr-2 d-flex align-center">
                              <AppLabel>Before School?</AppLabel>
                            </v-col>
                            <v-col cols="12" sm="6" class="pr-2 d-flex align-center">
                              <v-checkbox
                                v-model="serviceDetail.beforeSchoolCare"
                                label=""
                                disabled
                                hide-details
                                dense
                              />
                            </v-col>
                          </v-row>
                        </v-col>
                        <v-col cols="12" lg="6">
                          <v-row no-gutters class="mr-2 my-2" style="align-items: center">
                            <v-col cols="12" sm="6" class="pr-2 d-flex align-center">
                              <AppLabel>After School?</AppLabel>
                            </v-col>
                            <v-col cols="12" sm="6" class="pr-2 d-flex align-center">
                              <v-checkbox
                                v-model="serviceDetail.afterSchoolCare"
                                label=""
                                disabled
                                hide-details
                                dense
                              />
                            </v-col>
                          </v-row>
                        </v-col>
                        <v-col cols="12" lg="6">
                          <v-row no-gutters class="mr-2 my-2" style="align-items: center">
                            <v-col cols="12" sm="6" class="pr-2 d-flex align-center">
                              <AppLabel>Morning Kindercare?</AppLabel>
                            </v-col>
                            <v-col cols="12" sm="6" class="pr-2 d-flex align-center">
                              <v-checkbox
                                v-model="serviceDetail.morningKinderCare"
                                label=""
                                disabled
                                hide-details
                                dense
                              />
                            </v-col>
                          </v-row>
                        </v-col>
                        <v-col cols="12" lg="6">
                          <v-row no-gutters class="mr-2 my-2" style="align-items: center">
                            <v-col cols="12" sm="6" class="pr-2 d-flex align-center">
                              <AppLabel>Afternoon Kindercare?</AppLabel>
                            </v-col>
                            <v-col cols="12" sm="6" class="pr-2 d-flex align-center">
                              <v-checkbox
                                v-model="serviceDetail.afterKinderCare"
                                label=""
                                disabled
                                hide-details
                                dense
                              />
                            </v-col>
                          </v-row>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-col>
        </v-sheet>
      </v-sheet>
    </v-container>
  </v-form>
</template>
<script>
import { mapState } from 'pinia';

import { useAppStore } from '@/store/app.js';
import { useAuthStore } from '@/store/auth.js';

import alertMixin from '@/mixins/alertMixin';

import { DAYS_OF_WEEK, PATHS, EMPTY_PLACEHOLDER } from '@/utils/constants';
import { formatUTCDate, formatUTCTimeToLocal, formatlocalTimeToUTC, formatUTCDateToLocal } from '@/utils/format';

import FacilityService from '@/services/facilityService';
import LicenceService from '@/services/licenceService';

import AppButton from '@/components/guiComponents/AppButton.vue';
import AppLabel from '@/components/guiComponents/AppLabel.vue';
import AppTimeInput from '@/components/guiComponents/AppTimeInput.vue';

export default {
  name: 'ManageLicence',
  components: { AppButton, AppLabel, AppTimeInput },
  mixins: [alertMixin],
  data() {
    return {
      facility: {},
      panel: [],
      activeLicence: undefined,
    };
  },
  computed: {
    ...mapState(useAppStore, ['getHealthAuthorityNameById']),
    ...mapState(useAuthStore, ['userInfo']),
  },
  async created() {
    this.EMPTY_PLACEHOLDER = EMPTY_PLACEHOLDER;
    await this.loadData();
  },
  methods: {
    formatUTCDate,
    formatUTCTimeToLocal,
    formatlocalTimeToUTC,
    formatUTCDateToLocal,
    async loadData() {
      try {
        this.facility = await FacilityService.getFacilityById(this.$route.params.facilityId);
        this.licences = (await LicenceService.getLicences(this.$route.params.facilityId)) || [];
        this.activeLicence = this.licences[0];

        this.activeLicence?.serviceDeliveryDetails?.forEach((detail) => {
          detail.tempFromTime = this.formatUTCTimeToLocal(detail.facilityHoursFrom);
          detail.tempToTime = this.formatUTCTimeToLocal(detail.facilityHoursTo);
          detail.isEditing = false;
        });
      } catch (error) {
        this.setFailureAlert('Failed to load licence details.');
        console.error('Error loading licence: ', error);
      }
    },
    getDayNames(days) {
      return days
        .split(',')
        .map((day) => DAYS_OF_WEEK[day])
        .join(', ');
    },
    goToChangeRequestHistory() {
      this.$router.push(PATHS.ROOT.CHANGE_LANDING + '#change-request-history');
    },
    startEdit(detail) {
      if (!detail.isEditing) {
        detail.isEditing = true;
        detail.tempFromTime = this.formatUTCTimeToLocal(detail.facilityHoursFrom);
        detail.tempToTime = this.formatUTCTimeToLocal(detail.facilityHoursTo);
      }
    },
    cancelEdit(detail) {
      detail.tempFromTime = this.formatUTCTimeToLocal(detail.facilityHoursFrom);
      detail.tempToTime = this.formatUTCTimeToLocal(detail.facilityHoursTo);
      detail.isEditing = false;
      detail.errorMessage = '';
    },
    async saveHours(detail) {
      try {
        detail.errorMessage = '';
        if (!this.validateOperatingHours(detail)) {
          detail.errorMessage = 'Submit a change request to update your operating hours';
          return;
        }

        const localFromDate = formatUTCDateToLocal(detail.facilityHoursFrom);
        detail.facilityHoursFrom = formatlocalTimeToUTC(localFromDate, detail.tempFromTime);
        detail.facilityHoursTo = formatlocalTimeToUTC(localFromDate, detail.tempToTime);

        await LicenceService.updateServiceDeliveryHours({
          serviceDeliveryId: detail.serviceDeliveryId,
          facilityHoursFrom: detail.facilityHoursFrom,
          facilityHoursTo: detail.facilityHoursTo,
        });

        detail.isEditing = false;
        detail.errorMessage = '';
        this.setSuccessAlert('Hours of operation saved.');
      } catch (error) {
        this.setFailureAlert('Failed to save hours.');
        console.error(error);
      }
    },
    validateOperatingHours(detail) {
      const from = new Date(`1970-01-01T${detail.tempFromTime}:00`);
      const to = new Date(`1970-01-01T${detail.tempToTime}:00`);

      if (detail.extendedHours) {
        return to > from;
      }
      const earliest = new Date('1970-01-01T06:00:00');
      const latest = new Date('1970-01-01T19:00:00');

      return from >= earliest && to <= latest && to > from;
    },
  },
};
</script>
<style scoped>
.fixed-width {
  min-width: 150px;
  max-width: 150px;
}
</style>
