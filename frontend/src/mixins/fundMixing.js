import { PATHS, ORGANIZATION_PROVIDER_TYPES } from '@/utils/constants';
import rules from '@/utils/rules';
import formatTime from '@/utils/formatTime';
import { mapActions, mapState, mapMutations } from 'vuex';
import alertMixin from '@/mixins/alertMixin';

export default {
  mixins: [alertMixin],
  computed: {
    ...mapState('funding', ['fundingModel']),
    ...mapState('organization', ['organizationProviderType']),
  },
  data() {
    return {
      processing: false,
      model: {},
      rules
    };
  },
  methods: {
    ...mapActions('funding', ['saveFunding', 'loadFunding', 'fundingId']),
    ...mapMutations('funding', ['setFundingModel', 'addModelToStore']),
    ...mapMutations('app', ['setNavBarFundingComplete']),
    isGroup() { 
      return this.providerType === ORGANIZATION_PROVIDER_TYPES.GROUP;
    },    
    previous() {
      let navBar = this.$store.getters['app/getNavByFundingId'](this.$route.params.urlGuid);
      this.$router.push(`${this.isGroup() ? PATHS.group.facInfo : PATHS.family.eligibility}/${navBar.facilityId}`);
    },
    next() {
      if (this.organizationProviderType == 'FAMILY') {
        this.$router.push(PATHS.group.licenseUpload);
      } else {
        let navBar = this.$store.getters['app/getNextNavByFundingId'](this.$route.params.urlGuid);
        if (navBar?.facilityId) {
          this.$router.push(PATHS.group.facInfo + '/' + navBar.facilityId);
        } else {
          this.$router.push(PATHS.group.confirmation);
        }
      }

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
      handler() {
        let ccofBaseFundingId = this.$route.params.urlGuid;
        if (ccofBaseFundingId) {
          this.loadFunding(ccofBaseFundingId);
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
