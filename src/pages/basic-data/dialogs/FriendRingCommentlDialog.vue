<template>
  <el-dialog :visible.sync="show" :title="`${dialog.detail.nickName}, ${dialog.detail.createTime} 举报视频评论详情: `" width="1000px">
    <div v-loading="dialog.detail.loading" class="create-form-wrapper">
      <el-form size="small" :model="dialog.detail" label-position="left" label-width="150px" ref="infoForm">
        <el-form-item label="被举报人ID">
          <span class="detail-span" v-text="dialog.detail.userId" v-if="dialog.detail.content !== ''"></span>
        </el-form-item>
        <el-form-item label="被举报人昵称">
          <span class="detail-span" v-text="dialog.detail.nickName" v-if="dialog.detail.content !== ''"></span>
        </el-form-item>
        <el-form-item label="被举报的评论内容">
          <span class="detail-span" v-text="dialog.detail.content" v-if="dialog.detail.content !== ''"></span>
        </el-form-item>
        <el-form-item label="被举报的评论时间">
          <span class="detail-span" v-text="dialog.detail.createTime" v-if="dialog.detail.content !== ''"></span>
        </el-form-item>
        <el-form-item label="被举报的朋友圈评论的朋友圈ID">
          <span class="detail-span" v-text="dialog.detail.friendId" v-if="dialog.detail.content !== ''"></span>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer">
      <el-button type="primary" @click="show = false" size="small">关闭</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { getFriendRingCommentdetail } from '../../../api/basic-data/report-info';
export default {
  data() {
    return {
      msg: null,
      show: false,
      loading: false,
      formLoading: true,
      btnLoading: false,
      dialog: {
        detail: {
          userId: null,
          nickName: null,
          content: null,
          createTime: null,
          friendId: null,
          show: false,
          formLoading: true,
          btnLoading: false
        }
      }
    };
  },
  methods: {
    openDetailDialog(row) {
      this.show = true;
      this.dialog.detail.formLoading = true;
      getFriendRingCommentdetail(row.infoId)
        .then(({ data }) => {
          this.dialog.detail.userId = data.detail.userId;
          this.dialog.detail.nickName = data.detail.nickName;
          this.dialog.detail.content = data.detail.content;
          this.dialog.detail.createTime = data.detail.createTime;
          this.dialog.detail.friendId = data.detail.friendId;
          this.dialog.detail.formLoading = false;
        })
        .catch(error => {
          this.$message.error('朋友圈评论详情不存在');
          this.show = false;
        });
    }
  }
};
</script>
