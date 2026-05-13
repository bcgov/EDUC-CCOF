<template>
  <v-container>
    <v-card class="mt-10 rounded-lg" elevation="4">
      <v-card-title class="py-3 card-title">Report Changes</v-card-title>
      <v-row no-gutters>
        <v-col cols="12" sm="6" :class="borderClass" class="pa-4 pl-12">
          <div class="font-weight-bold mb-2">Submit a change notification form to update:</div>
          <ul class="pl-6">
            <li>Capacity</li>
            <li>Facility name</li>
            <li>Organization legal name</li>
            <li>Organization mailing address</li>
            <li>Permanent facility closure</li>
            <li>Service category</li>
            <li>Service details:</li>
            <ul class="pl-6">
              <li>Days per week</li>
              <li>Extended hours</li>
              <li>Preschool age programs</li>
              <li>School age programs</li>
              <li>Weeks per year</li>
            </ul>
          </ul>
          <div class="mt-2">Select <strong>Next</strong> to complete the form</div>
        </v-col>
        <v-col cols="12" sm="6" class="pa-4 pl-12">
          <div class="font-weight-bold mb-2">Submit a direct deposit application to update:</div>
          <ul class="pl-6">
            <li>Banking Information</li>
          </ul>
          <div class="mt-4">
            <a
              class="text-decoration-underline"
              target="_blank"
              rel="noopener noreferrer"
              href="https://www2.gov.bc.ca/assets/gov/british-columbians-our-governments/services-policies-for-government/internal-corporate-services/finance-forms/fin-312-direct-deposit-application.pdf"
              >Direct Deposit Application</a
            >
          </div>
          <div class="mt-9">Submit the completed direct deposit application using:</div>
          <div class="mt-6">
            Email: <a class="text-decoration-underline" href="mailto:ccof@gov.bc.ca">ccdda@gov.bc.ca</a><br />
            Or<br />
            Mailing address: Child Care Operating Funding<br />
            PO Box 9965 Stn Prov Govt<br />
            Victoria BC V8W 9R4<br />
          </div>
          <div class="mt-9">
            For questions, contact the Child Care Operating Funding Program at 1 888 338 6622 (Option 2).
          </div>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: 'ChangeNotificationDialogueContent',
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
