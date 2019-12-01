<template>
  <div class="app-container">
    <div class="filter-container">
      <span
        style="display: inline-block;
        vertical-align: top;
        padding-top: 10px;"
      >搜索家长：</span>
      <el-input
        v-model="listQuery.keyword"
        placeholder="姓名、联系电话"
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
      >添加家长</el-button>
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
      <el-table-column label="序号" type="index" align="center" width="50"></el-table-column>
      <el-table-column label="ID号" min-width="60" align="center">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="家长姓名" sortable prop="name" min-width="80" align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系电话" sortable prop="phone" min-width="100" align="center">
        <template slot-scope="{row}">
          <span>{{ row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型" sortable prop="type" min-width="100" align="center">
        <template slot-scope="{row}">
          <span>{{ row.type}}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" sortable prop="createTime" min-width="120" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" sortable prop="status" min-width="80" align="center">
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
    <el-dialog
      center
      :title="dialogStatus==='create'?'新增家长':'编辑家长'"
      :visible.sync="dialogFormVisible"
      :before-close="closeDL"
    >
      <el-form
      v-loading="listLoading2"
        ref="dataForm"
        :rules="rules"
        :model="form"
        label-position="right"
        label-width="95px"
      >
          <el-form-item class="max-w300" label-width="95px" label="家长姓名：" prop="name">
            <el-input v-model="form.name" placeholder="输入姓名" />
          </el-form-item>
          <el-form-item class="max-w300" label-width="95px" label="联系电话：" prop="phone">
            <el-input type="number" v-model.number="form.phone" placeholder="联系电话" />
          </el-form-item>
          <el-form-item class="max-w300" 
        :label="dialogStatus=='update'?'修改密码：':'密码：'"
        v-if="dialogStatus=='update'?false:true">
          <el-input v-model="form.password" autocomplete="new-password" type="password" placeholder="******"/>
          <div class="defPwd" v-if="dialogStatus!='update'">默认密码为123456</div>
        </el-form-item>
        <el-form-item class="max-w300" label-width="95px" label="家长类型：" prop="type">
            <el-select v-model.number="form.type" placeholder="选择家长类型">
                <el-option v-for="item in parentType"
                    :key="item.id"
                    :label="item.name"
                    :value="item.name"/>
            </el-select>
        </el-form-item>
        <el-form-item label="状态：" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :label="0">启用</el-radio>
            <el-radio :label="1">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div class="dialog-footer">
        <el-button :disabled="isdisabled" type="primary" @click="dialogStatus==='create'?createData():updateData()">保存</el-button>
        <el-button :disabled="isdisabled" @click="closeDL">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination"; 
export default {
  name: "Parent",
  components: { Pagination },
  data() {
    var phoneReg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/
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
    return {
      parentType:[{id:0,name:'父亲'},
      {id:1,name:'母亲'},
      {id:2,name:'爷爷'},
      {id:3,name:'奶奶'},
      {id:4,name:'外公'},
      {id:5,name:'外婆'},
      {id:6,name:'亲戚'}],
      tableKey: 0,
      list: null,
      total: 0,
      isdisabled:false,
      listLoading: true,
      listLoading2:false,
      listQuery: {
        page: 1,
        limit: 20,
        keyword:'',
        name: '',
        phone:''
      },
      form: {
        phone:'',
        name:'',
        password:'',
        type:'',
        status:0,
      },
      dialogFormVisible: false,
      dialogFormVisible2: false,
      dialogStatus: "",
      // 表单验证
      rules: {
        name: [{ required: true, message: "请输入家长姓名", trigger: "blur" }],
        phone: [{ required: true, validator: validatePhone, trigger: "blur" }],
        type: [{ required: true, message: "请选择家长类型", trigger: "change" }],
        status: [{ required: true, message: "请选择状态", trigger: "change" }],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    // 关闭蒙层
    closeDL(){
      this.dialogFormVisible = false;
      this.$refs.dataForm.clearValidate();
      this.resetTemp()
    },
    //关闭重置密码蒙层
    closeDL2(){
      this.dialogFormVisible2 = false;
    },
    getList() {
      this.listLoading = true;
      this.$API.parent.parentList({...this.listQuery}).then(Response => {
        this.list = Response.data.object.list;
        this.total = Response.data.object.total;
        this.listLoading = false;
      });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    // 禁用or启用
    handleModifyStatus(row, status) {
      this.$API.parent
        .parentUpdateStatus({
            status,
            id: row.id
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
        phone:'',
        name:'',
        password:'',
        type:'',
        status:0,
      }
    },
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
    },
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.isdisabled = true
          this.$API.parent.parentSave({...this.form}).then(Response => {
              if (Response.data.result == "ok") {
                this.$message({
                  message: "操作成功",
                  type: "success"
                });
                this.closeDL();
                this.getList();
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
    handleUpdate(row) {
      this.dialogFormVisible = true;
      this.listLoading2 = true
      this.dialogStatus = "update";
      this.$API.parent.parentEdit(row.id).then((res) => {
        this.form = {
          phone:res.data.object.phone,
          name:res.data.object.name,
          type:res.data.object.type,
          status:res.data.object.status,
          id:res.data.object.id
        }
        this.listLoading2 = false
      })
    },
    updateData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.isdisabled = true
          console.log(this.form)
          this.$API.parent.parentEditSave({...this.form}).then(Response => {
              if (Response.data.result == "ok") {
                this.$message({
                  message: "操作成功",
                  type: "success"
                });
                this.closeDL();
                this.isdisabled = false
                this.getList();
              }else{
                this.$message({
                  message: Response.data.errorMsg,
                  type: "error"
                });
                this.isdisabled = false
              }
            });
        }
      });
    },
    //重置密码
    resetPassword(row){
      this.$confirm('确认重置密码?', '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            this.$API.parent.parentResetPwd(row.id).then((res)=>{
              if(res.data.result=='ok'){
                this.$message({
                    message: "操作成功",
                    type: "success"
                  });
                  this.getList()
              }else{
                  this.$message({
                      message: "操作失败，请重试",
                      type: "error"
                  });
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
.dialogBox{
  width:80%;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>
