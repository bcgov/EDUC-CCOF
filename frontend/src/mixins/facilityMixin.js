import { isEmpty } from 'lodash';
import { mapActions, mapState } from 'pinia';

import AppAddressForm from '@/components/guiComponents/AppAddressForm.vue';
import AppTooltip from '@/components/guiComponents/AppTooltip.vue';
import NavButton from '@/components/util/NavButton.vue';
import alertMixin from '@/mixins/alertMixin.js';
import { useAppStore } from '@/store/app.js';
import { useApplicationStore } from '@/store/application.js';
import { useAuthStore } from '@/store/auth.js';
import { useFacilityStore } from '@/store/ccof/facility.js';
import { useOrganizationStore } from '@/store/ccof/organization.js';
import { useNavBarStore } from '@/store/navBar.js';
import { useReportChangesStore } from '@/store/reportChanges.js';
import { isChangeRequest } from '@/utils/common.js';
import { ORGANIZATION_PROVIDER_TYPES, PATHS, changeUrl, changeUrlGuid, pcfUrl, pcfUrlGuid } from '@/utils/constants.js';
import rules from '@/utils/rules.js';

export default {
  components: { AppAddressForm, AppTooltip, NavButton },
  mixins: [alertMixin],
  computed: {
    ...mapState(useAppStore, ['healthAuthorities']),
    ...mapState(useFacilityStore, ['facilityModel', 'facilityId']),
    ...mapState(useNavBarStore, ['navBarList', 'changeRequestId', 'previousPath', 'isChangeRequest']),
    ...mapState(useAuthStore, ['userInfo']),
    ...mapState(useReportChangesStore, [
      'changeRequestMap',
      'changeRequestId',
      'changeActionId',
      'isCCOFUnlocked',
      'changeRequestStatus',
    ]),
    ...mapState(useApplicationStore, ['applicationStatus', 'unlockBaseFunding', 'programYearId']),
    ...mapState(useOrganizationStore, ['organizationModel', 'organizationId', 'organizationProviderType']),
    isLocked() {
      if (isChangeRequest(this)) {
        if (this?.isCCOFUnlocked || !this.changeRequestStatus) {
          return false;
        } else if (this.changeRequestStatus !== 'INCOMPLETE') {
          return true;
        }
        return false;
      }
      if (this.unlockBaseFunding) {
        return false;
      }
      return this.applicationStatus === 'SUBMITTED';
    },
    isModelEmpty() {
      return !Object.values(this.model)?.some((item) => item);
    },
    isGroup() {
      return this.organizationProviderType === ORGANIZATION_PROVIDER_TYPES.GROUP;
    },
  },
  async beforeRouteLeave(_to, _from, next) {
    if (!this.isModelEmpty) {
      await this.save(false);
    }
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
      deep: true,
    },
    facilityModel: {
      handler() {
        this.model = { ...this.facilityModel };
        this.$refs.form?.resetValidation();
      },
      immediate: true,
      deep: true,
    },
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
    ...mapActions(useFacilityStore, [
      'loadFacility',
      'saveFacility',
      'newFacility',
      'setFacilityModel',
      'addFacilityToStore',
    ]),
    ...mapActions(useOrganizationStore, ['loadOrganization']),
    ...mapActions(useNavBarStore, ['setNavBarFacilityComplete', 'forceNavBarRefresh']),
    resetFacilityAddress() {
      if (this.loading) return;
      this.model.isFacilityAddressEnteredManually = null;
      this.model.facilityAddress = null;
      this.model.city = null;
      this.model.province = null;
      this.model.postalCode = null;
    },
    resetFacilityContact() {
      if (this.loading) return;
      this.model.contactName = null;
      this.model.position = null;
      this.model.phone = null;
      this.model.email = null;
    },
    populateFacilityAddress() {
      if (!this.isGroup) {
        // FAMILY application
        // TODO (vietle-cgi) - confirm with the business when the Family application is updated.
        this.model.postalCode = this.organizationModel?.postalCode1;
        this.model.province = this.organizationModel?.province1;
      } else if (this.model.isFacilityAddressSameAsOrgStreetAddress) {
        // GROUP application
        this.model.facilityAddress = this.organizationModel?.address2;
        this.model.city = this.organizationModel?.city2;
        this.model.province = this.organizationModel?.province2;
        this.model.postalCode = this.organizationModel?.postalCode2?.replace(/\s/g, '').toUpperCase();
      }
    },
    populateFacilityContact() {
      if (!this.model.isFacilityContactSameAsOrgContact) return;
      this.model.contactName = this.organizationModel?.contactName;
      this.model.position = this.organizationModel?.position;
      this.model.phone = this.organizationModel?.phone;
      this.model.email = this.organizationModel?.email;
    },
    previous() {
      const defaultPath = isChangeRequest(this) ? PATHS.ROOT.CHANGE_LANDING : PATHS.ROOT.HOME;
      // in both PCF & CR, when we add a new facility using Add Facility page (select Yes), the new blank facility is not added to NavBar => previousPath = undefined
      if (!this.previousPath) {
        if (this.$route.name === 'Facility Information' && this.$route.params.urlGuid == null) {
          this.$router.push(pcfUrl(PATHS.CCOF_GROUP_CONFIRM, this.programYearId));
        } else if (
          this.$route.name === 'existing-change-request-facility-information' &&
          this.$route.params.urlGuid == null
        ) {
          this.$router.push(changeUrl(PATHS.CCOF_GROUP_CONFIRM, this.changeRequestId));
        } else {
          this.$router.push(defaultPath);
        }
      } else {
        this.$router.push(this.previousPath);
      }
    },
    async next() {
      if (!this.$route.params.urlGuid) {
        //we won't have the funding guid until we save, so save first.
        await this.save(false);
      }

      let baseFundingId;
      if (this.isChangeRequest) {
        baseFundingId = this.changeRequestMap
          ?.get(this.changeRequestId)
          ?.changeActions?.find((ca) => ca.changeActionId == this.changeActionId)
          ?.newFacilities.find((fac) => fac.facilityId == this.facilityId).baseFunding?.ccofBaseFundingId;
      } else {
        const navBarStore = useNavBarStore();
        baseFundingId = navBarStore.getNavByFacilityId(this.facilityId).ccofBaseFundingId;
      }

      if (baseFundingId) {
        if (this.isChangeRequest) {
          this.$router.push(changeUrlGuid(PATHS.CCOF_GROUP_FUNDING, this.changeRequestId, baseFundingId));
        } else {
          this.$router.push(
            pcfUrlGuid(
              this.isGroup ? PATHS.CCOF_GROUP_FUNDING : PATHS.CCOF_FAMILY_FUNDING,
              this.programYearId,
              baseFundingId,
            ),
          );
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
      try {
        if (this.isLocked) {
          return;
        }
        this.processing = true;
        if (isEmpty(this.organizationModel)) {
          await this.loadOrganization(this.organizationId);
        }
        this.populateFacilityAddress();
        this.populateFacilityContact();
        this.setFacilityModel({ ...this.model });
        await this.saveFacility({
          isChangeRequest: isChangeRequest(this),
          changeRequestId: this.$route.params.changeRecGuid,
        });
        //this.refreshNavBarList();
        this.forceNavBarRefresh();
        if (isSave) {
          this.setSuccessAlert(
            this.isGroup
              ? 'Success! Facility information has been saved.'
              : 'Success! Eligibility information has been saved.',
          );
        }
        if (!this.$route.params.urlGuid && isSave) {
          if (isChangeRequest(this)) {
            this.$router.push(changeUrlGuid(PATHS.CCOF_GROUP_FACILITY, this.changeRequestId, this.facilityId));
          } else {
            this.$router.push(pcfUrlGuid(PATHS.CCOF_GROUP_FACILITY, this.programYearId, this.facilityId));
          }
        }
        this.setNavBarFacilityComplete({ facilityId: this.facilityId, complete: this.model.isFacilityComplete });
      } catch (error) {
        console.error(error);
        this.setFailureAlert('An error occurred while saving. Please try again later.');
      } finally {
        this.processing = false;
      }
    },
  },
};
