<template>
  <div class="fullheight">
    <PipeCanvas :id="canvasid"/>
    <div v-for="abi in pipeabi">
      <AbiFunction :abi="abi"/>
    </div>
  </div>
</template>

<script>
import PipeGraphs from '@pipeos/pipecanvas';
import {AbiFunction} from 'vue-ethabi';
import PipeCanvas from '@/components/PipeCanvas.vue';
import {getData} from '../script.js';

const market_graph = [{"n":{"0":{"i":0,"id":"5c95397d4212cc40afeec91f"},"1":{"i":1,"id":"5c95397d4212cc40afeec922"},"2":{"i":2,"id":"5c95397d4212cc40afeec919"}},"e":[]}]
const market_graph2 = [{"n":{"0":{"i":0,"id":"5c95397d4212cc40afeec91f"},"1":{"i":1,"id":"5c95397d4212cc40afeec922"},"2":{"i":2,"id":"5c95397d4212cc40afeec919"}},"e":[[0,1,1,2],[0,1,2,1]]}]
const market_graph_full = [{"n":{"0":{"i":0,"id":"5c95397d4212cc40afeec91f"},"1":{"i":1,"id":"5c95397d4212cc40afeec922"},"2":{"i":2,"id":"5c95397d4212cc40afeec919"},"2001":{"i":2001,"id":"5bc59e192817116e84bdd831"},"2003":{"i":2003,"id":"5bc59e192817116e84bdd831"}},"e":[[0,1,1,2],[0,1,2,1],[1,1,2,4],[2001,1,"0",1],[2001,1,1,1],[2001,1,2,3],[2003,1,"2",5],[2003,1,1,3]]}]


export default {
  name: 'home',
  components: {
    PipeCanvas,
    AbiFunction,
  },
  data() {
    return{
      canvasid: 'pipecanvas_graph',
      pfunctions: null,
      visitors: ['js', 'graphRender'],
      pipegraph: null,
      pipeabi: null,
      jssource: null,
    };
  },
  async mounted() {
    // getData(market_graph2, 'pipecanvas_graph', ['solidity', 'js', 'graphRender']);
    this.pfunctions = await getData(market_graph2);
    this.setGraph(market_graph2);
  },
  methods: {
    setGraph(graphObj) {
        this.pipegraph = new PipeGraphs(this.pfunctions, {}, this.visitors);
        this.pipegraph.addGraph(this.canvasid);
        this.pipegraph.setGraphs(graphObj);
        this.jssource = this.pipegraph.getSource('javascript');
        this.pipeabi = this.pipegraph.getSource('abi');
        const deployment_info = this.pipegraph.getSource('constructor');
        // console.log(jssource);
        console.log('this.pipeabi', this.pipeabi);
    }
  }
}
</script>

<style>
.fullheight {
  height: 100%;
  width: 100%;
}

#app, html, body {
  height: 100%;
  width: 100%;
}
</style>
