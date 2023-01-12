import { PATHS, ORGANIZATION_PROVIDER_TYPES } from '@/utils/constants';
import rules from '@/utils/rules';
import { mapActions, mapState, mapMutations, } from 'vuex';
import alertMixin from '@/mixins/alertMixin'; 

export default {
  mixins: [alertMixin],
  computed: {
    ...mapState('facility', ['facilityModel', 'facilityId']),
    ...mapState('app', ['navBarList']),
  },
  async beforeRouteLeave(_to, _from, next) {
    this.setNavBarFacilityComplete({ facilityId: this.$route.params.urlGuid, complete: this.model.isFacilityComplete });
    this.addFacilityToStore({ facilityId: this.$route.params.urlGuid, facilityModel: this.model });
    this.setFacilityModel(this.model);
    this.processing = true;
    await this.saveFacility();
    this.processing = false;
    next();
  },
  watch: {
    '$route.params.urlGuid': {
      handler() {
        let facilityId = this.$route.params.urlGuid;
        if (facilityId) {
          this.loadFacility(facilityId);
        } else {
          this.newFacility();
        }
      },
      immediate: true,
      deep: true
    },
    facilityModel: {
      handler() {
        this.model = { ...this.facilityModel };
        this.$refs.form?.resetValidation();
      },
      immediate: true,
      deep: true
    }
  },
  data() {
    return {
      rules,
      processing: false,
      model: {}
    };
  },

  methods: {
    ...mapActions('facility', ['loadFacility', 'saveFacility', 'newFacility']),
    ...mapMutations('facility', ['setFacilityModel', 'addFacilityToStore']),
    ...mapMutations('app', ['setNavBarFacilityComplete']),
    isGroup() { 
      return this.providerType === ORGANIZATION_PROVIDER_TYPES.GROUP;
    },
    previous() {
      let navBar = this.$store.getters['app/getNextPrevByFacilityId'](this.$route.params.urlGuid);
      if (navBar?.ccofBaseFundingId) {
        this.$router.push(`${this.isGroup() ? PATHS.group.fundAmount : PATHS.family.fundAmount}/${navBar.ccofBaseFundingId}`);
      } else {
        this.$router.push(`${this.isGroup() ? PATHS.group.orgInfo : PATHS.family.orgInfo}`);
      }
    },
    next() {
      // await this.save();
      let navBar = this.$store.getters['app/getNavByFacilityId'](this.$route.params.urlGuid);
      console.log('navbar: ', navBar);
      if (navBar?.ccofBaseFundingId) {
        this.$router.push(`${this.isGroup() ? PATHS.group.fundAmount : PATHS.family.fundAmount}/${navBar.ccofBaseFundingId}`);
      } else {
        this.$router.push(`${this.isGroup() ? PATHS.group.fundAmount : PATHS.family.fundAmount}`);
      }
    },
    async saveClicked() {
      await this.save();
      if (!this.$route.params.urlGuid) {
        this.$router.push(`${this.isGroup() ? PATHS.group.facInfo : PATHS.family.eligibility}/${this.facilityId}`);
      }
    },
    async save() {
      this.processing = true;
      this.setFacilityModel(this.model);
      try {
        await this.saveFacility();
        this.setSuccessAlert(this.isGroup() ? 'Success! Facility information has been saved.' : 'Success! Eligibility information has been saved.');
      } catch (error) {
        this.setFailureAlert('An error occurred while saving. Please try again later.');
      }
      this.processing = false;
    },

  }
};
