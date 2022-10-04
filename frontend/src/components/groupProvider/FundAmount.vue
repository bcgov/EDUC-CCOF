<template>
    <v-form ref="form" v-model="isValidForm">
        <v-container>
            <v-row justify="space-around">
                <v-card class="cc-top-level-card" width="1200">
                    <v-container>
                        <v-row>
                            <v-col cols="12" md="6">
                                <v-text-field type="number" outlined required :rules="rules.required" class="required"
                                    v-model="maxDaysPerWeek"
                                    label="Maximum number of days per week you provide child care" />
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field type="number" outlined required :rules="rules.required" class="required"
                                    v-model="maxDaysPerYear" label="Maximum of weeks per year you provide child care" />
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col>
                                <label class="required">Are there months when ALL of the programs at this facility are
                                    closed for the entire month?</label>
                                <v-radio-group row v-model="hasClosedMonth">
                                    <v-radio label="Yes" value="yes" />
                                    <v-radio label="No" value="no" />
                                </v-radio-group>
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col cols="12" md="6">
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-menu ref="menu" v-model="menu2" :close-on-content-click="false" :nudge-right="40"
                                    :return-value.sync="time" transition="scale-transition" offset-y max-width="290px"
                                    min-width="290px">
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-text-field outlined v-model="hoursFrom"
                                            label="Facility hours of operation from"
                                            prepend-icon="mdi-clock-time-four-outline" readonly v-bind="attrs"
                                            v-on="on"></v-text-field>
                                    </template>
                                    <v-time-picker v-if="menu2" v-model="time2" full-width
                                        @click:minute="$refs.menu.save(time)"></v-time-picker>
                                </v-menu>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card>

                <v-card class="cc-top-level-card" width="1200">
                    <v-card-subtitle>Complete the licence information using your Community Care and Assisted Living Act
                        Licence.</v-card-subtitle>

                    <v-container>
                        <v-row>
                            <v-col>
                                <v-text-field type="number" outlined required :rules="rules.required" class="required"
                                    v-model="maxLicensesCapacity" label="Maximum Licensed Capacity" />
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col>
                                <v-text-field type="number" outlined required :rules="rules.required" class="required"
                                    v-model="maxGroupChildCare"
                                    label="Maximum Number for Group Child Care (under 36 months)" />
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col>
                                <v-text-field type="number" outlined required :rules="rules.required" class="required"
                                    v-model="maxGroupChildCare36"
                                    label="Maximum Number for Group Child Care (36 months to School Age)" />
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col>
                                <v-text-field type="number" outlined required :rules="rules.required" class="required"
                                    v-model="maxPreschool" label="Maximum Number for Preschool" />
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col>
                                <v-text-field type="number" outlined required :rules="rules.required" class="required"
                                    v-model="maxGroupChildCareSchool"
                                    label="Maximum Number for Group Child Care (School Age/ School age care on School Grounds)" />
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card>

                <v-card class="cc-top-level-card" width="1200">
                    <v-card-title>Preschool</v-card-title>
                    <v-card-subtitle>Please indicate how many preschool sessions your facility offers per day
                    </v-card-subtitle>

                    <v-container>
                        <v-row>
                            <v-col>
                                <v-text-field type="number" outlined required :rules="rules.required" class="required"
                                    v-model="monday" label="Monday" />
                            </v-col>
                            <v-col>
                                <v-text-field type="number" outlined required :rules="rules.required" class="required"
                                    v-model="tusday" label="Tuesday" />
                            </v-col>
                            <v-col>
                                <v-text-field type="number" outlined required :rules="rules.required" class="required"
                                    v-model="wednesday" label="Wednesday" />
                            </v-col>
                            <v-col>
                                <v-text-field type="number" outlined required :rules="rules.required" class="required"
                                    v-model="thursday" label="Thursday" />
                            </v-col>
                            <v-col>
                                <v-text-field type="number" outlined required :rules="rules.required" class="required"
                                    v-model="friday" label="Friday" />
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col>
                                <label class="required">Is the facility located on school property?</label>
                                <v-radio-group row v-model="isSchoolProperty">
                                    <v-radio label="Yes" value="yes" />
                                    <v-radio label="No" value="no" />
                                </v-radio-group>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card>

                <v-card class="cc-top-level-card" width="1200">
                    <v-container>
                        <v-row>
                            <v-col>
                                <label class="required">Do you <b>regularly offer</b> extended daily hours of child care
                                    <b>(before 6 am, after 7pm or overnight)</b>?</label>
                                <v-radio-group row v-model="isExtendedHours">
                                    <v-radio label="Yes" value="yes" />
                                    <v-radio label="No" value="no" />
                                </v-radio-group>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card>

                <v-card class="cc-top-level-card" width="1200">
                    <v-card-subtitle>Write the maximum <b>number of spaces</b> you offer extended hours of child care
                        for
                        each type of service</v-card-subtitle>
                    <v-container>
                        <v-row>
                            <v-col cols="12" md="6">
                                <v-card-subtitle><b>4 hours or less</b> extended child care</v-card-subtitle>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-card-subtitle><b>More than 4</b> extended child care</v-card-subtitle>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" md="6">
                                <v-text-field outlined required :rules="rules.required" class="required"
                                    v-model="groupChildCare4less" label="Group Child Care (under 36 months)" />
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field outlined required :rules="rules.required" class="required"
                                    v-model="groupChildCare4more" label="Group Child Care (under 36 months)" />
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col cols="12" md="6">
                                <v-text-field outlined required :rules="rules.required" class="required"
                                    v-model="groupChildCare36School4less"
                                    label="Group Child Care (36 months to School Age)" />
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field outlined required :rules="rules.required" class="required"
                                    v-model="groupChildCare36School4more"
                                    label="Group Child Care (36 months to School Age)" />
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col cols="12" md="6">
                                <v-text-field outlined required :rules="rules.required" class="required"
                                    v-model="groupChildCare4less"
                                    label="Group Child Care (School Age/ School age care on School Grounds)" />
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field outlined required :rules="rules.required" class="required"
                                    v-model="groupChildCare4more"
                                    label="Group Child Care (School Age/ School age care on School Grounds)" />
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col cols="12" md="6">
                                <v-text-field outlined required :rules="rules.required" class="required"
                                    v-model="multiAgeCare4less" label="Multi-Age Care" />
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field outlined required :rules="rules.required" class="required"
                                    v-model="multiAgeCare4more" label="Multi-Age Care" />
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card>
            </v-row>

            <v-row justify="space-around">
                <v-btn color="info" outlined required :rules="rules.required" class="required" x-large>
                    Back</v-btn>
                <v-btn color="secondary" outlined required :rules="rules.required" class="required" x-large>Next</v-btn>
                <v-btn color="primary" outlined required :rules="rules.required" class="required" x-large>
                    Save</v-btn>
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
            isValidForm: undefined,
            hasReceivedFunding: undefined,
            isExtendedHours: undefined,
            hasClosedMonth: undefined,
            isSchoolProperty: undefined,
            rules,
            menu1: false,
            menu2: false
        };
    },
    methods: {
        previous() {
            this.$router.push(PATHS.facInfo);
        },
        next() {
            this.$router.push(PATHS.fundAmount);
        }
    }
};
</script>
