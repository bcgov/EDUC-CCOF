<template>
  <v-footer id="app-footer" absolute color="#003366" dark>
    <v-row justify="center" align="center">
      <v-btn id="footer-home" variant="text" href="https://www.gov.bc.ca/"> Home </v-btn>
      <v-btn id="footer-about" variant="text" href="https://www2.gov.bc.ca/gov/content/about-gov-bc-ca">
        About gov.bc.ca
      </v-btn>
      <v-btn id="footer-disclaimer" variant="text" href="http://gov.bc.ca/disclaimer"> Disclaimer </v-btn>
      <v-btn id="footer-privacy" variant="text" href="http://gov.bc.ca/privacy"> Privacy </v-btn>
      <v-btn id="footer-accessibility" variant="text" href="http://gov.bc.ca/webaccessibility"> Accessibility </v-btn>
      <v-btn id="footer-copyright" variant="text" href="http://gov.bc.ca/copyright"> Copyright </v-btn>
      <v-btn id="footer-contact" variant="text" href="https://www2.gov.bc.ca/gov/content/home/contact-us">
        Contact Us
      </v-btn>
    </v-row>
  </v-footer>
</template>

<script>
export default {
  name: 'FooterComponent',
};
</script>

<style scoped>
.v-footer {
  border-top: 2px solid rgb(252, 186, 25) !important;
  min-width: 100%;
  flex-grow: 0;
}

.v-btn--active.footer:before,
.v-btn.footer:focus:before,
.v-btn.footer:hover:before {
  background: none;
}
</style>
