<template>
  <v-container id="messages" fluid class="pa-0 ma-0" height="100%">
    <v-row v-if="!allMessages || allMessages.length === 0" class="ma-0">
      <Spinner style="width: 100%" />
    </v-row>
    <v-row v-else fluid class="mx-4">
      <v-row>
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
            <template v-slot:item.isRead="{ item }">
              <p v-if="item.isRead">Read</p>
              <p v-else>Unread</p>
            </template>
            </v-data-table>
          </v-card>
        </v-col>
        <v-col v-if="message.sender" id="messages-content" fluid class="pa-0" :cols="8">
          <v-card class="pa-4 overflow-auto elevation-0" fluid tile :height="fitScreenHeight()">
            <v-card-title class="pa-0 d-flex">
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
      <v-btn id="back-button" color="info" variant="outlined" :size="buttonSize" @click="goToHomePage()"> Back </v-btn>
    </v-row>
  </v-container>
</template>

<script>
import { useAuthStore } from '../store/auth.js';
import { useMessageStore } from '../store/message.js';
import Spinner from './common/Spinner.vue';
import { PATHS } from '../utils/constants.js';
import { useDisplay } from 'vuetify';
import { useRouter } from 'vue-router';

export default {
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
    };
  },
  computed: {
    userInfo() {
      return useAuthStore().userInfo;
    },
    allMessages() {
      return useMessageStore().allMessages;
    },
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
    try {
      if (!useMessageStore().allMessages || useMessageStore().allMessages.length === 0) {
        const organizationId = this.userInfo.organizationId;
        useMessageStore().getAllMessages(organizationId);
      }
    } catch (error) {
      console.error("Error in mounted hook:", error);
    }
  },
  methods: {
    rowClickHandler(event, { item }) {
      this.message = {
        subject: item.subject || 'No subject',
        dateReceived: item.dateReceived || 'Unknown date',
        programYearValue: item.programYearValue || 'Unknown year',
        messageContent: item.messageContent || 'No content available',
        sender: 'From: My ChildcareBC Services',
      };

      if (item.messageId) {
        useMessageStore().updateMessage(item.messageId);
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
