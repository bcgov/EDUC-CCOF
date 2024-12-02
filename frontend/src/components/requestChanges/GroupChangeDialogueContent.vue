<template>
  <v-container>
    <v-card class="mt-10 rounded-lg" elevation="4">
      <v-card-title class="py-3 card-title">Report Changes</v-card-title>
      <v-row no-gutters>
        <v-col cols="12" sm="6" :class="borderClass" class="pa-4 pl-12">
          <div class="font-weight-bold mb-2">Submit a change notification form to update:</div>
          <ul>
            <li>Capacity</li>
            <li>Facility name</li>
            <li>Organization legal name</li>
            <li>Organization mailing address</li>
            <li>Permanent facility closure</li>
            <li>Service category</li>
            <li>Service details:</li>
            <ul class="pl-4">
              <li>Days per week</li>
              <li>Extended hours</li>
              <li>Maximum spaces offered</li>
              <li>Preschool age programs</li>
              <li>School age programs</li>
              <li>Weeks per year</li>
            </ul>
          </ul>
          <div class="mt-2">Select <strong>Next</strong> to complete the form</div>
          <p class="font-weight-bold pt-4">Submit the Direct Deposit Application to:</p>
          <ul>
            <li>
              <a
                href="https://www2.gov.bc.ca/assets/gov/british-columbians-our-governments/services-policies-for-government/internal-corporate-services/finance-forms/fin-312-direct-deposit-application.pdf"
              >
                Update banking information
              </a>
            </li>
          </ul>
          <div class="mt-4">
            Email: <a href="mailto:ccdda@gov.bc.ca">ccdda@gov.bc.ca</a><br />
            Mailing address: Child Care Operating Funding<br />
            PO Box 9965 Stn Prov Govt<br />
            Victoria BC V8W 9R4
          </div>
        </v-col>
        <v-col cols="12" sm="6" class="pa-4 pl-12">
          <div class="font-weight-bold mb-2">Contact the CCOF Program Update:</div>
          <ul>
            <li>Authorized contacts/signing authority</li>
            <li>BCeID update</li>
            <li>Closure dates with parent fees</li>
            <li>Facility business hours</li>
            <li>Facility email and phone number</li>
            <li>Organization email and phone number</li>
            <li>Parent fees increase</li>
            <li>Temporary facility closure (one or more FULL months to a max of three)</li>
            <li>Update legal entity ownership</li>
          </ul>
          <div class="mt-4">
            Contact the CCOF Program: <br />
            Email: <a href="mailto:ccof@gov.bc.ca">ccof@gov.bc.ca</a><br />
            Toll free: <a href="tel:18883386622">1 888 338-6622 (Option 2)</a><br />
            Local Phone: <a href="tel:2503566501">250 356-6501</a><br />
          </div>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: 'GroupChangeDialogueContent',
  computed: {
    borderClass() {
      return this.$vuetify.display.smAndUp ? 'border-right' : 'border-bottom';
    },
  },
};
</script>

<style scoped>
li {
  padding: 0.2em;
}
</style>
