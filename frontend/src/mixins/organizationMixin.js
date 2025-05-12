import { isEmpty } from 'lodash';
import { mapActions, mapState } from 'pinia';

import AppAddressForm from '@/components/guiComponents/AppAddressForm.vue';
import AppButton from '@/components/guiComponents/AppButton.vue';
import AppTooltip from '@/components/guiComponents/AppTooltip.vue';
import NavButton from '@/components/util/NavButton.vue';
import alertMixin from '@/mixins/alertMixin.js';
import ApplicationService from '@/services/applicationService';
import { useAppStore } from '@/store/app.js';
import { useApplicationStore } from '@/store/application.js';
import { useAuthStore } from '@/store/auth.js';
import { useFacilityStore } from '@/store/ccof/facility.js';
import { useOrganizationStore } from '@/store/ccof/organization.js';
import { useNavBarStore } from '@/store/navBar.js';
import { MAX_NUMBER_OF_PARTNERS, ORGANIZATION_TYPES } from '@/utils/constants.js';
import rules from '@/utils/rules.js';

export default {
  components: { AppAddressForm, AppButton, AppTooltip, NavButton },
  mixins: [alertMixin],
  data() {
    return {
      numberOfPartners: 2,
    };
  },
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
    isPartnership() {
      return this.organizationModel.organizationType === ORGANIZATION_TYPES.PARTNERSHIP;
    },
    isSoleProprietorship() {
      return this.organizationModel.organizationType === ORGANIZATION_TYPES.SOLE_PROPRIETORSHIP;
    },
    partnershipLegalOrganizationName() {
      const partnerNames = [];
      for (let i = 1; i <= this.MAX_NUMBER_OF_PARTNERS; i++) {
        const firstName = this.organizationModel[`partner${i}FirstName`] ?? '';
        const lastName = this.organizationModel[`partner${i}LastName`] ?? '';
        const fullName = `${firstName} ${lastName}`.trim();
        if (!isEmpty(fullName)) {
          partnerNames.push(fullName);
        }
      }
      return partnerNames.join('/');
    },
  },
  async created() {
    this.rules = rules;
    this.MAX_NUMBER_OF_PARTNERS = MAX_NUMBER_OF_PARTNERS;
    await this.loadData();
  },
  methods: {
    ...mapActions(useApplicationStore, ['setIsApplicationProcessing', 'validateApplicationForm']),
    ...mapActions(useOrganizationStore, [
      'loadOrganization',
      'saveOrganization',
      'setIsOrganizationComplete',
      'setIsStarted',
      'setOrganizationModel',
    ]),
    async loadData() {
      if (this.isStarted) {
        this.setIsApplicationProcessing(false);
        return;
      }
      if (!this.organizationId) return;
      try {
        this.setIsApplicationProcessing(true);
        await this.loadOrganization(this.organizationId);
        if (this.isPartnership) {
          this.numberOfPartners = Math.max(ApplicationService.getNumberOfPartners(this.organizationModel), 2);
        }
        this.setIsStarted(true);
      } catch (error) {
        console.log('Error loading organization.', error);
        this.setFailureAlert('An error occurred while loading organization. Please try again later.');
      } finally {
        this.setIsApplicationProcessing(false);
      }
    },
    // TODO (vietle-cgi) - review this function when working on Family Application changes
    validateIncorporationNumber(organizationTypeId, incorporationNumber) {
      const selectedOrgType = this.organizationTypeList.find((obj) => obj.id === organizationTypeId)?.name;
      if (!incorporationNumber) {
        if (selectedOrgType == 'Registered Company' || selectedOrgType == 'Non-Profit Society') {
          return rules.required;
        }
      }
      return [];
    },
    removePartner(index) {
      const max = this.MAX_NUMBER_OF_PARTNERS;

      // Shift data for all partners after the removed one
      for (let i = index; i < max; i++) {
        this.organizationModel[`partner${i}FirstName`] = this.organizationModel[`partner${i + 1}FirstName`] ?? null;
        this.organizationModel[`partner${i}MiddleName`] = this.organizationModel[`partner${i + 1}MiddleName`] ?? null;
        this.organizationModel[`partner${i}LastName`] = this.organizationModel[`partner${i + 1}LastName`] ?? null;
      }

      // Clear the last partner's data
      this.organizationModel[`partner${max}FirstName`] = null;
      this.organizationModel[`partner${max}MiddleName`] = null;
      this.organizationModel[`partner${max}LastName`] = null;

      this.numberOfPartners = Math.max(2, this.numberOfPartners - 1);
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
        this.organizationModel.legalName = this.isPartnership
          ? this.partnershipLegalOrganizationName
          : this.organizationModel.legalName;
        if (!this.isPartnership) {
          for (let i = 1; i <= this.MAX_NUMBER_OF_PARTNERS; i++) {
            this.organizationModel[`partner${i}FirstName`] = null;
            this.organizationModel[`partner${i}MiddleName`] = null;
            this.organizationModel[`partner${i}LastName`] = null;
          }
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
