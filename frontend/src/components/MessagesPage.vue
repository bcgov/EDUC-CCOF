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

<script setup>
import { ref, computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '../store/auth.js';
import { useMessageStore } from '../store/message.js';
import Spinner from './common/Spinner.vue';
import { PATHS } from '../utils/constants.js';
import { useDisplay } from 'vuetify';
import { useRouter } from 'vue-router';

const router = useRouter();
const authStore = useAuthStore();
const messageStore = useMessageStore();

const { userInfo } = storeToRefs(authStore);
const { allMessages } = storeToRefs(messageStore);

const selectedId = ref(-1);
const columns = [
  { title: 'Read/Unread', align: 'start', key: 'isRead' },
  { title: 'Subject', key: 'subject' },
  { title: 'Fiscal Year', key: 'programYearValue' },
  { title: 'Date Received', key: 'dateReceived' },
];
const message = ref({
  sender: '',
  subject: '',
  programYearValue: '',
  dateReceived: '',
  messageContent: '',
});

const { name } = useDisplay();
const displayName = computed(() => name.value);

const messages = computed(() => allMessages.value || []);

const buttonSize = computed(() => {
  const sizeMap = {
    xs: 'large',
    sm: 'large',
    md: 'large',
    lg: 'x-large',
    xl: 'x-large',
  };
  return sizeMap[displayName.value] || 'medium';
});

onMounted(() => {

  try {
    if (!messageStore.allMessages || messageStore.allMessages.length === 0) {
      const organizationId = authStore.userInfo.organizationId;
      messageStore.getAllMessages(organizationId);
    }
  } catch (error) {
    console.error("Error in created hook:", error);
  }
});

const rowClickHandler = (event, { item }) => {

  message.value = {
    subject: item.subject || 'No subject',
    dateReceived: item.dateReceived || 'Unknown date',
    programYearValue: item.programYearValue || 'Unknown year',
    messageContent: item.messageContent || 'No content available',
    sender: 'From: My ChildcareBC Services',
  };

  if (item.messageId) {
    messageStore.updateMessage(item.messageId);
  } else {
    console.error('No messageId found in item');
  }
};

const getMessageStyle = (message) => {
  return message.isRead ? 'read' : 'unread';
};

const goToHomePage = () => {
  router.push(PATHS.ROOT.HOME);
};

const fitScreenHeight = () => {
  switch (displayName.value) {
    case 'xs': return '67vh';
    case 'sm': return '82vh';
    case 'md': return '75vh';
    case 'lg': return '70vh';
    case 'xl': return '78vh';
    default: return '70vh';
  }
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
