<template>
  <v-container>
    <v-row  justify="space-around">
      <div class="pa-10 text-h4 text-center">Welcome to CCOF!</div>
    </v-row>
    <v-row>
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
         :isNextDisabled="false" :isProcessing="false"
        @previous="previous()" @next="next()"  @save="true"></NavButton>
  </v-container>
</template>

<script>
import { PATHS, changeUrl, CHANGE_TYPES } from '@/utils/constants';
import alertMixin from '@/mixins/alertMixin';
//import SmallCard from '../guiComponents/SmallCard.vue';

import NavButton from '@/components/util/NavButton';
import { mapActions } from 'vuex';
import { CHANGE_TYPES } from '../../utils/constants';

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
    ...mapActions('reportChanges', ['createChangeRequest']),
    previous() {
      this.$router.push(PATHS.ROOT.CHANGE_LANDING);
    },
    async next() {

      if (!this.$route.params.changeRecGuid){
        let newReq = await this.createChangeRequest('PARENT_FEE_CHANGE');
        console.log(newReq);
        this.$route.params.changeRecGuid = newReq.changeRequestId;
      }
      this.$router.push(changeUrl(PATHS.MTFI_GROUP_SELECT_FACILITY, this.$route.params.changeRecGuid, CHANGE_TYPES.MTFI));

      //else family, go directly to confirm fee page for that facility
    },
    isPageComplete() {

    },
  },
};

</script>

