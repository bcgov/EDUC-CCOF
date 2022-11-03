<template>
  <!--TODO: add in isValidForm ruleset-->
  <v-form ref="ccfriform" v-model="isValidForm">
    <v-container>

    <!--Start previous year fees-->

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
            Parent Fees 20{{prevYearTwoDigit}}/{{currentYearTwoDigit}}: Full-Time 18-36 Months
          </p>
          <br>
          <p class="text-h6 text--primary">
            Are your parent fees
          </p>
          
          <v-radio-group
            v-model="previousYoungerChildFeeSchedule"
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
            v-model="previousYoungerChildFixedFee"
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

          <v-container v-if="previousYoungerChildFixedFee==='No' && previousYoungerChildFeeSchedule !='daily'">
          <v-row>
            <v-col>
              <label>Enter your {{previousYoungerChildFeeSchedule}} fee in every month below. If you do not charge a fee (e.g. if the facility is closed) enter zero.</label>
            </v-col>
          </v-row>
          <v-row>
            <v-col
              class="col-6 col-md-2"
            >
              <v-text-field type="number" outlined :rules="feeRules"  v-model.number="previousYoungerChildFeeApr" label="April" prefix="$"/>
            </v-col>
            <v-col 
              class="col-6 col-md-2"
            >
              <v-text-field type="number" outlined :rules="feeRules"  v-model.number="previousYoungerChildFeeMay" label="May" prefix="$"/>
            </v-col >
            <v-col 
              class="col-6 col-md-2"
            >
              <v-text-field type="number" outlined :rules="feeRules"  v-model.number="previousYoungerChildFeeJun" label="June" prefix="$"/>
            </v-col>
            <v-col
            class="col-6 col-md-2"
            >
              <v-text-field type="number" outlined :rules="feeRules"  v-model.number="previousYoungerChildFeeJul" label="July" prefix="$"/>
            </v-col>
            <v-col 
              class="col-6 col-md-2"
            >
              <v-text-field type="number" outlined :rules="feeRules"  v-model.number="previousYoungerChildFeeAug" label="August" prefix="$" />
            </v-col>
            <v-col
              class="col-6 col-md-2"
            >
              <v-text-field type="number" outlined :rules="feeRules"  v-model.number="previousYoungerChildFeeSep" label="September" prefix="$" />
            </v-col>
          </v-row>

          <v-row>
            <v-col 
              class="col-6 col-md-2">
              <v-text-field type="number" outlined :rules="feeRules"  v-model.number="previousYoungerChildFeeOct" label="October" prefix="$"/>
            </v-col>
            <v-col 
              class="col-6 col-md-2">
              <v-text-field type="number" outlined :rules="feeRules"  v-model.number="previousYoungerChildFeeNov" label="November" prefix="$"/>
            </v-col >
            <v-col 
              class="col-6 col-md-2">
              <v-text-field type="number" outlined :rules="feeRules"  v-model.number="previousYoungerChildFeeDec" label="December" prefix="$"/>
            </v-col >
            <v-col
              class="col-6 col-md-2">
              <v-text-field type="number" outlined :rules="feeRules"  v-model.number="previousYoungerChildFeeJan" label="Jan" prefix="$"/>
            </v-col>
            <v-col
              class="col-6 col-md-2">
              <v-text-field type="number" outlined :rules="feeRules"  v-model.number="previousYoungerChildFeeFeb" label="Feb" prefix="$" />
            </v-col>
            <v-col
              class="col-6 col-md-2">
              <v-text-field type="number" outlined :rules="feeRules"  v-model.number="previousYoungerChildFeeMar" label="March" prefix="$" />
            </v-col>
          </v-row>

        </v-container>

        <v-container v-else-if="previousYoungerChildFeeSchedule ==='daily' && previousYoungerChildFixedFee==='No'">
          <v-row>
            <v-col>
              <label>Enter your {{previousYoungerChildFeeSchedule}} fee in every day below. If you do not charge a fee (e.g. if the facility is closed) enter zero.</label>
            </v-col>
          </v-row>
          <v-row>
            <v-col
              class="col-6 col-md-2">
              <v-text-field type="number" outlined :rules="feeRules"  v-model.number="previousYoungerChildFeeMon" label="Monday" prefix="$"/>
            </v-col>
            <v-col
              class="col-6 col-md-2">
              <v-text-field type="number" outlined :rules="feeRules"  v-model.number="previousYoungerChildFeeTue" label="Tuesday" prefix="$" />
            </v-col>
            <v-col
              class="col-6 col-md-2">
              <v-text-field type="number" outlined :rules="feeRules"  v-model.number="previousYoungerChildFeeWed" label="Wednesday" prefix="$" />
            </v-col>
            <v-col
              class="col-6 col-md-2">
              <v-text-field type="number" outlined :rules="feeRules"  v-model.number="previousYoungerChildFeeThu" label="Thursday" prefix="$"/>
            </v-col>
            <v-col 
              class="col-6 col-md-2">
              <v-text-field type="number" outlined :rules="feeRules"  v-model.number="previousYoungerChildFeeFri" label="Friday" prefix="$"/>
            </v-col >
            <v-col 
              class="col-6 col-md-2">
              <v-text-field type="number" outlined :rules="feeRules"  v-model.number="previousYoungerChildFeeSat" label="Saturday" prefix="$"/>
            </v-col >
            <v-col
              class="col-6 col-md-2">
              <v-text-field type="number" outlined :rules="feeRules"  v-model.number="previousYoungerChildFeeSun" label="Sunday" prefix="$"/>
            </v-col>
          
          </v-row>

        </v-container>

        <v-container v-else>
          <v-row>
              <v-col>
                <label>What is the {{previousYoungerChildFeeSchedule}} fixed fee?</label>
              </v-col>
            </v-row>
            <v-row>
              <v-col
                class="col-6 col-md-2">
                  <v-text-field type="number" outlined :rules="feeRules"  v-model.number="previousYoungerChildFeeSchedule" prefix="$"/>
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
            Parent Fees 20{{prevYearTwoDigit}}/{{currentYearTwoDigit}}: Full-Time 3 Years to Kindergarten
          </p>
          <br>
          <p class="text-h6 text--primary">
            Are your parent fees
          </p>
          
          <v-radio-group
            v-model="previousOlderChildFeeSchedule"
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
            v-model="previousOlderChildFixedFee"
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


          <v-container v-if="previousOlderChildFixedFee==='No' && previousOlderChildFeeSchedule !='daily'">
            <v-row>
              <v-col>
                <label>Enter your {{previousOlderChildFeeSchedule}} fee in every month below. If you do not charge a fee (e.g. if the facility is closed) enter zero.</label>
              </v-col>
            </v-row>
            <v-row>
              <v-col
                class="col-6 col-md-2">
                <v-text-field type="number" outlined :rules="feeRules"  v-model.number="previousOlderChildFeeApr" label="April" prefix="$"/>
              </v-col>
              <v-col 
                class="col-6 col-md-2">
                <v-text-field type="number" outlined :rules="feeRules"  v-model.number="previousOlderChildFeeMay" label="May" prefix="$"/>
              </v-col >
              <v-col 
                class="col-6 col-md-2">
                <v-text-field type="number" outlined :rules="feeRules"  v-model.number="previousOlderChildFeeJun" label="June" prefix="$"/>
              </v-col >
              <v-col
                class="col-6 col-md-2">
                <v-text-field type="number" outlined :rules="feeRules"  v-model.number="previousOlderChildFeeJul" label="July" prefix="$"/>
              </v-col>
              <v-col 
                class="col-6 col-md-2">
                <v-text-field type="number" outlined :rules="feeRules"  v-model.number="previousOlderChildFeeAug" label="August" prefix="$" />
              </v-col>
              <v-col
                class="col-6 col-md-2">
                <v-text-field type="number" outlined :rules="feeRules"  v-model.number="previousOlderChildFeeSep" label="September" prefix="$" />
              </v-col>
            </v-row>

            <v-row>
              <v-col 
                class="col-6 col-md-2">
                <v-text-field type="number" outlined :rules="feeRules"  v-model.number="previousOlderChildFeeOct" label="October" prefix="$"/>
              </v-col>
              <v-col 
                class="col-6 col-md-2">
                <v-text-field type="number" outlined :rules="feeRules"  v-model.number="previousOlderChildFeeNov" label="November" prefix="$"/>
              </v-col >
              <v-col 
                class="col-6 col-md-2">
                <v-text-field type="number" outlined :rules="feeRules"  v-model.number="previousOlderChildFeeDec" label="December" prefix="$"/>
              </v-col >
              <v-col
                class="col-6 col-md-2">
                <v-text-field type="number" outlined :rules="feeRules"  v-model.number="previousOlderChildFeeJan" label="Jan" prefix="$"/>
              </v-col>
              <v-col
                class="col-6 col-md-2">
                <v-text-field type="number" outlined :rules="feeRules"  v-model.number="previousOlderChildFeeFeb" label="Feb" prefix="$" />
              </v-col>
              <v-col
                class="col-6 col-md-2">
                <v-text-field type="number" outlined :rules="feeRules"  v-model.number="previousOlderChildFeeMar" label="March" prefix="$" />
              </v-col>
            </v-row>
          </v-container>

          <v-container v-else-if="previousOlderChildFeeSchedule ==='daily' && previousOlderChildFixedFee==='No'">
            <v-row>
              <v-col>
                <label>Enter your {{previousOlderChildFeeSchedule}} fee in every day below. If you do not charge a fee (e.g. if the facility is closed) enter zero.</label>
              </v-col>
            </v-row>
            <v-row>
              <v-col
                class="col-6 col-md-2">
                <v-text-field type="number" outlined :rules="feeRules"  v-model.number="previousOlderChildFeeMon" label="Monday" prefix="$"/>
              </v-col>
              <v-col
                class="col-6 col-md-2">
                <v-text-field type="number" outlined :rules="feeRules"  v-model.number="previousOlderChildFeeTue" label="Tuesday" prefix="$" />
              </v-col>
              <v-col
                class="col-6 col-md-2">
                <v-text-field type="number" outlined :rules="feeRules"  v-model.number="previousOlderChildFeeWed" label="Wednesday" prefix="$" />
              </v-col>
              <v-col
                class="col-6 col-md-2">
                <v-text-field type="number" outlined :rules="feeRules"  v-model.number="previousOlderChildFeeThu" label="Thursday" prefix="$"/>
              </v-col>
              <v-col 
                class="col-6 col-md-2">
                <v-text-field type="number" outlined :rules="feeRules"  v-model.number="previousOlderChildFeeFri" label="Friday" prefix="$"/>
              </v-col >
              <v-col 
                class="col-6 col-md-2">
                <v-text-field type="number" outlined :rules="feeRules"  v-model.number="previousOlderChildFeeSat" label="Saturday" prefix="$"/>
              </v-col >
              <v-col
                class="col-6 col-md-2">
                <v-text-field type="number" outlined :rules="feeRules"  v-model.number="previousOlderChildFeeSun" label="Sunday" prefix="$"/>
              </v-col>
            </v-row>
          </v-container>

          <v-container v-else>
            <v-row>
              <v-col>
                <label>What is the {{previousOlderChildFeeSchedule}} fixed fee?</label>
              </v-col>
            </v-row>
            <v-row>
              <v-col
                class="col-6 col-md-2">
                  <v-text-field type="number" outlined :rules="feeRules"  v-model.number="previousYoungerChildFixedFee" prefix="$"/>
              </v-col>
            </v-row>
          </v-container>

        </v-card-text>
    </v-card>

    <!--End previous year fees-->

      <!--these cards will read current fees-- the next two cards will read as the last calender year fees-->
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
            Parent Fees 20{{currentYearTwoDigit}}/{{nextYearTwoDigit}}: Full-Time 18-36 Months
          </p>
          <br>
          <p class="text-h6 text--primary">
            Are your parent fees
          </p>
          
          <v-radio-group
            v-model="currentYoungerChildFeeSchedule"
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
            v-model="currentYoungerChildFixedFee"
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

          <v-container v-if="currentYoungerChildFixedFee==='No' && currentYoungerChildFeeSchedule !='daily'">
          <v-row>
            <v-col>
              <label>Enter your {{currentYoungerChildFeeSchedule}} fee in every month below. If you do not charge a fee (e.g. if the facility is closed) enter zero.</label>
            </v-col>
          </v-row>
          <v-row>
            <v-col
              class="col-6 col-md-2"
            >
              <v-text-field type="number" outlined :rules="feeRules"  v-model.number="currentYoungerChildFeeApr" label="April" prefix="$"/>
            </v-col>
            <v-col 
              class="col-6 col-md-2"
            >
              <v-text-field type="number" outlined :rules="feeRules"  v-model.number="currentYoungerChildFeeMay" label="May" prefix="$"/>
            </v-col >
            <v-col 
              class="col-6 col-md-2"
            >
              <v-text-field type="number" outlined :rules="feeRules"  v-model.number="currentYoungerChildFeeJun" label="June" prefix="$"/>
            </v-col>
            <v-col
            class="col-6 col-md-2"
            >
              <v-text-field type="number" outlined :rules="feeRules"  v-model.number="currentYoungerChildFeeJul" label="July" prefix="$"/>
            </v-col>
            <v-col 
              class="col-6 col-md-2"
            >
              <v-text-field type="number" outlined :rules="feeRules"  v-model.number="currentYoungerChildFeeAug" label="August" prefix="$" />
            </v-col>
            <v-col
              class="col-6 col-md-2"
            >
              <v-text-field type="number" outlined :rules="feeRules"  v-model.number="currentYoungerChildFeeSep" label="September" prefix="$" />
            </v-col>
          </v-row>

          <v-row>
            <v-col 
              class="col-6 col-md-2">
              <v-text-field type="number" outlined :rules="feeRules"  v-model.number="currentYoungerChildFeeOct" label="October" prefix="$"/>
            </v-col>
            <v-col 
              class="col-6 col-md-2">
              <v-text-field type="number" outlined :rules="feeRules"  v-model.number="currentYoungerChildFeeNov" label="November" prefix="$"/>
            </v-col >
            <v-col 
              class="col-6 col-md-2">
              <v-text-field type="number" outlined :rules="feeRules"  v-model.number="currentYoungerChildFeeDec" label="December" prefix="$"/>
            </v-col >
            <v-col
              class="col-6 col-md-2">
              <v-text-field type="number" outlined :rules="feeRules"  v-model.number="currentYoungerChildFeeJan" label="Jan" prefix="$"/>
            </v-col>
            <v-col
              class="col-6 col-md-2">
              <v-text-field type="number" outlined :rules="feeRules"  v-model.number="currentYoungerChildFeeFeb" label="Feb" prefix="$" />
            </v-col>
            <v-col
              class="col-6 col-md-2">
              <v-text-field type="number" outlined :rules="feeRules"  v-model.number="currentYoungerChildFeeMar" label="March" prefix="$" />
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

        <v-container v-else-if="currentYoungerChildFeeSchedule ==='daily' && currentYoungerChildFixedFee==='No'">
          <v-row>
            <v-col>
              <label>Enter your {{currentYoungerChildFeeSchedule}} fee in every day below. If you do not charge a fee (e.g. if the facility is closed) enter zero.</label>
            </v-col>
          </v-row>
          <v-row>
            <v-col
              class="col-6 col-md-2">
              <v-text-field type="number" outlined :rules="feeRules"  v-model.number="currentYoungerChildFeeMon" label="Monday" prefix="$"/>
            </v-col>
            <v-col
              class="col-6 col-md-2">
              <v-text-field type="number" outlined :rules="feeRules"  v-model.number="currentYoungerChildFeeTue" label="Tuesday" prefix="$" />
            </v-col>
            <v-col
              class="col-6 col-md-2">
              <v-text-field type="number" outlined :rules="feeRules"  v-model.number="currentYoungerChildFeeWed" label="Wednesday" prefix="$" />
            </v-col>
            <v-col
              class="col-6 col-md-2">
              <v-text-field type="number" outlined :rules="feeRules"  v-model.number="currentYoungerChildFeeThu" label="Thursday" prefix="$"/>
            </v-col>
            <v-col 
              class="col-6 col-md-2">
              <v-text-field type="number" outlined :rules="feeRules"  v-model.number="currentYoungerChildFeeFri" label="Friday" prefix="$"/>
            </v-col >
            <!-- </v-row>
            
            <v-row> -->
            <v-col 
              class="col-6 col-md-2">
              <v-text-field type="number" outlined :rules="feeRules"  v-model.number="currentYoungerChildFeeSat" label="Saturday" prefix="$"/>
            </v-col >
            <v-col
              class="col-6 col-md-2">
              <v-text-field type="number" outlined :rules="feeRules"  v-model.number="currentYoungerChildFeeSun" label="Sunday" prefix="$"/>
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
                <label>What is the {{currentYoungerChildFeeSchedule}} fixed fee?</label>
              </v-col>
            </v-row>
            <v-row>
              <v-col
                class="col-6 col-md-2">
                  <v-text-field type="number" outlined :rules="feeRules"  v-model.number="currentYoungerChildFeeSchedule" prefix="$"/>
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
            Parent Fees 20{{currentYearTwoDigit}}/{{nextYearTwoDigit}}: Full-Time 3 Years to Kindergarten
          </p>
          <br>
          <p class="text-h6 text--primary">
            Are your parent fees
          </p>
          
          <v-radio-group
            v-model="currentOlderChildFeeSchedule"
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
            v-model="currentOlderChildFixedFee"
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


          <v-container v-if="currentOlderChildFixedFee==='No' && currentOlderChildFeeSchedule !='daily'">
            <v-row>
              <v-col>
                <label>Enter your {{currentOlderChildFeeSchedule}} fee in every month below. If you do not charge a fee (e.g. if the facility is closed) enter zero.</label>
              </v-col>
            </v-row>
            <v-row>
              <v-col
                class="col-6 col-md-2">
                <v-text-field type="number" outlined :rules="feeRules"  v-model.number="currentOlderChildFeeApr" label="April" prefix="$"/>
              </v-col>
              <v-col 
                class="col-6 col-md-2">
                <v-text-field type="number" outlined :rules="feeRules"  v-model.number="currentOlderChildFeeMay" label="May" prefix="$"/>
              </v-col >
              <v-col 
                class="col-6 col-md-2">
                <v-text-field type="number" outlined :rules="feeRules"  v-model.number="currentOlderChildFeeJun" label="June" prefix="$"/>
              </v-col >
              <v-col
                class="col-6 col-md-2">
                <v-text-field type="number" outlined :rules="feeRules"  v-model.number="currentOlderChildFeeJul" label="July" prefix="$"/>
              </v-col>
              <v-col 
                class="col-6 col-md-2">
                <v-text-field type="number" outlined :rules="feeRules"  v-model.number="currentOlderChildFeeAug" label="August" prefix="$" />
              </v-col>
              <v-col
                class="col-6 col-md-2">
                <v-text-field type="number" outlined :rules="feeRules"  v-model.number="currentOlderChildFeeSep" label="September" prefix="$" />
              </v-col>
            </v-row>

            <v-row>
              <v-col 
                class="col-6 col-md-2">
                <v-text-field type="number" outlined :rules="feeRules"  v-model.number="currentOlderChildFeeOct" label="October" prefix="$"/>
              </v-col>
              <v-col 
                class="col-6 col-md-2">
                <v-text-field type="number" outlined :rules="feeRules"  v-model.number="currentOlderChildFeeNov" label="November" prefix="$"/>
              </v-col >
              <v-col 
                class="col-6 col-md-2">
                <v-text-field type="number" outlined :rules="feeRules"  v-model.number="currentOlderChildFeeDec" label="December" prefix="$"/>
              </v-col >
              <v-col
                class="col-6 col-md-2">
                <v-text-field type="number" outlined :rules="feeRules"  v-model.number="currentOlderChildFeeJan" label="Jan" prefix="$"/>
              </v-col>
              <v-col
                class="col-6 col-md-2">
                <v-text-field type="number" outlined :rules="feeRules"  v-model.number="currentOlderChildFeeFeb" label="Feb" prefix="$" />
              </v-col>
              <v-col
                class="col-6 col-md-2">
                <v-text-field type="number" outlined :rules="feeRules"  v-model.number="currentOlderChildFeeMar" label="March" prefix="$" />
              </v-col>
            </v-row>
          </v-container>

          <v-container v-else-if="currentOlderChildFeeSchedule ==='daily' && currentOlderChildFixedFee==='No'">
            <v-row>
              <v-col>
                <label>Enter your {{currentOlderChildFeeSchedule}} fee in every day below. If you do not charge a fee (e.g. if the facility is closed) enter zero.</label>
              </v-col>
            </v-row>
            <v-row>
              <v-col
                class="col-6 col-md-2">
                <v-text-field type="number" outlined :rules="feeRules"  v-model.number="currentOlderChildFeeMon" label="Monday" prefix="$"/>
              </v-col>
              <v-col
                class="col-6 col-md-2">
                <v-text-field type="number" outlined :rules="feeRules"  v-model.number="currentOlderChildFeeTue" label="Tuesday" prefix="$" />
              </v-col>
              <v-col
                class="col-6 col-md-2">
                <v-text-field type="number" outlined :rules="feeRules"  v-model.number="currentOlderChildFeeWed" label="Wednesday" prefix="$" />
              </v-col>
              <v-col
                class="col-6 col-md-2">
                <v-text-field type="number" outlined :rules="feeRules"  v-model.number="currentOlderChildFeeThu" label="Thursday" prefix="$"/>
              </v-col>
              <v-col 
                class="col-6 col-md-2">
                <v-text-field type="number" outlined :rules="feeRules"  v-model.number="currentOlderChildFeeFri" label="Friday" prefix="$"/>
              </v-col >
              <v-col 
                class="col-6 col-md-2">
                <v-text-field type="number" outlined :rules="feeRules"  v-model.number="currentOlderChildFeeSat" label="Saturday" prefix="$"/>
              </v-col >
              <v-col
                class="col-6 col-md-2">
                <v-text-field type="number" outlined :rules="feeRules"  v-model.number="currentOlderChildFeeSun" label="Sunday" prefix="$"/>
              </v-col>
            </v-row>
          </v-container>

          <v-container v-else>
            <v-row>
              <v-col>
                <label>What is the {{currentOlderChildFeeSchedule}} fixed fee?</label>
              </v-col>
            </v-row>
            <v-row>
              <v-col
                class="col-6 col-md-2">
                  <v-text-field type="number" outlined :rules="feeRules"  v-model.number="currentYoungerChildFixedFee" prefix="$"/>
              </v-col>
            </v-row>
          </v-container>

        </v-card-text>
    </v-card>

    <!--End current year fees-->

    


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
          v-model="closureFees"
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

        <v-row v-if = "closureFees === 'Yes'">
      
        <v-col class="col-md-4 col-12">
        <v-menu  v-model="calendarMenu" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="auto">
          <template v-slot:activator="{ on, attrs }">
          <v-text-field outlined required v-model="datePicker" label="Select Start and End Dates (YYYY-MM-DD)" readonly v-bind="attrs" v-on="on">
          </v-text-field>
          </template>
          <v-date-picker range  v-model="datePicker" @input="calendarMenu = false">
          </v-date-picker>
          </v-menu>
        </v-col>
        <v-col class="col-md-4 col-12 ">
          <!-- I added in Alexy's "required" ruleset that makes the textbox go red. Maybe not needed here since the button
          will not work unless all fields are filled in?
        -->
        <v-text-field
        class = ""
          v-model="closureReason"
          label="Purpose of Closure"
          outlined
          clearable
          required
          :rules="rules.required" 
        ></v-text-field>
      </v-col>

      <v-col class="col-md-3 col-12">
        <v-radio-group
          required
          row
          v-model="closedFeesPaid"
          label="Did parents pay for this closure?"
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
      </v-col>


      <v-col>
        <v-btn class="col-3 col-md-1"
        v-if =" closureReason ==='' || closureReason ===' ' || closureReason ===null|| closureReason ===undefined 
        || datePicker===null || datePicker===' ' || datePicker=== undefined
        || closedFeesPaid === '' || closedFeesPaid === null || closedFeesPaid === undefined "
          disabled
        >ADD</v-btn>
        <v-btn v-else v-on:click="addDate">ADD</v-btn>
      </v-col>

    </v-row>
        <v-row>
          <v-btn v-for="date in dates" :key="date.message"
          v-on:click="removeDate(date.id)">
            {{date.message}} FOR DATES : {{date.selectedDates}} FEES PAID?: {{date.feesPaidWhileClosed}} ID: {{date.id}}
          </v-btn>
        </v-row>
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

      <v-row justify="space-around">
        <v-btn color="info" outlined x-large @click="previous()">
          Back</v-btn>
          <!--add form logic here to disable/enable button-->
        <v-btn color="secondary" outlined x-large @click="next()" :disabled="false">Next</v-btn>
        <v-btn color="primary" outlined x-large>
          Save</v-btn>
      </v-row>
    </v-container>
  </v-form>
</template>
<script>
import rules from '@/utils/rules';
import { PATHS } from '@/utils/constants';
 
export default {
  props: {
    currentYear: {
      type: Number,
      default: 2023,
      required: false,
    },
  },
  data() {
    return {
      rules,
      isValidForm : undefined,
      datePicker: null,
      calendarMenu: undefined,
      dates: [],
      closureFees: undefined,
      closureReason: undefined,
      closedFeesPaid: undefined,
      feeRules: [
        (v) => !!v  || 'Required.',
        (v) => v > 0  || 'Input a positve number',
        (v)  => v <=  9999|| 'Max fee is $9999.00',
      ],
      currentOlderChildFeeSchedule: undefined,
      currentYoungerChildFeeSchedule: undefined,
      currentOlderChildFixedFee: undefined,
      currentYoungerChildFixedFee: undefined,
      currentOlderChildFeeJan: undefined,
      currentOlderChildFeeFeb: undefined,
      currentOlderChildFeeMar: undefined,
      currentOlderChildFeeApr: undefined,
      currentOlderChildFeeMay: undefined,
      currentOlderChildFeeJun: undefined,
      currentOlderChildFeeJul: undefined,
      currentOlderChildFeeAug: undefined,
      currentOlderChildFeeSep: undefined,
      currentOlderChildFeeOct: undefined,
      currentOlderChildFeeNov: undefined,
      currentOlderChildFeeDec: undefined,
      currentOlderChildFeeMon: undefined,
      currentOlderChildFeeTue: undefined,
      currentOlderChildFeeWed : undefined,
      currentOlderChildFeeThu : undefined,
      currentOlderChildFeeFri : undefined,
      currentOlderChildFeeSat : undefined,
      currentOlderChildFeeSun : undefined,
      currentYoungerChildFeeJan: undefined,
      currentYoungerChildFeeFeb: undefined,
      currentYoungerChildFeeMar: undefined,
      currentYoungerChildFeeApr: undefined,
      currentYoungerChildFeeMay: undefined,
      currentYoungerChildFeeJun: undefined,
      currentYoungerChildFeeJul: undefined,
      currentYoungerChildFeeAug: undefined,
      currentYoungerChildFeeSep: undefined,
      currentYoungerChildFeeOct: undefined,
      currentYoungerChildFeeNov: undefined,
      currentYoungerChildFeeDec: undefined,
      currentYoungerChildFeeMon: undefined,
      currentYoungerChildFeeTue: undefined,
      currentYoungerChildFeeWed : undefined,
      currentYoungerChildFeeThu : undefined,
      currentYoungerChildFeeFri : undefined,
      currentYoungerChildFeeSat : undefined,
      currentYoungerChildFeeSun : undefined,
      previousOlderChildFeeSchedule: undefined,
      previousYoungerChildFeeSchedule: undefined,
      previousOlderChildFixedFee: undefined,
      previousYoungerChildFixedFee: undefined,
      previousOlderChildFeeJan: undefined,
      previousOlderChildFeeFeb: undefined,
      previousOlderChildFeeMar: undefined,
      previousOlderChildFeeApr: undefined,
      previousOlderChildFeeMay: undefined,
      previousOlderChildFeeJun: undefined,
      previousOlderChildFeeJul: undefined,
      previousOlderChildFeeAug: undefined,
      previousOlderChildFeeSep: undefined,
      previousOlderChildFeeOct: undefined,
      previousOlderChildFeeNov: undefined,
      previousOlderChildFeeDec: undefined,
      previousOlderChildFeeMon: undefined,
      previousOlderChildFeeTue: undefined,
      previousOlderChildFeeWed : undefined,
      previousOlderChildFeeThu : undefined,
      previousOlderChildFeeFri : undefined,
      previousOlderChildFeeSat : undefined,
      previousOlderChildFeeSun : undefined,
      previousYoungerChildFeeJan: undefined,
      previousYoungerChildFeeFeb: undefined,
      previousYoungerChildFeeMar: undefined,
      previousYoungerChildFeeApr: undefined,
      previousYoungerChildFeeMay: undefined,
      previousYoungerChildFeeJun: undefined,
      previousYoungerChildFeeJul: undefined,
      previousYoungerChildFeeAug: undefined,
      previousYoungerChildFeeSep: undefined,
      previousYoungerChildFeeOct: undefined,
      previousYoungerChildFeeNov: undefined,
      previousYoungerChildFeeDec: undefined,
      previousYoungerChildFeeMon: undefined,
      previousYoungerChildFeeTue: undefined,
      previousYoungerChildFeeWed : undefined,
      previousYoungerChildFeeThu : undefined,
      previousYoungerChildFeeFri : undefined,
      previousYoungerChildFeeSat : undefined,
      previousYoungerChildFeeSun : undefined,

    };
  },
  computed: {
    currentYearTwoDigit() {
      return this.currentYear - 2000;
    },
    nextYearTwoDigit() {
      return this.currentYear - 1999;
    },
    prevYearTwoDigit() {
      return this.currentYear - 2001;
    },
    twoYearsAgoTwoDigit() {
      return this.currentYear - 2002;
    }
  },
  methods: {
    addDate(){
      this.dates.push({
        message: this.closureReason,
        selectedDates: this.datePicker,
        feesPaidWhileClosed: this.closedFeesPaid,
        id: this.dates.length
      });
      this.closureReason = '';
      this.datePicker = '';
      this.closedFeesPaid= '';
    },
    removeDate(removedId){
      const indexOfItemToRemove = this.dates.findIndex((obj) => obj.id === removedId);
      this.dates.splice(indexOfItemToRemove,1);
      console.log(this.dates);
    },
    previous() {
      this.$router.push(PATHS.ccfriHome); //TODO: change this, from CCOF page
    },
    next() {
      this.$router.push(PATHS.ccfriRequestMoreInfo); //TODO: add logic for when page is done / to go to this page 
    },
  }
};
</script>
