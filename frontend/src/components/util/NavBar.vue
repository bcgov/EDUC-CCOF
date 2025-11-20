<template>
  <div class="mb-1">
    <v-navigation-drawer
      v-model="drawer"
      :location="$vuetify.display.mdAndUp ? 'left' : null"
      :temporary="!$vuetify.display.mdAndUp"
    >
      <v-list :opened="expandedNavBarItems">
        <template v-for="item in items" :key="item.title">
          <v-list-item
            v-if="!item.items"
            :id="stripWhitespace(item.title + `MenuBtn`)"
            :value="item.navBarId"
            :disabled="!item.isAccessible"
            class="menuRow"
            :style="{ '--v-list-item-prepend-max-width': '30px' }"
            @click="goTo(item)"
          >
            <template #prepend>
              <v-icon v-if="item.icon">{{ item.icon }}</v-icon>
            </template>
            <v-list-item-title :class="['menuItem text-wrap', { 'font-weight-bold': item.isActive }]">
              {{ item.title }}
            </v-list-item-title>
          </v-list-item>

          <v-list-group
            v-else
            :id="stripWhitespace(item.title + `MenuBtn`)"
            :value="item.title"
            class="menuRow"
            @click="setActive(item)"
          >
            <template #activator="{ props }">
              <v-list-item
                v-bind="props"
                :disabled="!item.isAccessible"
                :style="{ '--v-list-item-prepend-max-width': '30px' }"
              >
                <template #prepend>
                  <v-icon v-if="item.icon">{{ item.icon }}</v-icon>
                </template>
                <v-list-item-title class="menuItem text-wrap">{{ item.title }}</v-list-item-title>
              </v-list-item>
            </template>

            <v-list-item
              v-for="subItem in item.items"
              :id="stripWhitespace(subItem.title) + `MenuBtn`"
              :key="subItem.navBarId"
              :disabled="!subItem.isAccessible"
              class="pl-9 d-flex custom-item"
              :style="{ '--v-list-item-prepend-max-width': '30px' }"
              @click="goTo(subItem)"
            >
              <template #prepend>
                <v-icon v-if="subItem.icon">{{ subItem.icon }}</v-icon>
              </template>
              <v-list-item-title class="text-wrap">
                <div :class="['menuItem', { 'font-weight-bold': subItem.isActive }]">
                  {{ subItem.title }}
                </div>
                <div>
                  {{ subItem.subTitle }}
                </div>
                <div v-if="subItem.subTitle2">
                  {{ subItem.subTitle2 }}
                </div>
              </v-list-item-title>
            </v-list-item>
          </v-list-group>
        </template>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      v-if="hasAnyItems"
      id="navBar"
      :elevation="0"
      color="#38598A"
      class="pl-4 pr-8 justify-start"
      :class="{ 'pl-16': $vuetify.display.mdAndUp }"
    >
      <v-app-bar-nav-icon id="menuBtn" @click="drawer = !drawer">
        <v-icon>{{ drawer ? '$close' : '$menu' }}</v-icon>
      </v-app-bar-nav-icon>
      <v-app-bar-title
        id="navTitle"
        class="nav-title"
        :class="{ 'ml-4': $vuetify.display.mdAndUp, 'pl-1': $vuetify.display.sm }"
      >
        {{ title }}
      </v-app-bar-title>
      <v-spacer />
    </v-app-bar>
  </div>
</template>

<script>
import { isEmpty } from 'lodash';
import { mapState, mapActions } from 'pinia';
import { useAppStore } from '@/store/app.js';
import { useApplicationStore } from '@/store/application.js';
import { useAuthStore } from '@/store/auth.js';
import { useCcfriAppStore } from '@/store/ccfriApp.js';
import { useFacilityStore } from '@/store/ccof/facility.js';
import { useFundingStore } from '@/store/ccof/funding.js';
import { useNavBarStore } from '@/store/navBar.js';
import { useOrganizationStore } from '@/store/ccof/organization.js';
import { useReportChangesStore } from '@/store/reportChanges.js';
import { useSupportingDocumentUploadStore } from '@/store/supportingDocumentUpload.js';

import {
  AFS_STATUSES,
  DOCUMENT_TYPES,
  NAV_BAR_GROUPS,
  CHANGE_TYPES,
  ORGANIZATION_PROVIDER_TYPES,
  PAGE_TITLES,
  PATHS,
} from '@/utils/constants.js';

let positionIndex = 0;
let navBarId = 0;
let isCCOFGroupComplete = false;

export default {
  name: 'NavBar',
  props: {
    title: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      drawer: null,
      items: [],
      hasAnyItems: false,
    };
  },
  computed: {
    ...mapState(useSupportingDocumentUploadStore, ['uploadedDocuments']),
    ...mapState(useAppStore, ['pageTitle', 'programYearList']),
    ...mapState(useApplicationStore, [
      'applicationStatus',
      'applicationUploadedDocuments',
      'isEceweComplete',
      'unlockDeclaration',
      'programYearId',
      'isRenewalBankingInfoComplete',
      'isRenewalFAComplete',
      'isLicenseUploadComplete',
      'isRenewal',
      'applicationId',
      'showApplicationTemplateV1',
    ]),
    ...mapState(useAuthStore, ['userInfo']),
    ...mapState(useCcfriAppStore, ['approvableFeeSchedules', 'getCCFRIById']),
    ...mapState(useFacilityStore, ['isNewFacilityStarted']),
    ...mapState(useFundingStore, ['isNewFundingStarted']),
    ...mapState(useNavBarStore, [
      'isChangeRequest',
      'navBarList',
      'userProfileList',
      'refreshNavBar',
      'navBarGroup',
      'changeType',
    ]),
    ...mapState(useOrganizationStore, [
      'organizationProviderType',
      'organizationAccountNumber',
      'isOrganizationComplete',
    ]),
    ...mapState(useReportChangesStore, [
      'isCREceweComplete',
      'isCRLicenseComplete',
      'changeRequestStatus',
      'getChangeNotificationActionId',
      'isChangeNotificationFormComplete',
      'mtfiFacilities',
      'changeRequestMap',
      'changeRequestId',
    ]),
    navRefresh() {
      return this.$route.name + this.$route.params.urlGuid;
    },

    navWidth() {
      switch (this.$vuetify.display.name) {
        case 'xs':
          return '50%';
        case 'sm':
          return '50%';
        default:
          return '15%';
      }
    },

    hasFacilities() {
      return !isEmpty(this.navBarList);
    },

    expandedNavBarItems() {
      return this.items?.filter((item) => item.expanded)?.map((item) => item.title);
    },

    isApplication() {
      return this.$route.path?.includes(`${PATHS.PREFIX.PCF}/`);
    },
  },
  watch: {
    navRefresh: {
      handler() {
        this.buildNavBar();
      },
      immediate: true,
      deep: true,
    },
    refreshNavBar: {
      handler() {
        this.buildNavBar();
      },
      immediate: true,
      deep: true,
    },
  },

  async created() {
    await this.loadData();
  },

  methods: {
    ...mapActions(useApplicationStore, ['getApplicationUploadedDocuments']),
    ...mapActions(useCcfriAppStore, ['getApprovableFeeSchedulesForFacilities']),
    ...mapActions(useNavBarStore, ['refreshNavBarList', 'setNavBarItems']),
    ...mapActions(useSupportingDocumentUploadStore, ['saveUploadedDocuments', 'getDocuments']),

    async loadData() {
      try {
        if (this.isApplication) {
          await Promise.all([
            this.getApprovableFeeSchedulesForFacilities(this.userProfileList),
            this.getApplicationUploadedDocuments(),
          ]);
          this.checkApprovableFeeSchedulesComplete();
        } else if (this.changeType === 'mtfi') {
          await this.getApprovableFeeSchedulesForFacilities(this.mtfiFacilities);
          await this.getDocuments(this.applicationId);
          this.checkMTFIApprovableFeeSchedulesComplete();
        }
      } catch (error) {
        console.log(error);
        this.setFailureAlert('An error occurred while loading. Please try again later.');
      }
    },
    setActive(item) {
      let index = this.items.findIndex((obj) => obj.title === item.title);
      if (item.active) {
        this.items[index].active = false;
      } else {
        this.items.filter((obj) => obj.items && obj.active).forEach((obj) => (obj.active = !obj.active));
        this.items[index].active = true;
      }
    },
    areChildrenComplete(list) {
      return list.every((item) => {
        return item.icon === 'mdi-check-circle' || item.icon === 'mdi-information' || item.icon === 'mdi-home';
      });
    },
    buildNavBar() {
      positionIndex = 0;
      navBarId = 0;
      isCCOFGroupComplete = false;

      this.items = [];
      if (this.isChangeRequest) {
        if (this.changeType === 'nf') {
          this.buildNewFacilityNavBar();
        } else if (this.changeType === 'mtfi') {
          this.buildMTFINavBar();
        }
      } else {
        this.buildApplicationNavBar();
      }
    },

    addLandingPageToNavBar() {
      this.items.push({
        title: 'Home',
        link: { name: 'landing-page' },
        isAccessible: true,
        icon: 'mdi-home', //replace
        expanded: false,
        position: positionIndex++,
        navBarId: navBarId++,
      });
    },
    addSummaryAndDeclarationToNavBar() {
      let checkbox; //true will show checkmark, false will not
      let linkName;
      if (this.isChangeRequest) {
        const currentCR = this.changeRequestMap.get(this.changeRequestId);
        checkbox = ['SUBMITTED', 'APPROVED'].includes(this.changeRequestStatus) && !currentCR?.unlockDeclaration;
        if (this.changeType === CHANGE_TYPES.NEW_FACILITY) {
          linkName = 'Summary and Declaration New Facility';
        } else if (this.changeType === CHANGE_TYPES.MTFI) {
          linkName = 'Summary and Declaration MTFI';
        }
      } else {
        checkbox = this.applicationStatus === 'SUBMITTED' && !this.unlockDeclaration;
        linkName = 'Summary and Declaration';
      }
      this.items.push({
        title: 'Declaration',
        link: { name: linkName },
        isAccessible: this.areChildrenComplete(this.items), //set this to true to unlock the declaration
        icon: this.getCheckbox(checkbox),
        isActive: linkName === this.$route.name,
        expanded: false,
        position: positionIndex++,
        navBarId: navBarId++,
      });
    },
    createNavItem({ title, link, isComplete, isAccessible }) {
      return {
        title,
        link,
        isAccessible,
        icon: this.getCheckbox(isComplete),
        isActive: link.name === this.$route.name,
        position: positionIndex++,
        navBarId: navBarId++,
      };
    },
    getRenewalCCOFNavigation() {
      if (this.showApplicationTemplateV1) {
        return this.createNavItem({
          title: 'Licence Upload',
          link: { name: 'Licence Upload' },
          isComplete: this.isLicenseUploadComplete,
          isAccessible: true,
        });
      }

      const bankingInfo = this.createNavItem({
        title: 'Banking Information',
        link: { name: 'renewal-banking-information' },
        isComplete: this.isRenewalBankingInfoComplete,
        isAccessible: true,
      });
      const fundingAgreement = this.createNavItem({
        title: 'Funding Agreement',
        link: { name: 'renewal-funding-agreement' },
        isComplete: this.isRenewalFAComplete,
        isAccessible: this.isRenewalBankingInfoComplete,
      });
      const licenceUpload = this.createNavItem({
        title: 'Licence Upload',
        link: { name: 'Licence Upload' },
        isComplete: this.isLicenseUploadComplete,
        isAccessible: true,
      });
      licenceUpload.isAccessible = this.isRenewalBankingInfoComplete && this.isRenewalFAComplete;
      const items = [bankingInfo, fundingAgreement, licenceUpload];
      isCCOFGroupComplete = this.areChildrenComplete(items);
      return {
        title: NAV_BAR_GROUPS.CCOF,
        isAccessible: true,
        icon: this.getCheckbox(isCCOFGroupComplete),
        expanded: this.isExpanded(NAV_BAR_GROUPS.CCOF),
        items: items,
        navBarId: navBarId++,
      };
    },
    addSupportingDocumentsToNavbar() {
      this.items.push({
        title: 'Supporting Document',
        link: { name: 'Supporting Document Upload' },
        isAccessible: this.isRenewal && this.showApplicationTemplateV1 ? true : isCCOFGroupComplete,
        icon: 'mdi-information',
        isActive: 'Supporting Document Upload' === this.$route.name,
        expanded: false,
        position: positionIndex++,
        navBarId: navBarId++,
      });
    },
    addNewSupportingDocumentsToNavbar() {
      this.items.push({
        title: 'Supporting Document',
        link: {
          name: 'change-request-Supporting-Document-Upload',
          params: { changeRecGuid: this.$route.params.changeRecGuid },
        },
        isAccessible: isCCOFGroupComplete, //change this when change req logic more complete
        icon: 'mdi-information',
        isActive: 'change-request-Supporting-Document-Upload' === this.$route.name,
        expanded: false,
        position: positionIndex++,
        navBarId: navBarId++,
      });
    },
    addReportChangeNavigationToNavBar() {
      if (this.getChangeNotificationActionId) {
        this.items.push({
          title: 'Change Notification Form',
          link: {
            name: 'new-facility-other-guid',
            params: { changeRecGuid: this.$route.params.changeRecGuid, urlGuid: this.getChangeNotificationActionId },
          },
          isAccessible: true,
          icon: this.getCheckbox(this.isChangeNotificationFormComplete),
          isActive: 'new-facility-other-guid' === this.$route.name,
          expanded: false,
          position: positionIndex++,
          navBarId: navBarId++,
        });
      }
    },
    buildReportChangeNavBar() {
      this.addLandingPageToNavBar();
      this.addReportChangeNavigationToNavBar();
      this.setNavBarItems(this.items);
    },
    buildApplicationNavBar() {
      this.addLandingPageToNavBar();
      if (this.isRenewal) {
        this.items.push(this.getRenewalCCOFNavigation());
      } else {
        if (this.organizationProviderType === ORGANIZATION_PROVIDER_TYPES.FAMILY) {
          this.items.push(this.getCCOFFamilyNavigation());
        } else {
          this.items.push(this.getCCOFNavigation());
        }
      }
      this.items.push(this.getCCFRINavigation());
      this.items.push(this.getECEWENavigation());
      this.addSupportingDocumentsToNavbar();
      this.addSummaryAndDeclarationToNavBar();
      this.setNavBarItems(this.items);
    },
    buildMTFINavBar() {
      this.addLandingPageToNavBar();
      this.items.push(this.getMTFINavigation());
      this.addSummaryAndDeclarationToNavBar();
      this.setNavBarItems(this.items);
    },
    buildNewFacilityNavBar() {
      this.addLandingPageToNavBar();
      this.items.push(this.getAddNewFacilityCCOFNavigation());
      this.items.push(this.getAddNewCCFRINavigation()); //JB
      this.items.push(this.getAddNewECEWENavigation());
      this.addNewSupportingDocumentsToNavbar();
      this.addReportChangeNavigationToNavBar();

      this.addSummaryAndDeclarationToNavBar();
      this.setNavBarItems(this.items);
    },
    getCheckbox(isCompleted) {
      if (isCompleted) {
        return 'mdi-check-circle';
      }
      return 'mdi-checkbox-blank-circle-outline';
    },

    isDeclarationB() {
      if (this.programYearList?.list) {
        const programYear = this.programYearList.list.find(({ programYearId }) => programYearId == this.programYearId);
        const serverTime = new Date(this.userInfo.serverTime);
        if (programYear) {
          let declarationBStart = new Date(programYear.declarationbStart);
          return serverTime >= declarationBStart && this.organizationAccountNumber;
        }
      }
      return false;
    },
    isExpanded(groupName) {
      return groupName === this.navBarGroup;
    },
    getAddNewCCFRINavigation() {
      let items = [];
      items.push({
        title: 'Opt-In / Opt-Out',
        link: { name: 'change-request-ccfri-home', params: { changeRecGuid: this.$route.params.changeRecGuid } },
        isAccessible: isCCOFGroupComplete, //Change - when newFacilityCCOF is complete
        icon: this.getCheckbox(this.isCCFRIOptInComplete()),
        isActive: 'change-request-ccfri-home' === this.$route.name,
        position: positionIndex++,
        navBarId: navBarId++,
      });
      if (this.hasFacilities) {
        this.navBarList?.forEach((item) => {
          //new facility only needs add new fees
          if (item.ccfriOptInStatus == 1) {
            //only show if Opted In
            items.push({
              title: 'Parent Fees',
              subTitle: item.facilityName,
              subTitle2: item.facilityAccountNumber,
              id: item.facilityId,
              link: {
                name: 'change-request-ccfri-add-fees-guid',
                params: { changeRecGuid: this.$route.params.changeRecGuid, urlGuid: item.ccfriApplicationId },
              },
              isAccessible: this.applicationStatus === 'SUBMITTED' ? true : this.isCCFRIOptInComplete(),
              icon: this.getCheckbox(item.isCCFRIComplete),
              isActive:
                'change-request-ccfri-add-fees-guid' === this.$route.name &&
                this.$route.params.urlGuid === item.ccfriApplicationId,
              position: positionIndex++,
              navBarId: navBarId++,
            });
            if (item.hasRfi || item.unlockRfi) {
              items.push({
                title: 'Parent Fee Increase – RFI',
                subTitle: item.facilityName,
                subTitle2: item.facilityAccountNumber,
                id: item.facilityId,
                link: {
                  name: 'change-request-ccfri-request-info',
                  params: { changeRecGuid: this.$route.params.changeRecGuid, urlGuid: item.ccfriApplicationId },
                },
                isAccessible: true,
                icon: this.getCheckbox(item.isRfiComplete),
                isActive:
                  'change-request-ccfri-request-info' === this.$route.name &&
                  this.$route.params.urlGuid === item.ccfriApplicationId,
                position: positionIndex++,
                navBarId: navBarId++,
              });
            }
            if (item.unlockNmf || item.hasNmf) {
              items.push({
                title: 'Parent Fee - RFI',
                subTitle: item.facilityName,
                subTitle2: item.facilityAccountNumber,
                id: item.facilityId,
                link: {
                  name: 'change-request-new-facilities',
                  params: { changeRecGuid: this.$route.params.changeRecGuid, urlGuid: item.ccfriApplicationId },
                },
                isAccessible: true,
                icon: this.getCheckbox(item.isNmfComplete),
                isActive:
                  'change-request-new-facilities' === this.$route.name &&
                  this.$route.params.urlGuid === item.ccfriApplicationId,
                position: positionIndex++,
                navBarId: navBarId++,
              });
            }
            if (!this.showApplicationTemplateV1) {
              items.push({
                title: PAGE_TITLES.CCFRI_CLOSURES,
                subTitle: item.facilityName,
                subTitle2: item.facilityAccountNumber,
                id: item.facilityId,
                link: {
                  name: 'change-request-ccfri-closures-guid',
                  params: { changeRecGuid: this.$route.params.changeRecGuid, urlGuid: item.ccfriApplicationId },
                },
                isAccessible: this.applicationStatus === 'SUBMITTED' || this.isCCFRIOptInComplete(),
                icon: this.getCheckbox(item.isCCFRIClosuresComplete),
                isActive:
                  'change-request-ccfri-closures-guid' === this.$route.name &&
                  this.$route.params.urlGuid === item.ccfriApplicationId,
                position: positionIndex++,
                navBarId: navBarId++,
              });
            }
          }
        });
      }
      let retval = {
        title: NAV_BAR_GROUPS.CCFRI,
        isAccessible: true,
        icon: this.getCheckbox(this.areChildrenComplete(items)),
        expanded: this.isExpanded(NAV_BAR_GROUPS.CCFRI),
        items: items,
        navBarId: navBarId++,
      };
      return retval;
    },
    getCCFRINavigation() {
      let items = [];
      items.push({
        title: 'Opt-In / Opt-Out',
        link: { name: 'ccfri-home' },
        isAccessible: this.isRenewal && this.showApplicationTemplateV1 ? true : isCCOFGroupComplete,
        icon: this.getCheckbox(this.isCCFRIOptInComplete()),
        isActive: 'ccfri-home' === this.$route.name,
        position: positionIndex++,
        navBarId: navBarId++,
      });
      if (this.hasFacilities) {
        this.navBarList?.forEach((item) => {
          //application is read only, send nav link to Add New FEE page
          if (item.ccfriOptInStatus == 1) {
            //only show if Opted In
            if (this.isRenewal) {
              items.push({
                title: 'Parent Fees',
                subTitle: item.facilityName,
                subTitle2: item.facilityAccountNumber,
                id: item.facilityId,
                link: {
                  name:
                    this.applicationStatus === 'SUBMITTED' && item.unlockCcfri != 1
                      ? 'ccfri-add-fees-guid'
                      : 'ccfri-current-fees-guid',
                  params: { urlGuid: item.ccfriApplicationId },
                },
                isAccessible: this.applicationStatus === 'SUBMITTED' ? true : this.isCCFRIOptInComplete(), //don't let user nav to add new fees if opt in / out not compete
                icon: this.getCheckbox(item.isCCFRIComplete),
                isActive:
                  ('ccfri-current-fees-guid' === this.$route.name || 'ccfri-add-fees-guid' === this.$route.name) &&
                  this.$route.params.urlGuid === item.ccfriApplicationId,
                position: positionIndex++,
                navBarId: navBarId++,
              });
            } else {
              items.push({
                title: 'Parent Fees',
                subTitle: item.facilityName,
                subTitle2: item.facilityAccountNumber,
                id: item.facilityId,
                link: { name: 'ccfri-add-fees-guid', params: { urlGuid: item.ccfriApplicationId } },
                isAccessible: this.applicationStatus === 'SUBMITTED' ? true : this.isCCFRIOptInComplete(),
                icon: this.getCheckbox(item.isCCFRIComplete),
                isActive:
                  'ccfri-add-fees-guid' === this.$route.name && this.$route.params.urlGuid === item.ccfriApplicationId,
                position: positionIndex++,
                navBarId: navBarId++,
              });
            }
            if (item.hasRfi || item.unlockRfi) {
              items.push({
                title: 'Parent Fee Increase – RFI',
                subTitle: item.facilityName,
                subTitle2: item.facilityAccountNumber,
                id: item.facilityId,
                link: { name: 'ccfri-request-info', params: { urlGuid: item.ccfriApplicationId } },
                isAccessible: true,
                icon: this.getCheckbox(item.isRfiComplete),
                isActive:
                  'ccfri-request-info' === this.$route.name && this.$route.params.urlGuid === item.ccfriApplicationId,
                position: positionIndex++,
                navBarId: navBarId++,
              });
            }
            if (item.unlockNmf || item.hasNmf) {
              items.push({
                title: 'Parent Fee - RFI',
                subTitle: item.facilityName,
                subTitle2: item.facilityAccountNumber,
                id: item.facilityId,
                link: { name: 'new-facilities', params: { urlGuid: item.ccfriApplicationId } },
                isAccessible: true,
                icon: this.getCheckbox(item.isNmfComplete),
                isActive:
                  this.$route.params.urlGuid === item.ccfriApplicationId && 'new-facilities' === this.$route.name,
                position: positionIndex++,
                navBarId: navBarId++,
              });
            }
            if (!this.showApplicationTemplateV1) {
              items.push({
                title: PAGE_TITLES.CCFRI_CLOSURES,
                subTitle: item.facilityName,
                subTitle2: item.facilityAccountNumber,
                id: item.facilityId,
                link: { name: 'ccfri-closures-guid', params: { urlGuid: item.ccfriApplicationId } },
                isAccessible: this.applicationStatus === 'SUBMITTED' || this.isCCFRIOptInComplete(),
                icon: this.getCheckbox(item.isCCFRIClosuresComplete),
                isActive:
                  'ccfri-closures-guid' === this.$route.name && this.$route.params.urlGuid === item.ccfriApplicationId,
                position: positionIndex++,
                navBarId: navBarId++,
              });
            }
            if (item.enableAfs) {
              items.push({
                title: 'Approvable Fee Schedule',
                subTitle: item.facilityName,
                subTitle2: item.facilityAccountNumber,
                id: item.facilityId,
                link: { name: 'ccfri-afs', params: { urlGuid: item.ccfriApplicationId } },
                isAccessible: true,
                icon: this.getCheckbox(item.isAFSComplete),
                isActive: this.$route.params.urlGuid === item.ccfriApplicationId && 'ccfri-afs' === this.$route.name,
                position: positionIndex++,
                navBarId: navBarId++,
              });
            }
          }
        });
      }
      let retval = {
        title: NAV_BAR_GROUPS.CCFRI,
        isAccessible: this.hasFacilities,
        icon: this.getCheckbox(this.areChildrenComplete(items)),
        expanded: this.isExpanded(NAV_BAR_GROUPS.CCFRI),
        items: items,
        navBarId: navBarId++,
      };
      return retval;
    },
    getCCOFFamilyNavigation() {
      let items = [];
      items.push({
        title: this.showApplicationTemplateV1 ? 'Family Provider' : 'Organization Information',
        link: { name: 'Family Organization Information' },
        isAccessible: true,
        icon: this.getCheckbox(this.isOrganizationComplete),
        isActive: 'Family Organization Information' === this.$route.name,
        position: positionIndex++,
        navBarId: navBarId++,
      });
      if (this.hasFacilities) {
        items.push(
          {
            title: this.showApplicationTemplateV1 ? 'Eligibility' : 'Facility Information',
            subTitle: this.navBarList[0]?.facilityName,
            subTitle2: this.navBarList[0]?.facilityAccountNumber,
            id: this.navBarList[0].facilityId,
            link: { name: 'Family Facility Information GUID', params: { urlGuid: this.navBarList[0].facilityId } },
            isAccessible: true,
            icon: this.getCheckbox(this.navBarList[0].isFacilityComplete),
            isActive:
              'Family Facility Information GUID' === this.$route.name &&
              this.$route.params.urlGuid === this.navBarList[0].facilityId,
            position: positionIndex++,
            navBarId: navBarId++,
          },
          {
            title: PAGE_TITLES.LICENCE_SERVICE_DETAILS,
            subTitle: this.navBarList[0]?.facilityName,
            subTitle2: this.navBarList[0]?.facilityAccountNumber,
            link: { name: 'FamilyFunding GUID', params: { urlGuid: this.navBarList[0].ccofBaseFundingId } },
            isAccessible: true,
            icon: this.getCheckbox(this.navBarList[0].isCCOFComplete),
            isActive:
              'FamilyFunding GUID' === this.$route.name &&
              this.$route.params.urlGuid === this.navBarList[0].ccofBaseFundingId,
            position: positionIndex++,
            navBarId: navBarId++,
          },
        );
      } else {
        //No new facilities, setup a blank template
        items.push(
          {
            title: this.showApplicationTemplateV1 ? 'Eligibility' : 'Facility Information',
            id: null,
            link: { name: 'Family Facility Information' },
            isAccessible: this.isNewFacilityStarted,
            icon: this.getCheckbox(false),
            isActive: 'Family Facility Information' === this.$route.name && this.$route.params.urlGuid == null,
            position: positionIndex++,
            navBarId: navBarId++,
          },
          {
            title: PAGE_TITLES.LICENCE_SERVICE_DETAILS,
            link: { name: 'FamilyFunding' },
            isAccessible: this.isNewFundingStarted,
            icon: this.getCheckbox(false),
            isActive: 'FamilyFunding' === this.$route.name,
            position: positionIndex++,
            navBarId: navBarId++,
          },
        );
      }
      items.push({
        title: 'Licence Upload',
        link: { name: 'Licence Upload' },
        isAccessible: this.hasFacilities,
        icon: this.getCheckbox(this.isLicenseUploadComplete),
        isActive: 'Licence Upload' === this.$route.name,
        position: positionIndex++,
        navBarId: navBarId++,
      });
      isCCOFGroupComplete = this.areChildrenComplete(items);
      let retval = {
        title: NAV_BAR_GROUPS.CCOF,
        isAccessible: true,
        icon: this.getCheckbox(isCCOFGroupComplete),
        expanded: this.isExpanded(NAV_BAR_GROUPS.CCOF),
        items: items,
        navBarId: navBarId++,
      };
      return retval;
    },
    addNewFacilityToCCOFNavbar() {
      return {
        title: PAGE_TITLES.FACILITY_INFO,
        id: null,
        link: { name: this.isChangeRequest ? 'change-request-facility-information' : PAGE_TITLES.FACILITY_INFO },
        isAccessible: this.isNewFacilityStarted,
        icon: this.getCheckbox(false),
        isActive: this.isChangeRequest
          ? 'change-request-facility-information' === this.$route.name && this.$route.params.urlGuid == null
          : PAGE_TITLES.FACILITY_INFO === this.$route.name && this.$route.params.urlGuid == null,
        position: positionIndex++,
        navBarId: navBarId++,
      };
    },
    addNewFundingToCCOFNavbar() {
      return {
        title: PAGE_TITLES.LICENCE_SERVICE_DETAILS,
        link: { name: this.isChangeRequest ? 'Change Request Funding' : 'Funding Amount' },
        isAccessible: this.isNewFundingStarted,
        icon: this.getCheckbox(false),
        isActive: this.isChangeRequest
          ? 'Change Request Funding' === this.$route.name
          : 'Funding Amount' === this.$route.name,
        position: positionIndex++,
        navBarId: navBarId++,
      };
    },
    addNewFacilityConfirmationToCCOFNavbar() {
      let link;
      let isAccessible;
      if (this.isChangeRequest) {
        link = {
          name: 'change-request-new-facility-confirmation',
          params: { changeRecGuid: this.$route.params.changeRecGuid },
        };
        isAccessible = this.navBarList[0]?.isCCOFComplete;
      } else {
        link = { name: 'Application Confirmation' };
        isAccessible = this.hasFacilities;
      }
      return {
        title: 'Add Facility',
        link: link,
        isAccessible: isAccessible,
        icon: 'mdi-information',
        isActive: link.name === this.$route.name,
        position: positionIndex++,
        navBarId: navBarId++,
      };
    },
    addLicenceUploadToCCOFNavbar() {
      let link;
      let isAccessible;
      if (this.isChangeRequest) {
        link = {
          name: 'Change Request Licence Upload',
          params: { changeRecGuid: this.$route.params.changeRecGuid },
        };
        isAccessible = this.navBarList[0]?.isCCOFComplete;
      } else {
        link = { name: 'Licence Upload' };
        isAccessible = this.hasFacilities;
      }
      return {
        title: 'Licence Upload',
        link: link,
        isAccessible: isAccessible,
        icon: this.isChangeRequest
          ? this.getCheckbox(this.isCRLicenseComplete)
          : this.getCheckbox(this.isLicenseUploadComplete),
        isActive: this.isChangeRequest
          ? 'Change Request Licence Upload' === this.$route.name
          : 'Licence Upload' === this.$route.name,
        position: positionIndex++,
        navBarId: navBarId++,
      };
    },
    getMTFINavigation() {
      let items = [];
      items.push({
        title: 'Select Facility',
        link: {
          name: 'Midterm Fee Increase Select Facilities',
          params: { changeRecGuid: this.$route.params.changeRecGuid, changeType: CHANGE_TYPES.MTFI },
        },
        isAccessible: this.organizationProviderType !== ORGANIZATION_PROVIDER_TYPES.FAMILY,
        icon: this.getCheckbox(this.hasFacilities),
        isActive: 'Midterm Fee Increase Select Facilities' === this.$route.name,
        position: positionIndex++,
        navBarId: navBarId++,
      });

      if (this.hasFacilities) {
        this.navBarList?.forEach((item) => {
          items.push({
            title: 'Parent Fee Verification',
            subTitle: item.facilityName,
            subTitle2: item.facilityAccountNumber,
            id: item.facilityId,
            link: {
              name: 'CCFRI Fee Verification',
              params: {
                changeRecGuid: this.$route.params.changeRecGuid,
                urlGuid: item.ccfriApplicationId,
                changeType: CHANGE_TYPES.MTFI,
              },
            },
            isAccessible: true,
            icon: this.getCheckbox(item.isCCFRIComplete),
            isActive:
              'CCFRI Fee Verification' === this.$route.name && this.$route.params.urlGuid === item.ccfriApplicationId,
            position: positionIndex++,
            navBarId: navBarId++,
          });

          if (item.hasRfi || item.unlockRfi) {
            items.push({
              title: 'Parent Fee Increase – RFI',
              subTitle: item.facilityName,
              subTitle2: item.facilityAccountNumber,
              id: item.facilityId,
              link: {
                name: 'mtfi-change-request-ccfri-request-info',
                params: { changeRecGuid: this.$route.params.changeRecGuid, urlGuid: item.ccfriApplicationId },
              },
              isAccessible: true,
              icon: this.getCheckbox(item.isRfiComplete),
              isActive:
                'mtfi-change-request-ccfri-request-info' === this.$route.name &&
                this.$route.params.urlGuid === item.ccfriApplicationId,
              position: positionIndex++,
              navBarId: navBarId++,
            });
          }
          if (item.enableAfs) {
            items.push({
              title: 'Approvable Fee Schedule',
              subTitle: item.facilityName,
              subTitle2: item.facilityAccountNumber,
              id: item.facilityId,
              link: {
                name: 'mtfi-afs',
                params: { changeRecGuid: this.$route.params.changeRecGuid, urlGuid: item.ccfriApplicationId },
              },
              isAccessible: true,
              icon: this.getCheckbox(item.isAFSComplete),
              isActive: 'mtfi-afs' === this.$route.name && this.$route.params.urlGuid === item.ccfriApplicationId,
              position: positionIndex++,
              navBarId: navBarId++,
            });
          }
        });
      }
      let retval = {
        title: NAV_BAR_GROUPS.MTFI,
        isAccessible: true,
        icon: this.getCheckbox(this.areChildrenComplete(items)),
        expanded: this.isExpanded(NAV_BAR_GROUPS.MTFI),
        items: items,
        navBarId: navBarId++,
      };
      return retval;
    },
    getAddNewFacilityCCOFNavigation() {
      let items = [];
      if (this.hasFacilities) {
        this.navBarList?.forEach((item) => {
          items.push(
            {
              title: PAGE_TITLES.FACILITY_INFO,
              subTitle: item.facilityName,
              subTitle2: item.facilityAccountNumber,
              id: item.facilityId,
              link: {
                name: 'change-request-facility-information-guid',
                params: { changeRecGuid: this.$route.params.changeRecGuid, urlGuid: item.facilityId },
              },
              isAccessible: true,
              icon: this.getCheckbox(item.isFacilityComplete),
              isActive:
                'change-request-facility-information-guid' === this.$route.name &&
                this.$route.params.urlGuid === item.facilityId,
              position: positionIndex++,
              navBarId: navBarId++,
            },
            {
              title: PAGE_TITLES.LICENCE_SERVICE_DETAILS,
              subTitle: item.facilityName,
              subTitle2: item.facilityAccountNumber,
              link: {
                name: 'change-request-funding-guid',
                params: { changeRecGuid: this.$route.params.changeRecGuid, urlGuid: item.ccofBaseFundingId },
              },
              isAccessible: true,
              icon: this.getCheckbox(item.isCCOFComplete),
              isActive:
                'change-request-funding-guid' === this.$route.name &&
                this.$route.params.urlGuid === item.ccofBaseFundingId,
              position: positionIndex++,
              navBarId: navBarId++,
            },
          );
        });
      } else {
        //No new facilities, setup a blank template
        items.push(this.addNewFacilityToCCOFNavbar(), this.addNewFundingToCCOFNavbar());
      }
      items.push(this.addNewFacilityConfirmationToCCOFNavbar());
      items.push(this.addLicenceUploadToCCOFNavbar());
      isCCOFGroupComplete = this.areChildrenComplete(items);
      let retval = {
        title: NAV_BAR_GROUPS.CCOF,
        isAccessible: true,
        icon: this.getCheckbox(isCCOFGroupComplete),
        expanded: this.isExpanded(NAV_BAR_GROUPS.CCOF),
        items: items,
        navBarId: navBarId++,
      };
      return retval;
    },
    getCCOFNavigation() {
      let items = [];
      items.push({
        title: 'Organization Information',
        link: { name: 'Group Organization Information' },
        isAccessible: true,
        icon: this.getCheckbox(this.isOrganizationComplete),
        isActive: 'Group Organization Information' === this.$route.name,
        position: positionIndex++,
        navBarId: navBarId++,
      });
      if (this.hasFacilities) {
        this.navBarList?.forEach((item) => {
          items.push(
            {
              title: PAGE_TITLES.FACILITY_INFO,
              subTitle: item.facilityName,
              subTitle2: item.facilityAccountNumber,
              id: item.facilityId,
              link: { name: 'Facility Information Guid', params: { urlGuid: item.facilityId } },
              isAccessible: true,
              icon: this.getCheckbox(item.isFacilityComplete),
              isActive:
                'Facility Information Guid' === this.$route.name && this.$route.params.urlGuid === item.facilityId,
              position: positionIndex++,
              navBarId: navBarId++,
            },
            {
              title: PAGE_TITLES.LICENCE_SERVICE_DETAILS,
              subTitle: item.facilityName,
              subTitle2: item.facilityAccountNumber,
              link: { name: 'Funding Amount Guid', params: { urlGuid: item.ccofBaseFundingId } },
              isAccessible: true,
              icon: this.getCheckbox(item.isCCOFComplete),
              isActive:
                'Funding Amount Guid' === this.$route.name && this.$route.params.urlGuid === item.ccofBaseFundingId,
              position: positionIndex++,
              navBarId: navBarId++,
            },
          );
        });
      } else {
        //No new facilities, setup a blank template
        items.push(this.addNewFacilityToCCOFNavbar(), this.addNewFundingToCCOFNavbar());
      }
      items.push(this.addNewFacilityConfirmationToCCOFNavbar());
      items.push(this.addLicenceUploadToCCOFNavbar());
      isCCOFGroupComplete = this.areChildrenComplete(items);
      let retval = {
        title: NAV_BAR_GROUPS.CCOF,
        isAccessible: true,
        icon: this.getCheckbox(isCCOFGroupComplete),
        expanded: this.isExpanded(NAV_BAR_GROUPS.CCOF),
        items: items,
        navBarId: navBarId++,
      };
      return retval;
    },
    getECEWENavigation() {
      let items = [];
      items.push({
        title: 'Eligibility',
        link: { name: 'ECEWE Eligibility' },
        isAccessible: this.isRenewal && this.showApplicationTemplateV1 ? true : isCCOFGroupComplete,
        icon: this.getCheckbox(this.isEceweComplete),
        isActive: 'ECEWE Eligibility' === this.$route.name,
        position: positionIndex++,
        navBarId: navBarId++,
      });
      items.push({
        title: 'Facility',
        link: { name: 'ECEWE Facilities' },
        isAccessible: this.isEceweComplete,
        icon: this.getCheckbox(this.isEceweFacilitiesComplete()),
        isActive: 'ECEWE Facilities' === this.$route.name,
        position: positionIndex++,
        navBarId: navBarId++,
      });
      let retval = {
        title: NAV_BAR_GROUPS.ECEWE,
        isAccessible: this.hasFacilities,
        icon: this.getCheckbox(this.areChildrenComplete(items)),
        expanded: this.isExpanded(NAV_BAR_GROUPS.ECEWE),
        items: items,
        navBarId: navBarId++,
      };
      return retval;
    },
    getAddNewECEWENavigation() {
      //ece-we still pulls from full application, so shows previous answers
      let items = [];
      items.push({
        title: 'Eligibility',
        link: { name: 'change-request-ECEWE-Eligibility', params: { changeRecGuid: this.$route.params.changeRecGuid } },
        isAccessible: isCCOFGroupComplete, //change this when change req logic more complete
        icon: this.getCheckbox(this.isCREceweComplete),
        isActive: 'change-request-ECEWE-Eligibility' === this.$route.name,
        position: positionIndex++,
        navBarId: navBarId++,
      });
      items.push({
        title: 'Facility',
        link: { name: 'change-request-ECEWE-Facilities', params: { changeRecGuid: this.$route.params.changeRecGuid } },
        isAccessible: this.isCREceweComplete,
        icon: this.getCheckbox(this.isEceweFacilitiesComplete()),
        isActive: 'change-request-ECEWE-Facilities' === this.$route.name,
        position: positionIndex++,
        navBarId: navBarId++,
      });
      let retval = {
        title: NAV_BAR_GROUPS.ECEWE,
        isAccessible: true,
        icon: this.getCheckbox(this.areChildrenComplete(items)),
        expanded: this.isExpanded(NAV_BAR_GROUPS.ECEWE),
        items: items,
        navBarId: navBarId++,
      };
      return retval;
    },
    stripWhitespace(title) {
      return title.replace(/\s+/g, '');
    },
    isCCFRIOptInComplete() {
      return this.hasFacilities
        ? this.navBarList.every((facility) => facility.ccfriOptInStatus == 1 || facility.ccfriOptInStatus == 0)
        : false;
    },
    isEceweFacilitiesComplete() {
      return this.hasFacilities
        ? this.navBarList.every((facility) => facility.eceweOptInStatus == 1 || facility.eceweOptInStatus == 0)
        : false;
    },
    isCcfriComplete() {
      return this.navBarList.every((fac) => {
        return fac.ccfriOptInStatus == 0 || fac.isCCFRIComplete;
      });
    },
    goTo(page) {
      if (page?.isAccessible) {
        this.$router.push(page.link);
      }
    },
    checkApprovableFeeSchedulesComplete() {
      this.userProfileList?.forEach((facility) => {
        const afs = this.approvableFeeSchedules?.find(
          (item) => item.ccfriApplicationId === facility?.ccfriApplicationId,
        );

        const uploadedSupportingDocuments = this.applicationUploadedDocuments?.filter(
          (document) =>
            [DOCUMENT_TYPES.APPLICATION_AFS, DOCUMENT_TYPES.APPLICATION_AFS_SUBMITTED].includes(
              document.documentType,
            ) && document.facilityId === facility.facilityId,
        );
        facility.isAFSComplete =
          [AFS_STATUSES.ACCEPT, AFS_STATUSES.DECLINE].includes(afs?.afsStatus) ||
          (afs?.afsStatus === AFS_STATUSES.UPLOAD_DOCUMENTS && !isEmpty(uploadedSupportingDocuments));
      });
      this.refreshNavBarList();
    },
    checkMTFIApprovableFeeSchedulesComplete() {
      this.navBarList?.forEach((facility) => {
        const afs = this.approvableFeeSchedules?.find(
          (item) => item.ccfriApplicationId === facility?.ccfriApplicationId,
        );
        const uploadedSupportingDocuments = this.uploadedDocuments?.filter(
          (document) =>
            [DOCUMENT_TYPES.APPLICATION_AFS, DOCUMENT_TYPES.APPLICATION_AFS_SUBMITTED].includes(
              document.documentType,
            ) && document.ccof_facility === facility.facilityId,
        );
        facility.isAFSComplete =
          [AFS_STATUSES.ACCEPT].includes(afs?.afsStatus) ||
          (afs?.afsStatus === AFS_STATUSES.UPLOAD_DOCUMENTS && !isEmpty(uploadedSupportingDocuments));
      });

      this.refreshNavBarList();
    },
  },
};
</script>
<style scoped>
#navBar {
  z-index: 7;
}
.router {
  width: 100%;
}
.menuItem {
  color: #003366;
}
.menuRow {
  color: #003366;
}

.nav-title {
  font-size: 1.4rem;
}

@media screen and (max-width: 801px) {
  .nav-title {
    font-size: 1.1rem;
  }
}
.v-list-item :deep(.v-list-item__prepend) {
  max-width: var(--v-list-item-prepend-max-width, auto) !important;
}
.v-list-group__items .v-list-item.custom-item {
  padding-inline-start: 32px !important;
}
</style>
