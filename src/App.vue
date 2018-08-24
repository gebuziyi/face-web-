<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
* {
  padding: 0;
  margin: 0;
}

#app {
  font-family: 'Helvetica Neue',Helvetica,'PingFang SC','Hiragino Sans GB','Microsoft YaHei','微软雅黑',Arial,sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.btn-wrapper {
  margin-bottom: 20px;
  min-height: 40px;
}

.el-pagination {
  margin-top: 10px;
}

/*表格右上角操作按钮*/
.btn-operation {
  float: right;
}

/*表格右上角带tooltip的操作按钮wrapper*/
.btn-operation-wrapper {
  float: right;
  margin-left: 10px;
}

/*解决el-select高度有1px变化的问题*/
.el-form--inline .el-form-item__content {
  vertical-align: middle;
  line-height: normal;
}

.pd-left-5 {
  padding-left: 5px;
}

.green {
  color: #67C23A
}

.red {
  color: #F56C6C
}

.blue {
  color: #409EFF;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .2s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.img-thumb {
  width: 60px;
  height: 60px;
  border-radius: 20%;
  cursor: pointer;
  overflow: hidden;
}

.img-preview {
  display: block;
  margin: auto auto;
  width: 50%;
  overflow: hidden;
  max-width: 600px;
  max-height: 600px;
}

.video-preview {
  display: block;
  margin: auto auto;
  height: 40%;
  width: 40%;
  max-width: 600px;
  max-height: 600px;
}

.el-tooltip__popper {
  max-width: 300px;
}

.pd-left-3em {
  padding-left: 3em;
}

.countdown-wrap {
  height: 100px;
}

.countdown-wrap .el-card {
  height: 100px;
}
</style>
