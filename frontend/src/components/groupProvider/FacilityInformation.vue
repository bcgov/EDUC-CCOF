<template>
    <v-container>
        <h1>Facility Information</h1>

        <v-row justify="space-around">
            <v-card width="1200">
                <v-container>
                    <v-row>
                        <v-col>
                            <v-text-field outlined
                                label="Facility Name (as it appears on the Community Care Assisted Living Act licence)" />
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-col>
                            <v-text-field outlined label="Year Facility Began operation (YYYY)" />
                        </v-col>
                        <v-col>
                            <v-text-field outlined label="Facility Street Address" />
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-col>
                            <v-text-field outlined label="City/Town" />
                        </v-col>
                        <v-col>
                            <v-text-field outlined label="Postal Code" />
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-col>
                            <v-text-field outlined label="Facility Contact Name" />
                        </v-col>
                        <v-col>
                            <v-text-field outlined label="Position" />
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-col>
                            <v-text-field outlined label="Business Phone" />
                        </v-col>
                        <v-col>
                            <v-text-field outlined label="Organization Facility email" />
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-col>
                            <v-text-field outlined label="Facility Licence Number" />
                        </v-col>
                        <v-col>
                            <v-text-field outlined label="Effective Date of Current Licence (YYYY-MM-DD)" />
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-col>
                            <v-radio-group row v-model="hasReceivedFunding"
                                label="Has this facility or you as the applicant ever received funding under the Child Care Operating Funding Program? ">
                                <v-radio label="No" value="no"></v-radio>
                                <v-radio label="Yes" value="yes"></v-radio>
                            </v-radio-group>
                        </v-col>
                    </v-row>

                    <v-row v-show="hasReceivedFunding === 'yes'">
                        <v-col>
                            <v-text-field outlined label="Facility Name" />
                        </v-col>
                    </v-row>

                </v-container>
            </v-card>

            <v-container>
                <v-row justify="space-around">
                    <v-btn color="info" outlined x-large>Back</v-btn>
                    <v-btn color="secondary" outlined x-large>Next</v-btn>
                    <v-btn color="primary" outlined x-large>Save</v-btn>
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
