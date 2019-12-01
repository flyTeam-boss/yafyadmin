<template>
  <div class="app-container">
    <div class="filter-container">
      <span
        style="display: inline-block;
        vertical-align: top;
        padding-top: 10px;"
      >搜索班级：</span>
      <el-input
        v-model="listQuery.classSreach"
        placeholder="输入班级（如四班）或代码"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.search"
        placeholder="班主任（如张三）"
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
        v-if="isShowBtn('添加班级')"
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >添加班级</el-button>
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
      <el-table-column label="班级" sortable="custom" prop="id" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="班级代码" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.classCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="年级名称" align="center" sortable="custom">
        <template slot-scope="{row}">
          <el-tag>{{ row.gradeName }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="班级人数" sortable="custom" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.studentCounts }}</span>
        </template>
      </el-table-column>
      <el-table-column label="班主任" sortable="custom" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.classTeacherName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.status==0?'启用':'禁用' }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
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

    <el-dialog center :title="dialogStatus==='create'?'添加班级':'编辑班级'" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="form"
        label-position="right"
        label-width="85px"
      >
        <el-form-item label="选择年级" prop="gradeId">
          <el-select v-model="form.gradeId" placeholder="请选择">
            <el-option v-for="(item,index) in grades" :key="index" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="班级代码：" prop="code">
          <el-input v-model="form.classCode" class="w-200" disabled />
        </el-form-item>
        <el-form-item label="班级：" prop="name" label-width="85px">
          <el-input v-model="form.name" class="w-200" placeholder="输入班级（如三班）" />
        </el-form-item>
        <el-form-item label="班主任：" prop="classTeacherId" label-width="85px">
          <el-select v-model="form.classTeacherId" placeholder="请选择">
            <el-option v-for="(item,index) in classTeachers" :key="index" :label="item.realName" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="班级人数：" prop="studentCounts" label-width="85px">
          <el-input v-model="form.studentCounts" class="w-200" disabled />
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
import { classList, classAdd, getClassInfo, classDetail, classStatus } from '@/api/organizationAndRole'
import waves from '@/directive/waves' // Waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

const calendarTypeOptions = [
  { key: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' }
]

// arr to obj ,such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})
export default {
  name: 'Class',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        search: undefined,
        classSreach: undefined
      },
      form: {
        classCode: '',
        classTeacherId: undefined,
        gradeId: undefined,
        id: '',
        name: '',
        schoolId: 0,
        status: '0',
        studentCounts: 0
      },
      // 表单验证
      rules: {
        gradeId: [{ required: true, message: '请选择年级', trigger: 'blur' }],
        name: [{ required: true, message: '请输入班级', trigger: 'blur' }],
        classTeacherId: [{ required: true, message: '请选择班主任', trigger: 'blur' }],
        status: [{ required: true, message: '请选择状态', trigger: 'change' }]
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
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
      downloadLoading: false,
      classTeachers: [], // 班主任列表
      grades: []// 年级列表

    }
  },
  created() {
    this.getList()
    this.getInfo()
  },
  methods: {
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
    getInfo: function() { // 添加时获取班级所需信息
      this.listLoading = true
      getClassInfo({}).then(ret => {
        this.listLoading = false
        // console.log(JSON.stringify(ret))
        if (ret.data.result === 'ok') {
          this.classTeachers = ret.data.object.classTeachers
          this.grades = ret.data.object.grades
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
      classList(this.listQuery).then(ret => {
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
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) { // 启用与禁用
      classStatus({
        classId: row.id,
        status: status
      }).then(ret => {
        // console.log(JSON.stringify(ret))
        if (ret.data.result === 'ok') {
          this.listQuery.page = 0
          this.getList()
          this.$message({
            message: '操作成功',
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
        classCode: '',
        classTeacherId: undefined,
        gradeId: undefined,
        id: '',
        name: '',
        schoolId: 0,
        status: '0',
        studentCounts: 0
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$API.school.classAdd().then(Response => {
        console.log(Response)
      })
    },
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.form.status = parseInt(this.form.status)
          classAdd(this.form, '').then(ret => {
            console.log(JSON.stringify(ret))
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
        }
      })
    },
    handleUpdate(row) { // 点击编辑按钮获取详情
      //   this.temp = Object.assign({}, row); // copy obj
      //   this.temp.timestamp = new Date(this.temp.timestamp);
      this.dialogStatus = 'update'
      classDetail({ classId: row.id }).then(ret => {
        console.log(JSON.stringify(ret))
        if (ret.data.result === 'ok') {
          this.form = {
            classCode: ret.data.object.classes.classCode,
            classTeacherId: ret.data.object.classes.classTeacherId,
            gradeId: ret.data.object.classes.gradeId,
            id: ret.data.object.classes.id,
            name: ret.data.object.classes.name,
            schoolId: ret.data.object.classes.schoolId,
            status: ret.data.object.classes.status.toString(),
            studentCounts: ret.data.object.classes.studentCounts
          }
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
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.form.status = parseInt(this.form.status)
          classAdd(this.form, this.form.id).then(ret => {
            console.log(JSON.stringify(ret))
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

</style>
