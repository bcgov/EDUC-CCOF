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



        
          <AddNewFees></AddNewFees>
        


          <!-- <LargeCard title="hi" :class="{'blueBorder':true}">
            hi
          </LargeCard> -->

          <!-- <ExistingFacilityFees></ExistingFacilityFees> -->

        <v-btn>
          Back
        </v-btn>


    </v-container>
</template>

<script>


import { mapGetters} from 'vuex';
import SmallCard from '../../guiComponents/SmallCard.vue';
import MessagesToolbar from '../../guiComponents/MessagesToolbar.vue';
import LargeBlueButton from '../../guiComponents/LargeBlueButton.vue';
import LargeButtonContainer from '../../guiComponents/LargeButtonContainer.vue';
import LargeCard from '../../guiComponents/LargeCard.vue';
import ExistingFacilityFees from './ExistingFacilityFees.vue';
import AddNewFees from './AddNewFees.vue';

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
  components: { SmallCard, MessagesToolbar, LargeBlueButton, LargeButtonContainer, LargeCard, ExistingFacilityFees, AddNewFees }
};
</script>

<style scoped>

body {
white-space: pre-wrap;
}


</style>

