<template>
  <el-dialog :visible.sync="show" title="修改视频话题" width="800px" @close="onDialogClose('editForm')" :close-on-click-modal="false">
    <div v-loading="loading" class="edit-form-wrapper">
      <el-form size="small" :model="model" :rules="rules" label-position="left" label-width="90px" ref="editForm">
        <el-form-item label="话题名称" prop="tname">
          <el-input v-model.trim="model.tname"></el-input>
        </el-form-item>
        <el-form-item label="话题图片" prop="img">
          <el-upload :action="uploadAction" :on-success="onUploadSuccess" :on-error="onUploadError" :file-list="imgFileList" list-type="picture" :before-remove="onFileRemove" ref="edit-upload">
            <el-button size="small" type="primary">点击选择图片</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="话题介绍" prop="introduction">
          <el-input v-model.trim="model.introduction" type="textarea"></el-input>
        </el-form-item>
       <el-form-item label="分享短链接" prop="shareUrl" label-width="90px">
          <el-input v-model.trim="model.shareUrl" readonly></el-input>
        </el-form-item>
        <el-form-item label="是否选择url" prop="linkedToUrl" >
         <el-switch v-model="model.linkedToUrl" :active-value="true" :inactive-value="false" active-color="#13ce66" inactive-color="#ff4949" active-text="是" inactive-text="否"></el-switch>
        </el-form-item>
        <div v-if="this.model.linkedToUrl === true">
          <el-form-item label="url标题" prop="urlTitle">
            <el-input v-model.trim="model.urlTitle" oninput="if(value.length > 125)value = value.slice(0, 125)"></el-input>
          </el-form-item>
          <el-form-item label="url" prop="url">
            <el-input v-model.trim="model.url" type="textarea" oninput="if(value.length > 225)value = value.slice(0, 225)" placeholder="url"></el-input>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <span slot="footer">
      <el-button @click="show = false" size="small">取 消</el-button>
      <el-button type="primary" @click="doEdit" size="small" :loading="btnLoading">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {
  updateVideoTopic,
  getVideoTopicDetail
} from '../../../api/video/video-topic';
import { emptyVideoTopic } from '../../../utils/empty-model';

export default {
  name: 'video-topic-edit-dialog',

  data() {
    const token = this.$store.state.user.token;

    return {
      uploadAction:
        '/faceshow-admin/api/fileupload?token=' +
        token +
        '&temp=' +
        new Date().getTime(),
      rules: {
        tname: [
          { required: true, trigger: 'change', message: '话题名称不能为空' }
        ],
        urlTitle: [
          { required: true, trigger: 'change', message: 'url标题不能为空' }
        ],
        url: [
          { required: true, trigger: 'change', message: 'url不能为空' },
          {
            pattern: /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .?%&=]*)?/,
            message: '请输入正确的url'
          }
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
    showDialog(topicId) {
      this.show = true;
      this.loading = true;
      getVideoTopicDetail(topicId)
        .then(({ data }) => {
          this.model = data.detail;
          this.imgFileList = [].concat({ url: data.detail.img });
          // 取消对话框表单loading状态
          this.loading = false;
        })
        .catch(error => {});
    },
    doEdit() {
      // 验证表单有效性
      this.$refs.editForm.validate(valid => {
        if (valid) {
          if (
            this.model.introduction &&
            this.model.introduction.length > 1000
          ) {
            this.$message.error('介绍不能超过1000个字符!');
            return;
          }
          if (this.model.linkedToUrl === false) {
            this.model.urlTitle = null;
            this.model.url = null;
          }
          updateVideoTopic(this.model)
            .then(data => {
              this.$message.success('操作成功');
              this.$refs['edit-upload'].clearFiles();
              this.imgFileList = [];
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

    onFileRemove(file, fileList) {
      // 由于图片为必选项, 所以这里禁止移除已经上传的图片文件
      this.model.img = null;
    },

    onUploadSuccess(response, file, fileList) {
      // response is the file url or {code: 500, msg: 'error msg here'}
      if (response.code && response.code !== 0) {
        // 此时虽然http的status=200, 但实际上结果为上传失败!!!
        this.$message({
          type: 'error',
          message: `图片上传失败: ${response.msg}`
        });
        this.$refs['edit-upload'].clearFiles();
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
      this.imgFileList = [];
    }
  }
};
</script>

<style scoped>
</style>
