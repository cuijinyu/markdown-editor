/**
 *
 * @type {{headline: RegExp, code: RegExp, breaker: RegExp, list: RegExp, link: RegExp, pics: RegExp, mail: RegExp, quote: RegExp, text: RegExp, def: RegExp, lists: RegExp}}
 */
const rules = {
  headline:/(\#{1,6})([^\#\n]+)$/m,//m表示多行
  code:/\s```\n?([^`]+)```/g,
  breaker:/(^--+)|(\n--+)/g,
  list:/([-+*]{1})(.[^\*]*)?/g,
  link:/\[(.*)\]\((.*)\)/g,
  pics:/!\[(.*)\]\((.*)\)/g,
  mail:/<(([a-z0-9_\-\.])+\@([a-z0-9_\-\.])+\.([a-z]{2,7}))>/gmi,
  quote:/^( *>[^\n]+(\n(?!)[^\n]+)*\n*)+/,
  text:/(^[^\n<](.+)([^>])$)/,
  def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +["(]([^\n]+)[")])? *(?:\n+|$)/,
  lists: /^((\s*((\*|\-)|\d(\.|\))) [^\n]+)\n)+/gm,
};

/**
 * 对html中特殊字符的转义
 * @param html
 * @returns {string}
 */
function escape(html) {
  if(html && html.length > 0){
    return html.replace(/&(?!#?\w+;)/,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;')
      .replace(/'/g,'&#39');
  }else
    return '';
}

/**
 * 换行处理
 * <br>标签会出现行距问题，相比较来说div既是块级元素，同时没有默认的高度，最适合处理换行问题
 */
function creatBr(text){
  let reg = /.*(\n).*?/,regRe;
  while((regRe = reg.exec(text))!==null){
    text = text.replace(regRe[1],`<div></div>`);
  }
  return text;
}


class Parser{
  constructor(content){
    if(!content){
      throw "请给构造器传入有效的数据";
    }else{
      this.content = content;
      this.result = Parser.parse(this.content);
    }
  }
  static parse(text){
    /**
     * head
     */
    let regResult;

    while((regResult = rules.headline.exec(text))!==null){
      console.log("I am in here----->>>>head")
      let count = regResult[1].length;
      let content = escape(regResult[2]);
      text = text.replace(regResult[0],`<h${count}  class="markdown" data-v-2bc4b246>${content}</h${count}>`);
    }

    /**
     * code
     */
    while((regResult = rules.code.exec(text))!==null){
      console.log("I am in here----->>>>code");
      let content = regResult[1];
      text = text.replace(regResult[0],`<pre><code>${content}</code></pre>`);
    }

    /**
     * breaker
     */
    while((regResult = rules.breaker.exec(text)) !== null){
      console.log("I am in here----->>>>break");
      text = text.replace(regResult[0],`<div class="breaker" data-v-2bc4b246></div>`)
    }

    /**
     * pics
     * 因为图片的匹配规则和链接匹配规则接近但更加复杂，所以，先匹配图片
     */
    while((regResult = rules.pics.exec(text)) !== null){
      console.log("I am in here----->>>>pic");
      let href = regResult[1],
        name = escape(regResult[2]);
      text = text.replace(regResult[0],`<img href="${href}" title="${name}" alt="${name}"></img>`)
    }

    /**
     * link
     */
    while((regResult = rules.link.exec(text)) !== null){
      console.log("I am in here----->>>>link");
      let href = regResult[1],
        name = escape(regResult[2]);
      text = text.replace(regResult[0],`<a href="${href}">${name}</a>`);
    }

    /**
     * quote
     */
    while((regResult = rules.quote.exec(text)) !== null){
        let content = regResult[1];
        content = content.replace(">","");
        text = text.replace(regResult[0],`<div style="width:95%;padding-top: 10px;padding-bottom:10px;padding-left:5px;background-color:grey;border-left:5px solid lightgreen;border-radius:5px;margin:5px;margin-right:5px;word-wrap: break-word;"><quote data-v-2bc4b246>${content}</quote></div>`)
    }

    // while((regResult = rules.text.exec(text)) !== null){
    //   console.log("I am in here----->text");
    //   let content = regResult[1];
    //   text = text.replace(regResult[0], `<p>${content}</p>`);
    // }

    /**
     * 对列表的处理，此处涉及对嵌套的处理
     */
    while((regResult = rules.lists.exec(text)) !== null){

    }
    /**
     * 处理换行
     */
    text = creatBr(text);
    return text;
  }
  getResult(){
    return this.result;
  }
}

export {Parser};
