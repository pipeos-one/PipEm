<template>
  <v-layout>
    <v-flex xs2>
      <v-dialog
      v-model="addGraphDialog"
      width="500"
    >
      <template v-slot:activator="{ on }">
        <v-btn
          icon
          v-on="on"
        >
          <v-icon>fa-plus</v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-card-text v-if="addGraphDialog">
          <!-- <vue-qr-reader v-on:code-scanned="codeArrived" v-on:error-captured="errorCaptured"/> -->
          <vue-qr-reader ref="qrreader"
            v-on:code-scanned="codeArrived"
            :stop-on-scanned="true"
            :use-back-camera="true"
            :draw-on-found="true"
            line-color="#00FF00"
            :line-width="5"
            :video-height="480"
            :video-width="640"
            :responsive="true"
          >
          </vue-qr-reader>
        </v-card-text>
      </v-card>
    </v-dialog>
    </v-flex>
    <v-flex xs10 offset-xs1>
    <v-list rounded>
      <v-list-item-group color="primary">
        <v-list-item
          v-for="(graph, i) in graphs"
          :key="i"
        >

          <v-list-item-content>
            <router-link :to="{ name: 'main', params: {graphid: graph.graph._id} }">{{graph.graph.name}}</router-link>
          </v-list-item-content>
          <v-list-item-icon @click="$emit('remove', graph.graph._id)">
            <v-icon small>fa-trash</v-icon>
          </v-list-item-icon>
        </v-list-item>
      </v-list-item-group>
    </v-list>
    </v-flex>
  </v-layout>
</template>

<script>
import VueQrReader from 'vue-qr-reader/dist/lib/vue-qr-reader.umd.js';

export default {
  props: ['graphs', 'currentGraph'],
  components: {VueQrReader},
  data: () => ({
    addGraphDialog: false,
  }),
  methods: {
    codeArrived(qrcode) {
      const graphid = qrcode.substring(qrcode.indexOf('/#/') + 3);

      this.$refs.qrreader.$refs.video.srcObject.getVideoTracks()[0].stop();

      if (this.currentGraph !== graphid) {
        this.$router.push({
          name: 'main',
          params: {graphid},
        });
      }

      this.addGraphDialog = false;
    },
    errorCaptured(error) {
      console.log('errorCaptured', error);
    }
  },
};
</script>
