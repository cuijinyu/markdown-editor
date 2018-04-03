<template>
  <div class="main">
    <div class="editor">
      <textarea name="" id="input-textarea" cols="30" rows="30" v-model="input" @keyup="nextLine($event)" wrap="hard">
      </textarea>
    </div>
    <div class="reader">
      <div id="output-textarea" v-html="output">
      </div>
    </div>
  </div>
</template>

<script>
import rule from '../assets/js/rule';
let $ = require('jquery');
var flag;
var editor = {
  name: 'HelloWorld',
  data () {
    return {
      input:"",
      output:"",
      beforeInput:""
    };
  },
  methods:{
    nextLine:function (ev) {
      if(ev.keyCode == 13){
        console.log("succ")
// document.getElementById();
      }
    }
  },
  watch:{
    input:function () {
      let self = this;
        if(this.input == this.beforeInput){
          return;
        }else{
          clearInterval(flag)
          flag = setInterval(()=>{
            rule.parse(self.input)
              .then(result => {
                self.beforeInput = self.input;
                self.output = result;
              })
          },2000);
        }
    }
  }
}
export default editor;
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  .main{
    width:100%;
    height:600px;
    .editor{
      width: 50%;
      height: 100%;
      float:left;
    }
    .reader{
      margin-left:50%;
      height: 100%;
      #output-textarea{
        padding:10px;
        font-size:20px;
        font-family: 微软雅黑;
        border:1px solid grey;
        height: 100%;
      }
    }
    #input-textarea{
      position:relative;
      margin:0 auto;
      outline: none;
      resize:none;
      width: 90%;
      height: 100%;
      padding:10px;
      font-size:20px;
      font-family: 微软雅黑;
    }
  }
</style>
