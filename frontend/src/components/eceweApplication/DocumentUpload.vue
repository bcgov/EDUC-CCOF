<template>
    <v-container>
      <v-row justify="center" class="pt-4">
        <span class="text-h5">Supporting Document Upload</span>
      </v-row>
      <v-row justify="center" class="pt-4 text-h6" style="color:#003466;">
        AMBER MELO
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
        <v-btn v-show="q3FundingModel" color="secondary" outlined x-large @click="next()">Next</v-btn>
        <v-btn v-show="q3FundingModel" color="primary" outlined x-large @click="save()">Save</v-btn>
      </v-row>

    </v-container>
  </template>
  
<script>
  
import { PATHS } from '@/utils/constants';
import DocumentUpload from '@/components/common/DocumentUpload';
import { mapActions } from 'vuex';
import alertMixin from '@/mixins/alertMixin';

export default {
  mixins: [alertMixin],
  components: {
    DocumentUpload
  },
  computed: {
    q3FundingModel: {
      get() { return this.$store.state.eceweApp.q3FundingModel; }
    }
  },
  data() {
    return {
      previousPage: this.previousPath,
    };
  },
  methods: {
    ...mapActions('eceweApp', ['saveApplication']),
    upload() {},
    hideAttachmentPanel() {},
    previous() {
      return this.$router.go(-1);
    },
    next() {
      this.$router.push(PATHS.eceweSummary);
    },
    async save() {
      try {
        await this.saveApplication();
        this.setSuccessAlert('Success! ECEWE appcliation has been saved.');
      } catch (error) {
        this.setFailureAlert('An error occurred while saving ECEWE application. Please try again later.'+error);
      }
      this.processing = false;
    }
  },
  mounted() {
  },
};
</script>
  
