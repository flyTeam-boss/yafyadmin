<template>
  <div class="app-container">
    <div class="filter-container">
      <span
        style="display: inline-block;
        vertical-align: top;
        padding-top: 10px;"
      >搜索学生：</span>

      <el-select v-model="listQuery.gradeId" class="filter-item w-150" placeholder="请选择年级" @change="getClassesList(listQuery.gradeId)">
        <el-option label="全部年级" value="" />
        <el-option v-for="(el,i) in gradeList" :key="i" :label="el.name" :value="el.id" />
      </el-select>

      <el-select v-model="listQuery.classId" class="filter-item w-150" placeholder="请选择班级">
        <el-option label="全部班级" value="" />
        <el-option v-for="(el,i) in classList" :key="i" :label="el.name" :value="el.id" />
      </el-select>
      <el-input
        v-model="listQuery.search"
        placeholder="学生或家长姓名"
        class="filter-item w-150"
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
        v-if="isShowBtn('添加学生')"
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >添加学生</el-button>
      <el-upload
        v-if="isShowBtn('批量添加学生')"
        class="filter-item"
        :action="baseUrl+'/api/student/import'"
        :headers="importHeaders"
        :on-success="batchAddition"
      >
        <el-button type="primary">批量添加学生</el-button>
      </el-upload>
      <el-button
        v-if="isShowBtn('批量添加学生')"
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        @click="downloadModel"
      >下载批量添加学生模板</el-button>
      <el-button
        v-if="isShowBtn('调班')"
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="changeClass()"
      >调班</el-button>
    </div>

    <el-table
      :key="tableKey"
      ref="multipleTable"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        align="center"
        width="55"
      />
      <el-table-column label="学生姓名" width="110px" sortable="custom" prop="id" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="性别" width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.sex==0?'男':'女' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="学号" align="center" sortable="custom">
        <template slot-scope="scope">
          <span>{{ scope.row.stuNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="家长姓名" sortable="custom" align="center">
        <template slot-scope="scope">
          <el-tag v-for="(item,index) in scope.row.parentNames" :key="index">{{ item }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="家长手机号" sortable="custom" align="center">
        <template slot-scope="scope">
          <el-tag v-for="(item,index) in scope.row.parentPhones" :key="index">{{ item }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="年级" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.gradeName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="班级" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.className }}</span>
        </template>
      </el-table-column>
      <el-table-column label="学籍状态" width="110px" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.stuStatus==0">在籍</span>
          <span v-if="scope.row.stuStatus==1">休学</span>
          <span v-if="scope.row.stuStatus==2">毕业</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="180" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button v-if="isShowBtn('编辑')" type="primary" size="mini" @click="handleUpdate(row)">编辑</el-button>
          <el-button
            v-if="row.status==0 && isShowBtn('禁用')"
            size="mini"
            type="danger"
            @click="handleModifyStatus(row,1)"
          >禁用</el-button>
          <el-button
            v-if="row.status!=0 && isShowBtn('启用')"
            size="mini"
            type="info"
            @click="handleModifyStatus(row,0)"
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
    <el-dialog center title="调班" :visible.sync="showChangeClass">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="form"
        label-position="right"
        label-width="95px"
      >
        <el-form-item label="调换班级：" prop="name">
          <el-select v-model="postChangeClass.newclassId" placeholder="请选择班级">
            <el-option v-for="(el,i) in classList" :key="i" :label="el.name" :value="el.id" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitChangeClass();">保存</el-button>
        <el-button @click="showChangeClass = false">取消</el-button>
      </div>
    </el-dialog>

    <el-dialog center :title="dialogStatus==='create'?'添加学生':'编辑学生'" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="form"
        label-position="right"
        label-width="95px"
      >
        <el-form-item label="学生姓名：" prop="name">
          <el-input v-model="form.name" class="w-200" placeholder="输入姓名" />
        </el-form-item>
        <el-form-item label="性别：" prop="sex">
          <el-radio-group v-model="form.sex">
            <el-radio :label="0">男</el-radio>
            <el-radio :label="1">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="学号：" prop="stuNumber">
          <el-input v-model="form.stuNumber" class="w-200" placeholder="输入学号" />
        </el-form-item>
        <!-- <el-form-item label="家长姓名：" prop="stuParents[0].name" label-width="95px">
          <el-input v-model="form.stuParents[0].name" class="w-200" placeholder="输入家长姓名" />
        </el-form-item>
        <el-form-item label="家长电话：" prop="stuParents[0].phone" label-width="95px">
          <el-input v-model="form.stuParents[0].phone" class="w-200" placeholder="输入家长电话" />
        </el-form-item> -->

        <el-form-item label="家长信息:">
          <div v-for="(item,index) in form.stuParentResponses" :key="index" class="subject-box">

            <el-input v-model="item.name" class="w25 line" placeholder="输入家长姓名" />
            <el-col class="line" :span="1">-</el-col>
            <el-input v-model="item.phone" maxlength="11" class="w25" placeholder="输入家长电话" @keyup.native="handleInput" />
            <el-col class="line" :span="1">-</el-col>
            <el-col class="line w25">
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
            <el-col v-if="index>0" class="line" :span="1">
              <i class="el-icon-delete" @click="delSubject(index);" />
            </el-col>
          </div>
        </el-form-item>

        <el-form-item label="年级" label-width="95px" required>
          <el-col class="line" :span="9">
            <el-form-item prop="gradeId">
              <el-select v-model="form.gradeId" placeholder="请选择年级" @change="getClassesList(form.gradeId)">
                <el-option v-for="(el,i) in gradeList" :key="i" :label="el.name" :value="el.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="1">-</el-col>
          <el-col class="line" :span="9">
            <el-form-item prop="classId">
              <el-select v-model="form.classId" placeholder="请选择班级">
                <el-option v-for="(el,i) in classList" :key="i" :label="el.name" :value="el.id" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="学籍状态：" prop="stuStatus" label-width="95px">
          <el-radio-group v-model="form.stuStatus">
            <el-radio :label="0">在籍</el-radio>
            <el-radio :label="1">休学</el-radio>
            <el-radio :label="2">毕业</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="状态：" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :label="0">启用</el-radio>
            <el-radio :label="1">禁用</el-radio>
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
import { studentList, studentAdd, studentDetail, studentAddInfo, getGrade, getClasses, studentChangeStatus, studentChangeClass, studentErrorInfo } from '@/api/organizationAndRole'
import waves from '@/directive/waves' // Waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { getToken } from '@/utils/auth'
import { isPhone } from '@/utils/validate'

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
  name: 'Student',
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
      importHeaders: { Authorization: 'Bearer ' + getToken() },
      baseUrl: process.env.VUE_APP_BASE_API,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        search: undefined,
        gradeId: undefined,
        classId: undefined
      },
      gradeList: [], // 年级列表
      classList: [],
      parentList: [], // 家长列表
      form: {
        classId: undefined,
        className: '',
        gradeId: undefined,
        gradeName: '',
        id: '',
        name: '',
        schoolId: 0,
        sex: undefined,
        status: '0',
        stuNumber: '',
        stuParentResponses: [{
          id: '',
          name: '',
          phone: '',
          relation: ''
        }],
        stuStatus: '0'
      },
      // 表单验证
      rules: {
        name: [{ required: true, message: '请输入学生姓名', trigger: 'blur' }],
        sex: [{ required: true, message: '请选择性别', trigger: 'blur' }],
        stuNumber: [{ required: true, message: '请输入学号', trigger: 'blur' }],
        'stuParents[0].name': [{ required: true, message: '请输入家长姓名', trigger: 'blur' }],
        'stuParents[0].phone': [{ required: true, message: '请输入家长电话', trigger: 'blur' }],
        gradeId: [{ required: true, message: '请选择', trigger: 'blur' }],
        classId: [{ required: true, message: '请选择', trigger: 'blur' }],
        stuStatus: [{ required: true, message: '请选择学籍', trigger: 'blur' }],
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
      showChangeClass: false,
      postChangeClass: {
        newclassId: undefined,
        oldClassIds: [],
        stuIds: []
      },
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
    this.getStudentInfo()
    this.getGradeList()
  },
  methods: {
    handleInput(e) {
      e.target.value = (e.target.value.match(/^\d*(\.?\d{0,1})/g)[0]) || null
    },
    handleSelectionChange(val) {
      var stuIds = []
      var oldClassIds = []
      var firstGradeId
      val.map((item, index) => {
        firstGradeId = val[0].gradeId
        if (index > 0) {
          if (item.gradeId !== val[0].gradeId) {
            this.$message({
              message: '请选择同一年级的学生！',
              type: 'error'
            })
            this.$refs.multipleTable.toggleRowSelection(item)
          } else {
            stuIds.push(item.id)
            oldClassIds.push(item.classId)
          }
        } else {
          stuIds.push(item.id)
          oldClassIds.push(item.classId)
        }
      })
      this.getClassesList(firstGradeId)
      this.postChangeClass.stuIds = stuIds
      this.postChangeClass.oldClassIds = oldClassIds
    },
    downloadModel: function() {
      window.location.href = process.env.VUE_APP_BASE_API + 'excel/学生模版.xlsx'
    //   window.location.href = 'http://192.168.2.111:9206/console/excel/学生模版.xlsx'
    },
    batchAddition: function(ret) { // 批量导入
    // console.log(JSON.stringify(ret))
      if (ret.result === 'ok') {
        if (ret.object.errorCount > 0) {
          this.$confirm('成功导入' + ret.object.okInfoCount + '人，' + ret.object.errorCount + '人导入失败' + '是否导出错误信息？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            studentErrorInfo().then(ret => { // 导出错误信息
            //   console.log(JSON.stringify(ret))
              window.location.href = process.env.VUE_APP_BASE_API.replace('console', '') + 'output/' + ret.data.object
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            })
            this.getList()
          })
        } else {
          this.$message({
            type: 'success',
            message: '成功导入' + ret.object.okInfoCount + '人'
          })
          this.getList()
        }
      }
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
    getStudentInfo: function() { // 获取需要添加时的数据
      studentAddInfo({}).then(ret => {
        // console.log(JSON.stringify(ret))
        if (ret.data.result === 'ok') {
          this.parentList = ret.data.object.stuParents
          // Just to simulate the time of the request
        } else {
          this.$message({
            message: ret.data.errorMsg,
            type: 'error'
          })
        }
      })
    },
    getGradeList: function() { // 获取年级列表
      getGrade().then(ret => {
        // console.log(JSON.stringify(ret))
        if (ret.data.result === 'ok') {
          this.gradeList = ret.data.object
          // Just to simulate the time of the request
        } else {
          this.$message({
            message: ret.data.errorMsg,
            type: 'error'
          })
        }
      })
    },
    getClassesList: function(id) { // 获取班级列表
      getClasses({ gradeId: id }).then(ret => {
        // console.log(JSON.stringify(ret))
        if (ret.data.result === 'ok') {
          this.classList = ret.data.object
          // Just to simulate the time of the request
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
      studentList(this.listQuery).then(ret => {
        this.listLoading = false
        // console.log(JSON.stringify(ret))
        if (ret.data.result === 'ok') {
          ret.data.object.list.forEach(element => {
            if (element.parentNames || element.parentPhones) {
              element.parentNames = element.parentNames.split(',')
              element.parentPhones = element.parentPhones.split(',')
            }
          })
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
      studentChangeStatus({
        stuId: row.id,
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
      this.classList = []
      this.form = {
        classId: undefined,
        className: '',
        gradeId: undefined,
        gradeName: '',
        id: '',
        name: '',
        schoolId: 0,
        sex: 0,
        status: 0,
        stuNumber: '',
        stuParentResponses: [{
          id: '',
          name: '',
          phone: '',
          relation: ''
        }],
        stuStatus: 0
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      //   this.form.stuParents.push(...this.parentList)
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          for (let i = 0; i < this.form.stuParentResponses.length; i++) {
            const element = this.form.stuParentResponses[i]
            if (!element.name) {
              this.$message({
                message: '请填写家长姓名',
                type: 'error'
              })
              return
            }
            if (!element.phone) {
              this.$message({
                message: '请填写家长电话',
                type: 'error'
              })
              return
            } else {
              if (!isPhone(element.phone)) {
                this.$message({
                  message: '请填写正确的家长电话',
                  type: 'error'
                })
                return
              }
            }
            if (!element.relation) {
              this.$message({
                message: '请选择与家长关系',
                type: 'error'
              })
              return
            }
          }
          studentAdd(this.form).then(ret => {
            // console.log(JSON.stringify(ret))
            if (ret.data.result === 'ok') {
              this.listQuery.page = 0
              this.getList()
              this.getStudentInfo()
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
    changeClass: function() {
      this.showChangeClass = true
      // this.list.forEach(element => {
      //   this.postChangeClass.oldClassIds.push(element.classId)
      //   this.postChangeClass.stuIds.push(element.id)
      // })
    },
    handleUpdate(row) { // 点击编辑按钮获取详情
      //   this.temp = Object.assign({}, row); // copy obj
      //   this.temp.timestamp = new Date(this.temp.timestamp);
      this.dialogStatus = 'update'
      studentDetail({ studentId: row.id }).then(ret => {
        // console.log(JSON.stringify(ret))
        if (ret.data.result === 'ok') {
          this.form.id = ret.data.object.studentParentResponse.id
          this.form.name = ret.data.object.studentParentResponse.name
          this.form.sex = ret.data.object.studentParentResponse.sex
          this.form.stuNumber = ret.data.object.studentParentResponse.stuNumber
          this.form.gradeId = ret.data.object.studentParentResponse.gradeId
          this.$nextTick(() => {
            this.form.stuParentResponses = ret.data.object.studentParentResponse.stuParents
            this.getClassesList(ret.data.object.studentParentResponse.gradeId)
          })
          this.form.classId = ret.data.object.studentParentResponse.classId
          this.form.stuStatus = ret.data.object.studentParentResponse.stuStatus
          this.form.status = ret.data.object.studentParentResponse.status
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
          for (let i = 0; i < this.form.stuParentResponses.length; i++) {
            const element = this.form.stuParentResponses[i]
            if (!element.name) {
              this.$message({
                message: '请填写家长姓名',
                type: 'error'
              })
              return
            }
            if (!element.phone) {
              this.$message({
                message: '请填写家长电话',
                type: 'error'
              })
              return
            } else {
              if (!isPhone(element.phone)) {
                this.$message({
                  message: '请填写正确的家长电话',
                  type: 'error'
                })
                return
              }
            }
            if (!element.relation) {
              this.$message({
                message: '请选择与家长关系',
                type: 'error'
              })
              return
            }
          }
          studentAdd(this.form).then(ret => {
            // console.log(JSON.stringify(ret))
            if (ret.data.result === 'ok') {
              this.listQuery.page = 0
              this.getList()
              this.getStudentInfo()
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
    submitChangeClass: function() { // 调班
      studentChangeClass(this.postChangeClass).then(ret => {
        // console.log(JSON.stringify(ret))
        if (ret.data.result === 'ok') {
          this.listQuery.page = 0
          this.getList()
          this.getStudentInfo()
          this.showChangeClass = false
          this.$message({
            message: '调班成功',
            type: 'success'
          })
          this.postChangeClass = {
            newclassId: undefined,
            oldClassIds: [],
            stuIds: []
          }
        } else {
          this.$message({
            message: ret.data.errorMsg,
            type: 'error'
          })
        }
      })
    },
    changeParent: function(index) { // 选择家长后填充数据
      const vm = this
      vm.parentList.forEach(element => {
        if (element.id === vm.form.stuParentResponses[index].id) {
          vm.form.stuParentResponses[index].name = element.name
          vm.form.stuParentResponses[index].phone = element.phone
          vm.form.stuParentResponses[index].relation = element.relation
        }
      })
    },
    addSubject: function() { // 添加数据
      const vm = this
      vm.form.stuParentResponses.push({
        id: '',
        name: '',
        phone: '',
        relation: ''
      })
    },
    delSubject: function(index) { // 删除数据
      const vm = this
      vm.form.stuParentResponses.splice(index, 1)
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
        display: inline-block;
        text-align: center;
        margin: 0 2px;
        float: inherit;
    }
    .w25{
        width: 25%;
    }
    .w-150{
        width: 150px;
    }
    .el-col-1{
        width: 3%;
    }
    .el-upload-list{
      display: none;
    }
</style>
