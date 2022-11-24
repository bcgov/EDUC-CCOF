<template>
  <v-container>
    <v-form ref="isValidForm" value="false" v-model="isValidForm">
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
                Our Records show this facilites' fees for January 2022 to March 2022 are: 
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
                    <th  scope="col" class="text-center">
                      Full-Time 18-36 Months
                    </th>
                    <th  scope="col" class="text-center">
                      Full-Time 3 Years to Kindergarten
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="item in feeList"
                    :key="item.date"
                  >
                    <td >{{ item.date }}</td>
                    <td class="text-center">${{ item.pre3year }}</td>
                    <td class="text-center">${{ item.post3year }}</td>
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
import { mapGetters, mapState} from 'vuex';

export default {
  data() {
    return {
      input : '',
      isValidForm : false,
      feeList : [
        {
          date: 'Jan 2022',
          pre3year: 500,
          post3year: 700
        },
        {
          date: 'Feb 2022',
          pre3year: 550,
          post3year: 725
        },
        {
          date: 'Mar 2022',
          pre3year: 550,
          post3year: 730
        }
      ],
      rules: [
        (v) => !!v  || 'Required.',
      ],
    };
  },
  computed: {
    ...mapState('facility', ['facilityList']),
    currentFacility(){
      return this.facilityList[0]; //TODO - change this to work with multiple facilities 
    }
  },
  methods: {
    previous(){
      this.$router.push(PATHS.ccfriHome);
    },
    next() {
      this.$router.push(PATHS.addNewFees); //TODO: change this, from CCOF page
    },
  },
};


</script>
