import './dc/index';
import moment from 'moment';

App({
  globalData: {
    bIsLogin: false // 用户是否登录
  },
  onLaunch() {
    this.fnInitMoment();
    this.fnNetVerifyAccessToken();
  },
  // 验证access token有效性
  fnNetVerifyAccessToken() {
    // 显示标题栏加载效果
    wx.showNavigationBarLoading();
    wx.dc.user
      .auth()
      .then(res => {
        if (res) {
          wx.setStorageSync('oUserInfo', res);
        }
        // access token有效，更新用户登录状态
        this.globalData.bIsLogin = true;
        wx.hideNavigationBarLoading();
      })
      .catch(err => {
        this.globalData.bIsLogin = false;
        wx.hideNavigationBarLoading();
      });
  },
  fnInitMoment() {
    moment.locale('zh-cn');
    wx.moment = moment;
  }
});
