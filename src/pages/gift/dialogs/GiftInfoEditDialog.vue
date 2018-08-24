<template>
  <el-dialog :visible.sync="show" title="修改礼品信息" width="800px" :close-on-click-modal="false" @close="onDialogClose">
    <div v-loading="loading" class="edit-form-wrapper">
      <el-form size="small" :model="model" :rules="rules" label-position="left" label-width="120px" ref="editForm">
        <el-form-item label="礼品名称" prop="gname">
          <el-input v-model.trim="model.gname"></el-input>
        </el-form-item>
        <el-form-item label="礼品类型" prop="typeId">
          <el-select v-model="model.typeId" placeholder="礼品类型">
            <template v-for="(type, index) in musicTypes">
              <el-option :label="type.gname" :value="type.typeId" :key="index"></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="礼品价格" prop="price">
          <el-input-number v-model="model.price" :min="1" label="礼品价格"></el-input-number>
        </el-form-item>
        <el-form-item label="礼品图片" prop="img">
          <!-- 图片文件上传 -->
          <el-upload :action="uploadAction" :on-success="onUploadSuccess" :on-error="onUploadError" :file-list="imgFileList" list-type="picture" :before-remove="onFileRemove" ref="edit-upload">
            <el-button size="small" type="primary">点击选择图片</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="SVGA动画文件" prop="svgaUrl">
          <el-upload :action="uploadAction" :before-upload="beforeSvgaUpload" :on-success="onSvgaUploadSuccess" :on-error="onUploadError" :file-list="svgaFileList" :before-remove="onSvgaFileRemove" ref="svga-upload">
            <el-button size="small" type="primary">点击选择SVGA文件</el-button>
            <div slot="tip" class="el-upload__tip">只能上传.svga文件</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="等级专属" prop="exclusive">
          <el-switch v-model="model.exclusive" :active-value="true" :inactive-value="false" active-color="#13ce66" inactive-color="#ff4949" active-text="是" inactive-text="否"></el-switch>
        </el-form-item>
        <el-form-item label="专属等级" prop="levelId">
          <el-input-number v-model="model.levelId" placeholder="专属等级" :min="1" :max="100"></el-input-number>
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
import { getGiftInfoDetail, updateGiftInfo } from '../../../api/gift/gift-info';
import { emptyGiftInfo } from '../../../utils/empty-model';

export default {
  name: 'gift-info-edit-dialog',

  data() {
    const token = localStorage.getItem('token');

    return {
      show: false,
      model: emptyGiftInfo(),
      loading: false,
      svgaFileList: [],
      imgFileList: [],
      // 表单校验规则
      rules: {
        gname: [
          { required: true, trigger: 'change', message: '礼品名称不能为空' }
        ],
        typeId: [
          { required: true, trigger: 'change', message: '礼品类型不能为空' }
        ],
        price: [
          { required: true, trigger: 'change', message: '礼品价格不合法' }
        ],
        img: [
          { required: true, trigger: 'change', message: '礼品图片不能为空' }
        ]
      },
      btnLoading: false,
      uploadAction: `/faceshow-admin/api/fileupload?token=${token}&temp=${Date.now()}`
    };
  },

  props: {
    musicTypes: {
      type: Array,
      required: true
    }
  },

  methods: {
    onSvgaFileRemove(file, fileList) {
      const filename = file.name;
      const dotIdx = filename.lastIndexOf('.');
      const ext = filename.substr(dotIdx);
      if (ext === '.svga' || ext === '.SVGA') {
        this.$message.warning('SVGA文件不可为空!');
        return false;
      }
      return true;
    },

    onSvgaUploadSuccess(response, file, fileList) {
      // response is the file url or {code: 500, msg: 'error msg here'}
      if (response.code && response.code !== 0) {
        // 此时虽然http的status=200, 但实际上结果为上传失败!!!
        this.$message.error(`SVGA文件上传失败: ${response.msg}`);
        this.$refs['svga-upload'].clearFiles();
        this.model.svgaUrl = null;
        this.svgaFileList = [];
        return;
      }
      // 上传文件在服务器上的地址, 根据当前对话框类型, 设置响应model的img属性值
      this.model.svgaUrl = response;

      // 设置文件列表
      this.svgaFileList = [].concat({ name: file.name });
      this.$refs.editForm.validateField('svgaUrl');
      this.$message.success('上传成功!');
    },

    beforeSvgaUpload(file) {
      if (file) {
        const filename = file.name;
        const dotIdx = filename.lastIndexOf('.');
        const ext = filename.substr(dotIdx);
        if (ext === '.svga' || ext === '.SVGA') {
          return true;
        }
      }
      this.svgaFileList = [];
      this.$message.error('必须上传.svga结尾的文件!!');
      return false;
    },

    showDialog(giftId) {
      this.loading = true;
      this.show = true;
      this.getDetailBeforeEdit(giftId);
    },

    onDialogClose() {
      this.$refs.editForm.resetFields();
    },

    doEdit() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          updateGiftInfo(this.model)
            .then(data => {
              this.$message.success('修改礼品信息成功');
              this.$refs['edit-upload'].clearFiles();
              this.imgFileList = [];
              this.btnLoading = false;
              this.show = false;
              this.$emit('done');
            })
            .catch(error => {});
        } else {
          return false;
        }
      });
    },

    onFileRemove(file, fileList) {
      this.$message.warning('图片文件不可为空!');
      return false;
    },

    onUploadSuccess(response, file, fileList) {
      // response is the file url or {code: 500, msg: 'error msg here'}
      if (response.code && response.code !== 0) {
        // 此时虽然http的status=200, 但实际上结果为上传失败!!!
        this.$message.error(`图片上传失败: ${response.msg}`);
        this.$refs['edit-upload'].clearFiles();
        this.model.img = null;
        this.imgFileList = [];
        return;
      }
      // 上传文件在服务器上的地址, 根据当前对话框类型, 设置响应model的img属性值
      this.model.img = response;

      // 设置文件列表
      this.imgFileList = [].concat({ url: response });
      if (this.model.svgaUrl && this.model.svgaUrl !== '') {
        this.svgaFileList = [].concat({ name: this.model.svgaUrl });
      }
      this.$refs.editForm.validateField('img');
      this.$message.success('上传成功!');
    },

    onUploadError(error, file, fileList) {
      this.$message.error('图片上传失败!');
    },

    getDetailBeforeEdit(giftId) {
      getGiftInfoDetail(giftId)
        .then(({ data }) => {
          this.model = data.gift;
          this.imgFileList = [].concat({ url: data.gift.img });
          if (this.model.svgaUrl && this.model.svgaUrl !== '') {
            this.svgaFileList = [].concat({ name: data.gift.gname + '.svga' });
          }
          // 取消对话框表单loading状态
          this.loading = false;
        })
        .catch(error => {});
    }
  }
};
</script>

<style scoped>
</style>
