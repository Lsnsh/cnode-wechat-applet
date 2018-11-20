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
  // 获取未读消息数量
  fnNetGetUnreadMessageCount() {
    // 显示标题栏加载效果
    wx.showNavigationBarLoading();
    wx.dc.message
      .count()
      .then(res => {
        if (res && res.data) {
          wx.setTabBarBadge({
            index: 1,
            text: `${res.data}`
          });
        }
        wx.hideNavigationBarLoading();
      })
      .catch(err => {
        wx.hideNavigationBarLoading();
      });
  },
  // 验证access token有效性
  fnNetVerifyAccessToken() {
    // sAccessToken不存在时，终止执行
    if (!wx.getStorageSync('sAccessToken')) {
      return;
    }
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
        // 获取用户未读消息数量
        this.fnNetGetUnreadMessageCount();
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
