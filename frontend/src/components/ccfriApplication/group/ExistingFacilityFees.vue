<template>
  <v-container>

    <div class="row pt-4 justify-center">
      <span class="text-h5">Child Care Operating Funding Program - {{ formattedProgramYear }} Program Confirmation Form</span>
      </div>
      <br>
      <div class="row pt-4 justify-center">
      <span class="text-h5">Child Care Fee Reduction Initiative (CCFRI)</span>
    </div>
    <v-form ref="isValidForm" value="false" v-model="isValidForm">

      <v-skeleton-loader max-height="475px" v-if="loading" :loading="loading" type="image, image, image"></v-skeleton-loader>
      <br>
      <v-skeleton-loader max-height="475px" v-if="loading" :loading="loading" type="image" class="pb-6"> <br><br></v-skeleton-loader>

      <v-card v-else elevation="6" class="pa-4 mx-auto my-10 rounded-lg col-12 "
          min-height="230"
          rounded
          tiled
          exact tile
          :ripple="false"
          >
            <v-card-text>
              <p class="text-h5 text--primary text-center" v-if="currentFacility.facilityAccountNumber">
                Facility ID: {{currentFacility.facilityAccountNumber}}
              </p>
              <p class="text-h5 text--primary text-center">
                {{currentFacility.facilityName}}
              </p>
              <p class="text-h5 text--primary text-center" v-if="currentFacility.licenseNumber">
                Licence Number: {{currentFacility.licenseNumber}}
              </p>
              <br>
              <!--get current year from CCOF year id -NOT first in array-->
              <p class="text-h6 text--primary text-center">
                Our Records show this facilites' fees for {{previousProgramYearLabel}} are as follows:
              </p>
              <br>
              <v-simple-table v-if="feeList.length > 0">
                <thead>
                  <tr>
                    <th  scope="col" class="text-left">
                      Date
                    </th>
                    <th  v-for="(item , index)  in feeList"
                    :key="index"
                     class="text-center"
                     scope="col">
                      {{item.childCareCategory}}  -  {{item.feeFrequency}}
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
                </tbody>
              </v-simple-table>
              <h2 class="text-center"  v-else>We have no fees on record for this facility. Click "Next" to enter your fees for the previous 24 months.</h2>
            </v-card-text>
        </v-card>

        <div v-if="loading" :loading="loading"></div>
        <div v-else-if="feeList.length == 0"></div>
        <v-card v-else elevation="6" class="pa-4 mx-auto my-10 rounded-lg col-12 "
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
          <v-btn color="info" outlined x-large :loading="processing" @click="previous()">
            Back</v-btn>
            <!--add form logic here to disable/enable button-->
          <v-btn color="secondary" outlined x-large  :loading="processing" @click="next()" :disabled="!isFormValidAndLoaded()">Next</v-btn>
          <!-- <v-btn color="primary" outlined x-large :loading="processing" @click="updateCCFRI()">
            Save</v-btn> -->
        </v-row>
      </v-form>
  </v-container>

</template>

<script>

//userInfo.ccofProgramYearId;
import { PATHS } from '@/utils/constants';
import { mapState, mapActions, mapGetters} from 'vuex';
import alertMixin from '@/mixins/alertMixin';

export default {
  mixins: [alertMixin],
  data() {
    return {
      processing: false,
      prevFees: {},
      input : '',
      loading: true,
      model: {},
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
    ...mapState('application', ['formattedProgramYear', 'applicationId']),
    ...mapState('ccfriApp', ['CCFRIFacilityModel']),

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
    previousProgramYearGuid(){
      const programYear = this.programYearList.list.find(({ programYearId }) =>  programYearId == this.userInfo.ccofProgramYearId );
      return programYear.previousYearId;
    },
    previousProgramYearLabel(){
      const programYear = this.programYearList.list.find(({ programYearId }) =>  programYearId == this.userInfo.ccofProgramYearId );
      const lastProgramYear = this.programYearList.list.find(({ programYearId }) =>  programYearId == programYear.previousYearId );
      return lastProgramYear?.name;
    }
  },
  watch: {
    //get facilityID from here and then set it !
    '$route.params.urlGuid': {
      async handler() {
        try {
          this.loading = true;
          await this.loadCCFRIFacility(this.$route.params.urlGuid);
          if (this.CCFRIFacilityModel.existingFeesCorrect == 100000000) {
            this.model.q1 = 'Yes';
          } else if (this.CCFRIFacilityModel.existingFeesCorrect == 100000001) {
            this.model.q1 = 'No';
          } else {
            this.model.q1 = undefined;
          }
          await this.loadCCFRIFacility(this.CCFRIFacilityModel.previousCcfriId); //load this page up with the previous CCFRI data

          this.feeList = [];

          //only display last years child care fees
          const prevYearGuid = this.previousProgramYearGuid;
          this.CCFRIFacilityModel.childCareTypes.forEach(item => {
            if (item.programYearId == prevYearGuid ){
              this.feeList.push(item);
            }
          });

          this.feeList.sort((a, b) => a.orderNumber - b.orderNumber);

          console.log(this.feeList);


          this.loading = false;
        } catch (error) {
          console.log(error);
          if (this.CCFRIFacilityModel.previousCcfriId) {
            this.setFailureAlert('An error occured while getting.');
          } else {
            this.setFailureAlert('The server was busy.  Please wait 10 seconds and refresh this screen.');
          }

        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    ...mapActions('ccfriApp', ['loadCCFRIFacility']),
    ...mapActions('navBar', ['getPreviousPath']),
    async previous(){
      let path = await this.getPreviousPath();
      this.$router.push(path);
    },
    async setFees (areFeesCorrect){
      await this.loadCCFRIFacility(this.$route.params.urlGuid);
      this.CCFRIFacilityModel.prevYearFeesCorrect = areFeesCorrect;
      this.CCFRIFacilityModel.existingFeesCorrect = areFeesCorrect ? 100000000 : 100000001;
    },
    isFormValidAndLoaded(){
      //we need this to disable button while the page is loading
      return this.isValidForm && this.loading == false;

    },
    next() {
      this.loading = true;

      if (this.model.q1 == 'No'){
        this.setFees(false);
      }
      else if (this.model.q1 == 'Yes') {
        this.setFees(true);
      }
      this.$router.push({path : `${PATHS.addNewFees}/${this.$route.params.urlGuid}`});


      //this.$router.push({path : `${PATHS.addNewFees}/${this.$route.params.urlGuid}`});

    },
  },
};


</script>
