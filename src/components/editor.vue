<template>
  <div class="main">
    <div class="editor">
      <textarea name="" id="input-textarea" cols="30" rows="30" v-model="input"  wrap="hard">
      </textarea>
    </div>
    <div class="reader">
      <div id="output-textarea" v-html="output">
      </div>
    </div>
  </div>
</template>

<script>
let $ = require("jquery");
// let hijs = require("highlight");
import {Parser} from '../assets/js/microMarkdown';
let flag;
let editor = {
  name: 'HelloWorld',
  data () {
    return {
      input:"",
      output:"",
      beforeInput:""
    };
  },
  methods:{

  },
  watch:{
    input:function () {
      /**
       * 节流器
       */
      let parser;
      let self = this;
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
    margin:0;
    padding: 0;
  }
  br{
    line-height: 5px;
  }
  .main{
    width:100%;
    height:600px;
  }
  .editor{
    width: 50%;
    height: 100%;
    float:left;
  }
  .reader{
    margin-left:50%;
    height: 110%;
  }
  #output-textarea{
    padding:10px;
    font-size:20px;
    font-family: 微软雅黑;
    border:1px solid grey;
    height: 600px;
    overflow: auto;
    background-color: rgb(249,249,245);
    border-radius: 5px;
    box-shadow: 1px 1px 1px darkgrey;
  }
  #input-textarea{
    position:relative;
    margin:0 auto;
    outline: none;
    resize:none;
    width: 95%;
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
</style>
