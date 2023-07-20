<template>

<div class="mb-1">

  <v-navigation-drawer
          v-model="drawer"
          app
          absolute
          :style="`margin-top: ${$vuetify.application.top}px; margin-bottom: ${$vuetify.application.footer}px` "
          width=200
          height="calc(100vh - ${$vuetify.application.footer}px)"
          :permanent="$vuetify.breakpoint.mdAndUp"
          :temporary="!$vuetify.breakpoint.mdAndUp"
>
    <v-list>
      <div v-for="item in items" v-bind:key="item.title">
        <v-list-item v-if="!item.items"
              :key="item.navBarId"
              class="menuRow"
              :id="stripWhitespace(item.title + `MenuBtn`)">
              <v-list-item-icon class="my-3 ml-0 mr-2" v-if="item.icon">
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-item-icon>
              <router-link :is="item.isAccessible ? 'router-link' : 'span'" :to="item.link" :target="_self" class="router">
              <v-list-item-content class="py-0">
                <v-list-item-title v-if="item.isActive" class="menuItem text-wrap"><strong>{{item.title}}</strong></v-list-item-title>
                <v-list-item-title v-else class="menuItem text-wrap">{{item.title}}</v-list-item-title>
              </v-list-item-content>
            </router-link>
        </v-list-item>
        <v-list-group
                v-else
                :key="item.title"
                no-action
                class="groupMenu"
                :id="stripWhitespace(item.title + `MenuBtn`)"
                append-icon=""
                :value = "item.expanded"
                @click="setActive(item)"
        >
          <template v-slot:activator>
            <v-list-item-icon class="my-3 ml-0 mr-2" v-if="item.icon">
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content class="py-0">
              <v-list-item-title v-text="item.title" class="menuItem text-wrap"></v-list-item-title>
            </v-list-item-content>
          </template>

          <v-list-item
                  v-for="subItem in item.items"
                  :key="subItem.navBarId"
                  class="subMenuRow pl-9"
                  :id="stripWhitespace(subItem.title) + `MenuBtn`"
          >
            <v-list-item-icon class="my-3 ml-0 mr-2" v-if="item.icon">
              <v-icon>{{ subItem.icon }}</v-icon>
            </v-list-item-icon>
            <router-link :is="subItem.isAccessible ? 'router-link' : 'span'" :to="subItem.link" :target="subItem.newTab ? '_blank' : '_self'" class="router">
              <v-list-item-content class="py-0">
                <v-list-item-title v-if="subItem.isActive" class="menuItem text-wrap"><strong>{{ subItem.title }}</strong></v-list-item-title>
                <v-list-item-title v-else v-text="subItem.title" :class="subItem.isAccessible? 'menuItem text-wrap' : 'menuItem text-wrap blue-grey--text'"></v-list-item-title>
                <v-list-item-subtitle v-if="subItem.subTitle" class="text-left">{{ subItem.subTitle }}</v-list-item-subtitle>
              </v-list-item-content>
            </router-link>
          </v-list-item>
        </v-list-group>
      </div>
    </v-list>
  </v-navigation-drawer>
  <v-app-bar v-if="hasAnyItems" app absolute elevation="0"
    color="#38598A" :dark="true" id="navBar"
    class="pl-4 pr-8 justify-start" :class="{'pl-16': $vuetify.breakpoint.mdAndUp}" clipped-left>
    <v-app-bar-nav-icon id="menuBtn" @click="drawer=true">
      <v-icon v-if="!drawer">$menu</v-icon>
      <v-icon v-else>$close</v-icon>
      <p class="ma-0 pl-4 pr-2 hidden-sm-and-down">Menu</p>
    </v-app-bar-nav-icon>
    <v-toolbar-title id="navTitle" class="nav-title " :class="{'ml-4': $vuetify.breakpoint.mdAndUp, 'pl-1': $vuetify.breakpoint.smAndDown}">{{ title }}</v-toolbar-title>
    <v-spacer></v-spacer>
  </v-app-bar>
</div>
</template>

<script>

import { mapState, mapGetters, mapMutations } from 'vuex';
import { NAV_BAR_GROUPS } from '@/utils/constants';
import StaticConfig from '../../common/staticConfig';

let positionIndex = 0;
let navBarId = 0;
let isCCOFGroupComplete = false;


export default {
  name: 'navBar',
  props: {
    title: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      drawer: null,
      items: [],
      hasAnyItems: false
    };
  },
  computed: {
    ...mapState('app', ['pageTitle','isRenewal', 'programYearList']),
    ...mapState('navBar', ['navBarList', 'refreshNavBar', 'navBarGroup']),
    ...mapState('application', ['applicationStatus', 'isEceweComplete','unlockDeclaration', 'programYearId', 'isLicenseUploadComplete']),
    ...mapState('organization', ['organizationProviderType', 'organizationAccountNumber', 'isOrganizationComplete']),
    ...mapGetters('facility', ['isNewFacilityStarted']),
    ...mapGetters('funding', ['isNewFundingStarted']),
    ...mapGetters('navBar', ['isChangeRequest']),
    ...mapGetters('auth', ['userInfo']),
    ...mapGetters('reportChanges', ['isCREceweComplete', 'isCRLicenseComplete', 'changeRequestStatus']),
    navRefresh() {
      return this.$route.name + this.$route.params.urlGuid;
    },

    navWidth () {
      switch (this.$vuetify.breakpoint.name) {
      case 'xs':
        return '50%';
      case 'sm':
        return '50%';
      default:
        return '15%';
      }
    },
    ccofConfirmationEnabled() {
      return (this.isLicenseUploadComplete != null);
    },
  },
  watch:{
    navRefresh: {
      handler() {
        console.log('BuildNavBar called - trigged by navRefresh - computed value');
        this.buildNavBar();
      },
      immediate: true,
      deep: true
    },
    refreshNavBar: {
      handler() {
        console.log('BuildNavBar called - trigged by navBarRefresh - forced refresh');
        this.buildNavBar();
      },
      immediate: true,
      deep: true
    },
  },
  methods: {
    ...mapMutations('navBar', ['setNavBarItems', 'setCanSubmit', ]),
    setActive(item) {
      this.items[1].expanded = false;
      let index = this.items.findIndex(obj => obj.title === item.title);
      if(item.active) {
        this.items[index].active = false;
      } else {
        this.items.filter(obj => obj.items && obj.active).forEach(obj => obj.active = !obj.active);
        this.items[index].active = true;
      }
    },
    areChildrenComplete(list) {
      return list.every(item => {
        return item.icon === 'mdi-check-circle' || item.icon === 'mdi-information' || item.icon === 'mdi-home';
      });
    },
    buildNavBar(){
      positionIndex = 0;
      navBarId = 0;
      isCCOFGroupComplete = false;

      this.items = [];
      console.log('is change request: ', this.isChangeRequest);
      console.log('is change request: ', this.$route.path);
      if (this.isChangeRequest) {
        console.log('calling new Fac build nav bar');
        this.buildNewFacilityNavBar();
      } else {
        this.buildApplicationNavBar();
      }
    },

    addLandingPageToNavBar() {
      this.items.push(
        {
          title: 'Home',
          link: {name: 'landing-page'},
          isAccessible: true,
          icon: 'mdi-home', //replace
          expanded: false,
          position: positionIndex++,
          navBarId: navBarId++
        });
    },
    addSummaryAndDeclarationToNavBar() {
      let declarationAccessible = this.areChildrenComplete(this.items);
      if (StaticConfig.DECB_VALIDATION_BYPASS && this.isDeclarationB() && this.unlockDeclaration && !this.isChangeRequest) {
        declarationAccessible = true;
      }
      this.setCanSubmit(declarationAccessible);
      let checkbox; //true will show checkmark, false will not
      let linkName;
      if (this.isChangeRequest) {
        checkbox = this.changeRequestStatus === 'SUBMITTED' && !this.unlockDeclaration;
        linkName = 'Summary and Declaration New Facility';
      } else {
        checkbox = this.applicationStatus === 'SUBMITTED' && !this.unlockDeclaration;
        linkName = 'Summary and Declaration';
      }
      this.items.push(
        {
          title: 'Declaration',
          link: {name: linkName},
          isAccessible: declarationAccessible, //set this to true to unlock the declaration
          icon: this.getCheckbox(checkbox),
          isActive: linkName === this.$route.name,
          expanded: false,
          position: positionIndex++,
          navBarId: navBarId++
        });
    },
    addLicenseUploadToNavbar() {
      this.items.push(
        {
          title: 'Licence Upload',
          link: {name: 'Licence Upload'},
          isAccessible: true,
          icon: this.getCheckbox(this.isLicenseUploadComplete),
          isActive: 'Licence Upload' === this.$route.name,
          position: positionIndex++,
          navBarId: navBarId++
        });
    },
    addSupportingDocumentsToNavbar() {
      this.items.push({
        title: 'Supporting Document',
        link: {name: 'Supporting Document Upload'},
        isAccessible: this.isRenewal ? true : isCCOFGroupComplete,
        icon: 'mdi-information',
        isActive: 'Supporting Document Upload' === this.$route.name,
        expanded: false,
        position: positionIndex++,
        navBarId: navBarId++

      });
    },
    addNewSupportingDocumentsToNavbar() {
      this.items.push({
        title: 'Supporting Document',
        link: { name: 'change-request-Supporting-Document-Upload', params: {changeRecGuid: this.$route.params.changeRecGuid}},
        isAccessible: true, //change this when change req logic more complete
        icon: 'mdi-information',
        isActive: 'change-request-Supporting-Document-Upload' === this.$route.name,
        expanded: false,
        position: positionIndex++,
        navBarId: navBarId++
      });
    },
    addReportChangeNavigationToNavBar(){
      this.items.push({
        title: 'Report Change',
        link: {name: 'Report Change'},
        isAccessible: true,
        icon: 'mdi-information',
        isActive: 'Report Change' === this.$route.name,
        expanded: false,
        position: positionIndex++,
        navBarId: navBarId++

      });
    },
    buildReportChangeNavBar(){
      this.addLandingPageToNavBar();
      this.addReportChangeNavigationToNavBar();
      this.setNavBarItems(this.items);
    },
    buildApplicationNavBar(){
      this.addLandingPageToNavBar();
      if (this.isRenewal) {
        this.addLicenseUploadToNavbar();
      } else {
        if (this.organizationProviderType === 'FAMILY') {
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

    buildNewFacilityNavBar(){
      console.log('building new FAC nav barr');

      this.addLandingPageToNavBar();
      //this.items.push(this.getCCOFNavigation());//JB
      this.items.push(this.getAddNewFacilityCCOFNavigation());
      this.items.push(this.getAddNewCCFRINavigation()); //JB
      this.items.push(this.getAddNewECEWENavigation());
      this.addNewSupportingDocumentsToNavbar();
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
        const programYear = this.programYearList.list.find(({ programYearId }) =>  programYearId == this.programYearId );
        const serverTime = new Date(this.userInfo.serverTime);
        if (programYear) {
          let declarationBStart = new Date(programYear.declarationbStart);
          return ((serverTime >= declarationBStart) && this.organizationAccountNumber);
        }
      }
      return false;
    },
    isExpanded(groupName) {
      return (groupName === this.navBarGroup);
    },
    getAddNewCCFRINavigation(){
      let items = [];
      items.push(
        {
          title: 'Opt in / Opt out',
          link: { name: 'change-request-ccfri-home', params: {changeRecGuid: this.$route.params.changeRecGuid}},
          isAccessible: true, //Change - when newFacilityCCOF is complete
          icon: this.getCheckbox(this.isCCFRIOptInComplete()),
          isActive: 'change-request-ccfri-home' === this.$route.name,
          position: positionIndex++,
          navBarId: navBarId++
        },

      );
      if (this.navBarList?.length > 0) {
        this.navBarList?.forEach((item) => {
          //new facility only needs add new fees
          if (item.ccfriOptInStatus == 1) { //only show if Opted In
            items.push(
              {
                title: 'Parent Fees',
                subTitle: item.facilityName,
                id: item.facilityId,
                link: { name: 'change-request-ccfri-add-fees-guid', params: {changeRecGuid: this.$route.params.changeRecGuid, urlGuid: item.ccfriApplicationId}},
                isAccessible: this.applicationStatus==='SUBMITTED' ? true: this.isCCFRIOptInComplete(),
                icon:  this.getCheckbox(item.isCCFRIComplete),
                isActive: 'change-request-ccfri-add-fees-guid' === this.$route.name && this.$route.params.urlGuid === item.ccfriApplicationId,
                position: positionIndex++,
                navBarId: navBarId++
              },
            );
            if (item.hasRfi || item.unlockRfi) {
              items.push(
                {
                  title: 'Parent Fee Increase – RFI',
                  subTitle: item.facilityName,
                  id: item.facilityId,
                  link: { name: 'ccfri-request-info', params: {urlGuid: item.ccfriApplicationId}},
                  isAccessible: true,
                  icon: this.getCheckbox(item.isRfiComplete),
                  isActive: 'ccfri-request-info' === this.$route.name && this.$route.params.urlGuid === item.ccfriApplicationId,
                  position: positionIndex++,
                  navBarId: navBarId++
                },
              );
            }
            if (item.unlockNmf || item.hasNmf) {
              items.push(
                {
                  title: 'Parent Fee - RFI',
                  subTitle: item.facilityName,
                  id: item.facilityId,
                  link: { name: 'new-facilities', params: {urlGuid: item.ccfriApplicationId} },
                  isAccessible: true,
                  icon:  this.getCheckbox(item.isNmfComplete),
                  isActive: (this.$route.params.urlGuid === item.ccfriApplicationId && 'new-facilities' === this.$route.name),
                  position: positionIndex++,
                  navBarId: navBarId++
                },
              );
            }
          }
        });
      }
      let retval =   {
        title: NAV_BAR_GROUPS.CCFRI,
        isAccessible: true,
        icon: this.getCheckbox(this.areChildrenComplete(items)),
        expanded: this.isExpanded(NAV_BAR_GROUPS.CCFRI),
        items: items,
        navBarId: navBarId++
      };
      return retval;
    },
    getCCFRINavigation(){
      let items = [];
      items.push(
        {
          title: 'Opt in / Opt out',
          link: { name: 'ccfri-home'},
          isAccessible: this.isRenewal ? true : isCCOFGroupComplete,
          icon: this.getCheckbox(this.isCCFRIOptInComplete()),
          isActive: 'ccfri-home' === this.$route.name,
          position: positionIndex++,
          navBarId: navBarId++
        },

      );
      if (this.navBarList?.length > 0) {
        this.navBarList?.forEach((item) => {
          //application is read only, send nav link to Add New FEE page
          if (item.ccfriOptInStatus == 1) { //only show if Opted In
            if (this.isRenewal){
              items.push(
                {
                  title: 'Parent Fees',
                  subTitle: item.facilityName,
                  id: item.facilityId,
                  link: { name: (this.applicationStatus==='SUBMITTED' && item.unlockCcfri != 1) ? 'ccfri-add-fees-guid' : 'ccfri-current-fees-guid', params: {urlGuid: item.ccfriApplicationId}},
                  isAccessible: this.applicationStatus==='SUBMITTED' ? true: this.isCCFRIOptInComplete(), //don't let user nav to add new fees if opt in / out not compete
                  icon: this.getCheckbox(item.isCCFRIComplete),
                  isActive: ('ccfri-current-fees-guid' === this.$route.name || 'ccfri-add-fees-guid' === this.$route.name)  && this.$route.params.urlGuid === item.ccfriApplicationId,
                  position: positionIndex++,
                  navBarId: navBarId++

                },
              );
            }
            else {
              items.push(
                {
                  title: 'Parent Fees',
                  subTitle: item.facilityName,
                  id: item.facilityId,
                  link: { name: 'ccfri-add-fees-guid', params: {urlGuid: item.ccfriApplicationId}},
                  isAccessible: this.applicationStatus==='SUBMITTED' ? true: this.isCCFRIOptInComplete(),
                  icon:  this.getCheckbox(item.isCCFRIComplete),
                  isActive: 'ccfri-add-fees-guid' === this.$route.name && this.$route.params.urlGuid === item.ccfriApplicationId,
                  position: positionIndex++,
                  navBarId: navBarId++
                },
              );
            }
            if (item.hasRfi || item.unlockRfi) {
              items.push(
                {
                  title: 'Parent Fee Increase – RFI',
                  subTitle: item.facilityName,
                  id: item.facilityId,
                  link: { name: 'ccfri-request-info', params: {urlGuid: item.ccfriApplicationId}},
                  isAccessible: true,
                  icon: this.getCheckbox(item.isRfiComplete),
                  isActive: 'ccfri-request-info' === this.$route.name && this.$route.params.urlGuid === item.ccfriApplicationId,
                  position: positionIndex++,
                  navBarId: navBarId++
                },
              );
            }
            if (item.unlockNmf || item.hasNmf) {
              items.push(
                {
                  title: 'Parent Fee - RFI',
                  subTitle: item.facilityName,
                  id: item.facilityId,
                  link: { name: 'new-facilities', params: {urlGuid: item.ccfriApplicationId} },
                  isAccessible: true,
                  icon:  this.getCheckbox(item.isNmfComplete),
                  isActive: (this.$route.params.urlGuid === item.ccfriApplicationId && 'new-facilities' === this.$route.name),
                  position: positionIndex++,
                  navBarId: navBarId++
                },
              );
            }
          }
        });
      }
      let retval =   {
        title: NAV_BAR_GROUPS.CCFRI,
        isAccessible: true,
        icon: this.getCheckbox(this.areChildrenComplete(items)),
        expanded: this.isExpanded(NAV_BAR_GROUPS.CCFRI),
        items: items,
        navBarId: navBarId++
      };
      return retval;
    },
    getCCOFFamilyNavigation() {
      let items = [];
      items.push(
        {
          title: 'Family Provider',
          link: { name: 'Family Organization Information' },
          isAccessible: true,
          icon: this.getCheckbox(this.isOrganizationComplete),
          isActive: 'Family Organization Information' === this.$route.name,
          position: positionIndex++,
          navBarId: navBarId++
        }
      );
      if (this.navBarList?.length > 0) {
        items.push(
          {
            title: 'Eligibility',
            subTitle: this.navBarList[0].facilityName,
            id: this.navBarList[0].facilityId,
            link: { name: 'Eligibility GUID', params: {urlGuid: this.navBarList[0].facilityId}},
            isAccessible: true,
            icon: this.getCheckbox(this.navBarList[0].isFacilityComplete),
            isActive: 'Eligibility GUID' === this.$route.name && this.$route.params.urlGuid === this.navBarList[0].facilityId,
            position: positionIndex++,
            navBarId: navBarId++
          },
          {
            title: 'Funding',
            subTitle: this.navBarList[0].facilityName,
            link: { name: 'FamilyFunding GUID' , params: {urlGuid: this.navBarList[0].ccofBaseFundingId}},
            isAccessible: true,
            icon: this.getCheckbox(this.navBarList[0].isCCOFComplete),
            isActive: 'FamilyFunding GUID' === this.$route.name && this.$route.params.urlGuid === this.navBarList[0].ccofBaseFundingId,
            position: positionIndex++,
            navBarId: navBarId++
          },
        );
      } else {
        //No new facilities, setup a blank template
        items.push(
          {
            title: 'Eligibility',
            id: null,
            link: { name: 'Eligibility'},
            isAccessible: this.isNewFacilityStarted,
            icon: this.getCheckbox(false),
            isActive: 'Eligibility' === this.$route.name && this.$route.params.urlGuid == null,
            position: positionIndex++,
            navBarId: navBarId++
          },
          {
            title: 'Funding',
            link: { name: 'FamilyFunding'},
            isAccessible: this.isNewFundingStarted,
            icon: this.getCheckbox(false),
            isActive: 'FamilyFunding' === this.$route.name,
            position: positionIndex++,
            navBarId: navBarId++
          },
        );
      }
      items.push(
        {
          title: 'Licence Upload',
          link: { name: 'Licence Upload'},
          isAccessible: this.ccofConfirmationEnabled,
          icon: this.getCheckbox(this.isLicenseUploadComplete),
          isActive: 'Licence Upload' === this.$route.name,
          position: positionIndex++,
          navBarId: navBarId++
        }
      );
      isCCOFGroupComplete = this.areChildrenComplete(items);
      let retval =   {
        title: NAV_BAR_GROUPS.CCOF,
        isAccessible: true,
        icon: this.getCheckbox(isCCOFGroupComplete),
        expanded: this.isExpanded(NAV_BAR_GROUPS.CCOF),
        items: items,
        navBarId: navBarId++
      };
      return retval;
    },
    addNewFacilityToCCOFNavbar() {
      return {
        title: 'Facility',
        id: null,
        link: {name: this.isChangeRequest? 'Report Change Facility' : 'Facility Information'},
        isAccessible: this.isNewFacilityStarted,
        icon: this.getCheckbox(false),
        isActive: this.isChangeRequest? 'Report Change Facility' === this.$route.name && this.$route.params.urlGuid == null : 'Facility Information' === this.$route.name && this.$route.params.urlGuid == null,
        position: positionIndex++,
        navBarId: navBarId++
      };
    },
    addNewFundingToCCOFNavbar() {
      return {
        title: 'Funding',
        link: {name: this.isChangeRequest? 'Change Request Funding' : 'Funding Amount'},
        isAccessible: this.isNewFundingStarted,
        icon: this.getCheckbox(false),
        isActive: this.isChangeRequest? 'Change Request Funding' === this.$route.name : 'Funding Amount' === this.$route.name,
        position: positionIndex++,
        navBarId: navBarId++
      };
    },
    addNewFacilityConfirmationToCCOFNavbar() {
      let link;
      if (this.isChangeRequest) {
        link = {
          name: 'change-request-new-facility-confirmation',
          params: {changeRecGuid: this.$route.params.changeRecGuid}
        };
      } else {
        link = { name: 'Application Confirmation'};
      }
      return {
        title: 'Add Facility',
        link: link,
        isAccessible: this.ccofConfirmationEnabled,
        icon: 'mdi-information',
        isActive: 'Application Confirmation' === this.$route.name,
        position: positionIndex++,
        navBarId: navBarId++
      };
    },
    addLicenceUploadToCCOFNavbar() {
      let link;
      if (this.isChangeRequest) {
        link = {
          name: 'Change Request Licence Upload',
          params: {changeRecGuid: this.$route.params.changeRecGuid}
        };
      } else {
        link = {name: 'Licence Upload'};
      }
      return {
        title: 'Licence Upload',
        link: link,
        isAccessible: this.ccofConfirmationEnabled,
        icon: this.isChangeRequest? this.getCheckbox(this.isCRLicenseComplete): this.getCheckbox(this.isLicenseUploadComplete),
        isActive: this.isChangeRequest? 'Change Request Licence Upload' === this.$route.name : 'Licence Upload' === this.$route.name,
        position: positionIndex++,
        navBarId: navBarId++
      };
    },
    getAddNewFacilityCCOFNavigation(){
      let items = [];
      console.log('changeRecGuid::::::::', this.$route.params.changeRecGuid);
      if (this.navBarList?.length > 0) {
        this.navBarList?.forEach((item) => {
          items.push(
            {
              title: 'Facility',
              subTitle: item.facilityName,
              id: item.facilityId,
              link: { name: 'change-request-facility-information-guid', params: {changeRecGuid: this.$route.params.changeRecGuid, urlGuid: item.facilityId}},
              isAccessible: true,
              icon: this.getCheckbox(item.isFacilityComplete),
              isActive: 'change-request-facility-information-guid' === this.$route.name && this.$route.params.urlGuid === item.facilityId,
              position: positionIndex++,
              navBarId: navBarId++
            },
            //funding doesn't work right, wait until Viet is done integration before trying again
            {
              title: 'Funding',
              subTitle: item.facilityName,
              link: { name: 'change-request-funding-guid', params: {changeRecGuid: this.$route.params.changeRecGuid, urlGuid: item.ccofBaseFundingId}},
              isAccessible: true,
              icon: this.getCheckbox(item.isCCOFComplete),
              isActive: 'change-request-funding-guid' === this.$route.name && this.$route.params.urlGuid === item.ccofBaseFundingId,
              position: positionIndex++,
              navBarId: navBarId++
            },
          );
        });
      } else {
        //No new facilities, setup a blank template
        items.push(
          this.addNewFacilityToCCOFNavbar(),
          this.addNewFundingToCCOFNavbar(),
        );
      }
      items.push(
        this.addNewFacilityConfirmationToCCOFNavbar()
      );
      items.push(
        this.addLicenceUploadToCCOFNavbar()
      );
      isCCOFGroupComplete = this.areChildrenComplete(items);
      let retval =   {
        title: NAV_BAR_GROUPS.CCOF,
        isAccessible: true,
        icon: this.getCheckbox(isCCOFGroupComplete),
        expanded: this.isExpanded(NAV_BAR_GROUPS.CCOF),
        items: items,
        navBarId: navBarId++
      };
      return retval;
    },
    getCCOFNavigation() {
      let items = [];
      items.push(
        {
          title: 'Organization',
          link: { name: 'Group Organization Information' },
          isAccessible: true,
          icon: this.getCheckbox(this.isOrganizationComplete),
          isActive: 'Group Organization Information' === this.$route.name,
          position: positionIndex++,
          navBarId: navBarId++
        }
      );
      if (this.navBarList?.length > 0) {
        this.navBarList?.forEach((item) => {
          items.push(
            {
              title: 'Facility',
              subTitle: item.facilityName,
              id: item.facilityId,
              link: { name: 'Facility Information Guid', params: {urlGuid: item.facilityId}},
              isAccessible: true,
              icon: this.getCheckbox(item.isFacilityComplete),
              isActive: 'Facility Information Guid' === this.$route.name && this.$route.params.urlGuid === item.facilityId,
              position: positionIndex++,
              navBarId: navBarId++
            },
            {
              title: 'Funding',
              subTitle: item.facilityName,
              link: { name: 'Funding Amount Guid' , params: {urlGuid: item.ccofBaseFundingId}},
              isAccessible: true,
              icon: this.getCheckbox(item.isCCOFComplete),
              isActive: 'Funding Amount Guid' === this.$route.name && this.$route.params.urlGuid === item.ccofBaseFundingId,
              position: positionIndex++,
              navBarId: navBarId++
            },
          );
        });
      } else {
        //No new facilities, setup a blank template
        items.push(
          this.addNewFacilityToCCOFNavbar(),
          this.addNewFundingToCCOFNavbar(),
        );
      }
      items.push(
        this.addNewFacilityConfirmationToCCOFNavbar()
      );
      items.push(
        this.addLicenceUploadToCCOFNavbar()
      );
      isCCOFGroupComplete = this.areChildrenComplete(items);
      let retval =   {
        title: NAV_BAR_GROUPS.CCOF,
        isAccessible: true,
        icon: this.getCheckbox(isCCOFGroupComplete),
        expanded: this.isExpanded(NAV_BAR_GROUPS.CCOF),
        items: items,
        navBarId: navBarId++
      };
      return retval;
    },
    getECEWENavigation(){
      let items = [];
      items.push(
        {
          title: 'Eligibility',
          link: { name: 'ECEWE Eligibility'},
          isAccessible: this.isRenewal ? true :  isCCOFGroupComplete,
          icon: this.getCheckbox(this.isEceweComplete),
          isActive: 'ECEWE Eligibility' === this.$route.name,
          position: positionIndex++,
          navBarId: navBarId++
        },
      );
      items.push(
        {
          title: 'Facility',
          link: { name: 'ECEWE Facilities'},
          isAccessible: this.isEceweComplete,
          icon: this.getCheckbox(this.isEceweFacilitiesComplete()),
          isActive: 'ECEWE Facilities' === this.$route.name,
          position: positionIndex++,
          navBarId: navBarId++
        },
      );
      let retval =   {
        title: NAV_BAR_GROUPS.ECEWE,
        isAccessible: true,
        icon: this.getCheckbox(this.areChildrenComplete(items)),
        expanded: this.isExpanded(NAV_BAR_GROUPS.ECEWE),
        items: items,
        navBarId: navBarId++
      };
      return retval;
    },
    getAddNewECEWENavigation(){
      //ece-we still pulls from full application, so shows previous answers
      let items = [];
      items.push(
        {
          title: 'Eligibility',
          link: { name: 'change-request-ECEWE-Eligibility', params: {changeRecGuid: this.$route.params.changeRecGuid}},
          isAccessible: true, //change this when change req logic more complete
          icon: this.getCheckbox(this.isCREceweComplete),
          isActive: 'change-request-ECEWE-Eligibility' === this.$route.name,
          position: positionIndex++,
          navBarId: navBarId++
        },
      );
      items.push(
        {
          title: 'Facility',
          link: { name: 'change-request-ECEWE-Facilities', params: {changeRecGuid: this.$route.params.changeRecGuid}},
          isAccessible: this.isEceweComplete,
          icon: this.getCheckbox(this.isEceweFacilitiesComplete()),
          isActive: 'change-request-ECEWE-Facilities' === this.$route.name,
          position: positionIndex++,
          navBarId: navBarId++
        },
      );
      let retval =   {
        title: NAV_BAR_GROUPS.ECEWE,
        isAccessible: true,
        icon: this.getCheckbox(this.areChildrenComplete(items)),
        expanded: this.isExpanded(NAV_BAR_GROUPS.ECEWE),
        items: items,
        navBarId: navBarId++
      };
      return retval;
    },
    stripWhitespace(title) {
      return title.replace(/\s+/g, '');
    },
    isCCFRIOptInComplete(){
      return this.navBarList?.length > 0 ? this.navBarList.every(facility => (facility.ccfriOptInStatus == 1 || facility.ccfriOptInStatus == 0 )) : false;
    },
    isEceweFacilitiesComplete() {
      return this.navBarList?.length > 0 ? this.navBarList.every(facility => (facility.eceweOptInStatus == 1 || facility.eceweOptInStatus == 0 )) : false;
    },
    isCcfriComplete(){
      return this.navBarList.every(fac => {
        return fac.ccfriOptInStatus == 0 || fac.isCCFRIComplete;
      });
    },
  }
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
  /* .v-list-item {
    height: 35px;
    min-height: 35px;
  } */

  /* .menuRow, .groupMenu {
    border-bottom: 2px solid #d2d2d2;
  } */
  /* .router:hover .v-list-item__content, /deep/.v-list-group__header:hover .v-list-item__content, .router-link-exact-active {
    text-decoration: underline #003366;
  } */
  /* .subMenuRow {
    border-top: 2px solid #d2d2d2;
    border-left: 4px solid #FCBA19;
    background-color: white;
  } */
  .menuRow /deep/ i {
    color: #003366;
  }
  /deep/ .active {
    border-left: 4px solid #FCBA19;
    background-color: white;
  }
  header /deep/ .v-toolbar__content {
    padding-left: 0 !important;
  }
  /deep/ .v-list-group__header:before {
    background-color: #E9EBEF;
    height: 10px;

  }
  /* .v-list-item {
    min-height: 24px!important;
  } */

  .nav-title {
    font-size: 1.4rem;
  }

  @media screen and (max-width: 801px){
    .nav-title {
      font-size: 1.1rem;
    }
  }
</style>
