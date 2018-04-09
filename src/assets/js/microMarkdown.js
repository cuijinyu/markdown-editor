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
  lists: /^(((\s*)((\*|\-)|\d(\.|\))) [^\n]+)\n)+/gm,
  bolditalic:/(?:([\*_~]{1,3}))([^\*_~\n]+[^\*_~\s])\1/g
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


function creatList(indentContent){
  let section = "";
  if(indentContent.length == 0){
    return '';
  }
  for(let i = 0;i < indentContent.length;i++){
    section += `<li>${indentContent.shift()}</li>`;
  }
    section = `<ul>${section}</ul>`;
    console.log(section);
    return section;
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
     * code
     */
    while((regResult = rules.code.exec(text))!==null){
      let content = regResult[1];
      text = text.replace(regResult[0],`<pre><code>${content}</code></pre>`);
    }

    /**
     * head
     */
    let regResult,
        maxIndent = -1, // 记录最大缩进
        indentCount = 0, // 记录缩进层数
        indentContent = []; // 记录每层的内容

    while((regResult = rules.headline.exec(text))!==null){
      let count = regResult[1].length;
      let content = escape(regResult[2]);
      text = text.replace(regResult[0],`<h${count}  class="markdown" data-v-2bc4b246>${content}</h${count}>`);
    }



    /**
     * bold and italic
     */
    while((regResult = rules.bolditalic.exec(text)) !== null){
      let content = regResult[2],
        type = regResult[1];
      if(type == "~~"){
        text = text.replace(regResult[0],`<del>${content}</del>`);
      }
      else{
        switch(type.length){
          case 1:
            text = text.replace(regResult[0],`<i>${content}</i>`);
            break;
          case 2:
            text = text.replace(regResult[0],`<b>${content}</b>`);
            break;
          case 3:
            text = text.replace(regResult[0],`<i><b>${content}</b></i>`);
            break;
        }
      }
    }


    /**
     * breaker
     */
    while((regResult = rules.breaker.exec(text)) !== null){
      text = text.replace(regResult[0],`<div class="breaker" data-v-2bc4b246></div>`)
    }

    /**
     * pics
     * 因为图片的匹配规则和链接匹配规则接近但更加复杂，所以，先匹配图片
     */
    while((regResult = rules.pics.exec(text)) !== null){
      let href = regResult[1],
        name = escape(regResult[2]);
      text = text.replace(regResult[0],`<img href="${href}" title="${name}" alt="${name}"></img>`)
    }

    /**
     * link
     */
    while((regResult = rules.link.exec(text)) !== null){
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

    /**
     * 对列表的处理，此处涉及对嵌套的处理
     */
    while((regResult = rules.lists.exec(text)) !== null){
        let type = regResult[4];
        let content = regResult[2]; // 存储字符内容

        if(typeof type.slice(0,1) == "string"){
          /**
           * 当类型为无序列表时
           */
            if(regResult[3].length > maxIndent){
              maxIndent = regResult[3].length;
              indentCount ++;
              indentContent.push(content.replace(regResult[4],""));
              text = text.replace(regResult[0],creatList(indentContent));
            }else{
              maxIndent = -1;
              indentCount = 0;
              text = text.replace(regResult[0],creatList(indentContent));
            }

        }else if(typeof type.slice(0,1) == "number"){
          /**
           * 当类型是有序列表时
           */

        }

    }

    creatList(indentContent);

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
