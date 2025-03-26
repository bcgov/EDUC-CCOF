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
import { ORGANIZATION_TYPES } from '@/utils/constants.js';
import rules from '@/utils/rules.js';

export default {
  components: { AppAddressForm, AppTooltip, NavButton },
  mixins: [alertMixin],
  computed: {
    ...mapState(useAppStore, ['organizationTypeList', 'navBarList']),
    ...mapState(useOrganizationStore, ['isStarted', 'organizationId', 'organizationModel', 'organizationProviderType']),
    ...mapState(useFacilityStore, ['facilityList']),
    ...mapState(useAuthStore, ['userInfo']),
    ...mapState(useApplicationStore, [
      'applicationStatus',
      'isApplicationFormValidated',
      'isApplicationProcessing',
      'unlockBaseFunding',
      'showApplicationTemplateV1',
    ]),
    ...mapState(useNavBarStore, ['nextPath', 'previousPath']),
    isLocked() {
      if (this.unlockBaseFunding) {
        return false;
      }
      return this.applicationStatus === 'SUBMITTED';
    },
    hasIncorporationNumber() {
      return [ORGANIZATION_TYPES.NON_PROFIT_SOCIETY, ORGANIZATION_TYPES.REGISTERED_COMPANY].includes(
        this.organizationModel.organizationType,
      );
    },
    isSoleProprietorshipPartnership() {
      return this.organizationModel.organizationType === ORGANIZATION_TYPES.SOLE_PROPRIETORSHIP_PARTNERSHIP;
    },
  },
  async created() {
    this.rules = rules;
    if (this.isStarted) {
      this.setIsApplicationProcessing(false);
      return;
    }
    if (this.organizationId) {
      try {
        this.setIsApplicationProcessing(true);
        await this.loadOrganization(this.organizationId);
      } catch (error) {
        console.log('Error loading organization.', error);
        this.setFailureAlert('An error occurred while loading organization. Please try again later.');
      } finally {
        this.setIsApplicationProcessing(false);
      }
      this.setIsStarted(true);
    }
  },
  methods: {
    ...mapActions(useApplicationStore, ['setIsApplicationProcessing', 'validateApplicationForm']),
    ...mapActions(useOrganizationStore, [
      'saveOrganization',
      'loadOrganization',
      'setIsStarted',
      'setIsOrganizationComplete',
      'setOrganizationModel',
    ]),
    validateIncorporationNumber(organizationTypeId, incorporationNumber) {
      const selectedOrgType = this.organizationTypeList.find((obj) => obj.id === organizationTypeId)?.name;
      if (!incorporationNumber) {
        if (selectedOrgType == 'Registered Company' || selectedOrgType == 'Non-Profit Society') {
          return rules.required;
        }
      }
      return [];
    },

    updateMailingAddress(updatedModel) {
      if (isEmpty(updatedModel)) return;
      this.organizationModel.isOrgMailingAddressEnteredManually = updatedModel.manualEntry;
      this.organizationModel.address1 = updatedModel.address;
      this.organizationModel.city1 = updatedModel.city;
      this.organizationModel.province1 = updatedModel.province;
      this.organizationModel.postalCode1 = updatedModel.postalCode;
    },
    updateStreetAddress(updatedModel) {
      if (isEmpty(updatedModel)) return;
      this.organizationModel.isOrgStreetAddressEnteredManually = updatedModel.manualEntry;
      this.organizationModel.address2 = updatedModel.address;
      this.organizationModel.city2 = updatedModel.city;
      this.organizationModel.province2 = updatedModel.province;
      this.organizationModel.postalCode2 = updatedModel.postalCode;
    },
    resetStreetAddress() {
      if (this.isApplicationProcessing) return;
      this.organizationModel.address2 = null;
      this.organizationModel.city2 = null;
      this.organizationModel.province2 = null;
      this.organizationModel.postalCode2 = null;
    },
    next() {
      this.$router.push(this.nextPath);
    },
    back() {
      this.$router.push(this.previousPath);
    },
    async save(showNotification) {
      if (this.isLocked || this.isApplicationProcessing) return;
      try {
        this.setIsApplicationProcessing(true);
        this.setIsStarted(true);
        if (this.organizationModel.isSameAsMailing) {
          this.organizationModel.address2 = this.organizationModel.address1;
          this.organizationModel.city2 = this.organizationModel.city1;
          this.organizationModel.postalCode2 = this.organizationModel.postalCode1;
          this.organizationModel.province2 = this.organizationModel.province1;
        }
        this.setIsOrganizationComplete(this.organizationModel.isOrganizationComplete);
        await this.saveOrganization();
        if (showNotification) {
          this.setSuccessAlert('Success! Organization information has been saved.');
        }
      } catch {
        this.setFailureAlert('An error occurred while saving. Please try again later.');
      } finally {
        this.setIsApplicationProcessing(false);
      }
    },
  },
};
