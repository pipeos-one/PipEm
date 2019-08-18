const pipeserver = process.env.VUE_APP_PIPESERVER_IP;
const PIPEM = {
  pipeserver: {
    host: pipeserver,
    api: {
      pfunctions: `${pipeserver}/pfunction`,
      pclass: `${pipeserver}/pclass`,
      pclassi: `${pipeserver}/pclassi`,
      graph: `${pipeserver}/graph`,
    }
  },
}

export default PIPEM;
