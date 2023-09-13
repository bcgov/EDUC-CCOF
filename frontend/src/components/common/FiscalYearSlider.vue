<template>
  <v-sheet
    class="mx-auto"
    elevation="0"
    max-width="400"
  >
    <v-slide-group
      v-model="selectedIndex"
      center-active
    >
      <v-slide-item
        v-for="(programYear, index) in mappedProgramYearList"
        :key="index"
        v-slot="{ active }"
      >
        <v-card
          class="ma-4 fiscalYearCard"
          height="auto"
          width="60"
          @click="selectProgramYear(programYear, index)"
          elevation="0"
        >
          <v-row
            class="fill-height"
            align="center"
            justify="center"
          >
            <div :class="active ? 'selected' : ''">
              {{ programYear.name }}
            </div>
          </v-row>
        </v-card>
      </v-slide-item>
    </v-slide-group>
  </v-sheet>
</template>

<script>

import { mapGetters, mapState, mapMutations, mapActions} from 'vuex';
import { sortBy } from 'lodash';


export default {
  name: 'FiscalYearSlider',
  data() {
    return {
      selectedIndex: null,
    }
  },
  created() {
    this.selectedIndex = this.mappedProgramYearList.findIndex(item => item.status === 'CURRENT');
  },
  computed: {
    ...mapGetters('app', ['programYearList']),
    mappedProgramYearList() {
      const sortedProgramYearList = sortBy(this.programYearList.list,[function(o) { return o.order; }]);
      const mappedProgramYearList = sortedProgramYearList.map(item => {
        return {
          name: item.name.slice(0,-3),
          programYearId: item.programYearId,
          status: item.status,
        }
      });
      return mappedProgramYearList;
    }
  },
  methods: {
    selectProgramYear(programYear, index) {
      this.selectedIndex = index;
      this.$emit('selectProgramYear', programYear.programYearId)
    }
  }
};
</script>

<style scoped>
.selected {
  font-weight: bold;
  font-size: 105%;
}
</style>
