import { PATHS, ORGANIZATION_PROVIDER_TYPES, changeUrlGuid, pcfUrlGuid} from '@/utils/constants';
import { isChangeRequest } from '@/utils/common';
import rules from '@/utils/rules';
import { mapActions, mapState, mapMutations, mapGetters } from 'vuex';
import alertMixin from '@/mixins/alertMixin';
import {isEmpty} from 'lodash';
import NavButton from '@/components/util/NavButton';

export default {
  components: { NavButton },
  mixins: [alertMixin],
  computed: {
    ...mapState('facility', ['facilityModel', 'facilityId']),
    ...mapState('navBar', ['navBarList','changeRequestId']),
    ...mapState('auth', ['userInfo']),
    ...mapState('application', ['applicationStatus', 'unlockBaseFunding', 'programYearId']),
    ...mapState('reportChanges', ['userProfileChangeRequests']),
    ...mapState('organization', ['organizationModel', 'organizationId']),
    ...mapGetters('navBar', ['previousPath']),
    ...mapGetters('reportChanges',['isCCOFUnlocked','changeRequestStatus']),

    isLocked() {
      if (isChangeRequest(this)) {
        if(this?.isCCOFUnlocked||!this.changeRequestStatus){
          return false;
        }
        else if(this.changeRequestStatus!=='INCOMPLETE'){
          return true;
        }
        return false;
      }
      if (this.unlockBaseFunding) {
        return false;
      }
      return (this.applicationStatus === 'SUBMITTED');
    }
  },
  async beforeRouteLeave(_to, _from, next) {
    await this.save(false);
    next();
  },
  watch: {
    '$route.params.urlGuid': {
      async handler() {
        let facilityId = this.$route.params.urlGuid;
        if (facilityId) {
          await this.loadFacility(facilityId);
        } else {
          await this.newFacility();
        }

        this.loading = false;
      },
      immediate: true,
      deep: true
    },
    facilityModel: {
      handler() {
        this.model = { ...this.facilityModel };
        this.$refs.form?.resetValidation();
      },
      immediate: true,
      deep: true
    }
  },
  data() {
    return {
      rules,
      processing: false,
      loading: true,
      model: {},
    };
  },

  methods: {
    ...mapActions('facility', ['loadFacility', 'saveFacility', 'newFacility']),
    ...mapActions('organization', ['loadOrganization']),
    ...mapMutations('facility', ['setFacilityModel', 'addFacilityToStore']),
    ...mapMutations('navBar', ['setNavBarFacilityComplete']),
    isSameAddressChecked() {
      if (!this.model.isSameAsMailing) {
        this.model.address2 = '';
        this.model.city2 = '';
        this.model.postalCode2 = '';
      }
    },
    isGroup() {
      return this.providerType === ORGANIZATION_PROVIDER_TYPES.GROUP;
    },
    previous() {
      this.$router.push(this.previousPath);
    },
    async next() {
      // await this.save();
      if (!this.$route.params.urlGuid) { //we won't have the funding guid until we save, so save first.
        await this.save(false);
      }
      let navBar = this.$store.getters['navBar/getNavByFacilityId'](this.facilityId);
      console.log('navbar: ', navBar);
      if (navBar?.ccofBaseFundingId) {
        if (isChangeRequest(this)) {
          this.$router.push(changeUrlGuid(PATHS.CCOF_GROUP_FUNDING, this.changeRequestId, navBar.ccofBaseFundingId));
        } else {
          this.$router.push(pcfUrlGuid(this.isGroup() ? PATHS.CCOF_GROUP_FUNDING : PATHS.CCOF_FAMILY_FUNDING, this.programYearId, navBar.ccofBaseFundingId));
        }
      } else {
        console.log('error, should never get here');
      }
    },
    validateForm() {
      this.$refs.form?.validate();
    },
    async saveClicked() {
      await this.save(true);
    },
    async save(isSave) {
      if (this.isLocked) {
        return;
      }
      if (this.model.isSameAsMailing) {
        this.model.address2 = this.model.address1;
        this.model.city2 = this.model.city1;
        this.model.postalCode2 = this.model.postalCode1;
      }
      if (!this.isGroup()) {// For Family, we will need to set the postal code from organization.
        if (isEmpty(this.organizationModel)) {
          await this.loadOrganization(this.organizationId);
        }
        this.model.postalCode = this.organizationModel.postalCode1;
      }
      this.setFacilityModel({ ...this.model });
      this.processing = true;
      try {
        await this.saveFacility({ isChangeRequest: isChangeRequest(this), changeRequestId: this.$route.params.changeRecGuid });
        if (isSave) {
          this.setSuccessAlert(this.isGroup() ? 'Success! Facility information has been saved.' : 'Success! Eligibility information has been saved.');
        }
      } catch (error) {
        this.setFailureAlert('An error occurred while saving. Please try again later.');
      }
      if (!this.$route.params.urlGuid && isSave) {
        if (isChangeRequest(this)) {
          this.$router.push(changeUrlGuid(PATHS.CCOF_GROUP_FACILITY, this.changeRequestId, this.facilityId));
        } else {
          this.$router.push(pcfUrlGuid(PATHS.CCOF_GROUP_FACILITY, this.programYearId, this.facilityId));
        }
      }
      this.setNavBarFacilityComplete({ facilityId: this.facilityId, complete: this.model.isFacilityComplete });
      this.processing = false;
    },

  }
};
