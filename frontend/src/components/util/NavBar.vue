<template>
  
<div class="mb-1">

  <v-navigation-drawer
          v-model="drawer"
          app
          absolute
          :style="`margin-top: ${$vuetify.application.top}px; margin-bottom: ${$vuetify.application.footer}px` "
          width=200
          height="calc(100vh - 136px)"
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
                <v-list-item-title v-if="item.isActive" class="menuItem"><strong>{{item.title}}</strong></v-list-item-title>
                <v-list-item-title v-else class="menuItem">{{item.title}}</v-list-item-title>
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

            <router-link :to="subItem.link" :target="subItem.newTab ? '_blank' : '_self'" class="router">
              <v-list-item-content class="py-0">
                <v-list-item-title v-if="subItem.isActive" class="menuItem text-wrap"><strong>{{ subItem.title }}</strong></v-list-item-title>
                <v-list-item-title v-else v-text="subItem.title" class="menuItem text-wrap"></v-list-item-title>
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
    ...mapState('app', ['pageTitle', 'navBarGroup']),
    ...mapState('facility', ['facilityList']),
    ...mapGetters('facility', ['isFacilityComplete']),
    ...mapGetters('organization', ['isOrganizationComplete']),

    navWidth () {
      switch (this.$vuetify.breakpoint.name) {
      case 'xs':
        return '50%';
      case 'sm':
        return '50%';
      default:
        return '15%';
      }
    }
  },
  watch:{
    pageTitle: {
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
      this.items = [];
      this.items.push(this.getCCOFNavigation());
      this.items.push(
        {
          title: NAV_BAR_GROUPS.CCFRI,
          link: { name: 'ccfri-application' },
          isAccessible: true,
          icon: 'mdi-checkbox-blank-circle-outline', //replace
          expanded: this.isExpanded(NAV_BAR_GROUPS.CCFRI),
          items: [
            {
              title: 'Parent fees 1',
              link: '',
              isAccessible: true,
              icon: 'mdi-checkbox-blank-circle-outline', //replace
            },
            {
              title: 'Request for Information 1',
              link: { name: 'Funding Amount' },
              isAccessible: true,
              icon: 'mdi-checkbox-blank-circle-outline', //replace
            },
            {
              title: 'Parent fees 2',
              link: '',
              isAccessible: true,
              icon: 'mdi-checkbox-blank-circle-outline', //replace
            },
            {
              title: 'Request for Information 2',
              link: '',
              isAccessible: true,
              icon: 'mdi-checkbox-blank-circle-outline', //replace
            },          
          ],
        },
      );

      this.items.push(
        {
          title: NAV_BAR_GROUPS.ECEWE,
          link: { name: 'ccfri-application' },
          isAccessible: true,
          icon: 'mdi-checkbox-blank-circle-outline', //replace
          expanded: this.isExpanded(NAV_BAR_GROUPS.ECEWE),
        });
      this.hasAnyItems = this.items.filter(obj => obj.isAccessible).length > 0;
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
    getCCOFNavigation() {
      let items = [];
      items.push(
        {
          title: 'Organization',
          link: { name: 'Organization Information' },
          isAccessible: true,
          icon: this.getCheckbox(this.isOrganizationComplete),
          isActive: 'Organization Information' === this.$route.name
        }
      );
      if (this.facilityList?.length > 0) {
        this.facilityList?.forEach( item => {
          items.push(
            {
              title: item.facilityName,
              id: item.facilityId,
              link: { name: 'Facility Information', params: {urlFacilityId: item.facilityId}},
              isAccessible: true,
              icon: 'mdi-checkbox-blank-circle-outline', //replace
              isActive: 'Facility Information' === this.$route.name && this.$route.params.urlFacilityId === item.facilityId
              // function: this.loadFacility(x.id)
            },
            {
              title: 'Funding ' + item.facilityName,
              link: { name: 'Funding Amount'},
              isAccessible: true,
              icon: 'mdi-checkbox-blank-circle-outline', //replace
              isActive: 'Funding Amount' === this.$route.name
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
            isAccessible: true,
            icon: 'mdi-checkbox-blank-circle-outline', //replace
            isActive: 'Facility Information' === this.$route.name && this.$route.params.urlFacilityId == null
            // function: this.loadFacility(x.id)
          },
          {
            title: 'Funding',
            link: { name: 'Funding Amount'},
            isAccessible: true,
            icon: 'mdi-checkbox-blank-circle-outline', //replace
            isActive: 'Funding Amount' === this.$route.name
          },
        );

      }

      items.push(
        {
          title: 'Direct Deposit',
          link: '',
          isAccessible: true,
          icon: 'mdi-checkbox-blank-circle-outline', //replace
          isActive: '' === this.$route.name
        }
      );
      let retval =   {
        title: NAV_BAR_GROUPS.CCOF,
        isAccessible: true,
        icon: 'mdi-checkbox-blank-circle-outline', //replace
        expanded: this.isExpanded(NAV_BAR_GROUPS.CCOF),
        items: items
      };
      return retval;
    },
    stripWhitespace(title) {
      return title.replace(/\s+/g, '');
    }
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
