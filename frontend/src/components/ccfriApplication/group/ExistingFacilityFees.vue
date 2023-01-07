<template>
  <v-container>
    <v-form ref="isValidForm" value="false" v-model="isValidForm">

      <v-skeleton-loader max-height="475px" v-if="loading" :loading="loading" type="image, image, image"></v-skeleton-loader>

      <v-card v-else elevation="6" class="pa-4 mx-auto my-10 rounded-lg col-12 "
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
              <!--get current year from CCOF year id -NOT first in array-->
              <p class="text-h6 text--primary text-center">
                Our Records show this facilites' fees for {{feeList[0].programYear}} are as follows: 
              </p>
              <br>
              <v-simple-table>
                <thead>
                  <tr>
                    <th  scope="col" class="text-left">
                      Date
                    </th>
                    <th  v-for="(item , index)  in feeList"
                    :key="index"
                     class="text-center"
                     scope="col">
                      {{item.childCareCategory}}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td >January </td>
                    <td v-for="(item , index) in feeList"
                    :key="index"
                     class="text-center">${{ item.approvedFeeJan }}</td>
                  </tr>
                  <tr>
                    <td >February </td>
                    <td v-for="(item , index) in feeList"
                    :key="index"
                     class="text-center">${{ item.approvedFeeFeb }}</td>
                  </tr>
                  <tr>
                    <td >March </td>
                    <td v-for="(item , index)  in feeList"
                    :key="index"
                     class="text-center">${{ item.approvedFeeMar }}</td>
                  </tr>
                  <tr>
                    <td >April </td>
                    <td v-for="(item , index)  in feeList"
                    :key="index"
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

//userInfo.ccofProgramYearId;
import { PATHS } from '@/utils/constants';
import { mapState, mapActions} from 'vuex';
import alertMixin from '@/mixins/alertMixin';

let model = { x: [],  };

export default {
  mixins: [alertMixin],
  data() {
    return {
      prevFees: {},
      input : '',
      loading: true,
      model,
      isValidForm : false,
      feeList : [
      ],
      rules: [
        (v) => !!v  || 'Required.',
      ],
    };
  },
  computed: {
    ...mapGetters('auth', ['userInfo']),
    ...mapState('app', ['navBarList', 'programYearList']),
    ...mapState('ccfriApp', ['CCFRIFacilityModel']),
    ...mapState('organization', ['applicationId']),
    
    findIndexOfFacility(){
      let activeFac = this.navBarList.findIndex((element) =>{ 
        return element.ccfriApplicationId == this.$route.params.urlGuid;
      });
      
      return activeFac;
    },
    currentFacility(){
      return this.navBarList[this.findIndexOfFacility];
    },
    nextFacility(){
      return this.navBarList[this.findIndexOfFacility + 1];
    },
    getPrevYearGuid(){
      const programYear = this.programYearList.list.find(({ programYearId }) =>  programYearId == this.userInfo.ccofProgramYearId );
      console.log(programYear);

      return programYear.previousYearId;
      //let currentYearGuid = //;
    }
    
  },
  watch: {
    //get facilityID from here and then set it ! 
    '$route.params.urlGuid': {
      async handler() {
        try {
          await this.loadCCFRIFacility(this.$route.params.urlGuid); 
          //this.setSuccessAlert('Success! CCFRI Parent fees have been saved.');

          await this.loadCCFRIFacility(this.CCFRIFacilityModel.previousCcfriId); //load this page up with the previous CCFRI data 

          this.feeList = [];

          //only display last years child care fees
          const prevYearGuid = this.getPrevYearGuid;
          this.CCFRIFacilityModel.childCareTypes.forEach(item => { 
            if (item.programYearId == prevYearGuid ){
              this.feeList.push(item);
            }
          });

          console.log(this.feeList);


          //will have to only display the previous years fee - some logic will have to be done here for that
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
      this.$router.back(); 
    },
    async setFees (areFeesCorrect){
      await this.loadCCFRIFacility(this.$route.params.urlGuid); 
      this.CCFRIFacilityModel.prevYearFeesCorrect = areFeesCorrect;
      //grab the previous years fees and save it to the store - so then AddNewFees will have this data ready to go 
    },
    next() {
      this.loading = true;

      if (this.model.q1== 'No'){
        this.setFees(false);
      }
      else if (this.model.q1== 'Yes') {
        this.setFees(true);
      }
      this.$router.push({path : `${PATHS.addNewFees}/${this.$route.params.urlGuid}`});
      
      //this.$router.push({path : `${PATHS.addNewFees}/${this.$route.params.urlGuid}`});
      
    },
  },
};


</script>
