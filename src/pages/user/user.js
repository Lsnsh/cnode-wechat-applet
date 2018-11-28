Page({
  data: {
    bIsReady: false, // 页面是否准备就绪
    bIsFetchingUserCollectTopicList: false, // 是否正在获取用户收藏话题列表
    nActiveTabIndex: 0,
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
    aUserCollectTopicList: [], // 用户收藏话题列表
    oUserProfile: {}
  },
  onLoad(options) {
    if (options.name) {
      this.fnGetUserProfile(options.name);
      this.fnGetUserCollectTopicList(options.name);
    }
  },
  // 点击切换tab
  fnClickSwitchTab(e) {
    let oDataSet = e.currentTarget.dataset;
    this.setData({
      nActiveTabIndex: oDataSet.index
    });
  },
  // 获取用户收藏话题
  fnGetUserCollectTopicList(sUserName) {
    // 显示标题栏加载效果
    wx.showNavigationBarLoading();
    this.setData({
      bIsFetchingUserCollectTopicList: true
    });
    wx.dc.topicCollect
      .list(
        {
          urlData: {
            loginname: sUserName
          }
        },
        this.fnUserCollectTopicListDataModel
      )
      .then(res => {
        // 停止加载效果
        this.setData({
          aUserCollectTopicList: res.aTopicList,
          bIsFetchingUserCollectTopicList: false
        });
        wx.hideNavigationBarLoading();
      })
      .catch(err => {
        console.log(err);
        // 停止加载效果
        wx.hideNavigationBarLoading();
        this.setData({
          bIsFetchingUserCollectTopicList: false
        });
      });
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
  fnUserCollectTopicListDataModel(aData) {
    let oResult = {};
    if (!Array.isArray(aData)) {
      aData = [];
    }
    oResult.aTopicList = aData.map(oItem => {
      return {
        ...oItem,
        last_reply_at: wx.moment(oItem.last_reply_at).fromNow()
      };
    });
    return oResult;
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
