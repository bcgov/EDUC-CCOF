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
                            outlined
                            required
                            dense
                            style="padding-right:3px;">
                          </v-text-field>
                          <v-btn icon style="margin-right:18px;">
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
                            v-model="selectedFacility">
                            <template v-slot:item="{ item }">
                            <tr :class="selectedFacility.indexOf(item.name)>-1?'grey':''" @click="rowSelected(item);dialog=false">
                              <td style="padding-bottom:10px;padding-top:10px;">
                                <span style="font-weight:600;color:#336799;font-size:16px;font-family:Inter;">{{ item.facilityName }}</span>
                                <br>
                                <span style="font-weight:600;color: #000;font-size:14px;font-family:Inter;">City: </span>{{ item.city }}
                              </td>
                              <td align="right">
                                <v-btn style="font-style:normal;font-weight:500;font-family:Inter;font-size:14px;padding-left:24px;padding-right:24px;"
                                  color="#39598A"
                                  dark
                                  @click="rowSelected(item);dialog=false">
                                  Select
                                </v-btn>
                              </td>
                            </tr>
                            </template>
                          </v-data-table>
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
import { eventBus } from '../main.js';

export default {
  name: 'FacilitySearch',
  props: {
    childAgeCategory: String
  },
  data() {
    return {
      searchCriteria: '',
      typeOfCare: '',
      CCFRIAppprovedParentFee: '',
      dialog: '',
      selectedFacility: [],
      searchResults: [],
      approvedFeeResults: [],
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
      this.typeOfCare = (facility.accountNumber.charAt(0) == 'F') ? 'Licensed Family' : 'Licensed Group';
      this.approvedFeeResults = this.getFacility(facility.facilityId);
      // Pass (as an event) the selected facilities tyoeOfCare value to the parent component.
      this.$emit('changeTypeOfCare', this.typeOfCare);
      this.dialog = false;
    },
    toggleSelection(keyID) {
      if (this.selectedFacility.includes(keyID)) {
        this.selectedFacility = this.selectedFacility.filter(selectedKeyID => selectedKeyID !== keyID);
      } else {
        this.selectedFacility.push(keyID);
      }
    },
    getApprovedParentFee(childAgeCategory) {
      // Iterate thorugh the payload returned from getFacility to determine the next
      // months approved fee baed on the type of child care selected.
      for (let i in this.approvedFeeResults.approvedFeesByChildAgeCategory) {
        if (this.approvedFeeResults.approvedFeesByChildAgeCategory[i].childCareCategory == childAgeCategory) {
          // Set the approved parent fee by determining the next calendar month (as a numeric value)
          // and match it with the payloads equivalent months approved fee.
          const nextMonth = new Date().getMonth() + 2;
          switch (nextMonth) {
          case 1:
            this.CCFRIAppprovedParentFee = this.approvedFeeResults.approvedFeesByChildAgeCategory[i].approvedFeeJan;
            break;
          case 2:
            this.CCFRIAppprovedParentFee = this.approvedFeeResults.approvedFeesByChildAgeCategory[i].approvedFeeFeb;
            break;
          case 3:
            this.CCFRIAppprovedParentFee = this.approvedFeeResults.approvedFeesByChildAgeCategory[i].approvedFeeMar;
            break;
          case 4:
            this.CCFRIAppprovedParentFee = this.approvedFeeResults.approvedFeesByChildAgeCategory[i].approvedFeeApr;
            break;
          case 5:
            this.CCFRIAppprovedParentFee = this.approvedFeeResults.approvedFeesByChildAgeCategory[i].approvedFeeMay;
            break;
          case 6:
            this.CCFRIAppprovedParentFee = this.approvedFeeResults.approvedFeesByChildAgeCategory[i].approvedFeeJun;
            break;
          case 7:
            this.CCFRIAppprovedParentFee = this.approvedFeeResults.approvedFeesByChildAgeCategory[i].approvedFeeJul;
            break;
          case 8:
            this.CCFRIAppprovedParentFee = this.approvedFeeResults.approvedFeesByChildAgeCategory[i].approvedFeeAug;
            break;
          case 9:
            this.CCFRIAppprovedParentFee = this.approvedFeeResults.approvedFeesByChildAgeCategory[i].approvedFeeSep;
            break;
          case 10:
            this.CCFRIAppprovedParentFee = this.approvedFeeResults.approvedFeesByChildAgeCategory[i].approvedFeeOct;
            break;
          case 11:
            this.CCFRIAppprovedParentFee = this.approvedFeeResults.approvedFeesByChildAgeCategory[i].approvedFeeNov;
            break;
          case 12:
            this.CCFRIAppprovedParentFee = this.approvedFeeResults.approvedFeesByChildAgeCategory[i].approvedFeeDec;
            break;
          }
        }
      }
      // Pass (as an event) the selected facilities approvedFee to the parent component.
      this.$emit('changeApprovedFee', this.CCFRIAppprovedParentFee);
    },
    async searchFacilities (criteria) {
      try {
        if (this.$refs.searchForm.validate()) {
          this.searchResults = (await axios.get('/api/public/facilities?criteria={'+criteria+'}&pageindex={}')).data;
          this.dialog = true;
        } 
      } catch (error) {
        console.info(error);
      }
    },
    async getFacility (id) {
      try {
        this.approvedFeeResults = (await axios.get('/api/public/facility/'+id)).data;
        console.info('approvedFeeResults = '+this.approvedFeeResults);
      } catch (error) {
        console.info(error);
      }
    }
  },
  created() {
    // Sets up the Event Bus listener using 
    // the custom event name and assosciates
    // it with a component method.
    eventBus.$on('getApprovedParentFee', this.getApprovedParentFee);
  },
  destroyed() {
    // Removes Event Bus listener upon removal
    // of template from DOM.
    eventBus.$off('getApprovedParentFee', this.getApprovedParentFee);
  }
};
</script>
