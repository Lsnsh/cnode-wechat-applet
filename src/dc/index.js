import { Topic, TopicCollect } from './api';

wx.initDataCenter = function() {
  wx.dc = {
    topic: new Topic(),
    topicCollect: new TopicCollect()
  };
};

wx.initDataCenter();
