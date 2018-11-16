Page({
  data: {
    bIsReady: false, // 页面是否准备就绪
    aHasReadMessageList: [], // 已读消息列表
    aHasNotReadMessageList: [] // 未读消息列表
  },
  onLoad() {
    this.fnNetRAllMessage();
  },
  // 点击已读消息
  fnTapHasNotReadMessageItem(e) {
    let oDataSet = e.currentTarget.dataset;
    // 将该消息标记为已读
    this.fnNetMarkOneMessage(oDataSet.msgId);
  },
  // 标记单个消息为已读
  fnNetMarkOneMessage(sMessageId) {},
  // 获取所有消息（包含已读和未读消息）
  fnNetRAllMessage() {
    // 显示标题栏加载效果
    wx.showNavigationBarLoading();
    wx.dc.message
      .list(
        {
          data: {
            mdrender: false
          }
        },
        this.fnAllMessageDataModel
      )
      .then(res => {
        this.setData({
          bIsReady: true,
          aHasReadMessageList: res.aHasReadMessageList,
          aHasNotReadMessageList: res.aHasNotReadMessageList
        });
        // 停止加载效果
        wx.stopPullDownRefresh();
        wx.hideNavigationBarLoading();
      })
      .catch(err => {
        this.setData({
          bIsReady: true
        });
        // 停止加载效果
        wx.stopPullDownRefresh();
        wx.hideNavigationBarLoading();
      });
  },
  // 全部消息列表数据模型
  fnAllMessageDataModel(oData) {
    let oResult = {};
    if (!Array.isArray(oData.has_read_messages)) {
      oData.has_read_messages = [];
    }
    if (!Array.isArray(oData.hasnot_read_messages)) {
      oData.hasnot_read_messages = [];
    }
    oResult.aHasReadMessageList = oData.has_read_messages.map(oItem => {
      return {
        ...oItem,
        create_at: wx.moment(oItem.create_at).fromNow()
      };
    });
    oResult.aHasNotReadMessageList = oData.hasnot_read_messages.map(oItem => {
      return {
        ...oItem,
        create_at: wx.moment(oItem.create_at).fromNow()
      };
    });
    return oResult;
  }
});
