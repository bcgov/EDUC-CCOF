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
      isValidForm: true,
      businessId: this.businessId
    };
  },
  async mounted() {
    this.businessId = this.userInfo.userName;

    if (this.isStarted) {
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
      this.setIsOrganizationComplete(this.isValidForm);
      this.setIsStarted(true);
    }
  },
  async beforeRouteLeave(_to, _from, next) {
    this.setIsOrganizationComplete(this.isValidForm);
    this.setIsStarted(true);
    this.setOrganizationModel(this.model);
    this.processing = true;
    await this.saveOrganization();
    this.processing = false;
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
    async save() {
      this.processing = true;
      try {
        this.setIsOrganizationComplete(this.isValidForm);
        this.setOrganizationModel({ ...this.model, providerType: this.providerType, isOrganizationComplete: this.isValidForm });
        await this.saveOrganization();
        this.setSuccessAlert('Success! Organization information has been saved.');
      } catch (error) {
        this.setFailureAlert('An error occurred while saving. Please try again later.');
      }
      this.processing = false;
    }
  }
};
