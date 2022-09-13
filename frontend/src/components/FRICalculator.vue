<!-- TODO by priority for phase 2/Sept 23rd:
       1) Get sytles from Jennifer's wireframes and appy. Will consolidate styles into css later (step 7).
       2) Update 'Optional Facility Search' card-title to one field as recently decided. The field will 'type-a-head' lookup
          and open a staged pop-up search results (as updated wireframe illustrates).
       3) Populate drop list fields. Hard code for now.
       4) Stage UI to show iterative child cards interactlity based on the number provided for 'Total Number of Children'.
       5) Ensure 'Download the Results' button invokes basic field validations.
       6) Add the content under 'Results' 
       7) Consolidate manual styles into resuable ccs
-->
<template>
  <v-container>
    <v-row>
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

    <v-row>
      <v-col cols="10">
        <v-card elevation="4" class="pa-0" color="#D4EAFF" style="">
          <v-row>
            <v-col style="padding-top:0%;padding-bottom:0px;">
              <v-card-title style="color:darkblue">Optional Facility Search:</v-card-title>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="2" style="padding-bottom:0px;">
              <v-text-label style="padding-left:24px;color:darkblue">
                Name
              </v-text-label>
            </v-col>
            <v-col cols="8" style="padding-bottom:0px;">
              <v-text-field
                background-color="white"
                dense
                v-model="number"
                v-on="on"
                outlined
                required>
              </v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="2">
              <v-text-label style="padding-left:24px;color:darkblue">
                City
              </v-text-label>
            </v-col>
            <v-col cols="8">
              <v-text-field
                background-color="white"
                dense
                v-model="number"
                v-on="on"
                outlined
                required>
              </v-text-field>
            </v-col>
            <v-col cols="2">
              <v-btn
                depressed
                color="primary">Search</v-btn>
            </v-col>
        </v-row>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col></v-col>
    </v-row>

    <v-row>
      <v-col cols="10">
      <v-card elevation="4" class="">
        <v-row>
          <v-col style="padding-top:0px;padding-bottom:0px;">
            <v-card-title class="grey lighten-3" style="color:darkblue;">Facility Details</v-card-title>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6" style="padding-bottom:0px;">
            <v-text-label style="padding-left:24px;">
              <template><span class="red--text"><strong>&nbsp;*</strong></span></template>
              Type of Care
            </v-text-label>
          </v-col>
          <v-col cols="4" style="padding-bottom:0px;">
            <v-combobox
                v-model="select"
                :items="typeOfCareList"
                outlined
                required
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
          <v-col cols="6" style="padding-bottom:0px;">
            <v-text-label style="padding-left:24px">
              <template><span class="red--text"><strong> *</strong></span></template>
              Month
            </v-text-label>
          </v-col>
          <v-col cols="4" style="padding-bottom:0px;">
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
                  dense>
                </v-text-field>
              </template>
              <v-date-picker
                v-model="date"
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
          <v-col cols="6" style="padding-bottom:0px;">
            <v-text-label style="padding-left:24px;">
              <template><span class="red--text"><strong> *</strong></span></template>
              Total Number of Children
            </v-text-label>
          </v-col>
          <v-col cols="4" style="padding-bottom:0px;">
            <v-text-field
              v-model="number"
              v-on="on"
              outlined
              required
              dense>
            </v-text-field>
          </v-col>
        </v-row>

        <v-card-title class="grey lighten-3" style="color:darkblue;">Child 1</v-card-title>
        <v-row>
          <v-col cols="6">
            <v-text-label style="padding-left:24px;">
              <template><span class="red--text"><strong> *</strong></span></template>
              Child's age category
            </v-text-label>
          </v-col>
          <v-col cols="4">
            <v-combobox
                v-model="select"
                :items="typeOfCareList"
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
          <v-col cols="5">
            <v-text-label style="padding-left:24px;">
              <template><span class="red--text"><strong> *</strong></span></template>
              Parent Fee
            </v-text-label>
          </v-col>
          <v-col cols="1">
            <div style="align-content: center;">
            <v-card class="blue darken-3" style="border-radius: 50%; height: 30px; width: 30px;text-align: center;">
              <v-icon color="white">mdi-help</v-icon>
            </v-card>
            </div>
          </v-col>
          <v-col cols="4">
            <v-text-field
                v-model="form.lastName"
                :rules="nameRules"
                outlined
                required
                dense>
            </v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col style="padding-top:0px;padding-bottom:0px;">
            <v-divider></v-divider>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="5">
            <v-text-label style="padding-left:24px;">
              <template><span class="red--text"><strong> *</strong></span></template>
              Parent Fee Frequency
            </v-text-label>
          </v-col>
          <v-col cols="1">
            <div style="align-content: center;">
            <v-card class="blue darken-3" style="border-radius: 50%; height: 30px; width: 30px;text-align: center;">
              <v-icon color="white">mdi-help</v-icon>
            </v-card>
            </div>
          </v-col>
          <v-col cols="4">
            <v-text-field
                v-model="form.lastName"
                :rules="nameRules"
                outlined
                required
                dense></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col style="padding-top:0px;padding-bottom:0px;">
            <v-divider></v-divider>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="4">
            <v-text-label style="padding-left:24px;">
              <template><span class="red--text"><strong> *</strong></span></template>
              Total number of days
            </v-text-label>
          </v-col>

          <v-col cols="2" style="text-align:right;">
            <v-text-label>
              4 hours or less
            </v-text-label>
          </v-col>
          <v-col cols="1" sm="">
            <v-text-field
                v-model="form.lastName"
                :rules="nameRules"
                outlined
                required
                dense></v-text-field>
          </v-col>

          <v-col cols="2" style="padding-left:0px;text-align:right;">
            <v-text-label>
              Over 4 hours
            </v-text-label>
          </v-col>
          <v-col cols="2" style="padding-left:0px;">
            <v-text-field style="width:124px"
                v-model="form.lastName"
                :rules="nameRules"
                outlined
                required
                dense></v-text-field>
          </v-col>
        </v-row>

        <v-card-title class="grey lighten-3" style="color:darkblue;">Results</v-card-title>
        <v-row>
          <v-col cols="12" class="text-center">
            <v-btn
              class="ma-2"
              outlined
              color="indigo">
              Estimate the Benefit
            </v-btn>
          </v-col>
        </v-row>


      </v-card>
      </v-col>
    </v-row>
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
  },
  data() {
    return {
      editState: false,
      deleteState: false,
      relinkState: false,
      edxSchoolAdminRole: 'EDX_SCHOOL_ADMIN',
      form: {
        firstName: '',
        lastName: '',
        email: '',
      },
      typeOfCareList: [
        'Care 1',
        'Care 2',
        'Care 3'

      ],
      nameRules: [
        (v) => !!v || 'Name is required',
        (v) => v.length <= 10 || 'Name must be less than 10 characters',
      ],
      email: '',
      emailRules: [
        (v) => !!v || 'E-mail is required',
        (v) => /.+@.+/.test(v) || 'E-mail must be valid',
      ],
      selectedRoles: [],
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
