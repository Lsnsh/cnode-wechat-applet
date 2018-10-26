const app = getApp();

Page({
  data: {
    bIsReady: false, // 页面是否准备就绪
    bIsLogin: false, // 用户是否登录
    oUserInfo: {
      uid: '',
      loginname: '点击头像登录',
      avatar_url: '/images/tabbar/icon_mine.png'
    }, // 用户信息
    aMenuList: [
      // TODO: 消息通知功能
      // {
      //   url: '/pages/message/message',
      //   open_type: 'navigate',
      //   icon_class: 'icon-message',
      //   text: '消息',
      //   need_login: true
      // },
      {
        url: '/pages/about/about',
        open_type: 'navigate',
        icon_class: 'icon-about-us',
        text: '关于'
      }
    ] // 菜单列表
  },
  onLoad() {
    this.fnInitPageData();
  },
  onShow() {
    this.fnInitPageData();
  },
  // 注销登录
  fnTapLogout() {
    wx.showModal({
      content: '确定要注销吗？',
      confirmText: '注销',
      success: res => {
        if (res.confirm) {
          // 重置用户信息
          this.setData({
            bIsLogin: false,
            oUserInfo: {
              uid: '',
              loginname: '点击头像登录',
              avatar_url: '/images/tabbar/icon_mine.png'
            }
          });
          // 更新全局的登录状态
          app.globalData.bIsLogin = false;
          // 移除Storage中用户相关的数据
          wx.removeStorageSync('sAccessToken');
          wx.removeStorageSync('oUserInfo');
        }
      }
    });
  },
  fnInitPageData() {
    let oUserInfo = wx.getStorageSync('oUserInfo');
    if (!oUserInfo) {
      oUserInfo = {
        uid: '',
        loginname: '点击头像登录',
        avatar_url: '/images/tabbar/icon_mine.png'
      };
    }
    this.setData({
      oUserInfo: oUserInfo,
      bIsLogin: app.globalData.bIsLogin,
      bIsReady: true
    });
  }
});
