const rules = {
  headline:/(\#{1,6})([^\#\n]+)$/m,//m表示多行
  code:/\s```\n?([^`]+)```/g,
  breaker:/(^--+)|(\n--+)/g,
  list:/([-+*]{1})(.[^\*]*)?/g,
  link:/\[(.*)\]\((.*)\)/g,
  pics:/!\[(.*)\]\((.*)\)/g,
  mail:/<(([a-z0-9_\-\.])+\@([a-z0-9_\-\.])+\.([a-z]{2,7}))>/gmi,
  quote:/^>(.*[^\n])|\n(.*[^\n])/,
}

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
 */
function creatBr(text){
  let reg = /.*(\n).*?/,regRe;
  while((regRe = reg.exec(text))!==null){
    text = text.replace(regRe[1],`<br/>`);
  }
  return text;
}


class Parser{
  constructor(content){
    if(!content){
      throw "请给构造器传入有效的数据";
    }else{
      this.content = content;
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
      text = text.replace(regResult[0],`<h${count}>${content}</h${count}>`);
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
      text = text.replace(regResult[0],`<div class="breaker"></div>`)
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
     * 处理换行
     */
    text = creatBr(text);
    return text;
  }
  getContent(){
    return this.content;
  }
}

export {Parser};
