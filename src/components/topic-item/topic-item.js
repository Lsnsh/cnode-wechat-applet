Component({
  properties: {
    data: {
      type: Object,
      value: {}
    }
  },
  data: {},
  methods: {
    // 点击跳转话题详情
    fnTapJumpTopicDetail() {
      wx.navigateTo({
        url: `/pages/topic/topic?id=${this.data.data.id}`
      });
    },
    // 点击跳转用户个人主页
    fnTapJumpUserProfile() {
      wx.navigateTo({
        url: `/pages/user/user?name=${this.data.data.loginname}`
      });
    }
  }
});
