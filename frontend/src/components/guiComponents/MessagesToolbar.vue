<template>
  <v-container fluid style="padding:0">
    <v-toolbar
      dense
      color="yellow lighten-4"
      justify="center"
      v-if="hasUnreadMessage"
    >
      <v-toolbar-title class="flex text-center" style="color: black">
        <h3 v-if="hasUnreadActionRequiredMessage">Action required: new message(s)</h3>
        <h3 v-else>New message(s)</h3>
      </v-toolbar-title >
    </v-toolbar>

    <v-toolbar
      dense
      color="#B3E5FF"
      justify="center"
      v-if="hasBroadcastingMessage"
    >
      <v-toolbar-title class="flex text-center overflow-auto" style="color:black">
        <h4 class="text-center">
          This is a Broadcasting message will only appear if broadcast status from Dynamics is TRUE.
        </h4>
      </v-toolbar-title>
    </v-toolbar>
  </v-container>
</template>

<script>
import { PATHS } from '../../utils/constants';
import { mapGetters } from 'vuex';

export default {
  name: 'MessagesToolbar',
  computed: {
    ...mapGetters('message', ['hasUnreadMessage','hasBroadcastingMessage','hasUnreadActionRequiredMessage']),
  },
  methods: {
    messageScreen() {
      this.$router.push(PATHS.ROOT.MESSAGES);
    }
  }
};
</script>
