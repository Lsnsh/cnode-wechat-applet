Page({
  data: {
    sUserName: ''
  },
  onLoad(options) {
    if (options.name) {
      this.fnGetUserProfile(options.name);
      this.setData({
        sUserName: options.name
      });
    }
  },
  // 获取用户资料
  fnGetUserProfile(sUserName) {
    wx.dc.user
      .detail({
        urlData: {
          loginname: sUserName
        }
      })
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      });
  }
});
