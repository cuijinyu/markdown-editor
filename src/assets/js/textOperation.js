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
  addLi(){

  }

  /**
   * 添加引用
   */
  addQuote(){

  }

  /**
   * 添加代码段
   */
  addCode(){

  }

  /**
   * 添加表格
   */
  addTable(){

  }

  /**
   * 变为粗体字
   */
  changeToBold(){

  }

  /**
   * 添加链接
   */
  addLink(){

  }

  /**
   * 变为斜体字
   */
  changeToItalic(){

  }

  /**
   * 添加公式
   */
  addLatex(){

  }

  /**
   * 添加图片
   */
  addPics(){

  }

  /**
   * 添加分隔线
   */
  addBreaker(){

  }


}

export default TextOperation;
