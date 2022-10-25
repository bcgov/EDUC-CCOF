<template>
  <v-form ref="ccfriform" v-model="isValidForm">
    <v-container>

      <v-card elevation="6" class="pa-4 mx-auto my-10 rounded-lg col-12 "
        min-height="230"
        rounded
        tiled
        exact 
        tile
        :ripple="false"
      >
        <v-card-text class="pa-4" >
          <p class="text-h5 text--primary">
            Parent Fees 2022/23: Full-Time 18-36 Months
          </p>
          <br>
          <p class="text-h6 text--primary">
            Are your parent fees
          </p>
          
          <v-radio-group
            v-model="youngerChildFeeSchedule"
            row
          >
            <v-radio
              label="Daily"
              value="daily"
            ></v-radio>
            <v-radio
              label="Weekly"
              value="weekly"
            ></v-radio>
            <v-radio
              label="Monthly"
              value="monthly"
            ></v-radio>
          </v-radio-group>

          <br>
          <p class="text-h6 text--primary">
            Is your fee a fixed fee?
          </p>
          <v-radio-group
            required
            v-model="youngerChildFixedFee"
            row
          >
            <v-radio
              label="Yes"
              value="Yes"
            ></v-radio>
            <v-radio
              label="No"
              value="No"
            ></v-radio>
          </v-radio-group>

          <v-container v-if="youngerChildFixedFee==='No' && youngerChildFeeSchedule !='daily'">
          <v-row>
            <v-col>
              <label>Enter your {{youngerChildFeeSchedule}} fee in every month below. If you do not charge a fee (e.g. if the facility is closed) enter zero.</label>
            </v-col>
          </v-row>
          <v-row>
            <v-col
              class="col-6 col-md-2"
            >
              <v-text-field type="number" outlined required  v-model.number="youngerChildApr" label="April" prefix="$"/>
            </v-col>
            <v-col 
              class="col-6 col-md-2"
            >
              <v-text-field type="number" outlined required  v-model.number="youngerChildMay" label="May" prefix="$"/>
            </v-col >
            <v-col 
              class="col-6 col-md-2"
            >
              <v-text-field type="number" outlined required  v-model.number="youngerChildJune" label="June" prefix="$"/>
            </v-col>
            <v-col
            class="col-6 col-md-2"
            >
              <v-text-field type="number" outlined required  v-model.number="youngerChildFeeJul" label="July" prefix="$"/>
            </v-col>
            <v-col 
              class="col-6 col-md-2"
            >
              <v-text-field type="number" outlined required  v-model.number="youngerChildFeeAug" label="August" prefix="$" />
            </v-col>
            <v-col
              class="col-6 col-md-2"
            >
              <v-text-field type="number" outlined required  v-model.number="youngerChildFeeSep" label="September" prefix="$" />
            </v-col>
          </v-row>

          <v-row>
            <v-col 
              class="col-6 col-md-2">
              <v-text-field type="number" outlined required  v-model.number="youngerChildFeeOct" label="October" prefix="$"/>
            </v-col>
            <v-col 
              class="col-6 col-md-2">
              <v-text-field type="number" outlined required  v-model.number="youngerChildFeeNov" label="November" prefix="$"/>
            </v-col >
            <v-col 
              class="col-6 col-md-2">
              <v-text-field type="number" outlined required  v-model.number="youngerChildFeeDec" label="December" prefix="$"/>
            </v-col >
            <v-col
              class="col-6 col-md-2">
              <v-text-field type="number" outlined required  v-model.number="youngerChildFeeJan" label="Jan" prefix="$"/>
            </v-col>
            <v-col
              class="col-6 col-md-2">
              <v-text-field type="number" outlined required  v-model.number="youngerChildFeeFeb" label="Feb" prefix="$" />
            </v-col>
            <v-col
              class="col-6 col-md-2">
              <v-text-field type="number" outlined required  v-model.number="youngerChildMar" label="March" prefix="$" />
            </v-col>
          </v-row>

            <!--in case we need to have code to calculate totals-->
            <!-- <v-row>
            <v-col 
            class="col-6 col-md-2">
              <v-text-field type="number" outlined readonly v-bind:value="(monday || 0) + (tusday || 0) + (wednesday || 0) + (thursday || 0) + (friday || 0)" label="Total" />
            </v-col>
          </v-row> -->
        </v-container>

        <v-container v-else-if="youngerChildFeeSchedule ==='daily' && youngerChildFixedFee==='No'">
          <v-row>
            <v-col>
              <label>Enter your {{youngerChildFeeSchedule}} fee in every day below. If you do not charge a fee (e.g. if the facility is closed) enter zero.</label>
            </v-col>
          </v-row>
          <v-row>
            <v-col
              class="col-6 col-md-2">
              <v-text-field type="number" outlined required  v-model.number="youngerChildFeeMon" label="Monday" prefix="$"/>
            </v-col>
            <v-col
              class="col-6 col-md-2">
              <v-text-field type="number" outlined required  v-model.number="youngerChildFeeTue" label="Tuesday" prefix="$" />
            </v-col>
            <v-col
              class="col-6 col-md-2">
              <v-text-field type="number" outlined required  v-model.number="youngerChildWed" label="Wednesday" prefix="$" />
            </v-col>
            <v-col
              class="col-6 col-md-2">
              <v-text-field type="number" outlined required  v-model.number="youngerChildThu" label="Thursday" prefix="$"/>
            </v-col>
            <v-col 
              class="col-6 col-md-2">
              <v-text-field type="number" outlined required  v-model.number="youngerChildFri" label="Friday" prefix="$"/>
            </v-col >
            <!-- </v-row>
            
            <v-row> -->
            <v-col 
              class="col-6 col-md-2">
              <v-text-field type="number" outlined required  v-model.number="youngerChildSat" label="Saturday" prefix="$"/>
            </v-col >
            <v-col
              class="col-6 col-md-2">
              <v-text-field type="number" outlined required  v-model.number="youngerChildFeeSun" label="Sunday" prefix="$"/>
            </v-col>
          
          </v-row>

              <!--in case we need to have code to calculate totals-->
              <!-- <v-row>
              <v-col 
              class="col-6 col-md-2">
                <v-text-field type="number" outlined readonly v-bind:value="(monday || 0) + (tusday || 0) + (wednesday || 0) + (thursday || 0) + (friday || 0)" label="Total" />
              </v-col>
            </v-row> -->
        </v-container>

        <v-container v-else>
          <v-row>
              <v-col>
                <label>What is the {{youngerChildFeeSchedule}} fixed fee?</label>
              </v-col>
            </v-row>
            <v-row>
              <v-col
                class="col-6 col-md-2">
                  <v-text-field type="number" outlined required  v-model.number="monday" prefix="$"/>
              </v-col>
          </v-row>
        </v-container>


        </v-card-text>
    </v-card>

    <v-card elevation="6" class="pa-4 mx-auto my-10 rounded-lg col-12 "
      min-height="230"
      rounded
      tiled
      exact 
      tile
      :ripple="false"
      >
        <v-card-text class="pa-4" >
          <p class="text-h5 text--primary">
            Parent Fees 2022/23: Full-Time 3 Years to Kindergarten
          </p>
          <br>
          <p class="text-h6 text--primary">
            Are your parent fees
          </p>
          
          <v-radio-group
            v-model="olderChildFeeSchedule"
            required
            row
          >
          <v-radio 
              label="Daily"
              value="daily"
          ></v-radio>
            <v-radio
              label="Weekly"
              value="weekly"
            ></v-radio>
            <v-radio
              label="Monthly"
              value="monthly"
            ></v-radio>
          </v-radio-group>

          <br>
          <p class="text-h6 text--primary">
            Is your fee a fixed fee?
          </p>
          <v-radio-group
            v-model="olderChildFixedFee"
            required
            row
          >
            <v-radio
              label="Yes"
              value="Yes"
            ></v-radio>
            <v-radio
              label="No"
              value="No"
            ></v-radio>
          </v-radio-group>


          <v-container v-if="olderChildFixedFee==='No' && olderChildFeeSchedule !='daily'">
            <v-row>
              <v-col>
                <label>Enter your {{olderChildFeeSchedule}} fee in every month below. If you do not charge a fee (e.g. if the facility is closed) enter zero.</label>
              </v-col>
            </v-row>
            <v-row>
              <v-col
                class="col-6 col-md-2">
                <v-text-field type="number" outlined required  v-model.number="olderChildApr" label="April" prefix="$"/>
              </v-col>
              <v-col 
                class="col-6 col-md-2">
                <v-text-field type="number" outlined required  v-model.number="olderChildMay" label="May" prefix="$"/>
              </v-col >
              <v-col 
                class="col-6 col-md-2">
                <v-text-field type="number" outlined required  v-model.number="olderChildJune" label="June" prefix="$"/>
              </v-col >
              <v-col
                class="col-6 col-md-2">
                <v-text-field type="number" outlined required  v-model.number="olderChildFeeJul" label="July" prefix="$"/>
              </v-col>
              <v-col 
                class="col-6 col-md-2">
                <v-text-field type="number" outlined required  v-model.number="olderChildFeeAug" label="August" prefix="$" />
              </v-col>
              <v-col
                class="col-6 col-md-2">
                <v-text-field type="number" outlined required  v-model.number="olderChildFeeSep" label="September" prefix="$" />
              </v-col>
            </v-row>

            <v-row>
              <v-col 
                class="col-6 col-md-2">
                <v-text-field type="number" outlined required  v-model.number="olderChildFeeOct" label="October" prefix="$"/>
              </v-col>
              <v-col 
                class="col-6 col-md-2">
                <v-text-field type="number" outlined required  v-model.number="olderChildFeeNov" label="November" prefix="$"/>
              </v-col >
              <v-col 
                class="col-6 col-md-2">
                <v-text-field type="number" outlined required  v-model.number="olderChildFeeDec" label="December" prefix="$"/>
              </v-col >
              <v-col
                class="col-6 col-md-2">
                <v-text-field type="number" outlined required  v-model.number="olderChildFeeJan" label="Jan" prefix="$"/>
              </v-col>
              <v-col
                class="col-6 col-md-2">
                <v-text-field type="number" outlined required  v-model.number="olderChildFeeFeb" label="Feb" prefix="$" />
              </v-col>
              <v-col
                class="col-6 col-md-2">
                <v-text-field type="number" outlined required  v-model.number="olderChildMar" label="March" prefix="$" />
              </v-col>
            </v-row>
          </v-container>

          <v-container v-else-if="olderChildFeeSchedule ==='daily' && olderChildFixedFee==='No'">
            <v-row>
              <v-col>
                <label>Enter your {{olderChildFeeSchedule}} fee in every day below. If you do not charge a fee (e.g. if the facility is closed) enter zero.</label>
              </v-col>
            </v-row>
            <v-row>
              <v-col
                class="col-6 col-md-2">
                <v-text-field type="number" outlined required  v-model.number="olderChildFeeMon" label="Monday" prefix="$"/>
              </v-col>
              <v-col
                class="col-6 col-md-2">
                <v-text-field type="number" outlined required  v-model.number="olderChildFeeTue" label="Tuesday" prefix="$" />
              </v-col>
              <v-col
                class="col-6 col-md-2">
                <v-text-field type="number" outlined required  v-model.number="olderChildWed" label="Wednesday" prefix="$" />
              </v-col>
              <v-col
                class="col-6 col-md-2">
                <v-text-field type="number" outlined required  v-model.number="olderChildThu" label="Thursday" prefix="$"/>
              </v-col>
              <v-col 
                class="col-6 col-md-2">
                <v-text-field type="number" outlined required  v-model.number="olderChildFri" label="Friday" prefix="$"/>
              </v-col >
              <v-col 
                class="col-6 col-md-2">
                <v-text-field type="number" outlined required  v-model.number="olderChildSat" label="Saturday" prefix="$"/>
              </v-col >
              <v-col
                class="col-6 col-md-2">
                <v-text-field type="number" outlined required  v-model.number="olderChildFeeSun" label="Sunday" prefix="$"/>
              </v-col>
            </v-row>
          </v-container>

          <v-container v-else>
            <v-row>
              <v-col>
                <label>What is the {{olderChildFeeSchedule}} fixed fee?</label>
              </v-col>
            </v-row>
            <v-row>
              <v-col
                class="col-6 col-md-2">
                  <v-text-field type="number" outlined required  v-model.number="monday" prefix="$"/>
              </v-col>
            </v-row>
          </v-container>

        </v-card-text>
    </v-card>

        <v-card elevation="6" class="pa-4 mx-auto my-10 rounded-lg col-12 "
          min-height="230"
          rounded
          tiled
          exact 
          tile
          :ripple="false"
        >
          <v-card-text>
            <p class="text-h6 text--primary">
              Do you charge parent fees at this facility for any closures on business days (other than statuary holidays)?
            </p>
            <br>
            <v-radio-group
              required
              row
            >
              <v-radio
                label="Yes"
                value="Yes"
              ></v-radio>
              <v-radio
                label="No"
                value="No"
              ></v-radio>
            </v-radio-group>
          </v-card-text>
        </v-card>

        <v-card elevation="6" class="pa-4 mx-auto my-10 rounded-lg col-12 "
          min-height="230"
          rounded
          tiled
          exact 
          tile
          :ripple="false"
        >
          <v-card-text>
            <p class="text-h6 text--primary">
              Is there any other information about this facility you would like us to know?
            </p>
            <br>
            <v-textarea
              outlined
              name="input-7-4"
              label="Describe here"
            ></v-textarea>
          </v-card-text>
        </v-card>

    </v-container>
  </v-form>
</template>
<script>
export default {
  props: {
  },
  computed: {
  },
  data() {
    return {
      olderChildFeeSchedule: undefined,
      youngerChildFeeSchedule: undefined,
      olderChildFixedFee: undefined,
      youngerChildFixedFee: undefined,
      olderChildFeeJan: undefined,
      olderChildFeeFeb: undefined,
      olderChildFeeMar: undefined,
      olderChildFeeApr: undefined,
      olderChildFeeMay: undefined,
      olderChildFeeJun: undefined,
      olderChildFeeJul: undefined,
      olderChildFeeAug: undefined,
      olderChildFeeSep: undefined,
      olderChildFeeOct: undefined,
      olderChildFeeNov: undefined,
      olderChildFeeDec: undefined,
      youngerChildFeeJan: undefined,
      youngerChildFeeFeb: undefined,
      youngerChildFeeMar: undefined,
      youngerChildFeeApr: undefined,
      youngerChildFeeMay: undefined,
      youngerChildFeeJun: undefined,
      youngerChildFeeJul: undefined,
      youngerChildFeeAug: undefined,
      youngerChildFeeSep: undefined,
      youngerChildFeeOct: undefined,
      youngerChildFeeNov: undefined,
      youngerChildFeeDec: undefined,

    };
  },
  methods: {
  }
};
</script>
