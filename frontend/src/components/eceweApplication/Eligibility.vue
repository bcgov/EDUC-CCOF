<template>
    <v-container>
      <v-row justify="center" class="pt-4">
        <span class="text-h5">Early Childhood Educator-Wage Enhancement (ECE-WE)</span>
      </v-row>
      <v-row justify="center" class="pt-4 text-h5" style="color:#003466;">
        {{this.userInfo.organizationName}}
      </v-row>
      <v-row justify="center">
        <v-card elevation="4" class="py-2 px-5 mx-2 mt-10 rounded-lg col-11">
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
      
      <v-row v-if="(q1OptInECEWE == 1)" justify="center">
        <v-card elevation="4" class="py-2 px-5 mx-2 mt-10 rounded-lg col-11">
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

      <v-row v-if="(q2BelongsToUnion == 1 && q1OptInECEWE == 1)" justify="center">
        <v-card elevation="4" class="py-2 px-5 mx-2 mt-10 rounded-lg col-11">
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
                  <v-card-title class="py-1 noticeAlert">
                    <span style="float:left">
                  <v-icon
                    x-large
                    class="py-1 px-3 noticeAlertIcon">
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
                  <v-card-title class="py-1 noticeWarning">
                    <span style="float:left">
                  <v-icon
                    x-large
                    class="py-1 px-3 noticeWarningIcon">
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
                  <v-card-title class="py-1 noticeInfo">
                    <span style="float:left">
                  <v-icon
                    x-large
                    color="#D40D19"
                    class="py-1 px-3 noticeInfoIcon">
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

      <v-row justify="space-around" class="mt-10">
        <v-btn color="info" outlined required x-large @click="previous()">Back</v-btn>
        <v-btn v-show="q2BelongsToUnion" :disabled="!this.q1OptInECEWE" color="secondary" outlined x-large @click="next()">Next</v-btn>
        <v-btn v-show="q2BelongsToUnion" :disabled="!this.q1OptInECEWE" color="primary" outlined x-large @click="save()">Save</v-btn>
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
      row: '' //TODO: do we need this?
    };
  },
  computed: {
    ...mapGetters('auth', ['userInfo']),
    ...mapState('eceweApp', ['isStarted']),
    ...mapState('app', ['navBarList']),
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
  beforeMount() {
    this.loadData().then(() => this.initECEWEFacilities(this.navBarList));

  },
  methods: {
    ...mapActions('eceweApp', ['loadECEWE', 'saveECEWE', 'initECEWEFacilities']),
    ...mapMutations('eceweApp', ['setIsStarted']),
    async loadData() {
      if (this.isStarted) {
        return;
      }
      if (this.userInfo.applicationId) {
        this.processing = true;
        try {
          await this.loadECEWE(this.userInfo.applicationId);
        } catch (error) {
          console.log('Error loading ECEWE application.', error);
          this.setFailureAlert('Error loading ECEWE application.');
        }
        this.processing = false;
        this.setIsStarted(true);
      }
    },
    next() {
      if (this.q1OptInECEWE == 0) {
        this.$router.push(PATHS.eceweDocUpload);
      } else {
        this.$router.push(PATHS.eceweFacilities);
      }

    },
    async save() {
      try {
        this.q2BelongsToUnion = (this.q1OptInECEWE==0)?null:this.q2BelongsToUnion;
        this.q3FundingModel = (this.q2BelongsToUnion==0)?null:this.q3FundingModel;
        await this.saveECEWE();
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
//TODO: add the styles here, prefix ECEWE on filenames
<style>
</style>
