<template>
  <v-form ref="searchForm">
    <v-row justify="center">
      <v-col cols="10" style="padding-top:0px;">
        <v-card elevation="4" class="pa-0" color="#D4EAFF" style="">
          <v-row>
            <v-col style="padding-top:0%;padding-bottom:0px;">
                <v-card-title style="color:#39598A;font-style:normal;font-weight:700;font-family:Inter;font-size:20px">Optional Facility Search:</v-card-title>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" style="padding-top:0%;padding-bottom:0px;">
              <div style="padding-left:24px;color:#39598A;font-style:normal;font-weight:500;font-family:Inter;font-size:16px">
                Search by city or name of a licensed child care provider
              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="8" style="padding-left:34px;">
              <v-text-field
                background-color="white"
                dense
                hint="Type your keyword here"
                v-model="searchCriteria"
                outlined
                required
                :rules="rulesSearchCriteria"
                >
              </v-text-field>
            </v-col>
            <v-col class="d-flex">
              <v-dialog
                v-model="dialog"
                persistent
                max-width="800px"
                @click:outside="dialog = false">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn style="font-style:normal;font-weight:700;font-family:Inter;font-size:16px;padding-left:24px;padding-right:24px;"
                    color="#39598A"
                    dark
                    v-bind="attrs"
                    @click="searchFacilities(searchCriteria)">
                    Search
                  </v-btn>
                 </template>
                <v-card>
                  <v-container style="padding-top:0px;">
                    <v-row>
                      <v-col cols="12" class="d-flex justify-end" style="background-color:#234075;">
                          <v-btn icon>
                            <v-icon style=""
                              large
                              color="white"
                              @click="dialog=false"
                            >
                              mdi-close
                            </v-icon>
                          </v-btn>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12" style="background-color:#FFC72C;padding:3px;"></v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12" style="padding-left:24px;">
                      <div style="color:#39598A;font-style:normal;font-weight:700;font-family:Inter;font-size:20px">
                          Search Facilities
                      </div>
                      </v-col>
                    </v-row>
                    <v-row >
                      <v-col cols="12" class="d-flex" style="padding-left:24px;padding-bottom:0px;">
                        <v-text-field
                          v-model="searchCriteria"
                          :disabled="loading"
                          outlined
                          required
                          dense
                          style="padding-right:3px;">
                        </v-text-field>
                        <v-btn icon style="margin-right:18px;" :disabled="loading"
                          @click="searchFacilities(searchCriteria);loading=true">
                          <v-card color="#39598A" style="margin-top:2px;padding-top:8px;padding-bottom:8px;padding-left:6px;padding-right:6px">
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
                              <span style="font-weight:600;color:#336799;font-size:16px;font-family:Inter;">{{ item.facilityName }}</span>
                              <br>
                              <span style="font-weight:600;color: #000;font-size:14px;font-family:Inter;">City: </span>{{ item.city }}
                            </td>
                            <td class="text-right">
                              <v-btn style="font-style:normal;font-weight:500;font-family:Inter;font-size:14px;padding-left:24px;padding-right:24px;"
                                color="#39598A"
                                dark
                              >
                                Select
                              </v-btn>
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
    rowSelected(facility) {
      this.toggleSelection(facility.facilityName);
      this.searchCriteria = facility.facilityName;
      this.facilityResult = this.getFacility(facility.facilityId).then(() => {
        this.facilityResult.accountNumber = facility.accountNumber;
        // Pass (as an event) the selected facilty  value to the parent component.
        this.$emit('selectedFacility', this.facilityResult);      
      });
      this.dialog = false;
      //this.$refs.searchForm.reset();
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
          this.loading = true;
          this.searchResults = [];
          this.dialog = true;
          this.searchResults = (await axios.get('/api/public/facilities?criteria={'+criteria+'}&pageindex={}')).data;
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
