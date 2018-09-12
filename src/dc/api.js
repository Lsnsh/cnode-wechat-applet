import Base from './base';
import fnDataProcess from './util';

// 主题相关接口
export class Topic extends Base {
  constructor() {
    super();
    this.sListUrl = '/topics';
  }
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
}
