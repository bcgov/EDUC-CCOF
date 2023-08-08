<template>
  <v-row class="d-flex justify-center">
    <v-card class="py-0 px-3 mx-0 mt-10 rounded-lg col-11" elevation="4">
      <v-row class="d-flex justify-start">
        <v-col class="pa-0">
          <v-card-title class="rounded-t-lg pt-3 pb-3 card-title" style="color:#003466;">Report
            Changes</v-card-title>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <div class="px-md-12 px-7">
            <p style="font-weight: bold;">Submit a change notificatin form to update:</p>
            <ul style="line-height: 70%">
              <li>Capacity</li>
              <li>Facility name</li>
              <li>Organization legal name</li>
              <li>Organization mailing address</li>
              <li>Permanent facility closure</li>
              <li>Service category</li>
              <li>Service details:</li>
              <ul>
                <li>Days per week</li>
                <li>Extended hours</li>
                <li>Maximum spaces offered</li>
                <li>Weeks per year</li>
              </ul>
            </ul>
            Select <span style="font-weight: bold;">Next</span> to complete the form
            <p style="font-weight: bold;">Submit the Direct Deposit Appilcation to:</p>
            <ul>
              <li><a href='https://www2.gov.bc.ca/assets/gov/british-columbians-our-governments/services-policies-for-government/internal-corporate-services/finance-forms/fin-312-direct-deposit-application.pdf'>Update banking information</a></li>
            </ul>
            <p>Email: <a href="mailto:cccda@gov.bc.ca">cccda@gov.bc.ca</a></p>
            <p>Mailing address:</p>
            Child Care Operating Funding<br />
            PO Box 9965 Stn Prov Govt<br />
            Victoria BC V8W 9R4

          </div>
        </v-col>
        <v-divider vertical></v-divider>
        <v-col>
          <p style="font-weight: bold;">Contact the CCOF Program Update:</p>
          <ul style="line-height: 70%">
            <li>Add new facility</li>
            <li>Authorized contacts/signing authority</li>
            <li>BCeID update</li>
            <li>Closure dates with parent fees</li>
            <li>Facility address (you have moved and opened a facility in your new home)</li>
            <li>Facility business hours</li>
            <li>Facility email and phone number</li>
            <li>Organization email and phone number</li>
            <li>Parent fees increase</li>
            <li>Temporary facility closure (one or more FULL months to a max of three)</li>
            <li>Update legal entity ownership</li>
          </ul><br />
          <p>Contact the CCOF Program:</p>
          Email: <a href="mailto:ccof@gov.bc.ca">ccof@gov.bc.ca</a><br />
          Toll free: <a href="tel:18883386622">1 888 338-6622 (Option 2)</a><br />
          Local Phone: <a href="tel:2503566501">250 356-6501</a>
        </v-col>
      </v-row>
    </v-card>
  </v-row>
</template>
<script>
export default {
  name: 'FamilyChangeDialogueContent'
};
</script>
