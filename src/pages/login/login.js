const app = getApp();

Page({
  data: {
    sAccessToken: ''
  },
  fnInputAccessToken(e) {
    this.setData({
      sAccessToken: e.detail.value.trim()
    });
  },
  // 通过点击登录按钮登录
  fnTapLoginByLoginBtn() {
    if (!this.fnVerifyUUID(this.data.sAccessToken)) {
      return wx.showToast({
        title: 'Access Token格式错误，应为UUID',
        icon: 'none'
      });
    }
    this.fnNetUserLogin(this.data.sAccessToken);
  },
  // 通过扫码登录
  fnTapLoginByScanCode() {
    wx.scanCode({
      success: res => {
        if (res.result) {
          wx.vibrateShort();
          this.fnNetUserLogin(res.result);
        }
      },
      fail: () => {}
    });
  },
  // TODO: 通过GitHub账号登录
  fnTapLoginByGitHub() {},
  // 点击底部帮助文案
  fnTapHelpText() {
    // 弹出详细帮助文案模态框
    wx.showModal({
      content: '在CNode社区网站端，登录你帐号，然后在右上角找到【设置】按钮，点击进入后将页面滚动到最底部来查看你的Access Token。',
      showCancel: false
    });
  },
  // 验证是否是UUID
  fnVerifyUUID(sVal) {
    if (!sVal) {
      return false;
    }
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(sVal);
  },
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
          app.globalData.bIsLogin = true;
          wx.setStorageSync('sAccessToken', sAccessToken);
          wx.setStorageSync('oUserInfo', res);
          wx.navigateBack();
        }
        wx.hideNavigationBarLoading();
      })
      .catch(err => {
        wx.hideNavigationBarLoading();
      });
  }
});
