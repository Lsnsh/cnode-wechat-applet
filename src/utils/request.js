export default (oOptions = {}) => {
  let oDefaultOptions = {};

  return new Promise((resolve, reject) => {
    try {
      wx.request(
        Object.assign(oDefaultOptions, oOptions, {
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
        })
      );
    } catch (e) {
      reject(e);
    }
  });
};
