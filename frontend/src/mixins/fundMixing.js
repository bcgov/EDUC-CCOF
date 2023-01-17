import { ORGANIZATION_PROVIDER_TYPES } from '@/utils/constants';
import rules from '@/utils/rules';
import formatTime from '@/utils/formatTime';
import { mapActions, mapState, mapMutations } from 'vuex';
import alertMixin from '@/mixins/alertMixin';

export default {
  mixins: [alertMixin],
  computed: {
    ...mapState('funding', ['fundingModel']),
    ...mapState('organization', ['organizationProviderType']),
    ...mapState('auth', ['userInfo']),
    ...mapState('application', ['unlockBaseFunding']),
    isLocked() {
      if (this.unlockBaseFunding) {
        return false;
      }
      return (this.applicationStatus === 'SUBMITTED');
    }
  },
  data() {
    return {
      processing: false,
      loading: false,
      model: {},
      rules,
    };
  },
  methods: {
    ...mapActions('funding', ['saveFunding', 'loadFunding', 'fundingId']),
    ...mapActions('navBar', ['getNextPath', 'getPreviousPath']),
    ...mapMutations('funding', ['setFundingModel', 'addModelToStore']),
    ...mapMutations('app', ['setNavBarFundingComplete']),
    isGroup() { 
      return this.providerType === ORGANIZATION_PROVIDER_TYPES.GROUP;
    },    
    async previous() {
      let previousPath = await this.getPreviousPath();
      this.$router.push(previousPath);
    },
    async next() {
      let nextPath = await this.getNextPath();
      console.log('next path: ', nextPath);
      this.$router.push(nextPath);
    },
    async save(isSave) {
      this.processing = true;
      this.setFundingModel({ ...this.model});
      this.addModelToStore({ fundingId: this.$route.params.urlGuid, model: this.model });
      this.setNavBarFundingComplete({ fundingId: this.$route.params.urlGuid, complete: this.model.isCCOFComplete });
      try {
        await this.saveFunding();
        if (isSave) {
          this.setSuccessAlert('Success! Funding information has been saved.');
        }
      } catch (error) {
        this.setFailureAlert('An error occurred while saving. Please try again later.');
      }
      this.processing = false;
    },
    allowedStep: m => m % 5 === 0,
    formatTime
  },
  async beforeRouteLeave(_to, _from, next) {
    await this.save(false);
    next();
  },
  watch: {
    '$route.params.urlGuid': {
      async handler() {
        let ccofBaseFundingId = this.$route.params.urlGuid;
        if (ccofBaseFundingId) {
          await this.loadFunding(ccofBaseFundingId);
          this.loading = false;
        }
      },
      immediate: true,
      deep: true
    },
    fundingModel: {
      handler() {
        this.model = { ...this.fundingModel };
        this.$refs.form?.resetValidation();
      },
      immediate: true,
      deep: true
    }
  }
};
