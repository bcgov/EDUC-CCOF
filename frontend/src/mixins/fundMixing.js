import {ORGANIZATION_PROVIDER_TYPES, CHANGE_URL_PREFIX} from '@/utils/constants';
import rules from '@/utils/rules';
import formatTime from '@/utils/formatTime';
import {mapActions, mapState, mapMutations} from 'vuex';
import alertMixin from '@/mixins/alertMixin';
import {isNullOrBlank} from '@/utils/common';
import NavButton from '@/components/util/NavButton';

export default {
  components: { NavButton },
  mixins: [alertMixin],
  computed: {
    ...mapState('funding', ['fundingModel']),
    ...mapState('organization', ['organizationProviderType']),
    ...mapState('app', ['familyLicenseCategory']),
    ...mapState('application', ['unlockBaseFunding', 'applicationStatus']),
    isLocked() {
      if (this.unlockBaseFunding) {
        return false;
      }
      return (this.applicationStatus === 'SUBMITTED' && !this.$route.path?.startsWith(CHANGE_URL_PREFIX));
    }
  },
  data() {
    return {
      processing: false,
      loading: true,
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
    validateForm() {
      this.$refs.form?.validate();
    },
    async save(isSave) {
      this.processing = true;
      this.setFundingModel({...this.model});
      this.addModelToStore({fundingId: this.$route.params.urlGuid, model: this.model});
      this.setNavBarFundingComplete({fundingId: this.$route.params.urlGuid, complete: this.model.isCCOFComplete});
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
    formatTime,
    groupValueRuleMaxGroupChildCareUnder36() {
      return this.groupValueRule('maxGroupChildCareUnder36', 'maxGroupChildCare36', 'maxPreschool', 'maxGroupChildCareSchool', 'maxGroupChildCareMultiAge');
    },
    groupValueRuleMaxGroupChildCare36() {
      return this.groupValueRule('maxGroupChildCare36', 'maxGroupChildCareUnder36', 'maxPreschool', 'maxGroupChildCareSchool', 'maxGroupChildCareMultiAge');
    },
    groupValueRuleMaxPreschool() {
      return this.groupValueRule('maxPreschool', 'maxGroupChildCareUnder36', 'maxGroupChildCare36', 'maxGroupChildCareSchool', 'maxGroupChildCareMultiAge');
    },
    groupValueRuleMaxGroupChildCareSchool() {
      return this.groupValueRule('maxGroupChildCareSchool', 'maxGroupChildCareUnder36', 'maxGroupChildCare36', 'maxPreschool', 'maxGroupChildCareMultiAge');
    },
    groupValueRuleMaxGroupChildCareMultiAge() {
      return this.groupValueRule('maxGroupChildCareMultiAge', 'maxGroupChildCareUnder36', 'maxGroupChildCare36', 'maxPreschool', 'maxGroupChildCareSchool');
    },
    groupValueRule(forFieldName, otherFieldNAme1, otherFieldNAme2, otherFieldNAme3, otherFieldNAme4) {
      if (!isNullOrBlank(this.model[`${forFieldName}`])) {
        if (this.model[`${forFieldName}`] > 0) {
          return true;
        } else if (!isNullOrBlank(this.model[`${otherFieldNAme1}`]) && !isNullOrBlank(this.model[`${otherFieldNAme2}`]) && !isNullOrBlank(this.model[`${otherFieldNAme3}`]) && !isNullOrBlank(this.model[`${otherFieldNAme4}`])) {
          const sum = (this.model[`${otherFieldNAme1}`] || 0) + (this.model[`${otherFieldNAme2}`] || 0) + (this.model[`${otherFieldNAme3}`] || 0) + (this.model[`${otherFieldNAme4}`] || 0);
          if (sum > 0) {
            return true;
          } else {
            return 'At least one Licence Type should have a maximum capacity above zero.';
          }
        } else {
          return true;
        }
      } else {
        return true;
      }
    }
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
        }

        this.loading = false;
      },
      immediate: true,
      deep: true
    },
    fundingModel: {
      handler() {
        this.model = {...this.fundingModel};
        this.$refs.form?.resetValidation();
      },
      immediate: true,
      deep: true
    }
  }
};
