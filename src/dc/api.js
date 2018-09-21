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
