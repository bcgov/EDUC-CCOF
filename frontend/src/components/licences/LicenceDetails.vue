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
              <v-col cols="12" sm="6" class="mt-1">{{ licenceList[0]?.ccofFacility }}</v-col>
            </v-row>
          </v-col>
          <v-row><v-col cols="12" class="my-2"></v-col></v-row>
          <v-col cols="12" lg="6">
            <v-row no-gutters class="mr-2 my-2">
              <v-col cols="12" sm="6" class="pr-2 mt-1">
                <AppLabel><strong>Organization ID:</strong></AppLabel>
              </v-col>
              <v-col cols="12" sm="6" class="mt-1">{{ licenceList[0]?.ccofOrganization }}</v-col>
            </v-row>
          </v-col>
          <v-col cols="12" lg="6">
            <v-row no-gutters class="mr-2 my-2">
              <v-col cols="12" sm="6" class="pr-2 mt-1">
                <AppLabel><strong>Health Authority:</strong></AppLabel>
              </v-col>
              <v-col cols="12" sm="6" class="mt-1">{{ facility.healthAuthority }}</v-col>
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
              <v-col cols="12" sm="6" class="mt-1">{{ formatUTCDate(licenceList[0]?.licenceStartDate) }}</v-col>
            </v-row>
          </v-col>
          <v-row><v-col cols="12" class="my-2"></v-col></v-row>
          <v-col cols="12" lg="6">
            <v-row no-gutters class="mr-2 my-2">
              <v-col cols="12" sm="6" class="pr-2 mt-1">
                <AppLabel><strong>Licence End Date:</strong></AppLabel>
              </v-col>
              <v-col cols="12" sm="6" class="mt-1">{{ formatUTCDate(licenceList[0]?.licenceEndDate) }}</v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-col cols="12">
          <div class="mb-2">
            <span class="text-h6 font-weight-bold" style="border-bottom: 2px solid #000"> Type(s) of Service </span>
          </div>
        </v-col>
        <v-col cols="12">
          <v-expansion-panels v-model="panel" multiple>
            <v-expansion-panel
              v-for="licenceDetail in licenceDetails"
              :key="licenceDetail.licenceDetailId"
              :value="licenceDetail.licenceDetailId"
            >
              <v-expansion-panel-title>
                <strong>{{ licenceDetail.licenseCategory }} </strong>
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <v-row>
                  <v-col cols="12" lg="4">
                    <v-row no-gutters>
                      <v-col cols="12" sm="6">
                        <AppLabel>Start Date:</AppLabel>
                      </v-col>
                      <v-col cols="12" sm="6">{{ licenceDetail.licenceStartDate }}</v-col>
                    </v-row>
                  </v-col>
                  <v-col cols="12" lg="4">
                    <v-row no-gutters>
                      <v-col cols="12" sm="6">
                        <AppLabel>End Date:</AppLabel>
                      </v-col>
                      <v-col cols="12" sm="6">{{ licenceDetail.licenceEndDate }}</v-col>
                    </v-row>
                  </v-col>
                  <v-col cols="12" lg="4"> </v-col>
                  <v-col cols="12" lg="4">
                    <v-row no-gutters>
                      <v-col cols="12" sm="6">
                        <AppLabel>Licensed Spaces:</AppLabel>
                      </v-col>
                      <v-col cols="12" sm="6">{{ licenceDetail.licencedSpaces }}</v-col>
                    </v-row>
                  </v-col>
                  <v-col cols="12" lg="4">
                    <v-row no-gutters>
                      <v-col cols="12" sm="6">
                        <AppLabel>Max Capacity:</AppLabel>
                      </v-col>
                      <v-col cols="12" sm="6">{{ licenceDetail.maximumCapacity }}</v-col>
                    </v-row>
                  </v-col>
                  <v-col cols="12" lg="4"> </v-col>
                  <v-col cols="12" lg="4">
                    <v-row no-gutters>
                      <v-col cols="12" sm="6">
                        <AppLabel>Weeks in Operation:</AppLabel>
                      </v-col>
                      <v-col cols="12" sm="6">{{ licenceDetail.maxweeksPerYear }}</v-col>
                    </v-row>
                  </v-col>
                  <v-col cols="12" lg="4">
                    <v-row no-gutters>
                      <v-col cols="12" sm="6">
                        <AppLabel>Days of Week:</AppLabel>
                      </v-col>
                      <v-col cols="12" sm="6">{{ getDayNames(licenceDetail.maxdaysPerWeek) }}</v-col>
                    </v-row>
                  </v-col>
                  <v-col cols="12" lg="4">
                    <v-row no-gutters>
                      <v-col cols="12" sm="6">
                        <AppLabel>Hours:</AppLabel>
                      </v-col>
                      <v-col cols="12" sm="6"
                        >{{ formatUTCTimeToLocal(licenceDetail?.facilityHoursFrom) }} -
                        {{ formatUTCTimeToLocal(licenceDetail?.facilityHoursTo) }}</v-col
                      >
                    </v-row>
                  </v-col>
                  <v-col cols="12" lg="4">
                    <v-row no-gutters>
                      <v-col cols="12" sm="6">
                        <AppLabel>Care Type:</AppLabel>
                      </v-col>
                      <v-col cols="12" sm="6">{{ licenceDetail.capacityByCareType }}</v-col>
                    </v-row>
                  </v-col>
                  <v-col cols="12" lg="4">
                    <v-row no-gutters>
                      <v-col cols="12" sm="6">
                        <AppLabel>Overnight Care:</AppLabel>
                      </v-col>
                      <v-col cols="12" sm="6">{{ licenceDetail.overnightCare ? 'Yes' : 'No' }}</v-col>
                    </v-row>
                  </v-col>
                  <v-col cols="12" lg="4">
                    <v-row no-gutters>
                      <v-col cols="12" sm="6">
                        <AppLabel>Extended Hours:</AppLabel>
                      </v-col>
                      <v-col cols="12" sm="6">{{ licenceDetail.extendedHours ? 'Yes' : 'No' }}</v-col>
                    </v-row>
                  </v-col>
                  <template v-if="licenceDetail.overnightCare || licenceDetail.extendedHours">
                    <v-col cols="12" lg="4">
                      <v-row no-gutters>
                        <v-col cols="12" sm="6">
                          <AppLabel>Max 4 or less:</AppLabel>
                        </v-col>
                        <v-col cols="12" sm="6">{{ licenceDetail.maxfourorLess }}</v-col>
                      </v-row>
                    </v-col>
                    <v-col cols="12" lg="4">
                      <v-row no-gutters>
                        <v-col cols="12" sm="6">
                          <AppLabel>Max over 4:</AppLabel>
                        </v-col>
                        <v-col cols="12" sm="6">{{ licenceDetail.maxoverFour }}</v-col>
                      </v-row>
                    </v-col>
                  </template>
                  <v-col
                    v-if="['PRESCHOOL', 'School Aged care on School Grounds'].includes(licenceDetail.licenseCategory)"
                    cols="12"
                  >
                    <v-row no-gutters class="my-2">
                      <v-col cols="12" lg="6">
                        <v-row no-gutters class="mr-2 my-2">
                          <v-col cols="12" sm="6" class="pr-2 mt-1">
                            <AppLabel>Number of preschool sessions:</AppLabel>
                          </v-col>
                          <v-col cols="12" sm="6" class="mt-1">{{ licenceDetail.preschoolSessions }}</v-col>
                        </v-row>
                      </v-col>
                      <v-col cols="12" lg="6">
                        <v-row no-gutters class="mr-2 my-2" style="align-items: center">
                          <v-col cols="12" sm="6" class="pr-2 d-flex align-center">
                            <AppLabel>Accepts Subsidy?</AppLabel>
                          </v-col>
                          <v-col cols="12" sm="6" class="pr-2 d-flex align-center">
                            <v-checkbox v-model="licenceDetail.acceptsSubsidy" label="" disabled hide-details dense />
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
                              v-model="licenceDetail.schoolAgeOnSchoolGrounds"
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
                            <v-checkbox v-model="licenceDetail.recreationalCare" label="" disabled hide-details dense />
                          </v-col>
                        </v-row>
                      </v-col>
                      <v-col cols="12" lg="6">
                        <v-row no-gutters class="mr-2 my-2" style="align-items: center">
                          <v-col cols="12" sm="6" class="pr-2 d-flex align-center">
                            <AppLabel>Before School?</AppLabel>
                          </v-col>
                          <v-col cols="12" sm="6" class="pr-2 d-flex align-center">
                            <v-checkbox v-model="licenceDetail.beforeSchoolCare" label="" disabled hide-details dense />
                          </v-col>
                        </v-row>
                      </v-col>
                      <v-col cols="12" lg="6">
                        <v-row no-gutters class="mr-2 my-2" style="align-items: center">
                          <v-col cols="12" sm="6" class="pr-2 d-flex align-center">
                            <AppLabel>After School?</AppLabel>
                          </v-col>
                          <v-col cols="12" sm="6" class="pr-2 d-flex align-center">
                            <v-checkbox v-model="licenceDetail.afterSchoolCare" label="" disabled hide-details dense />
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
                              v-model="licenceDetail.morningKinderCare"
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
                            <v-checkbox v-model="licenceDetail.afterKinderCare" label="" disabled hide-details dense />
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
    </v-container>
  </v-form>
</template>
<script>
import { DAYS_OF_WEEK, PATHS } from '@/utils/constants';
import { formatUTCDate, formatUTCTimeToLocal } from '@/utils/format';

import FacilityService from '@/services/facilityService';
import LicenceService from '@/services/licenceService';

import AppButton from '@/components/guiComponents/AppButton.vue';
import AppLabel from '@/components/guiComponents/AppLabel.vue';

export default {
  name: 'LicenceDetails',
  components: { AppButton, AppLabel },
  props: {
    editable: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      facilityId: null,
      facility: {},
      licenceList: [],
      licenceDetails: [],
      panel: [],
    };
  },
  async created() {
    this.DAYS_OF_WEEK = DAYS_OF_WEEK;
    await this.loadData();
  },
  methods: {
    formatUTCDate,
    formatUTCTimeToLocal,
    async loadData() {
      this.facilityId = this.$route.params.facilityId;

      try {
        const [facility, licenceList] = await Promise.all([
          FacilityService.getFacilityById(this.facilityId),
          FacilityService.getLicences(this.facilityId),
        ]);
        this.facility = facility;
        this.licenceList = licenceList;
        this.licenceDetails = await LicenceService.getLicenceDetails(this.licenceList[0]?.licenceId);
      } catch (error) {
        this.setFailureAlert('Failed to load licence details.');
        console.error('Error loading licence: ', error);
      }
    },
    getDayNames(days) {
      const dayNames = DAYS_OF_WEEK.map((day) => day.title);
      return typeof days === 'string'
        ? days
            .split(',')
            .map((day) => dayNames[Number(day) - 1])
            .join(', ')
        : days;
    },
    goToChangeRequestHistory() {
      this.$router.push(PATHS.ROOT.CHANGE_LANDING + '#change-request-history');
    },
  },
};
</script>
