<template>
  <section class="my-5 py-10 grey-div-with-border">
    <v-card class="mt-5 py-10 pdf-reader">
      <VuePdfEmbed :source="pdfFile" />
    </v-card>
  </section>
</template>

<script>
// Fixes CSP problems with inline pdf scripts.
import VuePdfEmbed, { GlobalWorkerOptions } from 'vue-pdf-embed/dist/index.essential.mjs';
import PdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';
GlobalWorkerOptions.workerSrc = PdfWorker;

export default {
  name: 'AppPDFViewer',
  components: { VuePdfEmbed },
  props: {
    pdfFile: {
      type: [String, Object],
      required: true,
    },
  },
};
</script>

<style scoped>
.grey-div-with-border {
  background-color: #eeeeee;
  border: 1px solid #333333;
  border-radius: 4px;
}
.pdf-reader {
  margin: auto;
  border: solid 1px black;
  max-height: 80vh;
  max-width: 830px;
  overflow-y: scroll;
}
</style>
