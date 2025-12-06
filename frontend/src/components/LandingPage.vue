<!-- eslint-disable vue/no-v-html -->
<template>
  <Spinner v-if="!isLoadingComplete" />
  <v-container v-else fluid class="pa-12">
    <MessagesToolbar />
    <EnrolmentReportDueDialog v-if="showEnrolmentReportDialog" />

    <div v-if="organizationAccountNumber || organizationName" class="font-weight-bold pb-6 text-h5 text-center">
      <p v-if="organizationAccountNumber">Organization ID: {{ organizationAccountNumber }}</p>
      <p v-if="organizationName">Organization Name: {{ organizationName }}</p>
    </div>

    <div class="pb-12 text-h4 text-center">What would you like to do?</div>

    <AppAlertBanner v-if="showNotGoodStandingWarning" type="warning" class="mb-4 w-100">
      Your organization is not in good standing with BC Registries and Online Services. Being in good standing is a
      requirement to receive CCOF Funding. Contact BC Registries and Online Services immediately to resolve. Please
      disregard this message if you have already resolved your status.
    </AppAlertBanner>

    <v-row>
      <v-col v-if="hasPermission(PERMISSIONS.DOWNLOAD_PCF_PDF)" cols="12" :lg="isCCOFStatusNew ? 6 : 4">
        <SmallCard>
          <template #content>
            <div class="pb-2 text-h6">
              <p v-if="isCCOFApproved && getActionRequiredApplicationsForCCOFCard?.length === 0">
                Child Care Operating Funding <strong>(CCOF)</strong>
              </p>
              <p v-else>Apply for Child Care Operating Funding <strong>(CCOF)</strong> including:</p>
            </div>
            <div v-if="!isCCOFApproved || getActionRequiredApplicationsForCCOFCard?.length > 0">
              <v-container v-for="item in CCOF_NEW_APPLICATION_TEXT" :key="item.infoTitle" class="pa-0" fluid>
                <ul class="pl-6">
                  <li class="pa-0">
                    {{ item.title }}
                  </li>
                </ul>
                <v-card v-if="ccofStatus === CCOF_STATUS.NEW" color="#B3E5FF" class="mt-1 pa-1 py-2 mb-4" border="md">
                  <v-row align="center" no-gutters>
                    <v-col cols="2" sm="1" align="center">
                      <v-icon color="#003366" aria-hidden="false" size="40"> mdi-information </v-icon>
                    </v-col>
                    <v-col cols="10" sm="11" class="px-0 px-sm-2 py-1">
                      <div v-html="item.body" />
                    </v-col>
                  </v-row>
                </v-card>
              </v-container>
            </div>
            <p v-if="ccofStatus === CCOF_STATUS.NEW" class="pt-2">
              For more information, visit the government website:
              <a
                class="text-decoration-underline"
                href="https://www2.gov.bc.ca/gov/content/family-social-supports/caring-for-young-children/childcarebc-programs/child-care-operating-funding"
                >gov.bc.ca/childcareoperatingfunding</a
              >
            </p>
          </template>
          <template #button>
            <div v-if="ccofStatus === CCOF_STATUS.NEW">
              <template v-if="hasPermission(PERMISSIONS.CREATE_NEW_APPLICATION)">
                <v-btn theme="dark" class="blueButton" @click="newApplicationIntermediatePage()">
                  Start Application
                </v-btn>
                <p class="mt-4">Fiscal year runs April 1 to March 31</p>
              </template>
            </div>

            <div v-else-if="ccofStatus === CCOF_STATUS.CONTINUE">
              <template v-if="hasPermission(PERMISSIONS.CREATE_NEW_APPLICATION)">
                <p class="text-h5 blueText">Status: Incomplete</p>
                <v-btn theme="dark" class="blueButton" @click="goToCCOFOrganizationInfo()">
                  Continue Application
                </v-btn>
                <p class="mt-4">Fiscal year runs April 1 to March 31</p>
                <v-btn
                  v-if="isLoadingComplete && isCancelPcfButtonEnabled"
                  class="red-button"
                  @click="toggleCancelApplicationDialog"
                >
                  Cancel Application
                </v-btn>
              </template>
            </div>

            <div v-else>
              <div v-if="getActionRequiredApplicationsForCCOFCard?.length > 0">
                <template v-if="hasPermission(PERMISSIONS.CREATE_NEW_APPLICATION)">
                  <p class="text-h5 blueText mb-0">Status: Action Required</p>
                  <div v-for="item in getActionRequiredApplicationsForCCOFCard" :key="item.applicationId">
                    <v-btn
                      theme="dark"
                      class="blueButton my-2"
                      @click="actionRequiredOrganizationRoute(item.ccofProgramYearId)"
                    >
                      Update {{ item.ccofProgramYearName?.slice(0, -3) }} PCF
                    </v-btn>
                  </div>
                </template>
              </div>
              <div v-else>
                <p v-if="ccofApplicationStatus === APPLICATION_CCOF_STATUSES.ACTIVE" class="text-h5 blueText mb-0">
                  Status of your funding agreement for the current fiscal year: Active
                </p>
                <p v-else class="text-h5 blueText mb-0">Status: Submitted</p>
                <template v-if="hasPermission(PERMISSIONS.VIEW_SUBMITTED_PCF)">
                  <v-btn
                    v-if="applicationType === APPLICATION_TYPES.NEW_ORG"
                    theme="dark"
                    class="blueButton mt-4"
                    @click="goToCCOFOrganizationInfo()"
                  >
                    View Recent Application
                  </v-btn>
                  <v-btn
                    v-else-if="
                      applicationType === APPLICATION_TYPES.RENEWAL &&
                      applicationStatus === APPLICATION_STATUSES.SUBMITTED &&
                      ccofRenewStatus != RENEW_STATUS.ACTION_REQUIRED
                    "
                    theme="dark"
                    class="blueButton"
                    @click="goToRenewalApplication()"
                  >
                    View Recent Application
                  </v-btn>
                </template>
              </div>
              <p class="mt-4">Fiscal year runs April 1 to March 31</p>
              <router-link
                v-if="isSubmissionHistoryDisplayed"
                class="text-decoration-underline"
                :to="PATHS.ROOT.SUBMISSION_HISTORY"
              >
                View submission history
              </router-link>
            </div>
          </template>
        </SmallCard>
      </v-col>
      <v-col v-if="hasPermission(PERMISSIONS.CREATE_RENEWAL_PCF)" cols="12" :lg="isCCOFStatusNew ? 3 : 4">
        <SmallCard :disable="!(ccofRenewStatus === RENEW_STATUS.ACTION_REQUIRED || isRenewEnabled)">
          <template #content>
            <p class="text-h6">Renew my Funding Agreement {{ renewYearLabel }}</p>

            <p>
              Current providers must renew their Funding Agreement every year. For more information, visit the
              government website:
            </p>
            <p>
              <a
                class="text-decoration-underline"
                style="pointer-events: all"
                href="https://www2.gov.bc.ca/gov/content/family-social-supports/caring-for-young-children/childcarebc-programs/child-care-operating-funding"
              >
                gov.bc.ca/childcareoperatingfunding
              </a>
            </p>
            <!-- <div class="text-h5 blueText" v-if="ccofRenewStatus === RENEW_STATUS.APPROVED">Status of the {{formattedProgramYear}} PCF: Approved</div> -->
            <div v-if="ccofRenewStatus === RENEW_STATUS.COMPLETE">
              <!-- <p class="text-h6 blueText">Status of the PCF: Submitted</p> -->
              <span>We will contact you if we require further information.</span>
            </div>
          </template>
          <template #button>
            <!-- wait for CR list to be loaded before starting a renewal- to not allow user to start renewal if there is active change request -->
            <div v-if="!isLoadingComplete">
              <v-skeleton-loader class="ma-0 pa-0" type="chip" />
            </div>
            <div v-else>
              <v-btn
                v-if="ccofRenewStatus === RENEW_STATUS.NEW"
                :class="buttonColor(!isRenewEnabled)"
                theme="dark"
                @click="renew"
              >
                Renew my Funding Agreement
              </v-btn>
              <v-btn
                v-else-if="ccofRenewStatus === RENEW_STATUS.CONTINUE"
                :class="buttonColor(!isRenewEnabled)"
                theme="dark"
                @click="goToRenewalApplication()"
              >
                Continue Renewal
              </v-btn>
              <v-btn
                v-else-if="ccofRenewStatus === RENEW_STATUS.ACTION_REQUIRED"
                :class="buttonColor(false)"
                theme="dark"
                @click="actionRequiredOrganizationRoute()"
              >
                Update your PCF
              </v-btn>
              <v-btn v-else :class="buttonColor(true)" :disabled="true"> Renew my Funding Agreement </v-btn>
            </div>
          </template>
        </SmallCard>
      </v-col>
      <v-col v-if="hasPermission(PERMISSIONS.VIEW_A_CR)" cols="12" :lg="isCCOFStatusNew ? 3 : 4">
        <SmallCard :disable="!isReportChangeButtonEnabled">
          <template #content>
            <p class="text-h6">Request a change</p>
            <p>Submit a request to change your Organization, licence, service detail, or parent fee information.</p>
          </template>
          <template #button>
            <v-row no-gutters>
              <v-col v-if="isLoadingComplete && isUpdateChangeRequestDisplayed" class="col-12 mb-3">
                <v-btn :class="buttonColor(false)" theme="dark" @click="goToChangeRequestHistory()">
                  Update change request
                </v-btn>
              </v-col>
              <v-col class="col-12">
                <v-btn
                  :class="buttonColor(!isReportChangeButtonEnabled)"
                  theme="dark"
                  @click="goToChangeRequestHistory()"
                >
                  Request a change
                </v-btn>
              </v-col>
            </v-row>
          </template>
        </SmallCard>
      </v-col>
      <v-col v-if="hasPermission(PERMISSIONS.VIEW_ER)" cols="12" lg="4">
        <SmallCard :disable="!isCCOFApproved">
          <template #content>
            <p class="text-h6">Submit Enrolment Reports or monthly ECE reports to receive funding</p>
            <p>
              If you are expecting a new licence or change to your licence or service details, contact the Child Care
              Operating Funding program before submitting your next enrolment report or monthly ECE report.
            </p>
          </template>
          <template #button>
            <v-btn :class="buttonColor(!isCCOFApproved)" theme="dark" @click="$router.push(PATHS.ROOT.MANAGE_REPORTS)">
              Manage Reports
            </v-btn>
          </template>
        </SmallCard>
      </v-col>
      <v-col v-if="hasPermission(PERMISSIONS.VIEW_ORG_INFORMATION)" cols="12" lg="4">
        <SmallCard :disable="!organizationAccountNumber">
          <template #content>
            <p class="text-h6">Manage Organization and Facilities</p>
            <p>View or update your organization, facility details, and funding agreement.</p>
          </template>
          <template #button>
            <v-row no-gutters>
              <v-col class="col-12">
                <v-btn :class="buttonColor(!organizationAccountNumber)" theme="dark" @click="goToMaintainOrgFacilities">
                  Manage Organization and Facilities
                </v-btn>
              </v-col>
            </v-row>
          </template>
        </SmallCard>
      </v-col>
      <v-col v-if="hasPermission(PERMISSIONS.VIEW_USERS)" cols="12" lg="4">
        <SmallCard :disable="!organizationAccountNumber">
          <template #content>
            <p class="text-h6">Manage Users</p>
            <p>Add, edit, or remove users in your organization.</p>
          </template>
          <template #button>
            <v-row no-gutters>
              <v-col class="col-12">
                <v-btn :class="buttonColor(!organizationAccountNumber)" theme="dark" @click="goToMaintainUsers">
                  Manage Users
                </v-btn>
              </v-col>
            </v-row>
          </template>
        </SmallCard>
      </v-col>
    </v-row>

    <v-skeleton-loader
      v-if="!isLoadingComplete"
      class="mt-12"
      :loading="!isLoadingComplete"
      type="paragraph, text@3, text@3, paragraph"
    />
    <v-card v-if="showFacilitiesCard" class="rounded-lg elevation-0 pa-4 mt-8" border>
      <v-row class="ml-2" no-gutters>
        <v-col cols="12" md="6">
          <div>
            <h2>Fiscal Year: {{ programYearNameForFacilityCards }}</h2>
            <h2 v-if="getFundingAgreementNumberByYear">
              Funding Agreement Number: {{ getFundingAgreementNumberByYear }}
            </h2>
          </div>
        </v-col>
        <v-col v-if="showOrganizationClosuresButton" cols="12" md="6" class="my-2 my-md-0 d-flex justify-md-end">
          <AppButton size="large" height="50" @click="goToOrganizationClosures">Organization Closures</AppButton>
        </v-col>
      </v-row>
      <template
        v-if="
          hasPermission([
            PERMISSIONS.CREATE_NEW_APPLICATION,
            PERMISSIONS.CREATE_RENEWAL_PCF,
            PERMISSIONS.VIEW_SUBMITTED_PCF,
          ])
        "
      >
        <v-row>
          <v-col cols="12" md="4" order="2" order-md="1">
            <!--TODO: sezarch box only looks at facility name. Update it later to search for status and licence
            Update when data comes in from the API
            Filter by Facility Name, status, or licence: "
            .-->
            <v-text-field
              v-if="facilityListForFacilityCards?.length > 1"
              v-model="input"
              clearable
              variant="filled"
              label="Filter by Facility Name "
              :bind="input"
              class="mx-2"
            />
          </v-col>
          <v-col v-if="applicationIds?.length > 1" cols="12" md="8" order="1" order-md="2">
            <v-row class="justify-md-end">
              <h3 class="ml-5">Select fiscal year:</h3>
              <FiscalYearSlider class="mx-4" @select-program-year="selectProgramYear" />
            </v-row>
          </v-col>
        </v-row>
        <v-row no-gutters class="justify-space-around">
          <v-col
            v-for="facility in filteredFacilityListForFacilityCards"
            :key="facility.facilityId"
            class="pa-2"
            cols="12"
            md="6"
          >
            <v-card class="blueBorder rounded-lg elevation-4 pb-2" min-height="230">
              <v-card-text>
                <p v-if="facility?.facilityAccountNumber" class="text-h5 text--primary text-center">
                  Facility ID: {{ facility?.facilityAccountNumber }}
                </p>
                <p v-if="facility?.facilityName" class="text-h5 text--primary text-center">
                  Facility Name: {{ facility?.facilityName }}
                </p>
                <p v-if="facility?.licenseNumber" class="text-h5 text--primary text-center">
                  Licence Number: {{ facility?.licenseNumber }}
                </p>
                <br />
                <p class="blueText">
                  Child Care Fee Reduction Initiative (CCFRI) Status:
                  <strong> {{ getCcfriStatusForFacilityCard(facility) }}</strong>
                </p>
                <br />
                <p class="blueText">
                  Early Childhood Educator Wage Enhancement (ECE-WE) Status:
                  <strong> {{ getEceweStatusForFacilityCard(facility) }}</strong>
                </p>
              </v-card-text>
              <v-row v-if="showUpdateYourPCF(facility?.ccfriApplicationId)" justify="center" no-gutters class="mb-4">
                <v-btn
                  class="blueButton"
                  theme="dark"
                  width="80%"
                  align="center"
                  @click="actionRequiredFacilityRoute(facility?.ccfriApplicationId)"
                >
                  Update your PCF
                </v-btn>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
      </template>
    </v-card>
    <CancelApplicationDialog :show="showCancelDialog" max-width="60%" @close="toggleCancelApplicationDialog" />
    <p class="text-center mt-4 font-weight-bold">
      Note: For assistance completing your Program Confirmation Form, contact the program at 1-888-338-6622 (Option 2).
    </p>
  </v-container>
</template>
<script>
import { isEmpty, orderBy } from 'lodash';
import { mapState, mapActions } from 'pinia';

import CancelApplicationDialog from '@/components/CancelApplicationDialog.vue';
import EnrolmentReportDueDialog from '@/components/EnrolmentReportDueDialog.vue';
import Spinner from '@/components/common/Spinner.vue';
import AppAlertBanner from '@/components/guiComponents/AppAlertBanner.vue';
import AppButton from '@/components/guiComponents/AppButton.vue';
import FiscalYearSlider from '@/components/guiComponents/FiscalYearSlider.vue';
import MessagesToolbar from '@/components/guiComponents/MessagesToolbar.vue';
import SmallCard from '@/components/guiComponents/SmallCard.vue';
import alertMixin from '@/mixins/alertMixin.js';
import permissionsMixin from '@/mixins/permissionsMixin.js';
import FundingAgreementService from '@/services/fundingAgreementService.js';
import { useAppStore } from '@/store/app.js';
import { useApplicationStore } from '@/store/application.js';
import { useAuthStore } from '@/store/auth.js';
import { useEnrolmentReport } from '@/store/enrolmentReport';
import { useMessageStore } from '@/store/message.js';
import { useNavBarStore } from '@/store/navBar.js';
import { useReportChangesStore } from '@/store/reportChanges.js';
import { useOrganizationStore } from '@/store/ccof/organization.js';

import {
  APPLICATION_CCOF_STATUSES,
  APPLICATION_STATUSES,
  APPLICATION_TYPES,
  CHANGE_REQUEST_EXTERNAL_STATUS,
  FUNDING_AGREEMENT_INTERNAL_STATUS_CODES,
  ORGANIZATION_GOOD_STANDING_STATUSES,
  ORGANIZATION_PROVIDER_TYPES,
  PATHS,
  pcfUrl,
  pcfUrlGuid,
  CCOF_STATUS,
  RENEW_STATUS,
} from '@/utils/constants.js';

import {
  checkApplicationUnlocked,
  getCcofStatus,
  getUnlockCCFRIList,
  getUnlockNMFList,
  getUnlockRFIList,
  getUnlockAFSList,
  isOrganizationUnlocked,
} from '@/utils/common.js';

import { formatFiscalYearName } from '@/utils/format';

export default {
  name: 'LandingPage',
  components: {
    AppAlertBanner,
    AppButton,
    CancelApplicationDialog,
    EnrolmentReportDueDialog,
    FiscalYearSlider,
    MessagesToolbar,
    SmallCard,
    Spinner,
  },
  mixins: [alertMixin, permissionsMixin],
  data() {
    return {
      renewalYearHasDraftProviderActionRequiredFA: false,
      input: '',
      showCancelDialog: false,
      isLoadingComplete: false,
      selectedProgramYear: undefined,
      showEnrolmentReportDialog: false,
    };
  },
  computed: {
    ...mapState(useAuthStore, ['userInfo']),
    ...mapState(useAppStore, ['renewalYearLabel', 'programYearList']),
    ...mapState(useApplicationStore, [
      'latestProgramYearId',
      'applicationIds',
      'applicationMap',
      'getFacilityListForPCFByProgramYearId',
      'formattedProgramYear',
      'applicationType',
      'programYearId',
      'programYearLabel',
      'ccofApplicationStatus',
      'unlockBaseFunding',
      'isRenewal',
      'unlockDeclaration',
      'unlockEcewe',
      'unlockLicenseUpload',
      'unlockSupportingDocuments',
      'applicationStatus',
      'applicationId',
      'showApplicationTemplateV1',
    ]),
    ...mapState(useEnrolmentReport, ['hasDueReports']),
    ...mapState(useNavBarStore, ['navBarList']),
    ...mapState(useOrganizationStore, [
      'organizationAccountNumber',
      'organizationProviderType',
      'organizationId',
      'organizationName',
      'organizationAccountNumber',
    ]),
    ...mapState(useReportChangesStore, ['changeRequestStore']),
    nextProgramYear() {
      return this.programYearList?.list?.find((el) => el.previousYearId == this.latestProgramYearId);
    },
    renewYearLabel() {
      if (
        (this.applicationType == APPLICATION_TYPES.NEW_ORG && this.applicationStatus == APPLICATION_STATUSES.DRAFT) ||
        !this.applicationId
      ) {
        return '';
      }
      //show the year ahead because we can't pull from application year YET
      else if (this.ccofRenewStatus === this.RENEW_STATUS.NEW) {
        let nameToReturn = this.nextProgramYear?.name;
        return formatFiscalYearName(nameToReturn);
      } else if (
        this.ccofRenewStatus === this.RENEW_STATUS.CONTINUE ||
        this.ccofRenewStatus === this.RENEW_STATUS.ACTION_REQUIRED
      ) {
        return this.formattedProgramYear;
      }
      //should not reach here- perhaps change-
      return this.formattedProgramYear;
    },
    selectedProgramYearId() {
      return this.selectedProgramYear ? this.selectedProgramYear.programYearId : this.programYearId;
    },
    getFundingAgreementNumberByYear() {
      return this.applicationMap?.get(this.selectedProgramYearId)?.fundingAgreementNumber;
    },
    getActionRequiredApplicationsForCCOFCard() {
      const applicationList = Array.from(this.applicationMap?.values());
      return applicationList?.filter((application) => {
        const isLatestRenewApplication =
          application.ccofProgramYearId === this.latestProgramYearId &&
          this.ccofRenewStatus !== this.RENEW_STATUS.NEW &&
          application.applicationType === APPLICATION_TYPES.RENEWAL;
        const isApplicationUnlocked = checkApplicationUnlocked(application);
        return !isLatestRenewApplication && isApplicationUnlocked;
      });
    },
    facilityListForFacilityCards() {
      return this.getFacilityListForPCFByProgramYearId(this.selectedProgramYearId);
    },
    programYearNameForFacilityCards() {
      if (this.selectedProgramYear) return this.selectedProgramYear?.name;
      return this.programYearLabel?.slice(0, -3);
    },
    filteredFacilityListForFacilityCards() {
      if (this.input === '' || this.input === ' ' || this.input === null) {
        return this.facilityListForFacilityCards;
      }
      return this.facilityListForFacilityCards?.filter((fac) =>
        fac.facilityName.toLowerCase().includes(this.input.toLowerCase()),
      );
    },
    isWithinRenewDate() {
      return (
        this.userInfo.serverTime > this.nextProgramYear?.intakeStart &&
        this.userInfo.serverTime < this.nextProgramYear?.intakeEnd
      );
    },
    isRenewEnabled() {
      if (this.applicationStatus === APPLICATION_STATUSES.DRAFT) {
        return this.applicationType !== APPLICATION_TYPES.NEW_ORG;
      }
      if (
        (this.applicationStatus === APPLICATION_STATUSES.SUBMITTED ||
          this.applicationStatus === APPLICATION_STATUSES.APPROVED) &&
        this.organizationAccountNumber &&
        this.ccofApplicationStatus === APPLICATION_CCOF_STATUSES.ACTIVE
      ) {
        return (
          this.isWithinRenewDate &&
          this.programYearId !== this.programYearList?.renewal?.programYearId &&
          this.renewalYearHasDraftProviderActionRequiredFA
        );
      }
      return false;
    },
    ccofStatus() {
      return getCcofStatus(
        this.applicationStatus,
        this.applicationType,
        this.isOrganizationUnlock,
        this.ccofApplicationStatus,
      );
    },
    ccofRenewStatus() {
      if (this.applicationType === APPLICATION_TYPES.RENEWAL) {
        if (this.applicationStatus === APPLICATION_STATUSES.DRAFT) {
          return this.RENEW_STATUS.CONTINUE;
        } else if (this.isWithinRenewDate) {
          return this.RENEW_STATUS.NEW;
        } else if (this.isOrganizationUnlock) {
          return this.RENEW_STATUS.ACTION_REQUIRED;
        } else if (
          this.applicationStatus === APPLICATION_STATUSES.SUBMITTED &&
          this.ccofApplicationStatus === APPLICATION_CCOF_STATUSES.ACTIVE
        ) {
          return this.RENEW_STATUS.APPROVED;
        } else {
          return this.RENEW_STATUS.COMPLETE;
        }
      } else {
        return this.RENEW_STATUS.NEW;
      }
    },
    isOrganizationUnlock() {
      return isOrganizationUnlocked(
        this.unlockBaseFunding,
        this.applicationType,
        this.unlockDeclaration,
        this.unlockEcewe,
        this.unlockLicenseUpload,
        this.unlockSupportingDocuments,
        this.navBarList,
      );
    },
    unlockCCFRIList() {
      return getUnlockCCFRIList(this.navBarList);
    },
    unlockNMFList() {
      return getUnlockNMFList(this.navBarList);
    },
    unlockRFIList() {
      return getUnlockRFIList(this.navBarList);
    },
    unlockAFSList() {
      return getUnlockAFSList(this.navBarList);
    },
    isCCOFApproved() {
      return this.applicationType === APPLICATION_TYPES.RENEWAL || this.ccofStatus === this.CCOF_STATUS.APPROVED;
    },
    isReportChangeButtonEnabled() {
      if (this.applicationType === APPLICATION_TYPES.RENEWAL && this.organizationAccountNumber) {
        return true;
      }
      return !!(this.organizationAccountNumber && this.applicationMap?.get(this.programYearId)?.fundingAgreementNumber);
    },
    isUpdateChangeRequestDisplayed() {
      if (
        !this.hasPermission([
          this.PERMISSIONS.MTFI,
          this.PERMISSIONS.ORGANIZATION_CHANGE,
          this.PERMISSIONS.ADD_NEW_FACILITY,
          this.PERMISSIONS.LICENCE_CHANGE,
          this.PERMISSIONS.OTHER_CHANGES,
        ])
      ) {
        return false;
      }
      const index = this.changeRequestStore?.findIndex(
        (changeRequest) => changeRequest.externalStatus === CHANGE_REQUEST_EXTERNAL_STATUS.ACTION_REQUIRED,
      );
      return index > -1;
    },
    isSubmissionHistoryDisplayed() {
      if (!this.hasPermission(this.PERMISSIONS.DOWNLOAD_PCF_PDF)) {
        return false;
      }
      const applicationList = Array.from(this.applicationMap?.values());
      const index = applicationList?.findIndex(
        (application) => application.applicationStatus != APPLICATION_STATUSES.DRAFT,
      );
      return index > -1;
    },
    mtfiChangeRequestList() {
      let result = [];
      if (this.changeRequestStore?.length > 0) {
        result = this.changeRequestStore.filter((changeRequest) => {
          if (changeRequest.programYearId === this.selectedProgramYear?.programYearId) {
            let index = changeRequest.changeActions?.findIndex(
              (changeAction) => changeAction.changeType === 'PARENT_FEE_CHANGE',
            );
            return index > -1;
          }
          return false;
        });
      }
      return result;
    },
    isCancelPcfButtonEnabled() {
      return (
        this.applicationStatus === APPLICATION_STATUSES.DRAFT &&
        this.applicationType === APPLICATION_TYPES.NEW_ORG &&
        this.ccofApplicationStatus === APPLICATION_CCOF_STATUSES.NEW
      );
    },
    isCCOFStatusNew() {
      return this.ccofStatus === this.CCOF_STATUS.NEW;
    },
    showNotGoodStandingWarning() {
      return (
        this.userInfo?.organizationGoodStandingStatus === ORGANIZATION_GOOD_STANDING_STATUSES.FAIL &&
        !this.userInfo.organizationBypassGoodStandingCheck
      );
    },
    showOrganizationClosuresButton() {
      if (!this.hasPermission(this.PERMISSIONS.VIEW_CLOSURES)) {
        return false;
      }
      const application = this.applicationMap?.get(this.selectedProgramYearId);
      // XXX (vietle-cgi) - Status texts come from CCFRI_STATUS_CODES in parseFacilityData() (user.js backend).
      return application?.facilityList?.some((facility) =>
        ['APPROVED', 'NOT_APPROVED', 'INELIGIBLE', 'Opt-Out'].includes(facility.ccfriStatus),
      );
    },
    showFacilitiesCard() {
      return (
        this.navBarList?.length > 0 &&
        this.hasPermission([
          this.PERMISSIONS.CREATE_NEW_APPLICATION,
          this.PERMISSIONS.CREATE_RENEWAL_PCF,
          this.PERMISSIONS.VIEW_SUBMITTED_PCF,
          this.PERMISSIONS.VIEW_CLOSURES,
        ])
      );
    },
  },
  async created() {
    this.APPLICATION_CCOF_STATUSES = APPLICATION_CCOF_STATUSES;
    this.APPLICATION_STATUSES = APPLICATION_STATUSES;
    this.APPLICATION_TYPES = APPLICATION_TYPES;
    this.CCOF_STATUS = CCOF_STATUS;
    this.PATHS = PATHS;
    this.RENEW_STATUS = RENEW_STATUS;

    this.CCOF_NEW_APPLICATION_TEXT = [
      {
        title: 'CCOF Base Funding',
        body: '<p><strong>(CCOF)</strong> Base Funding assists eligible licensed family and group child care providers with the day-to-day costs of running a facility.</p><strong> CCOF Base Funding is a prerequisite to participate in CCFRI and ECE-WE.</strong>',
      },
      {
        title: 'Child Care Fee Reduction Initiative (CCFRI) Funding',
        body: 'The CCFRI offers funding to eligible, licensed child care providers to reduce and stabilize parents’ monthly child care fees.',
      },
      {
        title: 'Early Childhood Educator Wage Enhancement (ECE-WE) Funding',
        body: 'Providers with licensed care facilities can apply for a wage enhancement for Early Childhood Educators (ECEs) they employ directly.',
      },
    ];

    await this.loadData();
  },
  methods: {
    ...mapActions(useApplicationStore, ['loadApplicationFromStore', 'setIsRenewal']),
    ...mapActions(useEnrolmentReport, ['checkDueReports']),
    ...mapActions(useMessageStore, ['getAllMessages']),
    ...mapActions(useNavBarStore, ['refreshNavBarList']),
    ...mapActions(useOrganizationStore, ['renewApplication']),
    ...mapActions(useReportChangesStore, ['getChangeRequestList']),
    async loadData() {
      try {
        this.isLoadingComplete = false;

        if (this.hasPermission(this.PERMISSIONS.SUBMIT_ENROLMENT_REPORT) && this.hasDueReports === null) {
          await this.checkDueReports(this.organizationId, this.latestProgramYearId);
          this.showEnrolmentReportDialog = this.hasDueReports;
        }
        await Promise.all([
          this.loadApplicationFromStore(this.latestProgramYearId),
          this.getAllMessages(this.organizationId),
        ]);
        if (this.hasPermission(this.PERMISSIONS.VIEW_A_CR)) {
          await this.getChangeRequestList(this.organizationId);
        }
        if (this.hasPermission(this.PERMISSIONS.CREATE_RENEWAL_PCF)) {
          this.renewalYearHasDraftProviderActionRequiredFA = await FundingAgreementService.checkFundingAgreementExists({
            organizationId: this.organizationId,
            programYearId: this.nextProgramYear?.programYearId,
            internalStatusCode: FUNDING_AGREEMENT_INTERNAL_STATUS_CODES.DRAFTED_PROVIDER_ACTION_REQUIRED,
          });
        }
        this.refreshNavBarList();
      } catch (error) {
        console.error('Failed to load data for Landing Page.', error);
        this.setFailureAlert('Failed to load data.');
      } finally {
        this.isLoadingComplete = true;
      }
    },
    toggleCancelApplicationDialog() {
      this.showCancelDialog = !this.showCancelDialog;
    },
    newApplicationIntermediatePage() {
      this.setIsRenewal(false);
      this.$router.push(pcfUrl(PATHS.NEW_APPLICATION_INTERMEDIATE, this.programYearList.newApp.programYearId));
    },
    async renew() {
      try {
        this.isLoadingComplete = false;
        await this.renewApplication();
        this.setIsRenewal(true);
        this.$router.push(pcfUrl(PATHS.CCOF_RENEWAL_BANKING_INFORMATION, this.nextProgramYear?.programYearId));
      } catch (error) {
        console.error('Failed to renew application.', error);
        this.setFailureAlert('An error occurred while processing. Please try again later.');
      }
    },
    goToChangeRequestHistory() {
      this.$router.push(PATHS.ROOT.CHANGE_LANDING + '#change-request-history');
    },
    goToRenewalApplication() {
      if (this.showApplicationTemplateV1) {
        this.goToLicenseUpload();
      } else {
        this.$router.push(pcfUrl(PATHS.CCOF_RENEWAL_BANKING_INFORMATION, this.programYearId));
      }
    },
    goToCCOFOrganizationInfo() {
      this.setIsRenewal(false);
      this.$router.push(
        pcfUrl(
          this.organizationProviderType === ORGANIZATION_PROVIDER_TYPES.GROUP
            ? PATHS.CCOF_GROUP_ORG
            : PATHS.CCOF_FAMILY_ORG,
          this.programYearId,
        ),
      );
    },
    goToCCOFFunding(programYearId, facilityList) {
      if (facilityList?.length > 0) {
        const ccofBaseFundingId = facilityList[0].ccofBaseFundingId;
        if (ccofBaseFundingId && programYearId) {
          this.$router.push(
            pcfUrlGuid(
              this.organizationProviderType === ORGANIZATION_PROVIDER_TYPES.GROUP
                ? PATHS.CCOF_GROUP_FUNDING
                : PATHS.CCOF_FAMILY_FUNDING,
              programYearId,
              ccofBaseFundingId,
            ),
          );
        }
      }
    },
    goToLicenseUpload(programYearId = this.programYearId) {
      this.$router.push(pcfUrl(PATHS.LICENSE_UPLOAD, programYearId));
    },
    goToCCFRI(ccfriApplicationId, application) {
      let path = application?.isRenewal ? PATHS.CCFRI_CURRENT_FEES : PATHS.CCFRI_NEW_FEES;
      this.$router.push(pcfUrlGuid(path, application?.ccofProgramYearId, ccfriApplicationId));
    },
    goToNMF(ccfriApplicationId, programYearId) {
      this.$router.push(pcfUrlGuid(PATHS.CCFRI_NMF, programYearId, ccfriApplicationId));
    },
    goToRFI(ccfriApplicationId, programYearId) {
      this.$router.push(pcfUrlGuid(PATHS.CCFRI_RFI, programYearId, ccfriApplicationId));
    },
    goToAFS(ccfriApplicationId, programYearId) {
      this.$router.push(pcfUrlGuid(PATHS.CCFRI_AFS, programYearId, ccfriApplicationId));
    },
    goToECEWE(programYearId) {
      this.$router.push(pcfUrl(PATHS.ECEWE_ELIGIBILITY, programYearId));
    },
    goToSupportingDocumentUpload(programYearId = this.programYearId) {
      this.$router.push(pcfUrl(PATHS.SUPPORTING_DOCS, programYearId));
    },
    goToSummaryDeclaration(programYearId = this.programYearId) {
      this.$router.push(pcfUrl(PATHS.SUMMARY_DECLARATION, programYearId));
    },
    goToMaintainOrgFacilities() {
      this.$router.push(PATHS.ROOT.MANAGE_ORG_FACILITIES);
    },
    goToMaintainUsers() {
      this.$router.push(PATHS.ROOT.MANAGE_USERS);
    },
    goToOrganizationClosures() {
      this.$router.push(`${PATHS.ROOT.CLOSURES}/${this.selectedProgramYearId}`);
    },
    actionRequiredOrganizationRoute(programYearId = this.programYearId) {
      let application = this.applicationMap?.get(programYearId);
      const facilityList = this.getFacilityListForPCFByProgramYearId(programYearId);
      const unlockCCFRIList = getUnlockCCFRIList(facilityList);
      const unlockRFIList = getUnlockRFIList(facilityList);
      const unlockNMFList = getUnlockNMFList(facilityList);
      const unlockAFSList = getUnlockAFSList(facilityList);
      if (application?.unlockLicenseUpload) this.goToLicenseUpload(programYearId);
      else if (application?.unlockBaseFunding && application?.applicationType === APPLICATION_TYPES.NEW_ORG)
        this.goToCCOFFunding(programYearId, facilityList);
      else if (application?.unlockEcewe) this.goToECEWE(programYearId);
      else if (application?.unlockSupportingDocuments) this.goToSupportingDocumentUpload(programYearId);
      else if (!isEmpty(unlockCCFRIList)) this.goToCCFRI(unlockCCFRIList[0], application);
      else if (!isEmpty(unlockNMFList)) this.goToNMF(unlockNMFList[0], programYearId);
      else if (!isEmpty(unlockRFIList)) this.goToRFI(unlockRFIList[0], programYearId);
      else if (!isEmpty(unlockAFSList)) this.goToAFS(unlockAFSList[0], programYearId);
      else if (application?.unlockDeclaration) this.goToSummaryDeclaration(programYearId);
    },
    actionRequiredFacilityRoute(ccfriApplicationId) {
      const application = this.applicationMap?.get(this.selectedProgramYearId);
      if (this.isCCFRIUnlock(ccfriApplicationId, application)) {
        this.goToCCFRI(ccfriApplicationId, application);
      } else if (this.isNMFUnlock(ccfriApplicationId, application)) {
        this.goToNMF(ccfriApplicationId, this.selectedProgramYearId);
      } else if (this.isRFIUnlock(ccfriApplicationId, application)) {
        this.goToRFI(ccfriApplicationId, this.selectedProgramYearId);
      } else if (this.isAFSUnlock(ccfriApplicationId, application)) {
        this.goToAFS(ccfriApplicationId, this.selectedProgramYearId);
      }
    },
    buttonColor(isDisabled) {
      return isDisabled ? 'disabledButton' : 'blueButton';
    },
    showUpdateYourPCF(ccfriApplicationId) {
      if (!this.hasPermission([this.PERMISSIONS.CREATE_NEW_APPLICATION, this.PERMISSIONS.CREATE_RENEWAL_PCF])) {
        return false;
      }
      const application = this.applicationMap?.get(this.selectedProgramYearId);
      return (
        this.isCCFRIUnlock(ccfriApplicationId, application) ||
        this.isNMFUnlock(ccfriApplicationId, application) ||
        this.isRFIUnlock(ccfriApplicationId, application) ||
        this.isAFSUnlock(ccfriApplicationId, application)
      );
    },
    isCCFRIUnlock(ccfriApplicationId, application) {
      const facilityList = this.getFacilityListForPCFByProgramYearId(application?.ccofProgramYearId);
      const unlockCCFRIList = getUnlockCCFRIList(facilityList);
      return (
        application?.applicationStatus === APPLICATION_STATUSES.SUBMITTED &&
        unlockCCFRIList.includes(ccfriApplicationId)
      );
    },
    isNMFUnlock(ccfriApplicationId, application) {
      const facilityList = this.getFacilityListForPCFByProgramYearId(application?.ccofProgramYearId);
      const unlockNMFList = getUnlockNMFList(facilityList);
      return (
        application?.applicationStatus === APPLICATION_STATUSES.SUBMITTED && unlockNMFList.includes(ccfriApplicationId)
      );
    },
    isRFIUnlock(ccfriApplicationId, application) {
      const facilityList = this.getFacilityListForPCFByProgramYearId(application?.ccofProgramYearId);
      const unlockRFIList = getUnlockRFIList(facilityList);
      return (
        application?.applicationStatus === APPLICATION_STATUSES.SUBMITTED && unlockRFIList.includes(ccfriApplicationId)
      );
    },
    isAFSUnlock(ccfriApplicationId, application) {
      const facilityList = this.getFacilityListForPCFByProgramYearId(application?.ccofProgramYearId);
      const unlockAFSList = getUnlockAFSList(facilityList);
      return (
        application?.applicationStatus === APPLICATION_STATUSES.SUBMITTED && unlockAFSList?.includes(ccfriApplicationId)
      );
    },
    selectProgramYear(programYear) {
      this.selectedProgramYear = programYear;
    },
    getLastSubmittedMTFIChangeRequest(facilityId) {
      let lastMTFIChangeRequest;
      if (this.mtfiChangeRequestList?.length > 0) {
        let mtfiChangeRequestListForFacility = this.mtfiChangeRequestList?.filter((item) => {
          if (item.firstSubmissionDate) {
            const mtfiChangeAction = item.changeActions?.find(
              (changeAction) => changeAction.changeType === 'PARENT_FEE_CHANGE',
            );
            const index = mtfiChangeAction?.mtfiFacilities?.findIndex((fac) => fac.facilityId === facilityId);
            return index > -1;
          }
          return false;
        });
        if (mtfiChangeRequestListForFacility?.length > 0) {
          mtfiChangeRequestListForFacility = orderBy(mtfiChangeRequestListForFacility, 'firstSubmissionDate', 'desc');
          lastMTFIChangeRequest = mtfiChangeRequestListForFacility[0];
        }
      }
      return lastMTFIChangeRequest;
    },
    getCcfriStatusForFacilityCard(facility) {
      if (facility?.ccfriOptInStatus === 0) return 'OPTED OUT';
      else {
        const lastMTFIChangeRequest = this.getLastSubmittedMTFIChangeRequest(facility?.facilityId);
        if (lastMTFIChangeRequest?.changeActions?.length > 0) {
          const mtfiFacility = lastMTFIChangeRequest.changeActions[0].mtfiFacilities?.find(
            (item) => item.facilityId === facility?.facilityId,
          );
          return mtfiFacility?.ccfriStatus;
        }
        return facility?.ccfriStatus;
      }
    },
    getEceweStatusForFacilityCard(facility) {
      if (facility?.eceweOptInStatus === 0) return 'OPTED OUT';
      else {
        return facility?.eceweStatus;
      }
    },
  },
};
</script>

<style scoped>
.blueBorder {
  border-top: 5px solid #003366 !important;
}

.blueButton {
  background-color: #003366 !important;
}

.red-button {
  background-color: #d8292f;
  color: white;
}

.blueText {
  color: rgb(0, 52, 102) !important;
}
</style>
