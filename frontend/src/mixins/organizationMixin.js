import { mapActions, mapState } from 'pinia';

import NavButton from '@/components/util/NavButton.vue';
import alertMixin from '@/mixins/alertMixin.js';
import { useAppStore } from '@/store/app.js';
import { useApplicationStore } from '@/store/application.js';
import { useAuthStore } from '@/store/auth.js';
import { useFacilityStore } from '@/store/ccof/facility.js';
import { useOrganizationStore } from '@/store/ccof/organization.js';
import { useNavBarStore } from '@/store/navBar.js';
import { ORGANIZATION_PROVIDER_TYPES, PROVINCES } from '@/utils/constants.js';
import rules from '@/utils/rules.js';

export default {
  components: { NavButton },
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
        this.model.province1 = this.model.province1 ?? PROVINCES.find((province) => province.value === 'BC')?.value;
        this.model.province2 = this.model.province2 ?? PROVINCES.find((province) => province.value === 'BC')?.value;
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
    isSameAddressChecked() {
      if (!this.model.isSameAsMailing) {
        this.model.address2 = '';
        this.model.city2 = '';
        this.model.postalCode2 = '';
        this.model.province2 = PROVINCES.find((province) => province.value === 'BC')?.value;
      }
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
