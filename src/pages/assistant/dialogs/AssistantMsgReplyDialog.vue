<template>
  <el-dialog :visible.sync="show" title="回复用户小助手消息" width="1200px" :close-on-click-modal="false" @close="beforeDialogClose">
    <div v-loading="loading" class="edit-form-wrapper">
      <div>
        <h4>用户消息:</h4>
        <msg-detail :msg="msg" class="assistant-msg"></msg-detail>
      </div>
      <h4>回复</h4>
      <el-form size="small" :model="model" :rules="rules" label-position="left" label-width="120px" ref="theForm">
        <el-form-item label="回复内容" prop="text">
          <el-input v-model.trim="model.text" type="textarea"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer">
      <el-button @click="show = false" size="small">取 消</el-button>
      <el-button type="primary" @click="doReply" size="small" :loading="btnLoading">发送</el-button>
    </span>
  </el-dialog>
</template>

<script>
import AssistantChatMsgDetail from '../components/AssistantChatMsgDetail';
import { replyMsg } from '../../../api/assistant/assistant-ChatMsg';

export default {
  name: 'assistant-msg-reply-dialog',

  components: {
    'msg-detail': AssistantChatMsgDetail
  },

  data() {
    return {
      msg: null,
      show: false,
      loading: false,
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
      this.msg = msg;
    },

    beforeDialogClose(done) {
      this.$refs.theForm.resetFields();
    },

    doReply() {
      this.$refs.theForm.validate(valid => {
        if (valid) {
          let msg = {
            fromAccount: null,
            toAccounts: [].concat(this.msg.fromAccount),
            text: this.model.text
          }
          replyMsg(msg)
            .then(resp => {
              this.$refs.theForm.resetFields();
              this.$message.success('回复成功');
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
.assistant-msg {
  margin-left: 4em;
}
</style>
