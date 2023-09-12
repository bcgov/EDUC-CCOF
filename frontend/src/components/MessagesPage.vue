<template>
  <v-container id="messages" fluid class="pa-0 ma-0" height="100%">
    <v-row class="ma-0" v-if="!allMessages">
      <Spinner style="width: 100%"></Spinner>
    </v-row>
    <v-row fluid class="mx-4" v-else>
      <v-row>
        <v-col id="messages-summary" fluid class="pa-0" :cols="4">
          <v-card tile style="border-right: 1px solid lightgrey" :height="fitScreenHeight()" class="pa-0 elevation-0" >
            <v-data-table
              :headers="headers"
              :items="allMessages"
              mobile-breakpoint="960"
              fluid :height="fitScreenHeight()"
              fixed-header
              :item-class="getMessageStyle"
              disable-pagination hide-default-footer
              @click:row="rowClickHandler"
              item-key="messageId" single-select
            >
              <template v-slot:item.isRead="{item}">
                <p v-if="item.isRead">
                  Read
                </p>
                <p v-else>
                  Unread
                </p>
              </template>
            </v-data-table>
          </v-card>
        </v-col>
        <v-col id="messages-content" fluid class="pa-0" :cols="8" v-if="this.message.sender">
          <v-card
              class="pa-4 overflow-auto elevation-0" fluid tile
              :height="fitScreenHeight()"
          >
            <v-card-title class="pa-0">
              <template>
                <v-col :cols="8">
                  {{this.message.sender}}
                </v-col>
                <v-col align="right" :cols="4">
                  {{this.message.dateReceived}}
                </v-col>
              </template>
              <template>
                <v-col>
                  <strong>{{this.message.subject}}</strong>
                </v-col>
              </template>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text  v-html="this.message.messageContent">
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-row>
    <v-divider></v-divider>
    <v-row justify="center" class="pa-3">
      <v-btn id="back-button" color="info" outlined v-bind="buttonSize" @click="goToHomePage()">
        Back
      </v-btn>
    </v-row>
  </v-container>
</template>


<script>
import Spinner from '@/components/common/Spinner';
import { PATHS } from '@/utils/constants';
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'MessagesPage',

  data() {
    return {
      PATHS: PATHS,
      selectedId: -1,
      headers: [
        {
          text: 'Read/Unread',
          align: 'start',
          value: 'isRead'
        },
        { text: 'Subjects', value: 'subject' },
        { text: 'Fiscal Year', value: 'programYearValue'},
        { text: 'Date Received', value: 'dateReceived' }
      ],
      message: {
        sender: '',
        subject:'',
        programYearValue: '',
        dateReceived:'',
        messageContent: '',
      },
    };
  },

  created() {
    this.getAllMessagesVuex();
  },

  computed: {
    ...mapGetters('auth', ['userInfo']),
    ...mapGetters('message', ['allMessages']),
    buttonSize () {
      const size = {xs:'large',sm:'large',md:'large',lg:'x-large',xl:'x-large'}[this.$vuetify.breakpoint.name];
      return size ? { [size]: true } : {};
    }
  },
  methods: {

    ...mapActions('message', ['updateMessage','getAllMessages']),

    rowClickHandler(item,row) {
      this.message.subject = item.subject;
      this.message.dateReceived = item.dateReceived;
      this.message.programYearValue = item.programYearValue;
      this.message.messageContent = item.messageContent;
      this.message.sender = 'From: My ChildcareBC Services';
      row.select(true);
      this.updateMessage(item.messageId);
    },

    getMessageStyle(message){
      if (message.isRead) return 'read';
      else return 'unread';
    },

    goToHomePage() {
      this.$router.push(PATHS.ROOT.HOME);
    },

    async getAllMessagesVuex() {
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
      switch (this.$vuetify.breakpoint.name) {
      case 'xs': return '67vh';
      case 'sm': return '82vh';
      case 'md': return '75vh';
      case 'lg': return '70vh';
      case 'xl': return '78vh';
      default: return '70vh';
      }
    }
  },

  components: { Spinner }
};
</script>

<style>
  html {
    overflow-y: auto;
  }
  .read {
    font-weight: normal;
  }
  .unread {
    font-weight: bold;
  }
  tr:hover {
    cursor: pointer;
  }
  tr.v-data-table__selected {
    background: #c2e0fa !important;
  }
  .v-data-table-header th {
    white-space: nowrap;
  }
  .v-data-table__wrapper {
    margin-bottom: 0px;
  }
</style>
