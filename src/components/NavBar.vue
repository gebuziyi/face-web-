<template>
  <div class="nav-bar">
    <div class="breadcrumb-wrapper">
      <breadcrumb></breadcrumb>
    </div>
    <div class="right-menu">
      <server-time-clock></server-time-clock>
      <el-tooltip effect="dark" content="全屏显示" placement="bottom">
        <screenfull class="screenfull right-menu-item"></screenfull>
      </el-tooltip>
      <el-dropdown class="right-menu-item" trigger="click">
        <span class="el-dropdown-link">
          {{ username }}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/">
            <el-dropdown-item>首页</el-dropdown-item>
          </router-link>
          <el-dropdown-item>
            <span @click="showChangePwdDialog">修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <span @click="logout" style="display:block;">退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-dialog :visible.sync="dialog.changePwd.show" title="修改密码" width="800px" @close="$refs.editForm.resetFields()">
      <div v-loading="dialog.changePwd.loading" class="edit-form-wrapper">
        <el-form size="small" :model="dialog.changePwd.model" :rules="dialog.changePwd.rules" label-position="left" label-width="110px" ref="editForm">
          <el-form-item label="原密码" prop="original">
            <el-input v-model.trim="dialog.changePwd.model.original" type="password" placeholder="输入原密码"></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="newPwd">
            <el-input v-model.trim="dialog.changePwd.model.newPwd" type="password" placeholder="密码规则: 大小写字母或数字, 6-18位"></el-input>
          </el-form-item>
          <el-form-item label="再输入一次" prop="repeat">
            <el-input v-model.trim="dialog.changePwd.model.repeat" type="password" placeholder="再次输入新密码"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer">
        <el-button @click="dialog.changePwd.show = false" size="small">取 消</el-button>
        <el-button type="primary" @click="doChangePwd" size="small" :loading="dialog.changePwd.btnLoading">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb';
import Screenfull from '@/components/Screenfull';
import { isPasswordValid } from '../utils/coding-utils';
import { changePwd } from '../api/sys/sys-user';

export default {
  data() {
    const newPwdValidator = (rule, value, callback) => {
      if (isPasswordValid(value)) {
        callback();
      } else {
        callback(new Error('密码规则: 大小写字母或数字, 6-18位'));
      }
    };

    const repeatPwdValidator = (rule, value, callback) => {
      if (value === this.dialog.changePwd.model.newPwd) {
        callback();
      } else {
        callback(new Error('两次输入的密码不一致'));
      }
    };

    return {
      dialog: {
        changePwd: {
          rules: {
            original: [
              { required: true, trigger: 'change', message: '原密码不能为空' }
            ],
            newPwd: [
              { required: true, trigger: 'change', message: '新密码不能为空' },
              { validator: newPwdValidator, trigger: 'change' }
            ],
            repeat: [
              {
                required: true,
                trigger: 'change',
                message: '请再次输入新密码'
              },
              { validator: repeatPwdValidator, trigger: 'change' }
            ]
          },
          show: false,
          model: {
            original: null,
            newPwd: null,
            repeat: null
          }
        }
      }
    };
  },
  components: {
    Breadcrumb,
    Screenfull
  },
  computed: {
    username() {
      return (
        this.$store.state.user.username || localStorage.getItem('username')
      );
    }
  },
  methods: {
    doChangePwd() {
      this.$refs.editForm.validate(valid => {
        if (!valid) {
          return;
        }

        let msg = {
          original: this.dialog.changePwd.model.original,
          newPwd: this.dialog.changePwd.model.newPwd
        };

        changePwd(msg)
          .then(resp => {
            this.dialog.changePwd.show = false;
            this.$message.success('密码修改成功, 请重新登录');
            this.$store.commit('logout');
            this.$router.push('/login');
          })
          .catch(error => {});
      });
    },
    showChangePwdDialog() {
      this.dialog.changePwd.show = true;
    },
    logout() {
      this.$confirm('确定要退出登录吗?', '退出确认', {
        type: 'warning'
      })
        .then(() => {
          this.$store.commit('logout');
          this.$router.push('/login');
        })
        .catch(() => {});
    }
  }
};
</script>

<style scoped>
.el-header {
  padding: 0px;
}
.nav-bar {
  height: 40px;
  width: 100%;
  border-bottom: 1px solid #dcdfe6;
}

.breadcrumb-wrapper {
  float: left;
  padding-left: 1em;
  padding-top: 15px;
  vertical-align: middle;
}

.breadcrumb-prefix {
  font-size: 16px;
  color: grey;
}

.right-menu {
  float: right;
  height: 100%;
}

.right-menu-item {
  display: inline-block;
  padding-top: 0.5em;
  padding-right: 10px;
}

.screenfull {
  padding-right: 20px;
}

.avatar-wrapper {
  width: 60px;
  height: 30px;
  background-color: aqua;
  border-radius: 30%;
  cursor: pointer;
}

.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
</style>
