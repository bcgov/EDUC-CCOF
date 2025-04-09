<template>
  <AppDialog v-model="isDisplayed" :title="title" persistent max-width="50%" @close="closeDialog">
    <template #content>
      <v-row class="mb-2">
        <v-col align="center">
          <!-- JonahCurlCGI todo: fill with wording once available -->
          <p class="pt-4 text-h6">Your message has been submitted.</p>
          <p class="pt-4 text-h6">Reference: {{ referenceNumber }}</p>
          <p class="pt-4 text-h6">Typical response times are 3-5 business days.</p>
        </v-col>
      </v-row>
    </template>
    <template #button>
      <v-row justify="space-around">
        <v-col cols="12" md="6" class="d-flex justify-center">
          <AppButton id="return-button" :primary="false" size="large" min-width="250px" @click="returnPage()"
            >Return to {{ returnTo }}</AppButton
          >
        </v-col>
        <v-col cols="12" md="6" class="d-flex justify-center">
          <AppButton id="view-messages-button" size="large" min-width="250px" @click="viewMessages()"
            >View messages</AppButton
          >
        </v-col>
      </v-row>
    </template>
  </AppDialog>
</template>

<script>
import AppButton from '@/components/guiComponents/AppButton.vue';
import AppDialog from '@/components/guiComponents/AppDialog.vue';
import { CLOSURE_REQUEST_TYPES } from '@/utils/constants';

export default {
  name: 'NewRequestConfirmationDialog',
  components: { AppButton, AppDialog },
  props: {
    show: {
      type: Boolean,
      default: false,
      required: true,
    },
    closureRequestType: {
      type: Number,
      default: 0,
      required: true,
    },
  },
  emits: ['close'],
  data() {
    return {
      isDisplayed: false,
    };
  },
  computed: {
    title() {
      switch (this.closureRequestType) {
        case CLOSURE_REQUEST_TYPES.NEW_CLOSURE:
          return 'New Closure Request Submitted';
        default:
          return '';
      }
    },
  },
  watch: {
    show: {
      handler(value) {
        this.isDisplayed = value;
      },
    },
  },
  methods: {
    closeDialog() {
      this.$emit('close');
    },

    viewMessages() {
      this.closeDialog();
      this.$router.push({ name: 'messaging' });
    },

    returnPage() {
      this.closeDialog();
      if (!this.$route.path?.includes(this.returnTo)) {
        this.$router.push({ name: this.returnTo });
      }
    },
  },
};
</script>
