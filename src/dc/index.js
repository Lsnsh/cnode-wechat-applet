import { Topic, TopicCollect, Reply, User, Message } from './api';

wx.initDataCenter = function() {
  wx.dc = {
    topic: new Topic(),
    topicCollect: new TopicCollect(),
    reply: new Reply(),
    user: new User(),
    message: new Message()
  };
};

wx.initDataCenter();
