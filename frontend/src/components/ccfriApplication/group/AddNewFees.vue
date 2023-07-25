<template>
  <v-form ref="isValidForm" v-model="isValidForm">
    <v-container class="px-10">

    <div class="row pt-4 justify-center">
      <span class="text-h5">Child Care Operating Funding Program - {{ formattedProgramYear }} Program Confirmation Form</span>
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

      <div v-else>
        <v-card v-if="isReadOnly && CCFRIFacilityModel.existingFeesCorrect" elevation="6" class="px-0 py-0 mx-auto my-10 rounded-lg col-12 "
          min-height="230"
          rounded
          tiled
          exact
          tile
          :ripple="false"
          >
            <v-card-text class="pt-7 pa-0">
              <div class="px-md-12 px-7">
              <p class="text-h5 text--primary">
                Are the previous year's fees correct for this facility?
              </p>
              <br>

              <v-radio-group
              required
              :disabled="true"
              v-model="prevFeesCorrect"
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

          </div>
            </v-card-text>
        </v-card>

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
                    label="Parent fee frequency"
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
                      <label>If you only offer care for <strong>4 days or fewer </strong> per week, enter daily parent fees.</label><br>
                      <label>Enter your <strong>highest {{item.feeFrequency?.toLowerCase()}} parent fee before CCFRI is applied</strong> in every month below. If you do not charge a parent fee (e.g. if the facility is closed) enter zero.</label>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col
                      class="col-6 col-md-2"
                    >
                    <!-- childCareTypes[index].approvedFeeApr
                      I think I can replace all the model with childCareTypes data... I'd like to test and make sure it doesn't break if fees do not exist yet.-->
                      <v-text-field type="number" @wheel="$event.target.blur()" :disabled="isReadOnly" outlined :rules="feeRules"
                        v-model.number="item.approvedFeeApr" @input="convertBlankNumberToNull(item,'approvedFeeApr')" label="April" prefix="$"/>
                    </v-col>
                    <v-col
                      class="col-6 col-md-2"
                    >
                      <v-text-field type="number" @wheel="$event.target.blur()" :disabled="isReadOnly" outlined :rules="feeRules"
                        v-model.number="item.approvedFeeMay" @input="convertBlankNumberToNull(item,'approvedFeeMay')" label="May" prefix="$"/>
                    </v-col >
                    <v-col
                      class="col-6 col-md-2"
                    >
                      <v-text-field type="number" @wheel="$event.target.blur()" :disabled="isReadOnly" outlined :rules="feeRules"
                        v-model.number="item.approvedFeeJun" @input="convertBlankNumberToNull(item,'approvedFeeJun')" label="June" prefix="$"/>
                    </v-col>
                    <v-col
                    class="col-6 col-md-2"
                    >
                      <v-text-field type="number" @wheel="$event.target.blur()" :disabled="isReadOnly" outlined :rules="feeRules"
                        v-model.number="item.approvedFeeJul" @input="convertBlankNumberToNull(item,'approvedFeeJul')" label="July" prefix="$"/>
                    </v-col>
                    <v-col
                      class="col-6 col-md-2"
                    >
                      <v-text-field type="number" @wheel="$event.target.blur()" :disabled="isReadOnly" outlined :rules="feeRules"
                        v-model.number="item.approvedFeeAug" @input="convertBlankNumberToNull(item,'approvedFeeAug')" label="August" prefix="$" />
                    </v-col>
                    <v-col
                      class="col-6 col-md-2"
                    >
                      <v-text-field type="number" @wheel="$event.target.blur()" :disabled="isReadOnly" outlined :rules="feeRules"
                        v-model.number="item.approvedFeeSep" @input="convertBlankNumberToNull(item,'approvedFeeSep')" label="September" prefix="$" />
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col
                      class="col-6 col-md-2">
                      <v-text-field type="number" @wheel="$event.target.blur()" :disabled="isReadOnly" outlined :rules="feeRules"
                        v-model.number="item.approvedFeeOct" @input="convertBlankNumberToNull(item,'approvedFeeOct')" label="October" prefix="$"/>
                    </v-col>
                    <v-col
                      class="col-6 col-md-2">
                      <v-text-field type="number" @wheel="$event.target.blur()" :disabled="isReadOnly" outlined :rules="feeRules"
                        v-model.number="item.approvedFeeNov" @input="convertBlankNumberToNull(item,'approvedFeeNov')" label="November" prefix="$"/>
                    </v-col >
                    <v-col
                      class="col-6 col-md-2">
                      <v-text-field type="number" @wheel="$event.target.blur()" :disabled="isReadOnly" outlined :rules="feeRules"
                        v-model.number="item.approvedFeeDec" @input="convertBlankNumberToNull(item,'approvedFeeDec')" label="December" prefix="$"/>
                    </v-col >
                    <v-col
                      class="col-6 col-md-2">
                      <v-text-field type="number" @wheel="$event.target.blur()" :disabled="isReadOnly" outlined :rules="feeRules"
                        v-model.number="item.approvedFeeJan" @input="convertBlankNumberToNull(item,'approvedFeeJan')" label="Jan" prefix="$"/>
                    </v-col>
                    <v-col
                      class="col-6 col-md-2">
                      <v-text-field type="number" @wheel="$event.target.blur()" :disabled="isReadOnly" outlined :rules="feeRules"
                        v-model.number="item.approvedFeeFeb" @input="convertBlankNumberToNull(item,'approvedFeeFeb')" label="Feb" prefix="$" />
                    </v-col>
                    <v-col
                      class="col-6 col-md-2">
                      <v-text-field type="number" @wheel="$event.target.blur()" :disabled="isReadOnly" outlined :rules="feeRules"
                        v-model.number="item.approvedFeeMar" @input="convertBlankNumberToNull(item,'approvedFeeMar')" label="March" prefix="$" />
                    </v-col>
                  </v-row>

                  </v-container>
                </div>
              </v-card-text>
          </v-card>
        </div>
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
              :disabled="isReadOnly"
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

            <v-row v-if = "closureFees == 'Yes' || CCFRIFacilityModel.hasClosureFees == 100000000">


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

      <NavButton :isNextDisplayed="true" :isSaveDisplayed="true"
        :isSaveDisabled="isReadOnly" :isNextDisabled="loading || !isFormComplete()" :isProcessing="processing"
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
  </v-form>
</template>
<script>
import { PATHS, pcfUrlGuid, pcfUrl } from '@/utils/constants';
import { mapGetters, mapState, mapActions, mapMutations} from 'vuex';
import ApiService from '@/common/apiService';
import alertMixin from '@/mixins/alertMixin';
import globalMixin from '@/mixins/globalMixin';
import { isEqual, cloneDeep } from 'lodash';
import NavButton from '@/components/util/NavButton';

export default {
  components: { NavButton },
  mixins: [alertMixin, globalMixin],
  data() {
    return {

      pastCcfriGuid: undefined,
      closureFees : 'No',
      prevFeesCorrect : undefined,
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
        (v) => !isNaN(parseFloat(v))  || 'Must be a number',
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
    ...mapState('application', ['applicationStatus', 'formattedProgramYear', 'programYearId', 'applicationId']),
    ...mapState('app', ['isRenewal', 'rfiList']),
    ...mapState('navBar', ['navBarList']),
    ...mapState('ccfriApp', ['CCFRIFacilityModel', 'ccfriChildCareTypes', 'loadedModel', 'ccfriId']),
    ...mapGetters('ccfriApp', ['getClosureDateLength']),
    ...mapGetters('navBar', ['nextPath', 'previousPath', 'isChangeRequest', 'getNavByCCFRIId']),

    currentFacility(){
      return this.getNavByCCFRIId(this.$route.params.urlGuid);
    },
    isReadOnly(){
      //if submitted, lock er up. If unlock CCFRI - unlock
      if (this.currentFacility.unlockCcfri || this.isChangeRequest){
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
        if (this.pastCcfriGuid){
          //console.log(this.pastCcfriGuid);
          await this.save(false);
        }
        window.scrollTo(0,0);
        try {
          //if(!this.CCFRIFacilityModel){
            await this.loadCCFRIFacility(this.$route.params.urlGuid);
          //}
          await this.decorateWithCareTypes(this.currentFacility.facilityId);
          this.loadCCFisCCRIMedian(); //this can be async. no need to wait.

          this.prevFeesCorrect = this.CCFRIFacilityModel.existingFeesCorrect == 100000000? 'Yes': 'No';
          if (this.getClosureDateLength > 0){
            //this.closureFees = 'Yes';
          }
          this.pastCcfriGuid = cloneDeep(this.$route.params.urlGuid);
          this.loading = false;
        } catch (error) {
          console.log(error);
          this.setFailureAlert('An error occured while getting.');
          //this solves for the edge case bug where fees that need to be deleted cannot be deleted because the GUID has not been loaded from dynamics
          // window.location.reload(); //TODO-RLO: removed this, review with Jen
        }
      },
      immediate: true,
      deep: true
    },
  },
  methods: {
    ...mapActions('ccfriApp', ['loadCCFRIFacility', 'loadFacilityCareTypes', 'decorateWithCareTypes', 'loadCCFisCCRIMedian', 'getCcfriOver3percent']),
    ...mapMutations('ccfriApp', ['setFeeModel', 'addModelToStore', 'deleteChildCareTypes', 'setLoadedModel']),
    ...mapMutations('navBar', ['addToRfiNavBarStore', 'forceNavBarRefresh', 'setNavBarValue', 'setNavBarCCFRIComplete']),
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
      this.showRfiDialog = false;

    },
    removeIndex(index){
      this.CCFRIFacilityModel.dates.splice(index, 1);
    },
    toRfi() {
      this.setNavBarValue({ facilityId: this.$route.params.urlGuid, property: 'hasRfi', value: true});
      this.$router.push(pcfUrlGuid(PATHS.RFI, this.programYearId, this.$route.params.urlGuid));
    },
    previous() {
      if (this.isReadOnly){
        this.$router.push(pcfUrl(PATHS.CCFRI_HOME, this.programYearId));
      }
      else if (this.isRenewal){
        this.$router.push(pcfUrlGuid(PATHS.CCFRI_CURRENT_FEES, this.programYearId, this.$route.params.urlGuid));
      }
      else{
        this.$router.push(this.previousPath);
      }

    },
    async next() {
      this.rfi3percentCategories = await this.getCcfriOver3percent();
      console.log('rfi3percentCategories length ', this.rfi3percentCategories.length);
      if (this.isRenewal) {
        this.rfi3percentCategories = await this.getCcfriOver3percent();
        if (this.rfi3percentCategories.length > 0) {
          if (this.currentFacility.hasRfi) {
            //already has RFI. just go to the next page
            this.$router.push(this.nextPath);
          } else {
            this.showRfiDialog = true;
          }
        } else {
          //no need for RFI.
          if (this.currentFacility.hasRfi) {
            this.setNavBarValue({ facilityId: this.$route.params.urlGuid, property: 'hasRfi', value: false});
          }
          this.$router.push(this.nextPath);
        }
      } else {
        //Not renewal.
        this.$router.push(this.nextPath);
      }
    },
    validateForm() {
      this.$refs.isValidForm?.validate();
    },
    isFormComplete(){
      //100000000 == YES
      if (this.CCFRIFacilityModel.hasClosureFees == 100000000 && this.CCFRIFacilityModel.dates.length === 0){
        return false;
      }
      return this.isValidForm; //false makes button clickable, true disables button
    },
    hasModelChanged(){
      // console.log('model:', this.loadedModel);
      // console.log('ccfriStore:', this.CCFRIFacilityModel);

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
      //console.log(this.closureFees);
      //this.hasDataToDelete();
      //only save data to Dynamics if the form has changed.
      if (this.hasModelChanged() || this.hasDataToDelete()){

        this.processing = true;
        this.setNavBarCCFRIComplete({ ccfriId: this.ccfriId, complete: this.isFormComplete()});

        //we should save the empty field to dynamics if user selects "no" on "Do you charge parent fees at this facility for any closures on business days
        if (this.CCFRIFacilityModel.hasClosureFees == 100000001){
          this.CCFRIFacilityModel.dates = [];
        }

        let payload = [];
        let firstObj = {
          ccfriApplicationGuid : this.ccfriId,
          facilityClosureDates : this.CCFRIFacilityModel.dates,
          ccof_formcomplete : this.isFormComplete(),
          notes : this.CCFRIFacilityModel.ccfriApplicationNotes,
          ccof_has_rfi: this.currentFacility.hasRfi,
          hasClosureFees: this.CCFRIFacilityModel.hasClosureFees
        };
        if (this.isRenewal) {
          firstObj = {
            ...firstObj,
            ccof_has_rfi: this.currentFacility.hasRfi,
            existingFeesCorrect: this.CCFRIFacilityModel.existingFeesCorrect,
          };
        }

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
              ccfriApplicationGuid : this.ccfriId, //CCFRI application GUID
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
