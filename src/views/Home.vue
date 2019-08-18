<template>
  <v-layout row class="fullheight">
    <v-tabs fixed-tab centered grow class="fullheight" @change="changeTab">
      <v-tab ripple key="markdown"><v-icon>fa-rocket</v-icon></v-tab>
      <v-tab ripple key="qrcode"><v-icon>fa-share</v-icon></v-tab>
      <v-tab ripple key="graph"><v-icon>fa-project-diagram</v-icon></v-tab>
      <v-tab ripple key="js"><v-icon>fa-code</v-icon></v-tab>
      <!-- <v-tab ripple key="graphsource">Graph Source</v-tab> -->
      <v-tab-item
          key="markdown"
          class="fullheight"
      >
        <v-flex xs10 offset-xs1 v-if="graph" style="text-align: left;">
          <MarkdownView :value="markdownText" :onPreHtml="onPreHtml" :onPostHtml="onPostHtml"/>
        </v-flex>
      </v-tab-item>
      <v-tab-item
          key="qrcode"
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
          class="fullheight"
      >
        <v-flex xs10 offset-xs1 class="fullheight">
          <div :id="canvasid2" class="fullheight"></div>
        </v-flex>
      </v-tab-item>
      <v-tab-item
          key="js"
          class="fullheight"
      >
        <v-flex xs12 v-if="jssource" class="fullheight">
          <textarea cols="70" rows="12">{{jssource}}</textarea>
        </v-flex>
      </v-tab-item>
      <!-- <v-tab-item
          key="graphsource"
          class="fullheight"
      >
        <v-flex xs12 v-if="graph">
          <textarea cols="70" rows="12">{{graph.json}}</textarea>
        </v-flex>
      </v-tab-item> -->
    </v-tabs>
    <!-- <v-flex xs12 v-if="deploymentInfo">
      <DeploymentInfo v-model="deploymentInfo"/>
    </v-flex> -->
    <v-layout class="fixed">
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
import MarkdownView from '../components/MarkdownView.vue';
import {getGraph} from '../script.js';
import {getAliasesFromMd} from '../components/markdown-utils.js';

Vue.component(VueQrcode.name, VueQrcode);


// const vendor_graph = [{"n":{"0":{"i":0,"id":"5c95397d4212cc40afeec91f"}},"e":[]}]
// const market_graph = [{"n":{"0":{"i":0,"id":"5c95397d4212cc40afeec91f"},"1":{"i":1,"id":"5c95397d4212cc40afeec922"},"2":{"i":2,"id":"5c95397d4212cc40afeec919"}},"e":[]}]
// const market_graph2 = [{"n":{"0":{"i":0,"id":"5c95397d4212cc40afeec91f"},"1":{"i":1,"id":"5c95397d4212cc40afeec922"},"2":{"i":2,"id":"5c95397d4212cc40afeec919"},"2001":{"i":2001,"id":"5bc59e192817116e84bdd831"}},"e":[[0,1,1,2],[0,1,2,1],[1,1,2,4],[2001,1,"0",1],[2001,1,1,1],[2001,1,2,3]]}]
// const market_graph_full = [{"n":{"0":{"i":0,"id":"5c95397d4212cc40afeec91f"},"1":{"i":1,"id":"5c95397d4212cc40afeec922"},"2":{"i":2,"id":"5c95397d4212cc40afeec919"},"2001":{"i":2001,"id":"5bc59e192817116e84bdd831"},"2003":{"i":2003,"id":"5bc59e192817116e84bdd831"}},"e":[[0,1,1,2],[0,1,2,1],[1,1,2,4],[2001,1,"0",1],[2001,1,1,1],[2001,1,2,3],[2003,1,"2",5],[2003,1,1,3]]}]


export default {
  name: 'home',
  props: ['graphid'],
  components: {
    VueQrcode,
    MarkdownView,
    AbiFunction,
    DeploymentInfo,
  },
  data() {
    return{
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

    window.PipedScriptCallback = this.PipedScriptCallback;
    this.graphid && this.setData();
  },
  watch: {
    graphid() {
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
    async setData() {
      this.qrcodeValue = window.location.origin + "/#/" + this.graphid;

      const {graph, pfunctions} = await getGraph(this.graphid);
      this.graph = graph;
      this.markdownText = graph.markdown;
      this.pfunctions = pfunctions;
      this.setGraph(graph.json, pfunctions, ['graphRender', 'js']);
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
          console.log('returnValues', returnValues);
          Object.keys(returnValues).forEach((name) => {
              console.log('returnValues', name, returnValues[name]);
              markdown = markdown.replace(`[[outputs.${name}]]`, returnValues[name]);
          });
          this.markdownText = markdown;

          return;
        }
        console.log('returnValues', returnValues);
        console.log('PipedScriptCallback', funcName, JSON.stringify(returnValues));

        let element = document.getElementById(`output_${funcName}`);
        element.innerHTML = '';

        let markdown = this.markdownText;
        Object.keys(returnValues).forEach((name) => {
            console.log('returnValues', name, returnValues[name]);
            markdown = markdown.replace(`[[outputs.${name}]]`, returnValues[name]);
            element.insertAdjacentHTML('beforeend', `<p>${name}: ${this.prepareOutput(returnValues[name])}</p>`);
        });
        this.markdownText = markdown;
    },
  }
}
</script>

<style>
.fullheight {
  height: 100%;
  width: 100%;
}

#app, html, body, .v-tabs-items, .v-window__container {
  height: 100%!important;
  width: 100%;
}

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
