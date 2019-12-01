<template>
  <div class="app-container">
    <div class="filter-container">
      <span
        style="display: inline-block;
        vertical-align: top;
        padding-top: 10px;"
      >搜索教师：</span>
      <el-input
        v-model="listQuery.keyword"
        placeholder="账号、姓名、手机号"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-button class="filter-item" type="primary" @click="handleFilter">搜索</el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        @click="handleCreate"
      >添加教师</el-button>
      <el-upload class="filter-item" 
      :show-file-list="false"
      :action="baseUrl+'importExcel'" 
      :headers="importHeaders" 
      :on-success="batchAddition">
        <el-button style="margin-left: 10px;" type="primary">导入</el-button>
      </el-upload>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        @click="handleDownload"
      >下载模板</el-button>
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
      <el-table-column type="selection" width="40"></el-table-column>
      <el-table-column label="序号" type="index" align="center" width="50"></el-table-column>
      <el-table-column label="ID号" min-width="50" align="center">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="教师姓名" sortable prop="realName" min-width="100" align="center">
        <template slot-scope="{row}">
          <span>{{ row.realName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="账号" sortable prop="name" min-width="80" align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="电话" sortable prop="phone" min-width="100" align="center">
        <template slot-scope="{row}">
          <span>{{ row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" sortable prop="createtime" min-width="120" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createtime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" sortable prop="status" min-width="70" align="center">
        <template slot-scope="{row}">
          <span>{{row.status==0?"启用":"禁用"}}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" min-width="170" align="center">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">编辑</el-button>
          <el-button size="mini" round @click="resetPassword(row)">重置密码</el-button>
          <el-button
            v-if="row.status =='0'"
            size="mini"
            type="danger"
            @click="handleModifyStatus(row,'1')"
          >禁用</el-button>
          <el-button
            v-if="row.status=='1'"
            size="mini"
            type="info"
            @click="handleModifyStatus(row,'0')"
          >启用</el-button>
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
    <el-dialog center title="重置密码" :visible.sync="dialogFormVisible2" :before-close="closeDL2">
      <div class="resetBox">
        <span>请输入重置密码：</span>
        <el-input placeholder="请输入密码" v-model="password" show-password />
      </div>
      <div class="dialog-footer">
        <el-button type="primary" @click="savePassword">保存</el-button>
        <el-button @click="closeDL2">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      center
      :title="dialogStatus==='create'?'新增教师':'编辑教师'"
      :visible.sync="dialogFormVisible"
      :before-close="closeDL"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="form"
        label-position="right"
        label-width="95px"
      >
        <div class="dialogBox">
          <el-form-item class="max-w300" label-width="95px" label="真实姓名：" prop="realName">
            <el-input v-model="form.realName" placeholder="输入姓名" />
          </el-form-item>
          <el-form-item class="max-w300" label-width="95px" label="登录账号：" prop="name">
            <el-input v-model="form.name" placeholder="登录账号" />
          </el-form-item>
        </div>
        <div class="dialogBox">
          <el-form-item class="max-w300" label-width="95px" label="联系电话：" prop="phone">
            <el-input type="number" v-model.number="form.phone" placeholder="联系电话" />
          </el-form-item>
          <el-form-item class="max-w300" label-width="95px" label="紧急电话：">
            <el-input type="number" v-model.number="form.contactPhone" placeholder="紧急联系电话" />
          </el-form-item>
        </div>
        <div class="dialogBox">
          <el-form-item
            class="max-w300"
            :label="dialogStatus=='update'?'修改密码：':'密码：'"
            v-if="dialogStatus=='update'?false:true"
          >
            <el-input
              v-model="form.password"
              autocomplete="new-password"
              type="password"
              placeholder="******"
            />
            <div class="defPwd" v-if="dialogStatus!='update'">默认密码为123456</div>
          </el-form-item>
          <el-form-item class="max-w300" label-width="95px" label="身份证号：">
            <el-input v-model="form.idCard" placeholder="身份证号码" />
          </el-form-item>
        </div>
        <div class="dialogBox">
          <el-form-item class="max-w300" label-width="95px" label="备注：">
            <el-input type="textarea" v-model="form.remark" placeholder="教师信息备注" />
          </el-form-item>
        </div>
      </el-form>
      <div class="dialog-footer">
        <el-button :disabled="isdisabled" type="primary" @click="createData">保存</el-button>
        <el-button :disabled="isdisabled" @click="closeDL">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getToken } from "@/utils/auth";
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination

export default {
  name: "SchoolUser",
  components: { Pagination },
  data() {
    var phoneReg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
    var nameReg = /^[A-Za-z0-9]{6,20}$/;
    var validatePhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("号码不能为空!!"));
      }
      if (!phoneReg.test(value)) {
        callback(new Error("请输入正确的11位手机号"));
      } else {
        callback();
      }
    };
    var validateName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("登陆账号不能为空!!"));
      }
      if (!nameReg.test(value)) {
        callback(new Error("请输入6-20位的字母或数字"));
      } else {
        callback();
      }
    };
    return {
      importHeaders:{ Authorization: getToken()},
      baseUrl: process.env.VUE_APP_BASE_API,
      fileList: [],
      password: "",
      resetId: "",
      tableKey: 0,
      list: null,
      total: 0,
      isdisabled: false,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        keyword: ""
      },
      form: {
        contactPhone: "",
        phone: "",
        cover: "",
        idCard: "",
        remark: "",
        name: "",
        realName: "",
        password: "",
        status: 0
      },
      roleList: [],
      dialogFormVisible: false,
      dialogFormVisible2: false,
      dialogStatus: "",
      // 表单验证
      rules: {
        name: [{ required: true, validator: validateName, trigger: "blur" }],
        phone: [{ required: true, validator: validatePhone, trigger: "blur" }],
        realName: [{ required: true, message: "请输入姓名", trigger: "blur" }]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    // 关闭蒙层
    closeDL() {
      this.dialogFormVisible = false;
      this.$refs.dataForm.clearValidate();
      this.resetTemp();
    },
    //关闭重置密码蒙层
    closeDL2() {
      this.dialogFormVisible2 = false;
    },
    getList() {
      this.listLoading = true;
      this.$API.teacher.teacherList({ ...this.listQuery }).then(Response => {
        this.list = Response.data.object.sysUserList.list;
        this.total = Response.data.object.sysUserList.total;
        this.listLoading = false;
      });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    // 禁用or启用
    handleModifyStatus(row, status) {
      this.$API.teacher
        .teacherUpdateStatus({
          params: {
            status,
            userId: row.id
          }
        })
        .then(response => {
          this.$message({
            message: "操作成功",
            type: "success"
          });
          this.getList();
        })
        .catch(response => {
          this.$message({
            message: "操作失败",
            type: "error"
          });
        });
    },
    resetTemp() {
      this.form = {
        contactPhone: "",
        cover: "",
        idCard: "",
        remark: "",
        name: "",
        realName: "",
        password: "",
        status: 0
      };
    },
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
    },
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.isdisabled = true;
          this.$API.teacher.teacherSave({ ...this.form }).then(Response => {
            if (Response.data.result == "ok") {
              this.$message({
                message: "操作成功",
                type: "success"
              });
              this.closeDL();
              this.getList();
              this.isdisabled = false;
            }else{
              this.$message({
                message: Response.data.errorMsg,
                type: "error"
              })
              this.isdisabled = false
            }
          });
        }
      });
    },
    handleUpdate(row) {
      this.dialogFormVisible = true;
      this.dialogStatus = "update";
      this.$API.teacher.teacherEdit(row.id).then(res => {
        this.form = {
          contactPhone: res.data.object.contactPhone,
          phone: res.data.object.phone,
          cover: res.data.object.cover,
          idCard: res.data.object.idCard,
          remark: res.data.object.remark,
          name: res.data.object.name,
          realName: res.data.object.realName,
          status: res.data.object.status,
          id: res.data.object.id,
          password: ""
        };
      });
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
    //保存密码
    savePassword() {
      this.listLoading3 = true;
      this.$API.system
        .systemUserResetPassword({
          password: this.password,
          userId: this.resetId
        })
        .then(res => {
          if (res.data.result == "ok") {
            this.$message({
              message: "操作成功",
              type: "success"
            });
            this.dialogFormVisible2 = false;
            this.listLoading3 = false;
            this.getList();
          }
        });
    },
    handleDownload() {
      // 下载模板
      var url = process.env.VUE_APP_BASE_API + "excel/教师导入模板.xlsx";
      window.open(url);
    },
    batchAddition(ret) {
      // 导入
      if (ret.result === "ok") {
        if (ret.object.errorCount > 0) {
          var errorKey = ret.object.errorKey;
          this.$confirm(
            "成功导入" +
              ret.object.okCount +
              "人，" +
              ret.object.errorCount +
              "人导入失败," +
              "是否导出错误信息？",
            "提示",
            {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: "warning"
            }
          )
            .then(() => {
              this.$API.teacher.teacherErrorInfo(errorKey).then(ret => {
                // 导出错误信息
                window.location.href =
                  process.env.VUE_APP_BASE_API.replace("console","download")+ret.data.object
              });
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消"
              });
              this.getList();
            });
        } else {
          this.$message({
            type: "success",
            message: "成功导入" + ret.object.okCount + "人"
          });
          this.getList();
        }
      }
    }
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
.resetBox {
  display: flex;
  align-items: center;
  span {
    width: 150px;
  }
  input {
    margin-left: 8px;
    width: 80%;
  }
}
.dialog-footer {
  margin-top: 50px;
}
.dialogBox {
  width: 80%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
