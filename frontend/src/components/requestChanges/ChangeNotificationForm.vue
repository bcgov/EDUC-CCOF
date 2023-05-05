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
        <v-row class="justify-space-around ">

          <v-col class="col-lg-6 ">

            <v-row>
              <v-col class="col-lg-10 ">
              <p class="px-2 text--primary"><strong> For all changes other than "Adding a new facility(s) to your Organization, please download the change notification form by clicking on the button below."</strong>
              </p>
                <v-btn dark class="blueButton mb-10 ml-2" @click="'/'" >Download a Change Notification Form</v-btn>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="col-lg-10 ">
              <p class="px-2 text--primary"><strong> Please upload the Change Notification Form in the Dropbox below once you have filled out the form.</strong>
              </p>
                <v-btn dark class="blueButton mb-10 ml-2" @click="'/'" >upload box here</v-btn>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="col-lg-10 ">
              <p class="px-2 text--primary"><strong> Please upload your Community Care License and other supporting documents for your requested changes in the Dropbox below.</strong>
              </p>

                <v-btn dark class="blueButton mb-10 ml-2" @click="'/'" >upload box here</v-btn>
              </v-col>
            </v-row>

            <p class="px-2 ml-6 text--primary"> For any other changes, please call the office at 123-456-7890
              </p>



          </v-col>
          <v-col class="col-lg-6 ">
            col 2
            {{ this.changeActionId }}
          </v-col>

        </v-row>

      </v-container>
    </v-form>


    <NavButton :isNextDisplayed="true" :isSaveDisplayed="true"
        :isSaveDisabled="isReadOnly" :isNextDisabled="!isFormComplete" :isProcessing="processing"
        @previous="previous" @next="nextBtnClicked" @validateForm="validateForm()" @save="save(true)"></NavButton>
      <!-- <v-row justify="space-around">
        <v-btn color="info" outlined x-large :loading="processing" @click="previous()">
          Back</v-btn>
      </v-row> -->

  </v-container>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import { PATHS } from '@/utils/constants';
import alertMixin from '@/mixins/alertMixin';
import SmallCard from '../guiComponents/SmallCard.vue';
import SupportingDocumentUpload from '@/components/SupportingDocumentUpload.vue';
import NavButton from '@/components/util/NavButton';


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
  watch: {
    //get facilityID from here and then set it !
    '$route.params.urlGuid': {
      async handler() {
        if (this.$route.params.urlGuid){
          window.scrollTo(0,0);
          //load the docs
          //set a flag that exists/

          try {
            await this.loadChangeRequestDocs(this.$route.params.urlGuid);

          } catch (error) {
            console.log(error);
            this.setFailureAlert('An error occured while getting.');

          }
        }


      },
      immediate: true,
      deep: true
    },
  },
  computed: {
    ...mapState('application', ['applicationStatus', 'formattedProgramYear', 'applicationId']),
    ...mapState('reportChanges', ['changeActionId, unsubmittedDocuments']),
    ...mapState('app', ['navBarList', 'isRenewal', 'ccfriOptInComplete', 'programYearList']),
    isReadOnly() {
      if (this.unlockedFacilities) {
        return false;
      }
      return (this.applicationStatus === 'SUBMITTED');
    },
  },
  beforeMount: function () {

  },
  methods: {
    ...mapMutations('app', ['setCcfriOptInComplete', 'forceNavBarRefresh','setNavBarStatus']),
    ...mapActions('navBar', ['getPreviousPath']),
    ...mapActions('reportChanges', ['createChangeRequest', 'loadChangeRequestDocs']),
    async previous() {
      let path = await this.getPreviousPath();
      this.$router.push(path);
    },
    async save(showNotification){
      try{
        await this.createChangeRequest();
        if (showNotification) {
          this.setSuccessAlert('Success! Request for Information has been saved.');
        }
      }
      catch (error)  {
        this.setFailureAlert('An error occurred while saving. Please try again later.');
      }

    },
    //checks to ensure each facility has a CCFRI application started before allowing the user to proceed.
    beforeRouteLeave(_to, _from, next) {
      //this.$store.commit('ccfriApp/model', this.model);
      //TODO: update with fields from page
      next();
    }
  },
  components: { NavButton }
};
</script>
<style scoped>
.blueBorder{
  border-top: 5px solid #003366 !important;
}
.boarder{
  border: 5px solid #003366 !important;
}
.blueButton {
  background-color: #003366 !important;
}
.blueText {
  color: rgb(0, 52, 102) !important;
}
</style>
