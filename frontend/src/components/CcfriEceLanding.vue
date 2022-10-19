<template>
    <v-container>
        <div>
            <MessagesToolbar></MessagesToolbar>
        </div>
        <br><br>
        <v-row justify="space-around">
        
          <SmallCard>
            <v-card-text>
              <p class="text-h6 text--primary">
                Add a New Facility to my Organization
              </p>
              <br>
              <a href="#">LINK</a><br>
            </v-card-text>
          </SmallCard>
       
          <SmallCard>
            <v-card-text>
              <p class="text-h6 text--primary">
                Apply for CCFRI and ECE-WE
              </p>
              <br>
              <a href="#">LINK</a><br>
            </v-card-text>
          </SmallCard>
        
      </v-row>

        <LargeButtonContainer>
            <v-list-item v-for="({facilityName, facilityId}) in chosenOrg" :key="facilityId">
                <LargeBlueButton >{{facilityName}}</LargeBlueButton>
            </v-list-item>
        </LargeButtonContainer>   
        
        
        <!-- <v-btn>
          Back
        </v-btn> -->

        <!-- <v-row> -->
          <LargeCard
          title="Facility A" 
          subtitle="Would you like to opt-in for CCFRI?">
            <v-btn
              color="blue"
              elevation="2"
              justify="left"
            >YES</v-btn>
            <v-btn
              color="white"
              elevation="2"
              class="ml-lg-7"
            >No</v-btn>
          </LargeCard>
        <!-- </v-row> -->
    </v-container>
</template>

<script>


import { mapGetters} from 'vuex';
import SmallCard from './guiComponents/SmallCard.vue';
import MessagesToolbar from './guiComponents/MessagesToolbar.vue';
import LargeBlueButton from './guiComponents/LargeBlueButton.vue';
import LargeButtonContainer from './guiComponents/LargeButtonContainer.vue';
import LargeCard from './guiComponents/LargeCard.vue';

export default {
  name: 'CcfriLandingPage',
  data() {
    return {
      input : ''
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

