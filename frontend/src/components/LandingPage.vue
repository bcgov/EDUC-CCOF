<template>
  <v-container>
    <v-row v-for="organization in organizationList"
        {{ organization }}
    </v-row >
  </v-container>
</template>
<script>
// import PrimaryButton from '@/components/util/PrimaryButton';
import ApiService from "../common/apiService";
import alertMixin from "@/mixins/alertMixin";
import { ApiRoutes } from "@/utils/constants";
import { mapGetters, mapState } from "vuex";

export default {
  name: "FRICalculator",
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
        return ["district", "school"].includes(value);
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
      edxSchoolAdminRole: "EDX_SCHOOL_ADMIN",
      form: {
        firstName: "",
        lastName: "",
        email: "",
      },
      organizationList: [
        'Care 1',
        'Care 2',
        'Care 3'

      ],
      nameRules: [
        (v) => !!v || "Name is required",
        (v) => v.length <= 10 || "Name must be less than 10 characters",
      ],
      email: "",
      emailRules: [
        (v) => !!v || "E-mail is required",
        (v) => /.+@.+/.test(v) || "E-mail must be valid",
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
        case "xs":
        case "sm":
        case "md":
          return "2em";
        case "lg":
        case "xl":
        default:
          return "7em";
      }
    },
    getRoleLabel(curRole) {
      if (this.schoolRoles.length > 0) {
        return this.schoolRoles.find(
          (role) => role.edxRoleCode === curRole.edxRoleCode
        ).label;
      }
      return "";
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
          this.setSuccessAlert("User roles have been updated.");
        })
        .catch((error) => {
          this.setFailureAlert(
            "An error occurred while updating user roles. Please try again later."
          );
          console.log(error);
        })
        .finally(() => {
          this.$emit("refresh");
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
          this.setSuccessAlert("User has been removed.");
        })
        .catch((error) => {
          this.setFailureAlert(
            "An error occurred while removing a user. Please try again later."
          );
          console.log(error);
        })
        .finally(() => {
          this.$emit("refresh");
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
            "User has been removed, email sent with instructions to re-link."
          );
        })
        .catch((error) => {
          this.setFailureAlert(
            "An error occurred while re-linking a user. Please try again later."
          );
          console.log(error);
        })
        .finally(() => {
          this.$emit("refresh");
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
    ...mapState("edx", ["schoolRoles"]),
    ...mapGetters("auth", ["userInfo"]),
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
