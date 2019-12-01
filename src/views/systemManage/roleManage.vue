<template>
  <div class="app-container">
    <div class="filter-container">
      <span
        style="display: inline-block;
        vertical-align: top;
        padding-top: 10px;"
      >搜索角色：</span>
      <el-input
        v-model="listQuery.sreach"
        placeholder="输入角色名称"
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
      >添加角色</el-button>
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
    <el-table-column label="ID" min-width="170" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column sortable prop="roleName" label="角色名称" min-width="120" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.roleName }}</span>
        </template>
      </el-table-column>
      
      <el-table-column label="备注" min-width="120" align="center">
        <template slot-scope="{row}">
          <span>{{ row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" sortable prop="status" min-width="90" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.status == 1">禁用</span>
          <span v-else>启用</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" min-width="180" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">编辑</el-button>
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

    <el-dialog center :title="dialogStatus==='create'?'新增角色':'编辑角色'" 
    :visible.sync="dialogFormVisible"
    :before-close="closeDL" >
      <el-row>
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <el-form
              ref="dataForm"
              :rules="rules"
              :model="form"
              label-position="right"
              label-width="70px"
            >
              <el-form-item v-if="dialogStatus==='create'" label="角色名称" prop="roleName" label-width="80px">
                <el-input v-model="form.roleName" placeholder="输入名称（不可更改）" />
              </el-form-item>
              <el-form-item v-else label="角色名称" label-width="80px">
                <el-input v-model="form.roleName" disabled />
              </el-form-item>
              <el-form-item label="备注" label-width="80px">
                <el-input v-model="form.description" type="textarea" placeholder="输入备注" />
              </el-form-item>
              <el-form-item label="状态" prop="status" label-width="80px">
                <el-radio-group v-model="form.status">
                  <el-radio label="0">启用</el-radio>
                  <el-radio label="1">禁用</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" style="text-align:center">
              <el-button
                type="primary"
                :disabled="isdisabled"
                @click="dialogStatus==='create'?createData():updateData()"
              >保存</el-button>
              <el-button :disabled="isdisabled" @click="closeDL">取消</el-button>
            </div>
          </div>
        </el-col>

        <el-col :span="12" style="padding-left:60px; height:80%;overflow-y: auto;">
          <div class="grid-content bg-purple-light">
            <span style="display:inline-block;margin-bottom:6px;">选择所属权限</span>
            <el-tree
            v-loading="listLoading2"
              ref="tree"
              :rules="rules"
              prop="checked"
              node-key="id"
              :default-expand-all="true"
              :check-strictly="true"
              :accordion="true"
              show-checkbox
              :data="data"
              :props="defaultProps"
              @check-change="handleCheckChange"
            />
          </div>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'Role',
  components: { Pagination },
  data() {
    return {
      tableKey: 0,
      list: [],
      total: 0,
      isdisabled:false,
      listLoading: false,
      listLoading2:false,
      listQuery: {
        page: 1,
        limit: 20,
        sreach: '',
      },
      form: {
        roleName: '',
        roleCode: '',
        description: '',
        status: '',
        resourceIds: [],
      },
      data: [],
      resourceIdsBox: [],
      importanceOptions: [1, 2, 3],
      sortOptions: [
        { label: 'ID Ascending', key: '+id' },
        { label: 'ID Descending', key: '-id' }
      ],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      rules: {
        roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
        status: [{ required: true, message: '请勾选状态', trigger: 'change' }]
      },
      downloadLoading: false,
      defaultProps: {
        children: 'resourceDtos',
        label: 'resourceName',
        id: 'id'
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    handleCheckChange(data, checked, indeterminate) {
      // if (checked) {
      //   this.resourceIdsBox.push(data.id)
      // } else {
      //   var index = this.resourceIdsBox.indexOf(data.id)
      //   if (index > -1) {
      //     this.resourceIdsBox.splice(index, 1)
      //   }
      // }
      var newArr = [].concat(
        this.$refs.tree.getHalfCheckedKeys(),
        this.$refs.tree.getCheckedKeys()
      )
      this.form.resourceIds = newArr
    },
    getList() {
      this.listLoading = true
      this.$API.system.systemRole({
        params: {
          ...this.listQuery
        }
      }).then(response => {
        this.list = response.data.object.list
        this.total = response.data.object.total
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    // 禁用or启用
    handleModifyStatus(row, status) {
      this.$API.system.roleChangeStatus(row.id, status).then(response => {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        this.getList()
      }).catch(response => {
        this.$message({
          message: '操作失败',
          type: 'error'
        })
      })
    },
    resetTemp() {
      this.form = {
        name: '',
        code: '',
        remarks: '',
        status: ''
      }
    },
    closeDL() {
      this.dialogFormVisible = false;
      this.$refs.dataForm.clearValidate();
      this.form = {
        roleName: '',
        roleCode: '',
        description: '',
        status: '',
        resourceIds: [],
      };
    },
    handleCreate() {
      // 表单初始化
      this.resetTemp()
      this.dialogStatus = 'create'
      // 弹出蒙层
      this.dialogFormVisible = true
      // 获取treeList
      this.$API.system.roleAdd().then(response => {
        this.data = response.data.object.resourceDtos
      })
    },
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          if (this.form.resourceIds === undefined || this.form.resourceIds.length === 0) {
            this.$message({
              type: 'error',
              message: '您还未选择权限'
            })
          } else {
            this.isdisabled = true
            this.$API.system.roleSave(this.form).then(response => {
              this.$message({
                message: '创建成功',
                type: 'success'
              })
              this.getList()
              this.isdisabled = false
              this.dialogFormVisible = false
            })
          }
        }
      })
    },
    handleUpdate(row) {
      this.listLoading2 = true
      if (this.$refs.dataForm) {
        setTimeout(() => {
          this.$refs.dataForm.clearValidate()
        }, 100)
      }
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$API.system.roleEdit(row.id).then(response => {
        this.data = response.data.object.resourceDtos
        var systemRole = response.data.object.systemRole
        this.form = {
          roleName: systemRole.roleName,
          roleCode: systemRole.roleCode,
          description: systemRole.description,
          status: JSON.stringify(systemRole.status),
          id: systemRole.id,
          schoolId: systemRole.schoolId
        }
        // 回显选中tree
        var roleResourceIds = response.data.object.roleResourceIds
        var newData = []
        for (var i = 0; i < roleResourceIds.length; i++) {
          newData[i] = {}
          newData[i].id = roleResourceIds[i].resourceId
        }
        setTimeout(() => {
          this.$refs.tree.setCheckedNodes(newData)
          this.listLoading2 = false
        }, 100)
      })
    },
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.isdisabled = true
          this.$API.system.roleSave(this.form).then(Response => {
            if (Response.data.result === 'fail') {
              this.$message({
                message: '操作失败',
                type: 'error'
              })
            } else {
              this.$message({
                message: '操作成功',
                type: 'success'
              })
              this.getList()
              this.isdisabled = false
              this.dialogFormVisible = false
            }
          }).catch(Response => {
            this.$message({
              message: '操作失败',
              type: 'error'
            })
          })
        }
      })
    },
    handleDelete(row) {
      this.$notify({
        title: '成功',
        message: '删除成功',
        type: 'success',
        duration: 2000
      })
      const index = this.list.indexOf(row)
      this.list.splice(index, 1)
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = [
          'timestamp',
          'title',
          'type',
          'importance',
          'status'
        ]
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
  }
}
</script>
<style lang="scss">
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
.grid-content {
  height:300px;
  border-radius: 4px;
  min-height: 36px;
}
</style>
