<template>
    <v-container>
        <h1>Organization Information</h1>

        <v-row justify="space-around">
            <v-card width="1200">
                <v-container>
                    <v-row>
                        <v-col>
                            <v-text-field label="Legal Name (first, middle and last) or Organization (as it appears in BC corporate Registry)"/>
                        </v-col>
                    </v-row>
    
                    <v-divider></v-divider>
    
                    <v-row>
                        <v-col>
                            <v-text-field label="Organization Mailing Address"></v-text-field>
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
    
                    <v-divider></v-divider>
    
                    <v-row>
                        <v-col>
                            <v-checkbox v-model="isAddressDifferent" label="Organization Street Address is different from mailing address"></v-checkbox>
                        </v-col>
                    </v-row>

                    <v-row v-show="isAddressDifferent">
                        <v-col>
                            <v-text-field label="Organization Mailing Address"></v-text-field>
                        </v-col>
                    </v-row>
    
                    <v-row v-show="isAddressDifferent">
                        <v-col>
                            <v-text-field label="City/Town"></v-text-field>
                        </v-col>
                        <v-col>
                            <v-text-field label="Postal Code"></v-text-field>
                        </v-col>
                    </v-row>
    
                    <v-divider></v-divider>
    
                    <v-row>
                        <v-col>
                            <v-text-field label="Organization Contact Name"></v-text-field>
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
                            <v-text-field label="Business BCeID"></v-text-field>
                        </v-col>
                    </v-row>
    
                    <v-divider></v-divider>
    
                    <v-row>
                        <v-col>
                            <v-text-field label="E-mail Address of Signing Authority" :rules="emailRules" required></v-text-field>
                        </v-col>
                        <v-col>
                            <v-text-field label="Incorporation Number (as it appears in BC Corporate Registry)">
                            </v-text-field>
                        </v-col>
                    </v-row>
    
                    <v-divider></v-divider>
    
                    <v-row>
                        <v-col>
                            <v-radio-group v-model="organizationType" label="Type of Orgnization">
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
  name: 'Organization Information',
  props: {
  },
  computed: {
  },
  data () {
    return {
      organizationType: undefined,
      isAddressDifferent: false,
      emailRules: [
        // v => /.+@.+/.test(v) || 'E-mail must be valid',
      ]
    };
  },
};
</script>
