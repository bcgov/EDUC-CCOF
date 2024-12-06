<template>
  <v-container id="messages" fluid class="pa-0">
    <Spinner v-if="loading" />
    <v-row v-else no-gutters>
      <v-col id="messages-summary" cols="12" md="5" :class="borderClass">
        <v-card tile elevation="0">
          <v-data-table
            :headers="columns"
            :items="messages"
            :mobile="null"
            mobile-breakpoint="lg"
            :height="screenHeight"
            fixed-header
            hover
            item-key="messageId"
            item-value="messageId"
            :items-per-page="-1"
            hide-default-footer
            :row-props="getRowProps"
            @click:row="rowClickHandler"
          >
            <template #no-data>
              <v-alert :value="true" type="info"> No Data </v-alert>
            </template>
            <template #item.isRead="{ item }">
              {{ item.isRead ? 'Read' : 'Unread' }}
            </template>
            <template #item.programYearValue="{ item }">
              {{ formatFiscalYearName(item.programYearValue) }}
            </template>
          </v-data-table>
        </v-card>
      </v-col>
      <v-col v-if="message.sender" id="messages-content" cols="12" md="7" class="mt-6 mt-md-0">
        <v-card class="px-6 overflow-auto elevation-0" :height="screenHeight">
          <div>
            <v-row>
              <v-col cols="12" sm="8">
                {{ message.sender }}
              </v-col>
              <v-col align="right" cols="12" sm="4">
                {{ message.dateReceived }}
              </v-col>
            </v-row>
            <div>
              <strong>{{ message.subject }}</strong>
            </div>
          </div>
          <v-divider class="my-4" />
          <div v-html="message.messageContent"></div>
        </v-card>
      </v-col>
    </v-row>
    <v-divider />
    <v-row justify="center" class="pa-3">
      <AppButton id="back-button" :primary="false" size="x-large" @click="goToHomePage()">Back</AppButton>
    </v-row>
  </v-container>
</template>

<script>
import { mapState, mapActions } from 'pinia';

import { useAuthStore } from '@/store/auth.js';
import { useMessageStore } from '@/store/message.js';

import Spinner from '@/components/common/Spinner.vue';
import AppButton from '@/components/guiComponents/AppButton.vue';

import { PATHS } from '@/utils/constants.js';
import { formatFiscalYearName } from '@/utils/format';

export default {
  name: 'MessagesPage',
  components: {
    Spinner,
    AppButton,
  },
  data() {
    return {
      columns: [
        { title: 'Read/Unread', align: 'start', key: 'isRead' },
        { title: 'Subject', key: 'subject' },
        { title: 'Fiscal Year', key: 'programYearValue' },
        { title: 'Date Received', key: 'dateReceived' },
      ],
      message: {
        sender: '',
        subject: '',
        programYearValue: '',
        dateReceived: '',
        messageContent: '',
      },
      loading: false,
      selectedMessageId: undefined,
    };
  },
  computed: {
    ...mapState(useAuthStore, ['userInfo']),
    ...mapState(useMessageStore, ['allMessages']),
    messages() {
      return this.allMessages || [];
    },
    borderClass() {
      return this.$vuetify.display.mdAndUp ? 'border-right' : 'border-bottom';
    },
    screenHeight() {
      switch (this.$vuetify.display.name) {
        case 'xs':
          return '67vh';
        case 'sm':
          return '82vh';
        case 'md':
          return '75vh';
        case 'lg':
          return '70vh';
        case 'xl':
          return '78vh';
        default:
          return '70vh';
      }
    },
  },
  async created() {
    await this.loadMessages();
  },
  methods: {
    ...mapActions(useMessageStore, ['updateMessage', 'getAllMessages']),
    formatFiscalYearName,
    async loadMessages() {
      try {
        this.loading = true;
        if (!this.allMessages || this.allMessages.length === 0) {
          const organizationId = this.userInfo.organizationId;
          await this.getAllMessages(organizationId);
        }
      } catch (error) {
        console.error('Error in loadMessages:', error);
      } finally {
        this.loading = false;
      }
    },

    rowClickHandler(_, { item }) {
      this.selectedMessageId = item?.messageId;
      this.message = {
        subject: item.subject || 'No subject',
        dateReceived: item.dateReceived || 'Unknown date',
        programYearValue: item.programYearValue || 'Unknown year',
        messageContent: item.messageContent || 'No content available',
        sender: 'From: My ChildcareBC Services',
      };

      if (item.messageId) {
        this.updateMessage(item.messageId);
      } else {
        console.error('No messageId found in item');
      }
    },
    getRowProps(item) {
      const message = item?.item;
      let rowClass = '';
      if (!message?.isRead) rowClass += 'unread-message ';
      if (this.selectedMessageId === message?.messageId) rowClass += 'highlighted-row';
      return { class: rowClass };
    },
    goToHomePage() {
      this.$router.push(PATHS.ROOT.HOME);
    },
  },
};
</script>
<style scoped>
:deep(.unread-message) {
  font-weight: bold;
}

:deep(.highlighted-row) {
  background: #c2e0fa;
}
</style>
