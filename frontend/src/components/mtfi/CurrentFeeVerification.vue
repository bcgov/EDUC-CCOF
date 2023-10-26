<template>
  <v-container>

    <div class="row pt-4 justify-center">
      <span class="text-h5">Child Care Operating Funding Program - Request a Parent Fee Increase</span>
    </div>
    <br>
    <div class="row pt-4 justify-center">
      <span class="text-h5">Child Care Fee Reduction Initiative (CCFRI)</span>
    </div>
    <br>
    <div class="row pt-4 justify-center">
      <span class="text-h5">Facility Name: {{ currentFacility?.facilityName }}</span>
    </div>
    <div class="row pt-4 justify-center">
      <span class="text-h5">Licence Number: {{ currentFacility?.licenseNumber }}</span>
    </div>


    <br><br>
    <div class="row pt-4 justify-center">
      <span class="text-h6">Our records show this facility's approved parent fees are as follows:</span>
    </div>
    <v-form ref="isValidForm" value="false" v-model="isValidForm">
      <div v-if="loading">
        <v-skeleton-loader max-height="475px"  :loading="loading" type="image, image"></v-skeleton-loader>
        <br><br>
        <v-skeleton-loader max-height="475px"  :loading="loading" type="image, image"></v-skeleton-loader>
      </div>

      <div v-else-if="currentPcfCcfri.childCareTypes?.length > 0">
        <div v-for="(item , index) in currentPcfCcfri.childCareTypes" :key="index">
            <v-card

            elevation="6" class="px-0 py-0 mx-auto my-10 rounded-lg col-12 "
                min-height="230"
                rounded
                tiled
                exact
                tile
                :ripple="false"
              >
                <v-card-text class="pa-0" >
                  <div class="pa-2 pa-md-4 ma-0 backG">
                    <p class="text-h5 text--primary px-5 py-0 my-0">
                      Parent Fees {{item.programYear}}: Full-Time {{item.childCareCategory}}
                    </p>
                  </div>
                  <div class="px-md-12 px-7">
                    <br>

                    <v-row class="d-flex" v-if="arePrevFeesCorrect()">

                      <v-col cols="6">
                        <v-select label="Parent fee frequency: "
                        v-model="CCFRIFacilityModel.childCareTypes[index].feeFrequency"
                        :items="feeChoices"
                        class="cols-4 justify-space-around"
                        outlined
                        @change="clearFees(index)"
                        :disabled="isReadOnly"
                      >
                        <option v-for="item in feeChoices" :key="item" :value="item" >
                          {{ item }}
                        </option>
                      </v-select>
                      </v-col>

                      <v-col v-if="!isReadOnly" cols="1" style="padding-bottom:0px;padding-top:16px;padding-left:60px">
                        <v-tooltip top color="#003366">
                          <template v-slot:activator="{ on, attrs }" style="color: #313131">
                          <v-card v-on="on" style="background-color: #003366 !important" class="tooltip">
                            <v-icon class="pt-1" small style="color: #ffffff !important;">mdi-help</v-icon>
                          </v-card>
                        </template>
                          <span v-if="isButtonActive(index) " v-html="'This automatically fills the new parent fees fields with the current approved fee values. This will replace any data entered for this care category.'"/>
                          <span v-else v-html="'Enter your new parent fees for all months. Current parent fee values will not change. \n Note: Auto-fill is not available if you change the parent fee frequency'"/>
                        </v-tooltip>
                      </v-col>

                      <v-col cols="3">
                        <v-btn v-if="!isReadOnly" class="blueButton mb-10" @click="copyFees(index)" :disabled="!isButtonActive(index)">Auto-fill approved parent fees</v-btn>
                      </v-col>
                      <v-col cols="2">
                        <v-btn v-if="!isReadOnly" class=" mb-10" @click="clearFees(index)" :disabled="!isButtonActive(index)">Clear parent fees</v-btn>
                      </v-col>



                    </v-row>

                    <v-container class="ma-0 pa-0 gridContainer">

                      <div class=" feeTitle">
                        <span >Current Fees: </span>
                      </div>

                      <div class="feeTitle ">
                        <span >April:</span>
                        <v-text-field tabindex="-1" class="" dense flat solo hide-details readonly type="number" :disabled="false"  :rules="feeRules"
                          v-model.number="item.approvedFeeApr" @input="convertBlankNumberToNull(item,'approvedFeeApr')" prefix="$"/>
                          <v-divider class="border-opacity-100" vertical></v-divider>
                      </div>

                      <div class="feeTitle">
                        <span class=" ">May:</span>
                        <v-text-field  tabindex="-1" class="" type="number" dense flat solo hide-details readonly @wheel="$event.target.blur()" :disabled="false" :rules="feeRules"
                          v-model.number="item.approvedFeeMay" @input="convertBlankNumberToNull(item,'approvedFeeMay')" label="May" prefix="$"/>
                          <v-divider class="border-opacity-100" vertical></v-divider>
                      </div>

                      <div class="feeTitle">
                        <span class="">June:</span>
                        <v-text-field tabindex="-1" type="number" dense flat solo hide-details readonly @wheel="$event.target.blur()" :disabled="false" :rules="feeRules"
                          v-model.number="item.approvedFeeJun" @input="convertBlankNumberToNull(item,'approvedFeeJun')" label="June" prefix="$"/>
                          <v-divider class="border-opacity-100" vertical></v-divider>
                      </div>

                      <div class="feeTitle">
                      <span class="">July:</span>
                        <v-text-field tabindex="-1" type="number" dense flat solo hide-details readonly @wheel="$event.target.blur()" :disabled="false" :rules="feeRules"
                          v-model.number="item.approvedFeeJul" @input="convertBlankNumberToNull(item,'approvedFeeJul')" label="July" prefix="$"/>
                          <v-divider class="border-opacity-100" vertical></v-divider>
                      </div>

                      <div class="feeTitle">
                        <span class=" ">Aug:</span>
                        <v-text-field tabindex="-1" type="number" dense flat solo hide-details readonly @wheel="$event.target.blur()" :disabled="false"  :rules="feeRules"
                          v-model.number="item.approvedFeeAug" @input="convertBlankNumberToNull(item,'approvedFeeAug')" label="August" prefix="$" />
                          <v-divider class="border-opacity-100" vertical></v-divider>
                      </div>

                      <div class="feeTitle">
                        <span class="">Sept:</span>
                        <v-text-field tabindex="-1" type="number" dense flat solo hide-details readonly @wheel="$event.target.blur()" :disabled="false"  :rules="feeRules"
                          v-model.number="item.approvedFeeSep" @input="convertBlankNumberToNull(item,'approvedFeeSep')" label="September" prefix="$" />
                          <v-divider class="border-opacity-100" vertical></v-divider>
                      </div>

                      <!-- End Row One of Grid-->

                      <div class=" feeTitleInput" v-if="CCFRIFacilityModel.existingFeesCorrect == '100000000'">
                        <span >New Parent Fees: </span>
                      </div>



                      <div class="inputBoxWrapper ">
                        <v-text-field v-if="isInputVisible(index)" class="" type="number" @wheel="$event.target.blur()" :disabled="isReadOnly" outlined :rules="feeRules"
                        v-model.number="CCFRIFacilityModel.childCareTypes[index].approvedFeeApr" @input="convertBlankNumberToNull(item,'approvedFeeApr')" label="" prefix="$"/>

                      </div>

                      <div class="inputBoxWrapper ">
                        <v-text-field  v-if="isInputVisible(index)" type="number" @wheel="$event.target.blur()" :disabled="isReadOnly" outlined :rules="feeRules"
                        v-model.number="CCFRIFacilityModel.childCareTypes[index].approvedFeeMay" @input="convertBlankNumberToNull(item,'approvedFeeApr')" label="" prefix="$"/>

                      </div>

                      <div class="inputBoxWrapper ">
                        <v-text-field  v-if="isInputVisible(index)" type="number" @wheel="$event.target.blur()" :disabled="isReadOnly" outlined :rules="feeRules"
                        v-model.number="CCFRIFacilityModel.childCareTypes[index].approvedFeeJun" @input="convertBlankNumberToNull(item,'approvedFeeApr')" label="" prefix="$"/>

                      </div>

                      <div class="inputBoxWrapper ">
                        <v-text-field v-if="isInputVisible(index)" type="number" @wheel="$event.target.blur()" :disabled="isReadOnly" outlined :rules="feeRules"
                        v-model.number="CCFRIFacilityModel.childCareTypes[index].approvedFeeJul" @input="convertBlankNumberToNull(item,'approvedFeeApr')" label="" prefix="$"/>

                      </div>

                      <div class="inputBoxWrapper ">
                        <v-text-field v-if="isInputVisible(index)" type="number" @wheel="$event.target.blur()" :disabled="isReadOnly" outlined :rules="feeRules"
                        v-model.number="CCFRIFacilityModel.childCareTypes[index].approvedFeeAug" @input="convertBlankNumberToNull(item,'approvedFeeApr')" label="" prefix="$"/>

                      </div>

                      <div class="inputBoxWrapper ">
                        <v-text-field v-if="isInputVisible(index)" type="number" @wheel="$event.target.blur()" :disabled="isReadOnly" outlined :rules="feeRules"
                        v-model.number="CCFRIFacilityModel.childCareTypes[index].approvedFeeSep" @input="convertBlankNumberToNull(item,'approvedFeeApr')" label="" prefix="$"/>

                      </div>

                      <!-- End Row Two of Grid-->
                    </v-container>
                    <br>
                    <br>

                    <v-container class="ma-0 pa-0 gridContainer">

                      <div class=" feeTitle">
                        <span >Current Fees: </span>
                      </div>

                      <div class="feeTitle ">
                        <span >Oct:</span>
                        <v-text-field tabindex="-1" class="" dense flat solo hide-details readonly type="number" :disabled="false"  :rules="feeRules"
                          v-model.number="item.approvedFeeOct" @input="convertBlankNumberToNull(item,'approvedFeeApr')" prefix="$"/>
                          <v-divider class="border-opacity-100" vertical></v-divider>
                      </div>

                      <div class="feeTitle">
                        <span class=" ">Nov:</span>
                        <v-text-field  tabindex="-1" class="" type="number" dense flat solo hide-details readonly @wheel="$event.target.blur()" :disabled="false" :rules="feeRules"
                          v-model.number="item.approvedFeeNov" @input="convertBlankNumberToNull(item,'approvedFeeMay')" label="May" prefix="$"/>
                          <v-divider class="border-opacity-100" vertical></v-divider>
                      </div>

                      <div class="feeTitle">
                        <span class="">Dec:</span>
                        <v-text-field tabindex="-1" type="number" dense flat solo hide-details readonly @wheel="$event.target.blur()" :disabled="false" :rules="feeRules"
                          v-model.number="item.approvedFeeDec" @input="convertBlankNumberToNull(item,'approvedFeeJun')" label="June" prefix="$"/>
                          <v-divider class="border-opacity-100" vertical></v-divider>
                      </div>

                      <div class="feeTitle">
                      <span class="">Jan:</span>
                        <v-text-field tabindex="-1" type="number" dense flat solo hide-details readonly @wheel="$event.target.blur()" :disabled="false" :rules="feeRules"
                          v-model.number="item.approvedFeeJan" @input="convertBlankNumberToNull(item,'approvedFeeJul')" label="July" prefix="$"/>
                          <v-divider class="border-opacity-100" vertical></v-divider>
                      </div>

                      <div class="feeTitle">
                        <span class=" ">Feb:</span>
                        <v-text-field tabindex="-1" type="number" dense flat solo hide-details readonly @wheel="$event.target.blur()" :disabled="false"  :rules="feeRules"
                          v-model.number="item.approvedFeeFeb" @input="convertBlankNumberToNull(item,'approvedFeeAug')" label="August" prefix="$" />
                          <v-divider class="border-opacity-100" vertical></v-divider>
                      </div>

                      <div class="feeTitle">
                        <span class="">Mar:</span>
                        <v-text-field tabindex="-1" type="number" dense flat solo hide-details readonly @wheel="$event.target.blur()" :disabled="false"  :rules="feeRules"
                          v-model.number="item.approvedFeeMar" @input="convertBlankNumberToNull(item,'approvedFeeSep')" label="September" prefix="$" />
                          <v-divider class="border-opacity-100" vertical></v-divider>
                      </div>

                      <!-- End Row One of Grid-->

                      <div class=" feeTitleInput" v-if="CCFRIFacilityModel.existingFeesCorrect == '100000000'">
                        <span >New Parent Fees: </span>
                      </div>

                      <div class="inputBoxWrapper ">
                        <v-text-field v-if="isInputVisible(index)" type="number" @wheel="$event.target.blur()" :disabled="isReadOnly" outlined :rules="feeRules"
                        v-model.number="CCFRIFacilityModel.childCareTypes[index].approvedFeeOct" @input="convertBlankNumberToNull(item,'approvedFeeApr')" label="" prefix="$"/>

                      </div>

                      <div class="inputBoxWrapper ">
                        <v-text-field v-if="isInputVisible(index)" type="number" @wheel="$event.target.blur()" :disabled="isReadOnly" outlined :rules="feeRules"
                        v-model.number="CCFRIFacilityModel.childCareTypes[index].approvedFeeNov" @input="convertBlankNumberToNull(item,'approvedFeeApr')" label="" prefix="$"/>

                      </div>

                      <div class="inputBoxWrapper ">
                        <v-text-field v-if="isInputVisible(index)" type="number" @wheel="$event.target.blur()" :disabled="isReadOnly" outlined :rules="feeRules"
                        v-model.number="CCFRIFacilityModel.childCareTypes[index].approvedFeeDec" @input="convertBlankNumberToNull(item,'approvedFeeApr')" label="" prefix="$"/>

                      </div>

                      <div class="inputBoxWrapper ">
                        <v-text-field v-if="isInputVisible(index)" type="number" @wheel="$event.target.blur()" :disabled="isReadOnly" outlined :rules="feeRules"
                        v-model.number="CCFRIFacilityModel.childCareTypes[index].approvedFeeJan" @input="convertBlankNumberToNull(item,'approvedFeeApr')" label="" prefix="$"/>

                      </div>

                      <div class="inputBoxWrapper ">
                        <v-text-field v-if="isInputVisible(index)" type="number" @wheel="$event.target.blur()" :disabled="isReadOnly" outlined :rules="feeRules"
                        v-model.number="CCFRIFacilityModel.childCareTypes[index].approvedFeeFeb" @input="convertBlankNumberToNull(item,'approvedFeeApr')" label="" prefix="$"/>

                      </div>

                      <div class="inputBoxWrapper ">
                        <v-text-field v-if="isInputVisible(index)" type="number" @wheel="$event.target.blur()" :disabled="isReadOnly" outlined :rules="feeRules"
                        v-model.number="CCFRIFacilityModel.childCareTypes[index].approvedFeeMar" @input="convertBlankNumberToNull(item,'approvedFeeApr')" label="" prefix="$"/>

                      </div>

                      <!-- End Row Two of Grid-->
                      <br>
                    </v-container>

                  </div>
                </v-card-text>
            </v-card>

            <v-card  v-if="arePrevFeesCorrect()" elevation="6" class="px-0 py-0 mx-auto my-10 rounded-lg col-12 "
              min-height="230"
              rounded
              tiled
              exact
              tile
              :ripple="false"
            >
              <v-card-text class="pa-0" >
                <div class="pa-2 pa-md-4 ma-0 backG">
                  <p class="text-h5 text--primary px-5 py-0 my-0">
                    Do you charge parent fees at this facility for any closures on business days?
                  </p>
                </div>
                <div class="px-md-12 px-7">
                  <br>
                  <div>
                    <p>Do you charge parent fees at this facility for any closures on business days? Indicate the facility closures on business days within the current fiscal year other than <a href="https://www2.gov.bc.ca/gov/content/employment-business/employment-standards-advice/employment-standards/statutory-holidays"> British Columbia Statutory Holidays. </a> Only indicate the date of closures where parent fees are charged.
                    </p>
                  </div>
                  <v-radio-group
                    required
                    :disabled="isReadOnly || previousClosureDates.dates.length > 0"
                    v-model="CCFRIFacilityModel.hasClosureFees"
                    :rules = "rules"
                  >
                  <br>
                    <v-radio
                      label="Yes"
                      :value="100000000"
                    ></v-radio>
                    <v-radio
                      label="No"
                      :value="100000001"
                    ></v-radio>
                  </v-radio-group>


                  <v-row v-if = "closureFees == 'Yes' || CCFRIFacilityModel.hasClosureFees == 100000000 ">
                    <!-- below will let user view, but not change closure dates from CCFRI application-->
                    <!-- index is i + 1000 to avoid collisions with the keys being used in CCFRIFacilityModel.dates-->
                    <v-row  v-for="(obj, index) in previousClosureDates.dates" :key="(index + 1000)" color='black'>
                      <v-col color='#003366' class="col-md-1 col-12 mx-0">
                        <v-icon
                          :disabled="true"
                          large
                          color="blue darken-4"
                          > mdi-close
                        </v-icon>
                      </v-col>

                      <v-col class="col-md-3 col-12">
                          <v-text-field  :disabled="true"
                          outlined
                          :rules="rules"
                          v-model="obj.formattedStartDate"
                          label="Start Date (YYYY-MM-DD)"
                          readonly
                          >

                          </v-text-field>
                      </v-col>

                      <v-col class="col-md-3 col-12">
                          <v-text-field :disabled="true"
                          outlined
                          required
                          v-model="obj.formattedEndDate"
                          label="End Date (YYYY-MM-DD)"
                          readonly
                          >
                          </v-text-field>
                      </v-col>

                      <v-col class="col-md-3 col-12 ">
                        <v-text-field
                        :disabled="true"
                          v-model="obj.closureReason"
                          label="Closure Reason"
                          outlined
                          :rules="rules"
                          color="red"
                        ></v-text-field>
                      </v-col>

                      <v-col class="col-md-2 col-12 mt-n10">
                        <v-radio-group
                          :disabled="true"
                          row
                          v-model="obj.feesPaidWhileClosed"
                          label="Did parents pay for this closure?"
                          :rules="dateRules"
                        >
                          <v-radio
                            label="Yes"
                            :value = 1
                          ></v-radio>
                          <v-radio
                            label="No"
                            :value= 0
                          ></v-radio>
                        </v-radio-group>
                      </v-col>

                      <span class="white--text"> . </span>

                      <v-divider></v-divider>
                    </v-row> <!-- end v for-->
                    <br><br>


                    <!-- below will let user enter new dates-->
                    <v-row  v-for="(obj, index) in CCFRIFacilityModel.dates" :key="index" color='#003366'>

                      <v-col color='#003366' class="col-md-1 col-12 mx-0">
                        <v-icon
                          :disabled="isReadOnly"
                          large
                          color="blue darken-4"
                          class=""
                          @click="removeIndex(index)"
                          > mdi-close
                        </v-icon>
                      </v-col>


                      <v-col class="col-md-3 col-12">
                        <v-menu  v-model="obj.calendarMenu1" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="auto">
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field  :disabled="isReadOnly"
                          outlined
                          :rules="rules"
                          v-model="obj.formattedStartDate"
                            label="Select Start Date (YYYY-MM-DD)"
                            readonly v-bind="attrs"
                            v-on="on">

                          </v-text-field>
                        </template>
                          <v-date-picker
                            :allowed-dates="allowedDates"
                            clearable
                            v-model="obj.formattedStartDate"
                            @input="obj.calendarMenu1 = false">

                          </v-date-picker>
                      </v-menu>
                      </v-col>

                      <v-col class="col-md-3 col-12">
                        <v-menu  v-model="obj.calendarMenu2"
                        :close-on-content-click="false"
                        :nudge-right="40" transition="scale-transition"
                        offset-y min-width="auto">
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field :disabled="isReadOnly"
                          outlined
                          required
                          v-model="obj.formattedEndDate"
                          label="Select End Date (YYYY-MM-DD)"
                          readonly
                          :rules="rules"
                          v-bind="attrs" v-on="on">
                          </v-text-field>
                        </template>
                          <v-date-picker
                            clearable
                            :min="obj.formattedStartDate"
                            v-model="obj.formattedEndDate"
                            @input="obj.calendarMenu2 = false"
                            :allowed-dates="allowedDates"
                            @click:date="isDateLegal(obj)"

                            >

                          </v-date-picker>
                      </v-menu>
                      </v-col>

                      <v-col class="col-md-3 col-12 ">
                        <v-text-field
                        :disabled="isReadOnly"
                          v-model="obj.closureReason"
                          label="Closure Reason"
                          outlined
                          clearable
                          :rules="rules"
                          color="red"
                        ></v-text-field>
                      </v-col>

                      <v-col class="col-md-2 col-12 mt-n10">
                        <v-radio-group
                          :disabled="isReadOnly"
                          row
                          v-model="obj.feesPaidWhileClosed"
                          label="Did parents pay for this closure?"
                          :rules="dateRules"

                        >
                          <v-radio
                            label="Yes"
                            :value = 1
                          ></v-radio>
                          <v-radio
                            label="No"
                            :value= 0
                          ></v-radio>
                        </v-radio-group>
                      </v-col>

                      <span class="white--text"> . </span>
                      <v-row v-if="obj.isIllegal">

                        <v-card width="100%" class="mx-3 my-10" >
                  <v-row>
                    <v-col class="py-0">
                      <v-card-title class="py-1 noticeAlert">
                        <span style="float:left">
                      <v-icon
                        x-large
                        class="py-1 px-3 noticeAlertIcon">
                        mdi-alert-octagon
                      </v-icon>
                      </span>
                      Invalid Dates
                      </v-card-title>
                    </v-col>
                  </v-row>
                  <v-card-text>
                    It appears that the closure start and end dates you've selected for this facility overlap with dates you've previously selected. Please review your existing Facility closure dates to ensure consistency and avoid any potential overlap of Facility closure dates.<br><br>
                    <br>


                  </v-card-text>
                </v-card>
              </v-row>

                      <v-divider></v-divider>
                    </v-row> <!-- end v for-->
                    <br><br>

                      <v-container>
                        <v-row>
                      <v-btn
                        @click="addRow()"
                        class="my-5" dark color='#003366'
                        :disabled="isReadOnly"
                        >ADD NEW CLOSURE</v-btn>
                        </v-row>
                      </v-container>
                      <br>

                  </v-row>
                </div>
              </v-card-text>
            </v-card>

        </div>

        <v-card elevation="6" class="pa-4 mx-auto my-10 rounded-lg col-12 "
              min-height="230"
              rounded
              tiled
              exact
              tile
              :ripple="false"
              >
                <v-card-text>
                  <p class="text-h6 text--primary">
                    Are these fees listed above correct for this facility?
                  </p>
                  <br>
                  <v-radio-group
                  :rules = "rules"
                    row
                    v-model="CCFRIFacilityModel.existingFeesCorrect"
                    :disabled="isReadOnly"
                  >
                    <v-radio
                      label="Yes"
                      value="100000000"
                    ></v-radio>
                    <v-radio
                      label="No"
                      value=100000001
                    ></v-radio>
                  </v-radio-group>
                </v-card-text>
             </v-card>
      </div>
      <div v-else>
        <div class="row pt-4 justify-center pb-3">
          <span class="text-h6">No Approved Parent fees have been found for this facility.</span>
          <span class="text-h6">Please go back to 'Select Facility' and remove this Facility from your selection.</span>

        </div>
      </div>

      <v-dialog v-model="areFeesCorrect" persistent max-width="600px">
        <v-card>
          <v-container class="pt-0">
            <v-row>
              <v-col cols="10" class="py-0 pl-0" style="background-color:#234075;">
                <v-card-title class="white--text font-weight-bold">Incorrect values shown for current fees</v-card-title>
              </v-col>
              <v-col cols="2" class="d-flex justify-end" style="background-color:#234075;">
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" style="background-color:#FFC72C;padding:2px;"></v-col>
            </v-row>
            <v-row class="pa-6">
              <p>If the parent fees shown do not match the current fees, call the Child Care Operating Fund Program at <a
                  href="tel:+18883386622" class="text-decoration-underline">1 888 338-6622 (Option 2)</a>.</p>
            </v-row>
            <v-row class="d-flex justify-right">
              <v-btn dark color="primary" :loading="processing" @click="cancel()">Close</v-btn>
            </v-row>
          </v-container>
        </v-card>
      </v-dialog>


    </v-form>



      <NavButton :isNextDisplayed="true" :isSaveDisplayed="true"
        :isSaveDisabled="isReadOnly || loading || hasIllegalDates()" :isNextDisabled="!isValidForm || hasIllegalDates()" :isProcessing="processing"
        @previous="previous" @next="next" @validateForm="validateForm()" @save="save(true)"></NavButton>

      <v-dialog
        v-model="showRfiDialog"
        persistent
        max-width="700px">
      <v-card>
        <v-container class="pt-0">
          <v-row>
            <v-col cols="7" class="py-0 pl-0" style="background-color:#234075;">
              <v-card-title class="white--text">Request for Information</v-card-title>
            </v-col>
            <v-col cols="5" class="d-flex justify-end" style="background-color:#234075;">
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" style="background-color:#FFC72C;padding:2px;"></v-col>
          </v-row>
          <v-row>
            <v-col cols="12" style="text-align: center;">
              <p class="pt-4">You have entered a parent fee above the {{formattedProgramYear}} parent fee increase limit for the following care categories:<br><br>
                <span v-for="item in rfi3percentCategories" :key="item">{{item}}<br></span>
              </p>
              <p>Parent fee increases over the limit will be assessed under the Parent Fee Increase Exceptions policy in the {{formattedProgramYear}} <a href="https://www2.gov.bc.ca/assets/download/3013BFFE26E24901A2EE764FC17FD05E" target="_blank">Funding Guidelines</a>. You can continue to the Request for Information section or press back to update your fees.</p>
              <p class="pt-4">Please confirm you have provided your highest full-time (i.e. over 4 hours, 5 days a week) parent fee for each care category before CCFRI is applied. Submit your daily parent fee if you only offer care for 4 days or fewer per week.</p>
              <v-btn dark color="secondary" class="mr-10" @click="closeDialog()">Back</v-btn>
              <v-btn dark color="primary" @click="toRfi()">Continue</v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script>



import { mapState, mapActions, mapGetters, mapMutations} from 'vuex';
import { PATHS, changeUrlGuid, CHANGE_TYPES, changeUrl, ApiRoutes } from '@/utils/constants';
import alertMixin from '@/mixins/alertMixin';
import globalMixin from '@/mixins/globalMixin';
import NavButton from '@/components/util/NavButton';
import { deepCloneObject } from '../../utils/common';
import { isEqual } from 'lodash';
import ApiService from '@/common/apiService';

function dateFunction (date1, date2){

  const startDate = new Date(date1);
  const endDate = new Date (date2);

  let dates = [];

  let currentDate = new Date(startDate.getTime());

  while (currentDate <= endDate) {
    console.log();
    dates.push(currentDate.toISOString().substring(0,10));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}

let model = { };

export default {
  name: 'MTFI-Fees',
  mixins: [alertMixin, globalMixin],
  data() {
    return {
      showRfiDialog: false,
      rfi3percentCategories: [],
      feeChoices: ['Daily', 'Monthly'],
      dialog: false,
      currentFacility: undefined,
      currentPcfCcfri: undefined,
      isUnlocked: false,
      model,
      //isReadOnly: false,
      isValidForm: false,
      processing: false,
      loading: false,
      rules: [
        (v) => !!v  || 'Required.',
      ],
      feeRules: [
        (v) => !isNaN(parseFloat(v))  || 'Must be a number',
        (v)  => v <=  9999|| 'Max fee is $9999.00',
        (v) => v >= 0  || 'Input a positve number',
      ],
      dateRules: [
        v => (typeof v === 'number') || 'Required.',
      ],
      dateObj: {
        datePicker1: undefined,
        datePicker2: undefined,
        closureReason : '',
        feesPaidWhileClosed: undefined,
      },
      closureFees: 'No',
      chosenDates: [],

    };
  },
  computed: {
    ...mapState('ccfriApp', ['CCFRIFacilityModel', 'ccfriChildCareTypes', 'loadedModel', 'ccfriId', 'previousClosureDates']),
    ...mapGetters('ccfriApp', ['getCCFRIById']),
    ...mapState('organization', ['organizationProviderType']),
    ...mapState('application', ['applicationStatus',  'formattedProgramYear', 'programYearId', 'applicationId']),
    ...mapState('app', ['programYearList']),
    ...mapState('application', ['programYearId', 'isRenewal']),
    ...mapState('navBar', ['navBarList', 'userProfileList', 'changeRequestMap']),
    ...mapGetters('navBar', ['previousPath', 'nextPath','getNavByCCFRIId']),
    ...mapGetters('reportChanges',['changeRequestStatus']),
    areFeesCorrect() {
      return this.CCFRIFacilityModel.existingFeesCorrect == '100000001' ? true : false;
    },
    getCurrentFacility(){
      return this.getNavByCCFRIId(this.$route.params.urlGuid);
    },
    isReadOnly(){
      if(!this.changeRequestStatus||this.getCurrentFacility.unlockCcfri){
        return false;
      }
      if(this.changeRequestStatus!=='INCOMPLETE'){
        return true;
      }
      return false;
    }
  },
  watch: {
    //get facilityID from here and then set it !
    '$route.params.urlGuid': {
      async handler() {
        try {
          this.loading = true;
          let fac = this.navBarList?.find(el => el.ccfriApplicationId == this.$route.params.urlGuid); //find the facility in navBar so we can look up the old CCFRI ID in userProfile
          this.currentFacility = this.userProfileList?.find(el => el.facilityId == fac.facilityId); //facility from userProfile with old CCFRI
          console.log('current FAC', this.currentFacility);
          const test = this.getClosureDates(this.currentFacility.ccfriApplicationId);
          console.log(test);
          this.currentPcfCcfri = await this.getPreviousApprovedFees({facilityId: this.currentFacility.facilityId, programYearId: this.programYearId});
          console.log('hey');
          console.log(this.currentPcfCcfri);
          this.currentPcfCcfri.childCareTypes = this.currentPcfCcfri.childCareTypes.filter(el => el.programYearId == this.programYearId); //filter so only current fiscal years appear
          this.currentPcfCcfri.ccfriApplicationId = this.$route.params.urlGuid;
          await this.loadCCFRIFacility(this.$route.params.urlGuid);
          await this.loadCCFisCCRIMedian(); //load the CCFRI median of the existing PCf (old) CCFRI
          await this.decorateWithCareTypes(this.CCFRIFacilityModel.facilityId);


          let arr = [];

          //sort the child care types so they match the cards of the old CCFRI fees
          for (const childCareType of this.currentPcfCcfri.childCareTypes){
            let careCategory = this.CCFRIFacilityModel.childCareTypes.find(el => el.childCareCategoryId == childCareType.childCareCategoryId && el.programYearId == this.programYearId);
            //if this is the first time, the new CCFRI will not have any fees yet. Assign to 0 so they can be filled in and saved
            if (!careCategory.feeFrequency){
              let fees = {
                approvedFeeApr: null,
                approvedFeeAug: null,
                approvedFeeDec: null,
                approvedFeeFeb: null,
                approvedFeeJan: null,
                approvedFeeJul: null,
                approvedFeeJun: null,
                approvedFeeMar: null,
                approvedFeeMay: null,
                approvedFeeNov: null,
                approvedFeeOct: null,
                approvedFeeSep: null,
                feeFrequency: childCareType.feeFrequency, //per the requirements, set the fee frequency to whatever was selected on the PCF
              };
              careCategory = {...careCategory, ...fees};

            }
            arr.push(careCategory);
          }
          //convert the number to a string so the radio buttons work properly
          if(this.CCFRIFacilityModel.existingFeesCorrect){
            this.CCFRIFacilityModel.existingFeesCorrect = this.CCFRIFacilityModel.existingFeesCorrect.toString();
          }

          this.CCFRIFacilityModel.childCareTypes = arr;

          console.log(this.previousClosureDates.dates.length);

          //if this facility has closure fees on their PCF- make sure they are visible and included on the MTFI
          //rules surronding overlapping dates still apply.
          if (this.previousClosureDates.dates.length > 0){
            this.CCFRIFacilityModel.hasClosureFees = 100000000;
            //this.chosenDates = [...this.CCFRIFacilityModel.dates , ...this.previousClosureDates.dates];
          }
          else {
            //.chosenDates = this.CCFRIFacilityModel.dates;
          }

          this.updateChosenDates();

          console.log('combined dates: ');
          console.log(this.chosenDates);

          this.loading = false;


        } catch (error) {
          console.log(error);

          this.setFailureAlert('An error occured while getting.');

        }
      },
      immediate: true,
      deep: true
    }
  },
  beforeMount: function() {

  },
  methods: {
    ...mapActions('ccfriApp', ['saveCcfri', 'loadCCFRIFacility', 'getPreviousApprovedFees', 'decorateWithCareTypes', 'getCcfriOver3percent', 'loadCCFisCCRIMedian', 'getClosureDates' ]),
    ...mapActions('reportChanges', ['updateChangeRequestMTFI']),
    ...mapMutations('ccfriApp', ['setLoadedModel', 'setCCFRIFacilityModel']),
    ...mapMutations('navBar',['setNavBarCCFRIComplete','setNavBarValue']),
    addRow () {
      this.updateChosenDates();
      this.CCFRIFacilityModel.dates.push(Object.assign({}, this.dateObj));
    },
    removeIndex(index){
      this.CCFRIFacilityModel.dates.splice(index, 1);
      this.updateChosenDates();
    },
    allowedDates(val){
      return !this.chosenDates.includes(val);
    },
    updateChosenDates(){
      this.chosenDates = [];
      this.CCFRIFacilityModel.dates.forEach(dateObj => {
        this.chosenDates = this.chosenDates + dateFunction(dateObj.formattedStartDate, dateObj.formattedEndDate);
      });

      if (this.previousClosureDates.dates.length > 0){
        this.previousClosureDates.dates.forEach(dateObj => {
          this.chosenDates = this.chosenDates + dateFunction(dateObj.formattedStartDate, dateObj.formattedEndDate);
        });
      }

      console.log('chosen dates look like: ');
      console.log(this.chosenDates);
    },
    isDateLegal(obj){
      let dates = dateFunction(obj.formattedStartDate, obj.formattedEndDate);
      obj.isIllegal = false;

      dates.forEach(date => {
        if (this.chosenDates.includes(date)){
          obj.isIllegal = true;
        }
      });
    },
    hasIllegalDates(){
      return this.CCFRIFacilityModel?.dates?.some(el => el.isIllegal);
    },
    cancel() {
      this.dialog = false;
      this.CCFRIFacilityModel.existingFeesCorrect = null;
    },
    closeDialog() {
      this.showRfiDialog = false;
    },
    clearFees(index){
      this.CCFRIFacilityModel.childCareTypes[index].approvedFeeApr = 0;
      this.CCFRIFacilityModel.childCareTypes[index].approvedFeeMay = 0;
      this.CCFRIFacilityModel.childCareTypes[index].approvedFeeJun = 0;
      this.CCFRIFacilityModel.childCareTypes[index].approvedFeeJul = 0;
      this.CCFRIFacilityModel.childCareTypes[index].approvedFeeAug = 0;
      this.CCFRIFacilityModel.childCareTypes[index].approvedFeeSep = 0;
      this.CCFRIFacilityModel.childCareTypes[index].approvedFeeOct = 0;
      this.CCFRIFacilityModel.childCareTypes[index].approvedFeeNov = 0;
      this.CCFRIFacilityModel.childCareTypes[index].approvedFeeDec = 0;
      this.CCFRIFacilityModel.childCareTypes[index].approvedFeeJan = 0;
      this.CCFRIFacilityModel.childCareTypes[index].approvedFeeFeb = 0;
      this.CCFRIFacilityModel.childCareTypes[index].approvedFeeMar = 0;
    },
    copyFees(index){
      this.CCFRIFacilityModel.childCareTypes[index].approvedFeeApr = this.currentPcfCcfri.childCareTypes[index].approvedFeeApr;
      this.CCFRIFacilityModel.childCareTypes[index].approvedFeeMay = this.currentPcfCcfri.childCareTypes[index].approvedFeeMay;
      this.CCFRIFacilityModel.childCareTypes[index].approvedFeeJun = this.currentPcfCcfri.childCareTypes[index].approvedFeeJun;
      this.CCFRIFacilityModel.childCareTypes[index].approvedFeeJul = this.currentPcfCcfri.childCareTypes[index].approvedFeeJul;
      this.CCFRIFacilityModel.childCareTypes[index].approvedFeeAug = this.currentPcfCcfri.childCareTypes[index].approvedFeeAug;
      this.CCFRIFacilityModel.childCareTypes[index].approvedFeeSep = this.currentPcfCcfri.childCareTypes[index].approvedFeeSep;
      this.CCFRIFacilityModel.childCareTypes[index].approvedFeeOct = this.currentPcfCcfri.childCareTypes[index].approvedFeeOct;
      this.CCFRIFacilityModel.childCareTypes[index].approvedFeeNov = this.currentPcfCcfri.childCareTypes[index].approvedFeeNov;
      this.CCFRIFacilityModel.childCareTypes[index].approvedFeeDec = this.currentPcfCcfri.childCareTypes[index].approvedFeeDec;
      this.CCFRIFacilityModel.childCareTypes[index].approvedFeeJan = this.currentPcfCcfri.childCareTypes[index].approvedFeeJan;
      this.CCFRIFacilityModel.childCareTypes[index].approvedFeeFeb = this.currentPcfCcfri.childCareTypes[index].approvedFeeFeb;
      this.CCFRIFacilityModel.childCareTypes[index].approvedFeeMar = this.currentPcfCcfri.childCareTypes[index].approvedFeeMar;
    },
    hasModelChanged(){
      return !isEqual(this.CCFRIFacilityModel, this.loadedModel);
    },
    arePrevFeesCorrect(){
      return !(!this.CCFRIFacilityModel.existingFeesCorrect  || this.CCFRIFacilityModel.existingFeesCorrect == '100000001' );
    },
    isInputVisible(index){
      if (!this.arePrevFeesCorrect()){
        return false;
      }
      else if(!this.CCFRIFacilityModel.childCareTypes[index].feeFrequency){
        return false;
      }
      return true;
    },
    isButtonActive(index){
      return this.CCFRIFacilityModel.childCareTypes[index].feeFrequency == this.currentPcfCcfri.childCareTypes[index].feeFrequency;
    },
    isFormComplete(){
      return this.isValidForm; //false makes button clickable, true disables button
    },
    getMtfiFacility(facilityId) {
      let mtfiFacility;
      const changeRequest = this.changeRequestMap?.get(this.$route.params.changeRecGuid);
      if (changeRequest?.changeActions?.length > 0) {
        const mtfiDetails = changeRequest?.changeActions[0].mtfi;
        mtfiFacility = mtfiDetails?.find(item => item.facilityId === facilityId);
      }
      return mtfiFacility;
    },
    async toRfi() {
      try {
        this.setNavBarValue({ facilityId: this.currentFacility.facilityId, property: 'hasRfi', value: true});
        if (this.getCurrentFacility.unlockCcfri) {
          this.setNavBarValue({ facilityId: this.currentFacility.facilityId, property: 'unlockRfi', value: true});
          const mtfiFacility = this.getMtfiFacility(this.currentFacility.facilityId);
          await ApiService.apiAxios.patch(ApiRoutes.CHANGE_REQUEST + '/mtfi/' + mtfiFacility?.changeRequestMtfiId, {'ccof_unlock_rfi': true});
        }
        this.$router.push(changeUrlGuid(PATHS.CCFRI_RFI, this.$route.params.changeRecGuid, this.$route.params.urlGuid, CHANGE_TYPES.MTFI));
      } catch (error) {
        console.log(error);
        this.setFailureAlert('An error occured while navigating to RFI.');
      }
    },
    async next() {
      // this.rfi3percentCategories = await this.getCcfriOver3percent(this.currentPcfCcfri);
      if (!this.isReadOnly && !this.loading) {
        this.$store.commit('ccfriApp/model', this.model);
        await this.save(false);
      }
      //always check for RFI regardless of new or renewal state
      this.rfi3percentCategories = await this.getCcfriOver3percent(this.currentPcfCcfri);
      console.log('rfi3percentCategories length ', this.rfi3percentCategories.length);
      if (this.rfi3percentCategories.length > 0) {
        if (this.getCurrentFacility.hasRfi) {
          //already has RFI. just go to the next page
          this.$router.push(changeUrlGuid(PATHS.CCFRI_RFI, this.$route.params.changeRecGuid, this.$route.params.urlGuid, CHANGE_TYPES.MTFI));
        } else {
          this.showRfiDialog = true;
        }
      } else {
        //no need for RFI.
        if (this.getCurrentFacility.hasRfi) {
          this.setNavBarValue({ facilityId: this.currentFacility.facilityId, property: 'hasRfi', value: false});
        }
        this.$router.push(this.nextPath);
      }
    },
    previous() {
      console.log('combined dates: ');
          console.log(this.chosenDates);
      console.log('new dates: ');
          console.log(this.CCFRIFacilityModel.dates);

      // if(this.organizationProviderType == 'FAMILY'){
      //   this.$router.push(changeUrl(PATHS.MTFI_INFO, this.$route.params.changeRecGuid, CHANGE_TYPES.MTFI ));
      // }
      // else{
      //   this.$router.push(this.previousPath);
      // }
    },
    validateForm() {

    },
    async save(showMessage) {
      //only save data to Dynamics if the form has changed.
      this.setNavBarCCFRIComplete({ ccfriId: this.ccfriId, complete: this.isFormComplete()});
      try {
        if (this.hasModelChanged()){
          this.processing = true;
          this.setLoadedModel( deepCloneObject(this.CCFRIFacilityModel)); //when saving update the loaded model to look for changes
          await this.saveCcfri({isFormComplete: this.isFormComplete(), hasRfi: this.getNavByCCFRIId(this.$route.params.urlGuid).hasRfi});
          this.setNavBarCCFRIComplete({ ccfriId: this.$route.params.urlGuid, complete: this.isFormComplete()});
          this.processing = false;
        }
        if (showMessage) {
          this.setSuccessAlert('Success! CCFRI Parent fees have been saved.');
        }
      } catch (error) {
        console.info(error);
        this.setFailureAlert('An error occurred while saving.');
      }
    }
  },
  mounted() {
    //this.model = this.$store.state.ccfriApp.model ?? model;
  },
  async beforeRouteLeave(_to, _from, next) {
    next();
  },
  components: {NavButton}
};
</script>

<style scoped>

.blueBorder{
  border-top: 55px solid grey !important;
}

.backG{
  background-color: lightgray;
}

.textItemSpacing {
  display: flex;
    align-items: center;
    justify-content: space-around;
}

.gridContainer {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows:    repeat(2, 75px);
  grid-gap: 10px;
}

.row{
  flex-wrap: wrap;
}

.feeTitle{
  display: flex;
  align-content: flex-start;
  align-items: center;
  margin-left: 0px;
  padding-left: 0px;
  border-right: 2px black;
}
.feeTitleInput{
  display: flex;
  align-content: flex-start;
  align-items: center;
}

.inputBoxWrapper{
  display: flex;
    align-content: flex-end;
    align-items: flex-end;
    width: 100% ;
}

 .noPadding{
  margin-left: 0px;
}

.blueButton {
  background-color: #003366 !important;
}

>>>i.v-icon.v-icon {
  color: #003366 !important;
}


</style>

