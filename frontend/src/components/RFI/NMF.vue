<template>
  <v-form ref="isValidForm" v-model="isValidForm" :class="isLoading ? 'ccof-skeleton-loader' : ''">
    <v-container class="px-xl-12">
      <div class="text-center pt-4">
        <p class="text-h5">
          Child Care Operating Funding Program - {{ formattedProgramYear }} Program Confirmation Form
        </p>
        <p class="text-h5 font-weight-bold">Parent Fees – Request for Information</p>
        <br />
        <FacilityHeader
          :facility-account-number="currentFacility?.facilityAccountNumber"
          :facility-name="currentFacility.facilityName"
          :license-number="currentFacility?.licenseNumber"
        />
      </div>

      <div class="px-2 my-10">
        <p>
          As outlined in the <a :href="fundingUrl" target="_blank">Funding Guidelines</a>, applications by New,
          New-to-CCFRI, and Modified Facilities will be assessed based on whether the facility’s parent fees are
          comparable to others in their region. To determine if this policy applies to your facility, please provide
          more information.
        </p>
      </div>
      <v-card elevation="6" class="pa-0 my-10 rounded-lg col-12" min-height="230">
        <v-card-text class="pa-0">
          <v-card class="pa-4 pa-md-4 ma-0 backG rounded-lg rounded-b-0 elevation-0">
            <span class="text-h5 px-2 px-md-8 font-weight-bold blueText">
              New, New-to-CCFRI, and Modified Facilities Information
            </span>
          </v-card>
          <div class="px-md-12 px-7 py-10">
            <p class="text-h6 text--primary my-0">
              1. Did you apply for Ministry funding to create new licensed spaces prior to April 1, 2021 (e.g. New
              Spaces Fund, UBCM Community Child Care Space Creation Program, Start-up Grants, Rapid Renovation Funding)?
            </p>
            <v-radio-group v-model="model.supportNeeds" required inline label="" :disabled="isReadOnly" :rules="rules">
              <v-radio label="Yes" value="Yes" />
              <v-radio label="No" value="No" />
            </v-radio-group>
            <div v-if="model.supportNeeds === 'Yes'">
              <div class="text-h6 text--primary pt-2">
                <p>
                  Please enter your Project ID, Funding Program, and Application Date. If you are not sure what your
                  Project ID is, call Child Care Capital and Community Services at 1-888-338-6622 (Option 5).
                </p>
                <v-textarea
                  v-model="model.supportNeedsComments"
                  required
                  variant="outlined"
                  name="input-7-4"
                  label="Type here"
                  :disabled="isReadOnly"
                  :rules="rules"
                />
              </div>
            </div>
          </div>
          <div class="px-md-12 px-7 pb-10">
            <p class="text-h6 text--primary my-0">
              2. Does your facility provide additional services (such as meals or other wrap-around services), to
              support families experiencing vulnerability and/or underserved populations, such as Indigenous or
              low-income families?
            </p>
            <v-radio-group
              v-model="model.lowIncomeFamilies"
              required
              inline
              label=""
              :disabled="isReadOnly"
              :rules="rules"
            >
              <v-radio label="Yes" value="Yes" />
              <v-radio label="No" value="No" />
            </v-radio-group>
            <div v-if="model.lowIncomeFamilies === 'Yes'" class="text-h6 text--primary pt-2">
              <p>Please describe the service(s) and associated expenses.</p>
              <v-textarea
                v-model="model.lowIncomeFamiliesComments"
                required
                variant="outlined"
                name="input-7-4"
                label="Type here"
                :disabled="isReadOnly"
                :rules="rules"
              />
            </div>
          </div>
          <div class="px-md-12 px-7 pb-10">
            <p class="text-h6 text--primary my-0">
              3. Do you provide transportation to/from your facility to support families in rural or remote communities
              who may not otherwise be able to access child care?
            </p>
            <v-radio-group
              v-model="model.remoteCommunities"
              required
              inline
              label=""
              :disabled="isReadOnly"
              :rules="rules"
            >
              <v-radio label="Yes" value="Yes" />
              <v-radio label="No" value="No" />
            </v-radio-group>
            <div v-if="model.remoteCommunities === 'Yes'" class="text-h6 text--primary pt-2">
              <p>Please describe the service(s) and associated expenses.</p>
              <v-textarea
                v-model="model.remoteCommunitiesComments"
                required
                variant="outlined"
                name="input-7-4"
                label="Type here"
                :disabled="isReadOnly"
                :rules="rules"
              />
            </div>
          </div>

          <div class="px-md-12 px-7 pb-10">
            <p class="text-h6 text--primary my-0">
              4. Please tell us anything else you’d like us to know about how your facility’s business case supports
              setting fees higher than the Affordability Benchmarks outlined in the 2023-24
              <a :href="fundingUrl" target="_blank">Funding Guidelines</a>
            </p>
            <div class="pt-6">
              <v-textarea
                v-model="model.otherComments"
                variant="outlined"
                name="input-7-4"
                label="Type here"
                :disabled="isReadOnly"
              />
            </div>
          </div>
        </v-card-text>
      </v-card>
      <NavButton
        :is-next-displayed="true"
        :is-save-displayed="true"
        :is-save-disabled="isReadOnly"
        :is-next-disabled="!isValidForm"
        :is-processing="isProcessing"
        @previous="previous"
        @next="next"
        @validate-form="validateForm()"
        @save="save(true)"
      />
    </v-container>
  </v-form>
</template>

<script>
import { mapActions, mapState } from 'pinia';
import { useAppStore } from '../../store/app.js';
import { useApplicationStore } from '../../store/application.js';
import { useNmfAppStore } from '../../store/nmfApp.js';
import { useNavBarStore } from '../../store/navBar.js';

import alertMixin from '../../mixins/alertMixin.js';
import NavButton from '../../components/util/NavButton.vue';
import FacilityHeader from '../guiComponents/FacilityHeader.vue';

let model = { x: [] };

export default {
  name: 'CcfriRequestMoreInfo',
  components: { NavButton, FacilityHeader },
  mixins: [alertMixin],
  async beforeRouteLeave(_to, _from, next) {
    if (!this.isReadOnly) await this.save(false);
    next();
  },
  data() {
    return {
      model,
      rules: [(v) => !!v || 'Required.'],
      isLoading: true,
      isProcessing: false,
      isValidForm: false,
    };
  },
  computed: {
    ...mapState(useApplicationStore, ['formattedProgramYear']),
    ...mapState(useNmfAppStore, ['nmfModel']),
    ...mapState(useNavBarStore, ['navBarList', 'nextPath', 'previousPath', 'getNavByCCFRIId']),
    ...mapState(useAppStore, ['getFundingUrl']),
    currentFacility() {
      //return this.getNavByCCFRIId(this.$route.params.urlGuid);
      return this.navBarList.find((el) => el.ccfriApplicationId == this.$route.params.urlGuid);
    },
    isReadOnly() {
      return !this.currentFacility.unlockNmf;
    },
    fundingUrl() {
      return this.getFundingUrl(this.programYearId);
    },
  },
  watch: {
    '$route.params.urlGuid': {
      async handler() {
        let ccfriId = this.$route.params.urlGuid;
        console.log('ccfriId = ', ccfriId);
        await this.loadNmf(ccfriId);
        this.isLoading = false;
      },
      immediate: true,
      deep: true,
    },
    nmfModel: {
      handler() {
        this.model = { ...this.nmfModel };
        this.$refs.form?.resetValidation();
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    ...mapActions(useNavBarStore, ['setNavBarNMFComplete']),
    ...mapActions(useNmfAppStore, ['loadNmf', 'saveNmf', 'setNmfModel', 'setIsNmfComplete', 'setHasNmf']),
    next() {
      this.$router.push(this.nextPath);
    },
    validateForm() {
      this.$refs.isValidForm?.validate();
    },
    previous() {
      this.$router.push(this.previousPath);
    },
    async save(showNotification) {
      this.isProcessing = true;
      try {
        this.setNmfModel({ ...this.model, isNmfComplete: this.isValidForm });
        let ccfriId = this.$route.params.urlGuid;
        let nmfId = await this.saveNmf(ccfriId);
        if (nmfId) {
          this.model.nmfId = nmfId;
        }
        this.setNavBarNMFComplete({ ccfriId: ccfriId, complete: this.isValidForm });
        if (showNotification) {
          this.setSuccessAlert('Success! RFI information has been saved.');
        }
      } catch (error) {
        console.log(error);
        this.setFailureAlert('An error occurred while saving. Please try again later.');
      }
      this.isProcessing = false;
    },
  },
};
</script>

<style scoped>
.backG {
  background-color: lightgray;
}

.blueText {
  color: rgb(0, 52, 102);
}
</style>
