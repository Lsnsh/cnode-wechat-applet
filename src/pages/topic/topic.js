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
  // 切换主题收藏状态
  fnTapSwitchTopicCollectStatus() {
    this.fnNetSwitchTopicCollectStatus(!this.data.oTopicDetail.is_collect);
  },
  // 切换主题收藏状态
  fnNetSwitchTopicCollectStatus(bIsCollect) {
    // 显示标题栏加载效果
    wx.showNavigationBarLoading();
    wx.dc.topicCollect[bIsCollect ? 'collect' : 'deCollect']({
      data: {
        accesstoken: wx.getStorageSync('accesstoken'),
        topic_id: this.data.sTopicId
      }
    })
      .then(() => {
        this.setData({
          'oTopicDetail.is_collect': bIsCollect
        });
        wx.hideNavigationBarLoading();
      })
      .catch(() => {
        wx.hideNavigationBarLoading();
      });
  },
  // 获取主题详情
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
    if (!oData.replies || !Array.isArray(oData.replies)) {
      oData.replies = [];
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
      reply_count: oData.reply_count // 回复数
    };
    // 回复列表
    oResult.replies = oData.replies.map(oItem => {
      return {
        avatar_url: oItem.author.avatar_url, // 评论者头像
        loginname: oItem.author.loginname, // 评论者名称
        create_at: wx.moment(oItem.create_at).format('YYYY-MM-DD HH:mm:ss'), // 创建时间
        content: oItem.content, // 评论内容
        ups: oItem.ups // 点赞信息
      };
    });
    return oResult;
  }
});
