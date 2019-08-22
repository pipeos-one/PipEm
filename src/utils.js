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

export const getCachedGraphIds = () => {
  const cachedIds = window.localStorage.getItem(PIPEM.cache);

  try {
    const graphIds = JSON.parse(cachedIds);
    return graphIds || [];
  } catch(e) {
    console.error(`Could not retrieve graphs IDS from localStorage. ${e}`);
  }
  return [];
}

export const getCachedGraph = (graphid) => {
  const cachedGraph = window.localStorage.getItem(`${PIPEM.cache}${graphid}`);
  try {
    const graphObj = JSON.parse(cachedGraph);
    return graphObj;
  } catch(e) {
    console.error(`Could not parse localStorage. ID: ${graphid}. Data: ${cachedGraph}. ${e}`);
  }
  return null;
}

export const getCachedGraphs = () => {
  let graphs = [];

  const graphIds = getCachedGraphIds();

  graphIds.forEach((id) => {
    const graphObj = getCachedGraph(id);
    if (graphObj) {
      graphs.push(graphObj);
    }
  });

  return graphs;
}

export const setCacheGraphIds = (graphIds) => {
  window.localStorage.setItem(PIPEM.cache, JSON.stringify(graphIds));
}

export const addCacheGraphId = (graphid) => {
  if (getCachedGraph(graphid)) return;
  const graphIds = getCachedGraphIds();
  graphIds.push(graphid);
  setCacheGraphIds(graphIds);
}

export const removeCacheGraphId = (graphid) => {
  const graphIds = getCachedGraphIds();
  const index = graphIds.indexOf(graphid);

  if (index > -1) {
    graphIds.splice(index, 1);
    setCacheGraphIds(graphIds);
  }
}

export const addCachedGraph = (graphid, graphData) => {
  window.localStorage.setItem(`${PIPEM.cache}${graphid}`, JSON.stringify(graphData));
}

export const removeCachedGraph = (graphid) => {
  window.localStorage.removeItem(`${PIPEM.cache}${graphid}`);
}
