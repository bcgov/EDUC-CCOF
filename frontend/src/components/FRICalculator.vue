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
        <v-col cols="12">
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
          <!-- removing months for now.
          <v-row>
            <v-col cols="6" class="estimator-label">
              <span class="red--text"><strong> *</strong></span>
                Month
            </v-col>
            <v-col cols="4" class="pb-0">
              <v-select
                  v-model="form.month"
                  :items="this.numberOfBusinessDaysByMonth"
                  item-text="month"
                  item-value="month"
                  outlined
                  required
                  :rules="rulesMonth"
                  dense>
              </v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="py-0" style="y-off">
              <v-divider></v-divider>
            </v-col>
          </v-row>
          -->
          <v-row>
            <v-col cols="5" class="estimator-label">
                <span class="red--text"><strong>&nbsp;*</strong></span>
                Type of care
            </v-col>
            <v-col cols="1" style="padding-bottom:0px;padding-top:16px;padding-left:40px">
                  <v-tooltip top color="#003466">
                    <template v-slot:activator="{ on, attrs }">
                    <v-card class="blue darken-3" style="border-radius: 50%; height: 30px; width: 30px; min-width: 30px; text-align: center;"
                            v-on="on">
                      <v-icon small color="white">mdi-help</v-icon>
                    </v-card>
                  </template>
                    <span>Licenced group child care takes place in a community-based facility or centre.<br> Licenced family child care takes place in the child care provider’s personal residence.</span>
                  </v-tooltip>
            </v-col>
            <v-col cols="4" class="pb-0">
              <v-select
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
                <v-col cols="1" style="padding-bottom:0px;padding-top:16px;padding-left:40px">
                  <v-tooltip top color="#003466">
                    <template v-slot:activator="{ on, attrs }">
                    <v-card class="blue darken-3" style="border-radius: 50%; height: 30px; width: 30px; min-width: 30px; text-align: center;"
                            v-on="on">
                      <v-icon small color="white">mdi-help</v-icon>
                    </v-card>
                  </template>
                    <span>Ask your care provider if you are unsure which age category to select.</span>
                  </v-tooltip>
                </v-col>
                <v-col cols="4" class="pb-0">
                  <v-select
                      style="font-size:16px !important"
                      v-model="child.childAgeCategory"
                      :items="childAgeCategoryList"
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
                <v-col cols="1" style="padding-bottom:0px;padding-top:16px;padding-left:40px">
                  <v-tooltip top color="#003466">
                    <template v-slot:activator="{ on, attrs }">
                    <v-card class="blue darken-3" style="border-radius: 50%; height: 30px; width: 30px; min-width: 30px; text-align: center;"
                            v-on="on">
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
                          <template v-for="(item, index) in careTypes">
                            <v-list-item :key="item.type">
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
                          </template>
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
                          <template v-for="(item, index) in careTypes">
                            <v-list-item :key="item.type">
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
                          </template>
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
                          <template v-for="(item, index) in careTypes">
                            <v-list-item :key="item.type">
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
                          </template>
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
                          <template v-for="(item, index) in careTypes">
                            <v-list-item :key="item.type">
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
                          </template>
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
                          <template v-for="(item, index) in careTypes">
                            <v-list-item :key="item.type">
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
                          </template>
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
                          <template v-for="(item, index) in careTypes">
                            <v-list-item :key="item.type">
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
                          </template>
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
                          <template v-for="(item, index) in careTypes">
                            <v-list-item :key="item.type">
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
                          </template>
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
                <v-col cols="1" style="padding-bottom:0px;padding-top:16px;padding-left:40px">
                  <v-tooltip top color="#003466">
                    <template v-slot:activator="{ on, attrs }">
                    <v-card class="blue darken-3" style="border-radius: 50%; height: 30px; width: 30px; min-width: 30px; text-align: center;"
                            v-on="on">
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
                    <template><span class="red--text"><strong> *</strong></span></template>
                    Approved full-time parent fee before fee reduction applied
                  </div>
                </v-col>
                <v-col cols="1" style="padding-bottom:0px;padding-top:16px;padding-left:40px">
                  <v-tooltip top color="#003466">
                    <template v-slot:activator="{ on, attrs }">
                    <v-card class="blue darken-3" style="border-radius: 50%; height: 30px; width: 30px; min-width: 30px; text-align: center;"
                            v-on="on">
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
                      @keypress="currencyFilter"
                      @change="truncateLeadingZeros(child.number)"
                      v-model="child.approvedFee"
                      :rules="rulesApprovedFee"
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
                <v-col cols="1" style="padding-bottom:0px;padding-top:16px;padding-left:40px">
                  <v-tooltip top color="#003466">
                    <template v-slot:activator="{ on, attrs }">
                    <v-card class="blue darken-3" style="border-radius: 50%; height: 30px; width: 30px; min-width: 30px; text-align: center;"
                            v-on="on">
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
              <v-row v-show="showParentFeeApprovedFor">
                <!-- <v-col cols="12" style="padding-top:0px;">
                  <div style="padding-left:36px;color:#336799;font-style:normal;font-weight:600;font-family:BCSans;font-size:16px"> 
                    Parent Fee Approved for {{form.careProviderSearch}}: ${{(results === undefined || results.length == 0) ? '' : results[child.number-1].actualParentFeePerChild}}
                  </div>
                </v-col> -->
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
                  ${{result.reductionAmountPerChild}}
               </div>
            </div>
            </v-col>
              <v-col cols="4" style="padding-bottom:0px;padding-top:0px">
              <div style="padding-left:24px;font-family:BCSans;font-weight:500;font-size:16px">
                ${{result.actualParentFeePerChild}}
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
import { constants } from '@/utils/constants';

export default {
  name: 'FRICalculator',
  components: //{PrimaryButton},
    constants,
  props: {
  },
  data() {
    return {
      GROUP_REDUCTION_RATES: null,
      FAMILY_REDUCTION_RATES: null,
      results: null,
      showEstimatorResults: false,
      showParentFeeApprovedFor: false,
      showPartTimeCareSchedule: false,      
      careTypes: [
        {type: 'No Care'},
        {type: 'Half Day'},
        {type: 'Full Day'}
      ],
      numberOfBusinessDaysByMonth: [
        {month: 'January', days: 20},
        {month: 'February', days: 19},
        {month: 'March', days: 20},
        {month: 'April', days: 20},
        {month: 'May', days: 20},
        {month: 'June', days: 20},
        {month: 'July', days: 20},
        {month: 'August', days: 20},
        {month: 'September', days: 20},
        {month: 'October', days: 20},
        {month: 'November', days: 20},
        {month: 'December', days: 20},
      ],
      totalNumberOfChildren: '1',
      children: null,
      form: {
        firstName: '',
        lastName: '',
        email: '',
        careProviderSearch: '',
        typeOfCare: '',
        month: '',
      },
      parentFeeFrequencyList: [
        'Daily',
        'Weekly',
        'Monthly'
      ],
      typeOfCareList: [
        'Licenced Group',
        'Licenced Family'
      ],
      childAgeCategoryList: [
        '0 - 18 Months',
        '18 - 36 Months',
        '3 Years to Kindergarten',
        'Before & After School (Kindergarten Only)',
      ],
      rulesTypeOfCare: [
        (v) => !!v || 'Type of care is required'
      ],
      rulesTotalNumChildren: [
        (v) => !!v || 'Total number of children is required',
        (v) => v <= 25 || 'Total number of children must be less than 26',
        (v) => v >= 1 || 'Total number of children must be 1 or more'
      ],
      // rulesMonth: [
      //   (v) => !!v || 'Month is required'
      // ],
      rulesCaresSchedule: [
        (v) => !!v || 'Care schedule is required'
      ],      
      rulesChildsAgeCategory: [
        (v) => !!v || 'Child\'s age category is required'
      ],
      rulesApprovedFee: [
        (v) => !!v || 'Approved full-time parent fee before fee reduction applied is required',
        (v) => v <= 9999 || 'Maximum Approved full-time parent fee before fee reduction applied is $9999.00',
        (v) => v > 0 || 'Approved full-time parent fee before fee reduction applied must be greater than $0'
      ],
      rulesParentFeeFrequency: [
        (v) => !!v || 'Parent fee frequency is required'
      ],
    };
  },
  methods: {
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
      var daysPerWeek = 0;
      if (child.selectedCareType && child.selectedCareType.length > 0) {
        for (var i =0; i < child.selectedCareType.length; i++) {
          if (child.selectedCareType[i] == 2) daysPerWeek++;
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
            this.children.push( this.newChild(i));
          }
        } else if (numberOfChildren < this.children.length) {
          var numberOfChildrenToRemove = this.children.length - numberOfChildren;
          for (let i = 1; i <= numberOfChildrenToRemove; i++) {
            this.children.pop();
          }
        }
      }
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
      };
    },

    getOccurrence(array, value) {
      var count = 0;
      for (var i = 0; i <= array.length; i++) {
        if (array[i] == value) {
          count ++;
        }
      }
      return count;
    },

    getReductionFloor(reductionRate, daysFullTime, daysPartTime) {
      var dailyRate = reductionRate / 20;
      return (dailyRate * daysFullTime) + (dailyRate * daysPartTime /2);
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
      // console.log('getFullTimeMonthlyParentFee-Unable to determine feeFrequency:' + feeFrequency);
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
      // console.log('getPartTimeMonthlyParentFee-Unable to determine feeFrequency:' + feeFrequency);
      return null;
    },    

    estimateTheBenefit() {
      if (this.$refs.form.validate() == true) {
        this.showEstimatorResults = true;
        this.results = [];
        let rateTableInfo = null;

        // Get the number of business days for the provided month...
        // const result = this.numberOfBusinessDaysByMonth.find(c => c.month === this.form.month);
        // var numberOfDaysForMonth = result.days;
        var numberOfDaysForMonth = 20; // hardcode to 20 as per new requirements
        
        //for (child in this.form.children) {
        for (var i = 0; i < this.children.length; i++) { 
        // Get the rate table info based on the provided type of child care and childs age category...
          if (this.form.typeOfCare === 'Licenced Group') {
            rateTableInfo = this.GROUP_REDUCTION_RATES.get(this.children[i].childAgeCategory);
          } else if (this.form.typeOfCare === 'Licenced Family') {
            rateTableInfo = this.FAMILY_REDUCTION_RATES.get(this.children[i].childAgeCategory);
          }
        
          // Determine daily rate before fee reduction based on frequency of fee...
          var parentRate;
          var isChildFullTime = this.isFullTime(this.children[i]);
          if (isChildFullTime && this.children[i].partTimeFee && (+this.children[i].partTimeFee < +this.children[i].approvedFee) ) {
            //If child is full time and parent fee is less than approved fee, use the parent fee
            parentRate = this.children[i].partTimeFee;
          } else {
            parentRate = this.children[i].approvedFee;
          }

          var dailyRate;
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
          let partTimeRateFromTable;
          let fullTimeRateFromTable;
          if (numberOfDaysForMonth == 19) {
            partTimeRateFromTable = rateTableInfo.partTime19;
            fullTimeRateFromTable = rateTableInfo.fullTime19;
          } else if (numberOfDaysForMonth == 20) {
            partTimeRateFromTable =  rateTableInfo.partTime20;
            fullTimeRateFromTable = rateTableInfo.fullTime20;
          }

       
          let partTimeTotal;
          let partTimeDailyRate;
          let fullTimeTotal;
          let fullTimeDailyRate;
          let totalRateReduction;

          let reductionAmountPerChild;
          let actualParentFeePerChild;

          // If care schedule is part time then determine the part/full time daily rate and part/full time totals.
          // i.e. A partime care schedule could include both parttime and fulltime days... 3 days of parttime and 2 days at fulltime.
          if (isChildFullTime) {
            /**
             * FULL TIME RATE Reduction Calculations
             */
            // Determine the fulltime daily rate and fulltime total...
            fullTimeDailyRate = ((dailyRate - 10) > fullTimeRateFromTable) ? fullTimeRateFromTable : (dailyRate - 10);
            fullTimeTotal = fullTimeDailyRate * 20;
            partTimeTotal = 0;

            let monthlyParentFee = this.getFullTimeMonthlyParentFee(parentRate, this.children[i].parentFeeFrequency);

            totalRateReduction = partTimeTotal+fullTimeTotal;
            totalRateReduction = Math.max(totalRateReduction, rateTableInfo.rateFloor);
            totalRateReduction = Math.min(totalRateReduction, monthlyParentFee);

            reductionAmountPerChild = totalRateReduction;
            
            if (this.children[i].partTimeFee) {
              monthlyParentFee = this.getFullTimeMonthlyParentFee(this.children[i].partTimeFee, this.children[i].parentFeeFrequency);
            }
            actualParentFeePerChild = monthlyParentFee - reductionAmountPerChild;

          } else {
            /**
             * PART TIME RATE Reduction Calculation
             */
            let partTimeNumberOfDays = 0;
            let fullTimeNumberOfDays = 0;
            // Determine number of part time and full time days entered in the parttime care schedule component...
            for (var j = 0; j < this.children[i].selectedCareType.length; j ++) {
              if (this.children[i].selectedCareType[j] == 1) {
                partTimeNumberOfDays = partTimeNumberOfDays + 1;
              } else if (this.children[i].selectedCareType[j] == 2) {
                fullTimeNumberOfDays = fullTimeNumberOfDays + 1;
              }
            }

            //multiply by 4 since there are decided on 4 weeks / month
            partTimeNumberOfDays = partTimeNumberOfDays * 4;
            fullTimeNumberOfDays = fullTimeNumberOfDays * 4;
            partTimeDailyRate = ((dailyRate - 5) > partTimeRateFromTable) ? partTimeRateFromTable : (dailyRate - 5);
            // console.log('partTimeDailyRate' + partTimeDailyRate);
            partTimeTotal = (partTimeDailyRate * partTimeNumberOfDays);
            fullTimeDailyRate = ((dailyRate - 10) > fullTimeRateFromTable) ? fullTimeRateFromTable : (dailyRate - 10);
            // console.log('fullTimeDailyRate' + fullTimeDailyRate);
            fullTimeTotal = fullTimeDailyRate * fullTimeNumberOfDays;
          
            totalRateReduction = partTimeTotal+fullTimeTotal;
            let rateReductionFloor = this.getReductionFloor(rateTableInfo.rateFloor, fullTimeNumberOfDays, partTimeNumberOfDays);
            let monthlyParentFee = this.getPartTimeMonthlyParentFee(this.children[i].partTimeFee, partTimeNumberOfDays + fullTimeNumberOfDays, this.children[i].parentFeeFrequency);

            //Make sure it's at least the Rate Floor amount
            totalRateReduction = Math.max(totalRateReduction, rateReductionFloor);

            //Make sure it's not over the max rate allowed ammount
            totalRateReduction = Math.min(totalRateReduction, rateTableInfo.monthlyRate);

            //Make sure it's not more than the parent fee
            totalRateReduction = Math.min(totalRateReduction, monthlyParentFee);

            

            let partTimeFeeFloor = (fullTimeNumberOfDays * 10) + (partTimeNumberOfDays * 7);
            // console.log('part time fee floor: ' + partTimeFeeFloor);

            //Make sure to apply minimum reduction Rate fee
            //Then apply minumum parent rate fee if possible
            if (totalRateReduction <= rateReductionFloor) {
              // if rate reduction is already at floor, cannot reduce rate reduction
              // console.log('totalRateReduction <= rateReductionFloor');
              // console.log('Rate floor: ' + rateReductionFloor);
              reductionAmountPerChild = totalRateReduction;
              actualParentFeePerChild = monthlyParentFee - reductionAmountPerChild;
            } else if ((monthlyParentFee - totalRateReduction) < partTimeFeeFloor ) {
              //Parent fees are below fee floor, decrease rate reduction fee
              // console.log('monthlyParentFee < partTimeFeeFloor');
              // console.log('partTimeFeeFloor ' + partTimeFeeFloor);
              // console.log('Rate floor ' + rateReductionFloor);
              // console.log('(monthlyParentFee - totalRateReduction) ' + (monthlyParentFee - totalRateReduction));
              let changeRateBy = Math.min(totalRateReduction - rateReductionFloor, partTimeFeeFloor - (monthlyParentFee - totalRateReduction));
              // console.log('change rate by: ' + changeRateBy);
              reductionAmountPerChild = totalRateReduction - changeRateBy;
              actualParentFeePerChild = monthlyParentFee - reductionAmountPerChild;
            } else {
              //parent fee above fee floor, rate reduction above rate floor
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
          this.results.push({number: i+1, reductionAmountPerChild: Math.round(reductionAmountPerChild), actualParentFeePerChild: Math.round(actualParentFeePerChild)});
        }
      }
    },

    /* Methods related to facility search. Comment out until we are ready to integration with backend.
    rowClicked(row) {
      this.toggleSelection(row.name);
      this.form.careProviderSearch = row.name;
      this.form.typeOfCare = row.typeOfCare;
    },
    toggleSelection(keyID) {
      if (this.selectedRow.includes(keyID)) {
        this.selectedRow = this.selectedRow.filter(
          selectedKeyID => selectedKeyID !== keyID
        );
      } else {10
        this.selectedRow.push(keyID);
      }
    },
    */
    numberFilter: function(evt) {
      evt = (evt) ? evt : window.event;
      let expect = evt.target.value.toString() + evt.key.toString();
      
      if (!/^[0-9]*$/.test(expect)) {
        evt.preventDefault();
      } else {
        return true;
      }
    },
    currencyFilter: function(evt) {
      evt = (evt) ? evt : window.event;
      let expect = evt.target.value.toString() + evt.key.toString();
      
      if (!/^[0-9]*\.?[0-9]*$/.test(expect)) {
        evt.preventDefault();
      } else {
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
    }

  },
  computed: {
  },
  mounted() {
    this.children = [
      this.newChild(1)
    ];
    this.results = [];

    // TODO: move to constants and import as properties... once i figure it out.
    this.GROUP_REDUCTION_RATES = new Map();
    this.GROUP_REDUCTION_RATES.set('0 - 18 Months', {monthlyRate: 900, fullTime19: 47.3684, fullTime20: 45.0000, partTime19: 23.6842, partTime20: 22.5000, rateFloor: 350});
    this.GROUP_REDUCTION_RATES.set('18 - 36 Months', {monthlyRate: 900, fullTime19: 47.3684, fullTime20: 45.0000, partTime19: 23.6842, partTime20: 22.5000, rateFloor: 350});
    this.GROUP_REDUCTION_RATES.set('3 Years to Kindergarten', {monthlyRate: 545, fullTime19: 28.6842, fullTime20: 27.2500, partTime19: 14.3421, partTime20: 13.6250, rateFloor: 100});
    this.GROUP_REDUCTION_RATES.set('Before & After School (Kindergarten Only)', {monthlyRate: 320, fullTime19: 16.8421, fullTime20: 16.0000, partTime19: 8.4211, partTime20: 8.0000, rateFloor: 100});

    this.FAMILY_REDUCTION_RATES = new Map();
    this.FAMILY_REDUCTION_RATES.set('0 - 18 Months', {monthlyRate: 600, fullTime19: 31.5789, fullTime20: 30.0000, partTime19: 15.7895, partTime20: 15.0000, rateFloor: 200});
    this.FAMILY_REDUCTION_RATES.set('18 - 36 Months', {monthlyRate: 600, fullTime19: 31.5789, fullTime20: 30.0000, partTime19: 15.7895, partTime20: 15.0000, rateFloor: 200});
    this.FAMILY_REDUCTION_RATES.set('3 Years to Kindergarten', {monthlyRate: 500, fullTime19: 26.3158, fullTime20: 25.0000, partTime19: 13.1579, partTime20: 12.5000, rateFloor: 60});
    this.FAMILY_REDUCTION_RATES.set('Before & After School (Kindergarten Only)', {monthlyRate: 320, fullTime19: 16.8421, fullTime20: 16.0000, partTime19: 8.4211, partTime20: 8.0000, rateFloor: 60});
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
  font-family: "BCSans";
}

.v-input, .v-select-list {
  font-size: 16px !important;
  font-family: "BCSans" !important;
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
  font-family: BCSans;
  font-weight: 600;
  font-size: 16px
}

.v-toolbar__title {
  font-size: 14px !important;
  color: #39598A;
  font-weight: 600;
  font-family: "BCSans" !important;
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


</style>
