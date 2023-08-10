<template>
  <v-row no-gutters class="d-flex flex-column">
    <v-form ref="mtfiSummaryForm" v-model="isValidForm">
      <v-expansion-panel-header>
      <h4 class="blueText">Parent fee increase (MTFI)
        <v-icon v-if="isValidForm" color="green" large>mdi-check-circle-outline</v-icon>
        <v-icon v-if="!isValidForm" color="#ff5252" large>mdi-alert-circle-outline</v-icon>
        <span v-if="!isValidForm" style="color:#ff5252;">Your form is missing required information. Click here to view. </span>
      </h4>
    </v-expansion-panel-header>
    <v-expansion-panel-content eager  >
      <div v-for="(item , index) in oldCcfri?.childCareTypes" :key="index">
        <div class="ma-0 pa-0">
          <div class="pa-0 mx-0 my-5">
            <h4 class="pa-0 ma-0 blueText">
              Parent Fees {{item.programYear}}: Full-Time {{item.childCareCategory}}
            </h4>
          </div>
          <div class="px-md-12 px-7">
            <br>
            <v-container class="ma-0 pa-0 gridContainer">
              <div class="feeTitle summary-label">
                <span>Current Fees: </span>
              </div>

              <div class="feeTitle summary-label right">
                <span >April:</span>
                <v-text-field dense flat solo hide-details readonly
                  :value="item.approvedFeeApr" prefix="$"/>
                  
              </div>

              <div class="feeTitle summary-label">
                <span class=" ">May:</span>
                <v-text-field  class="" type="number" dense flat solo hide-details readonly
                  v-model.number="item.approvedFeeMay" label="May" prefix="$"/>
                  
              </div>

              <div class="feeTitle summary-label">
                <span class="">June:</span>
                <v-text-field type="number" dense flat solo hide-details readonly
                  v-model.number="item.approvedFeeJun" label="June" prefix="$"/>
                  
              </div>

              <div class="feeTitle summary-label">
              <span class="">July:</span>
                <v-text-field type="number" dense flat solo hide-details readonly
                  v-model.number="item.approvedFeeJul" label="July" prefix="$"/>
                  
              </div>

              <div class="feeTitle summary-label">
                <span class=" ">Aug:</span>
                <v-text-field type="number" dense flat solo hide-details readonly
                  v-model.number="item.approvedFeeAug" label="August" prefix="$" />
                  
              </div>

              <div class="feeTitle summary-label">
                <span class="">Sept:</span>
                <v-text-field type="number" dense flat solo hide-details readonly
                  v-model.number="item.approvedFeeSep" label="September" prefix="$" />
                  
              </div>

              <!-- End Row One of Grid-->

              <div class="feeTitle summary-label" >
                <span>New Parent Fees: </span>
              </div>

              <div class="feeTitle">
                <v-text-field type="number" dense flat solo hide-details readonly
                v-model.number="newCcfri.childCareTypes[index].approvedFeeApr" label="" prefix="$" class="summary-value"/>

              </div>

              <div class="feeTitle">
                <v-text-field type="number" dense flat solo hide-details readonly
                v-model.number="newCcfri.childCareTypes[index].approvedFeeMay" label="" prefix="$" class="summary-value"/>

              </div>

              <div class="feeTitle">
                <v-text-field type="number" dense flat solo hide-details readonly
                v-model.number="newCcfri.childCareTypes[index].approvedFeeJun" label="" prefix="$" class="summary-value"/>

              </div>

              <div class="feeTitle">
                <v-text-field type="number" dense flat solo hide-details readonly
                v-model.number="newCcfri.childCareTypes[index].approvedFeeJul" label="" prefix="$" class="summary-value"/>

              </div>

              <div class="feeTitle">
                <v-text-field type="number" dense flat solo hide-details readonly
                v-model.number="newCcfri.childCareTypes[index].approvedFeeAug" label="" prefix="$" class="summary-value"/>

              </div>

              <div class="feeTitle">
                <v-text-field type="number" dense flat solo hide-details readonly
                v-model.number="newCcfri.childCareTypes[index].approvedFeeSep" label="" prefix="$" class="summary-value"/>

              </div>

              <!-- End Row Two of Grid-->
            </v-container>
            <br>
            <br>

            <v-container class="ma-0 pa-0 gridContainer">

              <div class="feeTitle summary-label">
                <span >Current Fees: </span>
              </div>

              <div class="feeTitle summary-label">
                <span >Oct:</span>
                <v-text-field class="" dense flat solo hide-details readonly type="number"
                  v-model.number="item.approvedFeeOct" prefix="$"/>
                  
              </div>

              <div class="feeTitle summary-label">
                <span class=" ">Nov:</span>
                <v-text-field  class="" type="number" dense flat solo hide-details readonly
                  v-model.number="item.approvedFeeNov" label="May" prefix="$"/>
                  
              </div>

              <div class="feeTitle summary-label">
                <span class="">Dec:</span>
                <v-text-field type="number" dense flat solo hide-details readonly
                  v-model.number="item.approvedFeeDec" label="June" prefix="$"/>
                  
              </div>

              <div class="feeTitle summary-label">
              <span class="">Jan:</span>
                <v-text-field type="number" dense flat solo hide-details readonly
                  v-model.number="item.approvedFeeJan" label="July" prefix="$"/>
                  
              </div>

              <div class="feeTitle summary-label">
                <span class=" ">Feb:</span>
                <v-text-field type="number" dense flat solo hide-details readonly
                  v-model.number="item.approvedFeeFeb" label="August" prefix="$" />
                  
              </div>

              <div class="feeTitle summary-label">
                <span class="">Mar:</span>
                <v-text-field type="number" dense flat solo hide-details readonly
                  v-model.number="item.approvedFeeMar" label="September" prefix="$" />
                  
              </div>

              <!-- End Row One of Grid-->

              <div class="feeTitle summary-label">
                <span >New Parent Fees: </span>
              </div>

              <div class="feeTitle ">
                <v-text-field type="number" dense flat solo hide-details readonly
                v-model.number="newCcfri.childCareTypes[index].approvedFeeOct" label="" prefix="$"/>

              </div>

              <div class="feeTitle ">
                <v-text-field type="number" dense flat solo hide-details readonly
                v-model.number="newCcfri.childCareTypes[index].approvedFeeNov" label="" prefix="$"/>

              </div>

              <div class="feeTitle ">
                <v-text-field type="number" dense flat solo hide-details readonly
                v-model.number="newCcfri.childCareTypes[index].approvedFeeDec" label="" prefix="$"/>

              </div>

              <div class="feeTitle ">
                <v-text-field type="number" dense flat solo hide-details readonly
                v-model.number="newCcfri.childCareTypes[index].approvedFeeJan" label="" prefix="$"/>

              </div>

              <div class="feeTitle ">
                <v-text-field type="number" dense flat solo hide-details readonly
                v-model.number="newCcfri.childCareTypes[index].approvedFeeFeb" label="" prefix="$"/>

              </div>

              <div class="feeTitle ">
                <v-text-field type="number" dense flat solo hide-details readonly
                v-model.number="newCcfri.childCareTypes[index].approvedFeeMar" label="" prefix="$"/>

              </div>

              <!-- End Row Two of Grid-->
              <br>
            </v-container>

          </div>
        </div>
      </div>

      <!-- <v-row v-if="!isValidForm" class="d-flex justify-start">
        <v-col cols="6" lg="4" class="pb-0 pt-0 ml-2">
          <v-row  no-gutters class="d-flex justify-start">
            <v-col cols="12" class="d-flex justify-start">
              <router-link :to="getRoutingPath()" > <span style="color:#ff5252; text-underline: black"><u>To add this information, click here. This will bring you to a different page.</u></span></router-link>
            </v-col>
          </v-row>
        </v-col>
      </v-row> -->
    </v-expansion-panel-content>
    </v-form>
  </v-row>
</template>
<script>
import _ from 'lodash';
import { isChangeRequest } from '@/utils/common';
import { PATHS, pcfUrlGuid, pcfUrl, changeUrl, changeUrlGuid , ApiRoutes } from '@/utils/constants';
import rules from '@/utils/rules';
import { mapState, mapActions, mapGetters, mapMutations} from 'vuex';
import ApiService from '@/common/apiService';



export default {
  props: {
    ccfriApplicationId: {
      type: String,
      required: false
    },
    facilityId: {
      type: String,
      required: false
    },
    changeRecGuid: {
      type: String,
      required: false
    },
    programYearId: {
      type: String,
      required: false
    }
  },
  data() {
    return {
      PATHS,
      rules,
      isValidForm: true,
      oldCcfri: undefined,
      newCcfri: undefined,

    };
  },
  async beforeMount() {
    try {
      await this.loadOldCcfri();
      await this.loadNewCcfri();
      console.log('oldCcfri === ');
      console.log(this.oldCcfri);
      console.log('newCcfri === ');
      console.log(this.newCcfri);
    } catch(error) {
      console.log('Error loading summary and declaration for change request: ', error);
      this.setFailureAlert('Error loading summary and declaration for change request.');
    }
  },
  watch: {
    isLoadingComplete: {
      handler: function (val) {
        if (val) {
          this.$emit('isSummaryValid', this.formObj, this.isValidForm);
        }
      },
    }
  },
  computed:{
    ...mapState('application', ['isRenewal',]),
    ...mapState('navBar', ['userProfileList']),
    ...mapState('summaryDeclaration', ['isLoadingComplete']),
    ...mapGetters('ccfriApp', ['getCCFRIById']),
  },
  methods: {
    ...mapActions('ccfriApp', ['saveCcfri', 'loadCCFRIFacility', 'getPreviousCCFRI', 'decorateWithCareTypes']),
    ...mapMutations('ccfriApp', ['setLoadedModel']),
    // getRoutingPath(){
    //   if(!this.ccfri && isChangeRequest(this)){
    //     return changeUrl(PATHS.CCFRI_HOME , this.changeRecGuid,);
    //   }
    //   else if(!this.ccfri){
    //     pcfUrl(PATHS.CCFRI_HOME, this.programYearId);
    //   }
    //   else if(isChangeRequest(this)){
    //     return changeUrlGuid(PATHS.CCFRI_NEW_FEES, this.changeRecGuid, this.ccfri?.ccfriId);
    //   }
    //   else if(this.isRenewal){
    //     return pcfUrlGuid(PATHS.CCFRI_CURRENT_FEES, this.programYearId, this.ccfri?.ccfriId);
    //   }
    //   else {
    //     return pcfUrlGuid(PATHS.CCFRI_NEW_FEES,  this.programYearId, this.ccfri?.ccfriId);
    //   }
    // },
    async loadOldCcfri() {
      let facility = this.userProfileList.find(item => item.facilityId == this.facilityId);
      if (facility) {
        let oldCcfriApplicationId = facility.ccfriApplicationId;
        this.oldCcfri = (await ApiService.apiAxios.get(`${ApiRoutes.CCFRIFACILITY}/${oldCcfriApplicationId}`)).data;
        // this.oldCcfri = (await ApiService.apiAxios.get(`${ApiRoutes.CCFRIFACILITY}/d6169369-3727-ee11-9965-000d3a09d4d4`)).data;
      }
    },
    async loadNewCcfri() {
      this.newCcfri = (await ApiService.apiAxios.get(`${ApiRoutes.CCFRIFACILITY}/${this.ccfriApplicationId}`)).data;
      // this.newCcfri = (await ApiService.apiAxios.get(`${ApiRoutes.CCFRIFACILITY}/d6169369-3727-ee11-9965-000d3a09d4d4`)).data;

    },
  }
};
</script>
<style scoped>
.summary-label {
  color: grey;
  font-size: small;
}

.summary-value {
  font-size: medium;
  color: black !important;
}

.summary-label-smaller {
  color: grey;
  font-size: x-small;
}

.summary-label-bold {
  color: black;
  font-size: small;
  font-style: initial;
}
.summary-value-small{
  color: black;
  font-size: small;
  font-weight: bold
}

.gridContainer {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows:    repeat(2, 100px);
}

.feeTitle {
  display: flex;
  align-items: center;
  text-align: end !important;
  text-align: right !important;
  justify-items: end;
  justify-content: end;
  border-right: solid 1px rgba(0, 0, 0, 0.5) !important;
}

.blueText {
  color: #003466 !important;
}

</style>
