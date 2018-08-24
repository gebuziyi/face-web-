<template>
  <el-dialog :visible.sync='show' :title='`${dialog.detail.niceName}, ${dialog.detail.createTime} 举报视频详情: `' width='1000px'>
    <div v-loading='dialog.detail.loading' class='create-form-wrapper'>
      <el-form size='small' :model='dialog.detail' label-position='left' label-width='150px' ref='infoForm'>

        <el-form-item label='视频状态 ：'>
          <span class='detail-span' v-if='dialog.detail.statues === 0'>已删除</span>
          <span class='detail-span' v-if='dialog.detail.statues === 1'>正常</span>
          <span class='detail-span' v-if='dialog.detail.statues === 2'>已冻结</span>
        </el-form-item>
        <!-- <el-table-column prop='dialog.detail.statues' label='视频状态'>
        <template slot-scope='scope'>
          <el-tag size='small' type='success' v-if='dialog.detail.scope.row.statues === 0'>已删除</el-tag>
          <el-tag size='small' type='success' v-if='dialog.detail.scope.row.statues === 1'>正常</el-tag>
          <el-tag size='small' type='warning' v-if='dialog.detail.scope.row.statues === 2'>冻结</el-tag>
        </template>
      </el-table-column> -->

        <el-form-item label='视频ID ：'>
          <span class='detail-span' v-text='dialog.detail.videoId'></span>
        </el-form-item>
        <el-form-item label='视频用户昵称 ：'>
          <span class='detail-span' v-text='dialog.detail.niceName'></span>
        </el-form-item>
        <el-form-item label='视频用户ID ：'>
          <span class='detail-span' v-text='dialog.detail.userId'></span>
        </el-form-item>
        <el-form-item label='视频上传时间 ：'>
          <span class='detail-span' v-text='dialog.detail.createTime'></span>
        </el-form-item>
        <el-form-item label='视频文件 ：'>
          <video :src='dialog.detail.fileUrl' class='vide-report-item' controls />
        </el-form-item>
        <el-form-item>
          <el-button type='warning' size='mini' @click='frozenVideo' :disabled='freezeBtnDisabled' v-if="hasPermission('report:info:update')">
          冻结短视频
          </el-button>
          <el-button type='danger' size='mini' @click='deleteVideo' :disabled='deleteBtnDisabled' v-if="hasPermission('report:info:update')">
            删除短视频
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <span slot='footer'>
      <el-button type='primary' @click='show = false' size='small'>关闭</el-button>
    </span>
  </el-dialog>
</template>
<script>
import {
  getVideoReportDetail,
  getdisableDetail,
  getdeleteVideoDetail
} from '../../../api/basic-data/report-info';

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
          statues: null,
          videoId: null,
          createTime: null,
          userId: null,
          niceName: null,
          fileUrl: null,
          show: false,
          formLoading: true,
          btnLoading: false
        }
      },
      freezeBtnDisabled: false,
      deleteBtnDisabled: false
    };
  },
  methods: {
    frozenVideo() {
      this.$confirm('确定要冻结视频信息?', '视频信息冻结', {
        type: 'warning'
      })
        .then(() => {
          getdisableDetail(this.dialog.detail.videoId)
            .then(resp => {
              this.$message.success('操作成功');
              this.freezeBtnDisabled = true;
              this.$emit('done');
              this.show = false;
            })
            .catch(errorMsg => {});
        })
        .catch(() => {});
    },
    deleteVideo() {
      this.$confirm('确定要删除视频信息?', '视频信息删除', {
        type: 'warning'
      })
        .then(() => {
          getdeleteVideoDetail(this.dialog.detail.videoId)
            .then(resp => {
              this.$message.success('操作成功');
              this.deleteBtnDisabled = true;
              this.$emit('done');
              this.show = false;
            })
            .catch(errorMsg => {});
        })
        .catch(() => {});
    },
    openDetailDialog(row) {
      this.show = true;
      this.dialog.detail.formLoading = true;
      getVideoReportDetail(row.infoId)
        .then(({ data }) => {
          this.dialog.detail.videoId = data.detail[0].videoId;
          this.dialog.detail.createTime = data.detail[0].createTime;
          this.dialog.detail.userId = data.detail[0].userId;
          this.dialog.detail.niceName = data.detail[0].nickName;
          this.dialog.detail.statues = data.detail[0].statues;
          this.dialog.detail.fileUrl = data.detail[0].url;
          this.dialog.detail.formLoading = false;
          // 判断当前视频状态, 修改按钮的属性
          if (this.dialog.detail.statues === 0) {
            this.deleteBtnDisabled = true;
            this.freezeBtnDisabled = true;
          } else if (this.dialog.detail.statues === 2) {
            this.freezeBtnDisabled = true;
            // this.deleteBtnDisabled = true;
          } else if (this.dialog.detail.statues === 1) {
            this.freezeBtnDisabled = false;
            this.deleteBtnDisabled = false;
          }
        })
        .catch(error => {
          this.$message.error('无法获取被举报的视频信息');
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
}
</style>
