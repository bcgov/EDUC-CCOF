<template>
    <v-container>
      <v-row justify="center" class="pt-4">
        <span class="text-h5">Early Childhood Educator-Wage Enhancement (ECE-WE)</span>
      </v-row>
      <v-row justify="center" class="pt-4 text-h6" style="color:#003466;">
        {{this.userInfo.organizationName}}
      </v-row>
      <v-row><v-col></v-col></v-row>

      <v-row justify="center">
        <v-card class="cc-top-level-card eceweCard">
          <v-container>
            <v-row justify="center">
              <br/>
              For the 2022/23 funding term, would you like to opt-in to ECE-WE for any facility in your organization?
            </v-row>
            <v-row justify="center">
              <v-radio-group
                v-model="q1OptInECEWE"
                row>
              <v-col>
                <v-radio style="padding-right:80px"
                  label="Yes"
                  value="1"
              ></v-radio>
              </v-col>
              <v-col>
                <v-radio
                  label="No"
                  value="0"
                ></v-radio>
              </v-col>
              </v-radio-group>
            </v-row>
          </v-container>
        </v-card>
      </v-row>
      
      <v-row v-if="q1OptInECEWE" justify="center">
        <v-card class="cc-top-level-card eceweCard">
          <v-container>
            <v-row justify="center">
              <br/>
              Do any of the ECE Employees at any facility in your organization belong to a union?
            </v-row>
            <v-row justify="center">
              <v-radio-group
                v-model="q2BelongsToUnion"
                row>
              <v-col>
                <v-radio style="padding-right:80px"
                  label="Yes"
                  value="1"
                ></v-radio>
              </v-col>
              <v-col>
                <v-radio
                  label="No"
                  value="0"
                ></v-radio>
              </v-col>
              </v-radio-group>
            </v-row>
          </v-container>
        </v-card>
      </v-row>

      <v-row v-if="q2BelongsToUnion == '1'" justify="center">
        <v-card class="cc-top-level-card eceweCard">
          <v-container>
            <v-row justify="center" >
              <v-col style="padding-bottom:0px;margin-bottom:0px;">
                Select the applicable funding model:
              </v-col>
            </v-row>
            <v-radio-group
                v-model="q3FundingModel"
                row>
            <v-row justify="center">
              <v-col class="pt-2">
                <v-radio
                  label="All of our facilities have provincially funded ECEs and receive Low-Wage Redress Funding"
                  value="100000000"
                  @click="showNextSaveBtns()"
                  ></v-radio>
              </v-col>
            </v-row>
            <v-card v-if="q3FundingModel == '100000000'" width="100%">
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
                  value="100000001"
                  @click="showNextSaveBtns()"
                ></v-radio>
              </v-col>
            </v-row>
            <v-card v-if="q3FundingModel == '100000001'" width="100%">
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
                  value="100000002"
                  @click="showNextSaveBtns()"
                ></v-radio>
              </v-col>
            </v-row>
            <v-card v-if="q3FundingModel == '100000002'" width="100%">
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

      <v-row justify="space-around">
        <v-btn color="info" outlined required x-large @click="previous()">Back</v-btn>
        <v-btn v-show="q2BelongsToUnion" color="secondary" outlined x-large @click="next()">Next</v-btn>
        <v-btn v-show="q2BelongsToUnion" color="primary" outlined x-large @click="save()">Save</v-btn>
      </v-row>

    </v-container>
  </template>
  
<script>
  
import { PATHS } from '@/utils/constants';
import { mapGetters, mapState, mapActions, mapMutations } from 'vuex';
import alertMixin from '@/mixins/alertMixin';

export default {
  mixins: [alertMixin],
  data() {
    return {
      showNextBtn: false,
      showSaveBtn: false,
      row: ''
    };
  },
  computed: {
    ...mapGetters('auth', ['userInfo']),
    ...mapState('eceweApp', ['isStarted']),
    applicationId: {
      get() { return this.$store.state.eceweApp.applicationId; },
      set(value) { this.$store.commit('eceweApp/setApplicationId', value); }
    },
    q1OptInECEWE: {
      get() { return this.$store.state.eceweApp.q1OptInECEWE; },
      set(value) { this.$store.commit('eceweApp/setQ1OptInECEWE', value); }
    },
    q2BelongsToUnion: {
      get() { return this.$store.state.eceweApp.q2BelongsToUnion; },
      set(value) { this.$store.commit('eceweApp/setQ2BelongsToUnion', value); }
    },
    q3FundingModel: {
      get() { return this.$store.state.eceweApp.q3FundingModel; },
      set(value) { this.$store.commit('eceweApp/setQ3FundingModel', value); }
    },
    facilities: {
      get() { return this.$store.state.eceweApp.facilities; },
      set(value) { this.$store.commit('eceweApp/setFacilities', value); }
    },
    isValidForm: { 
      get () { return this.$store.state.organization.isValidForm; }, 
      set (value) { this.$store.commit('organization/setIsValidForm', value); }
    }
  },
  mounted() {
    //TODO get id from userInfo...
    this.applicationId = '7bef232f-3a6f-ed11-81ac-000d3af4ff05'; //this.userInfo.applicationId;
    this.loadData();
  },
  methods: {
    ...mapActions('eceweApp', ['loadEceweApp', 'saveApplication']),
    ...mapMutations('eceweApp', ['setIsStarted']),
    async loadData() {
      if (this.isStarted) {
        return;
      }
      if (this.applicationId) {
        this.processing = true;
        try {
          await this.loadEceweApp(this.applicationId);
        } catch (error) {
          console.log('Error loading ECEWE application.', error);
          this.setFailureAlert('Error loading ECEWE application.');
        }
        this.processing = false;
        this.setIsStarted(true);
      }
    },
    next() {
      this.$router.push(PATHS.eceweFacilities);
    },
    async save() {
      try {
        await this.saveApplication();
        this.setSuccessAlert('Success! ECEWE appcliation has been saved.');
      } catch (error) {
        this.setFailureAlert('An error occurred while saving ECEWE application. Please try again later.'+error);
      }
      this.processing = false;
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
    },
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
  font-family:'BCSans',Verdana,Arial,sans-serif;
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
  font-family:'BCSans',Verdana,Arial,sans-serif;
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
  font-family:'BCSans',Verdana,Arial,sans-serif;
  padding-top:8px;
  padding-bottom:8px;
  background-color:#C1DCF6;
  border:1px solid #313132;
}

</style>
