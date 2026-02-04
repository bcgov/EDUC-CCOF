import { mapState } from 'pinia';

import { useAuthStore } from '@/store/auth';
import { PERMISSIONS } from '@/utils/constants/permissions.js';

export default {
  created() {
    this.PERMISSIONS = PERMISSIONS;
  },
  computed: {
    ...mapState(useAuthStore, ['hasPermission']),
  },
};
