Page({
  data: {
    bIsReady: false, // 页面是否准备就绪
    aHasReadMessageList: [], // 已读消息列表
    aHasNotReadMessageList: [] // 未读消息列表
  },
  onLoad() {
    this.fnNetRAllMessage();
  },
  // 处理已读消息事件
  fnHandleHasReadMessageEvent(e) {
    // 根据子组件传递的msg_id，将未读消息列表中，将该消息移至已读消息列表中
    this.data.aHasReadMessageList.unshift(...this.data.aHasNotReadMessageList.filter(oItem => oItem.id === e.detail.msg_id));
    setTimeout(() => {
      this.setData({
        aHasReadMessageList: this.data.aHasReadMessageList,
        aHasNotReadMessageList: this.data.aHasNotReadMessageList.filter(oItem => oItem.id !== e.detail.msg_id)
      });
    }, 200);
  },
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
