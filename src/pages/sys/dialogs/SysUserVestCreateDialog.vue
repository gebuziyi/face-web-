<template>
  <el-dialog :visible.sync="show" title="创建马甲账号" width="800px" @close="onDialogClose('createForm')" :close-on-click-modal="false">
    <div v-loading="loading" class="edit-form-wrapper">
      <el-form size="small" :model="model" :rules="rules" label-position="left" label-width="120px" ref="createForm">
        <el-form-item label="用户名" prop="username">
          <el-input v-model.trim="model.username" placeholder="字母/数字组合, 长度:6-18"></el-input>
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model.trim="model.nickname" placeholder="长度:1-20"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model.trim="model.email" placeholder="邮箱地址, 如alias@domain.com"></el-input>
        </el-form-item>
        <el-form-item label="头像" prop="img">
          <el-upload :action="uploadAction" :before-upload="beforeImgUpload" :on-success="onUploadSuccess" :on-error="onUploadError" :file-list="imgFileList" list-type="picture" :before-remove="onFileRemove" ref="create-upload">
            <el-button size="small" type="primary">点击选择图片</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="所属国家" prop="countryId">
          <el-select v-model="model.countryId" placeholder="所属国家" clearable filterable>
            <el-option v-for="(item, index) in countryList" :key="index" :value="item.countryId" :label="item.countryName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model.trim="model.address" placeholder="汉字/字母/数字组合, 长度:1-50"></el-input>
        </el-form-item>
        <el-form-item label="所属管理员" prop="sysUserId">
          <el-select v-model="model.sysUserId" placeholder="所属管理员" clearable filterable>
            <el-option v-for="(item, index) in adminList" :key="index" :value="item.userId" :label="item.username"></el-option>
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
import { createSysUserVest } from '../../../api/sys/sys-user-vest';
import {
  isNicknameValid,
  isUsernameValid,
  isEmailValid
} from '../../../utils/coding-utils';
import { getAllCountryInfo } from '../../../api/basic-data/country-info';
import { getAllSysUser } from '../../../api/sys/sys-user';
import { VALID_AVATAR_FILE_EXT } from '../../../utils/constants';

export default {
  name: 'sys-vest-create-dialog',
  data() {
    const token = this.$store.state.user.token || localStorage.getItem('token');

    const usernameValidator = (rule, value, callback) => {
      if (!value) {
        callback(new Error('用户名不能为空'));
      } else if (isUsernameValid(value)) {
        callback();
      } else {
        callback(new Error('用户名规则: 6-18位字母数字'));
      }
    };

    const nicknameValidator = (rule, value, callback) => {
      if (!value) {
        callback(new Error('昵称不能为空'));
      } else if (isNicknameValid(value)) {
        callback();
      } else {
        callback(new Error('昵称规则: 1-20位字母数字'));
      }
    };

    const emailValidator = (rule, value, callback) => {
      if (!value) {
        callback(new Error('邮箱地址不能为空'));
      } else if (isEmailValid(value)) {
        callback();
      } else {
        callback(new Error('请输入合法的邮箱地址'));
      }
    };

    const addressValidator = (rule, value, callback) => {
      if (!value) {
        callback(new Error('地址不能为空'));
      } else if (!/^[\s\S]{1,50}$/.test(value)) {
        callback(new Error('地址规则: 1-50位中文/英文/数字/符号组合'));
      } else {
        callback();
      }
    };

    return {
      adminList: [],
      countryList: [],
      loading: false,
      model: {
        username: null,
        nickname: null,
        email: null,
        img: null,
        countryId: null,
        coding: null,
        sysUserId: null
      },
      rules: {
        address: [
          { required: true, validator: addressValidator, trigger: 'change' }
        ],
        username: [
          { required: true, validator: usernameValidator, trigger: 'change' }
        ],
        email: [
          { required: true, validator: emailValidator, trigger: 'change' }
        ],
        nickname: [
          { required: true, validator: nicknameValidator, trigger: 'change' }
        ],
        img: [{ required: true, trigger: 'change', message: '头像不能为空' }],
        countryId: [
          { required: true, trigger: 'change', message: '所属国家不能为空' }
        ],
        sysUserId: [
          { required: true, trigger: 'change', message: '所属管理员不能为空' }
        ]
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
      this.imgFileList = [];
      this.model.img = null;
      this.$refs.createForm.validateField('img');
      this.$message.error('必须上传.jpg/.png结尾的文件!!');
      return false;
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
      this.$refs.createForm.validateField('img');
    },
    onUploadError(error, file, fileList) {
      this.$message({
        type: 'error',
        message: '图片上传失败!'
      });
    },
    doCreate() {
      // 验证表单有效性
      this.$refs.createForm.validate(valid => {
        if (valid) {
          const selectedCountry = this.countryList.find(
            item => item.countryId === this.model.countryId
          );

          this.model.coding = selectedCountry.coding;

          const h = this.$createElement;

          createSysUserVest(this.model)
            .then(data => {
              this.$alert(
                h('p', null, [
                  h('span', null, '如想要使用该马甲账号登录APP, 请使用邮箱: '),
                  h('strong', { color: 'teal' }, this.model.email),
                  h('span', null, ', 密码: '),
                  h('strong', { color: 'red' }, this.model.username)
                ]),
                '马甲账号创建成功',
                {
                  callback: action => {
                    this.btnLoading = false;
                    this.show = false;
                    this.$emit('done');
                  }
                }
              );
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
      this.$refs[formRef].resetFields();
      this.imgFileList = [];
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
    initSysUserSelectData() {
      getAllSysUser()
        .then(({ data }) => {
          this.adminList = data.list;
        })
        .catch(errorMsg => {
          this.$message.error('获取管理员列表失败, 无法继续创建马甲账号');
        });
    },
    showDialog() {
      this.initSysUserSelectData();
      this.initCountryInfoSelectData();
      this.show = true;
    }
  }
};
</script>

<style scoped>

</style>
