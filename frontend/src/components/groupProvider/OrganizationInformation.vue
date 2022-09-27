<template>
    <v-container>
        <v-row justify="space-around">
            <v-card width="1200">
                <v-form ref="form" v-model="isValidForm" lazy-validation>
                    <v-container>
                        <v-row>
                            <v-col>
                                <v-text-field outlined
                                    label="Legal Name (first, middle and last) or Organization (as it appears in BC corporate Registry)"
                                    required />
                            </v-col>
                        </v-row>

                        <v-divider></v-divider>

                        <v-row>
                            <v-col>
                                <v-text-field outlined label="Organization Mailing Address" />
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

                        <v-divider></v-divider>

                        <v-row>
                            <v-col>
                                <v-checkbox v-model="isAddressDifferent"
                                    label="Organization Street Address is different from mailing address"></v-checkbox>
                            </v-col>
                        </v-row>

                        <v-row v-show="isAddressDifferent">
                            <v-col>
                                <v-text-field outlined label="Organization Mailing Address" />
                            </v-col>
                        </v-row>

                        <v-row v-show="isAddressDifferent">
                            <v-col>
                                <v-text-field outlined label="City/Town" />
                            </v-col>
                            <v-col>
                                <v-text-field outlined label="Postal Code" />
                            </v-col>
                        </v-row>

                        <v-divider></v-divider>

                        <v-row>
                            <v-col>
                                <v-text-field outlined label="Organization Contact Name" />
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
                                <v-text-field outlined label="Business BCeID" />
                            </v-col>
                        </v-row>

                        <v-divider></v-divider>

                        <v-row>
                            <v-col>
                                <v-text-field outlined label="E-mail Address of Signing Authority" :rules="emailRules"
                                    required>
                                </v-text-field>
                            </v-col>
                            <v-col>
                                <v-text-field outlined
                                    label="Incorporation Number (as it appears in BC Corporate Registry)">
                                </v-text-field>
                            </v-col>
                        </v-row>

                        <v-divider></v-divider>

                        <v-row>
                            <v-col>
                                <v-radio-group row v-model="organizationType" label="Type of Orgnization">
                                    <v-radio label="Non-Profit Society" value="1"></v-radio>
                                    <v-radio label="Public institution (college/university)" value="2"></v-radio>
                                    <v-radio label="Registered Company" value="3"></v-radio>
                                    <v-radio label="Local Government" value="4"></v-radio>
                                    <v-radio label="First Nations Government" value="5"></v-radio>
                                    <v-radio label="Sole Proprietorship or Partnership" value="6"></v-radio>
                                </v-radio-group>
                            </v-col>
                        </v-row>

                    </v-container>
                </v-form>
            </v-card>

            <v-container>
                <v-row justify="space-around">
                    <v-btn color="info" outlined x-large>Back</v-btn>
                    <v-btn color="secondary" outlined x-large @click="next()">Next</v-btn>
                    <v-btn color="primary" outlined x-large>Save</v-btn>
                </v-row>
            </v-container>
        </v-row>
    </v-container>
</template>

<script>

import PATHS from './paths';

export default {
    props: {
    },
    computed: {
    },
    data() {
        return {
            organizationType: undefined,
            isAddressDifferent: false,
            emailRules: [
                // v => /.+@.+/.test(v) || 'E-mail must be valid',
            ],
            isValidForm: true
        };
    },
    methods: {
        next() {
            this.$router.push(PATHS.facInfo);
        }
    }
};
</script>
