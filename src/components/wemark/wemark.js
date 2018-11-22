const parser = require('./parser');
const getRichTextNodes = require('./richtext').getRichTextNodes;

Component({
  properties: {
    md: {
      type: String,
      value: '',
      observer() {
        this.parseMd();
      }
    },
    type: {
      type: String,
      value: 'wemark'
    },
    link: {
      type: Boolean,
      value: false
    },
    highlight: {
      type: Boolean,
      value: false
    }
  },
  data: {
    parsedData: {},
    richTextNodes: []
  },
  methods: {
    parseMd() {
      if (this.data.md) {
        var parsedData = parser.parse(this.data.md, {
          link: this.data.link,
          handleLink: this.fnHandleLink,
          highlight: this.data.highlight
        });
        if (this.data.type === 'wemark') {
          this.setData({
            parsedData
          });
        } else {
          // var inTable = false;
          var richTextNodes = getRichTextNodes(parsedData);
          this.setData({
            richTextNodes
          });
          /* // 分批更新
            var update = {};
            var batchLength = 1000;
            console.log(batchLength);
            for(var i=0; i<richTextNodes.length; i++){
              update['richTextNodes.' + i] = richTextNodes[i];
              if(i%batchLength === batchLength - 1){
                console.log(update);
                this.setData(update);
                update = {};
              }
            }
            this.setData(update);
            update = {}; 
          */
        }
      }
    },
    // 处理链接
    fnHandleLink(sUrl = '') {
      // 处理用户名
      return sUrl.replace(/^\/user\/(\w+)/, (match, $1) => {
        return `/pages/user/user?name=${$1}`;
      });
    }
  }
});
