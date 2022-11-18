<template>
  <!--TODO: add in isValidForm ruleset-->
  <v-form ref="ccfriform" v-model="isValidForm">
    <v-container class="px-10">

      <v-btn color="info" outlined x-large  @click="updateParentFees()">
            UPDATE FEES</v-btn>

            {{apr}} {{may}}

            <!-- {{facilityLookupInfo}} -->
            <!-- {{lookupInfo.childCareCategory[1]}} -->

      <p class="text-h3 text-center"> Child Care Fee Reduction Initiative (CCFRI)</p> <br>

      <p class="text-h5 text-center"> CCOF ID: {{currentFacility.facilityId}}, Facility Name:  {{currentFacility.facilityName}}  , Licence #: {{facilityLookupInfo.licenseNumber}} </p> <br><br>
      <p>
        Enter the fees you charged a new parent for full-time care atgit  this facility for the months below. <br><br>
        If you have more than one fee for the same category, enter the highest fee. <br><br>
        <strong>Enter the fee before CCFRI is applied. </strong> <br><br>
        Note: Fee increases will be reviewed and additional information may be requested, which may result in increased processing times. If approved, this fee will be posted on the Ministry website. <br><br>
      </p>

      

      <v-card  
      v-for="({key, programYear, childCareCategory} , index) in facilityLookupInfo.childCareTypes" :key="index"
      
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
                Parent Fees {{programYear}}: Full-Time {{childCareCategory}}
              </p>
            </div>
            <div class="px-md-12 px-7">
              <br>
              <p class="text-h6 text--primary">
                Are your parent fees
              </p>
              
              <v-radio-group
                v-model="feeSchedule[index]"
              >
                <v-radio
                  label="Daily"
                  value="daily"
                ></v-radio>
                <v-radio
                  label="Weekly"
                  value="weekly"
                ></v-radio>
                <v-radio
                  label="Monthly"
                  value="monthly"
                ></v-radio>
              </v-radio-group>

              <!-- <br>
                WIreframe comment said to remove fixed fee option. Leaving this here for now in case they change their minds back to include it


              <p class="text-h6 text--primary">
                Is your fee a fixed fee?
              </p>
              <v-radio-group
                required
                v-model="isFixedFee[index]"
              >
                <v-radio
                  label="Yes"
                  value="Yes"
                ></v-radio>
                <v-radio
                  label="No"
                  value="No"
                ></v-radio>
              </v-radio-group>
              isFixedFee[index]==='No' && 
            -->
            <v-container v-if="!feeSchedule[index]"></v-container>

              <v-container v-else-if="feeSchedule[index] !='daily'" class="ma-0 pa-0">
              <v-row>
                <v-col>
                  <label>Enter your highest full-time {{feeSchedule[index]}} fee in every month below. If you do not charge a fee (e.g. if the facility is closed) enter zero.</label>
                </v-col>
              </v-row>
              <v-row>
                <v-col
                  class="col-6 col-md-2"
                >
                  <v-text-field type="number" outlined :rules="feeRules"  v-model.number="apr[index]" label="April" prefix="$"/>
                </v-col>
                <v-col 
                  class="col-6 col-md-2"
                >
                  <v-text-field type="number" outlined :rules="feeRules"  v-model.number="may[index]" label="May" prefix="$"/>
                </v-col >
                <v-col 
                  class="col-6 col-md-2"
                >
                  <v-text-field type="number" outlined :rules="feeRules"  v-model.number="jun[index]" label="June" prefix="$"/>
                </v-col>
                <v-col
                class="col-6 col-md-2"
                >
                  <v-text-field type="number" outlined :rules="feeRules"  v-model.number="jul[index]" label="July" prefix="$"/>
                </v-col>
                <v-col 
                  class="col-6 col-md-2"
                >
                  <v-text-field type="number" outlined :rules="feeRules"  v-model.number="aug[index]" label="August" prefix="$" />
                </v-col>
                <v-col
                  class="col-6 col-md-2"
                >
                  <v-text-field type="number" outlined :rules="feeRules"  v-model.number="sep[index]" label="September" prefix="$" />
                </v-col>
              </v-row>

              <v-row>
                <v-col 
                  class="col-6 col-md-2">
                  <v-text-field type="number" outlined :rules="feeRules"  v-model.number="oct[index]" label="October" prefix="$"/>
                </v-col>
                <v-col 
                  class="col-6 col-md-2">
                  <v-text-field type="number" outlined :rules="feeRules"  v-model.number="nov[index]" label="November" prefix="$"/>
                </v-col >
                <v-col 
                  class="col-6 col-md-2">
                  <v-text-field type="number" outlined :rules="feeRules"  v-model.number="dec[index]" label="December" prefix="$"/>
                </v-col >
                <v-col
                  class="col-6 col-md-2">
                  <v-text-field type="number" outlined :rules="feeRules"  v-model.number="jan[index]" label="Jan" prefix="$"/>
                </v-col>
                <v-col
                  class="col-6 col-md-2">
                  <v-text-field type="number" outlined :rules="feeRules"  v-model.number="feb[index]" label="Feb" prefix="$" />
                </v-col>
                <v-col
                  class="col-6 col-md-2">
                  <v-text-field type="number" outlined :rules="feeRules"  v-model.number="mar[index]" label="March" prefix="$" />
                </v-col>
              </v-row>
            
              </v-container>

              <v-container v-else-if="feeSchedule[index] ==='daily' " class="ma-0 pa-0">
                <v-row>
                  <v-col>
                    <label>Enter your {{feeSchedule[index]}} fee in every day below. If you do not charge a fee (e.g. if the facility is closed) enter zero.</label>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col
                    class="col-6 col-md-2">
                    <v-text-field type="number" outlined :rules="feeRules"  v-model.number="mon[index]" label="Monday" prefix="$"/>
                  </v-col>
                  <v-col
                    class="col-6 col-md-2">
                    <v-text-field type="number" outlined :rules="feeRules"  v-model.number="tue[index]" label="Tuesday" prefix="$" />
                  </v-col>
                  <v-col
                    class="col-6 col-md-2">
                    <v-text-field type="number" outlined :rules="feeRules"  v-model.number="wed[index]" label="Wednesday" prefix="$" />
                  </v-col>
                  <v-col
                    class="col-6 col-md-2">
                    <v-text-field type="number" outlined :rules="feeRules"  v-model.number="thu[index]" label="Thursday" prefix="$"/>
                  </v-col>
                  <v-col 
                    class="col-6 col-md-2">
                    <v-text-field type="number" outlined :rules="feeRules"  v-model.number="fri[index]" label="Friday" prefix="$"/>
                  </v-col >
                  <v-col 
                    class="col-6 col-md-2">
                    <v-text-field type="number" outlined :rules="feeRules"  v-model.number="sat[index]" label="Saturday" prefix="$"/>
                  </v-col >
                  <v-col
                    class="col-6 col-md-2">
                    <v-text-field type="number" outlined :rules="feeRules"  v-model.number="sun[index]" label="Sunday" prefix="$"/>
                  </v-col>
                
                </v-row>

              </v-container>

              <!-- <v-container v-else class="ma-0 pa-0">
                <v-row>
                    <v-col>
                      <label>What is the {{feeSchedule[index]}} fixed fee?</label>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col
                      class="col-6 col-md-2">
                        <v-text-field type="number" outlined :rules="feeRules"  v-model.number="fixedFeeAmount[index]" prefix="$"/>
                    </v-col>
                </v-row>
              </v-container> -->
            </div>
          </v-card-text>
      </v-card>

      
      




      <v-card elevation="6" class="px-0 py-0 mx-auto my-10 rounded-lg col-12 "
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
              Do you charge parent fees at this facility for any closures on business days (other than statuary holidays)?
            </p>
          </div>
          <div class="px-md-12 px-7">
            <br>
            <v-radio-group
              required
              v-model="model.closureFees"
            >
              <v-radio
                label="Yes"
                value="Yes"
              ></v-radio>
              <v-radio
                label="No"
                value="No"
              ></v-radio>
            </v-radio-group>

            <v-row v-if = "model.closureFees === 'Yes'">
              <v-col class="col-md-4 col-12">
                <v-menu  v-model="calendarMenu" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="auto">
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field outlined required v-model="datePicker" label="Select Start and End Dates (YYYY-MM-DD)" readonly v-bind="attrs" v-on="on">
                    </v-text-field>
                  </template>
                    <v-date-picker range  v-model="datePicker" @input="calendarMenu = false">
                    </v-date-picker>
                </v-menu>
              </v-col>
              <v-col class="col-md-4 col-12 ">
                  <!-- I added in Alexy's "required" ruleset that makes the textbox go red. Maybe not needed here since the button
                  will not work unless all fields are filled in?
                -->
                <v-text-field
                  class = ""
                  v-model="closureReason"
                  label="Purpose of Closure"
                  outlined
                  clearable
                  required
                  :rules="rules.required" 
                ></v-text-field>
              </v-col>
              <v-col class="col-md-3 col-12">
                <v-radio-group
                  required
                  row
                  v-model="model.closedFeesPaid"
                  label="Did parents pay for this closure?"
                >
                  <v-radio
                    label="Yes"
                    value="Yes"
                  ></v-radio>
                  <v-radio
                    label="No"
                    value="No"
                  ></v-radio>
                </v-radio-group>
              </v-col>
              <v-col>
                <v-btn class="col-3 col-md-1"
                  v-if =" closureReason ==='' || closureReason ===' ' || closureReason ===null|| closureReason ===undefined 
                  || datePicker===null || datePicker===' ' || datePicker=== undefined
                  || closedFeesPaid === '' || closedFeesPaid === null || closedFeesPaid === undefined "
                    disabled
                >ADD</v-btn>
                <v-btn v-else v-on:click="addDate">ADD</v-btn>
              </v-col>
            </v-row>
            <v-row>
              <v-btn v-for="date in dates" :key="date.message"
                v-on:click="removeDate(date.id)">
                {{date.message}} FOR DATES : {{date.selectedDates}} FEES PAID?: {{date.feesPaidWhileClosed}} ID: {{date.id}}
              </v-btn>
            </v-row>
          </div>
        </v-card-text>
      </v-card>

      <v-card elevation="6" class="px-0 py-0 mx-auto my-10 rounded-lg col-12 "
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
              Is there any other information about this facility you would like us to know?
            </p>
          </div>
          <div class="px-md-12 px-7">
            <br>
            <v-textarea
              outlined
              name="input-7-4"
              label="Describe here"
            ></v-textarea>
          </div>
        </v-card-text>
      </v-card>

      <v-row justify="space-around">
        <v-btn color="info" outlined x-large @click="previous()">
          Back</v-btn>
          <!--add form logic here to disable/enable button-->
        <v-btn color="secondary" outlined x-large @click="next()" :disabled="false">Next</v-btn>
        <v-btn color="primary" outlined x-large>
          Save</v-btn>
      </v-row>
    </v-container>
  </v-form>
</template>
<script>
import rules from '@/utils/rules';
import { PATHS } from '@/utils/constants';
import { mapGetters, mapState} from 'vuex';
import ApiService from '@/common/apiService';
import axios from 'axios';

import _ from 'lodash';

// 0-18 months
const CHILD_CARE_CATEGORY_GUID = '19abd92c-0436-ed11-9db1-002248d53d53'; //TODO - this should be a lookup guid saved in cache? (says Hoang) 0-18mo
const PROGRAM_YEAR = 'fba5721b-9434-ed11-9db1-002248d53d53'; //lookup. 2021 - 22
//const PROGRAM_YEAR = '2ad4c331-9434-ed11-9db1-002248d53d53'; //lookup. 2022 - 23
const CCFRI_APPLICATION_GUID = '43f6494d-1d5d-ed11-9562-002248d53d53'; //todo - should get grabbed from the page;

let dates = [];
let closureFees;
let closedFeesPaid = [];
let isFixedFee= {};
let feeSchedule = {};
let jan = {};
let feb = {};
let mar = {};
let apr = {};
let may = {};
let jun = {};
let jul = {};
let aug = {};
let sep = {};
let oct = {};
let nov = {};
let dec = {};
let mon = {};
let tue = {};
let wed = {};
let thu = {};
let fri = {};
let sat = {};
let sun = {};   
let model = { x: [],
  dates,
  closureFees,
  closedFeesPaid,
  isFixedFee,
  feeSchedule,
  jan,
  feb,
  mar,
  apr,
  may,
  jun,
  jul,
  aug,
  sep,
  oct,
  nov,
  dec,
  mon,
  tue,
  wed,
  thu,
  fri,
  sat,
  sun
  
};


export default {

  props: {
    currentYear: {
      type: Number,
      default: 2023,
      required: false,
    },
  },
  data() {
    return {
      rules,
      model,
      facilityLookupInfo: {},
      isValidForm : undefined,
      datePicker: null,
      calendarMenu: undefined,
      closureFees: undefined,
      closureReason: undefined,
      closedFeesPaid,
      dates,
      feeSchedule,
      jan,
      feb,
      mar,
      apr,
      may,
      jun,
      jul,
      aug,
      sep,
      oct,
      nov,
      dec,
      mon,
      tue,
      wed,
      thu,
      fri,
      sat,
      sun,   feeRules: [
        (v) => !!v  || 'Required.',
        (v) => v > 0  || 'Input a positve number',
        (v)  => v <=  9999|| 'Max fee is $9999.00',
      ],
      

    };
  },
  mounted() {
    this.model = this.$store.state.ccfriApp.model ?? model;
  },
  beforeRouteLeave(_to, _from, next) {
    this.$store.commit('ccfriApp/model', this.model);
    next();
  },
  computed: {
    ...mapGetters('app', ['lookupInfo']),
    ...mapGetters('auth', ['userInfo']),
    ...mapState('facility', ['facilityList']),
    currentYearTwoDigit() {
      return this.currentYear - 2000;
    },
    nextYearTwoDigit() {
      return this.currentYear - 1999;
    },
    prevYearTwoDigit() {
      return this.currentYear - 2001;
    },
    twoYearsAgoTwoDigit() {
      return this.currentYear - 2002;
    },
    currentFacility(){
      return this.facilityList[0]; //TODO - change this to work with multiple facilities 
    }
  },
  beforeMount: function() {


    this.getFacility(this.facilityList[0].facilityId); //TODO -- Work on getting this facility into the store and pushing it there
    console.log(this.facilityLookupInfo);

    // this.currentFacility.facilityAgeGroups.forEach((ageGroup, index) => {
    //   let currentKey = `${this.prevYearTwoDigit}-${this.currentYearTwoDigit}-${ageGroup}`;
    //   this.facilityFees.push({
    //     'key' : currentKey, 
    //     'date' : `${this.prevYearTwoDigit}-${this.currentYearTwoDigit}`,
    //     'title': this.currentFacility.facilityAgeGroupNames[index],
    //     'feeSch' : '',
    //   });
    // });
    // this.currentFacility.facilityAgeGroups.forEach((ageGroup, index) => {
    //   let currentKey = `${this.currentYearTwoDigit}-${this.nextYearTwoDigit}-${ageGroup}`;
    //   //console.log(currentKey);
    //   this.facilityFees.push({
    //     'key' : currentKey, 
    //     'date' : `${this.currentYearTwoDigit}-${this.nextYearTwoDigit}`,
    //     'title': this.currentFacility.facilityAgeGroupNames[index]
      
    //   });
    //   //console.log(th)
    // });
  },
  methods: {
    //this gets the more detailed facility info -- maybe we don't need to make the call here?
    async getFacility (id) {
      try {
        this.facilityLookupInfo = await (axios.get('/api/facility/'+id));
        this.facilityLookupInfo = this.facilityLookupInfo.data;
        //console.log(this.facilityLookupInfo.data);
      } catch (error) {
        console.info(error);
      }
    },
    addDate(){
      dates.push({
        message: this.closureReason,
        selectedDates: this.datePicker,
        feesPaidWhileClosed: this.closedFeesPaid,
        id: this.dates.length
      });
      this.closureReason = '';
      this.datePicker = '';
      this.closedFeesPaid= '';
    },
    removeDate(removedId){
      const indexOfItemToRemove = this.dates.findIndex((obj) => obj.id === removedId);
      this.dates.splice(indexOfItemToRemove,1);
      console.log(this.dates);
    },
    previous() {
      this.$router.push(PATHS.ccfriHome); //TODO: change this, from CCOF page
    },
    next() {
      this.$router.push(PATHS.ccfriRequestMoreInfo); //TODO: add logic for when page is done / to go to this page 
    },
    async updateParentFees () {
      let payload = [];
      // feeFrequency: (item.ccof_frequency == '100000000') ? 'Monthly' 
      // ((item.ccof_frequency == '100000001') ? 'Weekly' : 
      // ((item.ccof_frequency == '100000002') ? 'Daily' : '') )

      //for each child care type - send a request. This will need to be done x2 per child care type. One request for each year of fees. 

      //index will also match the order of how the cards are displayed. 
      this.facilityLookupInfo.childCareTypes.forEach (async (childCareType, index) => { // FOR EACH the date groups?

        //this finds the GUID for the child care category from the lookup api. It checks against the string title -- this could be risky if the strings don't match exactly
        let childCareCatGUID = _.find(this.lookupInfo.childCareCategory, {ccof_description : childCareType.childCareCategory });

        if (childCareCatGUID){
          childCareCatGUID = childCareCatGUID.ccof_childcare_categoryid;
        }

       
        //payload will need to look different if fee is monthly / daily 
        payload[index] = {
          ccfriApplicationGuid : this.currentFacility.ccfriApplicationId, //CCFRI application GUID 
          childCareCategory : childCareCatGUID, //found by .find above -- uses the /lookup api data to find childcare category GUID. 
          programYear : childCareType.programYearId,//program year GUID,
        };

        payload[index].feeFrequency = model.feeSchedule[index] === 'monthly'? '100000000'  : model.feeSchedule[index]  === 'weekly'? '100000001' :model.feeSchedule[index ] === 'daily'? '100000002' :'null';
  
        if (model.feeSchedule[index] === 'monthly' || model.feeSchedule[index] === 'weekly' ){
          Object.assign(payload[index], 
            {
              aprFee : apr[index],
              mayFee : may[index],
              junFee : jun[index],
              julFee : jul[index],
              augFee : aug[index],
              sepFee : sep[index],
              octFee : oct[index],
              novFee : nov[index],
              decFee : dec[index],
              janFee : jan[index],
              febFee : feb[index],
              marFee : mar[index],
            }
          );
        } //TODO : add daily payload -- but Dynamics does not support that yet ! 


      }); // end FOR EACH

      payload = JSON.parse(JSON.stringify(payload));

      console.log(payload);

      try {
        this.applicationStatus = await ApiService.apiAxios.patch('/api/application/parentfee/', payload);
      } catch (error) {
        console.info(error);
      }



    },
  }
};
</script>

<style scoped>

.blueBorder{
  border-top: 55px solid grey !important;
}

.backG{
  background-color: lightgray;
}

</style>
