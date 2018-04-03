/**、
 * 一些常见的markdown规则的正则表达式
 */
const rules = [{
  rule:/\*{2}(.[^\*]*)\*{2}/,
  type:"embrance",
  templete:"<b>$1</b>"
},{
  rule:/\*(.[^\*]*)\*/,
  type:"ltalic",
  templete:"<i>$1</i>"
},{
  rule:/--+/,
  type:"cutoff",
  templete:"<div class='cutoff'></div>"
},{
  rule:/([-+*]{1})(.[^\*]*)?/g,
  type:"ul",
  templete:"<ul><li>$2</li></ul>"
},{
  rule:/(`{3})(.*)(`{3})/g,
  type:"code",
  templete:"<code>$2</code>"
},{
  rule:/\[(.*)\]\((.*)\)/,
  type:"link",
  templete:"<a href='$1'>$2</a>"
},{
  rule:/!\[(.*)\]\((.*)\)/,
  type:"pics",
  templete:"<img src='$1' title='$2' href='$2'/>"
}];
const htmlRule = [{
  rule:/\n/,
  templete:"<br/>"
}];
//构造所有标题的正则表达式
for(let i = 1;i < 7;i ++){
  rules.push({
    rule:new RegExp("(#{"+i+"})(.*)"),
    type:"h"+i,
    templete:"<h"+i+">$2</h"+i+">"
  })
}

export default {
  parse(input){
    // console.table(rules)
    let temp = input;
    // temp = this.htmlParse(input);
    return new Promise((resolve,reject)=>{
      rules.forEach(e=>{
        if(e.rule.test(input)){
          console.log(`successful ${e.rule}`);
          temp = temp.replace(e.rule,e.templete);
          console.log(temp);
        }
      })
      resolve(temp);
    })
  },
  /**
   * 对html特殊字符的转义
   */
  htmlParse(input){
    htmlRule.forEach(e=>{
      input.replace(e.rule,e.templete);
    })
    return input;
  },

}

