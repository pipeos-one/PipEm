import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/vuetify';
import VueRamda from 'vue-ramda'

import axios from 'axios';
import vuetify from './plugins/vuetify';
import 'roboto-fontface/css/roboto/roboto-fontface.css';
import '@fortawesome/fontawesome-free/css/all.css';


Vue.config.productionTip = false

var vue =new Vue({
    router,
    vuetify,
    render: h => h(App)
}).$mount('#app')

Vue.use(VueRamda)

let graph1 = [{"n":{"0":{"i":0,"id":"5c95397d4212cc40afeec91f"},"1":{"i":1,"id":"5c95397d4212cc40afeec922"},"2003":{"i":2003,"id":"5bc59e192817116e84bdd831"}},"e":[[2003,1,"1",1],[2003,1,0,1]]}]

console.log('graph1', graph1)

console.log(vue.$R.add(1, 2))

var nodes = {}
var nodesI = []

window.nodes = nodes

window.vue = vue

let serv0 = "http://192.168.1.140:3000/"
let serv1 = serv0+"pfunction/"
let serv2 = serv0+'pclassi?filter={"where":{"pclassid":"5c95397d4212cc40afeec914","pclassi.chain_id":"3"}}' // ${soMany}

const ports = [
  {
      _id: '5bc59e192817116e84bdd830',
      pclassid: '5bc59d5d2817116e84bdd82e',

      pclass: { name: 'PipeOS' },
      pfunction: {
          gapi: {
              constant: true,
              inputs: [
                  {
                      name: 'in',
                      type: '*',
                  },
              ],
              name: 'PortOut',
              outputs: [],
              payable: false,
              stateMutability: 'view',
              type: 'port',
          },
          chainids: [0],
          signature: 'PortOut(*)',
      },
      timestamp: '2018-10-16T08:10:33.614Z',
  },
  {
      _id: '5bc59e192817116e84bdd831',
      pclassid: '5bc59d5d2817116e84bdd82e',
      pclass: { name: 'PipeOS' },
      pfunction: {
          gapi: {
              constant: true,
              inputs: [],
              name: 'PortIn',
              outputs: [
                  {
                      name: 'out',
                      type: '*',
                  },
              ],
              payable: false,
              stateMutability: 'view',
              type: 'port',
          },
          chainids: [0],
          signature: 'PortIn()',
      },
      timestamp: '2018-10-16T08:10:33.614Z',
  },
  {
      _id: '5bc59e192817116e84bdd832',
      pclassid: '5bc59d5d2817116e84bdd82e',
      pclass: { name: 'PipeOS' },
      pfunction: {
          gapi: {
              constant: true,
              inputs: [],
              name: 'MsgData',
              outputs: [
                  {
                      name: 'data',
                      type: 'bytes',
                  },
                  {
                      name: 'sender',
                      type: 'address',
                  },
                  {
                      name: 'sig',
                      type: 'bytes4',
                  },
                  {
                      name: 'value',
                      type: 'uint256',
                  },
              ],
              payable: false,
              stateMutability: 'view',
              type: 'data',
          },
          chainids: [0],
          signature: 'MsgData()',
      },
      timestamp: '2018-10-16T08:10:33.614Z',
  },
  {
      _id: '5bc59e192817116e84bdd833',
      pclassid: '5bc59d5d2817116e84bdd82e',
      pclass: { name: 'PipeOS' },
      pfunction: {
          gapi: {
              constant: true,
              inputs: [],
              name: 'BlockData',
              outputs: [
                  {
                      name: 'coinbase',
                      type: 'address',
                  },
                  {
                      name: 'dificulty',
                      type: 'uint256',
                  },
                  {
                      name: 'gaslimit',
                      type: 'uint256',
                  },
                  {
                      name: 'number',
                      type: 'uint256',
                  },
                  {
                      name: 'timestamp',
                      type: 'uint256',
                  },
              ],
              payable: false,
              stateMutability: 'view',
              type: 'data',
          },
          chainids: [0],
          signature: 'BlockData()',
      },
      timestamp: '2018-10-16T08:10:33.614Z',
  },
  {
      _id: '5bc59e192817116e84bdd834',
      pclassid: '5bc59d5d2817116e84bdd82e',
      pclass: { name: 'PipeOS' },
      pfunction: {
          gapi: {
              constant: true,
              inputs: [],
              name: 'MiscData',
              outputs: [
                  {
                      name: 'gasleft',
                      type: 'uint256',
                  },
                  {
                      name: 'now',
                      type: 'uint256',
                  },
                  {
                      name: 'tx.gasprice',
                      type: 'uint256',
                  },
                  {
                      name: 'tx.origin',
                      type: 'address',
                  },
              ],
              payable: false,
              stateMutability: 'view',
              type: 'data',
          },
          chainids: [0],
          signature: 'MiscData()',
      },
      timestamp: '2018-10-16T08:10:33.614Z',
  },

];

const containers = [
  {
      _id: '5bc59d5d2817116e84bdd82e',
      name: 'PipeOS',
      pclass: {
          gapi: [{
              constant: true, inputs: [{ name: 'in', type: '*' }], name: 'PortOut', outputs: [], payable: false, stateMutability: 'view', type: 'port',
          }, {
              constant: true, inputs: [], name: 'PortIn', outputs: [{ name: 'out', type: '*' }], payable: false, stateMutability: 'view', type: 'port',
          }],
          natspec: { methods: {}, title: 'PipeOS Utils.' },
          bytecode: '',
          flatsource: ' ',
      },
      timestamp: '2018-10-16T08:10:33.614Z',
  },
];

function find2(idVal, obj3) {
  // console.log(obj3)

  for ( var ndx in obj3){
    if (obj3[ndx]._id == idVal) {
      console.log('find2 obj3[ndx]', obj3[ndx])
      var t = obj3[ndx]
      return t;
    }
  }
  return false;
}

function serverData1(){
  console.log('graph1[0].n', graph1[0].n)

  vue.$R.mapObjIndexed((x, key, all) => {
    var found = find2(x.id, ports)
    if (found !== false) {
      nodes[key] = found
      nodesI[parseInt(key)] = x.id
      serverData2(key, found.pclassid, found.pfunction.chainids[0])
    } else {
      axios.get(serv1+x.id).then((response) => {
        // get pfunction
        console.log('serverData1 response.data', response.data)
        nodes[key] = response.data
        nodesI[parseInt(key)] = x.id
        serverData2(key, response.data.pclassid, response.data.pfunction.chainids[0])

      })
    }

  }, graph1[0].n)

  console.log('nodes', nodes)
}

function serverData2(key, pclass, chain){
  var found = find2(pclass, containers)
    if (found !== false) {
      nodes[key].i = found
      //nodesI[parseInt(key)] = pclass
    } else {
      // get pclassi
      axios.get(serv0+`pclassi?filter={"where":{"pclassid":"${pclass}","pclassi.chain_id":"${chain}"}}` ).then((response) => {
        console.log('serverData2 response.data', response.data)
        nodes[key].i = response.data[0]
        //nodesI[parseInt(key)] = x.id

      })
    }
}

// serverData1()
