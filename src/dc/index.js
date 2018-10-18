import { Topic, TopicCollect, User } from './api';

wx.initDataCenter = function() {
  wx.dc = {
    topic: new Topic(),
    topicCollect: new TopicCollect(),
    user: new User()
  };
};

wx.initDataCenter();
