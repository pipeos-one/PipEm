import axios from 'axios';
import {ethers} from 'ethers';
import PIPEM from './namespace';

const pclassapi = (id) => `${PIPEM.pipeserver.api.pclass}?filter={"where":{"_id":"${id}"}}`;
const pclassiapi = (pclassid, chainId) => `${PIPEM.pipeserver.api.pclassi}?filter={"where":{"pclassid":"${pclassid}","pclassi.chain_id":"${chainId}"}}`;

export const getData = async (graphObj, chainId) => {
  let pfunctions = [];
  const nodes = Object.values(graphObj[0].n).filter((obj) => obj.i < 2000);
  for (let node of nodes) {
    const pfunction = (await axios.get(`${PIPEM.pipeserver.api.pfunctions}/${node.id}`)).data;
    const pclass = (await axios.get(pclassapi(pfunction.pclassid))).data[0];
    const pclassi = (await axios.get(pclassiapi(pfunction.pclassid, chainId))).data[0];
    pfunction.pclass = pclass;
    pfunction.pclass.deployment = pclassi;
    pfunctions.push(pfunction);
  }
  return pfunctions;
}

export const getGraph = async (graphid, chainId) => {
  const graph = (await axios.get(`${PIPEM.pipeserver.api.graph}/${graphid}`)).data;
  graph.json = JSON.parse(graph.json);
  const pfunctions = await getData(graph.json, chainId);
  return {graph, pfunctions};
};

export const getProvider = async () => {
  // Metamask
  const provider = new ethers.providers.Web3Provider(window.web3.currentProvider);
  const wallet = provider.getSigner();

  // wait for network to load
  await provider.getNetwork();

  return {provider, wallet};
};
