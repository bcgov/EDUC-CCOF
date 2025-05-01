<template>
  <p>View and update your organization and contact details.</p>
  <br />
  <OrganizationInfo />
  <ContactInfo />
</template>
<script>
import ContactInfo from '@/components/accountMgmt/ContactInfo.vue';
import OrganizationInfo from '@/components/accountMgmt/OrganizationInfo.vue';

export default {
  name: 'ManageOrganization',
  components: { ContactInfo, OrganizationInfo },
  data() {
    return {
      tab: undefined,
    };
  },
};
</script>
<style scoped></style>
