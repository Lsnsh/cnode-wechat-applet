import Base from './base';
import fnDataProcess from './util';

// 主题相关接口
export class Topic extends Base {
  constructor() {
    super();
    this.sListUrl = '/topics';
    this.sDetailUrl = '/topic/:id';
  }
  /**
   * 主题列表
   * @param {Object} oData
   * get 参数
   * page Number 页数
   * tab String 主题分类。目前有 ask share job good
   * limit Number 每一页的主题数量
   * mdrender String 当为 false 时，不渲染。默认为 true，渲染出现的所有 markdown 格式文本。
   * @param {Function} fnDataFormatter 数据格式化函数
   */
  list(oData = {}, fnDataFormatter) {
    return fnDataProcess(
      {
        url: this.sListUrl,
        method: 'get',
        data: oData
      },
      fnDataFormatter
    );
  }
  /**
   * 主题详情
   * @param {Object} oOption
   * get 参数
   * mdrender String 当为 false 时，不渲染。默认为 true，渲染出现的所有 markdown 格式文本。
   * accesstoken String 当需要知道一个主题是否被特定用户收藏以及对应评论是否被特定用户点赞时，才需要带此参数。会影响返回值中的 is_collect 以及 replies 列表中的 is_uped 值。
   * @param {Function} fnDataFormatter
   */
  detail(oOption = {}, fnDataFormatter) {
    return fnDataProcess(
      {
        url: this.sDetailUrl,
        method: 'get',
        ...oOption
      },
      fnDataFormatter
    );
  }
}

// 主题收藏
export class TopicCollect extends Base {
  constructor() {
    super();
    this.sListUrl = '/topic_collect/:loginname';
    this.sCollectUrl = '/topic_collect/collect';
    this.sDeCollectUrl = '/topic_collect/de_collect';
  }
  /**
   * 用户所收藏的主题列表
   * @param {Object} oOption
   * @param {Function} fnDataFormatter
   */
  list(oOption = {}, fnDataFormatter) {
    return fnDataProcess(
      {
        url: this.sListUrl,
        method: 'post',
        ...oOption
      },
      fnDataFormatter
    );
  }
  /**
   * 收藏主题
   * post 参数
   * accesstoken String 用户的 accessToken
   * topic_id String 主题的id
   * @param {Object} oOption
   * @param {Function} fnDataFormatter
   */
  collect(oOption = {}, fnDataFormatter) {
    return fnDataProcess(
      {
        url: this.sCollectUrl,
        method: 'post',
        ...oOption
      },
      fnDataFormatter
    );
  }
  /**
   * 取消收藏主题
   * 接收 post 参数
   * accesstoken String 用户的 accessToken
   * topic_id String 主题的id
   * @param {Object} oOption
   * @param {Function} fnDataFormatter
   */
  deCollect(oOption = {}, fnDataFormatter) {
    return fnDataProcess(
      {
        url: this.sDeCollectUrl,
        method: 'post',
        ...oOption
      },
      fnDataFormatter
    );
  }
}

export class User extends Base {
  constructor() {
    super();
    this.sAuthUrl = '/accesstoken';
    this.sDetailUrl = '/user/:loginname';
  }
  /**
   * 身份验证
   * 接收 post 参数
   * accesstoken String 用户的 accessToken
   * 如果成功匹配上用户，返回用户信息。否则 403
   * @param {Object} oOption
   * @param {Function} fnDataFormatter
   */
  auth(oOption = {}, fnDataFormatter) {
    return fnDataProcess(
      {
        url: this.sAuthUrl,
        method: 'post',
        ...oOption
      },
      fnDataFormatter
    );
  }
  /**
   * 用户详情
   * url path 参数
   * loginname String 用户名称
   * @param {Object} oOption
   * @param {Function} fnDataFormatter
   */
  detail(oOption = {}, fnDataFormatter) {
    return fnDataProcess(
      {
        url: this.sDetailUrl,
        method: 'get',
        ...oOption
      },
      fnDataFormatter
    );
  }
}
