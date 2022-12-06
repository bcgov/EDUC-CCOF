<template>
  <v-form ref="form" v-model="isValidForm">
    <v-container>
      <v-row justify="center">
        <div
          class="pa-10 text-h5"
          v-text="'Child Care Operating Fund Program - 2022/23 Program Confirmation Form'" />
      </v-row >

      <v-row justify="space-around">
        <v-card class="cc-top-level-card justify-center" width="800">
            <v-card-text> Organization Mailing Address
                Do your current license and service details match the information found in
                Schedule A of your most recent Funding Agreement?
            </v-card-text>
            <v-row>
              <v-col class="d-flex justify-center">
                <v-radio-group row v-model="radioGroup" >
                  <v-radio
                    label="Yes"
                    value="true"/>
                  <v-radio
                    label="No"
                    value="false"/>
                </v-radio-group>
              </v-col>                
            </v-row>
        </v-card>
      </v-row>
      <v-row justify="space-around">
        <v-btn color="info" outlined x-large>Back</v-btn>
        <v-btn color="secondary" outlined x-large @click="next()" :disabled="!isValidForm">Next</v-btn>
        <v-btn color="primary" outlined x-large :loading="processing" @click="save()">Save</v-btn>
      </v-row>
    </v-container>
  </v-form>
</template>
<script>

import { mapGetters, mapState} from 'vuex';
import { PATHS } from '@/utils/constants';
import rules from '@/utils/rules';

export default {
  data() {
    return {
      rules,
      processing: false,
      isValidForm: true,
      radioGroup: undefined,
    };
  },  
  computed: {
    ...mapGetters('auth', ['userInfo']),
    ...mapState('app', ['navBarList']),
    currentYearTwoDigit() {
      return this.currentYear - 2000;
    },
    nextYearTwoDigit() {
      return this.currentYear - 1999;
    },
    filteredList() {
      if (this.input === '' || this.input === ' ' || this.input === null){
        return this.navBarList;
      }
      return this.navBarList.filter((fac) => fac.facilityName.toLowerCase().includes(this.input.toLowerCase()));
    },
    getApplicationStatus(){
      return this.userInfo.applicationStatus === null;
    },
    
  },
  methods: {

    clicked (){
      console.log('clicked');
      return '';

    },
    goToCCFRI() {
      this.$router.push(PATHS.ccfriHome); //TODO: change this, from CCOF page
    },
    
  },
};
</script>

<style scoped>

.blueBorder{
  border-top: 5px solid #003366 !important;
}

  
</style>
