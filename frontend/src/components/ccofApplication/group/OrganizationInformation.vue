<template>
  <v-form ref="form" v-model="isValidForm" :class="loading ? 'ccof-skeleton-loader' : ''">
    <v-container>
      <span>
        <v-row justify="space-around">
          <v-card class="cc-top-level-card" width="1200">
            <v-card-title class="justify-center pb-0">
              <h3>Organization Information</h3>
            </v-card-title>
            <v-row>
              <v-card width="100%" class="mx-3 my-10" v-if="isSomeChangeRequestActive() && isLocked">
                <v-row>
                  <v-col class="py-0">
                    <v-card-title class="py-1 noticeAlert">
                      <span style="float:left">
                    <v-icon
                      x-large
                      class="py-1 px-3 noticeAlertIcon">
                      mdi-alert-octagon
                    </v-icon>
                    </span>
                    You have a change request in progress.
                    </v-card-title>
                  </v-col>
                </v-row>
                <v-card-text>
                  We will complete the assessment of your Program Confirmation Form once your change has been processed.<br><br>
                  <br>
                </v-card-text>
              </v-card>
            </v-row>
            <v-container>
              <v-row>
                <v-col>
                  <v-text-field :disabled="isLocked" outlined required v-model="model.legalName" :rules="rules.required"
                    label="Legal Name (first, middle and last) or Organization (as it appears in BC corporate Registry)" />
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                    <v-text-field :disabled="isLocked" outlined :rules="validateIncorporationNumber(model.organizationType, model.incNumber)" v-model="model.incNumber" label="Incorporation Number (as it appears in BC Corporate Registry)" />
                </v-col>
            </v-row>
              <v-divider></v-divider>

              <v-card-subtitle> Organization Mailing Address </v-card-subtitle>

              <v-row>
                <v-col>
                  <v-text-field :disabled="isLocked" outlined required v-model="model.address1" :rules="rules.required"
                    label="Mailing Address" />
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field :disabled="isLocked" outlined required v-model="model.city1" :rules="rules.required"
                    label="City/Town" />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field :disabled="isLocked" outlined required v-model="model.postalCode1"
                    :rules="[...rules.required, ...rules.postalCode]" label="Postal Code" />
                </v-col>
              </v-row>

              <v-divider></v-divider>

              <v-card-subtitle><v-checkbox :disabled="isLocked" @click="isSameAddressChecked()"
                  v-model="model.isSameAsMailing"
                  label="Organization Street Address same as Mailing Address"></v-checkbox></v-card-subtitle>
              <div v-if="!model.isSameAsMailing">
                <v-row>
                  <v-col>
                    <v-text-field :disabled="isLocked" :rules="rules.required" outlined v-model="model.address2"
                      label="Street Address" />
                  </v-col>
                </v-row>

                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field :disabled="isLocked" outlined :rules="rules.required" v-model="model.city2"
                      label="City/Town" />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field :disabled="isLocked" outlined v-model="model.postalCode2"
                      :rules="[...rules.required, ...rules.postalCode]" label="Postal Code" />
                  </v-col>
                </v-row>
              </div>

              <v-divider></v-divider>

              <v-card-subtitle> Contact Information </v-card-subtitle>
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field :disabled="isLocked" outlined required v-model="model.contactName" :rules="rules.required"
                    label="Organization Contact Name" />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field :disabled="isLocked" outlined required v-model="model.position" :rules="rules.required"
                    label="Position" />
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field :disabled="isLocked" outlined required v-model="model.phone"
                    :rules="[...rules.required, rules.phone]" label="Business Phone" />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field readonly :disabled="isLocked" outlined required v-model="businessId"
                    label="Business BCeID" />
                </v-col>
              </v-row>

              <v-divider></v-divider>

              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field :disabled="isLocked" outlined required v-model="model.email" type="email"
                    :rules="[...rules.required, ...rules.email]" label="E-mail Address of Signing Authority" />
                </v-col>
              </v-row>

              <v-divider></v-divider>

              <v-row>
                <v-col>
                  <v-card-subtitle> Type of Organization </v-card-subtitle>
                  <v-radio-group :disabled="isLocked" v-model="model.organizationType" :rules="rules.required"
                    label="">
                    <v-radio v-for="item in this.organizationTypeList" :key="item.id" :label="item.name" :value="item.id"></v-radio>
                  </v-radio-group>
                </v-col>
              </v-row>

            </v-container>
          </v-card>
        </v-row>
      </span>
      <NavButton :isNextDisplayed="true" :isSaveDisplayed="true"
        :isSaveDisabled="isLocked" :isNextDisabled="!isValidForm" :isProcessing="processing"
        @previous="back" @next="next" @validateForm="validateForm()" @save="save(true)"></NavButton>
    </v-container>
  </v-form>
</template>

<script>

import organizationMixin from '@/mixins/organizationMixin';
import { mapGetters, mapState } from 'vuex';
import { ORGANIZATION_PROVIDER_TYPES } from '@/utils/constants';
import {isAnyChangeRequestActive } from '@/utils/common';
import { isReadonly } from 'vue';


export default {
  mixins: [organizationMixin],
  data() {
    return {
      providerType: ORGANIZATION_PROVIDER_TYPES.GROUP
    };
  },
  computed: {
    ...mapGetters('app', ['renewalYearLabel', 'currentYearLabel']),
    ...mapState('reportChanges', ['changeRequestStore',]),
  },
  methods: {
    isSomeChangeRequestActive(){
      //Status of : "Submitted" "Action Required";
      return isAnyChangeRequestActive(this.changeRequestStore);
    },
  }
};

</script>
