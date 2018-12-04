const API = {
  HOST: 'https://cnodejs.org',
  PATH: '/api/v1'
};

export const METHOD_ENUM = ['OPTIONS', 'GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'TRACE', 'CONNECT'];

export default {
  // 项目api配置
  api: {
    host: API.HOST,
    path: API.PATH,
    url: API.HOST + API.PATH
  },
  // 项目当前版本号
  version: '1.1.3'
};
