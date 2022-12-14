<template>
    <v-container>
      <v-row justify="center" class="pt-4">
        <span class="text-h5">Summary and Declaration</span>
      </v-row>
      <v-row justify="center" class="pt-4 text-h6" style="color:#003466;">
        ORG/FACILTY NAME
      </v-row>
      <v-row justify="center">
        <v-card elevation="4" class="py-2 px-5 mx-2 mt-10 rounded-lg col-11">
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
        <v-card class="py-2 px-5 mx-2 mt-10 rounded-lg col-11" elevation="4">
          <v-container class="pa-0">
            <v-row>
              <v-radio-group
                v-model="userDeclaration"
                class="pa-0">
                <v-col class="pl-6 py-0">
                  <v-radio
                    label="By selecting this, I declare all the information to be correct {placeholder wording}"
                    :value="1">
                  </v-radio>
                </v-col>
              </v-radio-group>
            </v-row>
          </v-container>
        </v-card>
      </v-row>
      
      <v-row justify="space-around" class="mt-10">
        <v-btn color="info" outlined required x-large @click="previous()">Back</v-btn>
        <v-btn color="primary" outlined x-large @click="next()">Submit</v-btn>
        <v-btn color="primary" outlined x-large @click="save()">Save</v-btn>
      </v-row>

    </v-container>
  </template>
<script>

import { mapActions } from 'vuex';
import alertMixin from '@/mixins/alertMixin';

export default {
  mixins: [alertMixin],
  computed: {
    userDeclaration: {
      get() { return this.$store.state.userDeclaration; },
      set(value) { this.$store.commit('setUserDeclaration', value); }
    },
  },
  data() {
    return {
    };
  },
  methods: {
    previous() {
      return this.$router.go(-1);
    },
    async save() {
      try {
        await this.saveApplication();
        this.setSuccessAlert('Success! ECEWE appcliation has been saved.');
      } catch (error) {
        this.setFailureAlert('An error occurred while saving ECEWE application. Please try again later.'+error);
      }
      this.processing = false;
    },
  }
};
</script>
  
<style></style>
