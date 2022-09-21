<!-- TODO by priority for end of sprint/Sept 23rd:
       1) Stage UI to show iterative child cards interactlity based on the number provided for 'Total Number of Children'.
       2) Get sytles from Jennifer's wireframes and appy. Will consolidate styles into sass later (step 7).
       3) Add the content under 'Results'
       4) Populate drop list fields. Hard code for now. See Haung's emails.
       5) Ensure 'Estime the Benefit' button invokes basic field validations.
       6) Consolidate manual styles into resuable sass
       7) Establish all v-binds.
-->
<template>
  <v-container>
    <v-form ref="form">
    <v-row justify="center">
      <v-col cols="10">
        <v-card elevation="0">
          <template>
            <v-alert type="info">
              The estimation provided in this service is not guarantee of payments. The estimation does not take into account all of your circumstances and should be used as a guide only.
            </v-alert>
          </template>
        </v-card>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="10">
        <v-card elevation="4" class="pa-0" color="#D4EAFF" style="">
          <v-row>
            <v-col style="padding-top:0%;padding-bottom:0px;">
              <v-card-title style="color:#39598A;font-style:normal;font-weight:700;font-family:Inter;font-size:20px">Optional Facility Search:</v-card-title>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" style="padding-top:0%;padding-bottom:0px;">
              <v-text-label style="padding-left:24px;color:#39598A;font-style:normal;font-weight:500;font-family:Inter;font-size:16px">
                Search by city or name of a licensed child care provider
              </v-text-label>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="8" style="padding-left:34px;">
              <v-text-field
                background-color="white"
                dense
                hint="Type your keyword here"
                persistent-hint="true"
                v-model="form.careProviderSearch"
                v-on="on"
                outlined
              >
              </v-text-field>
            </v-col>
            <v-col>
              <v-dialog
                v-model="dialog"
                persistent
                max-width="800px"
                @click:outside="dialog = false">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn style="font-style:normal;font-weight:700;font-family:Inter;font-size:16px;padding-left:24px;padding-right:24px;"
                    color="#39598A"
                    dark
                    v-bind="attrs"
                    v-on="on"
                    @click="selectedRow = []">
                    Search
                  </v-btn>
                </template>
                <v-card>
                  <v-container style="padding-top:0px;">
                    <v-row>
                      <v-col cols="12" style="padding-bottom:42px;background-color:#234075;"></v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12" style="background-color:#FFC72C;padding:3px;"></v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12" style="padding-left:24px;">
                        <v-text-label style="color:#39598A;font-style:normal;font-weight:700;font-family:Inter;font-size:20px">
                          Search Facilities
                        </v-text-label>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12" style="padding-left:24px;padding-bottom:0px;">
                        <v-text-field
                          v-model="number"
                          v-on="on"
                          outlined
                          required
                          dense
                          append-outer-icon="mdi-magnify">
                        </v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12" style="padding-top:0px;">
                        <v-data-table
                          :headers="headers"
                          :items="facilities"
                          item-key="name"
                          :items-per-page="5"
                          hide-default-header
                          v-model="selectedRow"
                        >
                          <template v-slot:item="{ item }">
                            <tr :class="selectedRow.indexOf(item.name)>-1?'grey':''" @click="rowClicked(item);dialog=false">
                              <td style="padding-bottom:10px;padding-top:10px;">
                                <span style="font-weight:600;color:#336799;font-size:16px;font-family:Inter;">{{ item.name }}</span>
                                <br>
                                <span style="font-weight:600;color: #000;font-size:14px;font-family:Inter;">City: </span>{{ item.city }}
                              </td>
                              <td align="right">
                                <v-btn style="font-style:normal;font-weight:500;font-family:Inter;font-size:14px;padding-left:24px;padding-right:24px;"
                                  color="#39598A"
                                  dark
                                  v-bind="attrs"
                                  v-on="on"
                                  @click="rowClicked(item);dialog=false">
                                  Select
                                </v-btn>
                              </td>
                            </tr>
                          </template>
                        </v-data-table>
                      </v-col>
                    </v-row>
                  </v-container>

                </v-card>
              </v-dialog>
    
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col></v-col>
    </v-row>

    <v-row justify="center">
      <v-col cols="10">
      <v-card elevation="4" class="">
        <v-row>
          <v-col style="padding-top:0px;padding-bottom:0px;">
            <v-card-title class="grey lighten-3" style="color:#39598A;font-style:normal;font-weight:700;font-family:Inter;font-size:20px;padding-top:8px;padding-bottom:8px">Facility Details</v-card-title>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6" style="padding-bottom:0px;padding-top:16px;">
            <v-text-label style="padding-left:24px;padding-top:16px;color:#7B7C7E;font-family:Inter;font-weight:600;font-size:16px">
              <template><span class="red--text"><strong>&nbsp;*</strong></span></template>
              Type of Care
            </v-text-label>
          </v-col>
          <v-col cols="4" style="padding-bottom:0px;padding-top:16px;">
            <v-combobox
                v-model="form.typeOfCare"
                :items="this.typeOfCareList"
                outlined
                required
                :rules="rulesTypeOfCare"
                dense>
            </v-combobox>
          </v-col>
        </v-row>
        <v-row>
          <v-col style="padding-top:0px;padding-bottom:0px;">
            <v-divider></v-divider>
          </v-col>
        </v-row>
        
        <v-row>
          <v-col cols="6" style="padding-bottom:0px;padding-top:16px;">
            <v-text-label style="padding-left:24px;color:#7B7C7E;font-family:Inter;font-weight:600;font-size:16px">
              <template><span class="red--text"><strong> *</strong></span></template>
              Month
            </v-text-label>
          </v-col>
          <v-col cols="4" style="padding-bottom:0px;padding-top:16px;">
            <v-select
                v-model="form.month"
                :items="this.numberOfBusinessDaysByMonth"
                item-text="month"
                item-value="month"
                outlined
                required
                :rules="rulesMonth"
                dense>
            </v-select>

            
            <!--v-menu v-model="menu2"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="auto">
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="form.month"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                  outlined
                  required
                  :rules="rulesMonth"
                  dense>
                </v-text-field>
              </template>
              <v-date-picker
                v-model="form.month"
                @input="menu2 = false">
              </v-date-picker>
            </v-menu-->
          </v-col>
        </v-row>
        <v-row>
          <v-col style="padding-top:0px;padding-bottom:0px;">
            <v-divider></v-divider>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6" style="padding-bottom:0px;padding-top:16px;">
            <v-text-label style="padding-left:24px;color:#7B7C7E;font-family:Inter;font-weight:600;font-size:16px">
              <template><span class="red--text"><strong> *</strong></span></template>
              Total Number of Children
            </v-text-label>
          </v-col>
          <v-col cols="4" style="padding-bottom:0px;padding-top:16px;">
            <v-text-field @change="updateNumberOfChildSubForms"
              v-model="form.totalNumberOfChildren"
              outlined
              required
              :rules="rulesTotalNumChildren"
              dense>
            </v-text-field>
          </v-col>
        </v-row>
<!-- ******************************************************************************************************************************************************** -->
<!-- **** CHILD X SUB SECTION  ****************************************************************************************************************************** -->
<!-- ******************************************************************************************************************************************************** -->
        <div v-for="child in children">
          <v-card-title class="grey lighten-3" style="color:#39598A;font-style:normal;font-weight:700;font-family:Inter;font-size:20px;padding-top:8px;padding-bottom:8px">Child {{child.number}}</v-card-title>
            <v-row>
              <v-col cols="6" style="padding-top:16px;">
                <v-text-label style="padding-left:24px;color:#7B7C7E;font-family:Inter;font-weight:600;font-size:16px">
                  <template><span class="red--text"><strong> *</strong></span></template>
                  Child's age category
                </v-text-label>
              </v-col>
              <v-col cols="4" style="padding-top:16px;">
                <v-combobox
                    v-model="form.childAgeCategory"
                    :items="childAgeCategoryList"
                    outlined
                    dense
                    required
                    :rules="rulesChildsAgeCategory">
                </v-combobox>
              </v-col>
            </v-row>
            <v-row >
              <v-col style="padding-top:0px;padding-bottom:0px;">
                <v-divider></v-divider>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="5" style="padding-bottom:0px;padding-top:16px;">
                <v-text-label style="padding-left:24px;color:#7B7C7E;font-family:Inter;font-weight:600;font-size:16px">
                  <template><span class="red--text"><strong> *</strong></span></template>
                  Parent Fee
                </v-text-label>
              </v-col>
              <v-col cols="1" style="padding-bottom:0px;padding-top:16px;padding-left:40px">
                <v-card class="blue darken-3" style="border-radius: 50%; height: 30px; width: 30px;text-align: center;">
                  <v-icon color="white">mdi-help</v-icon>
                </v-card>
              </v-col>
              <v-col cols="4" style="padding-bottom:0px;padding-top:16px;">
                <v-text-field
                    v-model="form.parentFee"
                    :rules="rulesParentFee"
                    outlined
                    required
                    dense>
                </v-text-field>
              </v-col>
            </v-row>
            <v-row v-show="showParentFeeApprovedFor">
              <v-col cols="12" style="padding-top:0px;">
                <v-text-label style="padding-left:36px;color:#336799;font-style:normal;font-weight:600;font-family:Inter;font-size:16px"> 
                  Parent Fee Approved for {{form.careProviderSearch}}: ${{(results === undefined || results.length == 0) ? '' : results[child.number-1].actualParentFeePerChild}}
                </v-text-label>
              </v-col>
            </v-row>
            <v-row>
              <v-col style="padding-top:0px;padding-bottom:0px;">
                <v-divider></v-divider>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="5" style="padding-top:16px;">
                <v-text-label style="padding-left:24px;color:#7B7C7E;font-family:Inter;font-weight:600;font-size:16px">
                  <template><span class="red--text"><strong> *</strong></span></template>
                  Parent Fee Frequency
                </v-text-label>
              </v-col>
              <v-col cols="1" style="padding-bottom:0px;padding-top:16px;padding-left:40px">
                <v-card class="blue darken-3" style="border-radius: 50%; height: 30px; width: 30px;text-align: center;">
                  <v-icon color="white">mdi-help</v-icon>
                </v-card>
              </v-col>
              <v-col cols="4" style="padding-top:16px;">
                <v-combobox
                  v-model="form.parentFeeFrequency"
                  :items="parentFeeFrequencyList"
                  required
                  :rules="rulesParentFeeFrequency"
                  outlined
                  dense>
                </v-combobox>
              </v-col>
            </v-row>
            <v-row>
              <v-col style="padding-top:0px;padding-bottom:0px;">
                <v-divider></v-divider>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="4" style="padding-top:16px;">
                <v-text-label style="padding-left:24px;color:#7B7C7E;font-family:Inter;font-weight:600;font-size:16px">
                  <template><span class="red--text"><strong> *</strong></span></template>
                  Total number of days
                </v-text-label>
              </v-col>

              <v-col cols="2" style="text-align:right;padding-top:16px">
                <v-text-label style="padding-left:24px;color:#7B7C7E;font-family:Inter;font-weight:400;font-size:16px">
                  4 hours or less
                </v-text-label>
              </v-col>
              <v-col cols="2" style="padding-top:16px;">
                <v-text-field
                    @change="enableDisableTotalNumOfDays"
                    v-model="form.totalNumDays4hrsOrLess"
                    :rules="rulesPartTime"
                    required
                    outlined
                    dense></v-text-field>
              </v-col>

              <v-col cols="2" style="padding-left:0px;text-align:right;padding-top:16px">
                <v-text-label style="padding-left:24px;color:#7B7C7E;font-family:Inter;font-weight:400;font-size:16px">
                  Over 4 hours
                </v-text-label>
              </v-col>
              <v-col cols="2" style="padding-left:0px;padding-top:16px;">
                <v-text-field style="width:124px"
                    @change="enableDisableTotalNumOfDays"
                    v-model="form.totalNumBaysOver4hrs"
                    :rules="rulesFullTime"
                    required
                    outlined
                    dense></v-text-field>
              </v-col>
            </v-row>
        </div>

<!-- ******************************************************************************************************************************************************** -->
<!-- **** RESULTS SUB SECTION  ****************************************************************************************************************************** -->
<!-- ******************************************************************************************************************************************************** -->
        <v-card-title class="grey lighten-3" style="color:#39598A;font-style:normal;font-weight:700;font-family:Inter;font-size:20px;padding-top:8px;padding-bottom:8px">Results</v-card-title>
        <v-row>
          <v-col cols="12" class="text-center">
            <v-btn style="color:#39598A;font-style:normal;font-weight:500;font-family:Inter;font-size:16px;padding-left:60px;padding-right:60px;"
              class="ma-2"
              outlined
              color="#003466"
              @click="estimateTheBenefit">
              Estimate the Benefit
            </v-btn>
          </v-col>
        </v-row>
        <div v-show="showEstimatorResults">
        <v-row>
          <v-col cols="12">
            <v-text-label style="padding-left:24px;color:#7B7C7E;font-family:Inter;font-weight:500;font-size:16px">
              Based on the information you have provided, you may be eligible for the following Child Care Fee Reduction Initiative:
            </v-text-label>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="2" style="padding-bottom:0px">
            <v-text-label style="padding-left:24px;color:#7B7C7E;font-family:Inter;font-weight:600;font-size:16px">
              Child
            </v-text-label>
          </v-col>
          <v-col cols="4" style="padding-bottom:0px">
            <div class="d-flex flex-nowrap">
              <v-card class="blue darken-3" style="border-radius: 50%; height: 30px; width: 30px;text-align: center;">
                <v-icon color="white">mdi-help</v-icon>
              </v-card>
              <v-text-label style="padding-left:24px;color:#7B7C7E;font-family:Inter;font-weight:600;font-size:16px">
                Reduction Amount Per Child
              </v-text-label>
            </div>
          </v-col>
          <v-col cols="4" style="padding-bottom:0px">
            <div class="d-flex flex-nowrap">
              <v-card class="blue darken-3" style="border-radius: 50%; height: 30px; width: 30px;text-align: center;">
                <v-icon color="white">mdi-help</v-icon>
              </v-card>
              <v-text-label style="padding-left:24px;color:#7B7C7E;font-family:Inter;font-weight:600;font-size:16px">
                Actual Parent Fee Per Child
              </v-text-label>
            </div>
          </v-col>
        </v-row>




        <div v-for="result in results">
          
          <v-row>
          <v-col cols="12" >
            <v-divider></v-divider>
          </v-col>
          </v-row>


          <v-row>
          <v-col cols="2" style="padding-bottom:0px;padding-top:0px">
            <v-text-label style="padding-left:24px;font-family:Inter;font-weight:500;font-size:16px;">
            {{result.number}}
            </v-text-label>
          </v-col>



              <v-col cols="4" style="padding-bottom:0px;padding-top:0px">
                <div class="d-flex flex-nowrap">
            <v-text-label style="padding-left:54px;font-family:Inter;font-weight:500;font-size:16px;">
              ${{result.reductionAmountPerChild}}
            </v-text-label>
          </div>
          </v-col>
              <v-col cols="4" style="padding-bottom:0px;padding-top:0px">
            <v-text-label style="padding-left:54px;font-family:Inter;font-weight:500;font-size:16px">
              ${{result.actualParentFeePerChild}}
            </v-text-label>
          </v-col>
        </v-row>
      
        
        
        
        
        
        
        </div>


        <v-row>
          <v-col>
            
          </v-col>
        </v-row>        
      </div>












      </v-card>
      </v-col>
    </v-row>
    </v-form>
  </v-container>
</template>
<script>
// import PrimaryButton from '@/components/util/PrimaryButton';
import ApiService from '../common/apiService';
import alertMixin from '@/mixins/alertMixin';
import { ApiRoutes } from '@/utils/constants';
import { mapGetters, mapState } from 'vuex';
import { constants } from '@/utils/constants';
import { date } from 'faker/lib/locales/az';

export default {
  name: 'FRICalculator',
  components: //{PrimaryButton},
    constants,
  mixins: [alertMixin],
  props: {
    user: {
      type: Object,
      required: false,
    },
    userRoles: {
      type: Array,
      required: false,
    },
    mincode: {
      type: String,
      required: false,
    },
    type: {
      validator(value) {
        return ['district', 'school'].includes(value);
      },
      type: String,
      required: false,
    },
    children: {
      type: Array,
      required: false
    },
    results: {
      type: Array,
      required: false,
    },
    GROUP_REDUCTION_RATES: {
      type: Map,
      required: false,
    },
    FAMILY_REDUCTION_RATES: {
      type: Map,
      required: false,
    }
  },
  data() {
    return {
      dialog: false,
      editState: false,
      deleteState: false,
      relinkState: false,
      
      dialogSearch: '',
      headers: [
        {
          text: '',
          align: 'start',
          sortable: false,
          value: 'name',
        }
      ],
      facilities: [
        {
          name: 'ABC Vancouver',
          city: 'Vancouver',
          typeOfCare: '18 - 36 months',
          approvedParentFee: 200
        },
        {
          name: 'ABC Family Daycare',
          city: 'Vancouver',
          typeOfCare: '0 - 18 months',
          approvedParentFee: 275
        },
        {
          name: 'ABC Daycare',
          city: 'North Vancouver',
          typeOfCare: '18 - 36 months',
          approvedParentFee: 250
        },
        {
          name: 'XYZ Daycare',
          city: 'North Vancouver',
          typeOfCare: '3 years to Kindergarten',
          approvedParentFee: 175
        },
        {
          name: 'XYZ Tottler Care',
          city: 'Maple Ridge',
          typeOfCare: '3 years to Kindergarten',
          approvedParentFee: 300
        },
        {
          name: 'XYZ Child Daycare',
          city: 'Maple Ridge',
          typeOfCare: 'Before & After School (Kindergarten only)',
          approvedParentFee: 250
        },
        {
          name: 'XYZ Family Daycare',
          city: 'Delta',
          typeOfCare: 'Before & After School (Kindergarten only)',
          approvedParentFee: 200
        },
      ],
      numberOfBusinessDaysByMonth: [
        {month: 'January', days: 20},
        {month: 'February', days: 19},
        {month: 'March', days: 20},
        {month: 'April', days: 20},
        {month: 'May', days: 20},
        {month: 'June', days: 20},
        {month: 'July', days: 20},
        {month: 'August', days: 20},
        {month: 'September', days: 20},
        {month: 'October', days: 20},
        {month: 'November', days: 20},
        {month: 'December', days: 20},
      ],
      selectedRow: [],
      edxSchoolAdminRole: 'EDX_SCHOOL_ADMIN',
      form: {
        firstName: '',
        lastName: '',
        email: '',
        careProviderSearch: '',
        typeOfCare: '',
        month: '',
        totalNumberOfChildren: '1',
        childAgeCategory: '',
        parentFee: '',
        parentFeeApproved: '',
        parentFeeFrequency: '',
        totalNumDays4hrsOrLess: '',
        totalNumBaysOver4hrs: ''
      },
      parentFeeFrequencyList: [
        'Daily',
        'Weekly',
        'Monthly'
      ],
      typeOfCareList: [
        'Group',
        'Family'
      ],
      childAgeCategoryList: [
        '0 - 18 Months',
        '18 - 36 Months',
        '3 Years to Kindergarten',
        'Before & After School (Kindergarten only)',
      ],
      rulesTypeOfCare: [
        (v) => !!v || 'Type of Care is required'
      ],
      rulesTotalNumChildren: [
        (v) => !!v || 'Total Number of Children is required',
        (v) => v <= 12 || 'Total Number of Children must be less than 12'
      ],
      rulesMonth: [
        (v) => !!v || 'Month is required'
      ],
      rulesChildsAgeCategory: [
        (v) => !!v || 'Childs age category is required'
      ],
      rulesParentFee: [
        (v) => !!v || 'Parent Fee is required'
      ],
      rulesParentFeeFrequency: [
        (v) => !!v || 'Parent Fee Frequence is required'
      ],
      rulesFullPartTime: [
        (v) => !!v || '4 hours or less (Partime) or Over 4 hours (Fulltime) is required'
      ],
      rulesPartTime: [
        (v) => !!v || '4 hours or less (Partime) or Over 4 hours (Fulltime) is required'
      ],
      rulesFullTime: [
        (v) => !!v || '4 hours or less (Partime) or Over 4 hours (Fulltime) is required'
      ],
      email: '',
      emailRules: [
        (v) => !!v || 'E-mail is required',
        (v) => /.+@.+/.test(v) || 'E-mail must be valid',
      ],
      selectedRoles: [],
      showEstimatorResults: false,
      showParentFeeApprovedFor: false,
    };
  },
  methods: {
    roleDisabled(role) {
      if (role.edxRoleCode === this.edxSchoolAdminRole) {
        return false;
      }
      return this.isEDXSchoolAdminSelected;
    },
    selectedRolesChanged() {
      if (!this.isEDXSchoolAdminSelected) {
        return;
      }
      this.selectedRoles = [this.edxSchoolAdminRole];
    },
    getButtonWidth() {
      switch (this.$vuetify.breakpoint.name) {
      case 'xs':
      case 'sm':
      case 'md':
        return '2em';
      case 'lg':
      case 'xl':
      default:
        return '7em';
      }
    },
    getRoleLabel(curRole) {
      if (this.schoolRoles.length > 0) {
        return this.schoolRoles.find(
          (role) => role.edxRoleCode === curRole.edxRoleCode
        ).label;
      }
      return '';
    },
    clickEditButton() {
      this.relinkState = false;
      this.deleteState = false;
      this.editState = !this.editState;
      this.setUserRolesAsSelected();
    },
    clickDeleteButton() {
      this.editState = false;
      this.relinkState = false;
      this.deleteState = !this.deleteState;
    },
    clickRelinkButton() {
      this.editState = false;
      this.deleteState = false;
      this.relinkState = !this.relinkState;
    },
    clickSaveButton() {
      const payload = {
        params: {
          edxUserID: this.user.edxUserID,
          mincode: this.mincode,
          selectedRoles: this.selectedRoles,
        },
      };
      ApiService.apiAxios
        .post(ApiRoutes.edx.EXCHANGE_ACCESS_ROLES_URL, payload)
        .then(() => {
          this.setSuccessAlert('User roles have been updated.');
        })
        .catch((error) => {
          this.setFailureAlert(
            'An error occurred while updating user roles. Please try again later.'
          );
          console.log(error);
        })
        .finally(() => {
          this.$emit('refresh');
        });
    },
    clickRemoveButton(userToRemove) {
      let userSchool = userToRemove.edxUserSchools.find(
        (school) => school.mincode === this.mincode
      );
      const payload = {
        params: {
          userToRemove: userToRemove.edxUserID,
          mincode: this.mincode,
          userSchoolID: userSchool.edxUserSchoolID,
        },
      };
      ApiService.apiAxios
        .post(ApiRoutes.edx.EXCHANGE_REMOVE_USER, payload)
        .then(() => {
          this.setSuccessAlert('User has been removed.');
        })
        .catch((error) => {
          this.setFailureAlert(
            'An error occurred while removing a user. Please try again later.'
          );
          console.log(error);
        })
        .finally(() => {
          this.$emit('refresh');
        });
    },
    clickActionRelinkButton(userToRelink) {
      let userSchool = userToRelink.edxUserSchools.find(
        (school) => school.mincode === this.mincode
      );
      const payload = {
        params: {
          userToRelink: userToRelink.edxUserID,
          mincode: this.mincode,
          userSchoolID: userSchool.edxUserSchoolID,
        },
      };
      ApiService.apiAxios
        .post(ApiRoutes.edx.EXCHANGE_RELINK_USER, payload)
        .then(() => {
          this.setSuccessAlert(
            'User has been removed, email sent with instructions to re-link.'
          );
        })
        .catch((error) => {
          this.setFailureAlert(
            'An error occurred while re-linking a user. Please try again later.'
          );
          console.log(error);
        })
        .finally(() => {
          this.$emit('refresh');
        });
    },
    setUserRolesAsSelected() {
      let mySelection = [];

      //look through all our roles. If user has this role, then mark the index
      this.schoolRoles.forEach((role) => {
        let result = this.userRoles.find(
          (userRole) => userRole.edxRoleCode === role.edxRoleCode
        );

        if (result) {
          mySelection.push(role.edxRoleCode);
        }
      });

      this.selectedRoles = [...mySelection];
    },
    isNotSameEdxUser() {
      return false;
    },

    rowClicked(row) {
      this.toggleSelection(row.name);
      console.log(row);
      this.form.careProviderSearch = row.name;
      this.form.typeOfCare = row.typeOfCare;
    },
    toggleSelection(keyID) {
      if (this.selectedRow.includes(keyID)) {
        this.selectedRow = this.selectedRow.filter(
          selectedKeyID => selectedKeyID !== keyID
        );
      } else {
        this.selectedRow.push(keyID);
      }
    },
    updateNumberOfChildSubForms() {
      let children = [];
      for (let i = 1; i <= this.form.totalNumberOfChildren; i++) {
        children.push({number: i, parentFee: '', parentFeeApproved: ''});
      }
      this.children = children;
    },
    estimateTheBenefit() {
      if (this.$refs.form.validate() == true) {
        this.showEstimatorResults = true;
        this.results = [];
          let rateTableInfo = [];

          // Get the rate table info based on the provided type of child care and childs age category...
          if (this.form.typeOfCare === 'Group') {
            rateTableInfo = this.GROUP_REDUCTION_RATES.get(this.form.childAgeCategory);
          } else if (this.form.typeOfCare === 'Family') {
            rateTableInfo = this.FAMILY_REDUCTION_RATES.get(this.form.childAgeCategory);
          }

          // Get the number of business days for the provide month...
          const result = this.numberOfBusinessDaysByMonth.find(c => c.month === this.form.month);
          var numberOfDaysForMonth = result.days;

          // Determine daily rate before fee reduction based on frequency of fee...
          var dailyRate;
          switch (this.form.parentFeeFrequency) {
            case 'Daily':
              dailyRate = this.form.parentFee;
              break;
            case 'Weekly':
              dailyRate = this.form.parentFee / 7;
              break;
            case 'Monthly':
              dailyRate = this.form.parentFee / numberOfDaysForMonth;
              break;
          }

          // Determine the daily rates for partTime and fulltime based on the number of days in month...
          let partTimeRateFromTable;
          let fullTimeRateFromTable;
          if (numberOfDaysForMonth == 19) {
            partTimeRateFromTable =  rateTableInfo[0].partTime19;
            fullTimeRateFromTable = rateTableInfo[0].fullTime19;
          } else if (numberOfDaysForMonth == 20) {
            partTimeRateFromTable =  rateTableInfo[0].partTime20;
            fullTimeRateFromTable = rateTableInfo[0].fullTime20;
          }

          // Determine the parttime daily rate and parttime total...
          let partTimeTotal;
          let partTimeDailyRate;
          if (this.form.totalNumDays4hrsOrLess) {
            partTimeDailyRate = ((dailyRate - 5) > partTimeRateFromTable) ? partTimeRateFromTable : (dailyRate - 5);
            partTimeTotal = partTimeDailyRate * this.form.totalNumDays4hrsOrLess;
          } else {
            partTimeTotal = 0;
          }

          // Determine the fulltime daily rate and fulltime total...
          let fullTimeTotal;
          let fullTimeDailyRate;
          if (this.form.totalNumBaysOver4hrs) {
            fullTimeDailyRate = ((dailyRate - 10) > fullTimeRateFromTable) ? fullTimeRateFromTable : (dailyRate - 10);
            fullTimeTotal = fullTimeDailyRate * this.form.totalNumBaysOver4hrs;
          } else {
            fullTimeTotal = 0;
          }

          // Determine full and part time total...
          var totalPartAndFullTime = partTimeTotal+fullTimeTotal;

          // Determine the reduction amount per child...
          let reductionAmountPerChild = ( totalPartAndFullTime > rateTableInfo[0].monthlyRate ? rateTableInfo[0].monthlyRate : totalPartAndFullTime);

          let actualParentFeePerChild;
          if (this.form.parentFeeFrequency == 'Daily') {
            actualParentFeePerChild = (this.form.parentFee * (this.form.totalNumDays4hrsOrLess+this.form.totalNumBaysOver4hrs)) - reductionAmountPerChild;
          } else if (this.form.parentFeeFrequency == 'Weekly') {              
            actualParentFeePerChild = (this.form.parentFee * 4) - reductionAmountPerChild;
          } else if (this.form.parentFeeFrequency == 'Monthly') {
            actualParentFeePerChild = this.form.parentFee - reductionAmountPerChild;
          }

          // Update the results
          this.results.push({number: 1, reductionAmountPerChild: reductionAmountPerChild, actualParentFeePerChild: actualParentFeePerChild})
      }
    },
    // TODO... AWFUL there must be a better way to handle "a or b is mandatory" and turning related validation messaging on and off.
    enableDisableTotalNumOfDays() {
      if ((this.form.totalNumDays4hrsOrLess && this.form.totalNumDays4hrsOrLess != 0) || (this.form.totalNumBaysOver4hrs && this.form.totalNumBaysOver4hrs != 0)) {
        this.rulesFullTime = [];
        this.rulesPartTime = [];
        return true;
      } else if ((this.form.totalNumDays4hrsOrLess == 0) && (this.form.totalNumBaysOver4hrs == 0)) {
        this.rulesPartTime = this.rulesFullPartTime;
        this.rulesFullTime = this.rulesFullPartTime;
        return false;
      }
    }
  },
  computed: {
    ...mapState('edx', ['schoolRoles']),
    ...mapGetters('auth', ['userInfo']),
    isEDXSchoolAdminSelected() {
      return this.selectedRoles.includes(this.edxSchoolAdminRole);
    },
    minimumRolesSelected() {
      return this.selectedRoles.length > 0;
    },
  },
  mounted() {
    if (this.children === undefined || children.lenth == 0) {
      let children = [];
       children.push({number: 1, parentFee: '', parentFeeApproved: ''});
      this.children = children;
    }
    
    // inital results
    this.results = [];

    // TODO: move to constants and import as properties... once i figure it out.
    this.GROUP_REDUCTION_RATES = new Map();
    this.GROUP_REDUCTION_RATES.set('0 - 18 Months', [{monthlyRate: 900, fullTime19: 47.3684, fullTime20: 45.0000, partTime19: 23.6842, partTime20: 22.5000}]);
    this.GROUP_REDUCTION_RATES.set('18 - 36 Months', [{monthlyRate: 900, fullTime19: 47.3684, fullTime20: 45.0000, partTime19: 23.6842, partTime20: 22.5000}]);
    this.GROUP_REDUCTION_RATES.set('3 Years to Kindergarten', [{monthlyRate: 545, fullTime19: 28.6842, fullTime20: 27.2500, partTime19: 14.3421, partTime20: 13.6250}]);
    this.GROUP_REDUCTION_RATES.set('Before & After School (Kindergarten Only)', [{monthlyRate: 320, fullTime19: 16.8421, fullTime20: 16.0000, partTime19: 8.4211, partTime20: 8.0000}]);

    this.FAMILY_REDUCTION_RATES = new Map();
    this.FAMILY_REDUCTION_RATES.set('0 - 18 Months', [{monthlyRate: 600, fullTime19: 31.5789, fullTime20: 30.0000, partTime19: 15.7895, partTime20: 15.5000}]);
    this.FAMILY_REDUCTION_RATES.set('18 - 36 Months', [{monthlyRate: 600, fullTime19: 31.5789, fullTime20: 30.0000, partTime19: 15.7895, partTime20: 15.5000}]);
    this.FAMILY_REDUCTION_RATES.set('3 Years to Kindergarten', [{monthlyRate: 500, fullTime19: 26.3158, fullTime20: 25.0000, partTime19: 13.1579, partTime20: 12.5000}]);
    this.FAMILY_REDUCTION_RATES.set('Before & After School (Kindergarten Only)', [{monthlyRate: 320, fullTime19: 16.8421, fullTime20: 16.0000, partTime19: 8.4211, partTime20: 8.0000}]);

  }
};
</script>

<style scoped>
.bounce-enter-active {
  animation: bounce-in 0.2s;
}
.bounce-leave-active {
  animation: bounce-in 0.1s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}


</style>
