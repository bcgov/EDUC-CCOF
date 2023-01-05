import { PATHS } from '@/utils/constants';
import rules from '@/utils/rules';
import { mapActions, mapState, mapMutations, } from 'vuex';

export default {
  computed: {
    ...mapState('facility', ['facilityModel', 'facilityId']),
    ...mapState('app', ['navBarList']),
  },
  beforeRouteLeave(_to, _from, next) {
    this.setNavBarFacilityComplete({ facilityId: this.$route.params.urlGuid, complete: this.model.isFacilityComplete });
    this.addFacilityToStore({ facilityId: this.$route.params.urlGuid, facilityModel: this.model });
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
    previous() {
      let navBar = this.$store.getters['app/getNextPrevByFacilityId'](this.$route.params.urlGuid);
      if (navBar?.ccofBaseFundingId) {
        this.$router.push(PATHS.group.fundAmount + '/' + navBar.ccofBaseFundingId);
      } else {
        this.$router.push(PATHS.group.orgInfo);
      }

    },
    next() {
      // await this.save();
      let navBar = this.$store.getters['app/getNavByFacilityId'](this.$route.params.urlGuid);
      console.log('navbar: ', navBar);
      if (navBar?.ccofBaseFundingId) {
        this.$router.push(PATHS.group.fundAmount + '/' + navBar.ccofBaseFundingId);
      } else {
        this.$router.push(PATHS.group.fundAmount);
      }
    },
    async saveClicked() {
      await this.save();
      if (!this.$route.params.urlGuid) {
        this.$router.push(PATHS.group.facInfo + '/' + this.facilityId);
      }
    },
    async save() {
      this.processing = true;
      this.setFacilityModel(this.model);
      try {
        await this.saveFacility();
        this.setSuccessAlert('Success! Facility information has been saved.');
      } catch (error) {
        this.setFailureAlert('An error occurred while saving. Please try again later.');
      }
      this.processing = false;
    },

  }
};
