<template>
  <v-container class="py-0">
    <v-form ref="form">
      <v-row justify="center">
        <v-col cols="12" class="pt-0" align="center">
          <v-img
            :src="require('../assets/images/crayons-backdrop-darkend-v2.jpg')"
            max-height="300"
            max-width="1448" >
            <span class="banner-title">
              <p class="banner-title-heading my-2" style="font-family:BCSans;">Child Care Fee Reduction Initiative Estimator</p>
            </span>
          </v-img>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col cols="10">
          <v-card elevation="0">
            <template>
              <v-alert
                outlined
                prominent
                color="#ABADAE">
                <span style="float:left">
                  <v-icon
                    x-large
                    color="rgb(0 51 102)"
                    class="py-1 px-3">
                    mdi-information
                  </v-icon>
                </span>
                <span class="pa-1" style="font-family:BCSans;">
                    The estimation provided in this service is not a guarantee of payments. The estimation does not take into account all of your circumstances and should be used as a guide only.
                </span>
              </v-alert>
            </template>
          </v-card>
        </v-col>
      </v-row>
  <!-- ******************************************************************************************************************************************************** -->
  <!-- **** FACILTY SEARCH COMPONENT  ************************************************************************************************************************* -->
        <FacilitySearch @selectedFacility="setSelectedFacility($event)"/>
  <!-- ******************************************************************************************************************************************************** -->
      <v-row justify="center">
        <v-col cols="10">
        <v-card elevation="4">
          <v-row>
            <v-col class="py-0">
              <v-card-title class="grey lighten-3" style="color:#39598A;font-style:normal;font-weight:700;font-family:BCSans;font-size:20px;padding-top:8px;padding-bottom:8px">Facility Details</v-card-title>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="6" class="estimator-label">
              <span class="red--text"><strong> *</strong></span>
                Total number of children
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
              <span class="red--text"><strong>&nbsp;*</strong></span>
              Type of care
            </v-col>
            <v-col cols="1" style="padding-bottom:0px;padding-top:16px;padding-left:0px">
              <v-tooltip top color="#003466">
                <template v-slot:activator="{ on, attrs }">
                  <v-card v-bind="attrs" v-on="on" class="blue darken-3" style="border-radius: 50%; height: 30px; width: 30px; min-width: 30px; text-align: center;">
                    <v-icon small color="white">mdi-help</v-icon>
                  </v-card>
                </template>
                <span>Licensed group child care takes place in a community-based facility or centre.<br> Licensed family child care takes place in the child care provider’s personal residence.</span>
              </v-tooltip>
            </v-col>
            <v-col cols="4" class="pb-0">
              <v-select
                ref="typeOfCare"
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
            <v-card-title class="grey lighten-3" style="color:#39598A;font-style:normal;font-weight:700;font-family:BCSans;font-size:20px;padding-top:8px;padding-bottom:8px">Child {{child.number}}</v-card-title>
              <v-row>
                <v-col cols="5" class="estimator-label">
                  <span class="red--text"><strong> *</strong></span>
                  Child's age category
                </v-col>
                <v-col cols="1" style="padding-bottom:0px;padding-top:16px;padding-left:0px">
                  <v-tooltip top color="#003466">
                    <template v-slot:activator="{ on, attrs }">
                    <v-card class="blue darken-3" style="border-radius: 50%; height: 30px; width: 30px; min-width: 30px; text-align: center;">
                      <v-icon small color="white">mdi-help</v-icon>
                    </v-card>
                  </template>
                    <span>Ask your care provider if you are unsure which age category to select.</span>
                  </v-tooltip>
                </v-col>
                <v-col cols="4" class="pb-0">
                  <v-select
                    ref="childAgeCategory"
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
                  <span class="red--text"><strong> *</strong></span>
                  Care schedule
                </v-col>
                <v-col cols="1" style="padding-bottom:0px;padding-top:16px;padding-left:0px">
                  <v-tooltip top color="#003466">
                    <template v-slot:activator="{ on, attrs }">
                    <v-card class="blue darken-3" style="border-radius: 50%; height: 30px; width: 30px; min-width: 30px; text-align: center;">
                      <v-icon small color="white">mdi-help</v-icon>
                    </v-card>
                  </template>
                    <span>If you don’t require full time care, please select the typical schedule of half days (4 hours or less) and<br>
                          full days (more than 4 hours) you require per week. The maximum benefit rates for CCFRI are based<br>
                          on 5 full days per week (full time care).</span>
                  </v-tooltip>
                </v-col>
                <v-col cols="4" class="pb-0">
                  <v-select
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
              <v-row>
                <v-col class="py-0">
                  <v-divider></v-divider>
                </v-col>
              </v-row>
              <v-row v-if="showMonthSelector">
                <v-col cols="5" class="estimator-label">
                  <span class="red--text"><strong> *</strong></span>
                  Select a month
                </v-col>
                <v-col cols="1" style="padding-bottom:0px;padding-top:16px;padding-left:0px">
                  <v-tooltip top color="#003466">
                    <template v-slot:activator="{ on, attrs }">
                    <v-card class="blue darken-3" style="border-radius: 50%; height: 30px; width: 30px; min-width: 30px; text-align: center;">
                      <v-icon small color="white">mdi-help</v-icon>
                    </v-card>
                  </template>
                    <span>If you don’t require full time care, please select the typical schedule of half days (4 hours or less) and<br>
                          full days (more than 4 hours) you require per week. The maximum benefit rates for CCFRI are based<br>
                          on 5 full days per week (full time care).</span>
                  </v-tooltip>                 </v-col>
                <v-col cols="4" class="flex pt-1 pb-0" style="margin-left:-10px;margin-bottom:-18px;">
  <!-- ******************************************************************************************************************************************************** -->
  <!-- **** MONTH SLIDER SELECT COMPONENT ********************************************************************************************************************* -->
                    <!--CcrfiEstimatorSliderSelect
                    v-bind:children="children"
                    v-bind:childIndex="child.number"
                    v-bind:approvedFeesByCategory="approvedFeesByCategory"
                    @selectedApprovedFee="setSelectedApprovedFee($event, child.number-1)"
                  /-->
                  <template>
  <v-sheet class="flex px-0 py-0" elevation="0" max-width="337" min-width="150" style="float:left">
    <!-- ****************************************************************************************************************************************************************-->
    <!-- *** The following slider is for the ON (selected) state ********************************************************************************************************-->
    <!-- ****************************************************************************************************************************************************************-->
    <v-slide-group v-if="child.isActive" v-model="child.selectedMonthIndex" class="pa-0" mandatory center-active show-arrows active-class="" @change="focusAwayFromOnSlider(child.number-1)">
      <template v-slot:next>
        <span class="fill-height pt-1 pr-3">
          <v-icon ref="rchevron" color="#39598A" x-large>mdi-chevron-right</v-icon>
         </span>
      </template>
      <template v-slot:prev>
        <span class="estimator-label fill-height pt-1 pr-7" align="right" style="font-size:12px;">
          <v-icon color="#39598A" x-large>mdi-chevron-left</v-icon>
            {{child.feeFrequency}}&nbsp;
          </span>
      </template>
      <v-slide-item v-for="n in child.items" :key="n.id" v-slot="{ active, toggle }">
        <v-card :color="active ? '#E5F3FE' : '#FFFFFF'" class="ma-1 fill-height" :elevation="active ? 4 : 0" height="67" width="70" @click="toggle(clickForOnSlider(n.id, child.number-1))">
          <v-row style="" justify="center">
            <v-col align="center" style="padding-top:4px;padding-bottom:5px;margin-top:-2px;">
              <span :style="'color:'+(active ? '#2196f3' : '#39598A')+';font-family:Lucida Grande,monospace;color:#39598A;background-color:#EEEEEE;font-size:17px;font-weight:bold;padding-bottom:6px;padding-left:18px;padding-right:18px;padding-top:4px'">
               {{n.month}}
              </span>
            </v-col>
          </v-row>
          <v-row style="font-size:14px;" justify="center">
            <v-col align="center" style="padding-top:3px;">
              <span :style="'color:'+(active ? '#2196f3' : 'black')">
                ${{n.rate}}
              </span>
            </v-col>
          </v-row>
        </v-card>
      </v-slide-item>
    </v-slide-group>
    <!-- ****************************************************************************************************************************************************************-->
    <!-- *** The following slider is for the OFF (unselected) state *****************************************************************************************************-->
    <!-- ****************************************************************************************************************************************************************-->
    <v-slide-group v-if="!child.isActive" v-model="child.selectedMonthIndex" class="pa-0" mandatory center-active show-arrows active-class="" @change="">
      <template v-slot:next>
        <span class="fill-height pt-1 pr-3">
          <v-icon color="#39598A" x-large>mdi-chevron-right</v-icon>
        </span>
      </template>
      <template v-slot:prev>
            <span class="estimator-label fill-height pt-1 pr-7" align="right" style="font-size:12px;">
              <v-icon color="#39598A" x-large>mdi-chevron-left</v-icon>
              {{child.feeFrequency}}&nbsp;
              </span>
      </template>
      <v-slide-item v-for="n in child.items" :key="n.id" v-slot="{ active, toggle }">
      <v-card :color="active ? '#FFFFFF': '#FFFFFF'" class="ma-1 fill-height" :elevation="active ? 0 : 0" height="67" width="70" @click="toggle(clickForOffSlider(n.id, child.number-1))">
        <v-row style="" justify="center">
          <v-col align="center" style="padding-top:4px;padding-bottom:5px;margin-top:-2px;">
            <span style="font-family:Lucida Grande,monospace;color:#39598A;background-color:#EEEEEE;font-size:17px;font-weight:bold;padding-bottom:6px;padding-left:18px;padding-right:18px;padding-top:4px">
              {{n.month}}
            </span>
          </v-col>
        </v-row>
        <v-row style="font-size:14px;" justify="center">
          <v-col align="center" style="padding-top:3px;">
            <span style="">
              ${{n.rate}}
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
              <v-row v-if="showMonthSelector">
                <v-col class="py-0">
                  <v-divider></v-divider>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="5" style="padding-bottom:0px;padding-top:16px;">
                  <div style="padding-left:24px;color:#7B7C7E;font-family:BCSans;font-weight:600;font-size:16px">
                    <template><span class="red--text"><strong> *</strong></span></template>
                    Approved full-time parent fee before fee reduction applied
                  </div>
                </v-col>
                <v-col cols="1" style="padding-bottom:0px;padding-top:16px;padding-left:0px">
                  <v-tooltip top color="#003466">
                    <template v-slot:activator="{ on, attrs }">
                    <v-card class="blue darken-3" style="border-radius: 50%; height: 30px; width: 30px; min-width: 30px; text-align: center;">
                      <v-icon small color="white">mdi-help</v-icon>
                    </v-card>
                  </template>
                    <span>Enter the highest full-time parent fee approved by the Ministry for this child care provider to charge,<br>
                          for the applicable care category, before the fee reduction is applied. Child care providers can reference<br>
                          this information on their approved Program Confirmation Form. Parents, ask your child care provider if<br>
                          you are unsure which fee to enter.</span>
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
  <!-- ******************************************************************************************************************************************************** -->
  <!-- **** CHILD X: PART TIME CARE SCHEDULE ****************************************************************************************************************** -->
  <!-- ******************************************************************************************************************************************************** -->          
              <v-row v-if="child.careSchedule == 'Part Time'">
                <v-col class="d-flex wrap justify-center" style="padding-top:0px;padding-bottom:16px">
                  <div class="d-flex wrap" style="align-content:center;flex-wrap:wrap;">
                  <v-card style="">
                    <v-toolbar 
                        color="grey lighten-3"
                        >
                        <v-spacer></v-spacer>
                        <v-toolbar-title>Monday</v-toolbar-title>
                        <v-spacer></v-spacer>
                      </v-toolbar>
                      <v-list>
                        <v-list-item-group
                          v-model="child.selectedCareType[0]"
                          active-class="blue--text"
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
                        color="grey lighten-3"
                      >
                        <v-spacer></v-spacer>
                        <v-toolbar-title>Tuesday</v-toolbar-title>
                        <v-spacer></v-spacer>
                      </v-toolbar>
                  
                      <v-list>
                        <v-list-item-group
                          v-model="child.selectedCareType[1]"
                          active-class="blue--text"
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
                        color="grey lighten-3"
                      >
                      <v-spacer></v-spacer>
                      <v-toolbar-title>Wednesday</v-toolbar-title>
                      <v-spacer></v-spacer>
                    </v-toolbar>
                      
                      <v-list>
                        <v-list-item-group
                          v-model="child.selectedCareType[2]"
                          active-class="blue--text"
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
                        color="grey lighten-3"
                      >
                      <v-spacer></v-spacer>
                      <v-toolbar-title>Thursday</v-toolbar-title>
                      <v-spacer></v-spacer>
                    </v-toolbar>
                      <v-list>
                        <v-list-item-group
                          v-model="child.selectedCareType[3]"
                          active-class="blue--text"
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
                        color="grey lighten-3"
                      >
                      <v-spacer></v-spacer>
                      <v-toolbar-title>Friday</v-toolbar-title>
                      <v-spacer></v-spacer>
                    </v-toolbar>
                      <v-list>
                        <v-list-item-group
                          v-model="child.selectedCareType[4]"
                          active-class="blue--text"
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
                        color="grey lighten-3"
                      >
                        <v-spacer></v-spacer>
                        <v-toolbar-title>Saturday</v-toolbar-title>
                        <v-spacer></v-spacer>
                      </v-toolbar>
                      <v-list>
                        <v-list-item-group
                          v-model="child.selectedCareType[5]"
                          active-class="blue--text"
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
                        color="grey lighten-3"
                      >
                      <v-spacer></v-spacer>
                      <v-toolbar-title>Sunday</v-toolbar-title>
                      <v-spacer></v-spacer>
                    </v-toolbar>
                      <v-list>
                        <v-list-item-group
                          v-model="child.selectedCareType[6]"
                          active-class="blue--text"
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
              <v-row>
                <v-col cols="5" class="estimator-label">
                  <span class="red--text"><strong> *</strong></span>
                  Parent fee frequency
                </v-col>
                <v-col cols="1" style="padding-bottom:0px;padding-top:16px;padding-left:0px">
                  <v-tooltip top color="#003466">
                    <template v-slot:activator="{ on, attrs }">
                    <v-card class="blue darken-3" style="border-radius: 50%; height: 30px; width: 30px; min-width: 30px; text-align: center;">
                      <v-icon small color="white">mdi-help</v-icon>
                    </v-card>
                  </template>
                    <span>Select whether parent fees are charged daily, weekly, or monthly.</span>
                  </v-tooltip>
                </v-col>
                <v-col cols="4" class="pb-0">
                  <v-select
                    v-model="child.parentFeeFrequency"
                    :items="parentFeeFrequencyList"
                    required
                    :rules="rulesParentFeeFrequency"
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
                    <span v-if="child.careSchedule == 'Full Time'">
                      Actual parent fee before reduction applied (Optional)
                    </span>
                    <span v-else-if="child.careSchedule == 'Part Time' && (getOccurrence(child.selectedCareType, 2) >= 5)">
                      Actual parent fee before reduction applied (Optional)
                    </span>
                    <span v-else>
                      <span class="red--text"><strong> *</strong></span>
                      Actual parent fee before reduction applied
                    </span>
                  </div>
                </v-col>
                <v-col cols="1" style="padding-bottom:0px;padding-top:16px;padding-left:0px">
                  <v-tooltip top color="#003466">
                    <template v-slot:activator="{ on, attrs }">
                    <v-card class="blue darken-3" style="border-radius: 50%; height: 30px; width: 30px; min-width: 30px; text-align: center;">
                      <v-icon small color="white">mdi-help</v-icon>
                    </v-card>
                  </template>
                    <span>Indicate the parent fee for this care arrangement before any reductions or benefits are applied.<br>
                          This fee may be different from the CCFRI approved full time parent fee if it is a part-time fee,<br>
                          discounted fee, or inclusive of optional fees.</span>
                  </v-tooltip>
                </v-col>
                <v-col cols="4" class="pb-0">
                  <v-text-field
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
              <v-row>
                <v-col class="py-0">
                  <v-divider></v-divider>
                </v-col>
              </v-row>
          </div>
  <!-- ******************************************************************************************************************************************************** -->
  <!-- **** RESULTS SUB SECTION  ****************************************************************************************************************************** -->
  <!-- ******************************************************************************************************************************************************** -->
          <v-card-title class="grey lighten-3" style="color:#39598A;font-style:normal;font-weight:700;font-family:BCSans;font-size:20px;padding-top:8px;padding-bottom:8px">Results</v-card-title>
          <v-row>
            <v-col cols="12" class="text-center">
              <v-btn style="color:#39598A;font-family:BCSans;font-weight:600;font-family:BCSans;font-size:16px;padding-left:60px;padding-right:60px;"
                class="ma-2"
                outlined
                color="#003466"
                @click="estimateTheBenefit">
                Estimate the benefit
              </v-btn>
            </v-col>
          </v-row>
          <div v-show="showEstimatorResults">
          <v-row>
            <v-col cols="12">
              <div style="padding-left:24px;color:#7B7C7E;font-family:BCSans;font-weight:500;font-size:16px">
                Based on the information you have provided, you may be eligible for the following monthly ChildCareBC fee reduction:
              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="2" style="padding-bottom:0px">
              <div style="padding-left:24px;color:#7B7C7E;font-family:BCSans;font-weight:600;font-size:16px">
                Child
              </div>
            </v-col>
            <v-col cols="4" style="padding-bottom:0px">
              <div class="d-flex flex-nowrap">
                <div style="padding-left:24px;color:#7B7C7E;font-family:BCSans;font-weight:600;font-size:16px">
                  Estimated child care fee reduction amount <!--Reduction Amount Per Child-->
                </div>
              </div>
            </v-col>
            <v-col cols="4" style="padding-bottom:0px">
              <div class="d-flex flex-nowrap">
                <div style="padding-left:24px;color:#7B7C7E;font-family:BCSans;font-weight:600;font-size:16px">
                  Estimated parent fee after reduction <!--Actual Parent Fee Per Child-->
                </div>
              </div>
            </v-col>
          </v-row>
          <div v-for="result in results" :key="result.number">
            <v-row>
            <v-col cols="12" >
              <v-divider></v-divider>
            </v-col>
            </v-row>
            <v-row>
            <v-col cols="2" style="padding-bottom:0px;padding-top:0px">
              <div style="padding-left:24px;font-family:BCSans;font-weight:500;font-size:16px;">
              {{result.number}}
              </div>
            </v-col>
              <v-col cols="4" style="padding-bottom:0px;padding-top:0px">
                <div class="d-flex flex-nowrap">
                <div style="padding-left:24px;font-family:BCSans;font-weight:500;font-size:16px;">
                  {{result.feeFrequency=='Daily'? '$'+(result.reductionAmountPerChild/20)+'/day $('+result.reductionAmountPerChild+' month)' : ''}}
                  {{result.feeFrequency=='Weekly'? '$'+(result.reductionAmountPerChild/20)+'/week $('+result.reductionAmountPerChild+' month)' : ''}}
                  {{result.feeFrequency=='Monthly'? '$'+result.reductionAmountPerChild : ''}}
               </div>
            </div>
            </v-col>
              <v-col cols="4" style="padding-bottom:0px;padding-top:0px">
              <div style="padding-left:24px;font-family:BCSans;font-weight:500;font-size:16px">
                {{result.feeFrequency=='Daily'? '$'+(result.actualParentFeePerChild/20)+'/day $('+result.actualParentFeePerChild+' month)' : ''}}
                {{result.feeFrequency=='Weekly'? '$'+(result.actualParentFeePerChild/20)+'/week $('+result.actualParentFeePerChild+' month)' : ''}}
                {{result.feeFrequency=='Monthly'? '$'+result.reductionAmountPerChild : ''}}
              </div>
            </v-col>
          </v-row>
          </div>
          <v-row>
            <v-col>
              
            </v-col>
          </v-row>        
        </div>
        </v-card>
        </v-col>
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
      childAgeCategory: '',
      childIndex: '',
      selectedFacility: [],
      skipApprovedFeeValidation: false,
      GROUP_REDUCTION_RATES: null,
      FAMILY_REDUCTION_RATES: null,
      results: null,
      showEstimatorResults: false,
      showPartTimeCareSchedule: false,
      showMonthSelector: false,
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
      /* Month Selector 
      isActive: false,
      btnDisabled: true,
      clicked: false,
      selectedApprovedFee: 0,
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
      */
      // END Month Selector
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
  methods: {
    setSelectedFacility(e) {

      /*
      this.totalNumberOfChildren = 1;
      this.children[0].childAgeCategory
      this.children = [
        this.newChild(1)
      ];
      */
     
      this.selectedFacility = e;
      this.form.typeOfCare = (this.selectedFacility.accountNumber.charAt(0) == 'F') ? 'Licensed Family' : 'Licensed Group';
      this.filterChildsAgeCategory();
      this.showMonthSelector = true;
      // TODO: Keep for now as possible reused code, until Todd answers pending question on what should happen when to approved full-time fee
      //       when serach/selecting new facility.
      //this.resetForm();
      /*
      let index = 0;
      for (let child of this.children) {
        let approvedFee = this.getApprovedParentFee(child.childsAgeCategory);
        console.info('child.approvedFee = '+child.approvedFee);
        console.info('approvedFee = '+approvedFee);
        if (approvedFee != undefined && child.approvedFee != '') {
          this.skipApprovedFeeValidation = true;
          this.children[index].approvedFee = approvedFee;
          index++;
        } else if (approvedFee == undefined && child.approvedFee != '') {
          this.children[index].approvedFee = approvedFee;
        }
      }*/
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
      this.$refs.form.inputs.forEach(input => {
        if (input.id == '') {
          input.reset();
        }
      });
      this.$refs.form.resetErrorBag(); // necessary to remove validation errors after the field values are removed
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
    getPartTimeMonthlyParentFee(fee, careDaysPerWeek, feeFrequency) {
      switch (feeFrequency) {
      case 'Daily':
        return fee * careDaysPerWeek;
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
            let monthlyParentFee = this.getPartTimeMonthlyParentFee(this.children[i].partTimeFee, partTimeNumberOfDays + fullTimeNumberOfDays, this.children[i].parentFeeFrequency);
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
                              feeFrequency: this.children[i].feeFrequency });
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
      }
      if (this.children[index].partTimeFee.length != 0 && this.children[index].partTimeFee.length > 1) {
        this.children[index].partTimeFee = this.children[index].partTimeFee.replace(/^0+/, '');
      }
    },
    /* When a faclity is selected, the following will remove any child age category types from the
       drop list which do not have defined rates for the faclity. */
    filterChildsAgeCategory() {
      this.childAgeCategoryList = this.getChildAgeCategoryList();
      if (this.selectedFacility.approvedFeesByChildAgeCategory != undefined) {
        for (let i in this.selectedFacility.approvedFeesByChildAgeCategory) {
          if (this.selectedFacility.approvedFeesByChildAgeCategory[i].approvedFeeJan == null) {
            let removeItem = this.selectedFacility.approvedFeesByChildAgeCategory[i].childCareCategory;
            this.childAgeCategoryList = this.childAgeCategoryList.filter(function(e) { return e !== removeItem;});
          }
        }
      }
    },
    /*
    getApprovedParentFee: function(childAgeCategory) {
      // Iterate thorugh the payload returned from FacilitySearch component, to determine the next
      // months approved fee baed on the type of child care selected.
      for (let i in this.selectedFacility.approvedFeesByChildAgeCategory) {
        if (this.selectedFacility.approvedFeesByChildAgeCategory[i].childCareCategory == childAgeCategory) {
          // Set the approved parent fee by determining the next calendar month (as a numeric value)
          // and match it with the payloads equivalent months approved fee.
          const nextMonth = new Date().getMonth() + 2;
          switch (nextMonth) {
          case 1:
            return this.selectedFacility.approvedFeesByChildAgeCategory[i].approvedFeeJan;
          case 2:
            return this.selectedFacility.approvedFeesByChildAgeCategory[i].approvedFeeFeb;
          case 3:
            return this.selectedFacility.approvedFeesByChildAgeCategory[i].approvedFeeMar;
          case 4:
            return this.selectedFacility.approvedFeesByChildAgeCategory[i].approvedFeeApr;
          case 5:
            return this.selectedFacility.approvedFeesByChildAgeCategory[i].approvedFeeMay;
          case 6:
            return this.selectedFacility.approvedFeesByChildAgeCategory[i].approvedFeeJun;
          case 7:
            return this.selectedFacility.approvedFeesByChildAgeCategory[i].approvedFeeJul;
          case 8:
            return this.selectedFacility.approvedFeesByChildAgeCategory[i].approvedFeeAug;
          case 9:
            return this.selectedFacility.approvedFeesByChildAgeCategory[i].approvedFeeSep;
          case 10:
            return this.selectedFacility.approvedFeesByChildAgeCategory[i].approvedFeeOct;
          case 11:
            return this.selectedFacility.approvedFeesByChildAgeCategory[i].approvedFeeNov;
          case 12:
            return this.selectedFacility.approvedFeesByChildAgeCategory[i].approvedFeeDec;
          }
        }
      }
    },*/
    getChildAgeCategoryList: function() {
      return ['0 - 18 Months',
        '18 - 36 Months',
        '3 Years to Kindergarten',
        'Before & After School (Kindergarten Only)'];
    },
    setApprovedParentFee(childsAgeCategory, childIndex) {
      //let approvedFee = this.getApprovedParentFee(childsAgeCategory);
      this.approvedFeesByCategory = this.getApprovedFees(childsAgeCategory);
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
      this.children[childIndex].feeFrequency = this.approvedFeesByCategory.feeFrequency;
      this.children[childIndex].parentFeeFrequency = this.approvedFeesByCategory.feeFrequency;
      //this.children[childIndex].approvedFeesByCategory = this.approvedFeesByCategory;
      this.skipApprovedFeeValidation = true;
      //this.children[index].approvedFee = approvedFee;
    },
    setSelectedApprovedFee(e, childIndex) {
      console.log('!!!!!!!!!! setSelectedApprovedFee.childIndex = '+childIndex);
      this.selectedApprovedFee = e;
      this.children[childIndex].approvedFee = e;
    },
    getApprovedFees: function(childAgeCategory) {
      for (let i in this.selectedFacility.approvedFeesByChildAgeCategory) {
        if (this.selectedFacility.approvedFeesByChildAgeCategory[i].childCareCategory == childAgeCategory) {
          return this.selectedFacility.approvedFeesByChildAgeCategory[i];
        }
      }
    },
    clickForOnSlider(key, childIndex) {
      console.log('key =' + this.children[childIndex].items[key].id);
      console.log('childIndex =' + childIndex);
      console.log('unselectedDefault =' + this.children[childIndex].selectedMonthIndex);
      if (this.children[childIndex].items[key].id == this.children[childIndex].selectedMonthIndex) {
        console.log('isActive = FALSE!!');
        this.children[childIndex].isActive = false;
        this.children[childIndex].approvedFee = undefined;
      }
    },
    clickForOffSlider(key, childIndex) {
      console.log('clicked');
      console.log('key=' + key);
      this.children[childIndex].isActive = this.children[childIndex].isActive == true ? false : true;
      this.children[childIndex].clicked = true;
      console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ this.children[childIndex].selectedMonthIndex='+this.children[childIndex].selectedMonthIndex);
      console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ this.items[this.children[childIndex].selectedMonthIndex].rate='+this.children[childIndex].items[this.children[childIndex].selectedMonthIndex].rate);
      this.children[childIndex].approvedFee = this.children[childIndex].items[this.children[childIndex].selectedMonthIndex].rate;
      this.children[childIndex].btnDisabled = false;
    },
    focusAwayFromOnSlider(childIndex) {
      this.children[childIndex].approvedFee = this.children[childIndex].items[this.children[childIndex].selectedMonthIndex].rate;
      //this.$refs.hiddenButton.$el.children[childIndex].focus();
      this.$refs.hiddenButton[childIndex].$el.focus();
    },
    /* Set the current month value for the month select slider.. this will show the current month centered in the component. */
    setDefaultForMonthPicker() {
      const currentMonth = new Date().getMonth() + 1;
      for (let i in this.children) {
        this.children[i].selectedMonthIndex = currentMonth-4;
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
    console.log('updated!');
    this.skipApprovedFeeValidation = false;
    if (this.children[0].clicked) {
      console.log('???? this.$refs.form.hiddenButton.$el.focus(); 1');
      this.$refs.hiddenButton[0].$el.focus();
      console.log('???? this.$refs.form.hiddenButton.$el.focus(); 2');
      this.children[0].clicked = false;
    }
  },
  watch: {
    selectedMonthIndex: {
      handler(newVal, oldVal) {
        console.log('oldVal=' + oldVal);
        console.log('newVal=' + newVal);
        console.log('items[model].id=');
        if (newVal == oldVal) {
          console.log('newVal == oldVal!!!');
          this.isActive = false;
        }
      },
      deep: true
    },
    approvedFeesByCategory: {
      handler(newVal, oldVal) {
        if (newVal != oldVal) {
          console.log('approvedFeesByCategory newVal != oldVal!!! '+this.approvedFeesByCategory.approvedFeeApr);
          /*
          this.children[0].items[0].rate = this.approvedFeesByCategory.approvedFeeApr;
          this.children[0].items[1].rate = this.approvedFeesByCategory.approvedFeeMay;
          this.children[0].items[2].rate = this.approvedFeesByCategory.approvedFeeJun;
          this.children[0].items[3].rate = this.approvedFeesByCategory.approvedFeeJul;
          this.children[0].items[4].rate = this.approvedFeesByCategory.approvedFeeAug;
          this.children[0].items[5].rate = this.approvedFeesByCategory.approvedFeeSep;
          this.children[0].items[6].rate = this.approvedFeesByCategory.approvedFeeOct;
          this.children[0].items[7].rate = this.approvedFeesByCategory.approvedFeeNov;
          this.children[0].items[8].rate = this.approvedFeesByCategory.approvedFeeDec;
          this.children[0].items[9].rate = this.approvedFeesByCategory.approvedFeeJan;
          this.children[0].items[10].rate = this.approvedFeesByCategory.approvedFeeFeb;
          this.children[0].items[11].rate = this.approvedFeesByCategory.approvedFeeMar;
          */
        }
      },
      deep: true
    }
  }
};
</script>

<style scoped>
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
  color: #39598A;
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
  text-align: center!important;
}
.bounce-leave-active {
  animation: bounce-in 0.1s reverse;
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
</style>
