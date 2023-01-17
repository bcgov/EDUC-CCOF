import alertMixin from '@/mixins/alertMixin';
import { ORGANIZATION_PROVIDER_TYPES } from '@/utils/constants';
import rules from '@/utils/rules';
import { mapActions, mapMutations, mapState } from 'vuex';

export default {
  mixins: [alertMixin],
  computed: {
    ...mapState('app', ['organizationTypeList', 'navBarList']),
    ...mapState('organization', ['isStarted', 'organizationId', 'organizationModel']),
    ...mapState('facility', ['facilityList']),
    ...mapState('auth', ['userInfo']),
    ...mapState('application', ['applicationStatus']),
    isLocked() {
      return (this.applicationStatus === 'SUBMITTED');
    }
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
    console.log('org mounted called');
    this.businessId = this.userInfo.userName;
  
    if (this.isStarted) {
      console.log('org mounted called2');
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
    ...mapActions('navBar', ['getNextPath', 'getPreviousPath']),
    ...mapMutations('organization', ['setIsStarted', 'setIsOrganizationComplete', 'setOrganizationModel']),
    isGroup() {
      return this.providerType === ORGANIZATION_PROVIDER_TYPES.GROUP;
    },
    async next() {
      let path = await this.getNextPath();
      this.$router.push(path);
    },
    async back() {
      let path = await this.getPreviousPath();
      this.$router.push(path);
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
