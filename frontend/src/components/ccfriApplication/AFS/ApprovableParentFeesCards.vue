<template>
  <v-card> This is Approvable Parent Fees card </v-card>
  <!-- <v-card
    v-for="(item, index) in CCFRIFacilityModel.childCareTypes"
    :key="index"
    elevation="6"
    class="px-0 py-0 mx-auto my-10 rounded-lg col-12"
    min-height="230"
    rounded
    tiled
    exact
    tile
    :ripple="false"
  >
    <v-card-text class="pa-0">
      <div class="pa-2 pa-md-4 ma-0 backG">
        <p class="text-h5 text--primary px-5 py-0 my-0">
          Parent Fees {{ item.programYear }}: Full-Time {{ item.childCareCategory }}
        </p>
      </div>
      <div class="px-md-12 px-7">
        <br />

        <v-radio-group v-model="item.feeFrequency" :rules="rules" label="Parent fee frequency" :disabled="true">
          <v-radio label="Daily" value="Daily" />
          <v-radio label="Monthly" value="Monthly" />
        </v-radio-group>

        <v-container v-if="!item.feeFrequency" />

        <v-container v-else class="ma-0 pa-0">
          <v-row>
            <v-col>
              <label
                >If you only offer care for <strong>4 days or fewer </strong> per week, select daily parent fee.</label
              ><br />
              <label
                >Enter your
                <strong>highest {{ item.feeFrequency?.toLowerCase() }} parent fee before CCFRI is applied</strong>
                in every month below. If there is a month where you do not charge a parent fee, enter zero.</label
              >
            </v-col>
          </v-row>
          <v-row>
            <v-col class="col-6 col-md-2">
              <v-text-field v-model="item.approvedFeeApr" :disabled="true" variant="outlined" label="Apr" prefix="$" />
            </v-col>
            <v-col class="col-6 col-md-2">
              <v-text-field v-model="item.approvedFeeMay" :disabled="true" variant="outlined" label="May" prefix="$" />
            </v-col>
            <v-col class="col-6 col-md-2">
              <v-text-field v-model="item.approvedFeeJun" :disabled="true" variant="outlined" label="Jun" prefix="$" />
            </v-col>
            <v-col class="col-6 col-md-2">
              <v-text-field v-model="item.approvedFeeJul" :disabled="true" variant="outlined" label="Jul" prefix="$" />
            </v-col>
            <v-col class="col-6 col-md-2">
              <v-text-field v-model="item.approvedFeeAug" :disabled="true" variant="outlined" label="Aug" prefix="$" />
            </v-col>
            <v-col class="col-6 col-md-2">
              <v-text-field v-model="item.approvedFeeSep" :disabled="true" variant="outlined" label="Sep" prefix="$" />
            </v-col>
          </v-row>

          <v-row>
            <v-col class="col-6 col-md-2">
              <v-text-field v-model="item.approvedFeeOct" :disabled="true" variant="outlined" label="Oct" prefix="$" />
            </v-col>
            <v-col class="col-6 col-md-2">
              <v-text-field v-model="item.approvedFeeNov" :disabled="true" variant="outlined" label="Nov" prefix="$" />
            </v-col>
            <v-col class="col-6 col-md-2">
              <v-text-field v-model="item.approvedFeeDec" :disabled="true" variant="outlined" label="Dec" prefix="$" />
            </v-col>
            <v-col class="col-6 col-md-2">
              <v-text-field v-model="item.approvedFeeJan" :disabled="true" variant="outlined" label="Jan" prefix="$" />
            </v-col>
            <v-col class="col-6 col-md-2">
              <v-text-field v-model="item.approvedFeeFeb" :disabled="true" variant="outlined" label="Feb" prefix="$" />
            </v-col>
            <v-col class="col-6 col-md-2">
              <v-text-field v-model="item.approvedFeeMar" :disabled="true" variant="outlined" label="Mar" prefix="$" />
            </v-col>
          </v-row>
        </v-container>
      </div>
    </v-card-text>
  </v-card> -->
</template>
<script>
import { mapState } from 'pinia';

import { useAppStore } from '@/store/app.js';
import { useApplicationStore } from '@/store/application.js';
import { useNavBarStore } from '@/store/navBar.js';
import { useCcfriAppStore } from '@/store/ccfriApp.js';
import { useReportChangesStore } from '@/store/reportChanges.js';

import {
  PATHS,
  pcfUrlGuid,
  pcfUrl,
  changeUrl,
  changeUrlGuid,
  CHANGE_TYPES,
  PROGRAM_YEAR_LANGUAGE_TYPES,
  ApiRoutes,
} from '@/utils/constants.js';
import alertMixin from '@/mixins/alertMixin.js';
import globalMixin from '@/mixins/globalMixin.js';
import ApiService from '@/common/apiService.js';

export default {
  name: 'ApprovableParentFeesCards',
  mixins: [alertMixin, globalMixin],
  beforeRouteLeave(_to, _from, next) {
    this.save(false);
    next();
  },
  data() {
    return {};
  },
  computed: {
    ...mapState(useAppStore, ['getFundingUrl', 'getLanguageYearLabel']),
    ...mapState(useApplicationStore, [
      'applicationStatus',
      'formattedProgramYear',
      'programYearId',
      'applicationId',
      'isRenewal',
      'fiscalStartAndEndDates',
    ]),
    ...mapState(useNavBarStore, [
      'navBarList',
      'changeRequestId',
      'changeType',
      'nextPath',
      'previousPath',
      'getNavByCCFRIId',
      'isChangeRequest',
      'getChangeActionNewFacByFacilityId',
    ]),
    ...mapState(useCcfriAppStore, [
      'CCFRIFacilityModel',
      'ccfriChildCareTypes',
      'loadedModel',
      'ccfriId',
      'getClosureDateLength',
    ]),
    ...mapState(useReportChangesStore, ['userProfileChangeRequests', 'changeRequestStatus']),
    languageYearLabel() {
      return this.getLanguageYearLabel;
    },
    programYearTypes() {
      return PROGRAM_YEAR_LANGUAGE_TYPES;
    },
  },
  methods: {},
};
</script>

<style scoped>
.blueBorder {
  border-top: 55px solid grey !important;
}

.backG {
  background-color: lightgray;
}
</style>
