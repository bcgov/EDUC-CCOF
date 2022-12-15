<template>
  <!--TODO: add in isValidForm ruleset-->
  <v-form ref="isValidForm" v-model="isValidForm">
    <v-container class="px-10">

      <!-- <v-btn color="info" outlined x-large  @click="save()">
            UPDATE FEES</v-btn> -->

      <p class="text-h3 text-center"> Child Care Fee Reduction Initiative (CCFRI)</p> <br>

      <p class="text-h6 text-center"> Facility Name:  {{currentFacility.facilityName}}  </p> <br><br>
      <p>
        Enter the fees you charged a new parent for full-time care at this facility for the months below. <br><br>
        If you have more than one fee for the same category, <strong> enter the highest fee. </strong><br><br>
        <strong>Enter the fee before CCFRI is applied. </strong> <br><br>
        Note: Fee increases will be reviewed and additional information may be requested, which may result in increased processing times. If approved, this fee will be posted on the Ministry website. <br><br>
      </p>

      
      <v-skeleton-loader max-height="475px" v-if="loading" :loading="loading" type="image, image, image"></v-skeleton-loader>

      <v-card  
      v-for="({programYear, childCareCategory,} , index) in ccfriChildCareTypes" :key="index"
      
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
              <!-- qqq: {{childCareTypes[index].approvedFeeApr}} -->
              <v-radio-group
              :rules = "rules"
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

            <v-container v-if="!feeSchedule[index]"></v-container>

              <v-container v-else class="ma-0 pa-0">
              <v-row>
                <v-col>
                  <label>Enter your highest full-time {{feeSchedule[index]}} fee in every month below. If you do not charge a fee (e.g. if the facility is closed) enter zero.</label>
                </v-col>
              </v-row>
              <v-row>
                <v-col
                  class="col-6 col-md-2"
                >
                <!-- childCareTypes[index].approvedFeeApr 
                  I think I can replace all the model with childCareTypes data... I'd like to test and make sure it doesn't break if fees do not exist yet.-->
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
                    <v-text-field outlined required v-model="model.datePicker" label="Select Start and End Dates (YYYY-MM-DD)" readonly v-bind="attrs" v-on="on">
                    </v-text-field>
                  </template>
                    <v-date-picker
                      range 
                      clearable 
                      v-model="model.datePicker" 
                      @input="calendarMenu = false">
                    </v-date-picker>
                </v-menu>
              </v-col>
              <v-col class="col-md-4 col-12 ">
                  <!-- I added in Alexy's "required" ruleset that makes the textbox go red. Maybe not needed here since the button
                  will not work unless all fields are filled in?
                -->
                <v-text-field
                  class = ""
                  v-model="model.closureReason"
                  label="Purpose of Closure"
                  outlined
                  clearable
                  required
                   
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
                    value= 1
                  ></v-radio>
                  <v-radio
                    label="No"
                    value= 0
                  ></v-radio>
                </v-radio-group>
              </v-col>
              <v-col>
                <v-btn class="col-3 col-md-1"
                  v-if =" !model.closureReason || !model.datePicker|| !model.closedFeesPaid"
                    disabled
                >ADD</v-btn>
                <v-btn v-else v-on:click="addDate">ADD</v-btn>
              </v-col>
            </v-row>
            <v-row>
              <!-- <v-tooltip top color="warning">
                <template v-slot:activator="{ on, attrs }"> v-bind="attrs"
                    v-on="on" -->
                  <v-btn v-for="date in dates" :key="date.id"
                    v-on:click="removeDate(date.id)"
                    
                  >
                  Closed from : {{date.selectedDates[0]}} - {{date.selectedDates[1] ? date.selectedDates[1] : date.selectedDates[0] }} 
                  Reason: {{date.message}}  FEES PAID?: {{date.feesPaidWhileClosed == 1 ? "Yes" : "No"}}
                  </v-btn>
                <!-- </template>
                <span>Delete Date</span>
              </v-tooltip> -->
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
              v-model="model.notes"
            ></v-textarea>
          </div>
        </v-card-text>
      </v-card>

      
      <v-row justify="space-around">
        <v-btn color="info" outlined x-large @click="previous()">
          Back</v-btn>
          <!--!isValidForm-->
        <v-btn color="secondary" outlined x-large @click="next()" :disabled=" false">Next</v-btn>
        <v-btn color="primary" outlined x-large @click="save()">
          Save</v-btn>
      </v-row>

    </v-container>
  </v-form>
</template>
<script>
import { PATHS } from '@/utils/constants';
import { mapGetters, mapState, mapActions, mapMutations} from 'vuex';
import ApiService from '@/common/apiService';
import alertMixin from '@/mixins/alertMixin';
import axios from 'axios';

import _ from 'lodash';

let dates = [];
let datePicker= null;          //vmodel for entering closure fees
let closedFeesPaid = undefined;       //vmodel for entering closure fees
let closureReason= undefined;  //vmodel for entering closure fees
let closureFees;
let isFixedFee= {};
let feeSchedule = {};
let notes = '';
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
let childCareTypes = {};   
let model = { x: [],
  dates,
  datePicker,          //vmodel for entering closure fees
  closedFeesPaid,       //vmodel for entering closure fees
  closureReason, 
  closureFees,
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
  notes,
  childCareTypes
};


export default {

  props: {
    currentYear: {
      type: Number,
      default: 2023,
      required: false,
    },
  },
  mixins: [alertMixin],
  data() {
    return {
      loading: true,
      processing: false,
      model,
      facilityProgramYears: [],
      isValidForm : false,
      datePicker,          //vmodel for entering closure fees
      //closedFeesPaid,       //vmodel for entering closure fees
      closureReason,  //vmodel for entering closure fees
      calendarMenu: undefined,
      closureFees: undefined,
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
      childCareTypes,
      feeRules: [
        (v) => !!v  || 'Required.',
        (v) => v > 0  || 'Input a positve number',
        (v)  => v <=  9999|| 'Max fee is $9999.00',
      ],
      rules: [
        (v) => !!v  || 'Required.',
      ],
      

    };
  },
  mounted() {
    this.model = this.$store.state.ccfriApp.model ?? model;
    this.childCareTypes = this.model.childCareTypes; //this was trying to get the numbers to load and go into the store
  },
  beforeRouteLeave(_to, _from, next) {
    this.$store.commit('ccfriApp/model', this.model);
    
    this.addModelToStore({ ccfriId: this.$route.params.urlGuid, model: this.model }); //addModel - 
    next();
  },
  computed: {
    ...mapGetters('app', ['lookupInfo']),
    ...mapGetters('auth', ['userInfo']),
    ...mapState('app', ['navBarList', 'isRenewal']),
    ...mapState('ccfriApp', ['CCFRIFacilityModel', 'ccfriChildCareTypes']),
    ...mapState('organization', ['applicationId']),

    findIndexOfFacility(){
      return this.navBarList.findIndex((element) =>{ 
        return element.ccfriApplicationId == this.$route.params.urlGuid;
      });
    },
    currentFacility(){
      return this.navBarList[this.findIndexOfFacility];
    },
    nextFacility(){
      return this.navBarList[this.findIndexOfFacility + 1];
    }
  },
  watch: {
    //get facilityID from here and then set it ! 
    '$route.params.urlGuid': {
      async handler() {
        try {
          await this.loadFacilityCareTypes(this.currentFacility.facilityId);
          await this.loadCCFRIFacility(this.$route.params.urlGuid); 
          
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
  methods: {
    ...mapActions('ccfriApp', ['loadCCFRIFacility', 'loadFacilityCareTypes']),  
    ...mapMutations('ccfriApp', ['setFeeModel', 'addModelToStore']),  
    addDate(){
      dates.push({
        message: this.model.closureReason,
        selectedDates: this.model.datePicker,
        feesPaidWhileClosed: this.model.closedFeesPaid,
        id: model.dates.length
      });
      this.model.closureReason = '';
      this.model.datePicker = '';
      this.model.closedFeesPaid= '';
    },
    removeDate(removedId){
      const indexOfItemToRemove = this.dates.findIndex((obj) => obj.id === removedId);
      this.dates.splice(indexOfItemToRemove,1);
      console.log(this.dates);
    },
    previous() {
      console.log(this.navBarList);
      //this.$router.back();  
    },
    next() {
      //TODO: Logic will need to exist here to eval if we should go to the RFI screens also
      console.log(this.nextFacility);

      if (this.nextFacility && this.isRenewal){
        console.log('going to next fac EXISTING FEES page');
        //check here if renew - then send them to appropriate screen 
      }
      else if (this.nextFacility ){
        console.log('going to next fac NEW fees page');
        //TODO: this needs to check if opt in exists -- maybe in the nextFacility fn?
        this.$router.push({path : `${PATHS.addNewFees}/${this.nextFacility.ccfriApplicationId}`});
      }
      else {
        console.log('going to ece-we!');
        this.$router.push({path : `${PATHS.eceweEligibility}/${this.applicationId}`});
      }
    
      this.save(); //-- right now because of the refresh this is out- depending how we go forward maybe put back in 
      //this.$router.push(PATHS.ccfriRequestMoreInfo); //TODO: add logic for when page is done / to go to this page 
    },
    async save () {
      this.processing = true;
      let payload = [];
      // feeFrequency: (item.ccof_frequency == '100000000') ? 'Monthly' STATUS CODES 
      // ((item.ccof_frequency == '100000001') ? 'Weekly' : 
      // ((item.ccof_frequency == '100000002') ? 'Daily' : '') )

      //for each child care type - send a request. 

      //index will also match the order of how the cards are displayed. 
      this.CCFRIFacilityModel.childCareTypes.forEach (async (childCareType, index) => { // FOR EACH the date groups?

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
          facilityClosureDates: dates,
          notes: this.model.notes
        };

        console.log(this.model.notes);

        payload[index].feeFrequency = model.feeSchedule[index] === 'monthly'? '100000000' : model.feeSchedule[index]  === 'weekly'? '100000001' :model.feeSchedule[index ] === 'daily'? '100000002' :'null';
  
        Object.assign(payload[index], 
          {
            //aprFee : childCareTypes[index].approvedFeeApr,
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

      }); // end FOR EACH

      payload = JSON.parse(JSON.stringify(payload));
      try {
        this.applicationStatus = await ApiService.apiAxios.patch('/api/application/parentfee/', payload);
        this.setSuccessAlert('Success! CCFRI Parent fees have been saved.');
      } catch (error) {
        console.info(error);
        this.setFailureAlert('An error occurred while saving. Please try again later.');
      }
      this.processing = false;
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
