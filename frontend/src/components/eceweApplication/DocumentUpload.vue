<template>
    <v-container>
      <v-row justify="center">
        <br/>
        Supporting Document Upload
      </v-row>
      <v-row>
        <v-col style="text-align:center">
          {Organization Name}
        </v-col>
      </v-row>
      <v-row><v-col></v-col></v-row>
      <v-row><v-col></v-col></v-row>

      <v-row justify="center">
        <v-card class="cc-top-level-card">
          <v-container>
            <v-row>
              Upload your documents here:
            </v-row>
            <v-row>
              <DocumentUpload
                style="min-width: 40em"
                :small-file-extension="false"
                :check-file-rules="true"
                @close:form="hideAttachmentPanel"
                @upload="upload">
              </DocumentUpload>
            </v-row>
          </v-container>
        </v-card>
      </v-row>

      <v-row justify="space-around">
        <v-btn color="info" outlined required x-large @click="previous()">Back</v-btn>
        <v-btn v-show="model.fundingModelQ3" color="secondary" outlined x-large @click="next()">Next</v-btn>
        <v-btn v-show="model.fundingModelQ3" color="primary" outlined x-large @click="save()">Save</v-btn>
      </v-row>

    </v-container>
  </template>
  
<script>
  
import { PATHS } from '@/utils/constants';
import DocumentUpload from '@/components/common/DocumentUpload';

let model = { x: [], };

export default {
  props: {},
  components: {
    DocumentUpload
  },
  computed: {},
  data() {
    return {
      model,
      previousPage: this.previousPath,
    };
  },
  methods: {
    upload() {},
    hideAttachmentPanel() {},
    previous() {
      this.$router.push(this.model.previousRoute);
    },
    next() {
      this.$router.push(PATHS.eceweSummary);
    }
  },
  mounted() {
    this.model = this.$store.state.eceweApp.model ?? model;
  },
  beforeRouteLeave(_to, _from, next) {
    this.$store.commit('eceweApp/model', this.model);
    next();
  }
};
</script>
  
