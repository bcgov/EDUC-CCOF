import alertMixin from '@/mixins/alertMixin';
import { ORGANIZATION_PROVIDER_TYPES, PATHS } from '@/utils/constants';
import rules from '@/utils/rules';
import { mapActions, mapMutations, mapState } from 'vuex';

export default {
  mixins: [alertMixin],
  computed: {
    ...mapState('app', ['organizationTypeList', 'navBarList']),
    ...mapState('organization', ['isStarted', 'organizationId', 'organizationModel']),
    ...mapState('facility', ['facilityList']),
    ...mapState('auth', ['userInfo']),
  },
  data() {
    return {
      rules,
      model: {},
      processing: false,
      loading: true,
      isValidForm: true,
      businessId: this.businessId,
      isLocked: true
    };
  },
  async mounted() {
    console.log('org mounted called');
    this.businessId = this.userInfo.userName;
    this.isLocked = !this.userInfo.unlockBaseFunding;

    if (this.isStarted) {
      console.log('org mounted called2');
      this.model = { ...this.organizationModel };
      return;
    }

    if (this.organizationId) {
      this.processing = true;
      try {
        await this.loadOrganization(this.organizationId);
        this.model = { ...this.organizationModel };
      } catch (error) {
        console.log('Error loading organization.', error);
        this.setFailureAlert('An error occurred while saving. Please try again later.');
      }
      this.processing = false;
      this.loading = false;
      this.setIsOrganizationComplete(this.isValidForm);
      this.setIsStarted(true);
    }
  },
  async beforeRouteLeave(_to, _from, next) {
    await this.save(false);
    next();
  },
  methods: {
    ...mapActions('organization', ['saveOrganization', 'loadOrganization']),
    ...mapMutations('organization', ['setIsStarted', 'setIsOrganizationComplete', 'setOrganizationModel']),
    isGroup() {
      return this.providerType === ORGANIZATION_PROVIDER_TYPES.GROUP;
    },
    next() {
      if (this.navBarList && this.navBarList.length > 0) {
        this.$router.push(`${this.isGroup() ? PATHS.group.facInfo : PATHS.family.eligibility}/${this.navBarList[0].facilityId}`);
      } else {
        this.$router.push(`${this.isGroup() ? PATHS.group.facInfo : PATHS.family.eligibility}`);
      }
    },
    async save(showNotification) {
      this.processing = true;
      this.setIsStarted(true);
      try {
        this.setIsOrganizationComplete(this.isValidForm);
        this.setOrganizationModel({ ...this.model, isOrganizationComplete: this.isValidForm });
        await this.saveOrganization();
        if (showNotification) {
          this.setSuccessAlert('Success! Organization information has been saved.');
        }
      } catch (error) {
        this.setFailureAlert('An error occurred while saving. Please try again later.');
      }
      this.processing = false;
    }
  }
};
