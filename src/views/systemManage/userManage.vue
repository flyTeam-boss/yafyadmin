<template>
  <div class="app-container">
    <div class="filter-container">
      <span
        style="display: inline-block;
        vertical-align: top;
        padding-top: 10px;"
      >搜索用户：</span>
      <el-input
        v-model="listQuery.keyword"
        placeholder="请输入账号或姓名"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-button
        class="filter-item"
        type="primary"
        @click="handleFilter"
      >搜索</el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        @click="handleCreate"
      >添加用户</el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column
      type="selection"
      width="40">
    </el-table-column>
      <el-table-column label="账号" sortable prop="name" min-width="100" align="center">
        <template slot-scope="{row}">
          <el-popover trigger="hover" placement="top">
            <span>{{ row.name }}</span>
            <div slot="reference" class="name-wrapper">
              <span>{{row.name }}</span>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="姓名" sortable prop="realName" min-width="100" align="center">
        <template slot-scope="{row}">
          <span>{{ row.realName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号" sortable prop="phone" min-width="100" align="center">
        <template slot-scope="{row}">
          <el-popover trigger="hover" placement="top">
            <span>{{ row.phone }}</span>
            <div slot="reference" class="name-wrapper">
              <span>{{row.phone }}</span>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="状态" sortable prop="status" width="90" align="center">
        <template slot-scope="{row}">
          <span v-if="row.status == 1">禁用</span>
          <span v-else>启用</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="170" align="center">
        <template slot-scope="{row}">
          <div style="display:flex;">
            <el-button type="primary" size="mini" @click="handleUpdate(row)">编辑</el-button>
            <el-button size="mini" round @click="resetPassword(row)">重置密码</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
    <el-dialog
      center
      :title="dialogStatus==='create'?'新增用户':'编辑用户'"
      :visible.sync="dialogFormVisible"
      :before-close="closeDL"
    >
      <el-form
        v-loading="listLoading4"
        ref="dataForm"
        :rules="rules"
        :model="form"
        label-position="right"
        label-width="95px"
      >
        
        <el-form-item class="max-w300" label="员工姓名：" prop="realName">
          <el-input v-model="form.realName" placeholder="请输入姓名" autofocus="autofocus"/>
        </el-form-item>
        <el-form-item class="max-w300" label="联系电话" prop="phone">
          <el-input type="number" v-model.number="form.phone" placeholder="输入电话" />
        </el-form-item>
        <el-form-item class="max-w300" label="登陆账号：" prop="name">
          <el-input v-model="form.name" placeholder="请输入账号" />
        </el-form-item>
        <el-form-item class="max-w300" 
        :label="dialogStatus=='update'?'修改密码：':'密码：'"
        v-if="dialogStatus=='update'?false:true">
          <el-input v-model="form.password" autocomplete="new-password" type="password" placeholder="******"/>
          <div class="defPwd" v-if="dialogStatus!='update'">默认密码为123456</div>
        </el-form-item>
        <el-form-item class="max-w300" label="身份证号：">
          <el-input v-model="form.idCard" placeholder="请输入身份证号" />
        </el-form-item>
        <el-form-item class="max-w300" label="紧急电话：">
          <el-input v-model="form.contactPhone" placeholder="请输入电话" />
        </el-form-item>
        <el-form-item label="账号选择：" prop="type" v-if="loginInfoID== 0 && dialogStatus==='create'?true:false">
          <el-radio-group @change="getRole" v-model="form.type">
            <el-radio checked :label="0">平台账号</el-radio>
            <el-radio :label="1">学校账号</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="选择学校：" :prop="form.type===0?'':'schoolId'" v-if="loginInfoID == 0 && dialogStatus==='create'?true:false">
          <el-select :disabled="form.type===0?true:false" v-model="form.schoolId" placeholder="请选择学校">
            <el-option
              v-for="item in schools"
              :key="item.id"
              :label="item.schoolName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="max-w300" label="备注：">
          <el-input type="textarea" v-model="form.remark" placeholder="员工信息备注" />
        </el-form-item>
        <el-form-item label="状态：" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :label="0">启用</el-radio>
            <el-radio :label="1">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="角色信息：" prop="IDcard">
          <el-table
            v-loading="listLoading2"
            ref='roleInfo'
            :key="tableKey"
            :data="roleList"
            @selection-change='selectChecked'
            border
            fit
            highlight-current-row
            style="width: 100%;"
          >
            <el-table-column
            v-model="form.roleIds"
            type="selection"
            width="40">
          </el-table-column>
            <el-table-column label="ID" min-width="100" align="center">
              <template slot-scope="{row}">
                <span>{{ row.id }}</span>
              </template>
            </el-table-column>
            <el-table-column label="角色名称" min-width="100" align="center">
              <template slot-scope="{row}">
                <span>{{ row.roleName }}</span>
              </template>
            </el-table-column>
            <el-table-column label="角色描述" min-width="100" align="center">
              <template slot-scope="{row}">
                <span>{{ row.description }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
      
      <div class="dialog-footer">
        <el-button type="primary" :disabled="this.isdisabled" @click="createData">保存</el-button>
        <el-button @click="closeDL" :disabled="this.isdisabled">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination

export default {
  name: "UserManage",
  components: { Pagination },
  data() {
    var phoneReg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/
    var nameReg = /^[A-Za-z0-9]{6,20}$/
    var validatePhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('号码不能为空!!'))
      }
        if (!phoneReg.test(value)) {
          callback(new Error('请输入正确的11位手机号'))
        } else {
          callback()
        }
    }
    var validateName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('登陆账号不能为空!!'))
      }
        if (!nameReg.test(value)) {
          callback(new Error('请输入6-20位的字母或数字'))
        } else {
          callback()
        }
    }
    return {
      loginInfoID:"",//当前登陆用户学校ID
      password:'',
      resetId:'',
      isdisabled:false,
      tableKey: 0,
      list: [],
      roleList:[],
      total: 0,
      listLoading: true,
      listLoading2:false,
      listLoading3:false,
      listLoading4:false,
      listQuery: {
        page: 1,
        limit: 20,
        keyword: ""
      },
      schools:[],
      form: {
        contactPhone:'',
        realName:'',
        phone:'',
        password:'',
        idCard:'',
        status:'',
        remark:'',
        roleIds:[],
        type:'',
        schoolId:''
      },
      dialogFormVisible: false,
      dialogFormVisible2: false,
      dialogStatus: "",
      // 表单验证
      rules: {
        name: [{ required: true, validator: validateName, trigger: "blur" }],
        realName: [{ required: true, message: "请输入员工姓名", trigger: "blur" }],
        status: [{ required: true, message: "请选择状态", trigger: "change" }],
        type: [{ required: true, message: "请选择账号", trigger: "change" }],
        schoolId: [{ required: true, message: "请选择学校", trigger: "change" }],
        phone:[{ required: true, validator: validatePhone, trigger: "blur" }]
      }
    };
  },
  created() {
    this.getList()
    this.$API.system.systemIndexGetUserInfo().then((res)=>{
      this.loginInfoID = res.data.object.sysUser.schoolId
    })
  },
  methods: {
    // 关闭蒙层
    closeDL(){
      this.dialogFormVisible = false;
      this.$refs.dataForm.clearValidate();
    },
    //关闭重置密码蒙层
    closeDL2(){
      this.dialogFormVisible2 = false;
    },
    getList() {
      this.listLoading = true;
      this.$API.system.systemUser(this.listQuery).then(Response => {
        this.list = Response.data.object.sysUsers.list;
        this.total = Response.data.object.sysUsers.total;
        this.listLoading = false;
      });
    },
    getSchool(){
      this.$API.school.findEnableSchool().then((res)=>{
        this.schools = res.data.object.schoolList
      })
    },
    //获取角色
    getRole(){
      this.listLoading2 = true
      this.$API.system.findRoleByType(this.form.type).then(response => {
        this.roleList = response.data.object.sysRoleList
        this.listLoading2 = false
      })
    },
    //回显选中表格数据
    toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.roleList.forEach((item)=>{
              if(row == item.id){
                this.$refs.roleInfo.toggleRowSelection(item);
              }
            })
          });
        }
      },
    //勾选角色
    selectChecked(selection){
      let arr = []
      if(selection.length != 0){
        selection.forEach(item=>{arr.push(item.id)})
      }
      this.form.roleIds = arr
    },
    //搜索
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    //重置表单
    resetTemp() {
      this.form = {
        contactPhone:'',
        realName:'',
        phone:'',
        password:'',
        idCard:'',
        remark:'',
        roleIds:[],
        status: JSON.stringify("")
      }
    },
    //点击添加用户
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.getSchool()
      this.listLoading2 = true
      this.$API.system.getRoleList().then((response)=>{
        this.roleList = response.data.object
        this.listLoading2 = false
      })
    },
    //保存信息
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          if(this.form.roleIds.length == 0){
             this.$message({
              message: '请勾选角色',
              type: 'warning'
            });
            return 
          }
          if(this.dialogStatus == 'update'){
            this.form.remove('password')
          }
          this.isdisabled = true
            this.$API.system
            .systemUserSave(this.form)
            .then(Response => {
              if(Response.data.result == 'ok'){
                this.$message({
                  message: "操作成功",
                  type: "success"
                });
                this.getList();
                this.closeDL();
                this.isdisabled = false
              }else{
                this.$message({
                  message: Response.data.errorMsg,
                  type: "error"
                });
                this.isdisabled = false
              }
            })
        }
      });
    },
    //点击编辑
    handleUpdate(row) {
      this.resetTemp();
      this.dialogFormVisible = true;
      this.dialogStatus = "update";
      this.listLoading2 = true
      this.listLoading4 = true
        this.$API.system.systemRole().then((response)=>{
          this.roleList = response.data.object.list
          this.listLoading2 = false
        })
      this.$API.system.systemUserEdit(row.id).then((res)=>{
        this.form = res.data.object.sysUser
        this.form.phone = Number(this.form.phone)
        let arr = []
        if(res.data.object.sysRoleUsers){
          res.data.object.sysRoleUsers.forEach(item=>{arr.push(parseInt(item.roleId))})
        }
        this.toggleSelection(arr)
        setTimeout(()=>{
          this.listLoading4 = false
        },500)
        })
        
    },
    //重置密码
    resetPassword(row){
      this.$confirm('确认重置密码?', '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            this.$API.system.systemUserResetPassword({userId:row.id}).then((res)=>{
              if(res.data.result=='ok'){
                this.$message({
                    message: "操作成功",
                    type: "success"
                  });
                  this.getList()
              }
            })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });          
        });
    },
  }
};
</script>
<style lang="scss">
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}
.avatar {
  width: 120px;
  height: 120px;
  display: block;
}
.resetBox{
  display: flex;
  align-items: center;
  span{
    width:150px;
  }
  input{
    margin-left: 8px;
    width: 80%;
  }
}
.dialog-footer{
  margin-top: 50px;
}
</style>
