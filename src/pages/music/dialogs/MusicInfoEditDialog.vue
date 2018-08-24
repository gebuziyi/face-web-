<template>
  <!-- 创建音乐信息 -->
  <el-dialog :visible.sync="show" title="修改音乐信息" width="800px" @close="onDialogClose($refs.editForm)" :close-on-click-modal="false">
    <div v-loading="loading" class="edit-form-wrapper">
      <el-form size="small" :model="model" :rules="rules" label-position="left" label-width="120px" ref="editForm">
        <el-form-item label="音乐名称" prop="mname">
          <el-input v-model.trim="model.mname"></el-input>
        </el-form-item>
        <el-form-item label="歌手/乐队" prop="singer">
          <el-input v-model.trim="model.singer"></el-input>
        </el-form-item>
        <el-form-item label="音乐类型" prop="typeId">
          <el-select v-model="model.typeId" placeholder="音乐类型" clearable>
            <el-option v-for="(item, index) in types" :key="index" :value="item.typeId" :label="item.typeName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="音乐文件" prop="url">
          <el-upload :action="uploadAction" :on-success="onMusicUploadSuccess" :on-error="onMusicUploadError" :file-list="musicFileList" :before-remove="onMusicFileRemove" accept="audio/*" ref="music-create-upload">
            <el-button size="small" type="primary">点击选择音乐文件</el-button>
            <div slot="tip" class="el-upload__tip">只能上传mp3文件</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="音乐封面" prop="img">
          <el-upload :action="uploadAction" :on-success="onUploadSuccess" :on-error="onUploadError" :file-list="imgFileList" list-type="picture" :before-remove="onFileRemove" accept="image/*" ref="img-create-upload">
            <el-button size="small" type="primary">点击选择新图片</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="国家" prop="country">
          <el-input v-model.trim="model.country"></el-input>
        </el-form-item>
        <el-form-item label="音乐介绍" prop="introduce">
          <el-input v-model.trim="model.introduce" type="textarea"></el-input>
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
import {
  updateMusicInfo,
  getMusicInfoDetail
} from '../../../api/music/music-info';
import { emptyMusicInfo } from '../../../utils/empty-model';

export default {
  name: 'music-info-edit-dialog',
  data() {
    const token = localStorage.getItem('token');

    return {
      musicId: null,
      show: false,
      loading: false,
      model: emptyMusicInfo(),
      imgFileList: [],
      musicFileList: [],
      rules: {
        mname: [
          { required: true, trigger: 'change', message: '音乐名称不能为空' }
        ],
        typeId: [
          { required: true, trigger: 'change', message: '音乐类型不能为空' }
        ],
        url: [
          { required: true, trigger: 'change', message: '音乐文件不能为空' }
        ],
        img: [
          {
            required: true,
            trigger: 'change',
            message: '音乐封面图片不能为空'
          }
        ]
      },
      formLoading: true,
      btnLoading: false,
      // 文件上传的url
      uploadAction:
        '/faceshow-admin/api/fileupload?token=' +
        token +
        '&temp=' +
        new Date().getTime()
    };
  },
  props: {
    types: {
      type: Array,
      required: true
    }
  },
  methods: {
    showDialog(musicId) {
      this.musicId = musicId;
      this.show = true;
      this.getMusicInfoDetail();
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
        this.model.img = null;
        this.imgFileList = [];
        return;
      }
      // 上传文件在服务器上的地址, 根据当前对话框类型, 设置响应model的img属性值
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
    onMusicFileRemove(file, fileList) {
      // 由于图片为必选项, 所以这里禁止移除已经上传的音乐文件
      this.$message({
        type: 'warning',
        message: '音乐文件不可为空!'
      });
      return false;
    },
    onMusicUploadSuccess(response, file, fileList) {
      console.log(file);
      // response is the file url or {code: 500, msg: 'error msg here'}
      if (response.code && response.code !== 0) {
        // 此时虽然http的status=200, 但实际上结果为上传失败!!!
        this.$message({
          type: 'error',
          message: '音乐文件上传失败: ' + response.msg
        });
        this.model.url = null;
        this.musicFileList = [];
        return;
      }
      // 上传文件在服务器上的地址, 根据当前对话框类型, 设置响应model的img属性值
      this.model.url = response;
      this.musicFileList = [].concat({ url: response, name: file.name });
      this.$message.success('上传成功!');
    },
    onMusicUploadError(error, file, fileList) {
      this.$message({
        type: 'error',
        message: '音乐文件上传失败!'
      });
    },
    onDialogClose(formRef) {
      if (formRef) {
        formRef.resetFields();
      }
      this.imgFileList = [];
      this.musicFileList = [];
    },
    doEdit() {
      // 验证表单有效性
      this.$refs.editForm.validate(valid => {
        if (valid) {
          updateMusicInfo(this.model)
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
    getMusicInfoDetail() {
      this.loading = true;
      getMusicInfoDetail(this.musicId)
        .then(({ data }) => {
          this.model = data.music;
          this.imgFileList = [].concat({ url: data.music.img });
          this.musicFileList = [].concat({
            url: data.music.url,
            name: data.music.mname
          });
          // 取消对话框表单loading状态
          this.loading = false;
        })
        .catch(error => {
          this.show = false;
        });
    }
  }
};
</script>
