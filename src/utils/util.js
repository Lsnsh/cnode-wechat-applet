const app = getApp();

// 检查登录状态，未登录会弹出模态框引导用户登录
export function fnCheckLogin() {
  let bIsLogin = app.globalData.bIsLogin;
  if (!bIsLogin) {
    wx.showModal({
      content: '该操作需要登录帐户，是否现在登录？',
      confirmText: '登录',
      success: res => {
        if (res.confirm) {
          wx.navigateTo({
            url: '/pages/login/login'
          });
        }
      },
      complete() {
        return false;
      }
    });
  } else {
    return true;
  }
}
