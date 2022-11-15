<template>
  <v-container class="py-0">
    <v-overlay :value="loading">
      <v-progress-circular
        indeterminate
        size="64"
      ></v-progress-circular>
    </v-overlay>
    <v-form ref="form">
      <v-row justify="center">
        <v-col cols="12" class="pt-0" align="center">
          <v-img
            :src="require('../assets/images/estimator image.jpg')"
            max-height="300"
            max-width="1448" >
          </v-img>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col cols="10">
          <v-card elevation="0" color="#7B2EE5">
            <v-row>
              <v-col cols="2" class="pb-0 text-center">
                <v-icon
                  size="80"
                  color="white"
                  class="pl-3">
                  mdi-alert-circle
                </v-icon>
              </v-col>
              <v-col cols="10" class="pt-7" style="font-size:14px;color:white;margin-left:-18px;">
                The estimation provided in this service is <strong><u>not</u></strong> a guarantee of payments. The estimation does not take into account all of your circumstances and <strong><u>should be used as a guide only.</u></strong>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="pt-0" style="font-size:18px;color:white;text-align:center;">
                Are you a parent or provider?
              </v-col>
            </v-row>
            <v-row>
              <v-col class="text-center pt-0 pb-4">
                <v-btn @click="question1('Parent')" :color="(this.isParent) ? '#431782': 'white'" class="pr-8 pl-8" :style="'color:'+(this.isParent?'white':'#7B2EE5')+';font-size:16px;margin-right:28px'">Parent</v-btn>
                <v-btn @click="question1('Provider')" :color="(this.isProvider) ? '#431782': 'white'" class="pr-6 pl-6" :style="'color:'+(this.isProvider?'white':'#7B2EE5')+';font-size:16px;'">Provider</v-btn>
              </v-col>
            </v-row>
            <div v-show="isParent || isProvider">
              <v-row>
                <v-col class="pl-8 pt-0" style="color:white;font-size:15px">
                  Instructions:
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="1" class="pl-8 pt-0 text-right" style="color:white">
                  1.
                </v-col>
                <v-col cols="11" class="pl-8 pt-0" style="color:white">
                  This estimator below calculates child care cost savings after the Child Care Fee Reduction Initiative (CCFRI). More information on CCFRI eligibility is available on our <a href="https://www2.gov.bc.ca/gov/content?id=77241B9EE085467F94219D69F0008B29#eligibility
" target="_blank" style="color:#0FC3ED"><u>website</u></a>.
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="1" class="pl-8 pt-0 text-right" style="color:white">
                  2.
                </v-col>
                <v-col cols="10" class="pl-8 pt-0" style="color:white">
                  <div v-show="isParent">
                    We recommend you use the 'Optional Facility Search' to find your childcare provider. If you cannot find your provider, contact them directly for the <strong>approved full-time parent fee before fee reduction is applied.</strong>
                  </div>
                  <div v-show="isProvider">
                    You may use the 'Optional Facility Search' to find your facility. If you cannot find your facility, reference your facility's Program Confirmation Form for <strong>your approved full-time parent fee before fee reduction is applied.</strong>
                  </div>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="1" class="pl-8 pt-0 text-right" style="color:white">
                  3.
                </v-col>
                <v-col cols="11" class="pl-8 pt-0 pb-4" style="color:white">
                  Use the <strong>'Estimate your savings'</strong> button at the bottom of the tool.
                </v-col>
              </v-row>
              <v-row><v-col class="pa-1"></v-col></v-row>
            </div>
          </v-card>
        </v-col>
      </v-row>
  <!-- ******************************************************************************************************************************************************** -->
  <!-- **** FACILTY SEARCH COMPONENT  ************************************************************************************************************************* -->
        <FacilitySearch v-show="isParent || isProvider" @selectedFacility="setSelectedFacility($event)"/>
  <!-- ******************************************************************************************************************************************************** -->
      <v-row justify="center" v-show="isParent || isProvider">
        <v-col cols="10">
        <v-card elevation="4">
          <v-row>
            <v-col class="py-0">
              <v-card-title style="color:white;font-style:normal;font-weight:700;font-family:BCSans;font-size:20px;padding-top:8px;padding-bottom:8px;background-color:#431782;">Facility Details</v-card-title>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="6" class="estimator-label">
              <span style="color: #313131">
                Total number of children</span>
            </v-col>
            <v-col cols="4" class="pb-0">
              <v-text-field 
                id="totNumberOfChildren"
                @change="updateNumberOfChildSubForms"
                @keypress="numberFilter"
                v-model="totalNumberOfChildren"
                outlined
                required
                :rules="rulesTotalNumChildren"
                dense>
              </v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="py-0">
              <v-divider></v-divider>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="5" class="estimator-label">
              <span style="color: #313131">
                Type of care</span>
            </v-col>
            <v-col cols="1" style="padding-bottom:0px;padding-top:16px;padding-left:0px">
              <v-tooltip top color="#68449A">
                <template v-slot:activator="{ on, attrs }">
                  <v-card v-bind="attrs" v-on="on" class="tooltip">
                    <v-icon class="pt-1" small color="white">mdi-help</v-icon>
                  </v-card>
                </template>
                <span>
                      Licensed group child care takes place in a community-based<br/>
                      facility or centre. Licensed family child care takes place<br/>
                      in the child care provider's personal residence.
                </span>
              </v-tooltip>
            </v-col>
            <v-col cols="4" class="pb-0">
              <v-select
                id="typeOfCare"
                v-model="form.typeOfCare"
                :items="this.typeOfCareList"
                outlined
                required
                :rules="rulesTypeOfCare"
                dense>
              </v-select>
            </v-col>
          </v-row>
  <!-- ******************************************************************************************************************************************************** -->
  <!-- **** CHILD X SUB SECTION  ****************************************************************************************************************************** -->
  <!-- ******************************************************************************************************************************************************** -->
          <div v-for="child in this.children" :key="child.number">
            <v-card-title style="color:white;font-style:normal;font-weight:700;font-family:BCSans;font-size:20px;padding-top:8px;padding-bottom:8px;background-color: #431782;">Child {{child.number}}</v-card-title>
              <v-row>
                <v-col cols="5" class="estimator-label">
                  <span style="color: #313131">
                    Child's age category
                  </span>
                </v-col>
                <v-col cols="1" style="padding-bottom:0px;padding-top:16px;padding-left:0px">
                  <v-tooltip top color="#68449A">
                    <template v-slot:activator="{ on, attrs }">
                    <v-card v-on="on" class="tooltip">
                      <v-icon class="pt-1" small color="white">mdi-help</v-icon>
                    </v-card>
                  </template>
                    <span>Parents can ask their child care provider if they are unsure<br/>which age category to select.</span>
                  </v-tooltip>
                </v-col>
                <v-col cols="4" class="pb-0">
                  <v-select
                    id="childAgeCategory"
                    style="font-size:16px !important"
                    v-model="child.childAgeCategory"
                    :items="childAgeCategoryList"
                    @change="setApprovedParentFee(child.childAgeCategory, child.number-1)"
                    outlined
                    dense
                    required
                    :rules="rulesChildsAgeCategory">
                  </v-select>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="py-0">
                  <v-divider></v-divider>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="5" class="estimator-label">
                  <span style="color: #313131">
                    Full or part time
                  </span>
                </v-col>
                <v-col cols="1" style="padding-bottom:0px;padding-top:16px;padding-left:0px">
                  <v-tooltip top color="#68449A">
                    <template v-slot:activator="{ on, attrs }">
                    <v-card v-on="on" class="tooltip">
                      <v-icon class="pt-1" small color="white">mdi-help</v-icon>
                    </v-card>
                  </template>
                    <span>For part time care estimates, please select the typical schedule of<br/>
                          half days (4 hours or less) and full days (more than 4 hours). The<br/>
                          maximum benefit rates for CCFRI are based on 5 full days per week<br/> (full time care).</span>
                  </v-tooltip>
                </v-col>
                <v-col cols="4" class="pb-0">
                  <v-select
                    id="careSchedule"
                    v-model="child.careSchedule"
                    :items="['Full Time', 'Part Time']"
                    outlined
                    dense
                    required
                    :rules="rulesCaresSchedule"
                  >
                  </v-select>
                </v-col>
              </v-row>
  <!-- ******************************************************************************************************************************************************** -->
  <!-- **** CHILD X: PART TIME CARE SCHEDULE ****************************************************************************************************************** -->
  <!-- ******************************************************************************************************************************************************** -->          
              <v-row v-if="child.careSchedule == 'Part Time'">
                <v-col class="d-flex wrap justify-center" style="padding-top:0px;padding-bottom:16px">
                  <div class="d-flex wrap" style="align-content:center;flex-wrap:wrap;">
                  <v-card>
                    <v-toolbar color="#431782">
                        <v-spacer></v-spacer>
                        <v-toolbar-title>Monday</v-toolbar-title>
                        <v-spacer></v-spacer>
                      </v-toolbar>
                      <v-list>
                        <v-list-item-group
                          v-model="child.selectedCareType[0]"
                          active-class="purple--text"
                        >
                          <div v-for="(item, index) in careTypes" v-bind:key="item.type">
                            <v-list-item>
                              <template v-slot:default="{ active }">
                                <v-list-item-content>
                                  <v-list-item-title v-text="item.type"></v-list-item-title>
                                </v-list-item-content>
                  
                              </template>
                            </v-list-item>
                  
                            <v-divider
                              v-if="index < careTypes.length - 1"
                              :key="index"
                            ></v-divider>
                          </div>
                        </v-list-item-group>
                      </v-list>
                    </v-card>

                    <v-spacer></v-spacer>
                    
                    <v-card>
                      <v-toolbar 
                        color="#431782"
                      >
                        <v-spacer></v-spacer>
                        <v-toolbar-title>Tuesday</v-toolbar-title>
                        <v-spacer></v-spacer>
                      </v-toolbar>
                  
                      <v-list>
                        <v-list-item-group
                          v-model="child.selectedCareType[1]"
                          active-class="purple--text"
                        >
                          <div v-for="(item, index) in careTypes" v-bind:key="item.type">
                            <v-list-item>
                              <template v-slot:default="{ active }">
                                <v-list-item-content>
                                  <v-list-item-title v-text="item.type"></v-list-item-title>
                                </v-list-item-content>
                              </template>
                            </v-list-item>
                  
                            <v-divider
                              v-if="index < careTypes.length - 1"
                              :key="index"
                            ></v-divider>
                          </div>
                        </v-list-item-group>
                      </v-list>
                    </v-card>
                    <v-spacer></v-spacer>
                    
                    <v-card max-width="">
                      <v-toolbar
                        color="#431782"
                      >
                      <v-spacer></v-spacer>
                      <v-toolbar-title>Wednesday</v-toolbar-title>
                      <v-spacer></v-spacer>
                    </v-toolbar>
                      
                      <v-list>
                        <v-list-item-group
                          v-model="child.selectedCareType[2]"
                          active-class="purple--text"
                        >
                          <div v-for="(item, index) in careTypes" v-bind:key="item.type">
                            <v-list-item>
                              <template v-slot:default="{ active }">
                                <v-list-item-content>
                                  <v-list-item-title v-text="item.type"></v-list-item-title>
                                </v-list-item-content>
                              </template>
                            </v-list-item>
                  
                            <v-divider
                              v-if="index < careTypes.length - 1"
                              :key="index"
                            ></v-divider>
                          </div>
                        </v-list-item-group>
                      </v-list>
                    </v-card>
                    <v-spacer></v-spacer>


                    <v-card max-width="">
                      <v-toolbar
                        color="#431782"
                      >
                      <v-spacer></v-spacer>
                      <v-toolbar-title>Thursday</v-toolbar-title>
                      <v-spacer></v-spacer>
                    </v-toolbar>
                      <v-list>
                        <v-list-item-group
                          v-model="child.selectedCareType[3]"
                          active-class="purple--text"
                        >
                          <div v-for="(item, index) in careTypes" v-bind:key="item.type">
                            <v-list-item>
                              <template v-slot:default="{ active }">
                                <v-list-item-content>
                                  <v-list-item-title v-text="item.type"></v-list-item-title>
                                </v-list-item-content>
                              </template>
                            </v-list-item>
                  
                            <v-divider
                              v-if="index < careTypes.length - 1"
                              :key="index"
                            ></v-divider>
                          </div>
                        </v-list-item-group>
                      </v-list>
                    </v-card>
                    <v-spacer></v-spacer>

                    <v-card max-width="">
                      <v-toolbar
                        color="#431782"
                      >
                      <v-spacer></v-spacer>
                      <v-toolbar-title>Friday</v-toolbar-title>
                      <v-spacer></v-spacer>
                    </v-toolbar>
                      <v-list>
                        <v-list-item-group
                          v-model="child.selectedCareType[4]"
                          active-class="purple--text"
                        >
                          <div v-for="(item, index) in careTypes" v-bind:key="item.type">
                            <v-list-item>
                              <template v-slot:default="{ active }">
                                <v-list-item-content>
                                  <v-list-item-title v-text="item.type"></v-list-item-title>
                                </v-list-item-content>
                              </template>
                            </v-list-item>
                  
                            <v-divider
                              v-if="index < careTypes.length - 1"
                              :key="index"
                            ></v-divider>
                          </div>
                        </v-list-item-group>
                      </v-list>
                    </v-card>
                    <v-spacer></v-spacer>
                    <v-card max-width="">
                      <v-toolbar
                        color="#431782"
                      >
                        <v-spacer></v-spacer>
                        <v-toolbar-title>Saturday</v-toolbar-title>
                        <v-spacer></v-spacer>
                      </v-toolbar>
                      <v-list>
                        <v-list-item-group
                          v-model="child.selectedCareType[5]"
                          active-class="purple--text"
                        >
                          <div v-for="(item, index) in careTypes" v-bind:key="item.type">
                            <v-list-item>
                              <template v-slot:default="{ active }">
                                <v-list-item-content>
                                  <v-list-item-title v-text="item.type"></v-list-item-title>
                                </v-list-item-content>
                              </template>
                            </v-list-item>
                  
                            <v-divider
                              v-if="index < careTypes.length - 1"
                              :key="index"
                            ></v-divider>
                          </div>
                        </v-list-item-group>
                      </v-list>
                    </v-card>
                    <v-spacer></v-spacer>

                    <v-card max-width="">
                      <v-toolbar
                        color="#431782"
                      >
                      <v-spacer></v-spacer>
                      <v-toolbar-title>Sunday</v-toolbar-title>
                      <v-spacer></v-spacer>
                    </v-toolbar>
                      <v-list>
                        <v-list-item-group
                          v-model="child.selectedCareType[6]"
                          active-class="purple--text"
                        >
                          <div v-for="(item, index) in careTypes" v-bind:key="item.type">
                            <v-list-item>
                              <template v-slot:default="{ active }">
                                <v-list-item-content>
                                  <v-list-item-title v-text="item.type"></v-list-item-title>
                                </v-list-item-content>
                              </template>
                            </v-list-item>
                  
                            <v-divider
                              v-if="index < careTypes.length - 1"
                              :key="index"
                            ></v-divider>
                          </div>
                        </v-list-item-group>
                      </v-list>
                    </v-card>
                    <v-spacer></v-spacer>
                  </div>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="py-0">
                  <v-divider></v-divider>
                </v-col>
              </v-row>
              <v-row v-if="child.showMonthSelector">
                <v-col cols="5" class="estimator-label">
                  <span style="color: #313131">
                    Select a month (Optional)
                  </span>
                </v-col>
                <v-col cols="7" md=1 style="padding-bottom:0px;padding-top:16px;padding-left:0px">
                  <v-tooltip top color="#68449A">
                    <template v-slot:activator="{ on, attrs }">
                    <v-card v-on="on" class="tooltip">
                      <v-icon class="pt-1" small color="white">mdi-help</v-icon>
                    </v-card>
                  </template>
                    <span>You can select a month starting Dec 2022. Parent fee frequency and<br/> approved full-time parent fee before reduction applied will be populated.</span>
                  </v-tooltip>
                </v-col>
                <v-col cols="6" class="flex pt-1 pb-0" style="margin-bottom:-18px;">
                  <template>
                    <v-sheet class="flex px-0 py-0 text-center" elevation="0" max-width="337" min-width="150" style="float:left">
<!-- ****************************************************************************************************************************************************************-->
<!-- *** The following slider is for the ON (selected) state ********************************************************************************************************-->
<!-- ****************************************************************************************************************************************************************-->
                      <span style="color:#313131;font-size:15px;font-weight:bold;font-family:BCSans;">{{(child.programYear != undefined) ? child.programYear.slice(0,7) : ''}}</span>
                      <v-slide-group id="monthSelectorOn" v-if="child.isActive" v-model="child.selectedMonthIndex" class="pa-0" mandatory center-active show-arrows active-class="" @change="focusAwayFromOnSlider(child.number-1)">
                        <template v-slot:next>
                          <span class="fill-height pt-1 pr-3">
                            <v-icon ref="rchevron" color="#431782" x-large>mdi-chevron-right</v-icon>
                          </span>
                        </template>
                        <template v-slot:prev>
                          <span class="estimator-label fill-height pt-1 pr-7" align="right" style="font-size:13px;">
                            <v-icon color="#431782" x-large>mdi-chevron-left</v-icon>
                            <span style="color:#313131">
                                  {{child.feeFrequency}}&nbsp;
                            </span>
                          </span>
                        </template>
                        <v-slide-item v-for="n in child.items" :key="n.id" v-slot="{ active, toggle }">
                          <v-card :disabled="(n.rate == 0 || n.rate == null || n.rate == 'N/A') ? true : false" :color="active ? '#F3E6F6' : '#FFFFFF'" class="ma-1 fill-height" :elevation="active ? 4 : 0" height="67" width="70" @click="toggle(clickForOnSlider(n.id, child.number-1))">
                            <v-row style="" justify="center">
                              <v-col align="center" style="padding-top:4px;padding-bottom:5px;margin-top:-2px;">
                                <span :style="'color:'+(active ? 'white' : 'white')+';font-family:Lucida Grande,monospace;background-color:#431782;font-size:17px;font-weight:bold;padding-bottom:6px;padding-left:px;padding-right:19px;padding-top:4px'">
                                {{n.month}}
                                </span>
                              </v-col>
                            </v-row>
                            <v-row style="font-size:14px;" justify="center">
                              <v-col align="center" style="padding-top:3px;">
                                <span :style="'color:'+(active ? '#9D2AB1' : 'black')">
                                  {{(n.rate==null || n.rate==undefined) ? 'N/A' : '$'+n.rate}}
                                </span>
                              </v-col>
                            </v-row>
                          </v-card>
                        </v-slide-item>
                      </v-slide-group>
<!-- ****************************************************************************************************************************************************************-->
<!-- *** The following slider is for the OFF (unselected) state *****************************************************************************************************-->
<!-- ****************************************************************************************************************************************************************-->
                      <v-slide-group id="monthSelectorOff" v-if="!child.isActive" v-model="child.selectedMonthIndex" class="pa-0" mandatory center-active show-arrows active-class="">
                        <template v-slot:next>
                          <span class="fill-height pt-1 pr-3">
                            <v-icon color="#431782" x-large>mdi-chevron-right</v-icon>
                          </span>
                        </template>
                        <template v-slot:prev>
                              <span class="estimator-label fill-height pt-1 pr-7" align="right" style="font-size:13px;">
                                <v-icon color="#431782" x-large>mdi-chevron-left</v-icon>
                                <span style="color:#313131;font-family:BCSans;">
                                  {{child.feeFrequency}}&nbsp;
                                </span>
                              </span>
                        </template>
                        <v-slide-item v-for="n in child.items" :key="n.id" v-slot="{ active, toggle }">
                        <v-card :disabled="(n.rate == 0 || n.rate == null || n.rate == 'N/A') ? true : false" :color="active ? '#FFFFFF': '#FFFFFF'" class="ma-1 fill-height" :elevation="active ? 0 : 0" height="67" width="70" @click="toggle(clickForOffSlider(n.id, child.number-1))">
                          <v-row style="" justify="center">
                            <v-col align="center" style="padding-top:3px;padding-bottom:5px;margin-top:-2px;">
                              <span style="font-family:Lucida Grande,monospace;color:white;background-color:#431782;font-size:17px;font-weight:bold;padding-bottom:6px;padding-left:20px;padding-right:19px;padding-top:4px">
                                {{n.month}}
                              </span>
                            </v-col>
                          </v-row>
                          <v-row style="font-size:14px;" justify="center">
                            <v-col align="center" style="padding-top:3px;">
                              <span style="">
                                {{(n.rate==null || n.rate==undefined) ? 'N/A' : '$'+n.rate}}
                              </span>
                            </v-col>
                          </v-row>
                        </v-card>
                        </v-slide-item>
                      </v-slide-group>
                      <v-btn class="hidden-btn hidden-btn2 no-hover pa-0" ref="hiddenButton" elevation="0" color="white" style=""></v-btn>
                    </v-sheet>
                  </template>
  <!-- ******************************************************************************************************************************************************** -->
                </v-col>
              </v-row>
              <v-row v-if="child.showMonthSelector">
                <v-col class="py-0">
                  <v-divider></v-divider>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="5" class="estimator-label">
                  <span style="color: #313131">
                    Parent fee frequency
                  </span>
                </v-col>
                <v-col cols="1" style="padding-bottom:0px;padding-top:16px;padding-left:0px">
                  <v-tooltip top color="#68449A">
                    <template v-slot:activator="{ on, attrs }">
                    <v-card v-on="on" class="tooltip">
                      <v-icon class="pt-1" small color="white">mdi-help</v-icon>
                    </v-card>
                  </template>
                    <span>Select whether parent fees are charged daily, weekly, or monthly.</span>
                  </v-tooltip>
                </v-col>
                <v-col cols="4" class="pb-0">
                  <v-select
                    id="parentFeeFrequency"
                    v-model="child.parentFeeFrequency"
                    :items="parentFeeFrequencyList"
                    required
                    :rules="rulesParentFeeFrequency"
                    @change="onChangeParentFeeFrequency(child.number-1)"
                    outlined
                    dense>
                  </v-select>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="py-0">
                  <v-divider></v-divider>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="5" style="padding-bottom:0px;padding-top:16px;">
                  <div style="padding-left:24px;color:#7B7C7E;font-family:BCSans;font-weight:600;font-size:16px">
                    <span style="color: #313131">
                      Approved full-time parent fee before fee reduction applied
                    </span>
                  </div>
                </v-col>
                <v-col cols="1" style="padding-bottom:0px;padding-top:16px;padding-left:0px">
                  <v-tooltip top color="#68449A">
                    <template v-slot:activator="{ on, attrs }">
                    <v-card v-on="on" class="tooltip">
                      <v-icon class="pt-1" small color="white">mdi-help</v-icon>
                    </v-card>
                   </template>
                    <span>Enter the facility's highest full-time parent fee approved by the Ministry,<br/> before the fee reduction is applied. Child care providers can reference this<br/> information on their approved Program Confirmation Form. Parents<br/> can use Optional Facility Search above or ask their child care provider if<br/> they are unsure which fee to enter.</span>
                  </v-tooltip>
                </v-col>
                <v-col cols="4" class="pb-0">
                  <v-text-field
                      id="approvedFee"
                      @keypress="currencyFilter"
                      @change="truncateLeadingZeros(child.number)"
                      v-model="child.approvedFee"
                      :rules="rulesApprovedFee(child.approvedFee)"
                      outlined
                      prefix="$"
                      required
                      dense>
                  </v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="py-0">
                  <v-divider></v-divider>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="5" style="padding-bottom:0px;padding-top:16px;">
                  <div style="padding-left:24px;color:#7B7C7E;font-family:BCSans;font-weight:600;font-size:16px">
                    <span v-if="child.careSchedule == 'Full Time'" style="color: #313131">
                      Actual parent fee before reduction applied (Optional)
                    </span>
                    <span v-else-if="child.careSchedule == 'Part Time' && (getOccurrence(child.selectedCareType, 2) >= 5)" style="color: #313131">
                      Actual parent fee before reduction applied (Optional)
                    </span>
                    <span v-else>
                      <span style="color: #313131">
                        Actual parent fee before reduction applied
                      </span>
                    </span>
                  </div>
                </v-col>
                <v-col cols="1" style="padding-bottom:0px;padding-top:16px;padding-left:0px">
                  <v-tooltip top color="#68449A">
                    <template v-slot:activator="{ on, attrs }">
                    <v-card v-on="on" class="tooltip">
                      <v-icon class="pt-1" small color="white">mdi-help</v-icon>
                    </v-card>
                  </template>
                    <span>Enter the parent fee before any reductions or benefits are<br/> applied. This fee may be different from the CCFRI-approved<br/> full-time parent fee if it is a part-time fee, discounted fee,<br/> or inclusive of optional fees.</span>
                  </v-tooltip>
                </v-col>
                <v-col cols="4" class="pb-0">
                  <v-text-field
                    id="partTimeFee" 
                    @keypress="currencyFilter"
                    @change="truncateLeadingZeros(child.number)"
                    v-model="child.partTimeFee"
                    :rules="validateParentFee(child, child.partTimeFee)"
                    outlined
                    prefix="$"
                    required
                    dense>
                  </v-text-field>
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
                      <v-btn style="color:white;font-family:BCSans;font-weight:600;font-family:BCSans;font-size:16px;padding-left:60px;padding-right:60px;"
                        class="ma-2"
                        color="#0483AF"
                        @click="estimateTheBenefit">
                        Estimate your savings
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>



          <div v-show="showEstimatorResults">
            <v-card-title style="color:white;font-style:normal;font-weight:700;font-family:BCSans;font-size:20px;padding-top:8px;padding-bottom:8px;background-color:#431782;">Results</v-card-title>
            <v-row>
              <v-col cols="12">
                <div style="padding-left:24px;color:#313131;font-family:BCSans;font-weight:500;font-size:16px">
                  Based on the information you have provided, you may be eligible for the following monthly ChildCareBC fee reduction:
                </div>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="1"></v-col>
              <v-col cols="10">
                <v-card elevation="4" class="">
                  <v-row class="mx-0">
                    <v-col cols="2" class="pr-0 pl-0" style="padding-top:0%;padding-bottom:0px;">
                        <v-card-title class="results-label pt-2 pb-2 pl-9 fill-height">Child</v-card-title>
                    </v-col>
                    <v-col cols="5" class="pl-0 pr-0" style="padding-top:0%;padding-bottom:0px;">
                        <v-card-title class="results-label text-wrap pt-2 pb-2 fill-height">
                          Estimated child care savings
                        </v-card-title>
                    </v-col>
                    <v-col cols="5" class="pl-0 pr-0" style="padding-top:0%;padding-bottom:0px;background-color:#431782;">
                        <v-card-title class="results-label text-wrap pt-2 pb-2 fill-height" >
                          Estimated parent fee after reduction
                      </v-card-title>
                    </v-col>
                  </v-row>
                  <div v-for="result in results" :key="result.number">
                    <v-row class="py-3 mx-0">
                      <v-col cols="2" class="pr-0" style="padding-bottom:2px;padding-top:2px">
                        <div style="padding-left:24px;font-family:BCSans;font-weight:500;font-size:16px;">
                        {{result.number}}
                        </div>
                      </v-col>
                        <v-col cols="5" class="pl-2" style="padding-bottom:2px;padding-top:2px">
                          <div class="d-flex">
                          <div style="padding-left:12px;color:#431782;font-family:BCSans;font-weight:bold;font-size:15px;">
                            {{result.feeFrequency=='Daily'? '$'+(display2Decimals(result.reductionAmountPerChild/20))+'/day ($'+display2Decimals(result.reductionAmountPerChild)+'/month)' : ''}}
                            {{result.feeFrequency=='Weekly'? '$'+(display2Decimals(result.reductionAmountPerChild/4))+'/week ($'+display2Decimals(result.reductionAmountPerChild)+'/month)' : ''}}
                            {{result.feeFrequency=='Monthly'? '$'+(display2Decimals(result.reductionAmountPerChild))+'/month' : ''}}
                          </div>
                      </div>
                      </v-col>
                        <v-col cols="5" class="pl-2" style="padding-bottom:2px;padding-top:2px">
                        <div style="padding-left:12px;color:#0483AF;font-family:BCSans;font-weight:bold;font-size:15px">
                          {{result.feeFrequency=='Daily'? '$'+(display2Decimals(result.actualParentFeePerChild/20))+'/day ($'+display2Decimals(result.actualParentFeePerChild)+'/month)' : ''}}
                          {{result.feeFrequency=='Weekly'? '$'+(display2Decimals(result.actualParentFeePerChild/4))+'/week ($'+display2Decimals(result.actualParentFeePerChild)+'/month)' : ''}}
                          {{result.feeFrequency=='Monthly'? '$'+display2Decimals(result.actualParentFeePerChild)+'/month' : ''}}
                        </div>
                      </v-col>
                    </v-row>
                  </div>
                </v-card>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" class="text-center">
                For additional funding support, find out more about <a href="https://www2.gov.bc.ca/gov/content/family-social-supports/caring-for-young-children/child-care-funding/child-care-benefit" target="_blank" style="color:#0FC3ED"><u>Affordable Child Care Benefit.</u></a>
              </v-col>
            </v-row>
          </div>
        </v-card>
        </v-col>
        <v-row justify="center">
          <v-btn
            color="#431782"
            style="color:white;font-size:16px;"
            href="https://bcmcf.ca1.qualtrics.com/jfe/form/SV_3qjPIZfTboGpeom"
            target="_blank">We want your feedback
          </v-btn>
        </v-row>
      </v-row>
    </v-form>
  </v-container>
</template>
<script>

import FacilitySearch from './FacilitySearch.vue';

export default {
  components: { FacilitySearch },
  props: {},
  data() {
    return {
      isParent: false,
      isProvider: false,
      childAgeCategory: '',
      childIndex: '',
      selectedFacility: [],
      skipApprovedFeeValidation: false,
      GROUP_REDUCTION_RATES: null,
      FAMILY_REDUCTION_RATES: null,
      results: null,
      showEstimatorResults: false,
      showPartTimeCareSchedule: false,
      loading: false,
      approvedFeesByCategory: [],
      totalNumberOfChildren: '1',
      children: null,
      form: {
        firstName: '',
        lastName: '',
        email: '',
        careProviderSearch: '',
        typeOfCare: ''
      },
      careTypes: [
        { type: 'No Care' },
        { type: 'Half Day' },
        { type: 'Full Day' }
      ],
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
      parentFeeFrequencyList: [
        'Daily',
        'Weekly',
        'Monthly'
      ],
      typeOfCareList: [
        'Licensed Group',
        'Licensed Family'
      ],
      childAgeCategoryList: [],
      rulesTypeOfCare: [
        (v) => !!v || 'Type of care is required'
      ],
      rulesTotalNumChildren: [
        (v) => !!v || 'Total number of children is required',
        (v) => v <= 25 || 'Total number of children must be less than 26',
        (v) => v >= 1 || 'Total number of children must be 1 or more'
      ],
      rulesCaresSchedule: [
        (v) => !!v || 'Care schedule is required'
      ],
      rulesChildsAgeCategory: [
        (v) => !!v || 'Child\'s age category is required'
      ],
      /*
      rulesApprovedFee: [
        (v) => !!v || 'Approved full-time parent fee before fee reduction applied is required',
        (v) => v <= 9999 || 'Maximum Approved full-time parent fee before fee reduction applied is $9999.00',
        (v) => v > 0 || 'Approved full-time parent fee before fee reduction applied must be greater than $0'
      ],*/
      rulesParentFeeFrequency: [
        (v) => !!v || 'Parent fee frequency is required'
      ],
    };
  },
  computed: {},
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
      this.isParent = (userType == 'Parent') ? true : false;
      this.isProvider = (userType == 'Provider') ? true : false;
    },
    setSelectedFacility(e) {
      this.resetForm();
      this.selectedFacility = e;
      this.form.typeOfCare = (this.selectedFacility.accountNumber.charAt(0) == 'F') ? 'Licensed Family' : 'Licensed Group';
      this.filterChildsAgeCategory();
    },
    rulesApprovedFee(v) {
      if (!this.skipApprovedFeeValidation) {
        if (v == '' || v == undefined) {
          return ['Approved full-time parent fee before fee reduction applied is required'];
        } else if (v >= 9999) {
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
      this.$refs.form.resetErrorBag(); // necessary to remove validation errors after the field values are removed
      this.$refs.form.resetValidation();
    },
    validateParentFee(child, v) {
      if (v && v > 9999) {
        return ['Maximum Actual parent fee before reduction applied is $9999.00'];
      }
      if (child.careSchedule == 'Part Time' && !this.isFullTime(child) && (this.getOccurrence(child.selectedCareType, 2) < 5) && !v) {
        return ['Actual parent fee before reduction applied is required'];
      }
      return [];
    },
    isFullTime(child) {
      if (child.careSchedule == 'Full Time') {
        return true;
      }
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
        }
        else if (numberOfChildren < this.children.length) {
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
        careSchedule: 'Full Time',
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
          { id: 11, month: 'Mar', rate: 0 }
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
    getReductionFloor(reductionRate, daysFullTime, daysPartTime) {
      let dailyRate = reductionRate / 20;
      return (dailyRate * daysFullTime) + (dailyRate * daysPartTime / 2);
    },
    getFullTimeMonthlyParentFee(fee, feeFrequency) {
      switch (feeFrequency) {
      case 'Daily':
        return fee * 20;
      case 'Weekly':
        return fee * 4;
      case 'Monthly':
        return fee;
      }
      console.log('getFullTimeMonthlyParentFee-Unable to determine feeFrequency:' + feeFrequency);
      return null;
    },
    getPartTimeMonthlyParentFee(fee, feeFrequency) {
      switch (feeFrequency) {
      case 'Daily':
        return fee * 20;
      case 'Weekly':
        return fee * 4;
      case 'Monthly':
        return fee;
      }
      console.log('getPartTimeMonthlyParentFee-Unable to determine feeFrequency:' + feeFrequency);
      return null;
    },
    estimateTheBenefit() { //NOSONAR
      if (this.$refs.form.validate()) {
        this.showEstimatorResults = true;
        this.results = [];
        let rateTableInfo = null;
        // Get the number of business days for the provided month...
        // const result = this.numberOfBusinessDaysByMonth.find(c => c.month === this.form.month);
        // let numberOfDaysForMonth = result.days;
        let numberOfDaysForMonth = 20; // hardcode to 20 as per new requirements
        //for (child in this.form.children) {
        for (let i = 0; i < this.children.length; i++) {
          // Get the rate table info based on the provided type of child care and childs age category...
          if (this.form.typeOfCare === 'Licensed Group') {
            rateTableInfo = this.GROUP_REDUCTION_RATES.get(this.children[i].childAgeCategory);
          }
          else if (this.form.typeOfCare === 'Licensed Family') {
            rateTableInfo = this.FAMILY_REDUCTION_RATES.get(this.children[i].childAgeCategory);
          }
          // Determine daily rate before fee reduction based on frequency of fee...
          let parentRate;
          let isChildFullTime = this.isFullTime(this.children[i]);
          if (isChildFullTime && this.children[i].partTimeFee && (+this.children[i].partTimeFee < +this.children[i].approvedFee)) {
            //If child is full time and parent fee is less than approved fee, use the parent fee
            parentRate = this.children[i].partTimeFee;
          }
          else {
            parentRate = this.children[i].approvedFee;
          }
          let dailyRate;
          switch (this.children[i].parentFeeFrequency) {
          case 'Daily':
            dailyRate = parentRate;
            break;
          case 'Weekly':
            dailyRate = parentRate / 5;
            break;
          case 'Monthly':
            dailyRate = parentRate / numberOfDaysForMonth;
            break;
          }
          // console.log('daily parent rates i: ' + dailyRate);
          // Determine the daily rates for partTime and fulltime based on the number of days in month...
          let fullTimeRateFromTable = rateTableInfo.fullTime20;
          let partTimeTotal;
          let fullTimeTotal;
          let fullTimeDailyRate;
          let totalRateReduction;
          let reductionAmountPerChild;
          let actualParentFeePerChild;
          // If care schedule is part time then determine the part/full time daily rate and part/full time totals.
          // i.e. A partime care schedule could include both parttime and fulltime days... 3 days of parttime and 2 days at fulltime.
          /**
                                * FULL TIME RATE Reduction Calculations
                                */
          // Always calculate the fulltime daily rate and fulltime total
          fullTimeDailyRate = ((dailyRate - 10) > fullTimeRateFromTable) ? fullTimeRateFromTable : (dailyRate - 10);
          fullTimeTotal = fullTimeDailyRate * 20;
          partTimeTotal = 0;
          let monthlyParentFee = this.getFullTimeMonthlyParentFee(parentRate, this.children[i].parentFeeFrequency);
          totalRateReduction = partTimeTotal + fullTimeTotal;
          totalRateReduction = Math.max(totalRateReduction, rateTableInfo.rateFloor);
          totalRateReduction = Math.min(totalRateReduction, monthlyParentFee);
          reductionAmountPerChild = totalRateReduction;
          if (this.children[i].partTimeFee) {
            monthlyParentFee = this.getFullTimeMonthlyParentFee(this.children[i].partTimeFee, this.children[i].parentFeeFrequency);
          }
          actualParentFeePerChild = monthlyParentFee - reductionAmountPerChild;
          if (!isChildFullTime) {
            /**
                                     * PART TIME RATE Reduction Calculation
                                     */
            let partTimeNumberOfDays = 0;
            let fullTimeNumberOfDays = 0;
            // Determine number of part time and full time days entered in the parttime care schedule component...
            for (let j = 0; j < this.children[i].selectedCareType.length; j++) {
              if (this.children[i].selectedCareType[j] == 1) {
                partTimeNumberOfDays = partTimeNumberOfDays + 1;
              }
              else if (this.children[i].selectedCareType[j] == 2) {
                fullTimeNumberOfDays = fullTimeNumberOfDays + 1;
              }
            }
            //multiply by 4 since there are decided on 4 weeks / month
            partTimeNumberOfDays = partTimeNumberOfDays * 4;
            fullTimeNumberOfDays = fullTimeNumberOfDays * 4;
            // console.log('reductionAmountPerChild ' + reductionAmountPerChild);
            let dailyPartTimeReductionamount = reductionAmountPerChild / 20; // 20 days per month.
            let partTimeHalfDayReductionAmount = dailyPartTimeReductionamount * partTimeNumberOfDays / 2;
            // console.log('partTimeHalfDayReductionAmount: ' + partTimeHalfDayReductionAmount + 'part time number of days ' + partTimeNumberOfDays + ' daily reduction amount ' + dailyPartTimeReductionamount);
            // partTimeDailyRate = ((dailyRate - 5) > partTimeRateFromTable) ? partTimeRateFromTable : (dailyRate - 5);
            let partTimeFullDayReductionAmount = dailyPartTimeReductionamount * fullTimeNumberOfDays;
            // console.log('partTimeFullDayReductionAmount: ' + partTimeFullDayReductionAmount);
            totalRateReduction = partTimeHalfDayReductionAmount + partTimeFullDayReductionAmount;
            let rateReductionFloor = this.getReductionFloor(rateTableInfo.rateFloor, fullTimeNumberOfDays, partTimeNumberOfDays);
            let monthlyParentFee = this.getPartTimeMonthlyParentFee(this.children[i].partTimeFee, this.children[i].parentFeeFrequency);
            //Make sure it's at least the Rate Floor amount
            totalRateReduction = Math.max(totalRateReduction, rateReductionFloor);
            //Make sure it's not over the max rate allowed ammount
            totalRateReduction = Math.min(totalRateReduction, rateTableInfo.monthlyRate);
            //Make sure it's not more than the parent fee
            totalRateReduction = Math.min(totalRateReduction, monthlyParentFee);
            let partTimeFeeFloor = (fullTimeNumberOfDays * 10) + (partTimeNumberOfDays * 7);
            partTimeFeeFloor = Math.min(partTimeFeeFloor, 200); //Fee floor should not be more than $200 / month
            // console.log('part time fee floor: ' + partTimeFeeFloor);
            //Make sure to apply minimum reduction Rate fee
            //Then apply minumum parent rate fee if possible
            if (totalRateReduction <= rateReductionFloor) {
              // if rate reduction is already at floor, cannot reduce rate reduction
              // console.log('totalRateReduction <= rateReductionFloor');
              // console.log('Rate floor: ' + rateReductionFloor);
              reductionAmountPerChild = totalRateReduction;
              actualParentFeePerChild = monthlyParentFee - reductionAmountPerChild;
            }
            else if ((monthlyParentFee - totalRateReduction) < partTimeFeeFloor) {
              //Parent fees are below fee floor, decrease rate reduction fee
              // console.log('monthlyParentFee < partTimeFeeFloor');
              // console.log('partTimeFeeFloor ' + partTimeFeeFloor);
              // console.log('Rate floor ' + rateReductionFloor);
              // console.log('(monthlyParentFee - totalRateReduction) ' + (monthlyParentFee - totalRateReduction));
              let changeRateBy = Math.min(totalRateReduction - rateReductionFloor, partTimeFeeFloor - (monthlyParentFee - totalRateReduction));
              // console.log('change rate by: ' + changeRateBy);
              reductionAmountPerChild = totalRateReduction - changeRateBy;
              actualParentFeePerChild = monthlyParentFee - reductionAmountPerChild;
            }
            else {
              // parent fee above fee floor, rate reduction above rate floor
              // console.log('else');
              // console.log('Rate floor: ' + rateReductionFloor);
              // console.log('Fee floor: ' + partTimeFeeFloor);
              // console.log('totalRateReduction: ' + totalRateReduction);
              reductionAmountPerChild = totalRateReduction;
              actualParentFeePerChild = monthlyParentFee - reductionAmountPerChild;
            }
          }
          // Determine the reduction amount per this.form.children[i]...
          // actualParentFeePerChild = Math.max(0, actualParentFeePerChild);
          // Update the results
          this.results.push({ number: i + 1,
            reductionAmountPerChild: Math.round(reductionAmountPerChild),
            actualParentFeePerChild: Math.round(actualParentFeePerChild),
            feeFrequency: this.children[i].parentFeeFrequency });
        }
      }
    },
    numberFilter: function (evt) {
      evt = (evt) ? evt : window.event;
      let expect = evt.target.value.toString() + evt.key.toString();
      if (!/^[0-9]*$/.test(expect)) {
        evt.preventDefault();
      }
      else {
        return true;
      }
    },
    currencyFilter: function (evt) {
      evt = (evt) ? evt : window.event;
      let expect = evt.target.value.toString() + evt.key.toString();
      if (!/^[0-9]*\.?[0-9]*$/.test(expect)) {
        evt.preventDefault();
      }
      else {
        return true;
      }
    },
    truncateLeadingZeros(index) {
      index = index - 1;
      if (this.children[index].approvedFee.length != 0 && this.children[index].approvedFee.length > 1) {
        this.children[index].approvedFee = this.children[index].approvedFee.replace(/^0+/, '');
        //this.children[index].approvedFee = Number(this.children[index].approvedFee).toFixed(2).toString();
      }
      if (this.children[index].partTimeFee.length != 0 && this.children[index].partTimeFee.length > 1) {
        this.children[index].partTimeFee = this.children[index].partTimeFee.replace(/^0+/, '');
        //this.children[index].partTimeFee = Number(this.children[index].partTimeFee).toFixed(2).toString();
      }

    },
    /* When a faclity is selected, the following will remove any child age category types from the
       drop list which do not have defined rates for the faclity. */
    filterChildsAgeCategory() {
      this.childAgeCategoryList = this.getChildAgeCategoryList();
      if (this.selectedFacility.approvedFeesByChildAgeCategory != undefined) {
        for (let i in this.selectedFacility.approvedFeesByChildAgeCategory) {
          if (this.selectedFacility.approvedFeesByChildAgeCategory[i].approvedFeeJan == null &&
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
            let removeItem = this.selectedFacility.approvedFeesByChildAgeCategory[i].childCareCategory;
            this.childAgeCategoryList = this.childAgeCategoryList.filter(function(e) { return e !== removeItem;});
          }
        }
      }
    },
    getChildAgeCategoryList: function() {
      return ['0 - 18 Months',
        '18 - 36 Months',
        '3 Years to Kindergarten',
        'Before & After School (Kindergarten Only)'];
    },
    setApprovedParentFee(childsAgeCategory, childIndex) {
      if (this.selectedFacility !== null && this.selectedFacility !== undefined && this.selectedFacility.facilityId !== undefined) {
        this.approvedFeesByCategory = this.getApprovedRatesByMonth(childsAgeCategory);
        if (childsAgeCategory == '3 Years to Kindergarten') {
          let ageCatIndex = undefined;
          this.selectedFacility.approvedFeesByChildAgeCategory.find((o, i) => {
            if (o.childCareCategory === '3 Years to Kindergarten') {
              ageCatIndex = i;
              return true; // stop searching
            }
          });
          if (this.selectedFacility.approvedFeesByChildAgeCategory[ageCatIndex].approvedFeeApr == 0 &&
              this.selectedFacility.approvedFeesByChildAgeCategory[ageCatIndex].approvedFeeMay == 0 &&
              this.selectedFacility.approvedFeesByChildAgeCategory[ageCatIndex].approvedFeeJun == 0 &&
              this.selectedFacility.approvedFeesByChildAgeCategory[ageCatIndex].approvedFeeJul == 0 &&
              this.selectedFacility.approvedFeesByChildAgeCategory[ageCatIndex].approvedFeeAug == 0) {
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

        if (this.children[childIndex].items[this.children[childIndex].selectedMonthIndex].rate == null || this.children[childIndex].items[this.children[childIndex].selectedMonthIndex].rate == 0) {
          this.children[childIndex].selectedMonthIndex = this.children[childIndex].selectedMonthIndex + 1;
        }
        this.children[childIndex].showMonthSelector = true;
      }
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
    onChangeParentFeeFrequency (childIndex) {
      if (this.children[childIndex].approvedFee !== '' && this.children[childIndex].approvedFee !== undefined) {
        this.children[childIndex].approvedFee = undefined;
      }
    },
    getApprovedRatesByMonth: function(childAgeCategory) {
      for (let i in this.selectedFacility.approvedFeesByChildAgeCategory) {
        if (this.selectedFacility.approvedFeesByChildAgeCategory[i].childCareCategory == childAgeCategory) {
          return this.selectedFacility.approvedFeesByChildAgeCategory[i];
        }
      }
    },
    clickForOnSlider(key, childIndex) {
      if (this.children[childIndex].items[key].id == this.children[childIndex].selectedMonthIndex) {
        this.children[childIndex].isActive = false;
        this.children[childIndex].approvedFee = undefined;
      }
    },
    clickForOffSlider(key, childIndex) {
      this.children[childIndex].isActive = this.children[childIndex].isActive ? false : true;
      this.children[childIndex].clicked = true;
      this.children[childIndex].approvedFee = this.children[childIndex].items[this.children[childIndex].selectedMonthIndex].rate;
      this.children[childIndex].parentFeeFrequency = this.children[childIndex].feeFrequency;
      this.children[childIndex].btnDisabled = false;
    },
    focusAwayFromOnSlider(childIndex) {
      this.children[childIndex].approvedFee = this.children[childIndex].items[this.children[childIndex].selectedMonthIndex].rate;
      this.$refs.hiddenButton[childIndex].$el.focus();
    },
    /* Set the current month value for the month select slider.. this will show the current month centered in the component. */
    setDefaultForMonthPicker() {
      const currentMonth = new Date().getMonth() + 1;
      for (let i in this.children) {
        this.children[i].selectedMonthIndex = this.children[i].selectedMonthIndex != null ? this.children[i].selectedMonthIndex : currentMonth-4;
      }
    },
    decimalExists: function(n) {
      if (n != null &&  n != undefined) {
        return (n - Math.floor(n)) !== 0; 
      }
    }
  },
  mounted() {
    this.children = [
      this.newChild(1)
    ];
    this.setDefaultForMonthPicker();
    this.childAgeCategoryList = this.getChildAgeCategoryList();
    this.results = [];
    this.GROUP_REDUCTION_RATES = new Map();
    this.GROUP_REDUCTION_RATES.set('0 - 18 Months', { monthlyRate: 900, fullTime19: 47.3684, fullTime20: 45, partTime19: 23.6842, partTime20: 22.5, rateFloor: 350 });
    this.GROUP_REDUCTION_RATES.set('18 - 36 Months', { monthlyRate: 900, fullTime19: 47.3684, fullTime20: 45, partTime19: 23.6842, partTime20: 22.5, rateFloor: 350 });
    this.GROUP_REDUCTION_RATES.set('3 Years to Kindergarten', { monthlyRate: 545, fullTime19: 28.6842, fullTime20: 27.25, partTime19: 14.3421, partTime20: 13.625, rateFloor: 100 });
    this.GROUP_REDUCTION_RATES.set('Before & After School (Kindergarten Only)', { monthlyRate: 320, fullTime19: 16.8421, fullTime20: 16, partTime19: 8.4211, partTime20: 8, rateFloor: 100 });
    this.FAMILY_REDUCTION_RATES = new Map();
    this.FAMILY_REDUCTION_RATES.set('0 - 18 Months', { monthlyRate: 600, fullTime19: 31.5789, fullTime20: 30, partTime19: 15.7895, partTime20: 15, rateFloor: 200 });
    this.FAMILY_REDUCTION_RATES.set('18 - 36 Months', { monthlyRate: 600, fullTime19: 31.5789, fullTime20: 30, partTime19: 15.7895, partTime20: 15, rateFloor: 200 });
    this.FAMILY_REDUCTION_RATES.set('3 Years to Kindergarten', { monthlyRate: 500, fullTime19: 26.3158, fullTime20: 25, partTime19: 13.1579, partTime20: 12.5, rateFloor: 60 });
    this.FAMILY_REDUCTION_RATES.set('Before & After School (Kindergarten Only)', { monthlyRate: 320, fullTime19: 16.8421, fullTime20: 16, partTime19: 8.4211, partTime20: 8, rateFloor: 60 });
  },
  updated() {
    this.skipApprovedFeeValidation = false;
    if (this.children[0].clicked) {
      this.$refs.hiddenButton[0].$el.focus();
      this.children[0].clicked = false;
    }
  },
  watch: {}
};
</script>

<style>
.fa-caret-down::before {
    color: #0FC3ED !important;
}
.tooltip {
  border-radius: 50% !important;
  height: 30px !important;
  width: 30px !important;
  min-width: 30px !important;
  text-align: center !important;
  background-color:#7B2EE5 !important;
}
.v-tooltip__content {
  opacity: .95 !important;
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
  font-family: 'BCSans', Verdana, Arial, sans-serif !important;
}
.v-input, .v-select-list {
  font-size: 16px !important;
  font-family: 'BCSans', Verdana, Arial, sans-serif !important;
}
div.v-select__selection.v-select__selection--comma {
  line-height:20px !important
}
.banner-title-heading {
  font-size: 32px !important;
}
.estimator-label {
  padding-left: 34px;
  padding-top: 20px;
  color: #7B7C7E;
  font-family: 'BCSans', Verdana, Arial, sans-serif !important;
  font-weight: 600;
  font-size: 16px
}
.v-toolbar__title {
  font-size: 14px !important;
  color: white;
  font-weight: 600;
  font-family: 'BCSans', Verdana, Arial, sans-serif !important;
}
.v-list-item__title {
  font-size: 14px !important;
}
.v-list-item__content {
  text-align: center!important;
}
.v-list-item__title {
  text-align: left!important;
}

.bounce-leave-active {
  animation: bounce-in 0.1s reverse;
}
.results-label {
  color: white;
  font-style: normal;
  font-weight: 700;
  font-family: BCSans;
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
div.ma-1.fill-height.v-card.v-card--link.v-sheet.theme--light {
    border: 1px solid grey !important;
}
div.ma-1.fill-height.v-card.v-card--disabled.v-sheet.theme--light {
    border: 1px solid #b8babd !important;
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
</style>
