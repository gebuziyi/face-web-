<template>
  <el-dialog :visible.sync="show" title="修改视频信息" width="800px" @close="onDialogClose('editForm')" :close-on-click-modal="false">
    <div v-loading="loading" class="edit-form-wrapper">
      <el-form size="small" :model="model" :rules="rules" label-position="left" label-width="80px" ref="editForm">
        <el-form-item prop="typeId" label="视频类型">
          <el-select v-model="model.typeId" placeholder="视频类型" filterable>
            <template v-for="(item, index) in types">
              <el-option :label="item.videoTypeName" :value="item.videoTypeId" :key="index"></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item prop="country" label="国家">
          <el-select v-model="model.country" placeholder="国家" filterable>
            <el-option v-for="(item, index) in countries" :key="index" :value="item.coding" :label="item.countryName"></el-option>
          </el-select>
        </el-form-item>
        <!-- 只有公开视频才可以修改热度值 -->
        <el-form-item label="热度值" prop="heatNum">
          <el-input-number v-model="model.heatNum" placeholder="视频热度值(0-999999)" :min="0" :max="999999"></el-input-number>
        </el-form-item>
        <el-form-item label="话题图片" prop="img">
          <el-upload :action="uploadAction" :on-success="onUploadSuccess" :on-error="onUploadError" :file-list="imgFileList" list-type="picture" :before-remove="onFileRemove" ref="edit-upload">
            <el-button size="small" type="primary">点击选择图片</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="视频简介" prop="introduction">
          <el-input v-model.trim="model.introduction" type="textarea"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer">
      <el-button @click="show = false" size="small">取 消</el-button>
      <el-button type="primary" @click="doEdit" size="small">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {
  getVideoInfoDetail,
  updateVideoInfo
} from '../../../api/video/video-info';

export default {
  name: 'video-info-edit-dialog',

  data() {
    const token = this.$store.state.user.token | localStorage.getItem('token');

    return {
      uploadAction: `/faceshow-admin/api/fileupload?token=${token}&temp=${Date.now()}`,
      imgFileList: [],
      show: false,
      loading: false,
      model: {
        videoId: null,
        vname: null,
        img: null,
        description: null,
        country: null,
        typeId: null,
        heatNum: null
      },
      rules: {
        country: [
          { required: true, trigger: 'change', message: '国家不能为空' }
        ],
        typeId: [
          { required: true, trigger: 'change', message: '视频类型不能为空' }
        ],
        heatNum: [
          { required: true, trigger: 'change', message: '热度值不能为空' },
          {
            type: 'number',
            min: 0,
            max: 999999,
            trigger: 'change',
            message: '热度值有效范围: 0-999999'
          }
        ]
      }
    };
  },

  props: {
    types: {
      type: Array,
      required: true
    },

    countries: {
      type: Array,
      required: true
    }
  },

  methods: {
    onDialogClose(formRef) {
      this.$refs[formRef].resetFields();
      this.$refs['edit-upload'].clearFiles();
      this.imgFileList = [];
    },
    showDialog(videoId) {
      this.show = true;
      this.loading = true;
      getVideoInfoDetail(videoId)
        .then(({ data }) => {
          this.model = data.detail;
          this.imgFileList = [].concat({ url: this.model.img });
          this.loading = false;
        })
        .catch(error => {});
    },

    doEdit() {
      this.$refs.editForm.validate(valid => {
        if (!valid) {
          return;
        }

        this.loading = true;
        updateVideoInfo(this.model)
          .then(({ data }) => {
            this.$message.success('更新视频信息成功');
            this.loading = false;
            this.show = false;
            this.$emit('done');
          })
          .catch(error => {});
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
        this.imgFileList = [].concat({ url: this.model.img });
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
    }
  }
};
</script>
