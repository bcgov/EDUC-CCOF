<template>
  <v-form ref="isValidForm" v-model="isValidForm">
    <v-container class="px-10">

    <div class="row pt-4 justify-center">
      <span class="text-h5">Child Care Operating Funding Program - {{ programYearLabel }} Program Confirmation Form</span>
      </div>
      <br>
      <div class="row pt-4 justify-center">
      <span class="text-h5">Child Care Fee Reduction Initiative (CCFRI)</span>
    </div>
    <br><br>
      <p class="text-h5 text-center" style="color: rgb(0, 52, 102)"> Facility Name:  {{currentFacility.facilityName}}  </p> <br><br>
      <p>
        Enter the fees you charged a new parent for full-time care at this facility for the months below. <br><br>
        If you have more than one fee for the same category, <strong> enter the highest fee. </strong><br><br>
        <strong>Enter the fee before CCFRI is applied. </strong> <br><br>
        Note: Fee increases will be reviewed and additional information may be requested, which may result in increased processing times. If approved, this fee will be posted on the Ministry website. <br><br>
      </p>

      
      <v-skeleton-loader max-height="475px" v-if="loading" :loading="loading" type="image, image"></v-skeleton-loader>
      
      <div v-else v-for="(item , index) in CCFRIFacilityModel.childCareTypes" :key="index">
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
                  :disabled="isReadOnly"
                >
                  <v-radio
                    label="Daily"
                    value="Daily"
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
                    <v-text-field type="number" :disabled="isReadOnly" outlined :rules="feeRules"  v-model.number="item.approvedFeeApr" label="April" prefix="$"/>
                  </v-col>
                  <v-col 
                    class="col-6 col-md-2"
                  >
                    <v-text-field type="number" :disabled="isReadOnly" outlined :rules="feeRules"  v-model.number="item.approvedFeeMay" label="May" prefix="$"/>
                  </v-col >
                  <v-col 
                    class="col-6 col-md-2"
                  >
                    <v-text-field type="number" :disabled="isReadOnly" outlined :rules="feeRules"  v-model.number="item.approvedFeeJun" label="June" prefix="$"/>
                  </v-col>
                  <v-col
                  class="col-6 col-md-2"
                  >
                    <v-text-field type="number" :disabled="isReadOnly" outlined :rules="feeRules"  v-model.number="item.approvedFeeJul" label="July" prefix="$"/>
                  </v-col>
                  <v-col 
                    class="col-6 col-md-2"
                  >
                    <v-text-field type="number" :disabled="isReadOnly" outlined :rules="feeRules"  v-model.number="item.approvedFeeAug" label="August" prefix="$" />
                  </v-col>
                  <v-col
                    class="col-6 col-md-2"
                  >
                    <v-text-field type="number" :disabled="isReadOnly" outlined :rules="feeRules"  v-model.number="item.approvedFeeSep" label="September" prefix="$" />
                  </v-col>
                </v-row>

                <v-row>
                  <v-col 
                    class="col-6 col-md-2">
                    <v-text-field type="number" :disabled="isReadOnly" outlined :rules="feeRules"  v-model.number="item.approvedFeeOct" label="October" prefix="$"/>
                  </v-col>
                  <v-col 
                    class="col-6 col-md-2">
                    <v-text-field type="number" :disabled="isReadOnly" outlined :rules="feeRules"  v-model.number="item.approvedFeeNov" label="November" prefix="$"/>
                  </v-col >
                  <v-col 
                    class="col-6 col-md-2">
                    <v-text-field type="number" :disabled="isReadOnly" outlined :rules="feeRules"  v-model.number="item.approvedFeeDec" label="December" prefix="$"/>
                  </v-col >
                  <v-col
                    class="col-6 col-md-2">
                    <v-text-field type="number" :disabled="isReadOnly" outlined :rules="feeRules"  v-model.number="item.approvedFeeJan" label="Jan" prefix="$"/>
                  </v-col>
                  <v-col
                    class="col-6 col-md-2">
                    <v-text-field type="number" :disabled="isReadOnly" outlined :rules="feeRules"  v-model.number="item.approvedFeeFeb" label="Feb" prefix="$" />
                  </v-col>
                  <v-col
                    class="col-6 col-md-2">
                    <v-text-field type="number" :disabled="isReadOnly" outlined :rules="feeRules"  v-model.number="item.approvedFeeMar" label="March" prefix="$" />
                  </v-col>
                </v-row>
              
                </v-container>
              </div>
            </v-card-text>
        </v-card>
      </div>

      <br>
      <v-skeleton-loader max-height="475px" v-if="loading" :loading="loading" type="image, image"><br><br></v-skeleton-loader>
      <v-card  v-else elevation="6" class="px-0 py-0 mx-auto my-10 rounded-lg col-12 "
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
              :disabled="isReadOnly"
              v-model="closureFees"
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

            <v-row v-if = "closureFees == 'Yes'">


              <v-row  v-for="(obj, index) in CCFRIFacilityModel.dates" :key="index">
              
                <v-col class="col-md-1 col-12 mx-0">
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
                    <v-text-field  :disabled="isReadOnly" outlined :rules="rules" v-model="obj.formattedStartDate"  label="Select Start Date (YYYY-MM-DD)" readonly v-bind="attrs" v-on="on">
                    </v-text-field>
                  </template>
                    <v-date-picker 
                    
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
      <br>
      <v-skeleton-loader max-height="475px" v-if="loading" :loading="loading" type="image, image"></v-skeleton-loader>
      <v-card v-else elevation="6" class="px-0 py-0 mx-auto my-10 rounded-lg col-12 "
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
              :disabled="isReadOnly"
              outlined
              name="input-7-4"
              label="Describe here"
              v-model="CCFRIFacilityModel.ccfriApplicationNotes"
            ></v-textarea>
          </div>
        </v-card-text>
      </v-card>
      
      <v-row justify="space-around">
        <v-btn color="info" outlined x-large :loading="processing" @click="previous()">
          Back</v-btn>
          <!--!isValidForm-->
        <v-btn color="secondary" outlined x-large :loading="processing" @click="next()" :disabled="isFormComplete()==false">Next</v-btn>
        <v-btn color="primary" :disabled="isReadOnly" outlined x-large :loading="processing" @click="save(true)">Save</v-btn>
      </v-row>
      <v-dialog
        v-model="showRfiDialog"
        persistent
        max-width="600px">
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
                <p class="pt-4">Your application exceeds the 3% median increase<br>for your area for the child care categories:<br><br>
                  <span v-for="item in rfi3percentCategories" :key="item">{{item}}<br></span>
                </p>
                <p>You will have to fill out a Request for Information (RFI) form.</p>
                <p class="pt-4">You can continue to the RFI form or press back to update your fees.</p>
                <v-btn dark color="secondary" class="mr-10" @click="closeDialog()">Back</v-btn>
                <v-btn dark color="primary" @click="toRfi()">Continue</v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-dialog>
    </v-container>
  </v-form>
</template>
<script>
import { PATHS } from '@/utils/constants';
import { mapGetters, mapState, mapActions, mapMutations} from 'vuex';
import ApiService from '@/common/apiService';
import alertMixin from '@/mixins/alertMixin';
import { isEqual, cloneDeep } from 'lodash';

export default {

  mixins: [alertMixin],
  data() {
    return {
      closureFees : 'No',
      dateObj: {
        datePicker1: undefined,
        datePicker2: undefined,
        closureReason : '',
        feesPaidWhileClosed: undefined,
      },
      showRfiDialog: false,
      rfi3percentCategories: [],
      isUnlocked: true,
      loading: true,
      processing: false,
      facilityProgramYears: [],
      isValidForm : false,
     
      feeRules: [
        (v) => ( typeof v == 'number'|| v == '' || v == ' ') || 'Required.',
        (v)  => v <=  9999|| 'Max fee is $9999.00',
        (v) => v >= 0  || 'Input a positve number',
      ],

      rules: [
        (v) => !!v  || 'Required.',
      ],
      dateRules: [
        v => (typeof v === 'number') || 'Required.',
      ],
    };
  },
  beforeRouteLeave(_to, _from, next) {
    this.save(false);
    next();
  },
  computed: {
    ...mapGetters('app', ['lookupInfo']),
    ...mapState('application', ['applicationStatus', 'programYearLabel', 'applicationId']),
    ...mapState('app', ['navBarList', 'isRenewal', 'rfiList']),
    ...mapState('ccfriApp', ['CCFRIFacilityModel', 'ccfriChildCareTypes', 'loadedModel']),
    ...mapGetters('ccfriApp', ['getClosureDateLength']),

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
    isReadOnly(){
      //if submitted, lock er up. If unlock CCFRI - unlock
      if (this.currentFacility.unlockCcfri){
        return false;
      }
      else if (this.applicationStatus === 'SUBMITTED'){
        return true; 
      }
      return false;
    },
  },
  watch: {
    //get facilityID from here and then set it ! 
    '$route.params.urlGuid': {
      async handler() {
        
        try {
          await this.loadCCFRIFacility(this.$route.params.urlGuid); 
          await this.decorateWithCareTypes(this.currentFacility.facilityId);
          this.loadCCFisCCRIMedian(); //this can be async. no need to wait.
          if (this.getClosureDateLength > 0){
            this.closureFees = 'Yes';
          }
          //this.pastCcfriGuid = this.$route.params.urlGuid;
          this.loading = false;
        } catch (error) {
          console.log(error);
          this.setFailureAlert('An error occured while getting.');
          //this solves for the edge case bug where fees that need to be deleted cannot be deleted because the GUID has not been loaded from dynamics 
          window.location.reload();
        }
      },
      immediate: true,
      deep: true
    },
  },
  methods: {
    ...mapActions('ccfriApp', ['loadCCFRIFacility', 'loadFacilityCareTypes', 'decorateWithCareTypes', 'loadCCFisCCRIMedian', 'getCcfriOver3percent']),  
    ...mapMutations('ccfriApp', ['setFeeModel', 'addModelToStore', 'deleteChildCareTypes', 'setLoadedModel']),
    ...mapMutations('app', ['addToRfiNavBarStore']),
    addRow () {
      this.CCFRIFacilityModel.dates.push(Object.assign({}, this.dateObj));
    },
    hasDataToDelete(){
      //checks all care types for the deleteMe flag. If true, we need to run save regardless if the model has been changed by the user. 
      return this.CCFRIFacilityModel.childCareTypes.some(careType => {
        return careType.deleteMe;
      });
    },
    closeDialog() {
      this.currentFacility.hasRfi = 0;
      this.showRfiDialog = false;

    },
    removeIndex(index){
      this.CCFRIFacilityModel.dates.splice(index, 1);
    },
    toRfi() {
      this.currentFacility.hasRfi = 1;
      this.$router.push(`${PATHS.ccfriRequestMoreInfo}/${this.$route.params.urlGuid}`);
    },
    previous() {
      if (this.isRenewal){
        this.$router.push({path : `${PATHS.currentFees}/${this.currentFacility.ccfriApplicationId}`});
      }
      else{
        this.$router.push(PATHS.ccfriHome);
      }
      
    },
    async next() {
      this.rfi3percentCategories = await this.getCcfriOver3percent();
      console.log('rfi3percentCategories length ', this.rfi3percentCategories.length);
      if (this.rfi3percentCategories.length > 0 && this.isRenewal) {
        this.showRfiDialog = true;
      } else {
        if (!this.nextFacility){
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
      }
    },
    isFormComplete(){
      if (this.closureFees == 'Yes' && this.CCFRIFacilityModel.dates.length === 0 && this.isValidForm){
        return true;
      }

      return this.isValidForm; //false makes button clickable, true disables button
    },
    hasModelChanged(){
      console.log('model:', this.loadedModel);
      console.log('ccfriStore:', this.CCFRIFacilityModel);
      //if 

      if (isEqual(this.CCFRIFacilityModel, this.loadedModel)) {
        console.info('no model changes');
        return false;
      }
      else{
        console.info('change in the model!');
      }
      return true;
    },
    async save(showMessage) {
      //this.hasDataToDelete();
      //only save data to Dynamics if the form has changed.
      console.log('guid to save:' , this.CCFRIFacilityModel.facilityId);
      if (this.hasModelChanged() || this.hasDataToDelete()){
        console.log('dates in save :' , this.CCFRIFacilityModel.dates);
        this.processing = true;
        let payload = [];
        let firstObj = 
          {
            ccfriApplicationGuid : this.currentFacility.ccfriApplicationId,
            facilityClosureDates : this.CCFRIFacilityModel.dates,
            ccof_formcomplete : this.isFormComplete(), //have to flip this bool because it's used to enable/diable the next button
            notes : this.CCFRIFacilityModel.ccfriApplicationNotes,
          };
    
        
        let currentFacility = this.currentFacility; //sets the form complete flag for the checkbox
        currentFacility.isCCFRIComplete = this.isFormComplete(); 

        //checks if blank - don't save empty rows
        for(let i =  this.CCFRIFacilityModel.dates.length -1; i >=0; i--){
          if (isEqual( this.CCFRIFacilityModel.dates[i], this.dateObj)){
            this.CCFRIFacilityModel.dates.splice(i, 1);
          }
        }


        //for each child care type - prepare an object for the payload 
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

        let obj = Object.assign(firstObj, payload[0]);

        payload[0] = obj;

        try {
          this.setLoadedModel( cloneDeep(this.CCFRIFacilityModel)); //when saving update the loaded model to look for changes 
          let res = await ApiService.apiAxios.patch('/api/application/parentfee/', payload);
          console.log('the res is:' , res);
          if (showMessage) {
            this.setSuccessAlert('Success! CCFRI Parent fees have been saved.');
          }
          
          //remove the facility to delete from the vuex store
          this.deleteChildCareTypes();
        } catch (error) {
          console.info(error);
          this.setFailureAlert('An error occurred while saving.');

          //This fixes the edge case of fees needing be deleted without a guid - force a refesh. Then when the user clicks next, the guid will exist, it will be deleted,
          //and life will be good :) 
          window.location.reload(true);
        }
        this.processing = false;
      }
    }
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
