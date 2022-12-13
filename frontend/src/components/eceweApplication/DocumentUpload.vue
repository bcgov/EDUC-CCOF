<template>
    <v-container>
      <v-row justify="center" class="pt-4">
        <span class="text-h5">Supporting Document Upload</span>
      </v-row>
      <v-row justify="center" class="pt-4 text-h5" style="color:#003466;">
        {{this.userInfo.organizationName}}
      </v-row>

      <v-row justify="center">
        <v-card class="py-2 px-5 mx-2 mt-10 rounded-lg col-11">
          <v-container>
            <v-row>
              Please upload any supporting documentation for your Program Confirmation Form (PCF)
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

      <v-row justify="space-around" class="mt-10">
        <v-btn color="info" outlined required x-large @click="previous()">Back</v-btn>
        <v-btn v-show="q3FundingModel" color="secondary" outlined x-large @click="next()">Next</v-btn>
        <v-btn v-show="q3FundingModel" color="primary" outlined x-large @click="save()">Save</v-btn>
      </v-row>

    </v-container>
  </template>
  
<script>
  
import { PATHS } from '@/utils/constants';
import DocumentUpload from '@/components/common/DocumentUpload';
import { mapGetters, mapActions } from 'vuex';
import alertMixin from '@/mixins/alertMixin';

export default {
  mixins: [alertMixin],
  components: {
    DocumentUpload
  },
  computed: {
    ...mapGetters('auth', ['userInfo']),
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
      this.$router.push(PATHS.eceweFacilities);
    },
    next() {
      this.$router.push(PATHS.summaryDeclaration);
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
  
