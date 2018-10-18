<template>
  <el-dialog :visible.sync="show" title="修改启动页" width="800px" @close="onDialogClose($refs.createForm)" :close-on-click-modal="false">
    <div v-loading="loading" class="edit-form-wrapper">
      <el-form size="small" :model="model" :rules="rules" label-position="left" label-width="120px" ref="createForm">
        <el-form-item label="类型" prop="type">
          <el-select v-model="model.type" placeholder="类型" clearable>
            <el-option v-for="(item, index) in types" :key="index" :value="item.type" :label="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="点击动作" prop="clickAction">
          <el-input v-model.number="model.clickAction"></el-input>
        </el-form-item>
        <el-form-item label="完成动作需要的参数" prop="actionData">
          <el-input v-model.trim="model.actionData"></el-input>
        </el-form-item>
        <el-form-item label="是否可点击" prop="clickable">
          <el-switch v-model="model.clickable" :active-value="true" :inactive-value="false" active-color="#13ce66" inactive-color="#ff4949" active-text="是" inactive-text="否"></el-switch>
        </el-form-item>
        <el-form-item label="是否可跳过" prop="skippable">
            <el-switch v-model="model.skippable" :active-value="true" :inactive-value="false" active-color="#13ce66" inactive-color="#ff4949" active-text="是" inactive-text="否"></el-switch>
        </el-form-item>
        <el-form-item label="停留时间" prop="stayTime">
            <el-input-number v-model="model.stayTime" :min="1" :disabled="!model.skippable"></el-input-number>
        </el-form-item>
        <el-form-item label="生效时间" prop="enableTime">
          <el-date-picker
            v-model="model.enableTime"
            type="datetime"
            placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="失效时间" prop="disableTime">
          <el-date-picker
            v-model="model.disableTime"
            type="datetime"
            placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="文件地址" prop="fileUrl">
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
import { getAppSplashScreenDertail, updateAppSplashScreen } from '../../../api/app/app-splash-screen';
import { APP_SPLASH_SCREEN_TYPE } from '../../../utils/constants';
export default {
  name: 'app-splash-screen-create-dialog',
  data() {
    const token = this.$store.state.user.token || localStorage.getItem('token');

    return {
      rules: {
        type: [
          { required: true, trigger: 'change', message: '类型不能为空' }
        ],
        clickAction: [
          { required: true, type: 'number', trigger: 'change', message: '点击必须为整数' }
        ],
        actionData: [
          { required: true, trigger: 'change', message: '完成动作需要的参数不能为空' }
        ],
        enableTime: [
          { required: true, trigger: 'change', message: '生效时间不能为空' }
        ],
        disableTime: [
          { required: true, trigger: 'change', message: '失效时间不能为空' }
        ],
        fileUrl: [
          { required: true, trigger: 'change', message: 'url不能为空' }
        ]
      },
      loading: false,
      model: {
        type: null,
        fileUrl: null,
        clickable: null,
        stayTime: null,
        skippable: null,
        clickAction: null,
        actionData: null,
        enableTime: null,
        disableTime: null
      },
      types: APP_SPLASH_SCREEN_TYPE,
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
        this.model.fileUrl = null;
        this.imgFileList = [];
        return;
      }
      // 上传文件在服务器上的地址, 根据当前对话框类型, 设置响应model的img属性值
      this.model.fileUrl = response;
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
      this.$refs.createForm.validate(valid => {
        if (valid) {
          var remindTime = this.model.disableTime;
          var str = remindTime.toString();
          str = str.replace('/-/g', '/');
          var oldTime = new Date(str).getTime();
          if (this.model.disableTime <= this.model.enableTime || oldTime <= new Date().getTime()) {
            this.$message.error('失效时间必须大于生效时间和当前时间');
            return;
          }
          updateAppSplashScreen(this.model)
            .then(data => {
              this.$message.success('操作成功');
              this.btnLoading = false;
              this.show = false;
              this.$emit('done')
            })
            .catch(error => {
              this.btnLoading = false;
              this.show = true;
              this.$message.error('您选择的生效期已有其他启动页正在生效，请选择其他生效期');
            });
        } else {
          return false;
        }
      });
    },
    doGetAppSplashScreenDertail(id) {
      getAppSplashScreenDertail(id)
        .then(data => {
          this.imgFileList = [].concat({ url: this.model.fileUrl });
          this.model = data.data.detail;
          this.show = true;
          this.$emit('done')
        })
        .catch(error => {
          // do something
        });
    },
    onDialogClose(formRef) {
      if (formRef) {
        formRef.resetFields();
      }
      this.imgFileList = [];
    },
    showDialog(id) {
      this.show = true;
      this.doGetAppSplashScreenDertail(id);
    }
  }
};
</script>

<style scoped>
</style>
