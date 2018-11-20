import pathToRegexp from 'path-to-regexp';
import { METHOD_ENUM } from '../config/index';

// 处理请求选项
function fnHandleRequestOption(oOption) {
  // 定义默认的全局请求参数
  let oDefaultData = {};
  const sAccessToken = wx.getStorageSync('sAccessToken');
  if (sAccessToken) {
    oDefaultData.accesstoken = sAccessToken;
  }
  // 使传入的请求参数，覆盖默认参数
  oOption.data = {
    ...oDefaultData,
    ...oOption.data
  };
  // 动态路径参数解析
  if (oOption.urlData) {
    oOption.url = fnCompileDynamicUrl(oOption.url, oOption.urlData);
  }
  // 请求方式验证
  oOption.method = String(oOption.method).toUpperCase();
  if (METHOD_ENUM.indexOf(oOption.method) === -1) {
    // 如果请求方式不是有效值，重置为默认值
    oOption.method = 'GET';
  }
  return oOption;
}

// 处理url path中的动态参数
function fnCompileDynamicUrl(sUrl = '', oData = {}) {
  let toPath = pathToRegexp.compile(sUrl);
  return toPath(oData);
}

export default (oOption = {}) => {
  return new Promise((resolve, reject) => {
    try {
      wx.request({
        ...fnHandleRequestOption(oOption),
        success(res) {
          if (res.data) {
            resolve(res.data);
          } else {
            reject(res);
          }
        },
        fail(err) {
          reject(err);
        }
      });
    } catch (e) {
      reject(e);
    }
  });
};
