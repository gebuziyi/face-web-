<template>
  <el-dialog :visible.sync="show" title="新增app点赞图图标" width="800px" @close="onDialogClose($refs.createForm)" :close-on-click-modal="false">
    <div v-loading="loading" class="edit-form-wrapper">
      <el-form size="small" :model="model" :rules="rules" label-position="left" label-width="120px" ref="createForm">
        <el-form-item label="活动名称" prop="name">
          <el-input v-model.trim="model.name"></el-input>
        </el-form-item>
        <el-form-item label="活动介绍" prop="description">
          <el-input v-model.trim="model.description" type="textarea" style="width:650px; height=20px;"></el-input>
        </el-form-item>
        <el-form-item label="活动封面图片" prop="imgUrl">
          <el-upload :action="uploadAction" :on-success="onUploadSuccess" :on-error="onUploadError" :file-list="imgFileList" list-type="picture" :before-remove="onFileRemove" ref="create-upload">
            <el-button size="small" type="primary">点击选择图片</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件</div>
          </el-upload>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer">
      <el-button @click="show = false" size="small">取 消</el-button>
      <el-button type="primary" @click="doCreate" size="small" :loading="btnLoading">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { createAppLikeImg } from '../../../api/app/app-like-img';
export default {
  name: 'app-like-img-create-dialog',
  data() {
    const token = this.$store.state.user.token || localStorage.getItem('token');

    return {
      rules: {
        name: [
          { required: true, trigger: 'change', message: '活动名称不能为空' }
        ],
        description: [
          { required: true, trigger: 'change', message: '活动介绍不能为空' }
        ],
        imgUrl: [
          { required: true, trigger: 'change', message: '活动封面不能为空' }
        ]
      },
      loading: false,
      model: {
        name: null,
        description: null,
        imgUrl: null
      },
      formLoading: true,
      btnLoading: false,
      // 文件上传的url
      uploadAction:
        '/faceshow-admin/api/fileupload?token=' +
        token +
        '&temp=' +
        new Date().getTime(),
      imgFileList: [],
      shareImgFileList: [],
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
        this.model.imgUrl = null;
        this.imgFileList = [];
        return;
      }
      // 上传文件在服务器上的地址, 根据当前对话框类型, 设置响应model的img属性值
      this.model.imgUrl = response;
      this.imgFileList = [].concat({ url: response });
      this.$message.success('上传成功!');
      this.$refs.createForm.validateField('imgUrl');
    },
    onUploadError(error, file, fileList) {
      this.$message({
        type: 'error',
        message: '新图片上传失败!'
      });
    },
    doCreate() {
      // 验证表单有效性
      this.$refs.createForm.validate(valid => {
        if (valid) {
          createAppLikeImg(this.model)
            .then(data => {
              this.$message.success('操作成功');
              this.btnLoading = false;
              this.show = false;
              this.$emit('done');
            })
            .catch(error => {
              this.btnLoading = false;
              this.show = true;
            });
        } else {
          return false;
        }
      });
    },
    onDialogClose(formRef) {
      if (formRef) {
        formRef.resetFields();
      }
      this.imgFileList = [];
    },
    showDialog() {
      this.show = true;
    }
  }
};
</script>

<style scoped>
</style>
