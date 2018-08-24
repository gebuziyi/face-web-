<template>
  <el-row>
    <el-col :span="24">
      <el-form :model="msg">
        <el-form-item label="用户ID:">
          <span>{{ msg.fromAccount }}</span>
        </el-form-item>
        <el-form-item label="用户昵称:">
          <span>{{ msg.fromNickName }}</span>
        </el-form-item>
        <el-form-item label="消息类型:">
          <span>{{ msg.msgType | map2TypeName }}</span>
        </el-form-item>
        <el-form-item label="发送时间:">
          <span>{{ msg.msgCreateTime }}</span>
        </el-form-item>
        <el-form-item label="消息内容:">
          <template>
            <span v-if="isTextMsg(msg)">{{ msg | parseText }}</span>
            <img v-else :src="msg | parseImgUrl" class="chat-msg-img" />
          </template>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script>
import { ASSISTANT_MSG_TYPES } from '../../../utils/constants';

export default {
  name: 'assistant-chat-msg-detail',

  data() {
    return {};
  },

  props: {
    msg: {
      required: true,
      type: Object
    }
  },

  filters: {
    map2TypeName: function(msgType) {
      const r = ASSISTANT_MSG_TYPES.find(item => item.type === msgType);
      if (r) {
        return r.name;
      } else {
        return '未知类型';
      }
    },

    parseText: function(msg) {
      const msgDataStr = msg.msgData;
      return JSON.parse(msgDataStr).Text;
    },

    parseImgUrl: function(msg) {
      const msgDataStr = msg.msgData;
      const imageInfoArray = JSON.parse(msgDataStr).ImageInfoArray;
      return imageInfoArray.find(item => item.Type === 3).URL;
    }
  },

  methods: {
    isTextMsg(msg) {
      return msg.msgType === 201
    }
  }
};
</script>

<style scoped>
</style>
