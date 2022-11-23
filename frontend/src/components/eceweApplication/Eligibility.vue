<template>
    <v-container>
      <v-row justify="center">
        <br/>
        Early Childhood Educator-Wage Enhancement (ECE-WE)
      </v-row>
      <v-row justify="center" class="pt-2">
        {Organization Name}
      </v-row>
      <v-row><v-col></v-col></v-row>
      <v-row><v-col></v-col></v-row>

      <v-row justify="center">
        <v-card class="cc-top-level-card eceweCard">
          <v-container>
            <v-row justify="center">
              <br/>
              For the {2022/23} funding term, would you like to opt-in to ECE-WE for any facility in your organization?
            </v-row>
            <v-row justify="center">
              <v-radio-group
                v-model="model.eceweOptInQ1"
                row>
              <v-col>
                <v-radio style="padding-right:80px"
                  label="Yes"
                  value="true"
              ></v-radio>
              </v-col>
              <v-col>
                <v-radio
                  label="No"
                  value="false"
                  @click="goToDocumentUpload();"
                ></v-radio>
              </v-col>
              </v-radio-group>
            </v-row>
          </v-container>
        </v-card>
      </v-row>
      
      <v-row v-if="model.eceweOptInQ1=='true'" justify="center">
        <v-card class="cc-top-level-card eceweCard">
          <v-container>
            <v-row justify="center">
              <br/>
              Do any of the ECE Employees at any facility in your organization belong to a union?
            </v-row>
            <v-row justify="center">
              <v-radio-group
                v-model="model.employeesBelongToUnionQ2"
                row>
              <v-col>
                <v-radio style="padding-right:80px"
                  label="Yes"
                  value="true"
                ></v-radio>
              </v-col>
              <v-col>
                <v-radio
                  label="No"
                  value="false"
                  @click="goToIntakeFacilities()"
                ></v-radio>
              </v-col>
              </v-radio-group>
            </v-row>
          </v-container>
        </v-card>
      </v-row>

      <v-row v-if="model.employeesBelongToUnionQ2 == 'true'" justify="center">
        <v-card class="cc-top-level-card eceweCard">
          <v-container>
            <v-row justify="center" >
              <v-col style="padding-bottom:0px;margin-bottom:0px;">
                Select the applicable funding model:
              </v-col>
            </v-row>
            <v-radio-group
                v-model="model.fundingModelQ3"
                row>
            <v-row justify="center">
              <v-col class="pt-2">
                <v-radio
                  label="All of our facilities have provincially funded ECEs and receive Low-Wage Redress Funding"
                  value="Q3-1"
                  @click="showNextSaveBtns()"
                  ></v-radio>
              </v-col>
            </v-row>
            <v-card v-if="model.fundingModelQ3 == 'Q3-1'" width="100%">
              <v-row>
                <v-col class="py-0">
                  <v-card-title class="py-1 notice1">
                    <span style="float:left">
                  <v-icon
                    x-large
                    class="py-1 px-3 iconNotice1">
                    mdi-alert-octagon
                  </v-icon>
                  </span>
                    ECEs at these facilities are not eligible for ECE Wage Enhancement
                  </v-card-title>
                </v-col>
              </v-row>
              <v-row justify="center" class="pa-4">
                Government’s Low-Wage Redress Funding supports ECE wage ajustments
              </v-row>
            </v-card>
            <v-row>
              <v-col class="pt-7">
                <v-radio
                  label="All of our facilities have only non-provincially funded ECEs and do not receive Low-Wage Redress Funding"
                  value="Q3-2"
                  @click="showNextSaveBtns()"
                ></v-radio>
              </v-col>
            </v-row>
            <v-card v-if="model.fundingModelQ3 == 'Q3-2'" width="100%">
              <v-row>
                <v-col class="py-0">
                  <v-card-title class="py-1 notice2">
                    <span style="float:left">
                  <v-icon
                    x-large
                    class="py-1 px-3 iconNotice2">
                    mdi-alert
                  </v-icon>
                  </span>
                    ECEs in provincially funded programs are not eligible
                  </v-card-title>
                </v-col>
              </v-row>
              <v-row justify="center" class="pa-4">
                Only ECEs in non-provincially funded programs are eligible for ECE Wage Enhancement.
              </v-row>
            </v-card>
            <v-row>
              <v-col class="pt-7">
                <v-radio
                  label="Some of our facilities have both non-provincially funded ECEs that do not receive Low-Wage Redress Funding AND provincially funded ECEs receiving Low-Wage Redress Funding."
                  value="Q3-3"
                  @click="showNextSaveBtns()"
                ></v-radio>
              </v-col>
            </v-row>
            <v-card v-if="model.fundingModelQ3 == 'Q3-3'" width="100%">
              <v-row>
                <v-col class="py-0">
                  <v-card-title class="py-1 notice3">
                    <span style="float:left">
                  <v-icon
                    x-large
                    color="#D40D19"
                    class="py-1 px-3 iconNotice3">
                    mdi-information
                  </v-icon>
                  </span>
                    Please confirm
                  </v-card-title>
                </v-col>
              </v-row>
              <v-row justify="center">
                <v-col class="pl-6">
                I confirm that my organization/facilities pay the Joint Job Evaluation Plan (JJEP) wage rates or, if a lesser amount, a side agreement is being concluded to implement the ECE Wage Enhancement.
                </v-col>
              </v-row>
            </v-card>
          </v-radio-group>
          </v-container>
        </v-card>
      </v-row>

      <v-row>
        <v-col cols="4" class="text-left">
          <v-btn outlined @click="previous()">Back</v-btn>
        </v-col>
          <v-col cols="4" class="text-center">
            <v-btn v-show="model.fundingModelQ3" outlined @click="nextPage()">Next</v-btn>
          </v-col>
          <v-col cols="4" class="text-right">
            <v-btn v-show="model.fundingModelQ3" outlined @click="save()">Save</v-btn>
          </v-col>
      </v-row>
    </v-container>
  </template>
  
<script>
  
import { PATHS } from '@/utils/constants';

let model = { x: [], };

export default {
  props: {},
  computed: {},
  data() {
    return {
      model,
      //eceweData,
      previousPath: '',
      //eceweOptInQ1: '',
      //employeesBelongToUnionQ2: '',
      //fundingModelQ3: '',
      showNextBtn: false,
      showSaveBtn: false,
      row: '',
      facilities: [{ name: 'Facility 1', id: 'fac1' }, { name: 'Facility 2', id: 'fac2' }, { name: 'Facility 3', id: 'fac3' }]
    };
  },
  methods: {
    nextPage() {
      this.$router.push(PATHS.eceweFacilities);
    },
    save() {
      this.$router.push(PATHS);
    },
    goToDocumentUpload() {
      this.$router.push(PATHS.documentUpload);
    },
    goToIntakeFacilities() {
      this.$router.push(PATHS.eceweFacilities);
    },
    showNextSaveBtns() {
      this.showNextBtn=true;
      this.showSaveBtn=true;
    }
  },
  mounted() {
    this.model = this.$store.state.eceweApp.model ?? model;
  },
  beforeRouteLeave(_to, _from, next) {
    this.model.previousRoute = _from.path;
    this.$store.commit('eceweApp/model', this.model);
    next();
  }
};
</script>
  
<style>

.eceweCard {
  width:60%;
}

.iconNotice1 {
  color:#D40D19 !important;
}
.notice1 {
  font-size:medium;
  color:#D40D19;
  font-family:BCSans;
  padding-top:8px;
  padding-bottom:8px;
  background-color:#F2DEDE;
  border:1px solid #D40D19;
}
.iconNotice2 {
  color:#6C4A00 !important;
}
.notice2 {
  font-size:medium;
  color:#6C4A00;
  font-family:BCSans;
  padding-top:8px;
  padding-bottom:8px;
  background-color:#F9F1C6;
  border:1px solid #6C4A00;
}
.iconNotice3 {
  color:#313132 !important;
}
.notice3 {
  font-size:medium;
  color:#313132;
  font-family:BCSans;
  padding-top:8px;
  padding-bottom:8px;
  background-color:#C1DCF6;
  border:1px solid #313132;
}

</style>
