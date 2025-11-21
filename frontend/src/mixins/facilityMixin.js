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
import {
  FACILITY_HAS_RECEIVE_FUNDING_VALUES,
  ORGANIZATION_PROVIDER_TYPES,
  PATHS,
  changeUrl,
  changeUrlGuid,
  pcfUrl,
  pcfUrlGuid,
} from '@/utils/constants.js';
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
    ...mapState(useApplicationStore, [
      'applicationStatus',
      'isApplicationFormValidated',
      'isApplicationProcessing',
      'unlockBaseFunding',
      'programYearId',
      'showApplicationTemplateV1',
    ]),
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
    isGroup() {
      return this.organizationProviderType === ORGANIZATION_PROVIDER_TYPES.GROUP;
    },
    baseFundingId() {
      return this.isChangeRequest
        ? this.changeRequestMap
            ?.get(this.changeRequestId)
            ?.changeActions?.find((ca) => ca.changeActionId === this.changeActionId)
            ?.newFacilities?.find((fac) => fac.facilityId === this.facilityId).baseFunding?.ccofBaseFundingId
        : this.getNavByFacilityId(this.facilityId)?.ccofBaseFundingId;
    },
  },
  created() {
    this.rules = rules;
    this.FACILITY_HAS_RECEIVE_FUNDING_VALUES = FACILITY_HAS_RECEIVE_FUNDING_VALUES;
  },
  methods: {
    ...mapActions(useApplicationStore, ['setIsApplicationProcessing', 'validateApplicationForm']),
    ...mapActions(useFacilityStore, [
      'loadFacility',
      'saveFacility',
      'newFacility',
      'setFacilityModel',
      'addFacilityToStore',
    ]),
    ...mapActions(useOrganizationStore, ['loadOrganization']),
    ...mapActions(useNavBarStore, ['setNavBarFacilityComplete', 'forceNavBarRefresh', 'getNavByFacilityId']),
    resetFacilityAddress() {
      if (this.isApplicationProcessing) return;
      this.facilityModel.isFacilityAddressEnteredManually = null;
      this.facilityModel.facilityAddress = null;
      this.facilityModel.city = null;
      this.facilityModel.province = null;
      this.facilityModel.postalCode = null;
    },
    resetFacilityContact() {
      if (this.isApplicationProcessing) return;
      this.facilityModel.phone = null;
      this.facilityModel.email = null;
    },
    populateFacilityAddress() {
      const isFamilyApplicationTemplateVersion1 = !this.isGroup && this.showApplicationTemplateV1;
      if (!this.facilityModel.isFacilityAddressSameAsOrgStreetAddress && !isFamilyApplicationTemplateVersion1) {
        return;
      }
      this.facilityModel.facilityAddress = this.organizationModel?.address2;
      this.facilityModel.city = this.organizationModel?.city2;
      this.facilityModel.province = this.organizationModel?.province2;
      this.facilityModel.postalCode = this.organizationModel?.postalCode2?.replace(/\s/g, '').toUpperCase();
    },
    populateFacilityContact() {
      if (!this.facilityModel.isFacilityContactSameAsOrgContact) return;
      this.facilityModel.phone = this.organizationModel?.phone;
      this.facilityModel.email = this.organizationModel?.email;
    },
    async loadData() {
      try {
        this.setIsApplicationProcessing(true);
        const facilityId = this.$route.params.urlGuid;
        if (isEmpty(this.organizationModel)) {
          await this.loadOrganization(this.organizationId);
        }
        if (facilityId) {
          await this.loadFacility(facilityId);
        } else {
          this.newFacility();
        }
      } catch (error) {
        console.error(`Failed to get Facility data with error - ${error}`);
        this.setFailureAlert('An error occurred while loading facility. Please try again later.');
      } finally {
        this.setIsApplicationProcessing(false);
      }
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

      if (!this.baseFundingId) {
        console.error('Unable to find baseFundingId');
        return;
      }

      if (this.isChangeRequest) {
        this.$router.push(changeUrlGuid(PATHS.CCOF_GROUP_FUNDING, this.changeRequestId, this.baseFundingId));
      } else {
        this.$router.push(
          pcfUrlGuid(
            this.isGroup ? PATHS.CCOF_GROUP_FUNDING : PATHS.CCOF_FAMILY_FUNDING,
            this.programYearId,
            this.baseFundingId,
          ),
        );
      }
    },
    async save(isSave) {
      try {
        if (this.isLocked || this.isApplicationProcessing) return;
        this.setIsApplicationProcessing(true);
        this.populateFacilityAddress();
        this.populateFacilityContact();
        await this.saveFacility({
          isChangeRequest: isChangeRequest(this),
          changeRequestId: this.$route.params.changeRecGuid,
        });
        this.forceNavBarRefresh();
        if (isSave) {
          this.setSuccessAlert('Success! Facility information has been saved.');
        }
        if (!this.$route.params.urlGuid && isSave) {
          const routingPath = isChangeRequest(this)
            ? changeUrlGuid(PATHS.CCOF_GROUP_FACILITY, this.changeRequestId, this.facilityId)
            : pcfUrlGuid(
                this.isGroup ? PATHS.CCOF_GROUP_FACILITY : PATHS.CCOF_FAMILY_FACILITY,
                this.programYearId,
                this.facilityId,
              );
          this.$router.push(routingPath);
        }
        this.setNavBarFacilityComplete({
          facilityId: this.facilityId,
          complete: this.facilityModel.isFacilityComplete,
        });
      } catch (error) {
        console.error(error);
        this.setFailureAlert('An error occurred while saving. Please try again later.');
      } finally {
        this.setIsApplicationProcessing(false);
      }
    },
  },
};
