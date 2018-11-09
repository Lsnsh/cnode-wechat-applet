Page({
  data: {
    bIsReady: false, // 页面是否准备就绪
    bIsFetchingTopicList: false, // 是否正在获取专题列表数据
    nActiveTabIndex: 0, // 当前处于活动状态的tab
    nContentLen: 60, // 主题卡片显示正文的长度
    aTabBarList: [
      {
        text: '全部',
        tab: ''
      },
      {
        text: '精华',
        tab: 'good'
      },
      {
        text: '分享',
        tab: 'share'
      },
      {
        text: '问答',
        tab: 'ask'
      },
      {
        text: '招聘',
        tab: 'job'
      }
    ], // tab列表
    aTopicList: [], // 主题列表
    oTopicListReqParams: {
      tab: '', // 主题分类。目前有 ask share job good
      page: 1, // 页数
      limit: 10, // 每一页的主题数量
      mdrender: 'true' // 当为 'false' 时，不渲染。默认为 'true'，渲染出现的所有 markdown 格式文本。
    }
  },
  onLoad() {
    // 获取主题列表数据
    this.fnNetRTopicList();
  },
  onPullDownRefresh() {
    // 下拉刷新时，将页码重置为1
    this.data.oTopicListReqParams.page = 1;
    this.setData({
      oTopicListReqParams: this.data.oTopicListReqParams
    });
    // 获取主题列表数据
    this.fnNetRTopicList();
  },
  onReachBottom() {
    // 下滑加载时，将页码累加
    this.data.oTopicListReqParams.page++;
    this.setData({
      'oTopicListReqParams.page': this.data.oTopicListReqParams.page
    });
    // 追加主题列表数据
    this.fnNetRTopicList(1);
  },
  onShareAppMessage() {
    return {
      title: 'CNode 社区第三方版',
      path: '/pages/index/index'
    };
  },
  // 切换tab选项卡
  fnTapSwitchTab(e) {
    let oDataSet = e.currentTarget.dataset;
    // 更新tab相关数据
    this.setData({
      nActiveTabIndex: oDataSet.index,
      'oTopicListReqParams.tab': oDataSet.tab,
      'oTopicListReqParams.page': 1
    });
    // 更新主题列表数据
    this.fnNetRTopicList(2);
  },
  // 过滤html标签
  fnFilterHtmlTag(sText = '') {
    let sNewText = sText.replace(/<\/?[^>]*>/g, '');
    return sNewText;
  },
  // 格式化主题内容为摘要形式
  fnFmtTopicContentToSummary(sContent, nContentLen = 60) {
    sContent = this.fnFilterHtmlTag(sContent);
    // 将主题内容，截取指定长度字符作为摘要
    return sContent.slice(0, nContentLen);
  },
  /**
   * 获取主题列表
   * @param {Number} nFetchScene 列表数据获取的场景值
   * 0 => 正常获取 1 => 页面触底后获取 2 => 切换tab后获取
   */
  fnNetRTopicList(nFetchScene = 0) {
    this.setData({
      bIsFetchingTopicList: true
    });
    // 显示标题栏加载效果
    wx.showNavigationBarLoading();
    wx.dc.topic
      .list(this.data.oTopicListReqParams, this.fnTopicListDataModel)
      .then(res => {
        if (res) {
          let aNewTopicList = res;
          // 根据场景值不同做不同的处理
          if (nFetchScene === 1) {
            // 将现有主题列表与刚获取到主题列表数据合并
            aNewTopicList = this.data.aTopicList.concat(aNewTopicList);
          }
          this.setData({
            aTopicList: aNewTopicList
          });
          if (nFetchScene === 2) {
            // 切换tab后，页面滚动到顶部
            wx.pageScrollTo({ scrollTop: 0, duration: 0 });
          }
        }
        // 停止加载效果
        wx.stopPullDownRefresh();
        wx.hideNavigationBarLoading();
        this.setData({
          bIsReady: true,
          bIsFetchingTopicList: false
        });
      })
      .catch(() => {
        // 停止加载效果
        wx.stopPullDownRefresh();
        wx.hideNavigationBarLoading();
        this.setData({
          bIsReady: true,
          bIsFetchingTopicList: false
        });
      });
  },
  // 主题列表数据模型
  fnTopicListDataModel(aList) {
    let aTopicList = [];
    if (!aList || (aList && !Array.isArray(aList))) {
      aList = [];
    }
    aTopicList = aList.map(oItem => {
      if (!oItem.author) {
        oItem.author = {};
      }
      let sTab = oItem.top ? 'top' : oItem.good ? 'good' : oItem.tab;
      return {
        id: oItem.id, // id
        tab: sTab, // 分类
        reply_count: oItem.reply_count, // 回复数
        visit_count: oItem.visit_count, // 访问数
        last_reply_at: wx.moment(oItem.last_reply_at).fromNow(), // 最后一次回复时间
        title: oItem.title, // 标题
        content: this.fnFmtTopicContentToSummary(oItem.content, this.data.nContentLen), // 内容
        avatar_url: oItem.author.avatar_url, // 作者头像
        loginname: oItem.author.loginname, // 作者名称
        create_at: wx.moment(oItem.create_at).format('YYYY-MM-DD HH:mm:ss') // 创建时间
      };
    });
    return aTopicList;
  }
});
