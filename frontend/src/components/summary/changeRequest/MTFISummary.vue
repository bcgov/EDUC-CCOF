<template>
  <v-row no-gutters class="d-flex flex-column">
    <v-form ref="mtfiSummaryForm" v-model="isValidForm">
      <v-expansion-panel-header>
        <h4 class="blueText">Parent fees
          <v-icon v-if="isValidForm && isNewCcfriValid" color="green" large>mdi-check-circle-outline</v-icon>
          <v-icon v-if="!isValidForm || !isNewCcfriValid" color="#ff5252" large>mdi-alert-circle-outline</v-icon>
          <span v-if="!isValidForm || !isNewCcfriValid" style="color:#ff5252;">Your form is missing required information. Click here to view. </span>
        </h4>
      </v-expansion-panel-header>
      <v-expansion-panel-content eager>
        <div v-for="(item , index) in oldCcfri?.childCareTypes" :key="index" v-if="isNewCcfriValid">
          <div class="ma-0 pa-0">
            <div class="pa-0 mx-0 my-5">
              <p class="text-h6 blueText">
                Parent Fees {{item.programYear}}: <strong>Full-time {{item.childCareCategory}}</strong>
                (Over four hours, five days a week)
              </p>
            </div>
            <v-row no-gutters>
              <v-row no-gutters v-if="item.feeFrequency != newCcfri?.childCareTypes[index].feeFrequency">
                <v-col class="col-12 col-lg-4 pb-3">
                  Current parent fee frequency: {{item.feeFrequency}}
                </v-col>
                <v-col class="col-12 col-lg-4 pb-3">
                  New parent fee frequency: {{newCcfri?.childCareTypes[index].feeFrequency}}
                </v-col>
              </v-row>
              <div v-else>
                <p>
                  Parent fee frequency: {{item.feeFrequency}}
                </p>
              </div>
            </v-row>
            <div class="">
              <br>
              <v-container class="ma-0 pa-0 pr-16 gridContainer">
                <div class="feeTitle summary-label">
                  <span>Current parent fees: </span>
                </div>

                <v-row no-gutters class="feeTitle summary-label justify-start ma-0">
                  <v-col class="col-8">
                    <v-text-field
                      type="number" dense flat solo hide-details readonly
                      v-model.number="item.approvedFeeApr" label="April" prefix="$"/>
                  </v-col>
                  <v-col class="col-4">Apr {{item.programYear?.substring(0, 4)}}</v-col>
                </v-row>

                <v-row no-gutters class="feeTitle summary-label justify-start ma-0">
                  <v-col class="col-8">
                    <v-text-field
                      type="number" dense flat solo hide-details readonly
                      v-model.number="item.approvedFeeMay" label="May" prefix="$"/>
                  </v-col>
                  <v-col class="col-4">May {{item.programYear?.substring(0, 4)}}</v-col>
                </v-row>

                <v-row no-gutters class="feeTitle summary-label justify-start ma-0">
                  <v-col class="col-8">
                    <v-text-field
                      type="number" dense flat solo hide-details readonly
                      v-model.number="item.approvedFeeJun" label="June" prefix="$"/>
                  </v-col>
                  <v-col class="col-4">Jun {{item.programYear?.substring(0, 4)}}</v-col>
                </v-row>

                <v-row no-gutters class="feeTitle summary-label justify-start ma-0">
                  <v-col class="col-8">
                    <v-text-field
                      type="number" dense flat solo hide-details readonly
                      v-model.number="item.approvedFeeJul" label="July" prefix="$"/>
                  </v-col>
                  <v-col class="col-4">Jul {{item.programYear?.substring(0, 4)}}</v-col>
                </v-row>

                <v-row no-gutters class="feeTitle summary-label justify-start ma-0">
                  <v-col class="col-8">
                    <v-text-field
                      type="number" dense flat solo hide-details readonly
                      v-model.number="item.approvedFeeAug" label="August" prefix="$"/>
                  </v-col>
                  <v-col class="col-4">Aug {{item.programYear?.substring(0, 4)}}</v-col>
                </v-row>

                <v-row no-gutters class="feeTitle summary-label justify-start ma-0">
                  <v-col class="col-8">
                    <v-text-field
                      type="number" dense flat solo hide-details readonly
                      v-model.number="item.approvedFeeSep" label="September" prefix="$"/>
                  </v-col>
                  <v-col class="col-4">Sep {{item.programYear?.substring(0, 4)}}</v-col>
                </v-row>

                <!-- End Row One of Grid-->

                <div class="feeTitle summary-label">
                  <span>New parent fees: </span>
                </div>

                <v-row no-gutters class="feeTitle summary-label justify-start ma-0">
                  <v-col class="col-12">
                    <v-text-field type="number" dense flat solo hide-details readonly :rules="rules.required" placeholder="Required"
                    v-model.number="newCcfri.childCareTypes[index].approvedFeeApr" label="" prefix="$" class="summary-value"/>
                  </v-col>
                </v-row>

                <v-row no-gutters class="feeTitle summary-label justify-start ma-0">
                  <v-col class="col-12">
                    <v-text-field type="number" dense flat solo hide-details readonly :rules="rules.required" placeholder="Required"
                    v-model.number="newCcfri.childCareTypes[index].approvedFeeMay" label="" prefix="$" class="summary-value"/>
                  </v-col>
                </v-row>

                <v-row no-gutters class="feeTitle summary-label justify-start ma-0">
                  <v-col class="col-12">
                    <v-text-field type="number" dense flat solo hide-details readonly :rules="rules.required" placeholder="Required"
                    v-model.number="newCcfri.childCareTypes[index].approvedFeeJun" label="" prefix="$" class="summary-value"/>
                  </v-col>
                </v-row>

                <v-row no-gutters class="feeTitle summary-label justify-start ma-0">
                  <v-col class="col-12">
                    <v-text-field type="number" dense flat solo hide-details readonly :rules="rules.required" placeholder="Required"
                    v-model.number="newCcfri.childCareTypes[index].approvedFeeJul" label="" prefix="$" class="summary-value"/>
                  </v-col>
                </v-row>

                <v-row no-gutters class="feeTitle summary-label justify-start ma-0">
                  <v-col class="col-12">
                    <v-text-field type="number" dense flat solo hide-details readonly :rules="rules.required" placeholder="Required"
                    v-model.number="newCcfri.childCareTypes[index].approvedFeeAug" label="" prefix="$" class="summary-value"/>
                  </v-col>
                </v-row>

                <v-row no-gutters class="feeTitle summary-label justify-start ma-0">
                  <v-col class="col-12">
                    <v-text-field type="number" dense flat solo hide-details readonly :rules="rules.required" placeholder="Required"
                    v-model.number="newCcfri.childCareTypes[index].approvedFeeSep" label="" prefix="$" class="summary-value"/>
                  </v-col>
                </v-row>

                <!-- End Row Two of Grid-->
              </v-container>
              <br>
              <br>

              <v-container class="ma-0 pa-0 pr-16 gridContainer">
                <div class="feeTitle summary-label">
                  <span >Current parent fees: </span>
                </div>

                <v-row no-gutters class="feeTitle summary-label justify-start ma-0">
                  <v-col class="col-8">
                    <v-text-field
                      type="number" dense flat solo hide-details readonly
                      v-model.number="item.approvedFeeOct" label="October" prefix="$"/>
                  </v-col>
                  <v-col class="col-4">Oct {{item.programYear?.substring(0, 4)}}</v-col>
                </v-row>

                <v-row no-gutters class="feeTitle summary-label justify-start ma-0">
                  <v-col class="col-8">
                    <v-text-field
                      type="number" dense flat solo hide-details readonly
                      v-model.number="item.approvedFeeNov" label="November" prefix="$"/>
                  </v-col>
                  <v-col class="col-4">Nov {{item.programYear?.substring(0, 4)}}</v-col>
                </v-row>

                <v-row no-gutters class="feeTitle summary-label justify-start ma-0">
                  <v-col class="col-8">
                    <v-text-field
                      type="number" dense flat solo hide-details readonly
                      v-model.number="item.approvedFeeDec" label="December" prefix="$"/>
                  </v-col>
                  <v-col class="col-4">Dec {{item.programYear?.substring(0, 4)}}</v-col>
                </v-row>

                <v-row no-gutters class="feeTitle summary-label justify-start ma-0">
                  <v-col class="col-8">
                    <v-text-field
                      type="number" dense flat solo hide-details readonly
                      v-model.number="item.approvedFeeJan" label="January" prefix="$"/>
                  </v-col>
                  <v-col class="col-4">Jan 20{{item.programYear?.slice(-5, -3)}}</v-col>
                </v-row>

                <v-row no-gutters class="feeTitle summary-label justify-start ma-0">
                  <v-col class="col-8">
                    <v-text-field
                      type="number" dense flat solo hide-details readonly
                      v-model.number="item.approvedFeeFeb" label="February" prefix="$"/>
                  </v-col>
                  <v-col class="col-4">Feb 20{{item.programYear?.slice(-5, -3)}}</v-col>
                </v-row>

                <v-row no-gutters class="feeTitle summary-label justify-start ma-0">
                  <v-col class="col-8">
                    <v-text-field
                      type="number" dense flat solo hide-details readonly
                      v-model.number="item.approvedFeeMar" label="March" prefix="$"/>
                  </v-col>
                  <v-col class="col-4">Mar 20{{item.programYear?.slice(-5, -3)}}</v-col>
                </v-row>

                <!-- End Row One of Grid-->

                <div class="feeTitle summary-label">
                  <span>New parent fees: </span>
                </div>

                <v-row no-gutters class="feeTitle summary-label justify-start ma-0">
                  <v-col class="col-12">
                    <v-text-field type="number" dense flat solo hide-details readonly :rules="rules.required" placeholder="Required"
                    v-model.number="newCcfri.childCareTypes[index].approvedFeeOct" label="" prefix="$" class="summary-value"/>
                  </v-col>
                </v-row>

                <v-row no-gutters class="feeTitle summary-label justify-start ma-0">
                  <v-col class="col-12">
                    <v-text-field type="number" dense flat solo hide-details readonly :rules="rules.required" placeholder="Required"
                    v-model.number="newCcfri.childCareTypes[index].approvedFeeNov" label="" prefix="$" class="summary-value"/>
                  </v-col>
                </v-row>

                <v-row no-gutters class="feeTitle summary-label justify-start ma-0">
                  <v-col class="col-12">
                    <v-text-field type="number" dense flat solo hide-details readonly :rules="rules.required" placeholder="Required"
                    v-model.number="newCcfri.childCareTypes[index].approvedFeeDec" label="" prefix="$" class="summary-value"/>
                  </v-col>
                </v-row>

                <v-row no-gutters class="feeTitle summary-label justify-start ma-0">
                  <v-col class="col-12">
                    <v-text-field type="number" dense flat solo hide-details readonly :rules="rules.required" placeholder="Required"
                    v-model.number="newCcfri.childCareTypes[index].approvedFeeJan" label="" prefix="$" class="summary-value"/>
                  </v-col>
                </v-row>

                <v-row no-gutters class="feeTitle summary-label justify-start ma-0">
                  <v-col class="col-12">
                    <v-text-field type="number" dense flat solo hide-details readonly :rules="rules.required" placeholder="Required"
                    v-model.number="newCcfri.childCareTypes[index].approvedFeeFeb" label="" prefix="$" class="summary-value"/>
                  </v-col>
                </v-row>

                <v-row no-gutters class="feeTitle summary-label justify-start ma-0">
                  <v-col class="col-12">
                    <v-text-field type="number" dense flat solo hide-details readonly :rules="rules.required" placeholder="Required"
                    v-model.number="newCcfri.childCareTypes[index].approvedFeeMar" label="" prefix="$" class="summary-value"/>
                  </v-col>
                </v-row>

                <!-- End Row Two of Grid-->
                <br>
              </v-container>

            </div>
          </div>
        </div>
        <v-row v-if="!isValidForm || !isNewCcfriValid" class="d-flex justify-start pt-4">
          <v-col cols="6" lg="4" class="pb-0 pt-0 ml-2">
            <v-row  no-gutters class="d-flex justify-start">
              <v-col class="d-flex justify-start">
                <router-link :to="getRoutingPath"><span style="color:#ff5252; text-underline: black"><u>To add this information, click here. This will bring you to a different page.</u></span></router-link>
              </v-col>
            </v-row>
          </v-col>
        </v-row>


      </v-expansion-panel-content>
    </v-form>
  </v-row>
</template>

<script>
import { mapState } from 'vuex';


export default {
  props: {
    oldCcfri: {
      type: Object,
      required: false
    },
    newCcfri: {
      type: Object,
      required: false
    },
    facilityId: {
      type: String,
      required: false
    },
  },
  data() {
    return {
      PATHS,
      rules,
      isValidForm: true,
      formObj:{
        formName: 'MTFISummary',
        formId: this.facilityId,
      },
    };
  },
  watch: {
    isLoadingComplete: {
      handler: function (val) {
        if (val) {
          if (!this.isNewCcfriValid)
            this.isValidForm = false;
          this.$emit('isSummaryValid', this.formObj, this.isValidForm);
        }
      },
    }
  },
  computed:{
    ...mapState('summaryDeclaration', ['isLoadingComplete']),
    getRoutingPath(){
      return changeUrlGuid(PATHS.MTFI_GROUP_FEE_VERIFICATION, this.$route.params.changeRecGuid, this.newCcfri.ccfriApplicationId, CHANGE_TYPES.MTFI);
    },
    isNewCcfriValid() {
      return (this.newCcfri?.childCareTypes?.length === this.oldCcfri?.childCareTypes?.length);
    }
  },
  methods: {
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
  grid-template-rows:    repeat(2, 65px);
}

.feeTitle {
  display: flex;
  align-items: center;
  text-align: end !important;
  text-align: right !important;
  justify-items: end;
  justify-content: end;
  padding: 0px 16px 0px 8px;
  border-right: solid 1px rgba(0, 0, 0, 0.5) !important;
}

.blueText {
  color: #003466 !important;
}

>>>::placeholder {
  color: #ff5252!important;
  opacity: 1;
}
</style>
