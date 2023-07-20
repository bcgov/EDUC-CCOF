<template>
  <v-container>
    <v-row justify="center">
      <div class="pa-10 text-h4">Welcome to CCOF!</div>
    </v-row>
    <v-row justify="">
      <span class="text-h4">Instructions:</span>
      <br><br><br>
      <p class="px-10 text-h6">
        Under the Child Care Operating Funding (CCOF) Agreement, section 4.1 f and g, you must submit a request to increase parent fees after approval for the Child Care Fee Reduction Initiative (CCFRI). Use this form to submit any request to increase your parent fees in the 2023/24 Fiscal Year.
        To complete this form, you will need the following:
        <br><br>
        <ul>
          <li>
            A proposed Parent Fee Schedule; and
          </li>
          <li>
            if the increase you are requesting is above the Fee Increase Limit for your <a href="https://www2.gov.bc.ca/assets/gov/family-and-social-supports/child-care/child-care-operating-funding/ccfri_funding_guidelines_23_24.pdf"> Service Delivery Area </a>, you are required to complete a Request for Information and will be required to submit supporting documentation..
          </li>
        </ul>
        </p>

        <p class="px-15 text-h6">* The facilities that are not opted in to CCFRI cannot be selected </p>
    </v-row>
    <v-row justify="space-around">
      <v-col cols="6">

      </v-col>
    </v-row>

    <NavButton :isNextDisplayed="true" :isSaveDisplayed="false"
         :isNextDisabled="true" :isProcessing="false"
        @previous="previous()" @next="false"  @save="true"></NavButton>
  </v-container>
</template>

<script>
import { PATHS,} from '@/utils/constants';
import alertMixin from '@/mixins/alertMixin';
//import SmallCard from '../guiComponents/SmallCard.vue';

import NavButton from '@/components/util/NavButton';

export default {
  components: {NavButton},
  mixins: [alertMixin],
  data() {
    return {
      isValidForm: false,
      processing: false,
      loading: false,
      rules: [
        (v) => !!v || 'Required.',
      ],
    };
  },
  computed: {
  },
  methods: {
    previous() {
      this.$router.push(PATHS.ROOT.CHANGE_LANDING);
    },
    next() {
      this.$router.push(PATHS.ROOT.CHANGE_LANDING);
    },
    isPageComplete() {

    },
  },
};

</script>

