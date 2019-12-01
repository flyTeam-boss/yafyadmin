<template>
  <div class="app-container">
    <div class="filter-container">
      <span
        style="display: inline-block;
        vertical-align: top;
        padding-top: 10px;"
      >搜索用户：</span>
      <el-input
        v-model="listQuery.search"
        placeholder="请输入账号或姓名"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >搜索</el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
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
      <el-table-column label="序号" type="index" align="center" width="50"></el-table-column>
      <el-table-column label="账号名称" min-width="100" align="center">
        <template slot-scope="{row}">
          <span>{{ row.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="真实姓名" min-width="100" align="center">
        <template slot-scope="{row}">
          <span>{{ row.realName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色" min-width="100" align="center">
        <template slot-scope="{row}">
          <span v-for="item in row.systemRoles" :key="item.id">{{ item.roleName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" min-width="160" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="90" align="center">
        <template slot-scope="{row}">
          <span v-if="row.userStatus === '1'">禁用</span>
          <span v-else>启用</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="170" align="center">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">编辑</el-button>
          <el-button
            v-if="row.userStatus =='0'"
            size="mini"
            type="danger"
            @click="handleModifyStatus(row,'1')"
          >禁用</el-button>
          <el-button
            v-if="row.userStatus=='1'"
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
      :title="dialogStatus==='create'?'新增用户':'编辑用户'"
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
        <el-form-item class="max-w300" label="账号：" prop="name">
          <el-input v-model="form.name" placeholder="请输入账号" />
        </el-form-item>
        <el-form-item class="max-w300" label="真实姓名：" prop="realName">
          <el-input v-model="form.realName" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item class="max-w300" :label="dialogStatus=='update'?'修改密码：':'密码：'" prop="password">
          <el-input v-model="form.password" autocomplete="new-password" type="password" placeholder="******"/>
          <div class="defPwd" v-if="dialogStatus!='update'">默认密码为123456</div>
        </el-form-item>
        <el-form-item label="角色：">
          <el-radio-group v-model="form.roleId" v-for="item in roleList" :key="item.id">
            <el-radio :label="item.id" :value="item.id">{{ item.roleName }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="状态：" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio label="0">启用</el-radio>
            <el-radio label="1">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div class="dialog-footer">
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">保存</el-button>
        <el-button @click="closeDL">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Qs from 'qs'
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination

export default {
  name: "SchoolUser",
  components: { Pagination },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 0,
        limit: 10,
        search: ""
      },
      form: {
        name: "",
        realName: "",
        password: "",
        roleId: '',
        status: ""
      },
      roleList: [],
      dialogFormVisible: false,
      dialogStatus: "",
      // 表单验证
      rules: {
        name: [{ required: true, message: "请输入账号", trigger: "blur" }],
        realName: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        status: [{ required: true, message: "请选择状态", trigger: "change" }]
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
      this.form = {
        name: "",
        realName: "",
        password: "",
        status: JSON.stringify('')
      }
    },
    getList() {
      this.listLoading = true;
      this.$API.schoolM.schoolUser({
        params: {
          ...this.listQuery
        }
      }).then(Response => {
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
      this.$API.system
        .systemUserChangStatus({
          params: {
            status,
            userId: row.userId
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
        name: "",
        realName: "",
        password: "",
        roleId: JSON.stringify(""),
        status: JSON.stringify("")
      }
    },
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$API.schoolM.schoolUserAdd().then((data) => {
        this.roleList = data.data.object;
      })
    },
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.$API.schoolM
            .schoolUserSave({
              ...this.form
            },this.form.roleId)
            .then(Response => {
              if (Response.data.result == "ok") {
                this.$message({
                  message: "操作成功",
                  type: "success"
                });
                this.closeDL();
                this.getList();
              }
            })
        }
      });
    },
    handleUpdate(row) {
      this.dialogFormVisible = true;
      this.dialogStatus = "update";
      this.$API.schoolM.schoolUserAdd().then((data) => {
        this.roleList = data.data.object;
      })
      this.form = {
        name: row.userName,
        realName: row.realName,
        password: "",
        roleId: row.systemRoles[0].id,
        status: row.userStatus,
        id: row.userId
      }
    },
    updateData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.$API.schoolM
            .schoolUserSave({
              ...this.form
            },this.form.roleId)
            .then(Response => {
              if (Response.data.result == "ok") {
                this.$message({
                  message: "操作成功",
                  type: "success"
                });
                this.closeDL();
                this.getList();
              }
            })
        }
      });
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
</style>
