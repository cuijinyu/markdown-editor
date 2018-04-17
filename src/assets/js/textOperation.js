class TextOperation {

  constructor(element){
    if(!element){
      throw "请传入要执行以下操作的元素";
    }else{
      this.element = element;
      this.startPos = 0;
      this.endPos = 0;
    }
  }

  /**
   * 获取光标当前位置
   * @returns {{start: number, end: number}}
   */
  getPosition(){
    if( document.selection ) {
      let range  = document.selection.createRange();
      let drange = range.duplicate();
      drange.moveToElementText( this.element );
      drange.setEndPoint( "EndToEnd", range );
      this.startPos = drange.text.length - range.text.length;
      this.endPos   = startPos + range.text.length;
    }else if( window.getSelection ) {
      /**
       * 此处是在非IE下的操作
       * @type {number}
       */
      this.startPos = this.element.selectionStart;
      this.endPos   = this.element.selectionEnd;
    }
    return {
      "start" : this.startPos,
      "end"   : this.endPos
    }
  }

  /**
   * 设置光标或者选区位置
   * @param m
   * @param n
   */
   setPosition(m,n){
      let args2 = m|n;
      if(document.selection){
        let range = document.selection.createRange();
        range.collapse(true);
        range.moveEnd('character',args2);
        range.moveStart('character',m);
        this.element.focus();
      }else if(window.getSelection){
        console.log(this.element.selectionStart);
        this.startPos = this.element.selectionStart = m;
        this.endPos = this.element.selectionEnd = args2;
        this.element.focus();
      }
  }

  /**
   * 获取选区内容字符串
   * 获取选区内容字符串
   * @param m
   * @param n
   * @returns {*|T[]|SharedArrayBuffer|Uint8ClampedArray|Uint32Array|Blob}
   */
  getStr(m,n){
    this.getPosition(m,n);
    return this.element.value.slice(this.startPos, this.endPos);
  }

  /**
   * 缩进，增加四个空格
   */
  addTab(){
    let position = this.getPosition();
    let temp = this.element.value;
    temp = temp.split("");
    temp.splice(position.start,0,"    ");
    this.element.value = temp.join("");
  }

  /**
   * 添加列表
   */
  addList(){
    let position = this.getPosition();
    let temp = this.element.value;
    temp = temp.split("");
    temp.splice(position.start,0,"- ");
    this.element.value = temp.join("");
  }

  /**
   * 添加引用
   */
  addQuote(){
    let position = this.getPosition();
    let temp = this.element.value;
    temp = temp.split("");
    temp.splice(position.start,0,"> ");
    this.element.value = temp.join("");
  }

  /**
   * 添加代码段
   */
  addCode(){
      let position = this.getPosition();
      let temp = this.element.value;
      temp = temp.split("");
      temp.splice(position.start,0,`\n\`\`\`
      
      \`\`\`\n`);
      this.element.value = temp.join("");
  }

  /**
   * 添加表格
   */
  addTable(){
    let position = this.getPosition();
    let temp = this.element.value;
    temp = temp.split("");
    temp.splice(position.start,0,`\n<table>
<tr>
  <th></th>
  <th></th>
</tr>
<tr>
  <td></td>
  <td></td>
</tr>
</table>\n`);
    this.element.value = temp.join("");
  }

  /**
   * 变为粗体字
   */
  changeToBold(){
    let position = this.getPosition();
    let temp = this.element.value;
    temp = temp.split("");
    temp.splice(position.start,0,"**");
    temp.splice(position.end,0,"**");
  }

  /**
   * 添加链接
   */
  addLink(){
    let position = this.getPosition();
    let temp = this.element.value;
    temp = temp.split("");
    temp.splice(position.start,0,"[]()");
    this.element.value = temp.join("");
  }

  /**
   * 变为斜体字
   */
  changeToItalic(){
    let position = this.getPosition();
    let temp = this.element.value;
    temp = temp.split("");
    temp.splice(position.start,0,"*");
    temp.splice(position.end,0,"*");
  }

  /**
   * 添加公式
   */
  addLatex(){
    let position = this.getPosition();
    let temp = this.element.value;
    temp = temp.split("");
    temp.splice(position.start,0,"$$ $$");
    this.element.value = temp.join("");
  }

  /**
   * 添加图片
   */
  addPics(){
    let position = this.getPosition();
    let temp = this.element.value;
    temp = temp.split("");
    temp.splice(position.start,0,"![]()");
    this.element.value = temp.join("");
  }

  /**
   * 添加分隔线
   */
  addBreaker(){
    let position = this.getPosition();
    let temp = this.element.value;
    temp = temp.split("");
    temp.splice(position.start,0,"------------------------------------------------------------------------\n");
    this.element.value = temp.join("");
  }

  addTitle(){
    let position = this.getPosition();
    let temp = this.element.value;
    temp = temp.split("");
    temp.splice(position.start,0,"# ");
    this.element.value = temp.join("");
  }

  addBold(){
    let position = this.getPosition();
    let temp = this.element.value;
    temp = temp.split("");
    temp.splice(position.start,0,"**");
    temp.splice(position.end+1,0,"**");
    this.element.value = temp.join("");
  }

  addItalic(){
    let position = this.getPosition();
    let temp = this.element.value;
    temp = temp.split("");
    temp.splice(position.start,0,"*");
    temp.splice(position.end+1,0,"*");
    this.element.value = temp.join("");
  }
}

export default TextOperation;
