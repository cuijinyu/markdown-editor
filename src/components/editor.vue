<template>
  <div class="main">
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
      this.op.addTab();
      this.input = document.getElementById("input-textarea").value;
      this.op.setPosition(pos+4,pos+4);
      this.output = Parser.parse(this.input);
    }
  },
  watch:{
    input:function () {
      let self = this;
      //初始化对文本编辑器的操作
      if(this.op == ''){
        this.op = new TextOperation(document.getElementById("input-textarea"));
      }
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
  }
}


export default editor;
</script>

<style scoped lang="less">
  *{
    font-size:14px;
    margin:0;
    padding: 0;
  }
  br{
    line-height: 5px;
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
