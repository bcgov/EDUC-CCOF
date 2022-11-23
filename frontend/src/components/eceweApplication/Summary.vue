<template>
    <v-container>
      <v-row justify="center">
        <br/>
        Summary
      </v-row>
      <v-row>
        <v-col style="text-align:center">
          {Organization Name}
        </v-col>
      </v-row>
      <v-row><v-col></v-col></v-row>
      <v-row><v-col></v-col></v-row>

      <v-row justify="center">
        <v-card class="cc-top-level-card ecewe-card">
          <v-container>
            <v-row>
              <v-col>
                * Information to show here to be confirmed
                <br/>
                <br/>
                <br/>
                <br/>
                <br/>
                <br/>
                <br/>
                <br/>
                <br/>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-row>
 
      <v-row justify="center">
        <v-card class="cc-top-level-card ecewe-card">
          <v-container class="pa-0">
            <v-row>
              <v-radio-group class="pa-0">
                <v-col class="pl-6 py-0">
                  <v-radio
                    label="By selecting this, I declare all the information to be correct {placeholder wording}"
                    value="true">
                  </v-radio>
                </v-col>
              </v-radio-group>
            </v-row>
          </v-container>
        </v-card>
      </v-row>
      
      <v-row>
        <v-col cols="4" class="text-left">
          <v-btn outlined required @click="back()">Back</v-btn>
        </v-col>
        <v-col cols="4" class="text-center">
          <v-btn outlined required @click="submit()">Submit</v-btn>
        </v-col>
        <v-col cols="4" class="text-right">
          <v-btn outlined required @click="save()">Save</v-btn>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
<script>
  
import { PATHS } from '@/utils/constants';
import DocumentUpload from '@/components/common/DocumentUpload';
  
export default {
  props: {
  },
  components: {
    DocumentUpload
  },
  computed: {
  },
  data() {
    return {
    };
  },
  methods: {
    upload() {},
    hideAttachmentPanel() {},
    back() {
      this.$router.push(PATHS.documentUpload);
    },
  }
};
</script>
  
<style>
.ecewe-card {
  width:60%;
}
</style>
