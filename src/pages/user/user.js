Page({
  data: {
    bIsReady: false, // 页面是否准备就绪
    bIsFetchingUserCollectTopicList: false, // 是否正在获取用户收藏话题列表
    bAllowScrollY: false, // 是否允许scroll-view滚动
    nActiveTabIndex: 0,
    nTabBarOffsetTop: 0, // tabBar距离顶部的距离
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
  onReady() {
    // 更新tabBar距离顶部的距离
    this.fnUpdateTabBarOffsetTop();
  },
  // 监听页面滚动
  onPageScroll(e) {
    // 判断页面是否滚动带tabBar顶部
    if (e.scrollTop >= this.data.nTabBarOffsetTop) {
      // 将scroll-view设为可滚动（实现tabBar吸顶效果）
      this.setData({
        bAllowScrollY: true
      });
    } else {
      // 否则scroll-view设为不可滚动（释放tabBar吸顶效果）
      this.data.bAllowScrollY &&
        this.setData({
          bAllowScrollY: false
        });
    }
  },
  // 点击切换tab
  fnClickSwitchTab(e) {
    let oDataSet = e.currentTarget.dataset;
    this.setData({
      nActiveTabIndex: oDataSet.index
    });
  },
  // 更新tabBar距离顶部的距离
  fnUpdateTabBarOffsetTop() {
    let oQuery = wx.createSelectorQuery();
    oQuery
      .select('.tabbar-wrap')
      .boundingClientRect(res => {
        this.setData({
          nTabBarOffsetTop: res.top
        });
      })
      .exec();
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
        id: oItem.id,
        title: oItem.title,
        author: oItem.author,
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
