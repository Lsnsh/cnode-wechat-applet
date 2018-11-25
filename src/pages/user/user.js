Page({
  data: {
    bIsReady: false, // 页面是否准备就绪
    aTabBar: [
      {
        active: true,
        text: '最近回复'
      },
      {
        text: '最新发布'
      },
      {
        text: '话题收藏'
      }
    ],
    oUserProfile: {}
  },
  onLoad(options) {
    if (options.name) {
      this.fnGetUserProfile(options.name);
    }
  },
  // 获取用户资料
  fnGetUserProfile(sUserName) {
    // 显示标题栏加载效果
    wx.showNavigationBarLoading();
    wx.dc.user
      .detail(
        {
          urlData: {
            loginname: sUserName
          }
        },
        this.fnUserProfileDataModel
      )
      .then(res => {
        this.setData({
          bIsReady: true,
          oUserProfile: res
        });
        // 停止加载效果
        wx.hideNavigationBarLoading();
      })
      .catch(err => {
        this.setData({
          bIsReady: true
        });
        // 停止加载效果
        wx.hideNavigationBarLoading();
      });
  },
  fnUserProfileDataModel(oData) {
    let oResult = {
      ...oData,
      create_at: wx.moment(oData.create_at).format('YYYY-MM-DD HH:mm:ss')
    };
    if (!Array.isArray(oResult.recent_replies)) {
      oResult.recent_replies = [];
    }
    if (!Array.isArray(oResult.recent_topics)) {
      oResult.recent_topics = [];
    }
    oResult.recent_replies = oResult.recent_replies.map(oItem => {
      return {
        ...oItem,
        last_reply_at: wx.moment(oItem.last_reply_at).fromNow()
      };
    });
    oResult.recent_topics = oResult.recent_topics.map(oItem => {
      return {
        ...oItem,
        last_reply_at: wx.moment(oItem.last_reply_at).fromNow()
      };
    });
    return oResult;
  }
});
