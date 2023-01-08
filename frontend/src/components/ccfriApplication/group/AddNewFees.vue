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

      <div v-for="(item , index) in CCFRIFacilityModel.childCareTypes" :key="index">
        <v-card  v-if = "!item.deleteMe"
        
        
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
                <!-- <p class="text-h6 text--primary">
                  Are your parent fees
                  
                </p> -->
                <!-- qqq: {{childCareTypes[index].approvedFeeApr}} -->
                <v-radio-group
                :rules = "rules"
                  v-model="item.feeFrequency"
                  label="Are your parent fees"
                >
                  <v-radio
                    label="Daily"
                    value="Daily"
                  ></v-radio>
                  <v-radio
                    label="Weekly"
                    value="Weekly"
                  ></v-radio>
                  <v-radio
                    label="Monthly"
                    value="Monthly"
                  ></v-radio>
                </v-radio-group>

              <v-container v-if="!item.feeFrequency"></v-container>

                <v-container v-else class="ma-0 pa-0">
                <v-row>
                  <v-col>
                    <label>Enter your highest full-time {{item.feeFrequency}} fee in every month below. If you do not charge a fee (e.g. if the facility is closed) enter zero.</label>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col
                    class="col-6 col-md-2"
                  >
                  <!-- childCareTypes[index].approvedFeeApr 
                    I think I can replace all the model with childCareTypes data... I'd like to test and make sure it doesn't break if fees do not exist yet.-->
                    <v-text-field type="number" outlined :rules="feeRules"  v-model.number="item.approvedFeeApr" label="April" prefix="$"/>
                  </v-col>
                  <v-col 
                    class="col-6 col-md-2"
                  >
                    <v-text-field type="number" outlined :rules="feeRules"  v-model.number="item.approvedFeeMay" label="May" prefix="$"/>
                  </v-col >
                  <v-col 
                    class="col-6 col-md-2"
                  >
                    <v-text-field type="number" outlined :rules="feeRules"  v-model.number="item.approvedFeeJun" label="June" prefix="$"/>
                  </v-col>
                  <v-col
                  class="col-6 col-md-2"
                  >
                    <v-text-field type="number" outlined :rules="feeRules"  v-model.number="item.approvedFeeJul" label="July" prefix="$"/>
                  </v-col>
                  <v-col 
                    class="col-6 col-md-2"
                  >
                    <v-text-field type="number" outlined :rules="feeRules"  v-model.number="item.approvedFeeAug" label="August" prefix="$" />
                  </v-col>
                  <v-col
                    class="col-6 col-md-2"
                  >
                    <v-text-field type="number" outlined :rules="feeRules"  v-model.number="item.approvedFeeSep" label="September" prefix="$" />
                  </v-col>
                </v-row>

                <v-row>
                  <v-col 
                    class="col-6 col-md-2">
                    <v-text-field type="number" outlined :rules="feeRules"  v-model.number="item.approvedFeeOct" label="October" prefix="$"/>
                  </v-col>
                  <v-col 
                    class="col-6 col-md-2">
                    <v-text-field type="number" outlined :rules="feeRules"  v-model.number="item.approvedFeeNov" label="November" prefix="$"/>
                  </v-col >
                  <v-col 
                    class="col-6 col-md-2">
                    <v-text-field type="number" outlined :rules="feeRules"  v-model.number="item.approvedFeeDec" label="December" prefix="$"/>
                  </v-col >
                  <v-col
                    class="col-6 col-md-2">
                    <v-text-field type="number" outlined :rules="feeRules"  v-model.number="item.approvedFeeJan" label="Jan" prefix="$"/>
                  </v-col>
                  <v-col
                    class="col-6 col-md-2">
                    <v-text-field type="number" outlined :rules="feeRules"  v-model.number="item.approvedFeeFeb" label="Feb" prefix="$" />
                  </v-col>
                  <v-col
                    class="col-6 col-md-2">
                    <v-text-field type="number" outlined :rules="feeRules"  v-model.number="item.approvedFeeMar" label="March" prefix="$" />
                  </v-col>
                </v-row>
              
                </v-container>
              </div>
            </v-card-text>
        </v-card>
      </div>

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
              label="Do you charge parent fees at this facility for any closures on business days (other than statuary holidays)?"
              :rules = "rules"
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


              <v-row  v-for="(obj, index) in CCFRIFacilityModel.dates" :key="index">
              
                <v-col class="col-md-1 col-12 mx-0">
                  <v-icon
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
                    <v-text-field outlined :rules="rules" v-model="obj.formattedStartDate"  label="Select Start Date (YYYY-MM-DD)" readonly v-bind="attrs" v-on="on">
                    </v-text-field>
                  </template>
                    <v-date-picker 
                      clearable 
                      v-model="obj.formattedStartDate" 
                      @input="calendarMenu1 = false">
                      
                    </v-date-picker>
                 </v-menu>
                </v-col>

                <v-col class="col-md-3 col-12">
                  <v-menu  v-model="obj.calendarMenu2" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="auto">
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field outlined required v-model="obj.formattedEndDate"  label="Select End Date (YYYY-MM-DD)" readonly v-bind="attrs" v-on="on">
                    </v-text-field>
                  </template>
                    <v-date-picker 
                      clearable 
                      v-model="obj.formattedEndDate" 
                      @input="calendarMenu2 = false">
                    </v-date-picker>
                 </v-menu>
                </v-col>
                
                <v-col class="col-md-3 col-12 ">
                  <v-text-field
                    class = ""
                    v-model="obj.closureReason"
                    label="Closure Reason"
                    outlined
                    clearable
                    :rules="rules"
                  ></v-text-field>
                </v-col>

                <v-col class="col-md-2 col-12 mt-n10">
                  <v-radio-group
                    row
                    v-model="obj.feesPaidWhileClosed"
                    label="Did parents pay for this closure?"
                    :rules="rules"
                  >
                    <v-radio
                      :off-icon="obj.feesPaidWhileClosed == 1 ? '$radioOn' :  '$radioOff' "
                      label="Yes"
                      value= 1
                    ></v-radio>
                    <v-radio
                    :off-icon="obj.feesPaidWhileClosed === 0 ? '$radioOn' : obj.g "
                      label="No"
                      value= 0
                    ></v-radio>
                  </v-radio-group>
                </v-col>

                <span class="white--text"> . </span>
                <v-divider></v-divider>
              </v-row> <!-- end v for-->
              <br><br>
                
                <v-container>
                  <v-row>
                <v-btn @click="addRow()"  
                   class="my-5" dark color='#003366'
                   
                   >ADD NEW CLOSURE</v-btn>
                  </v-row>
                </v-container>
                <br> 

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
              v-model="CCFRIFacilityModel.ccfriApplicationNotes"
            ></v-textarea>
          </div>
        </v-card-text>
      </v-card>

      
      <v-row justify="space-around">
        <v-btn color="info" outlined x-large @click="previous()">
          Back</v-btn>
          <!--!isValidForm-->
        <v-btn color="secondary" outlined x-large @click="next()" :disabled="isFormComplete()">Next</v-btn>
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


let closureFees = '';
let isFixedFee= {};
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
  closureFees,
  isFixedFee,
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
  childCareTypes
};



export default {

  mixins: [alertMixin],
  data() {
    return {
      loading: true,
      processing: false,
      model,
      facilityProgramYears: [],
      isValidForm : false,
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
    
    //this.addModelToStore({ ccfriId: this.$route.params.urlGuid, model: this.model }); //jb took this out to stop an error.. I don't think we need it?
    next();
  },
  computed: {
    ...mapGetters('app', ['lookupInfo']),
    ...mapGetters('auth', ['userInfo']),
    ...mapState('app', ['navBarList', 'isRenewal', 'rfiList']),
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
    },
   
  },
  watch: {
    //get facilityID from here and then set it ! 
    '$route.params.urlGuid': {
      async handler() {
        try {
          
          await this.loadCCFRIFacility(this.$route.params.urlGuid); 
          await this.decorateWithCareTypes(this.currentFacility.facilityId); 

          //so the card will display as open if dates already exist
          if (this.CCFRIFacilityModel.dates.length > 0){
            this.model.closureFees = 'Yes';
          }
          this.loading = false;
        } catch (error) {
          console.log(error);
          this.setFailureAlert('An error occured while getting.');
        }
      },
      immediate: true,
      deep: true
    },
  },
  methods: {
    ...mapActions('ccfriApp', ['loadCCFRIFacility', 'loadFacilityCareTypes', 'decorateWithCareTypes']),  
    ...mapMutations('ccfriApp', ['setFeeModel', 'addModelToStore']),
    ...mapMutations('app', ['setRfiList']),
    addRow () {
      this.CCFRIFacilityModel.dates.push( {
        datePicker1: undefined,
        datePicker2: undefined,
        closureReason : '',
        feesPaidWhileClosed: '',
      });
    },
    removeIndex(index){
      this.CCFRIFacilityModel.dates.splice(index, 1);
    },
    previous() {
      this.$router.back();  
    },
    async next() {

      this.save();
      
      if (!this.nextFacility){
        console.log('going to ece-we!');
        this.$router.push({path : `${PATHS.eceweEligibility}`});
      }
       
      else if (this.nextFacility.ccfriOptInStatus == 1 && this.isRenewal){
        console.log('going to next fac EXISTING FEES page');
        this.$router.push({path : `${PATHS.currentFees}/${this.nextFacility.ccfriApplicationId}`});
        //check here if renew - then send them to appropriate screen currentFees
      }
      else if (this.nextFacility.ccfriOptInStatus == 1 ){
        //console.log('going to next fac NEW fees page');
        //TODO: this needs to check if opt in exists -- maybe in the nextFacility fn?
        this.$router.push({path : `${PATHS.addNewFees}/${this.nextFacility.ccfriApplicationId}`});
      }
      else { //TODO: Logic will need to exist here to eval if we should go to the RFI screens
        //RFI logic ?
        // this.setRfiList([{name: 'facilityName', guid: 'ccfriguid'}]);
        // if (this.rfiList?.length > 0) {
        //   this.$router.push(PATHS.ccfriRequestMoreInfo + '/' + '2dd4af36-9688-ed11-81ac-000d3a09ce90');
        // } else {
        this.$router.push({path : `${PATHS.eceweEligibility}`});
        
      }
    },
    isFormComplete(){
      if (this.model.closureFees == 'Yes' && this.CCFRIFacilityModel.dates.length === 0){
        return true;
      }
      return !this.isValidForm; //false makes button clickable, true disables button
    },
    async save () {
      this.processing = true;
      let payload = [
        {
          ccfriApplicationGuid : this.currentFacility.ccfriApplicationId,
          facilityClosureDates : this.CCFRIFacilityModel.dates,
          ccof_formcomplete : !this.isFormComplete(), //have to flip this bool because it's used to enable/diable the next button
          notes : this.CCFRIFacilityModel.ccfriApplicationNotes,
        }
      ];
  
      // feeFrequency: (item.ccof_frequency == '100000000') ? 'Monthly' STATUS CODES 
      // ((item.ccof_frequency == '100000001') ? 'Weekly' : 
      // ((item.ccof_frequency == '100000002') ? 'Daily' : '') )


      let currentFacility = this.currentFacility; //sets the form complete flag for the checkbox
      currentFacility.isCCFRIComplete = !this.isFormComplete(); //have to flip this bool because it's used to enable/diable the next button

      this.CCFRIFacilityModel.dates.forEach ((item, index) => {
        //checks if blank - don't send over incomplete closure dates
        if (!item.formattedStartDate && !item.closureReason){
          this.CCFRIFacilityModel.dates.splice(index, 1);
        }
      });


      //for each child care type - send a request. 
      //index will also match the order of how the cards are displayed. 
      this.CCFRIFacilityModel.childCareTypes.forEach (async (item, index) => { //if any fee, dates, or notes have been inputted, run the save. else don't make the call
        if (item.feeFrequency) {
        
          payload[index] = {
            parentFeeGUID : item.parentFeeGUID,
            deleteMe: item.deleteMe,
            ccfriApplicationGuid : this.currentFacility.ccfriApplicationId, //CCFRI application GUID 
            childCareCategory : item.childCareCategoryId,
            programYear : item.programYearId,
            aprFee : item.approvedFeeApr,
            mayFee : item.approvedFeeMay,
            junFee : item.approvedFeeJun,
            julFee : item.approvedFeeJul,
            augFee : item.approvedFeeAug,
            sepFee : item.approvedFeeSep,
            octFee : item.approvedFeeOct,
            novFee : item.approvedFeeNov,
            decFee : item.approvedFeeDec,
            janFee : item.approvedFeeJan,
            febFee : item.approvedFeeFeb,
            marFee : item.approvedFeeMar,
          };

          payload[index].feeFrequency = item.feeFrequency === 'Monthly'? '100000000' : item.feeFrequency  === 'Weekly'? '100000001' :item.feeFrequency === 'Daily'? '100000002' :'null';
        }

       
      }); // end FOR EACH

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
