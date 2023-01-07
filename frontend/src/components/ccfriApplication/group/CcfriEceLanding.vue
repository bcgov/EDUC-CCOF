<template>
    <v-container>
        
      <v-btn
        class = "my-10 mx-14 justify-end"
        @click="toggleAll()"
        dark color='#003366' 
        > 
        Opt-in All Facilities
      </v-btn>
        <LargeButtonContainer>

          <v-form ref="isValidForm" value="false" v-model="isValidForm">

          <!-- <v-skeleton-loader max-height="475px" v-if="!facilityList" :loading="loading"  type="image, image, image"></v-skeleton-loader> -->
          
          <v-card elevation="4" class="py-2 px-5 mx-2 my-10 rounded-lg col-12"
            rounded
            tiled
            exact tile
            :ripple="false"
            v-for="({facilityName, facilityId, ccfriStatus, eceweStatus, ccfriOptInStatus } , index) in navBarList" :key="facilityId">
            <v-card-text>
              <v-row>
                <v-col cols="" class="col-12 col-md-8">
                  <p class="text--primary"> Facility ID: {{facilityId}}</p>
                  <p class="text--primary "><strong> Facility Name : {{facilityName}}</strong></p>
                  <!-- <p class="text--primary"> Licence : 123456789</p>  add back in when license number is in userProfile-->
                  <strong> <p class="text--primary  " >Opt-In:  {{ccfriOptInStatus == "IN" ? "IN"  :  ccfriOptInStatus == "1" ? "IN" :  ccfriOptInStatus == "0" ?"OUT" :  "NOT SELECTED" }} </p> </strong>
                </v-col>
                <v-col cols="" class="d-flex align-center col-12 col-md-4"
                  v-if="!showOptStatus[index]"
                >
                  
                  <v-btn
                  class = "my-10 mx-14 justify-end"
                  @click="toggle(index)"
                  :showOptStatus = "showOptStatus[index]"
                  dark color='#003366' 
                  :rules = "rules"
                  > 
                    UPDATE
                  </v-btn>
                </v-col>
                <v-col v-else cols="" class="d-flex align-center col-12 col-md-4  "
                >
                  <v-row>
                    <v-radio-group
                      v-model="ccfriOptInOrOut[index]"
                      class = "mx-12"
                      :rules = "rules"
                    >
                      <v-radio
                        label="Opt-In"
                        value="1"
                        
                      ></v-radio>
                      <v-radio
                        label="Opt-Out"
                        value="0"
                        
                      ></v-radio>
                    </v-radio-group>
                  </v-row>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-form>
        

        </LargeButtonContainer>
      
        <v-row justify="space-around">
          <v-btn color="info" outlined x-large @click="previous()">
            Back</v-btn>
            <!--add form logic here to disable/enable button-->
          <v-btn color="secondary" outlined x-large @click="next()" :disabled="(!isPageComplete() )">Next</v-btn>
          <v-btn color="primary" outlined x-large :loading="processing" @click="save()">
            Save</v-btn>
        </v-row>

    </v-container>
</template>

<script>


import { mapGetters, mapState, mapMutations, mapActions} from 'vuex';
import LargeButtonContainer from '../../guiComponents/LargeButtonContainer.vue';
import { PATHS } from '@/utils/constants';
import ApiService from '@/common/apiService';
import alertMixin from '@/mixins/alertMixin';

let ccfriOptInOrOut = {};
let textInput = '' ;
let model = { x: [], ccfriOptInOrOut, textInput };

export default {
  name: 'CcfriLandingPage',
  mixins: [alertMixin],
  data() {
    return {
      input : '',
      model,
      //textInput,
      showOptStatus : '',
      isValidForm: false,
      processing: false,
      loading: false,
      ccfriOptInOrOut,
      rules: [
        (v) => !!v  || 'Required.',
      ],
    };
  },
  computed: {
    ...mapGetters('auth', ['userInfo']),
    ...mapState('app', ['navBarList', 'isRenewal', 'ccfriOptInComplete']),
    ...mapState('organization', ['applicationId']),
  },
  beforeMount: function() {
    try {
      this.getUserInfo();
    }catch (e){
      console.log(e);
    }
    this.showOptStatus = new Array(this.navBarList.length).fill(false);
  },
  methods: {
    ...mapMutations('app', ['setCcfriOptInComplete', 'refreshNavBar']), 
    ...mapActions('auth', ['getUserInfo']),
    toggle(index) {
      this.$set(this.showOptStatus, index, true);
    },
    toggleAll(){
      this.navBarList.forEach((fac, index) => {
        this.toggle(index);
        this.$set(this.ccfriOptInOrOut, index, '1');
      });
    },
    previous() {
      //this.isPageComplete();
      this.$router.back();
    },
    //checks to ensure each facility has a CCFRI application started before allowing the user to proceed.
    isPageComplete(){
      const allFacilitiesComplete = this.navBarList.every((fac) => {
        return (fac.ccfriApplicationId);
      });
      if (!allFacilitiesComplete){
        return allFacilitiesComplete;
      }
      return this.isValidForm;
    },
    next() {
      this.save();
      
      
      let firstOptInFacility = this.navBarList.find(({ ccfriOptInStatus }) =>  ccfriOptInStatus == 1 );


      //if all facilites are opt OUT, go to ECE WE
      if(!firstOptInFacility){
        this.$router.push({path : `${PATHS.eceweEligibility}`});
      }

      //if CCFRI is being renewed, go to page that displays fees
      else if (this.isRenewal){
        this.$router.push({path : `${PATHS.currentFees}/${firstOptInFacility.ccfriApplicationId}`});
      }
      // else go directly to addNewFees page
      else { 
        this.$router.push({path : `${PATHS.addNewFees}/${firstOptInFacility.ccfriApplicationId}`});
      }

    },
       
    async save () {
      this.processing = true;
      let payload = [];

      for (let i = 0; i < this.navBarList.length; i++) {
        //change this to only send payloads with value chosen --- don't send undefined 

        if (!ccfriOptInOrOut[i]){
          continue;
        }
        this.navBarList[i].ccfriOptInStatus = this.ccfriOptInOrOut[i];

        payload.push( {
          applicationID : this.applicationId, //CCOF BASE application ID
          facilityID : this.navBarList[i].facilityId, 
          optInResponse: this.ccfriOptInOrOut[i],
          ccfriApplicationId: this.navBarList[i].ccfriApplicationId
        });

       
      }//end for loop

      try {
        const response = await ApiService.apiAxios.patch('/api/application/ccfri/', payload);
       
        response.data.forEach(item => {
          if (item.ccfriApplicationId) {
            this.navBarList.find(facility => {
              if (facility.facilityId == item.facilityId) {
                facility.ccfriApplicationId = item.ccfriApplicationId;
              }
            });
          }
        });
        this.refreshNavBar();
        this.setSuccessAlert('Success! CCFRI Opt-In status has been saved.');
      } catch (error) {
        console.info(error);
        this.setFailureAlert('An error occurred while saving. Please try again later.');
      }
      this.processing = false;
    },
    
  },
  mounted() {
    this.model = this.$store.state.ccfriApp.model ?? model;
  },
  beforeRouteLeave(_to, _from, next) {
    this.$store.commit('ccfriApp/model', this.model);
    next();
  },
  components: {LargeButtonContainer }
};
</script>

