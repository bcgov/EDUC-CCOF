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
    ...mapState('app', ['pageTitle', 'navBarGroup', 'navBarList', 'isLicenseUploadComplete', 'isRenewal', 'forceNavBarRefresh', 'isOrganizationComplete', 'programYearList']),
    ...mapState('application', ['applicationStatus', 'isEceweComplete','unlockDeclaration', 'programYearId']),
    ...mapState('organization', ['organizationProviderType']),
    ...mapGetters('facility', ['isNewFacilityStarted']),
    ...mapGetters('funding', ['isNewFundingStarted']),
    ...mapGetters('auth', ['userInfo']),
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
    navBarList: {
      handler() {
        console.log('BuildNavBar called - trigged by navBarList');
        this.buildNavBar();
      },
      immediate: true,
      deep: true
    },
    forceNavBarRefresh: {
      handler() {
        console.log('BuildNavBar called - trigged by navBarRefresh - forced refresh');
        this.buildNavBar();
      },
      immediate: true,
      deep: true
    },
  },
  methods: {
    ...mapMutations('navBar', ['setNavBarItems', 'setCanSubmit']),
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
      this.items.push(
        {
          title: 'Home',
          link: { name: 'landing-page' },
          isAccessible: true,
          icon: 'mdi-home', //replace
          expanded: false,
          position: positionIndex++,
          navBarId: navBarId++
        });
      if (this.isRenewal) {
        this.items.push(
          {
            title: 'Licence Upload',
            link: { name: 'Licence Upload'},
            isAccessible: true,
            icon: this.getCheckbox(this.isLicenseUploadComplete),
            isActive: 'Licence Upload' === this.$route.name,
            position: positionIndex++,
            navBarId: navBarId++
          });
      } else {
        if (this.organizationProviderType == 'FAMILY') {
          this.items.push(this.getCCOFFamilyNavigation());
        } else {
          this.items.push(this.getCCOFNavigation());
        }
      }
      this.items.push(this.getCCFRINavigation());
      this.items.push(this.getECEWENavigation());
      this.items.push({
        title: 'Supporting Document',
        link:{ name: 'Supporting Document Upload' },
        isAccessible:this.isRenewal ? true :  isCCOFGroupComplete,
        icon:'mdi-information',
        isActive: 'Supporting Document Upload' === this.$route.name,
        expanded:false,
        position: positionIndex++,
        navBarId: navBarId++

      });
      let declarationAccessible = this.areChildrenComplete(this.items);
      if (StaticConfig.DECB_VALIDATION_BYPASS && this.isDeclarationB()) {
        declarationAccessible = true;
      }
      this.setCanSubmit(declarationAccessible);
      this.items.push(
        {
          title: 'Declaration',
          link: { name: 'Summary and Declaration' },
          isAccessible: declarationAccessible, //set this to true to unlock the declaration
          icon: this.getCheckbox(this.applicationStatus==='SUBMITTED' && !this.unlockDeclaration),
          isActive: 'Summary and Declaration' === this.$route.name,
          expanded: false,
          position: positionIndex++,
          navBarId: navBarId++
        });
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
          return (serverTime >= declarationBStart);
        }
      }
      return false;
    },
    isExpanded(groupName) {
      return (groupName === this.navBarGroup);
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
          {
            title: 'Facility',
            id: null,
            link: { name: 'Facility Information'},
            isAccessible: this.isNewFacilityStarted,
            icon: this.getCheckbox(false),
            isActive: 'Facility Information' === this.$route.name && this.$route.params.urlGuid == null,
            position: positionIndex++,
            navBarId: navBarId++
          },
          {
            title: 'Funding',
            link: { name: 'Funding Amount'},
            isAccessible: this.isNewFundingStarted,
            icon: this.getCheckbox(false),
            isActive: 'Funding Amount' === this.$route.name,
            position: positionIndex++,
            navBarId: navBarId++
          },
        );
      }
      items.push(
        {
          title: 'Add Facility',
          link: { name: 'Application Confirmation'},
          isAccessible: this.ccofConfirmationEnabled,
          icon: 'mdi-information',
          isActive: 'Application Confirmation' === this.$route.name,
          position: positionIndex++,
          navBarId: navBarId++
        }
      );
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
