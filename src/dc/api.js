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
   * @param {Function} fnDataModel 自定义数据模型函数
   */
  list(oData = {}, fnDataModel) {
    return fnDataProcess(
      {
        url: this.sListUrl,
        method: 'get',
        data: oData
      },
      fnDataModel
    );
  }
  /**
   * 主题详情
   * @param {Object} oOption
   * get 参数
   * mdrender String 当为 false 时，不渲染。默认为 true，渲染出现的所有 markdown 格式文本。
   * accesstoken String 当需要知道一个主题是否被特定用户收藏以及对应评论是否被特定用户点赞时，才需要带此参数。会影响返回值中的 is_collect 以及 replies 列表中的 is_uped 值。
   * @param {Function} fnDataModel
   */
  detail(oOption = {}, fnDataModel) {
    return fnDataProcess(
      {
        url: this.sDetailUrl,
        method: 'get',
        ...oOption
      },
      fnDataModel
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
   * @param {Function} fnDataModel
   */
  list(oOption = {}, fnDataModel) {
    return fnDataProcess(
      {
        url: this.sListUrl,
        method: 'get',
        ...oOption
      },
      fnDataModel
    );
  }
  /**
   * 收藏主题
   * post 参数
   * accesstoken String 用户的 accessToken
   * topic_id String 主题的id
   * @param {Object} oOption
   * @param {Function} fnDataModel
   */
  collect(oOption = {}, fnDataModel) {
    return fnDataProcess(
      {
        url: this.sCollectUrl,
        method: 'post',
        ...oOption
      },
      fnDataModel
    );
  }
  /**
   * 取消收藏主题
   * 接收 post 参数
   * accesstoken String 用户的 accessToken
   * topic_id String 主题的id
   * @param {Object} oOption
   * @param {Function} fnDataModel
   */
  deCollect(oOption = {}, fnDataModel) {
    return fnDataProcess(
      {
        url: this.sDeCollectUrl,
        method: 'post',
        ...oOption
      },
      fnDataModel
    );
  }
}

// 评论
export class Reply extends Base {
  constructor() {
    super();
    this.sCreateUrl = '/topic/:topic_id/replies';
    this.sLikeOrDislikeUrl = '/reply/:reply_id/ups';
  }
  /**
   * 新建评论
   * post 参数
   * accesstoken String 用户的 accessToken
   * content String 评论的主体
   * reply_id String 如果这个评论是对另一个评论的回复，请务必带上此字段。这样前端就可以构建出评论线索图。
   * @param {Object} oOption
   * @param {Function} fnDataModel
   */
  create(oOption = {}, fnDataModel) {
    return fnDataProcess(
      {
        url: this.sCreateUrl,
        method: 'post',
        ...oOption
      },
      fnDataModel
    );
  }
  /**
   * 为评论点赞或取消点赞
   * 接受 post 参数
   * accesstoken String
   * 接口会自动判断用户是否已点赞，如果否，则点赞；如果是，则取消点赞。点赞的动作反应在返回数据的 action 字段中，up or down。
   * @param {Object} oOption
   * @param {Function} fnDataModel
   */
  likeOrDislike(oOption = {}, fnDataModel) {
    return fnDataProcess(
      {
        url: this.sLikeOrDislikeUrl,
        method: 'post',
        ...oOption
      },
      fnDataModel
    );
  }
}

// 用户
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
   * @param {Function} fnDataModel
   */
  auth(oOption = {}, fnDataModel) {
    return fnDataProcess(
      {
        url: this.sAuthUrl,
        method: 'post',
        ...oOption
      },
      fnDataModel
    );
  }
  /**
   * 用户详情
   * url path 参数
   * loginname String 用户名称
   * @param {Object} oOption
   * @param {Function} fnDataModel
   */
  detail(oOption = {}, fnDataModel) {
    return fnDataProcess(
      {
        url: this.sDetailUrl,
        method: 'get',
        ...oOption
      },
      fnDataModel
    );
  }
}

export class Message extends Base {
  constructor() {
    super();
    this.sListUrl = '/messages';
    this.sCountUrl = '/message/count';
    this.sMarkUrl = '/message/mark_one/:msg_id';
    this.sMarkAllUrl = '/message/mark_all';
  }
  /**
   * 获取全部消息（划分已读和未读消息）
   * 接收 get 参数
   * accesstoken String
   * mdrender String 当为 false 时，不渲染。默认为 true，渲染出现的所有 markdown 格式文本。
   * @param {Object} oOption
   * @param {Function} fnDataModel
   */
  list(oOption = {}, fnDataModel) {
    return fnDataProcess(
      {
        url: this.sListUrl,
        method: 'get',
        ...oOption
      },
      fnDataModel
    );
  }
  /**
   * 获取未读消息数
   * 接收 get 参数
   * accesstoken String
   * @param {Object} oOption
   * @param {Function} fnDataModel
   */
  count(oOption = {}, fnDataModel) {
    return fnDataProcess(
      {
        url: this.sCountUrl,
        method: 'get',
        ...oOption
      },
      fnDataModel
    );
  }
  /**
   * 标记单个消息为已读
   * 接收 post 参数
   * accesstoken String
   * @param {Object} oOption
   * @param {Function} fnDataModel
   */
  mark(oOption = {}, fnDataModel) {
    return fnDataProcess(
      {
        url: this.sMarkUrl,
        method: 'post',
        ...oOption
      },
      fnDataModel
    );
  }
  /**
   * 标记全部消息为已读
   * 接收 post 参数
   * accesstoken String
   * @param {Object} oOption
   * @param {Function} fnDataModel
   */
  markAll(oOption = {}, fnDataModel) {
    return fnDataProcess(
      {
        url: this.sMarkAllUrl,
        method: 'post',
        ...oOption
      },
      fnDataModel
    );
  }
}
