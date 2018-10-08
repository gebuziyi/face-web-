<template>
  <el-dialog :visible.sync="show" title="新增视频话题" width="800px" @close="onDialogClose('createForm')" :close-on-click-modal="false">
    <div v-loading="loading" class="edit-form-wrapper">
      <el-form size="small" :model="model" :rules="rules" label-position="left" label-width="80px" ref="createForm">
        <el-form-item label="话题名称" prop="tname">
          <el-input v-model.trim="model.tname"></el-input>
        </el-form-item>
        <el-form-item label="话题图片" prop="img">
          <el-upload :action="uploadAction" :on-success="onUploadSuccess" :on-error="onUploadError" :file-list="imgFileList" list-type="picture" :before-remove="onFileRemove" ref="create-upload">
            <el-button size="small" type="primary">点击选择图片</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="话题介绍" prop="introduction">
          <el-input v-model.trim="model.introduction" type="textarea" placeholder="介绍一下这个话题... ..."></el-input>
        </el-form-item>
        <el-form-item label="马甲账号" prop="userId">
          <el-select v-model="model.userId" placeholder="请选择一个马甲账号" filterable>
            <el-option v-for="(item, index) in vests" :key="index" :value="item.userId" :label="item.nickname"></el-option>
          </el-select>
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
import { createVideoTopic } from '../../../api/video/video-topic';
import { emptyVideoTopic } from '../../../utils/empty-model';

export default {
  name: 'video-topic-create-dialog',

  data() {
    const token = this.$store.state.user.token;

    return {
      vests: [],
      uploadAction: `/faceshow-admin/api/fileupload?token=${token}&temp=${Date.now()}`,
      rules: {
        tname: [
          { required: true, trigger: 'change', message: '话题名称不能为空' }
        ],
        img: [
          { required: true, trigger: 'change', message: '话题图片不能为空' }
        ],
        userId: [
          { required: true, trigger: 'change', message: '马甲账号不能为空' }
        ]
      },
      imgFileList: [],
      show: false,
      loading: false,
      btnLoading: false,
      model: emptyVideoTopic()
    };
  },

  methods: {
    showDialog(vests) {
      this.vests = vests;
      this.show = true;
    },

    doCreate() {
      // 验证表单有效性
      this.$refs.createForm.validate(valid => {
        if (valid) {
          if (this.model.introduction && this.model.introduction.length > 256) {
            this.$message.error('介绍不能超过256个字符!');
            return;
          }
          createVideoTopic(this.model)
            .then(data => {
              this.$message.success('操作成功');
              this.$refs['create-upload'].clearFiles();
              this.imgFileList = [];
              this.btnLoading = false;
              this.show = false;
              this.$emit('done');
            })
            .catch(error => {
              // do something
              this.$refs['create-upload'].clearFiles();
              this.imgFileList = [];
              this.btnLoading = false;
              this.show = false;
              this.$emit('done');
            });
        } else {
          return false;
        }
      });
    },

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
          message: `图片上传失败: ${response.msg}`
        });
        this.$refs['create-upload'].clearFiles();
        this.model.img = null;
        this.imgFileList = [];
        return;
      }
      // 上传文件在服务器上的地址, 设置响应model的img属性值
      this.model.img = response;
      this.imgFileList = [].concat({ url: response });
      this.$message.success('上传成功!');
    },

    onUploadError(error, file, fileList) {
      this.$message({
        type: 'error',
        message: '新图片上传失败!'
      });
    },

    onDialogClose(formRef) {
      this.$refs[formRef].resetFields();
      this.$refs['create-upload'].clearFiles();
      this.imgFileList = [];
    }
  }
};
</script>

<style scoped>
</style>
