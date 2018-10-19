Page({
  data: {
    bIsReady: false, // 页面是否准备就绪
    aTopicList: [], // 主题列表
    oTopicListReqParams: {
      tab: '', // 页数
      page: 1, // 主题分类。目前有 ask share job good
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
      oTopicListReqParams: this.data.oTopicListReqParams
    });
    // 追加主题列表数据
    this.fnNetRTopicList(true);
  },
  // 过滤html标签
  fnFilterHtmlTag(sText = '') {
    let sNewText = sText.replace(/<\/?[^>]*>/g, '');
    return sNewText;
  },
  // 格式化主题内容为摘要形式
  fnFmtTopicContentToSummary(sContent, nLen = 120) {
    sContent = this.fnFilterHtmlTag(sContent);
    // 将主题内容，截取指定长度字符作为摘要
    return sContent.slice(0, nLen);
  },
  /**
   * 获取主题列表
   * @param {Boolean} bIsAppendTopicList 是否追加主题列表数据
   */
  fnNetRTopicList(bIsAppendTopicList = false) {
    // 显示标题栏加载效果
    wx.showNavigationBarLoading();
    wx.dc.topic
      .list(this.data.oTopicListReqParams, this.fnTopicListDataFormatter)
      .then(res => {
        if (res) {
          let aNewTopicList = res;
          if (bIsAppendTopicList) {
            // 将现有主题列表与刚获取到主题列表数据合并
            aNewTopicList = this.data.aTopicList.concat(aNewTopicList);
          }
          this.setData({
            aTopicList: aNewTopicList
          });
        }
        // 停止加载效果
        wx.stopPullDownRefresh();
        wx.hideNavigationBarLoading();
        this.setData({
          bIsReady: true
        });
      })
      .catch(() => {
        // 停止加载效果
        wx.stopPullDownRefresh();
        wx.hideNavigationBarLoading();
        this.setData({
          bIsReady: true
        });
      });
  },
  // 主题列表数据适配器
  fnTopicListDataFormatter(aList) {
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
        content: this.fnFmtTopicContentToSummary(oItem.content), // 内容
        avatar_url: oItem.author.avatar_url, // 作者头像
        loginname: oItem.author.loginname, // 作者名称
        create_at: wx.moment(oItem.create_at).format('YYYY-MM-DD HH:mm:ss') // 创建时间
      };
    });
    return aTopicList;
  }
});
