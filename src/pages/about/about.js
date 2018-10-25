import { version } from '../../utils/config';

Page({
  data: {
    aContentList: [
      {
        header: '当前版本',
        content: `v${version}`
      },
      {
        header: '项目开源主页',
        content: 'https://github.com/Lsnsh/cnode-wechat-applet'
      },
      {
        header: '关于CNode社区',
        content: 'https://cnodejs.org/about'
      }
    ]
  }
});
