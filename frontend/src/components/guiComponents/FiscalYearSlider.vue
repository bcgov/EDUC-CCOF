<template>
  <v-item-group
    v-model="activeIndex"
    class="text-center"
    mandatory
  >
    <v-btn
      text x-small
      class="px-0"
      :class="isPrevHidden"
      @click="previous"
    >
      <v-icon>mdi-chevron-left</v-icon>
    </v-btn>
    <v-item
      v-for="(programYear, index) in programYearSlidingWindow"
      :key="index"
      v-slot="{ active }"
    >
      <v-btn
        text
        class="px-2"
        @click="selectProgramYear(programYear)"
        :class="active ? 'selected' : ''"
      >
        {{ programYear.name }}
      </v-btn>
    </v-item>
    <v-btn
      text x-small
      class="px-0"
      :class="isNextHidden"
      @click="next"
    >
      <v-icon>mdi-chevron-right</v-icon>
    </v-btn>
  </v-item-group>
</template>

<script>

import { mapState } from 'vuex';
import { sortBy } from 'lodash';


export default {
  name: 'FiscalYearSlider',
  data() {
    return {
      selectedProgramYearIndex: undefined,
      activeIndex: undefined,
    }
  },
  created() {
    this.selectedProgramYearIndex = this.programYearList?.findIndex(item => item.programYearId === this.programYearId);
    this.updateActiveIndex();
    if (this.selectedProgramYearIndex > -1)
      this.$emit('selectProgramYear', this.programYearList[this.selectedProgramYearIndex]);
  },
  computed: {
    ...mapState('application', ['applicationMap', 'programYearId']),
    programYearList() {
      let programYearList = [];
      this.applicationMap.forEach(item => {
        programYearList.push({
          name: item.ccofProgramYearName.slice(0,-3),
          programYearId: item.ccofProgramYearId,
          status: item.ccofProgramYearStatus,
        });
      });
      programYearList = sortBy(programYearList,[function(o) { return o.name; }]);
      return programYearList;
    },
    programYearSlidingWindow() {
      if (this.programYearList?.length > 3) {
        const firstIndex = 0;
        const lastIndex = this.programYearList?.length - 1;
        switch (this.selectedProgramYearIndex) {
        case firstIndex:
          return this.programYearList?.slice(0, 3);
        case lastIndex:
          return this.programYearList?.slice(-3);
        default:
          return this.programYearList?.slice(this.selectedProgramYearIndex - 1, this.selectedProgramYearIndex + 2);
        }
      }
      return this.programYearList;
    },
    isPrevHidden() {
      const isHidden = (this.selectedProgramYearIndex < 1) ? 'hide' : '';
      return isHidden;
    },
    isNextHidden() {
      const isHidden = (this.selectedProgramYearIndex >= (this.programYearList?.length - 1)) ? 'hide' : '';
      return isHidden;
    },
  },
  methods: {
    updateActiveIndex() {
      const firstIndex = 0;
      const lastIndex = this.programYearList?.length - 1;
      if (this.programYearList?.length > 3) {
        switch (this.selectedProgramYearIndex) {
        case firstIndex:
          this.activeIndex = 0;
          break;
        case lastIndex:
          this.activeIndex = 2;
          break;
        default:
          this.activeIndex = 1;
          break;
        }
      } else {
        this.activeIndex = this.selectedProgramYearIndex;
      }
    },
    selectProgramYear(programYear) {
      this.selectedProgramYearIndex = this.programYearList?.findIndex(item => item.programYearId === programYear?.programYearId);
      this.$emit('selectProgramYear', programYear)
      this.updateActiveIndex();
    },
    previous() {
      if (this.selectedProgramYearIndex > 0) {
        this.$emit('selectProgramYear', this.programYearList[this.selectedProgramYearIndex - 1]);
        this.selectedProgramYearIndex = this.selectedProgramYearIndex - 1;
        this.updateActiveIndex();
      }
    },
    next() {
      if (this.selectedProgramYearIndex < (this.programYearList?.length - 1)) {
        this.$emit('selectProgramYear', this.programYearList[this.selectedProgramYearIndex + 1]);
        this.selectedProgramYearIndex = this.selectedProgramYearIndex + 1;
        this.updateActiveIndex();
      }
    },
  }
};
</script>

<style scoped>
.selected {
  font-weight: bold;
  font-size: 110%;
}
.hide {
  display: none;
}
</style>
