Component({
  properties: {
    data: {
      type: Object,
      value: {}
    }
  },
  data: {},
  methods: {
    // 点击消息卡片
    fnTapMessageItem() {
      // 判断该消息是否未读
      if (!this.data.data.has_read) {
        // 将该消息标记为已读
        this.fnNetMarkOneMessage(this.data.data.id);
      }
      wx.navigateTo({
        url: `/pages/topic/topic?id=${this.data.data.topic.id}`
      });
    },
    // 标记单个消息为已读
    fnNetMarkOneMessage(sMessageId) {
      // 显示标题栏加载效果
      wx.showNavigationBarLoading();
      wx.dc.message
        .mark({
          urlData: {
            msg_id: sMessageId
          }
        })
        .then(res => {
          if (res.marked_msg_id) {
            // 触发事件
            this.triggerEvent('read', {
              msg_id: res.marked_msg_id
            });
          }
          // 停止加载效果
          wx.stopPullDownRefresh();
          wx.hideNavigationBarLoading();
        })
        .catch(err => {
          // 停止加载效果
          wx.stopPullDownRefresh();
          wx.hideNavigationBarLoading();
        });
    }
  }
});
