import { fnCheckLogin } from '../../utils/util';

Page({
  data: {
    bIsReady: false, // 页面是否准备就绪
    sTopicId: '', // 主题id
    oUserInfo: {}, // 当前登录用户的基本信息
    oTopicDetail: {} // 主题详情
  },
  onLoad(options) {
    this.fnFetchTopicDetail(options.id);
    this.setData({
      sTopicId: options.id,
      oUserInfo: wx.getStorageSync('oUserInfo') || {}
    });
  },
  onShow() {
    // 页面未准备就绪时，不重新刷新主题信息
    if (this.data.bIsReady) {
      this.fnFetchTopicDetail(this.data.sTopicId, true);
    }
  },
  onPullDownRefresh() {
    this.fnFetchTopicDetail(this.data.sTopicId);
  },
  onReachBottom() {},
  onShareAppMessage() {
    return {
      title: this.data.oTopicDetail.title,
      path: `/pages/topic/topic?id=${this.data.sTopicId}`
    };
  },
  // 切换主题收藏状态
  fnTapSwitchTopicCollectStatus() {
    // 先检查用户登录状态
    if (fnCheckLogin()) {
      this.fnNetSwitchTopicCollectStatus(!this.data.oTopicDetail.is_collect);
    }
  },
  // 切换评论的点赞状态
  fnTapLikeCommentOrDislike(e) {
    // 先检查用户登录状态
    if (fnCheckLogin()) {
      let oDataSet = e.currentTarget.dataset;
      this.fnNetLikeCommentOrDislike(oDataSet.id, oDataSet.index);
    }
  },
  // 切换评论的点赞状态
  fnNetLikeCommentOrDislike(sCommentId, nCommentIndex) {
    // 显示标题栏加载效果
    wx.showNavigationBarLoading();
    wx.dc.reply
      .likeOrDislike({
        urlData: {
          reply_id: sCommentId
        }
      })
      .then(res => {
        let aCommentUps = this.data.oTopicDetail.replies[nCommentIndex].ups,
          oUpdateData = {};
        // 点赞评论
        if (res.action === 'up') {
          // 将当前用户id，加入到该评论的点赞者列表中
          aCommentUps.push(this.data.oUserInfo.id);
          oUpdateData = {
            [`oTopicDetail.replies[${nCommentIndex}].is_uped`]: true,
            [`oTopicDetail.replies[${nCommentIndex}].ups`]: aCommentUps
          };
        }
        // 取消点赞评论
        if (res.action === 'down') {
          // 将当前用户id，从该评论的点赞者列表中移除
          aCommentUps = aCommentUps.filter(sUserId => sUserId !== this.data.oUserInfo.id);
          oUpdateData = {
            [`oTopicDetail.replies[${nCommentIndex}].is_uped`]: false,
            [`oTopicDetail.replies[${nCommentIndex}].ups`]: aCommentUps
          };
        }
        // 更新data数据
        this.setData(oUpdateData);
        wx.hideNavigationBarLoading();
      })
      .catch(() => {
        wx.hideNavigationBarLoading();
      });
  },
  // 切换主题收藏状态
  fnNetSwitchTopicCollectStatus(bIsCollect) {
    // 显示标题栏加载效果
    wx.showNavigationBarLoading();
    wx.dc.topicCollect[bIsCollect ? 'collect' : 'deCollect']({
      data: {
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
  fnFetchTopicDetail(sTopicId, bIsOnShow) {
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
        this.fnTopicDetailDataModel
      )
      .then(res => {
        if (res) {
          // 页面onShow时，更新主题部分信息
          if (bIsOnShow) {
            // TODO: 增量更新评论列表数据
            this.setData({
              'oTopicDetail.tab': res.top ? 'top' : res.good ? 'good' : res.tab,
              'oTopicDetail.visit_count': res.visit_count,
              'oTopicDetail.is_collect': res.is_collect
            });
          } else {
            this.setData({
              bIsReady: true,
              oTopicDetail: res
            });
          }
        }
        // 主题内容渲染需要一些时间，延长loading状态
        setTimeout(() => {
          // 停止加载效果
          wx.stopPullDownRefresh();
          wx.hideNavigationBarLoading();
        }, 100);
      })
      .catch(() => {
        this.setData({
          bIsReady: true
        });
        // 停止加载效果
        wx.stopPullDownRefresh();
        wx.hideNavigationBarLoading();
      });
  },
  fnTopicDetailDataModel(oData = {}) {
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
      reply_count: oData.reply_count // 评论数
    };
    // 评论列表
    oResult.replies = oData.replies.map(oItem => {
      return {
        is_uped: oItem.is_uped, // 当前登录用户是否点赞该评论
        id: oItem.id, // 评论id
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
