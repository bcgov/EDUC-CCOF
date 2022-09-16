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
                outlined>
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
                                <span style="font-weight:600;color: #000;font-size:14px;font-family:Inter;">City: </span>{{ item.city }}</td>
                            </tr>
                          
                          
                            <!--span style="font-weight:bold;color:#336799">{{ item.name }}</span> <br> <span style="font-weight:bold">City: </span>{{ item.city }}-->
                          
                          
                          
                          
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
                :items="typeOfCareList"
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
            <v-menu v-model="menu2"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="auto">
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="date"
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
            </v-menu>
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
              <v-col cols="1" style="padding-bottom:0px;padding-top:16px;">
                <div style="align-content: center;">
                <v-card class="blue darken-3" style="border-radius: 50%; height: 30px; width: 30px;text-align: center;">
                  <v-icon color="white">mdi-help</v-icon>
                </v-card>
                </div>
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



            <v-row>
              <v-col cols="12" style="padding-top:0px;">
                <v-text-label style="padding-left:36px;color:#336799;font-style:normal;font-weight:600;font-family:Inter;font-size:16px"> 
                  Parent Fee Approved for {{form.careProviderSearch}}: $200
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
              <v-col cols="1" style="padding-top:16px;">
                <div style="align-content: center;">
                <v-card class="blue darken-3" style="border-radius: 50%; height: 30px; width: 30px;text-align: center;">
                  <v-icon color="white">mdi-help</v-icon>
                </v-card>
                </div>
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
                    v-model="form.totalNumDays4hrsOrLess"
                    :rules="rulesFullPartTime"
                    outlined
                    required
                    dense></v-text-field>
              </v-col>

              <v-col cols="2" style="padding-left:0px;text-align:right;padding-top:16px">
                <v-text-label style="padding-left:24px;color:#7B7C7E;font-family:Inter;font-weight:400;font-size:16px">
                  Over 4 hours
                </v-text-label>
              </v-col>
              <v-col cols="2" style="padding-left:0px;padding-top:16px;">
                <v-text-field style="width:124px"
                    v-model="form.totalNumBaysOver4hrs"
                    :rules="rulesFullPartTime"
                    outlined
                    required
                    dense></v-text-field>
              </v-col>
            </v-row>
        </div>

        <v-card-title class="grey lighten-3" style="color:#39598A;font-style:normal;font-weight:700;font-family:Inter;font-size:20px;padding-top:8px;padding-bottom:8px">Results</v-card-title>
        <v-row>
          <v-col cols="12" class="text-center">
            <v-btn style="color:#39598A;font-style:normal;font-weight:500;font-family:Inter;font-size:16px;padding-left:60px;padding-right:60px;"
              class="ma-2"
              outlined
              color="#003466"
              @click="$refs.form.validate()">
              Estimate the Benefit
            </v-btn>
          </v-col>
        </v-row>
        <!--v-row>
          <v-col>
            <v-text-label style="padding-left:24px;color:#7B7C7E;font-family:Inter;font-weight:400;font-size:16px">
              Based on the information you have provided, you may be eligible for the following Child Care Fee Reduction Initiative:
            </v-text-label>
          </v-col>
        </v-row-->

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

export default {
  name: 'FRICalculator',
  // components: {PrimaryButton},
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
          typeOfCare: 'GROUP CHILD CARE (UNDER 36 MONTHS)'
        },
        {
          name: 'ABC Family Daycare',
          city: 'Vancouver',
          typeOfCare: 'GROUP CHILD CARE (30 MONTHS TO SCHOOL AGE)'
        },
        {
          name: 'ABC Daycare',
          city: 'North Vancouver',
          typeOfCare: 'GROUP CHILD CARE (SCHOOL AGE)'
        },
        {
          name: 'XYZ Daycare',
          city: 'North Vancouver',
          typeOfCare: 'MULTI-AGE CHILD CARE'
        },
        {
          name: 'XYZ Tottler Care',
          city: 'Maple Ridge',
          typeOfCare: 'MULTI-AGE CHILD CARE - FAMILY'
        },
        {
          name: 'XYZ Child Daycare',
          city: 'Maple Ridge',
          typeOfCare: 'MULTI-AGE CHILD CARE - FAMILY'
        },
        {
          name: 'XYZ Family Daycare',
          city: 'Delta',
          typeOfCare: 'MULTI-AGE CHILD CARE - FAMILY'
        }
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
        'GROUP CHILD CARE (UNDER 36 MONTHS)',
        'GROUP CHILD CARE (30 MONTHS TO SCHOOL AGE)',
        'GROUP CHILD CARE (SCHOOL AGE)',
        'MULTI-AGE CHILD CARE',
        'MULTI-AGE CHILD CARE - FAMILY',
        'IN-HOME MULTI-AGE CHILD CARE',
        'FAMILY CHILD CARE',
        'PRESCHOOL',
        'GROUP CHILD CARE (SCHOOL AGE)'
      ],
      childAgeCategoryList: [
        '0-18 Months',
        '18 - 36 Months',
        '3 Years to Kindergarten',
        'Out of School Care - Kindergarten',
        'Preschool',
        'Out of School Care - Grade 1 +'
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
      email: '',
      emailRules: [
        (v) => !!v || 'E-mail is required',
        (v) => /.+@.+/.test(v) || 'E-mail must be valid',
      ],
      selectedRoles: [],
      isTotalNumberOfDaysInputted: ''
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
    totalNumberOfDaysInputted () {
      
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
