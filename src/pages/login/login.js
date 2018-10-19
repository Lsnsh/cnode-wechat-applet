Page({
  data: {
    sAccessToken: ''
  },
  fnInputAccessToken(e) {
    this.setData({
      sAccessToken: e.detail.value
    });
  },
  // 通过点击登录按钮登录
  fnTapLoginByLoginBtn() {
    this.fnNetUserLogin(this.data.sAccessToken);
  },
  // 通过扫码登录
  fnTapLoginByScanCode() {
    wx.scanCode({
      success: res => {
        console.log(res);
        if (res.result) {
          this.fnNetUserLogin(res.result);
        }
      },
      fail: () => {}
    });
  },
  // 通过GitHub账号登录
  fnTapLoginByGitHub() {},
  // 用户登录
  fnNetUserLogin(sAccessToken) {
    // 显示标题栏加载效果
    wx.showNavigationBarLoading();
    wx.dc.user
      .auth({
        data: {
          accesstoken: sAccessToken
        }
      })
      .then(res => {
        if (res) {
          wx.setStorageSync('sAccessToken', sAccessToken);
          wx.setStorageSync('oUserInfo', res);
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
