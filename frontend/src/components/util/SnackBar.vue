<template>
  <div @mouseover="pause = true" @mouseleave="pause = false">
    <v-snackbar
      id="mainSnackBar"
      v-model="showSnackBar"
      :timeout="timeout"
      class="elevation-24 snackbar"
      location="top"
      centered
      :color="colour"
      transition="slide-y-transition"
    >
      {{ alertNotificationText }}
      <template #action="{ attrs }">
        <v-btn variant="text" color="white" v-bind="attrs" @click="showSnackBar = false">
          {{ alertNotificationQueue.length > 0 ? 'Next (' + alertNotificationQueue.length + ')' : 'Close' }}
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import { mapState, mapActions } from 'pinia';
import { useAppStore } from '../../store/app.js';

import { ALERT_NOTIFICATION_TYPES } from '../../utils/constants/AlertNotificationTypes.js';

export default {
  name: 'SnackBar',
  data() {
    return {
      colour: '',
      polling: null,
      timeout: 5000,
      pause: false,
    };
  },
  computed: {
    ...mapState(useAppStore, ['alertNotificationText', 'alertNotificationQueue', 'alertNotification']),
    hasNotificationsPending() {
      return this.alertNotificationQueue.length > 0;
    },
    showSnackBar: {
      get() {
        return this.alertNotification;
      },
      set(val) {
        this.setAlertNotification(val);
      },
    },
  },
  watch: {
    showSnackBar() {
      if (!this.showSnackBar && this.hasNotificationsPending) {
        this.$nextTick(() => (this.showSnackBar = true));
      } else if (this.showSnackBar && this.hasNotificationsPending) {
        this.setupSnackBar();
      } else {
        this.teardownSnackBar();
      }
    },
  },
  methods: {
    ...mapActions(useAppStore, ['setAlertNotificationText', 'setAlertNotification']),
    setAlertType(alertType) {
      if (!alertType) {
        alertType = '';
      }
      switch (alertType.toLowerCase()) {
        case ALERT_NOTIFICATION_TYPES.ERROR:
          this.colour = ALERT_NOTIFICATION_TYPES.ERROR;
          break;
        case ALERT_NOTIFICATION_TYPES.WARN:
          this.colour = ALERT_NOTIFICATION_TYPES.WARN;
          break;
        case ALERT_NOTIFICATION_TYPES.SUCCESS:
          this.colour = ALERT_NOTIFICATION_TYPES.SUCCESS;
          break;
        case ALERT_NOTIFICATION_TYPES.INFO:
        default:
          this.colour = ALERT_NOTIFICATION_TYPES.INFO;
      }
    },
    setupSnackBar() {
      let alertObject = this.alertNotificationQueue.shift();
      this.setAlertNotificationText(alertObject.text);
      this.setAlertType(alertObject.alertType);
      document.addEventListener('keydown', this.close);
      if (alertObject.alertType === ALERT_NOTIFICATION_TYPES.ERROR) {
        this.timeout = 8000;
      } else {
        this.timeout = 5000;
      }
      this.timeoutCounter();
    },
    teardownSnackBar() {
      document.removeEventListener('keydown', this.close);
      clearInterval(this.polling);
    },
    close(e) {
      if ((e.key === 'Escape' || e.key === 'Esc') && this.showSnackBar) {
        this.showSnackBar = false;
      }
    },
    timeoutCounter() {
      this.polling = setInterval(() => {
        if (this.pause) {
          this.timeout += 1;
        }
      }, 1000);
    },
  },
};
</script>

<style>
.snackbar {
  padding: 0 !important;
}
</style>
