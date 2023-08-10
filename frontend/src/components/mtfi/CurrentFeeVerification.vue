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
      <span class="text-h5">Facility Name: {{ getCurrentFacility.facilityName }}</span>
    </div>
    <div class="row pt-4 justify-center">
      <span class="text-h5">License Number: {{ currentFacility.facilityAccountNumber }}</span>
    </div>


    <br><br>
    <div class="row pt-4 justify-center">
      <span class="text-h6">Our records show this facility's approved parent fees for April 2024 to March 2025 are as follows:</span>
    </div>

    <v-form ref="isValidForm" value="false" v-model="isValidForm">

      <div v-if="loading">
        <v-skeleton-loader max-height="475px"  :loading="loading" type="image, image"></v-skeleton-loader>
        <br><br>
        <v-skeleton-loader max-height="475px"  :loading="loading" type="image, image"></v-skeleton-loader>
      </div>

      <div v-else>
        <div v-for="(item , index) in oldCcfri.childCareTypes" :key="index">
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

                    <v-row class="d-flex justify-space-around">

                      <v-select label="Parent fee frequency: "
                        v-model="CCFRIFacilityModel.childCareTypes[index].feeFrequency"
                        :items="feeChoices"
                        class="cols-4 justify-space-around"
                        outlined
                      >
                        <option v-for="item in feeChoices" :key="item" :value="item">
                          {{ item }}
                        </option>
                      </v-select>

                      <v-btn dark class="blueButton mb-10" @click="copyFees(index)" >Auto-fill approved parent fees</v-btn>

                      <v-btn class=" mb-10" @click="clearFees(index)" >Clear</v-btn>

                    <!-- <v-select label="Which month are you requesting to increase parent fees"
                      v-if="CCFRIFacilityModel.existingFeesCorrect == '100000000'"
                      v-model="CCFRIFacilityModel.childCareTypes[index].selectedMonth"
                      :items="months"
                      class="cols-5 justify-space-around"
                      outlined
                      >

                      <option v-for="month in months" :key="month.value" :value="month.value">
                        {{ month.text }}
                      </option>

                    </v-select> -->
                  </v-row>

                    <v-container class="ma-0 pa-0 gridContainer">

                      <div class=" feeTitle">
                        <span >Current Fees: </span>
                      </div>

                      <div class="feeTitle ">
                        <span >April:</span>
                        <v-text-field class="" dense flat solo hide-details readonly type="number" :disabled="false"  :rules="feeRules"
                          v-model.number="item.approvedFeeApr" @input="convertBlankNumberToNull(item,'approvedFeeApr')" prefix="$"/>
                          <v-divider class="border-opacity-100" vertical></v-divider>
                      </div>

                      <div class="feeTitle">
                        <span class=" ">May:</span>
                        <v-text-field  class="" type="number" dense flat solo hide-details readonly @wheel="$event.target.blur()" :disabled="false" :rules="feeRules"
                          v-model.number="item.approvedFeeMay" @input="convertBlankNumberToNull(item,'approvedFeeMay')" label="May" prefix="$"/>
                          <v-divider class="border-opacity-100" vertical></v-divider>
                      </div>

                      <div class="feeTitle">
                        <span class="">June:</span>
                        <v-text-field type="number" dense flat solo hide-details readonly @wheel="$event.target.blur()" :disabled="false" :rules="feeRules"
                          v-model.number="item.approvedFeeJun" @input="convertBlankNumberToNull(item,'approvedFeeJun')" label="June" prefix="$"/>
                          <v-divider class="border-opacity-100" vertical></v-divider>
                      </div>

                      <div class="feeTitle">
                      <span class="">July:</span>
                        <v-text-field type="number" dense flat solo hide-details readonly @wheel="$event.target.blur()" :disabled="false" :rules="feeRules"
                          v-model.number="item.approvedFeeJul" @input="convertBlankNumberToNull(item,'approvedFeeJul')" label="July" prefix="$"/>
                          <v-divider class="border-opacity-100" vertical></v-divider>
                      </div>

                      <div class="feeTitle">
                        <span class=" ">Aug:</span>
                        <v-text-field type="number" dense flat solo hide-details readonly @wheel="$event.target.blur()" :disabled="false"  :rules="feeRules"
                          v-model.number="item.approvedFeeAug" @input="convertBlankNumberToNull(item,'approvedFeeAug')" label="August" prefix="$" />
                          <v-divider class="border-opacity-100" vertical></v-divider>
                      </div>

                      <div class="feeTitle">
                        <span class="">Sept:</span>
                        <v-text-field type="number" dense flat solo hide-details readonly @wheel="$event.target.blur()" :disabled="false"  :rules="feeRules"
                          v-model.number="item.approvedFeeSep" @input="convertBlankNumberToNull(item,'approvedFeeSep')" label="September" prefix="$" />
                          <v-divider class="border-opacity-100" vertical></v-divider>
                      </div>

                      <!-- End Row One of Grid-->

                      <div class=" feeTitleInput" v-if="CCFRIFacilityModel.existingFeesCorrect == '100000000'">
                        <span >New Parent Fees: </span>
                      </div>



                      <div class="inputBoxWrapper ">
                        <v-text-field v-if="isInputVisible()" class="" type="number" @wheel="$event.target.blur()" :disabled="isReadOnly" outlined :rules="feeRules"
                        v-model.number="CCFRIFacilityModel.childCareTypes[index].approvedFeeApr" @input="convertBlankNumberToNull(item,'approvedFeeApr')" label="" prefix="$"/>

                      </div>

                      <div class="inputBoxWrapper ">
                        <v-text-field  v-if="isInputVisible()" type="number" @wheel="$event.target.blur()" :disabled="isReadOnly" outlined :rules="feeRules"
                        v-model.number="CCFRIFacilityModel.childCareTypes[index].approvedFeeMay" @input="convertBlankNumberToNull(item,'approvedFeeApr')" label="" prefix="$"/>

                      </div>

                      <div class="inputBoxWrapper ">
                        <v-text-field  v-if="isInputVisible()" type="number" @wheel="$event.target.blur()" :disabled="isReadOnly" outlined :rules="feeRules"
                        v-model.number="CCFRIFacilityModel.childCareTypes[index].approvedFeeJun" @input="convertBlankNumberToNull(item,'approvedFeeApr')" label="" prefix="$"/>

                      </div>

                      <div class="inputBoxWrapper ">
                        <v-text-field v-if="isInputVisible()" type="number" @wheel="$event.target.blur()" :disabled="isReadOnly" outlined :rules="feeRules"
                        v-model.number="CCFRIFacilityModel.childCareTypes[index].approvedFeeJul" @input="convertBlankNumberToNull(item,'approvedFeeApr')" label="" prefix="$"/>

                      </div>

                      <div class="inputBoxWrapper ">
                        <v-text-field v-if="isInputVisible()" type="number" @wheel="$event.target.blur()" :disabled="isReadOnly" outlined :rules="feeRules"
                        v-model.number="CCFRIFacilityModel.childCareTypes[index].approvedFeeAug" @input="convertBlankNumberToNull(item,'approvedFeeApr')" label="" prefix="$"/>

                      </div>

                      <div class="inputBoxWrapper ">
                        <v-text-field v-if="isInputVisible()" type="number" @wheel="$event.target.blur()" :disabled="isReadOnly" outlined :rules="feeRules"
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
                        <v-text-field class="" dense flat solo hide-details readonly type="number" :disabled="false"  :rules="feeRules"
                          v-model.number="item.approvedFeeOct" @input="convertBlankNumberToNull(item,'approvedFeeApr')" prefix="$"/>
                          <v-divider class="border-opacity-100" vertical></v-divider>
                      </div>

                      <div class="feeTitle">
                        <span class=" ">Nov:</span>
                        <v-text-field  class="" type="number" dense flat solo hide-details readonly @wheel="$event.target.blur()" :disabled="false" :rules="feeRules"
                          v-model.number="item.approvedFeeNov" @input="convertBlankNumberToNull(item,'approvedFeeMay')" label="May" prefix="$"/>
                          <v-divider class="border-opacity-100" vertical></v-divider>
                      </div>

                      <div class="feeTitle">
                        <span class="">Dec:</span>
                        <v-text-field type="number" dense flat solo hide-details readonly @wheel="$event.target.blur()" :disabled="false" :rules="feeRules"
                          v-model.number="item.approvedFeeDec" @input="convertBlankNumberToNull(item,'approvedFeeJun')" label="June" prefix="$"/>
                          <v-divider class="border-opacity-100" vertical></v-divider>
                      </div>

                      <div class="feeTitle">
                      <span class="">Jan:</span>
                        <v-text-field type="number" dense flat solo hide-details readonly @wheel="$event.target.blur()" :disabled="false" :rules="feeRules"
                          v-model.number="item.approvedFeeJan" @input="convertBlankNumberToNull(item,'approvedFeeJul')" label="July" prefix="$"/>
                          <v-divider class="border-opacity-100" vertical></v-divider>
                      </div>

                      <div class="feeTitle">
                        <span class=" ">Feb:</span>
                        <v-text-field type="number" dense flat solo hide-details readonly @wheel="$event.target.blur()" :disabled="false"  :rules="feeRules"
                          v-model.number="item.approvedFeeFeb" @input="convertBlankNumberToNull(item,'approvedFeeAug')" label="August" prefix="$" />
                          <v-divider class="border-opacity-100" vertical></v-divider>
                      </div>

                      <div class="feeTitle">
                        <span class="">Mar:</span>
                        <v-text-field type="number" dense flat solo hide-details readonly @wheel="$event.target.blur()" :disabled="false"  :rules="feeRules"
                          v-model.number="item.approvedFeeMar" @input="convertBlankNumberToNull(item,'approvedFeeSep')" label="September" prefix="$" />
                          <v-divider class="border-opacity-100" vertical></v-divider>
                      </div>

                      <!-- End Row One of Grid-->

                      <div class=" feeTitleInput" v-if="CCFRIFacilityModel.existingFeesCorrect == '100000000'">
                        <span >New Parent Fees: </span>
                      </div>

                      <div class="inputBoxWrapper ">
                        <v-text-field v-if="isInputVisible()" type="number" @wheel="$event.target.blur()" :disabled="isReadOnly" outlined :rules="feeRules"
                        v-model.number="CCFRIFacilityModel.childCareTypes[index].approvedFeeOct" @input="convertBlankNumberToNull(item,'approvedFeeApr')" label="" prefix="$"/>

                      </div>

                      <div class="inputBoxWrapper ">
                        <v-text-field v-if="isInputVisible()" type="number" @wheel="$event.target.blur()" :disabled="isReadOnly" outlined :rules="feeRules"
                        v-model.number="CCFRIFacilityModel.childCareTypes[index].approvedFeeNov" @input="convertBlankNumberToNull(item,'approvedFeeApr')" label="" prefix="$"/>

                      </div>

                      <div class="inputBoxWrapper ">
                        <v-text-field v-if="isInputVisible()" type="number" @wheel="$event.target.blur()" :disabled="isReadOnly" outlined :rules="feeRules"
                        v-model.number="CCFRIFacilityModel.childCareTypes[index].approvedFeeDec" @input="convertBlankNumberToNull(item,'approvedFeeApr')" label="" prefix="$"/>

                      </div>

                      <div class="inputBoxWrapper ">
                        <v-text-field v-if="isInputVisible()" type="number" @wheel="$event.target.blur()" :disabled="isReadOnly" outlined :rules="feeRules"
                        v-model.number="CCFRIFacilityModel.childCareTypes[index].approvedFeeJan" @input="convertBlankNumberToNull(item,'approvedFeeApr')" label="" prefix="$"/>

                      </div>

                      <div class="inputBoxWrapper ">
                        <v-text-field v-if="isInputVisible()" type="number" @wheel="$event.target.blur()" :disabled="isReadOnly" outlined :rules="feeRules"
                        v-model.number="CCFRIFacilityModel.childCareTypes[index].approvedFeeFeb" @input="convertBlankNumberToNull(item,'approvedFeeApr')" label="" prefix="$"/>

                      </div>

                      <div class="inputBoxWrapper ">
                        <v-text-field v-if="isInputVisible()" type="number" @wheel="$event.target.blur()" :disabled="isReadOnly" outlined :rules="feeRules"
                        v-model.number="CCFRIFacilityModel.childCareTypes[index].approvedFeeMar" @input="convertBlankNumberToNull(item,'approvedFeeApr')" label="" prefix="$"/>

                      </div>

                      <!-- End Row Two of Grid-->
                      <br>
                    </v-container>

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
        :isSaveDisabled="isReadOnly" :isNextDisabled="true" :isProcessing="processing"
        @previous="" @next="next" @validateForm="validateForm()" @save="save(true)"></NavButton>
  </v-container>
</template>

<script>



import { mapState, mapActions, mapGetters, mapMutations} from 'vuex';
import { PATHS, changeUrl, changeUrlGuid, pcfUrl, pcfUrlGuid } from '@/utils/constants';
import ApiService from '@/common/apiService';
import alertMixin from '@/mixins/alertMixin';
import globalMixin from '@/mixins/globalMixin';
import NavButton from '@/components/util/NavButton';
import { deepCloneObject } from '../../utils/common';
import { isEqual } from 'lodash';


let ccfriOptInOrOut = {};
let textInput = '' ;
let model = { x: [], ccfriOptInOrOut, textInput };

export default {
  name: 'CcfriLandingPage',
  mixins: [alertMixin, globalMixin],
  data() {
    return {
      selectedMonth: 0,
      // months: [
      //   {text: 'April', value:  1},
      //   {text: 'May' ,value:  2},
      //   {text: 'June' ,value:  3},
      //   {text: 'July' ,value:  4},
      //   {text: 'Aug' ,value:5},
      //   {text: 'Sept',value: 6},
      //   {text: 'Oct',value: 7},
      //   {text: 'Novemeber',value: 8},
      //   {text: 'December',value: 9},
      //   {text: 'January',value: 10},
      //   {text: 'Feb',value: 11},
      //   {text: 'March',value: 12},
      // ],
      feeChoices: ['Daily', 'Monthly'],
      dialog: false,
      currentFacility: undefined,
      oldCcfri: undefined,
      isUnlocked: false,
      model,
      isReadOnly: false,
      showOptStatus : '',
      isValidForm: false,
      processing: false,
      loading: false,
      ccfriOptInOrOut,
      feeList : [],
      rules: [
        (v) => !!v  || 'Required.',
      ],
      feeRules: [
        (v) => !isNaN(parseFloat(v))  || 'Must be a number',
        (v)  => v <=  9999|| 'Max fee is $9999.00',
        (v) => v >= 0  || 'Input a positve number',
      ],

    };
  },
  computed: {
    ...mapState('ccfriApp', ['CCFRIFacilityModel', 'ccfriChildCareTypes', 'loadedModel', 'ccfriId']),
    ...mapGetters('ccfriApp', ['getCCFRIById']),

    ...mapState('application', ['applicationStatus',  'formattedProgramYear', 'programYearId', 'applicationId']),
    ...mapState('app', ['isRenewal', 'ccfriOptInComplete', 'programYearList']),
    ...mapState('navBar', ['navBarList', 'userProfileList']),
    ...mapGetters('navBar', ['previousPath']),
    areFeesCorrect() {
      return this.CCFRIFacilityModel.existingFeesCorrect == '100000001' ? true : false;
    },
    getCurrentFacility(){
      return this.userProfileList.find(el => el.facilityId == this.CCFRIFacilityModel.facilityId);
    }
  },
  watch: {
    //get facilityID from here and then set it !
    '$route.params.urlGuid': {
      async handler() {
        try {
          this.loading = true;
          //await this.loadCCFRIFacility('d6169369-3727-ee11-9965-000d3a09d4d4'); //old CCFRI - logic to come to get this from navBar
          await this.loadCCFRIFacility(this.$route.params.urlGuid); //new CCFRI from route
          await this.loadCCFRIFacility(this.userProfileList.find(el => el.facilityId == this.CCFRIFacilityModel.facilityId).ccfriApplicationId); //oldCCFRI found via new CCFRI
          await this.loadCCFRIFacility(this.$route.params.urlGuid); //put the new one back in the store so I can render the page (ugly)


          await this.decorateWithCareTypes(this.CCFRIFacilityModel.facilityId);
          this.currentFacility = this.userProfileList.find(el => el.facilityId == this.CCFRIFacilityModel.facilityId);
          this.oldCcfri = this.getCCFRIById(this.currentFacility.ccfriApplicationId); //set old CCFRI to display fees


          let arr = [];

          //sort the child care types so they match the cards of the old CCFRI fees
          for (const childCareTypes of this.oldCcfri.childCareTypes){
            let q = this.CCFRIFacilityModel.childCareTypes.find(el => el.childCareCategoryId == childCareTypes.childCareCategoryId);
            console.log(q);

            //if this is the first time, the new CCFRI will not have any fees yet. Assign to 0 so they can be filled in and saved
            if (!q.approvedFeeMar){ //TODO: not the best way to test if the fees have been filled out
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
              };
              q = {...q, ...fees};

            }
            arr.push(q);
          }
          //convert the number to a string so the radio buttons work properly
          if(this.CCFRIFacilityModel.existingFeesCorrect){
            this.CCFRIFacilityModel.existingFeesCorrect = this.CCFRIFacilityModel.existingFeesCorrect.toString();
          }

          this.CCFRIFacilityModel.childCareTypes = arr;

          //console.log('the arr', arr);

          //console.log(this.oldCcfri);
          this.feeList = [];



          //only display last years child care fees
          // const prevYearGuid = this.previousProgramYearGuid;
          // this.CCFRIFacilityModel.childCareTypes.forEach(item => {
          //   if (item.programYearId == prevYearGuid ){
          //     this.feeList.push(item);
          //   }
          // });

          //this.feeList.sort((a, b) => a.orderNumber - b.orderNumber);

          //console.log(this.feeList);


          //will have to only display the previous years fee - some logic will have to be done here for that
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
    ...mapActions('ccfriApp', ['saveCcfri', 'loadCCFRIFacility', 'getPreviousCCFRI', 'decorateWithCareTypes', ]),
    ...mapActions('reportChanges', ['updateChangeRequestMTFI']),
    ...mapMutations('ccfriApp', ['setLoadedModel', 'setCCFRIFacilityModel']),
    cancel() {
      this.dialog = false;
      this.CCFRIFacilityModel.existingFeesCorrect = null;
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

      this.CCFRIFacilityModel.childCareTypes[index].approvedFeeApr = this.oldCcfri.childCareTypes[index].approvedFeeApr;
      this.CCFRIFacilityModel.childCareTypes[index].approvedFeeMay = this.oldCcfri.childCareTypes[index].approvedFeeMay;
      this.CCFRIFacilityModel.childCareTypes[index].approvedFeeJun = this.oldCcfri.childCareTypes[index].approvedFeeJun;
      this.CCFRIFacilityModel.childCareTypes[index].approvedFeeJul = this.oldCcfri.childCareTypes[index].approvedFeeJul;
      this.CCFRIFacilityModel.childCareTypes[index].approvedFeeAug = this.oldCcfri.childCareTypes[index].approvedFeeAug;
      this.CCFRIFacilityModel.childCareTypes[index].approvedFeeSep = this.oldCcfri.childCareTypes[index].approvedFeeSep;
      this.CCFRIFacilityModel.childCareTypes[index].approvedFeeOct = this.oldCcfri.childCareTypes[index].approvedFeeOct;
      this.CCFRIFacilityModel.childCareTypes[index].approvedFeeNov = this.oldCcfri.childCareTypes[index].approvedFeeNov;
      this.CCFRIFacilityModel.childCareTypes[index].approvedFeeDec = this.oldCcfri.childCareTypes[index].approvedFeeDec;
      this.CCFRIFacilityModel.childCareTypes[index].approvedFeeJan = this.oldCcfri.childCareTypes[index].approvedFeeJan;
      this.CCFRIFacilityModel.childCareTypes[index].approvedFeeFeb = this.oldCcfri.childCareTypes[index].approvedFeeFeb;
      this.CCFRIFacilityModel.childCareTypes[index].approvedFeeMar = this.oldCcfri.childCareTypes[index].approvedFeeMar;
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
    isInputVisible(){
      // console.log('passed into model index', index);
      // console.log('sel month', this.CCFRIFacilityModel.childCareTypes[index].selectedMonth);
      return !(!this.CCFRIFacilityModel.existingFeesCorrect  || this.CCFRIFacilityModel.existingFeesCorrect == '100000001');
      // else if(monthOfCard >= this.CCFRIFacilityModel.childCareTypes[index].selectedMonth){
      //   return true;
      // }
      // return false;
    },
    isFormComplete(){
      return this.isValidForm; //false makes button clickable, true disables button
    },
    async next() {

    },
    previous() {
      this.$router.push(this.previousPath);
    },
    validateForm() {

    },
    async save(showMessage) {
      //console.log(this.closureFees);
      //this.hasDataToDelete();
      //only save data to Dynamics if the form has changed.
      if (this.hasModelChanged() || this.hasDataToDelete()){
        this.processing = true;
        // this.processing = true;
        //this.setNavBarCCFRIComplete({ ccfriId: this.ccfriId, complete: this.isFormComplete()});

        try {
          this.setLoadedModel( deepCloneObject(this.CCFRIFacilityModel)); //when saving update the loaded model to look for changes
          let res = await this.saveCcfri({isFormComplete: this.isFormComplete(), hasRfi: false}); //TODO: run logic for RFI here?

          //await this.updateChangeRequestMTFI({changeRequestMtfiId :'feba2211-1636-ee11-bdf4-000d3af4865d'}); //testing the endpoint
          //console.log('the res is:' , res);
          if (showMessage) {
            this.setSuccessAlert('Success! CCFRI Parent fees have been saved.');
          }
        } catch (error) {
          console.info(error);
          this.setFailureAlert('An error occurred while saving.');
        }
        this.processing = false;
      }
    }
  },
  mounted() {
    //this.model = this.$store.state.ccfriApp.model ?? model;
  },
  beforeRouteLeave(_to, _from, next) {
    // this.$store.commit('ccfriApp/model', this.model);
    // next();
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


</style>

