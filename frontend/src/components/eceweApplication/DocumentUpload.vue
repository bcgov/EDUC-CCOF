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

      <v-row>
        <v-col cols="4" class="text-left">
          <v-btn outlined required @click="back()">Back</v-btn>
        </v-col>
        <v-col cols="4" class="text-center">
          <v-btn v-show="model.fundingModelQ3" outlined required @click="next()">Next</v-btn>
        </v-col>
        <v-col cols="4" class="text-right">
          <v-btn v-show="model.fundingModelQ3" outlined required @click="save()">Save</v-btn>
        </v-col>
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
    back() {
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
  
