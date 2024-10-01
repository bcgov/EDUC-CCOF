<template>
  <v-sheet
    class="flex px-0 py-0"
    elevation="0"
    max-width="337"
    min-width="150"
    style="float: left"
  >
    <!-- ****************************************************************************************************************************************************************-->
    <!-- *** The following slider is for the ON (selected) state ********************************************************************************************************-->
    <!-- ****************************************************************************************************************************************************************-->
    <v-slide-group
      v-if="isActive"
      v-model="selectedMonthIndex"
      class="pa-0"
      mandatory
      center-active
      show-arrows
      selected-class=""
      @update:model-value="focusAwayFromOnSlider"
    >
      <template #next>
        <span class="fill-height pt-1 pr-4">
          <v-icon
            ref="rchevron"
            color="#39598A"
            size="x-large"
          >mdi-chevron-right</v-icon>
        </span>
      </template>
      <template #prev>
        <span
          class="estimator-label fill-height pt-1 pr-0"
          align="right"
        >
          <v-icon
            color="#39598A"
            size="x-large"
          >mdi-chevron-left</v-icon>
          Daily&nbsp;
        </span>
      </template>
      <v-slide-item
        v-for="n in items"
        :key="n.id"
        v-slot="{ active, toggle }"
      >
        <v-card
          :color="active ? '#E5F3FE' : '#FFFFFF'"
          class="ma-1 fill-height"
          :elevation="active ? 4 : 0"
          height="67"
          width="70"
          @click="toggle(clickForOnSlider(n.id))"
        >
          <v-row
            style=""
            justify="center"
          >
            <v-col
              align="center"
              style="padding-top: 4px; padding-bottom: 5px; margin-top: -2px"
            >
              <v-div
                :style="
                  'color:' +
                    (active ? '#2196f3' : '#39598A') +
                    ';font-family:Lucida Grande,monospace;color:#39598A;background-color:#EEEEEE;font-size:17px;font-weight:bold;padding-bottom:6px;padding-left:18px;padding-right:18px;padding-top:4px'
                "
              >
                {{ n.month }}
              </v-div>
            </v-col>
          </v-row>
          <v-row
            style="font-size: 14px"
            justify="center"
          >
            <v-col
              align="center"
              style="padding-top: 3px"
            >
              <span :style="'color:' + (active ? '#2196f3' : 'black')"> ${{ n.rate }} </span>
            </v-col>
          </v-row>
        </v-card>
      </v-slide-item>
    </v-slide-group>
    <!-- ****************************************************************************************************************************************************************-->
    <!-- *** The following slider is for the OFF (unselected) state *****************************************************************************************************-->
    <!-- ****************************************************************************************************************************************************************-->
    <v-slide-group
      v-if="!isActive"
      v-model="selectedMonthIndex"
      class="pa-0"
      mandatory
      center-active
      show-arrows
      selected-class=""
      @update:model-value=""
    >
      <template #next>
        <span class="fill-height pt-1 pr-4">
          <v-icon
            color="#39598A"
            size="x-large"
          >mdi-chevron-right</v-icon>
        </span>
      </template>
      <template #prev>
        <span
          class="estimator-label fill-height pt-1 pr-0"
          align="right"
          style="font-size: 12px"
        >
          <v-icon
            color="#39598A"
            size="x-large"
          >mdi-chevron-left</v-icon>
          Monthly&nbsp;
        </span>
      </template>
      <v-slide-item
        v-for="n in items"
        :key="n.id"
        v-slot="{ active, toggle }"
      >
        <v-card
          :color="active ? '#FFFFFF' : '#FFFFFF'"
          class="ma-1 fill-height"
          :elevation="active ? 0 : 0"
          height="67"
          width="70"
          @click="toggle(clickForOffSlider(n.id))"
        >
          <v-row
            style=""
            justify="center"
          >
            <v-col
              align="center"
              style="padding-top: 4px; padding-bottom: 5px; margin-top: -2px"
            >
              <span
                style="
                  font-family:
                    Lucida Grande,
                    monospace;
                  color: #39598a;
                  background-color: #eeeeee;
                  font-size: 17px;
                  font-weight: bold;
                  padding-bottom: 6px;
                  padding-left: 18px;
                  padding-right: 18px;
                  padding-top: 4px;
                "
              >
                {{ n.month }}
              </span>
            </v-col>
          </v-row>
          <v-row
            style="font-size: 14px"
            justify="center"
          >
            <v-col
              align="center"
              style="padding-top: 3px"
            >
              <span style=""> ${{ n.rate }} </span>
            </v-col>
          </v-row>
        </v-card>
      </v-slide-item>
    </v-slide-group>
    <v-btn
      ref="hiddenButton"
      class="hidden-btn hidden-btn2 no-hover pa-0"
      elevation="0"
      color="white"
      style=""
    />
  </v-sheet>
</template>

<script>
export default {
  name: 'CcfriEstimatorMonthSlider',
  props: ['approvedFeesByCategory', 'childIndex', 'children'],
  data: () => ({
    isActive: false,
    btnDisabled: true,
    clicked: false,
    selectedMonthIndex: 6,
    selectedApprovedFee: 0,
    items: [
      { id: 0, month: 'Apr', rate: 0 },
      { id: 1, month: 'May', rate: 0 },
      { id: 2, month: 'Jun', rate: 0 },
      { id: 3, month: 'Jul', rate: 0 },
      { id: 4, month: 'Aug', rate: 0 },
      { id: 5, month: 'Sep', rate: 0 },
      { id: 6, month: 'Oct', rate: 0 },
      { id: 7, month: 'Nov', rate: 0 },
      { id: 8, month: 'Dec', rate: 0 },
      { id: 9, month: 'Jan', rate: 0 },
      { id: 10, month: 'Feb', rate: 0 },
      { id: 11, month: 'Mar', rate: 0 },
    ],
  }),
  watch: {
    selectedMonthIndex: {
      handler(newVal, oldVal) {
        console.log('oldVal=' + oldVal);
        console.log('newVal=' + newVal);
        console.log('items[model].id=' + this.items[newVal].id);
        if (newVal == oldVal) {
          console.log('newVal == oldVal!!!');
          this.isActive = false;
        }
      },
      deep: true,
    },
    approvedFeesByCategory: {
      handler(newVal, oldVal) {
        if (newVal != oldVal) {
          console.log('approvedFeesByCategory newVal != oldVal!!! ' + this.approvedFeesByCategory.approvedFeeApr);
          this.items[0].rate = this.approvedFeesByCategory.approvedFeeApr;
          this.items[1].rate = this.approvedFeesByCategory.approvedFeeMay;
          this.items[2].rate = this.approvedFeesByCategory.approvedFeeJun;
          this.items[3].rate = this.approvedFeesByCategory.approvedFeeJul;
          this.items[4].rate = this.approvedFeesByCategory.approvedFeeAug;
          this.items[5].rate = this.approvedFeesByCategory.approvedFeeSep;
          this.items[6].rate = this.approvedFeesByCategory.approvedFeeOct;
          this.items[7].rate = this.approvedFeesByCategory.approvedFeeNov;
          this.items[8].rate = this.approvedFeesByCategory.approvedFeeDec;
          this.items[9].rate = this.approvedFeesByCategory.approvedFeeJan;
          this.items[10].rate = this.approvedFeesByCategory.approvedFeeFeb;
          this.items[11].rate = this.approvedFeesByCategory.approvedFeeMar;
        }
      },
      deep: true,
    },
  },
  updated() {
    console.log('updated!');
    if (this.clicked) {
      this.$refs.hiddenButton.$el.focus();
      this.clicked = false;
    }
  },
  methods: {
    clickForOnSlider(key) {
      console.log('key =' + this.items[key].id);
      console.log('unselectedDefault =' + this.selectedMonthIndex);
      if (this.items[key].id == this.selectedMonthIndex) {
        console.log('isActive = FALSE!!');
        this.isActive = false;
        this.$emit('selectedApprovedFee', undefined);
      } else {
        this.$emit('selectedApprovedFee', this.selectedApprovedFee);
      }
    },
    clickForOffSlider(key) {
      console.log('clicked');
      console.log('key=' + key);
      this.isActive = this.isActive == true ? false : true;
      this.clicked = true;
      this.selectedApprovedFee = this.items[this.selectedMonthIndex].rate;
      this.$emit('selectedApprovedFee', this.selectedApprovedFee);
      this.btnDisabled = false;
    },
    focusAwayFromOnSlider() {
      console.log('!!!!!!!!!!! this.items[this.selectedMonthIndex].rate = ' + this.items[this.selectedMonthIndex].rate);
      this.selectedApprovedFee = this.items[this.selectedMonthIndex].rate;
      console.log('!!!!!!!!!!! this.selectedApprovedFee = ' + this.selectedApprovedFee);
      this.$refs.hiddenButton.$el.focus();
    },
  },
};
</script>

<style scoped>
div.ma-1.fill-height.v-card.v-card--link.v-sheet.theme--light {
  border: 1px solid grey !important;
}

.hidden-btn:focus::before {
  opacity: 0 !important;
}

.hidden-btn2 {
  min-width: 5px !important;
  height: 5px !important;
}

.no-hover:before {
  display: none;
}

.estimator-label {
  color: #7b7c7e;
  font-family: 'BCSans', Verdana, Arial, sans-serif !important;
  font-weight: 600;
  font-size: 16px;
}
</style>
