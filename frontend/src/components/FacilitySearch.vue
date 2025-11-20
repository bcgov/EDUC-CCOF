<template>
  <v-form ref="searchForm" @submit.prevent>
    <v-row justify="center">
      <v-col cols="12" style="padding-top: 0px" align="center">
        <v-card elevation="4" max-width="1448">
          <v-row>
            <v-col style="padding-top: 0%; padding-bottom: 0px">
              <v-card-title
                class="pt-2 pb-2"
                style="
                  color: white;
                  font-style: normal;
                  font-family: BCSans;
                  font-weight: 700;
                  font-size: 20px;
                  background-color: #431782;
                "
              >
                Optional Facility Search
              </v-card-title>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="10" class="pt-5 text-left">
              <div
                color="#313131"
                style="padding-left: 24px; font-style: normal; font-weight: 500; font-family: BCSans; font-size: 16px"
              >
                Enter a facility name or city of a licensed child care provider participating in CCFRI
              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="10" sm="9" class="py-0 pr-0">
              <v-text-field
                ref="searchCriteria"
                v-model="searchCriteria"
                style="padding-left: 34px"
                bg-color="white"
                density="compact"
                clearable
                hint="Type your keyword here"
                variant="outlined"
                required
                :rules="rulesSearchCriteria"
                @click:clear="clearAndDontShowValidation('searchCriteria')"
                @keydown.enter="searchFacilities(searchCriteria)"
              />
            </v-col>
            <v-col class="pt-0 pl-0 text-left" cols="3">
              <v-dialog v-model="dialog" persistent max-width="650px" @click:outside="dialog = false">
                <template #activator="{ props }">
                  <v-btn
                    style="
                      font-style: normal;
                      font-weight: 700;
                      font-family: BCSans;
                      font-size: 16px;
                      margin-left: 10px;
                    "
                    color="#0483AF"
                    theme="dark"
                    v-bind="props"
                    @click="searchFacilities(searchCriteria)"
                  >
                    Search
                  </v-btn>
                </template>
                <v-card>
                  <v-container style="padding-top: 0px" class="px-3">
                    <v-row>
                      <v-col cols="6" class="d-flex pl-0 d-flex align-center" style="background-color: #7b2ee5">
                        <v-card-title
                          style="
                            color: white;
                            font-style: normal;
                            font-weight: 700;
                            font-family: BCSans;
                            font-size: 20px;
                            padding-top: 0px;
                            padding-bottom: 0px;
                            background-color: #7b2ee5;
                          "
                        >
                          Search Facilities
                        </v-card-title>
                      </v-col>
                      <v-col cols="6" class="d-flex justify-end" style="background-color: #7b2ee5">
                        <v-btn icon variant="text">
                          <v-icon size="large" color="white" @click="dialog = false"> mdi-close </v-icon>
                        </v-btn>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12" class="d-flex pb-0" style="padding-left: 24px; padding-bottom: 0px">
                        <v-text-field
                          ref="searchCriteriaOnDialogue"
                          v-model="searchCriteria"
                          :disabled="loading"
                          variant="outlined"
                          required
                          density="compact"
                          clearable
                          :rules="rulesSearchCriteria"
                          style="padding-right: 3px"
                          @click:clear="clearAndDontShowValidation('searchCriteriaOnDialogue')"
                          @keydown.enter="searchFacilities(searchCriteria)"
                        />
                        <v-btn
                          icon
                          style="margin-right: 18px"
                          :disabled="loading"
                          variant="text"
                          @click="searchFacilities(searchCriteria)"
                        >
                          <v-card
                            color="#0483AF"
                            style="
                              margin-top: 2px;
                              padding-top: 8px;
                              padding-bottom: 8px;
                              padding-left: 6px;
                              padding-right: 6px;
                            "
                          >
                            <v-icon style="" size="large" color="white"> mdi-magnify </v-icon>
                          </v-card>
                        </v-btn>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12" style="padding-top: 0px">
                        <v-data-table
                          v-model="selectedFacility"
                          :headers="headers"
                          :items="searchResults"
                          item-key="name"
                          :items-per-page="5"
                          hide-default-header
                          :loading="loading"
                          loading-text="Loading..."
                          :hide-default-footer="loading"
                        >
                          <template #item="{ item }">
                            <tr
                              :class="selectedFacility.indexOf(item.name) > -1 ? 'grey' : ''"
                              @click="
                                rowSelected(item);
                                dialog = false;
                              "
                            >
                              <td style="padding-bottom: 10px; padding-top: 10px">
                                <span style="font-weight: 600; color: #431782; font-size: 16px; font-family: BCSans">{{
                                  item.facilityName
                                }}</span>
                                <br />
                                <span style="font-weight: 600; color: #000; font-size: 14px; font-family: BCSans"
                                  >City: </span
                                >{{ item.city }}
                              </td>
                              <td class="text-right">
                                <v-btn
                                  style="
                                    font-style: normal;
                                    font-weight: 500;
                                    font-family: BCSans;
                                    font-size: 14px;
                                    padding-left: 24px;
                                    padding-right: 24px;
                                  "
                                  color="#0483AF"
                                  theme="dark"
                                >
                                  Select
                                </v-btn>
                              </td>
                            </tr>
                          </template>
                          <template #no-data>
                            <span style="color: #0483af; font-weight: bold; font-size: large"
                              >No facilities were found matching your search criteria.<br />
                              Try different keywords or check your spelling.</span
                            ><br /><br />
                          </template>
                          <template #body.append>
                            <tr v-show="!loading && searchResults.length === 50">
                              <td colspan="2">
                                <table>
                                  <tbody>
                                    <!--//NOSONAR-->
                                    <tr>
                                      <td colspan="1" with="10%" style="vertical-align: top">
                                        <span style="color: #0fc3ed; font-weight: bold; font-size: x-large">*</span>
                                      </td>
                                      <td style="padding-top: 2px">
                                        <span style="font-style: italic; font-size: small">
                                          Only the first 50 results of your search are viewable. Try narrowing down your
                                          search by using additional keywords.
                                        </span>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </template>
                        </v-data-table>
                        <v-skeleton-loader
                          v-if="loading"
                          max-height="375px"
                          :loading="loading"
                          type="table-tbody, table-tfoot"
                        />
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card>
              </v-dialog>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-form>
</template>

<script>
import axios from 'axios';

import { ApiRoutes } from '@/utils/constants';

export default {
  name: 'FacilitySearch',
  props: {},
  emits: ['resetTypeOfCare', 'selectedFacility'],
  data() {
    return {
      searchCriteria: '',
      dialog: false,
      selectedFacility: [],
      searchResults: [],
      facilityResult: [],
      loading: false,
      headers: [
        {
          title: '',
          align: 'start',
          sortable: false,
          value: 'name',
        },
      ],
      rulesSearchCriteria: [(v) => !!v || 'Facility search criteria is required'],
    };
  },
  methods: {
    clearAndDontShowValidation(ref) {
      if (ref == 'searchCriteriaOnDialogue') {
        this.$refs.searchCriteriaOnDialogue.resetValidation();
      } else if (ref == 'searchCriteria') {
        this.$refs.searchCriteria.resetValidation();
        this.$emit('resetTypeOfCare');
      }
    },
    rowSelected(facility) {
      this.toggleSelection(facility.facilityName);
      this.searchCriteria = facility.facilityName;
      this.facilityResult = this.getFacility(facility.facilityId).then(() => {
        this.facilityResult.careType = facility.careType;
        // Pass (as an event) the selected facilty  value to the parent component.
        this.$emit('selectedFacility', this.facilityResult);
      });
      this.dialog = false;
    },
    toggleSelection(keyID) {
      if (this.selectedFacility.includes(keyID)) {
        this.selectedFacility = this.selectedFacility.filter((selectedKeyID) => selectedKeyID !== keyID);
      } else {
        this.selectedFacility.push(keyID);
      }
    },
    async searchFacilities(criteria) {
      try {
        if (this.$refs.searchForm.validate()) {
          let urlEncodedCriteria = encodeURIComponent(criteria);
          this.loading = true;
          this.searchResults = [];
          this.dialog = true;
          this.searchResults = (
            await axios.get(`${ApiRoutes.FACILITY_PUBLIC}?criteria={'${urlEncodedCriteria}'}&pageindex={}`)
          ).data;
          this.loading = false;
        }
      } catch (error) {
        console.info(error);
      }
    },
    async getFacility(id) {
      try {
        this.facilityResult = (await axios.get(`${ApiRoutes.FACILITY_PUBLIC}/${id}`)).data;
      } catch (error) {
        console.info(error);
      }
    },
  },
};
</script>

<style scoped>
:deep(.theme--light.v-btn.v-btn--icon) {
  color: #0fc3ed;
}

:deep(.v-data-footer__pagination) {
  margin-left: auto !important;
}

:deep(.v-data-footer__select) {
  margin-left: 0px !important;
}

:deep(.v-input__slot) {
  padding-top: 0px;
}
</style>
