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
      {
        url: '/pages/message/message',
        open_type: 'navigate',
        icon_class: 'icon-message',
        text: '消息',
        need_login: true
      },
      {
        url: '/pages/about/about',
        open_type: 'navigate',
        icon_class: 'icon-about-us',
        text: '关于'
      }
    ] // 菜单列表
  },
  onLoad() {
    let oUserInfo = wx.getStorageSync('oUserInfo');
    if (oUserInfo) {
      this.setData({
        oUserInfo
      });
    }
    this.fnNetUserAuth(wx.getStorageSync('sAccessToken'));
  },
  onShow() {
    let oUserInfo = wx.getStorageSync('oUserInfo');
    if (oUserInfo) {
      this.setData({
        oUserInfo
      });
    }
    if (wx.getStorageSync('sAccessToken')) {
      this.setData({
        bIsLogin: true
      });
    }
  },
  // 注销登录
  fnTapLogout() {
    // 重置用户信息
    this.setData({
      bIsLogin: false,
      oUserInfo: {
        uid: '',
        loginname: '点击头像登录',
        avatar_url: '/images/tabbar/icon_mine.png'
      }
    });
    // 移除Storage中用户相关的数据
    wx.removeStorageSync('sAccessToken');
    wx.removeStorageSync('oUserInfo');
  },
  fnNetRUserInfo() {},
  // 用户授权验证
  fnNetUserAuth(sAccessToken) {
    // token不存在时，终止执行
    if (!sAccessToken) {
      return this.setData({
        bIsReady: true
      });
    }
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
          this.setData({
            bIsReady: true,
            bIsLogin: true
          });
          wx.hideNavigationBarLoading();
        }
      })
      .catch(err => {
        this.setData({
          bIsReady: true
        });
        wx.hideNavigationBarLoading();
      });
  }
});
