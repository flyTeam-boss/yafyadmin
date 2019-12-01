<template>
  <div class="app-container">
    <div class="filter-container">
      <span
        style="display: inline-block;
        vertical-align: top;
        padding-top: 10px;"
      >搜索教职工：</span>
      <el-input
        v-model="listQuery.keyword"
        placeholder="姓名、手机号"
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
        v-if="isShowBtn('添加教职工')"
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >添加教职工</el-button>
      <el-upload
        v-if="isShowBtn('批量添加教职工')"
        class="filter-item"
        :action="baseUrl+'api/teacher/import'"
        :headers="importHeaders"
        :on-success="batchAddition"
      >
        <el-button type="primary">批量添加教职工</el-button>
      </el-upload>
      <el-button
        v-if="isShowBtn('添加教职工')"
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        @click="downloadModel"
      >下载添加教职工模板</el-button>
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
      <el-table-column label="姓名" sortable="custom" align="center" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.realName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号" sortable="custom" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色" sortable="custom" align="center" min-width="150px">
        <template slot-scope="{row}">
          <el-tag v-for="(el,i) in row.systemRoleNameList.split(',')" v-if="el" :key="i">{{ el }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="性别" sortable="custom" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.sex }}</span>
        </template>
      </el-table-column>
      <el-table-column label="教务机构" width="110px" align="center">
        <template slot-scope="{row}">
          <el-tag v-for="(el,i) in row.organNameList.split(',')" v-if="el" :key="i">{{ el }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="职务" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.jobName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否激活" sortable="custom" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.activate==0?'已激活':'未激活' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" sortable="custom" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.status==0?'启用':'禁用' }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button v-if="isShowBtn('重置密码')" type="primary" size="mini" @click="handleRePwd(row)">重置密码</el-button>
          <el-button v-if="isShowBtn('编辑')" type="primary" size="mini" @click="handleUpdate(row)">编辑</el-button>
          <el-button
            v-if="row.status!='deleted' && isShowBtn('删除')"
            size="mini"
            type="danger"
            @click="handleModifyStatus(row.id)"
          >删除</el-button>
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

    <el-dialog center :title="dialogStatus==='create'?'添加教职工':'编辑教职工'" :visible.sync="dialogFormVisible">
      <el-row>
        <el-col :span="18">
          <div class="grid-content bg-purple">
            <el-form
              ref="dataForm"
              :rules="rules"
              :model="form"
              label-position="right"
              label-width="70px"
            >
              <el-form-item label="姓名" prop="realName" label-width="80px">
                <el-input v-model="form.realName" class="w-200" placeholder="输入姓名" />
              </el-form-item>
              <el-form-item label="联系电话" prop="phone" label-width="80px">
                <el-input v-model="form.phone" maxlength="11" class="w-200" placeholder="输入电话" @keyup.native="handleInput" />
              </el-form-item>
              <el-form-item label="角色" prop="roleIds" label-width="80px">
                <el-checkbox-group v-model="form.roleIds">
                  <el-checkbox v-for="(item,index) in roleList " :key="index" :label="item.id" @change="containTeacher()">{{ item.roleName }}</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              <el-form-item v-if="isTacher" label="教学选择" required label-width="80px">
                <div v-for="(item,index) in form.gradeClassSubjectList" :key="index" class="subject-box">
                  <el-col :span="6">
                    <el-form-item prop="gradeId">
                      <el-select v-model="item.gradeId" placeholder="请选择年级" @change="getClassesList(item.gradeId,index)">
                        <el-option v-for="(el,i) in gradeList" :key="i" :label="el.name" :value="el.id" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col class="line" :span="1">-</el-col>
                  <el-col :span="6">
                    <el-form-item prop="classId">
                      <el-select v-model="item.classId" placeholder="请选择班级" @change="getSubjectList(item.classId,index)">
                        <el-option v-for="(el,i) in item.classList" :key="i" :label="el.name" :value="el.id" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col class="line" :span="1">-</el-col>
                  <el-col :span="6">
                    <el-form-item prop="subject">
                      <el-select v-model="item.subjectId" placeholder="请选择科目">
                        <el-option v-for="(el,i) in item.subjectList" :key="i" :label="el.name" :value="el.id" />
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
              <el-form-item label="性别" prop="sex" label-width="80px">
                <el-radio-group v-model="form.sex">
                  <el-radio label="男" />
                  <el-radio label="女" />
                </el-radio-group>
              </el-form-item>
              <el-form-item label="头像" label-width="80px">
                <el-upload
                  class="avatar-uploader"
                  :action="baseUrl+'/commons/upload/img'"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                >
                  <img v-if="form.avatarUrl" :src="form.avatarUrl" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon" />
                </el-upload>
              </el-form-item>
              <el-form-item label="状态" prop="status" label-width="80px">
                <el-radio-group v-model="form.status">
                  <el-radio :label="0">启用</el-radio>
                  <el-radio :label="1">禁用</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" style="text-align:center">
              <el-button
                type="primary"
                @click="dialogStatus==='create'?createData():updateData()"
              >保存</el-button>
              <el-button @click="dialogFormVisible = false">取消</el-button>
            </div>
          </div>
        </el-col>

        <el-col :span="6" style="overflow-y:auto;">
          <div class="grid-content bg-purple-light">
            <!-- <span style="display:inline-block;margin-bottom:6px;">选择所属权限</span> -->
            <el-tree ref="treemechanism" :default-expand-all="true" :data="mechanismList" show-checkbox node-key="id" :default-checked-keys="form.organIds" :props="defaultProps"  @check-change="handleCheckChange" />
            <el-tree
              ref="treeForm"
              :default-expand-all="true"
              :check-strictly="true"
              style="margin-top:20px;"
              :data="schoolJobList"
              show-checkbox
              node-key="id"
              :default-checked-keys="form.schoolJobId"
              :props="defaultProps"
              @check-change="handleClick"
              @node-click="nodeClick"
            />
          </div>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { teacherStaffList, teacherStaffAdd, teacherStaffDel, teacherStaffDetail, mechanismList, teacherStaffInfo, teacherStaffErrorInfo, getGrade, getClasses, getSubject } from '@/api/organizationAndRole'
import waves from '@/directive/waves' // Waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { getToken } from '@/utils/auth'

export default {
  name: 'TeachingStaff',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      isTacher: false, // 是否选择任课老师
      importHeaders: { Authorization: 'Bearer ' + getToken() },
      baseUrl: process.env.VUE_APP_BASE_API,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        keyword: ''
      },
      gradeList: [], // 年纪列表
      form: {
        avatarUrl: '',
        realName: '',
        phone: '',
        schoolId: 0,
        sex: '',
        id: '',
        status: '0',
        roleIds: [],
        organIds: [],
        password: '',
        schoolJobId: '',
        gradeClassSubjectList: [{
          classId: undefined,
          gradeId: undefined,
          subjectId: undefined,
          classList: [],
          subjectList: []
        }]
      },
      query: {
        status: '0',
        roleIds: [],
        organIds: [],
        password: '',
        userId: ''
      },
      // 表单验证
      rules: {
        realName: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入联系电话', trigger: 'blur' },
          { min: 11, max: 11, message: '联系电话长度必须在 11 位', trigger: 'blur' }
        ],
        roleIds: [
          { required: true, message: '请选择角色', trigger: 'change' }
        ],
        sex: [
          { required: true, message: '请选择性别', trigger: 'change' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ]
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
      downloadLoading: false,
      roleList: [], // 角色列表
      mechanismList: [], // 机构列表
      schoolJobList: [], // 职务列表
      defaultProps: {
        children: 'organList',
        label: 'name'
      }
    }
  },
  created() {
    this.getList()
    this.getGradeList()
    this.getmechanismList()
  },
  methods: {
    handleInput(e) {
      e.target.value = (e.target.value.match(/^\d*(\.?\d{0,1})/g)[0]) || null
    },
    downloadModel: function() {
      window.location.href = process.env.VUE_APP_BASE_API + 'excel/教职工模版.xlsx'
    //   window.location.href = 'http://192.168.2.111:9206/console/excel/教职工模版.xlsx'
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
            teacherStaffErrorInfo().then(ret => { // 导出错误信息
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
    handleCheckChange(data, checked, indeterminate) {
        // console.log(JSON.stringify(data), checked, indeterminate)
        if (checked) {
            if (this.form.organIds.indexOf(data.id)===-1) {
                this.form.organIds.push(data.id);
            }
        }else{
            this.form.organIds.splice(this.form.organIds.indexOf(data.id),1);
        }
        // console.log(JSON.stringify(this.form.roleIds))
    },
    handleRePwd(info) {
      this.$confirm('此操作将重置密码, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$API.school.teacherReset({
          params: {
            userId: info.id
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
    handleClick(data, checked, node) {
      if (checked === true) {
        this.form.schoolJobId = [data.id]
        this.$refs.treeForm.setCheckedNodes([data])
      }
    },
    nodeClick(data, checked, node) {
      this.form.schoolJobId = data.id
      this.$refs.treeForm.setCheckedNodes([data])
    },
    handleAvatarSuccess(ret, file) { // 图片上传成功
      this.form.avatarUrl = ret.data.src
    },
    getmechanismList() { // 获取机构列表与角色列表
      mechanismList({}).then(ret => { // 职务
        if (ret.data.result === 'ok') {
          var parent = {
            name: ret.data.object.school.name,
            organList: ret.data.object.schoolOrganResponse.organList
          }
          this.mechanismList = [parent]
          // Just to simulate the time of the request
        } else {
          this.$message({
            message: ret.data.errorMsg,
            type: 'error'
          })
        }
      })
      teacherStaffInfo({}).then(ret => { // 角色列表
        if (ret.data.result === 'ok') {
          this.roleList = ret.data.object
          // Just to simulate the time of the request
        } else {
          this.$message({
            message: ret.data.errorMsg,
            type: 'error'
          })
        }
      })
      // 职务
      this.$API.school.schooljobList().then(Response => {
        this.schoolJobList = [{
          name: Response.data.object.school.name,
          disabled: true,
          organList: Response.data.object.pageInfo.list
        }]
      })
    },

    getList() {
      this.listLoading = true
      teacherStaffList(this.listQuery).then(ret => {
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
    handleModifyStatus(id) { // 删除
      this.$confirm('确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        teacherStaffDel({ id: id }).then((ret) => {
          if (ret.data.result === 'ok') {
            this.listQuery.page = 0
            this.getList()
            this.$message({
              message: '删除成功',
              type: 'success'
            })
          } else {
            this.$message({
              message: ret.data.errorMsg,
              type: 'error'
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
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
        avatarUrl: '',
        realName: '',
        phone: '',
        schoolId: 0,
        sex: '',
        id: '',
        status: '0',
        roleIds: [],
        organIds: [],
        schoolJobId: undefined,
        password: '',
        gradeClassSubjectList: [{
          classId: undefined,
          gradeId: undefined,
          subjectId: undefined,
          classList: [],
          subjectList: []
        }]
      }

      this.query = {
        status: '0',
        roleIds: [],
        organIds: [],
        password: '',
        userId: ''
      }
      if (this.$refs.treemechanism) {
          console.log(1234567890);
        this.$refs.treemechanism.setCheckedKeys([])
      }
      if (this.$refs.treeForm) {
        this.$refs.treeForm.setCheckedKeys([])
      }
    },
    handleCreate() {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.resetTemp()
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    containTeacher: function() {
      const vm = this
      // vm.roleList.forEach(element => {
      //     vm.form.roleIds.forEach(item => {
      //         if (item===element.id&&element.roleCode==='FINALCOURSETEACHER') {
      //             vm.isTacher=true;
      //             return
      //         }else{
      //             vm.isTacher=false;
      //         }
      //     });
      // });
      for (let i = 0; i < vm.roleList.length; i++) {
        const element = vm.roleList[i]
        if (vm.form.roleIds.length === 0) {
          vm.isTacher = false
        } else {
          for (let j = 0; j < vm.form.roleIds.length; j++) {
            const item = vm.form.roleIds[j]
            if (item === element.id && element.roleCode === 'FINALCOURSETEACHER') {
              vm.isTacher = true
              return
            } else {
              vm.isTacher = false
            }
          }
        }
      }
    },
    createData() {
      this.form.organIds.map((item, i) => {
        if (item === undefined) {
          this.form.organIds.splice(i, 1)
        }
      })
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          if (this.form.organIds.length === 0) {
            this.$message({
              message: '请选择机构',
              type: 'error'
            })
            return
          }
          if (this.form.roleIds.length === 0) {
            this.$message({
              message: '请选择角色',
              type: 'error'
            })
            return
          }
          this.form.status = parseInt(this.form.status)
          if (!this.form.schoolJobId) {
            this.$message({
              message: '请选择职务',
              type: 'error'
            })
            return
              
          }else{
              this.form.schoolJobId = this.form.schoolJobId.join(',')
          }
          //   this.query.status = this.form.status
          //   this.query.roleIds = this.form.roleIds.join(',')
          //   this.query.organIds = this.form.organIds.join(',')
          if (!this.isTacher) {
            this.form.gradeClassSubjectList = [{
              classId: undefined,
              gradeId: undefined,
              subjectId: undefined,
              classList: [],
              subjectList: []
            }]
          }
          teacherStaffAdd(this.form, this.query).then(ret => {
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
            //   this.$nextTick(() => {
            //     this.form['roleIds'] = this.query.roleIds.split(',')
            //     this.form['organIds'] = []
            //   })
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
      this.dialogStatus = 'update'
      // 清楚数组中的undefined
      //   this.form.organIds.map((item, i) => {
      //     if (item === undefined) {
      //       this.form.organIds.splice(i, 1)
      //     }
      //   })
          this.dialogFormVisible = true
            this.resetTemp()
      teacherStaffDetail({ id: row.id }).then(ret => {
        // console.log(JSON.stringify(ret))
        if (ret.data.result === 'ok') {
          let roleList = []
          let organList = []
          if (ret.data.object.systemRoleIdList) {
            ret.data.object.systemRoleIdList.split(',').forEach(element => {
              roleList.push(parseInt(element))
            })
          }
          if (ret.data.object.organIdList) {
            ret.data.object.organIdList.split(',').forEach(element => {
              organList.push(parseInt(element))
            })
          }
          if (!ret.data.object.gradeClassSubjects||ret.data.object.gradeClassSubjects.length === 0) {
            ret.data.object.gradeClassSubjects=[{
              classId: undefined,
              className: '',
              gradeId: undefined,
              gradeName: '',
              subjectId: undefined,
              subjectName: '',
              classList: [],
              subjectList: []
            }]
          }else{
            ret.data.object.gradeClassSubjects.forEach((element, index) => {
                element['classList'] = []
                element['subjectList'] = []
            })
          }
          this.query.userId = ret.data.object.id
          this.form = {
            avatarUrl: ret.data.object.avatarUrl,
            realName: ret.data.object.realName,
            phone: ret.data.object.phone,
            id: ret.data.object.id,
            sex: ret.data.object.sex,
            status: ret.data.object.status,
            roleIds: roleList,
            organIds: organList,
            schoolJobId: [ret.data.object.jobId],
            password: '',
            gradeClassSubjectList: ret.data.object.gradeClassSubjects
          }
          this.containTeacher()
          this.form.gradeClassSubjectList.forEach((element, index) => {
            this.$nextTick(() => {
              this.getClassesList(element.gradeId, index)
              this.getSubjectList(element.classId, index)
            })
          })
            console.log(JSON.stringify(this.form))
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
          if (this.form.organIds.length === 0) {
            this.$message({
              message: '请选择机构',
              type: 'error'
            })
            return
          }
          if (this.form.roleIds.length === 0) {
            this.$message({
              message: '请选择角色',
              type: 'error'
            })
            return
          }
          this.form.status = parseInt(this.form.status)
          if (!this.form.schoolJobId) {
            this.$message({
              message: '请选择职务',
              type: 'error'
            })
            return
              
          }else{
              this.form.schoolJobId = this.form.schoolJobId.join(',')
          }
          if (!this.isTacher) {
            this.form.gradeClassSubjectList = [{
              classId: undefined,
              gradeId: undefined,
              subjectId: undefined,
              classList: [],
              subjectList: []
            }]
          }
          //   this.query.status = this.form.status
          //   this.query.roleIds = this.form.roleIds.join(',')
          //   this.query.organIds = this.form.organIds.join(',')
          teacherStaffAdd(this.form, { userId: this.form.id }).then(ret => {
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
            //   this.form['roleIds'] = this.query.roleIds.split(',')
            //   this.form['organIds'] = []
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
    },

    getGradeList: function() {
      getGrade().then(ret => { // 获取年纪列表
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
    getClassesList: function(id, index) { // 获取班级列表
      getClasses({ gradeId: id }).then(ret => {
        // console.log(JSON.stringify(ret))
        if (ret.data.result === 'ok') {
        //   console.log(this.form.gradeClassSubjectList[index].classList)
          this.$nextTick(() => {
            this.form.gradeClassSubjectList[index].classList = ret.data.object
          })
          // Just to simulate the time of the request
        } else {
          this.$message({
            message: ret.data.errorMsg,
            type: 'error'
          })
        }
      })
    },
    getSubjectList: function(id, index) { // 获取科目列表
      getSubject({ classId: id, teacherId: this.form.id }).then(ret => {
        // console.log(JSON.stringify(ret))
        if (ret.data.result === 'ok') {
          this.$nextTick(() => {
            this.form.gradeClassSubjectList[index].subjectList = ret.data.object
          })
          // Just to simulate the time of the request
        } else {
          this.$message({
            message: ret.data.errorMsg,
            type: 'error'
          })
        }
      })
    },
    addSubject: function() { // 添加教学
      this.form.gradeClassSubjectList.push({
        classId: undefined,
        className: '',
        gradeId: undefined,
        gradeName: '',
        subjectId: undefined,
        subjectName: '',
        classList: [],
        subjectList: []
      })
    },
    delSubject: function(index) { // 删除教学
      this.form.gradeClassSubjectList.splice(index, 1)
    }
  }
}
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

.subject-box{
    margin:8px 0;
    overflow: hidden;
}
.w-200{
    width: 200px;
}

.line {
    text-align: center;
    margin: 0 2px;
}
.el-upload-list{
  display: none;
}
</style>
