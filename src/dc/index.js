import { Topic } from './api';

wx.initDataCenter = function() {
  wx.dc = {
    topic: new Topic()
  };
};

wx.initDataCenter();
