<template>
  <v-form ref="searchForm" @submit.prevent>
    <v-row justify="center">
      <v-col cols="12" style="padding-top:0px;" align="center">
        <v-card elevation="4" max-width="1448">
          <v-row>
            <v-col style="padding-top:0%;padding-bottom:0px;">
                <v-card-title class="pt-2 pb-2" style="color:white;font-style:normal;font-family:BCSans;font-weight:700;font-size:20px;background-color:#431782;">Optional Facility Search</v-card-title>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="10" class="pt-5 text-left">
              <div color="#313131" style="padding-left:24px;font-style:normal;font-weight:500;font-family:BCSans;font-size:16px;">
                Enter a facility name or city of a licensed child care provider participating in CCFRI
              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="10" sm=9 class="py-0 pr-0">
              <v-text-field
                ref="searchCriteria"
                style="padding-left:34px;"
                background-color="white"
                dense
                clearable
                @click:clear="clearAndDontShowValidation('searchCriteria')"
                hint="Type your keyword here"
                v-model="searchCriteria"
                outlined
                required
                :rules="rulesSearchCriteria"
                v-on:keydown.enter="searchFacilities(searchCriteria);"
                >
              </v-text-field>
            </v-col>
            <v-col class="pt-0 pl-0 text-left" cols="3">
              <v-dialog
                v-model="dialog"
                persistent
                max-width="650px"
                @click:outside="dialog = false">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn style="font-style:normal;font-weight:700;font-family:BCSans;;font-size:16px;margin-left:10px"
                    color="#0483AF"
                    dark
                    v-bind="attrs"
                    @click="searchFacilities(searchCriteria)">
                    Search
                  </v-btn>
                 </template>
                <v-card>
                  <v-container style="padding-top:0px;">
                    <v-row>
                      <v-col cols="6" class="d-flex pl-0" style="background-color:#7B2EE5;">
                        <v-card-title style="color:white;font-style:normal;font-weight:700;font-family:BCSans;font-size:20px;padding-top:0px;padding-bottom:0px;background-color:#7B2EE5;">Search Facilities</v-card-title>
                      </v-col>
                      <v-col cols="6" class="d-flex justify-end" style="background-color:#7B2EE5;">
                        <v-btn icon>
                          <v-icon large
                            color="white"
                            @click="dialog=false">
                            mdi-close
                          </v-icon>
                        </v-btn>
                      </v-col>
                    </v-row>
                    <v-row >
                      <v-col cols="12" class="d-flex pb-0" style="padding-left:24px;padding-bottom:0px;">
                        <v-text-field
                          ref="searchCriteriaOnDialogue"
                          v-model="searchCriteria"
                          :disabled="loading"
                          outlined
                          required
                          dense
                          clearable
                          @click:clear="clearAndDontShowValidation('searchCriteriaOnDialogue')"
                          v-on:keydown.enter="searchFacilities(searchCriteria);"
                          :rules="rulesSearchCriteria"
                          style="padding-right:3px;">
                        </v-text-field>
                        <v-btn icon style="margin-right:18px;" :disabled="loading"
                          @click="searchFacilities(searchCriteria);">
                          <v-card color="#0483AF" style="margin-top:2px;padding-top:8px;padding-bottom:8px;padding-left:6px;padding-right:6px">
                          <v-icon style=""
                            large
                            color="white"
                          >
                            mdi-magnify
                          </v-icon>
                        </v-card>
                        </v-btn>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12" style="padding-top:0px;">
                        <v-data-table
                          :headers="headers"
                          :items="searchResults"
                          item-key="name"
                          :items-per-page="5"
                          hide-default-header
                          v-model="selectedFacility"
                          :loading="loading"
                          loading-text="Loading..."
                          :hide-default-footer="loading">
                          <template v-slot:item="{ item }">
                            <tr :class="selectedFacility.indexOf(item.name)>-1?'grey':''" @click="rowSelected(item);dialog=false">
                              <td style="padding-bottom:10px;padding-top:10px;">
                                <span style="font-weight:600;color:#431782;font-size:16px;font-family:BCSans;">{{ item.facilityName }}</span>
                                <br>
                                <span style="font-weight:600;color: #000;font-size:14px;font-family:BCSans;">City: </span>{{ item.city }}
                              </td>
                              <td class="text-right">
                                <v-btn style="font-style:normal;font-weight:500;font-family:BCSans;font-size:14px;padding-left:24px;padding-right:24px;"
                                  color="#0483AF"
                                  dark>
                                  Select
                                </v-btn>
                              </td>
                            </tr>
                          </template>
                          <template slot="no-data">
                            <span style="color:#0483AF;font-weight:bold;font-size:large;">No facilities were found matching your search criteria.<br/> Try different keywords or check your spelling.</span><br/><br/>
                          </template>
                          <template v-slot:body.append>
                            <tr v-show="!loading && searchResults.length == 50">
                              <td colspan="2">
                                <table> <!--//NOSONAR-->
                                  <tr>
                                    <td colspan="1" with="10%" style="vertical-align:top;"><span style="color:#0FC3ED;font-weight:bold;font-size:x-large;">*</span></td>
                                    <td style="padding-top:2px">
                                      <span style="font-style:italic;font-size:small;">
                                        Only the first 50 results of your search are viewable. Try narrowing down your search by using additional keywords.
                                      </span></td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </template>
                        </v-data-table>
                        <v-skeleton-loader max-height="375px" v-if="loading" :loading="loading" type="table-tbody, table-tfoot"></v-skeleton-loader>
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

export default {
  name: 'FacilitySearch',
  props: {},
  data() {
    return {
      searchCriteria: '',
      dialog: '',
      selectedFacility: [],
      searchResults: [],
      facilityResult: [],
      loading: false,
      headers: [
        {
          text: '',
          align: 'start',
          sortable: false,
          value: 'name',
        }
      ],
      rulesSearchCriteria: [
        (v) => !!v || 'Facility search criteria is required'
      ],
    };
  },
  methods: {
    clearAndDontShowValidation(ref) {
      if (ref == 'searchCriteriaOnDialogue') {
        this.$refs.searchCriteriaOnDialogue.resetValidation();
      } else if (ref == 'searchCriteria') {
        this.$refs.searchCriteria.resetValidation();
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
        this.selectedFacility = this.selectedFacility.filter(selectedKeyID => selectedKeyID !== keyID);
      } else {
        this.selectedFacility.push(keyID);
      }
    },
    async searchFacilities (criteria) {
      try {
        if (this.$refs.searchForm.validate()) {
          let urlEncodedCriteria = encodeURIComponent(criteria);
          this.loading = true;
          this.searchResults = [];
          this.dialog = true;
          this.searchResults = (await axios.get('/api/public/facilities?criteria={'+urlEncodedCriteria+'}&pageindex={}')).data;
          this.loading = false;
        }
      } catch (error) {
        console.info(error);
      }
    },
    async getFacility (id) {
      try {
        this.facilityResult = (await axios.get('/api/public/facilities/'+id)).data;
      } catch (error) {
        console.info(error);
      }
    }
  }
};
</script>

<style>
.fa-chevron-left:before {
  color: #0FC3ED !important;
}
.fa-chevron-right:before {
  color: #0FC3ED !important;
}
</style>
