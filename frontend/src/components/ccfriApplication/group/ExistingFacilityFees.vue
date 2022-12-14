<template>
  <v-container>
    <v-form ref="isValidForm" value="false" v-model="isValidForm">

      <v-skeleton-loader max-height="475px" v-if="loading" :loading="loading" type="image, image, image"></v-skeleton-loader>
      <v-card elevation="6" class="pa-4 mx-auto my-10 rounded-lg col-12 "
          min-height="230"
          rounded
          tiled
          exact tile
          :ripple="false"
          >
            <v-card-text>
              <p class="text-h5 text--primary text-center">
                {{currentFacility.facilityName}}
              </p>
              <p class="text-h6 text--primary text-center">
                Our Records show this facilites' fees for {{feeList[0].programYear}} are: 
              </p>
              <!-- <p>
                Lorem ipsum dolor sit
              </p> -->
              <br>
              <v-simple-table>
                <thead>
                  <tr>
                    <th  scope="col" class="text-left">
                      Date
                    </th>
                    <th  v-for="item in feeList"
                    :key="item.childCareCategoryId"
                     class="text-center"
                     scope="col">
                      {{item.childCareCategory}}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td >January </td>
                    <td v-for="item in feeList"
                    :key="item.childCareCategoryId"
                     class="text-center">${{ item.approvedFeeJan }}</td>
                  </tr>
                  <tr>
                    <td >February </td>
                    <td v-for="item in feeList"
                    :key="item.childCareCategoryId"
                     class="text-center">${{ item.approvedFeeFeb }}</td>
                  </tr>
                  <tr>
                    <td >March </td>
                    <td v-for="item in feeList"
                    :key="item.childCareCategoryId"
                     class="text-center">${{ item.approvedFeeMar }}</td>
                  </tr>
                  <tr>
                    <td >April </td>
                    <td v-for="item in feeList"
                    :key="item.childCareCategoryId"
                     class="text-center">${{ item.approvedFeeApr }}</td>
                  </tr>
                  
                </tbody>
              </v-simple-table>
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

          <v-row justify="space-around">
          <v-btn color="info" outlined x-large @click="previous()">
            Back</v-btn>
            <!--add form logic here to disable/enable button-->
          <v-btn color="secondary" outlined x-large @click="next()" :disabled="!isValidForm">Next</v-btn>
          <v-btn color="primary" outlined x-large @click="updateCCFRI()">
            Save</v-btn>
        </v-row>
      </v-form>
  </v-container>
  
</template>

<script>
import { PATHS } from '@/utils/constants';
import { mapGetters, mapState, mapActions} from 'vuex';
import alertMixin from '@/mixins/alertMixin';

let model = { x: [],  };

export default {
  mixins: [alertMixin],
  data() {
    return {
      input : '',
      loading: true,
      model,
      isValidForm : false,
      feeList : [],
      rules: [
        (v) => !!v  || 'Required.',
      ],
    };
  },
  computed: {
    ...mapState('app', ['navBarList']),
    ...mapState('ccfriApp', ['CCFRIFacilityModel']),
    ...mapState('organization', ['applicationId']),
    
    findIndexOfFacility(){
      let activeFac = this.navBarList.findIndex((element) =>{ 
        return element.ccfriApplicationId == this.$route.params.urlGuid;
      });
      //console.log('activeFac', activeFac);
      return activeFac;
    },
    currentFacility(){
      return this.navBarList[this.findIndexOfFacility];
    },
    nextFacility(){
      return this.navBarList[this.findIndexOfFacility + 1];
    }
    
  },
  watch: {
    //get facilityID from here and then set it ! 
    '$route.params.urlGuid': {
      async handler() {
        console.log('ccfriFacilityGuid', this.$route.params.urlGuid);
        try {
          await this.loadCCFRIFacility(this.$route.params.urlGuid); 
          //this.setSuccessAlert('Success! CCFRI Parent fees have been saved.');

          //quick assumption that there will always be at least 2 child care types. TODO: add more logic to ensure a safe index
          //also perhaps we should get most recent fees (most recent program year) instead of just the first two in the array?
          const concatChildCareTypes = [this.CCFRIFacilityModel.childCareTypes[0], this.CCFRIFacilityModel.childCareTypes[1]];

          this.feeList.push(...concatChildCareTypes);
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
  methods: {
    ...mapActions('ccfriApp', ['loadCCFRIFacility']),  
    previous(){
      console.log(this.feeList);
      //this.$router.push(PATHS.ccfriHome);
    },
    next() {
      console.log(this.nextFacility);

      if (this.nextFacility){
        //TODO: this needs to check if opt in exists
        console.log('going to next fac');
      }
      else {
        console.log('going to ece-we!');
        this.$router.push({path : `${PATHS.eceweEligibility}/${this.applicationId}`});
      }
      //this.$router.push({path : `${PATHS.addNewFees}/${this.$route.params.urlGuid}`});
      //this.$router.push(PATHS.addNewFees); //TODO: change this, from CCOF page
    },
  },
};


</script>
