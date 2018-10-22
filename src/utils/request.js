export default (oOptions = {}) => {
  // 定义默认的全局请求参数
  let oDefaultData = {};
  const sAccessToken = wx.getStorageSync('sAccessToken');
  if (sAccessToken) {
    oDefaultData.accesstoken = sAccessToken;
  }
  // 使传入的请求参数，覆盖默认参数
  oOptions.data = {
    ...oDefaultData,
    ...oOptions.data
  };

  return new Promise((resolve, reject) => {
    try {
      wx.request({
        ...oOptions,
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
