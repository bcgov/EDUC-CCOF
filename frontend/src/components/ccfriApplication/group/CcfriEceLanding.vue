<template>
    <v-container>
        <!--TODO: Right now there is no logic to pull current facility fees. This just brings you directly to opt in or out, which then brings you to fill in all fees.
          this will need to get changed at a later point when the API is more built out 
          there is also no logic about if you can click next or not 
        -->

        <!-- <ExistingFacilityFees></ExistingFacilityFees> -->

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
                  <!-- <p class="text--primary"> Licence : 123456789</p> -->
                  <p class="text--primary " min-width="250px" >Status: {{ccfriStatus}}</p>
                  <strong> <p class="text--primary  " >Opt-In:  {{ccfriOptInStatus == 0 ? "OUT" : "IN"}}</p> </strong>
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
        
        <!-- {{ccfriOptInOrOut}} -->

        </LargeButtonContainer>
      
        <v-row justify="space-around">
          <v-btn color="info" outlined x-large @click="previous()">
            Back</v-btn>
            <!--add form logic here to disable/enable button-->
          <v-btn color="secondary" outlined x-large @click="next()" :disabled="!isValidForm">Next</v-btn>
          <v-btn color="primary" outlined x-large :loading="processing" @click="save()">
            Save</v-btn>
        </v-row>

        <!-- {{loading}} -->
    </v-container>
</template>

<script>


import { mapGetters, mapState} from 'vuex';
import MessagesToolbar from '../../guiComponents/MessagesToolbar.vue';
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
      feeList : [ //dummy data for showing the 'current fees' page. TO be replaced with data loaded from Dynamics 
        {
          date: 'Jan 2022',
          pre3year: 1234,
          post3year: 2222
        },
        {
          date: 'Feb 2022',
          pre3year: 5555,
          post3year: 8811
        },
        {
          date: 'Mar 2022',
          pre3year: 6754,
          post3year: 8223
        }
      ],
      rules: [
        (v) => !!v  || 'Required.',
      ],
    };
  },
  computed: {
    ...mapGetters('auth', ['userInfo']),
    ...mapState('app', ['navBarList']),
  },
  beforeMount: function() {
    this.showOptStatus = new Array(this.navBarList.length).fill(false);
  },
  methods: {
    toggle(index) {
      this.$set(this.showOptStatus, index, true);
    },
    previous() {
      this.$router.push(PATHS.home); //TODO: change this, from CCOF page
    },
    next() {
      this.updateCCFRI();
      const ccfriComplete = this.navBarList.every((fac, index) => {
        return (fac.ccfriStatus == 'APPROVED'); //TODO: change this! leaving here for the demo
        //hoping to use this logic to see if the user needs goes to the page that displays current fees, or straight to the 'addnewfee page'
      });

      //console.log(ccfriComplete);

      //if no status- go straight to add new fees page
      if (ccfriComplete){
        this.$router.push(PATHS.currentFees); 
      }
      else {
        this.$router.push(PATHS.addNewFees); 
      }
    },
    refreshWithFacility() {
      let x = this.$route.params.urlGuid;
      this.loadFacility(x);
    },
    async save () {
      this.processing = true;
      let payload = [];

      this.navBarList.forEach (async (facility, index) => {

        facility.ccfriOptInStatus = ccfriOptInOrOut[index];

        payload[index] = {
          applicationID : this.userInfo.applicationId, //CCOF BASE application ID
          facilityID : facility.facilityId, 
          optInResponse: this.ccfriOptInOrOut[index] 
        };

        payload = JSON.parse(JSON.stringify(payload));

      });
      try {
        const response = await ApiService.apiAxios.patch('/api/application/ccfri/', payload);
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
    
    // if (facilityList){
    //   this.loading = false;
    // }
    // else {
    //   this.loading = true;
    // }
  },
  beforeRouteLeave(_to, _from, next) {
    this.$store.commit('ccfriApp/model', this.model);
    next();
  },
  components: { MessagesToolbar, LargeButtonContainer }
};
</script>

