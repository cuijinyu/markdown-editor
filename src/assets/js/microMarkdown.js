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
  bolditalic:/(?:([\*_~]{1,3}))([^\*_~\n]+[^\*_~\s])\1/g,
  latex:/\$\$(.*)\$\$/
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
      text = text.replace(regResult[0],`<img href="${href}" title="${name}" alt="${name}" src="${href}"></img>`)
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
        indentContent = [];
        let type = regResult[4];
        let content = regResult[2]; // 存储字符内容

        let lis = regResult[0];
        lis = lis.split("\n");

        let section = "";
        for(let i = 0;i < lis.length;i++){
          /**
           * 对列表中的每一项进行正则检验
           * @type {RegExp}
           */
          let creatRules = /(\s*)([\*-]+|[0-9].*)(.*)/;
          let result = creatRules.exec(lis[i]);

          //如果符合正则规则
          if(result !== null){
            /**
             * 那么将该部分加入数组中
             */
            indentContent.push({
              content:result[3],
              space:result[1].length,
              used:false
            })
          }
          let temp;//临时变量外置
          for(let i = 0;i < indentContent.length;i ++){
            temp = indentContent[i];
            //如果之前有使用过，那么只需要加结尾
            if(temp.used == true){
              section += `<li>${temp.content}</li></ul>`;
              continue;
            }else{

              if(indentContent.length == 1){
                console.log(indentContent.length)
                section += `<ul><li>${temp.content}</li></ul>`;
                break;
              }

              for(let j = i+1;j < indentContent.length;j ++){
                if(indentContent[j].space >= temp.space){
                  //如果是相同长度的缩进
                  if(temp.space == indentContent[j].space && indentContent[j].used == false){
                    indentContent[j].used = true;
                    section+=`<ul><li>${temp.content}</li>`;
                    continue;
                  }else{
                    let flag = false;
                    for(let k = i;k < indentContent.length;k ++){
                      if(temp.length > indentContent[j].length){
                        flag = true;
                      }
                    }
                    if(flag){
                      section += `<ul>${temp.content}`;
                      continue;
                    }else{
                      section += `<ul><li>${temp.content}</li></ul>`;
                    }
                  }
                }else{

                }
              }


            }
          }
          text = text.replace(regResult[0],section);
        }

    }

    /**
     * LaTex
     */
    while((regResult = rules.latex.exec(text)) !== null){
      /**
       * 处理latex公式时使用第三方网站，不使用本地工具了
       */
      let content = regResult[1];
      text = text.replace(regResult[0],`<img src="http://latex.codecogs.com/gif.latex?${content}">`);
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
