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
            <v-list-item v-for="({facilityName, facilityId} , index) in chosenOrg" :key="facilityId">
                <LargeBlueButton >{{facilityName}}</LargeBlueButton>
            </v-list-item>
        </LargeButtonContainer>      
    </v-container>
</template>

<script>


import { mapGetters} from 'vuex';
import SmallCard from './guiComponents/SmallCard.vue';
import MessagesToolbar from './guiComponents/MessagesToolbar.vue';
import LargeBlueButton from './guiComponents/LargeBlueButton.vue';
import LargeButtonContainer from './guiComponents/LargeButtonContainer.vue';

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
  components: { SmallCard, MessagesToolbar, LargeBlueButton, LargeButtonContainer }
};
</script>

<style scoped>

body {
white-space: pre-wrap;
}


</style>

