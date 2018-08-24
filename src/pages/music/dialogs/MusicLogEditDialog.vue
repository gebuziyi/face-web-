<template>
  <el-dialog :visible.sync="show" title="修改音乐类型" width="800px" @close="onDialogClose($refs.editForm)" :close-on-click-modal="false">
    <div v-loading="formLoading" class="edit-form-wrapper">
      <el-form size="small" :model="model" :rules="rules" label-position="left" label-width="120px" ref="editForm">
        <el-form-item label="类型名称" prop="typeName">
          <el-input v-model.trim="model.typeName"></el-input>
        </el-form-item>
        <el-form-item label="类型图片" prop="typeImg">
          <el-upload :action="uploadAction" :on-success="onUploadSuccess" :on-error="onUploadError" :file-list="imgFileList" list-type="picture" :before-remove="onFileRemove" ref="edit-upload">
            <el-button size="small" type="primary">点击选择图片</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件</div>
          </el-upload>
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
import { updateMusicType, getMusicLogDetail } from '../../../api/music/music-log';

export default {
  name: 'music-log-edit-dialog',
  data() {
    const token = this.$store.state.user.token || localStorage.getItem('token');

    return {
      model: emptyMusicType(),
      rules: {
        typeName: [
          { required: true, trigger: 'change', message: '类型名称不能为空' }
        ],
        typeImg: [
          { required: true, trigger: 'change', message: '类型图片不能为空' }
        ]
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
      show: false
    };
  },
  methods: {
    getDetail() {
      getMusicLogDetail(this.user_id)
        .then(({ data }) => {
          this.model = data.type;
          this.imgFileList = [].concat({ url: data.type.typeImg });
          // 取消对话框表单loading状态
          this.formLoading = false;
        })
        .catch(error => {
          this.show = false;
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
          message: '图片上传失败: ' + response.msg
        });
        this.model.typeImg = null;
        this.imgFileList = [];
        return;
      }
      // 上传文件在服务器上的地址, 根据当前对话框类型, 设置响应model的img属性值
      this.model.typeImg = response;
      this.imgFileList = [].concat({ url: response });
      this.$message.success('上传成功!');
    },
    onUploadError(error, file, fileList) {
      this.$message({
        type: 'error',
        message: '新图片上传失败!'
      });
    },
    doEdit() {
      // 验证表单有效性
      this.$refs.editForm.validate(valid => {
        if (valid) {
          updateMusicType(this.model)
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
    onDialogClose(formRef) {
      if (formRef) {
        formRef.resetFields();
      }
      this.imgFileList = [];
    },
    showDialog(user_id) {
      this.user_id = user_id;
      this.show = true;
      this.getDetail();
    }
  }
};
</script>

<style scoped>

</style>
