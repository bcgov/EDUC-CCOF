<template>
    <v-container>
        <v-row justify="space-around">
            <v-card class="cc-top-level-card" width="1200">
                <v-form ref="form" v-model="isValidForm">
                    <v-container>
                        <v-row>
                            <v-col>
                                <v-text-field outlined required v-model="facilityNameCommunityCare"
                                    :rules="rules.required" class="required"
                                    label="Facility Name (as it appears on the Community Care Assisted Living Act licence)" />
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col cols="12" md="6">
                                <v-text-field outlined required v-model="yearBeginOperation" type="number"
                                    :rules="rules.required" class="required"
                                    label="Year Facility Began operation (YYYY)" />
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field outlined required v-model="facilityAddress" :rules="rules.required"
                                    class="required" label="Facility Street Address" />
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col cols="12" md="6">
                                <v-text-field outlined required v-model="city" :rules="rules.required" class="required"
                                    label="City/Town" />
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field outlined required v-model="postalCode"
                                    :rules="[...rules.required, ...rules.postalCode]" class="required"
                                    label="Postal Code" />
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col cols="12" md="6">
                                <v-text-field outlined required v-model="contactName" :rules="rules.required"
                                    class="required" label="Facility Contact Name" />
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field outlined required v-model="position" :rules="rules.required"
                                    class="required" label="Position" />
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col cols="12" md="6">
                                <v-text-field outlined required v-model="phone" :rules="rules.required" class="required"
                                    label="Business Phone" />
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field outlined required v-model="email"
                                    :rules="[...rules.required, ...rules.email]" class="required"
                                    label="Organization Facility email" />
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col cols="12" md="6">
                                <v-text-field outlined required type="number" v-model="licenseNumber"
                                    :rules="rules.required" class="required" label="Facility Licence Number" />
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-menu v-model="calendarMenu" :close-on-content-click="false" :nudge-right="40"
                                    transition="scale-transition" offset-y min-width="auto">
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-text-field outlined required class="required" v-model="licenseEffectiveDate"
                                            label="Effective Date of Current Licence (YYYY-MM-DD)" readonly
                                            v-bind="attrs" v-on="on">
                                        </v-text-field>
                                    </template>
                                    <v-date-picker v-model="licenseEffectiveDate" @input="calendarMenu = false">
                                    </v-date-picker>
                                </v-menu>
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col>
                                <label class="required">Has this facility or you as the applicant ever received funding
                                    under the Child Care Operating Funding Program?</label>
                                <v-radio-group row v-model="hasReceivedFunding">
                                    <v-radio label="No" value="no"></v-radio>
                                    <v-radio label="Yes" value="yes"></v-radio>
                                </v-radio-group>
                            </v-col>
                        </v-row>

                        <v-row v-show="hasReceivedFunding === 'yes'">
                            <v-col>
                                <v-text-field outlined required v-model="facilityName"
                                    :rules="hasReceivedFunding === 'yes' ? rules.required : []" class="required"
                                    label="Facility Name" />
                            </v-col>
                        </v-row>

                    </v-container>
                </v-form>
            </v-card>

            <v-container>
                <v-row justify="space-around">
                    <v-btn color="info" outlined required x-large @click="previous()">Back</v-btn>
                    <v-btn color="secondary" outlined x-large @click="next()" :disabled="!isValidForm">Next</v-btn>
                    <v-btn color="primary" outlined x-large>Save</v-btn>
                </v-row>
            </v-container>
        </v-row>
    </v-container>
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
            isValidForm: undefined,
            facilityName: undefined,
            yearBeginOperation: undefined,
            facilityAddress: undefined,
            city: undefined,
            postalCode: undefined,
            contactName: undefined,
            position: undefined,
            phone: undefined,
            email: undefined,
            licenseNumber: undefined,
            licenseEffectiveDate: undefined,
            hasReceivedFunding: 'no',
            facilityNameCommunityCare: undefined,
            rules,
            calendarMenu: false,
        };
    },
    methods: {
        previous() {
            this.$router.push(PATHS.orgInfo);
        },
        next() {
            this.$router.push(PATHS.fundAmount);
        }
    }
};
</script>
