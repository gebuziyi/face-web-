<template>
  <el-dialog :visible.sync="show" title="回复用户小助手消息" style="" width="1200px" :close-on-click-modal="false" @close="beforeDialogClose" :append-to-body="true">
    <div v-loading="loading" style="height: 600px" class="a">
      <h4>用户消息:</h4><br/>
      <msg-detail :msg="msg" class="assistant-msg"></msg-detail>
      <br/>
      <div class="b">
        <h4>回复:</h4>
        <el-form size="small" :model="model" :rules="rules" label-position="left" label-width="120px" ref="theForm">
          <el-form-item label="回复内容" prop="text">
            <el-input v-model.trim="model.text" type="textarea" style="width:800px; height=20px;"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="s">
        <el-button @click="show = false" size="small">取 消</el-button>
        <el-button type="primary" @click="doReply" size="small" :loading="btnLoading">发送</el-button>
      </span>
    </div>
  </el-dialog>
</template>

<script>
import AssistantChatRecords from '../components/AssistantChatRecords';
import { replyMsg, getChatRecords } from '../../../api/assistant/assistant-ChatMsg';

export default {
  name: 'assistant-msg-reply-dialog',

  components: {
    'msg-detail': AssistantChatRecords
  },

  data() {
    return {
      msg: null,
      show: false,
      loading: false,
      quserId: null,
      model: {
        text: null
      },
      rules: {
        text: [
          { required: true, trigger: 'change', message: '回复内容不能为空' }
        ]
      },
      formLoading: true,
      btnLoading: false
    };
  },

  methods: {
    showDialog(msg) {
      this.show = true;
      this.queryChatRecords(msg.userId);
    },

    beforeDialogClose(done) {
      this.$refs.theForm.resetFields();
    },

    queryChatRecords(userId) {
      this.quserId = userId
      getChatRecords(userId)
        .then(({ data }) => {
          this.msg = data.list;
        })
        .catch(errorMsg => {});
    },

    doReply() {
      this.$refs.theForm.validate(valid => {
        if (valid) {
          let msg = {
            fromAccount: 10000190,
            toAccounts: [].concat(this.quserId),
            text: this.model.text
          }
          replyMsg(msg)
            .then(resp => {
              this.$refs.theForm.resetFields();
              this.$message.success('回复成功');
              this.queryChatRecords(this.quserId);
            })
            .catch(err => {})
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style scoped>
.chat-records {
  background: #ffebeb;
}
.a{
  position:relative;
}

.b{
  position:absolute;top: 450px;
}

.s{
  position:absolute;
  bottom: 100px;
  right: 30px;
}

</style>
