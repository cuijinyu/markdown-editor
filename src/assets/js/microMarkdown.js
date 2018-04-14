/**
 * 用来进行匹配的正则规则
 * @type {{headline: RegExp, code: RegExp, breaker: RegExp, list: RegExp, link: RegExp, pics: RegExp, mail: RegExp, quote: RegExp, text: RegExp, def: RegExp, lists: RegExp, bolditalic: RegExp, latex: RegExp}}
 */
const rules = {
  headline:/(\#{1,6})([^\#\n]+)$/m,//m表示多行
  code:/\s```\n?([^`]+)```/g,
  breaker:/(^--+)|(\n--+)/g,
  list:/([-+*]{1})(.[^\*]*)?/g,
  link:/\[(.*)\]\((.*)\)/g,
  pics:/!\[(.*)\]\((.*)\)/g,
  mail:/<(([a-z0-9_\-\.])+\@([a-z0-9_\-\.])+\.([a-z]{2,7}))>/gmi,
  quote:/^( *>[^\n]+(\n(?!)[^\n]+)*\n*)+/gm,
  text:/(?:^\n)?(^[^<|>][\u4e00-\u9fa5a-z0-9_\-\.\@\*\s]+)\n?$/gm,
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

class Parser {
  constructor(content) {
    if (!content) {
      throw "请给构造器传入有效的数据";
    } else {
      this.content = content;
      this.result = Parser.parse(this.content);
    }
  }

  static parse(text) {

    /**
     * code
     */
    while ((regResult = rules.code.exec(text)) !== null) {
      let content = regResult[1];
      text = text.replace(regResult[0], `<pre><code>${content}</code></pre>`);
    }

    /**
     * head
     */
    let regResult,
      maxIndent = -1, // 记录最大缩进
      indentCount = 0, // 记录缩进层数
      indentContent = []; // 记录每层的内容

    while ((regResult = rules.headline.exec(text)) !== null) {
      let count = regResult[1].length;
      let content = escape(regResult[2]);
      text = text.replace(regResult[0], `<h${count}  class="markdown" data-v-2bc4b246>${content}</h${count}>`);
    }


    /**
     * bold and italic
     */
    while ((regResult = rules.bolditalic.exec(text)) !== null) {
      let content = regResult[2],
        type = regResult[1];
      if (type == "~~") {
        text = text.replace(regResult[0], `<del>${content}</del>`);
      }
      else {
        switch (type.length) {
          case 1:
            text = text.replace(regResult[0], `<i>${content}</i>`);
            break;
          case 2:
            text = text.replace(regResult[0], `<b>${content}</b>`);
            break;
          case 3:
            text = text.replace(regResult[0], `<i><b>${content}</b></i>`);
            break;
        }
      }
    }


    /**
     * breaker
     */
    while ((regResult = rules.breaker.exec(text)) !== null) {
      text = text.replace(regResult[0], `<div class="breaker" data-v-2bc4b246></div>`)
    }

    /**
     * pics
     * 因为图片的匹配规则和链接匹配规则接近但更加复杂，所以，先匹配图片
     */
    while ((regResult = rules.pics.exec(text)) !== null) {
      let href = regResult[1],
        name = escape(regResult[2]);
      text = text.replace(regResult[0], `<img href="${href}" title="${name}" alt="${name}" src="${href}"></img>`)
    }

    /**
     * link
     */
    while ((regResult = rules.link.exec(text)) !== null) {
      let href = regResult[1],
        name = escape(regResult[2]);
      text = text.replace(regResult[0], `<a href="${href}">${name}</a>`);
    }


    /**
     * 对列表的处理，此处涉及对嵌套的处理
     */
    while ((regResult = rules.lists.exec(text)) !== null) {
      indentContent = [];
      let type = regResult[4];
      let content = regResult[2]; // 存储字符内容
      let lineCount = 0;//记录行数，每个ul为一行
      let stack = [];//用来存储每一行信息的堆栈
      let ulCount = 0,
        sharpCount = 0;//ulCount 用来记录新行数，sharpCount用来记录闭合数

      let lis = regResult[0];
      lis = lis.split("\n");

      let section = "";
      for (let i = 0; i < lis.length; i++) {

        /**
         * 对列表中的每一项进行正则检验
         * @type {RegExp}
         */
        let creatRules = /(\s*)([\*-]+|[0-9]+\.*)(.*)/;
        let result = creatRules.exec(lis[i]);

        //如果符合正则规则
        if (result !== null) {
          /**
           * 那么将该部分加入数组中
           */
          let type;
          if(result[2].slice(0) == '-' || result[2].slice(0) == '*'){
            type = 'ul'
          }else{
            type = 'ol'
          }
          indentContent.push({
            content: result[3],
            space: result[1].length,
            type: type,
            used: false
          })
        }
      }

      /**
       * 这个循环为每个嵌套确定其嵌套等级
       */
      let level = 0;//嵌套级别
      for(let i = 0;i < indentContent.length;i ++){
        for(let j = 0;j < i;j ++){

         if(indentContent[i].space == indentContent[j].space) {
            indentContent[i].level = indentContent[j].level;
            continue;
         }

        }
        if(i > 0){
          if(indentContent[i].level == undefined){
            if(indentContent[i].space > indentContent[i-1].space){
              level ++;
              indentContent[i].level = level;
            }else{
              level --;
              indentContent[i].level = level;
            }
          }
        }else{
          indentContent[i].level = 0;
        }
      }
      /**
       * 状态机
       */
      for (let i = 0; i < indentContent.length; i++) {
        if (i == 0) {
          //当i为0时，添加底部
          if(indentContent[0].type == 'ul'){
            stack.push({
              type: 'ul',
              content: '',
              used:false
            });
          }else{
            stack.push({
              type: 'ol',
              content:'',
              used:false
            })
          }
          stack.push({
            type: 'li',
            content: indentContent[0].content,
            level:indentContent[0].level
          });
          ulCount ++;
          continue;
        }
        if (indentContent[i - 1].space !== indentContent[i].space) {
          lineCount++;//当下一个的缩进与上一个不同时，增加行数
        }

        if (indentContent[i].space > indentContent[i - 1].space) {
          if(indentContent[i].type == 'ul'){
            stack.push({
              type: 'ul',
              content: '',
              used:false
            });
          }else{
            stack.push({
              stack: 'ol',
              content: '',
              used:false
            })
          }
          stack.push({
            type: 'li',
            content: indentContent[i].content,
            level:indentContent[i].level
          });
          ulCount ++;
        } else if (indentContent[i].space < indentContent[i - 1].space) {
          let short = indentContent[i-1].level - indentContent[i].level;
          for(let k = 0;k < short;k ++){
            stack.push({
              type: '#',
              content: ''
            });
            sharpCount ++;
          }
          stack.push({
            type: 'li',
            content: indentContent[i].content,
            level:indentContent[i].level
          });
        } else if (indentContent[i].space == indentContent[i - 1].space) {
          stack.push({
            type: 'li',
            content: indentContent[i].content,
            level:indentContent[i].level
          })
        }
      }//
      // ulCount = ulCount - 1;
      while (sharpCount < ulCount){
        stack.push({
          type:'#',
          content:''
        })
        sharpCount++
      }

      console.log(stack);
      while (stack.length !== 0) {
        section = this.addLine(section, stack);
      }

      console.log(section);
      text = text.replace(regResult[0], section);
    }


    /**
     * quote
     */
    while ((regResult = rules.quote.exec(text)) !== null) {
      let content = regResult[1];
      content = content.replace(">", "");
      text = text.replace(regResult[0], `<div style="width:95%;padding-top: 10px;padding-bottom:10px;padding-left:5px;background-color:rgb(241,243,241);border-left:5px solid lightgreen;border-radius:5px;margin:5px;margin-right:5px;word-wrap: break-word;"><quote data-v-2bc4b246>${content}</quote></div>`)
    }




    /**
     * LaTex
     */
    while((regResult = rules.latex.exec(text)) !== null){
      /**
       * 处理latex公式时使用第三方网站，不使用本地工具了
       */
      let content = regResult[1];
      text = text.replace(regResult[0],
        `
        <div style="text-align:center;">
            <img src="http://latex.codecogs.com/gif.latex?${content}" class="math" data-v-2bc4b246>
        </div>
        `);
    }

    /**
     * email
     */
    while((regResult = rules.mail.exec(text)) !== null){
      console.log("I am mail link");
      console.log(regResult);
      let content = regResult[1];
      text = text.replace(regResult[0],`<a href="mailto:${content}">${content}</a>`);
    }

    /**
     * text
     */
    while((regResult = rules.text.exec(text)) !== null){
      console.log(regResult);
      let content = escape(regResult[1]);
      text = text.replace(regResult[0],`<p>${content}</p>`);
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


/**
 * 添加li
 * @param text 文本
 * @param content 添加内容
 */
Parser.addLi = function(text,content){
  text = `<li>${content}</li>${text}`;
  return text;
};


/**
 * 添加外层ol或者ul
 * @param text 文本
 * @param type 文本类型
 */
Parser.addList = function(text,type){
  if(type == 'ol'){
    text = `<ol>${text}</ol>`;
  }else{
    text = `<ul>${text}</ul>`;
  }
  return text;
};

/**
 * 添加行
 * @param text
 */
Parser.addLine = function (text,stack) {
  let temp = stack.pop();
  let tempSection = "";
  debugger;
  while(stack.length != 0) {
    if (temp.type == 'li') {
      tempSection = `<li>${temp.content}</li>${tempSection}`;
    } else if (temp.type == 'ul') {

        return "<ul>" + tempSection + text;

    } else if(temp.type == 'ol'){

        return "<ol>" + tempSection + text;

    }else  if (temp.type == '#') {
        for(let i = 0;i < stack.length; i ++){
          if(stack[i].used == false){
            if(stack[i].type == 'ul'){
              stack[i].used = true;
              return '</ul>'+ tempSection + text;
            }else if (stack[i].type == 'ol'){
              stack[i].used = true;
              return '</ol>' + tempSection + text;
            }
          }
        }
        // return  '</ul>' +tempSection +  text;

    }
    temp = stack.pop();
  }
  if(temp.type == 'ul'){
    return '<ul>' + tempSection + text;
  }else{
    return '<ol>' + tempSection + text;
  }

};

export {Parser};
