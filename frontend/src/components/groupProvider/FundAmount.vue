<template>
    <v-container>
        <h1>Information to Determine Funding amounts</h1>

        <v-row justify="space-around">
            <v-card width="1200">
                <v-container>
                    <v-row>
                        <v-col>
                            <v-text-field outlined label="Maximum number of days per week you provide child care" />
                        </v-col>
                        <v-col>
                            <v-text-field outlined label="Maximum of weeks per year you provide child care" />
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-col>
                            <v-radio-group row v-model="hasClosedMonth"
                                label="Are there months when ALL of the programs at this facility are closed for the entire month?">
                                <v-radio label="Yes" value="yes" />
                                <v-radio label="No" value="no" />
                            </v-radio-group>
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-col>
                            <v-text-field outlined label="Facility hours of operation from" />
                        </v-col>
                        <v-col>
                            <v-text-field outlined label="Facility hours of operation to" />
                        </v-col>
                    </v-row>
                </v-container>
            </v-card>

            <v-card width="1200" style="margin-top:20px">
                <v-card-subtitle>Complete the licence information using your Community Care and Assisted Living Act
                    Licence.</v-card-subtitle>

                <v-container>
                    <v-row>
                        <v-col>
                            <v-text-field outlined label="Maximum Licensed Capacity" />
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-col>
                            <v-text-field outlined label="Maximum Number for Group Child Care (under 36 months)" />
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-col>
                            <v-text-field outlined
                                label="Maximum Number for Group Child Care (36 months to School Age)" />
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-col>
                            <v-text-field outlined label="Maximum Number for Preschool" />
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-col>
                            <v-text-field outlined
                                label="Maximum Number for Group Child Care (School Age/ School age care on School Grounds)" />
                        </v-col>
                    </v-row>
                </v-container>
            </v-card>

            <v-card width="1200" style="margin-top:20px">
                <v-card-title>Preschool</v-card-title>
                <v-card-subtitle>Please indicate how many preschool sessions your facility offers per day
                </v-card-subtitle>

                <v-container>
                    <v-row>
                        <v-col>
                            <v-text-field outlined label="Monday" />
                        </v-col>
                        <v-col>
                            <v-text-field outlined label="Tuesday" />
                        </v-col>
                        <v-col>
                            <v-text-field outlined label="Wednesday" />
                        </v-col>
                        <v-col>
                            <v-text-field outlined label="Thursday" />
                        </v-col>
                        <v-col>
                            <v-text-field outlined label="Friday" />
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-col>
                            <v-radio-group row v-model="isSchoolProperty"
                                label="Is the facility located on school property?">
                                <v-radio label="Yes" value="yes" />
                                <v-radio label="No" value="no" />
                            </v-radio-group>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card>

            <v-card width="1200" style="margin-top:20px">
                <v-card-subtitle>Do you <b>regularly offer</b> extended daily hours of child care <b>(before 6 am, after
                        7pm or overnight)</b>?</v-card-subtitle>
                <v-container>
                    <v-row>
                        <v-col>
                            <v-radio-group row v-model="isExtendedHours">
                                <v-radio label="Yes" value="yes" />
                                <v-radio label="No" value="no" />
                            </v-radio-group>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card>

            <v-card width="1200" style="margin-top:20px">
                <v-card-subtitle>Write the maximum <b>number of spaces</b> you offer extended hours of child care for
                    each type of service</v-card-subtitle>
                <v-container>
                    <v-row>
                        <v-col>
                            <v-card-subtitle><b>4 hours or less</b> extended child care</v-card-subtitle>
                        </v-col>
                        <v-col>
                            <v-card-subtitle><b>More than 4</b> extended child care</v-card-subtitle>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <v-text-field outlined label="Group Child Care (under 36 months)" />
                        </v-col>
                        <v-col>
                            <v-text-field outlined label="Group Child Care (under 36 months)" />
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-col>
                            <v-text-field outlined label="Group Child Care (36 months to School Age)" />
                        </v-col>
                        <v-col>
                            <v-text-field outlined label="Group Child Care (36 months to School Age)" />
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-col>
                            <v-text-field outlined
                                label="Group Child Care (School Age/ School age care on School Grounds)" />
                        </v-col>
                        <v-col>
                            <v-text-field outlined
                                label="Group Child Care (School Age/ School age care on School Grounds)" />
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-col>
                            <v-text-field outlined label="Multi-Age Care" />
                        </v-col>
                        <v-col>
                            <v-text-field outlined label="Multi-Age Care" />
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

import PATHS from './paths';

export default {
    props: {
    },
    computed: {
    },
    data() {
        return {
            hasReceivedFunding: undefined,
            isExtendedHours: undefined,
            hasClosedMonth: undefined,
            isSchoolProperty: undefined
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
