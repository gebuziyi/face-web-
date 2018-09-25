<template>
  <div style=" overflow:scroll; width:1175px; height:400px;">
      <div v-for="(talk,index) in msg" :key="index">
        <el-card class="box-card">
          <span v-if="talk.fromAccount === 10000190">
            <span style="text-align: center;display: block;">{{ talk.msgCreateTime }}</span>
          </span>
          <span v-else>
            <span style="margin-left: 15px;">
              {{talk.fromNickName}}
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              {{ talk.msgCreateTime }}
            </span>
          </span>
          <br/>
          <span v-if="talk.fromAccount === 10000190" class="syscss">
            <span v-if="isTextMsg(talk)" class="sbox" >{{ talk | parseText }}</span>
            <img v-else :src="talk | parseImgUrl" class="chat-msg-img box" style="width: 100px"  @click="showPicPreviewDialog(talk)"/>&nbsp;&nbsp;&nbsp;
            <img :src="talk.fromImg" class="chat-msg-img" style="width: 50px"/>
          </span>
          <span v-else class="othercss">
            <img :src="talk.fromImg" class="chat-msg-img" style="width: 50px"/>
            <span v-if="isTextMsg(talk) " class="box" style="margin: 30px;">{{ talk | parseText }}</span>
            <span  v-else><img :src="talk | parseImgUrl" class="chat-msg-img box" style="width: 100px"  @click="showPicPreviewDialog(talk)"/></span>
          </span>
        </el-card>
      </div>
      <el-dialog :visible.sync="dialog.picPreview.show" :append-to-body="true">
        <img :src="dialog.picPreview.picSrc" class="img-preview" />
      </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'assistant-chat-msg-detail',

  data() {
    return {
      dialog: {
        picPreview: {
          show: false,
          picSrc: null
        }
      }
    };
  },
  props: {
    msg: {
      required: true,
      type: Array
    }
  },
  filters: {
    parseText: function(talk) {
      const msgDataStr = talk.msgData;
      return JSON.parse(msgDataStr).Text;
    },

    parseImgUrl: function(talk) {
      const msgDataStr = talk.msgData;
      const imageInfoArray = JSON.parse(msgDataStr).ImageInfoArray;
      return imageInfoArray.find(talk => talk.Type === 3).URL;
    }
  },
  methods: {
    isTextMsg(talk) {
      return talk.msgType === 201
    },
    showPicPreviewDialog(talk) {
      const msgDataStr = talk.msgData;
      const imageInfoArray = JSON.parse(msgDataStr).ImageInfoArray;
      this.dialog.picPreview.picSrc = imageInfoArray.find(talk => talk.Type === 3).URL;
      this.dialog.picPreview.show = true;
    }
  }
};
</script>

<style scoped>
.othercss {
  float: left;
  margin-left: 10px;
  max-width: 60%;
  font-size: 20px;
  padding: 10px;
}

.syscss {
  float: right;
  margin-right: 10px;
  max-width: 60%;
  font-size: 20px;
  padding: 10px;
}

.text {
    font-size: 14px;
}

.item {
  padding: 18px 0;
}

.box-card {
  width: 1155px;
}
.box:before{
  content: "";
  display: block;
  position: absolute;
  width: 0;
  height: 0;
  border: 8px solid transparent;
  border-right-color: #25a23b;
  top: 10px;
  left: -14px;
}
.box{
  position: relative;
  width: 150px;
  min-height: 50px;
  background: #25a23b;
  border-radius: 5px;
  line-height: 50px;
  margin-left: 10px;
  word-break: break-word;
  color: white;
  padding: 5px;
  line-height: 18px;
}

.sbox:before{
  content: "";
  display: block;
  position: absolute;
  width: 0;
  height: 0;
  border: 8px solid transparent;
  border-left-color: #25a23b;
  top: 10px;
  right: -14px;
}
.sbox{
  position: relative;
  width: 150px;
  min-height: 50px;
  background: #25a23b;
  border-radius: 5px;
  line-height: 50px;
  margin-left: 10px;
  word-break: break-word;
  color: white;
  padding: 5px;
  line-height: 18px;
}
</style>
