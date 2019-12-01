<template>
  <div class="app-container">
    <div class="filter-container">
      <span
        style="display: inline-block;
        vertical-align: top;
        padding-top: 10px;"
      >搜索年级：</span>
      <el-input
        v-model="listQuery.keyword"
        placeholder="名称或代码"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />

      <el-date-picker
        v-model="listQuery.joinDateText"
        class="filter-item"
        type="date"
        placeholder="入学年份（2014-9-1)"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
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
        v-if="isShowBtn('添加年级')"
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >添加年级</el-button>
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
      <el-table-column
        label="名称"
        sortable="custom"
        prop="id"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="年级代码" align="center">
        <template slot-scope="scope">
          <span>
            {{ scope.row.gradeCode }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        label="入学年份"
        align="center"
        sortable="custom"
      >
        <template slot-scope="{ row }">
          <span>
            {{ row.joinDate }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        label="年级人数"
        sortable="custom"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.gradeCounts }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="班级数"
        sortable="custom"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.classCounts }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="状态"
        sortable="custom"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.status==0?'启用':'禁用' }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="操作"
        align="center"
        width="230"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row }">
          <el-button
            v-if="isShowBtn('编辑')"
            type="primary"
            size="mini"
            @click="handleUpdate(row)"
          >编辑</el-button>
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
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <el-dialog center :title="dialogStatus==='create'?'添加年级':'编辑年级'" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="form"
        label-position="right"
        label-width="85px"
      >
        <el-form-item label="年级：" prop="name">
          <el-input v-model="form.name" class="w-200" placeholder="请输入年级（如初2015级）" />
        </el-form-item>
        <el-form-item label="年级代码：" prop="gradeCode">
          <el-input v-model="form.gradeCode" class="w-200" disabled />
        </el-form-item>
        <el-form-item label="入学年份" prop="joinDate">
          <el-date-picker
            v-model="form.joinDate"
            style="width:200px;"
            type="date"
            placeholder="选择日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
        <el-form-item label="年级人数：" prop="gradeCounts">
          <el-input v-model="form.gradeCounts" class="w-200" disabled />
        </el-form-item>
        <el-form-item label="班级数：" prop="classCounts">
          <el-input v-model="form.classCounts" class="w-200" disabled />
        </el-form-item>
        <el-form-item label="状态：" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio label="0">启用</el-radio>
            <el-radio label="1">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="dialogStatus === 'create' ? createData() : updateData()"
        >保存</el-button>
        <el-button @click="dialogFormVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { gradeList, gradeAdd, gradeStatus, gradeDetail } from '@/api/organizationAndRole'
import waves from '@/directive/waves' // Waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'Grade',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        keyword: '',
        joinDateText: ''
      },
      form: {
        id: '',
        name: '',
        gradeCode: '',
        joinDate: '',
        gradeCounts: 0,
        classCounts: 0,
        status: '0'
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
      // 表单验证
      rules: {
        name: [{ required: true, message: '请输入年级', trigger: 'blur' }],
        joinDate: [
          { required: true, message: '请输入入学年份', trigger: 'blur' }
        ],
        status: [{ required: true, message: '请选择状态', trigger: 'change' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
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
    getList() {
      this.listLoading = true
      gradeList(this.listQuery).then(ret => {
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
      gradeStatus({
        id: row.id,
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
        id: '',
        name: '',
        gradeCode: '',
        joinDate: '',
        gradeCounts: 0,
        classCounts: 0,
        status: '0'
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.form.status = parseInt(this.form.status)
          gradeAdd(this.form, '').then(ret => {
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
        }
      })
    },
    handleUpdate(row) { // 点击编辑按钮获取详情
      //   this.temp = Object.assign({}, row); // copy obj
      //   this.temp.timestamp = new Date(this.temp.timestamp);
      this.dialogStatus = 'update'
      gradeDetail({ id: row.id }).then(ret => {
        // console.log(JSON.stringify(ret))
        if (ret.data.result === 'ok') {
          this.form.id = ret.data.object.id
          this.form.name = ret.data.object.name
          this.form.gradeCode = ret.data.object.gradeCode
          this.form.joinDate = ret.data.object.joinDate
          this.form.gradeCounts = ret.data.object.gradeCounts
          this.form.classCounts = ret.data.object.classCounts
          this.form.status = ret.data.object.status.toString()
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
          this.form.status = parseInt(this.form.status)
          gradeAdd(this.form, this.form.id).then(ret => {
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
</style>
