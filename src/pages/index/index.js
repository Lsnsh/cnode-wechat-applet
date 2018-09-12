Page({
  data: {
    aTopicList: [] // 主题列表
  },
  onLoad() {
    // 获取主题列表数据
    this.fnNetRTopicList();
  },
  onPullDownRefresh() {
    // 获取主题列表数据
    this.fnNetRTopicList();
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
  // 获取主题列表
  fnNetRTopicList() {
    // 显示标题栏加载效果
    wx.showNavigationBarLoading();
    wx.dc.topic
      .list({}, this.fnTopicListDataFormatter)
      .then(res => {
        if (res) {
          this.setData({
            aTopicList: res
          });
        }
        // 停止加载效果
        wx.stopPullDownRefresh();
        wx.hideNavigationBarLoading();
      })
      .catch(() => {
        // 停止加载效果
        wx.stopPullDownRefresh();
        wx.hideNavigationBarLoading();
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
      let sContent = this.fnFmtTopicContentToSummary(oItem.content);
      return {
        tab: oItem.tab, // 分类
        reply_count: oItem.reply_count, // 回复数
        visit_count: oItem.visit_count, // 访问数
        last_reply_at: oItem.last_reply_at, // 最后一次回复时间
        title: oItem.title, // 标题
        content: sContent, // 内容
        avatar_url: oItem.author.avatar_url, // 作者头像
        loginname: oItem.author.loginname, // 作者名称
        create_at: oItem.create_at // 创建时间
      };
    });
    return aTopicList;
  }
});
