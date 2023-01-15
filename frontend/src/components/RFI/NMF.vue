<template>
  <v-container>
    <v-row justify="center" class="mt-6">
      <h3>Request for Information</h3>
    </v-row>
    <v-row justify="center" class="mt-6">
      <h3>{{ currentFacility.facilityName }}</h3>
    </v-row>
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
          <span class="text-h5 text--primary px-2 px-md-8">
            New Facilities
          </span>
        </v-card>
        <div class="px-md-12 pa-7">
          <p class="text-h6 text--primary my-0">
            1. Did your facility receive space creation funding prior to April 1, 2021?
          </p>
          <v-radio-group
            required
            row
            v-model="model.supportNeeds"
            label=""
            :disabled="isReadOnly"
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
            <div class="">
              <br>
              <v-textarea
                outlined
                name="input-7-4"
                label="Describe here"
                v-model="model.supportNeedsComments"
                :disabled="isReadOnly"
              ></v-textarea>
            </div>
          </div>
        </div>
        <div class="px-md-12 pa-7">
          <p class="text-h6 text--primary my-0">
            2. Does your facility provide additional services (such as meals or other wrap-around services), to support families 
            experiencing vulnerability and/or underserved populations, such as Indigenous or low-income families?
          </p>
          <v-radio-group
            required
            row
            v-model="model.lowIncomeFamilies"
            label=""
            :disabled="isReadOnly"
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
          <div v-if="model.lowIncomeFamilies === 'Yes'">
            <div class="">
              <br>
              <v-textarea
                outlined
                name="input-7-4"
                label="Describe here"
                v-model="model.lowIncomeFamiliesComments"
                :disabled="isReadOnly"
              ></v-textarea>
            </div>
          </div>
        </div>
        <div class="px-md-12 pa-7">
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
          <div v-if="model.remoteCommunities === 'Yes'">
            <div class="">
              <br>
              <v-textarea
                outlined
                name="input-7-4"
                label="Describe here"
                v-model="model.remoteCommunitiesComments"
                :disabled="isReadOnly"
              ></v-textarea>
            </div>
          </div>
        </div>

        <div class="px-md-12 pa-7">
          <div>
            <p class="text-h6 text--primary my-0">
              4. Please tell us anything else you’d like us to know about how your facility’s business case supports setting fees higher than the   
              Affordability Benchmarks outlined in the 2023/24 Funding Guidelines. 
            </p>
        
            <div class="">
              <br>
              <v-textarea
                outlined
                name="input-7-4"
                label="Describe here"
                v-model="model.otherComments"
                :disabled="isReadOnly"
              ></v-textarea>
            </div>
          </div>
        </div>
      </v-card-text>
    </v-card>
    <v-row justify="space-around">
      <v-btn color="info" outlined x-large :loading="isProcessing" @click="previous()">
        Back</v-btn>
        <!--add form logic here to disable/enable button-->
      <v-btn color="secondary" outlined x-large @click="next()" :disabled="false" :loading="isProcessing">Next</v-btn>
      <v-btn color="primary" outlined x-large @click="save(true)" :loading="isProcessing"> 
        Save</v-btn>
    </v-row>

  </v-container>
</template>

<script>

import alertMixin from '@/mixins/alertMixin';
import { mapActions, mapState, mapMutations } from 'vuex';
import { convertHTMLToPlain } from '@/utils/common';

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
        this.model.supportNeedsComments = convertHTMLToPlain(this.model.supportNeedsComments);
        this.model.lowIncomeFamiliesComments = convertHTMLToPlain(this.model.lowIncomeFamiliesComments);
        this.model.remoteCommunitiesComments = convertHTMLToPlain(this.model.remoteCommunitiesComments);
        this.model.otherComments = convertHTMLToPlain(this.model.otherComments);
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

</style>

