<template>
  <el-dialog :visible.sync="show" :title="`${dialog.detail.nickName}, ${dialog.detail.createTime} 举报视频评论详情: `" width="1000px">
    <div v-loading="dialog.detail.loading" class="create-form-wrapper">
      <el-form size="small" :model="dialog.detail" label-position="left" label-width="150px" ref="infoForm">
        <el-form-item label="被举报人ID">
          <span class="detail-span" v-text="dialog.detail.userId" ></span>
        </el-form-item>
        <el-form-item label="被举报人昵称">
          <span class="detail-span" v-text="dialog.detail.nickName" ></span>
        </el-form-item>
        <el-form-item label="被举报的评论内容">
          <span class="detail-span" v-text="dialog.detail.comment" ></span>
        </el-form-item>
        <el-form-item label="被举报的评论时间">
          <span class="detail-span" v-text="dialog.detail.createTime" ></span>
        </el-form-item>
        <el-form-item label="被举报的视频评论ID">
          <span class="detail-span" v-text="dialog.detail.videoId" ></span>
        </el-form-item>
        <el-form-item label='视频文件 ：'>
        <icon-tag type="warning" icon="fa fa-info" v-if="dialog.detail.url === '' || dialog.detail.img === null">无视频</icon-tag>
        <video :src='dialog.detail.url' class='vide-report-item' controls />
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer">
      <el-button type="primary" @click="show = false" size="small">关闭</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { getVideoCommentdetail } from '../../../api/basic-data/report-info';
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
          comment: null,
          createTime: null,
          videoId: null,
          url: null,
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
      getVideoCommentdetail(row.infoId)
        .then(({ data }) => {
          this.dialog.detail.userId = data.detail.userId;
          this.dialog.detail.nickName = data.detail.nickName;
          this.dialog.detail.comment = data.detail.comment;
          this.dialog.detail.createTime = data.detail.createTime;
          this.dialog.detail.videoId = data.detail.videoId;
          this.dialog.detail.url = data.detail.url;

          this.dialog.detail.formLoading = false;
        })
        .catch(error => {
          this.$message.error('视频评论详情不存在');
          this.show = false;
        });
    }
  }
};
</script>
<style scoped>
.vide-report-item {
  display: block;
  margin: auto auto;
  width: 100%;
  max-width: 400px;
  height:100%;
  max-height:600px;
}
.assistant-msg {
  margin-left: 4em;
}
</style>
