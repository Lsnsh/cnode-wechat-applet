Page({
  data: {
    sAccessToken: ''
  },
  fnInputAccessToken(e) {
    this.setData({
      sAccessToken: e.detail.value
    });
  },
  fnTapLogin() {
    // 显示标题栏加载效果
    wx.showNavigationBarLoading();
    wx.dc.user
      .auth({
        data: {
          accesstoken: this.data.sAccessToken
        }
      })
      .then(res => {
        if (res) {
          wx.setStorageSync('accesstoken', this.data.sAccessToken);
          wx.setStorageSync('avatar_url', res.avatar_url);
          wx.setStorageSync('uid', res.id);
          wx.setStorageSync('loginname', res.loginname);
          wx.switchTab({
            url: '/pages/mine/mine'
          });
          wx.hideNavigationBarLoading();
        }
      })
      .catch(err => {
        wx.hideNavigationBarLoading();
      });
  }
});
