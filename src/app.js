import './dc/index';
import moment from 'moment';

App({
  globalData: {},
  onLaunch() {
    this.fnInitMoment();
  },
  fnInitMoment() {
    moment.locale('zh-cn');
    wx.moment = moment;
  }
});
