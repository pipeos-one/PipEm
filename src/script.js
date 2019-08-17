import axios from 'axios';

const SERVER_HOST = "http://192.168.1.140:3000/";
const PFUNC_API = SERVER_HOST + "pfunction/";
const PCLASS_API = (id) => SERVER_HOST + `pclass?filter={"where":{"_id":"${id}"}}`;
const PCLASSI_API = (pclassid) => SERVER_HOST +  `pclassi?filter={"where":{"pclassid":"${pclassid}","pclassi.chain_id":"3"}}`; // ${soMany}


export const getData = async (graphObj) => {
  let pfunctions = [];
  const nodes = Object.values(graphObj[0].n).filter((obj) => obj.i < 2000);
  for (let node of nodes) {
    // console.log('node', node);
    const pfunction = (await axios.get(`${PFUNC_API}${node.id}`)).data;
    // console.log('pfunction', pfunction);
    const pclass = (await axios.get(PCLASS_API(pfunction.pclassid))).data[0];
    // console.log('pclass', pclass);
    const pclassi = (await axios.get(PCLASSI_API(pfunction.pclassid))).data[0];
    // console.log('pclassi', pclassi);
    pfunction.pclass = pclass;
    pfunction.pclass.deployment = pclassi;
    pfunctions.push(pfunction);
  }
  return pfunctions;
}
