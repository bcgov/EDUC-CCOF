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
              :key="item.title+`1`"
              class="menuRow"
              :id="stripWhitespace(item.title + `MenuBtn`)">
              <v-list-item-icon class="my-3 ml-0 mr-2" v-if="item.icon">
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-item-icon>
              <router-link :to="item.link"  :target="_self" class="router">
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
                  :key="subItem.title"
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

import { mapState, mapGetters } from 'vuex';
import { NAV_BAR_GROUPS } from '@/utils/constants';
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
    ...mapState('app', ['pageTitle', 'navBarGroup', 'navBarList', 'isLicenseUploadComplete', 'isRenewal', 'ccfriOptInComplete', 'navBarRefresh', 'isOrganizationComplete','ccofLicenseUploadComplete', 'rfiList', 'eceweEligibilityComplete', 'eceweFacilitiesComplete']),
    ...mapState('organization', ['organizationProviderType']),
    ...mapGetters('facility', ['isNewFacilityStarted']),
    ...mapGetters('funding', ['isNewFundingStarted']),
    ...mapGetters('auth', ['userInfo']),
    navRefresh() {
      return this.pageTitle + this.$route.params.urlGuid;
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
    }

  },
  watch:{
    navRefresh: {
      handler() {
        this.refreshNavBar();
      },
      immediate: true,
      deep: true
    },
    navBarList: {
      handler() {
        this.refreshNavBar();
      },
      immediate: true,
      deep: true
    },
    navBarRefresh: {
      handler() {
        this.refreshNavBar();
      },
      immediate: true,
      deep: true
    },
  },
  methods: {
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
    refreshNavBar(){
      console.log('refresh nav bar called');
      this.items = [];
      this.items.push(
        {
          title: 'Home',
          link: { name: 'landing-page' },
          isAccessible: true,
          icon: 'mdi-home', //replace
          expanded: false,
        });
      if (this.isRenewal) {
        this.items.push(
          {
            title: 'License Upload',
            link: { name: 'License Upload'},
            isAccessible: true,
            icon: this.getCheckbox(this.isLicenseUploadComplete),
            isActive: 'License Upload' === this.$route.name
          });
      } else {
        if (this.organizationProviderType == 'FAMILY') {
          this.items.push(this.getCCOFFamilyNavigation());
        } else {
          this.items.push(this.getCCOFNavigation());
        }
      }
      this.items.push(this.getCCFRINavigation());
      if (this.rfiList?.length > 0) {
        this.items.push(this.getRFINavigation());
      }
      this.items.push(this.getECEWENavigation());
      this.items.push({
        title: 'Supporting Document',
        link:{ name: 'Supporting Document Upload' },
        isAccessible:true,
        icon:'mdi-checkbox-blank-circle-outline',
        isActive: 'Supporting Document Upload' === this.$route.name,
        expanded:false,
      });
      this.items.push(
        {
          title: 'Declaration',
          link: { name: 'Summary and Declaration' },
          isAccessible: true,
          icon: 'mdi-checkbox-blank-circle-outline', //replace
          isActive: 'Summary and Declaration' === this.$route.name,
          expanded: false,
        });


      // this.hasAnyItems = this.items.filter(obj => obj.isAccessible).length > 0;
    },
    canBeAccessed(permission){
      return this.userInfo?.activeInstitutePermissions?.filter(perm => perm === permission).length > 0;
    },
    getCheckbox(isCompleted) {
      if (isCompleted) {
        return 'mdi-check-circle';
      }
      return 'mdi-checkbox-blank-circle-outline';
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
          isAccessible: true,
          icon: this.getCheckbox(this.isCCFRIOptInComplete()),
          isActive: 'ccfri-home' === this.$route.name
        },

      );
      if (this.navBarList?.length > 0) {
        this.navBarList?.forEach((item, index) => {
          if (item.ccfriOptInStatus == 1 && this.isRenewal){ //this was down in RFI nav? But I moved it back here to make my nav work as I expect?
            items.push(
              {
                title: 'Parent Fees '+ (index + 1),
                subTitle: item.facilityName,
                id: item.facilityId,
                link: { name: 'ccfri-current-fees-guid', params: {urlGuid: item.ccfriApplicationId}}, 
                isAccessible: this.isCCFRIOptInComplete(), //don't let user nav to add new fees if opt in / out not compete
                icon: this.getCheckbox(item.isCCFRIComplete),  
                isActive: this.$route.params.urlGuid === item.ccfriApplicationId
                // function: this.loadFacility(x.id)
              },
            );
          }
          else if (item.ccfriOptInStatus == 1){
            items.push(
              {
                title: 'Parent Fees '+ (index + 1),
                subTitle: item.facilityName,
                id: item.facilityId,
                link: { name: 'ccfri-add-fees-guid', params: {urlGuid: item.ccfriApplicationId}},
                isAccessible: this.isCCFRIOptInComplete(), //don't let user nav to add new fees if opt in / out not compete
                icon:  this.getCheckbox(item.isCCFRIComplete),
                isActive: this.$route.params.urlGuid === item.ccfriApplicationId
                // function: this.loadFacility(x.id)
              },
            );
          }
          if (item.unlockNmf) { // TO-DO : check if currentFacility has Nmf form then enable for View Application
            items.push(
              {
                title: 'New Facility '+ (index + 1),
                subTitle: item.facilityName,
                id: item.facilityId,
                link: { name: 'new-facilities', params: {urlGuid: item.ccfriApplicationId} },
                isAccessible: true,
                icon:  this.getCheckbox(false), // TO-DO update checkbox
                isActive: (this.$route.params.urlGuid === item.ccfriApplicationId && 'new-facilities' === this.$route.name)
              },
            );
          }
        });
      }
      let retval =   {
        title: NAV_BAR_GROUPS.CCFRI,
        isAccessible: true,
        icon: this.getCheckbox(this.isCcfriComplete()), //replace
        expanded: this.isExpanded(NAV_BAR_GROUPS.CCFRI),
        items: items
      };
      return retval;
    },
    getRFINavigation(){
      let items = [];
      items.push(
        {
          title: 'Opt in / Opt out',
          link: { name: 'ccfri-home'},
          isAccessible: true,
          icon: this.getCheckbox(this.ccfriOptInComplete),
          isActive: 'ccfri-home' === this.$route.name
        },

      );
      if (this.navBarList?.length > 0) {
        this.navBarList?.forEach((item, index) => {
          if (item.ccfriOptInStatus == 1 && this.isRenewal){  //this is here? but I also moved it to CCFRI nav.. im not sure why it's here - jb
            items.push(
              {
                title: 'Parent Fees '+ (index + 1),
                subTitle: item.facilityName,
                id: item.facilityId,
                link: { name: 'ccfri-current-fees-guid', params: {urlGuid: item.ccfriApplicationId}}, 
                isAccessible: this.isCCFRIOptInComplete(), //don't let user nav to add new fees if opt in / out not compete
                icon: 'mdi-checkbox-blank-circle-outline', //replace
                isActive: this.$route.params.urlGuid === item.ccfriApplicationId
                // function: this.loadFacility(x.id)
              },
            );
          }
          else if (item.ccfriOptInStatus == 1){
            items.push(
              {
                title: 'Parent Fees '+ (index + 1),
                subTitle: item.facilityName,
                id: item.facilityId,
                link: { name: 'ccfri-add-fees-guid', params: {urlGuid: item.ccfriApplicationId}},
                isAccessible: true,
                icon: 'mdi-checkbox-blank-circle-outline', //replace
                isActive: this.$route.params.urlGuid === item.ccfriApplicationId
                // function: this.loadFacility(x.id)
              },
            );
          }
        });
      }
      let retval =   {
        title: NAV_BAR_GROUPS.RFI,
        isAccessible: true,
        icon: 'mdi-checkbox-blank-circle-outline', //replace
        expanded: this.isExpanded(NAV_BAR_GROUPS.RFI),
        items: items
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
          isActive: 'Family Organization Information' === this.$route.name
        }
      );
      if (this.navBarList?.length > 0) {
        items.push(
          {
            title: 'Eligibility ',
            subTitle: this.navBarList[0].facilityName,
            id: this.navBarList[0].facilityId,
            link: { name: 'Eligibility GUID', params: {urlGuid: this.navBarList[0].facilityId}},
            isAccessible: true,
            icon: this.getCheckbox(this.navBarList[0].isFacilityComplete),
            isActive: 'Eligibility GUID' === this.$route.name && this.$route.params.urlGuid === this.navBarList[0].facilityId
          },
          {
            title: 'Funding ',
            subTitle: this.navBarList[0].facilityName,
            link: { name: 'FamilyFunding GUID' , params: {urlGuid: this.navBarList[0].ccofBaseFundingId}},
            isAccessible: true,
            icon: this.getCheckbox(this.navBarList[0].isCCOFComplete),
            isActive: 'FamilyFunding GUID' === this.$route.name && this.$route.params.urlGuid === this.navBarList[0].ccofBaseFundingId
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
            isActive: 'Eligibility' === this.$route.name && this.$route.params.urlGuid == null
            // function: this.loadFacility(x.id)
          },
          {
            title: 'Funding',
            link: { name: 'FamilyFunding'},
            isAccessible: this.isNewFundingStarted,
            icon: this.getCheckbox(false),
            isActive: 'FamilyFunding' === this.$route.name
          },
        );
      }
      items.push(
        {
          title: 'License Upload',
          link: { name: 'License Upload'},
          isAccessible: this.ccofConfirmationEnabled,
          icon: this.getCheckbox(this.isLicenseUploadComplete),
          isActive: 'License Upload' === this.$route.name
        }
      );
      let isCCOFComplete = true;
      items.forEach(item => { 
        if (item.icon === 'mdi-checkbox-blank-circle-outline') {
          isCCOFComplete = false;
        }
      });
      let retval =   {
        title: NAV_BAR_GROUPS.CCOF,
        isAccessible: true,
        icon: this.getCheckbox(isCCOFComplete),
        expanded: this.isExpanded(NAV_BAR_GROUPS.CCOF),
        items: items
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
          isActive: 'Group Organization Information' === this.$route.name
        }
      );
      if (this.navBarList?.length > 0) {
        this.navBarList?.forEach((item, index) => {
          items.push(
            {
              title: 'Facility ' + (index + 1),
              subTitle: item.facilityName,
              id: item.facilityId,
              link: { name: 'Facility Information Guid', params: {urlGuid: item.facilityId}},
              isAccessible: true,
              icon: this.getCheckbox(item.isFacilityComplete),
              isActive: 'Facility Information Guid' === this.$route.name && this.$route.params.urlGuid === item.facilityId
              // function: this.loadFacility(x.id)
            },
            {
              title: 'Funding ' +  (index + 1),
              subTitle: item.facilityName,
              link: { name: 'Funding Amount Guid' , params: {urlGuid: item.ccofBaseFundingId}},
              isAccessible: true,
              icon: this.getCheckbox(item.isCCOFComplete),
              isActive: 'Funding Amount Guid' === this.$route.name && this.$route.params.urlGuid === item.ccofBaseFundingId
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
            isActive: 'Facility Information' === this.$route.name && this.$route.params.urlGuid == null
            // function: this.loadFacility(x.id)
          },
          {
            title: 'Funding',
            link: { name: 'Funding Amount'},
            isAccessible: this.isNewFundingStarted,
            icon: this.getCheckbox(false),
            isActive: 'Funding Amount' === this.$route.name
          },
        );

      }
      items.push(
        {
          title: 'Add Facility',
          link: { name: 'Application Confirmation'},
          isAccessible: this.ccofConfirmationEnabled,
          icon: this.getCheckbox(this.isLicenseUploadComplete != null),
          isActive: 'Application Confirmation' === this.$route.name
        }
      );
      items.push(
        {
          title: 'License Upload',
          link: { name: 'License Upload'},
          isAccessible: this.ccofConfirmationEnabled,
          icon: this.getCheckbox(this.isLicenseUploadComplete),
          isActive: 'License Upload' === this.$route.name
        }
      );
      let isCCOFComplete = true;
      items.forEach(item => { 
        if (item.icon === 'mdi-checkbox-blank-circle-outline') {
          isCCOFComplete = false;
        }
      });
      let retval =   {
        title: NAV_BAR_GROUPS.CCOF,
        isAccessible: true,
        icon: this.getCheckbox(isCCOFComplete),
        expanded: this.isExpanded(NAV_BAR_GROUPS.CCOF),
        items: items
      };
      return retval;
    },
    getECEWENavigation(){
      let items = [];
      items.push(
        {
          title: 'Eligibility',
          link: { name: 'ECEWE Eligibility'},
          isAccessible: true,
          icon: this.getCheckbox(this.eceweEligibilityComplete),
          isActive: 'ECEWE Eligibility' === this.$route.name
        },
      );
      items.push(
        {
          title: 'Facility',
          link: { name: 'ECEWE Facilities'},
          isAccessible: true,
          icon: this.getCheckbox(this.eceweFacilitiesComplete),
          isActive: 'ECEWE Facilities' === this.$route.name
        },
      );
      let retval =   {
        title: NAV_BAR_GROUPS.ECEWE,
        isAccessible: true,
        icon: 'mdi-checkbox-blank-circle-outline', //replace
        expanded: this.isExpanded(NAV_BAR_GROUPS.ECEWE),
        items: items
      };
      return retval;
    },
    stripWhitespace(title) {
      return title.replace(/\s+/g, '');
    },
    isCCFRIOptInComplete(){
      return !this.userInfo.facilityList.some(fac => {
        if (fac.ccfriOptInStatus || fac.ccfriOptInStatus == 0) {
          //console.log('status exists');
        }
        else {
          return true;
        }
      });
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
