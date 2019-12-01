<template>
  <div class="app-container">
    <div class="filter-container">
      <span
        style="display: inline-block;
        vertical-align: top;
        padding-top: 10px;"
      >搜索家长：</span>
      <el-input
        v-model="listQuery.sreah"
        placeholder="学生或家长姓名手机号"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >搜索</el-button>
      <el-button
        v-if="isShowBtn('添加家长')"
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
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
      @sort-change="sortChange"
    >
      <el-table-column label="家长姓名" sortable="custom" align="center" width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="家长手机号" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="性别" align="center" sortable="custom" width="90px">
        <template slot-scope="scope">
          <span>{{ scope.row.sex==0?'男':'女' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="学生姓名" sortable="custom" min-width="200px" align="center">
        <template slot-scope="scope">
          <!-- <el-tag v-for="item in scope.row.names.split(',')">{{ item }}</el-tag> -->
          <span>{{ scope.row.names }}</span>
        </template>
      </el-table-column>
      <el-table-column label="关系" sortable="custom" min-width="200px" align="center">
        <template slot-scope="scope">
          <!-- <span v-for="item in scope.row.relations.split(',')">{{ item }}</span> -->
          <span>{{ scope.row.relations }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否激活" width="90px" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.isActivate === 0">激活</span>
          <span v-if="scope.row.isActivate === 1">未激活</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.status==0?'启用':'禁用' }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="230px" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button v-if="isShowBtn('重置密码')" type="primary" size="mini" @click="handleRePwd(row)">重置密码</el-button>
          <el-button v-if="isShowBtn('编辑')" type="primary" size="mini" @click="handleUpdate(row)">编辑</el-button>
          <el-button
            v-if="row.status==0 && isShowBtn('禁用')"
            size="mini"
            type="danger"
            @click="handleModifyStatus(row, 1)"
          >禁用</el-button>
          <el-button
            v-if="row.status!=0 && isShowBtn('启用')"
            size="mini"
            type="info"
            @click="handleModifyStatus(row, 0)"
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

    <el-dialog center :title="dialogStatus==='create'?'添加家长':'编辑家长'" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="form"
        label-position="right"
        label-width="95px"
      >
        <el-form-item label="家长姓名：" prop="name">
          <el-input v-model="form.name" class="w-200" placeholder="输入姓名" />
        </el-form-item>
        <el-form-item label="家长电话：" prop="phone">
          <el-input v-model="form.phone" maxlength="11" class="w-200" placeholder="输入家长电话" @keyup.native="handleInput" />
        </el-form-item>
        <el-form-item label="性别：" prop="sex">
          <el-radio-group v-model="form.sex">
            <el-radio label="0">男</el-radio>
            <el-radio label="1">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="头像：" prop="portrait">
          <el-upload
            class="avatar-uploader"
            :action="baseUrl+'/commons/upload/img'"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
          >
            <img v-if="form.headAddress" :src="form.headAddress" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>

        <el-form-item label="学生信息">
          <div v-for="(item,index) in form.students" :key="index" class="subject-box">

            <el-select v-model="item.id" style="float:left;" filterable placeholder="请选择学生" @change="selectStu(item.id,index)">
              <el-option
                v-for="el in studentList"
                :key="el.name"
                :label="el.name+'-'+el.stuNumber"
                :value="el.id"
              />
            </el-select>
            <el-col class="line" :span="1">-</el-col>
            <el-col :span="8">
              <el-form-item prop="relationship">
                <el-select v-model="item.relation" placeholder="选择关系">
                  <el-option label="父亲" value="父亲" />
                  <el-option label="母亲" value="母亲" />
                  <el-option label="爷爷" value="爷爷" />
                  <el-option label="奶奶" value="奶奶" />
                  <el-option label="外公" value="外公" />
                  <el-option label="外婆" value="外婆" />
                  <el-option label="亲属" value="亲属" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col class="line" :span="1">
              <i class="el-icon-circle-plus" @click="addSubject();" />
            </el-col>
            <el-col v-if="index!=0" class="line" :span="1">
              <i class="el-icon-delete" @click="delSubject(index);" />
            </el-col>
          </div>
        </el-form-item>

        <el-form-item label="状态：" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio label="0">启用</el-radio>
            <el-radio label="1">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">保存</el-button>
        <el-button @click="dialogFormVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { parentList, parentAdd, parentStatus, parentDetail, parentAddInfo } from '@/api/organizationAndRole'
import waves from '@/directive/waves' // Waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'Parent',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      baseUrl: process.env.VUE_APP_BASE_API,
      list: null,
      total: 0,
      listLoading: true,
      studentList: [], // 学生列表
      listQuery: {
        page: 1,
        limit: 10,
        sreah: undefined
      },
      form: {
        headAddress: '',
        id: undefined,
        name: '',
        phone: '',
        sex: undefined,
        status: undefined,
        students: [{
          id: '',
          name: '',
          relation: '',
          stuNumber: ''
        }]
      },
      // 表单验证
      rules: {
        name: [{ required: true, message: '请输入家长姓名', trigger: 'blur' }],
        phone: [
          { required: true, message: '请输入家长电话', trigger: 'blur' }
        ],
        sex: [{ required: true, message: '请选择性别', trigger: 'change' }],
        headAddress: [
          { required: true, message: '请上传头像', trigger: 'change' }
        ],
        status: [{ required: true, message: '请选择状态', trigger: 'change' }]
      },
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
      downloadLoading: false
    }
  },
  created() {
    this.getList()
    this.getAddInfo()
  },
  methods: {
    handleInput(e) {
      e.target.value = (e.target.value.match(/^\d*(\.?\d{0,1})/g)[0]) || null
    },
    isShowBtn(key) {
      var falg = false
      JSON.parse(localStorage.btnPermissions).map(item => {
        if (this.$route.path.substr(1) === item.resourceUrl) {
          item.resourceDtos.map(info => {
            if (info.resourceName === key) {
              falg = true
            }
          })
        }
      })
      return falg
    },
    handleRePwd(item) {
      this.$confirm('此操作将重置密码, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$API.school.stuParentResetPassword({
          params: {
            parentId: item.id
          }
        }).then(Response => {
          this.$message({
            type: 'success',
            message: '重置成功!'
          })
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '重置失败!'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消重置密码'
        })
      })
    },
    handleAvatarSuccess(ret, file) { // 图片上传成功
      this.form.headAddress = ret.data.src
    },
    addSubject: function() { // 添加学生
      this.form.students.push({
        id: '',
        name: '',
        relation: '',
        stuNumber: ''
      })
    },
    delSubject: function(index) { // 删除学生
      this.form.students.splice(index, 1)
    },
    getAddInfo() { // 获取添加时所需要的信息
      this.listLoading = true
      parentAddInfo({}).then(ret => {
        this.listLoading = false
        // console.log(JSON.stringify(ret))
        if (ret.data.result === 'ok') {
          this.studentList = ret.data.object
        } else {
          this.$message({
            message: ret.data.errorMsg,
            type: 'error'
          })
        }
      })
    },
    getList() {
      this.listLoading = true
      parentList(this.listQuery).then(ret => {
        this.listLoading = false
        // console.log(JSON.stringify(ret))
        if (ret.data.result === 'ok') {
          this.list = ret.data.object.list
          this.total = ret.data.object.total
          // Just to simulate the time of the request
        } else {
          this.$message({
            message: ret.data.errorMsg,
            type: 'error'
          })
        }
      })
    },
    selectStu: function(id, index) { // 根据选中学生id 添加学生姓名和学号
      this.studentList.forEach(element => {
        if (id === element.id) {
          this.form.students[index].name = element.name
          this.form.students[index].stuNumber = element.stuNumber
        }
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) { // 启用与禁用
      parentStatus({
        stuParentId: row.id,
        status: status
      }).then(ret => {
        // console.log(JSON.stringify(ret))
        if (ret.data.result === 'ok') {
          this.listQuery.page = 0
          this.getList()
          this.$message({
            message: '修改成功',
            type: 'success'
          })
        } else {
          this.$message({
            message: ret.data.errorMsg,
            type: 'error'
          })
        }
      })
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.form = {
        headAddress: '',
        id: undefined,
        name: '',
        phone: '',
        sex: undefined,
        status: undefined,
        students: [{
          id: '',
          name: '',
          relation: '',
          stuNumber: ''
        }]
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          var flag = false
          this.form.students.map(item => {
            if (item.stuNumber !== '' && item.relation !== '') {
              flag = true
            }
          })
          if (flag) {
            this.form.sex = parseInt(this.form.sex)
            this.form.status = parseInt(this.form.status)
            parentAdd(this.form, '').then(ret => {
              // console.log(JSON.stringify(ret))
              if (ret.data.result === 'ok') {
                this.listQuery.page = 0
                this.getList()
                this.dialogFormVisible = false
                this.$message({
                  message: '创建成功',
                  type: 'success'
                })
              } else {
                this.$message({
                  message: ret.data.errorMsg,
                  type: 'error'
                })
              }
            })
          } else {
            this.$message({
              message: '请选择学生信息',
              type: 'error'
            })
          }
        }
      })
    },
    handleUpdate(row) { // 点击编辑按钮获取详情
      //   this.temp = Object.assign({}, row); // copy obj
      //   this.temp.timestamp = new Date(this.temp.timestamp);
      this.dialogStatus = 'update'
      parentDetail({ stuParentId: row.id }).then(ret => {
        // console.log(JSON.stringify(ret))
        if (ret.data.result === 'ok') {
          this.form.id = ret.data.object.stuParent.id
          this.form.name = ret.data.object.stuParent.name
          this.form.headAddress = ret.data.object.stuParent.headAddress
          this.form.phone = ret.data.object.stuParent.phone
          this.form.sex = ret.data.object.stuParent.sex.toString()
          this.form.students = ret.data.object.stuParent.students
          this.form.status = ret.data.object.stuParent.status.toString()
          this.dialogFormVisible = true
          this.$nextTick(() => {
            this.$refs['dataForm'].clearValidate()
          })
        } else {
          this.$message({
            message: ret.data.errorMsg,
            type: 'error'
          })
        }
      })
    },
    updateData() { // 编辑
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.form.sex = parseInt(this.form.sex)
          this.form.status = parseInt(this.form.status)
          parentAdd(this.form, this.form.id).then(ret => {
            // console.log(JSON.stringify(ret))
            if (ret.data.result === 'ok') {
              this.listQuery.page = 0
              this.getList()
              this.dialogFormVisible = false
              this.$message({
                message: '编辑成功',
                type: 'success'
              })
            } else {
              this.$message({
                message: ret.data.errorMsg,
                type: 'error'
              })
            }
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
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === 'timestamp') {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        })
      )
    }
  }
}
</script>
<style lang="scss">
.subject-box{
    margin:8px 0;
    overflow: hidden;
}
.line {
    text-align: center;
    margin: 0 2px;
}
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}
.avatar-uploader .el-upload:hover {
    border-color: #409EFF;
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
.w-200{
    width: 200px;
}
</style>
