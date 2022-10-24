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
                value="Daily"
              ></v-radio>
              <v-radio
                label="Weekly"
                value="Weekly"
              ></v-radio>
              <v-radio
                label="Monthly"
                value="Monthly"
              ></v-radio>
            </v-radio-group>

            <br>
            <p class="text-h6 text--primary">
              Is your fee a fixed fee?
            </p>
            <v-radio-group
              required
              v-model="olderChildFixedFee"
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
                value="Daily"
              ></v-radio>
              <v-radio
                label="Weekly"
                value="Weekly"
              ></v-radio>
              <v-radio
                label="Monthly"
                value="Monthly"
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
              v-model="row"
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

        <v-row>
              <v-col>
                <label>Enter your monthly fee in every month below. If you do not charge a fee (e.g. if the facility is closed) enter zero.</label>
              </v-col>
            </v-row>
            <v-row>
              <v-col
          class="col-6 col-md-2">
                <v-text-field type="number" outlined required  v-model.number="monday" label="Jan" prefix="$"/>
              </v-col>
              <v-col cols="2"
          class="col-6 col-md-2">
                <v-text-field type="number" outlined required  v-model.number="tusday" label="Feb" prefix="$" />
              </v-col>
              <v-col cols="2"
              class="col-6 col-md-2">
                <v-text-field type="number" outlined required  v-model.number="wednesday" label="March" prefix="$" />
              </v-col>
              <v-col cols="2"
              class="col-6 col-md-2">
                <v-text-field type="number" outlined required  v-model.number="thursday" label="April" prefix="$"/>
              </v-col>
              <v-col cols="2"
              class="col-6 col-md-2">
                <v-text-field type="number" outlined required  v-model.number="friday" label="May" prefix="$"/>
              </v-col >
              <v-col cols="2"
              class="col-6 col-md-2">
                <v-text-field type="number" outlined required  v-model.number="friday" label="June" prefix="$"/>
              </v-col >
              </v-row>

              <v-row>
              <v-col
          class="col-6 col-md-2">
                <v-text-field type="number" outlined required  v-model.number="monday" label="July" prefix="$"/>
              </v-col>
              <v-col cols="2"
          class="col-6 col-md-2">
                <v-text-field type="number" outlined required  v-model.number="tusday" label="August" prefix="$" />
              </v-col>
              <v-col cols="2"
              class="col-6 col-md-2">
                <v-text-field type="number" outlined required  v-model.number="wednesday" label="September" prefix="$" />
              </v-col>
              <v-col cols="2"
              class="col-6 col-md-2">
                <v-text-field type="number" outlined required  v-model.number="thursday" label="October" prefix="$"/>
              </v-col>
              <v-col cols="2"
              class="col-6 col-md-2">
                <v-text-field type="number" outlined required  v-model.number="friday" label="November" prefix="$"/>
              </v-col >
              <v-col cols="2"
              class="col-6 col-md-2">
                <v-text-field type="number" outlined required  v-model.number="friday" label="December" prefix="$"/>
              </v-col >
              </v-row>

              <v-row>
              <v-col cols="2"
              class="col-6 col-md-2">
                <v-text-field type="number" outlined readonly v-bind:value="(monday || 0) + (tusday || 0) + (wednesday || 0) + (thursday || 0) + (friday || 0)" label="Total" />
              </v-col>
            </v-row>
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

    };
  },
  methods: {
  }
};
</script>
