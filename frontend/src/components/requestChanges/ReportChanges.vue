<template>
  <v-container>
    <div class="row pt-4 justify-center text-center">
      <span class="text-h5">Child Care Operating Funding Program</span>
    </div>
    <br />
    <br />

    <v-form ref="isValidForm" v-model="isValidForm">
      <v-container>
        <p class="text-h6 text-center">What changes do you want to request?</p>
        <v-row>
          <v-col v-if="showAddNewFacility" cols="12" md="6" xl="4">
            <SmallCard>
              <template #content>
                <div class="px-10">
                  <p class="text-h6 text-center">Add a new facility to an existing organization</p>
                  <p class="px-2 text-center">
                    This will lead you through the CCOF application process. Please have your facility, CCFRI and ECE-WE
                    information ready.
                  </p>
                  <br />
                  <p class="px-2 text-center">
                    You will need to attach a Community Care and Assisted Living Act licence.
                  </p>
                </div>
              </template>
              <template #button>
                <v-row no-gutters justify="space-around">
                  <v-btn dark class="blueButton mb-10" :loading="processing" @click="routeToFacilityAdd()">
                    Add new facility
                  </v-btn>
                </v-row>
              </template>
            </SmallCard>
          </v-col>
          <v-col
            v-if="hasPermission(PERMISSIONS.LICENCE_CHANGE, PERMISSIONS.ORGANIZATION_CHANGE, PERMISSIONS.OTHER_CHANGES)"
            cols="12"
            md="6"
            xl="4"
          >
            <SmallCard>
              <template #content>
                <div class="px-10">
                  <p class="text-h6 text-center">Report changes to your Licence or service</p>
                  <p class="px-2 text-center">
                    Please have your <i>Community Care And Assisted Living Act</i> licence (if required) and other
                    supporting documents ready.
                  </p>
                </div>
              </template>
              <template #button>
                <v-row justify="space-around">
                  <v-btn dark class="blueButton mb-10" :loading="processing" @click="goToChangeDialogue()">
                    Upload a Change Notification Form
                  </v-btn>
                </v-row>
              </template>
            </SmallCard>
          </v-col>
          <v-col v-if="hasPermission(PERMISSIONS.MTFI)" cols="12" md="6" xl="4">
            <SmallCard :disable="!isMtfiEnabled()">
              <template #content>
                <div class="px-10">
                  <p class="text-h6 text-center">Mid-Term Fee Increase (MTFI)</p>
                  <p class="px-2 text-center">
                    Request a parent fee increase for a facility after you have received approval for the CCFRI.
                  </p>
                  <br />
                  <p class="px-2 text-center">You may need to provide details about your expenses.</p>
                </div>
              </template>
              <template #button>
                <v-row no-gutters justify="space-around">
                  <v-btn
                    dark
                    class="mb-10"
                    :class="buttonColor(!isMtfiEnabled())"
                    :disable="!isMtfiEnabled()"
                    :loading="processing"
                    @click="goToMTFI()"
                  >
                    Request change to parent fees
                  </v-btn>
                </v-row>
              </template>
            </SmallCard>
          </v-col>
        </v-row>

        <v-row id="change-request-history" no-gutters>
          <v-col class="col-lg-12 mt-10">
            <h2 v-if="viewOlderRequestActive">Change History Archive</h2>
            <h2 v-else>Change History</h2>
          </v-col>
        </v-row>
        <v-row v-if="processing">
          <v-col>
            <v-skeleton-loader :loading="processing" type="paragraph, text@3, text@3, paragraph" />
          </v-col>
        </v-row>
        <v-data-table
          v-else
          :headers="headers"
          :items="viewOlderRequestActive ? pastChangeRequests : currentChangeRequests"
          :height="maxChangeHistoryTableHeight"
          mobile-breakpoint="md"
          fixed-header
          class="elevation-4 my-4"
          disable-pagination
          hide-default-footer
          :sort-by="['priority', 'submissionDate']"
          :sort-desc="[true, true]"
        >
          <template #item.facilityNames="{ item }">
            <v-tooltip location="top">
              <template #activator="{ props }">
                <div class="tableText" :style="maxfacilityNamesStringLength" v-bind="props">
                  {{ item.facilityNames }}
                </div>
              </template>
              <div class="tableTooltip">
                {{ item.facilityNames }}
              </div>
            </v-tooltip>
          </template>
          <template #item.externalStatus="{ item }">
            <span :class="['tableText', getChangeRequestStyle(item.externalStatus)]">
              {{ item.externalStatus }}
            </span>
          </template>
          <template #item.actions="{ item }">
            <v-btn
              v-if="isContinueButtonDisplayed(item)"
              class="blueOutlinedButton mr-3 my-2"
              variant="outlined"
              :width="changeHistoryButtonWidth"
              @click="continueButton(item.changeType, item.changeActionId, item.changeRequestId, item.index)"
            >
              Continue
            </v-btn>
            <v-btn
              v-if="isViewButtonDisplayed(item.externalStatus)"
              class="blueOutlinedButton mr-3 my-2"
              variant="outlined"
              :width="changeHistoryButtonWidth"
              @click="continueButton(item.changeType, item.changeActionId, item.changeRequestId, item.index)"
            >
              View
            </v-btn>
            <v-btn
              v-if="isUpdateButtonDisplayed(item)"
              class="blueOutlinedButton mr-3 my-2"
              variant="outlined"
              :width="changeHistoryButtonWidth"
              @click="updateButton(item.changeType, item.changeActionId, item.changeRequestId)"
            >
              Update
            </v-btn>
            <v-btn
              v-if="isCancelButtonDisplayed(item)"
              class="blueOutlinedButton my-2"
              variant="outlined"
              :width="changeHistoryButtonWidth"
              @click="
                confirmCancelChangeRequest(
                  item.changeRequestId,
                  item.changeTypeString,
                  item.externalStatus,
                  item.submissionDateString,
                )
              "
            >
              Cancel
            </v-btn>
          </template>
        </v-data-table>

        <v-btn @click="viewOlderRequestActive = !viewOlderRequestActive">
          <p v-if="!viewOlderRequestActive" class="ma-0 pa-0">View Older</p>
          <p v-else class="ma-0 pa-0">View Current</p>
        </v-btn>

        <AppDialog
          v-model="dialog"
          persistent
          max-width="525px"
          :title="'Cancel a change request'"
          @close="dialog = false"
        >
          <template #content>
            <p style="margin-bottom: 16px">Are you sure you want to cancel this change request?</p>
            <p style="margin-bottom: 16px">[{{ cancelChangeRequestType }}] [{{ cancelChangeRequestStatus }}]</p>
            <p style="margin-bottom: 16px">
              You will not be able to resume a cancelled request. They will be viewable in your change history.
            </p>
          </template>
          <template #button>
            <v-col cols="12" class="d-flex justify-center">
              <AppButton :primary="false" :loading="processing" class="mr-10" @click="dialog = false">
                Cancel
              </AppButton>
              <AppButton :primary="true" :loading="processing" @click="cancel()"> Continue </AppButton>
            </v-col>
          </template>
        </AppDialog>
      </v-container>
    </v-form>

    <NavButton
      :is-next-displayed="false"
      :is-save-displayed="false"
      :is-next-disabled="true"
      :is-processing="processing"
      @previous="previous"
      @next="false"
      @validate-form="validateForm()"
      @save="save(true)"
    />
  </v-container>
</template>

<script>
import { useAppStore } from '@/store/app.js';
import { useApplicationStore } from '@/store/application.js';
import { useOrganizationStore } from '@/store/ccof/organization.js';
import { useNavBarStore } from '@/store/navBar.js';
import { useReportChangesStore } from '@/store/reportChanges.js';
import _ from 'lodash';
import { mapActions, mapState } from 'pinia';

import AppButton from '@/components/guiComponents/AppButton.vue';
import AppDialog from '@/components/guiComponents/AppDialog.vue';
import SmallCard from '@/components/guiComponents/SmallCard.vue';
import NavButton from '@/components/util/NavButton.vue';
import alertMixin from '@/mixins/alertMixin.js';
import permissionsMixin from '@/mixins/permissionsMixin.js';
import { isFacilityAvailable } from '@/utils/common.js';
import { CHANGE_TYPES, changeUrl, changeUrlGuid, ORGANIZATION_PROVIDER_TYPES, PATHS } from '@/utils/constants.js';
import { formatFiscalYearName, formatUTCDateToLocal } from '@/utils/format';
import { get } from 'lodash';

export default {
  name: 'ReportChange',
  components: { SmallCard, AppButton, AppDialog, NavButton },
  mixins: [alertMixin, permissionsMixin],
  beforeRouteLeave(_to, _from, next) {
    next();
  },
  data() {
    return {
      viewOlderRequestActive: false,
      search: '',
      isValidForm: false,
      processing: false,
      loading: false,
      rules: [(v) => !!v || 'Required.'],
      headersGroup: [
        { title: 'Change Requests', value: 'changeTypeString', class: 'tableHeader' },
        { title: 'Fiscal Year', value: 'fiscalYear', class: 'tableHeader' },
        { title: 'Facility(s) name', value: 'facilityNames', class: 'tableHeader' },
        { title: 'Status', value: 'externalStatus', class: 'tableHeader' },
        { title: 'Submission Date', value: 'submissionDateString', class: 'tableHeader' },
        { title: ' ', value: 'actions', align: 'start', sortable: false },
      ],
      headersFamily: [
        { title: 'Change Requests', value: 'changeTypeString', class: 'tableHeader' },
        { title: 'Fiscal Year', value: 'fiscalYear', class: 'tableHeader' },
        { title: 'Status', value: 'externalStatus', class: 'tableHeader' },
        { title: 'Submission Date', value: 'submissionDateString', class: 'tableHeader' },
        { title: ' ', value: 'actions', align: 'start', sortable: false },
      ],
      changeHistoryButtonWidth: '88px',
      dialog: false,
      cancelChangeRequestId: undefined,
      cancelChangeRequestType: undefined,
      cancelChangeRequestStatus: undefined,
      cancelChangeRequestSubmissionDate: undefined,
      endStateStatusesCR: ['Ineligible', 'Approved', 'Cancelled'],
    };
  },
  computed: {
    ...mapState(useAppStore, ['programYearList']),
    ...mapState(useApplicationStore, ['applicationStatus', 'formattedProgramYear', 'applicationId', 'programYearId']),
    ...mapState(useReportChangesStore, ['changeRequestStore', 'mtfiFacilities']),
    ...mapState(useOrganizationStore, ['organizationProviderType']),
    ...mapState(useNavBarStore, ['userProfileList']),
    isReadOnly() {
      if (this.unlockedFacilities) {
        return false;
      }
      return this.applicationStatus === 'SUBMITTED';
    },
    allChangeRequests() {
      let allChangeRequests = [];
      if (this.changeRequestStore?.length > 0) {
        // FUTURE RELEASE - filter by Program Year
        // allChangeRequests = this.changeRequestStore?.filter(changeRequest => this.isCurrentOrFuture(changeRequest.programYearId));
        allChangeRequests = this.changeRequestStore?.map((changeRequest, index) => {
          let sortedChangeActions = this.sortChangeActions(changeRequest, 'desc');
          return {
            index: index,
            changeRequestId: changeRequest?.changeRequestId,
            changeActionId: sortedChangeActions[0]?.changeActionId,
            changeType: sortedChangeActions[0]?.changeType,
            changeTypeString: this.getChangeTypeString(sortedChangeActions[0]?.changeType),
            fiscalYear: this.getProgramYearString(changeRequest.programYearId),
            programYearId: changeRequest.programYearId,
            facilityNames: this.createFacilityNameString(changeRequest.changeActions),
            internalStatus: this.getInternalStatusString(changeRequest.status),
            externalStatus: this.getExternalStatusString(changeRequest.externalStatus),
            submissionDate: changeRequest?.firstSubmissionDate,
            submissionDateString: this.getSubmissionDateString(changeRequest?.firstSubmissionDate),
            priority: changeRequest?.priority,
          };
        });
      }

      return allChangeRequests;
    },
    getPrevProgramYearId() {
      return this.programYearList.list.find(({ programYearId }) => programYearId === this.programYearId).previousYearId;
    },
    currentChangeRequests() {
      return this.allChangeRequests.filter(
        (el) =>
          el.programYearId === this.programYearId ||
          (el.programYearId === this.getPrevProgramYearId &&
            (el.externalStatus === 'In Progress' ||
              el.externalStatus === 'Submitted' ||
              el.externalStatus === 'Action Required')),
      );
    },
    pastChangeRequests() {
      return this.allChangeRequests.filter((el) => el.programYearId != this.programYearId);
    },
    // Table should be vertically scrollable once rows > 8
    maxChangeHistoryTableHeight() {
      return this.allChangeRequests?.length > 8 ? 53 * 9 : undefined;
    },
    headers() {
      return this.organizationProviderType === ORGANIZATION_PROVIDER_TYPES.GROUP
        ? this.headersGroup
        : this.headersFamily;
    },
    maxfacilityNamesStringLength() {
      if (this.$vuetify.display.width > 3500) {
        return '--maxLength: 700px';
      }
      switch (this.$vuetify.display.name) {
        case 'xl':
          return '--maxLength: ' + (Math.floor(this.$vuetify.display.width / 10) + 350) + 'px';
        case 'lg':
          return '--maxLength: ' + Math.floor(this.$vuetify.display.width / 10) + 'px';
        case 'md':
          return '--maxLength: ' + (Math.floor(this.$vuetify.display.width / 10) + 300) + 'px';
        case 'sm':
          return '--maxLength: ' + (Math.floor(this.$vuetify.display.width / 10) + 300) + 'px';
        case 'xs':
          return '--maxLength: ' + (Math.floor(this.$vuetify.display.width / 10) + 100) + 'px';
        default:
          return '--maxLength: 100px';
      }
    },
    unlockCCFRIList() {
      let unlockList = [];
      this.userProfileList?.forEach((facility) => {
        if (facility.unlockCcfri) unlockList.push(facility.ccfriApplicationId);
      });
      return unlockList;
    },
    unlockNMFList() {
      let unlockList = [];
      this.userProfileList?.forEach((facility) => {
        if (facility.unlockNmf) unlockList.push(facility.ccfriApplicationId);
      });
      return unlockList;
    },
    unlockRFIList() {
      let unlockList = [];
      this.userProfileList?.forEach((facility) => {
        if (facility.unlockRfi) unlockList.push(facility.ccfriApplicationId);
      });
      return unlockList;
    },
    showAddNewFacility() {
      return (
        this.hasPermission(this.PERMISSIONS.ADD_NEW_FACILITY) &&
        this.organizationProviderType === ORGANIZATION_PROVIDER_TYPES.GROUP
      );
    },
  },
  async mounted() {
    this.processing = true;
    await this.getChangeRequestList();
    this.processing = false;
  },
  created() {
    this.ORGANIZATION_PROVIDER_TYPES = ORGANIZATION_PROVIDER_TYPES;
  },
  methods: {
    ...mapActions(useReportChangesStore, [
      'getChangeRequestList',
      'createChangeRequest',
      'cancelChangeRequest',
      'getChangeRequest',
      'setChangeRequestId',
      'setChangeActionId',
    ]),

    previous() {
      this.$router.back();
    },
    // FUTURE RELEASE - filter change request to be displayed in Change History by Program Year
    // isCurrentOrFuture(programYearId) {
    //   let currentFutureYears = this.programYearList?.list?.map(programYear => {
    //     if (['CURRENT','FUTURE'].includes(programYear.status)) {
    //       return programYear.programYearId;
    //     }
    //   });
    //   return currentFutureYears?.includes(programYearId);
    // },
    getProgramYearString(programYearId) {
      const label = this.programYearList?.list?.find(
        (programYear) => programYear.programYearId === programYearId,
      )?.name;
      return formatFiscalYearName(label);
    },
    getChangeTypeString(changeType) {
      switch (changeType) {
        case 'PDF_CHANGE':
          return 'Report other changes';
        case 'NEW_FACILITY':
          return 'Add new facility(s)';
        case 'PARENT_FEE_CHANGE':
          return 'Mid-Term Fee Increase';

        default:
          return 'New Category'; //I put this there because past Report Other Change types were incorrectly mapped to New Category
      }
    },
    createFacilityNameString(changeActions) {
      //TODO - add more logic to grab facility name from relevent change request. IE: MTFI

      //did it this way so if there are many change Actions, it checks all of them to see if there is a new facility. Maybe change in the future
      if (!changeActions.find((el) => el.changeType === 'NEW_FACILITY')) {
        return '- - - -';
      }

      let str = '';

      //change in backend, only returns 1 at a time rn
      let action = changeActions.find((el) => el.changeType === 'NEW_FACILITY');
      if (action?.facilities) {
        action.facilities.forEach((fac) => (str = str + `${fac.facilityName}, `));
      }
      return str.slice(0, -2);
    },
    getExternalStatusString(status) {
      switch (status) {
        case 1:
          return 'In Progress';
        case 2:
          return 'Submitted';
        case 3:
          return 'Action Required';
        case 4:
          return 'Ineligible';
        case 5:
          return 'Approved';
        case 6:
          return 'Cancelled';
        default:
          return 'Unknown'; //should never happen!
      }
    },
    getInternalStatusString(status) {
      switch (status) {
        case 1:
          return 'Incomplete';
        case 3:
          return 'Submitted';
        case 4:
          return 'Processing';
        case 5:
          return 'WITH_PROVIDER';
        case 6:
          return 'Ineligible';
        case 7:
          return 'Approved';
        case 8:
          return 'Cancelled';
        default:
          return 'Unknown'; //should never happen!
      }
    },
    getSubmissionDateString(date) {
      return date ? formatUTCDateToLocal(date) : '- - - -';
    },
    getChangeRequestStyle(status) {
      return status === 'Action Required' ? 'redText' : '';
    },
    next() {
      this.$router.push(PATHS.ROOT.HOME);
    },
    routeToFacilityAdd() {
      this.$router.push(PATHS.ROOT.CHANGE_NEW_FACILITY);
    },
    async continueButton(changeType, changeActionId = null, changeRequestId = null, index) {
      this.processing = true;
      let sortedChangeActions = this.sortChangeActions(this.changeRequestStore[index], 'desc');
      if (changeType === 'PDF_CHANGE') {
        this.goToChangeForm(changeActionId, changeRequestId);
      } else if (changeType === 'NEW_FACILITY') {
        this.setChangeRequestId(changeRequestId);
        this.setChangeActionId(changeActionId);
        this.$router.push(
          changeUrlGuid(PATHS.CCOF_GROUP_FACILITY, changeRequestId, sortedChangeActions[0].facilities[0].facilityId),
        );
      } else if (changeType === 'PARENT_FEE_CHANGE') {
        this.setChangeRequestId(changeRequestId);
        this.setChangeActionId(changeActionId);

        if (this.organizationProviderType === ORGANIZATION_PROVIDER_TYPES.FAMILY) {
          // i need to load the new CCFRI id here then
          await this.getChangeRequest(changeRequestId);
          this.$router.push(
            changeUrlGuid(
              PATHS.MTFI_GROUP_FEE_VERIFICATION,
              changeRequestId,
              this.mtfiFacilities[0]?.ccfriApplicationId,
              CHANGE_TYPES.MTFI,
            ),
          ); //dont think this will work!
          //this.$router.push(changeUrl(PATHS.MTFI_INFO, changeRequestId, CHANGE_TYPES.MTFI));
        } else {
          this.$router.push(changeUrl(PATHS.MTFI_GROUP_SELECT_FACILITY, changeRequestId, CHANGE_TYPES.MTFI));
        }
      }
    },
    notificationFormActionRequiredRoute(changeActionId, changeRequestId) {
      // let currentCR = this.changeRequestStore?.find(el=>el.changeRequestId===changeRequestId);
      // if (currentCR?.unlockChangeRequest || currentCR?.unlockOtherChangesDocuments) {
      //   this.goToChangeForm(changeActionId, changeRequestId);
      // } else if (currentCR?.unlockDeclaration) {
      //   this.$router.push(changeUrl(PATHS.SUMMARY_DECLARATION, changeRequestId, CHANGE_TYPES.CHANGE_NOTIFICATION));
      // } else {
      this.goToChangeForm(changeActionId, changeRequestId);
      //}
    },
    newFacilityActionRequiredRoute(changeRequestId) {
      const currentCR = this.changeRequestStore?.find((el) => el.changeRequestId === changeRequestId);
      // const unlockChangeRequest = this.changeRequestStore?.find(el=>el.changeRequestId===changeRequestId);
      const newFacilityChangeAction = currentCR.changeActions?.find(
        (changeAction) => changeAction.changeType === 'NEW_FACILITY',
      );
      if (currentCR?.unlockCCOF) {
        this.$router.push(
          changeUrlGuid(PATHS.CCOF_GROUP_FACILITY, changeRequestId, newFacilityChangeAction?.facilities[0].facilityId),
        );
      } else if (currentCR?.unlockLicenseUpload) {
        this.$router.push(changeUrl(PATHS.LICENSE_UPLOAD, changeRequestId));
      } else if (this.unlockCCFRIList?.length > 0) {
        this.$router.push(changeUrl(PATHS.CCFRI_HOME, changeRequestId));
      } else if (this.unlockRFIList?.length > 0) {
        this.$router.push(changeUrlGuid(PATHS.CCFRI_RFI, changeRequestId, this.unlockRFIList[0]));
      } else if (this.unlockNMFList?.length > 0) {
        this.$router.push(changeUrlGuid(PATHS.CCFRI_NMF, changeRequestId, this.unlockNMFList[0]));
      } else if (currentCR?.unlockEcewe) {
        this.$router.push(changeUrl(PATHS.ECEWE_ELIGIBILITY, changeRequestId));
      } else if (currentCR?.unlockSupportingDocuments) {
        this.$router.push(changeUrl(PATHS.SUPPORTING_DOCS, changeRequestId));
      } else if (currentCR?.unlockDeclaration) {
        this.$router.push(changeUrl(PATHS.SUMMARY_DECLARATION, changeRequestId));
      } else {
        this.$router.push(
          changeUrlGuid(PATHS.CCOF_GROUP_FACILITY, changeRequestId, newFacilityChangeAction?.facilities[0].facilityId),
        );
      }
    },
    mtfiActionRequiredRoute(changeRequestId) {
      const currentCR = this.changeRequestStore?.find((el) => el.changeRequestId === changeRequestId);
      const mtfiChangeAction = currentCR?.changeActions?.find((el) => el.changeType === 'PARENT_FEE_CHANGE');
      const mtfiFacilities = mtfiChangeAction?.mtfiFacilities;
      const unlockCCFRIList = this.getUnlockCCFRIListForMTFI(mtfiFacilities);
      const unlockRFIList = this.getUnlockRFIListForMTFI(mtfiFacilities);
      // there is no NMF for MTFI change request
      if (unlockCCFRIList?.length > 0) {
        this.$router.push(
          changeUrlGuid(PATHS.MTFI_GROUP_FEE_VERIFICATION, changeRequestId, unlockCCFRIList[0], CHANGE_TYPES.MTFI),
        );
      } else if (unlockRFIList?.length > 0) {
        this.$router.push(changeUrlGuid(PATHS.CCFRI_RFI, changeRequestId, unlockRFIList[0], CHANGE_TYPES.MTFI));
      } else {
        this.$router.push(changeUrl(PATHS.SUMMARY_DECLARATION, changeRequestId, CHANGE_TYPES.MTFI));
      }
    },
    getUnlockCCFRIListForMTFI(mtfiFacilities) {
      let unlockList = [];
      mtfiFacilities?.forEach((facility) => {
        if (facility.unlockCcfri) unlockList.push(facility.ccfriApplicationId);
      });
      return unlockList;
    },
    getUnlockRFIListForMTFI(mtfiFacilities) {
      let unlockList = [];
      mtfiFacilities?.forEach((facility) => {
        if (facility.unlockRfi) unlockList.push(facility.ccfriApplicationId);
      });
      return unlockList;
    },
    updateButton(changeType, changeActionId = null, changeRequestId = null) {
      this.processing = true;
      this.setChangeRequestId(changeRequestId);
      this.setChangeActionId(changeActionId);
      switch (changeType) {
        case 'PDF_CHANGE':
          this.notificationFormActionRequiredRoute(changeActionId, changeRequestId);
          break;
        case 'NEW_FACILITY':
          this.newFacilityActionRequiredRoute(changeRequestId);
          break;
        case 'PARENT_FEE_CHANGE':
          this.mtfiActionRequiredRoute(changeRequestId);
          break;
        default:
          break;
      }
    },
    async createNewChangeRequest(changeType) {
      let newReq;
      try {
        newReq = await this.createChangeRequest(changeType);
      } catch {
        console.log('unable to create a new Req');
        this.setFailureAlert('An error occurred while creating a new change request. Please try again later.');
      }
      return newReq;
    },
    goToChangeDialogue() {
      this.$router.push(PATHS.CHANGE_NOTIFICATION_DIALOGUE);
    },
    async goToChangeForm(changeActionId = null, changeRequestId = null) {
      this.processing = true;

      //create the change action first, then push it
      if (!changeActionId) {
        let newReq = await this.createNewChangeRequest('PDF_CHANGE');
        this.$router.push(
          changeUrlGuid(
            PATHS.CHANGE_NOTIFICATION_FORM,
            newReq?.changeRequestId,
            newReq?.changeActionId,
            CHANGE_TYPES.CHANGE_NOTIFICATION,
          ),
        );
      } else {
        this.setChangeRequestId(changeRequestId);
        this.setChangeActionId(changeActionId);
        this.$router.push(
          changeUrlGuid(
            PATHS.CHANGE_NOTIFICATION_FORM,
            changeRequestId,
            changeActionId,
            CHANGE_TYPES.CHANGE_NOTIFICATION,
          ),
        );
      }
    },
    async goToMTFI() {
      this.$router.push(PATHS.MTFI_INFO);
    },

    confirmCancelChangeRequest(requestId, requestType, requestStatus, submissionDate) {
      this.cancelChangeRequestId = requestId;
      this.cancelChangeRequestType = requestType;
      this.cancelChangeRequestStatus = requestStatus;
      this.cancelChangeRequestSubmissionDate = submissionDate;
      this.dialog = true;
    },

    async cancel() {
      this.processing = true;
      try {
        await this.cancelChangeRequest(this.cancelChangeRequestId);
        this.cancelChangeRequestId = undefined;
        this.setSuccessAlert('Success! Your change request has been cancelled.');
      } catch {
        this.setFailureAlert('An error occurred while canceling a change request. Please try again later.');
      }

      this.processing = false;
      this.dialog = false;
    },
    isViewButtonDisplayed(externalStatus) {
      return (
        this.hasPermission(this.PERMISSIONS.VIEW_A_CR) &&
        ['Submitted', 'Approved', 'Cancelled'].includes(externalStatus)
      );
    },
    isContinueButtonDisplayed(item) {
      return (
        this.hasPermission(this.getChangeRequestPermission(item.changeType)) &&
        ['In Progress'].includes(item.externalStatus)
      );
    },
    isCancelButtonDisplayed(item) {
      return (
        this.hasPermission(this.getChangeRequestPermission(item.changeType)) &&
        ['In Progress'].includes(item.externalStatus)
      );
    },
    isUpdateButtonDisplayed(item) {
      return (
        this.hasPermission(this.getChangeRequestPermission(item.changeType)) &&
        ['Action Required'].includes(item.externalStatus)
      );
    },
    getChangeRequestPermission(changeType) {
      switch (changeType) {
        case 'PDF_CHANGE':
          return [
            this.PERMISSIONS.ORGANIZATION_CHANGE,
            this.PERMISSIONS.LICENCE_CHANGE,
            this.PERMISSIONS.OTHER_CHANGES,
          ];
        case 'NEW_FACILITY':
          return [this.PERMISSIONS.ADD_NEW_FACILITY];
        case 'PARENT_FEE_CHANGE':
          return [this.PERMISSIONS.MTFI];
        default:
          return [this.PERMISSIONS.VIEW_A_CR];
      }
    },
    sortChangeActions(changeRequest, order) {
      return _.sortBy(changeRequest.changeActions, 'createdOn', order);
    },
    // CCFRI-2489
    // All the MTFI will have to be in one of the end state statutes.
    // At least 1 Facility has CCFRI status to be Approved.
    isMtfiEnabled() {
      const foundCRNotInEndStateStatus = this.allChangeRequests?.find(
        (el) => el.changeType === 'PARENT_FEE_CHANGE' && !this.endStateStatusesCR.includes(el.externalStatus),
      );
      const foundFacilityWithApprovedCCFRI = this.userProfileList?.find(
        (el) => el.ccfriStatus === 'APPROVED' && isFacilityAvailable(el),
      );
      return !foundCRNotInEndStateStatus && foundFacilityWithApprovedCCFRI;
    },
    buttonColor(isDisabled) {
      return isDisabled ? 'disabledButton' : 'blueButton';
    },
  },
};
</script>
<style scoped>
.blueButton {
  background-color: #003366 !important;
}
.blueOutlinedButton {
  color: #003366 !important;
}
:deep(.tableHeader) {
  color: rgb(0, 52, 102) !important;
  font-weight: bold !important;
  font-size: 16px !important;
}
:deep(.redText) {
  color: red !important;
}
.tableTooltip {
  max-width: 70em;
  overflow-wrap: break-word;
}
.tableText {
  max-width: var(--maxLength); /* the element needs a fixed width (in px, em, %, etc) */
  overflow: hidden; /* make sure it hides the content that overflows */
  white-space: nowrap; /* don't break the line */
  text-overflow: ellipsis; /* give the beautiful '...' effect */
}
</style>
