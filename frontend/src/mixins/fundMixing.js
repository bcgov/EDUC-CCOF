import { PATHS } from '@/utils/constants';
import rules from '@/utils/rules';
import formatTime from '@/utils/formatTime';
import { mapActions, mapState, mapMutations } from 'vuex';
import alertMixin from '@/mixins/alertMixin';

export default {
  mixins: [alertMixin],
  computed: {
    ...mapState('funding', ['fundingModel']),
    ...mapState('organization', ['organizationProviderType'])
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
    
    previous() {
      let navBar = this.$store.getters['app/getNavByFundingId'](this.$route.params.urlGuid);
      this.$router.push(PATHS.group.facInfo + '/' + navBar.facilityId);
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
    async save() {
      this.processing = true;
      this.setFundingModel(this.model);

      try {
        await this.saveFunding();
        this.setSuccessAlert('Success! Funding information has been saved.');
      } catch (error) {
        this.setFailureAlert('An error occurred while saving. Please try again later.');
      }
      this.processing = false;
    },
    allowedStep: m => m % 5 === 0,
    formatTime
  },
  beforeRouteLeave(_to, _from, next) {
    this.setNavBarFundingComplete({ fundingId: this.$route.params.urlGuid, complete: this.model.isCCOFComplete });
    this.addModelToStore({ fundingId: this.$route.params.urlGuid, model: this.model });

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
