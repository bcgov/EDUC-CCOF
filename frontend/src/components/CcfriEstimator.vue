<template>
  <v-container class="py-0 howdy">
    <v-overlay :model-value="loading">
      <v-progress-circular indeterminate size="64" />
    </v-overlay>
    <v-form ref="form">
      <v-row>
        <v-col cols="12" class="pt-0 pb-2" align="center">
          <v-img :src="estimatorImage" max-height="300" max-width="1448" cover />
        </v-col>
      </v-row>
      <v-row v-show="false" justify="center">
        <v-col cols="12" class="pt-1" align="center">
          <v-card class="elevation-0" max-width="1448">
            <v-col class="py-2">
              <v-row class="py-0 noticeInfo" align="center">
                <v-col :cols="12" align="center" md="1">
                  <v-icon size="x-large" class="py-1 noticeInfoIcon"> mdi-information </v-icon>
                </v-col>
                <v-col>
                  Thank you for your patience while we update fees for the 2023-24 year. Please check back as updates
                  occur daily or if you have questions about the fees a facility is approved for, call the contact
                  centre at 1-888-338-6622 (Option 2).
                </v-col>
              </v-row>
            </v-col>
          </v-card>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col cols="12" class="pt-1" align="center">
          <v-card elevation="0" color="#7B2EE5" max-width="1448">
            <v-row>
              <v-col cols="2" class="pb-0 text-center">
                <v-icon size="80" color="white" class="pl-3 d-none d-sm-flex"> mdi-alert-circle </v-icon>
              </v-col>
              <v-col cols="10" class="pt-7 text-left" style="font-size: 16px; color: white; margin-left: -18px">
                The estimation provided in this service is <strong><u>not</u></strong> a guarantee of payments. The
                estimation does not take into account all of your circumstances and
                <strong><u>should be used as a guide only</u>. Note:</strong> None of the information entered on the
                estimator is recorded or retained.
              </v-col>
            </v-row>
            <v-row>
              <v-col class="pt-0" style="font-size: 18px; color: white; text-align: center">
                Are you a parent or provider?
              </v-col>
            </v-row>
            <v-row>
              <v-col class="text-center pt-0 pb-4">
                <v-btn
                  :color="isParent ? '#431782' : 'white'"
                  class="pr-8 pl-8"
                  :style="'color:' + (isParent ? 'white' : '#7B2EE5') + ';font-size:16px;margin-right:28px'"
                  @click="question1('Parent')"
                >
                  Parent
                </v-btn>
                <v-btn
                  :color="isProvider ? '#431782' : 'white'"
                  class="pr-6 pl-6"
                  :style="'color:' + (isProvider ? 'white' : '#7B2EE5') + ';font-size:16px;'"
                  @click="question1('Provider')"
                >
                  Provider
                </v-btn>
              </v-col>
            </v-row>
            <div v-show="isParent || isProvider">
              <v-row>
                <v-col class="pl-8 pt-0 text-left" style="color: white; font-size: 15px"> Instructions: </v-col>
              </v-row>
              <v-row>
                <v-col cols="1" class="pl-8 pt-0 text-right text-no-wrap" style="color: white"> 1. </v-col>
                <v-col cols="10" class="pl-8 pt-0 text-left" style="color: white">
                  This estimator below calculates child care cost savings after the Child Care Fee Reduction Initiative
                  (CCFRI). More information on CCFRI eligibility is available on our
                  <a
                    href="https://www2.gov.bc.ca/gov/content?id=77241B9EE085467F94219D69F0008B29#eligibility
"
                    target="_blank"
                    style="color: #0fc3ed"
                    ><u>website</u></a
                  >.
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="1" class="pl-8 pt-0 text-right text-no-wrap" style="color: white"> 2. </v-col>
                <v-col cols="10" class="pl-8 pt-0 text-left" style="color: white">
                  <div v-show="isParent">
                    We recommend you use the 'Optional Facility Search' to find your child care provider. If you cannot
                    find your provider, contact them directly for the
                    <strong>approved full-time parent fee before fee reduction is applied.</strong>
                  </div>
                  <div v-show="isProvider">
                    You may use the 'Optional Facility Search' to find your facility. If you cannot find your facility
                    in the search, reference your facility's Program Confirmation Form on
                    <a href="https://mychildcareservices.gov.bc.ca/login" target="_blank"
                      ><u style="color: #0fc3ed">My ChildCareBC Services</u></a
                    >
                    for <strong>your approved full-time parent fees before fee reduction is applied</strong>.
                  </div>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="1" class="pl-8 pt-0 text-right text-no-wrap" style="color: white"> 3. </v-col>
                <v-col cols="10" class="pl-8 pt-0 pb-4 text-left" style="color: white">
                  Use the <strong>'Estimate your savings'</strong> button at the bottom of the tool.
                </v-col>
              </v-row>
              <v-row><v-col class="pa-1" /></v-row>
            </div>
          </v-card>
        </v-col>
      </v-row>
      <!-- ******************************************************************************************************************************************************** -->
      <!-- **** FACILTY SEARCH COMPONENT  ************************************************************************************************************************* -->
      <FacilitySearch
        v-show="isParent || isProvider"
        @selected-facility="setSelectedFacility($event)"
        @reset-type-of-care="resetTypeOfCare()"
      />
      <!-- ******************************************************************************************************************************************************** -->
      <v-row v-show="isParent || isProvider" justify="center">
        <v-col cols="12" align="center" class="pt-1">
          <v-card elevation="4" max-width="1448">
            <v-row>
              <v-col class="py-0">
                <v-card-title
                  style="
                    color: white;
                    font-style: normal;
                    font-weight: 700;
                    font-size: 20px;
                    padding-top: 8px;
                    padding-bottom: 8px;
                    background-color: #431782;
                  "
                >
                  Facility Details
                </v-card-title>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6" class="estimator-label">
                <span style="color: #313131"> Total number of children</span>
              </v-col>
              <v-col cols="4" class="pb-0">
                <v-text-field
                  id="totNumberOfChildren"
                  v-model="totalNumberOfChildren"
                  variant="outlined"
                  required
                  :rules="rulesTotalNumChildren"
                  density="compact"
                  @change="updateNumberOfChildSubForms"
                  @keypress="numberFilter"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col class="py-0">
                <v-divider />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="5" class="estimator-label">
                <span style="color: #313131"> Type of care</span>
              </v-col>
              <v-col cols="1" style="padding-bottom: 0px; padding-top: 16px; padding-left: 0px">
                <v-tooltip location="top" content-class="tooltip-text">
                  <template #activator="{ props }">
                    <v-card class="tooltip" v-bind="props">
                      <v-icon class="pt-1" size="small" color="white"> mdi-help </v-icon>
                    </v-card>
                  </template>
                  <div>
                    Licensed group child care takes place in a community-based<br />
                    facility or centre. Licensed family child care takes place<br />
                    in the child care provider's personal residence.
                  </div>
                </v-tooltip>
              </v-col>
              <v-col cols="4" class="pb-0">
                <v-select
                  id="typeOfCare"
                  v-model="form.typeOfCare"
                  :items="typeOfCareList"
                  variant="outlined"
                  required
                  :disabled="isTypeOfCareDisabled"
                  :rules="rulesTypeOfCare"
                  density="compact"
                  @update:model-value="setTypeOfCare(form.typeOfCare)"
                />
              </v-col>
            </v-row>
            <!-- ******************************************************************************************************************************************************** -->
            <!-- **** CHILD X SUB SECTION  ****************************************************************************************************************************** -->
            <!-- ******************************************************************************************************************************************************** -->
            <div v-for="child in children" :key="child.number">
              <v-card-title
                style="
                  color: white;
                  font-style: normal;
                  font-weight: 700;
                  font-size: 20px;
                  padding-top: 8px;
                  padding-bottom: 8px;
                  background-color: #431782;
                "
              >
                Child {{ child.number }}
              </v-card-title>
              <v-row>
                <v-col cols="5" class="estimator-label">
                  <span style="color: #313131"> Child's age category </span>
                </v-col>
                <v-col cols="1" style="padding-bottom: 0px; padding-top: 16px; padding-left: 0px">
                  <v-tooltip location="top" content-class="tooltip-text">
                    <template #activator="{ props }">
                      <v-card class="tooltip" v-bind="props">
                        <v-icon class="pt-1" size="small" color="white"> mdi-help </v-icon>
                      </v-card>
                    </template>
                    <div>
                      Parents can ask their child care provider if they are unsure<br />
                      which age category to select.
                    </div>
                  </v-tooltip>
                </v-col>
                <v-col cols="4" class="pb-0">
                  <v-select
                    id="childAgeCategory"
                    v-model="child.childAgeCategory"
                    style="font-size: 16px !important"
                    :items="filteredChildAgeCategoryList"
                    variant="outlined"
                    density="compact"
                    required
                    :rules="rulesChildsAgeCategory"
                    @update:model-value="setApprovedParentFee(child.childAgeCategory, child.number - 1)"
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col class="py-0">
                  <v-divider />
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="5" class="estimator-label">
                  <span style="color: #313131"> Parent fee frequency </span>
                </v-col>
                <v-col cols="1" style="padding-bottom: 0px; padding-top: 16px; padding-left: 0px">
                  <v-tooltip location="top" content-class="tooltip-text">
                    <template #activator="{ props }">
                      <v-card class="tooltip" v-bind="props">
                        <v-icon class="pt-1" size="small" color="white"> mdi-help </v-icon>
                      </v-card>
                    </template>
                    <div>Select whether parent fees are charged daily or monthly.</div>
                  </v-tooltip>
                </v-col>
                <v-col cols="4" class="pb-0">
                  <v-select
                    id="parentFeeFrequency"
                    v-model="child.parentFeeFrequency"
                    :items="parentFeeFrequencyList"
                    required
                    :rules="rulesParentFeeFrequency"
                    variant="outlined"
                    density="compact"
                    @update:model-value="onChangeParentFeeFrequency(child.number - 1)"
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col class="py-0">
                  <v-divider />
                </v-col>
              </v-row>
              <!-- ******************************************************************************************************************************************************** -->
              <!-- **** CHILD X: PART TIME CARE SCHEDULE ****************************************************************************************************************** -->
              <!-- ******************************************************************************************************************************************************** -->
              <v-row>
                <v-col cols="5" class="estimator-label">
                  <span style="color: #313131"> Weekly care schedule </span>
                </v-col>
                <v-col cols="1" style="padding-bottom: 0px; padding-top: 16px; padding-left: 0px">
                  <v-tooltip location="top" content-class="tooltip-text">
                    <template #activator="{ props }">
                      <v-card class="tooltip" v-bind="props">
                        <v-icon class="pt-1" size="small" color="white"> mdi-help </v-icon>
                      </v-card>
                    </template>
                    <!-- eslint-disable vue/no-v-html -->
                    <div v-html="getCareScheduleToolTip(child.number)"></div>
                  </v-tooltip>
                </v-col>
                <v-col cols="4" class="pb-0" />
              </v-row>
              <v-row>
                <v-col class="d-flex wrap justify-center" style="padding-top: 0px; padding-bottom: 16px">
                  <div class="d-flex wrap" style="align-content: center; flex-wrap: wrap">
                    <v-card min-width="154px" class="mb-1 ml-1">
                      <v-toolbar color="#431782">
                        <v-toolbar-title class="ms-0 d-flex justify-center">Monday</v-toolbar-title>
                      </v-toolbar>
                      <v-list v-model:selected="child.selectedCareType[0]" active-class="purple-text">
                        <div v-for="(item, index) in getCareTypes(child.number)" :key="item.type">
                          <v-list-item :value="index" :disabled="isScheduleDisabled(child, index)">
                            <v-list-item-title>{{ item.type }}</v-list-item-title>
                          </v-list-item>
                          <v-divider v-if="index < getCareTypes(child.number).length - 1" :key="index" />
                        </div>
                      </v-list>
                    </v-card>

                    <v-card min-width="154px" class="mb-1 ml-1">
                      <v-toolbar color="#431782">
                        <v-toolbar-title class="ms-0 d-flex justify-center">Tuesday</v-toolbar-title>
                      </v-toolbar>
                      <v-list v-model:selected="child.selectedCareType[1]" active-class="purple-text">
                        <div v-for="(item, index) in getCareTypes(child.number)" :key="item.type">
                          <v-list-item :value="index" :disabled="isScheduleDisabled(child, index)">
                            <v-list-item-title>{{ item.type }}</v-list-item-title>
                          </v-list-item>
                          <v-divider v-if="index < getCareTypes(child.number).length - 1" :key="index" />
                        </div>
                      </v-list>
                    </v-card>

                    <v-card min-width="154px" class="mb-1 ml-1">
                      <v-toolbar color="#431782">
                        <v-toolbar-title class="ms-0 d-flex justify-center">Wednesday</v-toolbar-title>
                      </v-toolbar>

                      <v-list v-model:selected="child.selectedCareType[2]" active-class="purple-text">
                        <div v-for="(item, index) in getCareTypes(child.number)" :key="item.type">
                          <v-list-item :value="index" :disabled="isScheduleDisabled(child, index)">
                            <v-list-item-title>{{ item.type }}</v-list-item-title>
                          </v-list-item>
                          <v-divider v-if="index < getCareTypes(child.number).length - 1" :key="index" />
                        </div>
                      </v-list>
                    </v-card>

                    <v-card min-width="154px" class="mb-1 ml-1">
                      <v-toolbar color="#431782">
                        <v-toolbar-title class="ms-0 d-flex justify-center">Thursday</v-toolbar-title>
                      </v-toolbar>
                      <v-list v-model:selected="child.selectedCareType[3]" active-class="purple-text">
                        <div v-for="(item, index) in getCareTypes(child.number)" :key="item.type">
                          <v-list-item :value="index" :disabled="isScheduleDisabled(child, index)">
                            <v-list-item-title>{{ item.type }}</v-list-item-title>
                          </v-list-item>

                          <v-divider v-if="index < getCareTypes(child.number).length - 1" :key="index" />
                        </div>
                      </v-list>
                    </v-card>

                    <v-card min-width="154px" class="mb-1 ml-1">
                      <v-toolbar color="#431782">
                        <v-toolbar-title class="ms-0 d-flex justify-center">Friday</v-toolbar-title>
                      </v-toolbar>
                      <v-list v-model:selected="child.selectedCareType[4]" active-class="purple-text">
                        <div v-for="(item, index) in getCareTypes(child.number)" :key="item.type">
                          <v-list-item :value="index" :disabled="isScheduleDisabled(child, index)">
                            <v-list-item-title>{{ item.type }}</v-list-item-title>
                          </v-list-item>
                          <v-divider v-if="index < getCareTypes(child.number).length - 1" :key="index" />
                        </div>
                      </v-list>
                    </v-card>

                    <v-card min-width="154px" class="mb-1 ml-1">
                      <v-toolbar color="#431782">
                        <v-toolbar-title class="ms-0 d-flex justify-center">Saturday</v-toolbar-title>
                      </v-toolbar>
                      <v-list v-model:selected="child.selectedCareType[5]" active-class="purple-text">
                        <div v-for="(item, index) in getCareTypes(child.number)" :key="item.type">
                          <v-list-item :value="index" :disabled="isScheduleDisabled(child, index)">
                            <v-list-item-title>{{ item.type }}</v-list-item-title>
                          </v-list-item>
                          <v-divider v-if="index < getCareTypes(child.number).length - 1" :key="index" />
                        </div>
                      </v-list>
                    </v-card>

                    <v-card min-width="154px" class="mb-1 ml-1">
                      <v-toolbar color="#431782">
                        <v-toolbar-title class="ms-0 d-flex justify-center">Sunday</v-toolbar-title>
                      </v-toolbar>
                      <v-list v-model:selected="child.selectedCareType[6]" active-class="purple-text">
                        <div v-for="(item, index) in getCareTypes(child.number)" :key="item.type">
                          <v-list-item :value="index" :disabled="isScheduleDisabled(child, index)">
                            <v-list-item-title>{{ item.type }}</v-list-item-title>
                          </v-list-item>
                          <v-divider v-if="index < getCareTypes(child.number).length - 1" :key="index" />
                        </div>
                      </v-list>
                    </v-card>
                  </div>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="6" sm="7" md="8" lg="9" class="text-left verticalAlignFlexbox">
                  <div
                    v-if="child.parentFeeFrequency == 'Daily' && child.childAgeCategory != 'Preschool'"
                    style="padding-left: 30px"
                  >
                    Reductions for full and half days will differ. If your care schedule is a mix of full and half days,
                    enter them separately to receive an estimate.
                  </div>
                </v-col>
                <v-col cols="6" sm="5" md="4" lg="3" class="text-right">
                  <v-btn
                    style="font-weight: 600; font-size: 16px"
                    class="ma-2 px-8 mr-8"
                    color="#0483AF"
                    @click="clearSchedule(child)"
                  >
                    Clear schedule
                  </v-btn>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="py-0">
                  <v-divider />
                </v-col>
              </v-row>
              <v-row v-if="child.showMonthSelector">
                <v-col cols="5" class="estimator-label">
                  <span style="color: #313131"> Select a month (Optional) </span>
                </v-col>
                <v-col cols="7" md="1" style="padding-bottom: 0px; padding-top: 16px; padding-left: 0px">
                  <v-tooltip location="top" content-class="tooltip-text">
                    <template #activator="{ props }">
                      <v-card class="tooltip" v-bind="props">
                        <v-icon class="pt-1" size="small" color="white"> mdi-help </v-icon>
                      </v-card>
                    </template>
                    <span
                      >Fees shown are approved <strong>full time</strong> maximum parent fees. For part time<br />
                      care, click on the month and enter your fee without any reduction into<br />
                      the box beside: 'Actual parent fee before reduction applied'.</span
                    >
                  </v-tooltip>
                </v-col>
                <v-col cols="6" class="flex pt-1 pb-0" style="margin-bottom: -18px">
                  <div>
                    <v-sheet
                      class="flex px-0 py-0 text-center"
                      elevation="0"
                      max-width="338"
                      min-width="150"
                      style="float: left"
                    >
                      <!-- ****************************************************************************************************************************************************************-->
                      <!-- *** The following slider is for the ON (selected) state ********************************************************************************************************-->
                      <!-- ****************************************************************************************************************************************************************-->
                      <span style="color: #313131; font-size: 15px; font-weight: bold">{{
                        child.programYear != undefined ? child.programYear.slice(0, 7) : ''
                      }}</span>
                      <v-slide-group
                        v-if="child.isActive"
                        id="monthSelectorOn"
                        v-model="child.selectedMonthIndex"
                        class="pa-0"
                        mandatory
                        center-active
                        show-arrows
                        selected-class=""
                        @update:model-value="focusAwayFromOnSlider(child.number - 1)"
                      >
                        <template #next>
                          <span class="fill-height pt-1 pr-3">
                            <v-icon ref="rchevron" color="#431782" size="x-large">mdi-chevron-right</v-icon>
                          </span>
                        </template>
                        <template #prev>
                          <span class="estimator-label fill-height pt-1 pr-7" align="right">
                            <v-icon color="#431782" size="x-large" class="ml-2">mdi-chevron-left</v-icon>
                            <span class="fee-frequency-label"> {{ child.feeFrequency }}&nbsp; </span>
                          </span>
                        </template>
                        <v-slide-group-item v-for="n in child.items" :key="n.id" v-slot="{ isSelected, toggle }">
                          <v-card
                            :disabled="n.rate == 0 || n.rate == null || n.rate == 'N/A' ? true : false"
                            :color="isSelected ? '#F3E6F6' : '#FFFFFF'"
                            class="ma-1 month-card"
                            :elevation="isSelected ? 4 : 0"
                            height="67"
                            width="70"
                            @click="toggle(focusAwayFromOnSlider(child.number - 1))"
                          >
                            <v-row style="" justify="center">
                              <v-col
                                align="center"
                                style="
                                  padding-top: 4px;
                                  padding-bottom: 5px;
                                  margin-top: -2px;
                                  background-color: #431782;
                                "
                              >
                                <span
                                  style="
                                    color: white;
                                    font-size: 17px;
                                    font-weight: bold;
                                    padding-bottom: 6px;
                                    padding-left: 20px;
                                    padding-right: 19px;
                                    padding-top: 4px;
                                  "
                                >
                                  {{ n.month }}
                                </span>
                              </v-col>
                            </v-row>
                            <v-row style="font-size: 14px" justify="center">
                              <v-col align="center" style="padding-top: 3px">
                                <span :style="'color:' + (isSelected ? '#9D2AB1' : 'black')">
                                  {{
                                    n.rate == 0 || n.rate == null || n.rate == undefined || n.rate == 'N/A'
                                      ? 'N/A'
                                      : '$' + (n.rate % 1 == 0 ? n.rate : (Math.round(n.rate * 100) / 100).toFixed(2))
                                  }}
                                </span>
                              </v-col>
                            </v-row>
                          </v-card>
                        </v-slide-group-item>
                      </v-slide-group>
                      <!-- ****************************************************************************************************************************************************************-->
                      <!-- *** The following slider is for the OFF (unselected) state *****************************************************************************************************-->
                      <!-- ****************************************************************************************************************************************************************-->
                      <v-slide-group
                        v-if="!child.isActive"
                        id="monthSelectorOff"
                        v-model="child.selectedMonthIndex"
                        class="pa-0"
                        mandatory
                        center-active
                        show-arrows
                        selected-class=""
                        @update:model-value="focusAwayFromOnSlider(child.number - 1)"
                      >
                        <template #next>
                          <span class="fill-height pt-1 pr-3">
                            <v-icon color="#431782" size="x-large">mdi-chevron-right</v-icon>
                          </span>
                        </template>
                        <template #prev>
                          <span class="estimator-label fill-height pt-1 pr-7" align="right">
                            <v-icon color="#431782" size="x-large" class="ml-2">mdi-chevron-left</v-icon>
                            <span class="fee-frequency-label"> {{ child.feeFrequency }}&nbsp; </span>
                          </span>
                        </template>
                        <v-slide-group-item v-for="n in child.items" :key="n.id" v-slot="{ toggle }">
                          <v-card
                            :disabled="n.rate == 0 || n.rate == null || n.rate == 'N/A' ? true : false"
                            color="white"
                            class="ma-1 month-card"
                            elevation="0"
                            height="67"
                            width="70"
                            @click="toggle(clickForOffSlider(n.id, child.number - 1))"
                          >
                            <v-row style="" justify="center">
                              <v-col
                                align="center"
                                style="
                                  padding-top: 3px;
                                  padding-bottom: 5px;
                                  margin-top: -2px;
                                  background-color: #431782;
                                "
                              >
                                <span
                                  style="
                                    color: white;
                                    font-size: 17px;
                                    font-weight: bold;
                                    padding-bottom: 6px;
                                    padding-left: 20px;
                                    padding-right: 19px;
                                    padding-top: 4px;
                                  "
                                >
                                  {{ n.month }}
                                </span>
                              </v-col>
                            </v-row>
                            <v-row style="font-size: 14px" justify="center">
                              <v-col align="center" style="padding-top: 3px">
                                <span style="">
                                  {{
                                    n.rate == 0 || n.rate == null || n.rate == undefined || n.rate == 'N/A'
                                      ? 'N/A'
                                      : '$' + (n.rate % 1 == 0 ? n.rate : (Math.round(n.rate * 100) / 100).toFixed(2))
                                  }}
                                </span>
                              </v-col>
                            </v-row>
                          </v-card>
                        </v-slide-group-item>
                      </v-slide-group>
                      <v-btn
                        ref="hiddenButton"
                        class="hidden-btn hidden-btn2 no-hover pa-0"
                        elevation="0"
                        color="white"
                        style=""
                      />
                    </v-sheet>
                  </div>
                  <!-- ******************************************************************************************************************************************************** -->
                </v-col>
              </v-row>
              <v-row v-if="child.showMonthSelector">
                <v-col class="py-0">
                  <v-divider />
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="5" class="estimator-label" style="padding-bottom: 0px; padding-top: 16px">
                  <div style="color: #7b7c7e; font-weight: 600; font-size: 16px">
                    <span style="color: #313131"> Approved full-time parent fee before fee reduction applied </span>
                  </div>
                </v-col>
                <v-col cols="1" style="padding-bottom: 0px; padding-top: 16px; padding-left: 0px">
                  <v-tooltip location="top" content-class="tooltip-text">
                    <template #activator="{ props }">
                      <v-card class="tooltip" v-bind="props">
                        <v-icon class="pt-1" size="small" color="white"> mdi-help </v-icon>
                      </v-card>
                    </template>
                    <div v-if="isParent">
                      Enter the facility's highest approved full-time parent<br />
                      fee before any fee reduction. Providers are required<br />
                      to give parents this information in writing.<br /><br />
                      You can use the optional facility search above or ask<br />
                      your child care provider if you are unsure which fee<br />
                      to enter.
                    </div>
                    <div v-else>
                      Enter the facility's highest full-time parent fee approved by the Ministry<br />
                      before any fee reduction.<br /><br />
                      Child care providers can reference this information on their approved<br />
                      Program Confirmation Form.
                    </div>
                  </v-tooltip>
                </v-col>
                <v-col cols="4" class="pb-0">
                  <v-text-field
                    id="approvedFee"
                    v-model="child.approvedFee"
                    :rules="rulesApprovedFee(child.approvedFee)"
                    variant="outlined"
                    prefix="$"
                    required
                    density="compact"
                    @keypress="currencyFilter"
                    @change="truncateLeadingZerosDecimals(child.number)"
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col class="py-0">
                  <v-divider />
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="5" class="estimator-label" style="padding-bottom: 0px; padding-top: 16px">
                  <div style="color: #7b7c7e; font-weight: 600; font-size: 16px">
                    <span v-if="child.careSchedule == 'Full Time'" style="color: #313131">
                      Actual parent fee before reduction applied (Optional)
                    </span>
                    <span
                      v-else-if="child.careSchedule == 'Part Time' && getOccurrence(child.selectedCareType, 2) >= 5"
                      style="color: #313131"
                    >
                      Actual parent fee before reduction applied (Optional)
                    </span>
                    <span v-else>
                      <span style="color: #313131"> Actual parent fee before reduction applied </span>
                    </span>
                  </div>
                </v-col>
                <v-col cols="1" style="padding-bottom: 0px; padding-top: 16px; padding-left: 0px">
                  <v-tooltip location="top" content-class="tooltip-text">
                    <template #activator="{ props }">
                      <v-card class="tooltip" v-bind="props">
                        <v-icon class="pt-1" size="small" color="white"> mdi-help </v-icon>
                      </v-card>
                    </template>
                    <div>
                      Enter the parent fee before any reductions or<br />
                      benefits are applied. Providers are required to give<br />
                      parents this information in writing.<br /><br />
                      This fee may differ from the approved full-time<br />
                      parent fee if it is a part-time fee, discounted fee, or<br />
                      inclusive of optional fees. For example, the provider<br />
                      may offer a reduced fee for families with other<br />
                      siblings at the facility.
                    </div>
                  </v-tooltip>
                </v-col>
                <v-col cols="4" class="pb-0">
                  <v-text-field
                    id="partTimeFee"
                    v-model="child.partTimeFee"
                    :rules="validateParentFee(child, child.partTimeFee)"
                    variant="outlined"
                    prefix="$"
                    required
                    density="compact"
                    @keypress="currencyFilter"
                    @change="truncateLeadingZerosDecimals(child.number)"
                  />
                </v-col>
              </v-row>
            </div>
            <!-- ******************************************************************************************************************************************************** -->
            <!-- **** RESULTS SUB SECTION  ****************************************************************************************************************************** -->
            <!-- ******************************************************************************************************************************************************** -->

            <v-row>
              <v-col class="py-0">
                <v-row>
                  <v-col cols="12" class="text-center pt-0">
                    <v-btn
                      style="color: white; font-weight: 600; font-size: 16px; padding-left: 60px; padding-right: 60px"
                      class="ma-2"
                      color="#0483AF"
                      @click="estimateTheBenefit"
                    >
                      Estimate your savings
                    </v-btn>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>

            <div v-show="showEstimatorResults">
              <v-card-title
                style="
                  color: white;
                  font-style: normal;
                  font-weight: 700;
                  font-size: 20px;
                  padding-top: 8px;
                  padding-bottom: 8px;
                  background-color: #431782;
                "
              >
                Results
              </v-card-title>
              <v-row>
                <v-col cols="1" />
                <v-col cols="10">
                  <v-row>
                    <v-col cols="1" style="padding-bottom: 0px; padding-top: 10px; padding-left: 0px">
                      <v-tooltip location="top" content-class="tooltip-text">
                        <template #activator="{ props }">
                          <v-card class="tooltip" v-bind="props">
                            <v-icon class="pt-1" size="small" color="white"> mdi-help </v-icon>
                          </v-card>
                        </template>
                        <div v-if="isParent">
                          If the calculation below does not match your<br />
                          expected result, contact your child care provider. If<br />
                          the inconsistency remains, call the Child Care<br />
                          Operating Funding Program at 1-888-338-6622<br />
                          (Option 2).
                        </div>
                        <div v-else>
                          If the calculation below does not match your<br />
                          expected result, contact the Child Care Operating<br />
                          Funding Program at 1-888-338-6622 (Option 2).
                        </div>
                      </v-tooltip>
                    </v-col>
                    <v-col cols="11" class="px-0">
                      <div style="margin-left: -20px; color: #313131; font-weight: 500; font-size: 16px">
                        Based on the information you have provided, you may be eligible for the following ChildCareBC
                        fee reduction:
                      </div>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="1" />
              </v-row>

              <v-row>
                <v-col cols="1" />
                <v-col cols="10">
                  <v-card elevation="4" class="">
                    <v-row class="mx-0">
                      <v-col cols="2" class="pr-0 pl-0" style="padding-top: 0%; padding-bottom: 0px">
                        <v-card-title class="results-label pt-2 pb-2 pl-9 fill-height"> Child </v-card-title>
                      </v-col>
                      <v-col cols="5" class="pl-0 pr-0" style="padding-top: 0%; padding-bottom: 0px">
                        <v-card-title class="results-label text-wrap pt-2 pb-2 fill-height">
                          Estimated child care savings
                        </v-card-title>
                      </v-col>
                      <v-col
                        cols="5"
                        class="pl-0 pr-0"
                        style="padding-top: 0%; padding-bottom: 0px; background-color: #431782"
                      >
                        <v-card-title class="results-label text-wrap pt-2 pb-2 fill-height">
                          Estimated parent fee after reduction
                        </v-card-title>
                      </v-col>
                    </v-row>
                    <div v-for="result in results" :key="result.number">
                      <v-row class="py-3 mx-0">
                        <v-col cols="2" class="pr-0" style="padding-bottom: 2px; padding-top: 2px">
                          <div style="padding-left: 24px; font-weight: 500; font-size: 16px">
                            {{ result.number }}
                          </div>
                        </v-col>
                        <v-col cols="5" class="pl-2" style="padding-bottom: 2px; padding-top: 2px">
                          <div class="d-flex">
                            <div
                              :id="`reduction-amt-${String(result.number)}`"
                              style="padding-left: 12px; color: #431782; font-weight: bold; font-size: 15px"
                            >
                              {{
                                result.feeFrequency == 'Daily'
                                  ? '$' +
                                    result.reductionAmountDaily +
                                    '/day ($' +
                                    result.reductionAmountMonthly +
                                    '/month)'
                                  : ''
                              }}
                              {{
                                result.feeFrequency == 'Monthly' ? '$' + result.reductionAmountMonthly + '/month' : ''
                              }}
                            </div>
                          </div>
                        </v-col>
                        <v-col cols="5" class="pl-2" style="padding-bottom: 2px; padding-top: 2px">
                          <div class="d-flex">
                            <div
                              :id="`parent-fee-amt-${String(result.number)}`"
                              style="padding-left: 12px; color: #0483af; font-weight: bold; font-size: 15px"
                            >
                              {{
                                result.feeFrequency == 'Daily'
                                  ? '$' + result.parentFeeDaily + '/day ($' + result.parentFeeMonthly + '/month)'
                                  : ''
                              }}
                              {{ result.feeFrequency == 'Monthly' ? '$' + result.parentFeeMonthly + '/month' : '' }}
                            </div>
                          </div>
                        </v-col>
                      </v-row>
                    </div>
                  </v-card>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="1" />
                <v-col cols="10" class="pb-4">
                  <span
                    >Families earning up to $111,000 may be eligible for the
                    <a href="https://www.myfamilyservices.gov.bc.ca/s/estimator" target="_blank" style="color: #0fc3ed"
                      ><u>Affordable Child Care Benefit (ACCB)</u></a
                    >.</span
                  >
                </v-col>
                <v-col cols="1" />
              </v-row>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-form>
    <v-row justify="center" class="pb-3">
      <v-btn
        color="#431782"
        style="color: white; font-size: 16px"
        href="https://bcmcf.ca1.qualtrics.com/jfe/form/SV_3qjPIZfTboGpeom"
        target="_blank"
      >
        We want your feedback
      </v-btn>
    </v-row>
  </v-container>
</template>
<script>
import FacilitySearch from '@/components/FacilitySearch.vue';

const CHILDCARE_TYPE_0_TO_18 = '0 - 18 Months';
const CHILDCARE_TYPE_18_TO_36 = '18 - 36 Months';
const CHILDCARE_TYPE_3_TO_K = '3 Years to Kindergarten';
const CHILDCARE_TYPE_SCHOOL_CARE_K = 'Before & After School (Kindergarten Only)';
const CHILDCARE_TYPE_SCHOOL_CARE_1 = 'Before & After School (Grade 1+)';
const CHILDCARE_TYPE_PRESCHOOL = 'Preschool';

const CHILD_CARE_CATEGORY_LIST = [
  CHILDCARE_TYPE_0_TO_18,
  CHILDCARE_TYPE_18_TO_36,
  CHILDCARE_TYPE_3_TO_K,
  CHILDCARE_TYPE_SCHOOL_CARE_K,
  CHILDCARE_TYPE_SCHOOL_CARE_1,
  CHILDCARE_TYPE_PRESCHOOL,
];

const CARE_TYPES = [{ type: 'No care' }, { type: '4 hours or less' }, { type: 'Over 4 hours' }];

const CARE_TYPES_PRESCHOOL = [{ type: 'No care' }, { type: '4 hours or less' }];

import estimatorImage from '@/assets/images/estimator_image.jpg';

export default {
  components: { FacilitySearch },
  props: {},
  data() {
    return {
      isParent: false,
      isProvider: false,
      childAgeCategory: '',
      categoriesToRemove: [],
      childIndex: '',
      selectedFacility: [],
      isTypeOfCareDisabled: false,
      skipApprovedFeeValidation: false,
      GROUP_REDUCTION_RATES: null,
      FAMILY_REDUCTION_RATES: null,
      results: null,
      showEstimatorResults: false,
      loading: false,
      approvedFeesByCategory: [],
      totalNumberOfChildren: '1',
      children: null,
      childCareCategoryFilter: [],
      form: {
        firstName: '',
        lastName: '',
        email: '',
        careProviderSearch: '',
        typeOfCare: '',
      },
      numberOfBusinessDaysByMonth: [
        { month: 'January', days: 20 },
        { month: 'February', days: 19 },
        { month: 'March', days: 20 },
        { month: 'April', days: 20 },
        { month: 'May', days: 20 },
        { month: 'June', days: 20 },
        { month: 'July', days: 20 },
        { month: 'August', days: 20 },
        { month: 'September', days: 20 },
        { month: 'October', days: 20 },
        { month: 'November', days: 20 },
        { month: 'December', days: 20 },
      ],
      parentFeeFrequencyList: ['Daily', 'Monthly'],
      typeOfCareList: ['Licensed Group', 'Licensed Family'],
      rulesTypeOfCare: [(v) => !!v || 'Type of care is required'],
      rulesTotalNumChildren: [
        (v) => !!v || 'Total number of children is required',
        (v) => v <= 25 || 'Total number of children must be less than 26',
        (v) => v >= 1 || 'Total number of children must be 1 or more',
      ],
      rulesCaresSchedule: [(v) => !!v || 'Care schedule is required'],
      rulesChildsAgeCategory: [(v) => !!v || "Child's age category is required"],
      rulesParentFeeFrequency: [(v) => !!v || 'Parent fee frequency is required'],
      estimatorImage,
    };
  },
  computed: {
    filteredChildAgeCategoryList() {
      return CHILD_CARE_CATEGORY_LIST.filter(
        (el) =>
          !this.categoriesToRemove.includes(el) &&
          !(this.form.typeOfCare === 'Licensed Family' && el === CHILDCARE_TYPE_PRESCHOOL),
      );
    },
  },
  watch: {},
  mounted() {
    this.children = [this.newChild(1)];
    this.setDefaultForMonthPicker();
    this.results = [];

    this.GROUP_REDUCTION_RATES = new Map();
    this.GROUP_REDUCTION_RATES.set('0 - 18 Months', {
      maxMonthlyRate: 900,
      fullTimeDailyRate: 45,
      partTimeDailyRate: 22.5,
      fullTimeDailyRateFloor: 17.5,
      partTimeDailyRateFloor: 8.75,
    });
    this.GROUP_REDUCTION_RATES.set('18 - 36 Months', {
      maxMonthlyRate: 900,
      fullTimeDailyRate: 45,
      partTimeDailyRate: 22.5,
      fullTimeDailyRateFloor: 17.5,
      partTimeDailyRateFloor: 8.75,
    });
    this.GROUP_REDUCTION_RATES.set('3 Years to Kindergarten', {
      maxMonthlyRate: 545,
      fullTimeDailyRate: 27.25,
      partTimeDailyRate: 13.625,
      fullTimeDailyRateFloor: 5,
      partTimeDailyRateFloor: 2.5,
    });
    this.GROUP_REDUCTION_RATES.set('Before & After School (Kindergarten Only)', {
      maxMonthlyRate: 320,
      fullTimeDailyRate: 16,
      partTimeDailyRate: 8,
      fullTimeDailyRateFloor: 5,
      partTimeDailyRateFloor: 2.5,
    });
    this.GROUP_REDUCTION_RATES.set('Before & After School (Grade 1+)', {
      maxMonthlyRate: 115,
      fullTimeDailyRate: 5.75,
      partTimeDailyRate: 2.875,
      fullTimeDailyRateFloor: 0,
      partTimeDailyRateFloor: 0,
    });
    this.GROUP_REDUCTION_RATES.set('Preschool', {
      maxMonthlyRate: 95,
      fullTimeDailyRate: 9.5,
      partTimeDailyRate: 4.75,
      fullTimeDailyRateFloor: 0,
      partTimeDailyRateFloor: 0,
    });
    this.FAMILY_REDUCTION_RATES = new Map();
    this.FAMILY_REDUCTION_RATES.set('0 - 18 Months', {
      maxMonthlyRate: 600,
      fullTimeDailyRate: 30,
      partTimeDailyRate: 15,
      fullTimeDailyRateFloor: 10,
      partTimeDailyRateFloor: 5,
    });
    this.FAMILY_REDUCTION_RATES.set('18 - 36 Months', {
      maxMonthlyRate: 600,
      fullTimeDailyRate: 30,
      partTimeDailyRate: 15,
      fullTimeDailyRateFloor: 10,
      partTimeDailyRateFloor: 5,
    });
    this.FAMILY_REDUCTION_RATES.set('3 Years to Kindergarten', {
      maxMonthlyRate: 500,
      fullTimeDailyRate: 25,
      partTimeDailyRate: 12.5,
      fullTimeDailyRateFloor: 3,
      partTimeDailyRateFloor: 1.5,
    });
    this.FAMILY_REDUCTION_RATES.set('Before & After School (Kindergarten Only)', {
      maxMonthlyRate: 320,
      fullTimeDailyRate: 16,
      partTimeDailyRate: 8,
      fullTimeDailyRateFloor: 3,
      partTimeDailyRateFloor: 1.5,
    });
    this.FAMILY_REDUCTION_RATES.set('Before & After School (Grade 1+)', {
      maxMonthlyRate: 145,
      fullTimeDailyRate: 7.25,
      partTimeDailyRate: 3.65,
      fullTimeDailyRateFloor: 0,
      partTimeDailyRateFloor: 0,
    });
    this.FAMILY_REDUCTION_RATES.set('Preschool', {
      maxMonthlyRate: 95,
      fullTimeDailyRate: 9.5,
      partTimeDailyRate: 4.75,
      fullTimeDailyRateFloor: 0,
      partTimeDailyRateFloor: 0,
    });
  },
  updated() {
    this.skipApprovedFeeValidation = false;
    if (this.children[0].clicked) {
      this.$refs.hiddenButton[0].$el.focus();
      this.children[0].clicked = false;
    }
  },
  methods: {
    display2Decimals(val) {
      if (val != undefined) {
        if (this.decimalExists(Number(val))) {
          return Number(val).toFixed(2);
        } else {
          return val;
        }
      } else {
        return false;
      }
    },
    question1(userType) {
      this.isParent = userType == 'Parent' ? true : false;
      this.isProvider = userType == 'Provider' ? true : false;
    },
    resetTypeOfCare() {
      this.isTypeOfCareDisabled = false;
      this.selectedFacility = null;
      this.categoriesToRemove = [];
      this.children?.forEach((el) => (el.showMonthSelector = false));
    },
    setSelectedFacility(e) {
      this.resetForm();
      this.selectedFacility = e;
      if (this.selectedFacility.careType) {
        this.form.typeOfCare = this.selectedFacility.careType === 'F' ? 'Licensed Family' : 'Licensed Group';
        this.isTypeOfCareDisabled = true;
      }
      this.filterChildsAgeCategory();
    },
    getCareScheduleToolTip(index) {
      if (this.isParent) {
        switch (this.children[index - 1].childAgeCategory) {
          case CHILDCARE_TYPE_PRESCHOOL:
            return 'Licensed preschool care is only funded for 4 hours or less.';
          case CHILDCARE_TYPE_SCHOOL_CARE_K:
          case CHILDCARE_TYPE_SCHOOL_CARE_1:
            return 'Select the amount of time your child has access to a child<br>care space, not the amount of time your child attends the space.<br><br>For example, select "Over 4 hours" if your child<br>attends care for one hour in the morning and two hours in<br>the afternoon, but you are able to use the space for longer<br>than 4 hours.';
          default:
            return 'Select your typical care schedule. Maximum funding for<br>CCFRI is based on five days of over 4 hours of care<br>(full time care).';
        }
      } else {
        switch (this.children[index - 1].childAgeCategory) {
          case CHILDCARE_TYPE_PRESCHOOL:
            return 'Preschool care is only CCFRI-eligible for 4 hours or less.';
          case CHILDCARE_TYPE_SCHOOL_CARE_K:
          case CHILDCARE_TYPE_SCHOOL_CARE_1:
            return 'Select the amount of time the child has access to care, not the amount of<br>time the child is actually in care. For example, if the child has access to 5<br>hours of care but attends care for 3 hours, select "Over 4 hours."';
          default:
            return 'For part-time care estimates, select the typical schedule of half days (4 hours<br>or less) and full days (over 4 hours). The maximum benefit rates for<br>CCFRI are based on 5 full days per week (full-time care).';
        }
      }
    },
    getCareTypes(index) {
      return this.children[index - 1].childAgeCategory === CHILDCARE_TYPE_PRESCHOOL ? CARE_TYPES_PRESCHOOL : CARE_TYPES;
    },
    rulesApprovedFee(v) {
      if (!this.skipApprovedFeeValidation) {
        if (v == '' || v == undefined) {
          return ['Approved full-time parent fee before fee reduction applied is required'];
        } else if (v > 9999) {
          return ['Maximum Approved full-time parent fee before fee reduction applied is $9999.00'];
        } else if (v <= 0) {
          return ['Approved full-time parent fee before fee reduction applied must be greater than $0'];
        }
      }
      return [];
    },
    resetForm() {
      this.typeOfCare = undefined;
      this.children = [];
      this.updateNumberOfChildSubForms();
      this.showEstimatorResults = false;
      this.results = [];
      this.$refs.form.resetValidation();
    },
    validateParentFee(child, v) {
      if (v && v > 9999) {
        return ['Maximum Actual parent fee before reduction applied is $9999.00'];
      }
      if (
        child.careSchedule == 'Part Time' &&
        !this.isFullTime(child) &&
        this.getOccurrence(child.selectedCareType, 2) < 5 &&
        !v
      ) {
        return ['Actual parent fee before reduction applied is required'];
      }
      return [];
    },
    isFullTime(child) {
      let daysPerWeek = 0;
      if (child.selectedCareType && child.selectedCareType.length > 0) {
        for (let i = 0; i < child.selectedCareType.length; i++) {
          if (child.selectedCareType[i] == 2) {
            daysPerWeek++;
          }
        }
      }
      return daysPerWeek >= 5;
    },
    updateNumberOfChildSubForms() {
      if (this.totalNumberOfChildren > 25) {
        return;
      }
      this.results = [];
      let numberOfChildren = this.totalNumberOfChildren;
      if (this.children != undefined) {
        let currentLengh = this.children.length;
        if (numberOfChildren > currentLengh) {
          for (let i = currentLengh + 1; i <= numberOfChildren; i++) {
            this.children.push(this.newChild(i));
          }
        } else if (numberOfChildren < this.children.length) {
          let numberOfChildrenToRemove = this.children.length - numberOfChildren;
          for (let i = 1; i <= numberOfChildrenToRemove; i++) {
            this.children.pop();
          }
        }
      }
      this.setDefaultForMonthPicker();
    },
    newChild(number) {
      return {
        number: number,
        childAgeCategory: '',
        approvedFee: '',
        partTimeFee: '',
        parentFeeFrequency: 'Monthly',
        careSchedule: 'Part Time',
        showMonthSelector: false,
        selectedCareType: [], // This captures the index of the careTypes selected mon through sunday.
        isActive: false,
        btnDisabled: true,
        clicked: false,
        selectedApprovedFee: 0,
        feeFrequency: '',
        items: [
          { id: 0, month: 'Apr', rate: 0 },
          { id: 1, month: 'May', rate: 0 },
          { id: 2, month: 'Jun', rate: 0 },
          { id: 3, month: 'Jul', rate: 0 },
          { id: 4, month: 'Aug', rate: 0 },
          { id: 5, month: 'Sep', rate: 0 },
          { id: 6, month: 'Oct', rate: 0 },
          { id: 7, month: 'Nov', rate: 0 },
          { id: 8, month: 'Dec', rate: 0 },
          { id: 9, month: 'Jan', rate: 0 },
          { id: 10, month: 'Feb', rate: 0 },
          { id: 11, month: 'Mar', rate: 0 },
        ],
      };
    },
    getOccurrence(array, value) {
      let count = 0;
      for (let i = 0; i <= array.length; i++) {
        if (array[i] == value) {
          count++;
        }
      }
      return count;
    },
    getReductionFloor(rateTableInfo, daysFullTime, daysPartTime) {
      // let maxRateFloor = rateTableInfo.fullTimeDailyRateFloor * 20; // rateFloor cannot exceed 5 days a week, full time
      let rateFloor =
        daysFullTime * rateTableInfo.fullTimeDailyRateFloor + daysPartTime * rateTableInfo.partTimeDailyRateFloor;
      // return Math.min(maxRateFloor, rateFloor);TODO: is there a max rate floor?
      return rateFloor;
    },
    getFullTimeMonthlyParentFee(fee, feeFrequency) {
      // console.log(`getFullTimeMonthlyParentFee : ${feeFrequency}  and value is ${feeFrequency === 'Daily'}`);
      if (feeFrequency === 'Daily') {
        return fee * 20;
      } else {
        return fee;
      }
    },
    getPartTimeMonthlyParentFee(fee, feeFrequency, daysOfCare) {
      // console.log(`fee frequency: [${feeFrequency}] and fee: [${fee}] with Days of Care [${daysOfCare}]`);
      if (feeFrequency === 'Daily') {
        return fee * daysOfCare;
      } else {
        return fee;
      }
    },
    clearSchedule(child) {
      child.selectedCareType = [];
    },
    isScheduleDisabled(child, partTimeIndex) {
      //partTimeIndex = 0 for no care, 1 for half days, 2 for full days.
      if (child.parentFeeFrequency == 'Monthly' || child.childAgeCategory == CHILDCARE_TYPE_PRESCHOOL) {
        return false;
      } else {
        if (partTimeIndex == 1) {
          return child.selectedCareType.includes(2);
        } else if (partTimeIndex == 2) {
          return child.selectedCareType.includes(1);
        }
        return false; // when part time index = 0
      }
    },
    estimateTheBenefit() {
      ///NOSONAR
      if (this.$refs.form.validate()) {
        this.showEstimatorResults = true;
        this.results = [];
        let rateTableInfo;
        const NUMBER_OF_DAYS_PER_MONTH = 20; // hardcode to 20 as per new requirements
        for (let i = 0; i < this.children.length; i++) {
          // Get the rate table info based on the provided type of child care and childs age category...
          if (this.form.typeOfCare == 'Licensed Group') {
            rateTableInfo = this.GROUP_REDUCTION_RATES.get(this.children[i].childAgeCategory);
          } else {
            rateTableInfo = this.FAMILY_REDUCTION_RATES.get(this.children[i].childAgeCategory);
          }
          // console.log('Is child fulltime: ', isChildFullTime);

          let parentRate = this.children[i].approvedFee; //TODO - added this
          const dailyParentRate =
            this.children[i].parentFeeFrequency === 'Daily' ? parentRate : parentRate / NUMBER_OF_DAYS_PER_MONTH;
          // console.log('daily parent rate is: ' + dailyParentRate);
          let reductionAmountPerChildPerDay; // use to be  fullTimeDailyRate;

          const isPreschool = this.children[i].childAgeCategory === CHILDCARE_TYPE_PRESCHOOL;

          if (isPreschool) {
            // For preschool no need to subtract by full time daily rate as it's only part time
            reductionAmountPerChildPerDay =
              dailyParentRate - 7 > rateTableInfo.partTimeDailyRate
                ? rateTableInfo.partTimeDailyRate
                : dailyParentRate - 7;
            // console.log(`PRESCHOOL - full time daily rate [${reductionAmountPerChildPerDay}], We may be using rate table with rate: ${rateTableInfo.partTimeDailyRate}`);
          } else {
            reductionAmountPerChildPerDay =
              dailyParentRate - 10 > rateTableInfo.fullTimeDailyRate
                ? rateTableInfo.fullTimeDailyRate
                : dailyParentRate - 10;
            // console.log(`NOT preschol - full time daily rate [${reductionAmountPerChildPerDay}] We may be using rate table with rate: ${rateTableInfo.fullTimeDailyRate}`);
          }

          // let reductionAmountPerChild = fullTimeDailyRate * 20;

          let actualParentFeePerChild;
          let daysOfCare; //Number of days of care per month.

          let partTimeNumberOfDays = this.children[i].selectedCareType.filter((el) => el == 1).length;
          let fullTimeNumberOfDays = this.children[i].selectedCareType.filter((el) => el == 2).length;

          // multiply by 4 since there are decided on 4 weeks / month
          partTimeNumberOfDays = partTimeNumberOfDays * 4;
          fullTimeNumberOfDays = fullTimeNumberOfDays * 4;
          // console.log(`Full time number of days: [${fullTimeNumberOfDays}], Part time number of days: [${partTimeNumberOfDays}]`);
          daysOfCare = partTimeNumberOfDays + fullTimeNumberOfDays;
          // console.log('reductionAmountPerChildPerDay ' + reductionAmountPerChildPerDay);
          let halfDayReductionAmountPerMonth =
            (reductionAmountPerChildPerDay * partTimeNumberOfDays) / (isPreschool ? 1 : 2);
          // console.log('halfDayReductionAmountPerMonth: ' + halfDayReductionAmountPerMonth + ', part time number of days ' + partTimeNumberOfDays + ', daily reduction amount ' + reductionAmountPerChildPerDay);
          let fullDayReductionAmountPerMonth = reductionAmountPerChildPerDay * fullTimeNumberOfDays;
          // console.log('fullDayReductionAmountPerMonth: ' + fullDayReductionAmountPerMonth);
          let totalMonthlyRateReduction = halfDayReductionAmountPerMonth + fullDayReductionAmountPerMonth;
          // console.log('totalMonthlyRateReduction ', totalMonthlyRateReduction);
          //max total reduction cannot exceed full time daily reduction

          //totalRateReduction = Math.min(totalRateReduction, reductionAmountPerChild); //TODO: see if we need this?
          let rateReductionFloor = this.getReductionFloor(rateTableInfo, fullTimeNumberOfDays, partTimeNumberOfDays);
          //**************** HOW DO WE DETERMINE THIS IF IT's a DAILY rate? */
          let monthlyParentFee = this.getPartTimeMonthlyParentFee(
            this.children[i].partTimeFee ? this.children[i].partTimeFee : this.children[i].approvedFee,
            this.children[i].parentFeeFrequency,
            daysOfCare,
          );

          // console.log('monthlyParentFee ', monthlyParentFee);
          //Make sure it's at least the Rate Floor amount
          totalMonthlyRateReduction = Math.max(totalMonthlyRateReduction, rateReductionFloor);
          // console.log(`totalMonthlyRateReduction: [${totalMonthlyRateReduction}] after applying Reduction Rate floor of [${rateReductionFloor}]`);

          //Make sure it's not more than the parent fee
          totalMonthlyRateReduction = Math.min(totalMonthlyRateReduction, monthlyParentFee);
          // parentFeeFloor - the minimum the parent should pay
          let parentFeeFloor = fullTimeNumberOfDays * 10 + partTimeNumberOfDays * 7;
          if (isPreschool) {
            parentFeeFloor = Math.min(parentFeeFloor, 140); //Fee floor should not be more than $140 / month for preschool
          } else {
            parentFeeFloor = Math.min(parentFeeFloor, 200); //Fee floor should not be more than $200 / month
          }

          //Make sure to apply minimum reduction Rate fee
          //Then apply minumum parent rate fee if possible
          if (totalMonthlyRateReduction <= rateReductionFloor) {
            // if rate reduction is already at floor, cannot reduce rate reduction
            // console.log('totalRateReduction is already less than rateReductionFloor');
            actualParentFeePerChild = monthlyParentFee - totalMonthlyRateReduction;
          } else if (monthlyParentFee - totalMonthlyRateReduction < parentFeeFloor) {
            //Parent fees are below fee floor, decrease rate reduction fee
            // console.log('monthlyParentFee < parentFeeFloor');
            // console.log('partTimeFeeFloor ' + parentFeeFloor);
            // console.log('Rate floor ' + rateReductionFloor);
            // console.log(`monthly parent fee: [${monthlyParentFee}], total rate reduction [${totalMonthlyRateReduction}], (monthlyParentFee - totalRateReduction): [${(monthlyParentFee - totalMonthlyRateReduction)}]`);
            let changeRateBy = Math.min(
              totalMonthlyRateReduction - rateReductionFloor,
              parentFeeFloor - (monthlyParentFee - totalMonthlyRateReduction),
            );
            // console.log('change rate by: ' + changeRateBy);
            totalMonthlyRateReduction = totalMonthlyRateReduction - changeRateBy;
            actualParentFeePerChild = monthlyParentFee - totalMonthlyRateReduction;
          } else {
            // parent fee above fee floor, rate reduction above rate floor
            // console.log('else');
            // console.log('Rate floor: ' + rateReductionFloor);
            // console.log('Fee floor: ' + parentFeeFloor);
            // console.log('totalMonthlyRateReduction: ' + totalMonthlyRateReduction);
            actualParentFeePerChild = monthlyParentFee - totalMonthlyRateReduction;
          }
          // console.log(`PART TIME actualParentFeePerChild [${actualParentFeePerChild}], totalMonthlyRateReduction: [${totalMonthlyRateReduction}], monthly fee: [${monthlyParentFee}]`);

          // }
          // Determine the reduction amount per this.form.children[i]...
          // actualParentFeePerChild = Math.max(0, actualParentFeePerChild);
          // Update the results
          this.results.push({
            number: i + 1,
            reductionAmountMonthly: this.display2Decimals(totalMonthlyRateReduction),
            reductionAmountDaily: daysOfCare == 0 ? 0 : this.display2Decimals(totalMonthlyRateReduction / daysOfCare),
            parentFeeMonthly: this.display2Decimals(actualParentFeePerChild),
            parentFeeDaily: daysOfCare == 0 ? 0 : this.display2Decimals(actualParentFeePerChild / daysOfCare),
            feeFrequency: this.children[i].parentFeeFrequency,
            daysOfCare: daysOfCare,
          });
          // console.log('Results ', JSON.stringify(this.results));
        }
      }
    },

    numberFilter: function (evt) {
      evt = evt ? evt : window.event;
      let expect = evt.target.value.toString() + evt.key.toString();
      if (!/^[0-9]*$/.test(expect)) {
        evt.preventDefault();
      } else {
        return true;
      }
    },
    currencyFilter: function (evt) {
      evt = evt ? evt : window.event;
      let expect = evt.target.value.toString() + evt.key.toString();
      if (!/^[0-9]*\.?[0-9]*$/.test(expect)) {
        evt.preventDefault();
      } else {
        return true;
      }
    },
    truncateLeadingZerosDecimals(index) {
      index = index - 1;
      if (this.children[index].approvedFee.length != 0 && this.children[index].approvedFee.length > 1) {
        this.children[index].approvedFee = this.children[index].approvedFee.replace(/^0+/, '');
      }
      if (this.children[index].partTimeFee.length != 0 && this.children[index].partTimeFee.length > 1) {
        this.children[index].partTimeFee = this.children[index].partTimeFee.replace(/^0+/, '');
      }

      if (this.children[index].approvedFee == '.') {
        this.children[index].approvedFee = this.children[index].approvedFee.replace(/^.+/, '');
      }

      if (this.children[index].partTimeFee == '.') {
        this.children[index].partTimeFee = this.children[index].partTimeFee.replace(/^.+/, '');
      }
    },
    /* When a faclity is selected, the following will remove any child age category types from the
       drop list which do not have defined rates for the faclity. */
    filterChildsAgeCategory() {
      if (this.selectedFacility.approvedFeesByChildAgeCategory) {
        // if there are approved fees by categories, only show the categories with fees in the dropdown
        // let's remove from the childAgeCategoryList instead of adding to it in case
        // the list coming back from the server is not in our favoured order.
        const returnedCategories = this.selectedFacility.approvedFeesByChildAgeCategory.map(
          (el) => el.childCareCategory,
        );
        let removeList = CHILD_CARE_CATEGORY_LIST.filter((el) => !returnedCategories.includes(el));

        for (let i in this.selectedFacility.approvedFeesByChildAgeCategory) {
          if (
            this.selectedFacility.approvedFeesByChildAgeCategory[i].approvedFeeJan == null &&
            this.selectedFacility.approvedFeesByChildAgeCategory[i].approvedFeeFeb == null &&
            this.selectedFacility.approvedFeesByChildAgeCategory[i].approvedFeeMar == null &&
            this.selectedFacility.approvedFeesByChildAgeCategory[i].approvedFeeApr == null &&
            this.selectedFacility.approvedFeesByChildAgeCategory[i].approvedFeeMay == null &&
            this.selectedFacility.approvedFeesByChildAgeCategory[i].approvedFeeJun == null &&
            this.selectedFacility.approvedFeesByChildAgeCategory[i].approvedFeeJul == null &&
            this.selectedFacility.approvedFeesByChildAgeCategory[i].approvedFeeAug == null &&
            this.selectedFacility.approvedFeesByChildAgeCategory[i].approvedFeeSep == null &&
            this.selectedFacility.approvedFeesByChildAgeCategory[i].approvedFeeNov == null &&
            this.selectedFacility.approvedFeesByChildAgeCategory[i].approvedFeeDev == null &&
            this.selectedFacility.approvedFeesByChildAgeCategory[i].approvedFeeJan == null
          ) {
            removeList.push(this.selectedFacility.approvedFeesByChildAgeCategory[i].childCareCategory);
          }
        }
        this.categoriesToRemove = removeList;
      } else {
        // no approved fees, so show the whole list
        this.categoriesToRemove = [];
      }
    },
    setTypeOfCare(typeOfCare) {
      if (typeOfCare === 'Licensed Family') {
        this.children.forEach((child) => {
          if (child.childAgeCategory === CHILDCARE_TYPE_PRESCHOOL) {
            child.childAgeCategory = undefined;
          }
        });
      }
    },
    setApprovedParentFee(childsAgeCategory, childIndex) {
      if (
        this.selectedFacility !== null &&
        this.selectedFacility !== undefined &&
        this.selectedFacility.facilityId !== undefined
      ) {
        this.approvedFeesByCategory = this.getApprovedRatesByMonth(childsAgeCategory);
        if (childsAgeCategory == '3 Years to Kindergarten') {
          let ageCatIndex = undefined;
          this.selectedFacility.approvedFeesByChildAgeCategory.find((o, i) => {
            if (o.childCareCategory === '3 Years to Kindergarten') {
              ageCatIndex = i;
              return true; // stop searching
            }
          });
          if (
            this.selectedFacility.approvedFeesByChildAgeCategory[ageCatIndex].approvedFeeApr == 0 &&
            this.selectedFacility.approvedFeesByChildAgeCategory[ageCatIndex].approvedFeeMay == 0 &&
            this.selectedFacility.approvedFeesByChildAgeCategory[ageCatIndex].approvedFeeJun == 0 &&
            this.selectedFacility.approvedFeesByChildAgeCategory[ageCatIndex].approvedFeeJul == 0 &&
            this.selectedFacility.approvedFeesByChildAgeCategory[ageCatIndex].approvedFeeAug == 0
          ) {
            this.children[childIndex].items[0].rate = 'N/A';
            this.children[childIndex].items[1].rate = 'N/A';
            this.children[childIndex].items[2].rate = 'N/A';
            this.children[childIndex].items[3].rate = 'N/A';
            this.children[childIndex].items[4].rate = 'N/A';
            this.children[childIndex].items[5].rate = this.approvedFeesByCategory.approvedFeeSep;
            this.children[childIndex].items[6].rate = this.approvedFeesByCategory.approvedFeeOct;
            this.children[childIndex].items[7].rate = this.approvedFeesByCategory.approvedFeeNov;
            this.children[childIndex].items[8].rate = this.approvedFeesByCategory.approvedFeeDec;
            this.children[childIndex].items[9].rate = this.approvedFeesByCategory.approvedFeeJan;
            this.children[childIndex].items[10].rate = this.approvedFeesByCategory.approvedFeeFeb;
            this.children[childIndex].items[11].rate = this.approvedFeesByCategory.approvedFeeMar;
          } else {
            this.setRatesForMonths(childIndex);
          }
        } else {
          this.setRatesForMonths(childIndex);
        }

        if (this.approvedFeesByCategory.feeFrequency != undefined) {
          this.children[childIndex].parentFeeFrequency = this.approvedFeesByCategory.feeFrequency;
        }
        this.children[childIndex].feeFrequency = this.approvedFeesByCategory.feeFrequency;
        this.children[childIndex].programYear = this.approvedFeesByCategory.programYear;

        if (
          this.children[childIndex].items[this.children[childIndex].selectedMonthIndex].rate == null ||
          this.children[childIndex].items[this.children[childIndex].selectedMonthIndex].rate == 0
        ) {
          this.children[childIndex].selectedMonthIndex = this.children[childIndex].selectedMonthIndex + 1;
        }
        this.children[childIndex].showMonthSelector = true;
      }
      // if (childsAgeCategory === CHILDCARE_TYPE_PRESCHOOL) {
      //   this.children[childIndex].careSchedule = 'Part Time';
      // }
    },
    setRatesForMonths(childIndex) {
      if (this.selectedFacility.approvedFeesByChildAgeCategory != undefined) {
        this.children[childIndex].items[0].rate = this.approvedFeesByCategory.approvedFeeApr;
        this.children[childIndex].items[1].rate = this.approvedFeesByCategory.approvedFeeMay;
        this.children[childIndex].items[2].rate = this.approvedFeesByCategory.approvedFeeJun;
        this.children[childIndex].items[3].rate = this.approvedFeesByCategory.approvedFeeJul;
        this.children[childIndex].items[4].rate = this.approvedFeesByCategory.approvedFeeAug;
        this.children[childIndex].items[5].rate = this.approvedFeesByCategory.approvedFeeSep;
        this.children[childIndex].items[6].rate = this.approvedFeesByCategory.approvedFeeOct;
        this.children[childIndex].items[7].rate = this.approvedFeesByCategory.approvedFeeNov;
        this.children[childIndex].items[8].rate = this.approvedFeesByCategory.approvedFeeDec;
        this.children[childIndex].items[9].rate = this.approvedFeesByCategory.approvedFeeJan;
        this.children[childIndex].items[10].rate = this.approvedFeesByCategory.approvedFeeFeb;
        this.children[childIndex].items[11].rate = this.approvedFeesByCategory.approvedFeeMar;
      }
    },
    onChangeParentFeeFrequency(childIndex) {
      this.children[childIndex].approvedFee = undefined;
      this.children[childIndex].isActive = false;
      this.children[childIndex].selectedCareType = [];
    },
    getApprovedRatesByMonth: function (childAgeCategory) {
      for (let i in this.selectedFacility.approvedFeesByChildAgeCategory) {
        if (this.selectedFacility.approvedFeesByChildAgeCategory[i].childCareCategory == childAgeCategory) {
          return this.selectedFacility.approvedFeesByChildAgeCategory[i];
        }
      }
    },
    clickForOffSlider(key, childIndex) {
      this.children[childIndex].isActive = this.children[childIndex].isActive ? false : true;
      this.children[childIndex].clicked = true;
      this.children[childIndex].approvedFee =
        this.children[childIndex].items[this.children[childIndex].selectedMonthIndex].rate;
      this.children[childIndex].parentFeeFrequency = this.children[childIndex].feeFrequency;
      this.children[childIndex].btnDisabled = false;
    },
    focusAwayFromOnSlider(childIndex) {
      this.children[childIndex].approvedFee =
        this.children[childIndex].items[this.children[childIndex].selectedMonthIndex].rate;
      this.children[childIndex].parentFeeFrequency = this.children[childIndex].feeFrequency;
      this.$refs.hiddenButton[childIndex].$el.focus();
    },
    /* Set the current month value for the month select slider.. this will show the current month centered in the component. */
    setDefaultForMonthPicker() {
      let currentMonth = new Date().getMonth() - 3; //slider starts with index 0 being april, so offset by -3
      if (currentMonth < 0) {
        currentMonth = currentMonth + 12; //account for negative values
      }
      for (let i in this.children) {
        this.children[i].selectedMonthIndex =
          this.children[i].selectedMonthIndex != null ? this.children[i].selectedMonthIndex : currentMonth;
      }
    },
    decimalExists: function (n) {
      if (n != null && n != undefined) {
        return n - Math.floor(n) !== 0;
      }
    },
  },
};
</script>

<style>
.verticalAlignFlexbox {
  display: flex !important;
  align-content: center !important;
  justify-content: center !important;
  align-items: center !important;
}
.fa-caret-down::before {
  color: #0fc3ed !important;
}
.tooltip {
  border-radius: 50% !important;
  height: 30px !important;
  width: 30px !important;
  min-width: 30px !important;
  text-align: center !important;
  background-color: #7b2ee5 !important;
}
.bounce-enter-active {
  animation: bounce-in 0.2s;
}
span.banner-title {
  position: absolute;
  bottom: 30px;
  left: 45px;
  color: white;
  font-size: 24px;
}
.v-input,
.v-select-list {
  font-size: 16px !important;
}
div.v-select__selection.v-select__selection--comma {
  line-height: 20px !important;
}
.banner-title-heading {
  font-size: 32px !important;
}
.estimator-label {
  padding-left: 34px;
  padding-top: 20px;
  color: #7b7c7e;
  font-weight: 600;
  font-size: 16px;
  text-align: left;
}
.v-toolbar-title {
  font-size: 14px !important;
  color: white;
  font-weight: 600;
}
.v-list-item-title {
  font-size: 14px !important;
}
.v-list-item__content {
  text-align: center !important;
  display: flex;
  align-items: center;
}
.v-list-item-title {
  text-align: left !important;
}

.v-toolbar-title__placeholder {
  overflow: visible !important;
  white-space: normal !important;
  text-overflow: clip !important;
}

.bounce-leave-active {
  animation: bounce-in 0.1s reverse;
}
.results-label {
  color: white;
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  background-color: #431782;
  word-break: normal;
}

@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

.v-card {
  overflow-wrap: inherit;
  overflow: hidden;
}
.month-card {
  border: 1px solid grey !important;
}
.hidden-btn:focus::before {
  opacity: 0 !important;
}
.hidden-btn2 {
  min-width: 5px !important;
  height: 5px !important;
}
.no-hover:before {
  display: none;
}
.v-data-footer__select {
  text-align: left !important;
}

.v-text-field__details {
  overflow: visible;
}

div.v-slide-group__prev.v-slide-group__prev--disabled span i {
  caret-color: #7b7c7e !important;
  color: #7b7c7e !important;
}

div.v-slide-group__next.v-slide-group__next--disabled span i {
  caret-color: #7b7c7e !important;
  color: #7b7c7e !important;
}

.purple-text {
  color: rgb(156, 39, 176);
}

.tooltip-text {
  color: white !important;
  background-color: #68449a !important;
}

.fee-frequency-label {
  color: #313131;
  font-size: 13px;
}
</style>
