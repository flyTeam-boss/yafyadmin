<template>
  <div class="login-container">
    <div class="login-car">
      <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        auto-complete="on"
        label-position="right"
      >
        <div class="title-container">
          <!-- <h3 class="title">后台管理系统</h3> -->
          <img class="title" src="../../icons/imgs/login-title.png" alt="">
        </div>

        <el-form-item prop="username">
          <span class="svg-container">
            <svg-icon icon-class="user" />
          </span>
          <el-input
            ref="username"
            v-model="loginForm.username"
            placeholder="请输入用户名称"
            name="username"
            type="text"
            @keyup.enter.native="handleLogin"
          />
        </el-form-item>

        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="请输入登录密码"
            name="password"
            auto-complete="on"
            @keyup.enter.native="handleLogin"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>

        <el-button
          :loading="loading"
          type="primary"
          style="height:50px;width:100%;margin-bottom:10px;font-size:17px;"
          @click.native.prevent="handleLogin"
        >登录</el-button>

        <div class="tips">
          <label
            style="font-weight:400;
          color:#333333;
          moz-user-select: -moz-none;
          -moz-user-select: none;
          -o-user-select:none;
          -khtml-user-select:none;
          -webkit-user-select:none;
          -ms-user-select:none;
          user-select:none;"
            for="sign"
          >记住账号？</label>
          <input id="sign" v-model="rememberPwd" type="checkbox">
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { setToken } from '@/utils/auth'

export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入正确的用户名'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不能少于6位'))
      } else {
        callback()
      }
    }
    return {
      // 开发账号
      loginForm: {
        grant_type: 'password',
        username: '',
        password: ''
      },
      loginRules: {
        username: [
          { required: true, trigger: 'blur', validator: validateUsername }
        ],
        password: [
          { required: true, trigger: 'blur', validator: validatePassword }
        ]
      },
      rememberPwd: false,
      passwordType: 'password',
      loading: false,
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  created() {
    if (localStorage.rememberPwd) {
      this.loginForm.username = localStorage.username
      this.loginForm.password = localStorage.password
      this.rememberPwd = localStorage.rememberPwd
    }
  },
  mounted() {
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.loading = true
      this.$API.system.login(this.loginForm)
        .then(Response => {
          // console.log(Response)
          this.loading = false
          if(Response.data.result == 'fail'){
           this.$message({
              message:Response.data.object.msg ,
              type: 'error'
            })
         }
          if (Response.data.object.token) {
            this.$message({
              message: '登录成功',
              type: 'success'
            })
            setToken(Response.data.object.token)
            this.$router.push('/')
          }
          if (this.rememberPwd) {
            localStorage.username = this.loginForm.username
            localStorage.password = this.loginForm.password
            localStorage.rememberPwd = this.rememberPwd
          } else {
            window.localStorage.removeItem('username')
            window.localStorage.removeItem('password')
            window.localStorage.removeItem('rememberPwd')
          }
        }).catch(Response => {
          this.loading = false
        })
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #58B3F9;
$light_gray: #333333;
$cursor: #ccc;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

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
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px #fff inset !important;
        -webkit-text-fill-color: $light_gray !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid #dbdbdb;
    background: #fff;
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #58B3F9;
$dark_gray: #cccccc;
$light_gray: #58B3F9;

.login-container {
  min-height: 100%;
  width: 100%;
  background: url('../../icons/imgs/banner.png') center no-repeat;
  background-size: cover;
  overflow: hidden;
  .login-car {
    animation: rotate 0.8s;
    @keyframes rotate {
      from {
        opacity: 0;
        transform: rotateY(90deg);
      }
      to {
        opacity: 1;
        transform: rotateY(0deg);
      }
    }
    margin: 170px auto 0;
    width: 450px;
    height: 362px;
    background: rgba(255,255,255,.5);
    border-radius: 10px;
    .login-form {
      position: relative;
      width: 520px;
      max-width: 100%;
      padding: 28px 35px 0;
      margin: 0 auto;
      overflow: hidden;
      .el-button--primary,.el-button--primary:hover,.el-button--primary:active,.el-button--primary:focus{
        background: #F9DE52;
        border-color: #F9DE52;
        color: #313131;
      }
    }

    .tips {
      font-size: 14px;
      color: #fff;
      margin-bottom: 10px;

      input {
        vertical-align: middle;
        margin-left: -6px;
        margin-bottom: 2px;
      }
    }

    .svg-container {
      padding: 6px 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
      font-size: 18px;
    }

    .title-container {
      position: relative;

      .title {
        display: block;
        width: 60%;
        margin: 0px auto 35px auto;
      }

      .set-language {
        color: #fff;
        position: absolute;
        top: 3px;
        font-size: 18px;
        right: 0px;
        cursor: pointer;
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
      right: 0;
      bottom: 6px;
    }

    @media only screen and (max-width: 470px) {
      .thirdparty-button {
        display: none;
      }
    }
  }
}
input:-webkit-autofill{
  background: #fff !important;
  background-image: none;
}
</style>
