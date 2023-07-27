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
      <span class="text-h5">Facility Name: </span>
    </div>


    <v-form ref="isValidForm" value="false" v-model="isValidForm">

      <div v-if="loading">
        <v-skeleton-loader max-height="475px"  :loading="loading" type="image, image"></v-skeleton-loader>
        <br><br>
        <v-skeleton-loader max-height="475px"  :loading="loading" type="image, image"></v-skeleton-loader>
      </div>

      <div v-else>
        <div v-for="(item , index) in CCFRIFacilityModel.childCareTypes" :key="index">
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

                    <v-radio-group
                    :rules = "rules"
                      v-model="item.feeFrequency"
                      label="Parent fee frequency"
                      :disabled="true"
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
                      <v-col
                        class="col-6 col-md-2"
                      >
                      <!-- <v-text-field placeholder="Required"  :value="ccType.approvedFeeMay" class="summary-value" dense flat solo hide-details readonly :rules="rules.required" prefix="$"></v-text-field> -->
                      <span class="summary-label pt-3 col-6">April:</span>
                        <v-text-field class="col-6" dense flat solo hide-details readonly type="number" :disabled="false"  :rules="feeRules"
                          v-model.number="item.approvedFeeApr" @input="convertBlankNumberToNull(item,'approvedFeeApr')" label="April" prefix="$"/>
                      </v-col>
                      <v-col
                        class="col-6 col-md-2"
                      >
                      <span class="summary-label pt-3 col-6">May:</span>
                        <v-text-field type="number" dense flat solo hide-details readonly @wheel="$event.target.blur()" :disabled="false" :rules="feeRules"
                          v-model.number="item.approvedFeeMay" @input="convertBlankNumberToNull(item,'approvedFeeMay')" label="May" prefix="$"/>
                      </v-col >
                      <v-col
                        class="col-6 col-md-2"
                      >
                      <span class="summary-label pt-3 col-6">June:</span>
                        <v-text-field type="number" dense flat solo hide-details readonly @wheel="$event.target.blur()" :disabled="false" :rules="feeRules"
                          v-model.number="item.approvedFeeJun" @input="convertBlankNumberToNull(item,'approvedFeeJun')" label="June" prefix="$"/>
                      </v-col>
                      <v-col
                      class="col-6 col-md-2"
                      >
                      <span class="summary-label pt-3 col-6">July:</span>
                        <v-text-field type="number" dense flat solo hide-details readonly @wheel="$event.target.blur()" :disabled="false" :rules="feeRules"
                          v-model.number="item.approvedFeeJul" @input="convertBlankNumberToNull(item,'approvedFeeJul')" label="July" prefix="$"/>
                      </v-col>
                      <v-col
                        class="col-6 col-md-2"
                      >
                      <span class="summary-label pt-3 col-6">Aug:</span>
                        <v-text-field type="number" dense flat solo hide-details readonly @wheel="$event.target.blur()" :disabled="false"  :rules="feeRules"
                          v-model.number="item.approvedFeeAug" @input="convertBlankNumberToNull(item,'approvedFeeAug')" label="August" prefix="$" />
                      </v-col>
                      <v-col
                        class="col-6 col-md-2"
                      >
                      <span class="summary-label pt-3 col-6">Sept:</span>
                        <v-text-field type="number" dense flat solo hide-details readonly @wheel="$event.target.blur()" :disabled="false"  :rules="feeRules"
                          v-model.number="item.approvedFeeSep" @input="convertBlankNumberToNull(item,'approvedFeeSep')" label="September" prefix="$" />
                      </v-col>
                    </v-row>

                    <v-row>
                      <v-col
                        class="col-6 col-md-2">
                        <span class="summary-label pt-3 col-6">Oct:</span>
                        <v-text-field type="number" dense flat solo hide-details readonly @wheel="$event.target.blur()" :disabled="false"  :rules="feeRules"
                          v-model.number="item.approvedFeeOct" @input="convertBlankNumberToNull(item,'approvedFeeOct')" label="October" prefix="$"/>
                      </v-col>
                      <v-col
                        class="col-6 col-md-2">
                        <span class="summary-label pt-3 col-6">Nov:</span>
                        <v-text-field type="number" dense flat solo hide-details readonly @wheel="$event.target.blur()" :disabled="false" :rules="feeRules"
                          v-model.number="item.approvedFeeNov" @input="convertBlankNumberToNull(item,'approvedFeeNov')" label="November" prefix="$"/>
                      </v-col >
                      <v-col
                        class="col-6 col-md-2">
                        <span class="summary-label pt-3 col-6">Dec:</span>
                        <v-text-field type="number" dense flat solo hide-details readonly @wheel="$event.target.blur()" :disabled="false"  :rules="feeRules"
                          v-model.number="item.approvedFeeDec" @input="convertBlankNumberToNull(item,'approvedFeeDec')" label="December" prefix="$"/>
                      </v-col >
                      <v-col
                        class="col-6 col-md-2">
                        <span class="summary-label pt-3 col-6">Jan:</span>
                        <v-text-field type="number" dense flat solo hide-details readonly @wheel="$event.target.blur()" :disabled="false"  :rules="feeRules"
                          v-model.number="item.approvedFeeJan" @input="convertBlankNumberToNull(item,'approvedFeeJan')" label="Jan" prefix="$"/>
                      </v-col>
                      <v-col
                        class="col-6 col-md-2">
                        <span class="summary-label pt-3 col-6">Feb:</span>
                        <v-text-field type="number" dense flat solo hide-details readonly @wheel="$event.target.blur()" :disabled="false"  :rules="feeRules"
                          v-model.number="item.approvedFeeFeb" @input="convertBlankNumberToNull(item,'approvedFeeFeb')" label="Feb" prefix="$" />
                      </v-col>
                      <v-col
                        class="col-6 col-md-2">
                        <span class="summary-label pt-3 col-6">Mar:</span>
                        <v-text-field type="number" dense flat solo hide-details readonly @wheel="$event.target.blur()" :disabled="false"  :rules="feeRules"
                          v-model.number="item.approvedFeeMar" @input="convertBlankNumberToNull(item,'approvedFeeMar')" label="March" prefix="$" />
                      </v-col>
                    </v-row>

                    </v-container>
                  </div>
                </v-card-text>
            </v-card>

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
                    v-model="model.q1"
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
                </v-card-text>
             </v-card>


        </div>
      </div>


    </v-form>



      <NavButton :isNextDisplayed="true" :isSaveDisplayed="true"
        :isSaveDisabled="isReadOnly" :isNextDisabled="true" :isProcessing="processing"
        @previous="" @next="next" @validateForm="validateForm()" @save="save(true)"></NavButton>
  </v-container>
</template>

<script>



import { mapState, mapActions, mapGetters, mapMutations} from 'vuex';
import LargeButtonContainer from '../guiComponents/LargeButtonContainer.vue';
import { PATHS, changeUrl, changeUrlGuid, pcfUrl, pcfUrlGuid } from '@/utils/constants';
import ApiService from '@/common/apiService';
import alertMixin from '@/mixins/alertMixin';
import NavButton from '@/components/util/NavButton';
import { isChangeRequest } from '@/utils/common';


let ccfriOptInOrOut = {};
let textInput = '' ;
let model = { x: [], ccfriOptInOrOut, textInput };

export default {
  name: 'CcfriLandingPage',
  mixins: [alertMixin],
  data() {
    return {
      isUnlocked: false,
      originalFacilityList: [],
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

    ...mapState('application', ['applicationStatus',  'formattedProgramYear', 'programYearId', 'applicationId']),
    ...mapState('app', ['isRenewal', 'ccfriOptInComplete', 'programYearList']),
    ...mapState('navBar', ['navBarList', 'userProfileList']),
    ...mapGetters('navBar', ['previousPath'])
  },
  watch: {
    //get facilityID from here and then set it !
    '$route.params.urlGuid': {
      async handler() {
        try {
          this.loading = true;
          await this.loadCCFRIFacility(this.$route.params.urlGuid);

          this.feeList = [];

          //only display last years child care fees
          // const prevYearGuid = this.previousProgramYearGuid;
          // this.CCFRIFacilityModel.childCareTypes.forEach(item => {
          //   if (item.programYearId == prevYearGuid ){
          //     this.feeList.push(item);
          //   }
          // });

          //this.feeList.sort((a, b) => a.orderNumber - b.orderNumber);

          console.log(this.feeList);


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
    ...mapActions('ccfriApp', ['loadCCFRIFacility', 'getPreviousCCFRI']),
    async next() {

    },
    previous() {
      this.$router.push(this.previousPath);
    },
    validateForm() {

    },
    async save(withAlert) {

    },
  },
  mounted() {
    //this.model = this.$store.state.ccfriApp.model ?? model;
  },
  beforeRouteLeave(_to, _from, next) {
    // this.$store.commit('ccfriApp/model', this.model);
    // next();
  },
  components: {LargeButtonContainer,NavButton}
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

