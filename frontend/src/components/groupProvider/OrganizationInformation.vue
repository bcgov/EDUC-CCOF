<template>
    <v-form ref="form" v-model="isValidForm">
        <v-container>
            <v-row justify="space-around">
                <v-card class="cc-top-level-card" width="1200">
                    <v-container>
                        <v-row>
                            <v-col>
                                <v-text-field outlined required v-model="legalName" :rules="rules.required"
                                    label="Legal Name (first, middle and last) or Organization (as it appears in BC corporate Registry)" />
                            </v-col>
                        </v-row>

                        <v-divider></v-divider>

                        <v-row>
                            <v-col>
                                <v-text-field outlined required v-model="address1" :rules="rules.required"
                                    label="Organization Mailing Address" />
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col cols="12" md="6">
                                <v-text-field outlined required v-model="city1" :rules="rules.required"
                                    label="City/Town" />
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field outlined required v-model="postalCode1"
                                    :rules="[...rules.required, ...rules.postalCode]" label="Postal Code" />
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
                                <v-text-field outlined required v-model="address2"
                                    :rules="isAddressDifferent? rules.required : []"
                                    label="Organization Mailing Address" />
                            </v-col>
                        </v-row>

                        <v-row v-show="isAddressDifferent">
                            <v-col cols="12" md="6">
                                <v-text-field outlined required v-model="city2"
                                    :rules="isAddressDifferent? rules.required : []" label="City/Town" />
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field outlined required v-model="postalCode2"
                                    :rules="isAddressDifferent? [...rules.required, ...rules.postalCode] : []"
                                    label="Postal Code" />
                            </v-col>
                        </v-row>

                        <v-divider></v-divider>

                        <v-row>
                            <v-col cols="12" md="6">
                                <v-text-field outlined required v-model="contactName" :rules="rules.required"
                                    label="Organization Contact Name" />
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field outlined required v-model="position" :rules="rules.required"
                                    label="Position" />
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col cols="12" md="6">
                                <v-text-field outlined required v-model="phone" :rules="rules.required"
                                    label="Business Phone" />
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field outlined required v-model="businessId" :rules="rules.required"
                                    label="Business BCeID" />
                            </v-col>
                        </v-row>

                        <v-divider></v-divider>

                        <v-row>
                            <v-col cols="12" md="6">
                                <v-text-field outlined required v-model="email" type="email"
                                    :rules="[...rules.required, ...rules.email]"
                                    label="E-mail Address of Signing Authority" />
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field outlined required :rules="rules.required" v-model="incNumber"
                                    type="number"
                                    label="Incorporation Number (as it appears in BC Corporate Registry)" />
                            </v-col>
                        </v-row>

                        <v-divider></v-divider>

                        <v-row>
                            <v-col>
                                <label>Type of Orgnization</label>
                                <v-radio-group v-model="organizationType" :rules="rules.required">
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
                </v-card>
            </v-row>

            <v-row justify="space-around">
                <v-btn color="info" outlined x-large>Back</v-btn>
                <v-btn color="secondary" outlined x-large @click="next()" :disabled="!isValidForm">Next</v-btn>
                <v-btn color="primary" outlined x-large>Save</v-btn>
            </v-row>
        </v-container>
    </v-form>
</template>

<script>

import PATHS from './paths';
import rules from './rules';

export default {
    props: {
    },
    computed: {
    },
    data() {
        return {
            isValidForm: true,
            legalName: undefined,
            address1: undefined,
            city1: undefined,
            postalCode1: undefined,
            isAddressDifferent: undefined,
            address2: undefined,
            city2: undefined,
            postalCode2: undefined,
            contactName: undefined,
            position: undefined,
            phone: undefined,
            businessId: undefined,
            email: undefined,
            incNumber: undefined,
            organizationType: undefined,
            rules
        };
    },
    methods: {
        next() {
            this.$router.push(PATHS.facInfo);
        }
    }
};
</script>
