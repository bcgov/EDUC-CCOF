<template>
  <v-container id="messages" fluid class="pa-0 ma-0" height="100%">
    <v-row v-if="!allMessages" class="ma-0">
      <Spinner style="width: 100%" />
    </v-row>
    <v-row v-else fluid class="mx-4">
      <v-row>
        <v-col id="messages-summary" fluid class="pa-0" :cols="4">
          <v-card tile style="border-right: 1px solid lightgrey" :height="fitScreenHeight()" class="pa-0 elevation-0">
            <v-data-table
              :headers="headers"
              :items="allMessages"
              mobile-breakpoint="960"
              fluid
              :height="fitScreenHeight()"
              fixed-header
              :row-props="getMessageStyle"
              disable-pagination
              hide-default-footer
              item-key="messageId"
              single-select
              @click:row="rowClickHandler"
            >
              <template #item.isRead="{ item }">
                <p v-if="item.isRead">Read</p>
                <p v-else>Unread</p>
              </template>
            </v-data-table>
          </v-card>
        </v-col>
        <v-col v-if="message.sender" id="messages-content" fluid class="pa-0" :cols="8">
          <v-card class="pa-4 overflow-auto elevation-0" fluid tile :height="fitScreenHeight()">
            <v-card-title class="pa-0">
              <v-col :cols="8">
                {{ message.sender }}
              </v-col>
              <v-col align="right" :cols="4">
                {{ message.dateReceived }}
              </v-col>
              <v-col>
                <strong>{{ message.subject }}</strong>
              </v-col>
            </v-card-title>
            <v-divider />
            <v-card-text>{{ message.messageContent }}</v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-row>
    <v-divider />
    <v-row justify="center" class="pa-3">
      <v-btn id="back-button" color="info" variant="outlined" v-bind="buttonSize" @click="goToHomePage()"> Back </v-btn>
    </v-row>
  </v-container>
</template>

<script>
import { mapState, mapActions } from 'pinia';
import { useAuthStore } from '../store/auth.js';
import { useMessageStore } from '../store/message.js';

import Spinner from './common/Spinner.vue';
import { PATHS } from '../utils/constants.js';

export default {
  name: 'MessagesPage',
  components: { Spinner },
  data() {
    return {
      PATHS: PATHS,
      selectedId: -1,
      headers: [
        {
          text: 'Read/Unread',
          align: 'start',
          value: 'isRead',
        },
        { text: 'Subjects', value: 'subject' },
        { text: 'Fiscal Year', value: 'programYearValue' },
        { text: 'Date Received', value: 'dateReceived' },
      ],
      message: {
        sender: '',
        subject: '',
        programYearValue: '',
        dateReceived: '',
        messageContent: '',
      },
    };
  },
  computed: {
    ...mapState(useAuthStore, ['userInfo']),
    ...mapState(useMessageStore, ['allMessages']),
    buttonSize() {
      const size = {
        xs: 'large',
        sm: 'large',
        md: 'large',
        lg: 'x-large',
        xl: 'x-large',
      }[this.$vuetify.display.name];
      return size ? { [size]: true } : {};
    },
  },
  mounted() {
    this.loadMessagesStore();
  },
  methods: {
    ...mapActions(useMessageStore, ['updateMessage', 'getAllMessages']),
    rowClickHandler(item, row) {
      this.message.subject = item.subject;
      this.message.dateReceived = item.dateReceived;
      this.message.programYearValue = item.programYearValue;
      this.message.messageContent = item.messageContent;
      this.message.sender = 'From: My ChildcareBC Services';
      row.select(true);
      this.updateMessage(item.messageId);
    },
    getMessageStyle(message) {
      if (message.isRead) return 'read';
      else return 'unread';
    },
    goToHomePage() {
      this.$router.push(PATHS.ROOT.HOME);
    },
    async loadMessagesStore() {
      try {
        if (!this.allMessages) {
          const organizationId = this.userInfo.organizationId;
          await this.getAllMessages(organizationId);
        }
      } catch (error) {
        console.info(error);
      }
    },
    fitScreenHeight() {
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
};
</script>

<style scoped>
:deep(html) {
  overflow-y: auto;
}
:deep(.read) {
  font-weight: normal;
}
:deep(.unread) {
  font-weight: bold;
}
:deep(tr:hover) {
  cursor: pointer;
}
:deep(tr.v-data-table__selected) {
  background: #c2e0fa !important;
}
:deep(.v-data-table-header th) {
  white-space: nowrap;
}
:deep(.v-data-table__wrapper) {
  margin-bottom: 0px;
}
</style>
