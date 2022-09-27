<template>
    <v-container>
        <h1>Facility Information</h1>

        <v-row justify="space-around">
            <v-card width="1200">
                <v-container>
                    <v-row>
                        <v-col>
                            <v-text-field label="Facility Name (as it appears on the Community Care Assisted Living Act licence)">
                            </v-text-field>
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-col>
                            <v-text-field label="Year Facility Began operation (YYYY)"></v-text-field>
                        </v-col>
                        <v-col>
                            <v-text-field label="Facility Street Address"></v-text-field>
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-col>
                            <v-text-field label="City/Town"></v-text-field>
                        </v-col>
                        <v-col>
                            <v-text-field label="Postal Code"></v-text-field>
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-col>
                            <v-text-field label="Facility Contact Name"></v-text-field>
                        </v-col>
                        <v-col>
                            <v-text-field label="Position"></v-text-field>
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-col>
                            <v-text-field label="Business Phone"></v-text-field>
                        </v-col>
                        <v-col>
                            <v-text-field label="Organization Facility email"></v-text-field>
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-col>
                            <v-text-field label="Facility Licence Number"></v-text-field>
                        </v-col>
                        <v-col>
                            <v-text-field label="Effective Date of Current Licence (YYYY-MM-DD)"></v-text-field>
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-col>
                            <v-radio-group v-model="hasReceivedFunding"
                                label="Has this facility or you as the applicant ever received funding under the Child Care Operating Funding Program? ">
                                <v-radio label="No" value="no"></v-radio>
                                <v-radio label="Yes" value="yes"></v-radio>
                            </v-radio-group>
                        </v-col>
                    </v-row>

                    <v-row v-show="hasReceivedFunding === 'yes'">
                        <v-col>
                            <v-text-field label="Facility Name"></v-text-field>
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
  name: 'Facility Information',
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
