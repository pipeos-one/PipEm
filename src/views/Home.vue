<template>
  <v-layout row class="fullheight">
    <v-tabs v-model="tabValue" fixed-tab centered grow class="fullheight" @change="changeTab">
      <v-tab ripple key="graphlist" href="#tab-0"><v-icon>fa-list</v-icon></v-tab>
      <v-tab ripple key="markdown" href="#tab-1"><v-icon>fa-rocket</v-icon></v-tab>
      <v-tab ripple key="qrcode" href="#tab-2"><v-icon>fa-share</v-icon></v-tab>
      <v-tab ripple key="graph" href="#tab-3"><v-icon>fa-project-diagram</v-icon></v-tab>
      <v-tab ripple key="js" href="#tab-4"><v-icon>fa-code</v-icon></v-tab>
      <v-tab-item
          key="graphlist"
          value="tab-0"
          class="fullheight"
      >
        <GraphList :graphs="graphs" :currentGraph="graphid" @remove="onRemoveGraph"/>
      </v-tab-item>
      <v-tab-item
          key="markdown"
          value="tab-1"
          class="fullheight"
      >
        <v-flex xs10 offset-xs1 v-if="graph" style="text-align: left;">
          <MarkdownView :value="markdownText" :onPreHtml="onPreHtml" :onPostHtml="onPostHtml"/>
        </v-flex>
      </v-tab-item>
      <v-tab-item
          key="qrcode"
          value="tab-2"
          class="fullheight"
      >
        <v-layout v-if="qrcodeValue">
          <v-flex xs12>
            <qrcode :value="qrcodeValue" :options="{ width: 200 }"></qrcode>
          </v-flex>
        </v-layout>
      </v-tab-item>
      <v-tab-item
          key="graph"
          value="tab-3"
          class="fullheight"
      >
        <v-flex xs10 offset-xs1 class="fullheight">
          <div :id="canvasid2" class="fullheight"></div>
        </v-flex>
      </v-tab-item>
      <v-tab-item
          key="js"
          value="tab-4"
          class="fullheight"
      >
        <v-flex xs12 v-if="jssource" class="fullheight">
          <textarea cols="70" rows="12">{{jssource}}</textarea>
        </v-flex>
      </v-tab-item>
    </v-tabs>
    <!-- <v-flex xs12 v-if="deploymentInfo">
      <DeploymentInfo v-model="deploymentInfo"/>
    </v-flex> -->
    <v-layout class="fixed" v-if="tabValue !== 'tab-0'">
      <v-flex xs10 offset-xs1 v-for="abi in pipeabi">
        <AbiFunction :abi="abi" @input="onInput" @change="onChange"/>
      </v-flex>
    </v-layout>
    <div :id="canvasid" style="height:0;"></div>
  </v-layout>
</template>

<script>
import Vue from 'vue';
import axios from 'axios';
import {ethers} from 'ethers';
import PipeGraphs from '@pipeos/pipecanvas';
import {AbiFunction, DeploymentInfo} from 'vue-ethabi';
import VueQrcode from '@chenfengyuan/vue-qrcode';
import MarkdownView from '../components/MarkdownView';
import GraphList from '../components/GraphList';
import {
  getGraph,
  getProvider,
  getCachedGraphs,
  getCachedGraph,
  getCachedGraphIds,
} from '../utils.js';
import {getAliasesFromMd} from '../components/markdown-utils.js';
import PIPEM from '../namespace';

Vue.component(VueQrcode.name, VueQrcode);

export default {
  name: 'home',
  props: ['graphid'],
  components: {
    VueQrcode,
    MarkdownView,
    AbiFunction,
    DeploymentInfo,
    GraphList,
  },
  data() {
    return {
      localStorage: window.localStorage,
      graphs: [],
      tabValue: 'tab-0',
      provider: null,
      wallet: null,
      graph: null,
      canvasid: 'pipecanvas_graph',
      canvasid2: 'pipecanvas_graph2',
      pfunctions: null,
      pipegraph: null,
      pipeabi: null,
      jssource: null,
      deploymentInfo: null,
      tabIndex: null,
      qrcodeValue: null,
      markdownText: '',
    };
  },
  async mounted() {
    window.ethers = ethers;
    window.axios = axios;

    const {provider, wallet} = await getProvider();
    this.provider = provider;
    this.wallet = wallet;

    window.PipedScriptCallback = this.PipedScriptCallback;
    this.setGraphs();
    this.graphid && this.setData();
    this.tabValue = this.graphid ? 'tab-1' : 'tab-0';
  },
  watch: {
    graphid() {
      this.tabValue = this.graphid ? 'tab-1' : 'tab-0';
      this.graphid && this.setData();
    },
    tabIndex() {
      if (this.tabIndex === 2) {
        setTimeout(() => {
          document.getElementById(this.canvasid2).innerHTML = '';
          const pipegraph = new PipeGraphs(this.pfunctions, {}, ['graphRender']);
          pipegraph.addGraph(this.canvasid2);
          pipegraph.setGraphs(this.graph.json);
        }, 500);
      }
    },
  },
  methods: {
    setGraphs() {
      this.graphs = getCachedGraphs();
    },
    async setData() {
      this.qrcodeValue = window.location.origin + "/#/" + this.graphid;

      const {graph, pfunctions} = getCachedGraph(this.graphid);
      this.graph = graph;
      this.pfunctions = pfunctions;

      if (!this.graph || !this.pfunctions) {
        const {graph, pfunctions} = await getGraph(this.graphid, this.provider.network.chainId);
        this.localStorage.setItem(`${PIPEM.cache}${this.graphid}`, JSON.stringify({graph, pfunctions}));

        const graphIds = getCachedGraphIds();
        graphIds.push(this.graphid);
        this.localStorage.setItem(PIPEM.cache, JSON.stringify(graphIds));

        this.graph = graph;
        this.pfunctions = pfunctions;
        this.graphs.push({graph, pfunctions});
      }

      this.markdownText = this.graph.markdown;
      this.setGraph(this.graph.json, this.pfunctions, ['graphRender', 'js']);
    },
    setGraph(graphObj, pfunctions, visitors) {
        document.getElementById(this.canvasid).innerHTML = '';
        this.pipegraph = new PipeGraphs(pfunctions, {}, visitors);
        this.pipegraph.addGraph(this.canvasid);
        this.pipegraph.setGraphs(graphObj);
        this.jssource = this.pipegraph.getSource('javascript');
        this.pipeabi = this.pipegraph.getSource('abi');
        this.deploymentInfo = this.pipegraph.getSource('constructor');
    },
    onChange(args) {
      args.forEach((arg) => {
        if (!arg.type.includes('int') && arg.type !== 'bool') {
          arg.value = `"${arg.value}"`;
        }

        const toBeReplaced = `let ${arg.name} = null;`;
        const toReplace = `let ${arg.name} = ${arg.value};`;
        this.jssource = this.jssource.replace(toBeReplaced, toReplace);
      });
      eval(this.jssource);
    },
    onInput(args) {
      let markdown = this.graph.markdown;
      const {aliases, full} = getAliasesFromMd(markdown);

      full.forEach((toreplace, i) => {
        const replacement = args.find(arg => arg.name === aliases[i].split('.')[1]);
        if (replacement) {
          markdown = markdown.replace(toreplace, replacement.value);
        }
      });
      this.markdownText = markdown;
    },
    prepareOutput: function(value) {
      if (typeof value === 'object') {
        return JSON.stringify(value);
      }
      return value;
    },
    changeTab(tabIndex) {
      this.tabIndex = tabIndex;
    },
    onPreHtml(markdown) {
      return markdown;
    },
    onPostHtml(html) {
      return html;
    },
    async PipedScriptCallback (funcName, returnValues) {
        if (returnValues.wait) {
          document.getElementById(`output_${funcName}`).innerHTML = 'Waiting for transaction...';
          returnValues = await returnValues.wait();
          // TODO: depends on chain
          document.getElementById(`output_${funcName}`).innerHTML = `<a href="https://ropsten.etherscan.io/tx/${returnValues.transactionHash}" target="blank">See transaction</a>`;

          let markdown = this.markdownText;
          Object.keys(returnValues).forEach((name) => {
              markdown = markdown.replace(`[[outputs.${name}]]`, returnValues[name]);
          });
          this.markdownText = markdown;

          return;
        }

        let element = document.getElementById(`output_${funcName}`);
        element.innerHTML = '';

        let markdown = this.markdownText;
        Object.keys(returnValues).forEach((name) => {
            markdown = markdown.replace(`[[outputs.${name}]]`, returnValues[name]);
            element.insertAdjacentHTML('beforeend', `<p>${name}: ${this.prepareOutput(returnValues[name])}</p>`);
        });
        this.markdownText = markdown;
    },
    onRemoveGraph(graphid) {
      const graphIndex = this.graphs.findIndex((graph) => graph.graph._id === graphid);
      this.graphs.splice(graphIndex, 1);
      this.localStorage.removeItem(`${PIPEM.cache}${graphid}`);
      const graphIds = getCachedGraphIds();
      const index = graphIds.indexOf(graphid);

      if (index > -1) {
        graphIds.splice(index, 1);
        this.localStorage.setItem(PIPEM.cache, JSON.stringify([graphIds]));
      }
    }
  }
}
</script>

<style>
.fixed {
  position: fixed;
  bottom: 0;
  width: 100%;
}

.v-tabs-bar {
  margin-bottom:40px;
}

textarea {
  width: 90%;
  height: 60%;
}

.event {
    background-color: #C9DEBB;
    border-color: #C9DEBB;
    fill: #C9DEBB;
}

.payable {
    background-color: #CDE0F2;
    border-color: #CDE0F2;
    fill: #CDE0F2;
}

.nonconstant {
    background-color: #E9DEDE;
    border-color: #E9DEDE;
    fill: #E9DEDE;
}

.jscomponent {
    background-color: #FEFAC8;
    border-color: #FEFAC8;
    fill: #FEFAC8;
}

.s_content {
    color: #111;
    font-family: "Roboto Condensed", sans-serif;
    font-size: 10px;
    padding-left: 4px;
    text-align: left;
    display: -webkit-box;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    height: 32;
}

.centred {
    display: block;
    font-family: "Roboto Condensed", sans-serif;
    white-space: pre;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: default;
}

.abifunc .v-input__control .v-input__slot .v-text-field__slot .v-label {
  top:0;
}
</style>
