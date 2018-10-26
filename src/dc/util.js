import pathToRegexp from 'path-to-regexp';
import request from '../utils/request';
import config from '../config/index';

const METHOD_EMUN = ['OPTIONS', 'GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'TRACE', 'CONNECT'];

export default (oOption = {}, fnDataModel) => {
  oOption.url = config.api.url + oOption.url;
  if (oOption.urlData) {
    oOption.url = fnCompileDynamicUrl(oOption.url, oOption.urlData);
  }
  oOption.method = String(oOption.method).toUpperCase();
  if (METHOD_EMUN.indexOf(oOption.method) === -1) {
    // 如果请求方式不是有效值,重置为默认值
    oOption.method = 'GET';
  }
  return new Promise((resolve, reject) => {
    request(oOption)
      .then(res => {
        if (res && res.success) {
          // 如果没有data字段，将当前res对象摊开
          if (!res.data) {
            delete res.success;
            res.data = {
              ...res
            };
          }
          if (typeof fnDataModel === 'function') {
            resolve(fnDataModel(res.data));
          } else {
            resolve(res.data);
          }
        } else {
          reject(res);
        }
      })
      .catch(e => {
        reject(e);
      });
  });
};

function fnCompileDynamicUrl(sUrl = '', oData = {}) {
  let toPath = pathToRegexp.compile(sUrl);
  return toPath(oData);
}
