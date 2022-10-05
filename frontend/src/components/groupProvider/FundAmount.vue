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

                        <v-row v-show="hasClosedMonth === 'yes'">
                            <v-col>
                                <label class="required">If YES, check all the applicable months:</label>
                            </v-col>
                        </v-row>

                        <v-row v-show="hasClosedMonth === 'yes'">
                            <v-col>
                                <v-text-field type="number" outlined required
                                    :rules="hasClosedMonth === 'yes' ? rules.required : []" class="required"
                                    v-model.number="month01" label="Jan" />
                            </v-col>
                            <v-col>
                                <v-text-field type="number" outlined required
                                    :rules="hasClosedMonth === 'yes' ? rules.required : []" class="required"
                                    v-model.number="month02" label="Feb" />
                            </v-col>
                            <v-col>
                                <v-text-field type="number" outlined required
                                    :rules="hasClosedMonth === 'yes' ? rules.required : []" class="required"
                                    v-model.number="month03" label="Mar" />
                            </v-col>
                            <v-col>
                                <v-text-field type="number" outlined required
                                    :rules="hasClosedMonth === 'yes' ? rules.required : []" class="required"
                                    v-model.number="month04" label="Apr" />
                            </v-col>
                            <v-col>
                                <v-text-field type="number" outlined required
                                    :rules="hasClosedMonth === 'yes' ? rules.required : []" class="required"
                                    v-model.number="month05" label="May" />
                            </v-col>
                            <v-col>
                                <v-text-field type="number" outlined required
                                    :rules="hasClosedMonth === 'yes' ? rules.required : []" class="required"
                                    v-model.number="month06" label="June" />
                            </v-col>
                        </v-row>

                        <v-row v-show="hasClosedMonth === 'yes'">
                            <v-col>
                                <v-text-field type="number" outlined required
                                    :rules="hasClosedMonth === 'yes' ? rules.required : []" class="required"
                                    v-model.number="month07" label="Jul" />
                            </v-col>
                            <v-col>
                                <v-text-field type="number" outlined required
                                    :rules="hasClosedMonth === 'yes' ? rules.required : []" class="required"
                                    v-model.number="month08" label="Aug" />
                            </v-col>
                            <v-col>
                                <v-text-field type="number" outlined required
                                    :rules="hasClosedMonth === 'yes' ? rules.required : []" class="required"
                                    v-model.number="month09" label="Sep" />
                            </v-col>
                            <v-col>
                                <v-text-field type="number" outlined required
                                    :rules="hasClosedMonth === 'yes' ? rules.required : []" class="required"
                                    v-model.number="month10" label="Oct" />
                            </v-col>
                            <v-col>
                                <v-text-field type="number" outlined required
                                    :rules="hasClosedMonth === 'yes' ? rules.required : []" class="required"
                                    v-model.number="month11" label="Nov" />
                            </v-col>
                            <v-col>
                                <v-text-field type="number" outlined required
                                    :rules="hasClosedMonth === 'yes' ? rules.required : []" class="required"
                                    v-model.number="month12" label="Dec" />
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col cols="12" md="6">
                                <v-menu ref="menu1" v-model="menu1" :close-on-content-click="false" :nudge-right="40"
                                    :return-value.sync="hoursFrom" transition="scale-transition" offset-y
                                    max-width="290px" min-width="290px">
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-text-field outlined required class="required" :rules="rules.required"
                                            v-model="hoursFrom" label="Facility hours of operation From" readonly
                                            v-bind="attrs" v-on="on">
                                        </v-text-field>
                                    </template>
                                    <v-time-picker v-if="menu1" v-model="hoursFrom" full-width
                                        @click:minute="$refs.menu1.save(hoursFrom)"></v-time-picker>
                                </v-menu>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-menu ref="menu2" v-model="menu2" :close-on-content-click="false" :nudge-right="40"
                                    :return-value.sync="hoursTo" transition="scale-transition" offset-y
                                    max-width="290px" min-width="290px">
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-text-field outlined required class="required" :rules="rules.required"
                                            v-model="hoursTo" label="Facility hours of operation To" readonly
                                            v-bind="attrs" v-on="on">
                                        </v-text-field>
                                    </template>
                                    <v-time-picker v-if="menu2" v-model="hoursTo" full-width
                                        @click:minute="$refs.menu2.save(hoursTo)"></v-time-picker>
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

                    <v-container>
                        <v-row>
                            <v-col>
                                <label>Please indicate how many preschool sessions your facility offers per day</label>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col>
                                <v-text-field type="number" outlined required :rules="rules.required" class="required"
                                    v-model.number="monday" label="Monday" />
                            </v-col>
                            <v-col>
                                <v-text-field type="number" outlined required :rules="rules.required" class="required"
                                    v-model.number="tusday" label="Tuesday" />
                            </v-col>
                            <v-col>
                                <v-text-field type="number" outlined required :rules="rules.required" class="required"
                                    v-model.number="wednesday" label="Wednesday" />
                            </v-col>
                            <v-col>
                                <v-text-field type="number" outlined required :rules="rules.required" class="required"
                                    v-model.number="thursday" label="Thursday" />
                            </v-col>
                            <v-col>
                                <v-text-field type="number" outlined required :rules="rules.required" class="required"
                                    v-model.number="friday" label="Friday" />
                            </v-col>
                            <v-col>
                                <v-text-field type="number" outlined readonly
                                    v-bind:value="(monday || 0) + (tusday || 0) + (wednesday || 0) + (thursday || 0) + (friday || 0)"
                                    label="Total" />
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

                    <v-card-title v-show="isSchoolProperty === 'yes'">Group Child Care (School Age Care on School
                        Grounds)</v-card-title>

                    <v-container v-show="isSchoolProperty === 'yes'">
                        <v-row>
                            <v-col>
                                <label>Please indicate each service that your facility offers</label>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col>
                                <v-checkbox v-model="beforeSchool" label="Before School" />
                            </v-col>
                            <v-col>
                                <v-checkbox v-model="afterSchool" label="After School" />
                            </v-col>
                            <v-col>
                                <v-checkbox v-model="beforeKindergarten" label="Before Kindergarten" />
                            </v-col>
                            <v-col>
                                <v-checkbox v-model="afterKindergarten" label="After Kindergarten" />
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

                        <v-row v-show="isExtendedHours === 'yes'">
                            <v-col>
                                <v-text-field type="number" outlined required
                                    :rules="isExtendedHours === 'yes' ? rules.required : []" class="required"
                                    v-model.number="maxDaysPerWeekExtended"
                                    label="Maximum number of days per week you offer extended hours of child care?" />
                            </v-col>
                        </v-row>

                        <v-row v-show="isExtendedHours === 'yes'">
                            <v-col>
                                <v-text-field type="number" outlined required
                                    :rules="isExtendedHours === 'yes' ? rules.required : []" class="required"
                                    v-model.number="maxDaysPerYearExtended"
                                    label="Maximum number of weeks per year you offer extended hours of child care?" />
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
                                <v-text-field outlined required :rules="rules.required" class="required" type="number"
                                    v-model="groupChildCare4less" label="Group Child Care (under 36 months)" />
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field outlined required :rules="rules.required" class="required" type="number"
                                    v-model="groupChildCare4more" label="Group Child Care (under 36 months)" />
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col cols="12" md="6">
                                <v-text-field outlined required :rules="rules.required" class="required" type="number"
                                    v-model="groupChildCare36School4less"
                                    label="Group Child Care (36 months to School Age)" />
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field outlined required :rules="rules.required" class="required" type="number"
                                    v-model="groupChildCare36School4more"
                                    label="Group Child Care (36 months to School Age)" />
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col cols="12" md="6">
                                <v-text-field outlined required :rules="rules.required" class="required" type="number"
                                    v-model="groupChildCareSchoolAge4less"
                                    label="Group Child Care (School Age/ School age care on School Grounds)" />
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field outlined required :rules="rules.required" class="required" type="number"
                                    v-model="groupChildCareSchoolAge4more"
                                    label="Group Child Care (School Age/ School age care on School Grounds)" />
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col cols="12" md="6">
                                <v-text-field outlined required :rules="rules.required" class="required" type="number"
                                    v-model="multiAgeCare4less" label="Multi-Age Care" />
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field outlined required :rules="rules.required" class="required" type="number"
                                    v-model="multiAgeCare4more" label="Multi-Age Care" />
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card>
            </v-row>

            <v-row justify="space-around">
                <v-btn color="info" outlined x-large>
                    Back</v-btn>
                <v-btn color="secondary" outlined x-large :disabled="!isValidForm">Next</v-btn>
                <v-btn color="primary" outlined x-large>
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
            maxDaysPerWeek: undefined,
            maxDaysPerYear: undefined,
            maxDaysPerWeekExtended: undefined,
            maxDaysPerYearExtended: undefined,
            hasClosedMonth: undefined,
            menu1: undefined,
            hoursFrom: undefined,
            menu2: undefined,
            hoursTo: undefined,
            maxLicensesCapacity: undefined,
            maxGroupChildCare: undefined,
            maxGroupChildCare36: undefined,
            maxPreschool: undefined,
            maxGroupChildCareSchool: undefined,
            monday: undefined,
            tusday: undefined,
            wednesday: undefined,
            thursday: undefined,
            friday: undefined,
            isSchoolProperty: undefined,
            isExtendedHours: undefined,
            groupChildCare4less: undefined,
            groupChildCare4more: undefined,
            groupChildCare36School4less: undefined,
            groupChildCare36School4more: undefined,
            groupChildCareSchoolAge4less: undefined,
            groupChildCareSchoolAge4more: undefined,
            multiAgeCare4less: undefined,
            multiAgeCare4more: undefined,
            month01: undefined,
            month02: undefined,
            month03: undefined,
            month04: undefined,
            month05: undefined,
            month06: undefined,
            month07: undefined,
            month08: undefined,
            month09: undefined,
            month10: undefined,
            month11: undefined,
            month12: undefined,
            beforeSchool: undefined,
            afterSchool: undefined,
            beforeKindergarten: undefined,
            afterKindergarten: undefined,
            rules
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
