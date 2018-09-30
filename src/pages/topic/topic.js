Page({
  data: {
    sTopicId: '', // 主题id
    oTopicDetail: {} // 主题详情
  },
  onLoad(options) {
    this.fnFetchTopicDetail(options.id);
    this.setData({
      sTopicId: options.id
    });
  },
  onPullDownRefresh() {
    this.fnFetchTopicDetail(this.data.sTopicId);
  },
  onReachBottom() {},
  fnFetchTopicDetail(sTopicId) {
    if (!sTopicId) {
      return console.log('此话题不存在或已被删除。');
    }
    // 显示标题栏加载效果
    wx.showNavigationBarLoading();
    let oUrlData = {
      id: sTopicId
    };
    wx.dc.topic
      .detail(
        {
          urlData: oUrlData,
          data: {
            mdrender: false
          }
        },
        this.fnTopicDetailDataFormatter
      )
      .then(res => {
        console.log(res);
        if (res) {
          this.setData({
            oTopicDetail: res
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
  fnTopicDetailDataFormatter(oData = {}) {
    if (!oData.author) {
      oData.author = {};
    }
    let sTab = oData.top ? 'top' : oData.good ? 'good' : oData.tab;
    let oResult = {
      id: oData.id,
      tab: sTab,
      title: oData.title, // 主题标题
      loginname: oData.author.loginname, // 作者昵称
      avatar_url: oData.author.avatar_url, // 作者头像
      visit_count: oData.visit_count, // 浏览数
      is_collect: oData.is_collect, // 是否收藏
      create_at: wx.moment(oData.create_at).fromNow(), // 创建时间
      content: oData.content, // 主题内容
      replies: oData.replies, // 回复
      reply_count: oData.reply_count // 回复数
    };
    return oResult;
  }
});
