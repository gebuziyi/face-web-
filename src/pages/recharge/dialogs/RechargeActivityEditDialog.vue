<template>
  <el-dialog :visible.sync="show" title="修改充值优惠活动" width="800px" @close="onDialogClose" :close-on-click-modal="false">
    <div v-loading="loading" class="edit-form-wrapper">
      <el-form size="small" :model="model" :rules="rules" label-position="left" label-width="120px" ref="editForm">
        <el-form-item label="活动名称" prop="activityName">
          <el-input v-model.trim="model.activityName"></el-input>
        </el-form-item>
        <el-form-item label="类型图片" prop="img">
          <el-upload :action="uploadAction" :on-success="onUploadSuccess" :on-error="onUploadError" :file-list="imgFileList" list-type="picture" :before-remove="onFileRemove" ref="create-upload">
            <el-button size="small" type="primary">点击选择图片</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="优惠比例" prop="preferences">
          <el-input-number v-model.trim="model.preferences" :min="1" :max="100"></el-input-number>
          <span>%</span>
        </el-form-item>
        <el-form-item label="优惠次数" prop="preferenCount">
          <el-radio-group v-model="model.preferenCount">
            <el-radio-button :label="1">仅一次</el-radio-button>
            <el-radio-button :label="0">无限次</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="活动介绍" prop="introduction">
          <el-input type="textarea" v-model.trim="model.introduction"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer">
      <el-button @click="show = false" size="small">取 消</el-button>
      <el-button type="primary" @click="doEdit" size="small" :loading="btnLoading">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { updateRechargeActivity, getRechargeActivityDetail } from '../../../api/recharge/recharge-activity';
import { emptyRechargeActivity } from '../../../utils/empty-model';

export default {
  name: 'recharge-activity-create-dialog',
  data() {
    const token = this.$store.state.user.token || localStorage.getItem('token');

    return {
      loading: false,
      model: emptyRechargeActivity(),
      rules: {
        activityName: [
          { required: true, trigger: 'change', message: '活动名称不能为空' }
        ],
        introduction: [
          { required: true, trigger: 'change', message: '活动介绍不能为空' }
        ],
        img: [
          { required: true, trigger: 'change', message: '类型图片不能为空' }
        ],
        preferences: [
          { required: true, trigger: 'change', message: '优惠比例不能为空' }
        ],
        preferenCount: [
          { required: true, trigger: 'change', message: '优惠次数不能为空' }
        ]
      },
      formLoading: true,
      btnLoading: false,
      // 文件上传的url
      uploadAction: `/faceshow-admin/api/fileupload?token=${token}&temp=${Date.now()}`,
      imgFileList: [],
      show: false
    };
  },
  methods: {
    onFileRemove(file, fileList) {
      // 由于图片为必选项, 所以这里禁止移除已经上传的图片文件
      this.$message({
        type: 'warning',
        message: '图片文件不可为空!'
      });
      return false;
    },
    onUploadSuccess(response, file, fileList) {
      // response is the file url or {code: 500, msg: 'error msg here'}
      if (response.code && response.code !== 0) {
        // 此时虽然http的status=200, 但实际上结果为上传失败!!!
        this.$message({
          type: 'error',
          message: '图片上传失败: ' + response.msg
        });
        this.$refs.editForm.validateField('img');
        return;
      }
      this.model.img = response;
      this.imgFileList = [].concat({ url: response });
      this.$refs.editForm.validateField('img');
      this.$message.success('上传成功!');
    },
    onUploadError(error, file, fileList) {
      this.$message({
        type: 'error',
        message: '图片上传失败!'
      });
    },
    doEdit() {
      // 验证表单有效性
      this.$refs.editForm.validate(valid => {
        if (valid) {
          updateRechargeActivity(this.model)
            .then(data => {
              this.$message.success('操作成功');
              this.btnLoading = false;
              this.show = false;
              this.$emit('done');
            })
            .catch(error => {
              // do something
            });
        } else {
          return false;
        }
      });
    },
    onDialogClose() {
      this.$refs.editForm.resetFields();
      this.imgFileList = [];
    },
    showDialog(activityId) {
      this.show = true;
      this.loading = true;
      this.getDetailForEdit(activityId);
    },
    getDetailForEdit(activityId) {
      getRechargeActivityDetail(activityId)
        .then(({ data }) => {
          this.model = data.detail;
          this.imgFileList = [].concat({ url: data.detail.img })
          this.loading = false;
        })
        .catch(err => {
          this.$message.error('获取优惠活动信息失败')
        })
    }
  }
};
</script>

<style scoped>
</style>
