<template>
  <v-container id="messages" fluid class="pa-0 ma-0" height="100%">
    <v-row v-if="loading" class="ma-0">
      <Spinner style="width: 100%"></Spinner>
    </v-row>
    <v-row fluid class="mx-4" v-else>
      <v-row >
        <v-col id="messages-summary" fluid class="pa-0" :cols="4">
          <v-card tile style="border-right: 1px solid lightgrey" :height="fitScreenHeight()" class="pa-0 elevation-0">
            <v-data-table
              :headers="columns"
              :items="messages"
              :mobile-breakpoint="960"
              :height="fitScreenHeight()"
              fixed-header
              :item-value="item => item.messageId"
              :items-per-page="-1"
              hide-default-footer
              @click:row="rowClickHandler"
            >
            <template #no-data>
              <v-alert :value="true" type="info">
                No Data
              </v-alert>
            </template>
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
              <v-row>
                <v-col :cols="8">
                {{ message.sender }}
              </v-col>
              <v-col align="right" :cols="4">
                {{ message.dateReceived }}
              </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <strong>{{ message.subject }}</strong>
                </v-col>
              </v-row>
            </v-card-title>
            <v-divider />
            <v-card-text v-html="message.messageContent"></v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-row>
    <v-divider />
    <v-row justify="center" class="pa-3">
      <v-btn id="back-button" color="info" variant="outlined" :size="buttonSize" @click="goToHomePage()"> Back </v-btn>
    </v-row>
  </v-container>
</template>

<script>
import { useAuthStore } from '../store/auth.js';
import { useMessageStore } from '../store/message.js';
import { mapState, mapActions } from 'pinia';
import Spinner from './common/Spinner.vue';
import { PATHS } from '../utils/constants.js';
import { useDisplay } from 'vuetify';

export default {
  name: 'MessagesPage',
  components: {
    Spinner
  },
  data() {
    return {
      selectedId: -1,
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
      displayName: '',
      loading: false,
    };
  },
  computed: {
    ...mapState(useAuthStore, ['userInfo']),
    ...mapState(useMessageStore, ['allMessages']),
    messages() {
      return this.allMessages || [];
    },
    buttonSize() {
      const sizeMap = {
        xs: 'large',
        sm: 'large',
        md: 'large',
        lg: 'x-large',
        xl: 'x-large',
      };
      return sizeMap[this.displayName] || 'medium';
    },
  },
  mounted() {
    this.displayName = useDisplay().name.value;
    this.loadMessages();
  },
  methods: {
    ...mapActions(useMessageStore, ['updateMessage', 'getAllMessages']),

    async loadMessages() {
      try {
        this.loading = true;
        if (!this.allMessages || this.allMessages.length === 0) {
          const organizationId = this.userInfo.organizationId;
          await this.getAllMessages(organizationId);
        }
      } catch (error) {
        console.error("Error in loadMessages:", error);
      } finally {
        this.loading = false;
      }
    },

    rowClickHandler(event, { item }) {
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
    getMessageStyle(message) {
      return message.isRead ? 'read' : 'unread';
    },
    goToHomePage() {
      this.$router.push(PATHS.ROOT.HOME);
    },
    fitScreenHeight() {
      switch (this.displayName) {
        case 'xs': return '67vh';
        case 'sm': return '82vh';
        case 'md': return '75vh';
        case 'lg': return '70vh';
        case 'xl': return '78vh';
        default: return '70vh';
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
