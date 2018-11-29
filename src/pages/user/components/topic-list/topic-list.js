Component({
  properties: {
    name: {
      type: String,
      value: ''
    },
    list: {
      type: Array,
      value: []
    }
  },
  methods: {
    // 点击用户头像
    fnTapAuthorAvatar(e) {
      let oDataSet = e.currentTarget.dataset;
      // 判断是否已经处于该用户的个人主页
      if (oDataSet.loginname === this.data.name) {
        // 终止执行，并留下一句话
        return wx.showToast({
          icon: 'none',
          title: '你一直都在，从未曾离开'
        });
      }
      // 跳转用户详情
      wx.navigateTo({
        url: `/pages/user/user?name=${oDataSet.loginname}`
      });
    },
    // 点击话题卡片
    fnTapTopicItem(e) {
      let oDataSet = e.currentTarget.dataset;
      // 跳转话题详情
      wx.navigateTo({
        url: `/pages/topic/topic?id=${oDataSet.id}`
      });
    }
  }
});
