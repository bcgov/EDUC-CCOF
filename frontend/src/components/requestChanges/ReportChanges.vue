<template>
  <v-container>

    <div class="row pt-4 justify-center text-center">
    <span class="text-h5">Child Care Operating Funding Program - {{ formattedProgramYear }}</span>
    </div>
    <br>
    <div class="row pt-4 justify-center">
    <!-- <span class="text-h5">What would you like to change?</span> -->
    </div>

    <v-form ref="isValidForm" value="false" v-model="isValidForm">

      <v-container>
        <v-row justify="space-around">

          <SmallCard  class= "col-lg-6 " :disable="false">
            <template #content class="px-10">
              <p class="text-h6 text-center">What changes do you want to make?</p>
              <p class="px-2">
                Changes <strong> require an updated </strong> <i>Community Care And Assisted Living Act</i> License to be attached.
              </p>
              <v-card  to="#"
                class="px-5  mt-10 pa-0 rounded-lg  col-12 bg-blue-lighten-3 "
                elevation="4"
                rounded
                tiled
                exact tile
                :ripple="false"
                color="#e5f7ff"
                >
                <v-card-text class="bg-blue-lighten-3">
                  <v-row>
                      <p class="text-h6 blueText"> Add a New facility to an existing organization </p>
                      <p class="text  " > This will navigate you through a CCOF Application process. Please have your Facility, CCFRI, and ECE-WE information ready.</p>
                  </v-row>
                </v-card-text>
              </v-card>
            </template>
          </SmallCard>

          <SmallCard  class= "col-lg-6 " :disable="false">
            <template #content class="px-10">
              <p class="text-h6 text-center">Report changes to your License or service</p>
              <p class="px-2">
                Please have your <i>Community Care And Assisted Living Act</i> license (if required) and other supporting documents ready.
              </p>
            </template>
              <template #button class="ma-0 pa-0 ">
                <v-row justify="space-around">
                  <v-btn dark class="blueButton mb-10" @click="goToChangeForm()" >Upload a Change Notification Form</v-btn>
                </v-row>
              </template>

          </SmallCard>


        </v-row>

      </v-container>
    </v-form>




      <v-row justify="space-around">
        <v-btn color="info" outlined x-large :loading="processing" @click="previous()">
          Back</v-btn>
      </v-row>

  </v-container>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import { PATHS } from '@/utils/constants';
import alertMixin from '@/mixins/alertMixin';
import SmallCard from '../guiComponents/SmallCard.vue';


let ccfriOptInOrOut = {};
let textInput = '' ;
let model = { x: [], ccfriOptInOrOut, textInput };
export default {
  name: 'ReportChange',
  mixins: [alertMixin],
  data() {
    return {
      buttonTitles: [
        {
          title: '1. Legal Name or Organization Name',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        },
      ],
      isUnlocked: false,
      isValidForm: false,
      processing: false,
      loading: false,
      rules: [
        (v) => !!v || 'Required.',
      ],
    };
  },
  computed: {
    ...mapState('application', ['applicationStatus', 'formattedProgramYear', 'applicationId']),
    ...mapState('app', ['navBarList', 'isRenewal', 'ccfriOptInComplete', 'programYearList']),
    isReadOnly() {
      if (this.unlockedFacilities) {
        return false;
      }
      return (this.applicationStatus === 'SUBMITTED');
    },
    unlockedFacilities() {
      return this.navBarList.some(facility => facility.unlockCcfri);
    },
  },
  beforeMount: function () {
    this.showOptStatus = new Array(this.navBarList.length).fill(false);
  },
  methods: {
    ...mapMutations('app', ['setCcfriOptInComplete', 'forceNavBarRefresh']),
    ...mapActions('navBar', ['getPreviousPath']),
    async previous() {
      let path = await this.getPreviousPath();
      this.$router.push(path);
    },
    //checks to ensure each facility has a CCFRI application started before allowing the user to proceed.
    isPageComplete() {
      const allFacilitiesComplete = this.navBarList.every((fac) => {
        return (fac.ccfriApplicationId);
      });
      if (!allFacilitiesComplete) {
        return allFacilitiesComplete;
      }
      return this.isValidForm;
    },
    next() {
      this.$router.push(PATHS.home);
    },
    goToChangeForm(){
      this.$router.push(PATHS.changeNotificationForm);
    }
  },
  mounted() {
    this.model = this.$store.state.ccfriApp.model ?? model;
  },
  beforeRouteLeave(_to, _from, next) {
    this.$store.commit('ccfriApp/model', this.model);
    next();
  },
  components: { SmallCard }
};
</script>
<style scoped>
.blueBorder{
  border-top: 5px solid #003366 !important;
}
.blueButton {
  background-color: #003366 !important;
}
.blueText {
  color: rgb(0, 52, 102) !important;
}
</style>