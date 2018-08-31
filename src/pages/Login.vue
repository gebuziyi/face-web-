<template>
  <div class="login-container">
    <el-form class="login-form" autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left">
      <div class="title-container">
        <h3 class="title">Facecast后台管理登录</h3>
      </div>
      <!-- 用户名 -->
      <el-form-item prop="username">
        <span class="svg-container svg-container_login">
          <i class="fa fa-user"></i>
        </span>
        <el-input name="username" type="text" v-model="loginForm.username" autoComplete="on" placeholder="请输入用户名" />
      </el-form-item>
      <!-- 密码 -->
      <el-form-item prop="password">
        <span class="svg-container">
          <i class="fa fa-lock"></i>
        </span>
        <el-input name="password" :type="passwordType" @keyup.enter.native="handleLogin" v-model="loginForm.password" autoComplete="off" placeholder="请输入密码" />
        <span class="show-pwd" @click="showPwd">
          <i class="fa fa-eye"></i>
        </span>
      </el-form-item>
      <!-- 验证码 -->
      <el-form-item prop="kaptcha">
        <span class="svg-container">
          <i class="fa fa-exclamation-circle"></i>
        </span>
        <el-input name="kaptcha" id="kaptcha-input" @keyup.enter.native="handleLogin" v-model="loginForm.kaptcha" autoComplete="on" placeholder="请输入验证码" style="width:50%" />
        <div class="kaptcha-wrapper">
          <img alt="如果看不清楚，请单击图片刷新！" class="pointer" :src="kaptcha.src" @click="refreshKaptcha" id="kaptcha-img">
        </div>
      </el-form-item>
      <!-- 登录按钮 -->
      <el-button type="primary" style="width:100%;margin-bottom:30px;" :loading="loading" @click.native.prevent="handleLogin">登录</el-button>
    </el-form>

  </div>
</template>

<script>
import { login, kaptchaSrc } from '../api/sys/login';
import { isNotEmptyStr } from '../utils/coding-utils';

export default {
  name: 'login',
  data() {
    return {
      kaptcha: {
        src: ''
      },
      loginForm: {
        username: '',
        password: '',
        kaptcha: ''
      },
      loginRules: {
        username: [
          { required: true, trigger: 'change', message: '用户名不能为空' }
        ],
        password: [
          { required: true, trigger: 'change', message: '密码不能为空' }
        ],
        kaptcha: [
          {
            required: true,
            trigger: 'change',
            message: '验证码不能为空'
          }
        ]
      },
      passwordType: 'password',
      loading: false,
      showDialog: false
    };
  },
  methods: {
    refreshKaptcha() {
      this.kaptcha.src = kaptchaSrc();
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = '';
      } else {
        this.passwordType = 'password';
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;

          login({
            username: this.loginForm.username,
            password: this.loginForm.password,
            kaptcha: this.loginForm.kaptcha
          })
            .catch(error => {
              this.$message({
                type: 'error',
                message: error
              });
              this.$refs['loginForm'].resetFields();
              // 刷新验证码
              this.refreshKaptcha();
              this.loading = false;
              // do something
            })
            .then(({ data }) => {
              if (data.code !== 0) {
                this.$refs['loginForm'].resetFields();
                this.loading = false;
                this.$message({
                  type: 'error',
                  message: data.msg
                });
                this.refreshKaptcha();
              } else {
                this.$message({
                  type: 'success',
                  message: '登录成功!'
                });
                this.loading = false;

                this.$store.commit('setUser', {
                  username: this.loginForm.username,
                  userId: data.userId,
                  token: data.token
                });

                const returnUrl = this.$route.query.returnUrl;
                if (isNotEmptyStr(returnUrl)) {
                  this.$router.push({
                    path: returnUrl
                  });
                } else {
                  this.$router.push({
                    path: '/dashboard'
                  });
                }
              }
            });
        } else {
          return false;
        }
      });
    }
  },
  created() {
    this.loginForm.password = null;
    this.refreshKaptcha();
    const code = this.$route.query.code;
    if (code === 401) {
      this.$notify.error({
        message: 'Token失效, 请重新登录!'
      });
    }
    // window.addEventListener('hashchange', this.afterQRScan)
  },
  destroyed() {
    // window.removeEventListener('hashchange', this.afterQRScan)
  }
};
</script>

<style scoped>
#kaptcha-img {
  width: 80%;
  height: 80%;
  padding-top: 5%;
  padding-right: 10%;
}
.kaptcha-wrapper {
  position: relative;
  float: right;
  height: 50px;
  width: 120px;
  text-align: right;
}
</style>

<style rel="stylesheet/scss" lang="scss">
$bg: #2d3a4b;
$light_gray: #eee;

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: #fff !important;
      }
    }
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: $bg;
  .login-form {
    position: absolute;
    left: 0;
    right: 0;
    width: 400px;
    padding: 35px 35px 15px 35px;
    margin: 120px auto;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
    &_login {
      font-size: 20px;
    }
  }
  .title-container {
    position: relative;
    .title {
      font-size: 26px;
      font-weight: 400;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
    .set-language {
      color: #fff;
      position: absolute;
      top: 5px;
      right: 0px;
    }
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .thirdparty-button {
    position: absolute;
    right: 35px;
    bottom: 28px;
  }
}
</style>
