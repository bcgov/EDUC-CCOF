<template>
  <v-container>

    <LargeCard 
      title="Exceptional Circumstances" 
      subtitle="As outlined in the Funding Guidelines, exceptional circumstances are expenses that are:"
    >
      <ul>
        <li>
          Sudden, unexpected, or oustide of the Organization's control; and
        </li>
        <li>
          Must also address an immediate health/safety concern, or is necessary for the facility to remain operational
        </li>
      </ul>
      <br>
      <p>Is your fee increase due to an exceptional circumstance?</p>
      <v-radio-group
        required
        row
        v-model="model.q1"
        label=""
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
    </LargeCard>

    <LargeCard
      title="Direct Care Staff Wages Increases" 
      subtitle="Note: if your facility has ECE employees eligible for ECE Wage Enhancement (ECE-WE), you are required to apply for ECE-WE prior to being approved for a fee increase."
    >
      <p>
        As defined in the Funding Guidelines, Direct Care Staff are staff employed on either a full-time, part-time, or casual basis, provinding direct care to children at the facility for 50% or more of their working time
      </p>
      <p>Is your fee increase due to a wage increase for Direct Care Staff?</p>
      <v-radio-group
        required
        row
        v-model="model.q2"
        label=""
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
    </LargeCard>

    <LargeCard
      title="Priority Service Expansion: Increase in hours of Operation" 
    >
      <p>Is your fee increase due to an increase in hours/days of operation in order to provide care during expanded, extended, and/or non-traditional hours?</p>
      <v-radio-group
        required
        row
        v-model="model.q3"
        label=""
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
    </LargeCard>

    <LargeCard
      title="Priority Service Expansion: Increased Connection to Indigenous Community, Culture, and/or Language" 
    >
      <p>Is your fee increase due to an increased connection to Indigenous community, culture, or language in an Indigenous Facility or Organization?</p>

      <p>As outlined in the Funding Guidelines, this may inclide expenses associated with, but not limited to:</p>
      <ul>
        <li>
          Participation of an Elder, culture/language, and/or family in the child care program;
        </li>
        <li>
          Participation of children in community, language, and/or cultural events or activities; or
        </li>
        <li>
          Language or culture resources for use in child care program.
        </li>
      </ul>
      <v-radio-group
        required
        row
        v-model="model.q4"
        label=""
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
    </LargeCard>

    <LargeCard
      title="Affordable Child Care for Underserved Populations" 
      subtitle="To be considered under this policy, the Facility must meet all of the following criteria as outlined in the Funding Guidelines:"
    >
      
      <ul>
        <li>
          Has historcally provided care to underserved populations-including Indigenous or low-income populations-at significantely below the regional median range of fees for their area or at no fee;
        </li>
        <li>
          Can demonstrate Parent Fee Increases will contribute to the operational sustainability of the organization; and
        </li>
        <li>
          Can demonstrate Parent Fee Increase will not substantively increase the actual cost of care for parents/families?
        </li>
      </ul>
      <br>
      <p>Does this Facility meet all the above criteria?</p>
      <v-radio-group
        required
        row
        v-model="model.q5"
        label=""
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
    </LargeCard>

    <LargeCard>
      TODO: document upload goes here!
    </LargeCard>

    <v-row justify="space-around">
          <v-btn color="info" outlined x-large @click="previous()">
            Back</v-btn>
            <!--add form logic here to disable/enable button-->
          <v-btn color="secondary" outlined x-large @click="next()" :disabled="false">Next</v-btn>
          <v-btn color="primary" outlined x-large>
            Save</v-btn>
        </v-row>

  </v-container>
</template>

<script>
import LargeCard from '../../guiComponents/LargeCard.vue';
import { PATHS } from '@/utils/constants';

let model = { x: [] };

export default {
  name: 'CcfriRequestMoreInfo',
  data() {
    return {
      model,
      input : '',
      q1 : '',
      q2: '',
      q3: '',
      q4: '',
      q5 : '',
     
    };
  },
  mounted() {
    this.model = this.$store.state.ccfriApp.model ?? model;
    //this.ccfriOptInOrOut = this.$store.ccfriOptInOrOut.ccfriApp.ccfriOptInOrOut ?? ccfriOptInOrOut;
  },
  beforeRouteLeave(_to, _from, next) {
    this.$store.commit('ccfriApp/model', this.model);
    //this.$store.commit('ccfriApp/ccfriOptInOrOut', this.ccfriOptInOrOut);
    next();
  },
  computed: {
    
  },
  methods : {
    previous() {
      this.$router.push(PATHS.addNewFees); //TODO: only goes to 'add fees' page. Add logic to check if fees exist (option1 in wireframes)
    },
  },
  components: { LargeCard,}
};


</script>

