<template>
  <el-dialog :visible.sync="show" title="新增启动页" width="800px" @close="onDialogClose($refs.createForm)" :close-on-click-modal="false">
    <div v-loading="loading" class="edit-form-wrapper">
      <el-form size="small" :model="model" :rules="rules" label-position="left" label-width="120px" ref="createForm">
        <el-form-item label="请选择活动类型" prop="type">
          <el-select v-model="model.type" placeholder="类型" clearable>
            <el-option v-for="(item, index) in types" :key="index" :value="item.type" :label="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="活动名称" prop="name">
          <el-input v-model.trim="model.name"></el-input>
        </el-form-item>
        <el-form-item label="活动页面URL" prop="webPageUrl">
          <el-input v-model.trim="model.webPageUrl"></el-input>
        </el-form-item>
        <el-form-item label="活动介绍" prop="introduction">
          <el-input v-model.trim="model.introduction" type="textarea" style="width:650px; height=20px;"></el-input>
        </el-form-item>
        <el-form-item label="开始时间" prop="startTime">
          <el-date-picker v-model="model.startTime" type="datetime" :picker-options="expireTimeOption" placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-date-picker v-model="model.endTime" type="datetime" :picker-options="expireTimeOption" placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss">
          </el-date-picker>
        </el-form-item>
        <el-form-item prop="appLikeImgId" label="点赞图标">
          <el-select v-model="model.appLikeImgId" multiple placeholder="请选择点赞图标" @change="onRoleChange">
            <el-option v-for="item in appLikeImgList" :key="item.id" :label="item.name" :value="item.id">
              <div>
                <span>{{item.name}}</span>
                <img :src="item.imgUrl" width="20px" height="20px" style="float: right"/>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="浮动图标" prop="floatIconUrl">
          <el-upload :action="uploadAction" :on-success="onFloatIconUrlUploadSuccess" :on-error="onFloatIconUrlUploadError" :file-list="floatIconUrlFileList" list-type="picture" :before-remove="onFloatIconUrlRemove" ref="float-img-upload">
            <el-button size="small" type="primary">点击选择图片</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="活动封面图片" prop="coverImgUrl">
          <el-upload :action="uploadAction" :on-success="onUploadSuccess" :on-error="onUploadError" :file-list="imgFileList" list-type="picture" :before-remove="onFileRemove" ref="create-upload">
            <el-button size="small" type="primary">点击选择图片</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="分享文案(中文)" prop="shareTextCn">
          <el-input v-model.trim="model.shareTextCn" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="分享文案(英文)" prop="shareTextEn">
          <el-input v-model.trim="model.shareTextEn" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="分享封面图片" prop="shareImgUrl">
          <el-upload :action="uploadAction" :on-success="onShareImgUploadSuccess" :on-error="onShareImgUploadError" :file-list="shareImgFileList" list-type="picture" :before-remove="onShareImgFileRemove" ref="share-img-upload">
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
import { createAppActivity } from '../../../api/app/app-activity';
import { getAllAppLikeImgNames } from '../../../api/app/app-like-img';
import { APP_ACTIVITY_TYPES } from '../../../utils/constants';

export default {
  name: 'app-activity-create-dialog',
  data() {
    const token = this.$store.state.user.token || localStorage.getItem('token');

    return {
      rules: {
        type: [{ required: true, trigger: 'change', message: '类型不能为空' }],
        name: [
          { required: true, trigger: 'change', message: '活动名称不能为空' }
        ],
        webPageUrl: [
          { required: true, trigger: 'change', message: '活动页面URL不能为空' }
        ],
        introduction: [
          { required: true, trigger: 'change', message: '活动介绍不能为空' }
        ],
        startTime: [
          { required: true, trigger: 'change', message: '开始时间不能为空' }
        ],
        endTime: [
          { required: true, trigger: 'change', message: '结束时间不能为空' }
        ],
        coverImgUrl: [
          { required: true, trigger: 'change', message: '活动封面不能为空' }
        ],
        shareImgUrl: [
          {
            required: true,
            trigger: 'change',
            message: '活动分享封面图片不能为空'
          }
        ],
        shareTextCn: [
          { required: true, trigger: 'change', message: '中文分享文案不能为空' }
        ],
        shareTextEn: [
          { required: true, trigger: 'change', message: '英文分享文案不能为空' }
        ]
      },
      expireTimeOption: {
        disabledDate(date) {
          // let now = new Date();
          return date.getTime() <= Date.now();
          // return date.getTime() <= Date.parse(`${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()} 23:59:59`);
        }
      },
      loading: false,
      model: {
        type: null,
        name: null,
        webPageUrl: null,
        introduction: null,
        startTime: null,
        endTime: null,
        coverImgUrl: null,
        shareImgUrl: null,
        shareTextCn: null,
        shareTextEn: null,
        floatIconUrl: null,
        appLikeImgId: []
      },
      appLikeImgList: [],
      types: APP_ACTIVITY_TYPES,
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
      floatIconUrlFileList: [],
      show: false
    };
  },
  methods: {
    getAllAppLikeImg() {
      getAllAppLikeImgNames()
        .then(({ data }) => {
          this.appLikeImgList = data.list;
        })
        .catch(error => {});
    },
    onRoleChange(values) {
      if (values) {
        this.model.appLikeImgId = values;
      } else {
        this.model.appLikeImgId = null;
      }
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
        this.model.coverImgUrl = null;
        this.imgFileList = [];
        return;
      }
      // 上传文件在服务器上的地址, 根据当前对话框类型, 设置响应model的img属性值
      this.model.coverImgUrl = response;
      this.imgFileList = [].concat({ url: response });
      this.$message.success('上传成功!');
      this.$refs.createForm.validateField('coverImgUrl');
    },
    onUploadError(error, file, fileList) {
      this.$message({
        type: 'error',
        message: '新图片上传失败!'
      });
    },
    onShareImgFileRemove(file, fileList) {
      // 由于图片为必选项, 所以这里禁止移除已经上传的图片文件
      this.$message({
        type: 'warning',
        message: '图片文件不可为空!'
      });
      return false;
    },
    onShareImgUploadSuccess(response, file, fileList) {
      // response is the file url or {code: 500, msg: 'error msg here'}
      if (response.code && response.code !== 0) {
        // 此时虽然http的status=200, 但实际上结果为上传失败!!!
        this.$message({
          type: 'error',
          message: '图片上传失败: ' + response.msg
        });
        this.model.shareImgUrl = null;
        this.shareImgFileList = [];
        return;
      }
      // 上传文件在服务器上的地址, 根据当前对话框类型, 设置响应model的img属性值
      this.model.shareImgUrl = response;
      this.shareImgFileList = [].concat({ url: response });
      this.$message.success('上传成功!');
      this.$refs.createForm.validateField('shareImgUrl');
    },
    onShareImgUploadError(error, file, fileList) {
      this.$message({
        type: 'error',
        message: '分享封面图片上传失败!'
      });
    },
    onFloatIconUrlRemove(file, fileList) {
      // 由于图片为必选项, 所以这里禁止移除已经上传的图片文件
      this.$message({
        type: 'warning',
        message: '图片文件不可为空!'
      });
      return false;
    },
    onFloatIconUrlUploadSuccess(response, file, fileList) {
      // response is the file url or {code: 500, msg: 'error msg here'}
      if (response.code && response.code !== 0) {
        // 此时虽然http的status=200, 但实际上结果为上传失败!!!
        this.$message({
          type: 'error',
          message: '图片上传失败: ' + response.msg
        });
        this.model.floatIconUrl = null;
        this.floatIconUrlFileList = [];
        return;
      }
      // 上传文件在服务器上的地址, 根据当前对话框类型, 设置响应model的img属性值
      this.model.floatIconUrl = response;
      this.floatIconUrlFileList = [].concat({ url: response });
      this.$message.success('上传成功!');
      this.$refs.createForm.validateField('floatIconUrl');
    },
    onFloatIconUrlUploadError(error, file, fileList) {
      this.$message({
        type: 'error',
        message: '分享封面图片上传失败!'
      });
    },
    doCreate() {
      // 验证表单有效性
      this.$refs.createForm.validate(valid => {
        if (valid) {
          if (this.model.endTime <= this.model.startTime) {
            this.$message.error('结束时间必须大于开始时间');
            return;
          }
          createAppActivity(this.model)
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
      this.shareImgFileList = [];
      this.floatIconUrlFileList = [];
    },
    showDialog() {
      this.show = true;
      this.getAllAppLikeImg();
    }
  }
};
</script>

<style scoped>
</style>
