<template>
    <v-container>
        <div>
            <MessagesToolbar></MessagesToolbar>
        </div>
        <v-row justify="space-around">
        
          <SmallCard>
            <v-card-text>
              <p class="text-h6 text--primary">
                Submit Enrolment Reports or monthly ECE-WE reports to receive payment
              </p>
              <br>
              <a href="#">LINK</a><br>
            </v-card-text>
          </SmallCard>
       

        
          <SmallCard>
            <v-card-text>
              <p class="text-h6 text--primary">
                Renew my funding agreement for 2022/23
              </p>
              <br>
              <a href="#">LINK</a><br>
            </v-card-text>
          </SmallCard>
        
      </v-row>
    </v-container>
</template>

<script>


import { mapGetters} from 'vuex';
import SmallCard from './guiComponents/SmallCard.vue';
import MessagesToolbar from './guiComponents/MessagesToolbar.vue';

export default {
  name: 'CcfriLandingPage',
  props: {
    currentYear: {
      type: Number,
      default: 2023,
      required: false,
    },
  },
  data() {
    return {
      input : ''
    };
  },
  computed: {
    ...mapGetters('auth', ['userInfo']),
    currentYearTwoDigit() {
      return this.currentYear - 2000;
    },
    nextYearTwoDigit() {
      return this.currentYear - 1999;
    },

    chosenOrg(){
      //TODO: This is hardcoded to the first org in the list. This should be updated with a state var from a chosen org from an earlier screen.
      return this.userInfo.organizationList[0];
    },
    filteredList() {
      return this.chosenOrg.facilityList.filter((fac) => fac.facilityName.toLowerCase().includes(this.input.toLowerCase()));
    },
  },
  components: { SmallCard, MessagesToolbar }
};
</script>

<style scoped>

body {
white-space: pre-wrap;
}


</style>

