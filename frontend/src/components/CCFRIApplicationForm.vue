<template>
  <v-card>
    <v-navigation-drawer v-model="drawer" :permanent="$vuetify.display.mdAndUp">
      <v-list-item class="px-2">
        <v-list-item-title>CCOF Base Funding</v-list-item-title>
        <!-- <v-btn
          icon
          @click.stop="mini = !mini"
        >
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn> -->
      </v-list-item>
      <v-divider />
      <v-list density="compact">
        <v-list-item v-for="item in ccofItems" :key="item.title" :icon="item.icon" link>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
      <v-list-item class="px-2">
        <v-list-item-title>CCFRI</v-list-item-title>
        <!-- <v-btn
          icon
          @click.stop="mini = !mini"
        >
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn> -->
      </v-list-item>
      <v-divider />
      <v-list density="compact">
        <v-list-item v-for="item in ccfriItems" :key="item.title" :icon="item.icon" link>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
      <v-list-item class="px-2">
        <v-list-item-title>ECE-WE</v-list-item-title>
        <!-- <v-btn
          icon
          @click.stop="mini = !mini"
        >
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn> -->
      </v-list-item>
      <v-divider />
      <v-list density="compact">
        <v-list-item v-for="item in eceweItems" :key="item.title" :icon="item.icon" link>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar color="red" absolute right class="hidden-md-and-up" @click.stop="drawer = !drawer">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
    </v-toolbar>
    <p class="text-h6 text-grey-lighten-1 font-weight-light text-center py-5 my-5">Content</p>
  </v-card>
</template>
<script>
import { mapState } from 'pinia';
import { useAuthStore } from '../store/auth.js';

export default {
  name: 'LandingPage',
  props: {
    currentYear: {
      type: Number,
      default: 2024,
      required: false,
    },
  },
  data() {
    return {
      navigationModel: [],
      drawer: true,
      ccofItems: [
        { title: 'Group Provider Form', icon: 'mdi-check-circle' },
        { title: 'Organization Information', icon: 'mdi-checkbox-blank-circle-outline' },
        { title: 'Facility Information', icon: 'mdi-checkbox-blank-circle-outline' },
        { title: 'Information to determine funding amounts', icon: 'mdi-checkbox-blank-circle-outline' },
      ],
      ccfriItems: [
        { title: 'Group Provider Form', icon: 'mdi-check-circle' },
        { title: 'Organization Information', icon: 'mdi-checkbox-blank-circle-outline' },
        { title: 'Facility Information', icon: 'mdi-checkbox-blank-circle-outline' },
        { title: 'Information to determine funding amounts', icon: 'mdi-checkbox-blank-circle-outline' },
      ],
      eceweItems: [
        { title: 'Group Provider Form', icon: 'mdi-checkbox-blank-circle-outline' },
        { title: 'Organization Information', icon: 'mdi-checkbox-blank-circle-outline' },
        { title: 'Facility Information', icon: 'mdi-checkbox-blank-circle-outline' },
        { title: 'Information to determine funding amounts', icon: 'mdi-checkbox-blank-circle-outline' },
      ],

      mini: false,
    };
  },
  computed: {
    ...mapState(useAuthStore, ['userInfo']),
    currentYearTwoDigit() {
      return this.currentYear - 2000;
    },
    nextYearTwoDigit() {
      return this.currentYear - 1999;
    },
  },
};
</script>

<style scoped></style>
