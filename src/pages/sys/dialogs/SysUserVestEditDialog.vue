<template>
  <el-dialog :visible.sync="show" title="修改马甲账号" width="800px" @close="onDialogClose('theForm')" :close-on-click-modal="false">
    <div v-loading="loading" class="edit-form-wrapper">
      <el-form size="small" :model="model" :rules="rules" label-position="left" label-width="120px" ref="theForm">
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model.trim="model.nickname" placeholder="长度:1-20"></el-input>
        </el-form-item>
        <el-form-item label="所属国家" prop="countryId">
          <el-select v-model="model.countryId" placeholder="所属国家" clearable filterable>
            <el-option v-for="(item, index) in countryList" :key="index" :value="item.countryId" :label="item.countryName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model="model.sex" clearable placeholder="性别">
            <template v-for="(item, index) in sexs">
              <el-option :label="item.showsex" :value="item.sex" :key="index"></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="头像" prop="img">
          <el-upload :action="uploadAction" :before-upload="beforeImgUpload" :on-success="onUploadSuccess" :on-error="onUploadError" :file-list="imgFileList" list-type="picture" :before-remove="onFileRemove" ref="create-upload">
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
import {
  getSysUserVestDetail,
  updateSysUserVest
} from '../../../api/sys/sys-user-vest';
import { isNicknameValid } from '../../../utils/coding-utils';
import { getAllCountryInfo } from '../../../api/basic-data/country-info';
import { VEST_SEX_LIST, VALID_AVATAR_FILE_EXT } from '../../../utils/constants';

export default {
  name: 'sys-vest-create-dialog',
  data() {
    const token = this.$store.state.user.token || localStorage.getItem('token');

    const nicknameValidator = (rule, value, callback) => {
      if (!value) {
        callback(new Error('昵称不能为空'));
      } else if (isNicknameValid(value)) {
        callback();
      } else {
        callback(new Error('昵称规则: 1-20位字母数字'));
      }
    };

    return {
      sexs: VEST_SEX_LIST,
      countryList: [],
      loading: false,
      model: {
        countryId: null,
        sex: null,
        vestId: null,
        sysUserId: null,
        userId: null,
        nickname: null,
        username: null,
        img: null,
        createTime: null,
        creator: null
      },
      rules: {
        nickname: [
          { required: true, validator: nicknameValidator, trigger: 'change' }
        ],
        countryId: [
          { required: true, trigger: 'change', message: '国家不能为空' }
        ],
        sex: [
          { required: true, trigger: 'change', message: '性别不能为空' }
        ],
        img: [{ required: true, trigger: 'change', message: '头像不能为空' }]
      },
      formLoading: true,
      btnLoading: false,
      // 文件上传的url
      uploadAction: `/faceshow-admin/api/fileupload?token=${token}&temp=${Date.now()}`,
      imgFileList: [],
      show: false
    };
  },
  methods: {
    beforeImgUpload(file) {
      if (file) {
        const filename = file.name;
        const dotIdx = filename.lastIndexOf('.');
        const ext = filename.substr(dotIdx);
        if (VALID_AVATAR_FILE_EXT.indexOf(ext) !== -1) {
          return true;
        }
      }
      this.imgFileList = [].concat({ url: this.model.img });
      this.$message.error('必须上传.jpg/.png结尾的文件!!');
      return false;
    },

    onFileRemove(file, fileList) {
      if (file.name) {
        const filename = file.name;
        const dotIdx = filename.lastIndexOf('.');
        const ext = filename.substr(dotIdx);
        // 如果移除的不是图片文件, 则允许移除
        if (VALID_AVATAR_FILE_EXT.indexOf(ext) === -1) {
          return true;
        }
      }
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
        message: '图片上传失败!'
      });
    },
    doEdit() {
      // 验证表单有效性
      this.btnLoading = true;
      this.$refs.theForm.validate(valid => {
        if (valid) {
          updateSysUserVest(this.model)
            .then(data => {
              this.$message.success('操作成功');
              this.btnLoading = false;
              this.show = false;
              this.$emit('done');
            })
            .catch(error => {
              this.btnLoading = false;
              // do something
            });
        } else {
          return false;
        }
      });
    },
    onDialogClose(formRef) {
      this.$refs[formRef].resetFields();
      this.imgFileList = [];
    },
    getDetail(vestId) {
      getSysUserVestDetail(vestId)
        .then(({ data }) => {
          this.model = data.detail;
          this.imgFileList = [].concat({ url: data.detail.img });
          this.loading = false;
        })
        .catch(error => {});
    },
    initCountryInfoSelectData() {
      getAllCountryInfo()
        .then(({ data }) => {
          this.countryList = data.list;
        })
        .catch(errorMsg => {
          this.$message.error('获取国家列表失败, 无法继续创建马甲账号');
        });
    },
    showDialog(vestId) {
      this.loading = true;
      this.show = true;
      this.getDetail(vestId);
      this.initCountryInfoSelectData();
    }
  }
};
</script>

<style scoped>

</style>
