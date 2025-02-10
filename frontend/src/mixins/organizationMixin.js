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
import { ORGANIZATION_PROVIDER_TYPES, ORGANIZATION_TYPES } from '@/utils/constants.js';
import rules from '@/utils/rules.js';

export default {
  components: { AppAddressForm, AppTooltip, NavButton },
  mixins: [alertMixin],
  computed: {
    ...mapState(useAppStore, ['organizationTypeList', 'navBarList']),
    ...mapState(useOrganizationStore, ['isStarted', 'organizationId', 'organizationModel', 'organizationProviderType']),
    ...mapState(useFacilityStore, ['facilityList']),
    ...mapState(useAuthStore, ['userInfo']),
    ...mapState(useApplicationStore, ['applicationStatus', 'unlockBaseFunding']),
    ...mapState(useNavBarStore, ['nextPath', 'previousPath']),
    isLocked() {
      if (this.unlockBaseFunding) {
        return false;
      }
      return this.applicationStatus === 'SUBMITTED';
    },
    hasIncorporationNumber() {
      return [ORGANIZATION_TYPES.NON_PROFIT_SOCIETY, ORGANIZATION_TYPES.REGISTERED_COMPANY].includes(
        this.model.organizationType,
      );
    },
    isSoleProprietorshipPartnership() {
      return this.model.organizationType === ORGANIZATION_TYPES.SOLE_PROPRIETORSHIP_PARTNERSHIP;
    },
  },
  data() {
    return {
      rules,
      model: {},
      processing: false,
      loading: false,
      isValidForm: true,
      businessId: this.businessId,
    };
  },
  async mounted() {
    this.businessId = this.userInfo.userName;

    if (this.isStarted) {
      this.model = { ...this.organizationModel };
      this.processing = false;
      this.loading = false;
      return;
    }

    if (this.organizationId) {
      this.loading = true;
      try {
        await this.loadOrganization(this.organizationId);
        this.model = { ...this.organizationModel };
      } catch (error) {
        console.log('Error loading organization.', error);
        this.setFailureAlert('An error occurred while saving. Please try again later.');
      }
      this.processing = false;
      this.loading = false;
      // this.setIsOrganizationComplete(this.isValidForm);
      this.setIsStarted(true);
    }
  },
  methods: {
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
      this.model.address1 = updatedModel.address;
      this.model.city1 = updatedModel.city;
      this.model.province1 = updatedModel.province;
      this.model.postalCode1 = updatedModel.postalCode;
    },
    updateStreetAddress(updatedModel) {
      if (isEmpty(updatedModel)) return;
      this.model.address2 = updatedModel.address;
      this.model.city2 = updatedModel.city;
      this.model.province2 = updatedModel.province;
      this.model.postalCode2 = updatedModel.postalCode;
    },
    resetStreetAddress() {
      if (this.loading) return;
      this.model.address2 = null;
      this.model.city2 = null;
      this.model.province2 = null;
      this.model.postalCode2 = null;
    },

    isGroup() {
      return this.organizationProviderType === ORGANIZATION_PROVIDER_TYPES.GROUP;
    },
    validateForm() {
      this.$refs.form?.validate();
    },
    next() {
      this.$router.push(this.nextPath);
    },
    back() {
      this.$router.push(this.previousPath);
    },
    async save(showNotification) {
      if (this.isLocked) {
        return;
      }
      if (this.model.isSameAsMailing) {
        this.model.address2 = this.model.address1;
        this.model.city2 = this.model.city1;
        this.model.postalCode2 = this.model.postalCode1;
        this.model.province2 = this.model.province1;
      }
      this.processing = true;
      this.setIsStarted(true);
      try {
        this.setIsOrganizationComplete(this.isValidForm);
        this.setOrganizationModel({ ...this.model, isOrganizationComplete: this.isValidForm });
        await this.saveOrganization();
        if (showNotification) {
          this.setSuccessAlert('Success! Organization information has been saved.');
        }
      } catch {
        this.setFailureAlert('An error occurred while saving. Please try again later.');
      }
      this.processing = false;
    },
  },
};
