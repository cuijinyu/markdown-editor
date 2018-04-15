<template>
  <div class="main">
    <div class="operator">
      <a href="" v-on:click.prevent="addTitle"><img src="../assets/images/文案标题.png" alt="一级标题" title="添加一级标题"></a>
      <a href="" v-on:click.prevent="addBold"><img src="../assets/images/粗体.png" alt="粗体" title="添加粗体" ></a>
      <a href="" v-on:click.prevent="addItalic"><img src="../assets/images/斜体.png" alt="斜体" title="添加斜体"></a>
      <a href="" v-on:click.prevent="addList"><img src="../assets/images/列表.png" alt="列表" title="添加列表"></a>
      <a href="" v-on:click.prevent="addQuote"><img src="../assets/images/引用.png" alt="引用" title="添加引用"></a>
      <a href="" v-on:click.prevent="addLink"><img src="../assets/images/链接.png" alt="链接" title="添加链接"></a>
      <a href="" v-on:click.prevent="addCode"><img src="../assets/images/符号-代码.png" alt="代码" title="添加代码"></a>
      <a href="" v-on:click.prevent="addImage"><img src="../assets/images/图片.png" alt="图片" title="添加图片"></a>
      <a href="" v-on:click.prevent="addTable"><img src="../assets/images/表格.png" alt="表格" title="添加表格"></a>
      <a href="" v-on:click.prevent="addMath"><img src="../assets/images/数学.png" alt="数学公式" title="添加数学公式"></a>
      <a href="" v-on:click.prevent="addBreaker"><img src="../assets/images/758编辑器_分割线.png" alt="分割线" title="添加分割线"></a>
    </div>
    <div class="editor">
      <textarea name="" id="input-textarea" cols="30" rows="30" v-model="input"  wrap="hard" v-on:keyup.9="keydown">
      </textarea>
    </div>
    <div class="reader">
      <div id="output-textarea" v-html="output">
      </div>
    </div>
  </div>
</template>

<script>
//屏蔽默认tab
document.onkeydown = function(){
  if(event.keyCode == 9){
    return false;
  }
}
let $ = require("jquery");
import TextOperation from '../assets/js/textOperation';
import {Parser} from '../assets/js/microMarkdown';
let flag;
let editor = {
  name: 'editor',
  data () {
    return {
      op:"",//用来存储对输入区的操作
      input:"",
      output:"",
      beforeInput:""
    };
  },
  methods:{
    /**
     * 监听按键，增加编辑器输入tab的功能
     */
    keydown(){
      let pos = this.op.getPosition().start;
      debugger;
      this.op.addTab();
      this.input = document.getElementById("input-textarea").value;
      this.op.setPosition(pos+4,pos+4);
      this.output = Parser.parse(this.input);
    },
    addTitle(){
      let pos = this.op.getPosition().start;
      debugger;
      console.log(this.op);
      this.op.addTitle();
      this.input = document.getElementById("input-textarea").value;
      this.op.setPosition(pos+1,pos+1);
      this.output = Parser.parse(this.input);
    },
    addCode(){
      let pos = this.op.getPosition().start;
      this.op.addCode();
      this.input = document.getElementById("input-textarea").value;
      this.op.setPosition(pos+4,pos+4);
      this.output = Parser.parse(this.input);
    },
    addBold(){
      let pos = this.op.getPosition().start;
      this.op.addBold();
      this.input = document.getElementById("input-textarea").value;
      this.op.setPosition(pos+2,pos+2);
      this.output = Parser.parse(this.input);
    },
    addQuote(){
      let pos = this.op.getPosition().start;
      this.op.addQuote();
      this.input = document.getElementById("input-textarea").value;
      this.op.setPosition(pos+2,pos+2);
      this.output = Parser.parse(this.input);
    },
    addTable(){
      let pos = this.op.getPosition().start;
      this.op.addTable();
      this.input = document.getElementById("input-textarea").value;
      this.op.setPosition(pos+87,pos+87);
      this.output = Parser.parse(this.input);
    },
    addList(){
      let pos = this.op.getPosition().start;
      this.op.addList();
      this.input = document.getElementById("input-textarea").value;
      this.op.setPosition(pos+2,pos+2);
      this.output = Parser.parse(this.input);
    },
    addBreaker(){
      let pos = this.op.getPosition().start;
      this.op.addBreaker();
      this.input = document.getElementById("input-textarea").value;
      this.op.setPosition(pos+13,pos+13);
      this.output = Parser.parse(this.input);
    },
    addItalic(){
      let pos = this.op.getPosition().start;
      this.op.addItalic();
      this.input = document.getElementById("input-textarea").value;
      this.op.setPosition(pos+2,pos+2);
      this.output = Parser.parse(this.input);
    },
    addLink(){
      let pos = this.op.getPosition().start;
      this.op.addLink();
      this.input = document.getElementById("input-textarea").value;
      this.op.setPosition(pos+2,pos+2);
      this.output = Parser.parse(this.input);
    },
    addImage(){
      let pos = this.op.getPosition().start;
      this.op.addPics();
      this.input = document.getElementById("input-textarea").value;
      this.op.setPosition(pos+2,pos+2);
      this.output = Parser.parse(this.input);
    },
    addMath(){
      let pos = this.op.getPosition().start;
      this.op.addLatex();
      this.input = document.getElementById("input-textarea").value;
      this.op.setPosition(pos+2,pos+2);
      this.output = Parser.parse(this.input);
    }
  },
  watch:{
    input:function () {
      let self = this;
      //初始化对文本编辑器的操作
      // if(this.op == ''){
      //   this.op = new TextOperation(document.getElementById("input-textarea"));
      // }
      /**
       * 节流器
       */
      let parser;
        if(this.input == this.beforeInput){
          return;
        }else{
          clearInterval(flag);
          flag = setInterval(()=>{
            self.beforeInput = self.input;
            console.log(self.input);
            self.output = Parser.parse(self.input);
            /**
             * 利用highlight高亮代码
             */
            $("pre code").each(function(i, block) {
              hljs.highlightBlock(block);
            });
          },2000);
        }
    }
  },
  mounted:function(){
    if(this.op == ''){
      this.op = new TextOperation(document.getElementById("input-textarea"));
    }
  }
}


export default editor;
</script>

<style scoped lang="less">
  body{
    margin:0px;
  }
  *{
    font-size:14px;
    margin:0;
    padding: 0;
  }
  br{
    line-height: 5px;
  }
  .operator{
    position:relative;
    height:30px;
    width:396px;
    box-shadow:2px 2px 2px rgb(249,249,249);
    margin-bottom:5px;
    background:rgb(249,249,249);
    border:1px solid rgba(0,0,0,0.2);
    border-radius:5px;
  }
  .operator img{
    position:relative;
    top:5px;
    width:20px;
    height:20px;
  }
  .operator a{
    float:left;
    border-right:1px solid rgba(0,0,0,0.3);
    border-radius:5px;
    width:35px;
    height:30px;
    /*margin-right: 5px;*/
    text-align:center;
  }
  .operator a:last-child{
    float:left;
    border-right:0px solid rgba(0,0,0,0.3);
    /*border-radius:5px;*/
    width:35px;
    height:30px;
    /*margin-right: 5px;*/
    text-align:center;
  }
  .operator a:hover{
    background-color: rgb(255,245,212);
  }
  .main{
    width:100%;
    height:100%;
  }
  .editor{
    width: 50%;
    height: 100%;
    float:left;
  }
  .reader{
    margin-left:50%;
    height: 100%;
  }
  #output-textarea{
    padding:10px;
    font-size:20px;
    font-family: 微软雅黑;
    border:1px solid grey;
    height: 100%;
    width:45%;
    overflow: auto;
    background-color: rgb(249,249,245);
    border-radius: 5px;
    position:fixed;
    box-shadow: 1px 1px 1px darkgrey;
  }
  #input-textarea{
    position:fixed;
    margin:0 auto;
    outline: none;
    resize:none;
    width: 45%;
    height: 100%;
    padding:10px;
    font-size:20px;
    overflow: auto;
    font-family: 微软雅黑;
    background-color: black;
    color:white;
    border-radius: 5px;
    box-shadow: 1px 1px 1px darkgrey;
  }
  #input-textarea::-webkit-scrollbar{
    border-radius:5px;
    background-color: darkgrey;
  }
  #input-textarea::-webkit-scrollbar-thumb{
    border-radius:5px;
    background-color: ghostwhite;
  }
  #output-textarea::-webkit-scrollbar{
    border-radius: 5px;
    background-color: darkgrey;
  }
  #output-textarea::-webkit-scrollbar-thumb{
    border-radius: 5px;
    background-color: black;
  }
  /*定义markdown文档的样式*/
  h1{
    border-bottom:3px solid #f1f3f1;
  }
  h2{
    border-bottom: 2px solid #f1f3f1;
  }
  h3{
    border-bottom: 1px solid #f1f3f1;
  }
  .breaker{
    height: 1px;
    margin-top:5px;
    margin-bottom: 5px;
    background-color: darkgrey;
  }
  quote{
    padding-bottom: 10px;
    padding-top:10px;
    width:100%;
    /*background-color: beige;*/
    border-radius: 5px;
  }
  table{
    border:1px solid black;
  }
  .math{
    margin-left:auto;
    margin-right: auto;
    display: inline-block;
    text-align: center;
  }
  h1{
    font-size: 24px;
    font-weight: 400;
    color: #313131;
    padding-left: 20px;
  }
  h2{
    font-size: 18px;
    font-weight: 400;
    padding-top: 30px;
    padding-bottom: 10px;
    color: #313131;
  }
</style>
