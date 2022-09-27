<template>
    <v-container>
        <h1>Information to Determine Funding amounts</h1>

        <v-row justify="space-around">
            <v-card width="1200">
                <v-container>
                    <v-row>
                        <v-col>
                            <v-text-field label="Maximum number of days per week you provide child care" />
                        </v-col>
                        <v-col>
                            <v-text-field label="Maximum of weeks per year you provide child care" />
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-col>
                            <v-radio-group v-model="hasClosedMonth"
                                label="Are there months when ALL of the programs at this facility are closed for the entire month?">
                                <v-radio label="Yes" value="yes" />
                                <v-radio label="No" value="no" />
                            </v-radio-group>
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-col>
                            <v-text-field label="Facility hours of operation from" />
                        </v-col>
                        <v-col>
                            <v-text-field label="Facility hours of operation to" />
                        </v-col>
                    </v-row>
                </v-container>
            </v-card>

            <v-card width="1200" style="margin-top:20px">
                <v-card-title>Type of Service Maximum Numbers</v-card-title>
                <v-card-subtitle>Complete the licence information using your Community Care and Assisted Living Act Licence.</v-card-subtitle>
                <v-container>
                    <v-row>
                        <v-col>
                            <v-text-field label="Maximum Licensed Capacity" />
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-col>
                            <v-text-field label="Group Child Care (under 36 months)" />
                        </v-col>
                        <v-col>
                            <v-text-field label="Group Child Care (36 months to School Age)" />
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-col>
                            <v-text-field label="Preschool" />
                        </v-col>
                        <v-col>
                            <v-text-field label="Group Child Care (School Age/ School age care on School Grounds)" />
                        </v-col>
                    </v-row>
                </v-container>
            </v-card>

            <v-container>
                <v-row justify="space-around">
                    <v-btn>Back</v-btn>
                    <v-btn>Next</v-btn>
                    <v-btn>Save</v-btn>
                </v-row>
            </v-container>
        </v-row>
    </v-container>
</template>

<script>

export default {
  name: 'Determine Funding Amount',
  props: {
  },
  computed: {
  },
  data() {
    return {
      hasReceivedFunding: 'no',
    };
  },
};
</script>
