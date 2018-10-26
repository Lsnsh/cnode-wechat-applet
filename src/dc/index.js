import { Topic, TopicCollect, Reply, User } from './api';

wx.initDataCenter = function() {
  wx.dc = {
    topic: new Topic(),
    topicCollect: new TopicCollect(),
    reply: new Reply(),
    user: new User()
  };
};

wx.initDataCenter();
