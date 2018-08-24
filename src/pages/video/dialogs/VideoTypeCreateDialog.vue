<template>
  <el-dialog :visible.sync="show" title="新增视频类型" width="800px" @close="onDialogClose" :close-on-click-modal="false">
    <div v-loading="loading" class="edit-form-wrapper">
      <el-form size="small" :model="model" :rules="rules" label-position="left" label-width="80px" ref="createForm">
        <el-form-item label="类型名称" prop="tname">
          <el-input v-model.trim="model.tname"></el-input>
        </el-form-item>
        <el-form-item label="图标" prop="img">
          <el-upload :action="uploadAction" :on-success="onImgUploadSuccess" :on-error="onUploadError" :file-list="imgFileList" list-type="picture" :before-remove="onFileRemove" ref="img-upload">
            <el-button size="small" type="primary">点击选择图标</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="背景图" prop="backgroundImg">
          <el-upload :action="uploadAction" :on-success="onBgImgUploadSuccess" :on-error="onUploadError" :file-list="bgImgFileList" list-type="picture" :before-remove="onFileRemove" ref="bg-img-upload">
            <el-button size="small" type="primary">点击选择背景图</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="类型介绍" prop="introduction">
          <el-input v-model.trim="model.introduction" type="textarea"></el-input>
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
import { createVideoType } from '../../../api/video/video-type';
import { emptyVideoType } from '../../../utils/empty-model';

export default {
  name: 'video-type-create-dialog',

  data() {
    const token = this.$store.state.user.token;

    return {
      uploadAction: `/faceshow-admin/api/fileupload?token=${token}&temp=${Date.now()}`,
      rules: {
        tname: [
          { required: true, trigger: 'change', message: '类型名称不能为空' }
        ],
        img: [{ required: true, trigger: 'change', message: '图标不能为空' }],
        backgroundImg: [
          { required: true, trigger: 'change', message: '背景图不能为空' }
        ]
      },
      imgFileList: [],
      bgImgFileList: [],
      show: false,
      loading: false,
      btnLoading: false,
      model: emptyVideoType()
    };
  },

  methods: {
    showDialog() {
      this.show = true;
    },

    doCreate() {
      // 验证表单有效性
      this.$refs.createForm.validate(valid => {
        if (valid) {
          createVideoType(this.model)
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

    onImgUploadSuccess(response, file, fileList) {
      // response is the file url or {code: 500, msg: 'error msg here'}
      if (response.code && response.code !== 0) {
        // 此时虽然http的status=200, 但实际上结果为上传失败!!!
        this.$message({
          type: 'error',
          message: `图标上传失败: ${response.msg}`
        });
        this.$refs['img-upload'].clearFiles();
        this.model.img = null;
        this.imgFileList = [];
        return;
      }
      // 上传文件在服务器上的地址, 设置响应model的img属性值
      this.model.img = response;
      this.imgFileList = [].concat({ url: response });
      this.$refs.createForm.validateField('img');
      this.$message.success('上传成功!');
    },

    onFileRemove(file, fileList) {
      // 由于图片为必选项, 所以这里禁止移除已经上传的图片文件
      this.$message({
        type: 'warning',
        message: '文件不可为空!'
      });
      return false;
    },

    onBgImgUploadSuccess(response, file, fileList) {
      // response is the file url or {code: 500, msg: 'error msg here'}
      if (response.code && response.code !== 0) {
        // 此时虽然http的status=200, 但实际上结果为上传失败!!!
        this.$message({
          type: 'error',
          message: `背景图上传失败: ${response.msg}`
        });
        this.$refs['bg-img-upload'].clearFiles();
        this.model.backgroundImg = null;
        this.bgImgFileList = [];
        return;
      }
      // 上传文件在服务器上的地址, 设置响应model的img属性值
      this.model.backgroundImg = response;
      this.bgImgFileList = [].concat({ url: response });
      this.$refs.createForm.validateField('backgroundImg');
      this.$message.success('上传成功!');
    },

    onUploadError(error, file, fileList) {
      this.$message({
        type: 'error',
        message: '上传失败!'
      });
    },

    onDialogClose() {
      this.$refs['createForm'].resetFields();
      this.$refs['img-upload'].clearFiles();
      this.$refs['bg-img-upload'].clearFiles();
      this.imgFileList = [];
      this.bgImgFileList = [];
    }
  }
};
</script>

<style scoped>

</style>
