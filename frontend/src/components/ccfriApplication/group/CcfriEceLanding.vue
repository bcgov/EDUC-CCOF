<template>
    <v-container>
        <div>
            <MessagesToolbar></MessagesToolbar>
        </div>
        <br><br>
        <v-row justify="space-around">
        
          <SmallCard title="Add a New Facility to my Organization" disabled="true">
              <br>
              <a href="#">LINK</a><br>
          </SmallCard>
       
          <SmallCard title="Apply for CCFRI and ECE-WE">
              <br>
              <a href="#">LINK</a><br>
          </SmallCard>
        
      </v-row>

        <LargeButtonContainer>
            <v-list-item v-for="({facilityName, facilityId}) in chosenOrg" :key="facilityId">
                <LargeBlueButton >{{facilityName}}</LargeBlueButton>
            </v-list-item>
        </LargeButtonContainer>   

        <!-- TODO: Facility A to be replaced with a ref to current facility title -->
          <!-- <LargeCard
          title="Facility A" 
          subtitle="Would you like to opt-in for CCFRI?">
            <v-btn
              color="blue"
              elevation="2"
              justify="left"
              min-width="100px"
            >YES</v-btn>
            <v-btn
              color="white"
              elevation="2"
              class="ml-lg-7"
              min-width="100px"
            >No</v-btn>
          </LargeCard> -->



        <v-card elevation="6" class="pa-4 mx-auto my-10 rounded-lg col-12 "
          min-height="230"
          rounded
          tiled
          :to="userInfo.organizationList.length > 1 ?'/organization' : 'error-page'" exact tile
          :ripple="false"
          >
            <v-card-text>
              <p class="text-h5 text--primary text-center">
                Facility A
              </p>
              <p class="text-h6 text--primary text-center">
                Our Records show this facilites' fees for April 2021 to March 2022 are: 
              </p>
              <p>
                Lorem ipsum dolor sit
              </p>
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
                v-model="row"
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


          <v-card elevation="6" class="pa-4 mx-auto my-10 rounded-lg col-12 "
          min-height="230"
          rounded
          tiled
          exact 
          tile
          :ripple="false"
          >
            <v-card-text class="pa-4" >
              <p class="text-h5 text--primary">
                Parent Fees 2022/23: Full-Time 18-36 Months
              </p>
              <br>
              <p class="text-h6 text--primary">
                Are your parent fees
              </p>
              
              <v-radio-group
                v-model="row"
                row
              >
              <v-radio
                  label="Daily"
                  value="Daily"
                ></v-radio>
                <v-radio
                  label="Weekly"
                  value="Weekly"
                ></v-radio>
                <v-radio
                  label="Monthly"
                  value="Monthly"
                ></v-radio>
                
                
              </v-radio-group>
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
            <v-card-text class="pa-4" >
              <p class="text-h5 text--primary">
                Parent Fees 2022/23: Full-Time 3 Years to Kindergarten
              </p>
              <br>
              <p class="text-h6 text--primary">
                Are your parent fees
              </p>
              
              <v-radio-group
                v-model="row"
                row
              >
              <v-radio
                  label="Daily"
                  value="Daily"
                ></v-radio>
                <v-radio
                  label="Weekly"
                  value="Weekly"
                ></v-radio>
                <v-radio
                  label="Monthly"
                  value="Monthly"
                ></v-radio>
                
                
              </v-radio-group>
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
                Do you charge parent fees at this facility for any closures on business days (other than statuary holidays)?
              </p>
              <br>
              <v-radio-group
                v-model="row"
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
                Is there any other information about this facility you would like us to know?
              </p>
              <br>
              <v-textarea
                outlined
                name="input-7-4"
                label="Describe here"
          ></v-textarea>
            </v-card-text>
          </v-card>

        <!-- <v-btn>
          Back
        </v-btn> -->


    </v-container>
</template>

<script>


import { mapGetters} from 'vuex';
import SmallCard from '../../guiComponents/SmallCard.vue';
import MessagesToolbar from '../../guiComponents/MessagesToolbar.vue';
import LargeBlueButton from '../../guiComponents/LargeBlueButton.vue';
import LargeButtonContainer from '../../guiComponents/LargeButtonContainer.vue';
import LargeCard from '../../guiComponents/LargeCard.vue';

export default {
  name: 'CcfriLandingPage',
  data() {
    return {
      input : '',
      feeList : [
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
      ]
    };
  },
  computed: {
    ...mapGetters('auth', ['userInfo']),
    chosenOrg(){
      console.log(this.userInfo.organizationList[0].facilityList);
      //TODO: This is hardcoded to the first org in the list. This should be updated with a state var from a chosen org from an earlier screen.
      //return 'hi';
      return this.userInfo.organizationList[0].facilityList;
    }
  },
  components: { SmallCard, MessagesToolbar, LargeBlueButton, LargeButtonContainer, LargeCard }
};
</script>

<style scoped>

body {
white-space: pre-wrap;
}


</style>

