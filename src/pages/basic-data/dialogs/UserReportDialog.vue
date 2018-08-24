<template>
  <el-dialog :visible.sync="show" :title="`${dialog.detail.niceName}, ${dialog.detail.createTime} 举报个人详情: `" width="1000px">
    <div v-loading="dialog.detail.loadidialog" class="create-form-wrapper">
      <el-form size="small" :model="dialog.detail" label-position="left" label-width="150px" ref="infoForm">
        <el-form-item label="被举报用户ID">
          <span class="detail-span" v-text="dialog.detail.id" v-if="dialog.detail.content !== ''"></span>
        </el-form-item>
        <el-form-item label="被举报用户昵称">
          <span class="detail-span" v-text="dialog.detail.niceName" v-if="dialog.detail.content !== ''"></span>
        </el-form-item>
        <el-form-item label="被举报用户头像">
          <template slot-scope="scope">
            <icon-tag type="warning" icon="fa fa-info" v-if="dialog.detail.img === '' || dialog.detail.img === null">无头像</icon-tag>
            <img v-else :src="dialog.detail.img" class="img-thumb" />
          </template>
        </el-form-item>
        <el-form-item label="被举报用户注册时间">
          <span class="detail-span" v-text="dialog.detail.createTime" v-if="dialog.detail.content !== ''"></span>
        </el-form-item>
        <el-form-item label="被举报用户国家">
          <span class="detail-span" v-text="dialog.detail.country" v-if="dialog.detail.content !== ''"></span>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer">
      <el-button type="primary" @click="show = false" size="small">关闭</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { getUserReportDetail } from '../../../api/basic-data/report-info';
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
          id: null,
          niceName: null,
          img: null,
          createTime: null,
          country: null,
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
      getUserReportDetail(row.infoId)
        .then(({ data }) => {
          this.dialog.detail.id = data.detail.userId;
          this.dialog.detail.niceName = data.detail.nickName;
          this.dialog.detail.img = data.detail.img;
          this.dialog.detail.createTime = data.detail.regTime;
          this.dialog.detail.country = data.detail.country;
          this.dialog.detail.formLoading = false;
        })
        .catch(error => {
          this.$message.error('无法获取被举报的个人信息');
          this.show = false;
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
