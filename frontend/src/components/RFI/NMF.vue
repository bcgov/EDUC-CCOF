<template>
  <v-container>
    <div class="text-center my-10 px-6">
      <p class="text-h5 font-weight-bold">New, New-to CCFRI, and Modified Facilities Information</p>
      <span class="text-h5 font-weight-bold blueText" v-if="currentFacility.facilityAccountNumber">Facility ID: {{currentFacility.facilityAccountNumber}}, </span>
      <span class="text-h5 font-weight-bold blueText" v-if="currentFacility.facilityName">Facility Name: {{currentFacility.facilityName}}, </span>
      <span class="text-h5 font-weight-bold blueText" v-if="currentFacility.licenseNumber">Licence Number: {{currentFacility.licenseNumber}}</span>
    </div>
    <div>
      <p>
        As outlined in the Funding Guidelines, applications by New, New-to-CCFRI, and Modified Facilities will be assessed based on whether the facility’s parent fees are comparable to others in their region.
      </p>
      <p>
        To determine if this policy applies to your facility, please provide more information.
      </p>
    </div>
    <v-card v-if="isLoading" class="pl-6 pr-6 pt-4">
      <v-skeleton-loader :loading="true" type="button"></v-skeleton-loader>
      <v-skeleton-loader max-height="375px" :loading="true" type="table-row-divider@3"></v-skeleton-loader>
    </v-card>
    <v-card elevation="6" class="pa-0 my-10 rounded-lg col-12"
      min-height="230"
      v-else
    >
      <v-card-text class="pa-0" >
        <v-card class="pa-4 pa-md-4 ma-0 backG rounded-lg rounded-b-0 elevation-0">
          <span class="text-h5 px-2 px-md-8 font-weight-bold blueText">
            New Facilities
          </span>
        </v-card>
        <div class="px-md-12 px-7 py-10">
          <p class="text-h6 text--primary my-0">
            1.	Did you apply for Ministry funding to create new licensed spaces prior to April 1, 2021 
            (e.g. New Spaces Fund, UBCM Community Child Care Space Creation Program, Start-up Grants, Rapid Renovation Funding)?
          </p>
          <v-radio-group
            required
            row
            v-model="model.supportNeeds"
            label=""
            :disabled="isReadOnly"
            :rules="rules"
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
          <div v-if="model.supportNeeds === 'Yes'">
            <div class="text-h6 text--primary pt-2">
              <p>
                Please enter your Project ID, Funding Program, and Application Date. 
                If you are not sure what your Project ID is, call Child Care Capital and Community Services at 1-888-338-6622 (Option 5).
              </p>
              <v-textarea
                required outlined
                name="input-7-4"
                label="Enter your Project ID, Funding Program, and Application Date."
                v-model="model.supportNeedsComments"
                :disabled="isReadOnly"
                :rules="rules"
              ></v-textarea>
            </div>
          </div>
        </div>
        <div class="px-md-12 px-7 pb-10">
          <p class="text-h6 text--primary my-0">
            2.	Does your facility provide additional services (such as meals or other wrap-around services),  
            to support families experiencing vulnerability and/or underserved populations, such as Indigenous or low-income families?
          </p>
          <v-radio-group
            required
            row
            v-model="model.lowIncomeFamilies"
            label=""
            :disabled="isReadOnly"
            :rules="rules"
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
          <div class="text-h6 text--primary pt-2" v-if="model.lowIncomeFamilies === 'Yes'">
            <p>
              Please describe the service(s) and associated expenses.
            </p>
            <v-textarea
              required outlined
              name="input-7-4"
              label="Describe the service(s) and associated expenses"
              v-model="model.lowIncomeFamiliesComments"
              :disabled="isReadOnly"
              :rules="rules"
            ></v-textarea>
          </div>
        </div>
        <div class="px-md-12 px-7 pb-10">
          <p class="text-h6 text--primary my-0">
            3. Do you provide transportation to/from your facility to support families in rural or remote communities 
            who may not otherwise be able to access child care?
          </p>
          <v-radio-group
            required
            row
            v-model="model.remoteCommunities"
            label=""
            :disabled="isReadOnly"
            :rules="rules"
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
          <div class="text-h6 text--primary pt-2" v-if="model.remoteCommunities === 'Yes'">
            <p>
              Please describe the service(s) and associated expenses.
            </p>
            <v-textarea
              required outlined
              name="input-7-4"
              label="Describe the service(s) and associated expenses"
              v-model="model.remoteCommunitiesComments"
              :disabled="isReadOnly"
              :rules="rules"
            ></v-textarea>
          </div>
        </div>

        <div class="px-md-12 px-7 pb-10">
          <p class="text-h6 text--primary my-0">
            4. Please tell us anything else you’d like us to know about how your facility’s business case 
            supports setting fees higher than the Affordability Benchmarks outlined in the 2023/24 Funding Guidelines.
          </p>
          <div class="pt-6">
            <v-textarea
              outlined
              name="input-7-4"
              label="Describe here"
              v-model="model.otherComments"
              :disabled="isReadOnly"
            ></v-textarea>
          </div>
        </div>
      </v-card-text>
    </v-card>
    <v-row justify="space-around">
      <v-btn color="info" outlined x-large :loading="isProcessing" @click="previous()">
        Back
      </v-btn>
        <!--add form logic here to disable/enable button-->
      <v-btn color="secondary" outlined x-large @click="next()" :loading="isProcessing">
        Next
      </v-btn>
      <v-btn color="primary" outlined x-large @click="save(true)" :disabled="isReadOnly" :loading="isProcessing"> 
        Save
      </v-btn>
    </v-row>

  </v-container>
</template>

<script>

import alertMixin from '@/mixins/alertMixin';
import { mapActions, mapState, mapMutations } from 'vuex';

let model = { x: [],  };

export default {
  name: 'CcfriRequestMoreInfo',
  mixins: [alertMixin],
  data() {
    return {
      model,
      rules: [
        (v) => !!v  || 'Required.',
      ],
      isLoading: true,
      isProcessing: false,
    };
  },
  mounted() {
    this.model = this.$store.state.ccfriApp.model ?? model;
  },
  beforeRouteLeave(_to, _from, next) {
    this.$store.commit('ccfriApp/model', this.model); 
    next();
  },
  computed: {
    ...mapState('nmfApp', ['nmfModel']),
    ...mapState('app', ['navBarList']),
    findIndexOfFacility(){
      return this.navBarList.findIndex((element) => { 
        return element.ccfriApplicationId == this.$route.params.urlGuid;
      });
    },
    currentFacility(){
      return this.navBarList[this.findIndexOfFacility];
    },
    isReadOnly(){
      return (!this.currentFacility.unlockNmf);
    },
  },
  watch: {
    '$route.params.urlGuid': {
      async handler() {
        let ccfriId = this.$route.params.urlGuid;
        console.log('ccfriId = ',ccfriId);
        await this.loadNmf(ccfriId);
        this.isLoading = false;
      },
      immediate: true,
      deep: true
    },
    nmfModel: {
      handler() {
        this.model = { ...this.nmfModel };
        this.$refs.form?.resetValidation();
      },
      immediate: true,
      deep: true
    }
  },  
  methods : {
    ...mapMutations('nmfApp', ['setNmfModel']),
    ...mapActions('nmfApp', ['loadNmf', 'saveNmf']),
    next(){
      // go to next facility
      // no facility go to ECEWE.
      // if (this.navBarList && this.navBarList.length > 0) {
      //   this.$router.push(`${this.isGroup() ? PATHS.group.facInfo : PATHS.family.eligibility}/${this.navBarList[0].facilityId}`);
      // } else {
      //   this.$router.push(`${this.isGroup() ? PATHS.group.facInfo : PATHS.family.eligibility}`);
      // }
    },
    previous() {
      this.$router.back();
    },
    async save(showNotification) {
      this.isProcessing = true;
      try {
        this.setNmfModel(this.model);
        let ccfriId = this.$route.params.urlGuid;
        await this.saveNmf(ccfriId);
        if (showNotification) {
          this.setSuccessAlert('Success! New facility information has been saved.');
        }
      } catch (error) {
        this.setFailureAlert('An error occurred while saving. Please try again later.');
      }
      this.isProcessing = false;
    }
  },
  components: { }
};


</script>


<style scoped>

.backG{
  background-color: lightgray;
}

.blueText {
  color: rgb(0, 52, 102);
}
</style>

