import { PATHS, ORGANIZATION_PROVIDER_TYPES, CHANGE_URL_PREFIX} from '@/utils/constants';
import { isChangeRequest } from '@/utils/common';
import rules from '@/utils/rules';
import { mapActions, mapState, mapMutations, } from 'vuex';
import alertMixin from '@/mixins/alertMixin';
import {isEmpty} from 'lodash';
import NavButton from '@/components/util/NavButton';

export default {
  components: { NavButton },
  mixins: [alertMixin],
  computed: {
    ...mapState('facility', ['facilityModel', 'facilityId']),
    ...mapState('app', ['navBarList']),
    ...mapState('auth', ['userInfo']),
    ...mapState('application', ['applicationStatus', 'unlockBaseFunding']),
    ...mapState('reportChanges', ['changeRequestId']),
    ...mapState('organization', ['organizationModel', 'organizationId']),
    isLocked() {
      if (isChangeRequest(this)) {
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
    ...mapMutations('app', ['setNavBarFacilityComplete']),
    isGroup() {
      return this.providerType === ORGANIZATION_PROVIDER_TYPES.GROUP;
    },
    previous() {
      let navBar = this.$store.getters['app/getNextPrevByFacilityId'](this.$route.params.urlGuid);
      if (navBar?.ccofBaseFundingId) {
        this.$router.push(`${this.isGroup() ? PATHS.group.fundAmount : PATHS.family.fundAmount}/${navBar.ccofBaseFundingId}`);
      } else {
        this.$router.push(`${this.isGroup() ? PATHS.group.orgInfo : PATHS.family.orgInfo}`);
      }
    },
    async next() {
      // await this.save();
      if (!this.$route.params.urlGuid) { //we won't have the funding guid until we save, so save first.
        await this.save(false);
      }
      let navBar = this.$store.getters['app/getNavByFacilityId'](this.facilityId);
      console.log('navbar: ', navBar);
      if (navBar?.ccofBaseFundingId) {
        if (isChangeRequest(this)) {
          this.$router.push(`${CHANGE_URL_PREFIX}/${this.changeRequestId}/group/funding/${navBar.ccofBaseFundingId}`);
        }
        else {
          this.$router.push(`${this.isGroup() ? PATHS.group.fundAmount : PATHS.family.fundAmount}/${navBar.ccofBaseFundingId}`);
        } 
      } else {
        if (isChangeRequest(this)) {
          this.$router.push(`${CHANGE_URL_PREFIX}/${this.changeRequestId}/group/funding/`);
        } else {
          this.$router.push(`${this.isGroup() ? PATHS.group.fundAmount : PATHS.family.fundAmount}`);
        }
      }
    },
    validateForm() {
      this.$refs.form?.validate();
    },
    async saveClicked() {
      await this.save(true);
    },
    async save(isSave) {
      if (!this.isGroup()) {// For Family, we will need to set the postal code from organization.
        if (isEmpty(this.organizationModel)) {
          await this.loadOrganization(this.organizationId);
        }
        this.model.postalCode = this.organizationModel.postalCode1;
      }
      console.log('setting facility 123');
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
          this.$router.push(`${CHANGE_URL_PREFIX}/${this.changeRequestId}/facility/${this.facilityId}`);
        } else {
          this.$router.push(`${this.$route.path}/${this.facilityId}`);
        }
      }
      this.setNavBarFacilityComplete({ facilityId: this.facilityId, complete: this.model.isFacilityComplete });
      this.processing = false;
    },

  }
};
