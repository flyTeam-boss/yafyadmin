<template>
  <div class="app-container">
    <div class="user-info">
      <el-form ref="ruleForm2" :model="ruleForm2" status-icon :rules="rules2" label-width="110px" class="demo-ruleForm">
        <el-form-item label="账号：" prop="name">
          <el-input v-model="ruleForm2.name" type="text" disabled/>
        </el-form-item>
        <el-form-item label="真实姓名：" prop="realName">
          <el-input v-model="ruleForm2.realName" type="text" placeholder="请输入姓名"/>
        </el-form-item>
        <!-- <el-form-item label="旧密码：" prop="oldPassword">
          <el-input v-model="ruleForm2.oldPassword" type="password" autocomplete="new-password" placeholder="请输入原密码"/>
        </el-form-item> -->
        <el-form-item label="新密码：" prop="password">
          <el-input v-model="ruleForm2.password" type="password" autocomplete="new-password" placeholder="请输入新密码"/>
        </el-form-item>
        <el-form-item label="确认新密码：" prop="checkPass">
          <el-input v-model="ruleForm2.checkPass" type="password" autocomplete="new-password" placeholder="请确认密码"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm2')">提交</el-button>
        </el-form-item>
      </el-form>
      <el-dialog center width="30%" :visible.sync="dialogVisible" size="tiny">
        <img width="100%" :src="dialogImageUrl" alt="">
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { removeToken } from '@/utils/auth'
export default {
  name: 'ModifyInformation',
  data() {
    var validateRealName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入姓名'))
      } else {
        if (/^[\u4e00-\u9fa5]{0,}$/.test(value) === false) {
          callback(new Error('请输入中文姓名'))
        } else {
          callback()
        }
      }
    }
    var validateOldPwd = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入旧密码'))
      } 
      // else {
      //   this.$API.system.systemUserChackPassword({
      //     params: {
      //       oldPassword: this.ruleForm2.oldPassword
      //     }
      //   }).then(Response => {
      //     if (Response.data.result === 'fail') {
      //       callback(new Error('请输入正确的密码'))
      //     } else {
            callback()
      //     }
      //   })
      // }
    }
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入新密码'))
      } else {
        if (/^[0-9a-zA-Z!@#$^.]{6,12}$/.test(value) === false) {
          callback(new Error('密码可使用字母、数字或字符(!@#$^.),长度在6-12位'))
        } else {
          callback()
        }
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm2.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      userInfo: {},
      ruleForm2: {
        name: '',
        realName: '',
        // oldPassword: '',
        password: '',
        checkPass: '',
        id: ''
      },
      rules2: {
        // name: [
        //   { required: true, message: '请输入账号', trigger: 'blur' }
        // ],
        realName: [
          { required: true, message: '请输入真实姓名', trigger: 'blur' }
        ],
        // oldPassword: [
        //   { required: true, validator: validateOldPwd, trigger: 'blur' }
        // ],
        password: [
          { required: true, validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { required: true, validator: validatePass2, trigger: 'blur' }
        ]
      },
      dialogImageUrl: '',
      dialogVisible: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList(){
        this.$API.system.systemIndexGetUserInfo().then(data => {
        this.ruleForm2.name = data.data.object.sysUser.name;
        this.ruleForm2.realName = data.data.object.sysUser.realName;
        this.ruleForm2.id = data.data.object.sysUser.id;
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$API.system.modifyUserInfo({
            ...this.ruleForm2
          }).then(Response => {
            if(Response.data.result == 'ok'){
              this.$message({
                message: '更改成功',
                type: 'success'
              })
              removeToken()
              this.$router.push('login')
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
    .user-info{
        width: 50%;
        margin: 60px auto 0;
    }
    .el-input{
        max-width:320px;
    }
</style>
